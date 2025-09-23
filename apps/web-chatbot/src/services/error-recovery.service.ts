import { chatService, ChatMessage } from "./chat.service";
import { webSocketClient } from "./websocket-client.service";
import { messageStreamingHandler } from "./message-streaming.service";
import { chatSessionManager } from "./chat-session.service";

export interface RecoveryAction {
  id: string;
  type: "retry" | "reconnect" | "fallback" | "reset";
  description: string;
  execute: () => Promise<void>;
  priority: "low" | "medium" | "high" | "critical";
}

export interface ErrorContext {
  error: Error;
  operation: string;
  sessionId?: string;
  timestamp: Date;
  retryCount: number;
  userMessage?: string;
}

export class ErrorRecoveryService {
  private recoveryQueue: RecoveryAction[] = [];
  private isProcessing = false;
  private maxRetries = 3;
  private errorHistory: ErrorContext[] = [];
  private recoveryStrategies: Map<string, RecoveryAction[]> = new Map();

  constructor() {
    this.initializeRecoveryStrategies();
  }

  // معالجة خطأ وإنشاء خطة استرداد
  async handleError(
    error: Error,
    context: Partial<ErrorContext>
  ): Promise<void> {
    const errorContext: ErrorContext = {
      error,
      operation: context.operation || "unknown",
      sessionId: context.sessionId,
      timestamp: new Date(),
      retryCount: context.retryCount || 0,
      userMessage: context.userMessage,
    };

    // تسجيل الخطأ في التاريخ
    this.errorHistory.push(errorContext);

    console.error(`Error in ${errorContext.operation}:`, error);

    // إنشاء خطة الاسترداد
    const recoveryPlan = this.createRecoveryPlan(errorContext);

    if (recoveryPlan.length > 0) {
      // إضافة الإجراءات للطابور
      this.recoveryQueue.push(...recoveryPlan);

      // بدء معالجة الطابور
      this.processRecoveryQueue();
    } else {
      // لا توجد إجراءات استرداد، إشعار المستخدم
      this.notifyUserOfError(errorContext);
    }
  }

  // إنشاء خطة استرداد بناءً على نوع الخطأ
  private createRecoveryPlan(context: ErrorContext): RecoveryAction[] {
    const strategies = this.recoveryStrategies.get(context.operation);
    if (!strategies) {
      return this.getDefaultRecoveryPlan(context);
    }

    // تصفية الاستراتيجيات بناءً على عدد المحاولات
    return strategies.filter((strategy) => {
      if (context.retryCount >= this.maxRetries) {
        return strategy.type === "reset" || strategy.type === "fallback";
      }
      return true;
    });
  }

  // خطة الاسترداد الافتراضية
  private getDefaultRecoveryPlan(context: ErrorContext): RecoveryAction[] {
    const actions: RecoveryAction[] = [];

    // إعادة المحاولة إذا لم يتجاوز الحد الأقصى
    if (context.retryCount < this.maxRetries) {
      actions.push({
        id: `retry-${Date.now()}`,
        type: "retry",
        description: "إعادة المحاولة مرة أخرى",
        priority: "medium",
        execute: async () => {
          // TODO: تنفيذ إعادة المحاولة حسب العملية
          console.log(
            `Retrying ${context.operation} (attempt ${context.retryCount + 1})`
          );
        },
      });
    }

    // إعادة الاتصال إذا كان خطأ شبكة
    if (this.isNetworkError(context.error)) {
      actions.push({
        id: `reconnect-${Date.now()}`,
        type: "reconnect",
        description: "إعادة الاتصال بالخادم",
        priority: "high",
        execute: async () => {
          await this.reconnectServices();
        },
      });
    }

    // الرجوع للوضع الاحتياطي
    actions.push({
      id: `fallback-${Date.now()}`,
      type: "fallback",
      description: "الانتقال لوضع التشغيل المحدود",
      priority: "low",
      execute: async () => {
        await this.activateFallbackMode();
      },
    });

    return actions;
  }

  // تهيئة استراتيجيات الاسترداد للعمليات المختلفة
  private initializeRecoveryStrategies(): void {
    // استراتيجية لإرسال الرسائل
    this.recoveryStrategies.set("sendMessage", [
      {
        id: "message-retry",
        type: "retry",
        description: "إعادة إرسال الرسالة",
        priority: "high",
        execute: async () => {
          // TODO: تنفيذ إعادة إرسال الرسالة
          console.log("Retrying message send...");
        },
      },
      {
        id: "message-fallback",
        type: "fallback",
        description: "حفظ الرسالة محلياً للإرسال لاحقاً",
        priority: "medium",
        execute: async () => {
          await this.saveMessageLocally();
        },
      },
    ]);

    // استراتيجية للاتصال
    this.recoveryStrategies.set("websocket", [
      {
        id: "ws-reconnect",
        type: "reconnect",
        description: "إعادة الاتصال بـ WebSocket",
        priority: "critical",
        execute: async () => {
          await webSocketClient.connect();
        },
      },
      {
        id: "ws-fallback",
        type: "fallback",
        description: "الانتقال للاستطلاع الدوري",
        priority: "medium",
        execute: async () => {
          this.startPollingMode();
        },
      },
    ]);

    // استراتيجية للـ streaming
    this.recoveryStrategies.set("streaming", [
      {
        id: "stream-retry",
        type: "retry",
        description: "إعادة بدء الـ streaming",
        priority: "high",
        execute: async () => {
          messageStreamingHandler.cancelAllStreams();
          // TODO: إعادة بدء الـ streaming
        },
      },
    ]);
  }

  // معالجة طابور الاسترداد
  private async processRecoveryQueue(): Promise<void> {
    if (this.isProcessing || this.recoveryQueue.length === 0) {
      return;
    }

    this.isProcessing = true;

    try {
      // ترتيب الإجراءات حسب الأولوية
      this.recoveryQueue.sort((a, b) => {
        const priorityOrder = { critical: 4, high: 3, medium: 2, low: 1 };
        return priorityOrder[b.priority] - priorityOrder[a.priority];
      });

      // تنفيذ الإجراءات
      while (this.recoveryQueue.length > 0) {
        const action = this.recoveryQueue.shift()!;
        console.log(`Executing recovery action: ${action.description}`);

        try {
          await action.execute();
          console.log(`Recovery action completed: ${action.id}`);
        } catch (error) {
          console.error(`Recovery action failed: ${action.id}`, error);
        }

        // انتظار قصير بين الإجراءات
        await new Promise((resolve) => setTimeout(resolve, 1000));
      }
    } finally {
      this.isProcessing = false;
    }
  }

  // إعادة الاتصال بالخدمات
  private async reconnectServices(): Promise<void> {
    try {
      // إعادة الاتصال بـ WebSocket
      const activeSession = chatSessionManager.getActiveSession();
      if (activeSession) {
        await webSocketClient.connect(activeSession.id);
      }

      // اختبار اتصال API
      const isApiHealthy = await chatService.testConnection();
      if (!isApiHealthy) {
        throw new Error("API connection failed");
      }

      console.log("Services reconnected successfully");
    } catch (error) {
      console.error("Failed to reconnect services:", error);
      throw error;
    }
  }

  // تفعيل وضع التشغيل المحدود
  private async activateFallbackMode(): Promise<void> {
    console.log("Activating fallback mode...");

    // إيقاف WebSocket
    webSocketClient.disconnect();

    // إيقاف streaming
    messageStreamingHandler.cancelAllStreams();

    // تفعيل وضع الاستطلاع الدوري
    this.startPollingMode();

    // إشعار المستخدم
    this.notifyUserOfFallbackMode();
  }

  // بدء وضع الاستطلاع الدوري
  private startPollingMode(): void {
    // TODO: تنفيذ الاستطلاع الدوري للرسائل الجديدة
    console.log("Started polling mode for message updates");
  }

  // حفظ الرسالة محلياً
  private async saveMessageLocally(): Promise<void> {
    // TODO: حفظ الرسائل في localStorage للإرسال لاحقاً
    console.log("Message saved locally for later sending");
  }

  // إشعار المستخدم بالخطأ
  private notifyUserOfError(context: ErrorContext): void {
    const errorMessage = chatService.createErrorMessage(
      `حدث خطأ في ${context.operation}: ${context.error.message}`,
      context.sessionId
    );

    // TODO: إرسال الرسالة للمستخدم عبر UI
    console.error("User notification:", errorMessage);
  }

  // إشعار المستخدم بوضع التشغيل المحدود
  private notifyUserOfFallbackMode(): void {
    const fallbackMessage = chatService.createChatMessage(
      "⚠️ تم تفعيل وضع التشغيل المحدود بسبب مشاكل في الاتصال. بعض الميزات قد لا تعمل بشكل طبيعي.",
      "ai"
    );

    // TODO: إرسال الرسالة للمستخدم عبر UI
    console.warn("Fallback mode notification:", fallbackMessage);
  }

  // التحقق من أن الخطأ متعلق بالشبكة
  private isNetworkError(error: Error): boolean {
    const networkErrorMessages = [
      "network",
      "connection",
      "timeout",
      "offline",
      "fetch",
    ];

    const errorMessage = error.message.toLowerCase();
    return networkErrorMessages.some((msg) => errorMessage.includes(msg));
  }

  // الحصول على تاريخ الأخطاء
  getErrorHistory(): ErrorContext[] {
    return [...this.errorHistory];
  }

  // مسح تاريخ الأخطاء
  clearErrorHistory(): void {
    this.errorHistory = [];
  }

  // الحصول على إحصائيات الأخطاء
  getErrorStats(): {
    totalErrors: number;
    errorsByOperation: Record<string, number>;
    recentErrors: ErrorContext[];
  } {
    const errorsByOperation: Record<string, number> = {};

    this.errorHistory.forEach((error) => {
      errorsByOperation[error.operation] =
        (errorsByOperation[error.operation] || 0) + 1;
    });

    return {
      totalErrors: this.errorHistory.length,
      errorsByOperation,
      recentErrors: this.errorHistory.slice(-10), // آخر 10 أخطاء
    };
  }

  // إعادة تعيين الخدمة
  reset(): void {
    this.recoveryQueue = [];
    this.isProcessing = false;
    this.clearErrorHistory();

    // إعادة تشغيل الخدمات
    webSocketClient.disconnect();
    messageStreamingHandler.destroy();

    console.log("Error recovery service reset");
  }
}

export const errorRecoveryService = new ErrorRecoveryService();
