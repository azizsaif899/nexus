import { Controller, Get } from '@nestjs/common';

@Controller('monitoring')
export class MonitoringController {
  @Get()
  findAll() {
    return { success: true, data: [], message: 'Service temporarily disabled' };
  }

  @Get('health')
  getHealth() {
    return { status: 'ok', service: 'monitoring' };
  }
}
