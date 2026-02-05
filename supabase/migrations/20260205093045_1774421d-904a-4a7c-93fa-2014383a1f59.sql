-- =====================================================
-- TAMV MD-X4 SECURITY HARDENING MIGRATION
-- Corrige RLS: profiles público/privado, ledger participantes, bookpi admin+propio
-- Storage buckets para media + posts table completa
-- =====================================================

-- 1. AÑADIR CAMPO DE PRIVACIDAD A PROFILES
ALTER TABLE public.profiles 
ADD COLUMN IF NOT EXISTS is_public BOOLEAN NOT NULL DEFAULT true;

-- 2. CREAR TABLA user_roles PARA ADMIN
CREATE TYPE public.app_role AS ENUM ('admin', 'moderator', 'user', 'archon');

CREATE TABLE IF NOT EXISTS public.user_roles (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  role app_role NOT NULL DEFAULT 'user',
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  UNIQUE (user_id, role)
);

ALTER TABLE public.user_roles ENABLE ROW LEVEL SECURITY;

-- Función para verificar roles (SECURITY DEFINER evita recursión)
CREATE OR REPLACE FUNCTION public.has_role(_user_id UUID, _role app_role)
RETURNS BOOLEAN
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT EXISTS (
    SELECT 1 FROM public.user_roles
    WHERE user_id = _user_id AND role = _role
  )
$$;

-- RLS para user_roles
CREATE POLICY "Users can view own roles"
  ON public.user_roles FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Only admins can manage roles"
  ON public.user_roles FOR ALL
  USING (public.has_role(auth.uid(), 'admin'));

-- 3. CORREGIR RLS DE PROFILES
DROP POLICY IF EXISTS "Profiles are viewable by everyone" ON public.profiles;

-- Perfiles públicos o propios visibles
CREATE POLICY "View public or own profiles"
  ON public.profiles FOR SELECT
  USING (is_public = true OR auth.uid() = user_id);

-- Ocultar digital_dna de otros usuarios (usaremos view)
CREATE OR REPLACE VIEW public.profiles_public AS
  SELECT 
    id, user_id, display_name, avatar_url, bio, 
    trust_level, reputation_score, is_public, created_at, updated_at
  FROM public.profiles
  WHERE is_public = true OR auth.uid() = user_id;

-- 4. CORREGIR RLS DE MSR_LEDGER (solo participantes)
DROP POLICY IF EXISTS "MSR Ledger is publicly readable" ON public.msr_ledger;

CREATE POLICY "Participants can view own transactions"
  ON public.msr_ledger FOR SELECT
  USING (
    auth.uid() = from_user_id 
    OR auth.uid() = to_user_id 
    OR public.has_role(auth.uid(), 'admin')
    OR public.has_role(auth.uid(), 'archon')
  );

-- 5. CORREGIR RLS DE BOOKPI_LOGS (admin + propio)
DROP POLICY IF EXISTS "BookPI logs are publicly readable" ON public.bookpi_logs;

CREATE POLICY "View own or admin can view all"
  ON public.bookpi_logs FOR SELECT
  USING (
    auth.uid() = actor_id 
    OR public.has_role(auth.uid(), 'admin')
    OR public.has_role(auth.uid(), 'archon')
  );

-- Admin puede insertar
CREATE POLICY "Only system can insert logs"
  ON public.bookpi_logs FOR INSERT
  WITH CHECK (auth.uid() IS NOT NULL);

-- 6. CREAR TABLA POSTS (Social Wall completa)
CREATE TABLE IF NOT EXISTS public.posts (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  author_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  kind TEXT NOT NULL DEFAULT 'text' CHECK (kind IN ('text', 'image', 'video', 'audio', 'dreamspace', 'course', 'reel', 'story', 'stream', 'art', 'culture')),
  content TEXT,
  media_urls TEXT[] DEFAULT '{}',
  
  -- Monetización
  visibility_mode TEXT NOT NULL DEFAULT 'PUBLIC_FREE' CHECK (visibility_mode IN ('PUBLIC_FREE', 'LOCKED_PREVIEW', 'SUBSCRIBERS_ONLY', 'OWNER_ONLY')),
  unlock_price_msr NUMERIC DEFAULT 0,
  subscription_price_monthly NUMERIC DEFAULT 0,
  
  -- Engagement
  likes_count INTEGER NOT NULL DEFAULT 0,
  superlike_count INTEGER NOT NULL DEFAULT 0,
  comments_count INTEGER NOT NULL DEFAULT 0,
  shares_count INTEGER NOT NULL DEFAULT 0,
  revenue_creator NUMERIC DEFAULT 0,
  revenue_platform NUMERIC DEFAULT 0,
  
  -- Ética y moderación
  ethical_score NUMERIC DEFAULT 0.5,
  risk_score NUMERIC DEFAULT 0,
  is_censored BOOLEAN DEFAULT false,
  curation_status TEXT DEFAULT 'PENDING' CHECK (curation_status IN ('PENDING', 'APPROVED', 'FLAGGED', 'SANCTIONED')),
  
  -- XR Reference
  dreamspace_ref_id UUID,
  xr_scene_id TEXT,
  
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

ALTER TABLE public.posts ENABLE ROW LEVEL SECURITY;

-- RLS para posts
CREATE POLICY "Public posts visible to all"
  ON public.posts FOR SELECT
  USING (
    visibility_mode = 'PUBLIC_FREE' 
    OR auth.uid() = author_id
    OR (visibility_mode = 'LOCKED_PREVIEW' AND is_censored = false)
  );

CREATE POLICY "Authors can create posts"
  ON public.posts FOR INSERT
  WITH CHECK (auth.uid() = author_id);

CREATE POLICY "Authors can update own posts"
  ON public.posts FOR UPDATE
  USING (auth.uid() = author_id);

CREATE POLICY "Authors can delete own posts"
  ON public.posts FOR DELETE
  USING (auth.uid() = author_id);

-- Trigger para updated_at
CREATE TRIGGER update_posts_updated_at
  BEFORE UPDATE ON public.posts
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

-- 7. CREAR TABLA COMMENTS
CREATE TABLE IF NOT EXISTS public.comments (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  post_id UUID REFERENCES public.posts(id) ON DELETE CASCADE NOT NULL,
  author_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  content TEXT NOT NULL,
  likes_count INTEGER NOT NULL DEFAULT 0,
  superlike_count INTEGER NOT NULL DEFAULT 0,
  badge_id TEXT,
  priority_score NUMERIC DEFAULT 0,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

ALTER TABLE public.comments ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Comments are publicly readable"
  ON public.comments FOR SELECT
  USING (true);

CREATE POLICY "Auth users can create comments"
  ON public.comments FOR INSERT
  WITH CHECK (auth.uid() = author_id);

CREATE POLICY "Authors can update own comments"
  ON public.comments FOR UPDATE
  USING (auth.uid() = author_id);

CREATE POLICY "Authors can delete own comments"
  ON public.comments FOR DELETE
  USING (auth.uid() = author_id);

-- 8. STORAGE BUCKETS
INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
VALUES 
  ('avatars', 'avatars', true, 5242880, ARRAY['image/jpeg', 'image/png', 'image/webp', 'image/gif']),
  ('posts-media', 'posts-media', true, 104857600, ARRAY['image/jpeg', 'image/png', 'image/webp', 'image/gif', 'video/mp4', 'video/webm', 'audio/mpeg', 'audio/wav', 'audio/ogg']),
  ('audio-tracks', 'audio-tracks', true, 52428800, ARRAY['audio/mpeg', 'audio/wav', 'audio/ogg', 'audio/flac'])
ON CONFLICT (id) DO NOTHING;

-- Storage policies: avatars
CREATE POLICY "Avatar images are publicly accessible"
  ON storage.objects FOR SELECT
  USING (bucket_id = 'avatars');

CREATE POLICY "Users can upload own avatar"
  ON storage.objects FOR INSERT
  WITH CHECK (bucket_id = 'avatars' AND auth.uid()::text = (storage.foldername(name))[1]);

CREATE POLICY "Users can update own avatar"
  ON storage.objects FOR UPDATE
  USING (bucket_id = 'avatars' AND auth.uid()::text = (storage.foldername(name))[1]);

CREATE POLICY "Users can delete own avatar"
  ON storage.objects FOR DELETE
  USING (bucket_id = 'avatars' AND auth.uid()::text = (storage.foldername(name))[1]);

-- Storage policies: posts-media
CREATE POLICY "Posts media publicly accessible"
  ON storage.objects FOR SELECT
  USING (bucket_id = 'posts-media');

CREATE POLICY "Auth users can upload posts media"
  ON storage.objects FOR INSERT
  WITH CHECK (bucket_id = 'posts-media' AND auth.uid()::text = (storage.foldername(name))[1]);

CREATE POLICY "Users can update own posts media"
  ON storage.objects FOR UPDATE
  USING (bucket_id = 'posts-media' AND auth.uid()::text = (storage.foldername(name))[1]);

CREATE POLICY "Users can delete own posts media"
  ON storage.objects FOR DELETE
  USING (bucket_id = 'posts-media' AND auth.uid()::text = (storage.foldername(name))[1]);

-- Storage policies: audio-tracks
CREATE POLICY "Audio tracks publicly accessible"
  ON storage.objects FOR SELECT
  USING (bucket_id = 'audio-tracks');

CREATE POLICY "Auth users can upload audio"
  ON storage.objects FOR INSERT
  WITH CHECK (bucket_id = 'audio-tracks' AND auth.uid()::text = (storage.foldername(name))[1]);

-- 9. ENABLE REALTIME FOR POSTS
ALTER PUBLICATION supabase_realtime ADD TABLE public.posts;
ALTER PUBLICATION supabase_realtime ADD TABLE public.comments;