// Settings Page — TAMV MD-X4™
import { useState } from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { 
  User, Shield, Bell, Palette, Lock, Globe, 
  Wallet, Database, LogOut, ChevronRight, Moon, Sun,
  Volume2, VolumeX, Eye, EyeOff, Smartphone
} from 'lucide-react';
import { TopNavBar } from '@/components/home/TopNavBar';
import { LeftSidebar } from '@/components/home/LeftSidebar';
import { AztecBackground } from '@/components/ui/AztecBackground';
import { useAuth } from '@/hooks/useAuth';
import { Switch } from '@/components/ui/switch';
import { toast } from 'sonner';

const Settings = () => {
  const { user, signOut } = useAuth();
  const [darkMode, setDarkMode] = useState(true);
  const [soundEnabled, setSoundEnabled] = useState(true);
  const [privateProfile, setPrivateProfile] = useState(false);
  const [twoFactor, setTwoFactor] = useState(false);
  const [pushNotifications, setPushNotifications] = useState(true);
  const [emailNotifications, setEmailNotifications] = useState(true);

  const handleSignOut = async () => {
    try {
      await signOut();
      toast.success('Sesión cerrada correctamente');
    } catch (error) {
      toast.error('Error al cerrar sesión');
    }
  };

  const settingsSections = [
    {
      title: 'Cuenta',
      items: [
        { 
          icon: User, 
          label: 'Perfil público', 
          description: 'Edita tu información personal',
          action: 'link',
          to: '/profile'
        },
        { 
          icon: Lock, 
          label: 'Perfil privado', 
          description: 'Solo seguidores aprobados pueden verte',
          action: 'toggle',
          value: privateProfile,
          onChange: setPrivateProfile
        },
        { 
          icon: Shield, 
          label: 'Autenticación de dos factores', 
          description: 'Añade una capa extra de seguridad',
          action: 'toggle',
          value: twoFactor,
          onChange: setTwoFactor
        },
      ]
    },
    {
      title: 'Notificaciones',
      items: [
        { 
          icon: Bell, 
          label: 'Notificaciones push', 
          description: 'Recibe alertas en tu dispositivo',
          action: 'toggle',
          value: pushNotifications,
          onChange: setPushNotifications
        },
        { 
          icon: Smartphone, 
          label: 'Notificaciones por email', 
          description: 'Recibe resúmenes por correo',
          action: 'toggle',
          value: emailNotifications,
          onChange: setEmailNotifications
        },
        { 
          icon: Volume2, 
          label: 'Sonidos', 
          description: 'Efectos de sonido de la interfaz',
          action: 'toggle',
          value: soundEnabled,
          onChange: setSoundEnabled
        },
      ]
    },
    {
      title: 'Apariencia',
      items: [
        { 
          icon: darkMode ? Moon : Sun, 
          label: 'Modo oscuro', 
          description: 'Tema visual de la aplicación',
          action: 'toggle',
          value: darkMode,
          onChange: setDarkMode
        },
        { 
          icon: Palette, 
          label: 'Personalización', 
          description: 'Colores y estilos',
          action: 'link',
          to: '/settings/appearance'
        },
      ]
    },
    {
      title: 'Privacidad y datos',
      items: [
        { 
          icon: Eye, 
          label: 'Visibilidad de actividad', 
          description: 'Controla quién ve tu actividad',
          action: 'link',
          to: '/settings/privacy'
        },
        { 
          icon: Database, 
          label: 'Tus datos', 
          description: 'Descarga o elimina tus datos',
          action: 'link',
          to: '/settings/data'
        },
        { 
          icon: Globe, 
          label: 'Idioma y región', 
          description: 'Español (México)',
          action: 'link',
          to: '/settings/language'
        },
      ]
    },
    {
      title: 'Wallet y economía',
      items: [
        { 
          icon: Wallet, 
          label: 'Wallet MSR', 
          description: 'Gestiona tu balance y transacciones',
          action: 'link',
          to: '/wallet'
        },
      ]
    },
  ];

  return (
    <div className="min-h-screen bg-background relative">
      <AztecBackground variant="subtle" />
      <TopNavBar />
      <LeftSidebar />

      <main className="pt-24 pb-32 pl-20 lg:pl-72 pr-4 transition-all duration-300">
        <div className="max-w-[800px] mx-auto space-y-6">
          {/* Header */}
          <div>
            <h1 className="text-3xl font-orbitron font-bold text-gradient-sovereign">
              Configuración
            </h1>
            <p className="text-muted-foreground mt-1">
              Personaliza tu experiencia en TAMV
            </p>
          </div>

          {/* User Card */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="rounded-2xl border border-primary/10 bg-card/30 backdrop-blur-sm p-6"
          >
            <div className="flex items-center gap-4">
              <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-primary to-secondary flex items-center justify-center text-background font-orbitron font-bold text-2xl">
                {user?.email?.charAt(0).toUpperCase() || 'U'}
              </div>
              <div className="flex-1">
                <h2 className="font-bold text-lg text-foreground">
                  {user?.email?.split('@')[0] || 'Usuario TAMV'}
                </h2>
                <p className="text-sm text-muted-foreground">{user?.email}</p>
                <div className="flex items-center gap-2 mt-1">
                  <span className="px-2 py-0.5 text-xs font-bold bg-primary/20 text-primary rounded">
                    CITIZEN
                  </span>
                  <span className="text-xs text-muted-foreground">ID-NVIDA verificado</span>
                </div>
              </div>
              <Link
                to="/profile"
                className="px-4 py-2 rounded-xl border border-primary/20 text-sm font-medium text-primary hover:bg-primary/10 transition-colors"
              >
                Editar perfil
              </Link>
            </div>
          </motion.div>

          {/* Settings Sections */}
          {settingsSections.map((section, sectionIndex) => (
            <motion.section
              key={section.title}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: sectionIndex * 0.1 }}
              className="rounded-2xl border border-primary/10 bg-card/30 backdrop-blur-sm overflow-hidden"
            >
              <div className="p-4 border-b border-primary/10">
                <h3 className="font-orbitron font-bold text-foreground">{section.title}</h3>
              </div>
              <div className="divide-y divide-primary/10">
                {section.items.map((item) => (
                  item.action === 'link' ? (
                    <Link
                      key={item.label}
                      to={item.to || '#'}
                      className="flex items-center gap-4 p-4 hover:bg-primary/5 transition-colors"
                    >
                      <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center">
                        <item.icon className="w-5 h-5 text-primary" />
                      </div>
                      <div className="flex-1">
                        <p className="font-medium text-foreground">{item.label}</p>
                        <p className="text-sm text-muted-foreground">{item.description}</p>
                      </div>
                      <ChevronRight className="w-5 h-5 text-muted-foreground" />
                    </Link>
                  ) : (
                    <div
                      key={item.label}
                      className="flex items-center gap-4 p-4"
                    >
                      <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center">
                        <item.icon className="w-5 h-5 text-primary" />
                      </div>
                      <div className="flex-1">
                        <p className="font-medium text-foreground">{item.label}</p>
                        <p className="text-sm text-muted-foreground">{item.description}</p>
                      </div>
                      <Switch
                        checked={item.value}
                        onCheckedChange={item.onChange}
                      />
                    </div>
                  )
                ))}
              </div>
            </motion.section>
          ))}

          {/* Sign Out */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
          >
            <button
              onClick={handleSignOut}
              className="w-full flex items-center gap-4 p-4 rounded-2xl border border-destructive/20 bg-destructive/5 hover:bg-destructive/10 transition-colors"
            >
              <div className="w-10 h-10 rounded-xl bg-destructive/10 flex items-center justify-center">
                <LogOut className="w-5 h-5 text-destructive" />
              </div>
              <div className="flex-1 text-left">
                <p className="font-medium text-destructive">Cerrar sesión</p>
                <p className="text-sm text-muted-foreground">Salir de tu cuenta TAMV</p>
              </div>
            </button>
          </motion.div>

          {/* Footer */}
          <div className="text-center py-8 text-sm text-muted-foreground">
            <p>TAMV MD-X4™ v2.0</p>
            <p className="mt-1">© 2026 TAMV Online Network. Todos los derechos reservados.</p>
            <div className="flex items-center justify-center gap-4 mt-4">
              <Link to="/whitepaper" className="hover:text-primary transition-colors">
                Whitepaper MSR
              </Link>
              <span>•</span>
              <Link to="/privacy" className="hover:text-primary transition-colors">
                Privacidad
              </Link>
              <span>•</span>
              <Link to="/terms" className="hover:text-primary transition-colors">
                Términos
              </Link>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default Settings;
