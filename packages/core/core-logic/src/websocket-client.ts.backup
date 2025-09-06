/**
 * 🔄 WebSocket Client - TASK-004
 * عميل WebSocket للتحديثات الفورية
 */

import { eventBus, EventTypes, SystemEvent } from './event-bus';

export interface WebSocketConfig {
  url: string;
  apiKey?: string;
  reconnectInterval?: number;
  maxReconnectAttempts?: number;
}

export class WebSocketClient {
  private ws: WebSocket | null = null;
  private config: WebSocketConfig;
  private reconnectAttempts = 0;
  private isConnected = false;
  private reconnectTimer: NodeJS.Timeout | null = null;
  private heartbeatTimer: NodeJS.Timeout | null = null;

  constructor(config: WebSocketConfig) {
    this.config = {
      reconnectInterval: 5000,
      maxReconnectAttempts: 10,
      ...config
    };
  }

  /**
   * الاتصال بالخادم
   */
  connect(): Promise<void> {
    return new Promise((resolve, reject) => {
      try {
        this.ws = new WebSocket(this.config.url);

        this.ws.onopen = () => {
          // Removed console.log
          this.isConnected = true;
          this.reconnectAttempts = 0;
          this.startHeartbeat();
          
          // إرسال مصادقة إذا كان هناك API key
          if (this.config.apiKey) {
            this.send({
              type: 'auth',
              apiKey: this.config.apiKey
            });
          }

          resolve();
        };

        this.ws.onmessage = (event) => {
          this.handleMessage(event.data);
        };

        this.ws.onclose = (event) => {
          // Removed console.log
          this.isConnected = false;
          this.stopHeartbeat();
          
          if (!event.wasClean && this.shouldReconnect()) {
            this.scheduleReconnect();
          }
        };

        this.ws.onerror = (error) => {
          console.error('❌ WebSocket error:', error);
          reject(error);
        };

      } catch (error) {
        reject(error);
      }
    });
  }

  /**
   * قطع الاتصال
   */
  disconnect(): void {
    if (this.reconnectTimer) {
      clearTimeout(this.reconnectTimer);
      this.reconnectTimer = null;
    }
    
    this.stopHeartbeat();
    
    if (this.ws) {
      this.ws.close(1000, 'Client disconnect');
      this.ws = null;
    }
    
    this.isConnected = false;
  }

  /**
   * إرسال رسالة
   */
  send(data: any): boolean {
    if (!this.isConnected || !this.ws) {
      console.warn('⚠️ WebSocket not connected, message queued');
      return false;
    }

    try {
      this.ws.send(JSON.stringify(data));
      return true;
    } catch (error) {
      console.error('❌ Failed to send WebSocket message:', error);
      return false;
    }
  }

  /**
   * الاشتراك في قناة
   */
  subscribe(channel: string): void {
    this.send({
      type: 'subscribe',
      channel
    });
  }

  /**
   * إلغاء الاشتراك من قناة
   */
  unsubscribe(channel: string): void {
    this.send({
      type: 'unsubscribe',
      channel
    });
  }

  /**
   * معالجة الرسائل الواردة
   */
  private handleMessage(data: string): void {
    try {
      const message = JSON.parse(data);
      
      switch (message.type) {
        case 'event':
          // نشر الحدث في Event Bus المحلي
          eventBus.emit(message.eventType, message.data);
          break;
          
        case 'heartbeat':
          // رد على heartbeat
          this.send({ type: 'heartbeat_ack' });
          break;
          
        case 'auth_success':
          // Removed console.log
          break;
          
        case 'auth_failed':
          console.error('❌ WebSocket authentication failed');
          break;
          
        case 'error':
          console.error('❌ WebSocket server error:', message.error);
          break;
          
        default:
          // Removed console.log
      }
    } catch (error) {
      console.error('❌ Failed to parse WebSocket message:', error);
    }
  }

  /**
   * بدء heartbeat
   */
  private startHeartbeat(): void {
    this.heartbeatTimer = setInterval(() => {
      if (this.isConnected) {
        this.send({ type: 'heartbeat' });
      }
    }, 30000); // كل 30 ثانية
  }

  /**
   * إيقاف heartbeat
   */
  private stopHeartbeat(): void {
    if (this.heartbeatTimer) {
      clearInterval(this.heartbeatTimer);
      this.heartbeatTimer = null;
    }
  }

  /**
   * تحديد ما إذا كان يجب إعادة الاتصال
   */
  private shouldReconnect(): boolean {
    return this.reconnectAttempts < (this.config.maxReconnectAttempts || 10);
  }

  /**
   * جدولة إعادة الاتصال
   */
  private scheduleReconnect(): void {
    if (this.reconnectTimer) {
      clearTimeout(this.reconnectTimer);
    }

    const delay = Math.min(
      (this.config.reconnectInterval || 5000) * Math.pow(2, this.reconnectAttempts),
      30000 // حد أقصى 30 ثانية
    );

    // Removed console.log`);

    this.reconnectTimer = setTimeout(() => {
      this.reconnectAttempts++;
      this.connect().catch(error => {
        console.error('❌ Reconnection failed:', error);
        if (this.shouldReconnect()) {
          this.scheduleReconnect();
        }
      });
    }, delay);
  }

  /**
   * الحصول على حالة الاتصال
   */
  getConnectionState(): {
    connected: boolean;
    reconnectAttempts: number;
    readyState?: number;
  } {
    return {
      connected: this.isConnected,
      reconnectAttempts: this.reconnectAttempts,
      readyState: this.ws?.readyState
    };
  }
}

// إنشاء عميل WebSocket عام
export const createWebSocketClient = (config: WebSocketConfig): WebSocketClient => {
  return new WebSocketClient(config);
};

// عميل WebSocket افتراضي للنظام
export const systemWebSocket = new WebSocketClient({
  url: process.env.NEXT_PUBLIC_WS_URL || 'ws://localhost:3001/ws',
  apiKey: process.env.NEXT_PUBLIC_WS_API_KEY
});

// تصدير أنواع الرسائل
export const WebSocketMessageTypes = {
  AUTH: 'auth',
  SUBSCRIBE: 'subscribe',
  UNSUBSCRIBE: 'unsubscribe',
  EVENT: 'event',
  HEARTBEAT: 'heartbeat',
  ERROR: 'error'
} as const;