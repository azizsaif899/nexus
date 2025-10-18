/**
 * Error Handling Nodes - عقد معالجة الأخطاء
 * نظام متكامل لمعالجة الأخطاء في workflows
 */

import React from 'react';
import { 
  AlertCircle, 
  RefreshCw, 
  GitBranch, 
  FileText,
  Bell,
  Shield
} from 'lucide-react';

// ============================================
// Node Type Definitions
// ============================================

export interface ErrorHandlingNodeType {
  id: string;
  type: string;
  name: string;
  nameAr: string;
  description: string;
  descriptionAr: string;
  icon: React.ComponentType<any>;
  color: string;
  gradient: string;
  category: 'error-handling';
  config: any;
}

// ============================================
// 1. Try/Catch Node
// ============================================

export const TryCatchNode: ErrorHandlingNodeType = {
  id: 'try-catch',
  type: 'Try/Catch',
  name: 'Try/Catch',
  nameAr: 'محاولة/التقاط',
  description: 'Execute action and catch errors',
  descriptionAr: 'تنفيذ إجراء والتقاط الأخطاء',
  icon: Shield,
  color: '#2563eb',
  gradient: 'from-blue-400 via-blue-500 to-blue-600',
  category: 'error-handling',
  config: {
    tryAction: null,
    catchAction: null,
    finallyAction: null,
    continueOnError: false,
    logErrors: true
  }
};

// ============================================
// 2. Retry Logic Node
// ============================================

export const RetryNode: ErrorHandlingNodeType = {
  id: 'retry-logic',
  type: 'Retry',
  name: 'Retry Logic',
  nameAr: 'إعادة المحاولة',
  description: 'Retry failed actions with configurable strategy',
  descriptionAr: 'إعادة محاولة الإجراءات الفاشلة باستراتيجية قابلة للتكوين',
  icon: RefreshCw,
  color: '#d97706',
  gradient: 'from-orange-400 via-orange-500 to-orange-600',
  category: 'error-handling',
  config: {
    maxRetries: 3,
    retryDelay: 1000, // ms
    backoffStrategy: 'exponential', // 'fixed', 'exponential', 'linear'
    backoffMultiplier: 2,
    retryOnStatusCodes: [500, 502, 503, 504],
    timeoutBetweenRetries: 5000,
    stopOnSuccess: true
  }
};

// ============================================
// 3. Fallback Node
// ============================================

export const FallbackNode: ErrorHandlingNodeType = {
  id: 'fallback',
  type: 'Fallback',
  name: 'Fallback',
  nameAr: 'بديل',
  description: 'Provide alternative actions when primary fails',
  descriptionAr: 'توفير إجراءات بديلة عند فشل الإجراء الأساسي',
  icon: GitBranch,
  color: '#059669',
  gradient: 'from-green-400 via-green-500 to-green-600',
  category: 'error-handling',
  config: {
    primaryAction: null,
    fallbackActions: [],
    cascadeFallbacks: true,
    stopOnFirstSuccess: true,
    timeout: 30000
  }
};

// ============================================
// 4. Error Logger Node
// ============================================

export const ErrorLoggerNode: ErrorHandlingNodeType = {
  id: 'error-logger',
  type: 'Error Logger',
  name: 'Error Logger',
  nameAr: 'مسجل الأخطاء',
  description: 'Log errors to various destinations',
  descriptionAr: 'تسجيل الأخطاء في وجهات متعددة',
  icon: FileText,
  color: '#7c3aed',
  gradient: 'from-purple-400 via-purple-500 to-purple-600',
  category: 'error-handling',
  config: {
    destinations: ['console', 'database', 'file'],
    logLevel: 'error', // 'debug', 'info', 'warn', 'error', 'fatal'
    includeStackTrace: true,
    includeContext: true,
    customFields: {},
    webhookUrl: '',
    emailNotification: false
  }
};

// ============================================
// 5. Alert Node
// ============================================

export const AlertNode: ErrorHandlingNodeType = {
  id: 'alert',
  type: 'Alert',
  name: 'Alert',
  nameAr: 'تنبيه',
  description: 'Send alerts via multiple channels',
  descriptionAr: 'إرسال تنبيهات عبر قنوات متعددة',
  icon: Bell,
  color: '#d4183d',
  gradient: 'from-red-400 via-red-500 to-red-600',
  category: 'error-handling',
  config: {
    channels: ['email', 'sms', 'slack', 'webhook'],
    severity: 'high', // 'low', 'medium', 'high', 'critical'
    recipients: [],
    subject: 'Alert: Error Detected',
    message: '',
    attachLogs: true,
    rateLimit: {
      enabled: true,
      maxPerHour: 10
    }
  }
};

// ============================================
// Export All Error Handling Nodes
// ============================================

export const errorHandlingNodes: ErrorHandlingNodeType[] = [
  TryCatchNode,
  RetryNode,
  FallbackNode,
  ErrorLoggerNode,
  AlertNode
];

// Helper to get node by ID
export function getErrorHandlingNodeById(id: string): ErrorHandlingNodeType | undefined {
  return errorHandlingNodes.find(n => n.id === id);
}

// Helper to get default config
export function getDefaultErrorHandlingConfig(type: string): any {
  const node = errorHandlingNodes.find(n => n.type === type);
  return node ? { ...node.config } : {};
}
