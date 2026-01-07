import { motion } from 'framer-motion';
import { Shield, Database, Brain, Layers } from 'lucide-react';

const stackLayers = [
  {
    id: 'L3',
    name: 'Frontend 4D',
    description: 'UX sensorial, DreamSpaces, Social Nexus, Wallet',
    tech: 'React + R3F/Three.js + Tailwind',
    icon: Layers,
  },
  {
    id: 'L2',
    name: 'Isabella AI Core',
    description: 'Gobernanza ética, veto, guidance y orquestación',
    tech: 'Edge Functions + LLM',
    icon: Brain,
  },
  {
    id: 'L1',
    name: 'MSR Ledger',
    description: 'Economía 70/20/10 y trazabilidad inmutable',
    tech: 'PostgreSQL + Blockchain Triggers',
    icon: Database,
  },
  {
    id: 'L0',
    name: 'Anubis Sentinel',
    description: 'Seguridad, cifrado caótico, privacidad visual',
    tech: 'Cryptography + GLSL Shaders',
    icon: Shield,
  },
];

export const SovereignStack = () => {
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { staggerChildren: 0.15 },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, x: -50 },
    visible: {
      opacity: 1,
      x: 0,
      transition: { duration: 0.6, ease: 'easeOut' },
    },
  };

  const colors = ['text-primary', 'text-isabella', 'text-secondary', 'text-primary'];
  const bgColors = ['bg-primary/10', 'bg-isabella/10', 'bg-secondary/10', 'bg-primary/10'];
  const borderColors = ['border-primary/20', 'border-isabella/20', 'border-secondary/20', 'border-primary/20'];

  return (
    <section className="py-24 relative overflow-hidden">
      {/* Background elements */}
      <div className="absolute inset-0 bg-gradient-to-b from-abyss via-card/50 to-abyss" />
      <div className="absolute right-0 top-1/2 -translate-y-1/2 w-96 h-96 bg-primary/5 rounded-full blur-3xl" />
      
      <div className="container mx-auto px-6 relative z-10">
        {/* Header */}
        <motion.div 
          className="text-center mb-16"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
        >
          <h2 className="font-orbitron text-3xl md:text-5xl font-bold mb-4">
            <span className="text-gradient-sovereign">The Sovereign Stack</span>
          </h2>
          <p className="text-muted-foreground font-inter max-w-2xl mx-auto">
            Arquitectura de capas L0-L3 que garantiza soberanía, seguridad y escalabilidad civilizatoria
          </p>
        </motion.div>

        {/* Stack visualization */}
        <motion.div
          className="max-w-4xl mx-auto space-y-4"
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
        >
          {stackLayers.map((layer, index) => {
            const Icon = layer.icon;
            const colorClass = colors[index];
            const bgClass = bgColors[index];
            const borderClass = borderColors[index];
            
            return (
              <motion.div
                key={layer.id}
                variants={itemVariants}
                className="relative group"
              >
                <div className={`relative p-6 rounded-xl bg-card/50 border border-border/50 backdrop-blur-sm transition-all duration-300 hover:border-primary/50 hover:bg-card/80`}>
                  {/* Layer indicator */}
                  <div className="absolute -left-3 top-1/2 -translate-y-1/2 w-6 h-6 rounded-full bg-card border-2 border-primary flex items-center justify-center">
                    <span className="text-xs font-orbitron font-bold text-primary">{3 - index}</span>
                  </div>
                  
                  {/* Connector line */}
                  {index < stackLayers.length - 1 && (
                    <div className="absolute -left-0.5 top-full w-0.5 h-4 bg-gradient-to-b from-primary/50 to-transparent" />
                  )}

                  <div className="flex items-start gap-4 ml-4">
                    {/* Icon */}
                    <div className={`p-3 rounded-lg ${bgClass} border ${borderClass}`}>
                      <Icon className={`w-6 h-6 ${colorClass}`} />
                    </div>

                    {/* Content */}
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-2">
                        <span className="font-orbitron text-xs text-muted-foreground">{layer.id}</span>
                        <h3 className="font-orbitron text-lg font-semibold text-foreground">
                          {layer.name}
                        </h3>
                      </div>
                      <p className="text-muted-foreground font-inter text-sm mb-2">
                        {layer.description}
                      </p>
                      <span className="inline-block px-3 py-1 rounded-full bg-muted/50 text-xs font-inter text-muted-foreground">
                        {layer.tech}
                      </span>
                    </div>
                  </div>
                </div>
              </motion.div>
            );
          })}
        </motion.div>
      </div>
    </section>
  );
};
