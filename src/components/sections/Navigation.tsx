import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Menu, X, Sparkles, LogOut, User } from 'lucide-react';
import { NavLink } from '../NavLink';
import { SovereignButton } from '../ui/SovereignButton';
import { useAuth } from '@/hooks/useAuth';

export const Navigation = () => {
  const [isOpen, setIsOpen] = useState(false);
  const { user, signOut, loading } = useAuth();
  const navigate = useNavigate();

  const navItems = [
    { to: '/', label: 'Inicio' },
    { to: '/whitepaper', label: 'Whitepaper MSR' },
    ...(user ? [{ to: '/dashboard', label: 'Dashboard' }] : []),
  ];

  const handleAuthClick = () => {
    if (user) {
      signOut();
      navigate('/');
    } else {
      navigate('/auth');
    }
  };

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-background/80 backdrop-blur-xl border-b border-border">
      <div className="container mx-auto px-6">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-primary to-secondary flex items-center justify-center">
              <Sparkles className="w-4 h-4 text-primary-foreground" />
            </div>
            <span className="font-orbitron text-lg font-bold text-gradient-sovereign">
              TAMV MD-X4
            </span>
          </Link>

          {/* Desktop Nav */}
          <div className="hidden md:flex items-center gap-8">
            {navItems.map((item) => (
              <NavLink key={item.to} to={item.to}>
                {item.label}
              </NavLink>
            ))}
          </div>

          {/* CTA */}
          <div className="hidden md:flex items-center gap-3">
            {!loading && (
              <>
                {user && (
                  <span className="text-sm text-muted-foreground font-inter flex items-center gap-2">
                    <User className="w-4 h-4 text-primary" />
                    {user.email?.split('@')[0]}
                  </span>
                )}
                <SovereignButton 
                  variant={user ? "ghost" : "primary"} 
                  size="sm"
                  onClick={handleAuthClick}
                >
                  {user ? (
                    <>
                      <LogOut className="w-4 h-4 mr-2" />
                      Salir
                    </>
                  ) : (
                    'Entrar'
                  )}
                </SovereignButton>
              </>
            )}
          </div>

          {/* Mobile Menu Button */}
          <button
            onClick={() => setIsOpen(!isOpen)}
            className="md:hidden text-foreground"
          >
            {isOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="md:hidden bg-background border-b border-border"
          >
            <div className="container mx-auto px-6 py-4 space-y-4">
              {navItems.map((item) => (
                <Link
                  key={item.to}
                  to={item.to}
                  onClick={() => setIsOpen(false)}
                  className="block font-inter text-foreground hover:text-primary transition-colors"
                >
                  {item.label}
                </Link>
              ))}
              {user && (
                <div className="text-sm text-muted-foreground font-inter flex items-center gap-2 py-2">
                  <User className="w-4 h-4 text-primary" />
                  {user.email?.split('@')[0]}
                </div>
              )}
              <SovereignButton 
                variant={user ? "ghost" : "primary"} 
                size="sm" 
                className="w-full"
                onClick={() => {
                  handleAuthClick();
                  setIsOpen(false);
                }}
              >
                {user ? (
                  <>
                    <LogOut className="w-4 h-4 mr-2" />
                    Salir
                  </>
                ) : (
                  'Entrar'
                )}
              </SovereignButton>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
};
