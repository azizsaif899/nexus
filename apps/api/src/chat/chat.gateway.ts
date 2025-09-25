import {
  WebSocketGateway,
  WebSocketServer,
  SubscribeMessage,
  MessageBody,
  ConnectedSocket,
  OnGatewayConnection,
  OnGatewayDisconnect,
} from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';
import { Logger } from '@nestjs/common';

@WebSocketGateway({
  cors: {
    origin: '*',
  },
  namespace: '/chat',
})
export class ChatGateway implements OnGatewayConnection, OnGatewayDisconnect {
  @WebSocketServer()
  server: Server;
  
  private readonly logger = new Logger(ChatGateway.name);
  private connectedClients = new Map<string, { sessionId?: string; lastSeen: Date }>();

  handleConnection(client: Socket) {
    this.logger.log(`Client connected: ${client.id}`);
    this.connectedClients.set(client.id, { lastSeen: new Date() });
    
    // Send connection confirmation
    client.emit('connected', { clientId: client.id, timestamp: new Date() });
  }

  handleDisconnect(client: Socket) {
    this.logger.log(`Client disconnected: ${client.id}`);
    const clientData = this.connectedClients.get(client.id);
    
    if (clientData?.sessionId) {
      // Notify session about user leaving
      client.to(clientData.sessionId).emit('userLeft', {
        clientId: client.id,
        timestamp: new Date(),
      });
    }
    
    this.connectedClients.delete(client.id);
  }

  @SubscribeMessage('sendMessage')
  handleMessage(
    @MessageBody() data: { message: string; sessionId: string; type?: 'user' | 'ai' },
    @ConnectedSocket() client: Socket,
  ) {
    const messageData = {
      id: `msg_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      message: data.message,
      type: data.type || 'user',
      timestamp: new Date(),
      clientId: client.id,
      sessionId: data.sessionId,
    };

    // Broadcast to all clients in session except sender
    client.to(data.sessionId).emit('newMessage', messageData);
    
    // Send confirmation to sender
    client.emit('messageSent', { messageId: messageData.id, timestamp: messageData.timestamp });
    
    this.logger.log(`Message sent in session ${data.sessionId}: ${data.message.substring(0, 50)}...`);
  }

  @SubscribeMessage('joinSession')
  handleJoinSession(
    @MessageBody() data: { sessionId: string; userId?: string },
    @ConnectedSocket() client: Socket,
  ) {
    // Leave previous session if any
    const clientData = this.connectedClients.get(client.id);
    if (clientData?.sessionId) {
      client.leave(clientData.sessionId);
    }

    // Join new session
    client.join(data.sessionId);
    this.connectedClients.set(client.id, {
      sessionId: data.sessionId,
      lastSeen: new Date(),
    });

    // Notify others in session
    client.to(data.sessionId).emit('userJoined', {
      clientId: client.id,
      userId: data.userId,
      timestamp: new Date(),
    });

    this.logger.log(`Client ${client.id} joined session ${data.sessionId}`);
  }

  @SubscribeMessage('typing')
  handleTyping(
    @MessageBody() data: { sessionId: string; isTyping: boolean },
    @ConnectedSocket() client: Socket,
  ) {
    client.to(data.sessionId).emit('userTyping', {
      clientId: client.id,
      isTyping: data.isTyping,
      timestamp: new Date(),
    });
  }

  @SubscribeMessage('heartbeat')
  handleHeartbeat(
    @MessageBody() data: { sessionId?: string },
    @ConnectedSocket() client: Socket,
  ) {
    const clientData = this.connectedClients.get(client.id);
    if (clientData) {
      clientData.lastSeen = new Date();
    }
    
    client.emit('heartbeatAck', { timestamp: new Date() });
  }

  @SubscribeMessage('getOnlineUsers')
  handleGetOnlineUsers(
    @MessageBody() data: { sessionId: string },
    @ConnectedSocket() client: Socket,
  ) {
    const onlineUsers = Array.from(this.connectedClients.entries())
      .filter(([_, clientData]) => clientData.sessionId === data.sessionId)
      .map(([clientId, clientData]) => ({
        clientId,
        lastSeen: clientData.lastSeen,
      }));

    client.emit('onlineUsers', { users: onlineUsers, count: onlineUsers.length });
  }

  // Cleanup inactive connections every 5 minutes
  private cleanupInterval = setInterval(() => {
    const fiveMinutesAgo = new Date(Date.now() - 5 * 60 * 1000);
    
    for (const [clientId, clientData] of this.connectedClients.entries()) {
      if (clientData.lastSeen < fiveMinutesAgo) {
        this.logger.warn(`Cleaning up inactive client: ${clientId}`);
        this.connectedClients.delete(clientId);
      }
    }
  }, 5 * 60 * 1000);
}