import { ReactNode } from 'react';
import { useSecurityContext, TrustLevel } from '@/hooks/useSecurityContext';
import { Lock, AlertTriangle, Shield } from 'lucide-react';
import { motion } from 'framer-motion';

interface PermissionGateProps {
  children: ReactNode;
  permission?: string;
  minTrustLevel?: TrustLevel;
  resource?: string;
  action?: 'read' | 'write' | 'delete' | 'moderate' | 'admin';
  fallback?: ReactNode;
  showLock?: boolean;
}

const TRUST_LEVEL_ORDER: TrustLevel[] = ['observer', 'citizen', 'guardian', 'sovereign', 'archon'];

const TRUST_LEVEL_LABELS: Record<TrustLevel, string> = {
  observer: 'Observador',
  citizen: 'Ciudadano',
  guardian: 'Guardián',
  sovereign: 'Soberano',
  archon: 'Archon',
};

export const PermissionGate = ({
  children,
  permission,
  minTrustLevel,
  resource,
  action = 'read',
  fallback,
  showLock = true,
}: PermissionGateProps) => {
  const { context, hasPermission, canAccess } = useSecurityContext();

  // Check permission
  let hasAccess = true;

  if (permission) {
    hasAccess = hasPermission(permission);
  }

  if (minTrustLevel) {
    const currentIndex = TRUST_LEVEL_ORDER.indexOf(context.trustLevel);
    const requiredIndex = TRUST_LEVEL_ORDER.indexOf(minTrustLevel);
    hasAccess = hasAccess && currentIndex >= requiredIndex;
  }

  if (resource) {
    hasAccess = hasAccess && canAccess(resource, action);
  }

  if (hasAccess) {
    return <>{children}</>;
  }

  // Show fallback or lock indicator
  if (fallback) {
    return <>{fallback}</>;
  }

  if (!showLock) {
    return null;
  }

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      className="relative p-6 rounded-xl border border-destructive/20 bg-destructive/5"
    >
      <div className="flex flex-col items-center gap-4 text-center">
        <div className="p-4 rounded-full bg-destructive/10">
          <Lock className="w-8 h-8 text-destructive" />
        </div>
        <div>
          <h3 className="text-lg font-bold text-foreground mb-1">Acceso Restringido</h3>
          <p className="text-sm text-muted-foreground">
            {minTrustLevel ? (
              <>
                Necesitas ser <span className="text-primary font-medium">{TRUST_LEVEL_LABELS[minTrustLevel]}</span> o superior para acceder.
              </>
            ) : (
              'No tienes permisos para ver este contenido.'
            )}
          </p>
        </div>
        {context.isAuthenticated ? (
          <div className="flex items-center gap-2 text-xs text-muted-foreground">
            <Shield className="w-4 h-4" />
            <span>Tu nivel actual: <span className="text-primary">{TRUST_LEVEL_LABELS[context.trustLevel]}</span></span>
          </div>
        ) : (
          <button className="px-4 py-2 rounded-lg bg-primary text-background text-sm font-medium hover:bg-primary/90 transition-colors">
            Iniciar Sesión
          </button>
        )}
      </div>
    </motion.div>
  );
};

// Higher-order component version
export const withPermission = <P extends object>(
  Component: React.ComponentType<P>,
  options: Omit<PermissionGateProps, 'children'>
) => {
  return (props: P) => (
    <PermissionGate {...options}>
      <Component {...props} />
    </PermissionGate>
  );
};

// Hook for programmatic permission checks
export const usePermissionCheck = () => {
  const { context, hasPermission, canAccess } = useSecurityContext();

  const checkTrustLevel = (minLevel: TrustLevel): boolean => {
    const currentIndex = TRUST_LEVEL_ORDER.indexOf(context.trustLevel);
    const requiredIndex = TRUST_LEVEL_ORDER.indexOf(minLevel);
    return currentIndex >= requiredIndex;
  };

  return {
    isAuthenticated: context.isAuthenticated,
    trustLevel: context.trustLevel,
    hasPermission,
    canAccess,
    checkTrustLevel,
  };
};
