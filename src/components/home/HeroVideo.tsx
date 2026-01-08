import { motion } from 'framer-motion';
import { Play, Eye, Heart, Share2, Volume2, Maximize2 } from 'lucide-react';

export const HeroVideo = () => {
  return (
    <motion.section
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="relative w-full aspect-video max-h-[60vh] rounded-2xl overflow-hidden border border-primary/20 group"
    >
      {/* Video Placeholder - Futuristic Gradient Background */}
      <div className="absolute inset-0 bg-gradient-to-br from-abyss via-abyss-lighter to-abyss">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_hsl(185_100%_50%_/_0.15)_0%,_transparent_70%)]" />
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_bottom_right,_hsl(280_70%_50%_/_0.1)_0%,_transparent_50%)]" />
        
        {/* Animated Grid */}
        <div className="absolute inset-0 opacity-20">
          <div 
            className="w-full h-full"
            style={{
              backgroundImage: `
                linear-gradient(hsl(185 100% 50% / 0.1) 1px, transparent 1px),
                linear-gradient(90deg, hsl(185 100% 50% / 0.1) 1px, transparent 1px)
              `,
              backgroundSize: '50px 50px'
            }}
          />
        </div>

        {/* Floating Orbs */}
        <motion.div
          animate={{ 
            scale: [1, 1.2, 1],
            opacity: [0.3, 0.6, 0.3]
          }}
          transition={{ duration: 4, repeat: Infinity }}
          className="absolute top-1/4 left-1/4 w-32 h-32 rounded-full bg-primary/20 blur-3xl"
        />
        <motion.div
          animate={{ 
            scale: [1.2, 1, 1.2],
            opacity: [0.2, 0.5, 0.2]
          }}
          transition={{ duration: 5, repeat: Infinity }}
          className="absolute bottom-1/4 right-1/4 w-40 h-40 rounded-full bg-isabella/20 blur-3xl"
        />
      </div>

      {/* Play Button Center */}
      <motion.div
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.95 }}
        className="absolute inset-0 flex items-center justify-center cursor-pointer"
      >
        <div className="relative">
          <div className="absolute inset-0 bg-primary/30 rounded-full blur-xl animate-pulse" />
          <div className="relative w-20 h-20 rounded-full bg-gradient-to-br from-primary to-cyber-cyan flex items-center justify-center border border-primary/50 shadow-[0_0_30px_hsl(185_100%_50%_/_0.5)]">
            <Play className="w-8 h-8 text-background ml-1" fill="currentColor" />
          </div>
        </div>
      </motion.div>

      {/* Video Info Overlay */}
      <div className="absolute bottom-0 left-0 right-0 p-6 bg-gradient-to-t from-abyss via-abyss/80 to-transparent">
        <motion.div
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.3 }}
        >
          <div className="flex items-center gap-2 mb-2">
            <span className="px-2 py-0.5 text-xs font-orbitron bg-primary/20 text-primary rounded border border-primary/30">
              TRENDING #1
            </span>
            <span className="px-2 py-0.5 text-xs font-orbitron bg-isabella/20 text-isabella rounded border border-isabella/30">
              LIVE
            </span>
          </div>
          
          <h2 className="text-2xl md:text-3xl font-orbitron font-bold text-foreground mb-2">
            DreamSpace Genesis: El Nacimiento de una Civilización Digital
          </h2>
          
          <div className="flex items-center gap-4 text-muted-foreground text-sm">
            <div className="flex items-center gap-1">
              <Eye className="w-4 h-4" />
              <span>2.4M</span>
            </div>
            <div className="flex items-center gap-1">
              <Heart className="w-4 h-4 text-destructive" />
              <span>847K</span>
            </div>
            <span className="text-primary">@TAMV_Official</span>
          </div>
        </motion.div>
      </div>

      {/* Controls */}
      <div className="absolute top-4 right-4 flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
        <button className="p-2 rounded-lg bg-abyss/80 border border-primary/20 text-foreground hover:bg-primary/20 transition-colors">
          <Volume2 className="w-4 h-4" />
        </button>
        <button className="p-2 rounded-lg bg-abyss/80 border border-primary/20 text-foreground hover:bg-primary/20 transition-colors">
          <Share2 className="w-4 h-4" />
        </button>
        <button className="p-2 rounded-lg bg-abyss/80 border border-primary/20 text-foreground hover:bg-primary/20 transition-colors">
          <Maximize2 className="w-4 h-4" />
        </button>
      </div>

      {/* Scan Line Effect */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        <motion.div
          animate={{ y: ['0%', '100%'] }}
          transition={{ duration: 3, repeat: Infinity, ease: 'linear' }}
          className="w-full h-px bg-gradient-to-r from-transparent via-primary/50 to-transparent"
        />
      </div>
    </motion.section>
  );
};
