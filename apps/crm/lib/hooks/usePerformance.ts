/**
 * Performance Optimization Hooks
 * React hooks لتحسين الأداء
 */

import { useEffect, useCallback, useRef, useState } from 'react';
import { 
  debounce, 
  throttle, 
  rafThrottle,
  performanceMonitor,
  observeIntersection 
} from '../performance';

// ============================================
// 1. useDebounce Hook
// ============================================

/**
 * Hook لتأخير تحديث القيمة
 * مفيد للبحث والـ autocomplete
 */
export function useDebounce<T>(value: T, delay: number): T {
  const [debouncedValue, setDebouncedValue] = useState<T>(value);

  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedValue(value);
    }, delay);

    return () => {
      clearTimeout(handler);
    };
  }, [value, delay]);

  return debouncedValue;
}

// ============================================
// 2. useThrottle Hook
// ============================================

/**
 * Hook لتحديد معدل استدعاء الدالة
 * مفيد للـ scroll و resize events
 */
export function useThrottle<T extends (...args: any[]) => any>(
  callback: T,
  delay: number
): T {
  const throttledFn = useRef<T | null>(null);

  if (!throttledFn.current) {
    throttledFn.current = throttle(callback, delay) as T;
  }

  return throttledFn.current;
}

// ============================================
// 3. useDebounceCallback Hook
// ============================================

/**
 * Hook لإنشاء callback مع debounce
 */
export function useDebounceCallback<T extends (...args: any[]) => any>(
  callback: T,
  delay: number
): T {
  const debouncedFn = useRef<T | null>(null);

  if (!debouncedFn.current) {
    debouncedFn.current = debounce(callback, delay) as T;
  }

  useEffect(() => {
    return () => {
      // Cleanup on unmount
      debouncedFn.current = null;
    };
  }, []);

  return debouncedFn.current;
}

// ============================================
// 4. useRAFThrottle Hook
// ============================================

/**
 * Hook لتحديد استدعاء الدالة بـ requestAnimationFrame
 * الأفضل للأنيميشن والتحديثات المرئية
 */
export function useRAFThrottle<T extends (...args: any[]) => any>(
  callback: T
): T {
  const rafFn = useRef<T | null>(null);

  if (!rafFn.current) {
    rafFn.current = rafThrottle(callback) as T;
  }

  return rafFn.current;
}

// ============================================
// 5. usePerformanceMonitor Hook
// ============================================

/**
 * Hook لمراقبة أداء المكون
 */
export function usePerformanceMonitor(componentName: string) {
  useEffect(() => {
    performanceMonitor.start(`mount-${componentName}`);

    return () => {
      performanceMonitor.end(`mount-${componentName}`);
    };
  }, [componentName]);

  const trackOperation = useCallback((operationName: string, fn: () => void) => {
    const fullName = `${componentName}-${operationName}`;
    performanceMonitor.start(fullName);
    fn();
    performanceMonitor.end(fullName);
  }, [componentName]);

  return { trackOperation };
}

// ============================================
// 6. useIntersectionObserver Hook
// ============================================

interface UseIntersectionObserverOptions {
  rootMargin?: string;
  threshold?: number | number[];
  once?: boolean;
}

/**
 * Hook للـ Intersection Observer
 * مفيد للـ lazy loading والـ infinite scroll
 */
export function useIntersectionObserver(
  elementRef: React.RefObject<Element>,
  callback: (entry: IntersectionObserverEntry) => void,
  options: UseIntersectionObserverOptions = {}
): void {
  useEffect(() => {
    const element = elementRef.current;
    if (!element) return;

    const cleanup = observeIntersection(element, {
      ...options,
      onIntersect: callback,
    });

    return cleanup;
  }, [elementRef, callback, options]);
}

// ============================================
// 7. useWindowSize Hook (Optimized)
// ============================================

interface WindowSize {
  width: number;
  height: number;
}

/**
 * Hook للحصول على حجم النافذة مع throttle
 */
export function useWindowSize(throttleMs = 100): WindowSize {
  const [windowSize, setWindowSize] = useState<WindowSize>({
    width: typeof window !== 'undefined' ? window.innerWidth : 0,
    height: typeof window !== 'undefined' ? window.innerHeight : 0,
  });

  useEffect(() => {
    const handleResize = throttle(() => {
      setWindowSize({
        width: window.innerWidth,
        height: window.innerHeight,
      });
    }, throttleMs);

    window.addEventListener('resize', handleResize);
    
    // Initial call
    handleResize();

    return () => {
      window.removeEventListener('resize', handleResize);
    };
  }, [throttleMs]);

  return windowSize;
}

// ============================================
// 8. useScrollPosition Hook (Optimized)
// ============================================

interface ScrollPosition {
  x: number;
  y: number;
}

/**
 * Hook للحصول على موضع التمرير مع RAF throttle
 */
export function useScrollPosition(): ScrollPosition {
  const [scrollPosition, setScrollPosition] = useState<ScrollPosition>({
    x: typeof window !== 'undefined' ? window.scrollX : 0,
    y: typeof window !== 'undefined' ? window.scrollY : 0,
  });

  useEffect(() => {
    const handleScroll = rafThrottle(() => {
      setScrollPosition({
        x: window.scrollX,
        y: window.scrollY,
      });
    });

    window.addEventListener('scroll', handleScroll, { passive: true });

    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, []);

  return scrollPosition;
}

// ============================================
// 9. useIsVisible Hook
// ============================================

/**
 * Hook للتحقق من ظهور العنصر في viewport
 * مفيد للـ lazy loading
 */
export function useIsVisible(
  elementRef: React.RefObject<Element>,
  options: UseIntersectionObserverOptions = {}
): boolean {
  const [isVisible, setIsVisible] = useState(false);

  useIntersectionObserver(
    elementRef,
    (entry) => {
      setIsVisible(entry.isIntersecting);
    },
    { threshold: 0.1, once: false, ...options }
  );

  return isVisible;
}

// ============================================
// 10. useIdleCallback Hook
// ============================================

/**
 * Hook لتنفيذ callback في وقت الخمول
 * مفيد للعمليات غير الحرجة
 */
export function useIdleCallback(
  callback: IdleRequestCallback,
  options?: IdleRequestOptions
): void {
  useEffect(() => {
    if (!('requestIdleCallback' in window)) {
      // Fallback to setTimeout
      const timeoutId = setTimeout(callback as any, 1);
      return () => clearTimeout(timeoutId);
    }

    const handle = requestIdleCallback(callback, options);

    return () => {
      cancelIdleCallback(handle);
    };
  }, [callback, options]);
}

// ============================================
// 11. usePrefetch Hook
// ============================================

/**
 * Hook لتحميل مسبق للموارد
 */
export function usePrefetch(urls: string[]): void {
  useEffect(() => {
    const links: HTMLLinkElement[] = [];

    urls.forEach(url => {
      const link = document.createElement('link');
      link.rel = 'prefetch';
      link.href = url;
      document.head.appendChild(link);
      links.push(link);
    });

    return () => {
      links.forEach(link => {
        document.head.removeChild(link);
      });
    };
  }, [urls]);
}

// ============================================
// 12. useMediaQuery Hook (Optimized)
// ============================================

/**
 * Hook للـ media queries مع استماع محسّن
 */
export function useMediaQuery(query: string): boolean {
  const [matches, setMatches] = useState(() => {
    if (typeof window !== 'undefined') {
      return window.matchMedia(query).matches;
    }
    return false;
  });

  useEffect(() => {
    const mediaQuery = window.matchMedia(query);
    
    const handleChange = (e: MediaQueryListEvent) => {
      setMatches(e.matches);
    };

    // Modern API
    if (mediaQuery.addEventListener) {
      mediaQuery.addEventListener('change', handleChange);
      return () => mediaQuery.removeEventListener('change', handleChange);
    } 
    // Legacy API
    else {
      mediaQuery.addListener(handleChange);
      return () => mediaQuery.removeListener(handleChange);
    }
  }, [query]);

  return matches;
}

// ============================================
// 13. usePrefersDarkMode Hook
// ============================================

/**
 * Hook للتحقق من تفضيل المستخدم للوضع الداكن
 */
export function usePrefersDarkMode(): boolean {
  return useMediaQuery('(prefers-color-scheme: dark)');
}

// ============================================
// 14. usePrefersReducedMotion Hook
// ============================================

/**
 * Hook للتحقق من تفضيل المستخدم لتقليل الحركة
 */
export function usePrefersReducedMotion(): boolean {
  return useMediaQuery('(prefers-reduced-motion: reduce)');
}
