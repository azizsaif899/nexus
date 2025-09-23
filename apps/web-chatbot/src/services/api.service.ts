import { authService } from "./auth.service";

export interface QueryRequest {
  prompt: string;
  context?: string;
  language?: string;
}

export interface QueryResponse {
  success: boolean;
  query: string;
  response: string;
  timestamp: string;
  processingTime: number;
  confidence: number;
  context: string;
  sessionId: string;
}

export interface ApiError {
  message: string;
  status: number;
  code?: string;
}

export class ApiService {
  private baseUrl =
    process.env.REACT_APP_API_URL || "http://localhost:3333/api";
  private token: string | null = null;

  constructor() {
    // مراقبة تغييرات حالة المصادقة
    authService.onAuthStateChange((user) => {
      this.token = user ? "mock-jwt-token" : null; // TODO: الحصول على التوكن الحقيقي من FIR
    });
  }

  // إعداد headers مع التوكن
  private getHeaders(): Record<string, string> {
    const headers: Record<string, string> = {
      "Content-Type": "application/json",
    };

    if (this.token) {
      headers["Authorization"] = `Bearer ${this.token}`;
    }

    return headers;
  }

  // معالجة الاستجابة
  private async handleResponse<T>(response: Response): Promise<T> {
    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(
        errorData.message || `HTTP ${response.status}: ${response.statusText}`
      );
    }

    return response.json();
  }

  // معالجة الأخطاء
  private handleError(error: any, fallbackMessage: string): QueryResponse {
    console.error("API Error:", error);

    return {
      success: false,
      query: "",
      response: error.message || fallbackMessage,
      timestamp: new Date().toISOString(),
      processingTime: 0,
      confidence: 0,
      context: "error",
      sessionId: "",
    };
  }

  // إرسال استعلام
  async sendQuery(queryRequest: QueryRequest): Promise<QueryResponse> {
    try {
      const startTime = Date.now();

      const response = await fetch(`${this.baseUrl}/query`, {
        method: "POST",
        headers: this.getHeaders(),
        body: JSON.stringify(queryRequest),
      });

      const data = await this.handleResponse<QueryResponse>(response);
      const processingTime = Date.now() - startTime;

      return {
        ...data,
        processingTime,
      };
    } catch (error) {
      return this.handleError(
        error,
        "عذراً، حدث خطأ في معالجة طلبك. يرجى المحاولة مرة أخرى."
      );
    }
  }

  // الحصول على تاريخ المحادثات
  async getChatHistory(sessionId: string): Promise<any[]> {
    try {
      const response = await fetch(
        `${this.baseUrl}/chat/${sessionId}/history`,
        {
          method: "GET",
          headers: this.getHeaders(),
        }
      );

      return this.handleResponse<any[]>(response);
    } catch (error) {
      console.error("Get chat history error:", error);
      return [];
    }
  }

  // إنشاء جلسة محادثة جديدة
  async createChatSession(): Promise<{ sessionId: string }> {
    try {
      const response = await fetch(`${this.baseUrl}/chat/session`, {
        method: "POST",
        headers: this.getHeaders(),
        body: JSON.stringify({}),
      });

      return this.handleResponse<{ sessionId: string }>(response);
    } catch (error) {
      console.error("Create session error:", error);
      return { sessionId: `fallback-${Date.now()}` };
    }
  }

  // اختبار اتصال API
  async healthCheck(): Promise<boolean> {
    try {
      const response = await fetch(`${this.baseUrl}/health`, {
        method: "GET",
        headers: this.getHeaders(),
      });

      return response.ok;
    } catch (error) {
      console.error("Health check error:", error);
      return false;
    }
  }
}

export const apiService = new ApiService();
