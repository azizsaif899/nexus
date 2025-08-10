export interface Benchmark {
  name: string;
  target: number;
  current: number;
  unit: string;
  status: 'good' | 'warning' | 'critical';
}

export interface TrendData {
  metric: string;
  values: { timestamp: Date; value: number }[];
  trend: 'up' | 'down' | 'stable';
  changePercent: number;
}

export class BenchmarkService {
  private benchmarks = new Map<string, Benchmark>();
  private trendData = new Map<string, TrendData>();

  setBenchmark(name: string, target: number, unit: string): void {
    this.benchmarks.set(name, {
      name,
      target,
      current: 0,
      unit,
      status: 'good'
    });
  }

  updateBenchmark(name: string, value: number): void {
    const benchmark = this.benchmarks.get(name);
    if (!benchmark) return;

    benchmark.current = value;
    benchmark.status = this.calculateStatus(value, benchmark.target, name);
    
    this.updateTrend(name, value);
  }

  private calculateStatus(current: number, target: number, metric: string): 'good' | 'warning' | 'critical' {
    const isLowerBetter = ['response_time', 'error_rate', 'cpu_usage'].includes(metric);
    
    if (isLowerBetter) {
      if (current <= target) return 'good';
      if (current <= target * 1.5) return 'warning';
      return 'critical';
    } else {
      if (current >= target) return 'good';
      if (current >= target * 0.8) return 'warning';
      return 'critical';
    }
  }

  private updateTrend(metric: string, value: number): void {
    let trend = this.trendData.get(metric);
    if (!trend) {
      trend = {
        metric,
        values: [],
        trend: 'stable',
        changePercent: 0
      };
      this.trendData.set(metric, trend);
    }

    trend.values.push({ timestamp: new Date(), value });
    
    // Keep only last 100 values
    if (trend.values.length > 100) {
      trend.values.shift();
    }

    // Calculate trend
    if (trend.values.length >= 10) {
      const recent = trend.values.slice(-10);
      const older = trend.values.slice(-20, -10);
      
      if (older.length > 0) {
        const recentAvg = recent.reduce((sum, v) => sum + v.value, 0) / recent.length;
        const olderAvg = older.reduce((sum, v) => sum + v.value, 0) / older.length;
        
        const change = ((recentAvg - olderAvg) / olderAvg) * 100;
        trend.changePercent = change;
        
        if (Math.abs(change) < 5) {
          trend.trend = 'stable';
        } else {
          trend.trend = change > 0 ? 'up' : 'down';
        }
      }
    }
  }

  getBenchmarks(): Benchmark[] {
    return Array.from(this.benchmarks.values());
  }

  getTrends(): TrendData[] {
    return Array.from(this.trendData.values());
  }

  getBenchmark(name: string): Benchmark | undefined {
    return this.benchmarks.get(name);
  }
}