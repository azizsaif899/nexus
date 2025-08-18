import { Injectable } from '@nestjs/common';

export interface PerformanceMetric {
  name: string;
  value: number;
  unit: string;
  threshold: number;
  status: 'good' | 'warning' | 'critical';
}

export interface SystemHealth {
  overall: 'healthy' | 'degraded' | 'critical';
  metrics: PerformanceMetric[];
  recommendations: string[];
}

@Injectable()
export class PerformanceMetrics {
  async collectSystemMetrics(): Promise<SystemHealth> {
    const metrics = await this.gatherMetrics();
    const overall = this.calculateOverallHealth(metrics);
    const recommendations = this.generateRecommendations(metrics);

    return {
      overall,
      metrics,
      recommendations
    };
  }

  private async gatherMetrics(): Promise<PerformanceMetric[]> {
    return [
      {
        name: 'Response Time',
        value: 245,
        unit: 'ms',
        threshold: 500,
        status: this.getStatus(245, 500, 1000)
      },
      {
        name: 'CPU Usage',
        value: 68,
        unit: '%',
        threshold: 80,
        status: this.getStatus(68, 80, 90)
      },
      {
        name: 'Memory Usage',
        value: 72,
        unit: '%',
        threshold: 85,
        status: this.getStatus(72, 85, 95)
      },
      {
        name: 'Database Connections',
        value: 45,
        unit: 'connections',
        threshold: 80,
        status: this.getStatus(45, 80, 100)
      },
      {
        name: 'Error Rate',
        value: 0.8,
        unit: '%',
        threshold: 1,
        status: this.getStatus(0.8, 1, 5, true)
      }
    ];
  }

  private getStatus(value: number, warning: number, critical: number, inverse = false): 'good' | 'warning' | 'critical' {
    if (inverse) {
      if (value >= critical) return 'critical';
      if (value >= warning) return 'warning';
      return 'good';
    } else {
      if (value >= critical) return 'critical';
      if (value >= warning) return 'warning';
      return 'good';
    }
  }

  private calculateOverallHealth(metrics: PerformanceMetric[]): 'healthy' | 'degraded' | 'critical' {
    const criticalCount = metrics.filter(m => m.status === 'critical').length;
    const warningCount = metrics.filter(m => m.status === 'warning').length;

    if (criticalCount > 0) return 'critical';
    if (warningCount > 2) return 'degraded';
    return 'healthy';
  }

  private generateRecommendations(metrics: PerformanceMetric[]): string[] {
    const recommendations: string[] = [];

    metrics.forEach(metric => {
      if (metric.status === 'critical') {
        recommendations.push(`URGENT: ${metric.name} is critical at ${metric.value}${metric.unit}`);
      } else if (metric.status === 'warning') {
        recommendations.push(`Monitor ${metric.name} - approaching threshold`);
      }
    });

    return recommendations;
  }
}