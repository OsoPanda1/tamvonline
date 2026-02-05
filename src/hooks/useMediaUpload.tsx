 import { useState, useCallback } from 'react';
 import { supabase } from '@/integrations/supabase/client';
 import { useAuth } from './useAuth';
 
 interface UploadResult {
   url: string;
   path: string;
   bucket: string;
 }
 
 interface UploadOptions {
   bucket: 'avatars' | 'posts-media' | 'audio-tracks';
   maxSizeMB?: number;
 }
 
 const ALLOWED_TYPES: Record<string, string[]> = {
   'avatars': ['image/jpeg', 'image/png', 'image/webp', 'image/gif'],
   'posts-media': ['image/jpeg', 'image/png', 'image/webp', 'image/gif', 'video/mp4', 'video/webm', 'audio/mpeg', 'audio/wav', 'audio/ogg'],
   'audio-tracks': ['audio/mpeg', 'audio/wav', 'audio/ogg', 'audio/flac'],
 };
 
 const MAX_SIZES: Record<string, number> = {
   'avatars': 5,
   'posts-media': 100,
   'audio-tracks': 50,
 };
 
 export const useMediaUpload = () => {
   const { user } = useAuth();
   const [uploading, setUploading] = useState(false);
   const [progress, setProgress] = useState(0);
   const [error, setError] = useState<string | null>(null);
 
   const validateFile = useCallback((file: File, options: UploadOptions): string | null => {
     const { bucket, maxSizeMB } = options;
     const allowedTypes = ALLOWED_TYPES[bucket];
     const maxSize = (maxSizeMB || MAX_SIZES[bucket]) * 1024 * 1024;
 
     if (!allowedTypes.includes(file.type)) {
       return `Tipo de archivo no permitido. Permitidos: ${allowedTypes.join(', ')}`;
     }
 
     if (file.size > maxSize) {
       return `Archivo muy grande. Máximo: ${maxSizeMB || MAX_SIZES[bucket]}MB`;
     }
 
     return null;
   }, []);
 
   const uploadFile = useCallback(async (
     file: File,
     options: UploadOptions
   ): Promise<UploadResult | null> => {
     if (!user) {
       setError('Debes iniciar sesión para subir archivos');
       return null;
     }
 
     const validationError = validateFile(file, options);
     if (validationError) {
       setError(validationError);
       return null;
     }
 
     setUploading(true);
     setProgress(0);
     setError(null);
 
     try {
       const fileExt = file.name.split('.').pop();
       const fileName = `${Date.now()}-${Math.random().toString(36).substring(2)}.${fileExt}`;
       const filePath = `${user.id}/${fileName}`;
 
       // Simulate progress (Supabase doesn't provide upload progress)
       const progressInterval = setInterval(() => {
         setProgress(prev => Math.min(prev + 10, 90));
       }, 100);
 
       const { data, error: uploadError } = await supabase.storage
         .from(options.bucket)
         .upload(filePath, file, {
           cacheControl: '3600',
           upsert: false,
         });
 
       clearInterval(progressInterval);
 
       if (uploadError) throw uploadError;
 
       // Get public URL
       const { data: urlData } = supabase.storage
         .from(options.bucket)
         .getPublicUrl(filePath);
 
       setProgress(100);
 
       return {
         url: urlData.publicUrl,
         path: filePath,
         bucket: options.bucket,
       };
     } catch (err) {
       const errorMsg = err instanceof Error ? err.message : 'Error subiendo archivo';
       setError(errorMsg);
       return null;
     } finally {
       setUploading(false);
     }
   }, [user, validateFile]);
 
   const uploadMultiple = useCallback(async (
     files: File[],
     options: UploadOptions
   ): Promise<UploadResult[]> => {
     const results: UploadResult[] = [];
     
     for (const file of files) {
       const result = await uploadFile(file, options);
       if (result) results.push(result);
     }
     
     return results;
   }, [uploadFile]);
 
   const deleteFile = useCallback(async (path: string, bucket: string) => {
     try {
       const { error } = await supabase.storage.from(bucket).remove([path]);
       if (error) throw error;
       return true;
     } catch (err) {
       setError(err instanceof Error ? err.message : 'Error eliminando archivo');
       return false;
     }
   }, []);
 
   return {
     uploadFile,
     uploadMultiple,
     deleteFile,
     uploading,
     progress,
     error,
     clearError: () => setError(null),
   };
 };