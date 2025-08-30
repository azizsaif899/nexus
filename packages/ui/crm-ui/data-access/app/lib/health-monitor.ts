export interface HealthCheck {
  service: string;
  status: 'healthy' | 'degraded' | 'unhealthy';
  responseTime: number;
  lastCheck: Date;
  details?: any;
}

export class HealthMonitor {
  private checks = new Map<string, HealthCheck>();
  private interval: NodeJS.Timeout | null = null;

  start(): void {
    this.interval = setInterval(() => {
      this.runHealthChecks();
    }, 30000); // كل 30 ثانية
  }

  stop(): void {
    if (this.interval) {
      clearInterval(this.interval);
      this.interval = null;
    }
  }

  private async runHealthChecks(): Promise<void> {
    const services = ['api', 'database', 'websocket', 'cache'];
    
    for (const service of services) {
      try {
        const startTime = Date.now();
        await this.checkService(service);
        const responseTime = Date.now() - startTime;
        
        this.checks.set(service, {
          service,
          status: responseTime < 1000 ? 'healthy' : 'degraded',
          responseTime,
          lastCheck: new Date()
        });
      } catch (error) {
        this.checks.set(service, {
          service,
          status: 'unhealthy',
          responseTime: -1,
          lastCheck: new Date(),
          details: error
        });
      }
    }
  }

  private async checkService(service: string): Promise<void> {
    // محاكاة فحص الخدمة
    await new Promise(resolve => setTimeout(resolve, Math.random() * 500));
    
    if (Math.random() < 0.1) {
      throw new Error(`Service ${service} is down`);
    }
  }

  getHealthStatus(): HealthCheck[] {
    return Array.from(this.checks.values());
  }

  getOverallHealth(): 'healthy' | 'degraded' | 'unhealthy' {
    const statuses = Array.from(this.checks.values()).map(check => check.status);
    
    if (statuses.includes('unhealthy')) return 'unhealthy';
    if (statuses.includes('degraded')) return 'degraded';
    return 'healthy';
  }
}

export const healthMonitor = new HealthMonitor();