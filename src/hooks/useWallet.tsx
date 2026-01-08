import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/hooks/useAuth';
import { Tables } from '@/integrations/supabase/types';

type Transaction = Tables<'msr_ledger'>;

interface WalletData {
  balance: number;
  transactions: Transaction[];
  splits: {
    direct: number;
    fenix: number;
    kernel: number;
  };
  loading: boolean;
  error: string | null;
}

export const useWallet = () => {
  const { user } = useAuth();
  const [walletData, setWalletData] = useState<WalletData>({
    balance: 0,
    transactions: [],
    splits: { direct: 0, fenix: 0, kernel: 0 },
    loading: true,
    error: null,
  });

  const fetchWalletData = async () => {
    if (!user) {
      setWalletData(prev => ({ ...prev, loading: false }));
      return;
    }

    try {
      // Fetch all transactions where user is involved
      const { data: transactions, error } = await supabase
        .from('msr_ledger')
        .select('*')
        .or(`from_user_id.eq.${user.id},to_user_id.eq.${user.id}`)
        .order('created_at', { ascending: false })
        .limit(50);

      if (error) throw error;

      // Calculate balance
      let balance = 0;
      let directTotal = 0;
      let fenixTotal = 0;
      let kernelTotal = 0;

      (transactions || []).forEach((tx) => {
        const amount = Number(tx.amount);
        
        if (tx.to_user_id === user.id) {
          balance += amount;
          
          if (tx.transaction_type === 'DIRECT') directTotal += amount;
          if (tx.transaction_type === 'FENIX') fenixTotal += amount;
          if (tx.transaction_type === 'KERNEL') kernelTotal += amount;
          if (tx.transaction_type === 'REWARD') directTotal += amount;
        }
        
        if (tx.from_user_id === user.id) {
          balance -= amount;
        }
      });

      setWalletData({
        balance,
        transactions: transactions || [],
        splits: {
          direct: directTotal,
          fenix: fenixTotal,
          kernel: kernelTotal,
        },
        loading: false,
        error: null,
      });
    } catch (err) {
      setWalletData(prev => ({
        ...prev,
        loading: false,
        error: err instanceof Error ? err.message : 'Error fetching wallet data',
      }));
    }
  };

  useEffect(() => {
    fetchWalletData();

    // Subscribe to realtime changes
    if (user) {
      const channel = supabase
        .channel('msr_ledger_changes')
        .on(
          'postgres_changes',
          {
            event: '*',
            schema: 'public',
            table: 'msr_ledger',
          },
          () => {
            fetchWalletData();
          }
        )
        .subscribe();

      return () => {
        supabase.removeChannel(channel);
      };
    }
  }, [user]);

  return { ...walletData, refetch: fetchWalletData };
};
