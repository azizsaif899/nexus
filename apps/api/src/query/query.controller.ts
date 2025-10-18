import { Controller, Get } from '@nestjs/common';

@Controller('query')
export class QueryController {
  @Get()
  findAll(): { success: boolean; data: never[]; message: string } {
    return { success: true, data: [], message: 'Service temporarily disabled' };
  }

  @Get('health')
  getHealth(): { status: string; service: string } {
    return { status: 'ok', service: 'query' };
  }
}
