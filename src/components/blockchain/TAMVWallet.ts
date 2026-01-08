// TAMV Wallet Client Implementation
import { calculateQuantumSplit, formatMSRDisplay } from './MSRBlockchain';

interface WalletTransaction {
  id: string;
  type: 'send' | 'receive' | 'swap' | 'purchase' | 'reward' | 'gift';
  amount: number;
  currency: 'MSR' | 'TAMV_CREDITS';
  fromUser: string;
  toUser: string;
  timestamp: number;
  status: 'pending' | 'confirmed';
  description: string;
}

interface UserWallet {
  userId: string;
  msrBalance: number;
  tamvCreditsBalance: number;
  totalSpent: number;
  totalEarned: number;
  totalGiftsReceived: number;
  totalGiftsSent: number;
  transactions: WalletTransaction[];
  createdAt: number;
  trustLevel: 'observer' | 'citizen' | 'guardian' | 'sovereign' | 'archon';
}

interface GiftTransaction {
  giftId: string;
  giftName: string;
  quantity: number;
  totalMSR: number;
  fromUser: string;
  toUser: string;
  timestamp: number;
}

// Swap rate: 1 TAMV Credit = 0.25 MSR (4:1 ratio)
const SWAP_RATE = 0.25;

// Create initial wallet data
export const createWalletData = (userId: string): UserWallet => ({
  userId,
  msrBalance: 0,
  tamvCreditsBalance: 0,
  totalSpent: 0,
  totalEarned: 0,
  totalGiftsReceived: 0,
  totalGiftsSent: 0,
  transactions: [],
  createdAt: Date.now(),
  trustLevel: 'observer',
});

// Calculate credits to MSR conversion
export const creditsToMSR = (credits: number): number => {
  return Math.floor(credits * SWAP_RATE * 1e8);
};

// Calculate MSR to credits conversion
export const msrToCredits = (msr: number): number => {
  return Math.floor((msr / 1e8) / SWAP_RATE);
};

// Format wallet display
export const formatWalletBalance = (balance: number): string => {
  return formatMSRDisplay(balance);
};

// Calculate gift transaction with 70/20/10 split
export const calculateGiftTransaction = (
  giftPrice: number,
  quantity: number
): { total: number; creatorShare: number; fenixShare: number; kernelShare: number } => {
  const total = giftPrice * quantity * 1e8;
  const splits = calculateQuantumSplit(total);
  
  return {
    total,
    creatorShare: splits.direct,
    fenixShare: splits.fenix,
    kernelShare: splits.kernel,
  };
};

// Get trust level based on activity
export const calculateTrustLevel = (
  wallet: UserWallet
): 'observer' | 'citizen' | 'guardian' | 'sovereign' | 'archon' => {
  const totalActivity = wallet.totalEarned + wallet.totalSpent;
  const totalGifts = wallet.totalGiftsReceived + wallet.totalGiftsSent;
  
  if (totalActivity >= 1000000 * 1e8 && totalGifts >= 1000) return 'archon';
  if (totalActivity >= 100000 * 1e8 && totalGifts >= 500) return 'sovereign';
  if (totalActivity >= 10000 * 1e8 && totalGifts >= 100) return 'guardian';
  if (totalActivity >= 1000 * 1e8 && totalGifts >= 10) return 'citizen';
  return 'observer';
};

// Format transaction for display
export const formatTransactionDisplay = (tx: WalletTransaction) => {
  const isIncoming = tx.type === 'receive' || tx.type === 'reward' || 
    (tx.type === 'gift' && tx.toUser !== tx.fromUser);
  
  return {
    ...tx,
    displayAmount: `${isIncoming ? '+' : '-'}${formatMSRDisplay(tx.amount)} ${tx.currency}`,
    isIncoming,
    formattedDate: new Date(tx.timestamp).toLocaleDateString('es-MX', {
      day: 'numeric',
      month: 'short',
      hour: '2-digit',
      minute: '2-digit'
    }),
  };
};

export type { UserWallet, WalletTransaction, GiftTransaction };
