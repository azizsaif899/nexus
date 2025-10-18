// Service Worker registration and management
export class ServiceWorkerManager {
    private swRegistration: ServiceWorkerRegistration | null = null;

    async init(): Promise<void> {
        if (!('serviceWorker' in navigator)) {
            console.log('Service Worker not supported');
            return;
        }

        try {
            // Register service worker
            this.swRegistration = await navigator.serviceWorker.register('/sw.js', {
                scope: '/',
                updateViaCache: 'none'
            });

            console.log('Service Worker registered successfully');

            // Handle updates
            this.swRegistration.addEventListener('updatefound', () => {
                const newWorker = this.swRegistration?.installing;
                if (newWorker) {
                    newWorker.addEventListener('statechange', () => {
                        if (newWorker.state === 'installed' && navigator.serviceWorker.controller) {
                            // New content available
                            this.showUpdateNotification();
                        }
                    });
                }
            });

            // Handle messages from service worker
            navigator.serviceWorker.addEventListener('message', (event) => {
                this.handleServiceWorkerMessage(event.data);
            });

        } catch (error) {
            console.error('Service Worker registration failed:', error);
        }
    }

    private showUpdateNotification(): void {
        // Show update notification to user
        if (confirm('تحديث جديد متاح. هل تريد إعادة تحميل الصفحة؟')) {
            window.location.reload();
        }
    }

    private handleServiceWorkerMessage(data: any): void {
        switch (data.type) {
            case 'CACHE_UPDATED':
                console.log('Cache updated successfully');
                break;
            case 'OFFLINE_FALLBACK':
                console.log('App is running in offline mode');
                break;
            default:
                console.log('Service Worker message:', data);
        }
    }

    async unregister(): Promise<void> {
        if (this.swRegistration) {
            await this.swRegistration.unregister();
            this.swRegistration = null;
            console.log('Service Worker unregistered');
        }
    }

    async update(): Promise<void> {
        if (this.swRegistration) {
            await this.swRegistration.update();
            console.log('Service Worker update requested');
        }
    }

    // Push notification subscription
    async subscribeToPushNotifications(): Promise<PushSubscription | null> {
        if (!this.swRegistration) {
            console.error('Service Worker not registered');
            return null;
        }

        try {
            const vapidKey = process.env.VITE_VAPID_PUBLIC_KEY || '';
            if (!vapidKey) {
                console.warn('VAPID key not configured');
                return null;
            }

            const subscription = await this.swRegistration.pushManager.subscribe({
                userVisibleOnly: true,
                applicationServerKey: this.urlBase64ToUint8Array(vapidKey) as BufferSource
            });

            console.log('Push notification subscription successful');
            return subscription;
        } catch (error) {
            console.error('Push notification subscription failed:', error);
            return null;
        }
    }

    private urlBase64ToUint8Array(base64String: string): Uint8Array {
        const padding = '='.repeat((4 - base64String.length % 4) % 4);
        const base64 = (base64String + padding)
            .replace(/-/g, '+')
            .replace(/_/g, '/');

        const rawData = window.atob(base64);
        const outputArray = new Uint8Array(rawData.length);

        for (let i = 0; i < rawData.length; ++i) {
            outputArray[i] = rawData.charCodeAt(i);
        }
        return outputArray;
    }
}

// Export singleton instance
export const swManager = new ServiceWorkerManager();