// Messages Page — TAMV MD-X4™
import { useState } from 'react';
import { motion } from 'framer-motion';
import { 
  Search, Plus, MoreVertical, Send, Image, Smile, 
  Phone, Video, Settings, ChevronLeft, Check, CheckCheck
} from 'lucide-react';
import { TopNavBar } from '@/components/home/TopNavBar';
import { LeftSidebar } from '@/components/home/LeftSidebar';
import { AztecBackground } from '@/components/ui/AztecBackground';
import { useAuth } from '@/hooks/useAuth';

interface Conversation {
  id: string;
  name: string;
  username: string;
  avatar?: string;
  lastMessage: string;
  time: string;
  unread: number;
  online: boolean;
  trustLevel: string;
}

const mockConversations: Conversation[] = [
  {
    id: '1',
    name: 'Isabella AI',
    username: '@isabella',
    lastMessage: 'He analizado tu consulta. Te recomiendo...',
    time: 'ahora',
    unread: 2,
    online: true,
    trustLevel: 'sovereign'
  },
  {
    id: '2',
    name: 'TAMV Support',
    username: '@tamvsupport',
    lastMessage: 'Tu solicitud ha sido procesada.',
    time: '5m',
    unread: 0,
    online: true,
    trustLevel: 'archon'
  },
  {
    id: '3',
    name: 'Creative Hub',
    username: '@creativehub',
    lastMessage: '¡Bienvenido al grupo de creadores!',
    time: '1h',
    unread: 12,
    online: false,
    trustLevel: 'guardian'
  },
];

const Messages = () => {
  const { user } = useAuth();
  const [selectedConversation, setSelectedConversation] = useState<Conversation | null>(null);
  const [messageInput, setMessageInput] = useState('');
  const [searchQuery, setSearchQuery] = useState('');

  const trustColors: Record<string, string> = {
    archon: 'ring-secondary',
    sovereign: 'ring-primary',
    guardian: 'ring-isabella',
    citizen: 'ring-kernel',
    observer: 'ring-muted'
  };

  return (
    <div className="min-h-screen bg-background relative">
      <AztecBackground variant="subtle" />
      <TopNavBar />
      <LeftSidebar />

      <main className="pt-24 pb-8 pl-20 lg:pl-72 pr-4 transition-all duration-300 h-screen">
        <div className="max-w-[1400px] mx-auto h-[calc(100vh-8rem)]">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 h-full">
            {/* Conversations List */}
            <div className={`rounded-2xl border border-primary/10 bg-card/30 backdrop-blur-sm overflow-hidden flex flex-col ${
              selectedConversation ? 'hidden md:flex' : 'flex'
            }`}>
              {/* Header */}
              <div className="p-4 border-b border-primary/10">
                <div className="flex items-center justify-between mb-4">
                  <h1 className="font-orbitron font-bold text-xl">Mensajes</h1>
                  <button className="p-2 rounded-lg hover:bg-primary/10 text-primary transition-colors">
                    <Plus className="w-5 h-5" />
                  </button>
                </div>
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                  <input
                    type="text"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder="Buscar conversaciones..."
                    className="w-full pl-10 pr-4 py-2 rounded-xl bg-muted/50 border border-primary/10 text-sm focus:outline-none focus:border-primary/40"
                  />
                </div>
              </div>

              {/* Conversations */}
              <div className="flex-1 overflow-y-auto divide-y divide-primary/10">
                {mockConversations.map((conv) => (
                  <motion.button
                    key={conv.id}
                    whileHover={{ x: 4 }}
                    onClick={() => setSelectedConversation(conv)}
                    className={`w-full p-4 flex items-center gap-3 hover:bg-primary/5 transition-colors text-left ${
                      selectedConversation?.id === conv.id ? 'bg-primary/10' : ''
                    }`}
                  >
                    <div className="relative">
                      <div className={`w-12 h-12 rounded-xl bg-gradient-to-br from-primary/20 to-isabella/20 flex items-center justify-center border-2 ${trustColors[conv.trustLevel]}`}>
                        <span className="font-orbitron font-bold text-primary">
                          {conv.name.charAt(0)}
                        </span>
                      </div>
                      {conv.online && (
                        <div className="absolute -bottom-0.5 -right-0.5 w-3.5 h-3.5 rounded-full bg-emerald-500 border-2 border-background" />
                      )}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between">
                        <span className="font-bold text-foreground truncate">{conv.name}</span>
                        <span className="text-xs text-muted-foreground">{conv.time}</span>
                      </div>
                      <p className="text-sm text-muted-foreground truncate">{conv.lastMessage}</p>
                    </div>
                    {conv.unread > 0 && (
                      <span className="w-5 h-5 rounded-full bg-primary text-[10px] font-bold text-background flex items-center justify-center">
                        {conv.unread}
                      </span>
                    )}
                  </motion.button>
                ))}
              </div>
            </div>

            {/* Chat Area */}
            <div className={`md:col-span-2 rounded-2xl border border-primary/10 bg-card/30 backdrop-blur-sm overflow-hidden flex flex-col ${
              !selectedConversation ? 'hidden md:flex' : 'flex'
            }`}>
              {selectedConversation ? (
                <>
                  {/* Chat Header */}
                  <div className="p-4 border-b border-primary/10 flex items-center gap-3">
                    <button
                      onClick={() => setSelectedConversation(null)}
                      className="md:hidden p-2 rounded-lg hover:bg-primary/10 text-muted-foreground"
                    >
                      <ChevronLeft className="w-5 h-5" />
                    </button>
                    <div className="relative">
                      <div className={`w-10 h-10 rounded-xl bg-gradient-to-br from-primary/20 to-isabella/20 flex items-center justify-center border-2 ${trustColors[selectedConversation.trustLevel]}`}>
                        <span className="font-orbitron font-bold text-primary text-sm">
                          {selectedConversation.name.charAt(0)}
                        </span>
                      </div>
                      {selectedConversation.online && (
                        <div className="absolute -bottom-0.5 -right-0.5 w-3 h-3 rounded-full bg-emerald-500 border-2 border-background" />
                      )}
                    </div>
                    <div className="flex-1">
                      <p className="font-bold text-foreground">{selectedConversation.name}</p>
                      <p className="text-xs text-muted-foreground">
                        {selectedConversation.online ? 'En línea' : 'Desconectado'}
                      </p>
                    </div>
                    <div className="flex items-center gap-2">
                      <button className="p-2 rounded-lg hover:bg-primary/10 text-muted-foreground">
                        <Phone className="w-5 h-5" />
                      </button>
                      <button className="p-2 rounded-lg hover:bg-primary/10 text-muted-foreground">
                        <Video className="w-5 h-5" />
                      </button>
                      <button className="p-2 rounded-lg hover:bg-primary/10 text-muted-foreground">
                        <MoreVertical className="w-5 h-5" />
                      </button>
                    </div>
                  </div>

                  {/* Messages Area */}
                  <div className="flex-1 overflow-y-auto p-4 space-y-4">
                    {/* Sample messages */}
                    <div className="flex justify-start">
                      <div className="max-w-[70%] p-3 rounded-2xl rounded-bl-none bg-muted/50 border border-primary/10">
                        <p className="text-sm">¡Hola! ¿En qué puedo ayudarte hoy?</p>
                        <div className="flex items-center justify-end gap-1 mt-1">
                          <span className="text-[10px] text-muted-foreground">10:30</span>
                        </div>
                      </div>
                    </div>
                    <div className="flex justify-end">
                      <div className="max-w-[70%] p-3 rounded-2xl rounded-br-none bg-primary/20 border border-primary/20">
                        <p className="text-sm">Tengo una pregunta sobre MSR tokens.</p>
                        <div className="flex items-center justify-end gap-1 mt-1">
                          <span className="text-[10px] text-muted-foreground">10:31</span>
                          <CheckCheck className="w-3 h-3 text-primary" />
                        </div>
                      </div>
                    </div>
                    <div className="flex justify-start">
                      <div className="max-w-[70%] p-3 rounded-2xl rounded-bl-none bg-muted/50 border border-primary/10">
                        <p className="text-sm">
                          ¡Claro! Los MSR tokens siguen la regla 70/20/10: 70% va al creador, 
                          20% al Fondo Fénix y 10% al Kernel de infraestructura.
                        </p>
                        <div className="flex items-center justify-end gap-1 mt-1">
                          <span className="text-[10px] text-muted-foreground">10:32</span>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Input Area */}
                  <div className="p-4 border-t border-primary/10">
                    <div className="flex items-center gap-2">
                      <button className="p-2 rounded-lg hover:bg-primary/10 text-muted-foreground">
                        <Image className="w-5 h-5" />
                      </button>
                      <button className="p-2 rounded-lg hover:bg-primary/10 text-muted-foreground">
                        <Smile className="w-5 h-5" />
                      </button>
                      <input
                        type="text"
                        value={messageInput}
                        onChange={(e) => setMessageInput(e.target.value)}
                        onKeyDown={(e) => {
                          if (e.key === 'Enter' && !e.shiftKey && messageInput.trim()) {
                            // Send message
                            setMessageInput('');
                          }
                        }}
                        placeholder="Escribe un mensaje..."
                        className="flex-1 px-4 py-2 rounded-xl bg-muted/50 border border-primary/10 text-sm focus:outline-none focus:border-primary/40"
                      />
                      <motion.button
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        disabled={!messageInput.trim()}
                        className="p-2.5 rounded-xl bg-primary text-background disabled:opacity-50 disabled:cursor-not-allowed"
                      >
                        <Send className="w-5 h-5" />
                      </motion.button>
                    </div>
                  </div>
                </>
              ) : (
                <div className="flex-1 flex items-center justify-center">
                  <div className="text-center">
                    <div className="w-20 h-20 mx-auto rounded-2xl bg-primary/10 flex items-center justify-center mb-4">
                      <Send className="w-10 h-10 text-primary/50" />
                    </div>
                    <h2 className="text-xl font-orbitron font-bold text-foreground mb-2">
                      Tus mensajes
                    </h2>
                    <p className="text-muted-foreground text-sm max-w-xs">
                      Selecciona una conversación o inicia una nueva para comenzar a chatear.
                    </p>
                    <button className="mt-4 px-4 py-2 rounded-xl bg-primary text-background text-sm font-medium hover:bg-primary/90 transition-colors">
                      Nuevo mensaje
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default Messages;
