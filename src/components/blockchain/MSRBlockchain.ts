// MSR Blockchain Client-Side Implementation
// Note: This is a client-side representation. Real blockchain logic runs on Supabase/backend

interface Transaction {
  id: string;
  fromUserId: string;
  toUserId: string;
  amount: number;
  type: 'DIRECT' | 'FENIX' | 'KERNEL' | 'TRANSFER' | 'REWARD';
  description: string;
  timestamp: number;
  hash: string;
  prevHash: string;
  metadata?: Record<string, unknown>;
}

interface Block {
  index: number;
  timestamp: number;
  transactions: Transaction[];
  prevHash: string;
  hash: string;
  nonce: number;
  miner: string;
  difficulty: number;
}

interface MSRLedgerEntry {
  id: string;
  fromUserId: string;
  toUserId: string;
  amount: number;
  txType: Transaction['type'];
  description: string;
  hash: string;
  prevHash: string;
  metadata: Record<string, unknown>;
  createdAt: number;
  blockIndex?: number;
  status: 'pending' | 'confirmed' | 'finalized';
}

interface BlockchainStats {
  chainLength: number;
  totalTransactions: number;
  pendingTransactions: number;
  totalSupply: string;
  chainValid: boolean;
  difficulty: number;
  lastBlockTime: number;
}

// Genesis distribution constants (70/20/10 split)
const TOTAL_SUPPLY = 100_000_000; // 100M MSR
const CREATOR_POOL_PERCENTAGE = 0.70;
const INNOVATION_FUND_PERCENTAGE = 0.20;
const COMMUNITY_RESERVE_PERCENTAGE = 0.10;

// Format amount with 8 decimal precision
export const formatMSRAmount = (amount: number): string => {
  return (amount / 1e8).toFixed(8);
};

// Format amount for display
export const formatMSRDisplay = (amount: number): string => {
  const value = amount / 1e8;
  if (value >= 1000000) return `${(value / 1000000).toFixed(2)}M`;
  if (value >= 1000) return `${(value / 1000).toFixed(2)}K`;
  return value.toFixed(2);
};

// Calculate SHA-256 hash (browser-compatible)
export const calculateHash = async (data: string): Promise<string> => {
  const encoder = new TextEncoder();
  const dataBuffer = encoder.encode(data);
  const hashBuffer = await crypto.subtle.digest('SHA-256', dataBuffer);
  const hashArray = Array.from(new Uint8Array(hashBuffer));
  return hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
};

// Generate transaction hash with chaining
export const generateTransactionHash = async (
  tx: Omit<Transaction, 'hash'>,
  prevHash: string
): Promise<string> => {
  const txData = JSON.stringify({
    id: tx.id,
    fromUserId: tx.fromUserId,
    toUserId: tx.toUserId,
    amount: tx.amount,
    type: tx.type,
    description: tx.description,
    timestamp: tx.timestamp,
    metadata: tx.metadata,
    prevHash: prevHash,
  });
  
  return calculateHash(txData);
};

// Get genesis distribution
export const getGenesisDistribution = () => ({
  creatorPool: Math.floor(TOTAL_SUPPLY * CREATOR_POOL_PERCENTAGE * 1e8),
  innovationFund: Math.floor(TOTAL_SUPPLY * INNOVATION_FUND_PERCENTAGE * 1e8),
  communityReserve: Math.floor(TOTAL_SUPPLY * COMMUNITY_RESERVE_PERCENTAGE * 1e8),
  totalSupply: TOTAL_SUPPLY * 1e8,
});

// Calculate 70/20/10 split for a transaction
export const calculateQuantumSplit = (amount: number) => {
  const direct = Math.floor(amount * 0.70); // 70% to creator
  const fenix = Math.floor(amount * 0.20);  // 20% to Fenix fund
  const kernel = Math.floor(amount * 0.10); // 10% to Kernel infrastructure
  
  return { direct, fenix, kernel };
};

// Validate transaction
export const validateTransaction = (
  fromBalance: number,
  amount: number
): { valid: boolean; error?: string } => {
  if (amount <= 0) {
    return { valid: false, error: 'Amount must be positive' };
  }
  if (fromBalance < amount) {
    return { 
      valid: false, 
      error: `Insufficient balance. Have: ${formatMSRDisplay(fromBalance)}, Need: ${formatMSRDisplay(amount)}` 
    };
  }
  return { valid: true };
};

// Export types
export type { Transaction, Block, MSRLedgerEntry, BlockchainStats };
