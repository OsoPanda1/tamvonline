import { motion } from 'framer-motion';
import { 
  TrendingUp, Users, MessageCircle, Heart, 
  MoreHorizontal, Image, Video, Send, Smile,
  Globe, Clock, Zap, Bookmark
} from 'lucide-react';

interface Post {
  id: string;
  author: {
    name: string;
    username: string;
    avatar: string;
    verified: boolean;
    trustLevel: string;
  };
  content: string;
  media?: { type: 'image' | 'video'; url: string };
  stats: { likes: string; comments: string; shares: string };
  time: string;
  trending?: boolean;
}

const mockPosts: Post[] = [
  {
    id: '1',
    author: {
      name: 'Isabella AI',
      username: '@isabella_core',
      avatar: '',
      verified: true,
      trustLevel: 'archon'
    },
    content: '🌟 Nuevo módulo EOCT v2.3 desplegado. La ética en tiempo de cómputo ahora procesa 150K decisiones/segundo con un score promedio de 0.94. La transparencia verificable es nuestra constitución. #MSReconomy #TAMVCore',
    stats: { likes: '24.5K', comments: '1.2K', shares: '890' },
    time: '2h',
    trending: true
  },
  {
    id: '2',
    author: {
      name: 'DreamSpace Creator',
      username: '@xr_architect',
      avatar: '',
      verified: true,
      trustLevel: 'sovereign'
    },
    content: '✨ Just launched my first DreamSpace: "Nebula Lounge" - a zero-gravity social space with real-time aurora simulations. Mint is live! 500 MSR entry, 75% goes directly to me. This is what creator-first economy looks like. 🚀',
    media: { type: 'image', url: '' },
    stats: { likes: '8.9K', comments: '456', shares: '234' },
    time: '4h'
  },
  {
    id: '3',
    author: {
      name: 'UTAMV Official',
      username: '@utamv_edu',
      avatar: '',
      verified: true,
      trustLevel: 'guardian'
    },
    content: '📚 Nueva masterclass disponible: "Desarrollo de Experiencias XR con KAOS Audio Engine". Aprende a crear feedback háptico sincronizado con audio 3D. Certificación BookPI incluida. #UTAMV #XRDevelopment',
    stats: { likes: '5.2K', comments: '678', shares: '1.1K' },
    time: '6h'
  }
];

const PostCard = ({ post }: { post: Post }) => {
  const trustColors: Record<string, string> = {
    archon: 'bg-gradient-to-r from-secondary to-fenix text-background',
    sovereign: 'bg-gradient-to-r from-primary to-cyber-cyan text-background',
    guardian: 'bg-isabella text-white',
    citizen: 'bg-kernel text-white',
    observer: 'bg-muted text-muted-foreground'
  };

  return (
    <motion.article
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      className="p-4 border-b border-primary/10 hover:bg-primary/5 transition-colors"
    >
      {/* Trending Badge */}
      {post.trending && (
        <div className="flex items-center gap-2 mb-3 text-fenix text-sm">
          <TrendingUp className="w-4 h-4" />
          <span className="font-medium">Trending en TAMV</span>
        </div>
      )}

      <div className="flex gap-3">
        {/* Avatar */}
        <div className="relative flex-shrink-0">
          <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-primary/20 to-isabella/20 border border-primary/20 flex items-center justify-center">
            <span className="text-lg font-orbitron font-bold text-primary">
              {post.author.name.charAt(0)}
            </span>
          </div>
          {post.author.verified && (
            <div className="absolute -bottom-1 -right-1 w-5 h-5 rounded-full bg-primary flex items-center justify-center">
              <Zap className="w-3 h-3 text-background" />
            </div>
          )}
        </div>

        {/* Content */}
        <div className="flex-1 min-w-0">
          {/* Header */}
          <div className="flex items-center gap-2 mb-1">
            <span className="font-bold text-foreground truncate">{post.author.name}</span>
            <span className={`px-1.5 py-0.5 text-[9px] font-bold rounded ${trustColors[post.author.trustLevel]}`}>
              {post.author.trustLevel.toUpperCase()}
            </span>
            <span className="text-muted-foreground text-sm">{post.author.username}</span>
            <span className="text-muted-foreground">·</span>
            <span className="text-muted-foreground text-sm">{post.time}</span>
            <button className="ml-auto p-1 rounded-lg hover:bg-primary/10 text-muted-foreground">
              <MoreHorizontal className="w-4 h-4" />
            </button>
          </div>

          {/* Text */}
          <p className="text-foreground text-sm leading-relaxed mb-3 whitespace-pre-wrap">
            {post.content}
          </p>

          {/* Media */}
          {post.media && (
            <div className="relative aspect-video rounded-xl overflow-hidden mb-3 bg-abyss-lighter border border-primary/10">
              <div className="absolute inset-0 flex items-center justify-center">
                {post.media.type === 'image' ? (
                  <Image className="w-12 h-12 text-primary/30" />
                ) : (
                  <Video className="w-12 h-12 text-primary/30" />
                )}
              </div>
            </div>
          )}

          {/* Actions */}
          <div className="flex items-center justify-between text-muted-foreground">
            <button className="flex items-center gap-2 p-2 rounded-lg hover:bg-primary/10 hover:text-primary transition-colors">
              <MessageCircle className="w-4 h-4" />
              <span className="text-sm">{post.stats.comments}</span>
            </button>
            <button className="flex items-center gap-2 p-2 rounded-lg hover:bg-destructive/10 hover:text-destructive transition-colors">
              <Heart className="w-4 h-4" />
              <span className="text-sm">{post.stats.likes}</span>
            </button>
            <button className="flex items-center gap-2 p-2 rounded-lg hover:bg-secondary/10 hover:text-secondary transition-colors">
              <Send className="w-4 h-4" />
              <span className="text-sm">{post.stats.shares}</span>
            </button>
            <button className="p-2 rounded-lg hover:bg-primary/10 hover:text-primary transition-colors">
              <Bookmark className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>
    </motion.article>
  );
};

export const GlobalFeed = () => {
  return (
    <section className="border border-primary/10 rounded-2xl overflow-hidden bg-card/30 backdrop-blur-sm">
      {/* Header */}
      <div className="flex items-center justify-between p-4 border-b border-primary/10">
        <div className="flex items-center gap-2">
          <Globe className="w-5 h-5 text-primary" />
          <h2 className="font-orbitron font-bold text-foreground">Muro Global</h2>
        </div>
        <div className="flex gap-2">
          {['Para ti', 'Siguiendo', 'Trending'].map((tab, i) => (
            <button
              key={tab}
              className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-colors ${
                i === 0 
                  ? 'bg-primary/20 text-primary' 
                  : 'text-muted-foreground hover:text-foreground'
              }`}
            >
              {tab}
            </button>
          ))}
        </div>
      </div>

      {/* Compose */}
      <div className="p-4 border-b border-primary/10 bg-muted/20">
        <div className="flex gap-3">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-primary to-isabella flex items-center justify-center text-background font-bold">
            U
          </div>
          <div className="flex-1">
            <input
              type="text"
              placeholder="¿Qué estás creando hoy?"
              className="w-full bg-transparent text-foreground placeholder:text-muted-foreground focus:outline-none text-sm py-2"
            />
            <div className="flex items-center justify-between pt-2">
              <div className="flex gap-2">
                <button className="p-2 rounded-lg hover:bg-primary/10 text-primary transition-colors">
                  <Image className="w-5 h-5" />
                </button>
                <button className="p-2 rounded-lg hover:bg-primary/10 text-primary transition-colors">
                  <Video className="w-5 h-5" />
                </button>
                <button className="p-2 rounded-lg hover:bg-primary/10 text-primary transition-colors">
                  <Smile className="w-5 h-5" />
                </button>
              </div>
              <button className="px-4 py-1.5 rounded-lg bg-primary text-background text-sm font-medium hover:bg-primary/90 transition-colors">
                Publicar
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Posts */}
      <div className="divide-y divide-primary/10">
        {mockPosts.map((post) => (
          <PostCard key={post.id} post={post} />
        ))}
      </div>

      {/* Load More */}
      <div className="p-4 text-center">
        <button className="text-primary text-sm font-medium hover:underline">
          Cargar más publicaciones
        </button>
      </div>
    </section>
  );
};
