import { motion, AnimatePresence } from 'framer-motion';
import { Play, Pause, Volume2, SkipBack, SkipForward, Heart, Share2, Repeat, Shuffle, ChevronDown, ChevronUp, X, Minimize2, Maximize2 } from 'lucide-react';
import { useState } from 'react';

type PlayerState = 'expanded' | 'minimized' | 'hidden';

export const MusicPlayerCollapsible = () => {
  const [isPlaying, setIsPlaying] = useState(false);
  const [playerState, setPlayerState] = useState<PlayerState>('expanded');
  const [volume, setVolume] = useState(75);

  if (playerState === 'hidden') {
    return (
      <motion.button
        initial={{ scale: 0, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0, opacity: 0 }}
        onClick={() => setPlayerState('minimized')}
        className="fixed bottom-4 right-4 z-50 p-4 rounded-full bg-primary text-background shadow-lg hover:bg-primary/90 transition-colors"
        title="Abrir reproductor"
      >
        <Play className="w-6 h-6" />
      </motion.button>
    );
  }

  return (
    <AnimatePresence mode="wait">
      {playerState === 'minimized' ? (
        <motion.div
          key="minimized"
          initial={{ y: 100, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: 100, opacity: 0 }}
          className="fixed bottom-4 right-4 z-50"
        >
          <div className="flex items-center gap-3 p-3 rounded-2xl glass-sovereign border border-primary/20">
            {/* Album Art */}
            <motion.div
              animate={isPlaying ? { rotate: 360 } : {}}
              transition={{ duration: 3, repeat: Infinity, ease: 'linear' }}
              className="relative w-12 h-12 rounded-xl overflow-hidden border border-primary/20"
            >
              <div className="absolute inset-0 bg-gradient-to-br from-primary/30 to-isabella/30" />
              <div className="absolute inset-1.5 rounded-lg bg-abyss flex items-center justify-center">
                <span className="text-lg">🎵</span>
              </div>
            </motion.div>

            {/* Track Info */}
            <div className="min-w-0 max-w-[120px]">
              <p className="text-sm font-medium text-foreground truncate">Nebula Dreams</p>
              <p className="text-xs text-muted-foreground truncate">@cosmic_beats</p>
            </div>

            {/* Mini Controls */}
            <div className="flex items-center gap-1">
              <motion.button
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => setIsPlaying(!isPlaying)}
                className="p-2 rounded-full bg-primary text-background hover:bg-primary/90 transition-colors"
              >
                {isPlaying ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4 ml-0.5" />}
              </motion.button>
              <button
                onClick={() => setPlayerState('expanded')}
                className="p-2 rounded-lg hover:bg-primary/10 text-muted-foreground hover:text-foreground transition-colors"
                title="Expandir"
              >
                <Maximize2 className="w-4 h-4" />
              </button>
              <button
                onClick={() => setPlayerState('hidden')}
                className="p-2 rounded-lg hover:bg-destructive/10 text-muted-foreground hover:text-destructive transition-colors"
                title="Cerrar"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          </div>
        </motion.div>
      ) : (
        <motion.div
          key="expanded"
          initial={{ y: 100, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: 100, opacity: 0 }}
          className="fixed bottom-0 left-0 right-0 z-50"
        >
          <div className="mx-4 mb-4">
            <div className="max-w-[1200px] mx-auto">
              <div className="relative p-4 rounded-2xl glass-sovereign border border-primary/20 overflow-hidden">
                {/* Background Gradient */}
                <div className="absolute inset-0 bg-gradient-to-r from-primary/5 via-transparent to-isabella/5 pointer-events-none" />
                
                {/* Collapse/Close Controls */}
                <div className="absolute top-2 right-2 flex items-center gap-1">
                  <button
                    onClick={() => setPlayerState('minimized')}
                    className="p-1.5 rounded-lg hover:bg-primary/10 text-muted-foreground hover:text-foreground transition-colors"
                    title="Minimizar"
                  >
                    <Minimize2 className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => setPlayerState('hidden')}
                    className="p-1.5 rounded-lg hover:bg-destructive/10 text-muted-foreground hover:text-destructive transition-colors"
                    title="Cerrar"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>

                <div className="relative flex items-center gap-6">
                  {/* Now Playing */}
                  <div className="flex items-center gap-4 min-w-[250px]">
                    <motion.div
                      animate={isPlaying ? { rotate: 360 } : {}}
                      transition={{ duration: 3, repeat: Infinity, ease: 'linear' }}
                      className="relative w-14 h-14 rounded-xl overflow-hidden border border-primary/20"
                    >
                      <div className="absolute inset-0 bg-gradient-to-br from-primary/30 to-isabella/30" />
                      <div className="absolute inset-2 rounded-lg bg-abyss flex items-center justify-center">
                        <span className="text-xl">🎵</span>
                      </div>
                    </motion.div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-foreground truncate">Nebula Dreams (Live)</p>
                      <p className="text-xs text-muted-foreground truncate">@cosmic_beats • Concierto Sensorial</p>
                    </div>
                    <button className="p-2 rounded-lg hover:bg-primary/10 text-destructive transition-colors">
                      <Heart className="w-5 h-5" fill="currentColor" />
                    </button>
                  </div>

                  {/* Controls */}
                  <div className="flex-1 flex flex-col items-center gap-2">
                    <div className="flex items-center gap-4">
                      <button className="p-2 text-muted-foreground hover:text-foreground transition-colors">
                        <Shuffle className="w-4 h-4" />
                      </button>
                      <button className="p-2 text-muted-foreground hover:text-foreground transition-colors">
                        <SkipBack className="w-5 h-5" />
                      </button>
                      <motion.button
                        whileHover={{ scale: 1.1 }}
                        whileTap={{ scale: 0.95 }}
                        onClick={() => setIsPlaying(!isPlaying)}
                        className="p-3 rounded-full bg-primary text-background hover:bg-primary/90 transition-colors"
                      >
                        {isPlaying ? <Pause className="w-5 h-5" /> : <Play className="w-5 h-5 ml-0.5" />}
                      </motion.button>
                      <button className="p-2 text-muted-foreground hover:text-foreground transition-colors">
                        <SkipForward className="w-5 h-5" />
                      </button>
                      <button className="p-2 text-muted-foreground hover:text-foreground transition-colors">
                        <Repeat className="w-4 h-4" />
                      </button>
                    </div>

                    {/* Progress */}
                    <div className="w-full max-w-md flex items-center gap-3">
                      <span className="text-[10px] text-muted-foreground w-10 text-right">2:34</span>
                      <div className="flex-1 h-1 bg-muted rounded-full overflow-hidden group cursor-pointer">
                        <motion.div
                          className="h-full bg-gradient-to-r from-primary to-cyber-cyan rounded-full relative"
                          style={{ width: '45%' }}
                        >
                          <div className="absolute right-0 top-1/2 -translate-y-1/2 w-3 h-3 rounded-full bg-primary opacity-0 group-hover:opacity-100 transition-opacity" />
                        </motion.div>
                      </div>
                      <span className="text-[10px] text-muted-foreground w-10">5:42</span>
                    </div>
                  </div>

                  {/* Volume & Actions */}
                  <div className="flex items-center gap-4 min-w-[150px] justify-end pr-12">
                    <div className="flex items-center gap-2">
                      <Volume2 className="w-4 h-4 text-muted-foreground" />
                      <div className="w-20 h-1 bg-muted rounded-full overflow-hidden">
                        <div className="h-full bg-primary rounded-full" style={{ width: `${volume}%` }} />
                      </div>
                    </div>
                    <button className="p-2 rounded-lg hover:bg-primary/10 text-muted-foreground hover:text-foreground transition-colors">
                      <Share2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>

                {/* Audio Visualizer */}
                <div className="absolute bottom-0 left-0 right-0 h-1 flex gap-px overflow-hidden">
                  {Array.from({ length: 100 }).map((_, i) => (
                    <motion.div
                      key={i}
                      animate={isPlaying ? {
                        scaleY: [0.3, Math.random() * 0.7 + 0.3, 0.3],
                      } : { scaleY: 0.3 }}
                      transition={{
                        duration: 0.5,
                        repeat: Infinity,
                        delay: i * 0.02,
                      }}
                      className="flex-1 bg-gradient-to-t from-primary to-primary/50 origin-bottom"
                    />
                  ))}
                </div>
              </div>
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};
