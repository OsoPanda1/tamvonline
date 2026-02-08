// Wallet Page — TAMV MD-X4™
// Economía interna no soberana con membresías y pools
import { useState } from 'react';
import { motion } from 'framer-motion';
import { Wallet as WalletIcon, Crown, TrendingUp } from 'lucide-react';
import { WalletDashboard } from '@/components/wallet/WalletDashboard';
import { MembershipCard } from '@/components/economy/MembershipCard';
import { EconomyPoolsDisplay } from '@/components/economy/EconomyPoolsDisplay';
import { TopNavBar } from '@/components/home/TopNavBar';
import { LeftSidebar } from '@/components/home/LeftSidebar';
import { AztecBackground } from '@/components/ui/AztecBackground';

type WalletTab = 'wallet' | 'membership' | 'pools';

const Wallet = () => {
  const [activeTab, setActiveTab] = useState<WalletTab>('wallet');

  const tabs = [
    { id: 'wallet' as const, label: 'Wallet MSR', icon: WalletIcon },
    { id: 'membership' as const, label: 'Membresía', icon: Crown },
    { id: 'pools' as const, label: 'Pools del Sistema', icon: TrendingUp },
  ];

  return (
    <div className="min-h-screen bg-background relative">
      <AztecBackground variant="subtle" />
      <TopNavBar />
      <LeftSidebar />

      <main className="pt-24 pb-32 pl-20 lg:pl-72 pr-4 transition-all duration-300">
        <div className="max-w-[1200px] mx-auto space-y-6">
          {/* Tab Navigation */}
          <div className="flex gap-2 p-1 bg-muted/30 rounded-xl overflow-x-auto">
            {tabs.map(tab => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center justify-center gap-2 px-4 py-2 rounded-lg transition-all whitespace-nowrap ${
                  activeTab === tab.id
                    ? 'bg-primary text-background'
                    : 'text-muted-foreground hover:text-foreground'
                }`}
              >
                <tab.icon className="w-4 h-4" />
                <span className="text-sm font-medium">{tab.label}</span>
              </button>
            ))}
          </div>

          {/* Tab Content */}
          <motion.div
            key={activeTab}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.2 }}
          >
            {activeTab === 'wallet' && <WalletDashboard />}
            {activeTab === 'membership' && (
              <div className="max-w-2xl mx-auto">
                <MembershipCard />
              </div>
            )}
            {activeTab === 'pools' && <EconomyPoolsDisplay />}
          </motion.div>
        </div>
      </main>
    </div>
  );
};

export default Wallet;
