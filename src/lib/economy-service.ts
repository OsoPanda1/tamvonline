// ═══════════════════════════════════════════════════════════════
// TAMV MD-X4™ — Servicio de Economía Interna
// Sistema de valor no soberano con trazabilidad total
// ═══════════════════════════════════════════════════════════════

import { supabase } from '@/integrations/supabase/client';
import bookpiClient from './bookpi-client';

// ═══════════════════════════════════════════════════════════════
// TIPOS
// ═══════════════════════════════════════════════════════════════

export type MembershipTier = 'free' | 'creator' | 'guardian' | 'institutional';

export type ContributionType = 
  | 'content_creation'
  | 'moderation'
  | 'guardian_duty'
  | 'research'
  | 'infra_support'
  | 'education'
  | 'community_support'
  | 'protocol_participation';

export type LedgerUnit = 'usage_credit' | 'contribution_point' | 'msr_internal' | 'governance_token';

export type LedgerOperation = 'mint' | 'burn' | 'transfer' | 'reward' | 'consume' | 'refund';

export interface MembershipFeatures {
  tier: MembershipTier;
  monthlyUsageCredits: number;
  storageQuotaMb: number;
  streamingMinutesMonthly: number;
  maxDreamspaces: number;
  canCreateChannels: boolean;
  canStreamHd: boolean;
  canModerate: boolean;
  canAccessGuardianTools: boolean;
  canAccessInstitutionalApis: boolean;
  mediaUploadLimitMb: number;
  videoDurationMaxSeconds: number;
}

export interface UserMembership {
  id: string;
  userId: string;
  tier: MembershipTier;
  startedAt: string;
  expiresAt: string | null;
  autoRenew: boolean;
  usageCreditsRemaining: number;
  storageQuotaMb: number;
  canCreateChannels: boolean;
  canModerate: boolean;
}

export interface ContributionRecord {
  id: string;
  userId: string;
  contributionType: ContributionType;
  weight: number;
  description: string | null;
  createdAt: string;
}

export interface EconomyPool {
  id: string;
  displayName: string;
  description: string;
  balanceUsageCredits: number;
  balanceContributionPoints: number;
  balanceMsrInternal: number;
}

export interface LedgerEntry {
  fromAccount: string;
  toAccount: string;
  amount: number;
  unit: LedgerUnit;
  operation: LedgerOperation;
  reason: string;
  metadata?: Record<string, unknown>;
}

// ═══════════════════════════════════════════════════════════════
// CONSTANTES DE MEMBRESÍA
// ═══════════════════════════════════════════════════════════════

export const MEMBERSHIP_FEATURES: Record<MembershipTier, MembershipFeatures> = {
  free: {
    tier: 'free',
    monthlyUsageCredits: 100,
    storageQuotaMb: 500,
    streamingMinutesMonthly: 60,
    maxDreamspaces: 1,
    canCreateChannels: false,
    canStreamHd: false,
    canModerate: false,
    canAccessGuardianTools: false,
    canAccessInstitutionalApis: false,
    mediaUploadLimitMb: 50,
    videoDurationMaxSeconds: 60,
  },
  creator: {
    tier: 'creator',
    monthlyUsageCredits: 1000,
    storageQuotaMb: 10000,
    streamingMinutesMonthly: 600,
    maxDreamspaces: 10,
    canCreateChannels: true,
    canStreamHd: true,
    canModerate: false,
    canAccessGuardianTools: false,
    canAccessInstitutionalApis: false,
    mediaUploadLimitMb: 500,
    videoDurationMaxSeconds: 600,
  },
  guardian: {
    tier: 'guardian',
    monthlyUsageCredits: 5000,
    storageQuotaMb: 50000,
    streamingMinutesMonthly: 2400,
    maxDreamspaces: 50,
    canCreateChannels: true,
    canStreamHd: true,
    canModerate: true,
    canAccessGuardianTools: true,
    canAccessInstitutionalApis: false,
    mediaUploadLimitMb: 2000,
    videoDurationMaxSeconds: 3600,
  },
  institutional: {
    tier: 'institutional',
    monthlyUsageCredits: 50000,
    storageQuotaMb: 500000,
    streamingMinutesMonthly: 99999,
    maxDreamspaces: 999,
    canCreateChannels: true,
    canStreamHd: true,
    canModerate: true,
    canAccessGuardianTools: true,
    canAccessInstitutionalApis: true,
    mediaUploadLimitMb: 10000,
    videoDurationMaxSeconds: 99999,
  },
};

// ═══════════════════════════════════════════════════════════════
// QUANTUM SPLIT — Regla 70/20/10
// ═══════════════════════════════════════════════════════════════

export interface QuantumSplit {
  direct: number;      // 70% al creador
  fenix: number;       // 20% al Fondo Fénix
  kernel: number;      // 10% al Kernel de infraestructura
  original: number;
}

export function calculateQuantumSplit(amount: number): QuantumSplit {
  const direct = Math.floor(amount * 0.70);
  const fenix = Math.floor(amount * 0.20);
  const kernel = amount - direct - fenix; // Remainder to avoid rounding errors
  
  return { direct, fenix, kernel, original: amount };
}

// ═══════════════════════════════════════════════════════════════
// SERVICIOS DE MEMBRESÍA
// ═══════════════════════════════════════════════════════════════

export async function getUserMembership(userId: string): Promise<UserMembership | null> {
  const { data, error } = await supabase
    .from('user_memberships')
    .select('*')
    .eq('user_id', userId)
    .single();

  if (error || !data) return null;

  return {
    id: data.id,
    userId: data.user_id,
    tier: data.tier as MembershipTier,
    startedAt: data.started_at,
    expiresAt: data.expires_at,
    autoRenew: data.auto_renew,
    usageCreditsRemaining: data.usage_credits_remaining,
    storageQuotaMb: data.storage_quota_mb,
    canCreateChannels: data.can_create_channels,
    canModerate: data.can_moderate,
  };
}

export async function getMembershipFeatures(tier: MembershipTier): Promise<MembershipFeatures> {
  return MEMBERSHIP_FEATURES[tier];
}

export async function checkMembershipEligibility(
  userId: string, 
  targetTier: MembershipTier
): Promise<{ eligible: boolean; scoreRequired: number; currentScore: number; message: string }> {
  const { data, error } = await supabase
    .rpc('check_membership_eligibility', { p_user_id: userId, p_tier: targetTier });

  if (error || !data) {
    return { eligible: false, scoreRequired: 0, currentScore: 0, message: 'Error verificando elegibilidad' };
  }

  // Parse JSON response from RPC
  const result = typeof data === 'string' ? JSON.parse(data) : data;

  return {
    eligible: result.eligible ?? false,
    scoreRequired: result.score_required ?? 0,
    currentScore: result.current_score ?? 0,
    message: result.requires_verification 
      ? 'Requiere verificación por Guardián'
      : result.requires_legal_agreement 
        ? 'Requiere acuerdo legal institucional'
        : 'Elegible',
  };
}

// ═══════════════════════════════════════════════════════════════
// SERVICIOS DE CONTRIBUCIÓN
// ═══════════════════════════════════════════════════════════════

export async function recordContribution(
  userId: string,
  contributionType: ContributionType,
  weight: number,
  description?: string
): Promise<{ success: boolean; contributionId?: string; error?: string }> {
  try {
    const { data, error } = await supabase
      .from('contribution_accounts')
      .insert([{
        user_id: userId,
        contribution_type: contributionType,
        weight: Math.min(100, Math.max(1, weight)),
        description,
      }])
      .select('id')
      .single();

    if (error) throw error;

    // Log to BookPI for traceability
    await bookpiClient.log({
      event_type: 'CONTRIBUTION',
      event_action: 'record',
      actor_id: userId,
      subject_type: 'contribution',
      subject_id: data.id,
      details: { contributionType, weight },
      priority: weight >= 50 ? 'high' : 'normal',
    });

    return { success: true, contributionId: data.id };
  } catch (err) {
    return { success: false, error: err instanceof Error ? err.message : 'Error desconocido' };
  }
}

export async function getContributionScore(userId: string): Promise<number> {
  const { data, error } = await supabase
    .rpc('calculate_contribution_score', { p_user_id: userId });

  return error ? 0 : (data || 0);
}

export async function getUserContributions(userId: string): Promise<ContributionRecord[]> {
  const { data, error } = await supabase
    .from('contribution_accounts')
    .select('*')
    .eq('user_id', userId)
    .order('created_at', { ascending: false });

  if (error || !data) return [];

  return data.map(c => ({
    id: c.id,
    userId: c.user_id,
    contributionType: c.contribution_type as ContributionType,
    weight: c.weight,
    description: c.description,
    createdAt: c.created_at,
  }));
}

// ═══════════════════════════════════════════════════════════════
// SERVICIOS DE CRÉDITOS DE USO
// ═══════════════════════════════════════════════════════════════

export async function mintUsageCredits(
  userId: string,
  amount: number,
  reason: string
): Promise<{ success: boolean; newBalance?: number; error?: string }> {
  try {
    // Insert ledger entry
    await supabase
      .from('internal_ledger')
      .insert([{
        from_account: 'system',
        to_account: `user:${userId}`,
        amount,
        unit: 'usage_credit',
        operation: 'mint',
        reason,
      }]);

    // Update user's balance
    const { data: membership } = await supabase
      .from('user_memberships')
      .select('usage_credits_remaining')
      .eq('user_id', userId)
      .single();

    const newBalance = (membership?.usage_credits_remaining || 0) + amount;

    await supabase
      .from('user_memberships')
      .update({ usage_credits_remaining: newBalance })
      .eq('user_id', userId);

    return { success: true, newBalance };
  } catch (err) {
    return { success: false, error: err instanceof Error ? err.message : 'Error' };
  }
}

export async function burnUsageCredits(
  userId: string,
  amount: number,
  reason: string
): Promise<{ success: boolean; newBalance?: number; error?: string }> {
  try {
    // Check current balance
    const { data: membership } = await supabase
      .from('user_memberships')
      .select('usage_credits_remaining')
      .eq('user_id', userId)
      .single();

    const currentBalance = membership?.usage_credits_remaining || 0;
    if (currentBalance < amount) {
      return { success: false, error: 'Créditos insuficientes' };
    }

    // Insert ledger entry
    await supabase
      .from('internal_ledger')
      .insert([{
        from_account: `user:${userId}`,
        to_account: 'system',
        amount,
        unit: 'usage_credit',
        operation: 'burn',
        reason,
      }]);

    const newBalance = currentBalance - amount;

    await supabase
      .from('user_memberships')
      .update({ usage_credits_remaining: newBalance })
      .eq('user_id', userId);

    return { success: true, newBalance };
  } catch (err) {
    return { success: false, error: err instanceof Error ? err.message : 'Error' };
  }
}

// ═══════════════════════════════════════════════════════════════
// SERVICIOS DE POOLS
// ═══════════════════════════════════════════════════════════════

export async function getEconomyPools(): Promise<EconomyPool[]> {
  const { data, error } = await supabase
    .from('economy_pools')
    .select('*');

  if (error || !data) return [];

  return data.map(p => ({
    id: p.id,
    displayName: p.display_name,
    description: p.description || '',
    balanceUsageCredits: Number(p.balance_usage_credits) || 0,
    balanceContributionPoints: Number(p.balance_contribution_points) || 0,
    balanceMsrInternal: Number(p.balance_msr_internal) || 0,
  }));
}

export async function distributeToPool(
  poolId: string,
  amount: number,
  unit: LedgerUnit,
  reason: string
): Promise<{ success: boolean }> {
  try {
    await supabase
      .from('internal_ledger')
      .insert([{
        from_account: 'system',
        to_account: `pool:${poolId}`,
        amount,
        unit,
        operation: 'transfer',
        reason,
      }]);

    // Update pool balance based on unit
    const balanceColumn = unit === 'usage_credit' 
      ? 'balance_usage_credits'
      : unit === 'contribution_point'
        ? 'balance_contribution_points'
        : 'balance_msr_internal';

    const { data: pool } = await supabase
      .from('economy_pools')
      .select(balanceColumn)
      .eq('id', poolId)
      .single();

    const currentBalance = Number((pool as any)?.[balanceColumn]) || 0;

    await supabase
      .from('economy_pools')
      .update({ 
        [balanceColumn]: currentBalance + amount,
        last_distribution_at: new Date().toISOString(),
      })
      .eq('id', poolId);

    return { success: true };
  } catch {
    return { success: false };
  }
}

// ═══════════════════════════════════════════════════════════════
// TRANSACCIÓN MSR CON QUANTUM SPLIT
// ═══════════════════════════════════════════════════════════════

export async function processMSRTransaction(
  fromUserId: string,
  toUserId: string,
  amount: number,
  description: string
): Promise<{ 
  success: boolean; 
  split?: QuantumSplit; 
  transactionId?: string;
  error?: string 
}> {
  try {
    const split = calculateQuantumSplit(amount);

    // Generate hash
    const transactionData = JSON.stringify({
      from: fromUserId,
      to: toUserId,
      amount,
      split,
      timestamp: Date.now(),
    });
    const hashBuffer = await crypto.subtle.digest(
      'SHA-256',
      new TextEncoder().encode(transactionData)
    );
    const hash = Array.from(new Uint8Array(hashBuffer))
      .map(b => b.toString(16).padStart(2, '0'))
      .join('');

    // Insert DIRECT transaction (70% to creator)
    const { data: tx, error } = await supabase
      .from('msr_ledger')
      .insert([{
        from_user_id: fromUserId,
        to_user_id: toUserId,
        amount: split.direct,
        transaction_type: 'DIRECT',
        description,
        hash,
        metadata: { 
          splitApplied: true, 
          originalAmount: amount,
          fenixContribution: split.fenix,
          kernelContribution: split.kernel,
        },
      }])
      .select('id')
      .single();

    if (error) throw error;

    // Insert FENIX transaction (20% to resilience pool)
    await supabase
      .from('msr_ledger')
      .insert([{
        from_user_id: fromUserId,
        to_user_id: null,
        amount: split.fenix,
        transaction_type: 'FENIX',
        description: `Fondo Fénix: ${description}`,
        hash: `${hash}_fenix`,
        metadata: { parentTx: tx.id },
      }]);

    // Insert KERNEL transaction (10% to infrastructure)
    await supabase
      .from('msr_ledger')
      .insert([{
        from_user_id: fromUserId,
        to_user_id: null,
        amount: split.kernel,
        transaction_type: 'KERNEL',
        description: `Kernel Infra: ${description}`,
        hash: `${hash}_kernel`,
        metadata: { parentTx: tx.id },
      }]);

    // Distribute to pools
    await distributeToPool('fenix_fund', split.fenix, 'msr_internal', `TX: ${tx.id}`);
    await distributeToPool('kernel_fund', split.kernel, 'msr_internal', `TX: ${tx.id}`);

    // Log to BookPI
    await bookpiClient.log({
      event_type: 'TRANSACTION',
      event_action: 'msr_transfer',
      actor_id: fromUserId,
      subject_type: 'transaction',
      subject_id: tx.id,
      details: { split, recipient: toUserId },
      anchor_to_msr: true,
      priority: amount >= 1000 ? 'critical' : 'normal',
    });

    return { success: true, split, transactionId: tx.id };
  } catch (err) {
    return { success: false, error: err instanceof Error ? err.message : 'Error' };
  }
}

export const economyService = {
  // Memberships
  getUserMembership,
  getMembershipFeatures,
  checkMembershipEligibility,
  
  // Contributions
  recordContribution,
  getContributionScore,
  getUserContributions,
  
  // Credits
  mintUsageCredits,
  burnUsageCredits,
  
  // Pools
  getEconomyPools,
  distributeToPool,
  
  // Transactions
  processMSRTransaction,
  calculateQuantumSplit,
};
