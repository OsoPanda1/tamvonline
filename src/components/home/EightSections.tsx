import { motion } from 'framer-motion';
import { 
  Sparkles, Palette, Gavel, BookOpen, 
  Crown, Bot, Music, Glasses,
  ArrowRight, Users, Zap
} from 'lucide-react';

interface SectionCardProps {
  title: string;
  subtitle: string;
  icon: React.ComponentType<{ className?: string }>;
  gradient: string;
  glowColor: string;
  stats?: { label: string; value: string }[];
  featured?: string;
}

const SectionCard = ({ title, subtitle, icon: Icon, gradient, glowColor, stats, featured }: SectionCardProps) => {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      whileInView={{ opacity: 1, scale: 1 }}
      viewport={{ once: true }}
      whileHover={{ scale: 1.02, y: -5 }}
      className="relative group cursor-pointer"
    >
      {/* Glow Effect */}
      <div 
        className={`absolute -inset-1 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-500 blur-xl ${glowColor}`}
      />
      
      {/* Card */}
      <div className={`relative h-full rounded-2xl border border-primary/10 overflow-hidden bg-gradient-to-br ${gradient} backdrop-blur-sm`}>
        {/* Background Pattern */}
        <div className="absolute inset-0 opacity-10">
          <div 
            className="w-full h-full"
            style={{
              backgroundImage: `radial-gradient(circle at 2px 2px, currentColor 1px, transparent 0)`,
              backgroundSize: '24px 24px'
            }}
          />
        </div>

        {/* Content */}
        <div className="relative p-5 h-full flex flex-col">
          {/* Header */}
          <div className="flex items-start justify-between mb-4">
            <div className="p-3 rounded-xl bg-background/50 border border-primary/20">
              <Icon className="w-6 h-6 text-primary" />
            </div>
            {featured && (
              <span className="px-2 py-1 text-[10px] font-orbitron font-bold bg-primary/20 text-primary rounded-full border border-primary/30">
                {featured}
              </span>
            )}
          </div>

          {/* Title */}
          <h3 className="text-lg font-orbitron font-bold text-foreground mb-1 group-hover:text-primary transition-colors">
            {title}
          </h3>
          <p className="text-sm text-muted-foreground mb-4 flex-1">
            {subtitle}
          </p>

          {/* Stats */}
          {stats && (
            <div className="flex gap-4 mb-4">
              {stats.map((stat, i) => (
                <div key={i} className="text-center">
                  <p className="text-lg font-orbitron font-bold text-primary">{stat.value}</p>
                  <p className="text-[10px] text-muted-foreground uppercase">{stat.label}</p>
                </div>
              ))}
            </div>
          )}

          {/* CTA */}
          <div className="flex items-center gap-2 text-sm text-primary font-medium group-hover:gap-3 transition-all">
            <span>Explorar</span>
            <ArrowRight className="w-4 h-4" />
          </div>
        </div>

        {/* Animated Border */}
        <div className="absolute inset-0 rounded-2xl border border-primary/0 group-hover:border-primary/30 transition-colors" />
      </div>
    </motion.div>
  );
};

export const EightSections = () => {
  const sections: SectionCardProps[] = [
    {
      title: 'DreamSpaces',
      subtitle: 'Crea mundos virtuales inmersivos con herramientas intuitivas de diseño 3D',
      icon: Sparkles,
      gradient: 'from-abyss-lighter via-card to-abyss',
      glowColor: 'bg-primary/30',
      featured: 'POPULAR',
      stats: [
        { label: 'Espacios', value: '24K+' },
        { label: 'Creadores', value: '8.2K' }
      ]
    },
    {
      title: 'Galería de Arte',
      subtitle: 'Exhibe y comercializa arte digital con NFTs verificados en BookPI',
      icon: Palette,
      gradient: 'from-abyss via-isabella/5 to-abyss-lighter',
      glowColor: 'bg-isabella/30',
      stats: [
        { label: 'Obras', value: '156K' },
        { label: 'Artistas', value: '12K' }
      ]
    },
    {
      title: 'Subastas',
      subtitle: 'Participa en subastas exclusivas con sistema de pujas transparente',
      icon: Gavel,
      gradient: 'from-abyss-lighter via-secondary/5 to-abyss',
      glowColor: 'bg-secondary/30',
      featured: 'LIVE',
      stats: [
        { label: 'Activas', value: '47' },
        { label: 'Volumen', value: '2.4M' }
      ]
    },
    {
      title: 'Puentes de Conocimiento',
      subtitle: 'Conecta con mentores y expertos en sesiones colaborativas',
      icon: BookOpen,
      gradient: 'from-abyss via-kernel/5 to-abyss-lighter',
      glowColor: 'bg-kernel/30',
      stats: [
        { label: 'Mentores', value: '890' },
        { label: 'Sesiones', value: '45K' }
      ]
    },
    {
      title: 'Membresías Premium',
      subtitle: 'Acceso exclusivo a contenido, eventos VIP y beneficios únicos',
      icon: Crown,
      gradient: 'from-abyss-lighter via-secondary/10 to-abyss',
      glowColor: 'bg-secondary/40',
      featured: 'VIP',
      stats: [
        { label: 'Miembros', value: '34K' },
        { label: 'Beneficios', value: '50+' }
      ]
    },
    {
      title: 'Isabella AI',
      subtitle: 'Asistente ética con consciencia contextual y guía soberana',
      icon: Bot,
      gradient: 'from-abyss via-isabella/10 to-abyss-lighter',
      glowColor: 'bg-isabella/40',
      featured: 'NUEVO',
      stats: [
        { label: 'Consultas', value: '1.2M' },
        { label: 'EOCT', value: '0.94' }
      ]
    },
    {
      title: 'Conciertos Sensoriales',
      subtitle: 'Experiencias musicales inmersivas con audio 3D y feedback háptico',
      icon: Music,
      gradient: 'from-abyss-lighter via-fenix/5 to-abyss',
      glowColor: 'bg-fenix/30',
      stats: [
        { label: 'Eventos', value: '234' },
        { label: 'Asistentes', value: '890K' }
      ]
    },
    {
      title: 'Inmersión VR/XR',
      subtitle: 'Portal hacia realidades extendidas con soporte para todos los dispositivos',
      icon: Glasses,
      gradient: 'from-abyss via-primary/10 to-abyss-lighter',
      glowColor: 'bg-primary/40',
      featured: '4D READY',
      stats: [
        { label: 'Dispositivos', value: '15+' },
        { label: 'Latencia', value: '<120ms' }
      ]
    }
  ];

  return (
    <section className="py-12 px-4">
      {/* Section Header */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        className="text-center mb-10"
      >
        <div className="flex items-center justify-center gap-3 mb-3">
          <div className="h-px w-12 bg-gradient-to-r from-transparent to-primary" />
          <Zap className="w-5 h-5 text-primary" />
          <span className="text-sm font-orbitron text-primary tracking-widest">ECOSISTEMA INMERSIVO</span>
          <Zap className="w-5 h-5 text-primary" />
          <div className="h-px w-12 bg-gradient-to-l from-transparent to-primary" />
        </div>
        <h2 className="text-3xl md:text-4xl font-orbitron font-bold text-gradient-sovereign mb-2">
          8 Dimensiones de Experiencia
        </h2>
        <p className="text-muted-foreground max-w-2xl mx-auto">
          Explora las secciones exclusivas que hacen de TAMV una civilización digital completa
        </p>
      </motion.div>

      {/* Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {sections.map((section, index) => (
          <motion.div
            key={section.title}
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: index * 0.1 }}
          >
            <SectionCard {...section} />
          </motion.div>
        ))}
      </div>
    </section>
  );
};
