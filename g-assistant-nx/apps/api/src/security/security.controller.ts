import { Controller, Get, Post, Body, Query, Headers, Ip } from '@nestjs/common';
import { SecurityService } from './security.service';

@Controller('security')
export class SecurityController {
  constructor(private readonly securityService: SecurityService) {}

  @Get('threats')
  getThreats(@Query('severity') severity?: string, @Query('limit') limit?: string) {
    const limitNum = limit ? parseInt(limit) : 100;
    return this.securityService.getThreats(severity as any, limitNum);
  }

  @Get('blocked-ips')
  getBlockedIPs() {
    return this.securityService.getBlockedIPs();
  }

  @Post('unblock-ip')
  unblockIP(@Body('ip') ip: string) {
    return this.securityService.unblockIP(ip);
  }

  @Get('compliance')
  getComplianceStatus(@Query('standard') standard?: string) {
    return this.securityService.getComplianceStatus(standard);
  }

  @Post('compliance/update')
  updateCompliance(@Body() data: { standardId: string; controlId: string; implemented: boolean; evidence?: string }) {
    return this.securityService.updateComplianceControl(data.standardId, data.controlId, data.implemented, data.evidence);
  }

  @Get('compliance/report')
  generateComplianceReport(@Query('standard') standard: string) {
    return this.securityService.generateComplianceReport(standard);
  }

  @Post('analyze-request')
  analyzeRequest(
    @Body() request: any,
    @Ip() ip: string,
    @Headers() headers: Record<string, string>
  ) {
    return this.securityService.analyzeRequest({
      ...request,
      ip,
      headers
    });
  }

  @Get('security-events')
  getSecurityEvents(@Query('severity') severity?: string) {
    return this.securityService.getSecurityEvents(severity as any);
  }

  @Get('statistics')
  getSecurityStatistics() {
    return this.securityService.getSecurityStatistics();
  }
}