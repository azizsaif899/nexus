import { WebSocketGateway, WebSocketServer, SubscribeMessage, OnGatewayConnection, OnGatewayDisconnect } from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';

@WebSocketGateway()
export class LiveGateway implements OnGatewayConnection, OnGatewayDisconnect {
  @WebSocketServer()
  server: Server;

  private connectionCount = 0;

  handleConnection(client: Socket, ...args: any[]) {
    this.connectionCount++;
    this.server.emit('metrics', { connectionCount: this.connectionCount });
    console.log(`Client connected: ${client.id}`);
  }

  handleDisconnect(client: Socket) {
    this.connectionCount--;
    this.server.emit('metrics', { connectionCount: this.connectionCount });
    console.log(`Client disconnected: ${client.id}`);
  }

  @SubscribeMessage('message')
  handleMessage(client: Socket, payload: any): void {
    const startTime = Date.now();
    this.server.emit('message', payload);
    const endTime = Date.now();
    const latency = endTime - startTime;
    this.server.emit('metrics', { latency });
  }
}
