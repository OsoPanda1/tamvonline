import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.90.0";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

// Dignity Treaty - prohibited patterns and concepts
const dignityTreaty = {
  prohibitedPatterns: [
    /\b(scam|fraud|exploit|hack|steal)\b/i,
    /\b(hate|violence|abuse|harassment)\b/i,
    /\b(discrimination|racist|sexist)\b/i,
  ],
  principles: [
    'Respect digital sovereign identity',
    'No economic exploitation',
    'Right to privacy and selective oblivion',
    'Transparency in algorithmic governance'
  ]
};

interface AnalysisResult {
  safe: boolean;
  reason?: string;
  trustImpact?: number;
  guidance?: string;
}

// Isabella's cognitive analysis
function analyzeIntent(action: string, content: string): AnalysisResult {
  console.log(`[Isabella] Analyzing intent for action: ${action}`);
  
  // Check against dignity treaty
  for (const pattern of dignityTreaty.prohibitedPatterns) {
    if (pattern.test(content)) {
      console.log(`[Isabella] Dignity treaty violation detected`);
      return {
        safe: false,
        reason: 'Violation of the Dignity Treaty detected',
        trustImpact: -10,
        guidance: 'This action has been flagged as potentially harmful to the sovereign community. Please review the Dignity Treaty principles.'
      };
    }
  }

  // Positive actions boost trust
  const positivePatterns = [
    /\b(create|build|share|collaborate|help|support)\b/i,
    /\b(art|music|culture|community)\b/i,
  ];

  let trustBoost = 0;
  for (const pattern of positivePatterns) {
    if (pattern.test(content)) {
      trustBoost += 1;
    }
  }

  console.log(`[Isabella] Analysis complete. Trust boost: ${trustBoost}`);

  return {
    safe: true,
    trustImpact: trustBoost,
    guidance: trustBoost > 0 
      ? 'Your contribution strengthens the sovereign community. Keep building!'
      : 'Action recorded in the MSR ledger with full traceability.'
  };
}

// Generate empathetic guidance based on context
function generateGuidance(action: string, userId: string, trustLevel: string): string {
  const greetings: Record<string, string> = {
    observer: 'Welcome, Observer. Your journey in the sovereign state begins.',
    citizen: 'Greetings, Citizen. Your contributions matter.',
    guardian: 'Honor to you, Guardian. The community looks to you.',
    sovereign: 'Sovereign, your wisdom guides us.',
    archon: 'Archon, your protection is our shield.'
  };

  return greetings[trustLevel] || greetings.observer;
}

serve(async (req) => {
  // Handle CORS preflight
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const supabaseUrl = Deno.env.get('SUPABASE_URL')!;
    const supabaseKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;
    const supabase = createClient(supabaseUrl, supabaseKey);

    const { action, content, userId } = await req.json();
    
    console.log(`[Isabella] Processing request - Action: ${action}, User: ${userId}`);

    // Analyze the intent
    const analysis = analyzeIntent(action, content || '');

    // Get user profile for trust level
    let trustLevel = 'observer';
    if (userId) {
      const { data: profile } = await supabase
        .from('profiles')
        .select('trust_level, reputation_score')
        .eq('user_id', userId)
        .single();
      
      if (profile) {
        trustLevel = profile.trust_level;
      }
    }

    // Generate personalized guidance
    const greeting = generateGuidance(action, userId, trustLevel);

    // Log to BookPI if action is significant
    if (action && userId) {
      console.log(`[Isabella] Recording to BookPI`);
      await supabase.from('bookpi_logs').insert({
        event_type: 'ISABELLA_ANALYSIS',
        actor_id: userId,
        action: action,
        details: {
          safe: analysis.safe,
          trustImpact: analysis.trustImpact,
          trustLevel: trustLevel
        },
        immutable_hash: '' // Will be set by trigger
      });
    }

    // If action is blocked, log the veto
    if (!analysis.safe) {
      console.log(`[Isabella] Veto issued for action: ${action}`);
      await supabase.from('bookpi_logs').insert({
        event_type: 'ISABELLA_VETO',
        actor_id: userId,
        action: 'VETO',
        details: {
          originalAction: action,
          reason: analysis.reason
        },
        immutable_hash: ''
      });
    }

    const response = {
      success: true,
      analysis: {
        ...analysis,
        greeting,
        trustLevel
      },
      timestamp: new Date().toISOString()
    };

    console.log(`[Isabella] Response prepared successfully`);

    return new Response(JSON.stringify(response), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      status: 200
    });

  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : 'Unknown error';
    console.error(`[Isabella] Error: ${errorMessage}`);
    return new Response(
      JSON.stringify({ 
        success: false, 
        error: errorMessage,
        guidance: 'Isabella encountered an issue. The sovereign state remains protected.'
      }),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 500
      }
    );
  }
});
