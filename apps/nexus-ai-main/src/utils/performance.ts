// Performance optimization utilities
export class PerformanceOptimizer {
    private static instance: PerformanceOptimizer;
    private resizeObserver: ResizeObserver | null = null;
    private rafId: number | null = null;
    private pendingUpdates: (() => void)[] = [];

    static getInstance(): PerformanceOptimizer {
        if (!PerformanceOptimizer.instance) {
            PerformanceOptimizer.instance = new PerformanceOptimizer();
        }
        return PerformanceOptimizer.instance;
    }

    // Batch DOM reads and writes to prevent forced reflows
    batchDOMUpdates(updateFn: () => void): void {
        this.pendingUpdates.push(updateFn);

        if (this.rafId === null) {
            this.rafId = requestAnimationFrame(() => {
                // Execute all pending updates in a single frame
                this.pendingUpdates.forEach(fn => fn());
                this.pendingUpdates = [];
                this.rafId = null;
            });
        }
    }

    // Debounced resize handler to prevent excessive reflows
    onResize(element: Element, callback: (entry: ResizeObserverEntry) => void): () => void {
        if (!this.resizeObserver) {
            this.resizeObserver = new ResizeObserver((entries) => {
                // Batch all resize callbacks
                this.batchDOMUpdates(() => {
                    entries.forEach(entry => {
                        const callback = (entry.target as any).__resizeCallback;
                        if (callback) callback(entry);
                    });
                });
            });
        }

        (element as any).__resizeCallback = callback;
        this.resizeObserver.observe(element);

        // Return cleanup function
        return () => {
            if (this.resizeObserver) {
                this.resizeObserver.unobserve(element);
                delete (element as any).__resizeCallback;
            }
        };
    }

    // Optimize scroll events to prevent forced reflows
    throttleScroll(callback: () => void, delay: number = 16): () => void {
        let timeoutId: NodeJS.Timeout | null = null;
        let lastExecution = 0;

        const throttledCallback = () => {
            const now = Date.now();

            if (now - lastExecution >= delay) {
                callback();
                lastExecution = now;
            } else if (!timeoutId) {
                timeoutId = setTimeout(() => {
                    callback();
                    lastExecution = Date.now();
                    timeoutId = null;
                }, delay - (now - lastExecution));
            }
        };

        return throttledCallback;
    }

    // Cleanup resources
    destroy(): void {
        if (this.rafId) {
            cancelAnimationFrame(this.rafId);
            this.rafId = null;
        }

        if (this.resizeObserver) {
            this.resizeObserver.disconnect();
            this.resizeObserver = null;
        }

        this.pendingUpdates = [];
    }
}

// Hook for React components
export const usePerformanceOptimizer = () => {
    return PerformanceOptimizer.getInstance();
};

// Utility to measure performance with proper error handling
export const measurePerformance = (name: string, fn: () => void): void => {
    try {
        if (typeof performance !== 'undefined' && performance.mark) {
            performance.mark(`${name}-start`);
            fn();
            performance.mark(`${name}-end`);
            performance.measure(name, `${name}-start`, `${name}-end`);

            // Log only in development
            if (import.meta.env.DEV) {
                const measure = performance.getEntriesByName(name, 'measure')[0];
                if (measure) {
                    console.log(`⚡ ${name}: ${measure.duration.toFixed(2)}ms`);
                }
            }
        } else {
            fn();
        }
    } catch (error) {
        // Fallback execution if performance API fails
        console.warn(`Performance measurement failed for ${name}, executing without timing`);
        try {
            fn();
        } catch (fnError) {
            console.error(`Function execution failed in measurePerformance for ${name}:`, fnError);
        }
    }
};

// Async version for Promise-based operations
export const measurePerformanceAsync = async (name: string, fn: () => Promise<any>): Promise<any> => {
    try {
        if (typeof performance !== 'undefined' && performance.mark) {
            performance.mark(`${name}-start`);
            const result = await fn();
            performance.mark(`${name}-end`);
            performance.measure(name, `${name}-start`, `${name}-end`);

            // Log only in development
            if (import.meta.env.DEV) {
                const measure = performance.getEntriesByName(name, 'measure')[0];
                if (measure) {
                    console.log(`⚡ ${name}: ${measure.duration.toFixed(2)}ms`);
                }
            }
            return result;
        } else {
            return await fn();
        }
    } catch (error) {
        // Fallback execution if performance API fails
        console.warn(`Performance measurement failed for ${name}, executing without timing`);
        try {
            return await fn();
        } catch (fnError) {
            console.error(`Async function execution failed in measurePerformanceAsync for ${name}:`, fnError);
            throw fnError; // Re-throw to maintain async error handling
        }
    }
};