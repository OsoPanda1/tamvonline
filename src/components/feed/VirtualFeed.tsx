import { useState, useEffect, useRef, useCallback, memo } from 'react';
import { motion } from 'framer-motion';
import { 
  TrendingUp, MessageCircle, Heart, MoreHorizontal, 
  Image, Video, Send, Globe, Zap, Bookmark, Loader2
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

// Mock data generator for infinite scroll
const generateMockPosts = (page: number, pageSize: number = 10): Post[] => {
  const authors = [
    { name: 'Isabella AI', username: '@isabella_core', trustLevel: 'archon', verified: true },
    { name: 'DreamSpace Creator', username: '@xr_architect', trustLevel: 'sovereign', verified: true },
    { name: 'UTAMV Official', username: '@utamv_edu', trustLevel: 'guardian', verified: true },
    { name: 'CryptoArtist', username: '@crypto_art', trustLevel: 'citizen', verified: false },
    { name: 'MetaExplorer', username: '@meta_explorer', trustLevel: 'citizen', verified: true },
  ];

  const contents = [
    '🌟 Nuevo módulo desplegado. La ética en tiempo de cómputo ahora procesa decisiones con mayor precisión. #MSReconomy #TAMVCore',
    '✨ Just launched my first DreamSpace: "Nebula Lounge" - un espacio social de gravedad cero. 🚀',
    '📚 Nueva masterclass disponible: "Desarrollo de Experiencias XR". Certificación BookPI incluida.',
    '🎨 Arte generativo + blockchain = el futuro de la creatividad digital. #NFT #TAMV',
    '🔥 El metaverso latino está creciendo exponencialmente. ¡Únete a la revolución!',
  ];

  return Array.from({ length: pageSize }, (_, i) => {
    const idx = page * pageSize + i;
    const author = authors[idx % authors.length];
    return {
      id: `post-${idx}`,
      author: { ...author, avatar: '' },
      content: contents[idx % contents.length],
      media: idx % 3 === 0 ? { type: 'image' as const, url: '' } : undefined,
      stats: { 
        likes: `${Math.floor(Math.random() * 50)}K`, 
        comments: `${Math.floor(Math.random() * 5)}K`, 
        shares: `${Math.floor(Math.random() * 2)}K` 
      },
      time: `${idx + 1}h`,
      trending: idx % 5 === 0,
    };
  });
};

// Memoized post card for performance
const PostCard = memo(({ post }: { post: Post }) => {
  const trustColors: Record<string, string> = {
    archon: 'bg-gradient-to-r from-secondary to-fenix text-background',
    sovereign: 'bg-gradient-to-r from-primary to-cyber-cyan text-background',
    guardian: 'bg-isabella text-white',
    citizen: 'bg-kernel text-white',
    observer: 'bg-muted text-muted-foreground'
  };

  return (
    <article className="p-4 border-b border-primary/10 hover:bg-primary/5 transition-colors">
      {post.trending && (
        <div className="flex items-center gap-2 mb-3 text-fenix text-sm">
          <TrendingUp className="w-4 h-4" />
          <span className="font-medium">Trending en TAMV</span>
        </div>
      )}

      <div className="flex gap-3">
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

        <div className="flex-1 min-w-0">
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

          <p className="text-foreground text-sm leading-relaxed mb-3 whitespace-pre-wrap">
            {post.content}
          </p>

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
    </article>
  );
});

PostCard.displayName = 'PostCard';

interface VirtualFeedProps {
  className?: string;
}

export const VirtualFeed = ({ className = '' }: VirtualFeedProps) => {
  const [posts, setPosts] = useState<Post[]>([]);
  const [page, setPage] = useState(0);
  const [isLoading, setIsLoading] = useState(false);
  const [hasMore, setHasMore] = useState(true);
  const observerRef = useRef<IntersectionObserver>();
  const loadMoreRef = useRef<HTMLDivElement>(null);

  // Load initial posts
  useEffect(() => {
    setPosts(generateMockPosts(0));
  }, []);

  // Load more posts on intersection
  const loadMore = useCallback(async () => {
    if (isLoading || !hasMore) return;
    
    setIsLoading(true);
    
    // Simulate network delay
    await new Promise(resolve => setTimeout(resolve, 500));
    
    const newPage = page + 1;
    const newPosts = generateMockPosts(newPage);
    
    if (newPage > 10) {
      setHasMore(false);
    } else {
      setPosts(prev => [...prev, ...newPosts]);
      setPage(newPage);
    }
    
    setIsLoading(false);
  }, [page, isLoading, hasMore]);

  // Intersection observer for infinite scroll
  useEffect(() => {
    if (observerRef.current) {
      observerRef.current.disconnect();
    }

    observerRef.current = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting) {
          loadMore();
        }
      },
      { threshold: 0.1, rootMargin: '200px' }
    );

    if (loadMoreRef.current) {
      observerRef.current.observe(loadMoreRef.current);
    }

    return () => {
      observerRef.current?.disconnect();
    };
  }, [loadMore]);

  return (
    <section className={`border border-primary/10 rounded-2xl overflow-hidden bg-card/30 backdrop-blur-sm ${className}`}>
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
              </div>
              <button className="px-4 py-1.5 rounded-lg bg-primary text-background text-sm font-medium hover:bg-primary/90 transition-colors">
                Publicar
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Virtualized Posts */}
      <div className="divide-y divide-primary/10">
        {posts.map((post) => (
          <PostCard key={post.id} post={post} />
        ))}
      </div>

      {/* Load More Trigger */}
      <div ref={loadMoreRef} className="p-4 text-center">
        {isLoading ? (
          <div className="flex items-center justify-center gap-2 text-muted-foreground">
            <Loader2 className="w-5 h-5 animate-spin" />
            <span className="text-sm">Cargando más publicaciones...</span>
          </div>
        ) : hasMore ? (
          <button 
            onClick={loadMore}
            className="text-primary text-sm font-medium hover:underline"
          >
            Cargar más
          </button>
        ) : (
          <span className="text-sm text-muted-foreground">Has visto todas las publicaciones</span>
        )}
      </div>
    </section>
  );
};
