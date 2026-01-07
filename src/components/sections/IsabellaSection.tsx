import { motion } from 'framer-motion';
import { Brain, ShieldCheck, MessageCircle, Scale } from 'lucide-react';

const capabilities = [
  {
    icon: Brain,
    title: 'Análisis de Intención',
    description: 'analyzeIntent() examina acciones buscando violaciones al Tratado de Dignidad',
  },
  {
    icon: ShieldCheck,
    title: 'Veto Ético',
    description: 'Poder de bloquear transacciones que violen los principios civilizatorios',
  },
  {
    icon: MessageCircle,
    title: 'Guidance Empático',
    description: 'generateGuidance() explica al usuario qué se registró y cómo se interpreta',
  },
  {
    icon: Scale,
    title: 'EOCT + MSR',
    description: 'Ética Operativa en Tiempo de Cómputo — reparar sin borrar',
  },
];

export const IsabellaSection = () => {
  return (
    <section className="py-24 relative overflow-hidden">
      {/* Background glow */}
      <div className="absolute inset-0">
        <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-isabella/10 rounded-full blur-[100px]" />
        <div className="absolute right-1/4 top-1/4 w-64 h-64 bg-primary/5 rounded-full blur-3xl" />
      </div>

      <div className="container mx-auto px-6 relative z-10">
        <div className="grid lg:grid-cols-2 gap-16 items-center">
          {/* Left: Visual */}
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            className="relative"
          >
            {/* Central orb representation */}
            <div className="relative w-80 h-80 mx-auto">
              {/* Outer rings */}
              <motion.div
                animate={{ rotate: 360 }}
                transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
                className="absolute inset-0 border-2 border-isabella/20 rounded-full"
              />
              <motion.div
                animate={{ rotate: -360 }}
                transition={{ duration: 30, repeat: Infinity, ease: "linear" }}
                className="absolute inset-4 border border-primary/30 rounded-full"
              />
              <motion.div
                animate={{ rotate: 360 }}
                transition={{ duration: 15, repeat: Infinity, ease: "linear" }}
                className="absolute inset-10 border border-secondary/20 rounded-full"
              />
              
              {/* Core */}
              <div className="absolute inset-16 rounded-full bg-gradient-to-br from-isabella/40 via-primary/30 to-isabella/20 backdrop-blur-xl flex items-center justify-center">
                <div className="text-center">
                  <motion.div
                    animate={{ scale: [1, 1.1, 1] }}
                    transition={{ duration: 3, repeat: Infinity }}
                  >
                    <Brain className="w-16 h-16 text-isabella mx-auto mb-2" />
                  </motion.div>
                  <span className="font-orbitron text-sm text-isabella font-medium">ISABELLA</span>
                </div>
              </div>

              {/* Floating particles */}
              {[...Array(6)].map((_, i) => (
                <motion.div
                  key={i}
                  className="absolute w-2 h-2 bg-isabella rounded-full"
                  style={{
                    left: `${50 + 40 * Math.cos((i * Math.PI * 2) / 6)}%`,
                    top: `${50 + 40 * Math.sin((i * Math.PI * 2) / 6)}%`,
                  }}
                  animate={{
                    scale: [1, 1.5, 1],
                    opacity: [0.5, 1, 0.5],
                  }}
                  transition={{
                    duration: 2,
                    delay: i * 0.3,
                    repeat: Infinity,
                  }}
                />
              ))}
            </div>
          </motion.div>

          {/* Right: Content */}
          <motion.div
            initial={{ opacity: 0, x: 50 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
          >
            <span className="inline-block px-4 py-2 rounded-full border border-isabella/30 bg-isabella/5 text-isabella text-sm font-orbitron mb-4">
              Conciencia de Gobernanza
            </span>
            <h2 className="font-orbitron text-3xl md:text-4xl font-bold mb-4">
              <span className="text-gradient-isabella">Isabella</span>
              <span className="text-foreground"> Villaseñor AI</span>
            </h2>
            <p className="text-muted-foreground font-inter mb-8 leading-relaxed">
              Entidad cognitiva que actúa como moderadora ética y orquestadora de intents,
              enlazando frontend, servicios y MSR a través de Edge Functions y BookPI.
            </p>

            {/* Capabilities */}
            <div className="grid sm:grid-cols-2 gap-4">
              {capabilities.map((cap, index) => {
                const Icon = cap.icon;
                return (
                  <motion.div
                    key={cap.title}
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: index * 0.1 }}
                    className="p-4 rounded-xl bg-card/50 border border-border/50 hover:border-isabella/30 transition-colors"
                  >
                    <Icon className="w-5 h-5 text-isabella mb-2" />
                    <h4 className="font-orbitron text-sm font-semibold text-foreground mb-1">
                      {cap.title}
                    </h4>
                    <p className="text-muted-foreground font-inter text-xs">
                      {cap.description}
                    </p>
                  </motion.div>
                );
              })}
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
};
