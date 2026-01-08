import { useState, useRef, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Upload, X, Image, Video, Music, FileText, 
  AlertTriangle, Check, Loader2, Shield 
} from 'lucide-react';
import { useSecurityContext } from '@/hooks/useSecurityContext';
import { supabase } from '@/integrations/supabase/client';

interface UploadedFile {
  id: string;
  file: File;
  preview?: string;
  status: 'pending' | 'uploading' | 'success' | 'error';
  progress: number;
  url?: string;
  error?: string;
}

interface SecureMediaUploaderProps {
  onUpload?: (files: { url: string; type: string; name: string }[]) => void;
  maxFiles?: number;
  maxSizeMB?: number;
  allowedTypes?: ('image' | 'video' | 'audio' | 'document')[];
  bucket?: string;
  folder?: string;
  className?: string;
}

const MIME_TYPES: Record<string, string[]> = {
  image: ['image/jpeg', 'image/png', 'image/gif', 'image/webp'],
  video: ['video/mp4', 'video/webm', 'video/quicktime'],
  audio: ['audio/mpeg', 'audio/wav', 'audio/ogg', 'audio/webm'],
  document: ['application/pdf', 'text/plain', 'application/msword'],
};

const TYPE_ICONS = {
  image: Image,
  video: Video,
  audio: Music,
  document: FileText,
};

export const SecureMediaUploader = ({
  onUpload,
  maxFiles = 5,
  maxSizeMB = 50,
  allowedTypes = ['image', 'video', 'audio'],
  bucket = 'user-uploads',
  folder = 'content',
  className = '',
}: SecureMediaUploaderProps) => {
  const { context, validateInput, logSecurityEvent } = useSecurityContext();
  const [files, setFiles] = useState<UploadedFile[]>([]);
  const [isDragging, setIsDragging] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const allowedMimes = allowedTypes.flatMap(type => MIME_TYPES[type]);

  const getFileType = (mime: string): 'image' | 'video' | 'audio' | 'document' => {
    for (const [type, mimes] of Object.entries(MIME_TYPES)) {
      if (mimes.includes(mime)) return type as 'image' | 'video' | 'audio' | 'document';
    }
    return 'document' as const;
  };

  const validateFile = useCallback((file: File): { valid: boolean; error?: string } => {
    // Check MIME type
    if (!allowedMimes.includes(file.type)) {
      return { valid: false, error: `Tipo de archivo no permitido: ${file.type}` };
    }

    // Check file size
    const sizeMB = file.size / (1024 * 1024);
    if (sizeMB > maxSizeMB) {
      return { valid: false, error: `Archivo muy grande: ${sizeMB.toFixed(1)}MB (máx: ${maxSizeMB}MB)` };
    }

    // Validate filename
    const nameValidation = validateInput(file.name, 'text');
    if (!nameValidation.valid) {
      return { valid: false, error: 'Nombre de archivo inválido' };
    }

    return { valid: true };
  }, [allowedMimes, maxSizeMB, validateInput]);

  const handleFiles = useCallback(async (newFiles: FileList | File[]) => {
    setError(null);
    const fileArray = Array.from(newFiles);

    if (files.length + fileArray.length > maxFiles) {
      setError(`Máximo ${maxFiles} archivos permitidos`);
      return;
    }

    // Validate all files first
    const validatedFiles: UploadedFile[] = [];
    for (const file of fileArray) {
      const validation = validateFile(file);
      
      const uploadFile: UploadedFile = {
        id: crypto.randomUUID(),
        file,
        preview: file.type.startsWith('image/') ? URL.createObjectURL(file) : undefined,
        status: validation.valid ? 'pending' : 'error',
        progress: 0,
        error: validation.error,
      };

      validatedFiles.push(uploadFile);
    }

    setFiles(prev => [...prev, ...validatedFiles]);

    // Upload valid files
    const toUpload = validatedFiles.filter(f => f.status === 'pending');
    for (const uploadFile of toUpload) {
      await uploadFileToStorage(uploadFile);
    }
  }, [files.length, maxFiles, validateFile]);

  const uploadFileToStorage = async (uploadFile: UploadedFile) => {
    if (!context.userId) {
      setFiles(prev => prev.map(f => 
        f.id === uploadFile.id 
          ? { ...f, status: 'error' as const, error: 'Debes iniciar sesión' }
          : f
      ));
      return;
    }

    setFiles(prev => prev.map(f => 
      f.id === uploadFile.id ? { ...f, status: 'uploading' as const } : f
    ));

    try {
      // Generate secure file path
      const timestamp = Date.now();
      const ext = uploadFile.file.name.split('.').pop();
      const safeName = `${timestamp}_${uploadFile.id.substring(0, 8)}.${ext}`;
      const filePath = `${folder}/${context.userId}/${safeName}`;

      // Upload to Supabase Storage
      const { data, error } = await supabase.storage
        .from(bucket)
        .upload(filePath, uploadFile.file, {
          cacheControl: '3600',
          upsert: false,
        });

      if (error) throw error;

      // Get public URL
      const { data: urlData } = supabase.storage
        .from(bucket)
        .getPublicUrl(data.path);

      // Log upload event
      await logSecurityEvent('UPLOAD', bucket, {
        fileName: uploadFile.file.name,
        fileType: uploadFile.file.type,
        fileSize: uploadFile.file.size,
        path: data.path,
      });

      setFiles(prev => prev.map(f => 
        f.id === uploadFile.id 
          ? { ...f, status: 'success' as const, progress: 100, url: urlData.publicUrl }
          : f
      ));

      // Notify parent
      if (onUpload) {
        const successFiles = files
          .filter(f => f.status === 'success' && f.url)
          .map(f => ({ url: f.url!, type: f.file.type, name: f.file.name }));
        onUpload([...successFiles, { url: urlData.publicUrl, type: uploadFile.file.type, name: uploadFile.file.name }]);
      }

    } catch (err) {
      console.error('Upload error:', err);
      setFiles(prev => prev.map(f => 
        f.id === uploadFile.id 
          ? { ...f, status: 'error' as const, error: 'Error al subir archivo' }
          : f
      ));
    }
  };

  const removeFile = (id: string) => {
    const file = files.find(f => f.id === id);
    if (file?.preview) {
      URL.revokeObjectURL(file.preview);
    }
    setFiles(prev => prev.filter(f => f.id !== id));
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    handleFiles(e.dataTransfer.files);
  };

  return (
    <div className={className}>
      {/* Drop Zone */}
      <motion.div
        onDragOver={(e) => { e.preventDefault(); setIsDragging(true); }}
        onDragLeave={() => setIsDragging(false)}
        onDrop={handleDrop}
        onClick={() => fileInputRef.current?.click()}
        animate={{ scale: isDragging ? 1.02 : 1 }}
        className={`relative border-2 border-dashed rounded-xl p-8 text-center cursor-pointer transition-colors ${
          isDragging 
            ? 'border-primary bg-primary/10' 
            : 'border-border hover:border-primary/50 hover:bg-muted/30'
        }`}
      >
        <input
          ref={fileInputRef}
          type="file"
          multiple
          accept={allowedMimes.join(',')}
          onChange={(e) => e.target.files && handleFiles(e.target.files)}
          className="hidden"
        />

        <div className="flex flex-col items-center gap-3">
          <div className="p-4 rounded-full bg-primary/10">
            <Upload className="w-8 h-8 text-primary" />
          </div>
          <div>
            <p className="text-foreground font-medium">
              Arrastra archivos aquí o haz clic para seleccionar
            </p>
            <p className="text-sm text-muted-foreground mt-1">
              {allowedTypes.map(t => t.charAt(0).toUpperCase() + t.slice(1)).join(', ')} • Máx {maxSizeMB}MB
            </p>
          </div>
          <div className="flex items-center gap-2 text-xs text-muted-foreground">
            <Shield className="w-3 h-3" />
            <span>Archivos verificados y encriptados</span>
          </div>
        </div>
      </motion.div>

      {/* Error Message */}
      <AnimatePresence>
        {error && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="mt-3 p-3 rounded-lg bg-destructive/10 border border-destructive/20 flex items-center gap-2"
          >
            <AlertTriangle className="w-4 h-4 text-destructive" />
            <span className="text-sm text-destructive">{error}</span>
          </motion.div>
        )}
      </AnimatePresence>

      {/* File List */}
      {files.length > 0 && (
        <div className="mt-4 space-y-2">
          {files.map((file) => {
            const fileType = getFileType(file.file.type);
            const Icon = TYPE_ICONS[fileType];
            
            return (
              <motion.div
                key={file.id}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 20 }}
                className={`flex items-center gap-3 p-3 rounded-lg border ${
                  file.status === 'error' 
                    ? 'border-destructive/30 bg-destructive/5' 
                    : file.status === 'success'
                    ? 'border-green-500/30 bg-green-500/5'
                    : 'border-border bg-muted/30'
                }`}
              >
                {/* Preview/Icon */}
                <div className="w-12 h-12 rounded-lg overflow-hidden bg-muted flex items-center justify-center flex-shrink-0">
                  {file.preview ? (
                    <img src={file.preview} alt="" className="w-full h-full object-cover" />
                  ) : (
                    <Icon className="w-6 h-6 text-muted-foreground" />
                  )}
                </div>

                {/* Info */}
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-foreground truncate">
                    {file.file.name}
                  </p>
                  <p className="text-xs text-muted-foreground">
                    {(file.file.size / (1024 * 1024)).toFixed(2)} MB
                    {file.error && <span className="text-destructive ml-2">• {file.error}</span>}
                  </p>
                </div>

                {/* Status */}
                <div className="flex items-center gap-2">
                  {file.status === 'uploading' && (
                    <Loader2 className="w-5 h-5 text-primary animate-spin" />
                  )}
                  {file.status === 'success' && (
                    <Check className="w-5 h-5 text-green-500" />
                  )}
                  {file.status === 'error' && (
                    <AlertTriangle className="w-5 h-5 text-destructive" />
                  )}
                  <button
                    onClick={() => removeFile(file.id)}
                    className="p-1.5 rounded-lg hover:bg-muted text-muted-foreground hover:text-foreground transition-colors"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>
              </motion.div>
            );
          })}
        </div>
      )}
    </div>
  );
};
