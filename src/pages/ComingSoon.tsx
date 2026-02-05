 import { motion } from 'framer-motion';
 import { useLocation, Link } from 'react-router-dom';
 import { 
   Construction, ArrowLeft, Sparkles, Video, Music, 
   Radio, MessageSquare, Users, Glasses, Palette, 
   Gavel, GraduationCap, BookOpen, Crown, Ticket
 } from 'lucide-react';
 import { TopNavBar } from '@/components/home/TopNavBar';
 import { LeftSidebar } from '@/components/home/LeftSidebar';
 import { AztecBackground } from '@/components/ui/AztecBackground';
 
 const ROUTE_INFO: Record<string, { title: string; icon: React.ReactNode; description: string }> = {
   '/videos': { 
     title: 'Videos', 
     icon: <Video className="w-8 h-8" />,
     description: 'Explora videos XR, tutoriales y contenido exclusivo del metaverso TAMV.'
   },
   '/live': { 
     title: 'Live Streaming', 
     icon: <Radio className="w-8 h-8" />,
     description: 'Conciertos en vivo, eventos XR y transmisiones en tiempo real.'
   },
   '/music': { 
     title: 'Música', 
     icon: <Music className="w-8 h-8" />,
     description: 'Biblioteca musical del ecosistema TAMV con audio 3D inmersivo.'
   },
   '/social': { 
     title: 'Social Nexus', 
     icon: <Users className="w-8 h-8" />,
     description: 'Red social soberana con comunidades y grupos de interés.'
   },
   '/messages': { 
     title: 'Mensajes', 
     icon: <MessageSquare className="w-8 h-8" />,
     description: 'Chat encriptado end-to-end con soporte multimedia.'
   },
   '/xr': { 
     title: 'Portal VR/XR', 
     icon: <Glasses className="w-8 h-8" />,
     description: 'Acceso a experiencias de realidad virtual y aumentada.'
   },
   '/concerts': { 
     title: 'Conciertos Sensoriales', 
     icon: <Music className="w-8 h-8" />,
     description: 'Experiencias musicales 4D con audio espacial y hápticos.'
   },
   '/gallery': { 
     title: 'Galería de Arte', 
     icon: <Palette className="w-8 h-8" />,
     description: 'NFTs, arte digital y exposiciones virtuales.'
   },
   '/auctions': { 
     title: 'Subastas', 
     icon: <Gavel className="w-8 h-8" />,
     description: 'Marketplace de subastas para coleccionables digitales.'
   },
   '/isabella': { 
     title: 'Isabella AI', 
     icon: <Sparkles className="w-8 h-8" />,
     description: 'Tu asistente ético con inteligencia emocional y cuántica.'
   },
   '/utamv': { 
     title: 'UTAMV Universidad', 
     icon: <GraduationCap className="w-8 h-8" />,
     description: 'Cursos y certificaciones del ecosistema TAMV.'
   },
   '/puentes': { 
     title: 'Puentes', 
     icon: <BookOpen className="w-8 h-8" />,
     description: 'Conexiones con otros ecosistemas y federaciones.'
   },
   '/premium': { 
     title: 'Premium VIP', 
     icon: <Crown className="w-8 h-8" />,
     description: 'Acceso exclusivo y beneficios para miembros premium.'
   },
   '/lottery': { 
     title: 'Lotería TAMV', 
     icon: <Ticket className="w-8 h-8" />,
     description: 'Sistema de premios y sorteos del ecosistema.'
   },
 };
 
 const ComingSoon = () => {
   const location = useLocation();
   const info = ROUTE_INFO[location.pathname] || {
     title: 'Próximamente',
     icon: <Construction className="w-8 h-8" />,
     description: 'Esta sección está en desarrollo.'
   };
 
   return (
     <div className="min-h-screen bg-background relative">
       <AztecBackground variant="calendar" opacity={0.02} />
       <TopNavBar />
       <LeftSidebar />
 
       <main className="pt-24 pb-32 pl-20 lg:pl-72 pr-4 transition-all duration-300">
         <div className="max-w-2xl mx-auto">
           <motion.div
             initial={{ opacity: 0, y: 30 }}
             animate={{ opacity: 1, y: 0 }}
             className="text-center py-20"
           >
             <motion.div
               animate={{ 
                 rotate: [0, 5, -5, 0],
                 scale: [1, 1.05, 1]
               }}
               transition={{ duration: 3, repeat: Infinity }}
               className="w-24 h-24 mx-auto mb-8 rounded-3xl bg-gradient-to-br from-primary/20 to-isabella/20 border border-primary/30 flex items-center justify-center text-primary"
             >
               {info.icon}
             </motion.div>
 
             <h1 className="text-4xl font-orbitron font-bold text-gradient-sovereign mb-4">
               {info.title}
             </h1>
             
             <p className="text-lg text-muted-foreground max-w-md mx-auto mb-8">
               {info.description}
             </p>
 
             <div className="flex items-center justify-center gap-4 mb-12">
               <div className="flex items-center gap-2 px-4 py-2 rounded-full bg-fenix/20 text-fenix text-sm font-medium">
                 <Construction className="w-4 h-4" />
                 En Construcción
               </div>
               <div className="flex items-center gap-2 px-4 py-2 rounded-full bg-primary/20 text-primary text-sm font-medium">
                 <Sparkles className="w-4 h-4" />
                 Próximamente
               </div>
             </div>
 
             <Link
               to="/"
               className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-primary text-background font-medium hover:bg-primary/90 transition-colors"
             >
               <ArrowLeft className="w-4 h-4" />
               Volver al Inicio
             </Link>
 
             {/* Decorative elements */}
             <div className="mt-16 grid grid-cols-3 gap-4 max-w-xs mx-auto">
               {[1, 2, 3].map((i) => (
                 <motion.div
                   key={i}
                   animate={{ opacity: [0.3, 0.6, 0.3] }}
                   transition={{ duration: 2, delay: i * 0.3, repeat: Infinity }}
                   className="h-2 rounded-full bg-primary/30"
                 />
               ))}
             </div>
           </motion.div>
         </div>
       </main>
     </div>
   );
 };
 
 export default ComingSoon;