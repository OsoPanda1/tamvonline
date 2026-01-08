import { motion } from 'framer-motion';
import { Wallet, TrendingUp, ArrowUpRight, ArrowDownLeft } from 'lucide-react';

interface WalletBalanceCardProps {
  balance: number;
  loading: boolean;
}

export const WalletBalanceCard = ({ balance, loading }: WalletBalanceCardProps) => {
  const formatMSR = (amount: number) => {
    return new Intl.NumberFormat('es-MX', {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    }).format(amount);
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-primary/20 via-card to-isabella/10 border border-primary/30 p-6"
    >
      {/* Background glow */}
      <div className="absolute top-0 right-0 w-64 h-64 bg-primary/20 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2" />
      <div className="absolute bottom-0 left-0 w-48 h-48 bg-isabella/20 rounded-full blur-3xl translate-y-1/2 -translate-x-1/2" />
      
      <div className="relative z-10">
        <div className="flex items-center gap-3 mb-4">
          <div className="w-12 h-12 rounded-xl bg-primary/20 flex items-center justify-center">
            <Wallet className="w-6 h-6 text-primary" />
          </div>
          <div>
            <p className="text-muted-foreground font-inter text-sm">Wallet Nubi</p>
            <p className="text-foreground font-orbitron text-xs">Balance Total MSR</p>
          </div>
        </div>

        <div className="mb-6">
          {loading ? (
            <div className="h-12 w-48 bg-muted/50 rounded-lg animate-pulse" />
          ) : (
            <motion.div
              initial={{ scale: 0.9 }}
              animate={{ scale: 1 }}
              className="flex items-baseline gap-2"
            >
              <span className="font-orbitron text-4xl font-bold text-gradient-sovereign">
                {formatMSR(balance)}
              </span>
              <span className="text-primary font-orbitron text-lg">MSR</span>
            </motion.div>
          )}
        </div>

        <div className="flex gap-4">
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="flex items-center gap-2 px-4 py-2 rounded-lg bg-primary/20 text-primary border border-primary/30 font-inter text-sm hover:bg-primary/30 transition-colors"
          >
            <ArrowDownLeft className="w-4 h-4" />
            Recibir
          </motion.button>
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="flex items-center gap-2 px-4 py-2 rounded-lg bg-secondary/20 text-secondary border border-secondary/30 font-inter text-sm hover:bg-secondary/30 transition-colors"
          >
            <ArrowUpRight className="w-4 h-4" />
            Enviar
          </motion.button>
        </div>
      </div>
    </motion.div>
  );
};
