// Wallet Page — TAMV MD-X4™
import { WalletDashboard } from '@/components/wallet/WalletDashboard';
import { TopNavBar } from '@/components/home/TopNavBar';
import { LeftSidebar } from '@/components/home/LeftSidebar';
import { AztecBackground } from '@/components/ui/AztecBackground';

const Wallet = () => {
  return (
    <div className="min-h-screen bg-background relative">
      <AztecBackground variant="subtle" />
      <TopNavBar />
      <LeftSidebar />

      <main className="pt-24 pb-32 pl-20 lg:pl-72 pr-4 transition-all duration-300">
        <div className="max-w-[1200px] mx-auto">
          <WalletDashboard />
        </div>
      </main>
    </div>
  );
};

export default Wallet;
