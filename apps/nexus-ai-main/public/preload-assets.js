// Asset preloading script
(function() {
  'use strict';
  
  // Function to preload critical resources
  function preloadResource(href, as, type, crossorigin) {
    const link = document.createElement('link');
    link.rel = 'preload';
    link.href = href;
    link.as = as;
    if (type) link.type = type;
    if (crossorigin) link.crossOrigin = crossorigin;
    document.head.appendChild(link);
  }

  // Function to prefetch next page resources
  function prefetchResource(href) {
    const link = document.createElement('link');
    link.rel = 'prefetch';
    link.href = href;
    document.head.appendChild(link);
  }

  // Preload critical fonts (if any)
  // preloadResource('/fonts/inter.woff2', 'font', 'font/woff2', 'anonymous');

  // Set up intersection observer for lazy loading images
  if ('IntersectionObserver' in window) {
    const imageObserver = new IntersectionObserver((entries, observer) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          const img = entry.target;
          if (img.dataset.src) {
            img.src = img.dataset.src;
            img.removeAttribute('data-src');
            observer.unobserve(img);
          }
        }
      });
    }, {
      rootMargin: '50px 0px',
      threshold: 0.01
    });

    // Automatically observe images with data-src attribute
    document.addEventListener('DOMContentLoaded', () => {
      document.querySelectorAll('img[data-src]').forEach(img => {
        imageObserver.observe(img);
      });
    });

    // Export for dynamic use
    window.imageObserver = imageObserver;
  }

  // Performance monitoring
  if ('performance' in window && 'PerformanceObserver' in window) {
    // Monitor Core Web Vitals
    function getCLS(onPerfEntry) {
      new PerformanceObserver((entryList) => {
        for (const entry of entryList.getEntries()) {
          if (!entry.hadRecentInput) {
            onPerfEntry(entry);
          }
        }
      }).observe({ entryTypes: ['layout-shift'] });
    }

    function getFID(onPerfEntry) {
      new PerformanceObserver((entryList) => {
        for (const entry of entryList.getEntries()) {
          onPerfEntry(entry);
        }
      }).observe({ entryTypes: ['first-input'] });
    }

    function getLCP(onPerfEntry) {
      new PerformanceObserver((entryList) => {
        for (const entry of entryList.getEntries()) {
          onPerfEntry(entry);
        }
      }).observe({ entryTypes: ['largest-contentful-paint'] });
    }

    // Performance monitoring (development only)
    if (typeof window !== 'undefined' && window.location.hostname === 'localhost') {
      // Store metrics for development analysis
      getCLS((entry) => window.__performanceMetrics = {...(window.__performanceMetrics || {}), cls: entry});
      getFID((entry) => window.__performanceMetrics = {...(window.__performanceMetrics || {}), fid: entry});
      getLCP((entry) => window.__performanceMetrics = {...(window.__performanceMetrics || {}), lcp: entry});
    }
  }

  // Asset path helper
  window.__assetsPath = function(filename) {
    // Safe fallback for non-module context
    const baseUrl = window.location.origin + window.location.pathname.replace(/\/[^/]*$/, '/');
    return new URL(filename, baseUrl).href;
  };
})();