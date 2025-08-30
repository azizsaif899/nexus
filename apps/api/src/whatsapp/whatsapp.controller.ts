import { Controller, Get } from '@nestjs/common';

@Controller('whatsapp')
export class WhatsAppController {
  @Get()
  findAll() {
    return { success: true, data: [], message: 'Service temporarily disabled' };
  }

  @Get('health')
  getHealth() {
    return { status: 'ok', service: 'whatsapp' };
  }
}
