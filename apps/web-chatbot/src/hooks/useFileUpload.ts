import { useState, useCallback, useRef } from 'react';
import { useMessageStore } from '../store/message.store';
import { getWebSocketManager } from '../services/websocket.manager';

export interface FileUploadProgress {
  id: string;
  file: File;
  progress: number;
  status: 'pending' | 'uploading' | 'completed' | 'error';
  error?: string;
  url?: string;
}

export interface FileUploadOptions {
  maxFileSize?: number; // MB
  allowedTypes?: string[];
  maxFiles?: number;
  chunkSize?: number; // For large file uploads
  autoUpload?: boolean;
}

export interface UseFileUploadReturn {
  uploads: FileUploadProgress[];
  isUploading: boolean;
  uploadFiles: (files: FileList | File[]) => Promise<void>;
  cancelUpload: (uploadId: string) => void;
  clearUploads: () => void;
  retryUpload: (uploadId: string) => void;
  validateFile: (file: File) => { valid: boolean; error?: string };
}

const DEFAULT_OPTIONS: Required<FileUploadOptions> = {
  maxFileSize: 10, // 10MB
  allowedTypes: ['image/*', 'video/*', 'audio/*', 'application/pdf', 'text/*'],
  maxFiles: 5,
  chunkSize: 1024 * 1024, // 1MB chunks
  autoUpload: true,
};

export const useFileUpload = (options: FileUploadOptions = {}): UseFileUploadReturn => {
  const opts = { ...DEFAULT_OPTIONS, ...options };
  const [uploads, setUploads] = useState<FileUploadProgress[]>([]);
  const [isUploading, setIsUploading] = useState(false);
  const abortControllers = useRef<Map<string, AbortController>>(new Map());

  const { addMessage } = useMessageStore();
  const wsManager = getWebSocketManager();

  const validateFile = useCallback((file: File): { valid: boolean; error?: string } => {
    // Check file size
    if (file.size > opts.maxFileSize * 1024 * 1024) {
      return {
        valid: false,
        error: `File size exceeds ${opts.maxFileSize}MB limit`
      };
    }

    // Check file type
    const isAllowedType = opts.allowedTypes.some(type => {
      if (type.endsWith('/*')) {
        const baseType = type.slice(0, -1);
        return file.type.startsWith(baseType);
      }
      return file.type === type;
    });

    if (!isAllowedType) {
      return {
        valid: false,
        error: `File type not allowed. Allowed types: ${opts.allowedTypes.join(', ')}`
      };
    }

    return { valid: true };
  }, [opts.maxFileSize, opts.allowedTypes]);

  const createUploadProgress = useCallback((file: File): FileUploadProgress => {
    return {
      id: `upload-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
      file,
      progress: 0,
      status: 'pending',
    };
  }, []);

  const updateUploadProgress = useCallback((id: string, updates: Partial<FileUploadProgress>) => {
    setUploads((prev: FileUploadProgress[]) => prev.map((upload: FileUploadProgress) =>
      upload.id === id ? { ...upload, ...updates } : upload
    ));
  }, []);

  const uploadFile = useCallback(async (upload: FileUploadProgress): Promise<void> => {
    const controller = new AbortController();
    abortControllers.current.set(upload.id, controller);

    updateUploadProgress(upload.id, { status: 'uploading' });

    try {
      const formData = new FormData();
      formData.append('file', upload.file);
      formData.append('sessionId', 'current-session-id'); // TODO: Get from store

      const response = await fetch('/api/upload', {
        method: 'POST',
        body: formData,
        signal: controller.signal,
        // Note: We can't track progress with fetch for multipart/form-data
        // For progress tracking, we'd need XMLHttpRequest or a library like axios
      });

      if (!response.ok) {
        throw new Error(`Upload failed: ${response.statusText}`);
      }

      const result = await response.json();

      updateUploadProgress(upload.id, {
        status: 'completed',
        progress: 100,
        url: result.url,
      });

      // Send file message to chat
      addMessage({
        content: `Shared a file: ${upload.file.name}`,
        sender: 'user',
        sessionId: 'current-session-id', // TODO: Get from store
        messageType: 'text',
        metadata: {
          fileUrl: result.url,
          fileName: upload.file.name,
          fileSize: upload.file.size,
          fileType: upload.file.type,
        },
      });

    } catch (error: any) {
      if (error.name === 'AbortError') {
        updateUploadProgress(upload.id, {
          status: 'error',
          error: 'Upload cancelled',
        });
      } else {
        updateUploadProgress(upload.id, {
          status: 'error',
          error: error.message || 'Upload failed',
        });
      }
    } finally {
      abortControllers.current.delete(upload.id);
    }
  }, [addMessage, updateUploadProgress]);

  const uploadFiles = useCallback(async (files: FileList | File[]): Promise<void> => {
    const fileArray = Array.from(files);

    // Validate all files first
    const validationResults = fileArray.map(file => ({
      file,
      validation: validateFile(file),
    }));

    const invalidFiles = validationResults.filter(result => !result.validation.valid);
    if (invalidFiles.length > 0) {
      throw new Error(invalidFiles.map(f => `${f.file.name}: ${f.validation.error}`).join('; '));
    }

    // Check max files limit
    if (fileArray.length > opts.maxFiles) {
      throw new Error(`Maximum ${opts.maxFiles} files allowed`);
    }

    // Create upload progress objects
    const newUploads = fileArray.map(createUploadProgress);
    setUploads((prev: FileUploadProgress[]) => [...prev, ...newUploads]);
    setIsUploading(true);

    try {
      // Upload files sequentially or in parallel based on requirements
      if (opts.autoUpload) {
        await Promise.all(newUploads.map(uploadFile));
      }
    } finally {
      const hasUploading = uploads.some((upload: FileUploadProgress) => upload.status === 'uploading');
      setIsUploading(hasUploading);
    }
  }, [validateFile, opts.maxFiles, opts.autoUpload, createUploadProgress, uploadFile]);

  const cancelUpload = useCallback((uploadId: string) => {
    const controller = abortControllers.current.get(uploadId);
    if (controller) {
      controller.abort();
      abortControllers.current.delete(uploadId);
    }

    updateUploadProgress(uploadId, {
      status: 'error',
      error: 'Upload cancelled',
    });
  }, [updateUploadProgress]);

  const retryUpload = useCallback((uploadId: string) => {
    const upload = uploads.find((u: FileUploadProgress) => u.id === uploadId);
    if (upload && upload.status === 'error') {
      uploadFile(upload);
    }
  }, [uploads, uploadFile]);

  const clearUploads = useCallback(() => {
    // Cancel all ongoing uploads
    abortControllers.current.forEach((controller: AbortController) => controller.abort());
    abortControllers.current.clear();

    setUploads([]);
    setIsUploading(false);
  }, []);

  return {
    uploads,
    isUploading,
    uploadFiles,
    cancelUpload,
    clearUploads,
    retryUpload,
    validateFile,
  };
};