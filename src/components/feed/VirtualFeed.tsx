import { useState, useEffect, useRef, useCallback, memo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { 
  TrendingUp, MessageCircle, Heart, MoreHorizontal, 
  Image, Video, Send, Globe, Zap, Bookmark, Loader2,
  X, Camera, Smile
} from 'lucide-react';
import { usePosts } from '@/hooks/usePosts';
import { useAuth } from '@/hooks/useAuth';
import { useSoundEffects } from '@/hooks/useSoundEffects';
import { SecureMediaUploader } from '@/components/ui/SecureMediaUploader';
import { toast } from 'sonner';
 
 interface DisplayPost {
   id: string;
   author: {
     name: string;
     username: string;
     verified: boolean;
     trustLevel: string;
     avatarUrl?: string;
   };
   content: string;
   media?: { type: 'image' | 'video'; url: string };
   stats: { likes: number; comments: number; shares: number };
   time: string;
   trending?: boolean;
   liked?: boolean;
 }
 
 const formatNumber = (num: number) => {
   if (num >= 1000000) return `${(num / 1000000).toFixed(1)}M`;
   if (num >= 1000) return `${(num / 1000).toFixed(1)}K`;
   return num.toString();
 };
 
 // Memoized post card for performance
 const PostCard = memo(({ post, onLike }: { post: DisplayPost; onLike: (id: string) => void }) => {
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
           <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-primary/20 to-isabella/20 border border-primary/20 flex items-center justify-center overflow-hidden">
             {post.author.avatarUrl ? (
               <img src={post.author.avatarUrl} alt="" className="w-full h-full object-cover" />
             ) : (
               <span className="text-lg font-orbitron font-bold text-primary">
                 {post.author.name.charAt(0)}
               </span>
             )}
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
             <span className={`px-1.5 py-0.5 text-[9px] font-bold rounded ${trustColors[post.author.trustLevel] || trustColors.citizen}`}>
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
               {post.media.url ? (
                 <img src={post.media.url} alt="" className="w-full h-full object-cover" />
               ) : (
                 <div className="absolute inset-0 flex items-center justify-center">
                   {post.media.type === 'image' ? (
                     <Image className="w-12 h-12 text-primary/30" />
                   ) : (
                     <Video className="w-12 h-12 text-primary/30" />
                   )}
                 </div>
               )}
             </div>
           )}
 
           <div className="flex items-center justify-between text-muted-foreground">
             <button className="flex items-center gap-2 p-2 rounded-lg hover:bg-primary/10 hover:text-primary transition-colors">
               <MessageCircle className="w-4 h-4" />
               <span className="text-sm">{formatNumber(post.stats.comments)}</span>
             </button>
             <button 
               onClick={() => onLike(post.id)}
               className={`flex items-center gap-2 p-2 rounded-lg transition-colors ${
                 post.liked 
                   ? 'text-destructive' 
                   : 'hover:bg-destructive/10 hover:text-destructive'
               }`}
             >
               <Heart className={`w-4 h-4 ${post.liked ? 'fill-current' : ''}`} />
               <span className="text-sm">{formatNumber(post.stats.likes)}</span>
             </button>
             <button className="flex items-center gap-2 p-2 rounded-lg hover:bg-secondary/10 hover:text-secondary transition-colors">
               <Send className="w-4 h-4" />
               <span className="text-sm">{formatNumber(post.stats.shares)}</span>
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
   const navigate = useNavigate();
   const { user } = useAuth();
   const { posts: dbPosts, loading, hasMore, loadMore, likePost, createPost } = usePosts();
  const { playClick, playSuccess } = useSoundEffects();
  const observerRef = useRef<IntersectionObserver>();
  const loadMoreRef = useRef<HTMLDivElement>(null);
  const [newPostContent, setNewPostContent] = useState('');
  const [isPosting, setIsPosting] = useState(false);
  const [showMediaUploader, setShowMediaUploader] = useState(false);
  const [uploadedMedia, setUploadedMedia] = useState<{ url: string; type: string; name: string }[]>([]);
 
   function getTimeAgo(date: string): string {
     const now = new Date();
     const past = new Date(date);
     const diffMs = now.getTime() - past.getTime();
     const diffMins = Math.floor(diffMs / 60000);
     const diffHours = Math.floor(diffMins / 60);
     const diffDays = Math.floor(diffHours / 24);
     
     if (diffMins < 1) return 'ahora';
     if (diffMins < 60) return `${diffMins}m`;
     if (diffHours < 24) return `${diffHours}h`;
     return `${diffDays}d`;
   }
 
   // Transform DB posts to display format
   const displayPosts: DisplayPost[] = dbPosts.map(post => ({
     id: post.id,
     author: {
       name: post.author?.display_name || 'Usuario TAMV',
       username: `@${post.author?.display_name?.toLowerCase().replace(/\s+/g, '_') || 'usuario'}`,
       verified: post.author?.trust_level !== 'observer',
       trustLevel: post.author?.trust_level || 'citizen',
       avatarUrl: post.author?.avatar_url || undefined,
     },
     content: post.content || '',
     media: post.media_urls?.length ? { 
       type: 'image' as const, 
       url: post.media_urls[0] 
     } : undefined,
     stats: { 
       likes: post.likes_count, 
       comments: post.comments_count, 
       shares: post.shares_count 
     },
     time: getTimeAgo(post.created_at),
     trending: post.likes_count > 100,
     liked: false,
   }));
 
   const handleLike = async (postId: string) => {
     playClick();
     await likePost(postId);
   };
 
  const handleMediaUpload = (files: { url: string; type: string; name: string }[]) => {
    setUploadedMedia(files);
  };

  const removeMedia = (index: number) => {
    setUploadedMedia(prev => prev.filter((_, i) => i !== index));
  };

  const handleCreatePost = async () => {
    if (!user) {
      toast.error('Inicia sesión para publicar');
      navigate('/auth');
      return;
    }
    if (!newPostContent.trim() && uploadedMedia.length === 0) {
      toast.error('Escribe algo o sube una imagen');
      return;
    }

    setIsPosting(true);
    try {
      const mediaUrls = uploadedMedia.map(m => m.url);
      const kind = uploadedMedia.some(m => m.type.startsWith('video/')) ? 'video' : 
                   uploadedMedia.length > 0 ? 'image' : 'text';
      
      await createPost({ 
        kind, 
        content: newPostContent,
        media_urls: mediaUrls.length > 0 ? mediaUrls : undefined,
      });
      setNewPostContent('');
      setUploadedMedia([]);
      setShowMediaUploader(false);
      playSuccess();
      toast.success('¡Publicación creada!');
    } catch (err) {
      toast.error('Error al publicar');
    } finally {
      setIsPosting(false);
    }
  };
 
   // Intersection observer for infinite scroll
   useEffect(() => {
     if (observerRef.current) {
       observerRef.current.disconnect();
     }
 
     observerRef.current = new IntersectionObserver(
       (entries) => {
         if (entries[0].isIntersecting && !loading) {
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
   }, [loadMore, loading]);
 
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
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-primary to-isabella flex items-center justify-center text-background font-bold flex-shrink-0">
              {user?.email?.charAt(0).toUpperCase() || 'U'}
            </div>
            <div className="flex-1">
              <textarea
                value={newPostContent}
                onChange={(e) => setNewPostContent(e.target.value)}
                placeholder="¿Qué estás creando hoy?"
                rows={2}
                className="w-full bg-transparent text-foreground placeholder:text-muted-foreground focus:outline-none text-sm py-2 resize-none"
              />
              
              {/* Uploaded Media Preview */}
              <AnimatePresence>
                {uploadedMedia.length > 0 && (
                  <motion.div 
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: 'auto' }}
                    exit={{ opacity: 0, height: 0 }}
                    className="flex gap-2 flex-wrap mb-3"
                  >
                    {uploadedMedia.map((media, index) => (
                      <div key={index} className="relative group">
                        <div className="w-20 h-20 rounded-lg overflow-hidden border border-primary/20 bg-muted">
                          {media.type.startsWith('image/') ? (
                            <img src={media.url} alt="" className="w-full h-full object-cover" />
                          ) : media.type.startsWith('video/') ? (
                            <video src={media.url} className="w-full h-full object-cover" />
                          ) : (
                            <div className="w-full h-full flex items-center justify-center">
                              <Camera className="w-8 h-8 text-muted-foreground" />
                            </div>
                          )}
                        </div>
                        <button
                          onClick={() => removeMedia(index)}
                          className="absolute -top-2 -right-2 p-1 rounded-full bg-destructive text-white opacity-0 group-hover:opacity-100 transition-opacity"
                        >
                          <X className="w-3 h-3" />
                        </button>
                      </div>
                    ))}
                  </motion.div>
                )}
              </AnimatePresence>

              {/* Media Uploader */}
              <AnimatePresence>
                {showMediaUploader && (
                  <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: 'auto' }}
                    exit={{ opacity: 0, height: 0 }}
                    className="mb-3"
                  >
                    <SecureMediaUploader
                      bucket="posts-media"
                      folder="posts"
                      maxFiles={4}
                      maxSizeMB={50}
                      allowedTypes={['image', 'video']}
                      onUpload={handleMediaUpload}
                      className="bg-muted/30 rounded-xl"
                    />
                  </motion.div>
                )}
              </AnimatePresence>
              
              <div className="flex items-center justify-between pt-2">
                <div className="flex gap-1">
                  <button 
                    onClick={() => setShowMediaUploader(!showMediaUploader)}
                    className={`p-2 rounded-lg transition-colors ${
                      showMediaUploader ? 'bg-primary/20 text-primary' : 'hover:bg-primary/10 text-primary'
                    }`}
                  >
                    <Image className="w-5 h-5" />
                  </button>
                  <button 
                    onClick={() => setShowMediaUploader(!showMediaUploader)}
                    className={`p-2 rounded-lg transition-colors ${
                      showMediaUploader ? 'bg-primary/20 text-primary' : 'hover:bg-primary/10 text-primary'
                    }`}
                  >
                    <Video className="w-5 h-5" />
                  </button>
                  <button className="p-2 rounded-lg hover:bg-primary/10 text-muted-foreground transition-colors">
                    <Smile className="w-5 h-5" />
                  </button>
                </div>
                <button 
                  onClick={handleCreatePost}
                  disabled={isPosting || (!newPostContent.trim() && uploadedMedia.length === 0)}
                  className="px-4 py-1.5 rounded-lg bg-primary text-background text-sm font-medium hover:bg-primary/90 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
                >
                  {isPosting ? <Loader2 className="w-4 h-4 animate-spin" /> : null}
                  {isPosting ? 'Publicando...' : 'Publicar'}
                </button>
              </div>
            </div>
          </div>
        </div>
 
       {/* Posts */}
       <div className="divide-y divide-primary/10">
         {displayPosts.map((post) => (
           <PostCard key={post.id} post={post} onLike={handleLike} />
         ))}
       </div>
 
       {/* Load More Trigger */}
       <div ref={loadMoreRef} className="p-4 text-center">
         {loading ? (
           <div className="flex items-center justify-center gap-2 text-muted-foreground">
             <Loader2 className="w-5 h-5 animate-spin" />
             <span className="text-sm">Cargando publicaciones...</span>
           </div>
         ) : hasMore ? (
           <span className="text-sm text-muted-foreground">
             {displayPosts.length === 0 ? 'No hay publicaciones aún. ¡Sé el primero!' : 'Scroll para cargar más'}
           </span>
         ) : (
           <span className="text-sm text-muted-foreground">Has visto todas las publicaciones</span>
         )}
       </div>
     </section>
   );
 };