import React from 'react';
import { toast as sonnerToast } from 'sonner@2.0.3';
import { motion } from 'motion/react';
import { 
  CheckCircle, 
  AlertCircle, 
  Info, 
  X, 
  Zap,
  Loader2
} from 'lucide-react';

interface ToastOptions {
  title?: string;
  description?: string;
  action?: {
    label: string;
    onClick: () => void;
  };
  duration?: number;
  position?: 'top-left' | 'top-right' | 'bottom-left' | 'bottom-right';
}

const ToastIcon = ({ type }: { type: 'success' | 'error' | 'warning' | 'info' | 'loading' }) => {
  const icons = {
    success: CheckCircle,
    error: AlertCircle,
    warning: AlertCircle,
    info: Info,
    loading: Loader2
  };
  
  const colors = {
    success: 'text-success',
    error: 'text-destructive',
    warning: 'text-warning',
    info: 'text-primary',
    loading: 'text-primary'
  };
  
  const Icon = icons[type];
  
  return (
    <motion.div
      initial={{ scale: 0, rotate: -180 }}
      animate={{ 
        scale: 1, 
        rotate: 0,
        ...(type === 'loading' && { rotate: 360 })
      }}
      transition={{ 
        duration: 0.3, 
        ease: [0.4, 0, 0.2, 1],
        ...(type === 'loading' && { 
          repeat: Infinity, 
          duration: 1,
          ease: 'linear' 
        })
      }}
      className={`${colors[type]}`}
    >
      <Icon className="w-5 h-5" />
    </motion.div>
  );
};

const CustomToast = ({ 
  type, 
  title, 
  description, 
  action,
  onClose 
}: {
  type: 'success' | 'error' | 'warning' | 'info' | 'loading';
  title?: string;
  description?: string;
  action?: ToastOptions['action'];
  onClose: () => void;
}) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 50, scale: 0.95 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      exit={{ opacity: 0, y: -50, scale: 0.95 }}
      transition={{ duration: 0.3, ease: [0.4, 0, 0.2, 1] }}
      className="glass rounded-xl p-4 shadow-xl border border-border max-w-md w-full"
    >
      <div className="flex items-start gap-3">
        <ToastIcon type={type} />
        
        <div className="flex-1 min-w-0">
          {title && (
            <motion.h4 
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.1 }}
              className="font-medium text-foreground"
            >
              {title}
            </motion.h4>
          )}
          
          {description && (
            <motion.p 
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.15 }}
              className="text-sm text-muted-foreground mt-1"
            >
              {description}
            </motion.p>
          )}
          
          {action && (
            <motion.button
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              onClick={action.onClick}
              className="mt-2 text-sm text-primary hover:text-primary/80 transition-colors font-medium"
            >
              {action.label}
            </motion.button>
          )}
        </div>
        
        <motion.button
          initial={{ opacity: 0, scale: 0 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.2 }}
          onClick={onClose}
          className="text-muted-foreground hover:text-foreground transition-colors p-1 hover:bg-muted rounded"
        >
          <X className="w-4 h-4" />
        </motion.button>
      </div>
    </motion.div>
  );
};

export const enhancedToast = {
  success: (message: string, options?: ToastOptions) => {
    return sonnerToast.custom((t) => (
      <CustomToast
        type="success"
        title={options?.title || message}
        description={options?.description}
        action={options?.action}
        onClose={() => sonnerToast.dismiss(t)}
      />
    ), {
      duration: options?.duration || 2500, // Reduced from 4000 to 2500
      position: options?.position || 'bottom-left'
    });
  },
  
  error: (message: string, options?: ToastOptions) => {
    return sonnerToast.custom((t) => (
      <CustomToast
        type="error"
        title={options?.title || message}
        description={options?.description}
        action={options?.action}
        onClose={() => sonnerToast.dismiss(t)}
      />
    ), {
      duration: options?.duration || 4000, // Reduced from 6000 to 4000
      position: options?.position || 'bottom-left'
    });
  },
  
  warning: (message: string, options?: ToastOptions) => {
    return sonnerToast.custom((t) => (
      <CustomToast
        type="warning"
        title={options?.title || message}
        description={options?.description}
        action={options?.action}
        onClose={() => sonnerToast.dismiss(t)}
      />
    ), {
      duration: options?.duration || 3000, // Reduced from 5000 to 3000
      position: options?.position || 'bottom-left'
    });
  },
  
  info: (message: string, options?: ToastOptions) => {
    return sonnerToast.custom((t) => (
      <CustomToast
        type="info"
        title={options?.title || message}
        description={options?.description}
        action={options?.action}
        onClose={() => sonnerToast.dismiss(t)}
      />
    ), {
      duration: options?.duration || 2500, // Reduced from 4000 to 2500
      position: options?.position || 'bottom-left'
    });
  },
  
  loading: (message: string, options?: ToastOptions) => {
    return sonnerToast.custom((t) => (
      <CustomToast
        type="loading"
        title={options?.title || message}
        description={options?.description}
        action={options?.action}
        onClose={() => sonnerToast.dismiss(t)}
      />
    ), {
      duration: options?.duration || Infinity,
      position: options?.position || 'bottom-left'
    });
  },
  
  // Quick workflow-specific notifications
  nodeAdded: (nodeType: string) => {
    return enhancedToast.success('تمت إضافة العقدة', {
      description: `تم إضافة عقدة ${nodeType} بنجاح`,
      duration: 3000
    });
  },
  
  workflowSaved: () => {
    return enhancedToast.success('تم حفظ سير العمل', {
      description: 'تم حفظ جميع التغييرات بنجاح',
      action: {
        label: 'عرض الملف',
        onClick: () => console.log('Show saved file')
      }
    });
  },
  
  executionStarted: () => {
    return enhancedToast.loading('جاري تشغيل سير العمل', {
      description: 'يتم تنفيذ العقد بالتسلسل...'
    });
  },
  
  executionCompleted: (duration: number) => {
    return enhancedToast.success('اكتمل تشغيل سير العمل', {
      description: `تم التنفيذ في ${duration}ms`,
      action: {
        label: 'عرض النتائج',
        onClick: () => console.log('Show results')
      }
    });
  },
  
  connectionEstablished: () => {
    return enhancedToast.success('تم ربط العقدتين', {
      description: 'تم إنشاء الاتصال بنجاح'
    });
  }
};

// Legacy compatibility
export const toast = enhancedToast;