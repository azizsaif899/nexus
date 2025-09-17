import { Controller, Get } from '@nestjs/common';

@Controller('security')
export class SecurityController {
  @Get()
  findAll() {
    return { success: true, data: [], message: 'Service temporarily disabled' };
  }

  @Get('health')
  getHealth() {
    return { status: 'ok', service: 'security' };
  }
}
