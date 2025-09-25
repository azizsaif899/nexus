import { io, Socket } from 'socket.io-client';

export interface WebSocketConfig {
  url: string;
  options?: {
    transports?: string[];
    timeout?: number;
    reconnection?: boolean;
    reconnectionAttempts?: number;
    reconnectionDelay?: number;
  };
}

export interface ConnectionState {
  isConnected: boolean;
  isConnecting: boolean;
  lastConnected?: Date;
  lastDisconnected?: Date;
  connectionAttempts: number;
  error?: string;
}

export class WebSocketManager {
  private socket: Socket | null = null;
  private config: WebSocketConfig;
  private connectionState: ConnectionState = {
    isConnected: false,
    isConnecting: false,
    connectionAttempts: 0,
  };
  private heartbeatInterval: NodeJS.Timeout | null = null;
  private reconnectTimeout: NodeJS.Timeout | null = null;
  private listeners: Map<string, Function[]> = new Map();

  // Connection pooling
  private connectionPool: Socket[] = [];
  private maxPoolSize = 5;

  constructor(config: WebSocketConfig) {
    this.config = {
      url: config.url,
      options: {
        transports: ['websocket', 'polling'],
        timeout: 5000,
        reconnection: true,
        reconnectionAttempts: 5,
        reconnectionDelay: 1000,
        ...config.options,
      },
    };
  }

  // Connection management
  async connect(): Promise<void> {
    if (this.connectionState.isConnecting || this.connectionState.isConnected) {
      return;
    }

    this.connectionState.isConnecting = true;
    this.connectionState.connectionAttempts++;

    try {
      this.socket = io(this.config.url, this.config.options);

      return new Promise((resolve, reject) => {
        const timeout = setTimeout(() => {
          this.connectionState.isConnecting = false;
          reject(new Error('Connection timeout'));
        }, this.config.options?.timeout || 5000);

        this.socket!.on('connect', () => {
          clearTimeout(timeout);
          this.connectionState.isConnected = true;
          this.connectionState.isConnecting = false;
          this.connectionState.lastConnected = new Date();
          this.connectionState.error = undefined;

          this.startHeartbeat();
          this.emit('connected');
          resolve();
        });

        this.socket!.on('connect_error', (error: any) => {
          clearTimeout(timeout);
          this.connectionState.isConnecting = false;
          this.connectionState.error = error.message;
          this.emit('connection_error', error);
          reject(error);
        });

        this.socket!.on('disconnect', (reason: string) => {
          this.connectionState.isConnected = false;
          this.connectionState.lastDisconnected = new Date();
          this.stopHeartbeat();
          this.emit('disconnected', reason);

          if (reason === 'io server disconnect') {
            // Server disconnected, try to reconnect
            this.scheduleReconnect();
          }
        });

        // Message handling
        this.socket!.on('message', (data: any) => {
          this.emit('message', data);
        });

        this.socket!.on('chat_message', (data: any) => {
          this.emit('chat_message', data);
        });

        this.socket!.on('typing', (data: any) => {
          this.emit('typing', data);
        });

        this.socket!.on('user_joined', (data: any) => {
          this.emit('user_joined', data);
        });

        this.socket!.on('user_left', (data: any) => {
          this.emit('user_left', data);
        });
      });
    } catch (error) {
      this.connectionState.isConnecting = false;
      throw error;
    }
  }

  disconnect(): void {
    if (this.socket) {
      this.socket.disconnect();
      this.socket = null;
    }

    this.connectionState.isConnected = false;
    this.connectionState.isConnecting = false;
    this.stopHeartbeat();
    this.stopReconnect();

    // Clean up connection pool
    this.connectionPool.forEach(socket => socket.disconnect());
    this.connectionPool = [];

    this.emit('disconnected', 'manual');
  }

  // Heartbeat for connection monitoring
  private startHeartbeat(): void {
    this.heartbeatInterval = setInterval(() => {
      if (this.socket && this.connectionState.isConnected) {
        this.socket.emit('ping');
      }
    }, 30000); // 30 seconds
  }

  private stopHeartbeat(): void {
    if (this.heartbeatInterval) {
      clearInterval(this.heartbeatInterval);
      this.heartbeatInterval = null;
    }
  }

  // Reconnection logic
  private scheduleReconnect(): void {
    if (this.reconnectTimeout) return;

    const delay = Math.min(
      (this.config.options?.reconnectionDelay || 1000) * Math.pow(2, this.connectionState.connectionAttempts),
      30000 // Max 30 seconds
    );

    this.reconnectTimeout = setTimeout(() => {
      this.reconnectTimeout = null;
      if (!this.connectionState.isConnected) {
        this.connect().catch(error => {
          console.error('Reconnection failed:', error);
          this.scheduleReconnect();
        });
      }
    }, delay);
  }

  private stopReconnect(): void {
    if (this.reconnectTimeout) {
      clearTimeout(this.reconnectTimeout);
      this.reconnectTimeout = null;
    }
  }

  // Message sending
  send(event: string, data: any): void {
    if (this.socket && this.connectionState.isConnected) {
      this.socket.emit(event, data);
    } else {
      throw new Error('WebSocket is not connected');
    }
  }

  sendMessage(message: any): void {
    this.send('chat_message', message);
  }

  sendTyping(isTyping: boolean): void {
    this.send('typing', { isTyping });
  }

  // Connection pooling
  private getPooledConnection(): Socket | null {
    if (this.connectionPool.length > 0) {
      return this.connectionPool.pop()!;
    }
    return null;
  }

  private returnToPool(socket: Socket): void {
    if (this.connectionPool.length < this.maxPoolSize) {
      this.connectionPool.push(socket);
    } else {
      socket.disconnect();
    }
  }

  // Event system
  on(event: string, callback: Function): void {
    if (!this.listeners.has(event)) {
      this.listeners.set(event, []);
    }
    this.listeners.get(event)!.push(callback);
  }

  off(event: string, callback: Function): void {
    const eventListeners = this.listeners.get(event);
    if (eventListeners) {
      const index = eventListeners.indexOf(callback);
      if (index > -1) {
        eventListeners.splice(index, 1);
      }
    }
  }

  private emit(event: string, ...args: any[]): void {
    const eventListeners = this.listeners.get(event);
    if (eventListeners) {
      eventListeners.forEach(callback => callback(...args));
    }
  }

  // State getters
  getConnectionState(): ConnectionState {
    return { ...this.connectionState };
  }

  isConnected(): boolean {
    return this.connectionState.isConnected;
  }

  // Cleanup
  destroy(): void {
    this.disconnect();
    this.listeners.clear();
  }
}

// Singleton instance
let websocketManager: WebSocketManager | null = null;

export const getWebSocketManager = (config?: WebSocketConfig): WebSocketManager => {
  if (!websocketManager && config) {
    websocketManager = new WebSocketManager(config);
  }
  if (!websocketManager) {
    throw new Error('WebSocketManager not initialized. Provide config on first call.');
  }
  return websocketManager;
};

export const initializeWebSocket = (config: WebSocketConfig): WebSocketManager => {
  websocketManager = new WebSocketManager(config);
  return websocketManager;
};