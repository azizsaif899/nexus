/**
 * Device Detection Utilities
 * أدوات الكشف عن الجهاز والمتصفح
 * 
 * Usage:
 * import { isIOS, isSafari, isChrome, isMobile } from './lib/device-detection';
 * 
 * if (isIOS()) {
 *   // Apply iOS-specific fixes
 * }
 */

/**
 * التحقق من iOS (iPhone, iPad, iPod)
 */
export function isIOS(): boolean {
  if (typeof window === 'undefined') return false;
  
  return (
    /iPad|iPhone|iPod/.test(navigator.userAgent) ||
    // iPad على iOS 13+ يظهر كـ Mac مع touch support
    (navigator.userAgent.includes('Mac') && 'ontouchend' in document)
  );
}

/**
 * التحقق من Safari
 */
export function isSafari(): boolean {
  if (typeof window === 'undefined') return false;
  
  return (
    /^((?!chrome|android).)*safari/i.test(navigator.userAgent) ||
    /iPhone|iPad|iPod/.test(navigator.userAgent)
  );
}

/**
 * التحقق من Chrome (بما فيه Chrome على iOS)
 */
export function isChrome(): boolean {
  if (typeof window === 'undefined') return false;
  
  return /Chrome/.test(navigator.userAgent) && /Google Inc/.test(navigator.vendor);
}

/**
 * التحقق من Chrome على iOS تحديداً
 * ملاحظة: Chrome على iOS يستخدم WebKit engine نفس Safari
 */
export function isChromeIOS(): boolean {
  if (typeof window === 'undefined') return false;
  
  return /CriOS/.test(navigator.userAgent);
}

/**
 * التحقق من Firefox على iOS
 */
export function isFirefoxIOS(): boolean {
  if (typeof window === 'undefined') return false;
  
  return /FxiOS/.test(navigator.userAgent);
}

/**
 * التحقق من أي متصفح على iOS
 * (كل المتصفحات على iOS تستخدم WebKit)
 */
export function isIOSBrowser(): boolean {
  return isIOS();
}

/**
 * التحقق من iPhone تحديداً
 */
export function isIPhone(): boolean {
  if (typeof window === 'undefined') return false;
  
  return /iPhone/.test(navigator.userAgent);
}

/**
 * التحقق من iPad
 */
export function isIPad(): boolean {
  if (typeof window === 'undefined') return false;
  
  return (
    /iPad/.test(navigator.userAgent) ||
    // iPad على iOS 13+ يظهر كـ Mac مع touch
    (navigator.userAgent.includes('Mac') && 'ontouchend' in document)
  );
}

/**
 * التحقق من جهاز محمول (Mobile/Tablet)
 */
export function isMobile(): boolean {
  if (typeof window === 'undefined') return false;
  
  return /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(
    navigator.userAgent
  );
}

/**
 * التحقق من Tablet
 */
export function isTablet(): boolean {
  if (typeof window === 'undefined') return false;
  
  return /(iPad|tablet|playbook|silk)|(android(?!.*mobi))/i.test(navigator.userAgent);
}

/**
 * التحقق من Desktop
 */
export function isDesktop(): boolean {
  return !isMobile() && !isTablet();
}

/**
 * التحقق من Touch Support
 */
export function isTouchDevice(): boolean {
  if (typeof window === 'undefined') return false;
  
  return (
    'ontouchstart' in window ||
    navigator.maxTouchPoints > 0 ||
    // @ts-ignore - old IE support
    (navigator.msMaxTouchPoints || 0) > 0
  );
}

/**
 * الحصول على نسخة iOS
 */
export function getIOSVersion(): number | null {
  if (!isIOS()) return null;
  
  const match = navigator.userAgent.match(/OS (\d+)_(\d+)_?(\d+)?/);
  if (!match) return null;
  
  return parseInt(match[1], 10);
}

/**
 * التحقق من Standalone Mode (PWA مثبت)
 */
export function isStandalone(): boolean {
  if (typeof window === 'undefined') return false;
  
  return (
    // @ts-ignore - iOS standalone mode
    window.navigator.standalone === true ||
    window.matchMedia('(display-mode: standalone)').matches
  );
}

/**
 * الحصول على معلومات الجهاز
 */
export interface DeviceInfo {
  isIOS: boolean;
  isSafari: boolean;
  isChrome: boolean;
  isChromeIOS: boolean;
  isIPhone: boolean;
  isIPad: boolean;
  isMobile: boolean;
  isTablet: boolean;
  isDesktop: boolean;
  isTouchDevice: boolean;
  isStandalone: boolean;
  iosVersion: number | null;
  userAgent: string;
}

export function getDeviceInfo(): DeviceInfo {
  return {
    isIOS: isIOS(),
    isSafari: isSafari(),
    isChrome: isChrome(),
    isChromeIOS: isChromeIOS(),
    isIPhone: isIPhone(),
    isIPad: isIPad(),
    isMobile: isMobile(),
    isTablet: isTablet(),
    isDesktop: isDesktop(),
    isTouchDevice: isTouchDevice(),
    isStandalone: isStandalone(),
    iosVersion: getIOSVersion(),
    userAgent: typeof window !== 'undefined' ? navigator.userAgent : '',
  };
}

/**
 * التحقق من دعم Backdrop Filter
 */
export function supportsBackdropFilter(): boolean {
  if (typeof window === 'undefined') return false;
  
  return (
    CSS.supports('-webkit-backdrop-filter', 'blur(10px)') ||
    CSS.supports('backdrop-filter', 'blur(10px)')
  );
}

/**
 * التحقق من دعم Safe Area Insets
 */
export function supportsSafeArea(): boolean {
  if (typeof window === 'undefined') return false;
  
  return CSS.supports('padding-top: env(safe-area-inset-top)');
}

/**
 * التحقق من وضع Dark Mode
 */
export function prefersDarkMode(): boolean {
  if (typeof window === 'undefined') return false;
  
  return window.matchMedia('(prefers-color-scheme: dark)').matches;
}

/**
 * التحقق من Reduced Motion
 */
export function prefersReducedMotion(): boolean {
  if (typeof window === 'undefined') return false;
  
  return window.matchMedia('(prefers-reduced-motion: reduce)').matches;
}

/**
 * Log معلومات الجهاز للتشخيص
 */
export function logDeviceInfo() {
  if (process.env.NODE_ENV !== 'development') return;
  
  const info = getDeviceInfo();
  
  console.group('🔍 Device Detection');
  console.table({
    'iOS': info.isIOS,
    'Safari': info.isSafari,
    'Chrome': info.isChrome,
    'Chrome iOS': info.isChromeIOS,
    'iPhone': info.isIPhone,
    'iPad': info.isIPad,
    'Mobile': info.isMobile,
    'Tablet': info.isTablet,
    'Desktop': info.isDesktop,
    'Touch': info.isTouchDevice,
    'PWA': info.isStandalone,
    'iOS Version': info.iosVersion,
  });
  console.log('User Agent:', info.userAgent);
  console.log('Backdrop Filter:', supportsBackdropFilter());
  console.log('Safe Area:', supportsSafeArea());
  console.log('Dark Mode:', prefersDarkMode());
  console.log('Reduced Motion:', prefersReducedMotion());
  console.groupEnd();
}

/**
 * React Hook للحصول على معلومات الجهاز
 */
import { useEffect, useState } from 'react';

export function useDeviceInfo() {
  const [deviceInfo, setDeviceInfo] = useState<DeviceInfo>(() => getDeviceInfo());
  
  useEffect(() => {
    // Update on mount to ensure client-side values
    setDeviceInfo(getDeviceInfo());
    
    // Log in development
    if (process.env.NODE_ENV === 'development') {
      logDeviceInfo();
    }
  }, []);
  
  return deviceInfo;
}

/**
 * React Hook للتحقق من iOS
 */
export function useIsIOS() {
  const [isiOS, setIsIOS] = useState(false);
  
  useEffect(() => {
    setIsIOS(isIOS());
  }, []);
  
  return isiOS;
}

/**
 * React Hook للتحقق من Mobile
 */
export function useIsMobile() {
  const [isMobileDevice, setIsMobileDevice] = useState(false);
  
  useEffect(() => {
    setIsMobileDevice(isMobile());
  }, []);
  
  return isMobileDevice;
}
