// MSR Blockchain Service — TAMV MD-X4™
// Sistema de registro económico inmutable con regla 70/20/10

import { supabase } from '@/integrations/supabase/client';
import { logMSRTransaction } from './bookpi-client';

// ═══════════════════════════════════════════════════════════════
// TYPES
// ═══════════════════════════════════════════════════════════════

export type MSRTransactionType = 'DIRECT' | 'FENIX' | 'KERNEL' | 'TRANSFER' | 'REWARD';

export interface MSRTransaction {
  id: string;
  fromUserId: string | null;
  toUserId: string | null;
  amount: number;
  transactionType: MSRTransactionType;
  description: string;
  hash: string;
  prevHash: string;
  metadata?: Record<string, unknown>;
  createdAt: string;
}

export interface QuantumSplit {
  direct: number;   // 70% to creator
  fenix: number;    // 20% to resilience fund
  kernel: number;   // 10% to infrastructure
  total: number;
}

export interface MSRBalance {
  userId: string;
  balance: number;
  totalEarned: number;
  totalSpent: number;
  fenixContributions: number;
  kernelContributions: number;
}

// ═══════════════════════════════════════════════════════════════
// CONSTANTS
// ═══════════════════════════════════════════════════════════════

// Total supply: 100 million MSR with 8 decimal precision
export const MSR_TOTAL_SUPPLY = 100_000_000 * 1e8;
export const MSR_DECIMALS = 8;

// Genesis distribution (70/20/10)
export const GENESIS_CREATOR_POOL = Math.floor(MSR_TOTAL_SUPPLY * 0.70);
export const GENESIS_INNOVATION_FUND = Math.floor(MSR_TOTAL_SUPPLY * 0.20);
export const GENESIS_COMMUNITY_RESERVE = Math.floor(MSR_TOTAL_SUPPLY * 0.10);

// System wallet IDs
export const FENIX_POOL_ID = 'FENIX_RESILIENCE_FUND';
export const KERNEL_POOL_ID = 'KERNEL_INFRASTRUCTURE';
export const SYSTEM_RESERVE_ID = 'SYSTEM_RESERVE';

// ═══════════════════════════════════════════════════════════════
// UTILITY FUNCTIONS
// ═══════════════════════════════════════════════════════════════

/**
 * Format MSR amount for display (8 decimal precision)
 */
export function formatMSR(amount: number): string {
  return (amount / 1e8).toFixed(8);
}

/**
 * Format MSR amount for human-readable display
 */
export function formatMSRDisplay(amount: number): string {
  const value = amount / 1e8;
  if (value >= 1_000_000) return `${(value / 1_000_000).toFixed(2)}M`;
  if (value >= 1_000) return `${(value / 1_000).toFixed(2)}K`;
  if (value >= 1) return value.toFixed(2);
  return value.toFixed(4);
}

/**
 * Parse MSR amount from display string
 */
export function parseMSR(display: string): number {
  const value = parseFloat(display);
  if (isNaN(value)) return 0;
  return Math.floor(value * 1e8);
}

/**
 * Calculate SHA-256 hash (browser-compatible)
 */
async function sha256(message: string): Promise<string> {
  const encoder = new TextEncoder();
  const data = encoder.encode(message);
  const hashBuffer = await crypto.subtle.digest('SHA-256', data);
  const hashArray = Array.from(new Uint8Array(hashBuffer));
  return hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
}

// ═══════════════════════════════════════════════════════════════
// QUANTUM SPLIT (70/20/10)
// ═══════════════════════════════════════════════════════════════

/**
 * Calculate the 70/20/10 quantum split for a transaction
 * @param totalAmount - Total amount in smallest unit (with 8 decimals)
 * @returns QuantumSplit object with distribution
 */
export function calculateQuantumSplit(totalAmount: number): QuantumSplit {
  const direct = Math.floor(totalAmount * 0.70);  // 70% to creator
  const fenix = Math.floor(totalAmount * 0.20);   // 20% to Fenix fund
  const kernel = totalAmount - direct - fenix;    // 10% to Kernel (remainder to avoid rounding issues)

  return { direct, fenix, kernel, total: totalAmount };
}

// ═══════════════════════════════════════════════════════════════
// BLOCKCHAIN OPERATIONS
// ═══════════════════════════════════════════════════════════════

/**
 * Get the latest hash from the MSR ledger
 */
async function getLatestHash(): Promise<string> {
  const { data, error } = await supabase
    .from('msr_ledger')
    .select('hash')
    .order('created_at', { ascending: false })
    .limit(1)
    .single();

  if (error || !data) {
    return 'GENESIS_MSR_TAMV_MDX4_2026';
  }
  return data.hash;
}

/**
 * Generate transaction hash with chain linking
 */
async function generateTransactionHash(
  transaction: Omit<MSRTransaction, 'id' | 'hash' | 'createdAt'>
): Promise<string> {
  const payload = JSON.stringify({
    fromUserId: transaction.fromUserId,
    toUserId: transaction.toUserId,
    amount: transaction.amount,
    transactionType: transaction.transactionType,
    description: transaction.description,
    prevHash: transaction.prevHash,
    timestamp: Date.now(),
    nonce: crypto.getRandomValues(new Uint32Array(1))[0],
  });

  return sha256(payload);
}

/**
 * Execute an MSR transfer with 70/20/10 split
 */
export async function executeTransfer(
  fromUserId: string,
  toUserId: string,
  amount: number,
  description: string,
  metadata?: Record<string, unknown>
): Promise<{ success: boolean; transactions: MSRTransaction[]; error?: string }> {
  try {
    // Validate amount
    if (amount <= 0) {
      return { success: false, transactions: [], error: 'Amount must be positive' };
    }

    // Calculate quantum split
    const split = calculateQuantumSplit(amount);
    const prevHash = await getLatestHash();
    const transactions: MSRTransaction[] = [];
    let currentPrevHash = prevHash;

    // Transaction 1: Direct payment to creator (70%)
    const directTx = {
      fromUserId,
      toUserId,
      amount: split.direct,
      transactionType: 'DIRECT' as MSRTransactionType,
      description: `${description} (Direct 70%)`,
      prevHash: currentPrevHash,
      metadata: { ...metadata, splitType: 'direct', percentage: 70 },
    };
    const directHash = await generateTransactionHash(directTx);
    
    const { data: direct, error: directError } = await supabase
      .from('msr_ledger')
      .insert([{
        from_user_id: fromUserId,
        to_user_id: toUserId,
        amount: split.direct,
        transaction_type: 'DIRECT',
        description: directTx.description,
        hash: directHash,
        prev_hash: currentPrevHash,
        metadata: directTx.metadata,
      }])
      .select()
      .single();

    if (directError) throw directError;
    
    transactions.push({
      id: direct.id,
      fromUserId,
      toUserId,
      amount: split.direct,
      transactionType: 'DIRECT',
      description: directTx.description,
      hash: directHash,
      prevHash: currentPrevHash,
      metadata: directTx.metadata,
      createdAt: direct.created_at,
    });
    currentPrevHash = directHash;

    // Transaction 2: Fenix contribution (20%)
    const fenixTx = {
      fromUserId,
      toUserId: FENIX_POOL_ID,
      amount: split.fenix,
      transactionType: 'FENIX' as MSRTransactionType,
      description: `${description} (Fenix 20%)`,
      prevHash: currentPrevHash,
      metadata: { ...metadata, splitType: 'fenix', percentage: 20 },
    };
    const fenixHash = await generateTransactionHash(fenixTx);
    
    const { data: fenix, error: fenixError } = await supabase
      .from('msr_ledger')
      .insert([{
        from_user_id: fromUserId,
        to_user_id: null,
        amount: split.fenix,
        transaction_type: 'FENIX',
        description: fenixTx.description,
        hash: fenixHash,
        prev_hash: currentPrevHash,
        metadata: { ...fenixTx.metadata, systemPool: FENIX_POOL_ID },
      }])
      .select()
      .single();

    if (fenixError) throw fenixError;
    
    transactions.push({
      id: fenix.id,
      fromUserId,
      toUserId: FENIX_POOL_ID,
      amount: split.fenix,
      transactionType: 'FENIX',
      description: fenixTx.description,
      hash: fenixHash,
      prevHash: currentPrevHash,
      metadata: fenixTx.metadata,
      createdAt: fenix.created_at,
    });
    currentPrevHash = fenixHash;

    // Transaction 3: Kernel contribution (10%)
    const kernelTx = {
      fromUserId,
      toUserId: KERNEL_POOL_ID,
      amount: split.kernel,
      transactionType: 'KERNEL' as MSRTransactionType,
      description: `${description} (Kernel 10%)`,
      prevHash: currentPrevHash,
      metadata: { ...metadata, splitType: 'kernel', percentage: 10 },
    };
    const kernelHash = await generateTransactionHash(kernelTx);
    
    const { data: kernel, error: kernelError } = await supabase
      .from('msr_ledger')
      .insert([{
        from_user_id: fromUserId,
        to_user_id: null,
        amount: split.kernel,
        transaction_type: 'KERNEL',
        description: kernelTx.description,
        hash: kernelHash,
        prev_hash: currentPrevHash,
        metadata: { ...kernelTx.metadata, systemPool: KERNEL_POOL_ID },
      }])
      .select()
      .single();

    if (kernelError) throw kernelError;
    
    transactions.push({
      id: kernel.id,
      fromUserId,
      toUserId: KERNEL_POOL_ID,
      amount: split.kernel,
      transactionType: 'KERNEL',
      description: kernelTx.description,
      hash: kernelHash,
      prevHash: currentPrevHash,
      metadata: kernelTx.metadata,
      createdAt: kernel.created_at,
    });

    // Log to BookPI for audit trail
    await logMSRTransaction(
      fromUserId,
      toUserId,
      amount,
      'QUANTUM_SPLIT_TRANSFER',
      {
        split,
        transactionIds: transactions.map(t => t.id),
        hashes: transactions.map(t => t.hash),
      }
    );

    return { success: true, transactions };
  } catch (error) {
    console.error('MSR Transfer Error:', error);
    return { 
      success: false, 
      transactions: [], 
      error: error instanceof Error ? error.message : 'Unknown error' 
    };
  }
}

/**
 * Get user's MSR balance (calculated from ledger)
 */
export async function getUserBalance(userId: string): Promise<MSRBalance> {
  // Get all transactions involving this user
  const { data: incoming } = await supabase
    .from('msr_ledger')
    .select('amount, transaction_type')
    .eq('to_user_id', userId);

  const { data: outgoing } = await supabase
    .from('msr_ledger')
    .select('amount, transaction_type')
    .eq('from_user_id', userId);

  const totalEarned = (incoming || []).reduce((sum, tx) => sum + tx.amount, 0);
  const totalSpent = (outgoing || []).reduce((sum, tx) => sum + tx.amount, 0);
  
  const fenixContributions = (outgoing || [])
    .filter(tx => tx.transaction_type === 'FENIX')
    .reduce((sum, tx) => sum + tx.amount, 0);
  
  const kernelContributions = (outgoing || [])
    .filter(tx => tx.transaction_type === 'KERNEL')
    .reduce((sum, tx) => sum + tx.amount, 0);

  return {
    userId,
    balance: totalEarned - totalSpent,
    totalEarned,
    totalSpent,
    fenixContributions,
    kernelContributions,
  };
}

/**
 * Get transaction history for a user
 */
export async function getTransactionHistory(
  userId: string,
  limit = 50
): Promise<MSRTransaction[]> {
  const { data, error } = await supabase
    .from('msr_ledger')
    .select('*')
    .or(`from_user_id.eq.${userId},to_user_id.eq.${userId}`)
    .order('created_at', { ascending: false })
    .limit(limit);

  if (error || !data) return [];

  return data.map(tx => ({
    id: tx.id,
    fromUserId: tx.from_user_id,
    toUserId: tx.to_user_id,
    amount: tx.amount,
    transactionType: tx.transaction_type as MSRTransactionType,
    description: tx.description || '',
    hash: tx.hash,
    prevHash: tx.prev_hash || '',
    metadata: tx.metadata as Record<string, unknown>,
    createdAt: tx.created_at,
  }));
}

/**
 * Verify MSR chain integrity
 */
export async function verifyMSRChain(): Promise<{
  valid: boolean;
  totalTransactions: number;
  brokenAt?: string;
}> {
  const { data: transactions, error } = await supabase
    .from('msr_ledger')
    .select('id, hash, prev_hash')
    .order('created_at', { ascending: true });

  if (error || !transactions) {
    return { valid: false, totalTransactions: 0 };
  }

  for (let i = 1; i < transactions.length; i++) {
    if (transactions[i].prev_hash !== transactions[i - 1].hash) {
      return { 
        valid: false, 
        totalTransactions: transactions.length,
        brokenAt: transactions[i].id 
      };
    }
  }

  return { valid: true, totalTransactions: transactions.length };
}

// ═══════════════════════════════════════════════════════════════
// HOOK FOR REACT COMPONENTS
// ═══════════════════════════════════════════════════════════════

export function useMSRBlockchain() {
  return {
    executeTransfer,
    getUserBalance,
    getTransactionHistory,
    verifyMSRChain,
    calculateQuantumSplit,
    formatMSR,
    formatMSRDisplay,
    parseMSR,
  };
}

export default {
  executeTransfer,
  getUserBalance,
  getTransactionHistory,
  verifyMSRChain,
  calculateQuantumSplit,
  formatMSR,
  formatMSRDisplay,
  parseMSR,
  MSR_TOTAL_SUPPLY,
  MSR_DECIMALS,
  FENIX_POOL_ID,
  KERNEL_POOL_ID,
};
