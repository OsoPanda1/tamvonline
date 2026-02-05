 import { useState, useCallback } from 'react';
 import { supabase } from '@/integrations/supabase/client';
 
 interface IsabellaResponse {
   response: string;
   emotion?: { emotion: string; intensity: number };
   ethicalCheck?: { riskScore: number; flags: string[] };
   flagged?: boolean;
   error?: string;
 }
 
 interface ContentAnalysis {
   ethicalScore: number;
   riskScore: number;
   flags: string[];
   emotion: { emotion: string; intensity: number };
   recommendation: 'APPROVE' | 'REVIEW' | 'REJECT';
 }
 
 export const useIsabella = () => {
   const [loading, setLoading] = useState(false);
   const [error, setError] = useState<string | null>(null);
 
   const chat = useCallback(async (message: string): Promise<IsabellaResponse | null> => {
     setLoading(true);
     setError(null);
 
     try {
       const { data, error: funcError } = await supabase.functions.invoke('isabella-core', {
         body: { action: 'chat', message },
       });
 
       if (funcError) throw funcError;
       return data as IsabellaResponse;
     } catch (err) {
       const errorMsg = err instanceof Error ? err.message : 'Error connecting to Isabella';
       setError(errorMsg);
       return null;
     } finally {
       setLoading(false);
     }
   }, []);
 
   const analyzeContent = useCallback(async (content: string): Promise<ContentAnalysis | null> => {
     setLoading(true);
     setError(null);
 
     try {
       const { data, error: funcError } = await supabase.functions.invoke('isabella-core', {
         body: { action: 'analyze', content },
       });
 
       if (funcError) throw funcError;
       return data as ContentAnalysis;
     } catch (err) {
       const errorMsg = err instanceof Error ? err.message : 'Error analyzing content';
       setError(errorMsg);
       return null;
     } finally {
       setLoading(false);
     }
   }, []);
 
   const getStatus = useCallback(async () => {
     try {
       const { data, error: funcError } = await supabase.functions.invoke('isabella-core', {
         body: { action: 'status' },
       });
 
       if (funcError) throw funcError;
       return data;
     } catch (err) {
       console.error('Isabella status error:', err);
       return null;
     }
   }, []);
 
   return {
     chat,
     analyzeContent,
     getStatus,
     loading,
     error,
   };
 };