import { Controller, Post, Delete, Body, Param } from '@nestjs/common';
import { DataDeletionService, AuditTrailService, PaymentSecurityService } from '@g-assistant/compliance-core';

@Controller('compliance')
export class ComplianceController {
  constructor(
    private dataDeletion: DataDeletionService,
    private auditTrail: AuditTrailService,
    private paymentSecurity: PaymentSecurityService
  ) {}

  @Delete('user/:userId')
  async deleteUserData(@Param('userId') userId: string) {
    await this.dataDeletion.deleteUserData(userId);
    return { message: 'User data deleted successfully' };
  }

  @Post('audit')
  async logFinancialOperation(@Body() operation: any) {
    await this.auditTrail.logFinancialOperation(operation);
    return { message: 'Operation logged' };
  }

  @Post('payment')
  async processPayment(@Body() cardData: any) {
    const result = await this.paymentSecurity.processPayment(cardData);
    return result;
  }
}