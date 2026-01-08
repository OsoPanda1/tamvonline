import { motion } from 'framer-motion';
import { Coins, Heart, Cpu } from 'lucide-react';

interface EconomySplitVisualizerProps {
  splits: {
    direct: number;
    fenix: number;
    kernel: number;
  };
  loading: boolean;
}

export const EconomySplitVisualizer = ({ splits, loading }: EconomySplitVisualizerProps) => {
  const total = splits.direct + splits.fenix + splits.kernel;
  
  const formatMSR = (amount: number) => {
    return new Intl.NumberFormat('es-MX', {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    }).format(amount);
  };

  const getPercentage = (value: number) => {
    if (total === 0) return 0;
    return (value / total) * 100;
  };

  const splitData = [
    {
      label: 'Creador (70%)',
      sublabel: 'Tu ganancia directa',
      value: splits.direct,
      percentage: 70,
      actualPercentage: getPercentage(splits.direct),
      icon: Coins,
      color: 'primary',
      bgClass: 'bg-primary',
      textClass: 'text-primary',
      borderClass: 'border-primary/30',
    },
    {
      label: 'Fénix (20%)',
      sublabel: 'Fondo comunitario',
      value: splits.fenix,
      percentage: 20,
      actualPercentage: getPercentage(splits.fenix),
      icon: Heart,
      color: 'fenix',
      bgClass: 'bg-fenix',
      textClass: 'text-fenix',
      borderClass: 'border-fenix/30',
    },
    {
      label: 'Kernel (10%)',
      sublabel: 'Infraestructura',
      value: splits.kernel,
      percentage: 10,
      actualPercentage: getPercentage(splits.kernel),
      icon: Cpu,
      color: 'kernel',
      bgClass: 'bg-kernel',
      textClass: 'text-kernel',
      borderClass: 'border-kernel/30',
    },
  ];

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.1 }}
      className="rounded-2xl bg-card/50 border border-border/50 p-6"
    >
      <h3 className="font-orbitron text-lg font-semibold text-foreground mb-6 flex items-center gap-2">
        <span className="text-gradient-sovereign">Economía</span> 70/20/10
      </h3>

      {/* Visual Bar */}
      <div className="h-4 rounded-full overflow-hidden flex mb-6 bg-muted/30">
        {splitData.map((split, index) => (
          <motion.div
            key={split.label}
            initial={{ width: 0 }}
            animate={{ width: `${split.percentage}%` }}
            transition={{ delay: 0.3 + index * 0.1, duration: 0.5 }}
            className={`h-full ${split.bgClass} ${index < splitData.length - 1 ? 'border-r border-background' : ''}`}
          />
        ))}
      </div>

      {/* Split Cards */}
      <div className="space-y-3">
        {splitData.map((split, index) => {
          const Icon = split.icon;
          return (
            <motion.div
              key={split.label}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.4 + index * 0.1 }}
              className={`flex items-center justify-between p-4 rounded-xl bg-muted/20 border ${split.borderClass}`}
            >
              <div className="flex items-center gap-3">
                <div className={`w-10 h-10 rounded-lg ${split.bgClass}/20 flex items-center justify-center`}>
                  <Icon className={`w-5 h-5 ${split.textClass}`} />
                </div>
                <div>
                  <p className={`font-orbitron text-sm font-medium ${split.textClass}`}>
                    {split.label}
                  </p>
                  <p className="text-muted-foreground text-xs font-inter">
                    {split.sublabel}
                  </p>
                </div>
              </div>
              <div className="text-right">
                {loading ? (
                  <div className="h-6 w-20 bg-muted/50 rounded animate-pulse" />
                ) : (
                  <>
                    <p className={`font-orbitron font-semibold ${split.textClass}`}>
                      {formatMSR(split.value)} MSR
                    </p>
                    <p className="text-muted-foreground text-xs font-inter">
                      {split.actualPercentage.toFixed(1)}% del total
                    </p>
                  </>
                )}
              </div>
            </motion.div>
          );
        })}
      </div>

      {/* Total */}
      <div className="mt-6 pt-4 border-t border-border/50">
        <div className="flex items-center justify-between">
          <span className="text-muted-foreground font-inter text-sm">Total distribuido</span>
          <span className="font-orbitron font-bold text-foreground">
            {loading ? '---' : `${formatMSR(total)} MSR`}
          </span>
        </div>
      </div>
    </motion.div>
  );
};
