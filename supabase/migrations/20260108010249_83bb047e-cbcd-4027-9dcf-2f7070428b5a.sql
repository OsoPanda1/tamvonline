-- TAMV MD-X4 Sovereign Database Schema

-- Create enum for trust levels
CREATE TYPE public.trust_level AS ENUM ('observer', 'citizen', 'guardian', 'sovereign', 'archon');

-- Create enum for transaction types
CREATE TYPE public.msr_transaction_type AS ENUM ('DIRECT', 'FENIX', 'KERNEL', 'TRANSFER', 'REWARD');

-- Create profiles table for ADN Digital Soberano
CREATE TABLE public.profiles (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL UNIQUE,
  display_name TEXT,
  avatar_url TEXT,
  bio TEXT,
  trust_level trust_level NOT NULL DEFAULT 'observer',
  reputation_score INTEGER NOT NULL DEFAULT 0,
  digital_dna JSONB DEFAULT '{}',
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS on profiles
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;

-- Profiles RLS policies
CREATE POLICY "Profiles are viewable by everyone"
ON public.profiles FOR SELECT
USING (true);

CREATE POLICY "Users can update their own profile"
ON public.profiles FOR UPDATE
USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own profile"
ON public.profiles FOR INSERT
WITH CHECK (auth.uid() = user_id);

-- MSR Ledger table for blockchain-style transactions
CREATE TABLE public.msr_ledger (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  from_user_id UUID REFERENCES auth.users(id),
  to_user_id UUID REFERENCES auth.users(id),
  amount DECIMAL(18, 8) NOT NULL,
  transaction_type msr_transaction_type NOT NULL,
  description TEXT,
  prev_hash TEXT,
  hash TEXT NOT NULL,
  metadata JSONB DEFAULT '{}',
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS on msr_ledger
ALTER TABLE public.msr_ledger ENABLE ROW LEVEL SECURITY;

-- MSR Ledger policies - public read, authenticated insert
CREATE POLICY "MSR Ledger is publicly readable"
ON public.msr_ledger FOR SELECT
USING (true);

CREATE POLICY "Authenticated users can create transactions"
ON public.msr_ledger FOR INSERT
TO authenticated
WITH CHECK (auth.uid() = from_user_id OR from_user_id IS NULL);

-- BookPI Logs for immutable audit trail
CREATE TABLE public.bookpi_logs (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  event_type TEXT NOT NULL,
  actor_id UUID REFERENCES auth.users(id),
  subject_type TEXT,
  subject_id UUID,
  action TEXT NOT NULL,
  details JSONB DEFAULT '{}',
  immutable_hash TEXT NOT NULL,
  prev_hash TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS on bookpi_logs
ALTER TABLE public.bookpi_logs ENABLE ROW LEVEL SECURITY;

-- BookPI is read-only for everyone, write only via system
CREATE POLICY "BookPI logs are publicly readable"
ON public.bookpi_logs FOR SELECT
USING (true);

-- Function to hash and chain MSR transactions
CREATE OR REPLACE FUNCTION public.chain_msr_transaction()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  last_hash TEXT;
  new_hash TEXT;
BEGIN
  -- Get the previous hash
  SELECT hash INTO last_hash
  FROM public.msr_ledger
  ORDER BY created_at DESC
  LIMIT 1;
  
  -- Set prev_hash
  NEW.prev_hash := COALESCE(last_hash, 'GENESIS');
  
  -- Calculate new hash
  NEW.hash := encode(
    sha256(
      (NEW.id::text || NEW.amount::text || NEW.transaction_type::text || NEW.prev_hash || NEW.created_at::text)::bytea
    ),
    'hex'
  );
  
  RETURN NEW;
END;
$$;

-- Trigger for MSR transaction chaining
CREATE TRIGGER chain_msr_transaction_trigger
BEFORE INSERT ON public.msr_ledger
FOR EACH ROW
EXECUTE FUNCTION public.chain_msr_transaction();

-- Function to hash BookPI entries
CREATE OR REPLACE FUNCTION public.chain_bookpi_log()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  last_hash TEXT;
BEGIN
  -- Get the previous hash
  SELECT immutable_hash INTO last_hash
  FROM public.bookpi_logs
  ORDER BY created_at DESC
  LIMIT 1;
  
  -- Set prev_hash
  NEW.prev_hash := COALESCE(last_hash, 'GENESIS');
  
  -- Calculate immutable hash
  NEW.immutable_hash := encode(
    sha256(
      (NEW.id::text || NEW.event_type || NEW.action || NEW.prev_hash || NEW.created_at::text)::bytea
    ),
    'hex'
  );
  
  RETURN NEW;
END;
$$;

-- Trigger for BookPI chaining
CREATE TRIGGER chain_bookpi_log_trigger
BEFORE INSERT ON public.bookpi_logs
FOR EACH ROW
EXECUTE FUNCTION public.chain_bookpi_log();

-- Function to create profile on user signup
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  INSERT INTO public.profiles (user_id, display_name)
  VALUES (new.id, new.raw_user_meta_data ->> 'display_name');
  RETURN new;
END;
$$;

-- Trigger for auto profile creation
CREATE TRIGGER on_auth_user_created
AFTER INSERT ON auth.users
FOR EACH ROW
EXECUTE FUNCTION public.handle_new_user();

-- Function to update timestamps
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER
LANGUAGE plpgsql
SET search_path = public
AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$;

-- Trigger for profile timestamp updates
CREATE TRIGGER update_profiles_updated_at
BEFORE UPDATE ON public.profiles
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();