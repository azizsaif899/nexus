// Module detection and polyfill
if (!('noModule' in HTMLScriptElement.prototype)) {
  console.warn('Browser does not support ES modules, falling back...');
}

import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import '../styles/globals.css';
import './lib/firebase-config';
import { ErrorBoundary, setupGlobalErrorHandlers } from './components/ErrorBoundary';

// Setup global error handlers first
setupGlobalErrorHandlers();

// Performance monitoring
const startTime = performance.now();

// Render the app
const root = ReactDOM.createRoot(document.getElementById('root')!);

root.render(
  <React.StrictMode>
    <ErrorBoundary>
      <App />
    </ErrorBoundary>
  </React.StrictMode>
);

// Log performance metrics
if (import.meta.env.DEV) {
  window.addEventListener('load', () => {
    const loadTime = performance.now() - startTime;
    console.log(`🚀 App loaded in ${loadTime.toFixed(2)}ms`);
    
    // Log other metrics
    if ('getEntriesByType' in performance) {
      const navigation = performance.getEntriesByType('navigation')[0] as PerformanceNavigationTiming;
      console.log('📊 Navigation metrics:', {
        domContentLoaded: navigation.domContentLoadedEventEnd - navigation.domContentLoadedEventStart,
        loadComplete: navigation.loadEventEnd - navigation.loadEventStart,
        responseTime: navigation.responseEnd - navigation.requestStart,
      });
    }
  });
}


