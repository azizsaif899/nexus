export class RealtimeAnalytics {
  private eventStream = new Map<string, any[]>();
  private subscribers = new Map<string, Function[]>();

  startStreaming(): void {
    setInterval(() => {
      this.processRealtimeData();
    }, 1000);
  }

  subscribe(metric: string, callback: Function): void {
    if (!this.subscribers.has(metric)) {
      this.subscribers.set(metric, []);
    }
    this.subscribers.get(metric)!.push(callback);
  }

  trackEvent(event: RealtimeEvent): void {
    const key = `${event.type}_${event.timestamp.getMinutes()}`;
    if (!this.eventStream.has(key)) {
      this.eventStream.set(key, []);
    }
    this.eventStream.get(key)!.push(event);
  }

  getCurrentMetrics(): RealtimeMetrics {
    const now = new Date();
    const currentMinute = now.getMinutes();
    
    return {
      activeUsers: this.getActiveUsers(currentMinute),
      requestsPerSecond: this.getRequestsPerSecond(currentMinute),
      errorRate: this.getErrorRate(currentMinute),
      responseTime: this.getAverageResponseTime(currentMinute),
      timestamp: now
    };
  }

  private processRealtimeData(): void {
    const metrics = this.getCurrentMetrics();
    
    this.subscribers.forEach((callbacks, metric) => {
      callbacks.forEach(callback => {
        callback(metrics);
      });
    });
  }

  private getActiveUsers(minute: number): number {
    return 150 + Math.floor(Math.random() * 50);
  }

  private getRequestsPerSecond(minute: number): number {
    return 45 + Math.floor(Math.random() * 20);
  }

  private getErrorRate(minute: number): number {
    return Math.random() * 2;
  }

  private getAverageResponseTime(minute: number): number {
    return 200 + Math.floor(Math.random() * 100);
  }
}

interface RealtimeEvent {
  type: string;
  userId?: string;
  data: any;
  timestamp: Date;
}

interface RealtimeMetrics {
  activeUsers: number;
  requestsPerSecond: number;
  errorRate: number;
  responseTime: number;
  timestamp: Date;
}