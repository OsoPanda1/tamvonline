import { motion } from 'framer-motion';
import { 
  Search, Mic, Sparkles, Menu, User, Settings,
  Home, Compass, Video, Radio, MessageSquare, Wallet,
  Bell, Plus, Zap
} from 'lucide-react';

export const TopNavBar = () => {
  return (
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

          {/* Search Bar */}
          <div className="flex-1 max-w-xl">
            <div className="relative group">
              <div className="absolute inset-0 rounded-xl bg-primary/10 opacity-0 group-focus-within:opacity-100 transition-opacity blur-xl" />
              <div className="relative flex items-center bg-muted/50 rounded-xl border border-primary/10 focus-within:border-primary/40 transition-colors">
                <Search className="w-4 h-4 text-muted-foreground ml-4" />
                <input
                  type="text"
                  placeholder="Buscar en el metaverso..."
                  className="flex-1 bg-transparent px-3 py-2.5 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none"
                />
                <button className="p-2 hover:bg-primary/10 rounded-lg transition-colors mr-1">
                  <Mic className="w-4 h-4 text-muted-foreground" />
                </button>
              </div>
            </div>
          </div>

          {/* Main Nav */}
          <nav className="hidden lg:flex items-center gap-1">
            {[
              { icon: Home, label: 'Home', active: true },
              { icon: Compass, label: 'Explorar' },
              { icon: Video, label: 'Videos' },
              { icon: Radio, label: 'Live' },
              { icon: MessageSquare, label: 'Chat' },
            ].map((item) => (
              <motion.button
                key={item.label}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className={`flex items-center gap-2 px-4 py-2 rounded-xl transition-all ${
                  item.active 
                    ? 'bg-primary/20 text-primary border border-primary/30' 
                    : 'text-muted-foreground hover:text-foreground hover:bg-muted/50'
                }`}
              >
                <item.icon className="w-4 h-4" />
                <span className="text-sm font-medium">{item.label}</span>
              </motion.button>
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
            <button className="relative p-2.5 rounded-xl bg-muted/50 border border-primary/10 text-foreground hover:bg-primary/10 transition-colors">
              <Wallet className="w-5 h-5" />
              <span className="absolute -top-1 -right-1 w-4 h-4 rounded-full bg-secondary text-[10px] font-bold text-background flex items-center justify-center">
                3
              </span>
            </button>

            {/* Notifications */}
            <button className="relative p-2.5 rounded-xl bg-muted/50 border border-primary/10 text-foreground hover:bg-primary/10 transition-colors">
              <Bell className="w-5 h-5" />
              <span className="absolute -top-1 -right-1 w-4 h-4 rounded-full bg-destructive text-[10px] font-bold text-white flex items-center justify-center">
                9
              </span>
            </button>

            {/* Profile */}
            <button className="p-1 rounded-xl border-2 border-primary/40 hover:border-primary transition-colors">
              <div className="w-9 h-9 rounded-lg bg-gradient-to-br from-primary/20 to-isabella/20 flex items-center justify-center">
                <User className="w-5 h-5 text-primary" />
              </div>
            </button>

            {/* Mobile Menu */}
            <button className="lg:hidden p-2.5 rounded-xl bg-muted/50 border border-primary/10 text-foreground">
              <Menu className="w-5 h-5" />
            </button>
          </div>
        </div>
      </div>
    </motion.header>
  );
};
