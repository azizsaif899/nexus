'use client';

import { useState, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Upload, FileText, Loader2 } from 'lucide-react';

interface DocumentAnalysis {
  id: string;
  fileName: string;
  fileType: string;
  summary: string;
  keyPoints: string[];
  entities: {
    people: string[];
    companies: string[];
    amounts: string[];
  };
  sentiment: 'positive' | 'negative' | 'neutral';
  confidence: number;
  metadata: {
    wordCount: number;
    processingTime: number;
  };
}

export function DocumentAnalyzer() {
  const [analyses, setAnalyses] = useState<DocumentAnalysis[]>([]);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [selectedAnalysis, setSelectedAnalysis] = useState<DocumentAnalysis | null>(null);

  const handleFileUpload = useCallback(async (files: FileList) => {
    setIsAnalyzing(true);
    
    try {
      const mockAnalyses: DocumentAnalysis[] = Array.from(files).map((file, index) => ({
        id: `doc_${Date.now()}_${index}`,
        fileName: file.name,
        fileType: 'pdf',
        summary: `ملخص المستند: يحتوي على معلومات مهمة حول العقد والمشروع المقترح.`,
        keyPoints: [
          'قيمة العقد: 500,000 ريال',
          'مدة التنفيذ: 6 أشهر',
          'تاريخ البدء: 2024-02-01'
        ],
        entities: {
          people: ['أحمد محمد', 'سارة أحمد'],
          companies: ['شركة التقنية المتقدمة'],
          amounts: ['500,000 ريال']
        },
        sentiment: 'positive',
        confidence: 0.85,
        metadata: {
          wordCount: 1250,
          processingTime: 2500
        }
      }));

      await new Promise(resolve => setTimeout(resolve, 2000));
      setAnalyses(prev => [...prev, ...mockAnalyses]);
    } catch (error) {
      console.error('Analysis failed:', error);
    } finally {
      setIsAnalyzing(false);
    }
  }, []);

  const getSentimentColor = (sentiment: string) => {
    switch (sentiment) {
      case 'positive': return 'text-green-600 bg-green-100';
      case 'negative': return 'text-red-600 bg-red-100';
      default: return 'text-gray-600 bg-gray-100';
    }
  };

  return (
    <div className="space-y-6">
      <div className="bg-white rounded-lg shadow-sm border p-6">
        <div className="text-center">
          <div
            className="border-2 border-dashed border-gray-300 rounded-lg p-8 hover:border-blue-400 transition-colors cursor-pointer"
            onClick={() => {
              const input = document.createElement('input');
              input.type = 'file';
              input.multiple = true;
              input.accept = '.pdf,.doc,.docx,.xls,.xlsx,.png,.jpg,.jpeg';
              input.onchange = (e) => {
                const files = (e.target as HTMLInputElement).files;
                if (files) handleFileUpload(files);
              };
              input.click();
            }}
          >
            {isAnalyzing ? (
              <div className="flex flex-col items-center">
                <Loader2 className="w-12 h-12 text-blue-600 animate-spin mb-4" />
                <p className="text-lg font-medium text-gray-900">جاري التحليل...</p>
              </div>
            ) : (
              <div className="flex flex-col items-center">
                <Upload className="w-12 h-12 text-gray-400 mb-4" />
                <p className="text-lg font-medium text-gray-900">ارفع المستندات للتحليل</p>
                <p className="text-gray-600">PDF, Word, Excel, أو الصور</p>
              </div>
            )}
          </div>
        </div>
      </div>

      {analyses.length > 0 && (
        <div className="bg-white rounded-lg shadow-sm border">
          <div className="p-6 border-b">
            <h3 className="text-lg font-semibold text-gray-900">المستندات المحللة</h3>
          </div>
          
          <div className="p-6">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {analyses.map((analysis, index) => (
                <motion.div
                  key={analysis.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                  className="border rounded-lg p-4 hover:shadow-md transition-shadow cursor-pointer"
                  onClick={() => setSelectedAnalysis(analysis)}
                >
                  <div className="flex items-center justify-between mb-3">
                    <div className="flex items-center space-x-2">
                      <FileText className="w-5 h-5 text-blue-600" />
                      <span className="font-medium text-gray-900 truncate">
                        {analysis.fileName}
                      </span>
                    </div>
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${getSentimentColor(analysis.sentiment)}`}>
                      إيجابي
                    </span>
                  </div>
                  
                  <p className="text-sm text-gray-600 mb-3 line-clamp-2">
                    {analysis.summary}
                  </p>
                  
                  <div className="flex items-center justify-between text-xs text-gray-500">
                    <span>{analysis.metadata.wordCount} كلمة</span>
                    <span>ثقة: {Math.round(analysis.confidence * 100)}%</span>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </div>
      )}

      <AnimatePresence>
        {selectedAnalysis && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4"
            onClick={() => setSelectedAnalysis(null)}
          >
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="bg-white rounded-lg shadow-2xl max-w-4xl w-full max-h-[80vh] overflow-hidden"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="p-6 border-b">
                <div className="flex items-center justify-between">
                  <h3 className="text-xl font-semibold text-gray-900">
                    تحليل: {selectedAnalysis.fileName}
                  </h3>
                  <button
                    onClick={() => setSelectedAnalysis(null)}
                    className="text-gray-400 hover:text-gray-600"
                  >
                    ✕
                  </button>
                </div>
              </div>
              
              <div className="p-6 overflow-y-auto max-h-96">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <h4 className="font-semibold text-gray-900 mb-3">الملخص</h4>
                    <p className="text-gray-700 mb-4">{selectedAnalysis.summary}</p>
                    
                    <h4 className="font-semibold text-gray-900 mb-3">النقاط الرئيسية</h4>
                    <ul className="space-y-2">
                      {selectedAnalysis.keyPoints.map((point, index) => (
                        <li key={index} className="flex items-start space-x-2">
                          <span className="text-blue-600">•</span>
                          <span className="text-gray-700">{point}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                  
                  <div>
                    <h4 className="font-semibold text-gray-900 mb-3">الكيانات المستخرجة</h4>
                    <div className="space-y-3">
                      <div>
                        <h5 className="text-sm font-medium text-gray-600 mb-1">الأشخاص</h5>
                        <div className="flex flex-wrap gap-1">
                          {selectedAnalysis.entities.people.map((person, index) => (
                            <span key={index} className="px-2 py-1 bg-blue-100 text-blue-800 text-xs rounded">
                              {person}
                            </span>
                          ))}
                        </div>
                      </div>
                      
                      <div>
                        <h5 className="text-sm font-medium text-gray-600 mb-1">الشركات</h5>
                        <div className="flex flex-wrap gap-1">
                          {selectedAnalysis.entities.companies.map((company, index) => (
                            <span key={index} className="px-2 py-1 bg-green-100 text-green-800 text-xs rounded">
                              {company}
                            </span>
                          ))}
                        </div>
                      </div>
                      
                      <div>
                        <h5 className="text-sm font-medium text-gray-600 mb-1">المبالغ</h5>
                        <div className="flex flex-wrap gap-1">
                          {selectedAnalysis.entities.amounts.map((amount, index) => (
                            <span key={index} className="px-2 py-1 bg-yellow-100 text-yellow-800 text-xs rounded">
                              {amount}
                            </span>
                          ))}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}