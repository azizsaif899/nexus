'use client';

import { Suspense, Component, ErrorInfo, ReactNode } from 'react';

interface ErrorBoundaryState {
  hasError: boolean;
  error?: Error;
}

interface ErrorBoundaryProps {
  children: ReactNode;
  fallback?: ReactNode;
  onError?: (error: Error, errorInfo: ErrorInfo) => void;
}

// Error Boundary للتعامل مع أخطاء التحميل
class ErrorBoundary extends Component<ErrorBoundaryProps, ErrorBoundaryState> {
  constructor(props: ErrorBoundaryProps) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(error: Error): ErrorBoundaryState {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error('Component Error:', error, errorInfo);
    this.props.onError?.(error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return this.props.fallback || (
        <div className="min-h-screen flex items-center justify-center bg-background">
          <div className="text-center">
            <div className="w-16 h-16 bg-destructive/20 rounded-2xl flex items-center justify-center mx-auto mb-4">
              <span className="text-2xl">⚠️</span>
            </div>
            <h2 className="font-semibold mb-2">حدث خطأ في التحميل</h2>
            <p className="text-muted-foreground text-sm mb-4">يرجى إعادة تحميل الصفحة</p>
            <button 
              onClick={() => window.location.reload()}
              className="px-4 py-2 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90"
            >
              إعادة تحميل
            </button>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}

// Loading fallback محسن
function OptimizedLoadingFallback({ message }: { message?: string }) {
  return (
    <div className="min-h-screen flex items-center justify-center bg-background">
      <div className="text-center">
        <div className="relative">
          <div className="w-16 h-16 bg-gradient-to-br from-primary to-chart-2 rounded-2xl animate-pulse mx-auto mb-4"></div>
          <div className="absolute -inset-2 bg-gradient-to-br from-primary/20 to-chart-2/20 rounded-3xl animate-ping"></div>
        </div>
        <p className="text-muted-foreground animate-pulse">
          {message || 'جاري التحميل...'}
        </p>
      </div>
    </div>
  );
}

// Suspense محسن مع Error Boundary
interface OptimizedSuspenseProps {
  children: ReactNode;
  fallback?: ReactNode;
  loadingMessage?: string;
  onError?: (error: Error, errorInfo: ErrorInfo) => void;
}

export function OptimizedSuspense({ 
  children, 
  fallback, 
  loadingMessage,
  onError 
}: OptimizedSuspenseProps) {
  const defaultFallback = fallback || <OptimizedLoadingFallback message={loadingMessage} />;

  return (
    <ErrorBoundary 
      fallback={
        <div className="min-h-screen flex items-center justify-center bg-background">
          <div className="text-center">
            <div className="w-16 h-16 bg-destructive/20 rounded-2xl flex items-center justify-center mx-auto mb-4">
              <span className="text-2xl">⚠️</span>
            </div>
            <h2 className="font-semibold mb-2">فشل في تحميل المكون</h2>
            <p className="text-muted-foreground text-sm">يرجى المحاولة مرة أخرى</p>
          </div>
        </div>
      }
      onError={onError}
    >
      <Suspense fallback={defaultFallback}>
        {children}
      </Suspense>
    </ErrorBoundary>
  );
}

export default OptimizedSuspense;