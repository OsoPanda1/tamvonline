import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useAuth } from '@/hooks/useAuth';
import { useWallet } from '@/hooks/useWallet';
import { useProfile } from '@/hooks/useProfile';
import { Footer } from '@/components/sections/Footer';
import { WalletBalanceCard } from '@/components/wallet/WalletBalanceCard';
import { EconomySplitVisualizer } from '@/components/wallet/EconomySplitVisualizer';
import { TransactionHistory } from '@/components/wallet/TransactionHistory';
import { TrustLevelBadge } from '@/components/wallet/TrustLevelBadge';
import { Fingerprint, Loader2, Sparkles } from 'lucide-react';

const Dashboard = () => {
  const { user, loading: authLoading } = useAuth();
  const { balance, transactions, splits, loading: walletLoading } = useWallet();
  const { profile, loading: profileLoading } = useProfile();
  const navigate = useNavigate();

  useEffect(() => {
    if (!authLoading && !user) {
      navigate('/auth');
    }
  }, [user, authLoading, navigate]);

  if (authLoading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ duration: 2, repeat: Infinity, ease: 'linear' }}
        >
          <Loader2 className="w-12 h-12 text-primary" />
        </motion.div>
      </div>
    );
  }

  if (!user) {
    return null;
  }

  return (
    <main className="min-h-screen bg-background relative overflow-hidden">
      {/* Background Effects */}
      <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-background to-isabella/5" />
      <div className="absolute top-1/4 -left-32 w-96 h-96 bg-primary/5 rounded-full blur-3xl" />
      <div className="absolute bottom-1/4 -right-32 w-96 h-96 bg-isabella/5 rounded-full blur-3xl" />
      
      <div className="container mx-auto px-6 py-24 relative z-10">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <div className="flex items-center gap-4 mb-2">
            <div className="w-12 h-12 rounded-full bg-gradient-to-br from-primary/20 to-isabella/20 border border-primary/30 flex items-center justify-center">
              <Fingerprint className="w-6 h-6 text-primary" />
            </div>
            <div>
              <h1 className="font-orbitron text-2xl md:text-3xl font-bold">
                <span className="text-gradient-sovereign">Dashboard Soberano</span>
              </h1>
              <p className="text-muted-foreground font-inter text-sm flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-secondary" />
                {profile?.display_name || user.email?.split('@')[0]}
              </p>
            </div>
          </div>
        </motion.div>

        {/* Main Grid */}
        <div className="grid lg:grid-cols-3 gap-6">
          {/* Left Column - Wallet */}
          <div className="lg:col-span-2 space-y-6">
            <WalletBalanceCard balance={balance} loading={walletLoading} />
            <EconomySplitVisualizer splits={splits} loading={walletLoading} />
            <TransactionHistory transactions={transactions} loading={walletLoading} />
          </div>

          {/* Right Column - Profile & Trust */}
          <div className="space-y-6">
            <TrustLevelBadge profile={profile} loading={profileLoading} />
            
            {/* Quick Actions */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              className="rounded-2xl bg-card/50 border border-border/50 p-6"
            >
              <h3 className="font-orbitron text-lg font-semibold text-foreground mb-4">
                Acciones Rápidas
              </h3>
              <div className="space-y-3">
                <button className="w-full p-3 rounded-xl bg-muted/20 hover:bg-muted/30 border border-border/50 hover:border-primary/30 transition-all text-left">
                  <p className="font-inter text-sm font-medium text-foreground">
                    🎨 Crear DreamSpace
                  </p>
                  <p className="text-muted-foreground text-xs">
                    Lanza tu espacio XR inmersivo
                  </p>
                </button>
                <button className="w-full p-3 rounded-xl bg-muted/20 hover:bg-muted/30 border border-border/50 hover:border-secondary/30 transition-all text-left">
                  <p className="font-inter text-sm font-medium text-foreground">
                    🎵 Publicar Contenido
                  </p>
                  <p className="text-muted-foreground text-xs">
                    Comparte con la comunidad TAMV
                  </p>
                </button>
                <button className="w-full p-3 rounded-xl bg-muted/20 hover:bg-muted/30 border border-border/50 hover:border-isabella/30 transition-all text-left">
                  <p className="font-inter text-sm font-medium text-foreground">
                    🤖 Consultar Isabella
                  </p>
                  <p className="text-muted-foreground text-xs">
                    Guidance ético y empático
                  </p>
                </button>
              </div>
            </motion.div>

            {/* System Status */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.35 }}
              className="rounded-2xl bg-card/50 border border-border/50 p-6"
            >
              <h3 className="font-orbitron text-lg font-semibold text-foreground mb-4">
                Estado del Sistema
              </h3>
              <div className="space-y-3">
                {[
                  { label: 'MSR Ledger', status: 'online', color: 'bg-primary' },
                  { label: 'Isabella AI', status: 'online', color: 'bg-isabella' },
                  { label: 'BookPI Audit', status: 'online', color: 'bg-secondary' },
                  { label: 'Sentinel', status: 'monitoring', color: 'bg-fenix' },
                ].map((system) => (
                  <div key={system.label} className="flex items-center justify-between">
                    <span className="text-muted-foreground text-sm font-inter">
                      {system.label}
                    </span>
                    <div className="flex items-center gap-2">
                      <span className={`w-2 h-2 rounded-full ${system.color} animate-pulse`} />
                      <span className="text-foreground text-xs font-inter capitalize">
                        {system.status}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </motion.div>
          </div>
        </div>
      </div>
      
      <Footer />
    </main>
  );
};

export default Dashboard;
