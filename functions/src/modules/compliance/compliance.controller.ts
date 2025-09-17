import { Controller, Get, Post } from '@nestjs/common';
import { ComplianceService } from './compliance.service';

@Controller('compliance')
export class ComplianceController {
  constructor(private readonly complianceService: ComplianceService) {}

  @Post('run')
  async runAudit() {
    return this.complianceService.runAudit();
  }

  @Get('health')
  async healthCheck() {
    return this.complianceService.healthCheck();
  }

  @Get('status')
  async getStatus() {
    return {
      service: 'Al-Raqib Compliance Agent',
      version: '1.0.0',
      status: 'active',
      timestamp: new Date().toISOString()
    };
  }
}
