import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { useAuth } from '@/hooks/useAuth';
import { SovereignButton } from '@/components/ui/SovereignButton';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Fingerprint, Mail, Lock, User, Sparkles, Shield, ArrowRight } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { z } from 'zod';

const emailSchema = z.string().email('Email inválido');
const passwordSchema = z.string().min(6, 'Mínimo 6 caracteres');

const Auth = () => {
  const [isLogin, setIsLogin] = useState(true);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [displayName, setDisplayName] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errors, setErrors] = useState<{ email?: string; password?: string }>({});
  
  const { signIn, signUp, user, loading } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();

  // Redirect if already authenticated
  useEffect(() => {
    if (user && !loading) {
      navigate('/dashboard');
    }
  }, [user, loading, navigate]);

  const validateForm = () => {
    const newErrors: { email?: string; password?: string } = {};
    
    const emailResult = emailSchema.safeParse(email);
    if (!emailResult.success) {
      newErrors.email = emailResult.error.errors[0].message;
    }
    
    const passwordResult = passwordSchema.safeParse(password);
    if (!passwordResult.success) {
      newErrors.password = passwordResult.error.errors[0].message;
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) return;
    
    setIsSubmitting(true);

    try {
      if (isLogin) {
        const { error } = await signIn(email, password);
        if (error) {
          if (error.message.includes('Invalid login credentials')) {
            toast({
              title: 'Credenciales inválidas',
              description: 'Email o contraseña incorrectos. Verifica tus datos.',
              variant: 'destructive',
            });
          } else {
            toast({
              title: 'Error de autenticación',
              description: error.message,
              variant: 'destructive',
            });
          }
        } else {
          toast({
            title: '¡Bienvenido de vuelta!',
            description: 'Acceso al ecosistema TAMV restaurado.',
          });
          navigate('/dashboard');
        }
      } else {
        const { error } = await signUp(email, password, displayName);
        if (error) {
          if (error.message.includes('already registered')) {
            toast({
              title: 'Email ya registrado',
              description: 'Este email ya tiene una cuenta. Intenta iniciar sesión.',
              variant: 'destructive',
            });
          } else {
            toast({
              title: 'Error de registro',
              description: error.message,
              variant: 'destructive',
            });
          }
        } else {
          toast({
            title: '¡ADN Digital creado!',
            description: 'Tu identidad soberana ha sido establecida en TAMV.',
          });
          navigate('/dashboard');
        }
      }
    } catch (err) {
      toast({
        title: 'Error inesperado',
        description: 'Intenta nuevamente en unos segundos.',
        variant: 'destructive',
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ duration: 2, repeat: Infinity, ease: 'linear' }}
        >
          <Fingerprint className="w-12 h-12 text-primary" />
        </motion.div>
      </div>
    );
  }

  return (
    <main className="min-h-screen bg-background flex items-center justify-center px-4 py-20 relative overflow-hidden">
      {/* Background Effects */}
      <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-background to-isabella/5" />
      <div className="absolute top-1/4 -left-32 w-96 h-96 bg-primary/10 rounded-full blur-3xl animate-pulse-glow" />
      <div className="absolute bottom-1/4 -right-32 w-96 h-96 bg-isabella/10 rounded-full blur-3xl animate-pulse-glow" />
      
      {/* Grid Pattern */}
      <div 
        className="absolute inset-0 opacity-[0.03]"
        style={{
          backgroundImage: `linear-gradient(hsl(var(--primary)/0.3) 1px, transparent 1px),
                           linear-gradient(90deg, hsl(var(--primary)/0.3) 1px, transparent 1px)`,
          backgroundSize: '50px 50px'
        }}
      />

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-md relative z-10"
      >
        {/* Header */}
        <div className="text-center mb-8">
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ type: 'spring', delay: 0.2 }}
            className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-gradient-to-br from-primary/20 to-isabella/20 border border-primary/30 mb-6"
          >
            <Fingerprint className="w-10 h-10 text-primary" />
          </motion.div>
          
          <h1 className="font-orbitron text-3xl font-bold mb-2">
            <span className="text-gradient-sovereign">ID-NVIDA</span>
          </h1>
          <p className="text-muted-foreground font-inter">
            {isLogin ? 'Accede a tu identidad soberana' : 'Crea tu ADN Digital'}
          </p>
        </div>

        {/* Form Card */}
        <motion.div
          layout
          className="bg-card/50 backdrop-blur-xl border border-border/50 rounded-2xl p-8 shadow-2xl"
        >
          {/* Toggle */}
          <div className="flex bg-muted/50 rounded-xl p-1 mb-8">
            <button
              type="button"
              onClick={() => setIsLogin(true)}
              className={`flex-1 py-2.5 px-4 rounded-lg font-inter text-sm font-medium transition-all ${
                isLogin 
                  ? 'bg-primary text-primary-foreground shadow-lg' 
                  : 'text-muted-foreground hover:text-foreground'
              }`}
            >
              Iniciar Sesión
            </button>
            <button
              type="button"
              onClick={() => setIsLogin(false)}
              className={`flex-1 py-2.5 px-4 rounded-lg font-inter text-sm font-medium transition-all ${
                !isLogin 
                  ? 'bg-primary text-primary-foreground shadow-lg' 
                  : 'text-muted-foreground hover:text-foreground'
              }`}
            >
              Registro
            </button>
          </div>

          <form onSubmit={handleSubmit} className="space-y-5">
            <AnimatePresence mode="wait">
              {!isLogin && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: 'auto' }}
                  exit={{ opacity: 0, height: 0 }}
                  className="space-y-2"
                >
                  <Label htmlFor="displayName" className="text-foreground font-inter flex items-center gap-2">
                    <User className="w-4 h-4 text-primary" />
                    Nombre de ciudadano
                  </Label>
                  <Input
                    id="displayName"
                    type="text"
                    value={displayName}
                    onChange={(e) => setDisplayName(e.target.value)}
                    placeholder="Tu identidad en TAMV"
                    className="bg-background/50 border-border/50 focus:border-primary"
                  />
                </motion.div>
              )}
            </AnimatePresence>

            <div className="space-y-2">
              <Label htmlFor="email" className="text-foreground font-inter flex items-center gap-2">
                <Mail className="w-4 h-4 text-primary" />
                Email
              </Label>
              <Input
                id="email"
                type="email"
                value={email}
                onChange={(e) => {
                  setEmail(e.target.value);
                  setErrors({ ...errors, email: undefined });
                }}
                placeholder="tu@email.com"
                className={`bg-background/50 border-border/50 focus:border-primary ${
                  errors.email ? 'border-destructive' : ''
                }`}
                required
              />
              {errors.email && (
                <p className="text-destructive text-xs font-inter">{errors.email}</p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="password" className="text-foreground font-inter flex items-center gap-2">
                <Lock className="w-4 h-4 text-primary" />
                Contraseña
              </Label>
              <Input
                id="password"
                type="password"
                value={password}
                onChange={(e) => {
                  setPassword(e.target.value);
                  setErrors({ ...errors, password: undefined });
                }}
                placeholder="••••••••"
                className={`bg-background/50 border-border/50 focus:border-primary ${
                  errors.password ? 'border-destructive' : ''
                }`}
                required
              />
              {errors.password && (
                <p className="text-destructive text-xs font-inter">{errors.password}</p>
              )}
            </div>

            <SovereignButton
              type="submit"
              variant="primary"
              size="lg"
              className="w-full"
              disabled={isSubmitting}
            >
              {isSubmitting ? (
                <motion.div
                  animate={{ rotate: 360 }}
                  transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
                >
                  <Sparkles className="w-5 h-5" />
                </motion.div>
              ) : (
                <>
                  {isLogin ? 'Acceder al Ecosistema' : 'Crear ADN Digital'}
                  <ArrowRight className="w-5 h-5 ml-2" />
                </>
              )}
            </SovereignButton>
          </form>

          {/* Info Footer */}
          {!isLogin && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.3 }}
              className="mt-6 p-4 bg-primary/5 rounded-xl border border-primary/20"
            >
              <div className="flex items-start gap-3">
                <Shield className="w-5 h-5 text-primary flex-shrink-0 mt-0.5" />
                <div>
                  <p className="text-sm font-inter text-foreground font-medium">
                    Identidad Soberana
                  </p>
                  <p className="text-xs text-muted-foreground mt-1">
                    Tu ADN Digital incluye nivel de confianza, historial verificable 
                    y capacidades evolutivas dentro del ecosistema TAMV.
                  </p>
                </div>
              </div>
            </motion.div>
          )}
        </motion.div>

        {/* Bottom Link */}
        <p className="text-center mt-6 text-sm text-muted-foreground font-inter">
          Al continuar, aceptas el{' '}
          <a href="/whitepaper" className="text-primary hover:underline">
            Tratado de Dignidad Digital
          </a>
        </p>
      </motion.div>
    </main>
  );
};

export default Auth;
