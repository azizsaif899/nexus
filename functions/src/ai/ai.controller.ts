import { Controller, Get } from '@nestjs/common';

@Controller('ai')
export class AIController {
  @Get()
  findAll() {
    return { success: true, data: [], message: 'Service temporarily disabled' };
  }

  @Get('health')
  getHealth() {
    return { status: 'ok', service: 'ai' };
  }
}
