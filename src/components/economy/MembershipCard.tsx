// ═══════════════════════════════════════════════════════════════
// TAMV MD-X4™ — Tarjeta de Membresía
// Visualización del tier, créditos y características
// ═══════════════════════════════════════════════════════════════

import { motion } from 'framer-motion';
import { 
  Crown, Shield, Building2, User, 
  Zap, HardDrive, Video, Globe,
  Sparkles, Lock, Unlock
} from 'lucide-react';
import { useMembership } from '@/hooks/useMembership';
import { Progress } from '@/components/ui/progress';
import { MembershipTier } from '@/lib/economy-service';

const TIER_CONFIG: Record<MembershipTier, {
  icon: typeof User;
  gradient: string;
  border: string;
  glow: string;
}> = {
  free: {
    icon: User,
    gradient: 'from-muted to-muted/50',
    border: 'border-muted-foreground/30',
    glow: '',
  },
  creator: {
    icon: Sparkles,
    gradient: 'from-primary to-cyber-cyan',
    border: 'border-primary/50',
    glow: 'shadow-[0_0_30px_rgba(0,212,255,0.3)]',
  },
  guardian: {
    icon: Shield,
    gradient: 'from-fenix to-amber-500',
    border: 'border-fenix/50',
    glow: 'shadow-[0_0_30px_rgba(251,191,36,0.3)]',
  },
  institutional: {
    icon: Building2,
    gradient: 'from-kernel to-emerald-500',
    border: 'border-kernel/50',
    glow: 'shadow-[0_0_30px_rgba(16,185,129,0.3)]',
  },
};

export const MembershipCard = () => {
  const { 
    tier, 
    features, 
    membership,
    contributionScore,
    loading,
    getTierBadge,
    getCreditsRemaining,
  } = useMembership();

  if (loading) {
    return (
      <div className="p-6 rounded-2xl bg-card border border-border animate-pulse">
        <div className="h-8 bg-muted rounded w-1/3 mb-4" />
        <div className="h-4 bg-muted rounded w-2/3 mb-2" />
        <div className="h-4 bg-muted rounded w-1/2" />
      </div>
    );
  }

  const config = TIER_CONFIG[tier];
  const TierIcon = config.icon;
  const badge = getTierBadge();
  const creditsRemaining = getCreditsRemaining();
  const creditsTotal = features.monthlyUsageCredits;
  const creditsPercentage = (creditsRemaining / creditsTotal) * 100;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className={`relative overflow-hidden rounded-2xl bg-card border ${config.border} ${config.glow}`}
    >
      {/* Background Gradient */}
      <div className={`absolute inset-0 bg-gradient-to-br ${config.gradient} opacity-10`} />
      
      {/* Content */}
      <div className="relative p-6 space-y-6">
        {/* Header */}
        <div className="flex items-start justify-between">
          <div className="flex items-center gap-4">
            <div className={`p-3 rounded-xl bg-gradient-to-br ${config.gradient}`}>
              <TierIcon className="w-6 h-6 text-background" />
            </div>
            <div>
              <h3 className="font-orbitron text-xl font-bold text-foreground flex items-center gap-2">
                {badge.icon} {badge.label}
              </h3>
              <p className="text-sm text-muted-foreground">
                Membresía TAMV MD-X4™
              </p>
            </div>
          </div>
          
          {tier !== 'free' && (
            <Crown className="w-6 h-6 text-fenix" />
          )}
        </div>

        {/* Contribution Score */}
        <div className="p-4 rounded-xl bg-muted/30 border border-border">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm text-muted-foreground">Score de Contribución</span>
            <span className="font-orbitron font-bold text-primary">{contributionScore}</span>
          </div>
          <Progress 
            value={Math.min(100, contributionScore / 10)} 
            className="h-2"
          />
          <p className="text-xs text-muted-foreground mt-1">
            {contributionScore < 50 
              ? `${50 - contributionScore} puntos para Creator`
              : contributionScore < 500
                ? `${500 - contributionScore} puntos para Guardian`
                : 'Nivel máximo de contribución'}
          </p>
        </div>

        {/* Credits */}
        <div className="p-4 rounded-xl bg-muted/30 border border-border">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm text-muted-foreground flex items-center gap-2">
              <Zap className="w-4 h-4" />
              Créditos de Uso
            </span>
            <span className="font-orbitron font-bold text-foreground">
              {creditsRemaining.toLocaleString()} / {creditsTotal.toLocaleString()}
            </span>
          </div>
          <Progress 
            value={creditsPercentage} 
            className="h-2"
          />
        </div>

        {/* Features Grid */}
        <div className="grid grid-cols-2 gap-3">
          <FeatureItem 
            icon={HardDrive}
            label="Almacenamiento"
            value={`${(features.storageQuotaMb / 1000).toFixed(1)} GB`}
            enabled
          />
          <FeatureItem 
            icon={Video}
            label="Streaming"
            value={`${Math.floor(features.streamingMinutesMonthly / 60)}h/mes`}
            enabled
          />
          <FeatureItem 
            icon={Globe}
            label="DreamSpaces"
            value={`${features.maxDreamspaces} max`}
            enabled={features.maxDreamspaces > 1}
          />
          <FeatureItem 
            icon={features.canCreateChannels ? Unlock : Lock}
            label="Canales"
            value={features.canCreateChannels ? 'Habilitado' : 'Bloqueado'}
            enabled={features.canCreateChannels}
          />
        </div>

        {/* Upgrade CTA */}
        {tier === 'free' && (
          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            className="w-full py-3 rounded-xl bg-gradient-to-r from-primary to-cyber-cyan text-background font-medium flex items-center justify-center gap-2"
          >
            <Crown className="w-4 h-4" />
            Upgrade a Creator
          </motion.button>
        )}
      </div>
    </motion.div>
  );
};

interface FeatureItemProps {
  icon: typeof User;
  label: string;
  value: string;
  enabled: boolean;
}

const FeatureItem = ({ icon: Icon, label, value, enabled }: FeatureItemProps) => (
  <div className={`p-3 rounded-lg border ${enabled ? 'bg-muted/30 border-border' : 'bg-muted/10 border-border/50 opacity-60'}`}>
    <div className="flex items-center gap-2 mb-1">
      <Icon className={`w-4 h-4 ${enabled ? 'text-primary' : 'text-muted-foreground'}`} />
      <span className="text-xs text-muted-foreground">{label}</span>
    </div>
    <p className={`text-sm font-medium ${enabled ? 'text-foreground' : 'text-muted-foreground'}`}>
      {value}
    </p>
  </div>
);
