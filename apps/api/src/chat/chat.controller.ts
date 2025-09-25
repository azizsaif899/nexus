import { Controller, Post, Body, Get, Param, UseGuards } from '@nestjs/common';
import { ChatGateway } from './chat.gateway';

@Controller('api/chat')
export class ChatController {
  constructor(private readonly chatGateway: ChatGateway) {}

  @Post('message')
  async sendMessage(@Body() data: { message: string; sessionId: string; type?: 'user' | 'ai' }) {
    // Process message through AI if needed
    const response = await this.processMessage(data.message);
    
    // Send AI response via WebSocket
    this.chatGateway.server.to(data.sessionId).emit('newMessage', {
      id: `ai_${Date.now()}`,
      message: response,
      type: 'ai',
      timestamp: new Date(),
      sessionId: data.sessionId,
    });

    return { success: true, messageId: `msg_${Date.now()}` };
  }

  @Get('sessions/:sessionId/users')
  async getSessionUsers(@Param('sessionId') sessionId: string) {
    // Get online users from gateway
    return { users: [], count: 0 };
  }

  private async processMessage(message: string): Promise<string> {
    // Mock AI response - replace with actual AI integration
    return `AI Response: I received your message "${message.substring(0, 50)}..."`;
  }
}