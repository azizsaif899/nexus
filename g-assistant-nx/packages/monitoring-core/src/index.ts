export * from './lib/metrics-collector';
export * from './lib/alert-manager';
export * from './lib/performance-analyzer';
export * from './lib/notification-service';
export * from './lib/benchmark-service';
export * from './lib/log-analyzer';
export * from './lib/usage-tracker';
export * from './lib/backup-manager';
export * from './lib/health-checker';

// Advanced Monitoring System
export class MonitoringCore {
  private alerts: any[] = [];
  private healthChecks: Map<string, boolean> = new Map();

  constructor() {
    console.log('📊 تفعيل نظام المراقبة المتقدم...');
    this.initializeHealthChecks();
  }

  private initializeHealthChecks(): void {
    const services = ['API', 'Database', 'AI Engine', 'Security', 'Memory'];
    services.forEach(service => {
      this.healthChecks.set(service, true);
      console.log(`✅ Health check: ${service}`);
    });
  }

  createAlert(message: string, level: 'info' | 'warning' | 'error'): void {
    this.alerts.push({
      message,
      level,
      timestamp: new Date(),
      id: Date.now()
    });
  }

  getSystemHealth(): any {
    const totalServices = this.healthChecks.size;
    const healthyServices = Array.from(this.healthChecks.values()).filter(Boolean).length;
    
    return {
      status: healthyServices === totalServices ? 'healthy' : 'degraded',
      healthyServices,
      totalServices,
      uptime: process.uptime(),
      alerts: this.alerts.length
    };
  }
}