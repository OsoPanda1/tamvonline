import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/hooks/useAuth';
import { useProfile } from '@/hooks/useProfile';
import { useWallet } from '@/hooks/useWallet';
import { 
  Settings, Share2, Edit3, Grid, Video, Music, Box, Heart, 
  Users, Eye, Star, Shield, Sparkles, Crown, Zap, 
  TrendingUp, Calendar, MapPin, Link as LinkIcon, ChevronRight,
  Play, MoreHorizontal, Verified, Award, Gem
} from 'lucide-react';
import { TopNavBar } from '@/components/home/TopNavBar';
import { TrustLevelBadge } from '@/components/wallet/TrustLevelBadge';
import { Footer } from '@/components/sections/Footer';

type ContentTab = 'posts' | 'videos' | 'dreamspaces' | 'music' | 'nfts';

// Mock content data
const MOCK_CONTENT = {
  posts: [
    { id: '1', image: 'https://images.unsplash.com/photo-1634017839464-5c339afa5e92?w=400&h=400&fit=crop', likes: 1234, views: 8900 },
    { id: '2', image: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=400&h=400&fit=crop', likes: 2345, views: 12400 },
    { id: '3', image: 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=400&h=400&fit=crop', likes: 890, views: 4500 },
    { id: '4', image: 'https://images.unsplash.com/photo-1614850523296-d8c1af93d400?w=400&h=400&fit=crop', likes: 3456, views: 18900 },
    { id: '5', image: 'https://images.unsplash.com/photo-1639762681485-074b7f938ba0?w=400&h=400&fit=crop', likes: 567, views: 3200 },
    { id: '6', image: 'https://images.unsplash.com/photo-1633356122544-f134324a6cee?w=400&h=400&fit=crop', likes: 4567, views: 24500 },
  ],
  videos: [
    { id: '1', thumbnail: 'https://images.unsplash.com/photo-1550745165-9bc0b252726f?w=400&h=300&fit=crop', duration: '3:45', views: 234000, title: 'Tour DreamSpace Cyberpunk' },
    { id: '2', thumbnail: 'https://images.unsplash.com/photo-1545569341-9eb8b30979d9?w=400&h=300&fit=crop', duration: '12:30', views: 89000, title: 'Concierto XR Highlights' },
    { id: '3', thumbnail: 'https://images.unsplash.com/photo-1614149162883-504ce4d13909?w=400&h=300&fit=crop', duration: '5:20', views: 156000, title: 'Tutorial: Crear Espacios 3D' },
  ],
  dreamspaces: [
    { id: '1', preview: 'https://images.unsplash.com/photo-1545569341-9eb8b30979d9?w=400&h=250&fit=crop', name: 'Neon Tokyo', visits: 12400, rating: 4.9 },
    { id: '2', preview: 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=400&h=250&fit=crop', name: 'Crystal Cave', visits: 8900, rating: 4.7 },
  ],
  music: [
    { id: '1', cover: 'https://images.unsplash.com/photo-1571974599782-87624638275e?w=200&h=200&fit=crop', title: 'Sovereign Dreams', plays: 89000, duration: '3:45' },
    { id: '2', cover: 'https://images.unsplash.com/photo-1614149162883-504ce4d13909?w=200&h=200&fit=crop', title: 'Metaverse Nights', plays: 56000, duration: '4:12' },
    { id: '3', cover: 'https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?w=200&h=200&fit=crop', title: 'Digital Horizons', plays: 123000, duration: '5:30' },
  ],
  nfts: [
    { id: '1', image: 'https://images.unsplash.com/photo-1634017839464-5c339afa5e92?w=300&h=300&fit=crop', name: 'Genesis #001', price: 2.5, currency: 'MSR' },
    { id: '2', image: 'https://images.unsplash.com/photo-1639762681485-074b7f938ba0?w=300&h=300&fit=crop', name: 'Sovereign Soul', price: 5.0, currency: 'MSR' },
  ]
};

const BADGES = [
  { id: 'early', name: 'Early Adopter', icon: <Star className="w-4 h-4" />, color: 'text-secondary' },
  { id: 'creator', name: 'Creator Pro', icon: <Award className="w-4 h-4" />, color: 'text-primary' },
  { id: 'guardian', name: 'Guardian', icon: <Shield className="w-4 h-4" />, color: 'text-purple-500' },
  { id: 'verified', name: 'Verificado', icon: <Verified className="w-4 h-4" />, color: 'text-blue-500' },
];

const Profile = () => {
  const navigate = useNavigate();
  const { user, loading: authLoading } = useAuth();
  const { profile, loading: profileLoading } = useProfile();
  const { balance } = useWallet();
  const [activeTab, setActiveTab] = useState<ContentTab>('posts');
  const [isFollowing, setIsFollowing] = useState(false);

  if (authLoading || profileLoading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
          className="w-12 h-12 border-4 border-primary border-t-transparent rounded-full"
        />
      </div>
    );
  }

  const formatNumber = (num: number) => {
    if (num >= 1000000) return `${(num / 1000000).toFixed(1)}M`;
    if (num >= 1000) return `${(num / 1000).toFixed(1)}K`;
    return num.toString();
  };

  const tabs = [
    { id: 'posts' as ContentTab, label: 'Posts', icon: <Grid className="w-4 h-4" />, count: 156 },
    { id: 'videos' as ContentTab, label: 'Videos', icon: <Video className="w-4 h-4" />, count: 23 },
    { id: 'dreamspaces' as ContentTab, label: 'DreamSpaces', icon: <Box className="w-4 h-4" />, count: 8 },
    { id: 'music' as ContentTab, label: 'Música', icon: <Music className="w-4 h-4" />, count: 45 },
    { id: 'nfts' as ContentTab, label: 'NFTs', icon: <Gem className="w-4 h-4" />, count: 12 },
  ];

  const digitalDNA = profile?.digital_dna as { genesis?: string; capabilities?: string[]; eoct_baseline?: number } | null;

  return (
    <div className="min-h-screen bg-background">
      <TopNavBar />

      <main className="pt-20 pb-24">
        {/* Hero Banner */}
        <div className="relative h-64 md:h-80 overflow-hidden">
          <img
            src="https://images.unsplash.com/photo-1614850523296-d8c1af93d400?w=1920&h=400&fit=crop"
            alt="Profile Banner"
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-background via-background/50 to-transparent" />
          
          {/* Edit Banner Button */}
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="absolute top-4 right-4 p-3 rounded-full bg-black/50 backdrop-blur-sm text-white hover:bg-black/70 transition-colors"
          >
            <Edit3 className="w-5 h-5" />
          </motion.button>
        </div>

        {/* Profile Info */}
        <div className="max-w-6xl mx-auto px-4 -mt-24 relative z-10">
          <div className="flex flex-col md:flex-row gap-6 md:gap-8 items-start">
            {/* Avatar */}
            <motion.div
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              className="relative"
            >
              <div className="w-32 h-32 md:w-40 md:h-40 rounded-3xl p-1 bg-gradient-to-br from-primary via-secondary to-primary">
                <div className="w-full h-full rounded-[22px] overflow-hidden bg-card">
                  <img
                    src={profile?.avatar_url || `https://api.dicebear.com/7.x/avataaars/svg?seed=${user?.email}`}
                    alt="Avatar"
                    className="w-full h-full object-cover"
                  />
                </div>
              </div>
              {/* Trust Level Badge */}
              <div className="absolute -bottom-2 -right-2">
                <div className="px-3 py-1 rounded-full bg-gradient-to-r from-primary to-secondary text-xs font-bold text-primary-foreground uppercase">
                  {profile?.trust_level || 'Observer'}
                </div>
              </div>
            </motion.div>

            {/* Info */}
            <div className="flex-1">
              <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-4">
                <div>
                  <div className="flex items-center gap-3 mb-2">
                    <h1 className="text-2xl md:text-3xl font-bold font-orbitron text-foreground">
                      {profile?.display_name || 'Usuario TAMV'}
                    </h1>
                    <div className="w-6 h-6 rounded-full bg-primary flex items-center justify-center">
                      <Sparkles className="w-3.5 h-3.5 text-primary-foreground" />
                    </div>
                  </div>
                  <p className="text-muted-foreground mb-3">@{user?.email?.split('@')[0] || 'usuario'}</p>
                  
                  {/* Bio */}
                  <p className="text-foreground/80 max-w-xl mb-4">
                    {profile?.bio || 'Creador digital en el metaverso TAMV. Explorando nuevas fronteras de la creatividad soberana. 🚀✨'}
                  </p>

                  {/* Meta info */}
                  <div className="flex flex-wrap items-center gap-4 text-sm text-muted-foreground">
                    <span className="flex items-center gap-1">
                      <MapPin className="w-4 h-4" /> Metaverso LATAM
                    </span>
                    <span className="flex items-center gap-1">
                      <LinkIcon className="w-4 h-4" /> tamv.world/creator
                    </span>
                    <span className="flex items-center gap-1">
                      <Calendar className="w-4 h-4" /> Enero 2026
                    </span>
                  </div>
                </div>

                {/* Actions */}
                <div className="flex items-center gap-3">
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => setIsFollowing(!isFollowing)}
                    className={`px-6 py-2.5 rounded-xl font-semibold transition-all ${
                      isFollowing 
                        ? 'bg-muted text-foreground border border-border' 
                        : 'bg-gradient-to-r from-primary to-secondary text-primary-foreground'
                    }`}
                  >
                    {isFollowing ? 'Siguiendo' : 'Seguir'}
                  </motion.button>
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    className="p-2.5 rounded-xl bg-muted text-foreground hover:bg-muted/80 transition-colors"
                  >
                    <Share2 className="w-5 h-5" />
                  </motion.button>
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    className="p-2.5 rounded-xl bg-muted text-foreground hover:bg-muted/80 transition-colors"
                  >
                    <MoreHorizontal className="w-5 h-5" />
                  </motion.button>
                </div>
              </div>

              {/* Stats */}
              <div className="grid grid-cols-4 gap-4 mt-6 p-4 rounded-2xl bg-card border border-border">
                <div className="text-center">
                  <p className="text-2xl font-bold text-foreground">{formatNumber(12400)}</p>
                  <p className="text-sm text-muted-foreground">Seguidores</p>
                </div>
                <div className="text-center">
                  <p className="text-2xl font-bold text-foreground">{formatNumber(890)}</p>
                  <p className="text-sm text-muted-foreground">Siguiendo</p>
                </div>
                <div className="text-center">
                  <p className="text-2xl font-bold text-primary">{formatNumber(balance)}</p>
                  <p className="text-sm text-muted-foreground">MSR Balance</p>
                </div>
                <div className="text-center">
                  <p className="text-2xl font-bold text-secondary">{profile?.reputation_score || 0}</p>
                  <p className="text-sm text-muted-foreground">Reputación</p>
                </div>
              </div>
            </div>
          </div>

          {/* Badges */}
          <div className="mt-6">
            <div className="flex items-center gap-3 overflow-x-auto pb-2">
              {BADGES.map((badge) => (
                <motion.div
                  key={badge.id}
                  whileHover={{ scale: 1.05 }}
                  className={`flex items-center gap-2 px-4 py-2 rounded-full bg-card border border-border ${badge.color}`}
                >
                  {badge.icon}
                  <span className="text-sm font-medium whitespace-nowrap">{badge.name}</span>
                </motion.div>
              ))}
            </div>
          </div>

          {/* ADN Digital Visual */}
          {digitalDNA && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="mt-6 p-6 rounded-2xl bg-gradient-to-br from-card to-card/50 border border-border overflow-hidden relative"
            >
              <div className="absolute inset-0 bg-gradient-to-r from-primary/5 via-transparent to-secondary/5" />
              <div className="relative z-10">
                <h3 className="text-lg font-bold font-orbitron text-foreground mb-4 flex items-center gap-2">
                  <Zap className="w-5 h-5 text-primary" />
                  ADN Digital Soberano
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="p-4 rounded-xl bg-muted/50">
                    <p className="text-xs text-muted-foreground uppercase mb-1">Genesis</p>
                    <p className="font-mono text-sm text-primary truncate">{digitalDNA.genesis || 'N/A'}</p>
                  </div>
                  <div className="p-4 rounded-xl bg-muted/50">
                    <p className="text-xs text-muted-foreground uppercase mb-1">EOCT Baseline</p>
                    <p className="font-mono text-sm text-secondary">{digitalDNA.eoct_baseline?.toFixed(2) || '0.85'}</p>
                  </div>
                  <div className="p-4 rounded-xl bg-muted/50">
                    <p className="text-xs text-muted-foreground uppercase mb-1">Capacidades</p>
                    <div className="flex flex-wrap gap-1 mt-1">
                      {(digitalDNA.capabilities || []).slice(0, 3).map((cap, idx) => (
                        <span key={idx} className="px-2 py-0.5 rounded-full bg-primary/20 text-primary text-xs">
                          {cap}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>
          )}

          {/* Content Tabs */}
          <div className="mt-8 border-b border-border">
            <div className="flex items-center gap-1 overflow-x-auto">
              {tabs.map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`flex items-center gap-2 px-6 py-4 font-medium transition-all relative ${
                    activeTab === tab.id 
                      ? 'text-primary' 
                      : 'text-muted-foreground hover:text-foreground'
                  }`}
                >
                  {tab.icon}
                  <span>{tab.label}</span>
                  <span className="text-xs text-muted-foreground">({tab.count})</span>
                  {activeTab === tab.id && (
                    <motion.div
                      layoutId="activeTab"
                      className="absolute bottom-0 left-0 right-0 h-0.5 bg-primary"
                    />
                  )}
                </button>
              ))}
            </div>
          </div>

          {/* Content Grid */}
          <div className="mt-6">
            <AnimatePresence mode="wait">
              {activeTab === 'posts' && (
                <motion.div
                  key="posts"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className="grid grid-cols-2 md:grid-cols-3 gap-4"
                >
                  {MOCK_CONTENT.posts.map((post, idx) => (
                    <motion.div
                      key={post.id}
                      initial={{ opacity: 0, scale: 0.9 }}
                      animate={{ opacity: 1, scale: 1 }}
                      transition={{ delay: idx * 0.05 }}
                      whileHover={{ scale: 1.02 }}
                      className="relative aspect-square rounded-2xl overflow-hidden group cursor-pointer"
                    >
                      <img src={post.image} alt="" className="w-full h-full object-cover" />
                      <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-6">
                        <div className="flex items-center gap-2 text-white">
                          <Heart className="w-5 h-5" />
                          <span className="font-semibold">{formatNumber(post.likes)}</span>
                        </div>
                        <div className="flex items-center gap-2 text-white">
                          <Eye className="w-5 h-5" />
                          <span className="font-semibold">{formatNumber(post.views)}</span>
                        </div>
                      </div>
                    </motion.div>
                  ))}
                </motion.div>
              )}

              {activeTab === 'videos' && (
                <motion.div
                  key="videos"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4"
                >
                  {MOCK_CONTENT.videos.map((video, idx) => (
                    <motion.div
                      key={video.id}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: idx * 0.1 }}
                      className="rounded-2xl overflow-hidden bg-card border border-border group cursor-pointer"
                    >
                      <div className="relative aspect-video">
                        <img src={video.thumbnail} alt="" className="w-full h-full object-cover" />
                        <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                          <div className="w-14 h-14 rounded-full bg-white/20 backdrop-blur-sm flex items-center justify-center">
                            <Play className="w-6 h-6 text-white fill-white" />
                          </div>
                        </div>
                        <div className="absolute bottom-2 right-2 px-2 py-1 rounded bg-black/70 text-white text-xs font-medium">
                          {video.duration}
                        </div>
                      </div>
                      <div className="p-4">
                        <h4 className="font-semibold text-foreground truncate">{video.title}</h4>
                        <p className="text-sm text-muted-foreground mt-1">{formatNumber(video.views)} vistas</p>
                      </div>
                    </motion.div>
                  ))}
                </motion.div>
              )}

              {activeTab === 'dreamspaces' && (
                <motion.div
                  key="dreamspaces"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className="grid grid-cols-1 md:grid-cols-2 gap-6"
                >
                  {MOCK_CONTENT.dreamspaces.map((space, idx) => (
                    <motion.div
                      key={space.id}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: idx * 0.1 }}
                      className="rounded-2xl overflow-hidden bg-card border border-border group cursor-pointer"
                    >
                      <div className="relative aspect-[16/10]">
                        <img src={space.preview} alt="" className="w-full h-full object-cover" />
                        <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent" />
                        <div className="absolute bottom-4 left-4 right-4">
                          <h4 className="text-xl font-bold text-white">{space.name}</h4>
                          <div className="flex items-center gap-4 mt-2 text-white/80 text-sm">
                            <span className="flex items-center gap-1">
                              <Eye className="w-4 h-4" /> {formatNumber(space.visits)} visitas
                            </span>
                            <span className="flex items-center gap-1">
                              <Star className="w-4 h-4 text-secondary fill-secondary" /> {space.rating}
                            </span>
                          </div>
                        </div>
                        <motion.button
                          whileHover={{ scale: 1.1 }}
                          whileTap={{ scale: 0.9 }}
                          className="absolute top-4 right-4 px-4 py-2 rounded-full bg-primary text-primary-foreground text-sm font-semibold opacity-0 group-hover:opacity-100 transition-opacity"
                        >
                          Entrar
                        </motion.button>
                      </div>
                    </motion.div>
                  ))}
                </motion.div>
              )}

              {activeTab === 'music' && (
                <motion.div
                  key="music"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className="space-y-3"
                >
                  {MOCK_CONTENT.music.map((track, idx) => (
                    <motion.div
                      key={track.id}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: idx * 0.1 }}
                      className="flex items-center gap-4 p-4 rounded-2xl bg-card border border-border hover:bg-muted/50 transition-colors group cursor-pointer"
                    >
                      <div className="relative w-16 h-16 rounded-xl overflow-hidden flex-shrink-0">
                        <img src={track.cover} alt="" className="w-full h-full object-cover" />
                        <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                          <Play className="w-6 h-6 text-white fill-white" />
                        </div>
                      </div>
                      <div className="flex-1 min-w-0">
                        <h4 className="font-semibold text-foreground truncate">{track.title}</h4>
                        <p className="text-sm text-muted-foreground">{formatNumber(track.plays)} reproducciones</p>
                      </div>
                      <span className="text-sm text-muted-foreground">{track.duration}</span>
                    </motion.div>
                  ))}
                </motion.div>
              )}

              {activeTab === 'nfts' && (
                <motion.div
                  key="nfts"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className="grid grid-cols-2 md:grid-cols-4 gap-4"
                >
                  {MOCK_CONTENT.nfts.map((nft, idx) => (
                    <motion.div
                      key={nft.id}
                      initial={{ opacity: 0, scale: 0.9 }}
                      animate={{ opacity: 1, scale: 1 }}
                      transition={{ delay: idx * 0.1 }}
                      whileHover={{ y: -5 }}
                      className="rounded-2xl overflow-hidden bg-card border border-border cursor-pointer"
                    >
                      <div className="aspect-square">
                        <img src={nft.image} alt="" className="w-full h-full object-cover" />
                      </div>
                      <div className="p-4">
                        <h4 className="font-semibold text-foreground truncate">{nft.name}</h4>
                        <p className="text-lg font-bold text-primary mt-1">{nft.price} {nft.currency}</p>
                      </div>
                    </motion.div>
                  ))}
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default Profile;
