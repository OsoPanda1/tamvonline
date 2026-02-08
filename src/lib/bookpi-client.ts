// BookPI Client — TAMV MD-X4™
// Cliente para interactuar con el sistema de auditoría inmutable

import { supabase } from '@/integrations/supabase/client';

// ═══════════════════════════════════════════════════════════════
// TYPES
// ═══════════════════════════════════════════════════════════════

export type BookPIEventType = 
  | 'SECURITY'
  | 'AUTH'
  | 'TRANSACTION'
  | 'CONTENT'
  | 'MODERATION'
  | 'SYSTEM'
  | 'PROTOCOL'
  | 'MSR_TRANSFER'
  | 'USER_ACTION'
  | 'ISABELLA_DECISION'
  | 'GUARDIAN_ALERT';

export type BookPIPriority = 'low' | 'normal' | 'high' | 'critical';

export interface BookPILogEvent {
  event_type: BookPIEventType;
  event_action: string;
  actor_id?: string;
  subject_type?: string;
  subject_id?: string;
  details?: Record<string, unknown>;
  anchor_to_msr?: boolean;
  priority?: BookPIPriority;
}

export interface BookPILogResponse {
  success: boolean;
  eventId: string;
  hash: string;
  chainHeight: number;
  prevHash: string;
  timestamp: string;
  chainIntegrity: string;
  msrAnchor?: string;
}

export interface BookPIVerifyResponse {
  chainValid: boolean;
  totalEvents: number;
  verifiedEvents: number;
  brokenAt?: string;
  brokenReason?: string;
  merkleRoot: string;
  firstHash: string;
  lastHash: string;
  verifiedAt: string;
  verificationLevel: string;
}

export interface BookPITrailResponse {
  trail: Array<{
    id: string;
    event_type: string;
    action: string;
    actor_id?: string;
    subject_type?: string;
    subject_id?: string;
    details: Record<string, unknown>;
    created_at: string;
    prev_hash: string;
    immutable_hash: string;
  }>;
  count: number;
  offset: number;
  limit: number;
  hashProof?: string;
}

export interface BookPIStatsResponse {
  chainHeight: number;
  genesisBlock: string;
  msrLatestHash: string;
  eventTypeDistribution: Record<string, number>;
  lastActivity: string;
  systemStatus: string;
  version: string;
}

// ═══════════════════════════════════════════════════════════════
// CLIENT IMPLEMENTATION
// ═══════════════════════════════════════════════════════════════

const BOOKPI_FUNCTION_URL = `${import.meta.env.VITE_SUPABASE_URL}/functions/v1/bookpi-audit`;

async function callBookPI<T>(action: string, payload: Record<string, unknown>): Promise<T> {
  const { data: { session } } = await supabase.auth.getSession();
  
  const response = await fetch(BOOKPI_FUNCTION_URL, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${session?.access_token || import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY}`,
      'apikey': import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY,
    },
    body: JSON.stringify({ action, ...payload }),
  });

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    throw new Error(errorData.error || `BookPI error: ${response.status}`);
  }

  return response.json();
}

// ═══════════════════════════════════════════════════════════════
// PUBLIC API
// ═══════════════════════════════════════════════════════════════

/**
 * Log an event to the immutable BookPI audit trail
 */
export async function logEvent(event: BookPILogEvent): Promise<BookPILogResponse> {
  return callBookPI<BookPILogResponse>('log', event as unknown as Record<string, unknown>);
}

/**
 * Verify chain integrity
 */
export async function verifyChain(options?: {
  start_id?: string;
  end_id?: string;
  full_verification?: boolean;
}): Promise<BookPIVerifyResponse> {
  return callBookPI<BookPIVerifyResponse>('verify', options || {});
}

/**
 * Get audit trail with filters
 */
export async function getAuditTrail(options?: {
  actor_id?: string;
  subject_id?: string;
  event_type?: BookPIEventType;
  start_date?: string;
  end_date?: string;
  limit?: number;
  offset?: number;
  include_hash_proof?: boolean;
}): Promise<BookPITrailResponse> {
  return callBookPI<BookPITrailResponse>('trail', options || {});
}

/**
 * Batch log multiple events
 */
export async function batchLogEvents(events: BookPILogEvent[]): Promise<{
  success: boolean;
  inserted: number;
  batchMerkleRoot: string;
  firstHash: string;
  lastHash: string;
}> {
  return callBookPI('batch', { events: events as unknown[] });
}

/**
 * Get BookPI chain statistics
 */
export async function getChainStats(): Promise<BookPIStatsResponse> {
  return callBookPI<BookPIStatsResponse>('stats', {});
}

// ═══════════════════════════════════════════════════════════════
// CONVENIENCE METHODS
// ═══════════════════════════════════════════════════════════════

/**
 * Log a security event
 */
export async function logSecurityEvent(
  action: string,
  actorId: string | undefined,
  details?: Record<string, unknown>
): Promise<BookPILogResponse> {
  return logEvent({
    event_type: 'SECURITY',
    event_action: action,
    actor_id: actorId,
    details,
    priority: 'high',
    anchor_to_msr: true,
  });
}

/**
 * Log an MSR transaction
 */
export async function logMSRTransaction(
  fromUserId: string,
  toUserId: string,
  amount: number,
  transactionType: string,
  details?: Record<string, unknown>
): Promise<BookPILogResponse> {
  return logEvent({
    event_type: 'MSR_TRANSFER',
    event_action: transactionType,
    actor_id: fromUserId,
    subject_type: 'user',
    subject_id: toUserId,
    details: {
      amount,
      ...details,
    },
    priority: 'critical',
    anchor_to_msr: true,
  });
}

/**
 * Log an Isabella AI decision
 */
export async function logIsabellaDecision(
  userId: string,
  decision: string,
  context: Record<string, unknown>
): Promise<BookPILogResponse> {
  return logEvent({
    event_type: 'ISABELLA_DECISION',
    event_action: decision,
    actor_id: 'ISABELLA_AI',
    subject_type: 'user',
    subject_id: userId,
    details: context,
    priority: 'high',
  });
}

/**
 * Log user content action
 */
export async function logContentAction(
  userId: string,
  action: string,
  contentId: string,
  contentType: string,
  details?: Record<string, unknown>
): Promise<BookPILogResponse> {
  return logEvent({
    event_type: 'CONTENT',
    event_action: action,
    actor_id: userId,
    subject_type: contentType,
    subject_id: contentId,
    details,
    priority: 'normal',
  });
}

// ═══════════════════════════════════════════════════════════════
// HOOK FOR REACT COMPONENTS
// ═══════════════════════════════════════════════════════════════

export function useBookPI() {
  return {
    logEvent,
    verifyChain,
    getAuditTrail,
    batchLogEvents,
    getChainStats,
    logSecurityEvent,
    logMSRTransaction,
    logIsabellaDecision,
    logContentAction,
  };
}

export default {
  logEvent,
  verifyChain,
  getAuditTrail,
  batchLogEvents,
  getChainStats,
  logSecurityEvent,
  logMSRTransaction,
  logIsabellaDecision,
  logContentAction,
};
