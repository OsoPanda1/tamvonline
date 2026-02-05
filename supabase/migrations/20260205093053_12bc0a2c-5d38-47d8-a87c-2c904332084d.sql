-- Fix security definer view by adding security_invoker
DROP VIEW IF EXISTS public.profiles_public;

CREATE VIEW public.profiles_public 
WITH (security_invoker = on) AS
  SELECT 
    id, user_id, display_name, avatar_url, bio, 
    trust_level, reputation_score, is_public, created_at, updated_at
  FROM public.profiles
  WHERE is_public = true OR auth.uid() = user_id;