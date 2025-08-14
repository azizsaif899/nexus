import { Controller, Post, Get, Body } from '@nestjs/common';

@Controller('external')
export class ExternalAppController {
  
  @Post('chat')
  async handleChat(@Body() body: { message: string }) {
    return {
      response: "Connected to AzizSys AI",
      timestamp: new Date().toISOString()
    };
  }

  @Post('agents/cfo')
  async cfoAgent(@Body() body: { query: string }) {
    return { result: "CFO Agent Ready", data: body.query };
  }

  @Post('agents/developer') 
  async developerAgent(@Body() body: { code: string }) {
    return { analysis: "Developer Agent Ready", code: body.code };
  }

  @Get('health')
  async health() {
    return { status: 'External API Ready', timestamp: new Date().toISOString() };
  }
}