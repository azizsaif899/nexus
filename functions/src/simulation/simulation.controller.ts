import { Controller, Get } from '@nestjs/common';

@Controller('simulation')
export class SimulationController {
  @Get()
  findAll() {
    return { success: true, data: [], message: 'Service temporarily disabled' };
  }

  @Get('health')
  getHealth() {
    return { status: 'ok', service: 'simulation' };
  }
}
