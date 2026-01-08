import { motion } from 'framer-motion';
import { ArrowUpRight, ArrowDownLeft, Zap, Gift, RefreshCw } from 'lucide-react';
import { Tables } from '@/integrations/supabase/types';
import { useAuth } from '@/hooks/useAuth';

type Transaction = Tables<'msr_ledger'>;

interface TransactionHistoryProps {
  transactions: Transaction[];
  loading: boolean;
}

export const TransactionHistory = ({ transactions, loading }: TransactionHistoryProps) => {
  const { user } = useAuth();

  const formatMSR = (amount: number) => {
    return new Intl.NumberFormat('es-MX', {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    }).format(amount);
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return new Intl.DateTimeFormat('es-MX', {
      day: '2-digit',
      month: 'short',
      hour: '2-digit',
      minute: '2-digit',
    }).format(date);
  };

  const getTransactionIcon = (tx: Transaction) => {
    if (tx.transaction_type === 'REWARD') return Gift;
    if (tx.transaction_type === 'FENIX') return Zap;
    if (tx.transaction_type === 'KERNEL') return RefreshCw;
    if (tx.to_user_id === user?.id) return ArrowDownLeft;
    return ArrowUpRight;
  };

  const getTransactionColor = (tx: Transaction) => {
    if (tx.transaction_type === 'FENIX') return 'text-fenix';
    if (tx.transaction_type === 'KERNEL') return 'text-kernel';
    if (tx.to_user_id === user?.id) return 'text-primary';
    return 'text-secondary';
  };

  const getTransactionLabel = (tx: Transaction) => {
    const typeLabels: Record<string, string> = {
      DIRECT: tx.to_user_id === user?.id ? 'Recibido' : 'Enviado',
      FENIX: 'Fondo Fénix',
      KERNEL: 'Infraestructura',
      TRANSFER: tx.to_user_id === user?.id ? 'Transferencia recibida' : 'Transferencia enviada',
      REWARD: 'Recompensa',
    };
    return typeLabels[tx.transaction_type] || tx.transaction_type;
  };

  if (loading) {
    return (
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        className="rounded-2xl bg-card/50 border border-border/50 p-6"
      >
        <h3 className="font-orbitron text-lg font-semibold text-foreground mb-4">
          Historial de Transacciones
        </h3>
        <div className="space-y-3">
          {[1, 2, 3, 4, 5].map((i) => (
            <div key={i} className="flex items-center gap-4 p-3 rounded-xl bg-muted/20 animate-pulse">
              <div className="w-10 h-10 rounded-lg bg-muted/50" />
              <div className="flex-1">
                <div className="h-4 w-32 bg-muted/50 rounded mb-2" />
                <div className="h-3 w-24 bg-muted/50 rounded" />
              </div>
              <div className="h-5 w-20 bg-muted/50 rounded" />
            </div>
          ))}
        </div>
      </motion.div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.2 }}
      className="rounded-2xl bg-card/50 border border-border/50 p-6"
    >
      <h3 className="font-orbitron text-lg font-semibold text-foreground mb-4">
        Historial de Transacciones
      </h3>

      {transactions.length === 0 ? (
        <div className="text-center py-12">
          <div className="w-16 h-16 rounded-full bg-muted/20 flex items-center justify-center mx-auto mb-4">
            <RefreshCw className="w-8 h-8 text-muted-foreground" />
          </div>
          <p className="text-muted-foreground font-inter">
            No hay transacciones aún
          </p>
          <p className="text-muted-foreground/70 font-inter text-sm mt-1">
            Las transacciones MSR aparecerán aquí
          </p>
        </div>
      ) : (
        <div className="space-y-2 max-h-[400px] overflow-y-auto pr-2">
          {transactions.map((tx, index) => {
            const Icon = getTransactionIcon(tx);
            const colorClass = getTransactionColor(tx);
            const isIncoming = tx.to_user_id === user?.id;
            const amount = Number(tx.amount);

            return (
              <motion.div
                key={tx.id}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.05 }}
                className="flex items-center gap-4 p-3 rounded-xl bg-muted/10 hover:bg-muted/20 transition-colors border border-transparent hover:border-border/30"
              >
                <div className={`w-10 h-10 rounded-lg ${colorClass.replace('text-', 'bg-')}/20 flex items-center justify-center`}>
                  <Icon className={`w-5 h-5 ${colorClass}`} />
                </div>
                
                <div className="flex-1 min-w-0">
                  <p className="font-inter text-sm font-medium text-foreground truncate">
                    {getTransactionLabel(tx)}
                  </p>
                  <p className="text-muted-foreground text-xs font-inter">
                    {formatDate(tx.created_at)}
                  </p>
                </div>

                <div className="text-right">
                  <p className={`font-orbitron font-semibold ${isIncoming ? 'text-primary' : 'text-secondary'}`}>
                    {isIncoming ? '+' : '-'}{formatMSR(amount)} MSR
                  </p>
                  {tx.description && (
                    <p className="text-muted-foreground text-xs font-inter truncate max-w-[120px]">
                      {tx.description}
                    </p>
                  )}
                </div>
              </motion.div>
            );
          })}
        </div>
      )}
    </motion.div>
  );
};
