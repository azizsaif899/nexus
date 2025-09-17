export interface LiveSessionConfig {
  sessionId: string;
  userId: string;
  wsUrl: string;
}

export class LiveSessionService {
  private ws: WebSocket | null = null;
  private config: LiveSessionConfig;
  private reconnectAttempts = 0;
  private maxReconnectAttempts = 5;

  constructor(config: LiveSessionConfig) {
    this.config = config;
  }

  connect(): Promise<void> {
    return new Promise((resolve, reject) => {
      try {
        this.ws = new WebSocket(`${this.config.wsUrl}/live/${this.config.sessionId}`);
        
        this.ws.onopen = () => {
          // Removed console.log
          this.reconnectAttempts = 0;
          resolve();
        };

        this.ws.onclose = () => {
          // Removed console.log
          this.attemptReconnect();
        };

        this.ws.onerror = (error) => {
          console.error('WebSocket error:', error);
          reject(error);
        };

        this.ws.onmessage = (event) => {
          this.handleMessage(JSON.parse(event.data));
        };

      } catch (error) {
        reject(error);
      }
    });
  }

  disconnect(): void {
    if (this.ws) {
      this.ws.close();
      this.ws = null;
    }
  }

  sendMessage(type: string, payload: any): void {
    if (this.ws && this.ws.readyState === WebSocket.OPEN) {
      this.ws.send(JSON.stringify({ type, payload }));
    }
  }

  private handleMessage(data: any): void {
    // Removed console.log
    
    // Emit custom events for different message types
    const event = new CustomEvent(`live-session-${data.type}`, {
      detail: data.payload
    });
    window.dispatchEvent(event);
  }

  private attemptReconnect(): void {
    if (this.reconnectAttempts < this.maxReconnectAttempts) {
      this.reconnectAttempts++;
      // Removed console.log
      
      setTimeout(() => {
        this.connect().catch(console.error);
      }, 2000 * this.reconnectAttempts);
    }
  }

  isConnected(): boolean {
    return this.ws?.readyState === WebSocket.OPEN;
  }
}