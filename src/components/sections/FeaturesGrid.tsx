import { motion } from 'framer-motion';
import { Sparkles, Globe, Lock, BookOpen, Fingerprint, Radio } from 'lucide-react';

const features = [
  {
    icon: Sparkles,
    title: 'DreamSpaces',
    description: 'Entornos XR multiusuario donde creadores ensamblan escenas inmersivas sin código',
    color: 'primary',
  },
  {
    icon: Globe,
    title: 'Social Nexus 4D',
    description: 'Red social esférica con navegación en eje Z, priorizando relevancia ética sobre adicción',
    color: 'primary',
  },
  {
    icon: Lock,
    title: 'Anubis Sentinel',
    description: 'Cifrado caótico con entropía humana y shaders de ofuscación visual',
    color: 'primary',
  },
  {
    icon: BookOpen,
    title: 'BookPI Audit',
    description: 'Archivo histórico inviolable con SHA-256 para trazabilidad total',
    color: 'secondary',
  },
  {
    icon: Fingerprint,
    title: 'ADN Digital',
    description: 'Identidad soberana con niveles de confianza verificables por Isabella',
    color: 'isabella',
  },
  {
    icon: Radio,
    title: 'MSR Blockchain',
    description: 'Sexta blockchain mundial orientada a verdad y reparación, no especulación',
    color: 'secondary',
  },
];

export const FeaturesGrid = () => {
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { staggerChildren: 0.1 },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20, scale: 0.95 },
    visible: {
      opacity: 1,
      y: 0,
      scale: 1,
      transition: { duration: 0.5 },
    },
  };

  return (
    <section className="py-24 relative">
      <div className="absolute inset-0 bg-gradient-to-b from-background via-card/30 to-background" />
      
      <div className="container mx-auto px-6 relative z-10">
        <motion.div
          className="text-center mb-16"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
        >
          <h2 className="font-orbitron text-3xl md:text-5xl font-bold mb-4">
            Módulos <span className="text-gradient-sovereign">Funcionales</span>
          </h2>
          <p className="text-muted-foreground font-inter max-w-2xl mx-auto">
            Del creador al libro de verdad — cada pieza del ecosistema civilizatorio
          </p>
        </motion.div>

        <motion.div
          className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6 max-w-6xl mx-auto"
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
        >
          {features.map((feature) => {
            const Icon = feature.icon;
            const colorClass = feature.color === 'isabella' ? 'text-isabella' : feature.color === 'secondary' ? 'text-secondary' : 'text-primary';
            const bgClass = feature.color === 'isabella' ? 'bg-isabella/10' : feature.color === 'secondary' ? 'bg-secondary/10' : 'bg-primary/10';
            const borderClass = feature.color === 'isabella' ? 'hover:border-isabella/50' : feature.color === 'secondary' ? 'hover:border-secondary/50' : 'hover:border-primary/50';
            
            return (
              <motion.div
                key={feature.title}
                variants={itemVariants}
                className={`group p-6 rounded-2xl bg-card/50 border border-border/50 backdrop-blur-sm transition-all duration-300 ${borderClass} hover:bg-card`}
              >
                <div className={`w-12 h-12 rounded-xl ${bgClass} flex items-center justify-center mb-4 group-hover:scale-110 transition-transform`}>
                  <Icon className={`w-6 h-6 ${colorClass}`} />
                </div>
                <h3 className="font-orbitron text-lg font-semibold text-foreground mb-2">
                  {feature.title}
                </h3>
                <p className="text-muted-foreground font-inter text-sm leading-relaxed">
                  {feature.description}
                </p>
              </motion.div>
            );
          })}
        </motion.div>
      </div>
    </section>
  );
};
