export interface PerformanceData {
  timestamp: Date;
  responseTime: number;
  throughput: number;
  errorRate: number;
  cpuUsage: number;
  memoryUsage: number;
}

export interface PerformanceReport {
  period: string;
  averageResponseTime: number;
  maxResponseTime: number;
  minResponseTime: number;
  totalRequests: number;
  errorCount: number;
  uptime: number;
  trends: {
    responseTime: 'improving' | 'degrading' | 'stable';
    throughput: 'increasing' | 'decreasing' | 'stable';
    errors: 'increasing' | 'decreasing' | 'stable';
  };
}

export class PerformanceAnalyzer {
  private data: PerformanceData[] = [];
  private maxDataPoints = 10000;

  recordPerformance(data: PerformanceData): void {
    this.data.push(data);
    
    if (this.data.length > this.maxDataPoints) {
      this.data.shift();
    }
  }

  getPerformanceData(since?: Date, until?: Date): PerformanceData[] {
    let filtered = this.data;

    if (since) {
      filtered = filtered.filter(d => d.timestamp >= since);
    }

    if (until) {
      filtered = filtered.filter(d => d.timestamp <= until);
    }

    return filtered;
  }

  generateReport(hours = 24): PerformanceReport {
    const since = new Date(Date.now() - hours * 60 * 60 * 1000);
    const periodData = this.getPerformanceData(since);

    if (periodData.length === 0) {
      return this.getEmptyReport(`Last ${hours} hours`);
    }

    const responseTimes = periodData.map(d => d.responseTime);
    const totalRequests = periodData.reduce((sum, d) => sum + d.throughput, 0);
    const errorCount = periodData.reduce((sum, d) => sum + (d.errorRate * d.throughput / 100), 0);

    return {
      period: `Last ${hours} hours`,
      averageResponseTime: this.average(responseTimes),
      maxResponseTime: Math.max(...responseTimes),
      minResponseTime: Math.min(...responseTimes),
      totalRequests,
      errorCount,
      uptime: this.calculateUptime(periodData),
      trends: this.analyzeTrends(periodData)
    };
  }

  private average(numbers: number[]): number {
    return numbers.reduce((sum, n) => sum + n, 0) / numbers.length;
  }

  private calculateUptime(data: PerformanceData[]): number {
    const totalPoints = data.length;
    const healthyPoints = data.filter(d => d.errorRate < 5).length;
    return totalPoints > 0 ? (healthyPoints / totalPoints) * 100 : 0;
  }

  private analyzeTrends(data: PerformanceData[]): PerformanceReport['trends'] {
    if (data.length < 2) {
      return { responseTime: 'stable', throughput: 'stable', errors: 'stable' };
    }

    const mid = Math.floor(data.length / 2);
    const firstHalf = data.slice(0, mid);
    const secondHalf = data.slice(mid);

    const firstAvgResponse = this.average(firstHalf.map(d => d.responseTime));
    const secondAvgResponse = this.average(secondHalf.map(d => d.responseTime));

    const firstAvgThroughput = this.average(firstHalf.map(d => d.throughput));
    const secondAvgThroughput = this.average(secondHalf.map(d => d.throughput));

    const firstAvgErrors = this.average(firstHalf.map(d => d.errorRate));
    const secondAvgErrors = this.average(secondHalf.map(d => d.errorRate));

    return {
      responseTime: this.getTrend(firstAvgResponse, secondAvgResponse, true),
      throughput: this.getTrend(firstAvgThroughput, secondAvgThroughput, false),
      errors: this.getTrend(firstAvgErrors, secondAvgErrors, true)
    };
  }

  private getTrend(first: number, second: number, lowerIsBetter: boolean): 'improving' | 'degrading' | 'stable' {
    const threshold = 0.05; // 5% change threshold
    const change = (second - first) / first;

    if (Math.abs(change) < threshold) return 'stable';

    if (lowerIsBetter) {
      return change < 0 ? 'improving' : 'degrading';
    } else {
      return change > 0 ? 'increasing' : 'decreasing';
    }
  }

  private getEmptyReport(period: string): PerformanceReport {
    return {
      period,
      averageResponseTime: 0,
      maxResponseTime: 0,
      minResponseTime: 0,
      totalRequests: 0,
      errorCount: 0,
      uptime: 0,
      trends: { responseTime: 'stable', throughput: 'stable', errors: 'stable' }
    };
  }
}