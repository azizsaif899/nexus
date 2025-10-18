/**
 * Performance Optimization Utilities
 * تحسينات الأداء - حل مشاكل PageSpeed Insights
 */

// ============================================
// 1. Batch DOM Reads/Writes - تقليل Forced Reflows
// ============================================

type DOMOperation = () => void;

class DOMBatcher {
  private readQueue: DOMOperation[] = [];
  private writeQueue: DOMOperation[] = [];
  private scheduled = false;

  /**
   * جدولة قراءة من DOM
   */
  read(operation: DOMOperation): void {
    this.readQueue.push(operation);
    this.schedule();
  }

  /**
   * جدولة كتابة إلى DOM
   */
  write(operation: DOMOperation): void {
    this.writeQueue.push(operation);
    this.schedule();
  }

  /**
   * تنفيذ العمليات في الدورة القادمة
   */
  private schedule(): void {
    if (this.scheduled) return;
    
    this.scheduled = true;
    requestAnimationFrame(() => this.flush());
  }

  /**
   * تنفيذ جميع القراءات ثم الكتابات
   */
  private flush(): void {
    // Execute all reads first
    const reads = this.readQueue.splice(0);
    reads.forEach(read => read());

    // Then execute all writes
    const writes = this.writeQueue.splice(0);
    writes.forEach(write => write());

    this.scheduled = false;
  }

  /**
   * مسح جميع العمليات المعلقة
   */
  clear(): void {
    this.readQueue = [];
    this.writeQueue = [];
    this.scheduled = false;
  }
}

export const domBatcher = new DOMBatcher();

// ============================================
// 2. Debounce & Throttle - تحسين معالجة الأحداث
// ============================================

/**
 * Debounce function - تأجيل التنفيذ حتى توقف الاستدعاءات
 */
export function debounce<T extends (...args: any[]) => any>(
  func: T,
  wait: number
): (...args: Parameters<T>) => void {
  let timeout: ReturnType<typeof setTimeout> | null = null;

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
 * Throttle function - تحديد معدل التنفيذ
 */
export function throttle<T extends (...args: any[]) => any>(
  func: T,
  limit: number
): (...args: Parameters<T>) => void {
  let inThrottle: boolean;
  let lastResult: ReturnType<T>;

  return function executedFunction(...args: Parameters<T>): ReturnType<T> {
    if (!inThrottle) {
      inThrottle = true;
      setTimeout(() => (inThrottle = false), limit);
      lastResult = func(...args);
    }
    return lastResult;
  };
}

// ============================================
// 3. RAF Throttle - تحسين الأنيميشن
// ============================================

/**
 * Request Animation Frame Throttle
 * استخدام للأحداث المتكررة مثل scroll/resize
 */
export function rafThrottle<T extends (...args: any[]) => any>(
  func: T
): (...args: Parameters<T>) => void {
  let rafId: number | null = null;

  return function executedFunction(...args: Parameters<T>) {
    if (rafId !== null) return;

    rafId = requestAnimationFrame(() => {
      func(...args);
      rafId = null;
    });
  };
}

// ============================================
// 4. Intersection Observer - Lazy Loading Helper
// ============================================

interface LazyLoadOptions {
  rootMargin?: string;
  threshold?: number | number[];
  onIntersect: (entry: IntersectionObserverEntry) => void;
  once?: boolean;
}

export function observeIntersection(
  element: Element,
  options: LazyLoadOptions
): () => void {
  const { rootMargin = '50px', threshold = 0.1, onIntersect, once = true } = options;

  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          onIntersect(entry);
          if (once) {
            observer.unobserve(entry.target);
          }
        }
      });
    },
    { rootMargin, threshold }
  );

  observer.observe(element);

  // Cleanup function
  return () => observer.disconnect();
}

// ============================================
// 5. Performance Monitoring
// ============================================

export interface PerformanceMetrics {
  name: string;
  duration: number;
  timestamp: number;
}

class PerformanceMonitor {
  private marks: Map<string, number> = new Map();
  private metrics: PerformanceMetrics[] = [];

  /**
   * بداية قياس الأداء
   */
  start(name: string): void {
    this.marks.set(name, performance.now());
  }

  /**
   * نهاية قياس الأداء
   */
  end(name: string): number | null {
    const startTime = this.marks.get(name);
    if (!startTime) return null;

    const duration = performance.now() - startTime;
    this.marks.delete(name);

    const metric: PerformanceMetrics = {
      name,
      duration,
      timestamp: Date.now(),
    };

    this.metrics.push(metric);

    // Log only in development
    if (import.meta.env.DEV) {
      console.log(`⚡ Performance: ${name} took ${duration.toFixed(2)}ms`);
    }

    return duration;
  }

  /**
   * الحصول على جميع المقاييس
   */
  getMetrics(): PerformanceMetrics[] {
    return [...this.metrics];
  }

  /**
   * مسح جميع المقاييس
   */
  clear(): void {
    this.marks.clear();
    this.metrics = [];
  }

  /**
   * الحصول على متوسط الأداء لعملية معينة
   */
  getAverage(name: string): number {
    const filtered = this.metrics.filter(m => m.name === name);
    if (filtered.length === 0) return 0;

    const sum = filtered.reduce((acc, m) => acc + m.duration, 0);
    return sum / filtered.length;
  }
}

export const performanceMonitor = new PerformanceMonitor();

// ============================================
// 6. Code Splitting Helpers
// ============================================

/**
 * Preload component - تحميل مسبق للمكونات
 */
export function preloadComponent(
  importFn: () => Promise<any>
): () => Promise<any> {
  let modulePromise: Promise<any> | null = null;

  return () => {
    if (!modulePromise) {
      modulePromise = importFn();
    }
    return modulePromise;
  };
}

// ============================================
// 7. Memory Management
// ============================================

/**
 * مراقبة استخدام الذاكرة (Chrome only)
 */
export function getMemoryInfo(): {
  usedJSHeapSize?: number;
  totalJSHeapSize?: number;
  jsHeapSizeLimit?: number;
} | null {
  // @ts-ignore - Chrome specific API
  if (performance.memory) {
    // @ts-ignore
    const { usedJSHeapSize, totalJSHeapSize, jsHeapSizeLimit } = performance.memory;
    return {
      usedJSHeapSize: Math.round(usedJSHeapSize / 1048576), // MB
      totalJSHeapSize: Math.round(totalJSHeapSize / 1048576), // MB
      jsHeapSizeLimit: Math.round(jsHeapSizeLimit / 1048576), // MB
    };
  }
  return null;
}

/**
 * تسجيل معلومات الأداء في Console
 */
export function logPerformanceInfo(): void {
  if (!import.meta.env.DEV) return;

  console.group('📊 Performance Metrics');
  
  // Navigation Timing
  if (performance.timing) {
    const timing = performance.timing;
    const loadTime = timing.loadEventEnd - timing.navigationStart;
    const domReady = timing.domContentLoadedEventEnd - timing.navigationStart;
    const renderTime = timing.domComplete - timing.domLoading;

    console.log(`⏱️ Page Load Time: ${loadTime}ms`);
    console.log(`⏱️ DOM Ready: ${domReady}ms`);
    console.log(`⏱️ Render Time: ${renderTime}ms`);
  }

  // Memory Info
  const memoryInfo = getMemoryInfo();
  if (memoryInfo) {
    console.log(`🧠 Memory Used: ${memoryInfo.usedJSHeapSize} MB / ${memoryInfo.jsHeapSizeLimit} MB`);
  }

  // Custom Metrics
  const metrics = performanceMonitor.getMetrics();
  if (metrics.length > 0) {
    console.table(metrics);
  }

  console.groupEnd();
}

// ============================================
// 8. Font Loading Optimization
// ============================================

/**
 * تحسين تحميل الخطوط
 */
export async function optimizeFontLoading(fontFaces: string[]): Promise<void> {
  if (!('fonts' in document)) return;

  try {
    const loadPromises = fontFaces.map(font => 
      document.fonts.load(font)
    );
    await Promise.all(loadPromises);
    
    if (import.meta.env.DEV) {
      console.log('✅ Fonts loaded successfully');
    }
  } catch (error) {
    console.error('❌ Font loading error:', error);
  }
}

// ============================================
// 9. Resource Hints Helpers
// ============================================

/**
 * إضافة preconnect link
 */
export function addPreconnect(url: string, crossorigin = false): void {
  if (document.querySelector(`link[href="${url}"][rel="preconnect"]`)) {
    return;
  }

  const link = document.createElement('link');
  link.rel = 'preconnect';
  link.href = url;
  if (crossorigin) {
    link.crossOrigin = 'anonymous';
  }
  document.head.appendChild(link);
}

/**
 * إضافة dns-prefetch link
 */
export function addDNSPrefetch(url: string): void {
  if (document.querySelector(`link[href="${url}"][rel="dns-prefetch"]`)) {
    return;
  }

  const link = document.createElement('link');
  link.rel = 'dns-prefetch';
  link.href = url;
  document.head.appendChild(link);
}

/**
 * إضافة preload link
 */
export function addPreload(
  url: string,
  as: string,
  type?: string,
  crossorigin = false
): void {
  if (document.querySelector(`link[href="${url}"][rel="preload"]`)) {
    return;
  }

  const link = document.createElement('link');
  link.rel = 'preload';
  link.href = url;
  link.as = as;
  if (type) link.type = type;
  if (crossorigin) link.crossOrigin = 'anonymous';
  document.head.appendChild(link);
}
