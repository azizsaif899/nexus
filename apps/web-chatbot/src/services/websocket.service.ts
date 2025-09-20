export interface WebSocketMessage {
  type: 'message' | 'error' | 'status' | 'stream_start' | 'stream_chunk' | 'stream_end';
  data: any;
  sessionId?: string;
  messageId?: string;
}

export interface WebSocketConfig {
  url: string;
  reconnectInterval: number;
  maxReconnectAttempts: number;
  heartbeatInterval: number;
}

type WebSocketEventHandler = (message: WebSocketMessage) => void;
type ConnectionStatusHandler = (status: 'connecting' | 'connected' | 'disconnected' | 'error') => void;

class WebSocketService {
  private ws: WebSocket | null = null;
  private config: WebSocketConfig;
  private eventHandlers: Map<string, WebSocketEventHandler[]> = new Map();
  private statusHandlers: ConnectionStatusHandler[] = [];
  private reconnectAttempts = 0;
  private reconnectTimer: NodeJS.Timeout | null = null;
  private heartbeatTimer: NodeJS.Timeout | null = null;
  private isManualClose = false;

  constructor(config?: Partial<WebSocketConfig>) {
    this.config = {
      url: process.env.REACT_APP_WS_URL || 'ws://localhost:3333/ws',
      reconnectInterval: 3000,
      maxReconnectAttempts: 5,
      heartbeatInterval: 30000,
      ...config
    };
  }

  /**
   * الاتصال بالخادم
   */
  connect(): Promise<void> {
    return new Promise((resolve, reject) => {
      try {
        this.isManualClose = false;
        this.updateStatus('connecting');
        
        this.ws = new WebSocket(this.config.url);

        this.ws.onopen = () => {
          console.log('✅ WebSocket connected');
          this.reconnectAttempts = 0;
          this.updateStatus('connected');
          this.startHeartbeat();
          resolve();
        };

        this.ws.onmessage = (event) => {
          try {
            const message: WebSocketMessage = JSON.parse(event.data);
            this.handleMessage(message);
          } catch (error) {
            console.error('خطأ في تحليل رسالة WebSocket:', error);
          }
        };

        this.ws.onclose = (event) => {
          console.log('🔌 WebSocket disconnected:', event.code, event.reason);
          this.updateStatus('disconnected');
          this.stopHeartbeat();
          
          if (!this.isManualClose && this.reconnectAttempts < this.config.maxReconnectAttempts) {
            this.scheduleReconnect();
          }
        };

        this.ws.onerror = (error) => {
          console.error('❌ WebSocket error:', error);
          this.updateStatus('error');
          reject(error);
        };

      } catch (error) {
        console.error('فشل في إنشاء WebSocket:', error);
        reject(error);
      }
    });
  }

  /**
   * قطع الاتصال
   */
  disconnect(): void {
    this.isManualClose = true;
    this.stopHeartbeat();
    this.clearReconnectTimer();
    
    if (this.ws) {
      this.ws.close(1000, 'Manual disconnect');
      this.ws = null;
    }
    
    this.updateStatus('disconnected');
  }

  /**
   * إرسال رسالة
   */
  send(message: WebSocketMessage): boolean {
    if (!this.ws || this.ws.readyState !== WebSocket.OPEN) {
      console.warn('WebSocket غير متصل، لا يمكن إرسال الرسالة');
      return false;
    }

    try {
      this.ws.send(JSON.stringify(message));
      return true;
    } catch (error) {
      console.error('خطأ في إرسال رسالة WebSocket:', error);
      return false;
    }
  }

  /**
   * الاشتراك في نوع رسالة معين
   */
  on(eventType: string, handler: WebSocketEventHandler): () => void {
    if (!this.eventHandlers.has(eventType)) {
      this.eventHandlers.set(eventType, []);
    }
    
    this.eventHandlers.get(eventType)!.push(handler);

    // إرجاع دالة لإلغاء الاشتراك
    return () => {
      const handlers = this.eventHandlers.get(eventType);
      if (handlers) {
        const index = handlers.indexOf(handler);
        if (index > -1) {
          handlers.splice(index, 1);
        }
      }
    };
  }

  /**
   * الاشتراك في تغييرات حالة الاتصال
   */
  onStatusChange(handler: ConnectionStatusHandler): () => void {
    this.statusHandlers.push(handler);

    return () => {
      const index = this.statusHandlers.indexOf(handler);
      if (index > -1) {
        this.statusHandlers.splice(index, 1);
      }
    };
  }

  /**
   * الحصول على حالة الاتصال
   */
  getStatus(): 'connecting' | 'connected' | 'disconnected' | 'error' {
    if (!this.ws) return 'disconnected';
    
    switch (this.ws.readyState) {
      case WebSocket.CONNECTING:
        return 'connecting';
      case WebSocket.OPEN:
        return 'connected';
      case WebSocket.CLOSING:
      case WebSocket.CLOSED:
        return 'disconnected';
      default:
        return 'error';
    }
  }

  /**
   * معالجة الرسائل الواردة
   */
  private handleMessage(message: WebSocketMessage): void {
    const handlers = this.eventHandlers.get(message.type);
    if (handlers) {
      handlers.forEach(handler => {
        try {
          handler(message);
        } catch (error) {
          console.error(`خطأ في معالج ${message.type}:`, error);
        }
      });
    }

    // معالجة رسائل heartbeat
    if (message.type === 'heartbeat') {
      this.send({ type: 'heartbeat', data: 'pong' });
    }
  }

  /**
   * تحديث حالة الاتصال
   */
  private updateStatus(status: 'connecting' | 'connected' | 'disconnected' | 'error'): void {
    this.statusHandlers.forEach(handler => {
      try {
        handler(status);
      } catch (error) {
        console.error('خطأ في معالج حالة الاتصال:', error);
      }
    });
  }

  /**
   * جدولة إعادة الاتصال
   */
  private scheduleReconnect(): void {
    this.reconnectAttempts++;
    console.log(`🔄 محاولة إعادة الاتصال ${this.reconnectAttempts}/${this.config.maxReconnectAttempts}`);
    
    this.reconnectTimer = setTimeout(() => {
      this.connect().catch(error => {
        console.error('فشل في إعادة الاتصال:', error);
      });
    }, this.config.reconnectInterval);
  }

  /**
   * مسح مؤقت إعادة الاتصال
   */
  private clearReconnectTimer(): void {
    if (this.reconnectTimer) {
      clearTimeout(this.reconnectTimer);
      this.reconnectTimer = null;
    }
  }

  /**
   * بدء heartbeat
   */
  private startHeartbeat(): void {
    this.heartbeatTimer = setInterval(() => {
      if (this.ws && this.ws.readyState === WebSocket.OPEN) {
        this.send({ type: 'heartbeat', data: 'ping' });
      }
    }, this.config.heartbeatInterval);
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
}

export const websocketService = new WebSocketService();