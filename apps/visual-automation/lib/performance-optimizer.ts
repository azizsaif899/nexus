/**
 * Performance Optimizer
 * تحسين الأداء ومنع Forced Reflow
 */

import React from 'react';

// ===== 1. تجنب Forced Reflow =====

/**
 * قراءة خصائص DOM بشكل دفعي لتجنب layout thrashing
 */
export function batchReadDOM<T>(elements: Element[], reader: (el: Element) => T): T[] {
  // قراءة جميع القيم دفعة واحدة (Read Phase)
  return elements.map(reader);
}

/**
 * كتابة تعديلات DOM بشكل دفعي
 */
export function batchWriteDOM(elements: Element[], writer: (el: Element) => void): void {
  // استخدام requestAnimationFrame للكتابة (Write Phase)
  requestAnimationFrame(() => {
    elements.forEach(writer);
  });
}

/**
 * قراءة ثم كتابة بشكل منظم (Read -> Write pattern)
 */
export function readThenWrite<T>(
  elements: Element[],
  reader: (el: Element) => T,
  writer: (el: Element, data: T) => void
): void {
  // Phase 1: Read
  const data = batchReadDOM(elements, reader);
  
  // Phase 2: Write
  batchWriteDOM(elements, (el, index) => {
    writer(el, data[index]);
  });
}

// ===== 2. Debounce & Throttle =====

/**
 * Debounce - تأخير التنفيذ حتى يتوقف الحدث
 */
export function debounce<T extends (...args: any[]) => any>(
  func: T,
  wait: number
): (...args: Parameters<T>) => void {
  let timeout: NodeJS.Timeout | null = null;
  
  return function executedFunction(...args: Parameters<T>) {
    const later = () => {
      timeout = null;
      func(...args);
    };
    
    if (timeout) clearTimeout(timeout);
    timeout = setTimeout(later, wait);
  };
}

/**
 * Throttle - تحديد معدل التنفيذ
 */
export function throttle<T extends (...args: any[]) => any>(
  func: T,
  limit: number
): (...args: Parameters<T>) => void {
  let inThrottle: boolean = false;
  
  return function executedFunction(...args: Parameters<T>) {
    if (!inThrottle) {
      func(...args);
      inThrottle = true;
      setTimeout(() => (inThrottle = false), limit);
    }
  };
}

// ===== 3. Lazy Loading =====

/**
 * تحميل كسول للصور
 */
export function lazyLoadImages(selector: string = 'img[data-src]'): void {
  if ('IntersectionObserver' in window) {
    const imageObserver = new IntersectionObserver((entries, observer) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          const img = entry.target as HTMLImageElement;
          const src = img.dataset.src;
          if (src) {
            img.src = src;
            img.removeAttribute('data-src');
            observer.unobserve(img);
          }
        }
      });
    });
    
    document.querySelectorAll(selector).forEach(img => imageObserver.observe(img));
  }
}

/**
 * تحميل كسول للمكونات
 */
export function lazyLoadComponent<T>(
  importFunc: () => Promise<{ default: T }>,
  fallback?: React.ReactNode
): React.LazyExoticComponent<React.ComponentType<any>> {
  return React.lazy(importFunc);
}

// ===== 4. Memory Management =====

/**
 * تنظيف الذاكرة
 */
export function cleanupMemory(): void {
  // إزالة event listeners غير المستخدمة
  // تنظيف caches
  if ('caches' in window) {
    caches.keys().then(names => {
      names.forEach(name => {
        if (name.startsWith('old-')) {
          caches.delete(name);
        }
      });
    });
  }
}

/**
 * WeakMap cache لتجنب memory leaks
 */
export function createWeakCache<K extends object, V>(): {
  get: (key: K) => V | undefined;
  set: (key: K, value: V) => void;
  has: (key: K) => boolean;
} {
  const cache = new WeakMap<K, V>();
  
  return {
    get: (key: K) => cache.get(key),
    set: (key: K, value: V) => cache.set(key, value),
    has: (key: K) => cache.has(key)
  };
}

// ===== 5. Bundle Size Optimization =====

/**
 * تحميل ديناميكي للمكتبات الكبيرة
 */
export async function loadHeavyLibrary<T>(
  libraryName: string,
  loader: () => Promise<T>
): Promise<T> {
  console.log(`Loading heavy library: ${libraryName}`);
  const startTime = performance.now();
  
  const library = await loader();
  
  const loadTime = performance.now() - startTime;
  console.log(`${libraryName} loaded in ${loadTime.toFixed(2)}ms`);
  
  return library;
}

// ===== 6. Performance Monitoring =====

/**
 * قياس أداء دالة
 */
export function measurePerformance<T extends (...args: any[]) => any>(
  name: string,
  func: T
): T {
  return ((...args: Parameters<T>) => {
    const start = performance.now();
    const result = func(...args);
    const end = performance.now();
    
    console.log(`[Performance] ${name}: ${(end - start).toFixed(2)}ms`);
    
    return result;
  }) as T;
}

/**
 * مراقبة Long Tasks
 */
export function monitorLongTasks(threshold: number = 50): void {
  if ('PerformanceObserver' in window) {
    try {
      const observer = new PerformanceObserver((list) => {
        for (const entry of list.getEntries()) {
          if (entry.duration > threshold) {
            console.warn(`[Long Task] ${entry.name}: ${entry.duration.toFixed(2)}ms`);
          }
        }
      });
      
      observer.observe({ entryTypes: ['longtask', 'measure'] });
    } catch (e) {
      // longtask may not be supported
    }
  }
}

// ===== 7. React Performance Helpers =====

/**
 * استخدام هذه الدالة لمنع re-renders غير ضرو��ية
 */
export function shallowEqual(obj1: any, obj2: any): boolean {
  if (obj1 === obj2) return true;
  
  if (typeof obj1 !== 'object' || obj1 === null ||
      typeof obj2 !== 'object' || obj2 === null) {
    return false;
  }
  
  const keys1 = Object.keys(obj1);
  const keys2 = Object.keys(obj2);
  
  if (keys1.length !== keys2.length) return false;
  
  for (const key of keys1) {
    if (obj1[key] !== obj2[key]) return false;
  }
  
  return true;
}

/**
 * مقارنة Props للـ React.memo
 */
export function arePropsEqual<P>(prevProps: P, nextProps: P): boolean {
  return shallowEqual(prevProps, nextProps);
}

// ===== 8. Animation Performance =====

/**
 * استخدام transform بدلاً من top/left للأنيميشن
 */
export function optimizedAnimate(
  element: HTMLElement,
  properties: {
    x?: number;
    y?: number;
    scale?: number;
    rotate?: number;
  },
  duration: number = 300
): void {
  const transforms: string[] = [];
  
  if (properties.x !== undefined || properties.y !== undefined) {
    const x = properties.x || 0;
    const y = properties.y || 0;
    transforms.push(`translate(${x}px, ${y}px)`);
  }
  
  if (properties.scale !== undefined) {
    transforms.push(`scale(${properties.scale})`);
  }
  
  if (properties.rotate !== undefined) {
    transforms.push(`rotate(${properties.rotate}deg)`);
  }
  
  element.style.transform = transforms.join(' ');
  element.style.transition = `transform ${duration}ms ease-out`;
}

// ===== 9. Code Splitting Helpers =====

/**
 * تقسيم الكود بناءً على المسار
 */
export function getRouteBasedChunks(): {
  [key: string]: () => Promise<any>;
} {
  return {
    dashboard: () => import('../components/AdvancedDashboard'),
    analytics: () => import('../components/AdvancedAnalytics'),
    templates: () => import('../components/templates/TemplatesLibrary'),
    // يمكن إضافة المزيد
  };
}

// ===== 10. Performance Tips =====

/**
 * نصائح الأداء التي يجب اتباعها:
 * 
 * 1. تجنب Layout Thrashing:
 *    - اقرأ DOM properties دفعة واحدة
 *    - اكتب DOM changes دفعة واحدة
 *    - لا تخلط بين القراءة والكتابة
 * 
 * 2. استخدم CSS Transforms:
 *    - transform بدلاً من top/left
 *    - opacity بدلاً من visibility
 *    - will-change للعناصر التي ستتحرك
 * 
 * 3. Optimize Re-renders:
 *    - React.memo للمكونات
 *    - useMemo للحسابات الثقيلة
 *    - useCallback للدوال
 * 
 * 4. Code Splitting:
 *    - React.lazy للمكونات الكبيرة
 *    - Dynamic imports للمكتبات
 * 
 * 5. Image Optimization:
 *    - Lazy loading للصور
 *    - WebP format
 *    - Responsive images
 * 
 * 6. Bundle Size:
 *    - Tree shaking
 *    - Dynamic imports
 *    - Remove unused dependencies
 */

export const performanceTips = {
  // CSS Properties that trigger layout (avoid!)
  layoutTriggers: [
    'width', 'height',
    'margin', 'padding',
    'border', 'top', 'left', 'right', 'bottom',
    'font-size', 'line-height'
  ],
  
  // CSS Properties that are fast (use these!)
  fastProperties: [
    'transform', 'opacity',
    'filter', 'backdrop-filter'
  ],
  
  // React optimization checklist
  reactOptimizations: [
    'Use React.memo for expensive components',
    'Use useMemo for heavy calculations',
    'Use useCallback for event handlers',
    'Avoid inline functions in JSX',
    'Use key prop correctly in lists',
    'Avoid array index as key',
    'Use React.lazy for code splitting'
  ]
};

// تصدير كل شيء
export default {
  batchReadDOM,
  batchWriteDOM,
  readThenWrite,
  debounce,
  throttle,
  lazyLoadImages,
  cleanupMemory,
  createWeakCache,
  loadHeavyLibrary,
  measurePerformance,
  monitorLongTasks,
  shallowEqual,
  arePropsEqual,
  optimizedAnimate,
  getRouteBasedChunks,
  performanceTips
};
