import { Controller, Get } from '@nestjs/common';

@Controller('query')
export class QueryController {
  @Get()
  findAll() {
    return { success: true, data: [], message: 'Service temporarily disabled' };
  }

  @Get('health')
  getHealth() {
    return { status: 'ok', service: 'query' };
  }
}
