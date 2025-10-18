/**
 * iOS Viewport Height Fix
 * حل مشكلة 100vh على iOS Safari/Chrome
 * 
 * المشكلة:
 * - 100vh على iOS لا يأخذ في الاعتبار شريط العنوان المتحرك
 * - يتغير الارتفاع عند فتح/إغلاق شريط العنوان
 * - يسبب قص أجزاء من الواجهة أو فراغات زائدة
 * 
 * الحل:
 * - حساب window.innerHeight الفعلي
 * - تحديث CSS variable --vh
 * - إعادة الحساب عند تغيير حجم النافذة
 * 
 * Usage:
 * import { initIOSViewportFix } from './lib/ios-viewport-fix';
 * initIOSViewportFix(); // في main.tsx
 */

/**
 * تحديث ارتفاع الـ viewport
 */
function updateViewportHeight() {
  // الحصول على الارتفاع الفعلي للنافذة
  const vh = window.innerHeight * 0.01;
  
  // تحديث CSS variable
  document.documentElement.style.setProperty('--vh', `${vh}px`);
  document.documentElement.style.setProperty('--app-height', `${window.innerHeight}px`);
  document.documentElement.style.setProperty('--mobile-vh', `${window.innerHeight}px`);
  
  // Debug log (اختياري - يمكن حذفه في الإنتاج)
  if (process.env.NODE_ENV === 'development') {
    console.log(`[iOS Viewport Fix] Updated: --vh=${vh}px, height=${window.innerHeight}px`);
  }
}

/**
 * التحقق من iOS
 */
function isIOS(): boolean {
  return (
    /iPad|iPhone|iPod/.test(navigator.userAgent) ||
    (navigator.userAgent.includes('Mac') && 'ontouchend' in document)
  );
}

/**
 * التحقق من Safari
 */
function isSafari(): boolean {
  return (
    /^((?!chrome|android).)*safari/i.test(navigator.userAgent) ||
    /iPhone|iPad|iPod/.test(navigator.userAgent)
  );
}

/**
 * تهيئة نظام إصلاح الـ viewport
 */
export function initIOSViewportFix() {
  // تحديث فوري
  updateViewportHeight();
  
  // تحديث عند تغيير الحجم
  window.addEventListener('resize', updateViewportHeight);
  
  // تحديث عند تغيير الاتجاه (portrait/landscape)
  window.addEventListener('orientationchange', () => {
    setTimeout(updateViewportHeight, 100);
  });
  
  // iOS-specific: تحديث عند التمرير (لمعالجة شريط العنوان المتحرك)
  if (isIOS() || isSafari()) {
    let scrollTimeout: NodeJS.Timeout;
    
    window.addEventListener('scroll', () => {
      clearTimeout(scrollTimeout);
      scrollTimeout = setTimeout(updateViewportHeight, 150);
    }, { passive: true });
    
    // تحديث عند تغيير الـ visibility
    document.addEventListener('visibilitychange', () => {
      if (!document.hidden) {
        updateViewportHeight();
      }
    });
  }
  
  // Log للتشخيص
  if (process.env.NODE_ENV === 'development') {
    console.log('[iOS Viewport Fix] Initialized');
    console.log(`[iOS Viewport Fix] Device: iOS=${isIOS()}, Safari=${isSafari()}`);
  }
}

/**
 * تنظيف المستمعات (للاستخدام عند Unmount)
 */
export function cleanupIOSViewportFix() {
  window.removeEventListener('resize', updateViewportHeight);
  window.removeEventListener('orientationchange', updateViewportHeight);
  window.removeEventListener('scroll', updateViewportHeight);
}

/**
 * الحصول على الارتفاع الآمن للاستخدام
 */
export function getSafeViewportHeight(): number {
  return window.innerHeight;
}

/**
 * الحصول على الارتفاع مع safe-area
 */
export function getSafeAreaHeight(): number {
  const computedStyle = getComputedStyle(document.documentElement);
  const safeAreaTop = parseInt(computedStyle.getPropertyValue('env(safe-area-inset-top)') || '0');
  const safeAreaBottom = parseInt(computedStyle.getPropertyValue('env(safe-area-inset-bottom)') || '0');
  
  return window.innerHeight - safeAreaTop - safeAreaBottom;
}

/**
 * Helper: استخدام height آمن في المكونات
 * 
 * Example:
 * const { height } = useViewportHeight();
 * <div style={{ height: `${height}px` }}>...</div>
 */
export function useViewportHeight() {
  const [height, setHeight] = React.useState(window.innerHeight);
  
  React.useEffect(() => {
    const updateHeight = () => setHeight(window.innerHeight);
    
    updateHeight();
    window.addEventListener('resize', updateHeight);
    window.addEventListener('orientationchange', updateHeight);
    
    return () => {
      window.removeEventListener('resize', updateHeight);
      window.removeEventListener('orientationchange', updateHeight);
    };
  }, []);
  
  return { height };
}

// React import للـ hook (اختياري)
import React from 'react';
