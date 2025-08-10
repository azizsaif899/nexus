export interface LogPattern {
  pattern: RegExp;
  type: 'error' | 'warning' | 'info';
  description: string;
  count: number;
  lastSeen: Date;
}

export interface ErrorAnalysis {
  totalErrors: number;
  errorTypes: Map<string, number>;
  topErrors: Array<{ message: string; count: number }>;
  errorRate: number;
  trends: 'increasing' | 'decreasing' | 'stable';
}

export class LogAnalyzer {
  private patterns: LogPattern[] = [];
  private logs: Array<{ timestamp: Date; level: string; message: string }> = [];
  private maxLogs = 10000;

  constructor() {
    this.initializePatterns();
  }

  private initializePatterns(): void {
    this.patterns = [
      {
        pattern: /error|exception|failed|failure/i,
        type: 'error',
        description: 'General errors',
        count: 0,
        lastSeen: new Date()
      },
      {
        pattern: /timeout|slow|performance/i,
        type: 'warning',
        description: 'Performance issues',
        count: 0,
        lastSeen: new Date()
      },
      {
        pattern: /unauthorized|forbidden|access denied/i,
        type: 'error',
        description: 'Security issues',
        count: 0,
        lastSeen: new Date()
      },
      {
        pattern: /database|connection|query/i,
        type: 'warning',
        description: 'Database issues',
        count: 0,
        lastSeen: new Date()
      }
    ];
  }

  addLog(level: string, message: string): void {
    const log = {
      timestamp: new Date(),
      level: level.toLowerCase(),
      message
    };

    this.logs.push(log);
    
    if (this.logs.length > this.maxLogs) {
      this.logs.shift();
    }

    this.analyzeLog(log);
  }

  private analyzeLog(log: any): void {
    for (const pattern of this.patterns) {
      if (pattern.pattern.test(log.message)) {
        pattern.count++;
        pattern.lastSeen = log.timestamp;
      }
    }
  }

  getErrorAnalysis(hours = 24): ErrorAnalysis {
    const since = new Date(Date.now() - hours * 60 * 60 * 1000);
    const recentLogs = this.logs.filter(log => log.timestamp >= since);
    const errorLogs = recentLogs.filter(log => log.level === 'error');

    const errorTypes = new Map<string, number>();
    const errorMessages = new Map<string, number>();

    errorLogs.forEach(log => {
      // Categorize by pattern
      for (const pattern of this.patterns) {
        if (pattern.type === 'error' && pattern.pattern.test(log.message)) {
          errorTypes.set(pattern.description, (errorTypes.get(pattern.description) || 0) + 1);
        }
      }

      // Count specific messages
      const shortMessage = log.message.substring(0, 100);
      errorMessages.set(shortMessage, (errorMessages.get(shortMessage) || 0) + 1);
    });

    const topErrors = Array.from(errorMessages.entries())
      .sort((a, b) => b[1] - a[1])
      .slice(0, 10)
      .map(([message, count]) => ({ message, count }));

    const errorRate = recentLogs.length > 0 ? (errorLogs.length / recentLogs.length) * 100 : 0;

    return {
      totalErrors: errorLogs.length,
      errorTypes,
      topErrors,
      errorRate,
      trends: this.calculateErrorTrend(hours)
    };
  }

  private calculateErrorTrend(hours: number): 'increasing' | 'decreasing' | 'stable' {
    const now = new Date();
    const halfPeriod = hours / 2;
    
    const firstHalf = this.logs.filter(log => 
      log.timestamp >= new Date(now.getTime() - hours * 60 * 60 * 1000) &&
      log.timestamp < new Date(now.getTime() - halfPeriod * 60 * 60 * 1000) &&
      log.level === 'error'
    ).length;

    const secondHalf = this.logs.filter(log => 
      log.timestamp >= new Date(now.getTime() - halfPeriod * 60 * 60 * 1000) &&
      log.level === 'error'
    ).length;

    if (Math.abs(secondHalf - firstHalf) < 2) return 'stable';
    return secondHalf > firstHalf ? 'increasing' : 'decreasing';
  }

  getPatterns(): LogPattern[] {
    return this.patterns;
  }

  clearLogs(): void {
    this.logs = [];
    this.patterns.forEach(p => p.count = 0);
  }
}