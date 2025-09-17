import { Injectable, Logger } from '@nestjs/common';

@Injectable()
export class TelemetryService {
  private readonly logger = new Logger(TelemetryService.name);
  private metrics: any[] = [];
  private errors: any[] = [];
  private performance: any[] = [];

  logError(error: string | Error, context?: string, metadata?: any): void {
    const errorEntry = {
      timestamp: new Date(),
      message: typeof error === 'string' ? error : error.message,
      stack: typeof error === 'object' ? error.stack : undefined,
      context: context || 'Unknown',
      metadata: metadata || {},
      level: 'error'
    };
    
    this.errors.push(errorEntry);
    this.logger.error(errorEntry.message, errorEntry.stack, context);
    
    if (this.errors.length > 1000) {
      this.errors.splice(0, this.errors.length - 1000);
    }
  }

  trackPerformance(operation: string, duration: number, metadata?: any): void {
    const perfEntry = {
      timestamp: new Date(),
      operation,
      duration,
      metadata: metadata || {}
    };
    
    this.performance.push(perfEntry);
    
    if (duration > 5000) {
      this.logger.warn(`Slow operation detected: ${operation} took ${duration}ms`);
    }
    
    if (this.performance.length > 500) {
      this.performance.splice(0, this.performance.length - 500);
    }
  }

  recordMetric(name: string, value: number, tags?: any): void {
    const metric = {
      timestamp: new Date(),
      name,
      value,
      tags: tags || {}
    };
    
    this.metrics.push(metric);
    
    if (this.metrics.length > 1000) {
      this.metrics.splice(0, this.metrics.length - 1000);
    }
  }

  getSystemHealth(): any {
    const now = Date.now();
    const oneHourAgo = now - 60 * 60 * 1000;
    
    const recentErrors = this.errors.filter(e => 
      new Date(e.timestamp).getTime() > oneHourAgo
    );
    
    const recentPerf = this.performance.filter(p => 
      new Date(p.timestamp).getTime() > oneHourAgo
    );
    
    const avgResponseTime = recentPerf.length > 0 
      ? recentPerf.reduce((sum, p) => sum + p.duration, 0) / recentPerf.length 
      : 0;
    
    return {
      status: recentErrors.length < 10 && avgResponseTime < 2000 ? 'healthy' : 'degraded',
      errorCount: recentErrors.length,
      averageResponseTime: Math.round(avgResponseTime),
      totalRequests: recentPerf.length,
      timestamp: new Date()
    };
  }

  getTelemetryData(type?: string, limit: number = 100): any {
    switch (type) {
      case 'errors':
        return this.errors.slice(-limit);
      case 'performance':
        return this.performance.slice(-limit);
      case 'metrics':
        return this.metrics.slice(-limit);
      default:
        return {
          errors: this.errors.slice(-limit),
          performance: this.performance.slice(-limit),
          metrics: this.metrics.slice(-limit)
        };
    }
  }
}