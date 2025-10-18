import React from 'react';
import ReactDOM from 'react-dom/client';
import App from '../App';
import '../styles/globals.css';
import { initIOSViewportFix } from '../lib/ios-viewport-fix';
import { logDeviceInfo } from '../lib/device-detection';
import { initIOSFixes, applyIOSCSS } from '../lib/ios-fixes';
import { performanceMonitor, logPerformanceInfo } from '../lib/performance';

// Start performance tracking
performanceMonitor.start('app-init');

// Log device information in development
if (import.meta.env.DEV) {
  logDeviceInfo();
}

// Initialize iOS viewport height fix BEFORE rendering
// حل مشكلة 100vh على iPhone Safari/Chrome
initIOSViewportFix();

// Initialize comprehensive iOS fixes
// تهيئة جميع إصلاحات iOS
initIOSFixes();

// Apply iOS-specific CSS
// تطبيق CSS خاص بـ iOS
applyIOSCSS();

performanceMonitor.end('app-init');

// Start render tracking
performanceMonitor.start('app-render');

// Render the app
ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);

performanceMonitor.end('app-render');

// Log performance metrics after page load
if (typeof window !== 'undefined') {
  window.addEventListener('load', () => {
    // Wait a bit for all resources to settle
    setTimeout(() => {
      if (import.meta.env.DEV) {
        logPerformanceInfo();
      }
    }, 1000);
  });
}
