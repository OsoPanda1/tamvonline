import { motion } from 'framer-motion';
import { SovereignButton } from '../ui/SovereignButton';
import { ChevronDown, Sparkles } from 'lucide-react';

export const Hero = () => {
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.15,
        delayChildren: 0.2,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 30 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.8, ease: [0.25, 0.46, 0.45, 0.94] },
    },
  };

  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden bg-background">
      {/* Animated background */}
      <div className="absolute inset-0">
        <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-transparent to-secondary/5" />
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-primary/10 rounded-full blur-[100px] animate-pulse" />
        <div className="absolute bottom-1/4 right-1/4 w-80 h-80 bg-isabella/10 rounded-full blur-[80px] animate-pulse" style={{ animationDelay: '1s' }} />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-64 h-64 bg-secondary/10 rounded-full blur-[60px] animate-pulse" style={{ animationDelay: '2s' }} />
      </div>
      
      {/* Grid pattern */}
      <div className="absolute inset-0 opacity-[0.03]" style={{
        backgroundImage: 'linear-gradient(hsl(var(--primary)) 1px, transparent 1px), linear-gradient(90deg, hsl(var(--primary)) 1px, transparent 1px)',
        backgroundSize: '50px 50px'
      }} />
      
      {/* Content */}
      <motion.div
        className="relative z-10 container mx-auto px-6 text-center"
        variants={containerVariants}
        initial="hidden"
        animate="visible"
      >
        {/* Tag */}
        <motion.div variants={itemVariants} className="mb-6">
          <span className="inline-flex items-center gap-2 px-4 py-2 rounded-full border border-primary/30 bg-primary/5 text-primary text-sm font-inter tracking-wide backdrop-blur-sm">
            <Sparkles className="w-4 h-4" />
            Infraestructura de Soberanía Digital Triple Federada
          </span>
        </motion.div>

        {/* Title */}
        <motion.h1 
          variants={itemVariants}
          className="font-orbitron text-5xl md:text-7xl lg:text-8xl font-bold mb-6 leading-tight"
        >
          <span className="text-gradient-sovereign">TAMV</span>
          <span className="text-foreground"> MD-X4</span>
          <sup className="text-primary text-2xl md:text-3xl align-super">™</sup>
        </motion.h1>

        {/* Subtitle */}
        <motion.p 
          variants={itemVariants}
          className="font-inter text-lg md:text-xl text-muted-foreground max-w-3xl mx-auto mb-4 leading-relaxed"
        >
          <span className="text-foreground font-medium">Tierra de Arte, Memoria y Verdad</span>
          <br />
          Metaverso social • Economía distribuida • Blockchain soberana • Gobernanza ética
        </motion.p>

        {/* Isabella tagline */}
        <motion.p 
          variants={itemVariants}
          className="text-gradient-isabella font-inter text-base md:text-lg mb-10 italic"
        >
          Guiado por Isabella — Conciencia de Gobernanza AI
        </motion.p>

        {/* CTAs */}
        <motion.div 
          variants={itemVariants}
          className="flex flex-col sm:flex-row gap-4 justify-center items-center"
        >
          <SovereignButton variant="primary" size="lg">
            Explorar Ecosistema
          </SovereignButton>
          <SovereignButton variant="gold" size="lg">
            Whitepaper MSR
          </SovereignButton>
        </motion.div>

        {/* Scroll indicator */}
        <motion.div 
          variants={itemVariants}
          className="absolute bottom-10 left-1/2 -translate-x-1/2"
        >
          <motion.div
            animate={{ y: [0, 10, 0] }}
            transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
            className="text-muted-foreground hover:text-primary transition-colors cursor-pointer"
          >
            <ChevronDown className="w-8 h-8" />
          </motion.div>
        </motion.div>
      </motion.div>
    </section>
  );
};
