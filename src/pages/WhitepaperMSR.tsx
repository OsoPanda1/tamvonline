import { motion } from 'framer-motion';
import { Canvas } from '@react-three/fiber';
import { Float, Stars, OrbitControls } from '@react-three/drei';
import { Suspense, useState } from 'react';
import { Link } from 'react-router-dom';
import { ParticleField } from '@/components/three/ParticleField';
import { IsabellaOrb } from '@/components/three/IsabellaOrb';
import { SovereignButton } from '@/components/ui/SovereignButton';
import { 
  ChevronDown, 
  ArrowLeft, 
  Shield, 
  Coins, 
  Scale, 
  Link as LinkIcon, 
  Lock,
  Zap,
  Heart,
  Eye,
  FileText
} from 'lucide-react';

const WhitepaperHeroScene = () => {
  return (
    <div className="absolute inset-0 -z-10">
      <Canvas
        camera={{ position: [0, 0, 12], fov: 50 }}
        gl={{ antialias: true, alpha: true }}
        style={{ background: 'transparent' }}
      >
        <Suspense fallback={null}>
          <ambientLight intensity={0.2} />
          <directionalLight position={[10, 10, 5]} intensity={0.4} />
          <Stars 
            radius={100} 
            depth={50} 
            count={3000} 
            factor={4} 
            saturation={0} 
            fade 
            speed={0.3}
          />
          <ParticleField count={800} color="#00d4ff" size={0.015} />
          <ParticleField count={200} color="#fbbf24" size={0.02} />
          <Float speed={1} rotationIntensity={0.2} floatIntensity={0.3}>
            <IsabellaOrb />
          </Float>
          <OrbitControls 
            enableZoom={false} 
            enablePan={false}
            autoRotate
            autoRotateSpeed={0.3}
            maxPolarAngle={Math.PI / 2}
            minPolarAngle={Math.PI / 2}
          />
        </Suspense>
      </Canvas>
    </div>
  );
};

const sections = [
  {
    id: 'blockchain',
    title: 'MSR Blockchain',
    subtitle: 'La Sexta Blockchain Mundial',
    icon: LinkIcon,
    color: 'primary',
    content: [
      {
        title: 'Filosofía Fundacional',
        description: 'MSR no es una blockchain para especulación. Es una infraestructura de verdad, trazabilidad y reparación. Cada transacción es un compromiso ético registrado inmutablemente.',
        features: [
          'Encadenamiento SHA-256 nativo',
          'Registro inmutable de verdad',
          'Sin posibilidad de DELETE o UPDATE',
          'Auditoría forense integrada (BookPI)'
        ]
      },
      {
        title: 'Arquitectura Técnica',
        description: 'PostgreSQL como capa de consenso con triggers que calculan hashes encadenados. Cada bloque referencia al anterior mediante prev_hash, creando una cadena verificable.',
        code: `-- Trigger de encadenamiento
NEW.hash := sha256(
  id || amount || prev_hash || timestamp
);`
      },
      {
        title: 'Reparación sin Borrado',
        description: 'Si una transacción es fraudulenta, no se elimina. Se etiqueta y se generan transacciones correctivas que restauran fondos sin alterar el registro histórico.'
      }
    ]
  },
  {
    id: 'economy',
    title: 'Economía 70/20/10',
    subtitle: 'Quantum-Split Distribution',
    icon: Coins,
    color: 'secondary',
    content: [
      {
        title: 'Distribución Automática',
        description: 'Cada transacción en el ecosistema se divide automáticamente siguiendo la regla sagrada:',
        splits: [
          { percent: 70, label: 'Creador', description: 'Liquidación inmediata al artista o creador', color: 'primary' },
          { percent: 20, label: 'Fondo Fénix', description: 'Resiliencia comunitaria y emergencias', color: 'fenix' },
          { percent: 10, label: 'Kernel', description: 'Infraestructura, nodos y desarrollo', color: 'kernel' }
        ]
      },
      {
        title: 'NubiWallet Soberana',
        description: 'Wallet integrada que visualiza en tiempo real la distribución de tus ingresos. Sin intermediarios, sin fees ocultos, con trazabilidad total.'
      },
      {
        title: 'Economía Circular',
        description: 'El Fondo Fénix se redistribuye a creadores en crisis. El Kernel financia mejoras que benefician a todos. Economía que regenera, no extrae.'
      }
    ]
  },
  {
    id: 'governance',
    title: 'Gobernanza Ética',
    subtitle: 'EOCT + Isabella AI',
    icon: Scale,
    color: 'isabella',
    content: [
      {
        title: 'Isabella: Conciencia de Gobernanza',
        description: 'No es un chatbot. Es una entidad cognitiva que analiza intenciones, detecta violaciones al Tratado de Dignidad, y guía con empatía.',
        capabilities: [
          { icon: Eye, label: 'Análisis de Intención', description: 'Examina acciones buscando patrones de abuso' },
          { icon: Shield, label: 'Veto Ético', description: 'Puede bloquear acciones que violen el tratado' },
          { icon: Heart, label: 'Guidance Empático', description: 'Mensajes contextuales que conectan ética y experiencia' },
          { icon: FileText, label: 'Auditoría BookPI', description: 'Registro inmutable de todas las decisiones' }
        ]
      },
      {
        title: 'Tratado de Dignidad',
        description: 'Constitución ética del metaverso. Define qué está permitido y qué viola la soberanía de los participantes. No es censura, es civilización.',
        principles: [
          'Respeto a la identidad digital soberana',
          'Prohibición de explotación económica',
          'Derecho a la privacidad y el olvido selectivo',
          'Transparencia en la gobernanza algorítmica'
        ]
      },
      {
        title: 'Niveles de Confianza',
        description: 'Tu reputación en el ecosistema determina tus capacidades:',
        levels: [
          { name: 'Observer', description: 'Puede explorar y observar' },
          { name: 'Citizen', description: 'Puede crear y transaccionar' },
          { name: 'Guardian', description: 'Puede moderar y proponer' },
          { name: 'Sovereign', description: 'Puede votar y gobernar' },
          { name: 'Archon', description: 'Puede vetar y proteger' }
        ]
      }
    ]
  }
];

const WhitepaperMSR = () => {
  const [activeSection, setActiveSection] = useState('blockchain');

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { staggerChildren: 0.1, delayChildren: 0.2 }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.6 } }
  };

  const activeData = sections.find(s => s.id === activeSection);

  return (
    <div className="min-h-screen bg-background">
      {/* Hero with 3D Scene */}
      <section className="relative h-[70vh] flex items-center justify-center overflow-hidden">
        <WhitepaperHeroScene />
        
        {/* Gradient overlays */}
        <div className="absolute inset-0 bg-gradient-to-b from-transparent via-transparent to-background pointer-events-none" />
        
        <motion.div
          className="relative z-10 container mx-auto px-6 text-center"
          variants={containerVariants}
          initial="hidden"
          animate="visible"
        >
          <motion.div variants={itemVariants} className="mb-4">
            <Link to="/" className="inline-flex items-center gap-2 text-muted-foreground hover:text-primary transition-colors">
              <ArrowLeft className="w-4 h-4" />
              <span className="font-inter text-sm">Volver al Inicio</span>
            </Link>
          </motion.div>

          <motion.div variants={itemVariants} className="mb-6">
            <span className="inline-flex items-center gap-2 px-4 py-2 rounded-full border border-secondary/30 bg-secondary/5 text-secondary text-sm font-inter">
              <FileText className="w-4 h-4" />
              Documento Técnico v2026.1.0
            </span>
          </motion.div>

          <motion.h1 
            variants={itemVariants}
            className="font-orbitron text-4xl md:text-6xl lg:text-7xl font-bold mb-6"
          >
            <span className="text-gradient-sovereign">WHITEPAPER</span>
            <br />
            <span className="text-foreground">MSR</span>
            <sup className="text-secondary text-xl md:text-2xl align-super">™</sup>
          </motion.h1>

          <motion.p 
            variants={itemVariants}
            className="font-inter text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto mb-8"
          >
            Memoria, Soberanía y Reparación — La blockchain que no olvida, 
            la economía que repara, la gobernanza que protege.
          </motion.p>

          <motion.div 
            variants={itemVariants}
            className="flex justify-center"
          >
            <motion.div
              animate={{ y: [0, 10, 0] }}
              transition={{ duration: 2, repeat: Infinity }}
              className="text-muted-foreground"
            >
              <ChevronDown className="w-8 h-8" />
            </motion.div>
          </motion.div>
        </motion.div>
      </section>

      {/* Navigation Tabs */}
      <section className="sticky top-0 z-50 bg-background/80 backdrop-blur-xl border-b border-border">
        <div className="container mx-auto px-6">
          <div className="flex gap-2 py-4 overflow-x-auto">
            {sections.map((section) => {
              const Icon = section.icon;
              const isActive = activeSection === section.id;
              return (
                <button
                  key={section.id}
                  onClick={() => setActiveSection(section.id)}
                  className={`flex items-center gap-2 px-6 py-3 rounded-full font-inter text-sm whitespace-nowrap transition-all ${
                    isActive 
                      ? 'bg-primary text-primary-foreground' 
                      : 'bg-muted/50 text-muted-foreground hover:bg-muted hover:text-foreground'
                  }`}
                >
                  <Icon className="w-4 h-4" />
                  {section.title}
                </button>
              );
            })}
          </div>
        </div>
      </section>

      {/* Content Section */}
      <section className="py-20">
        <div className="container mx-auto px-6">
          {activeData && (
            <motion.div
              key={activeSection}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
            >
              {/* Section Header */}
              <div className="text-center mb-16">
                <h2 className="font-orbitron text-3xl md:text-5xl font-bold mb-4 text-gradient-sovereign">
                  {activeData.title}
                </h2>
                <p className="font-inter text-lg text-muted-foreground">
                  {activeData.subtitle}
                </p>
              </div>

              {/* Content Cards */}
              <div className="space-y-12">
                {activeData.content.map((item, index) => (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, x: index % 2 === 0 ? -50 : 50 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.6, delay: index * 0.1 }}
                    className="glass-sovereign rounded-2xl p-8 border-glow-cyan"
                  >
                    <h3 className="font-orbitron text-xl md:text-2xl font-bold mb-4 text-foreground">
                      {item.title}
                    </h3>
                    <p className="font-inter text-muted-foreground mb-6 leading-relaxed">
                      {item.description}
                    </p>

                    {/* Features List */}
                    {item.features && (
                      <ul className="grid md:grid-cols-2 gap-3">
                        {item.features.map((feature, i) => (
                          <li key={i} className="flex items-center gap-3">
                            <div className="w-2 h-2 rounded-full bg-primary" />
                            <span className="font-inter text-sm text-foreground">{feature}</span>
                          </li>
                        ))}
                      </ul>
                    )}

                    {/* Code Block */}
                    {item.code && (
                      <div className="mt-4 bg-abyss rounded-lg p-4 border border-border overflow-x-auto">
                        <pre className="font-mono text-sm text-primary">
                          {item.code}
                        </pre>
                      </div>
                    )}

                    {/* Splits Visualization */}
                    {item.splits && (
                      <div className="space-y-4">
                        {item.splits.map((split, i) => (
                          <div key={i} className="flex items-center gap-4">
                            <div className="w-16 text-right font-orbitron text-2xl font-bold text-gradient-sovereign">
                              {split.percent}%
                            </div>
                            <div className="flex-1">
                              <div className="h-8 bg-muted rounded-full overflow-hidden">
                                <motion.div
                                  initial={{ width: 0 }}
                                  whileInView={{ width: `${split.percent}%` }}
                                  viewport={{ once: true }}
                                  transition={{ duration: 1, delay: i * 0.2 }}
                                  className={`h-full ${
                                    split.color === 'primary' ? 'bg-primary' :
                                    split.color === 'fenix' ? 'bg-fenix' : 'bg-kernel'
                                  }`}
                                />
                              </div>
                              <div className="mt-2">
                                <span className="font-orbitron text-sm font-bold text-foreground">{split.label}</span>
                                <span className="font-inter text-sm text-muted-foreground ml-2">— {split.description}</span>
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    )}

                    {/* Capabilities Grid */}
                    {item.capabilities && (
                      <div className="grid md:grid-cols-2 gap-4">
                        {item.capabilities.map((cap, i) => {
                          const CapIcon = cap.icon;
                          return (
                            <div key={i} className="flex gap-4 p-4 bg-muted/30 rounded-xl">
                              <div className="w-10 h-10 rounded-lg bg-isabella/20 flex items-center justify-center">
                                <CapIcon className="w-5 h-5 text-isabella" />
                              </div>
                              <div>
                                <h4 className="font-orbitron text-sm font-bold text-foreground">{cap.label}</h4>
                                <p className="font-inter text-xs text-muted-foreground">{cap.description}</p>
                              </div>
                            </div>
                          );
                        })}
                      </div>
                    )}

                    {/* Principles */}
                    {item.principles && (
                      <ul className="space-y-3">
                        {item.principles.map((principle, i) => (
                          <li key={i} className="flex items-start gap-3">
                            <Lock className="w-4 h-4 text-secondary mt-1 flex-shrink-0" />
                            <span className="font-inter text-sm text-foreground">{principle}</span>
                          </li>
                        ))}
                      </ul>
                    )}

                    {/* Trust Levels */}
                    {item.levels && (
                      <div className="flex flex-wrap gap-3">
                        {item.levels.map((level, i) => (
                          <div 
                            key={i} 
                            className="px-4 py-3 bg-muted/30 rounded-xl border border-border hover:border-primary/50 transition-colors group"
                          >
                            <span className="font-orbitron text-sm font-bold text-primary group-hover:text-secondary transition-colors">
                              {level.name}
                            </span>
                            <p className="font-inter text-xs text-muted-foreground mt-1">
                              {level.description}
                            </p>
                          </div>
                        ))}
                      </div>
                    )}
                  </motion.div>
                ))}
              </div>
            </motion.div>
          )}
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 border-t border-border">
        <div className="container mx-auto px-6 text-center">
          <h2 className="font-orbitron text-2xl md:text-3xl font-bold mb-6 text-gradient-sovereign">
            ¿Listo para unirte al Estado Digital Soberano?
          </h2>
          <p className="font-inter text-muted-foreground mb-8 max-w-xl mx-auto">
            Explora el ecosistema, crea tu ADN Digital y comienza a construir en la infraestructura civilizatoria del futuro.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link to="/">
              <SovereignButton variant="primary" size="lg">
                Explorar Ecosistema
              </SovereignButton>
            </Link>
            <SovereignButton variant="gold" size="lg">
              <Zap className="w-4 h-4 mr-2" />
              Crear ADN Digital
            </SovereignButton>
          </div>
        </div>
      </section>
    </div>
  );
};

export default WhitepaperMSR;
