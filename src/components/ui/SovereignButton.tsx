import { forwardRef } from 'react';
import { motion } from 'framer-motion';
import { cn } from '@/lib/utils';

interface SovereignButtonProps {
  variant?: 'primary' | 'secondary' | 'ghost' | 'gold';
  size?: 'sm' | 'md' | 'lg';
  children: React.ReactNode;
  className?: string;
  onClick?: () => void;
  disabled?: boolean;
  type?: 'button' | 'submit' | 'reset';
}

export const SovereignButton = forwardRef<HTMLButtonElement, SovereignButtonProps>(
  ({ className, variant = 'primary', size = 'md', children, onClick, disabled, type = 'button' }, ref) => {
    const baseStyles = "relative font-orbitron font-medium tracking-wider uppercase overflow-hidden transition-all duration-300 disabled:opacity-50 disabled:pointer-events-none rounded-lg";
    
    const variants = {
      primary: "bg-primary/10 text-primary border border-primary/30 hover:bg-primary/20 hover:border-primary/50 hover:shadow-[0_0_30px_hsl(185_100%_50%/0.3)]",
      secondary: "bg-secondary/10 text-secondary border border-secondary/30 hover:bg-secondary/20 hover:border-secondary/50 hover:shadow-[0_0_30px_hsl(42_100%_55%/0.3)]",
      ghost: "bg-transparent text-foreground border border-border hover:bg-muted hover:border-primary/30",
      gold: "bg-gradient-to-r from-secondary/20 to-secondary/10 text-secondary border border-secondary/40 hover:from-secondary/30 hover:to-secondary/20 hover:shadow-[0_0_40px_hsl(42_100%_55%/0.4)]",
    };

    const sizes = {
      sm: "px-4 py-2 text-xs",
      md: "px-6 py-3 text-sm",
      lg: "px-8 py-4 text-base",
    };

    return (
      <motion.button
        ref={ref}
        type={type}
        className={cn(baseStyles, variants[variant], sizes[size], className)}
        whileHover={{ scale: 1.02 }}
        whileTap={{ scale: 0.98 }}
        onClick={onClick}
        disabled={disabled}
      >
        {/* Shimmer effect */}
        <span className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent -translate-x-full animate-shimmer" />
        <span className="relative z-10 flex items-center justify-center">{children}</span>
      </motion.button>
    );
  }
);

SovereignButton.displayName = 'SovereignButton';
