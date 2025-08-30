import {
  WebSocketGateway,
  SubscribeMessage,
  MessageBody,
  WebSocketServer,
  ConnectedSocket,
  OnGatewayConnection,
  OnGatewayDisconnect,
} from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';
import { Logger } from '@nestjs/common';
import { AiCoreService } from '@azizsys/core-logic';

@WebSocketGateway({
  cors: {
    origin: ['http://localhost:3000', 'http://localhost:4200'],
    credentials: true,
  },
})
export class ChatGateway implements OnGatewayConnection, OnGatewayDisconnect {
  @WebSocketServer()
  server: Server;

  private readonly logger = new Logger(ChatGateway.name);

  constructor(private readonly aiCoreService: AiCoreService) {}

  handleConnection(client: Socket) {
    this.logger.log(`Client connected: ${client.id}`);
  }

  handleDisconnect(client: Socket) {
    this.logger.log(`Client disconnected: ${client.id}`);
  }

  @SubscribeMessage('sendMessage')
  async handleMessage(
    @MessageBody() data: { message: string; context?: string },
    @ConnectedSocket() client: Socket,
  ) {
    client.emit('typing', { isTyping: true });

    try {
      const response = await this.aiCoreService.processQuery({
        prompt: data.message,
        context: data.context || 'chat',
        sessionId: client.id,
      });

      client.emit('messageResponse', {
        success: response.success,
        message: response.response,
        confidence: response.confidence,
        processingTime: response.processingTime,
        timestamp: response.timestamp,
      });

    } catch (error) {
      client.emit('messageResponse', {
        success: false,
        message: 'عذراً، حدث خطأ في معالجة رسالتك',
        error: error.message,
      });
    } finally {
      client.emit('typing', { isTyping: false });
    }
  }
}
