import { Server } from 'socket.io';

export class LiveSessionManager {
  private io: Server;
  private activeSessions = new Map();

  constructor(server: any) {
    this.io = new Server(server);
    this.setupEventHandlers();
  }

  private setupEventHandlers() {
    this.io.on('connection', (socket) => {
      socket.on('join-session', (sessionId) => {
        socket.join(sessionId);
        this.activeSessions.set(sessionId, socket.id);
      });

      socket.on('leave-session', (sessionId) => {
        socket.leave(sessionId);
        this.activeSessions.delete(sessionId);
      });
    });
  }

  broadcastToSession(sessionId: string, event: string, data: any) {
    this.io.to(sessionId).emit(event, data);
  }

  getActiveSessions() {
    return Array.from(this.activeSessions.keys());
  }
}