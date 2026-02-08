import { motion } from 'framer-motion';
import { Link, useLocation } from 'react-router-dom';
import { 
  Home, Compass, Video, Radio, Music, Users, 
  MessageSquare, Wallet, Settings, Bot, Sparkles,
  GraduationCap, Palette, Gavel, Crown, Glasses,
  BookOpen, Ticket, ChevronLeft, ChevronRight,
  Zap, Globe
} from 'lucide-react';
import { useState } from 'react';

interface NavItem {
  icon: React.ComponentType<{ className?: string }>;
  label: string;
  path?: string;
  badge?: string;
  isNew?: boolean;
}

const mainNav: NavItem[] = [
  { icon: Home, label: 'Home', path: '/' },
  { icon: Compass, label: 'Explorar', path: '/explore' },
  { icon: Video, label: 'Videos', path: '/videos' },
  { icon: Radio, label: 'Live', badge: '12', path: '/live' },
  { icon: Music, label: 'Música', path: '/music' },
  { icon: Users, label: 'Social Nexus', path: '/social' },
  { icon: MessageSquare, label: 'Mensajes', badge: '5', path: '/messages' },
  { icon: Wallet, label: 'Wallet MSR', path: '/wallet' },
];

const metaverseNav: NavItem[] = [
  { icon: Sparkles, label: 'DreamSpaces', isNew: true, path: '/dreamspaces' },
  { icon: Glasses, label: 'VR/XR Portal', path: '/xr' },
  { icon: Music, label: 'Conciertos', badge: 'LIVE', path: '/concerts' },
  { icon: Palette, label: 'Galería Arte', path: '/gallery' },
  { icon: Gavel, label: 'Subastas', path: '/auctions' },
  { icon: Bot, label: 'Isabella AI', path: '/isabella' },
];

const learningNav: NavItem[] = [
  { icon: GraduationCap, label: 'UTAMV', path: '/utamv' },
  { icon: BookOpen, label: 'Puentes', path: '/puentes' },
  { icon: Crown, label: 'Premium', badge: 'VIP', path: '/premium' },
  { icon: Ticket, label: 'Lotería', path: '/lottery' },
  { icon: Settings, label: 'Configuración', path: '/settings' },
];

const NavSection = ({ 
  title, 
  items, 
  collapsed,
  currentPath
}: { 
  title: string; 
  items: NavItem[]; 
  collapsed: boolean;
  currentPath: string;
}) => (
  <div className="mb-6">
    {!collapsed && (
      <p className="px-4 mb-2 text-[10px] font-orbitron text-muted-foreground uppercase tracking-wider">
        {title}
      </p>
    )}
    <div className="space-y-1 px-2">
      {items.map((item) => (
        <motion.div
          key={item.label}
          whileHover={{ x: collapsed ? 0 : 4 }}
        >
            <Link
              to={item.path || '#'}
              className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl transition-all group ${
                collapsed ? 'justify-center' : ''
              } ${
                item.path && currentPath === item.path 
                  ? 'bg-primary/20 text-primary' 
                  : 'text-muted-foreground hover:text-foreground hover:bg-primary/10'
              }`}
            >
              <div className="relative">
                <item.icon className="w-5 h-5 group-hover:text-primary transition-colors" />
                {item.badge && collapsed && (
                  <span className="absolute -top-1 -right-1 w-3 h-3 rounded-full bg-destructive" />
                )}
              </div>
              {!collapsed && (
                <>
                  <span className="flex-1 text-sm font-medium text-left">{item.label}</span>
                  {item.badge && (
                    <span className={`px-1.5 py-0.5 text-[10px] font-bold rounded ${
                      item.badge === 'LIVE' || item.badge === 'VIP'
                        ? 'bg-primary/20 text-primary'
                        : 'bg-muted text-muted-foreground'
                    }`}>
                      {item.badge}
                    </span>
                  )}
                  {item.isNew && (
                    <span className="px-1.5 py-0.5 text-[10px] font-bold bg-secondary text-background rounded">
                      NEW
                    </span>
                  )}
                </>
              )}
            </Link>
        </motion.div>
      ))}
    </div>
  </div>
);

export const LeftSidebar = () => {
  const [collapsed, setCollapsed] = useState(false);
  const location = useLocation();

  return (
    <motion.aside
      initial={{ x: -100, opacity: 0 }}
      animate={{ x: 0, opacity: 1 }}
      className={`fixed left-0 top-20 bottom-0 z-40 flex flex-col transition-all duration-300 ${
        collapsed ? 'w-16' : 'w-64'
      }`}
    >
      <div className="flex-1 m-2 rounded-2xl glass-sovereign border border-primary/10 overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b border-primary/10">
          {!collapsed && (
            <div className="flex items-center gap-2">
              <Globe className="w-4 h-4 text-primary" />
              <span className="text-xs font-orbitron text-primary">NAVEGACIÓN</span>
            </div>
          )}
          <button
            onClick={() => setCollapsed(!collapsed)}
            className="p-1.5 rounded-lg hover:bg-primary/10 text-muted-foreground hover:text-foreground transition-colors"
          >
            {collapsed ? <ChevronRight className="w-4 h-4" /> : <ChevronLeft className="w-4 h-4" />}
          </button>
        </div>

        {/* Navigation */}
        <div className="flex-1 overflow-y-auto py-4 scrollbar-thin">
          <NavSection title="Principal" items={mainNav} collapsed={collapsed} currentPath={location.pathname} />
          <NavSection title="Metaverso" items={metaverseNav} collapsed={collapsed} currentPath={location.pathname} />
          <NavSection title="Aprendizaje" items={learningNav} collapsed={collapsed} currentPath={location.pathname} />
        </div>

        {/* Footer */}
        <div className="p-3 border-t border-primary/10">
          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            className={`w-full flex items-center gap-2 p-3 rounded-xl bg-gradient-to-r from-primary/20 to-isabella/20 border border-primary/20 ${
              collapsed ? 'justify-center' : ''
            }`}
          >
            <Zap className="w-4 h-4 text-primary" />
            {!collapsed && (
              <span className="text-xs font-orbitron text-foreground">MODO INMERSIVO</span>
            )}
          </motion.button>
        </div>
      </div>
    </motion.aside>
  );
};
