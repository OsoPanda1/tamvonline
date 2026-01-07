import { motion } from 'framer-motion';
import { Wallet, Users, Cpu, ArrowRight } from 'lucide-react';

const economySplits = [
  {
    percentage: 70,
    label: 'Creador',
    description: 'Liquidación inmediata en Nubiwallet/MSR',
    icon: Wallet,
    colorClass: 'text-secondary',
    bgClass: 'bg-secondary/10',
    borderClass: 'border-secondary/30',
  },
  {
    percentage: 20,
    label: 'Fondo Fénix',
    description: 'Resiliencia comunitaria',
    icon: Users,
    colorClass: 'text-fenix',
    bgClass: 'bg-fenix/10',
    borderClass: 'border-fenix/30',
  },
  {
    percentage: 10,
    label: 'Kernel',
    description: 'Infraestructura y desarrollo',
    icon: Cpu,
    colorClass: 'text-kernel',
    bgClass: 'bg-kernel/10',
    borderClass: 'border-kernel/30',
  },
];

export const EconomySection = () => {
  return (
    <section className="py-24 relative overflow-hidden">
      {/* Background */}
      <div className="absolute inset-0">
        <div className="absolute left-0 top-0 w-full h-full bg-gradient-to-br from-secondary/5 via-transparent to-fenix/5" />
        <div className="absolute left-1/4 bottom-1/4 w-64 h-64 bg-secondary/10 rounded-full blur-3xl" />
      </div>

      <div className="container mx-auto px-6 relative z-10">
        {/* Header */}
        <motion.div
          className="text-center mb-16"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
        >
          <span className="inline-block px-4 py-2 rounded-full border border-secondary/30 bg-secondary/5 text-secondary text-sm font-orbitron mb-4">
            Regla Quantum-Split
          </span>
          <h2 className="font-orbitron text-3xl md:text-5xl font-bold mb-4">
            Economía <span className="text-secondary">70/20/10</span>
          </h2>
          <p className="text-muted-foreground font-inter max-w-2xl mx-auto">
            Distribución justa y transparente que prioriza al creador mientras construye resiliencia comunitaria
          </p>
        </motion.div>

        {/* Visual distribution */}
        <div className="max-w-4xl mx-auto mb-16">
          <motion.div 
            className="h-8 rounded-full overflow-hidden flex shadow-lg"
            initial={{ scaleX: 0 }}
            whileInView={{ scaleX: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 1, ease: "easeOut" }}
            style={{ transformOrigin: 'left' }}
          >
            <div className="bg-gradient-to-r from-secondary to-secondary/80 flex-[7] flex items-center justify-center">
              <span className="font-orbitron text-sm font-bold text-secondary-foreground">70%</span>
            </div>
            <div className="bg-gradient-to-r from-fenix to-fenix/80 flex-[2] flex items-center justify-center">
              <span className="font-orbitron text-xs font-bold text-white">20%</span>
            </div>
            <div className="bg-gradient-to-r from-kernel to-kernel/80 flex-[1] flex items-center justify-center">
              <span className="font-orbitron text-xs font-bold text-white">10%</span>
            </div>
          </motion.div>
        </div>

        {/* Cards */}
        <div className="grid md:grid-cols-3 gap-6 max-w-5xl mx-auto">
          {economySplits.map((split, index) => {
            const Icon = split.icon;
            return (
              <motion.div
                key={split.label}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.15 }}
                className={`p-6 rounded-2xl ${split.bgClass} border ${split.borderClass} backdrop-blur-sm hover:scale-105 transition-transform duration-300`}
              >
                <div className="flex items-center gap-4 mb-4">
                  <div className={`p-3 rounded-xl ${split.bgClass}`}>
                    <Icon className={`w-6 h-6 ${split.colorClass}`} />
                  </div>
                  <div>
                    <span className={`font-orbitron text-3xl font-bold ${split.colorClass}`}>
                      {split.percentage}%
                    </span>
                  </div>
                </div>
                <h3 className="font-orbitron text-lg font-semibold text-foreground mb-2">
                  {split.label}
                </h3>
                <p className="text-muted-foreground font-inter text-sm">
                  {split.description}
                </p>
              </motion.div>
            );
          })}
        </div>

        {/* MSR Ledger note */}
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          className="mt-12 text-center"
        >
          <div className="inline-flex items-center gap-2 px-6 py-3 rounded-full bg-card border border-border text-sm font-inter text-muted-foreground">
            <span>Cada transacción registrada en</span>
            <span className="text-primary font-semibold">MSR Ledger</span>
            <ArrowRight className="w-4 h-4 text-primary" />
            <span className="text-primary font-semibold">BookPI</span>
          </div>
        </motion.div>
      </div>
    </section>
  );
};
