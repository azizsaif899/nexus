import { apiService, QueryRequest, QueryResponse } from "./api.service";

export interface ChatMessage {
  id: string;
  text: string;
  sender: "user" | "ai";
  timestamp: Date;
  sessionId: string;
  messageType?: "text" | "streaming" | "error";
  metadata?: {
    confidence?: number;
    processingTime?: number;
    context?: string;
  };
}

export interface ChatSession {
  id: string;
  title: string;
  createdAt: Date;
  updatedAt: Date;
  messageCount: number;
  isActive: boolean;
}

export interface StreamingMessage {
  id: string;
  text: string;
  isComplete: boolean;
  sessionId: string;
}

export class ChatService {
  private currentSessionId: string | null = null;

  // إرسال رسالة واستقبال الرد
  async sendMessage(
    message: string,
    sessionId?: string
  ): Promise<QueryResponse> {
    const queryRequest: QueryRequest = {
      prompt: message,
      context: sessionId || this.currentSessionId || "general",
      language: "ar",
    };

    const response = await apiService.sendQuery(queryRequest);

    // تحديث sessionId الحالي إذا لم يكن موجوداً
    if (!this.currentSessionId && response.sessionId) {
      this.currentSessionId = response.sessionId;
    }

    return response;
  }

  // إنشاء جلسة محادثة جديدة
  async createSession(): Promise<{ sessionId: string }> {
    const result = await apiService.createChatSession();
    this.currentSessionId = result.sessionId;
    return result;
  }

  // الحصول على تاريخ المحادثة لجلسة معينة
  async getChatHistory(sessionId: string): Promise<ChatMessage[]> {
    try {
      const history = await apiService.getChatHistory(sessionId);

      // تحويل البيانات إلى ChatMessage format
      return history.map((item: any, index: number) => ({
        id: item.id || `msg-${index}`,
        text: item.text || item.message || "",
        sender: item.sender || (index % 2 === 0 ? "user" : "ai"),
        timestamp: item.timestamp ? new Date(item.timestamp) : new Date(),
        sessionId: sessionId,
        messageType: "text",
        metadata: {
          confidence: item.confidence || 0,
          processingTime: item.processingTime || 0,
          context: item.context || "general",
        },
      }));
    } catch (error) {
      console.error("Get chat history error:", error);
      return [];
    }
  }

  // تحويل رسالة نصية إلى ChatMessage
  createChatMessage(
    text: string,
    sender: "user" | "ai",
    sessionId?: string,
    metadata?: any
  ): ChatMessage {
    return {
      id: `msg-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
      text,
      sender,
      timestamp: new Date(),
      sessionId: sessionId || this.currentSessionId || "default",
      messageType: "text",
      metadata,
    };
  }

  // إنشاء رسالة خطأ
  createErrorMessage(error: string, sessionId?: string): ChatMessage {
    return {
      id: `error-${Date.now()}`,
      text: `عذراً، حدث خطأ: ${error}`,
      sender: "ai",
      timestamp: new Date(),
      sessionId: sessionId || this.currentSessionId || "default",
      messageType: "error",
    };
  }

  // إنشاء رسالة streaming
  createStreamingMessage(
    text: string,
    isComplete: boolean,
    sessionId?: string
  ): StreamingMessage {
    return {
      id: `stream-${Date.now()}`,
      text,
      isComplete,
      sessionId: sessionId || this.currentSessionId || "default",
    };
  }

  // الحصول على الجلسة الحالية
  getCurrentSessionId(): string | null {
    return this.currentSessionId;
  }

  // تعيين الجلسة الحالية
  setCurrentSessionId(sessionId: string): void {
    this.currentSessionId = sessionId;
  }

  // مسح الجلسة الحالية
  clearCurrentSession(): void {
    this.currentSessionId = null;
  }

  // اختبار اتصال Chat API
  async testConnection(): Promise<boolean> {
    try {
      const isHealthy = await apiService.healthCheck();
      return isHealthy;
    } catch (error) {
      console.error("Chat service connection test failed:", error);
      return false;
    }
  }

  // إعداد WebSocket للرسائل المتدفقة (placeholder للمستقبل)
  setupWebSocketConnection(sessionId: string): void {
    // TODO: تكامل مع VSC WebSocket server
    console.log(`WebSocket connection setup for session: ${sessionId}`);
  }

  // إغلاق WebSocket connection
  closeWebSocketConnection(): void {
    // TODO: تنفيذ إغلاق WebSocket
    console.log("WebSocket connection closed");
  }
}

export const chatService = new ChatService();
