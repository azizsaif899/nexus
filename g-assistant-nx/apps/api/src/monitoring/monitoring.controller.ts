import { Controller, Get, Query } from '@nestjs/common';
import { MonitoringService } from './monitoring.service';

@Controller('monitoring')
export class MonitoringController {
  constructor(private readonly monitoringService: MonitoringService) {}

  @Get('health')
  getHealth() {
    return this.monitoringService.getHealthStatus();
  }

  @Get('metrics')
  getMetrics(@Query('name') name?: string, @Query('since') since?: string) {
    const sinceDate = since ? new Date(since) : undefined;
    return this.monitoringService.getMetrics(name, sinceDate);
  }

  @Get('alerts')
  getAlerts(@Query('level') level?: string, @Query('resolved') resolved?: string) {
    const resolvedBool = resolved === 'true' ? true : resolved === 'false' ? false : undefined;
    return this.monitoringService.getAlerts(level as any, resolvedBool);
  }

  @Get('performance')
  getPerformanceReport(@Query('hours') hours?: string) {
    const hoursNum = hours ? parseInt(hours) : 24;
    return this.monitoringService.getPerformanceReport(hoursNum);
  }

  @Get('benchmarks')
  getBenchmarks() {
    return this.monitoringService.getBenchmarks();
  }

  @Get('errors')
  getErrorAnalysis(@Query('hours') hours?: string) {
    const hoursNum = hours ? parseInt(hours) : 24;
    return this.monitoringService.getErrorAnalysis(hoursNum);
  }

  @Get('usage')
  getUsageReport() {
    return this.monitoringService.getUsageReport();
  }

  @Get('backup')
  getBackupStatus() {
    return this.monitoringService.getBackupStatus();
  }

  @Get('health/detailed')
  getDetailedHealth() {
    return this.monitoringService.getDetailedHealthStatus();
  }
}