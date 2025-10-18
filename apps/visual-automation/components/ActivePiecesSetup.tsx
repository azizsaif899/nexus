/**
 * ActivePieces Setup Component
 * Professional configuration modal for ActivePieces connection
 */

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Settings, 
  Check, 
  X, 
  Loader2, 
  ExternalLink, 
  AlertCircle,
  Zap,
  Database,
  Globe
} from 'lucide-react';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { activePiecesAPI } from '../services/activepieces-api';
import { enhancedToast as toast } from './ui/enhanced-toast';
import { logger } from '../lib/logger';

interface ActivePiecesSetupProps {
  isOpen: boolean;
  onClose: () => void;
  onConnected: () => void;
}

export function ActivePiecesSetup({ isOpen, onClose, onConnected }: ActivePiecesSetupProps) {
  const [apiUrl, setApiUrl] = useState('http://localhost:3000'); // Self-Hosted Default
  const [apiKey, setApiKey] = useState('');
  const [projectId, setProjectId] = useState('');
  const [isConnecting, setIsConnecting] = useState(false);
  const [isConnected, setIsConnected] = useState(false);

  // Check if already connected on mount
  useEffect(() => {
    setIsConnected(activePiecesAPI.isConnected());
    if (activePiecesAPI.isConnected()) {
      const config = activePiecesAPI.getConfig();
      if (config) {
        setApiUrl(config.apiUrl);
        setProjectId(config.projectId || '');
      }
    }
  }, [isOpen]);

  const handleConnect = async () => {
    if (!apiUrl || !apiKey) {
      toast.error('الرجاء إدخال جميع البيانات المطلوبة');
      return;
    }

    setIsConnecting(true);
    
    try {
      const success = await activePiecesAPI.connect({
        apiUrl: apiUrl.trim(),
        apiKey: apiKey.trim(),
        projectId: projectId.trim() || undefined,
      });

      if (success) {
        setIsConnected(true);
        toast.success('تم الاتصال بـ ActivePieces بنجاح', {
          description: 'يمكنك الآن تشغيل سير العمل على ActivePieces'
        });
        
        onConnected();
        
        // Close after 2 seconds
        setTimeout(() => {
          onClose();
        }, 2000);
      }
    } catch (error: any) {
      logger.error('Connection failed:', error);
      toast.error('فشل الاتصال بـ ActivePieces', {
        description: error.message || 'تحقق من البيانات وحاول مرة أخرى'
      });
    } finally {
      setIsConnecting(false);
    }
  };

  const handleDisconnect = () => {
    activePiecesAPI.disconnect();
    setIsConnected(false);
    setApiKey('');
    toast.info('تم قطع الاتصال بـ ActivePieces');
  };

  const handleTestConnection = async () => {
    if (!apiUrl || !apiKey) {
      toast.error('الرجاء إدخال URL و API Key');
      return;
    }

    setIsConnecting(true);
    
    try {
      await activePiecesAPI.connect({
        apiUrl: apiUrl.trim(),
        apiKey: apiKey.trim(),
        projectId: projectId.trim() || undefined,
      });
      
      toast.success('✅ الاتصال ناجح', {
        description: 'تم التحقق من البيانات بنجاح'
      });
    } catch (error: any) {
      toast.error('❌ فشل الاتصال', {
        description: error.message
      });
    } finally {
      setIsConnecting(false);
    }
  };

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-[9999] flex items-center justify-center">
        {/* Backdrop */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="absolute inset-0 bg-black/50 backdrop-blur-sm"
          onClick={onClose}
        />

        {/* Modal */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 20 }}
          transition={{ type: 'spring', duration: 0.3 }}
          className="relative z-10 w-full max-w-2xl mx-4"
        >
          <div className="glass-intense rounded-2xl p-8 shadow-2xl">
            {/* Header */}
            <div className="flex items-start justify-between mb-6">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center">
                  <Zap className="w-6 h-6 text-primary" />
                </div>
                <div>
                  <h2 className="text-2xl font-bold text-foreground">
                    إعداد ActivePieces
                  </h2>
                  <p className="text-sm text-foreground-muted">
                    ربط تطبيقك مع ActivePieces للتنفيذ الفعلي
                  </p>
                </div>
              </div>
              <Button
                variant="ghost"
                size="icon"
                onClick={onClose}
                className="rounded-full"
              >
                <X className="w-5 h-5" />
              </Button>
            </div>

            {/* Status Indicator */}
            {isConnected && (
              <div className="mb-6 p-4 rounded-lg bg-success/10 border border-success/20">
                <div className="flex items-center gap-2">
                  <Check className="w-5 h-5 text-success" />
                  <span className="text-success font-medium">
                    متصل بـ ActivePieces
                  </span>
                </div>
              </div>
            )}

            {/* Form */}
            <div className="space-y-5">
              {/* API URL */}
              <div>
                <Label htmlFor="api-url" className="flex items-center gap-2 mb-2">
                  <Globe className="w-4 h-4" />
                  عنوان API
                </Label>
                <Input
                  id="api-url"
                  type="url"
                  value={apiUrl}
                  onChange={(e) => setApiUrl(e.target.value)}
                  placeholder="http://localhost:3000"
                  disabled={isConnected}
                  className="text-left"
                  dir="ltr"
                />
                <p className="text-xs text-foreground-muted mt-1">
                  عنوان ActivePieces Self-Hosted الخاص بك (مثل: http://localhost:3000)
                </p>
              </div>

              {/* API Key */}
              <div>
                <Label htmlFor="api-key" className="flex items-center gap-2 mb-2">
                  <Database className="w-4 h-4" />
                  مفتاح API
                </Label>
                <Input
                  id="api-key"
                  type="password"
                  value={apiKey}
                  onChange={(e) => setApiKey(e.target.value)}
                  placeholder="أدخل API Key الخاص بك"
                  disabled={isConnected}
                  className="text-left font-mono"
                  dir="ltr"
                />
                <p className="text-xs text-foreground-muted mt-1">
                  يمكنك الحصول عليه من إعدادات ActivePieces
                </p>
              </div>

              {/* Project ID (Optional) */}
              <div>
                <Label htmlFor="project-id" className="flex items-center gap-2 mb-2">
                  <Settings className="w-4 h-4" />
                  معرّف المشروع (اختياري)
                </Label>
                <Input
                  id="project-id"
                  type="text"
                  value={projectId}
                  onChange={(e) => setProjectId(e.target.value)}
                  placeholder="project-id-here"
                  disabled={isConnected}
                  className="text-left font-mono"
                  dir="ltr"
                />
              </div>

              {/* Info Box */}
              <div className="p-4 rounded-lg bg-primary/5 border border-primary/10">
                <div className="flex gap-3">
                  <AlertCircle className="w-5 h-5 text-primary flex-shrink-0 mt-0.5" />
                  <div className="text-sm">
                    <p className="font-medium text-foreground mb-1">
                      كيفية إعداد ActivePieces Self-Hosted:
                    </p>
                    <ol className="text-foreground-muted space-y-1 list-decimal list-inside">
                      <li>نزّل ActivePieces من GitHub: <code className="text-xs">git clone https://github.com/activepieces/activepieces</code></li>
                      <li>شغّل ActivePieces محلياً: <code className="text-xs">docker-compose up -d</code></li>
                      <li>افتح الإعدادات (Settings) → API Keys</li>
                      <li>أنشئ مفتاح جديد وانسخه</li>
                      <li>أدخل العنوان (http://localhost:3000) والمفتاح هنا</li>
                    </ol>
                    <a
                      href="https://github.com/activepieces/activepieces"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-primary hover:underline inline-flex items-center gap-1 mt-2"
                    >
                      ActivePieces GitHub Repository
                      <ExternalLink className="w-3 h-3" />
                    </a>
                  </div>
                </div>
              </div>
            </div>

            {/* Actions */}
            <div className="flex items-center gap-3 mt-8">
              {!isConnected ? (
                <>
                  <Button
                    onClick={handleConnect}
                    disabled={isConnecting || !apiUrl || !apiKey}
                    className="flex-1"
                  >
                    {isConnecting ? (
                      <>
                        <Loader2 className="w-4 h-4 ml-2 animate-spin" />
                        جاري الاتصال...
                      </>
                    ) : (
                      <>
                        <Check className="w-4 h-4 ml-2" />
                        اتصال
                      </>
                    )}
                  </Button>
                  <Button
                    onClick={handleTestConnection}
                    disabled={isConnecting || !apiUrl || !apiKey}
                    variant="outline"
                  >
                    اختبار الاتصال
                  </Button>
                </>
              ) : (
                <Button
                  onClick={handleDisconnect}
                  variant="destructive"
                  className="flex-1"
                >
                  <X className="w-4 h-4 ml-2" />
                  قطع الاتصال
                </Button>
              )}
              <Button onClick={onClose} variant="ghost">
                إغلاق
              </Button>
            </div>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
}
