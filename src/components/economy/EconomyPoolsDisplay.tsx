// ═══════════════════════════════════════════════════════════════
// TAMV MD-X4™ — Visualización de Pools Económicos
// Muestra el estado de los pools del sistema (Fénix, Kernel, etc.)
// ═══════════════════════════════════════════════════════════════

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { 
  Flame, Cpu, Shield, Database, BookOpen,
  TrendingUp, RefreshCw
} from 'lucide-react';
import { economyService, EconomyPool } from '@/lib/economy-service';
import { formatMSRDisplay } from '@/lib/msr-blockchain';

const POOL_CONFIG: Record<string, {
  icon: typeof Flame;
  color: string;
  description: string;
}> = {
  fenix_fund: {
    icon: Flame,
    color: 'text-fenix',
    description: 'Resiliencia comunitaria (20% Quantum Split)',
  },
  kernel_fund: {
    icon: Cpu,
    color: 'text-kernel',
    description: 'Infraestructura soberana (10% Quantum Split)',
  },
  resilience_pool: {
    icon: Shield,
    color: 'text-primary',
    description: 'Backup, mitigaciones y recuperación',
  },
  memory_pool: {
    icon: BookOpen,
    color: 'text-purple-400',
    description: 'Archivos históricos y educación pública',
  },
  infra_pool: {
    icon: Database,
    color: 'text-blue-400',
    description: 'Costos técnicos y herramientas abiertas',
  },
};

export const EconomyPoolsDisplay = () => {
  const [pools, setPools] = useState<EconomyPool[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchPools = async () => {
    setLoading(true);
    const data = await economyService.getEconomyPools();
    setPools(data);
    setLoading(false);
  };

  useEffect(() => {
    fetchPools();
  }, []);

  if (loading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {[1, 2, 3, 4, 5].map(i => (
          <div key={i} className="p-4 rounded-xl bg-card border border-border animate-pulse">
            <div className="h-6 bg-muted rounded w-1/2 mb-3" />
            <div className="h-8 bg-muted rounded w-2/3 mb-2" />
            <div className="h-4 bg-muted rounded w-full" />
          </div>
        ))}
      </div>
    );
  }

  const totalMSR = pools.reduce((sum, p) => sum + p.balanceMsrInternal, 0);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-xl font-orbitron font-bold text-foreground flex items-center gap-2">
            <TrendingUp className="w-5 h-5 text-primary" />
            Pools del Sistema
          </h2>
          <p className="text-sm text-muted-foreground">
            Economía TAMV no soberana • Valor de uso y contribución
          </p>
        </div>
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={fetchPools}
          className="p-2 rounded-lg bg-muted/50 text-muted-foreground hover:text-foreground transition-colors"
        >
          <RefreshCw className="w-5 h-5" />
        </motion.button>
      </div>

      {/* Total MSR */}
      <div className="p-4 rounded-xl bg-gradient-to-r from-primary/20 to-cyber-cyan/20 border border-primary/30">
        <p className="text-sm text-muted-foreground mb-1">Total en Pools</p>
        <p className="text-3xl font-orbitron font-bold text-primary">
          {formatMSRDisplay(totalMSR)} <span className="text-lg text-muted-foreground">MSR</span>
        </p>
      </div>

      {/* Pools Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {pools.map((pool, index) => {
          const config = POOL_CONFIG[pool.id] || {
            icon: Database,
            color: 'text-muted-foreground',
            description: pool.description,
          };
          const Icon = config.icon;

          return (
            <motion.div
              key={pool.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              className="p-4 rounded-xl bg-card border border-border hover:border-primary/30 transition-colors"
            >
              {/* Header */}
              <div className="flex items-center gap-3 mb-4">
                <div className={`p-2 rounded-lg bg-muted/50 ${config.color}`}>
                  <Icon className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="font-medium text-foreground">{pool.displayName}</h3>
                  <p className="text-xs text-muted-foreground">{config.description}</p>
                </div>
              </div>

              {/* Balances */}
              <div className="space-y-2">
                {pool.balanceMsrInternal > 0 && (
                  <div className="flex justify-between items-center">
                    <span className="text-xs text-muted-foreground">MSR Interno</span>
                    <span className={`font-orbitron font-bold ${config.color}`}>
                      {formatMSRDisplay(pool.balanceMsrInternal)}
                    </span>
                  </div>
                )}
                {pool.balanceUsageCredits > 0 && (
                  <div className="flex justify-between items-center">
                    <span className="text-xs text-muted-foreground">Créditos</span>
                    <span className="font-orbitron text-primary">
                      {pool.balanceUsageCredits.toLocaleString()}
                    </span>
                  </div>
                )}
                {pool.balanceContributionPoints > 0 && (
                  <div className="flex justify-between items-center">
                    <span className="text-xs text-muted-foreground">Puntos</span>
                    <span className="font-orbitron text-fenix">
                      {pool.balanceContributionPoints.toLocaleString()}
                    </span>
                  </div>
                )}
                {pool.balanceMsrInternal === 0 && 
                 pool.balanceUsageCredits === 0 && 
                 pool.balanceContributionPoints === 0 && (
                  <p className="text-xs text-muted-foreground italic">Sin fondos activos</p>
                )}
              </div>

              {/* Visual indicator */}
              <div className="mt-4 h-1 rounded-full bg-muted overflow-hidden">
                <motion.div
                  initial={{ width: 0 }}
                  animate={{ width: `${Math.min(100, (pool.balanceMsrInternal / totalMSR) * 100)}%` }}
                  transition={{ duration: 1, ease: "easeOut" }}
                  className={`h-full rounded-full ${
                    pool.id === 'fenix_fund' ? 'bg-fenix' :
                    pool.id === 'kernel_fund' ? 'bg-kernel' :
                    'bg-primary'
                  }`}
                />
              </div>
            </motion.div>
          );
        })}
      </div>

      {/* Disclaimer */}
      <p className="text-xs text-muted-foreground text-center italic">
        TAMV no es un sistema financiero. Los valores representan unidades de uso interno
        sin equivalencia a monedas soberanas.
      </p>
    </div>
  );
};
