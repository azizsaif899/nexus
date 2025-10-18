import { Controller, Get } from '@nestjs/common';

@Controller('security')
export class SecurityController {
  @Get()
  findAll(): { success: boolean; data: never[]; message: string } {
    return { success: true, data: [], message: 'Service temporarily disabled' };
  }

  @Get('health')
  getHealth(): { status: string; service: string } {
    return { status: 'ok', service: 'security' };
  }
}
