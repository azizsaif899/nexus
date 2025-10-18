import React, { ErrorInfo, ReactNode } from 'react';
import { Button } from './ui/button';
import { AlertCircle, RefreshCw } from 'lucide-react';
import { motion } from 'motion/react';

interface Props {
  children: ReactNode;
  fallback?: ReactNode;
  onError?: (error: Error, errorInfo: ErrorInfo) => void;
}

interface State {
  hasError: boolean;
  error?: Error;
}

export class ErrorBoundary extends React.Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error('ErrorBoundary caught an error:', error, errorInfo);
    
    if (this.props.onError) {
      this.props.onError(error, errorInfo);
    }
  }

  handleRetry = () => {
    this.setState({ hasError: false, error: undefined });
  };

  render() {
    if (this.state.hasError) {
      if (this.props.fallback) {
        return this.props.fallback;
      }

      return (
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="flex flex-col items-center justify-center h-64 p-8 glass rounded-xl border border-destructive/20"
        >
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ delay: 0.1 }}
            className="mb-4 p-3 rounded-full bg-destructive/10"
          >
            <AlertCircle className="w-8 h-8 text-destructive" />
          </motion.div>
          
          <motion.h3
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="text-lg font-medium mb-2"
          >
            حدث خطأ غير متوقع
          </motion.h3>
          
          <motion.p
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="text-sm text-muted-foreground text-center mb-4 max-w-md"
          >
            عذراً، حدث خطأ في هذا الجزء من التطبيق. يمكنك المحاولة مرة أخرى أو إعادة تحميل الصفحة.
          </motion.p>
          
          {this.state.error && (
            <motion.details
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.4 }}
              className="mb-4 p-3 bg-muted/50 rounded text-xs max-w-md w-full"
            >
              <summary className="cursor-pointer font-medium">تفاصيل الخطأ</summary>
              <pre className="mt-2 text-xs overflow-auto">
                {this.state.error.message}
              </pre>
            </motion.details>
          )}
          
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
            className="flex gap-2"
          >
            <Button
              onClick={this.handleRetry}
              variant="default"
              size="sm"
              className="gap-2"
            >
              <RefreshCw className="w-4 h-4" />
              المحاولة مرة أخرى
            </Button>
            
            <Button
              onClick={() => window.location.reload()}
              variant="outline"
              size="sm"
            >
              إعادة تحميل الصفحة
            </Button>
          </motion.div>
        </motion.div>
      );
    }

    return this.props.children;
  }
}

// Higher-order component for functional components
export function withErrorBoundary<P extends object>(
  Component: React.ComponentType<P>,
  errorBoundaryProps?: Omit<Props, 'children'>
) {
  return function WrappedComponent(props: P) {
    return (
      <ErrorBoundary {...errorBoundaryProps}>
        <Component {...props} />
      </ErrorBoundary>
    );
  };
}