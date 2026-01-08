import { motion } from 'framer-motion';
import { Play, Radio, Film, Eye, Heart, MessageCircle } from 'lucide-react';

interface ContentItem {
  id: string;
  title: string;
  thumbnail: string;
  views: string;
  likes: string;
  creator: string;
  isLive?: boolean;
}

const generateMockData = (type: 'video' | 'streaming' | 'reel', count: number): ContentItem[] => {
  return Array.from({ length: count }, (_, i) => ({
    id: `${type}-${i}`,
    title: type === 'video' 
      ? `Concierto Sensorial ${i + 1}` 
      : type === 'streaming' 
        ? `Live: DreamSpace Session ${i + 1}`
        : `Trend #${i + 1}`,
    thumbnail: '',
    views: `${Math.floor(Math.random() * 500) + 10}K`,
    likes: `${Math.floor(Math.random() * 100) + 5}K`,
    creator: `@creator_${i + 1}`,
    isLive: type === 'streaming'
  }));
};

const CarouselItem = ({ item, type }: { item: ContentItem; type: 'video' | 'streaming' | 'reel' }) => {
  const aspectClass = type === 'reel' ? 'aspect-[9/16]' : 'aspect-video';
  const sizeClass = type === 'reel' ? 'w-32' : 'w-64';
  
  return (
    <motion.div
      whileHover={{ scale: 1.05, y: -5 }}
      className={`${sizeClass} flex-shrink-0 group cursor-pointer`}
    >
      <div className={`relative ${aspectClass} rounded-xl overflow-hidden border border-primary/10 hover:border-primary/40 transition-all duration-300`}>
        {/* Gradient Background */}
        <div className="absolute inset-0 bg-gradient-to-br from-abyss-lighter to-abyss">
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,_hsl(185_100%_50%_/_0.1)_0%,_transparent_70%)]" />
        </div>
        
        {/* Icon */}
        <div className="absolute inset-0 flex items-center justify-center">
          {type === 'video' && <Play className="w-8 h-8 text-primary/40" />}
          {type === 'streaming' && <Radio className="w-8 h-8 text-destructive/60 animate-pulse" />}
          {type === 'reel' && <Film className="w-6 h-6 text-isabella/50" />}
        </div>

        {/* Live Badge */}
        {item.isLive && (
          <div className="absolute top-2 left-2 px-2 py-0.5 bg-destructive text-white text-xs font-bold rounded flex items-center gap-1">
            <span className="w-1.5 h-1.5 bg-white rounded-full animate-pulse" />
            LIVE
          </div>
        )}

        {/* Hover Overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-abyss via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity">
          <div className="absolute bottom-2 left-2 right-2">
            <p className="text-xs font-medium text-foreground truncate">{item.title}</p>
            <p className="text-[10px] text-primary">{item.creator}</p>
          </div>
        </div>

        {/* Stats */}
        <div className="absolute top-2 right-2 flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
          <span className="px-1.5 py-0.5 bg-abyss/80 rounded text-[10px] text-foreground flex items-center gap-0.5">
            <Eye className="w-2.5 h-2.5" />{item.views}
          </span>
        </div>
      </div>
    </motion.div>
  );
};

const CarouselRow = ({ 
  items, 
  type, 
  label, 
  icon: Icon,
  direction = 'left' 
}: { 
  items: ContentItem[]; 
  type: 'video' | 'streaming' | 'reel';
  label: string;
  icon: React.ComponentType<{ className?: string }>;
  direction?: 'left' | 'right';
}) => {
  // Duplicate items for infinite scroll effect
  const duplicatedItems = [...items, ...items];
  
  return (
    <div className="relative py-3">
      {/* Row Label */}
      <div className="flex items-center gap-2 mb-3 px-4">
        <Icon className="w-4 h-4 text-primary" />
        <span className="text-sm font-orbitron text-foreground">{label}</span>
        <div className="flex-1 h-px bg-gradient-to-r from-primary/30 to-transparent" />
      </div>

      {/* Carousel */}
      <div className="relative overflow-hidden">
        <motion.div
          animate={{ 
            x: direction === 'left' ? ['0%', '-50%'] : ['-50%', '0%']
          }}
          transition={{ 
            duration: 30,
            repeat: Infinity,
            ease: 'linear'
          }}
          className="flex gap-4 px-4"
        >
          {duplicatedItems.map((item, index) => (
            <CarouselItem key={`${item.id}-${index}`} item={item} type={type} />
          ))}
        </motion.div>

        {/* Fade Edges */}
        <div className="absolute inset-y-0 left-0 w-20 bg-gradient-to-r from-background to-transparent pointer-events-none" />
        <div className="absolute inset-y-0 right-0 w-20 bg-gradient-to-l from-background to-transparent pointer-events-none" />
      </div>
    </div>
  );
};

export const InfiniteCarousel = () => {
  const videos = generateMockData('video', 12);
  const streamings = generateMockData('streaming', 12);
  const reels = generateMockData('reel', 20);

  return (
    <section className="py-6 space-y-2 border-y border-primary/10">
      <CarouselRow 
        items={videos} 
        type="video" 
        label="VIDEOS DESTACADOS" 
        icon={Play}
        direction="left"
      />
      <CarouselRow 
        items={streamings} 
        type="streaming" 
        label="STREAMINGS EN VIVO" 
        icon={Radio}
        direction="right"
      />
      <CarouselRow 
        items={reels} 
        type="reel" 
        label="REELS TRENDING" 
        icon={Film}
        direction="left"
      />
    </section>
  );
};
