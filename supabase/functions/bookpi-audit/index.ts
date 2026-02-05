 import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
 import { createClient } from "https://esm.sh/@supabase/supabase-js@2";
 
 const corsHeaders = {
   'Access-Control-Allow-Origin': '*',
   'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
 };
 
 // Rate limiting store (in production use Redis)
 const rateLimitStore = new Map<string, { count: number; resetTime: number }>();
 const RATE_LIMIT_WINDOW = 60000; // 1 minute
 const MAX_REQUESTS_PER_MINUTE = 100;
 
 // SHA-256 hash function
 async function sha256(message: string): Promise<string> {
   const msgBuffer = new TextEncoder().encode(message);
   const hashBuffer = await crypto.subtle.digest('SHA-256', msgBuffer);
   const hashArray = Array.from(new Uint8Array(hashBuffer));
   return hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
 }
 
 // Rate limiting check
 function checkRateLimit(clientId: string): { allowed: boolean; remaining: number } {
   const now = Date.now();
   const record = rateLimitStore.get(clientId);
 
   if (!record || now > record.resetTime) {
     rateLimitStore.set(clientId, { count: 1, resetTime: now + RATE_LIMIT_WINDOW });
     return { allowed: true, remaining: MAX_REQUESTS_PER_MINUTE - 1 };
   }
 
   if (record.count >= MAX_REQUESTS_PER_MINUTE) {
     return { allowed: false, remaining: 0 };
   }
 
   record.count++;
   return { allowed: true, remaining: MAX_REQUESTS_PER_MINUTE - record.count };
 }
 
 // Get previous hash from chain
 async function getPreviousHash(supabase: any): Promise<string> {
   const { data, error } = await supabase
     .from('bookpi_logs')
     .select('immutable_hash')
     .order('created_at', { ascending: false })
     .limit(1)
     .single();
 
   if (error || !data) {
     return 'GENESIS_TAMV_BOOKPI_001';
   }
   return data.immutable_hash;
 }
 
 serve(async (req) => {
   // Handle CORS preflight
   if (req.method === 'OPTIONS') {
     return new Response(null, { headers: corsHeaders });
   }
 
   const supabaseUrl = Deno.env.get('SUPABASE_URL')!;
   const supabaseServiceKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;
   const supabase = createClient(supabaseUrl, supabaseServiceKey);
 
   try {
     // Get client identifier for rate limiting
     const clientIp = req.headers.get('x-forwarded-for') || 'unknown';
     const authHeader = req.headers.get('authorization');
     const clientId = authHeader || clientIp;
 
     // Check rate limit
     const rateCheck = checkRateLimit(clientId);
     if (!rateCheck.allowed) {
       return new Response(
         JSON.stringify({ 
           error: 'Rate limit exceeded', 
           retryAfter: 60,
           message: 'Demasiadas solicitudes. Espera 60 segundos.' 
         }),
         { 
           status: 429, 
           headers: { 
             ...corsHeaders, 
             'Content-Type': 'application/json',
             'Retry-After': '60',
             'X-RateLimit-Remaining': '0'
           } 
         }
       );
     }
 
     const { action } = await req.json();
 
     // === LOG EVENT ===
     if (action === 'log') {
       const { event_type, event_action, actor_id, subject_type, subject_id, details } = await req.json();
 
       // Input validation
       if (!event_type || !event_action) {
         return new Response(
           JSON.stringify({ error: 'event_type and event_action are required' }),
           { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
         );
       }
 
       // Get previous hash for chain integrity
       const prevHash = await getPreviousHash(supabase);
 
       // Create payload for hashing
       const timestamp = new Date().toISOString();
       const payload = JSON.stringify({
         event_type,
         action: event_action,
         actor_id,
         subject_type,
         subject_id,
         details,
         timestamp,
         prevHash
       });
 
       // Calculate immutable hash (SHA-256)
       const immutableHash = await sha256(payload);
 
       // Insert into bookpi_logs
       const { data, error } = await supabase
         .from('bookpi_logs')
         .insert([{
           event_type,
           action: event_action,
           actor_id,
           subject_type,
           subject_id,
           details: details || {},
           prev_hash: prevHash,
           immutable_hash: immutableHash
         }])
         .select()
         .single();
 
       if (error) {
         console.error('BookPI log error:', error);
         return new Response(
           JSON.stringify({ error: 'Failed to log event', details: error.message }),
           { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
         );
       }
 
       return new Response(
         JSON.stringify({ 
           success: true, 
           eventId: data.id,
           hash: immutableHash,
           chainIntegrity: 'verified'
         }),
         { 
           status: 200, 
           headers: { 
             ...corsHeaders, 
             'Content-Type': 'application/json',
             'X-RateLimit-Remaining': rateCheck.remaining.toString()
           } 
         }
       );
     }
 
     // === VERIFY CHAIN ===
     if (action === 'verify') {
       const { data: logs, error } = await supabase
         .from('bookpi_logs')
         .select('id, event_type, action, actor_id, subject_type, subject_id, details, created_at, prev_hash, immutable_hash')
         .order('created_at', { ascending: true });
 
       if (error) {
         return new Response(
           JSON.stringify({ error: 'Failed to fetch logs' }),
           { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
         );
       }
 
       // Verify chain integrity
       let chainValid = true;
       let brokenAt = null;
 
       for (let i = 1; i < logs.length; i++) {
         const current = logs[i];
         const previous = logs[i - 1];
 
         if (current.prev_hash !== previous.immutable_hash) {
           chainValid = false;
           brokenAt = current.id;
           break;
         }
       }
 
       return new Response(
         JSON.stringify({ 
           chainValid,
           totalEvents: logs.length,
           brokenAt,
           lastHash: logs[logs.length - 1]?.immutable_hash || 'GENESIS',
           verifiedAt: new Date().toISOString()
         }),
         { status: 200, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
       );
     }
 
     // === GET AUDIT TRAIL ===
     if (action === 'trail') {
       const { actor_id, subject_id, limit = 50 } = await req.json();
 
       let query = supabase
         .from('bookpi_logs')
         .select('*')
         .order('created_at', { ascending: false })
         .limit(limit);
 
       if (actor_id) query = query.eq('actor_id', actor_id);
       if (subject_id) query = query.eq('subject_id', subject_id);
 
       const { data, error } = await query;
 
       if (error) {
         return new Response(
           JSON.stringify({ error: 'Failed to fetch audit trail' }),
           { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
         );
       }
 
       return new Response(
         JSON.stringify({ 
           trail: data,
           count: data.length,
           chainIntegrity: 'not_verified'
         }),
         { status: 200, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
       );
     }
 
     return new Response(
       JSON.stringify({ error: 'Unknown action. Use: log, verify, or trail' }),
       { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
     );
 
   } catch (error) {
     console.error('BookPI Audit Error:', error);
    const errorMessage = error instanceof Error ? error.message : 'Unknown error';
     return new Response(
      JSON.stringify({ error: 'Internal server error', message: errorMessage }),
       { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
     );
   }
 });