import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Plus, Play, Eye, Heart, X, ChevronLeft, ChevronRight, Volume2, VolumeX, Pause } from 'lucide-react';

interface Story {
  id: string;
  userId: string;
  username: string;
  avatar: string;
  media: {
    type: 'image' | 'video';
    url: string;
    duration?: number;
  }[];
  views: number;
  likes: number;
  timestamp: Date;
  seen: boolean;
  isLive?: boolean;
}

const MOCK_STORIES: Story[] = [
  {
    id: '1',
    userId: 'user1',
    username: 'Isabella AI',
    avatar: 'https://images.unsplash.com/photo-1485827404703-89b55fcc595e?w=100&h=100&fit=crop',
    media: [
      { type: 'video', url: 'https://www.w3schools.com/html/mov_bbb.mp4', duration: 10 },
      { type: 'image', url: 'https://images.unsplash.com/photo-1677442136019-21780ecad995?w=800&h=1400&fit=crop' }
    ],
    views: 45200,
    likes: 12400,
    timestamp: new Date(Date.now() - 1000 * 60 * 30),
    seen: false,
    isLive: true
  },
  {
    id: '2',
    userId: 'user2',
    username: 'CryptoArtist',
    avatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=100&h=100&fit=crop',
    media: [
      { type: 'image', url: 'https://images.unsplash.com/photo-1634017839464-5c339afa5e92?w=800&h=1400&fit=crop' }
    ],
    views: 8900,
    likes: 2300,
    timestamp: new Date(Date.now() - 1000 * 60 * 45),
    seen: false
  },
  {
    id: '3',
    userId: 'user3',
    username: 'MetaCreator',
    avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=100&h=100&fit=crop',
    media: [
      { type: 'video', url: 'https://www.w3schools.com/html/movie.mp4', duration: 8 },
      { type: 'image', url: 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=800&h=1400&fit=crop' },
      { type: 'image', url: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=800&h=1400&fit=crop' }
    ],
    views: 23400,
    likes: 5600,
    timestamp: new Date(Date.now() - 1000 * 60 * 120),
    seen: true
  },
  {
    id: '4',
    userId: 'user4',
    username: 'DreamBuilder',
    avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&h=100&fit=crop',
    media: [
      { type: 'image', url: 'https://images.unsplash.com/photo-1614850523296-d8c1af93d400?w=800&h=1400&fit=crop' }
    ],
    views: 5600,
    likes: 890,
    timestamp: new Date(Date.now() - 1000 * 60 * 200),
    seen: false
  },
  {
    id: '5',
    userId: 'user5',
    username: 'SoundWave',
    avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=100&h=100&fit=crop',
    media: [
      { type: 'video', url: 'https://www.w3schools.com/html/mov_bbb.mp4', duration: 15 }
    ],
    views: 15800,
    likes: 4200,
    timestamp: new Date(Date.now() - 1000 * 60 * 300),
    seen: true
  },
  {
    id: '6',
    userId: 'user6',
    username: 'PixelMaster',
    avatar: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=100&h=100&fit=crop',
    media: [
      { type: 'image', url: 'https://images.unsplash.com/photo-1633356122544-f134324a6cee?w=800&h=1400&fit=crop' },
      { type: 'image', url: 'https://images.unsplash.com/photo-1639762681485-074b7f938ba0?w=800&h=1400&fit=crop' }
    ],
    views: 7200,
    likes: 1800,
    timestamp: new Date(Date.now() - 1000 * 60 * 400),
    seen: false
  },
  {
    id: '7',
    userId: 'user7',
    username: 'VRExplorer',
    avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=100&h=100&fit=crop',
    media: [
      { type: 'video', url: 'https://www.w3schools.com/html/movie.mp4', duration: 12 }
    ],
    views: 19300,
    likes: 6700,
    timestamp: new Date(Date.now() - 1000 * 60 * 500),
    seen: true
  },
  {
    id: '8',
    userId: 'user8',
    username: 'NeonArtist',
    avatar: 'https://images.unsplash.com/photo-1527980965255-d3b416303d12?w=100&h=100&fit=crop',
    media: [
      { type: 'image', url: 'https://images.unsplash.com/photo-1550745165-9bc0b252726f?w=800&h=1400&fit=crop' }
    ],
    views: 11200,
    likes: 3400,
    timestamp: new Date(Date.now() - 1000 * 60 * 600),
    seen: false
  }
];

export const StoriesBar = () => {
  const [stories] = useState<Story[]>(MOCK_STORIES);
  const [activeStory, setActiveStory] = useState<Story | null>(null);
  const [activeMediaIndex, setActiveMediaIndex] = useState(0);
  const [isPlaying, setIsPlaying] = useState(true);
  const [isMuted, setIsMuted] = useState(false);
  const [progress, setProgress] = useState(0);

  const formatViews = (num: number) => {
    if (num >= 1000000) return `${(num / 1000000).toFixed(1)}M`;
    if (num >= 1000) return `${(num / 1000).toFixed(1)}K`;
    return num.toString();
  };

  const openStory = (story: Story) => {
    setActiveStory(story);
    setActiveMediaIndex(0);
    setProgress(0);
    setIsPlaying(true);
  };

  const closeStory = () => {
    setActiveStory(null);
    setActiveMediaIndex(0);
    setProgress(0);
  };

  const nextMedia = () => {
    if (!activeStory) return;
    if (activeMediaIndex < activeStory.media.length - 1) {
      setActiveMediaIndex(prev => prev + 1);
      setProgress(0);
    } else {
      // Go to next story
      const currentIndex = stories.findIndex(s => s.id === activeStory.id);
      if (currentIndex < stories.length - 1) {
        setActiveStory(stories[currentIndex + 1]);
        setActiveMediaIndex(0);
        setProgress(0);
      } else {
        closeStory();
      }
    }
  };

  const prevMedia = () => {
    if (!activeStory) return;
    if (activeMediaIndex > 0) {
      setActiveMediaIndex(prev => prev - 1);
      setProgress(0);
    } else {
      // Go to previous story
      const currentIndex = stories.findIndex(s => s.id === activeStory.id);
      if (currentIndex > 0) {
        setActiveStory(stories[currentIndex - 1]);
        setActiveMediaIndex(stories[currentIndex - 1].media.length - 1);
        setProgress(0);
      }
    }
  };

  return (
    <>
      {/* Stories Bar */}
      <div className="relative mb-6">
        <div className="flex gap-4 overflow-x-auto pb-4 scrollbar-hide">
          {/* Add Story Button */}
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="flex-shrink-0 flex flex-col items-center gap-2"
          >
            <div className="relative w-20 h-20 rounded-2xl bg-gradient-to-br from-primary/20 to-secondary/20 border-2 border-dashed border-primary/40 flex items-center justify-center hover:border-primary transition-colors">
              <Plus className="w-8 h-8 text-primary" />
            </div>
            <span className="text-xs text-muted-foreground font-medium">Tu Historia</span>
          </motion.button>

          {/* Story Items */}
          {stories.map((story, index) => (
            <motion.button
              key={story.id}
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: index * 0.05 }}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => openStory(story)}
              className="flex-shrink-0 flex flex-col items-center gap-2"
            >
              <div className={`relative w-20 h-20 rounded-2xl p-0.5 ${
                story.seen 
                  ? 'bg-muted' 
                  : story.isLive 
                    ? 'bg-gradient-to-br from-red-500 via-pink-500 to-purple-500 animate-pulse' 
                    : 'bg-gradient-to-br from-primary via-secondary to-primary'
              }`}>
                <div className="w-full h-full rounded-[14px] overflow-hidden bg-card">
                  <img
                    src={story.avatar}
                    alt={story.username}
                    className="w-full h-full object-cover"
                  />
                </div>
                {story.isLive && (
                  <div className="absolute -bottom-1 left-1/2 -translate-x-1/2 px-2 py-0.5 bg-red-500 rounded-full text-[10px] font-bold text-white uppercase">
                    LIVE
                  </div>
                )}
                {!story.seen && !story.isLive && (
                  <div className="absolute -top-1 -right-1 w-4 h-4 bg-primary rounded-full flex items-center justify-center">
                    <span className="text-[8px] text-primary-foreground font-bold">{story.media.length}</span>
                  </div>
                )}
              </div>
              <div className="text-center">
                <p className="text-xs font-medium text-foreground truncate max-w-[80px]">{story.username}</p>
                <p className="text-[10px] text-muted-foreground flex items-center gap-1 justify-center">
                  <Eye className="w-3 h-3" /> {formatViews(story.views)}
                </p>
              </div>
            </motion.button>
          ))}
        </div>
      </div>

      {/* Story Viewer Modal */}
      <AnimatePresence>
        {activeStory && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[100] bg-black/95 flex items-center justify-center"
            onClick={closeStory}
          >
            <motion.div
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.8, opacity: 0 }}
              className="relative w-full max-w-lg h-[85vh] bg-card rounded-3xl overflow-hidden"
              onClick={e => e.stopPropagation()}
            >
              {/* Progress Bars */}
              <div className="absolute top-4 left-4 right-4 z-20 flex gap-1">
                {activeStory.media.map((_, idx) => (
                  <div key={idx} className="flex-1 h-1 bg-white/20 rounded-full overflow-hidden">
                    <motion.div
                      className="h-full bg-white"
                      initial={{ width: 0 }}
                      animate={{ 
                        width: idx < activeMediaIndex ? '100%' : idx === activeMediaIndex ? `${progress}%` : '0%' 
                      }}
                    />
                  </div>
                ))}
              </div>

              {/* Header */}
              <div className="absolute top-8 left-4 right-4 z-20 flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full overflow-hidden ring-2 ring-primary">
                    <img src={activeStory.avatar} alt={activeStory.username} className="w-full h-full object-cover" />
                  </div>
                  <div>
                    <p className="text-sm font-semibold text-white">{activeStory.username}</p>
                    <p className="text-xs text-white/60">hace 2h</p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => setIsMuted(!isMuted)}
                    className="p-2 rounded-full bg-black/40 text-white hover:bg-black/60 transition-colors"
                  >
                    {isMuted ? <VolumeX className="w-5 h-5" /> : <Volume2 className="w-5 h-5" />}
                  </button>
                  <button
                    onClick={() => setIsPlaying(!isPlaying)}
                    className="p-2 rounded-full bg-black/40 text-white hover:bg-black/60 transition-colors"
                  >
                    {isPlaying ? <Pause className="w-5 h-5" /> : <Play className="w-5 h-5" />}
                  </button>
                  <button
                    onClick={closeStory}
                    className="p-2 rounded-full bg-black/40 text-white hover:bg-black/60 transition-colors"
                  >
                    <X className="w-5 h-5" />
                  </button>
                </div>
              </div>

              {/* Media Content */}
              <div className="w-full h-full">
                {activeStory.media[activeMediaIndex].type === 'video' ? (
                  <video
                    src={activeStory.media[activeMediaIndex].url}
                    className="w-full h-full object-cover"
                    autoPlay
                    muted={isMuted}
                    loop={false}
                    playsInline
                    onTimeUpdate={(e) => {
                      const video = e.currentTarget;
                      setProgress((video.currentTime / video.duration) * 100);
                    }}
                    onEnded={nextMedia}
                  />
                ) : (
                  <motion.img
                    key={activeMediaIndex}
                    initial={{ opacity: 0, scale: 1.1 }}
                    animate={{ opacity: 1, scale: 1 }}
                    src={activeStory.media[activeMediaIndex].url}
                    alt=""
                    className="w-full h-full object-cover"
                    onLoad={() => {
                      // Auto progress for images
                      let prog = 0;
                      const interval = setInterval(() => {
                        if (isPlaying) {
                          prog += 2;
                          setProgress(prog);
                          if (prog >= 100) {
                            clearInterval(interval);
                            nextMedia();
                          }
                        }
                      }, 100);
                      return () => clearInterval(interval);
                    }}
                  />
                )}
              </div>

              {/* Navigation Areas */}
              <div className="absolute inset-0 z-10 flex">
                <button 
                  onClick={prevMedia}
                  className="w-1/3 h-full flex items-center justify-start pl-2 opacity-0 hover:opacity-100 transition-opacity"
                >
                  <ChevronLeft className="w-8 h-8 text-white/80" />
                </button>
                <div className="w-1/3" />
                <button 
                  onClick={nextMedia}
                  className="w-1/3 h-full flex items-center justify-end pr-2 opacity-0 hover:opacity-100 transition-opacity"
                >
                  <ChevronRight className="w-8 h-8 text-white/80" />
                </button>
              </div>

              {/* Footer Stats */}
              <div className="absolute bottom-0 left-0 right-0 z-20 p-6 bg-gradient-to-t from-black/80 to-transparent">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-4">
                    <div className="flex items-center gap-2 text-white">
                      <Eye className="w-5 h-5" />
                      <span className="text-sm font-medium">{formatViews(activeStory.views)}</span>
                    </div>
                    <div className="flex items-center gap-2 text-white">
                      <Heart className="w-5 h-5" />
                      <span className="text-sm font-medium">{formatViews(activeStory.likes)}</span>
                    </div>
                  </div>
                  <motion.button
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.9 }}
                    className="px-6 py-2 bg-gradient-to-r from-primary to-secondary rounded-full text-sm font-semibold text-primary-foreground"
                  >
                    Enviar Regalo
                  </motion.button>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};
