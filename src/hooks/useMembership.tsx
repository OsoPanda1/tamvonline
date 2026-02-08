// ═══════════════════════════════════════════════════════════════
// TAMV MD-X4™ — Hook de Membresía
// Gestión de membresías, contribuciones y créditos
// ═══════════════════════════════════════════════════════════════

import { useState, useEffect, useCallback } from 'react';
import { useAuth } from '@/hooks/useAuth';
import { supabase } from '@/integrations/supabase/client';
import { 
  economyService,
  MembershipTier, 
  MembershipFeatures,
  UserMembership,
  ContributionRecord,
  MEMBERSHIP_FEATURES,
} from '@/lib/economy-service';

interface MembershipState {
  membership: UserMembership | null;
  features: MembershipFeatures;
  contributionScore: number;
  contributions: ContributionRecord[];
  loading: boolean;
  error: string | null;
}

export const useMembership = () => {
  const { user } = useAuth();
  const [state, setState] = useState<MembershipState>({
    membership: null,
    features: MEMBERSHIP_FEATURES.free,
    contributionScore: 0,
    contributions: [],
    loading: true,
    error: null,
  });

  const fetchMembershipData = useCallback(async () => {
    if (!user) {
      setState(prev => ({ 
        ...prev, 
        loading: false,
        membership: null,
        features: MEMBERSHIP_FEATURES.free,
      }));
      return;
    }

    try {
      // Fetch all data in parallel
      const [membership, score, contributions] = await Promise.all([
        economyService.getUserMembership(user.id),
        economyService.getContributionScore(user.id),
        economyService.getUserContributions(user.id),
      ]);

      const tier = membership?.tier || 'free';
      const features = MEMBERSHIP_FEATURES[tier];

      setState({
        membership,
        features,
        contributionScore: score,
        contributions,
        loading: false,
        error: null,
      });
    } catch (err) {
      setState(prev => ({
        ...prev,
        loading: false,
        error: err instanceof Error ? err.message : 'Error cargando membresía',
      }));
    }
  }, [user]);

  useEffect(() => {
    fetchMembershipData();

    // Subscribe to realtime changes
    if (user) {
      const channel = supabase
        .channel('membership_changes')
        .on(
          'postgres_changes',
          {
            event: '*',
            schema: 'public',
            table: 'user_memberships',
            filter: `user_id=eq.${user.id}`,
          },
          () => {
            fetchMembershipData();
          }
        )
        .subscribe();

      return () => {
        supabase.removeChannel(channel);
      };
    }
  }, [user, fetchMembershipData]);

  // ═══════════════════════════════════════════════════════════════
  // ACCIONES
  // ═══════════════════════════════════════════════════════════════

  const checkUpgradeEligibility = useCallback(async (targetTier: MembershipTier) => {
    if (!user) return { eligible: false, message: 'No autenticado' };
    return economyService.checkMembershipEligibility(user.id, targetTier);
  }, [user]);

  const consumeCredits = useCallback(async (amount: number, reason: string) => {
    if (!user) return { success: false, error: 'No autenticado' };
    const result = await economyService.burnUsageCredits(user.id, amount, reason);
    if (result.success) {
      fetchMembershipData();
    }
    return result;
  }, [user, fetchMembershipData]);

  const getCreditsRemaining = useCallback(() => {
    return state.membership?.usageCreditsRemaining || 0;
  }, [state.membership]);

  const canPerformAction = useCallback((action: keyof MembershipFeatures) => {
    const value = state.features[action];
    return typeof value === 'boolean' ? value : true;
  }, [state.features]);

  const getTierBadge = useCallback(() => {
    const tier = state.membership?.tier || 'free';
    const badges: Record<MembershipTier, { label: string; color: string; icon: string }> = {
      free: { label: 'Ciudadano', color: 'bg-muted text-muted-foreground', icon: '👤' },
      creator: { label: 'Creador', color: 'bg-primary/20 text-primary', icon: '✨' },
      guardian: { label: 'Guardián', color: 'bg-fenix/20 text-fenix', icon: '🛡️' },
      institutional: { label: 'Institucional', color: 'bg-kernel/20 text-kernel', icon: '🏛️' },
    };
    return badges[tier];
  }, [state.membership?.tier]);

  return {
    // Estado
    ...state,
    tier: state.membership?.tier || 'free',
    
    // Acciones
    refetch: fetchMembershipData,
    checkUpgradeEligibility,
    consumeCredits,
    getCreditsRemaining,
    canPerformAction,
    getTierBadge,
    
    // Helpers
    isCreator: state.membership?.tier === 'creator' || 
               state.membership?.tier === 'guardian' || 
               state.membership?.tier === 'institutional',
    isGuardian: state.membership?.tier === 'guardian' || 
                state.membership?.tier === 'institutional',
    isInstitutional: state.membership?.tier === 'institutional',
  };
};
