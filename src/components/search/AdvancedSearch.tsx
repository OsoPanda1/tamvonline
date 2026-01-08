import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Search, X, Filter, Video, User, Music, Box, 
  Sparkles, TrendingUp, Clock, Hash, Mic 
} from 'lucide-react';

type SearchFilter = 'all' | 'videos' | 'users' | 'music' | 'dreamspaces' | 'live';

interface SearchResult {
  id: string;
  type: SearchFilter;
  title: string;
  subtitle?: string;
  image: string;
  stats?: string;
  verified?: boolean;
  live?: boolean;
}

const TRENDING_SEARCHES = [
  { term: 'DreamSpaces futuristas', count: '45.2K' },
  { term: 'Conciertos XR', count: '32.1K' },
  { term: 'Arte digital NFT', count: '28.9K' },
  { term: 'Isabella AI', count: '24.5K' },
  { term: 'Metaverso Latino', count: '19.8K' },
];

const RECENT_SEARCHES = [
  'Galería de arte virtual',
  'Música electrónica',
  'Avatares 3D',
  'Streaming en vivo',
];

const MOCK_RESULTS: SearchResult[] = [
  { id: '1', type: 'videos', title: 'Tour Virtual DreamSpace Cyberpunk', subtitle: '@MetaCreator • 234K views', image: 'https://images.unsplash.com/photo-1614850523296-d8c1af93d400?w=300&h=200&fit=crop', stats: '2.3M' },
  { id: '2', type: 'users', title: 'Isabella AI', subtitle: '@isabella_core • Guardian', image: 'https://images.unsplash.com/photo-1485827404703-89b55fcc595e?w=100&h=100&fit=crop', verified: true, stats: '156K followers' },
  { id: '3', type: 'music', title: 'Sovereign Dreams - Synthwave Mix', subtitle: 'Electronic • 3:45', image: 'https://images.unsplash.com/photo-1571974599782-87624638275e?w=100&h=100&fit=crop', stats: '89K plays' },
  { id: '4', type: 'dreamspaces', title: 'Neon Tokyo Rooftop', subtitle: 'by @VRExplorer • 4.8★', image: 'https://images.unsplash.com/photo-1545569341-9eb8b30979d9?w=300&h=200&fit=crop', stats: '12K visits' },
  { id: '5', type: 'live', title: 'Concierto Electrónico TAMV', subtitle: 'En vivo ahora • 8.2K viewers', image: 'https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?w=300&h=200&fit=crop', live: true },
  { id: '6', type: 'videos', title: 'Tutorial: Crear tu primer DreamSpace', subtitle: '@DreamBuilder • 156K views', image: 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=300&h=200&fit=crop', stats: '890K' },
  { id: '7', type: 'users', title: 'CryptoArtist', subtitle: '@crypto_art • Sovereign', image: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=100&h=100&fit=crop', verified: true, stats: '89K followers' },
  { id: '8', type: 'music', title: 'Metaverse Ambient Vol. 2', subtitle: 'Ambient • 45:12', image: 'https://images.unsplash.com/photo-1614149162883-504ce4d13909?w=100&h=100&fit=crop', stats: '234K plays' },
];

interface AdvancedSearchProps {
  isOpen: boolean;
  onClose: () => void;
}

export const AdvancedSearch = ({ isOpen, onClose }: AdvancedSearchProps) => {
  const [query, setQuery] = useState('');
  const [activeFilter, setActiveFilter] = useState<SearchFilter>('all');
  const [results, setResults] = useState<SearchResult[]>([]);
  const [isListening, setIsListening] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  const filters: { id: SearchFilter; label: string; icon: React.ReactNode }[] = [
    { id: 'all', label: 'Todo', icon: <Sparkles className="w-4 h-4" /> },
    { id: 'videos', label: 'Videos', icon: <Video className="w-4 h-4" /> },
    { id: 'users', label: 'Usuarios', icon: <User className="w-4 h-4" /> },
    { id: 'music', label: 'Música', icon: <Music className="w-4 h-4" /> },
    { id: 'dreamspaces', label: 'DreamSpaces', icon: <Box className="w-4 h-4" /> },
    { id: 'live', label: 'En Vivo', icon: <TrendingUp className="w-4 h-4" /> },
  ];

  useEffect(() => {
    if (isOpen && inputRef.current) {
      inputRef.current.focus();
    }
  }, [isOpen]);

  useEffect(() => {
    if (query.length > 0) {
      // Simulate search with filter
      const filtered = MOCK_RESULTS.filter(r => {
        const matchesQuery = r.title.toLowerCase().includes(query.toLowerCase());
        const matchesFilter = activeFilter === 'all' || r.type === activeFilter;
        return matchesQuery && matchesFilter;
      });
      setResults(filtered);
    } else {
      setResults([]);
    }
  }, [query, activeFilter]);

  const getResultIcon = (type: SearchFilter) => {
    switch (type) {
      case 'videos': return <Video className="w-5 h-5 text-red-500" />;
      case 'users': return <User className="w-5 h-5 text-primary" />;
      case 'music': return <Music className="w-5 h-5 text-purple-500" />;
      case 'dreamspaces': return <Box className="w-5 h-5 text-secondary" />;
      case 'live': return <TrendingUp className="w-5 h-5 text-red-500" />;
      default: return <Sparkles className="w-5 h-5 text-primary" />;
    }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-[100] bg-black/90 backdrop-blur-xl"
          onClick={onClose}
        >
          <motion.div
            initial={{ y: -20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: -20, opacity: 0 }}
            className="w-full max-w-4xl mx-auto pt-20 px-4"
            onClick={e => e.stopPropagation()}
          >
            {/* Search Input */}
            <div className="relative mb-6">
              <div className="absolute left-6 top-1/2 -translate-y-1/2 text-muted-foreground">
                <Search className="w-6 h-6" />
              </div>
              <input
                ref={inputRef}
                type="text"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Buscar videos, usuarios, música, DreamSpaces..."
                className="w-full h-16 pl-16 pr-24 text-xl bg-card border-2 border-border rounded-2xl focus:border-primary focus:ring-4 focus:ring-primary/20 transition-all outline-none text-foreground placeholder:text-muted-foreground"
              />
              <div className="absolute right-4 top-1/2 -translate-y-1/2 flex items-center gap-2">
                <motion.button
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                  onClick={() => setIsListening(!isListening)}
                  className={`p-3 rounded-full transition-colors ${isListening ? 'bg-red-500 text-white' : 'bg-muted text-muted-foreground hover:text-foreground'}`}
                >
                  <Mic className="w-5 h-5" />
                </motion.button>
                {query && (
                  <motion.button
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.9 }}
                    onClick={() => setQuery('')}
                    className="p-3 rounded-full bg-muted text-muted-foreground hover:text-foreground transition-colors"
                  >
                    <X className="w-5 h-5" />
                  </motion.button>
                )}
              </div>
            </div>

            {/* Filters */}
            <div className="flex items-center gap-2 mb-6 overflow-x-auto pb-2">
              {filters.map((filter) => (
                <motion.button
                  key={filter.id}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => setActiveFilter(filter.id)}
                  className={`flex items-center gap-2 px-4 py-2 rounded-full whitespace-nowrap transition-all ${
                    activeFilter === filter.id 
                      ? 'bg-primary text-primary-foreground' 
                      : 'bg-card border border-border text-muted-foreground hover:text-foreground hover:border-primary/50'
                  }`}
                >
                  {filter.icon}
                  <span className="text-sm font-medium">{filter.label}</span>
                </motion.button>
              ))}
            </div>

            {/* Results / Suggestions */}
            <div className="bg-card rounded-2xl border border-border overflow-hidden max-h-[60vh] overflow-y-auto">
              {query.length === 0 ? (
                // Show trending & recent
                <div className="p-4">
                  {/* Trending */}
                  <div className="mb-6">
                    <h3 className="text-sm font-semibold text-muted-foreground uppercase tracking-wider mb-3 flex items-center gap-2">
                      <TrendingUp className="w-4 h-4 text-primary" />
                      Tendencias
                    </h3>
                    <div className="space-y-2">
                      {TRENDING_SEARCHES.map((item, idx) => (
                        <motion.button
                          key={idx}
                          whileHover={{ x: 4 }}
                          onClick={() => setQuery(item.term)}
                          className="w-full flex items-center justify-between p-3 rounded-xl hover:bg-muted/50 transition-colors"
                        >
                          <div className="flex items-center gap-3">
                            <span className="text-lg font-bold text-primary">#{idx + 1}</span>
                            <span className="text-foreground">{item.term}</span>
                          </div>
                          <span className="text-sm text-muted-foreground">{item.count}</span>
                        </motion.button>
                      ))}
                    </div>
                  </div>

                  {/* Recent */}
                  <div>
                    <h3 className="text-sm font-semibold text-muted-foreground uppercase tracking-wider mb-3 flex items-center gap-2">
                      <Clock className="w-4 h-4" />
                      Búsquedas Recientes
                    </h3>
                    <div className="flex flex-wrap gap-2">
                      {RECENT_SEARCHES.map((term, idx) => (
                        <motion.button
                          key={idx}
                          whileHover={{ scale: 1.05 }}
                          onClick={() => setQuery(term)}
                          className="px-4 py-2 rounded-full bg-muted text-sm text-muted-foreground hover:text-foreground hover:bg-muted/80 transition-colors"
                        >
                          {term}
                        </motion.button>
                      ))}
                    </div>
                  </div>
                </div>
              ) : results.length > 0 ? (
                // Show results
                <div className="divide-y divide-border">
                  {results.map((result, idx) => (
                    <motion.button
                      key={result.id}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: idx * 0.05 }}
                      whileHover={{ backgroundColor: 'hsl(var(--muted) / 0.5)' }}
                      className="w-full flex items-center gap-4 p-4 text-left transition-colors"
                    >
                      <div className="relative flex-shrink-0">
                        <img
                          src={result.image}
                          alt={result.title}
                          className={`object-cover ${
                            result.type === 'users' || result.type === 'music' 
                              ? 'w-12 h-12 rounded-full' 
                              : 'w-20 h-14 rounded-xl'
                          }`}
                        />
                        {result.live && (
                          <div className="absolute -top-1 -right-1 px-2 py-0.5 bg-red-500 rounded-full text-[10px] font-bold text-white animate-pulse">
                            LIVE
                          </div>
                        )}
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2">
                          <p className="font-semibold text-foreground truncate">{result.title}</p>
                          {result.verified && (
                            <div className="w-4 h-4 rounded-full bg-primary flex items-center justify-center">
                              <Sparkles className="w-2.5 h-2.5 text-primary-foreground" />
                            </div>
                          )}
                        </div>
                        <p className="text-sm text-muted-foreground truncate">{result.subtitle}</p>
                      </div>
                      <div className="flex items-center gap-2">
                        {getResultIcon(result.type)}
                        {result.stats && (
                          <span className="text-sm text-muted-foreground">{result.stats}</span>
                        )}
                      </div>
                    </motion.button>
                  ))}
                </div>
              ) : (
                // No results
                <div className="p-12 text-center">
                  <Search className="w-12 h-12 text-muted-foreground/50 mx-auto mb-4" />
                  <p className="text-lg font-medium text-muted-foreground">Sin resultados para "{query}"</p>
                  <p className="text-sm text-muted-foreground/70 mt-1">Intenta con otros términos o filtros</p>
                </div>
              )}
            </div>

            {/* Close hint */}
            <p className="text-center text-sm text-muted-foreground mt-4">
              Presiona <kbd className="px-2 py-1 rounded bg-card border border-border font-mono">ESC</kbd> para cerrar
            </p>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};
