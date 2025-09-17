import React, { useState, useRef } from 'react';
// import { GeminiClient } from '@azizsys/core-logic'; // Removed - using local implementation

interface FileUploadProps {
  onAnalysisComplete: (result: AnalysisResult) => void;
  onError: (error: string) => void;
}

interface AnalysisResult {
  fileName: string;
  fileType: string;
  fileSize: number;
  analysis: {
    summary: string;
    keyPoints: string[];
    sentiment?: 'positive' | 'negative' | 'neutral';
    language: string;
    wordCount: number;
  };
  extractedText: string;
}

export const FileUpload: React.FC<FileUploadProps> = ({ onAnalysisComplete, onError }) => {
  const [isUploading, setIsUploading] = useState(false);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [dragActive, setDragActive] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  // Mock Gemini client for local development
  const geminiClient = {
    generateResponse: async (prompt: string) => ({
      text: 'Mock response for: ' + prompt.substring(0, 50) + '...'
    })
  };

  const supportedTypes = [
    'text/plain',
    'application/pdf',
    'application/msword',
    'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
    'text/csv'
  ];

  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === 'dragenter' || e.type === 'dragover') {
      setDragActive(true);
    } else if (e.type === 'dragleave') {
      setDragActive(false);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);

    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleFile(e.dataTransfer.files[0]);
    }
  };

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      handleFile(e.target.files[0]);
    }
  };

  const handleFile = async (file: File) => {
    if (!supportedTypes.includes(file.type)) {
      onError(`نوع الملف غير مدعوم. الأنواع المدعومة: ${supportedTypes.join(', ')}`);
      return;
    }

    if (file.size > 10 * 1024 * 1024) { // 10MB limit
      onError('حجم الملف كبير جداً. الحد الأقصى 10 ميجابايت.');
      return;
    }

    setIsUploading(true);
    
    try {
      const text = await extractTextFromFile(file);
      setIsUploading(false);
      setIsAnalyzing(true);

      const analysis = await analyzeDocument(text, file);
      
      const result: AnalysisResult = {
        fileName: file.name,
        fileType: file.type,
        fileSize: file.size,
        analysis,
        extractedText: text
      };

      onAnalysisComplete(result);
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'خطأ غير معروف';
      onError(`فشل في معالجة الملف: ${errorMessage}`);
    } finally {
      setIsUploading(false);
      setIsAnalyzing(false);
    }
  };

  const extractTextFromFile = async (file: File): Promise<string> => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      
      reader.onload = (e) => {
        const text = e.target?.result as string;
        if (file.type === 'text/plain' || file.type === 'text/csv') {
          resolve(text);
        } else {
          // For other file types, we'd need additional libraries
          // For now, just handle plain text
          resolve(text);
        }
      };
      
      reader.onerror = () => reject(new Error('فشل في قراءة الملف'));
      reader.readAsText(file, 'UTF-8');
    });
  };

  const analyzeDocument = async (text: string, file: File): Promise<AnalysisResult['analysis']> => {
    const wordCount = text.split(/\s+/).length;
    
    // Generate summary
    const summaryPrompt = `لخص المستند التالي في 3-5 جمل:\n\n${text.substring(0, 2000)}`;
    const summaryResponse = await geminiClient.generateResponse(summaryPrompt);
    
    // Extract key points
    const keyPointsPrompt = `استخرج أهم 5 نقاط من المستند التالي:\n\n${text.substring(0, 2000)}`;
    const keyPointsResponse = await geminiClient.generateResponse(keyPointsPrompt);
    const keyPoints = keyPointsResponse.text.split('\n').filter((point: string) => point.trim());
    
    // Analyze sentiment
    const sentimentPrompt = `حلل المشاعر العامة في النص التالي (إيجابي/سلبي/محايد):\n\n${text.substring(0, 1000)}`;
    const sentimentResponse = await geminiClient.generateResponse(sentimentPrompt);
    const sentiment = sentimentResponse.text.toLowerCase().includes('إيجابي') ? 'positive' :
                     sentimentResponse.text.toLowerCase().includes('سلبي') ? 'negative' : 'neutral';
    
    // Detect language
    const language = /[\u0600-\u06FF]/.test(text) ? 'العربية' : 'English';

    return {
      summary: summaryResponse.text,
      keyPoints,
      sentiment,
      language,
      wordCount
    };
  };

  return (
    <div className="file-upload-container">
      <div
        className={`file-upload-area ${dragActive ? 'drag-active' : ''}`}
        onDragEnter={handleDrag}
        onDragLeave={handleDrag}
        onDragOver={handleDrag}
        onDrop={handleDrop}
        onClick={() => fileInputRef.current?.click()}
      >
        <input
          ref={fileInputRef}
          type="file"
          accept=".txt,.pdf,.doc,.docx,.csv"
          onChange={handleFileSelect}
          style={{ display: 'none' }}
        />
        
        {isUploading ? (
          <div className="upload-status">
            <div className="spinner"></div>
            <p>جاري رفع الملف...</p>
          </div>
        ) : isAnalyzing ? (
          <div className="upload-status">
            <div className="spinner"></div>
            <p>جاري تحليل المستند بالذكاء الاصطناعي...</p>
          </div>
        ) : (
          <div className="upload-prompt">
            <div className="upload-icon">📄</div>
            <h3>رفع مستند للتحليل</h3>
            <p>اسحب الملف هنا أو انقر للاختيار</p>
            <small>الأنواع المدعومة: TXT, PDF, DOC, DOCX, CSV (حتى 10 ميجابايت)</small>
          </div>
        )}
      </div>

      <style>{`
        .file-upload-container {
          margin: 20px 0;
        }

        .file-upload-area {
          border: 2px dashed #ccc;
          border-radius: 10px;
          padding: 40px;
          text-align: center;
          cursor: pointer;
          transition: all 0.3s ease;
          background: #fafafa;
        }

        .file-upload-area:hover,
        .file-upload-area.drag-active {
          border-color: #007bff;
          background: #f0f8ff;
        }

        .upload-icon {
          font-size: 48px;
          margin-bottom: 16px;
        }

        .upload-prompt h3 {
          margin: 0 0 8px 0;
          color: #333;
        }

        .upload-prompt p {
          margin: 0 0 8px 0;
          color: #666;
        }

        .upload-prompt small {
          color: #999;
        }

        .upload-status {
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 16px;
        }

        .spinner {
          width: 40px;
          height: 40px;
          border: 4px solid #f3f3f3;
          border-top: 4px solid #007bff;
          border-radius: 50%;
          animation: spin 1s linear infinite;
        }

        @keyframes spin {
          0% { transform: rotate(0deg); }
          100% { transform: rotate(360deg); }
        }
      `}</style>
    </div>
  );
};