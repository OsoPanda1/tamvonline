import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { 
  Search, Mic, Sparkles, Menu, User, Settings,
  Home, Compass, Video, Radio, MessageSquare, Wallet,
  Bell, Plus, Zap, Command
} from 'lucide-react';
import { AdvancedSearch } from '../search/AdvancedSearch';

export const TopNavBar = () => {
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();

  // Keyboard shortcut: CMD+K / CTRL+K
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault();
        setIsSearchOpen(true);
      }
      if (e.key === 'Escape') {
        setIsSearchOpen(false);
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  return (
    <>
      <motion.header
        initial={{ y: -100, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        className="fixed top-0 left-0 right-0 z-50 px-4 py-3"
      >
        <div className="max-w-[1920px] mx-auto">
          <div className="flex items-center gap-4 p-2 rounded-2xl glass-sovereign border border-primary/10">
            {/* Logo */}
            <div className="flex items-center gap-2 px-3">
              <div className="relative">
                <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-primary to-secondary flex items-center justify-center">
                  <Sparkles className="w-5 h-5 text-background" />
                </div>
                <div className="absolute -inset-1 rounded-xl bg-primary/20 blur-md -z-10" />
              </div>
              <span className="text-xl font-orbitron font-bold text-gradient-sovereign hidden sm:block">
                TAMV
              </span>
            </div>

            {/* Search Bar - Click to open modal */}
            <button 
              onClick={() => setIsSearchOpen(true)}
              className="flex-1 max-w-xl"
            >
              <div className="relative group">
                <div className="absolute inset-0 rounded-xl bg-primary/10 opacity-0 group-hover:opacity-100 transition-opacity blur-xl" />
                <div className="relative flex items-center bg-muted/50 rounded-xl border border-primary/10 hover:border-primary/40 transition-colors cursor-pointer">
                  <Search className="w-4 h-4 text-muted-foreground ml-4" />
                  <span className="flex-1 px-3 py-2.5 text-sm text-muted-foreground text-left">
                    Buscar en el metaverso...
                  </span>
                  <div className="hidden sm:flex items-center gap-1 mr-3 px-2 py-1 rounded-md bg-muted/80 border border-border">
                    <Command className="w-3 h-3 text-muted-foreground" />
                    <span className="text-xs text-muted-foreground font-mono">K</span>
                  </div>
                  <button className="p-2 hover:bg-primary/10 rounded-lg transition-colors mr-1">
                    <Mic className="w-4 h-4 text-muted-foreground" />
                  </button>
                </div>
              </div>
            </button>

            {/* Main Nav */}
            <nav className="hidden lg:flex items-center gap-1">
              {[
                { icon: Home, label: 'Home', path: '/' },
                { icon: Compass, label: 'Explorar', path: '/dreamspaces' },
                { icon: Video, label: 'Videos', path: '/videos' },
                { icon: Radio, label: 'Live', path: '/live' },
                { icon: MessageSquare, label: 'Chat', path: '/messages' },
              ].map((item) => (
                <Link
                  key={item.label}
                  to={item.path}
                  className={`flex items-center gap-2 px-4 py-2 rounded-xl transition-all ${
                    location.pathname === item.path 
                      ? 'bg-primary/20 text-primary border border-primary/30' 
                      : 'text-muted-foreground hover:text-foreground hover:bg-muted/50'
                  }`}
                >
                  <item.icon className="w-4 h-4" />
                  <span className="text-sm font-medium">{item.label}</span>
                </Link>
              ))}
            </nav>

            {/* Actions */}
            <div className="flex items-center gap-2">
              {/* Create Button */}
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="flex items-center gap-2 px-4 py-2 rounded-xl bg-gradient-to-r from-primary to-cyber-cyan text-background font-medium text-sm"
              >
                <Plus className="w-4 h-4" />
                <span className="hidden sm:inline">Crear</span>
              </motion.button>

              {/* Wallet */}
              <Link 
                to="/dashboard" 
                className="relative p-2.5 rounded-xl bg-muted/50 border border-primary/10 text-foreground hover:bg-primary/10 transition-colors"
              >
                <Wallet className="w-5 h-5" />
                <span className="absolute -top-1 -right-1 w-4 h-4 rounded-full bg-secondary text-[10px] font-bold text-background flex items-center justify-center">
                  3
                </span>
              </Link>

              {/* Notifications */}
              <Link 
                to="/notifications"
                className="relative p-2.5 rounded-xl bg-muted/50 border border-primary/10 text-foreground hover:bg-primary/10 transition-colors"
              >
                <Bell className="w-5 h-5" />
                <span className="absolute -top-1 -right-1 w-4 h-4 rounded-full bg-destructive text-[10px] font-bold text-white flex items-center justify-center">
                  9
                </span>
              </Link>

              {/* Profile */}
              <Link 
                to="/profile"
                className="p-1 rounded-xl border-2 border-primary/40 hover:border-primary transition-colors"
              >
                <div className="w-9 h-9 rounded-lg bg-gradient-to-br from-primary/20 to-isabella/20 flex items-center justify-center">
                  <User className="w-5 h-5 text-primary" />
                </div>
              </Link>

              {/* Mobile Menu */}
              <button className="lg:hidden p-2.5 rounded-xl bg-muted/50 border border-primary/10 text-foreground">
                <Menu className="w-5 h-5" />
              </button>
            </div>
          </div>
        </div>
      </motion.header>

      {/* Advanced Search Modal */}
      <AdvancedSearch isOpen={isSearchOpen} onClose={() => setIsSearchOpen(false)} />
    </>
  );
};
