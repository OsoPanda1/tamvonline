import { createContext, useContext, useState, useEffect, useCallback, ReactNode } from 'react';
import { useAuth } from './useAuth';
import { supabase } from '@/integrations/supabase/client';

// Trust Levels with their permissions
export type TrustLevel = 'observer' | 'citizen' | 'guardian' | 'sovereign' | 'archon';

export interface Permission {
  action: string;
  resource: string;
}

export interface SecurityContext {
  userId: string | null;
  trustLevel: TrustLevel;
  permissions: Set<string>;
  isAuthenticated: boolean;
  riskScore: number;
  sessionId: string | null;
  lastActivity: number;
}

interface SecurityContextValue {
  context: SecurityContext;
  hasPermission: (permission: string) => boolean;
  canAccess: (resource: string, action: 'read' | 'write' | 'delete' | 'moderate' | 'admin') => boolean;
  validateInput: (input: string, type: 'text' | 'email' | 'uuid' | 'url') => { valid: boolean; sanitized: string; error?: string };
  logSecurityEvent: (action: string, resource: string, details?: Record<string, unknown>) => Promise<void>;
  refreshContext: () => Promise<void>;
}

const TRUST_LEVEL_PERMISSIONS: Record<TrustLevel, string[]> = {
  observer: ['read:public'],
  citizen: ['read:public', 'write:own', 'create:content'],
  guardian: ['read:public', 'write:own', 'create:content', 'moderate:content', 'create:advanced'],
  sovereign: ['read:public', 'write:own', 'create:content', 'moderate:content', 'create:advanced', 'admin:limited'],
  archon: ['*'], // Full access
};

const defaultContext: SecurityContext = {
  userId: null,
  trustLevel: 'observer',
  permissions: new Set(['read:public']),
  isAuthenticated: false,
  riskScore: 0,
  sessionId: null,
  lastActivity: Date.now(),
};

const SecurityContextReact = createContext<SecurityContextValue | undefined>(undefined);

export const SecurityProvider = ({ children }: { children: ReactNode }) => {
  const { user, session } = useAuth();
  const [context, setContext] = useState<SecurityContext>(defaultContext);

  // Refresh security context from database
  const refreshContext = useCallback(async () => {
    if (!user) {
      setContext(defaultContext);
      return;
    }

    try {
      const { data: profile } = await supabase
        .from('profiles')
        .select('trust_level, reputation_score')
        .eq('user_id', user.id)
        .single();

      const trustLevel = (profile?.trust_level || 'observer') as TrustLevel;
      const permissions = new Set(TRUST_LEVEL_PERMISSIONS[trustLevel] || TRUST_LEVEL_PERMISSIONS.observer);

      setContext({
        userId: user.id,
        trustLevel,
        permissions,
        isAuthenticated: true,
        riskScore: 0,
        sessionId: session?.access_token?.substring(0, 16) || null,
        lastActivity: Date.now(),
      });
    } catch (error) {
      console.error('Error refreshing security context:', error);
    }
  }, [user, session]);

  useEffect(() => {
    refreshContext();
  }, [refreshContext]);

  // Check if user has specific permission
  const hasPermission = useCallback((permission: string): boolean => {
    if (context.permissions.has('*')) return true;
    return context.permissions.has(permission);
  }, [context.permissions]);

  // Check resource access
  const canAccess = useCallback((resource: string, action: 'read' | 'write' | 'delete' | 'moderate' | 'admin'): boolean => {
    if (!context.isAuthenticated && action !== 'read') return false;
    
    const permissionString = `${action}:${resource}`;
    
    // Check exact permission
    if (hasPermission(permissionString)) return true;
    
    // Check wildcard permissions
    if (hasPermission(`${action}:*`)) return true;
    if (hasPermission(`*:${resource}`)) return true;
    
    // Check own content access
    if (action === 'write' || action === 'delete') {
      if (hasPermission('write:own') && resource.includes(context.userId || '')) return true;
    }

    return false;
  }, [context, hasPermission]);

  // Input validation and sanitization
  const validateInput = useCallback((input: string, type: 'text' | 'email' | 'uuid' | 'url'): { valid: boolean; sanitized: string; error?: string } => {
    if (!input || typeof input !== 'string') {
      return { valid: false, sanitized: '', error: 'Input is required' };
    }

    // Basic sanitization - remove potential XSS
    let sanitized = input
      .replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, '')
      .replace(/javascript:/gi, '')
      .replace(/on\w+\s*=/gi, '');

    switch (type) {
      case 'email': {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(input)) {
          return { valid: false, sanitized, error: 'Invalid email format' };
        }
        sanitized = input.toLowerCase().trim();
        break;
      }
      case 'uuid': {
        const uuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;
        if (!uuidRegex.test(input)) {
          return { valid: false, sanitized, error: 'Invalid UUID format' };
        }
        break;
      }
      case 'url': {
        try {
          new URL(input);
          // Block javascript: and data: URLs
          if (input.toLowerCase().startsWith('javascript:') || input.toLowerCase().startsWith('data:')) {
            return { valid: false, sanitized, error: 'Invalid URL scheme' };
          }
        } catch {
          return { valid: false, sanitized, error: 'Invalid URL format' };
        }
        break;
      }
      case 'text':
      default: {
        // Additional text sanitization
        sanitized = sanitized.replace(/[<>]/g, '');
        // Length limit
        if (sanitized.length > 10000) {
          return { valid: false, sanitized: sanitized.substring(0, 10000), error: 'Text too long' };
        }
        break;
      }
    }

    return { valid: true, sanitized };
  }, []);

  // Log security events to BookPI
  const logSecurityEvent = useCallback(async (
    action: string,
    resource: string,
    details?: Record<string, unknown>
  ): Promise<void> => {
    if (!context.userId) return;

    try {
      await supabase.from('bookpi_logs').insert({
        actor_id: context.userId,
        event_type: 'SECURITY',
        action,
        subject_type: resource,
        details: details || {},
        immutable_hash: crypto.randomUUID(),
      });
    } catch (error) {
      console.error('Failed to log security event:', error);
    }
  }, [context.userId]);

  return (
    <SecurityContextReact.Provider value={{
      context,
      hasPermission,
      canAccess,
      validateInput,
      logSecurityEvent,
      refreshContext,
    }}>
      {children}
    </SecurityContextReact.Provider>
  );
};

export const useSecurityContext = () => {
  const context = useContext(SecurityContextReact);
  if (!context) {
    throw new Error('useSecurityContext must be used within a SecurityProvider');
  }
  return context;
};
