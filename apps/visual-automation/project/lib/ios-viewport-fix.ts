/**
 * iOS Viewport Height Fix
 * 
 * على iOS، 100vh لا تأخذ في الاعتبار شريط العنوان المتحرك.
 * هذا الـ helper يحسب الارتفاع الفعلي ويُحدّث CSS variable.
 */

export function setupiOSViewportFix() {
  // تحديد إذا كان المستخدم على iOS
  const isIOS = /iPad|iPhone|iPod/.test(navigator.userAgent) && !(window as any).MSStream;
  const isIOSChrome = /CriOS/.test(navigator.userAgent);
  const isIOSSafari = /Safari/.test(navigator.userAgent) && !/Chrome/.test(navigator.userAgent);
  
  if (!isIOS && !isIOSChrome && !isIOSSafari) {
    console.log('✅ Not iOS - no viewport fix needed');
    return;
  }
  
  console.log('📱 iOS detected - applying viewport fix');
  
  // دالة لحساب وتحديث الارتفاع
  function updateViewportHeight() {
    // استخدام window.innerHeight بدلاً من vh
    const vh = window.innerHeight * 0.01;
    document.documentElement.style.setProperty('--vh', `${vh}px`);
    document.documentElement.style.setProperty('--js-height', `${window.innerHeight}px`);
    document.documentElement.style.setProperty('--app-height', `${window.innerHeight}px`);
    
    console.log(`📐 Viewport height updated: ${window.innerHeight}px`);
  }
  
  // تحديث عند التحميل
  updateViewportHeight();
  
  // تحديث عند resize (مثل عند ظهور/اختفاء الكيبورد)
  let resizeTimeout: number;
  window.addEventListener('resize', () => {
    clearTimeout(resizeTimeout);
    resizeTimeout = window.setTimeout(updateViewportHeight, 100);
  });
  
  // تحديث عند تغيير الاتجاه
  window.addEventListener('orientationchange', () => {
    setTimeout(updateViewportHeight, 200);
  });
  
  // تحديث عند scroll (للتعامل مع شريط العنوان المتحرك)
  let scrollTimeout: number;
  let lastHeight = window.innerHeight;
  window.addEventListener('scroll', () => {
    clearTimeout(scrollTimeout);
    scrollTimeout = window.setTimeout(() => {
      const currentHeight = window.innerHeight;
      // فقط نحدّث إذا تغير الارتفاع بشكل ملحوظ
      if (Math.abs(currentHeight - lastHeight) > 10) {
        updateViewportHeight();
        lastHeight = currentHeight;
      }
    }, 50);
  }, { passive: true });
  
  // Fallback: تحديث دوري كل ثانية (للأمان)
  setInterval(() => {
    const currentHeight = window.innerHeight;
    if (Math.abs(currentHeight - lastHeight) > 10) {
      updateViewportHeight();
      lastHeight = currentHeight;
    }
  }, 1000);
  
  return {
    updateViewportHeight,
    isIOS,
    isIOSChrome,
    isIOSSafari
  };
}

/**
 * Fix для input zoom على iOS
 */
export function preventIOSInputZoom() {
  const isIOS = /iPad|iPhone|iPod/.test(navigator.userAgent);
  
  if (!isIOS) return;
  
  // منع zoom على inputs بجعل font-size 16px minimum
  const style = document.createElement('style');
  style.textContent = `
    input, textarea, select {
      font-size: 16px !important;
    }
  `;
  document.head.appendChild(style);
  
  console.log('🔒 iOS input zoom prevented');
}

/**
 * Fix لـ 100vh في CSS
 */
export function apply100vhFix() {
  // استخدام CSS variables بدلاً من 100vh
  const style = document.createElement('style');
  style.textContent = `
    .h-screen,
    .min-h-screen,
    [style*="height: 100vh"] {
      height: var(--app-height, 100vh) !important;
      min-height: var(--app-height, 100vh) !important;
    }
  `;
  document.head.appendChild(style);
  
  console.log('📏 100vh fix applied');
}

/**
 * تشغيل جميع الإصلاحات
 */
export function applyAllIOSFixes() {
  console.log('🚀 Applying all iOS fixes...');
  
  const viewportFix = setupiOSViewportFix();
  preventIOSInputZoom();
  apply100vhFix();
  
  console.log('✅ All iOS fixes applied successfully');
  
  return viewportFix;
}

/**
 * iOS Debug Panel
 */
export function showIOSDebugPanel() {
  const isIOS = /iPad|iPhone|iPod/.test(navigator.userAgent);
  
  if (!isIOS) return;
  
  const panel = document.createElement('div');
  panel.className = 'ios-debug';
  panel.style.cssText = `
    position: fixed;
    bottom: 20px;
    right: 20px;
    background: rgba(0, 0, 0, 0.9);
    color: white;
    padding: 12px;
    border-radius: 8px;
    font-size: 11px;
    font-family: monospace;
    z-index: 99999;
    max-width: 200px;
    line-height: 1.4;
  `;
  
  function updatePanel() {
    const info = {
      'Inner Height': `${window.innerHeight}px`,
      'Screen Height': `${window.screen.height}px`,
      'Device Pixel Ratio': window.devicePixelRatio,
      'Orientation': window.screen.orientation?.type || 'unknown',
      'User Agent': navigator.userAgent.split(' ').slice(-2).join(' ')
    };
    
    panel.innerHTML = '<strong>📱 iOS Debug</strong><br/>' + 
      Object.entries(info)
        .map(([key, value]) => `${key}: ${value}`)
        .join('<br/>');
  }
  
  updatePanel();
  document.body.appendChild(panel);
  
  // تحديث عند resize
  window.addEventListener('resize', updatePanel);
  window.addEventListener('orientationchange', () => setTimeout(updatePanel, 200));
  
  console.log('🐛 iOS debug panel shown');
}
