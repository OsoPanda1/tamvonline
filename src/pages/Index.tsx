import { TopNavBar } from '@/components/home/TopNavBar';
import { LeftSidebar } from '@/components/home/LeftSidebar';
import { HeroVideo } from '@/components/home/HeroVideo';
import { InfiniteCarousel } from '@/components/home/InfiniteCarousel';
import { FiveColumns } from '@/components/home/FiveColumns';
import { EightSections } from '@/components/home/EightSections';
import { GlobalFeed } from '@/components/home/GlobalFeed';
import { MusicPlayer } from '@/components/home/MusicPlayer';
import { StoriesBar } from '@/components/stories/StoriesBar';
import { Footer } from '@/components/sections/Footer';

const Index = () => {
  return (
    <div className="min-h-screen bg-background">
      <TopNavBar />
      <LeftSidebar />

      <main className="pt-24 pb-32 pl-20 lg:pl-72 pr-4 transition-all duration-300">
        <div className="max-w-[1600px] mx-auto space-y-8">
          {/* Stories Bar */}
          <StoriesBar />

          {/* Hero Video */}
          <HeroVideo />

          {/* Infinite Carousels */}
          <InfiniteCarousel />

          {/* 5 Columns */}
          <FiveColumns />

          {/* Global Feed */}
          <GlobalFeed />

          {/* 8 Sections */}
          <EightSections />

          <Footer />
        </div>
      </main>

      <MusicPlayer />
    </div>
  );
};

export default Index;
