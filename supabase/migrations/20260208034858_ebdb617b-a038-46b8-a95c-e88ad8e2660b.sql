-- ═══════════════════════════════════════════════════════════════
-- TAMV MD-X4™ — SISTEMA ECONÓMICO COMPLETO
-- Membresías, Contribuciones, Pools y Ledger Interno
-- ═══════════════════════════════════════════════════════════════

-- Enum para tipos de membresía
DO $$ BEGIN
  CREATE TYPE public.membership_tier AS ENUM ('free', 'creator', 'guardian', 'institutional');
EXCEPTION
  WHEN duplicate_object THEN null;
END $$;

-- Enum para tipos de contribución
DO $$ BEGIN
  CREATE TYPE public.contribution_type AS ENUM (
    'content_creation',
    'moderation',
    'guardian_duty',
    'research',
    'infra_support',
    'education',
    'community_support',
    'protocol_participation'
  );
EXCEPTION
  WHEN duplicate_object THEN null;
END $$;

-- Enum para unidades del ledger interno
DO $$ BEGIN
  CREATE TYPE public.ledger_unit AS ENUM ('usage_credit', 'contribution_point', 'msr_internal', 'governance_token');
EXCEPTION
  WHEN duplicate_object THEN null;
END $$;

-- Enum para tipos de operación del ledger
DO $$ BEGIN
  CREATE TYPE public.ledger_operation AS ENUM ('mint', 'burn', 'transfer', 'reward', 'consume', 'refund');
EXCEPTION
  WHEN duplicate_object THEN null;
END $$;

-- ═══════════════════════════════════════════════════════════════
-- TABLA: user_memberships — Gestión de membresías
-- ═══════════════════════════════════════════════════════════════
CREATE TABLE IF NOT EXISTS public.user_memberships (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL,
  tier public.membership_tier NOT NULL DEFAULT 'free',
  started_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  expires_at TIMESTAMP WITH TIME ZONE,
  auto_renew BOOLEAN DEFAULT false,
  external_subscription_id TEXT, -- ID de Stripe o pasarela externa
  usage_credits_granted INTEGER DEFAULT 0,
  usage_credits_remaining INTEGER DEFAULT 0,
  storage_quota_mb INTEGER DEFAULT 500,
  streaming_minutes_monthly INTEGER DEFAULT 60,
  max_dreamspaces INTEGER DEFAULT 1,
  can_create_channels BOOLEAN DEFAULT false,
  can_moderate BOOLEAN DEFAULT false,
  can_access_guardian_tools BOOLEAN DEFAULT false,
  institutional_org_name TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  CONSTRAINT user_memberships_user_unique UNIQUE (user_id)
);

-- ═══════════════════════════════════════════════════════════════
-- TABLA: contribution_accounts — Historial de contribuciones
-- ═══════════════════════════════════════════════════════════════
CREATE TABLE IF NOT EXISTS public.contribution_accounts (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL,
  contribution_type public.contribution_type NOT NULL,
  weight INTEGER NOT NULL DEFAULT 1 CHECK (weight >= 1 AND weight <= 100),
  description TEXT,
  verified_by UUID, -- Guardian/Admin que verificó
  msr_anchor_hash TEXT, -- Anclaje al MSR ledger
  bookpi_anchor_id TEXT, -- Anclaje a BookPI
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Índice para consultas rápidas por usuario
CREATE INDEX IF NOT EXISTS idx_contribution_accounts_user ON public.contribution_accounts(user_id);
CREATE INDEX IF NOT EXISTS idx_contribution_accounts_type ON public.contribution_accounts(contribution_type);

-- ═══════════════════════════════════════════════════════════════
-- TABLA: internal_ledger — Ledger interno de créditos y puntos
-- ═══════════════════════════════════════════════════════════════
CREATE TABLE IF NOT EXISTS public.internal_ledger (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  from_account TEXT NOT NULL, -- 'system', 'user:<uuid>', 'pool:<name>'
  to_account TEXT NOT NULL,
  amount BIGINT NOT NULL CHECK (amount > 0),
  unit public.ledger_unit NOT NULL,
  operation public.ledger_operation NOT NULL,
  reason TEXT NOT NULL,
  msr_block_index INTEGER, -- Referencia opcional al MSR
  bookpi_anchor_id TEXT, -- Referencia opcional a BookPI
  policy_id TEXT, -- ID de política que autorizó
  metadata JSONB DEFAULT '{}',
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Índices para el ledger
CREATE INDEX IF NOT EXISTS idx_internal_ledger_from ON public.internal_ledger(from_account);
CREATE INDEX IF NOT EXISTS idx_internal_ledger_to ON public.internal_ledger(to_account);
CREATE INDEX IF NOT EXISTS idx_internal_ledger_unit ON public.internal_ledger(unit);
CREATE INDEX IF NOT EXISTS idx_internal_ledger_created ON public.internal_ledger(created_at DESC);

-- ═══════════════════════════════════════════════════════════════
-- TABLA: economy_pools — Pools especiales del sistema
-- ═══════════════════════════════════════════════════════════════
CREATE TABLE IF NOT EXISTS public.economy_pools (
  id TEXT PRIMARY KEY, -- 'resilience_pool', 'memory_pool', 'infra_pool', 'fenix_fund', 'kernel_fund'
  display_name TEXT NOT NULL,
  description TEXT,
  balance_usage_credits BIGINT DEFAULT 0,
  balance_contribution_points BIGINT DEFAULT 0,
  balance_msr_internal BIGINT DEFAULT 0,
  last_distribution_at TIMESTAMP WITH TIME ZONE,
  distribution_policy JSONB DEFAULT '{}',
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Insertar pools por defecto
INSERT INTO public.economy_pools (id, display_name, description) VALUES
  ('resilience_pool', 'Pool de Resiliencia', 'Soporte a backup, mitigaciones y recuperación del sistema'),
  ('memory_pool', 'Pool de Memoria', 'Archivos históricos, informes y educación pública'),
  ('infra_pool', 'Pool de Infraestructura', 'Costos técnicos y herramientas abiertas'),
  ('fenix_fund', 'Fondo Fénix', 'Resiliencia comunitaria (20% del Quantum Split)'),
  ('kernel_fund', 'Fondo Kernel', 'Infraestructura soberana (10% del Quantum Split)')
ON CONFLICT (id) DO NOTHING;

-- ═══════════════════════════════════════════════════════════════
-- TABLA: membership_features — Características por tier
-- ═══════════════════════════════════════════════════════════════
CREATE TABLE IF NOT EXISTS public.membership_features (
  tier public.membership_tier PRIMARY KEY,
  monthly_usage_credits INTEGER NOT NULL,
  storage_quota_mb INTEGER NOT NULL,
  streaming_minutes_monthly INTEGER NOT NULL,
  max_dreamspaces INTEGER NOT NULL,
  can_create_channels BOOLEAN NOT NULL DEFAULT false,
  can_stream_hd BOOLEAN NOT NULL DEFAULT false,
  can_moderate BOOLEAN NOT NULL DEFAULT false,
  can_access_guardian_tools BOOLEAN NOT NULL DEFAULT false,
  can_access_institutional_apis BOOLEAN NOT NULL DEFAULT false,
  media_upload_limit_mb INTEGER NOT NULL,
  video_duration_max_seconds INTEGER NOT NULL
);

-- Insertar características por tier
INSERT INTO public.membership_features (tier, monthly_usage_credits, storage_quota_mb, streaming_minutes_monthly, max_dreamspaces, can_create_channels, can_stream_hd, can_moderate, can_access_guardian_tools, can_access_institutional_apis, media_upload_limit_mb, video_duration_max_seconds) VALUES
  ('free', 100, 500, 60, 1, false, false, false, false, false, 50, 60),
  ('creator', 1000, 10000, 600, 10, true, true, false, false, false, 500, 600),
  ('guardian', 5000, 50000, 2400, 50, true, true, true, true, false, 2000, 3600),
  ('institutional', 50000, 500000, 99999, 999, true, true, true, true, true, 10000, 99999)
ON CONFLICT (tier) DO UPDATE SET
  monthly_usage_credits = EXCLUDED.monthly_usage_credits,
  storage_quota_mb = EXCLUDED.storage_quota_mb,
  streaming_minutes_monthly = EXCLUDED.streaming_minutes_monthly,
  max_dreamspaces = EXCLUDED.max_dreamspaces,
  can_create_channels = EXCLUDED.can_create_channels,
  can_stream_hd = EXCLUDED.can_stream_hd,
  can_moderate = EXCLUDED.can_moderate,
  can_access_guardian_tools = EXCLUDED.can_access_guardian_tools,
  can_access_institutional_apis = EXCLUDED.can_access_institutional_apis,
  media_upload_limit_mb = EXCLUDED.media_upload_limit_mb,
  video_duration_max_seconds = EXCLUDED.video_duration_max_seconds;

-- ═══════════════════════════════════════════════════════════════
-- RLS POLICIES
-- ═══════════════════════════════════════════════════════════════

-- Enable RLS
ALTER TABLE public.user_memberships ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.contribution_accounts ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.internal_ledger ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.economy_pools ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.membership_features ENABLE ROW LEVEL SECURITY;

-- Memberships: Users can view their own, admins can view all
CREATE POLICY "Users view own membership" ON public.user_memberships
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "System can manage memberships" ON public.user_memberships
  FOR ALL USING (true) WITH CHECK (true);

-- Contributions: Users can view their own
CREATE POLICY "Users view own contributions" ON public.contribution_accounts
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "System can manage contributions" ON public.contribution_accounts
  FOR ALL USING (true) WITH CHECK (true);

-- Internal Ledger: Users can view their own transactions
CREATE POLICY "Users view own ledger entries" ON public.internal_ledger
  FOR SELECT USING (
    from_account = 'user:' || auth.uid()::text OR 
    to_account = 'user:' || auth.uid()::text
  );

CREATE POLICY "System can manage ledger" ON public.internal_ledger
  FOR ALL USING (true) WITH CHECK (true);

-- Economy Pools: Public read
CREATE POLICY "Anyone can view pools" ON public.economy_pools
  FOR SELECT USING (true);

-- Membership Features: Public read
CREATE POLICY "Anyone can view features" ON public.membership_features
  FOR SELECT USING (true);

-- ═══════════════════════════════════════════════════════════════
-- FUNCTIONS
-- ═══════════════════════════════════════════════════════════════

-- Función para calcular el score de contribución de un usuario
CREATE OR REPLACE FUNCTION public.calculate_contribution_score(p_user_id UUID)
RETURNS INTEGER AS $$
DECLARE
  total_score INTEGER;
BEGIN
  SELECT COALESCE(SUM(weight), 0) INTO total_score
  FROM public.contribution_accounts
  WHERE user_id = p_user_id;
  
  RETURN total_score;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER SET search_path = public;

-- Función para verificar elegibilidad de membresía
CREATE OR REPLACE FUNCTION public.check_membership_eligibility(p_user_id UUID, p_tier public.membership_tier)
RETURNS JSONB AS $$
DECLARE
  contribution_score INTEGER;
  result JSONB;
BEGIN
  contribution_score := calculate_contribution_score(p_user_id);
  
  CASE p_tier
    WHEN 'creator' THEN
      result := jsonb_build_object(
        'eligible', contribution_score >= 50 OR true, -- Or paid subscription
        'score_required', 50,
        'current_score', contribution_score,
        'can_pay_upgrade', true
      );
    WHEN 'guardian' THEN
      result := jsonb_build_object(
        'eligible', contribution_score >= 500,
        'score_required', 500,
        'current_score', contribution_score,
        'requires_verification', true
      );
    WHEN 'institutional' THEN
      result := jsonb_build_object(
        'eligible', false,
        'requires_legal_agreement', true,
        'current_score', contribution_score
      );
    ELSE
      result := jsonb_build_object('eligible', true, 'current_score', contribution_score);
  END CASE;
  
  RETURN result;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER SET search_path = public;

-- Trigger para actualizar updated_at
CREATE OR REPLACE FUNCTION public.update_membership_timestamp()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SET search_path = public;

CREATE TRIGGER update_user_memberships_timestamp
  BEFORE UPDATE ON public.user_memberships
  FOR EACH ROW
  EXECUTE FUNCTION public.update_membership_timestamp();

CREATE TRIGGER update_economy_pools_timestamp
  BEFORE UPDATE ON public.economy_pools
  FOR EACH ROW
  EXECUTE FUNCTION public.update_membership_timestamp();

-- Función para crear membresía por defecto al registrar usuario
CREATE OR REPLACE FUNCTION public.create_default_membership()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.user_memberships (user_id, tier, usage_credits_remaining)
  VALUES (NEW.user_id, 'free', 100)
  ON CONFLICT (user_id) DO NOTHING;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER SET search_path = public;

-- Trigger: crear membresía al crear perfil
CREATE TRIGGER on_profile_create_membership
  AFTER INSERT ON public.profiles
  FOR EACH ROW
  EXECUTE FUNCTION public.create_default_membership();