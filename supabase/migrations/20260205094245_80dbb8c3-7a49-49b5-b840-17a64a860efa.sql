-- ============================================================
-- NOTITAMV: Sistema de Notificaciones Multisensorial
-- Tabla principal para notificaciones persistentes con realtime
-- ============================================================

-- Tipo de notificación
CREATE TYPE public.notification_type AS ENUM (
  'like',           -- tachido (like normal)
  'superlike',      -- tadehuev (superlike pagado)
  'comment',        -- comentario en post
  'follow',         -- nuevo seguidor
  'mention',        -- mención @usuario
  'transaction',    -- transacción MSR recibida
  'achievement',    -- logro/badge desbloqueado
  'dreamspace',     -- invitación a DreamSpace
  'live',           -- alguien que sigues está en vivo
  'system',         -- notificación del sistema
  'isabella'        -- mensaje de Isabella AI
);

-- Urgencia de la notificación (afecta sonido y visual)
CREATE TYPE public.notification_urgency AS ENUM (
  'low',        -- silenciosa, solo visual sutil
  'normal',     -- sonido suave
  'high',       -- sonido prominente + vibración
  'critical'    -- efecto inmersivo completo
);

-- Tabla de notificaciones
CREATE TABLE public.notifications (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL,
  type notification_type NOT NULL,
  urgency notification_urgency NOT NULL DEFAULT 'normal',
  
  -- Contenido
  title TEXT NOT NULL,
  body TEXT,
  image_url TEXT,
  
  -- Referencias
  actor_id UUID,                    -- quién disparó la notificación
  target_type TEXT,                 -- 'post', 'comment', 'transaction', etc
  target_id UUID,                   -- id del objeto relacionado
  
  -- Estado
  is_read BOOLEAN NOT NULL DEFAULT false,
  read_at TIMESTAMP WITH TIME ZONE,
  
  -- Preferencias de entrega
  sound_id TEXT DEFAULT 'default',  -- referencia a KAOS Audio
  show_toast BOOLEAN NOT NULL DEFAULT true,
  
  -- Metadata extensible
  metadata JSONB DEFAULT '{}',
  
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Índices para performance
CREATE INDEX idx_notifications_user_id ON public.notifications(user_id);
CREATE INDEX idx_notifications_user_unread ON public.notifications(user_id) WHERE is_read = false;
CREATE INDEX idx_notifications_created_at ON public.notifications(created_at DESC);

-- RLS: Solo el dueño puede ver/modificar sus notificaciones
ALTER TABLE public.notifications ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view their own notifications"
ON public.notifications FOR SELECT
USING (auth.uid() = user_id);

CREATE POLICY "Users can update their own notifications"
ON public.notifications FOR UPDATE
USING (auth.uid() = user_id);

CREATE POLICY "System can insert notifications for any user"
ON public.notifications FOR INSERT
WITH CHECK (true);

-- Admins pueden ver todas
CREATE POLICY "Admins can view all notifications"
ON public.notifications FOR SELECT
USING (public.has_role(auth.uid(), 'admin'));

-- Tabla de preferencias de notificación por usuario
CREATE TABLE public.notification_preferences (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL UNIQUE,
  
  -- Por tipo
  like_enabled BOOLEAN DEFAULT true,
  superlike_enabled BOOLEAN DEFAULT true,
  comment_enabled BOOLEAN DEFAULT true,
  follow_enabled BOOLEAN DEFAULT true,
  mention_enabled BOOLEAN DEFAULT true,
  transaction_enabled BOOLEAN DEFAULT true,
  achievement_enabled BOOLEAN DEFAULT true,
  dreamspace_enabled BOOLEAN DEFAULT true,
  live_enabled BOOLEAN DEFAULT true,
  system_enabled BOOLEAN DEFAULT true,
  isabella_enabled BOOLEAN DEFAULT true,
  
  -- Audio
  sound_enabled BOOLEAN DEFAULT true,
  sound_volume INTEGER DEFAULT 75 CHECK (sound_volume >= 0 AND sound_volume <= 100),
  
  -- Modo silencioso
  do_not_disturb BOOLEAN DEFAULT false,
  dnd_start TIME,
  dnd_end TIME,
  
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

ALTER TABLE public.notification_preferences ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can manage their own preferences"
ON public.notification_preferences FOR ALL
USING (auth.uid() = user_id);

-- Trigger para updated_at
CREATE TRIGGER update_notification_preferences_updated_at
BEFORE UPDATE ON public.notification_preferences
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();

-- Habilitar realtime para notificaciones
ALTER PUBLICATION supabase_realtime ADD TABLE public.notifications;

-- ============================================================
-- Tabla likes para tracking de likes únicos y evitar duplicados
-- ============================================================
CREATE TABLE public.likes (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL,
  post_id UUID NOT NULL REFERENCES public.posts(id) ON DELETE CASCADE,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  UNIQUE(user_id, post_id)
);

CREATE INDEX idx_likes_post_id ON public.likes(post_id);
CREATE INDEX idx_likes_user_id ON public.likes(user_id);

ALTER TABLE public.likes ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can view likes"
ON public.likes FOR SELECT
USING (true);

CREATE POLICY "Authenticated users can like"
ON public.likes FOR INSERT
WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can unlike their own likes"
ON public.likes FOR DELETE
USING (auth.uid() = user_id);

-- ============================================================
-- Tabla follows para relaciones entre usuarios
-- ============================================================
CREATE TABLE public.follows (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  follower_id UUID NOT NULL,
  following_id UUID NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  UNIQUE(follower_id, following_id),
  CHECK (follower_id != following_id)
);

CREATE INDEX idx_follows_follower ON public.follows(follower_id);
CREATE INDEX idx_follows_following ON public.follows(following_id);

ALTER TABLE public.follows ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can view follows"
ON public.follows FOR SELECT
USING (true);

CREATE POLICY "Authenticated users can follow"
ON public.follows FOR INSERT
WITH CHECK (auth.uid() = follower_id);

CREATE POLICY "Users can unfollow"
ON public.follows FOR DELETE
USING (auth.uid() = follower_id);