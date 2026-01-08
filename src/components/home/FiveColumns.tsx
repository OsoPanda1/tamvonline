import { motion } from 'framer-motion';
import { 
  Users, Hash, Newspaper, Ticket, Bell,
  MessageCircle, TrendingUp, Calendar, GraduationCap, Mail,
  ChevronRight, Sparkles
} from 'lucide-react';

interface ColumnItem {
  id: string;
  title: string;
  subtitle?: string;
  badge?: string;
  isNew?: boolean;
  isHot?: boolean;
}

const Column = ({ 
  title, 
  icon: Icon, 
  items,
  accentColor = 'primary'
}: { 
  title: string; 
  icon: React.ComponentType<{ className?: string }>;
  items: ColumnItem[];
  accentColor?: 'primary' | 'secondary' | 'isabella' | 'fenix' | 'destructive';
}) => {
  const colorMap = {
    primary: 'text-primary border-primary/20 bg-primary/5 hover:bg-primary/10',
    secondary: 'text-secondary border-secondary/20 bg-secondary/5 hover:bg-secondary/10',
    isabella: 'text-isabella border-isabella/20 bg-isabella/5 hover:bg-isabella/10',
    fenix: 'text-fenix border-fenix/20 bg-fenix/5 hover:bg-fenix/10',
    destructive: 'text-destructive border-destructive/20 bg-destructive/5 hover:bg-destructive/10'
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      className="flex-1 min-w-[200px]"
    >
      {/* Column Header */}
      <div className={`flex items-center gap-2 p-3 rounded-t-xl border ${colorMap[accentColor]} backdrop-blur-sm`}>
        <Icon className="w-4 h-4" />
        <span className="text-xs font-orbitron font-bold tracking-wider">{title}</span>
      </div>

      {/* Items */}
      <div className="border border-t-0 border-primary/10 rounded-b-xl bg-card/50 backdrop-blur-sm divide-y divide-primary/5">
        {items.map((item, index) => (
          <motion.div
            key={item.id}
            initial={{ opacity: 0, x: -10 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ delay: index * 0.05 }}
            whileHover={{ x: 4, backgroundColor: 'hsl(var(--primary) / 0.05)' }}
            className="p-3 cursor-pointer group transition-all"
          >
            <div className="flex items-start justify-between gap-2">
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2">
                  <p className="text-sm text-foreground truncate group-hover:text-primary transition-colors">
                    {item.title}
                  </p>
                  {item.isNew && (
                    <span className="px-1.5 py-0.5 text-[8px] font-bold bg-primary text-background rounded">
                      NEW
                    </span>
                  )}
                  {item.isHot && (
                    <span className="px-1.5 py-0.5 text-[8px] font-bold bg-fenix text-background rounded flex items-center gap-0.5">
                      <Sparkles className="w-2 h-2" />HOT
                    </span>
                  )}
                </div>
                {item.subtitle && (
                  <p className="text-xs text-muted-foreground truncate mt-0.5">{item.subtitle}</p>
                )}
              </div>
              {item.badge && (
                <span className="text-[10px] text-muted-foreground bg-muted px-1.5 py-0.5 rounded">
                  {item.badge}
                </span>
              )}
              <ChevronRight className="w-3 h-3 text-muted-foreground opacity-0 group-hover:opacity-100 transition-opacity" />
            </div>
          </motion.div>
        ))}
      </div>
    </motion.div>
  );
};

export const FiveColumns = () => {
  const groupsChannels: ColumnItem[] = [
    { id: '1', title: 'Artistas TAMV', subtitle: '12.4K miembros', badge: '24', isHot: true },
    { id: '2', title: 'Desarrolladores XR', subtitle: '8.2K miembros', badge: '12' },
    { id: '3', title: 'DreamSpace Builders', subtitle: '5.1K miembros', isNew: true },
    { id: '4', title: 'Música Sensorial', subtitle: '15.8K miembros', badge: '89' },
    { id: '5', title: 'Inversores KERNEL', subtitle: '3.2K miembros' },
  ];

  const trendsHashtags: ColumnItem[] = [
    { id: '1', title: '#DreamSpaceGenesis', subtitle: '2.4M posts', isHot: true },
    { id: '2', title: '#ConciertoSensorial', subtitle: '890K posts' },
    { id: '3', title: '#MSReconomy', subtitle: '456K posts', isNew: true },
    { id: '4', title: '#IsabellaAI', subtitle: '234K posts' },
    { id: '5', title: '#UTAMV2026', subtitle: '123K posts' },
  ];

  const newsEvents: ColumnItem[] = [
    { id: '1', title: 'Lanzamiento DreamSpaces 2.0', subtitle: 'Mañana 8PM', isNew: true },
    { id: '2', title: 'Concierto Bad Bunny XR', subtitle: '15 Enero', isHot: true },
    { id: '3', title: 'Hackathon TAMV Global', subtitle: '20-22 Enero' },
    { id: '4', title: 'Subasta NFT Exclusive', subtitle: '25 Enero' },
    { id: '5', title: 'UTAMV Masterclass IA', subtitle: '1 Febrero' },
  ];

  const lotteryUTAMV: ColumnItem[] = [
    { id: '1', title: '🎰 Lotería Semanal', subtitle: 'Pozo: 50,000 MSR', isHot: true },
    { id: '2', title: '🎓 Blockchain 101', subtitle: 'Curso gratis', badge: '4.9★' },
    { id: '3', title: '🎫 Rifa DreamSpace', subtitle: 'Quedan 234 tickets' },
    { id: '4', title: '📚 Desarrollo XR Pro', subtitle: '12 lecciones', isNew: true },
    { id: '5', title: '🏆 Torneo Gaming', subtitle: 'Inscríbete ahora' },
  ];

  const notifications: ColumnItem[] = [
    { id: '1', title: '@maria te mencionó', subtitle: 'Hace 2 min', isNew: true },
    { id: '2', title: 'Tu reel tiene 10K vistas', subtitle: 'Hace 15 min' },
    { id: '3', title: 'Nuevo seguidor: @carlos', subtitle: 'Hace 1h' },
    { id: '4', title: 'Pago recibido: 150 MSR', subtitle: 'Hace 3h', badge: '💰' },
    { id: '5', title: 'Actualización de Isabella', subtitle: 'Hace 5h' },
  ];

  return (
    <section className="py-8 px-4">
      <div className="flex flex-wrap gap-4 lg:flex-nowrap">
        <Column 
          title="GRUPOS Y CANALES" 
          icon={Users} 
          items={groupsChannels}
          accentColor="primary"
        />
        <Column 
          title="TRENDS & HASHTAGS" 
          icon={TrendingUp} 
          items={trendsHashtags}
          accentColor="fenix"
        />
        <Column 
          title="NOTICIAS & EVENTOS" 
          icon={Calendar} 
          items={newsEvents}
          accentColor="secondary"
        />
        <Column 
          title="LOTERÍA & UTAMV" 
          icon={GraduationCap} 
          items={lotteryUTAMV}
          accentColor="isabella"
        />
        <Column 
          title="NOTIFICACIONES" 
          icon={Bell} 
          items={notifications}
          accentColor="destructive"
        />
      </div>
    </section>
  );
};
