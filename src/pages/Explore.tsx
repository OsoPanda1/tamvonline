// Explore Page — TAMV MD-X4™
import { useState } from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { 
  Search, TrendingUp, Users, Video, Music, 
  Sparkles, Zap, Globe, Filter, Grid3X3, List
} from 'lucide-react';
import { TopNavBar } from '@/components/home/TopNavBar';
import { LeftSidebar } from '@/components/home/LeftSidebar';
import { AztecBackground } from '@/components/ui/AztecBackground';

const categories = [
  { id: 'all', label: 'Todo', icon: Globe },
  { id: 'trending', label: 'Trending', icon: TrendingUp },
  { id: 'creators', label: 'Creadores', icon: Users },
  { id: 'videos', label: 'Videos', icon: Video },
  { id: 'music', label: 'Música', icon: Music },
  { id: 'dreamspaces', label: 'DreamSpaces', icon: Sparkles },
];

const trendingTopics = [
  { tag: '#TAMVLaunch', posts: 12500, change: '+25%' },
  { tag: '#MSRToken', posts: 8700, change: '+18%' },
  { tag: '#DreamSpaces', posts: 6200, change: '+42%' },
  { tag: '#IsabellaAI', posts: 4100, change: '+15%' },
  { tag: '#CreadoresLatinos', posts: 3800, change: '+8%' },
];

const featuredCreators = [
  { 
    name: 'Edwin Castillo', 
    username: '@osopanda1', 
    avatar: null, 
    followers: '12.5K', 
    trustLevel: 'archon',
    verified: true 
  },
  { 
    name: 'Isabella AI', 
    username: '@isabella', 
    avatar: null, 
    followers: '∞', 
    trustLevel: 'sovereign',
    verified: true 
  },
  { 
    name: 'TAMV Network', 
    username: '@tamvonline', 
    avatar: null, 
    followers: '45.2K', 
    trustLevel: 'archon',
    verified: true 
  },
];

const Explore = () => {
  const [activeCategory, setActiveCategory] = useState('all');
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');

  const trustColors: Record<string, string> = {
    archon: 'bg-gradient-to-r from-secondary to-fenix text-background',
    sovereign: 'bg-gradient-to-r from-primary to-cyber-cyan text-background',
    guardian: 'bg-isabella text-white',
    citizen: 'bg-kernel text-white',
    observer: 'bg-muted text-muted-foreground'
  };

  return (
    <div className="min-h-screen bg-background relative">
      <AztecBackground variant="subtle" />
      <TopNavBar />
      <LeftSidebar />

      <main className="pt-24 pb-32 pl-20 lg:pl-72 pr-4 transition-all duration-300">
        <div className="max-w-[1400px] mx-auto space-y-8">
          {/* Header */}
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div>
              <h1 className="text-3xl font-orbitron font-bold text-gradient-sovereign">
                Explorar
              </h1>
              <p className="text-muted-foreground mt-1">
                Descubre creadores, contenido y experiencias en TAMV
              </p>
            </div>
            
            <div className="flex items-center gap-2">
              <button
                onClick={() => setViewMode('grid')}
                className={`p-2 rounded-lg transition-colors ${
                  viewMode === 'grid' 
                    ? 'bg-primary/20 text-primary' 
                    : 'text-muted-foreground hover:text-foreground'
                }`}
              >
                <Grid3X3 className="w-5 h-5" />
              </button>
              <button
                onClick={() => setViewMode('list')}
                className={`p-2 rounded-lg transition-colors ${
                  viewMode === 'list' 
                    ? 'bg-primary/20 text-primary' 
                    : 'text-muted-foreground hover:text-foreground'
                }`}
              >
                <List className="w-5 h-5" />
              </button>
              <button className="p-2 rounded-lg text-muted-foreground hover:text-foreground transition-colors">
                <Filter className="w-5 h-5" />
              </button>
            </div>
          </div>

          {/* Categories */}
          <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-thin">
            {categories.map((cat) => (
              <motion.button
                key={cat.id}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={() => setActiveCategory(cat.id)}
                className={`flex items-center gap-2 px-4 py-2 rounded-xl whitespace-nowrap transition-all ${
                  activeCategory === cat.id
                    ? 'bg-primary text-background font-medium'
                    : 'bg-muted/50 text-muted-foreground hover:text-foreground border border-primary/10'
                }`}
              >
                <cat.icon className="w-4 h-4" />
                {cat.label}
              </motion.button>
            ))}
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Main Content Area */}
            <div className="lg:col-span-2 space-y-6">
              {/* Featured DreamSpaces */}
              <section className="rounded-2xl border border-primary/10 bg-card/30 backdrop-blur-sm overflow-hidden">
                <div className="p-4 border-b border-primary/10 flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Sparkles className="w-5 h-5 text-secondary" />
                    <h2 className="font-orbitron font-bold">DreamSpaces Destacados</h2>
                  </div>
                  <Link to="/dreamspaces" className="text-sm text-primary hover:underline">
                    Ver todos →
                  </Link>
                </div>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-4 p-4">
                  {['Neo-Tokio', 'Abismo de Marte', 'Santuario', 'Trono Obsidiana', 'Auditorio 4D', 'Neo-Coliseo'].map((space, i) => (
                    <Link
                      key={space}
                      to={`/dreamspaces?space=${space.toLowerCase().replace(' ', '-')}`}
                      className="group relative aspect-video rounded-xl overflow-hidden bg-gradient-to-br from-primary/20 to-secondary/20 border border-primary/10 hover:border-primary/40 transition-all"
                    >
                      <div className="absolute inset-0 flex items-center justify-center">
                        <Sparkles className="w-8 h-8 text-primary/30 group-hover:text-primary/60 transition-colors" />
                      </div>
                      <div className="absolute bottom-0 left-0 right-0 p-2 bg-gradient-to-t from-background/80">
                        <p className="text-xs font-medium text-foreground">{space}</p>
                      </div>
                      {i < 2 && (
                        <span className="absolute top-2 right-2 px-1.5 py-0.5 text-[9px] font-bold bg-destructive text-white rounded">
                          LIVE
                        </span>
                      )}
                    </Link>
                  ))}
                </div>
              </section>

              {/* Discovery Grid */}
              <section className="rounded-2xl border border-primary/10 bg-card/30 backdrop-blur-sm overflow-hidden">
                <div className="p-4 border-b border-primary/10">
                  <h2 className="font-orbitron font-bold">Descubre Contenido</h2>
                </div>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-4 p-4">
                  {Array.from({ length: 6 }).map((_, i) => (
                    <motion.div
                      key={i}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: i * 0.1 }}
                      className="aspect-square rounded-xl bg-gradient-to-br from-muted/50 to-primary/10 border border-primary/10 hover:border-primary/30 transition-all cursor-pointer flex items-center justify-center"
                    >
                      <div className="text-center p-4">
                        <div className="w-12 h-12 mx-auto rounded-full bg-primary/20 flex items-center justify-center mb-2">
                          {i % 3 === 0 ? <Video className="w-6 h-6 text-primary" /> : 
                           i % 3 === 1 ? <Music className="w-6 h-6 text-secondary" /> :
                           <Sparkles className="w-6 h-6 text-isabella" />}
                        </div>
                        <p className="text-xs text-muted-foreground">Contenido #{i + 1}</p>
                      </div>
                    </motion.div>
                  ))}
                </div>
              </section>
            </div>

            {/* Sidebar */}
            <div className="space-y-6">
              {/* Trending Topics */}
              <section className="rounded-2xl border border-primary/10 bg-card/30 backdrop-blur-sm overflow-hidden">
                <div className="p-4 border-b border-primary/10 flex items-center gap-2">
                  <TrendingUp className="w-5 h-5 text-fenix" />
                  <h2 className="font-orbitron font-bold">Trending</h2>
                </div>
                <div className="divide-y divide-primary/10">
                  {trendingTopics.map((topic, i) => (
                    <Link
                      key={topic.tag}
                      to={`/search?q=${encodeURIComponent(topic.tag)}`}
                      className="block p-3 hover:bg-primary/5 transition-colors"
                    >
                      <div className="flex items-start justify-between">
                        <div>
                          <p className="text-xs text-muted-foreground">#{i + 1} Trending</p>
                          <p className="font-bold text-foreground">{topic.tag}</p>
                          <p className="text-xs text-muted-foreground">{topic.posts.toLocaleString()} publicaciones</p>
                        </div>
                        <span className="text-xs text-emerald-500 font-medium">{topic.change}</span>
                      </div>
                    </Link>
                  ))}
                </div>
              </section>

              {/* Featured Creators */}
              <section className="rounded-2xl border border-primary/10 bg-card/30 backdrop-blur-sm overflow-hidden">
                <div className="p-4 border-b border-primary/10 flex items-center gap-2">
                  <Users className="w-5 h-5 text-primary" />
                  <h2 className="font-orbitron font-bold">Creadores</h2>
                </div>
                <div className="divide-y divide-primary/10">
                  {featuredCreators.map((creator) => (
                    <Link
                      key={creator.username}
                      to={`/profile/${creator.username.replace('@', '')}`}
                      className="flex items-center gap-3 p-3 hover:bg-primary/5 transition-colors"
                    >
                      <div className="relative">
                        <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-primary/20 to-isabella/20 flex items-center justify-center border border-primary/20">
                          <span className="font-orbitron font-bold text-primary">
                            {creator.name.charAt(0)}
                          </span>
                        </div>
                        {creator.verified && (
                          <div className="absolute -bottom-1 -right-1 w-5 h-5 rounded-full bg-primary flex items-center justify-center">
                            <Zap className="w-3 h-3 text-background" />
                          </div>
                        )}
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2">
                          <span className="font-bold text-foreground truncate">{creator.name}</span>
                          <span className={`px-1.5 py-0.5 text-[9px] font-bold rounded ${trustColors[creator.trustLevel]}`}>
                            {creator.trustLevel.toUpperCase()}
                          </span>
                        </div>
                        <p className="text-sm text-muted-foreground truncate">{creator.username}</p>
                        <p className="text-xs text-muted-foreground">{creator.followers} seguidores</p>
                      </div>
                      <button 
                        onClick={(e) => {
                          e.preventDefault();
                          // Follow action
                        }}
                        className="px-3 py-1.5 rounded-lg bg-primary/20 text-primary text-xs font-medium hover:bg-primary/30 transition-colors"
                      >
                        Seguir
                      </button>
                    </Link>
                  ))}
                </div>
              </section>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default Explore;
