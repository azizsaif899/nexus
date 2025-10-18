/// <reference types="vite/client" />

interface ImportMetaEnv {
    readonly VITE_APP_TITLE: string;
    readonly VITE_VAPID_PUBLIC_KEY: string;
    readonly VITE_API_URL: string;
    readonly NODE_ENV: 'development' | 'production' | 'test';
}

interface ImportMeta {
    readonly env: ImportMetaEnv;
}

// Service Worker types
interface ServiceWorkerGlobalScope {
    skipWaiting(): Promise<void>;
    clients: Clients;
}

// Performance types
interface PerformanceNavigationTiming extends PerformanceEntry {
    domContentLoadedEventEnd: number;
    domContentLoadedEventStart: number;
    loadEventEnd: number;
    loadEventStart: number;
    responseEnd: number;
    requestStart: number;
}

// Window extensions
declare global {
    interface Window {
        __assetsPath: (filename: string) => string;
        imageObserver?: IntersectionObserver;
    }
}

export { };