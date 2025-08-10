import { Injectable } from '@nestjs/common';
import { 
  MetricsCollector, 
  AlertManager, 
  PerformanceAnalyzer,
  NotificationService,
  BenchmarkService,
  LogAnalyzer,
  UsageTracker,
  BackupManager,
  HealthChecker
} from '@g-assistant-nx/monitoring-core';

@Injectable()
export class MonitoringService {
  private metricsCollector: MetricsCollector;
  private alertManager: AlertManager;
  private performanceAnalyzer: PerformanceAnalyzer;
  private notificationService: NotificationService;
  private benchmarkService: BenchmarkService;
  private logAnalyzer: LogAnalyzer;
  private usageTracker: UsageTracker;
  private backupManager: BackupManager;
  private healthChecker: HealthChecker;

  constructor() {
    this.metricsCollector = new MetricsCollector();
    this.alertManager = new AlertManager();
    this.performanceAnalyzer = new PerformanceAnalyzer();
    this.notificationService = new NotificationService();
    this.benchmarkService = new BenchmarkService();
    this.logAnalyzer = new LogAnalyzer();
    this.usageTracker = new UsageTracker();
    this.backupManager = new BackupManager();
    this.healthChecker = new HealthChecker();
    
    this.initializeMetrics();
    this.initializeAlerts();
    this.initializeNotifications();
    this.initializeBenchmarks();
    this.initializeHealthChecks();
  }

  private initializeMetrics() {
    this.metricsCollector.registerMetric({
      name: 'api_response_time',
      type: 'histogram',
      description: 'API response time in milliseconds',
      unit: 'ms'
    });

    this.metricsCollector.registerMetric({
      name: 'api_requests_total',
      type: 'counter',
      description: 'Total API requests',
      unit: 'requests'
    });

    this.metricsCollector.registerMetric({
      name: 'system_cpu_usage',
      type: 'gauge',
      description: 'CPU usage percentage',
      unit: '%'
    });

    this.metricsCollector.registerMetric({
      name: 'system_memory_usage',
      type: 'gauge',
      description: 'Memory usage in MB',
      unit: 'MB'
    });
  }

  private initializeAlerts() {
    this.alertManager.addRule({
      name: 'high_response_time',
      metric: 'api_response_time',
      condition: 'gt',
      threshold: 2000,
      level: 'warning',
      message: 'API response time is high: {value}ms',
      cooldown: 5
    });

    this.alertManager.addRule({
      name: 'critical_response_time',
      metric: 'api_response_time',
      condition: 'gt',
      threshold: 5000,
      level: 'critical',
      message: 'API response time is critical: {value}ms',
      cooldown: 2
    });

    this.alertManager.addRule({
      name: 'high_cpu_usage',
      metric: 'system_cpu_usage',
      condition: 'gt',
      threshold: 80,
      level: 'warning',
      message: 'CPU usage is high: {value}%',
      cooldown: 10
    });
  }

  recordMetric(name: string, value: number, tags?: Record<string, string>) {
    this.metricsCollector.recordMetric(name, value, tags);
    
    // Check for alerts
    const alerts = this.alertManager.checkMetric(name, value);
    if (alerts.length > 0) {
      console.log('Alerts triggered:', alerts);
    }
  }

  getHealthStatus() {
    const cpuUsage = this.metricsCollector.getLatestValue('system_cpu_usage') || 0;
    const memoryUsage = this.metricsCollector.getLatestValue('system_memory_usage') || 0;
    const responseTime = this.metricsCollector.getLatestValue('api_response_time') || 0;

    const status = cpuUsage > 90 || memoryUsage > 1000 || responseTime > 5000 ? 'unhealthy' : 'healthy';

    return {
      status,
      timestamp: new Date(),
      metrics: {
        cpu: cpuUsage,
        memory: memoryUsage,
        responseTime
      }
    };
  }

  getMetrics(name?: string, since?: Date) {
    return this.metricsCollector.getMetrics(name, since);
  }

  getAlerts(level?: any, resolved?: boolean) {
    return this.alertManager.getAlerts(level, resolved);
  }

  getPerformanceReport(hours = 24) {
    return this.performanceAnalyzer.generateReport(hours);
  }

  private initializeNotifications() {
    this.notificationService.addChannel('console', {
      type: 'console',
      config: {},
      enabled: true
    });

    this.notificationService.addRule({
      alertLevel: 'critical',
      channels: ['console'],
      template: '🚨 CRITICAL: {message} at {timestamp}'
    });
  }

  private initializeBenchmarks() {
    this.benchmarkService.setBenchmark('response_time', 1000, 'ms');
    this.benchmarkService.setBenchmark('throughput', 100, 'req/s');
    this.benchmarkService.setBenchmark('error_rate', 1, '%');
  }

  private initializeHealthChecks() {
    this.healthChecker.addHealthCheck({
      name: 'api_health',
      type: 'http',
      config: { url: 'http://localhost:3333/health' },
      timeout: 5000,
      interval: 30000
    });

    this.healthChecker.addHealthCheck({
      name: 'database',
      type: 'database',
      config: { connectionString: 'mock' },
      timeout: 3000,
      interval: 60000
    });
  }

  getBenchmarks() {
    return this.benchmarkService.getBenchmarks();
  }

  getErrorAnalysis(hours = 24) {
    return this.logAnalyzer.getErrorAnalysis(hours);
  }

  getUsageReport() {
    return this.usageTracker.generateUsageReport();
  }

  getBackupStatus() {
    return this.backupManager.getBackupStats();
  }

  getDetailedHealthStatus() {
    return this.healthChecker.getHealthStatus();
  }
}