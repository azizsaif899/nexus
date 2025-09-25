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
  retryable?: boolean;
}

export interface RequestConfig {
  timeout?: number;
  retries?: number;
  retryDelay?: number;
}

export class ApiService {
  private baseUrl =
    process.env.REACT_APP_API_URL || "http://localhost:3333/api";
  private token: string | null = null;
  private abortControllers = new Map<string, AbortController>();

  // إعدادات افتراضية
  private defaultConfig: RequestConfig = {
    timeout: 30000, // 30 ثانية
    retries: 3,
    retryDelay: 1000, // 1 ثانية
  };

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
      "Accept": "application/json",
    };

    if (this.token) {
      headers["Authorization"] = `Bearer ${this.token}`;
    }

    return headers;
  }

  // إنشاء AbortController للطلب
  private createAbortController(requestId: string): AbortController {
    const controller = new AbortController();
    this.abortControllers.set(requestId, controller);
    return controller;
  }

  // إلغاء طلب محدد
  cancelRequest(requestId: string): void {
    const controller = this.abortControllers.get(requestId);
    if (controller) {
      controller.abort();
      this.abortControllers.delete(requestId);
    }
  }

  // إلغاء جميع الطلبات
  cancelAllRequests(): void {
    this.abortControllers.forEach((controller) => controller.abort());
    this.abortControllers.clear();
  }

  // معالجة الاستجابة مع interceptors
  private async handleResponse<T>(
    response: Response,
    config: RequestConfig = {}
  ): Promise<T> {
    // Response interceptor
    this.onResponse(response);

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      const apiError: ApiError = {
        message: errorData.message || `HTTP ${response.status}: ${response.statusText}`,
        status: response.status,
        code: errorData.code,
        retryable: this.isRetryableError(response.status),
      };
      throw apiError;
    }

    const data = await response.json();
    return data;
  }

  // التحقق من إمكانية إعادة المحاولة
  private isRetryableError(status: number): boolean {
    return status >= 500 || status === 408 || status === 429;
  }

  // تنفيذ الطلب مع retry logic
  private async executeWithRetry<T>(
    requestFn: () => Promise<T>,
    config: RequestConfig,
    requestId: string
  ): Promise<T> {
    const { retries = this.defaultConfig.retries!, retryDelay = this.defaultConfig.retryDelay! } = config;
    let lastError: any;

    for (let attempt = 0; attempt <= retries; attempt++) {
      try {
        // Request interceptor
        this.onRequest(requestId, attempt);

        const result = await requestFn();

        // Success interceptor
        this.onSuccess(requestId, attempt);

        return result;
      } catch (error) {
        lastError = error;

        // Error interceptor
        this.onError(requestId, attempt, error);

        // لا نعيد المحاولة إذا كان الخطأ غير قابل للإعادة أو إذا كان آخر محاولة
        if (!this.shouldRetry(error, attempt, retries)) {
          break;
        }

        // انتظار قبل إعادة المحاولة
        if (attempt < retries) {
          await this.delay(retryDelay * Math.pow(2, attempt)); // Exponential backoff
        }
      }
    }

    throw lastError;
  }

  // التحقق من إمكانية إعادة المحاولة
  private shouldRetry(error: any, attempt: number, maxRetries: number): boolean {
    if (attempt >= maxRetries) return false;
    if (error.name === 'AbortError') return false; // لا نعيد المحاولة للطلبات الملغاة
    if (error.retryable === false) return false;
    return error.retryable !== false; // نعيد المحاولة للأخطاء القابلة للإعادة
  }

  // تأخير
  private delay(ms: number): Promise<void> {
    return new Promise(resolve => setTimeout(resolve, ms));
  }

  // Request interceptor
  private onRequest(requestId: string, attempt: number): void {
    console.log(`[API] Request ${requestId} - Attempt ${attempt + 1}`);
  }

  // Response interceptor
  private onResponse(response: Response): void {
    console.log(`[API] Response: ${response.status} ${response.statusText}`);
  }

  // Success interceptor
  private onSuccess(requestId: string, attempt: number): void {
    console.log(`[API] Success ${requestId} - Attempt ${attempt + 1}`);
    this.abortControllers.delete(requestId);
  }

  // Error interceptor
  private onError(requestId: string, attempt: number, error: any): void {
    console.error(`[API] Error ${requestId} - Attempt ${attempt + 1}:`, error);
  }

  // معالجة الأخطاء المحسنة
  private handleError(error: any, fallbackMessage: string): QueryResponse {
    console.error("API Error:", error);

    let errorMessage = fallbackMessage;
    if (error.message) {
      errorMessage = error.message;
    } else if (error.status) {
      errorMessage = `خطأ في الخادم (${error.status})`;
    }

    return {
      success: false,
      query: "",
      response: errorMessage,
      timestamp: new Date().toISOString(),
      processingTime: 0,
      confidence: 0,
      context: "error",
      sessionId: "",
    };
  }

  // إرسال طلب HTTP عام مع timeout و retry
  private async makeRequest<T>(
    url: string,
    options: RequestInit,
    config: RequestConfig = {}
  ): Promise<T> {
    const requestId = `req_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
    const controller = this.createAbortController(requestId);

    const finalConfig = { ...this.defaultConfig, ...config };
    const { timeout = this.defaultConfig.timeout! } = finalConfig;

    // إعداد timeout
    const timeoutId = setTimeout(() => {
      controller.abort();
    }, timeout);

    const requestFn = async () => {
      try {
        const response = await fetch(url, {
          ...options,
          signal: controller.signal,
        });

        clearTimeout(timeoutId);
        return this.handleResponse<T>(response, finalConfig);
      } catch (error) {
        clearTimeout(timeoutId);
        if (error instanceof Error && error.name === 'AbortError') {
          throw new Error('Request timeout or cancelled');
        }
        throw error;
      }
    };

    return this.executeWithRetry(requestFn, finalConfig, requestId);
  }

  // إرسال استعلام
  async sendQuery(queryRequest: QueryRequest, config?: RequestConfig): Promise<QueryResponse> {
    try {
      const startTime = Date.now();

      const data = await this.makeRequest<QueryResponse>(
        `${this.baseUrl}/query`,
        {
          method: "POST",
          headers: this.getHeaders(),
          body: JSON.stringify(queryRequest),
        },
        config
      );

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
  async getChatHistory(sessionId: string, config?: RequestConfig): Promise<any[]> {
    try {
      return await this.makeRequest<any[]>(
        `${this.baseUrl}/chat/${sessionId}/history`,
        {
          method: "GET",
          headers: this.getHeaders(),
        },
        config
      );
    } catch (error) {
      console.error("Get chat history error:", error);
      return [];
    }
  }

  // إنشاء جلسة محادثة جديدة
  async createChatSession(config?: RequestConfig): Promise<{ sessionId: string }> {
    try {
      return await this.makeRequest<{ sessionId: string }>(
        `${this.baseUrl}/chat/session`,
        {
          method: "POST",
          headers: this.getHeaders(),
          body: JSON.stringify({}),
        },
        config
      );
    } catch (error) {
      console.error("Create session error:", error);
      return { sessionId: `fallback-${Date.now()}` };
    }
  }

  // اختبار اتصال API
  async healthCheck(config?: RequestConfig): Promise<boolean> {
    try {
      await this.makeRequest(
        `${this.baseUrl}/health`,
        {
          method: "GET",
          headers: this.getHeaders(),
        },
        { ...config, retries: 0 } // لا نعيد المحاولة للـ health check
      );
      return true;
    } catch (error) {
      console.error("Health check error:", error);
      return false;
    }
  }
}

export const apiService = new ApiService();
