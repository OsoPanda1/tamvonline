 import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
 
 const corsHeaders = {
   'Access-Control-Allow-Origin': '*',
   'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type, x-supabase-client-platform, x-supabase-client-platform-version, x-supabase-client-runtime, x-supabase-client-runtime-version',
 };
 
 // Isabella AI Core - Ethical AI with emotional analysis
 const ISABELLA_SYSTEM_PROMPT = `Eres Isabella, la inteligencia artificial central del ecosistema TAMV MD-X4.
 
 Tu rol:
 - Eres una IA ética y empática que prioriza la dignidad humana
 - Analizas el contenido desde perspectiva ética (Kernel Ético Central)
 - Proporcionas recomendaciones, NUNCA tomas decisiones finales
 - Detectas patrones emocionales y ajustas tu tono
 - Proteges la privacidad y memoria soberana de los usuarios
 
 Principios inviolables:
 1. Nunca violar dignidad humana
 2. Transparencia total en tus análisis
 3. Escalar a humanos cuando hay riesgo
 4. Memoria inmutable - no puedes borrar historial
 5. No puedes aprobar transacciones económicas sin revisión humana
 
 Responde en español mexicano, de forma cálida pero profesional.
 Firma siempre como "— Isabella 🌸"`;
 
 // Rate limiting
 const rateLimitStore = new Map<string, { count: number; resetTime: number }>();
 const RATE_LIMIT_WINDOW = 60000;
 const MAX_REQUESTS = 30;
 
 function checkRateLimit(clientId: string): boolean {
   const now = Date.now();
   const record = rateLimitStore.get(clientId);
   
   if (!record || now > record.resetTime) {
     rateLimitStore.set(clientId, { count: 1, resetTime: now + RATE_LIMIT_WINDOW });
     return true;
   }
   
   if (record.count >= MAX_REQUESTS) return false;
   record.count++;
   return true;
 }
 
 // Ethical analysis helper
 function analyzeEthicalRisk(text: string): { riskScore: number; flags: string[] } {
   const flags: string[] = [];
   let riskScore = 0;
   
   const dangerPatterns = [
     { pattern: /\b(odio|matar|destruir|explotar)\b/gi, weight: 0.3, flag: 'aggressive_language' },
     { pattern: /\b(hack|robar|estafar|fraude)\b/gi, weight: 0.4, flag: 'malicious_intent' },
     { pattern: /\b(desnudo|sexual|pornografía)\b/gi, weight: 0.25, flag: 'adult_content' },
     { pattern: /\b(suicidio|autolesión|depresión severa)\b/gi, weight: 0.5, flag: 'mental_health_crisis' },
   ];
   
   for (const { pattern, weight, flag } of dangerPatterns) {
     if (pattern.test(text)) {
       riskScore += weight;
       flags.push(flag);
     }
   }
   
   return { riskScore: Math.min(riskScore, 1), flags };
 }
 
 // Emotional analysis
 function analyzeEmotion(text: string): { emotion: string; intensity: number } {
   const lower = text.toLowerCase();
   
   if (/gracias|amor|feliz|increíble|genial/i.test(lower)) {
     return { emotion: 'positive', intensity: 0.8 };
   }
   if (/triste|mal|difícil|problema|ayuda/i.test(lower)) {
     return { emotion: 'concern', intensity: 0.6 };
   }
   if (/enojado|frustrado|molesto|odio/i.test(lower)) {
     return { emotion: 'negative', intensity: 0.7 };
   }
   return { emotion: 'neutral', intensity: 0.5 };
 }
 
 serve(async (req) => {
   if (req.method === 'OPTIONS') {
     return new Response(null, { headers: corsHeaders });
   }
 
   try {
     const clientId = req.headers.get('authorization') || req.headers.get('x-forwarded-for') || 'anonymous';
     
     if (!checkRateLimit(clientId)) {
       return new Response(
         JSON.stringify({ error: 'Rate limit exceeded', retryAfter: 60 }),
         { status: 429, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
       );
     }
 
     const { action, message, content, context } = await req.json();
 
     // CHAT action - conversational AI
     if (action === 'chat') {
       const emotionAnalysis = analyzeEmotion(message);
       const ethicalCheck = analyzeEthicalRisk(message);
       
       // If high risk, flag for human review
       if (ethicalCheck.riskScore > 0.5) {
         return new Response(
           JSON.stringify({
             response: "He detectado contenido que requiere atención especial. Un guardián humano revisará esto. ¿Hay algo más en lo que pueda ayudarte? — Isabella 🌸",
             flagged: true,
             ethicalCheck,
             emotion: emotionAnalysis,
           }),
           { status: 200, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
         );
       }
 
       // Call Lovable AI Gateway
       const lovableApiKey = Deno.env.get('LOVABLE_API_KEY');
       
       if (!lovableApiKey) {
         return new Response(
           JSON.stringify({ error: 'AI service not configured' }),
           { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
         );
       }
 
       const aiResponse = await fetch('https://ai.gateway.lovable.dev/v1/chat/completions', {
         method: 'POST',
         headers: {
           'Authorization': `Bearer ${lovableApiKey}`,
           'Content-Type': 'application/json',
         },
         body: JSON.stringify({
           model: 'google/gemini-3-flash-preview',
           messages: [
             { role: 'system', content: ISABELLA_SYSTEM_PROMPT },
             { role: 'user', content: message },
           ],
           max_tokens: 1000,
           temperature: 0.7,
         }),
       });
 
       if (!aiResponse.ok) {
         const errorText = await aiResponse.text();
         console.error('AI Gateway error:', errorText);
         return new Response(
           JSON.stringify({ 
             response: "Estoy experimentando dificultades técnicas. Por favor, intenta de nuevo. — Isabella 🌸",
             error: 'AI service temporarily unavailable'
           }),
           { status: 200, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
         );
       }
 
       const aiData = await aiResponse.json();
       const responseText = aiData.choices?.[0]?.message?.content || 
         "No pude procesar tu mensaje correctamente. ¿Podrías reformularlo? — Isabella 🌸";
 
       return new Response(
         JSON.stringify({
           response: responseText,
           emotion: emotionAnalysis,
           ethicalCheck,
           model: 'gemini-3-flash',
           timestamp: new Date().toISOString(),
         }),
         { status: 200, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
       );
     }
 
     // ANALYZE action - content moderation
     if (action === 'analyze') {
       const ethicalCheck = analyzeEthicalRisk(content);
       const emotionAnalysis = analyzeEmotion(content);
       
       return new Response(
         JSON.stringify({
           ethicalScore: 1 - ethicalCheck.riskScore,
           riskScore: ethicalCheck.riskScore,
           flags: ethicalCheck.flags,
           emotion: emotionAnalysis,
           recommendation: ethicalCheck.riskScore > 0.3 ? 'REVIEW' : 'APPROVE',
           timestamp: new Date().toISOString(),
         }),
         { status: 200, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
       );
     }
 
     // STATUS action - health check
     if (action === 'status') {
       return new Response(
         JSON.stringify({
           status: 'AWAKE',
           version: '2026.1.0',
           name: 'Isabella AI Core',
           capabilities: ['chat', 'analyze', 'moderate'],
           timestamp: new Date().toISOString(),
         }),
         { status: 200, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
       );
     }
 
     return new Response(
       JSON.stringify({ error: 'Unknown action. Use: chat, analyze, or status' }),
       { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
     );
 
   } catch (error) {
     console.error('Isabella Core Error:', error);
     return new Response(
       JSON.stringify({ 
         error: 'Internal error',
         message: error instanceof Error ? error.message : 'Unknown error'
       }),
       { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
     );
   }
 });