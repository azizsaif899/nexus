import { useState, useEffect } from 'react';

interface PerformanceMetrics {
  loadTime: number;
  fcp: number;
  lcp: number;
  cls: number;
  fid: number;
}

export function PerformanceDashboard() {
  const [metrics, setMetrics] = useState<PerformanceMetrics | null>(null);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    // Only show in development
    if (import.meta.env.DEV) {
      setIsVisible(true);
      measurePerformance();
    }
  }, []);

  const measurePerformance = () => {
    // Wait for page to load
    window.addEventListener('load', () => {
      setTimeout(() => {
        const navigation = performance.getEntriesByType('navigation')[0] as PerformanceNavigationTiming;
        
        const loadTime = navigation.loadEventEnd - navigation.loadEventStart;
        
        // Get FCP
        const fcpEntry = performance.getEntriesByName('first-contentful-paint')[0];
        const fcp = fcpEntry ? fcpEntry.startTime : 0;

        // Get LCP
        let lcp = 0;
        if ('PerformanceObserver' in window) {
          new PerformanceObserver((list) => {
            const entries = list.getEntries();
            const lastEntry = entries[entries.length - 1];
            if (lastEntry) {
              lcp = lastEntry.startTime;
            }
            
            setMetrics({
              loadTime: Math.round(loadTime),
              fcp: Math.round(fcp),
              lcp: Math.round(lcp),
              cls: 0, // Placeholder
              fid: 0, // Placeholder
            });
          }).observe({ entryTypes: ['largest-contentful-paint'] });
        }
      }, 100);
    });
  };

  if (!isVisible || !metrics) return null;

  const getScoreColor = (value: number, thresholds: [number, number]) => {
    if (value <= thresholds[0]) return 'text-green-600';
    if (value <= thresholds[1]) return 'text-yellow-600';
    return 'text-red-600';
  };

  return (
    <div className="fixed bottom-4 right-4 bg-white dark:bg-gray-800 border rounded-lg p-4 shadow-lg z-50 min-w-[300px]">
      <div className="flex items-center justify-between mb-3">
        <h3 className="text-sm font-semibold">📊 Performance Metrics</h3>
        <button 
          onClick={() => setIsVisible(false)}
          className="text-gray-500 hover:text-gray-700 text-xs"
        >
          ✕
        </button>
      </div>
      
      <div className="space-y-2 text-xs">
        <div className="flex justify-between">
          <span>Load Time:</span>
          <span className={getScoreColor(metrics.loadTime, [1000, 3000])}>
            {metrics.loadTime}ms
          </span>
        </div>
        
        <div className="flex justify-between">
          <span>FCP:</span>
          <span className={getScoreColor(metrics.fcp, [1800, 3000])}>
            {metrics.fcp}ms
          </span>
        </div>
        
        <div className="flex justify-between">
          <span>LCP:</span>
          <span className={getScoreColor(metrics.lcp, [2500, 4000])}>
            {metrics.lcp}ms
          </span>
        </div>
      </div>
      
      <div className="mt-3 pt-2 border-t text-xs text-gray-500">
        <div className="flex items-center gap-2">
          <div className="w-2 h-2 bg-green-500 rounded-full"></div>
          <span>Good (&lt;1.8s FCP)</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-2 h-2 bg-yellow-500 rounded-full"></div>
          <span>Needs Improvement</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-2 h-2 bg-red-500 rounded-full"></div>
          <span>Poor (&gt;3s FCP)</span>
        </div>
      </div>
    </div>
  );
}