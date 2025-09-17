// Local replacement for @azizsys/core-logic

export interface FileUploadConfig {
  maxSize: number;
  allowedTypes: string[];
  uploadPath: string;
}

export interface UploadResult {
  success: boolean;
  fileUrl?: string;
  error?: string;
}

export interface ProcessingOptions {
  compress?: boolean;
  resize?: { width: number; height: number };
  format?: string;
}

export class FileProcessor {
  static async processFile(file: File, options?: ProcessingOptions): Promise<UploadResult> {
    try {
      return {
        success: true,
        fileUrl: URL.createObjectURL(file)
      };
    } catch (error) {
      return {
        success: false,
        error: 'File processing failed'
      };
    }
  }
}

export const defaultConfig: FileUploadConfig = {
  maxSize: 10 * 1024 * 1024,
  allowedTypes: ['image/jpeg', 'image/png', 'image/gif', 'application/pdf'],
  uploadPath: '/uploads'
};