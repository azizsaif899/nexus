import { Controller, Get } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

@Controller()
export class AppController {
  constructor(private readonly configService: ConfigService) {}

  @Get()
  getHello(): string {
    return 'Hello World! G-Assistant API is running successfully!';
  }

  @Get('health')
  getHealth() {
    return {
      status: 'ok',
      timestamp: new Date().toISOString(),
      message: 'API is healthy',
      environment: this.configService.get<string>('environment'),
      port: this.configService.get<number>('port'),
      version: '1.0.0'
    };
  }

  @Get('config')
  getConfig() {
    return {
      environment: this.configService.get<string>('environment'),
      apiPrefix: this.configService.get<string>('apiPrefix'),
      timestamp: new Date().toISOString()
    };
  }
}
