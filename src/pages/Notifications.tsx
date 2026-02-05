 import { useState } from 'react';
 import { motion } from 'framer-motion';
 import { Link } from 'react-router-dom';
 import { 
   Bell, Check, CheckCheck, Settings, Heart, MessageCircle, 
   UserPlus, Zap, Coins, Trophy, Sparkles, Volume2, VolumeX,
   ArrowLeft
 } from 'lucide-react';
 import { TopNavBar } from '@/components/home/TopNavBar';
 import { LeftSidebar } from '@/components/home/LeftSidebar';
 import { AztecBackground } from '@/components/ui/AztecBackground';
 import { useNotifications, NotificationType } from '@/hooks/useNotifications';
 import { formatDistanceToNow } from 'date-fns';
 import { es } from 'date-fns/locale';
 
 const NOTIFICATION_ICONS: Record<NotificationType, React.ReactNode> = {
   like: <Heart className="w-4 h-4 text-destructive" />,
   superlike: <Zap className="w-4 h-4 text-secondary" />,
   comment: <MessageCircle className="w-4 h-4 text-primary" />,
   follow: <UserPlus className="w-4 h-4 text-kernel" />,
   mention: <span className="text-sm font-bold text-primary">@</span>,
   transaction: <Coins className="w-4 h-4 text-fenix" />,
   achievement: <Trophy className="w-4 h-4 text-secondary" />,
   dreamspace: <Sparkles className="w-4 h-4 text-isabella" />,
   live: <span className="w-2 h-2 rounded-full bg-destructive animate-pulse" />,
   system: <Bell className="w-4 h-4 text-muted-foreground" />,
   isabella: <Sparkles className="w-4 h-4 text-isabella" />,
 };
 
 const Notifications = () => {
   const { 
     notifications, 
     unreadCount, 
     loading, 
     preferences,
     markAsRead, 
     markAllAsRead,
     updatePreferences 
   } = useNotifications();
   const [showSettings, setShowSettings] = useState(false);
 
   return (
     <div className="min-h-screen bg-background relative">
       <AztecBackground variant="subtle" />
       <TopNavBar />
       <LeftSidebar />
 
       <main className="pt-24 pb-32 pl-20 lg:pl-72 pr-4 transition-all duration-300">
         <div className="max-w-3xl mx-auto">
           {/* Header */}
           <div className="flex items-center justify-between mb-6">
             <div className="flex items-center gap-3">
               <Link to="/" className="p-2 rounded-xl hover:bg-primary/10 text-muted-foreground">
                 <ArrowLeft className="w-5 h-5" />
               </Link>
               <div>
                 <h1 className="text-2xl font-orbitron font-bold text-foreground flex items-center gap-2">
                   <Bell className="w-6 h-6 text-primary" />
                   Notificaciones
                   {unreadCount > 0 && (
                     <span className="px-2 py-0.5 text-xs font-bold rounded-full bg-destructive text-white">
                       {unreadCount}
                     </span>
                   )}
                 </h1>
                 <p className="text-sm text-muted-foreground">NOTITAMV • Sistema Multisensorial</p>
               </div>
             </div>
             <div className="flex items-center gap-2">
               <motion.button
                 whileHover={{ scale: 1.05 }}
                 whileTap={{ scale: 0.95 }}
                 onClick={markAllAsRead}
                 disabled={unreadCount === 0}
                 className="flex items-center gap-2 px-4 py-2 rounded-xl bg-primary/10 text-primary text-sm font-medium disabled:opacity-50"
               >
                 <CheckCheck className="w-4 h-4" />
                 Marcar todo leído
               </motion.button>
               <button 
                 onClick={() => setShowSettings(!showSettings)}
                 className="p-2 rounded-xl hover:bg-primary/10 text-muted-foreground"
               >
                 <Settings className="w-5 h-5" />
               </button>
             </div>
           </div>
 
           {/* Settings Panel */}
           {showSettings && (
             <motion.div
               initial={{ opacity: 0, height: 0 }}
               animate={{ opacity: 1, height: 'auto' }}
               exit={{ opacity: 0, height: 0 }}
               className="mb-6 p-4 rounded-2xl bg-card border border-primary/20"
             >
               <h3 className="font-orbitron font-bold text-foreground mb-4">Preferencias de Sonido</h3>
               <div className="flex items-center justify-between">
                 <div className="flex items-center gap-3">
                   {preferences?.sound_enabled ? (
                     <Volume2 className="w-5 h-5 text-primary" />
                   ) : (
                     <VolumeX className="w-5 h-5 text-muted-foreground" />
                   )}
                   <span className="text-sm">Sonidos de notificación</span>
                 </div>
                 <button
                   onClick={() => updatePreferences({ sound_enabled: !preferences?.sound_enabled })}
                   className={`w-12 h-6 rounded-full transition-colors ${
                     preferences?.sound_enabled ? 'bg-primary' : 'bg-muted'
                   }`}
                 >
                   <div className={`w-5 h-5 rounded-full bg-white shadow transition-transform ${
                     preferences?.sound_enabled ? 'translate-x-6' : 'translate-x-0.5'
                   }`} />
                 </button>
               </div>
             </motion.div>
           )}
 
           {/* Notifications List */}
           <div className="rounded-2xl border border-primary/20 overflow-hidden bg-card/50">
             {loading ? (
               <div className="p-8 text-center">
                 <div className="w-8 h-8 border-2 border-primary border-t-transparent rounded-full animate-spin mx-auto" />
               </div>
             ) : notifications.length === 0 ? (
               <div className="p-12 text-center">
                 <Bell className="w-12 h-12 text-muted-foreground/50 mx-auto mb-4" />
                 <p className="text-lg font-medium text-muted-foreground">Sin notificaciones</p>
                 <p className="text-sm text-muted-foreground/70">
                   Cuando alguien interactúe contigo, aparecerá aquí
                 </p>
               </div>
             ) : (
               <div className="divide-y divide-primary/10">
                 {notifications.map((notification, idx) => (
                   <motion.div
                     key={notification.id}
                     initial={{ opacity: 0, x: -20 }}
                     animate={{ opacity: 1, x: 0 }}
                     transition={{ delay: idx * 0.05 }}
                     onClick={() => !notification.is_read && markAsRead(notification.id)}
                     className={`p-4 hover:bg-primary/5 transition-colors cursor-pointer ${
                       !notification.is_read ? 'bg-primary/5' : ''
                     }`}
                   >
                     <div className="flex items-start gap-3">
                       <div className="p-2 rounded-xl bg-primary/10">
                         {NOTIFICATION_ICONS[notification.type]}
                       </div>
                       <div className="flex-1 min-w-0">
                         <p className="font-medium text-foreground">{notification.title}</p>
                         {notification.body && (
                           <p className="text-sm text-muted-foreground mt-0.5">{notification.body}</p>
                         )}
                         <p className="text-xs text-muted-foreground mt-1">
                           {formatDistanceToNow(new Date(notification.created_at), { 
                             addSuffix: true, 
                             locale: es 
                           })}
                         </p>
                       </div>
                       {!notification.is_read && (
                         <div className="w-2 h-2 rounded-full bg-primary" />
                       )}
                     </div>
                   </motion.div>
                 ))}
               </div>
             )}
           </div>
         </div>
       </main>
     </div>
   );
 };
 
 export default Notifications;