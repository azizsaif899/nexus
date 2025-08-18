export interface Metric {
  name: string;
  value: number;
  timestamp: Date;
  tags?: Record<string, string>;
  type: 'counter' | 'gauge' | 'histogram';
}

export interface MetricConfig {
  name: string;
  type: Metric['type'];
  description: string;
  unit?: string;
}

export class MetricsCollector {
  private metrics = new Map<string, Metric[]>();
  private configs = new Map<string, MetricConfig>();

  registerMetric(config: MetricConfig): void {
    this.configs.set(config.name, config);
    if (!this.metrics.has(config.name)) {
      this.metrics.set(config.name, []);
    }
  }

  recordMetric(name: string, value: number, tags?: Record<string, string>): void {
    const config = this.configs.get(name);
    if (!config) {
      console.warn(`Metric ${name} not registered`);
      return;
    }

    const metric: Metric = {
      name,
      value,
      timestamp: new Date(),
      tags,
      type: config.type
    };

    const metricHistory = this.metrics.get(name) || [];
    metricHistory.push(metric);
    
    // Keep only last 1000 entries per metric
    if (metricHistory.length > 1000) {
      metricHistory.shift();
    }
    
    this.metrics.set(name, metricHistory);
  }

  getMetrics(name?: string, since?: Date): Metric[] {
    if (name) {
      const metrics = this.metrics.get(name) || [];
      return since ? metrics.filter(m => m.timestamp >= since) : metrics;
    }

    const allMetrics: Metric[] = [];
    for (const metrics of this.metrics.values()) {
      allMetrics.push(...metrics);
    }
    
    return since ? allMetrics.filter(m => m.timestamp >= since) : allMetrics;
  }

  getLatestValue(name: string): number | null {
    const metrics = this.metrics.get(name);
    return metrics && metrics.length > 0 ? metrics[metrics.length - 1].value : null;
  }

  clearMetrics(name?: string): void {
    if (name) {
      this.metrics.set(name, []);
    } else {
      this.metrics.clear();
    }
  }
}