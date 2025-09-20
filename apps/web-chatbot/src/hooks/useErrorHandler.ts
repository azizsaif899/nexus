import { useCallback, useState } from 'react';
import { useQueryClient } from '@tanstack/react-query';

export interface ErrorInfo {
  message: string;
  code?: string;
  status?: number;
  timestamp: Date;
  context?: string;
}

export interface ToastNotification {
  id: string;
  type: 'error' | 'warning' | 'info' | 'success';
  title: string;
  message: string;
  duration?: number;
  action?: {
    label: string;
    onClick: () => void;
  };
}

export const useErrorHandler = () => {
  const [notifications, setNotifications] = useState<ToastNotification[]>([]);
  const queryClient = useQueryClient();

  // إضافة إشعار
  const addNotification = useCallback((notification: Omit<ToastNotification, 'id'>) => {
    const id = `notification_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
    const newNotification: ToastNotification = {
      id,
      duration: 5000, // 5 ثوانٍ افتراضياً
      ...notification
    };

    setNotifications(prev => [...prev, newNotification]);

    // إزالة الإشعار تلقائياً
    if (newNotification.duration && newNotification.duration > 0) {
      setTimeout(() => {
        removeNotification(id);
      }, newNotification.duration);
    }

    return id;
  }, []);

  // إزالة إشعار
  const removeNotification = useCallback((id: string) => {
    setNotifications(prev => prev.filter(n => n.id !== id));
  }, []);

  // مسح جميع الإشعارات
  const clearNotifications = useCallback(() => {
    setNotifications([]);
  }, []);

  // معالجة خطأ عام
  const handleError = useCallback((error: any, context?: string) => {
    console.error('Error handled:', error, context);

    const errorInfo: ErrorInfo = {
      message: error?.message || 'حدث خطأ غير متوقع',
      code: error?.code,
      status: error?.status,
      timestamp: new Date(),
      context
    };

    // تحديد نوع الخطأ ورسالة مناسبة
    let title = 'خطأ';
    let message = errorInfo.message;
    let type: 'error' | 'warning' = 'error';

    if (errorInfo.status === 401) {
      title = 'انتهت صلاحية الجلسة';
      message = 'يرجى تسجيل الدخول مرة أخرى';
      type = 'warning';
    } else if (errorInfo.status === 403) {
      title = 'غير مصرح';
      message = 'ليس لديك صلاحية للوصول لهذا المورد';
    } else if (errorInfo.status === 404) {
      title = 'غير موجود';
      message = 'المورد المطلوب غير موجود';
    } else if (errorInfo.status === 500) {
      title = 'خطأ في الخادم';
      message = 'حدث خطأ في الخادم، يرجى المحاولة لاحقاً';
    } else if (errorInfo.code === 'NETWORK_ERROR') {
      title = 'خطأ في الشبكة';
      message = 'تحقق من اتصالك بالإنترنت';
      type = 'warning';
    }

    // إضافة إشعار الخطأ
    addNotification({
      type,
      title,
      message,
      action: {
        label: 'إعادة المحاولة',
        onClick: () => {
          // يمكن تخصيص هذا حسب السياق
          window.location.reload();
        }
      }
    });

    return errorInfo;
  }, [addNotification]);

  // معالجة خطأ API
  const handleApiError = useCallback((error: any, context?: string) => {
    const errorInfo = handleError(error, context);

    // إجراءات إضافية لأخطاء API
    if (errorInfo.status === 401) {
      // مسح cache وإعادة توجيه لتسجيل الدخول
      queryClient.clear();
      setTimeout(() => {
        window.location.href = '/login';
      }, 2000);
    }

    return errorInfo;
  }, [handleError, queryClient]);

  // معالجة خطأ WebSocket
  const handleWebSocketError = useCallback((error: any) => {
    console.error('WebSocket error:', error);

    addNotification({
      type: 'warning',
      title: 'انقطع الاتصال',
      message: 'فقد الاتصال مع الخادم، جارٍ إعادة المحاولة...',
      duration: 3000
    });
  }, [addNotification]);

  // معالجة خطأ في الرسائل
  const handleMessageError = useCallback((error: any, messageId?: string) => {
    console.error('Message error:', error, messageId);

    addNotification({
      type: 'error',
      title: 'فشل في إرسال الرسالة',
      message: error?.message || 'حدث خطأ أثناء إرسال الرسالة',
      action: messageId ? {
        label: 'إعادة الإرسال',
        onClick: () => {
          // سيتم تنفيذ إعادة الإرسال من خلال useChat
          console.log('Retry message:', messageId);
        }
      } : undefined
    });
  }, [addNotification]);

  // إظهار رسالة نجاح
  const showSuccess = useCallback((title: string, message?: string) => {
    addNotification({
      type: 'success',
      title,
      message: message || '',
      duration: 3000
    });
  }, [addNotification]);

  // إظهار رسالة معلومات
  const showInfo = useCallback((title: string, message?: string) => {
    addNotification({
      type: 'info',
      title,
      message: message || '',
      duration: 4000
    });
  }, [addNotification]);

  // إظهار تحذير
  const showWarning = useCallback((title: string, message?: string) => {
    addNotification({
      type: 'warning',
      title,
      message: message || '',
      duration: 4000
    });
  }, [addNotification]);

  // معالجة أخطاء النماذج
  const handleFormError = useCallback((errors: Record<string, string>) => {
    const errorMessages = Object.entries(errors)
      .map(([field, message]) => `${field}: ${message}`)
      .join('\n');

    addNotification({
      type: 'error',
      title: 'خطأ في النموذج',
      message: errorMessages,
      duration: 6000
    });
  }, [addNotification]);

  // إعادة تعيين الأخطاء
  const resetErrors = useCallback(() => {
    clearNotifications();
  }, [clearNotifications]);

  return {
    // الحالة
    notifications,
    hasErrors: notifications.some(n => n.type === 'error'),
    hasWarnings: notifications.some(n => n.type === 'warning'),

    // معالجات الأخطاء
    handleError,
    handleApiError,
    handleWebSocketError,
    handleMessageError,
    handleFormError,

    // إظهار الرسائل
    showSuccess,
    showInfo,
    showWarning,

    // إدارة الإشعارات
    addNotification,
    removeNotification,
    clearNotifications,
    resetErrors
  };
};