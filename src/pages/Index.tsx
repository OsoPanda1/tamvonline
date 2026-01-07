import { Hero } from '@/components/sections/Hero';
import { SovereignStack } from '@/components/sections/SovereignStack';
import { EconomySection } from '@/components/sections/EconomySection';
import { FeaturesGrid } from '@/components/sections/FeaturesGrid';
import { IsabellaSection } from '@/components/sections/IsabellaSection';
import { Footer } from '@/components/sections/Footer';

const Index = () => {
  return (
    <main className="min-h-screen bg-background overflow-x-hidden">
      <Hero />
      <SovereignStack />
      <EconomySection />
      <FeaturesGrid />
      <IsabellaSection />
      <Footer />
    </main>
  );
};

export default Index;
