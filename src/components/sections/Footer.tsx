import { motion } from 'framer-motion';
import { Github, Twitter, FileText, Mail } from 'lucide-react';

export const Footer = () => {
  return (
    <footer className="py-16 border-t border-border/50 relative">
      <div className="absolute inset-0 bg-gradient-to-t from-card/50 to-transparent" />
      
      <div className="container mx-auto px-6 relative z-10">
        <div className="grid md:grid-cols-4 gap-12 mb-12">
          {/* Brand */}
          <div className="md:col-span-2">
            <motion.div
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true }}
            >
              <h3 className="font-orbitron text-2xl font-bold mb-3">
                <span className="text-gradient-sovereign">TAMV</span>
                <span className="text-foreground"> MD-X4™</span>
              </h3>
              <p className="text-muted-foreground font-inter text-sm max-w-md mb-4">
                Infraestructura de Soberanía Digital Triple Federada. 
                Un sistema operativo civilizatorio para creadores que prioriza 
                verdad, memoria y dignidad.
              </p>
              <p className="text-muted-foreground/60 font-inter text-xs">
                Versión 2026.1.0 — Estado Digital Soberano
              </p>
            </motion.div>
          </div>

          {/* Ecosystem */}
          <div>
            <h4 className="font-orbitron text-sm font-semibold text-foreground mb-4">Ecosistema</h4>
            <ul className="space-y-2 font-inter text-sm">
              <li><a href="#" className="text-muted-foreground hover:text-primary transition-colors">DreamSpaces</a></li>
              <li><a href="#" className="text-muted-foreground hover:text-primary transition-colors">Social Nexus</a></li>
              <li><a href="#" className="text-muted-foreground hover:text-primary transition-colors">MSR Blockchain</a></li>
              <li><a href="#" className="text-muted-foreground hover:text-primary transition-colors">BookPI Audit</a></li>
            </ul>
          </div>

          {/* Resources */}
          <div>
            <h4 className="font-orbitron text-sm font-semibold text-foreground mb-4">Recursos</h4>
            <ul className="space-y-2 font-inter text-sm">
              <li><a href="#" className="text-muted-foreground hover:text-secondary transition-colors">Whitepaper</a></li>
              <li><a href="#" className="text-muted-foreground hover:text-secondary transition-colors">Documentación</a></li>
              <li><a href="#" className="text-muted-foreground hover:text-secondary transition-colors">API Reference</a></li>
              <li><a href="#" className="text-muted-foreground hover:text-secondary transition-colors">Gobernanza</a></li>
            </ul>
          </div>
        </div>

        {/* Bottom */}
        <div className="flex flex-col sm:flex-row items-center justify-between pt-8 border-t border-border/30">
          <p className="text-muted-foreground/60 font-inter text-xs mb-4 sm:mb-0">
            © 2026 TAMV MD-X4. Todos los derechos soberanos reservados.
          </p>
          
          <div className="flex items-center gap-4">
            <a href="#" className="text-muted-foreground hover:text-primary transition-colors">
              <Github className="w-5 h-5" />
            </a>
            <a href="#" className="text-muted-foreground hover:text-primary transition-colors">
              <Twitter className="w-5 h-5" />
            </a>
            <a href="#" className="text-muted-foreground hover:text-primary transition-colors">
              <FileText className="w-5 h-5" />
            </a>
            <a href="#" className="text-muted-foreground hover:text-primary transition-colors">
              <Mail className="w-5 h-5" />
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
};
