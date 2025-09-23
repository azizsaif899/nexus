import React, { Component, ErrorInfo, ReactNode } from "react";

interface Props {
  children: ReactNode;
  fallback?: ReactNode;
  onError?: (error: Error, errorInfo: ErrorInfo) => void;
}

interface State {
  hasError: boolean;
  error?: Error;
  errorInfo?: ErrorInfo;
}

export class ErrorBoundary extends Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error("ErrorBoundary caught an error:", error, errorInfo);

    this.setState({
      error,
      errorInfo,
    });

    // استدعاء callback إذا تم توفيره
    if (this.props.onError) {
      this.props.onError(error, errorInfo);
    }

    // يمكن إرسال الخطأ إلى خدمة التتبع (مثل Sentry)
    // TODO: إضافة تكامل مع خدمة التتبع
  }

  handleRetry = () => {
    this.setState({ hasError: false, error: undefined, errorInfo: undefined });
  };

  render() {
    if (this.state.hasError) {
      // استخدام fallback مخصص إذا تم توفيره
      if (this.props.fallback) {
        return this.props.fallback;
      }

      // Fallback افتراضي
      return (
        <div className="min-h-screen flex items-center justify-center bg-gray-50">
          <div className="max-w-md w-full bg-white rounded-lg shadow-lg p-6 text-center">
            <div className="mb-4">
              <svg
                className="mx-auto h-12 w-12 text-red-500"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L4.082 16.5c-.77.833.192 2.5 1.732 2.5z"
                />
              </svg>
            </div>

            <h2 className="text-xl font-semibold text-gray-900 mb-2">
              عذراً، حدث خطأ غير متوقع
            </h2>

            <p className="text-gray-600 mb-6">
              حدث خطأ في التطبيق. يرجى المحاولة مرة أخرى أو الاتصال بالدعم الفني
              إذا استمر الخطأ.
            </p>

            <div className="space-y-3">
              <button
                onClick={this.handleRetry}
                className="w-full bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-colors"
              >
                إعادة المحاولة
              </button>

              <button
                onClick={() => window.location.reload()}
                className="w-full bg-gray-600 text-white py-2 px-4 rounded-md hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2 transition-colors"
              >
                إعادة تحميل الصفحة
              </button>
            </div>

            {/* تفاصيل الخطأ في وضع التطوير */}
            {process.env.NODE_ENV === "development" && this.state.error && (
              <details className="mt-6 text-left">
                <summary className="cursor-pointer text-sm text-gray-500 hover:text-gray-700">
                  تفاصيل الخطأ (للمطورين)
                </summary>
                <pre className="mt-2 text-xs bg-gray-100 p-3 rounded overflow-auto max-h-40">
                  {this.state.error.toString()}
                  {this.state.errorInfo?.componentStack}
                </pre>
              </details>
            )}
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}

// Hook لاستخدام Error Boundary في مكونات وظيفية
export const useErrorHandler = () => {
  return (error: Error, errorInfo?: { componentStack?: string }) => {
    console.error("Error caught by useErrorHandler:", error, errorInfo);

    // يمكن إرسال الخطأ إلى خدمة خارجية
    // TODO: إضافة تكامل مع خدمة التتبع
  };
};

// مكون أصغر للأخطاء المحلية
export const ErrorFallback: React.FC<{
  error?: Error;
  resetError?: () => void;
  message?: string;
}> = ({ error, resetError, message = "حدث خطأ غير متوقع" }) => (
  <div className="p-4 bg-red-50 border border-red-200 rounded-md">
    <div className="flex">
      <div className="flex-shrink-0">
        <svg
          className="h-5 w-5 text-red-400"
          viewBox="0 0 20 20"
          fill="currentColor"
        >
          <path
            fillRule="evenodd"
            d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z"
            clipRule="evenodd"
          />
        </svg>
      </div>
      <div className="mr-3 flex-1">
        <p className="text-sm text-red-800">{message}</p>
        {error && process.env.NODE_ENV === "development" && (
          <p className="text-xs text-red-600 mt-1">{error.message}</p>
        )}
      </div>
      {resetError && (
        <button
          onClick={resetError}
          className="text-red-800 hover:text-red-600 text-sm underline"
        >
          إعادة المحاولة
        </button>
      )}
    </div>
  </div>
);
