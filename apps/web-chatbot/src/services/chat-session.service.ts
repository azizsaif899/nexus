import { chatService, ChatMessage, ChatSession } from "./chat.service";

export interface SessionConfig {
  autoSave: boolean;
  maxMessages: number;
  persistToStorage: boolean;
  syncWithServer: boolean;
}

export class ChatSessionManager {
  private sessions: Map<string, ChatSession> = new Map();
  private activeSessionId: string | null = null;
  private config: SessionConfig;
  private sessionMessages: Map<string, ChatMessage[]> = new Map();
  private storageKey = "chat_sessions";

  constructor(config: Partial<SessionConfig> = {}) {
    this.config = {
      autoSave: config.autoSave ?? true,
      maxMessages: config.maxMessages ?? 100,
      persistToStorage: config.persistToStorage ?? true,
      syncWithServer: config.syncWithServer ?? false,
    };

    this.loadSessionsFromStorage();
  }

  // إنشاء جلسة محادثة جديدة
  async createSession(title?: string): Promise<ChatSession> {
    try {
      // إنشاء session على الخادم
      const result = await chatService.createSession();

      const session: ChatSession = {
        id: result.sessionId,
        title: title || `محادثة ${new Date().toLocaleDateString("ar-SA")}`,
        createdAt: new Date(),
        updatedAt: new Date(),
        messageCount: 0,
        isActive: true,
      };

      // حفظ الجلسة محلياً
      this.sessions.set(session.id, session);
      this.sessionMessages.set(session.id, []);
      this.activeSessionId = session.id;

      // حفظ في التخزين المحلي
      if (this.config.persistToStorage) {
        this.saveSessionsToStorage();
      }

      console.log(`Created new chat session: ${session.id}`);
      return session;
    } catch (error) {
      console.error("Failed to create session:", error);
      // إنشاء session محلي في حالة فشل الخادم
      return this.createLocalSession(title);
    }
  }

  // إنشاء جلسة محلية (fallback)
  private createLocalSession(title?: string): ChatSession {
    const sessionId = `local-${Date.now()}-${Math.random()
      .toString(36)
      .substr(2, 9)}`;

    const session: ChatSession = {
      id: sessionId,
      title: title || `محادثة محلية ${new Date().toLocaleDateString("ar-SA")}`,
      createdAt: new Date(),
      updatedAt: new Date(),
      messageCount: 0,
      isActive: true,
    };

    this.sessions.set(session.id, session);
    this.sessionMessages.set(session.id, []);
    this.activeSessionId = session.id;

    return session;
  }

  // الحصول على الجلسة النشطة
  getActiveSession(): ChatSession | null {
    if (!this.activeSessionId) return null;
    return this.sessions.get(this.activeSessionId) || null;
  }

  // تعيين الجلسة النشطة
  setActiveSession(sessionId: string): boolean {
    const session = this.sessions.get(sessionId);
    if (!session) {
      console.warn(`Session ${sessionId} not found`);
      return false;
    }

    this.activeSessionId = sessionId;
    console.log(`Switched to session: ${sessionId}`);
    return true;
  }

  // إضافة رسالة لجلسة
  addMessageToSession(sessionId: string, message: ChatMessage): boolean {
    const session = this.sessions.get(sessionId);
    if (!session) {
      console.warn(`Session ${sessionId} not found`);
      return false;
    }

    // الحصول على رسائل الجلسة
    let messages = this.sessionMessages.get(sessionId) || [];

    // إضافة الرسالة
    messages.push(message);

    // تطبيق حد الرسائل القصوى
    if (messages.length > this.config.maxMessages) {
      messages = messages.slice(-this.config.maxMessages);
    }

    // تحديث الجلسة
    session.messageCount = messages.length;
    session.updatedAt = new Date();

    // حفظ التحديثات
    this.sessionMessages.set(sessionId, messages);
    this.sessions.set(sessionId, session);

    // حفظ في التخزين المحلي
    if (this.config.persistToStorage && this.config.autoSave) {
      this.saveSessionsToStorage();
    }

    return true;
  }

  // الحصول على رسائل جلسة
  getSessionMessages(sessionId: string): ChatMessage[] {
    return this.sessionMessages.get(sessionId) || [];
  }

  // الحصول على جميع الجلسات
  getAllSessions(): ChatSession[] {
    return Array.from(this.sessions.values()).sort(
      (a, b) => b.updatedAt.getTime() - a.updatedAt.getTime()
    );
  }

  // حذف جلسة
  deleteSession(sessionId: string): boolean {
    const session = this.sessions.get(sessionId);
    if (!session) {
      return false;
    }

    // إزالة الجلسة والرسائل
    this.sessions.delete(sessionId);
    this.sessionMessages.delete(sessionId);

    // إذا كانت الجلسة النشطة، مسح النشطة
    if (this.activeSessionId === sessionId) {
      this.activeSessionId = null;
    }

    // حفظ في التخزين المحلي
    if (this.config.persistToStorage) {
      this.saveSessionsToStorage();
    }

    console.log(`Deleted session: ${sessionId}`);
    return true;
  }

  // تحديث عنوان الجلسة
  updateSessionTitle(sessionId: string, title: string): boolean {
    const session = this.sessions.get(sessionId);
    if (!session) {
      return false;
    }

    session.title = title;
    session.updatedAt = new Date();

    this.sessions.set(sessionId, session);

    if (this.config.persistToStorage && this.config.autoSave) {
      this.saveSessionsToStorage();
    }

    return true;
  }

  // مسح جميع الجلسات
  clearAllSessions(): void {
    this.sessions.clear();
    this.sessionMessages.clear();
    this.activeSessionId = null;

    if (this.config.persistToStorage) {
      localStorage.removeItem(this.storageKey);
    }

    console.log("Cleared all sessions");
  }

  // تصدير جلسة
  exportSession(sessionId: string): {
    session: ChatSession;
    messages: ChatMessage[];
  } | null {
    const session = this.sessions.get(sessionId);
    const messages = this.sessionMessages.get(sessionId);

    if (!session || !messages) {
      return null;
    }

    return {
      session: { ...session },
      messages: [...messages],
    };
  }

  // استيراد جلسة
  importSession(data: {
    session: ChatSession;
    messages: ChatMessage[];
  }): boolean {
    try {
      const { session, messages } = data;

      // التحقق من عدم وجود الجلسة
      if (this.sessions.has(session.id)) {
        console.warn(`Session ${session.id} already exists`);
        return false;
      }

      // إضافة الجلسة والرسائل
      this.sessions.set(session.id, session);
      this.sessionMessages.set(session.id, messages);

      if (this.config.persistToStorage) {
        this.saveSessionsToStorage();
      }

      console.log(`Imported session: ${session.id}`);
      return true;
    } catch (error) {
      console.error("Failed to import session:", error);
      return false;
    }
  }

  // حفظ الجلسات في التخزين المحلي
  private saveSessionsToStorage(): void {
    try {
      const data = {
        sessions: Array.from(this.sessions.entries()),
        messages: Array.from(this.sessionMessages.entries()),
        activeSessionId: this.activeSessionId,
      };

      localStorage.setItem(this.storageKey, JSON.stringify(data));
    } catch (error) {
      console.error("Failed to save sessions to storage:", error);
    }
  }

  // تحميل الجلسات من التخزين المحلي
  private loadSessionsFromStorage(): void {
    try {
      const data = localStorage.getItem(this.storageKey);
      if (!data) return;

      const parsed = JSON.parse(data);

      // تحميل الجلسات
      if (parsed.sessions) {
        this.sessions = new Map(
          parsed.sessions.map(([id, session]: [string, any]) => [
            id,
            {
              ...session,
              createdAt: new Date(session.createdAt),
              updatedAt: new Date(session.updatedAt),
            },
          ])
        );
      }

      // تحميل الرسائل
      if (parsed.messages) {
        this.sessionMessages = new Map(
          parsed.messages.map(([id, messages]: [string, any[]]) => [
            id,
            messages.map((msg: any) => ({
              ...msg,
              timestamp: new Date(msg.timestamp),
            })),
          ])
        );
      }

      // تحميل الجلسة النشطة
      if (parsed.activeSessionId) {
        this.activeSessionId = parsed.activeSessionId;
      }

      console.log(`Loaded ${this.sessions.size} sessions from storage`);
    } catch (error) {
      console.error("Failed to load sessions from storage:", error);
    }
  }

  // مزامنة مع الخادم (للمستقبل)
  async syncWithServer(): Promise<void> {
    if (!this.config.syncWithServer) return;

    try {
      // TODO: تنفيذ مزامنة الجلسات مع VSC
      console.log("Syncing sessions with server...");
    } catch (error) {
      console.error("Failed to sync with server:", error);
    }
  }

  // إحصائيات الجلسات
  getStats(): {
    totalSessions: number;
    activeSession: string | null;
    totalMessages: number;
    averageMessagesPerSession: number;
  } {
    const totalSessions = this.sessions.size;
    const totalMessages = Array.from(this.sessionMessages.values()).reduce(
      (sum, messages) => sum + messages.length,
      0
    );

    return {
      totalSessions,
      activeSession: this.activeSessionId,
      totalMessages,
      averageMessagesPerSession:
        totalSessions > 0 ? totalMessages / totalSessions : 0,
    };
  }

  // تنظيف الجلسات القديمة
  cleanupOldSessions(maxAgeDays: number = 30): number {
    const cutoffDate = new Date();
    cutoffDate.setDate(cutoffDate.getDate() - maxAgeDays);

    let deletedCount = 0;
    const sessionIds = Array.from(this.sessions.keys());

    for (const sessionId of sessionIds) {
      const session = this.sessions.get(sessionId);
      if (
        session &&
        session.updatedAt < cutoffDate &&
        session.id !== this.activeSessionId
      ) {
        this.deleteSession(sessionId);
        deletedCount++;
      }
    }

    console.log(`Cleaned up ${deletedCount} old sessions`);
    return deletedCount;
  }
}

export const chatSessionManager = new ChatSessionManager();
