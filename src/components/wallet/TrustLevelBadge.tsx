import { motion } from 'framer-motion';
import { Shield, Star, Eye, Users, Crown, Zap } from 'lucide-react';
import { Tables } from '@/integrations/supabase/types';

type Profile = Tables<'profiles'>;
type TrustLevel = 'observer' | 'citizen' | 'guardian' | 'sovereign' | 'archon';

interface TrustLevelBadgeProps {
  profile: Profile | null;
  loading: boolean;
}

const trustLevelConfig: Record<TrustLevel, {
  label: string;
  icon: typeof Shield;
  color: string;
  bgColor: string;
  description: string;
  minReputation: number;
}> = {
  observer: {
    label: 'Observador',
    icon: Eye,
    color: 'text-muted-foreground',
    bgColor: 'bg-muted/30',
    description: 'Nuevo en el ecosistema',
    minReputation: 0,
  },
  citizen: {
    label: 'Ciudadano',
    icon: Users,
    color: 'text-primary',
    bgColor: 'bg-primary/20',
    description: 'Miembro activo verificado',
    minReputation: 100,
  },
  guardian: {
    label: 'Guardián',
    icon: Shield,
    color: 'text-secondary',
    bgColor: 'bg-secondary/20',
    description: 'Protector de la comunidad',
    minReputation: 500,
  },
  sovereign: {
    label: 'Soberano',
    icon: Crown,
    color: 'text-isabella',
    bgColor: 'bg-isabella/20',
    description: 'Líder reconocido',
    minReputation: 1000,
  },
  archon: {
    label: 'Archon',
    icon: Zap,
    color: 'text-fenix',
    bgColor: 'bg-fenix/20',
    description: 'Autoridad máxima',
    minReputation: 5000,
  },
};

export const TrustLevelBadge = ({ profile, loading }: TrustLevelBadgeProps) => {
  if (loading) {
    return (
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.15 }}
        className="rounded-2xl bg-card/50 border border-border/50 p-6"
      >
        <div className="flex items-center gap-4">
          <div className="w-16 h-16 rounded-full bg-muted/50 animate-pulse" />
          <div className="flex-1">
            <div className="h-5 w-32 bg-muted/50 rounded mb-2 animate-pulse" />
            <div className="h-4 w-24 bg-muted/50 rounded animate-pulse" />
          </div>
        </div>
      </motion.div>
    );
  }

  const trustLevel = (profile?.trust_level || 'observer') as TrustLevel;
  const config = trustLevelConfig[trustLevel];
  const Icon = config.icon;
  const reputation = profile?.reputation_score || 0;

  // Calculate progress to next level
  const levels = Object.entries(trustLevelConfig);
  const currentIndex = levels.findIndex(([key]) => key === trustLevel);
  const nextLevel = levels[currentIndex + 1];
  const progressToNext = nextLevel 
    ? Math.min(100, ((reputation - config.minReputation) / (nextLevel[1].minReputation - config.minReputation)) * 100)
    : 100;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.15 }}
      className="rounded-2xl bg-card/50 border border-border/50 p-6"
    >
      <h3 className="font-orbitron text-lg font-semibold text-foreground mb-4">
        Nivel de Confianza Isabella
      </h3>

      <div className="flex items-center gap-4 mb-6">
        <motion.div 
          className={`w-16 h-16 rounded-full ${config.bgColor} flex items-center justify-center`}
          whileHover={{ scale: 1.1, rotate: 5 }}
        >
          <Icon className={`w-8 h-8 ${config.color}`} />
        </motion.div>
        <div>
          <p className={`font-orbitron text-xl font-bold ${config.color}`}>
            {config.label}
          </p>
          <p className="text-muted-foreground text-sm font-inter">
            {config.description}
          </p>
        </div>
      </div>

      {/* Reputation Score */}
      <div className="mb-4">
        <div className="flex items-center justify-between mb-2">
          <span className="text-muted-foreground text-sm font-inter">Reputación</span>
          <span className="font-orbitron font-semibold text-foreground flex items-center gap-1">
            <Star className="w-4 h-4 text-secondary" />
            {reputation}
          </span>
        </div>
        
        {nextLevel && (
          <>
            <div className="h-2 rounded-full bg-muted/30 overflow-hidden">
              <motion.div
                initial={{ width: 0 }}
                animate={{ width: `${progressToNext}%` }}
                transition={{ delay: 0.5, duration: 0.8 }}
                className={`h-full ${config.bgColor.replace('/20', '')}`}
              />
            </div>
            <p className="text-muted-foreground text-xs font-inter mt-2">
              {nextLevel[1].minReputation - reputation} puntos para {nextLevel[1].label}
            </p>
          </>
        )}
      </div>

      {/* Digital DNA Preview */}
      {profile?.digital_dna && (
        <div className="pt-4 border-t border-border/50">
          <p className="text-muted-foreground text-xs font-inter mb-2">ADN Digital</p>
          <div className="flex flex-wrap gap-2">
            {((profile.digital_dna as any).capabilities || []).slice(0, 3).map((cap: string) => (
              <span
                key={cap}
                className="px-2 py-1 text-xs font-inter bg-primary/10 text-primary rounded-md border border-primary/20"
              >
                {cap}
              </span>
            ))}
          </div>
        </div>
      )}
    </motion.div>
  );
};
