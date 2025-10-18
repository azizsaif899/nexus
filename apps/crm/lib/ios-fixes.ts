/**
 * iOS Comprehensive Fixes
 * إصلاحات شاملة لمشاكل iOS Safari/Chrome
 * 
 * هذا الملف يحتوي على جميع الإصلاحات المطلوبة لضمان عمل التطبيق
 * بشكل كامل على iPhone في Chrome و Safari
 */

/**
 * Fix 1: Prevent iOS Zoom on Input Focus
 * منع التكبير التلقائي عند النقر على Input
 */
export function preventIOSInputZoom() {
  if (typeof document === 'undefined') return;
  
  // Add viewport meta if it doesn't exist
  let viewport = document.querySelector('meta[name="viewport"]');
  if (!viewport) {
    viewport = document.createElement('meta');
    viewport.setAttribute('name', 'viewport');
    document.head.appendChild(viewport);
  }
  
  // Update viewport to prevent zoom
  viewport.setAttribute(
    'content',
    'width=device-width, initial-scale=1.0, maximum-scale=5.0, user-scalable=yes, viewport-fit=cover'
  );
  
  // Ensure all inputs have minimum 16px font-size
  const style = document.createElement('style');
  style.innerHTML = `
    input, textarea, select {
      font-size: max(16px, 1rem) !important;
    }
  `;
  document.head.appendChild(style);
}

/**
 * Fix 2: Handle iOS Keyboard Resize
 * معالجة تغيير حجم الشاشة عند فتح الكيبورد
 */
export function handleIOSKeyboardResize() {
  if (typeof window === 'undefined') return;
  
  let originalHeight = window.innerHeight;
  
  window.addEventListener('resize', () => {
    const currentHeight = window.innerHeight;
    const heightDiff = originalHeight - currentHeight;
    
    // If height decreased by more than 150px, keyboard is probably open
    if (heightDiff > 150) {
      document.body.classList.add('ios-keyboard-open');
      
      // Scroll active input into view
      const activeElement = document.activeElement as HTMLElement;
      if (activeElement && (activeElement.tagName === 'INPUT' || activeElement.tagName === 'TEXTAREA')) {
        setTimeout(() => {
          activeElement.scrollIntoView({ behavior: 'smooth', block: 'center' });
        }, 100);
      }
    } else {
      document.body.classList.remove('ios-keyboard-open');
    }
  });
}

/**
 * Fix 3: Fix Backdrop Filter on Older iOS
 * إصلاح backdrop-filter على إصدارات iOS القديمة
 */
export function fixIOSBackdropFilter() {
  if (typeof window === 'undefined') return;
  
  // Check if backdrop-filter is supported
  const supportsBackdrop = CSS.supports('backdrop-filter', 'blur(10px)') || 
                          CSS.supports('-webkit-backdrop-filter', 'blur(10px)');
  
  if (!supportsBackdrop) {
    // Add fallback class
    document.documentElement.classList.add('no-backdrop-filter');
    
    // Add fallback CSS
    const style = document.createElement('style');
    style.innerHTML = `
      .no-backdrop-filter .glass-light,
      .no-backdrop-filter .glass-medium,
      .no-backdrop-filter .glass-intense {
        background: rgba(255, 255, 255, 0.95) !important;
      }
      
      .no-backdrop-filter.dark .glass-light,
      .no-backdrop-filter.dark .glass-medium,
      .no-backdrop-filter.dark .glass-intense {
        background: rgba(30, 43, 53, 0.95) !important;
      }
    `;
    document.head.appendChild(style);
  }
}

/**
 * Fix 4: Fix Position Fixed with Transform Parent
 * إصلاح position:fixed داخل عناصر بها transform
 */
export function fixIOSFixedPositioning() {
  if (typeof window === 'undefined') return;
  
  // Add CSS to ensure fixed elements work correctly
  const style = document.createElement('style');
  style.innerHTML = `
    /* iOS Fixed Position Fix */
    .fixed-ios {
      position: fixed;
      transform: translateZ(0);
      -webkit-transform: translateZ(0);
      backface-visibility: hidden;
      -webkit-backface-visibility: hidden;
    }
    
    /* Prevent transform from affecting fixed children */
    body > * {
      transform: none !important;
    }
    
    /* Allow transform only on specific elements */
    [data-allow-transform] {
      transform: initial !important;
    }
  `;
  document.head.appendChild(style);
}

/**
 * Fix 5: Optimize Touch Events
 * تحسين أحداث اللمس
 */
export function optimizeIOSTouchEvents() {
  if (typeof window === 'undefined') return;
  
  // Disable 300ms tap delay
  const style = document.createElement('style');
  style.innerHTML = `
    * {
      touch-action: manipulation;
      -webkit-tap-highlight-color: transparent;
      -webkit-touch-callout: none;
    }
    
    /* Allow specific touch behaviors */
    a, button, [role="button"] {
      touch-action: manipulation;
      cursor: pointer;
    }
    
    /* Scrollable areas */
    [data-scroll] {
      -webkit-overflow-scrolling: touch;
      touch-action: pan-y;
    }
  `;
  document.head.appendChild(style);
  
  // Add passive event listeners for better scroll performance
  let supportsPassive = false;
  try {
    const opts = Object.defineProperty({}, 'passive', {
      get: function() {
        supportsPassive = true;
        return true;
      }
    });
    window.addEventListener('test', null as any, opts);
  } catch (e) {}
  
  if (supportsPassive) {
    // Make scroll listeners passive
    const scrollEvents = ['scroll', 'touchstart', 'touchmove', 'touchend'];
    scrollEvents.forEach(event => {
      const original = window.addEventListener;
      (window.addEventListener as any) = function(type: string, listener: any, options: any) {
        if (scrollEvents.includes(type) && typeof options === 'object') {
          options.passive = true;
        }
        return original.call(this, type, listener, options);
      };
    });
  }
}

/**
 * Fix 6: Handle Safe Area Insets
 * معالجة Safe Area للـ Notch
 */
export function handleIOSSafeArea() {
  if (typeof window === 'undefined') return;
  
  // Add CSS variables for safe area
  const style = document.createElement('style');
  style.innerHTML = `
    :root {
      --safe-area-top: env(safe-area-inset-top, 0px);
      --safe-area-right: env(safe-area-inset-right, 0px);
      --safe-area-bottom: env(safe-area-inset-bottom, 0px);
      --safe-area-left: env(safe-area-inset-left, 0px);
    }
    
    /* Apply safe area to body */
    body {
      padding-top: var(--safe-area-top);
      padding-right: var(--safe-area-right);
      padding-bottom: var(--safe-area-bottom);
      padding-left: var(--safe-area-left);
    }
  `;
  document.head.appendChild(style);
}

/**
 * Fix 7: Optimize Font Loading for iOS
 * تحسين تحميل الخطوط على iOS
 */
export function optimizeIOSFontLoading() {
  if (typeof document === 'undefined') return;
  
  // Use font-display: swap for better performance
  const style = document.createElement('style');
  style.innerHTML = `
    @font-face {
      font-family: 'Inter';
      font-display: swap;
    }
    
    @font-face {
      font-family: 'IBM Plex Sans Arabic';
      font-display: swap;
    }
    
    /* Prevent FOIT (Flash of Invisible Text) */
    body {
      font-synthesis: none;
      text-rendering: optimizeLegibility;
      -webkit-font-smoothing: antialiased;
      -moz-osx-font-smoothing: grayscale;
    }
  `;
  document.head.appendChild(style);
}

/**
 * Fix 8: Prevent Rubber Band Scrolling
 * منع الـ Rubber Band Scrolling
 */
export function preventIOSRubberBand() {
  if (typeof window === 'undefined') return;
  
  // Prevent overscroll on body
  document.body.style.overscrollBehavior = 'none';
  
  // Allow scroll only on scrollable elements
  const scrollableElements = document.querySelectorAll('[data-scroll]');
  scrollableElements.forEach((el) => {
    (el as HTMLElement).style.overscrollBehavior = 'contain';
  });
}

/**
 * Fix 9: Fix iOS Standalone Mode (PWA)
 * إصلاح وضع Standalone للـ PWA
 */
export function fixIOSStandaloneMode() {
  if (typeof window === 'undefined') return;
  
  // Check if running as PWA
  const isStandalone = 
    (window.navigator as any).standalone === true ||
    window.matchMedia('(display-mode: standalone)').matches;
  
  if (isStandalone) {
    document.documentElement.classList.add('ios-standalone');
    
    // Add extra padding for status bar
    const style = document.createElement('style');
    style.innerHTML = `
      .ios-standalone body {
        padding-top: max(env(safe-area-inset-top), 20px);
      }
    `;
    document.head.appendChild(style);
  }
}

/**
 * Fix 10: Debug iOS Issues
 * أدوات تشخيص مشاكل iOS
 */
export function debugIOSIssues() {
  if (typeof window === 'undefined') return;
  if (process.env.NODE_ENV !== 'development') return;
  
  // Create debug panel
  const debugPanel = document.createElement('div');
  debugPanel.id = 'ios-debug-panel';
  debugPanel.style.cssText = `
    position: fixed;
    bottom: 0;
    left: 0;
    right: 0;
    background: rgba(0, 0, 0, 0.9);
    color: white;
    padding: 10px;
    font-size: 11px;
    font-family: monospace;
    z-index: 99999;
    max-height: 150px;
    overflow-y: auto;
    display: none;
  `;
  
  document.body.appendChild(debugPanel);
  
  // Toggle debug panel with triple tap
  let tapCount = 0;
  let tapTimer: NodeJS.Timeout;
  
  document.addEventListener('touchend', () => {
    tapCount++;
    clearTimeout(tapTimer);
    
    if (tapCount === 3) {
      debugPanel.style.display = debugPanel.style.display === 'none' ? 'block' : 'none';
      tapCount = 0;
    }
    
    tapTimer = setTimeout(() => {
      tapCount = 0;
    }, 500);
  });
  
  // Log useful info
  const info = {
    'User Agent': navigator.userAgent,
    'Viewport Size': `${window.innerWidth}x${window.innerHeight}`,
    'Device Pixel Ratio': window.devicePixelRatio,
    'Supports Backdrop Filter': CSS.supports('backdrop-filter', 'blur(10px)'),
    'Supports Safe Area': CSS.supports('padding-top: env(safe-area-inset-top)'),
    'Is Standalone': (window.navigator as any).standalone || window.matchMedia('(display-mode: standalone)').matches,
    'Touch Points': navigator.maxTouchPoints,
  };
  
  debugPanel.innerHTML = Object.entries(info)
    .map(([key, value]) => `<div><strong>${key}:</strong> ${value}</div>`)
    .join('');
  
  // Update viewport size on resize
  window.addEventListener('resize', () => {
    const sizeInfo = debugPanel.querySelector('div:nth-child(2)');
    if (sizeInfo) {
      sizeInfo.innerHTML = `<strong>Viewport Size:</strong> ${window.innerWidth}x${window.innerHeight}`;
    }
  });
}

/**
 * Initialize all iOS fixes
 * تهيئة جميع الإصلاحات
 */
export function initIOSFixes() {
  // Run fixes in sequence
  preventIOSInputZoom();
  handleIOSKeyboardResize();
  fixIOSBackdropFilter();
  fixIOSFixedPositioning();
  optimizeIOSTouchEvents();
  handleIOSSafeArea();
  optimizeIOSFontLoading();
  preventIOSRubberBand();
  fixIOSStandaloneMode();
  
  // Debug only in development
  if (process.env.NODE_ENV === 'development') {
    debugIOSIssues();
  }
  
  console.log('[iOS Fixes] All fixes initialized successfully');
}

/**
 * Apply iOS-specific CSS
 * تطبيق CSS خاص بـ iOS
 */
export function applyIOSCSS() {
  if (typeof document === 'undefined') return;
  
  const style = document.createElement('style');
  style.innerHTML = `
    /* iOS Keyboard Open State */
    body.ios-keyboard-open {
      height: 100vh;
      overflow: hidden;
    }
    
    /* iOS Smooth Scrolling */
    * {
      -webkit-overflow-scrolling: touch;
    }
    
    /* iOS Text Selection */
    ::selection {
      background-color: rgba(37, 99, 235, 0.3);
    }
    
    /* iOS Input Styling */
    input, textarea, select {
      -webkit-appearance: none;
      appearance: none;
      border-radius: 8px;
    }
    
    /* iOS Button Styling */
    button {
      -webkit-appearance: none;
      appearance: none;
    }
    
    /* iOS Link Styling */
    a {
      -webkit-tap-highlight-color: transparent;
    }
    
    /* Disable iOS callout on long press */
    img, a {
      -webkit-touch-callout: none;
    }
    
    /* iOS Focus Fix */
    input:focus, textarea:focus {
      font-size: 16px !important;
    }
    
    /* iOS Scroll Performance */
    [data-scroll] {
      -webkit-overflow-scrolling: touch;
      will-change: scroll-position;
    }
    
    /* iOS Safe Area Aware Elements */
    .ios-safe-top {
      padding-top: max(env(safe-area-inset-top), 16px);
    }
    
    .ios-safe-bottom {
      padding-bottom: max(env(safe-area-inset-bottom), 16px);
    }
  `;
  
  document.head.appendChild(style);
}
