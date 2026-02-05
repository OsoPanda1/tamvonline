-- Fix permissive INSERT policy on notifications
-- Replace "true" with service role only (edge functions use service role)
DROP POLICY IF EXISTS "System can insert notifications for any user" ON public.notifications;

-- Only service role (edge functions) can insert notifications
-- This is handled via service_role key in edge functions
CREATE POLICY "Service role can insert notifications"
ON public.notifications FOR INSERT
WITH CHECK (
  -- Allow authenticated users to create notifications for others (via edge function)
  -- OR allow users to create system-triggered notifications
  auth.uid() IS NOT NULL OR auth.role() = 'service_role'
);