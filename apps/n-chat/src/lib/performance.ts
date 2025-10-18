// Performance utilities for FlowCanvasAI

export const performanceConfig = {
  // Dynamic import timeouts
  dynamicImportTimeout: 10000, // 10 seconds instead of 30
  
  // Chunk loading optimization
  chunkRetryDelay: 1000,
  maxRetries: 3,
  
  // Memory management
  maxCacheSize: 50,
  cacheTimeout: 300000, // 5 minutes
};

// Optimized dynamic import with retry logic
export async function optimizedImport<T>(
  importFn: () => Promise<T>,
  retries = performanceConfig.maxRetries
): Promise<T> {
  try {
    const timeoutPromise = new Promise<never>((_, reject) => {
      setTimeout(() => reject(new Error('Import timeout')), performanceConfig.dynamicImportTimeout);
    });
    
    return await Promise.race([importFn(), timeoutPromise]);
  } catch (error) {
    if (retries > 0) {
      await new Promise(resolve => setTimeout(resolve, performanceConfig.chunkRetryDelay));
      return optimizedImport(importFn, retries - 1);
    }
    throw error;
  }
}

// Memory cache for components
const componentCache = new Map<string, any>();

export function getCachedComponent(key: string) {
  const cached = componentCache.get(key);
  if (cached && Date.now() - cached.timestamp < performanceConfig.cacheTimeout) {
    return cached.component;
  }
  return null;
}

export function setCachedComponent(key: string, component: any) {
  // Clean old cache entries if limit reached
  if (componentCache.size >= performanceConfig.maxCacheSize) {
    const firstKey = componentCache.keys().next().value;
    componentCache.delete(firstKey);
  }
  
  componentCache.set(key, {
    component,
    timestamp: Date.now()
  });
}

// Performance monitoring
export function measurePerformance(name: string, fn: () => void) {
  const start = performance.now();
  fn();
  const end = performance.now();
  
  if (process.env.NODE_ENV === 'development') {
    console.log(`[Performance] ${name}: ${end - start}ms`);
  }
}

// Debounce utility for performance
export function debounce<T extends (...args: any[]) => any>(
  func: T,
  wait: number
): (...args: Parameters<T>) => void {
  let timeout: NodeJS.Timeout;
  
  return (...args: Parameters<T>) => {
    clearTimeout(timeout);
    timeout = setTimeout(() => func(...args), wait);
  };
}

// Throttle utility for performance
export function throttle<T extends (...args: any[]) => any>(
  func: T,
  limit: number
): (...args: Parameters<T>) => void {
  let inThrottle: boolean;
  
  return (...args: Parameters<T>) => {
    if (!inThrottle) {
      func(...args);
      inThrottle = true;
      setTimeout(() => inThrottle = false, limit);
    }
  };
}

// Intersection Observer for lazy loading
export function createIntersectionObserver(
  callback: (entries: IntersectionObserverEntry[]) => void,
  options?: IntersectionObserverInit
) {
  if (typeof window === 'undefined') return null;
  
  return new IntersectionObserver(callback, {
    threshold: 0.1,
    rootMargin: '50px',
    ...options
  });
}

// Preload critical resources
export function preloadResource(href: string, as: string) {
  if (typeof document === 'undefined') return;
  
  const link = document.createElement('link');
  link.rel = 'preload';
  link.href = href;
  link.as = as;
  document.head.appendChild(link);
}

// Bundle size analyzer (development only)
export function analyzeBundle() {
  if (process.env.NODE_ENV !== 'development') return;
  
  const scripts = Array.from(document.querySelectorAll('script[src]'));
  const totalSize = scripts.reduce((acc, script) => {
    const src = (script as HTMLScriptElement).src;
    return acc + (src.includes('_next/static') ? 1 : 0);
  }, 0);
  
  console.log(`[Bundle Analysis] Found ${totalSize} script chunks`);
}