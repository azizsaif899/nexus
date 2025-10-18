import { Component, ErrorInfo, ReactNode } from 'react';

interface Props {
  children: ReactNode;
  fallback?: ReactNode;
}

interface State {
  hasError: boolean;
  error?: Error;
}

export class ErrorBoundary extends Component<Props, State> {
  public state: State = {
    hasError: false
  };

  public static getDerivedStateFromError(error: Error): State {
    // Update state so the next render will show the fallback UI
    return { hasError: true, error };
  }

  public componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    // Only log in development to avoid console spam
    if (import.meta.env.DEV) {
      console.error('ErrorBoundary caught an error:', error, errorInfo);
    }
  }

  public render() {
    if (this.state.hasError) {
      // Fallback UI
      return this.props.fallback || (
        <div className="min-h-screen flex items-center justify-center bg-background text-foreground">
          <div className="text-center p-8">
            <div className="w-16 h-16 bg-gradient-to-br from-cyan-400 to-blue-600 rounded-lg flex items-center justify-center mx-auto mb-4">
              <div className="w-8 h-8 bg-background rounded-sm"></div>
            </div>
            <h1 className="text-2xl font-bold mb-2">Nexus AI</h1>
            <p className="text-muted-foreground mb-4">
              Something went wrong. Please refresh the page.
            </p>
            <button
              onClick={() => window.location.reload()}
              className="px-4 py-2 bg-primary text-primary-foreground rounded-md hover:bg-primary/90 transition-colors"
            >
              Refresh Page
            </button>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}

// Global error handler for unhandled promises
export const setupGlobalErrorHandlers = () => {
  // Handle unhandled promise rejections
  window.addEventListener('unhandledrejection', (event) => {
    // Prevent console error for Firebase App Check failures
    if (event.reason && typeof event.reason === 'string' && 
        (event.reason.includes('Firebase App Check') || 
         event.reason.includes('reCAPTCHA') ||
         event.reason === null)) {
      event.preventDefault();
      // Optionally log in development only
      if (import.meta.env.DEV) {
        console.info('Handled promise rejection:', event.reason);
      }
    }
  });

  // Handle uncaught errors
  window.addEventListener('error', (event) => {
    // Prevent console spam for known harmless errors
    if (event.error && (
        event.error.message?.includes('reCAPTCHA') ||
        event.error.message?.includes('Firebase App Check') ||
        event.error.message?.includes('MIME type')
      )) {
      event.preventDefault();
      if (import.meta.env.DEV) {
        console.info('Handled error:', event.error.message);
      }
    }
  });
};