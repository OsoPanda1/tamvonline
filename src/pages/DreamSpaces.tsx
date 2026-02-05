 import { motion } from 'framer-motion';
 import { useState } from 'react';
 import { useNavigate } from 'react-router-dom';
 import { TopNavBar } from '@/components/home/TopNavBar';
 import { LeftSidebar } from '@/components/home/LeftSidebar';
 import { AztecBackground } from '@/components/ui/AztecBackground';
 import { 
   Sparkles, Globe, Mountain, Shield, Satellite, 
   Crown, Music, Swords, Users, Play, Heart, 
   Eye, ArrowRight, Zap
 } from 'lucide-react';
 
 interface DreamWorld {
   id: string;
   name: string;
   subtitle: string;
   description: string;
   icon: React.ComponentType<{ className?: string }>;
   gradient: string;
   glowColor: string;
   videoUrl?: string;
   imageUrl: string;
   stats: { visitors: string; rating: number; events: string };
   features: string[];
   status: 'live' | 'beta' | 'coming';
 }
 
 const dreamWorlds: DreamWorld[] = [
   {
     id: 'neo-tokio',
     name: 'Neo-Tokio 2089',
     subtitle: 'Cyberpunk Metropolis',
     description: 'Una metrópolis neón donde la tecnología y la tradición japonesa convergen. Rascacielos holográficos, mercados flotantes y IA callejeras te esperan.',
     icon: Globe,
     gradient: 'from-cyber-cyan/20 via-primary/10 to-abyss',
     glowColor: 'bg-cyber-cyan/40',
     imageUrl: 'https://images.unsplash.com/photo-1545569341-9eb8b30979d9?w=800',
     stats: { visitors: '89.4K', rating: 4.9, events: '234' },
     features: ['Mercados Nocturnos', 'Carreras Hover', 'Clubs XR', 'Templos Digitales'],
     status: 'live'
   },
   {
     id: 'abismo-marte',
     name: 'Abismo de Marte',
     subtitle: 'Colonia Subterránea',
     description: 'Explora las profundidades del Valles Marineris. Ciudades excavadas en roca roja, ecosistemas artificiales y misterios alienígenas por descubrir.',
     icon: Mountain,
     gradient: 'from-fenix/20 via-secondary/10 to-abyss',
     glowColor: 'bg-fenix/40',
     imageUrl: 'https://images.unsplash.com/photo-1614728894747-a83421e2b9c9?w=800',
     stats: { visitors: '45.2K', rating: 4.8, events: '156' },
     features: ['Exploración Cuevas', 'Minería Espacial', 'Laboratorios', 'Vistas Orbitales'],
     status: 'live'
   },
   {
     id: 'sector-zero',
     name: 'Sector Zero',
     subtitle: 'Zona de Conflicto',
     description: 'Arena de batalla táctica donde clanes compiten por recursos y territorio. Estrategia, trabajo en equipo y habilidades de combate son esenciales.',
     icon: Swords,
     gradient: 'from-destructive/20 via-fenix/10 to-abyss',
     glowColor: 'bg-destructive/40',
     imageUrl: 'https://images.unsplash.com/photo-1534796636912-3b95b3ab5986?w=800',
     stats: { visitors: '67.8K', rating: 4.7, events: '512' },
     features: ['Batallas PvP', 'Clanes', 'Torneos MSR', 'Rankings Globales'],
     status: 'live'
   },
   {
     id: 'santuario',
     name: 'Santuario',
     subtitle: 'Refugio de Paz',
     description: 'Espacio de meditación y bienestar mental. Jardines zen infinitos, cascadas de luz y sesiones guiadas por Isabella AI para tu equilibrio interior.',
     icon: Shield,
     gradient: 'from-kernel/20 via-isabella/10 to-abyss',
     glowColor: 'bg-kernel/40',
     imageUrl: 'https://images.unsplash.com/photo-1518837695005-2083093ee35b?w=800',
     stats: { visitors: '34.1K', rating: 5.0, events: '89' },
     features: ['Meditación VR', 'Terapia IA', 'Grupos Apoyo', 'Retiros Digitales'],
     status: 'live'
   },
   {
     id: 'estacion-orbital',
     name: 'Estación Orbital Quetzal',
     subtitle: 'Hub Espacial TAMV',
     description: 'Centro de operaciones en órbita terrestre. Observa el planeta, participa en misiones espaciales y conecta con viajeros de todo el ecosistema.',
     icon: Satellite,
     gradient: 'from-primary/20 via-cyber-cyan/10 to-abyss',
     glowColor: 'bg-primary/40',
     imageUrl: 'https://images.unsplash.com/photo-1446776811953-b23d57bd21aa?w=800',
     stats: { visitors: '52.3K', rating: 4.9, events: '178' },
     features: ['Observatorio', 'Misiones EVA', 'Comercio Galáctico', 'Fiestas Zero-G'],
     status: 'beta'
   },
   {
     id: 'trono-obsidiana',
     name: 'Trono de Obsidiana',
     subtitle: 'Palacio del Poder',
     description: 'Sede de gobernanza TAMV. Participa en votaciones, debates y decisiones que moldean el futuro de la civilización digital.',
     icon: Crown,
     gradient: 'from-secondary/20 via-primary/10 to-abyss',
     glowColor: 'bg-secondary/40',
     imageUrl: 'https://images.unsplash.com/photo-1518709268805-4e9042af9f23?w=800',
     stats: { visitors: '28.7K', rating: 4.8, events: '67' },
     features: ['DAO Voting', 'Debates Públicos', 'Archivos Históricos', 'Ceremonias'],
     status: 'live'
   },
   {
     id: 'auditorio-4d',
     name: 'Auditorio 4D Xochitl',
     subtitle: 'Experiencias Sensoriales',
     description: 'Teatro inmersivo con audio 3D, hápticos y aromas digitales. Conciertos, obras de teatro y experiencias artísticas que trascienden lo visual.',
     icon: Music,
     gradient: 'from-isabella/20 via-fenix/10 to-abyss',
     glowColor: 'bg-isabella/40',
     imageUrl: 'https://images.unsplash.com/photo-1470229722913-7c0e2dbbafd3?w=800',
     stats: { visitors: '78.9K', rating: 4.9, events: '423' },
     features: ['Conciertos Live', 'Teatro VR', 'Sinestesia Digital', 'Meet & Greet'],
     status: 'live'
   },
   {
     id: 'neo-coliseo',
     name: 'Neo-Coliseo Azteca',
     subtitle: 'Arena de Gladiadores',
     description: 'Coliseo futurista con raíces prehispánicas. Combates de gladiadores digitales, espectáculos épicos y ceremonias de victoria.',
     icon: Sparkles,
     gradient: 'from-fenix/20 via-secondary/10 to-abyss',
     glowColor: 'bg-fenix/40',
     imageUrl: 'https://images.unsplash.com/photo-1569930784237-ea65a528f87f?w=800',
     stats: { visitors: '95.6K', rating: 4.8, events: '678' },
     features: ['Combates 1v1', 'Torneos Épicos', 'Apuestas MSR', 'Hall of Fame'],
     status: 'live'
   }
 ];
 
 const WorldCard = ({ world, index }: { world: DreamWorld; index: number }) => {
   const [isHovered, setIsHovered] = useState(false);
 
   return (
     <motion.div
       initial={{ opacity: 0, y: 30 }}
       animate={{ opacity: 1, y: 0 }}
       transition={{ delay: index * 0.1 }}
       onMouseEnter={() => setIsHovered(true)}
       onMouseLeave={() => setIsHovered(false)}
       className="group relative cursor-pointer"
     >
       {/* Glow Effect */}
       <motion.div
         animate={{ opacity: isHovered ? 1 : 0 }}
         className={`absolute -inset-2 rounded-3xl blur-xl ${world.glowColor} transition-opacity`}
       />
       
       <div className={`relative overflow-hidden rounded-2xl border border-primary/20 bg-gradient-to-br ${world.gradient}`}>
         {/* Image */}
         <div className="relative h-48 overflow-hidden">
           <motion.img
             src={world.imageUrl}
             alt={world.name}
             className="w-full h-full object-cover"
             animate={{ scale: isHovered ? 1.1 : 1 }}
             transition={{ duration: 0.5 }}
           />
           <div className="absolute inset-0 bg-gradient-to-t from-abyss via-transparent to-transparent" />
           
           {/* Status Badge */}
           <div className="absolute top-3 right-3">
             <span className={`px-2 py-1 text-[10px] font-orbitron font-bold rounded-full border ${
               world.status === 'live' ? 'bg-kernel/20 text-kernel border-kernel/30' :
               world.status === 'beta' ? 'bg-cyber-cyan/20 text-cyber-cyan border-cyber-cyan/30' :
               'bg-muted/20 text-muted-foreground border-muted/30'
             }`}>
               {world.status.toUpperCase()}
             </span>
           </div>
 
           {/* Play Button Overlay */}
           <motion.div
             initial={{ opacity: 0 }}
             animate={{ opacity: isHovered ? 1 : 0 }}
             className="absolute inset-0 flex items-center justify-center bg-abyss/40"
           >
             <motion.button
               whileHover={{ scale: 1.1 }}
               whileTap={{ scale: 0.95 }}
               className="p-4 rounded-full bg-primary/90 text-background"
             >
               <Play className="w-8 h-8 ml-1" />
             </motion.button>
           </motion.div>
         </div>
 
         {/* Content */}
         <div className="p-5">
           <div className="flex items-start gap-3 mb-3">
             <div className="p-2 rounded-xl bg-background/50 border border-primary/20">
               <world.icon className="w-5 h-5 text-primary" />
             </div>
             <div className="flex-1">
               <h3 className="text-lg font-orbitron font-bold text-foreground group-hover:text-primary transition-colors">
                 {world.name}
               </h3>
               <p className="text-xs text-muted-foreground">{world.subtitle}</p>
             </div>
           </div>
 
           <p className="text-sm text-muted-foreground mb-4 line-clamp-2">
             {world.description}
           </p>
 
           {/* Features */}
           <div className="flex flex-wrap gap-1 mb-4">
             {world.features.slice(0, 3).map((feature, i) => (
               <span key={i} className="px-2 py-0.5 text-[10px] bg-primary/10 text-primary rounded-full">
                 {feature}
               </span>
             ))}
           </div>
 
           {/* Stats */}
           <div className="flex items-center justify-between text-xs text-muted-foreground">
             <div className="flex items-center gap-3">
               <span className="flex items-center gap-1">
                 <Users className="w-3 h-3" /> {world.stats.visitors}
               </span>
               <span className="flex items-center gap-1">
                 <Eye className="w-3 h-3" /> {world.stats.events} eventos
               </span>
             </div>
             <div className="flex items-center gap-1 text-secondary">
               <Heart className="w-3 h-3 fill-current" />
               <span>{world.stats.rating}</span>
             </div>
           </div>
 
           {/* Enter Button */}
           <motion.button
             whileHover={{ x: 5 }}
             className="w-full mt-4 py-2 flex items-center justify-center gap-2 rounded-xl bg-primary/10 text-primary font-medium text-sm hover:bg-primary/20 transition-colors"
           >
             <span>Entrar al Mundo</span>
             <ArrowRight className="w-4 h-4" />
           </motion.button>
         </div>
       </div>
     </motion.div>
   );
 };
 
 const DreamSpaces = () => {
   const navigate = useNavigate();
 
   return (
     <div className="min-h-screen bg-background relative">
       <AztecBackground variant="subtle" />
       <TopNavBar />
       <LeftSidebar />
 
       <main className="pt-24 pb-32 pl-20 lg:pl-72 pr-4 transition-all duration-300">
         <div className="max-w-[1600px] mx-auto">
           {/* Header */}
           <motion.div
             initial={{ opacity: 0, y: 20 }}
             animate={{ opacity: 1, y: 0 }}
             className="text-center mb-12"
           >
             <div className="flex items-center justify-center gap-3 mb-4">
               <div className="h-px w-16 bg-gradient-to-r from-transparent to-primary" />
               <Sparkles className="w-6 h-6 text-primary" />
               <span className="text-sm font-orbitron text-primary tracking-widest">MUNDOS INMERSIVOS</span>
               <Sparkles className="w-6 h-6 text-primary" />
               <div className="h-px w-16 bg-gradient-to-l from-transparent to-primary" />
             </div>
             
             <h1 className="text-4xl md:text-5xl font-orbitron font-bold text-gradient-sovereign mb-4">
               DreamSpaces
             </h1>
             <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
               Explora 8 dimensiones únicas de realidad virtual. Cada mundo es una civilización, cada experiencia es irrepetible.
             </p>
 
             {/* Global Stats */}
             <div className="flex items-center justify-center gap-8 mt-8">
               <div className="text-center">
                 <p className="text-2xl font-orbitron font-bold text-primary">8</p>
                 <p className="text-xs text-muted-foreground">Mundos Activos</p>
               </div>
               <div className="w-px h-8 bg-primary/20" />
               <div className="text-center">
                 <p className="text-2xl font-orbitron font-bold text-primary">492K</p>
                 <p className="text-xs text-muted-foreground">Visitantes Diarios</p>
               </div>
               <div className="w-px h-8 bg-primary/20" />
               <div className="text-center">
                 <p className="text-2xl font-orbitron font-bold text-primary">2.3K</p>
                 <p className="text-xs text-muted-foreground">Eventos Live</p>
               </div>
             </div>
           </motion.div>
 
           {/* Featured World */}
           <motion.div
             initial={{ opacity: 0, scale: 0.95 }}
             animate={{ opacity: 1, scale: 1 }}
             transition={{ delay: 0.2 }}
             className="relative mb-12 rounded-3xl overflow-hidden border border-primary/20"
           >
             <div className="relative h-[400px]">
               <img
                 src="https://images.unsplash.com/photo-1545569341-9eb8b30979d9?w=1600"
                 alt="Neo-Tokio Featured"
                 className="w-full h-full object-cover"
               />
               <div className="absolute inset-0 bg-gradient-to-r from-abyss via-abyss/50 to-transparent" />
               
               <div className="absolute inset-0 flex items-center p-12">
                 <div className="max-w-xl">
                   <div className="flex items-center gap-2 mb-4">
                     <Zap className="w-5 h-5 text-cyber-cyan" />
                     <span className="text-sm font-orbitron text-cyber-cyan">MUNDO DESTACADO</span>
                   </div>
                   <h2 className="text-4xl font-orbitron font-bold text-foreground mb-3">
                     Neo-Tokio 2089
                   </h2>
                   <p className="text-muted-foreground mb-6">
                     La metrópolis cyberpunk más visitada del ecosistema TAMV. Neón infinito, 
                     mercados flotantes y aventuras que desafían la realidad.
                   </p>
                   <div className="flex items-center gap-4">
                     <motion.button
                       whileHover={{ scale: 1.05 }}
                       whileTap={{ scale: 0.95 }}
                       className="px-6 py-3 rounded-xl bg-primary text-background font-medium flex items-center gap-2"
                     >
                       <Play className="w-5 h-5" />
                       Entrar Ahora
                     </motion.button>
                     <button className="px-6 py-3 rounded-xl border border-primary/30 text-primary font-medium hover:bg-primary/10 transition-colors">
                       Ver Trailer
                     </button>
                   </div>
                 </div>
               </div>
             </div>
           </motion.div>
 
           {/* Worlds Grid */}
           <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
             {dreamWorlds.map((world, index) => (
               <WorldCard key={world.id} world={world} index={index} />
             ))}
           </div>
         </div>
       </main>
     </div>
   );
 };
 
 export default DreamSpaces;