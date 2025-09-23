export interface WebSocketMessage {
  type:
    | "message"
    | "stream"
    | "error"
    | "ping"
    | "pong"
    | "connect"
    | "disconnect";
  payload: any;
  sessionId?: string;
  timestamp: Date;
}

export interface WebSocketConfig {
  url: string;
  protocols?: string[];
  reconnectAttempts: number;
  reconnectInterval: number;
  pingInterval: number;
}

export class WebSocketClient {
  private ws: WebSocket | null = null;
  private config: WebSocketConfig;
  private reconnectAttempts = 0;
  private reconnectTimeout: NodeJS.Timeout | null = null;
  private pingInterval: NodeJS.Timeout | null = null;
  private isConnecting = false;
  private messageHandlers: Map<string, (message: WebSocketMessage) => void> =
    new Map();
  private connectionHandlers: Map<string, () => void> = new Map();

  constructor(config: Partial<WebSocketConfig> = {}) {
    this.config = {
      url: config.url || "ws://localhost:3333/ws", // TODO: سيتم تحديث من VSC
      protocols: config.protocols,
      reconnectAttempts: config.reconnectAttempts || 5,
      reconnectInterval: config.reconnectInterval || 3000,
      pingInterval: config.pingInterval || 30000,
    };
  }

  // الاتصال بالخادم
  connect(sessionId?: string): Promise<void> {
    return new Promise((resolve, reject) => {
      if (
        this.isConnecting ||
        (this.ws && this.ws.readyState === WebSocket.OPEN)
      ) {
        resolve();
        return;
      }

      this.isConnecting = true;

      try {
        const url = sessionId
          ? `${this.config.url}?sessionId=${sessionId}`
          : this.config.url;
        this.ws = new WebSocket(url, this.config.protocols);

        this.ws.onopen = () => {
          console.log("WebSocket connected");
          this.isConnecting = false;
          this.reconnectAttempts = 0;
          this.startPing();
          this.emitConnectionEvent("connected");
          resolve();
        };

        this.ws.onmessage = (event) => {
          try {
            const message: WebSocketMessage = JSON.parse(event.data);
            this.handleMessage(message);
          } catch (error) {
            console.error("Failed to parse WebSocket message:", error);
          }
        };

        this.ws.onclose = (event) => {
          console.log("WebSocket disconnected:", event.code, event.reason);
          this.isConnecting = false;
          this.stopPing();
          this.emitConnectionEvent("disconnected");

          // محاولة إعادة الاتصال إذا لم يكن إغلاق متعمد
          if (
            event.code !== 1000 &&
            this.reconnectAttempts < this.config.reconnectAttempts
          ) {
            this.scheduleReconnect();
          }
        };

        this.ws.onerror = (error) => {
          console.error("WebSocket error:", error);
          this.isConnecting = false;
          reject(error);
        };
      } catch (error) {
        this.isConnecting = false;
        reject(error);
      }
    });
  }

  // إغلاق الاتصال
  disconnect(): void {
    if (this.reconnectTimeout) {
      clearTimeout(this.reconnectTimeout);
      this.reconnectTimeout = null;
    }

    this.stopPing();

    if (this.ws) {
      this.ws.close(1000, "Client disconnect");
      this.ws = null;
    }

    this.emitConnectionEvent("disconnected");
  }

  // إرسال رسالة
  send(type: WebSocketMessage["type"], payload: any, sessionId?: string): void {
    if (!this.ws || this.ws.readyState !== WebSocket.OPEN) {
      console.warn("WebSocket is not connected");
      return;
    }

    const message: WebSocketMessage = {
      type,
      payload,
      sessionId,
      timestamp: new Date(),
    };

    this.ws.send(JSON.stringify(message));
  }

  // إرسال رسالة نصية
  sendMessage(text: string, sessionId?: string): void {
    this.send("message", { text }, sessionId);
  }

  // تسجيل معالج لنوع رسالة معين
  onMessage(type: string, handler: (message: WebSocketMessage) => void): void {
    this.messageHandlers.set(type, handler);
  }

  // إزالة معالج رسالة
  offMessage(type: string): void {
    this.messageHandlers.delete(type);
  }

  // تسجيل معالج لحدث اتصال
  onConnection(event: string, handler: () => void): void {
    this.connectionHandlers.set(event, handler);
  }

  // إزالة معالج اتصال
  offConnection(event: string): void {
    this.connectionHandlers.delete(event);
  }

  // الحصول على حالة الاتصال
  getConnectionState(): string {
    if (!this.ws) return "disconnected";

    switch (this.ws.readyState) {
      case WebSocket.CONNECTING:
        return "connecting";
      case WebSocket.OPEN:
        return "connected";
      case WebSocket.CLOSING:
        return "closing";
      case WebSocket.CLOSED:
        return "disconnected";
      default:
        return "unknown";
    }
  }

  // التحقق من الاتصال
  isConnected(): boolean {
    return this.ws?.readyState === WebSocket.OPEN;
  }

  // إعادة الاتصال التلقائي
  private scheduleReconnect(): void {
    if (this.reconnectAttempts >= this.config.reconnectAttempts) {
      console.error("Max reconnection attempts reached");
      return;
    }

    this.reconnectAttempts++;
    console.log(
      `Attempting to reconnect (${this.reconnectAttempts}/${this.config.reconnectAttempts})...`
    );

    this.reconnectTimeout = setTimeout(() => {
      this.connect();
    }, this.config.reconnectInterval);
  }

  // بدء إرسال ping للحفاظ على الاتصال
  private startPing(): void {
    this.pingInterval = setInterval(() => {
      if (this.isConnected()) {
        this.send("ping", {});
      }
    }, this.config.pingInterval);
  }

  // إيقاف إرسال ping
  private stopPing(): void {
    if (this.pingInterval) {
      clearInterval(this.pingInterval);
      this.pingInterval = null;
    }
  }

  // معالجة الرسائل الواردة
  private handleMessage(message: WebSocketMessage): void {
    // معالجة ping/pong
    if (message.type === "ping") {
      this.send("pong", {});
      return;
    }

    // استدعاء معالج النوع المناسب
    const handler = this.messageHandlers.get(message.type);
    if (handler) {
      handler(message);
    } else {
      console.log("Unhandled WebSocket message type:", message.type, message);
    }
  }

  // إرسال حدث اتصال
  private emitConnectionEvent(event: string): void {
    const handler = this.connectionHandlers.get(event);
    if (handler) {
      handler();
    }
  }

  // تنظيف الموارد
  destroy(): void {
    this.disconnect();
    this.messageHandlers.clear();
    this.connectionHandlers.clear();
  }
}

export const webSocketClient = new WebSocketClient();
