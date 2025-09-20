import { apiClient } from './api.client';

export interface ChatMessage {
  content: string;
  role: 'user' | 'assistant';
  sessionId?: string;
}

export interface ChatResponse {
  id: string;
  content: string;
  role: 'assistant';
  model: string;
  tokens: number;
  processingTime: number;
  sessionId: string;
}

export interface ChatSession {
  id: string;
  title: string;
  createdAt: string;
  updatedAt: string;
}

class ChatService {
  /**
   * إرسال رسالة للمساعد الذكي
   */
  async sendMessage(message: ChatMessage): Promise<ChatResponse> {
    try {
      const response = await apiClient.post<ChatResponse>('/chat/message', {
        content: message.content,
        role: message.role,
        sessionId: message.sessionId
      });

      if (!response.success) {
        throw new Error(response.message || 'فشل في إرسال الرسالة');
      }

      return response.data;
    } catch (error: any) {
      console.error('خطأ في إرسال الرسالة:', error);
      throw new Error(error.message || 'فشل في الاتصال بالمساعد الذكي');
    }
  }

  /**
   * إنشاء جلسة محادثة جديدة
   */
  async createSession(title?: string): Promise<ChatSession> {
    try {
      const response = await apiClient.post<ChatSession>('/chat/session', {
        title: title || 'محادثة جديدة'
      });

      if (!response.success) {
        throw new Error(response.message || 'فشل في إنشاء الجلسة');
      }

      return response.data;
    } catch (error: any) {
      console.error('خطأ في إنشاء الجلسة:', error);
      throw new Error(error.message || 'فشل في إنشاء جلسة جديدة');
    }
  }

  /**
   * الحصول على تاريخ المحادثات
   */
  async getChatHistory(sessionId: string): Promise<ChatMessage[]> {
    try {
      const response = await apiClient.get<ChatMessage[]>(`/chat/history/${sessionId}`);

      if (!response.success) {
        throw new Error(response.message || 'فشل في جلب التاريخ');
      }

      return response.data;
    } catch (error: any) {
      console.error('خطأ في جلب التاريخ:', error);
      throw new Error(error.message || 'فشل في جلب تاريخ المحادثة');
    }
  }

  /**
   * الحصول على جميع الجلسات
   */
  async getSessions(): Promise<ChatSession[]> {
    try {
      const response = await apiClient.get<ChatSession[]>('/chat/sessions');

      if (!response.success) {
        throw new Error(response.message || 'فشل في جلب الجلسات');
      }

      return response.data;
    } catch (error: any) {
      console.error('خطأ في جلب الجلسات:', error);
      throw new Error(error.message || 'فشل في جلب قائمة الجلسات');
    }
  }

  /**
   * حذف جلسة محادثة
   */
  async deleteSession(sessionId: string): Promise<void> {
    try {
      const response = await apiClient.delete(`/chat/session/${sessionId}`);

      if (!response.success) {
        throw new Error(response.message || 'فشل في حذف الجلسة');
      }
    } catch (error: any) {
      console.error('خطأ في حذف الجلسة:', error);
      throw new Error(error.message || 'فشل في حذف الجلسة');
    }
  }

  /**
   * تحديث عنوان الجلسة
   */
  async updateSessionTitle(sessionId: string, title: string): Promise<ChatSession> {
    try {
      const response = await apiClient.patch<ChatSession>(`/chat/session/${sessionId}`, {
        title
      });

      if (!response.success) {
        throw new Error(response.message || 'فشل في تحديث العنوان');
      }

      return response.data;
    } catch (error: any) {
      console.error('خطأ في تحديث العنوان:', error);
      throw new Error(error.message || 'فشل في تحديث عنوان الجلسة');
    }
  }

  /**
   * إيقاف الرسالة الجارية
   */
  async stopGeneration(sessionId: string): Promise<void> {
    try {
      const response = await apiClient.post(`/chat/stop/${sessionId}`);

      if (!response.success) {
        throw new Error(response.message || 'فشل في إيقاف التوليد');
      }
    } catch (error: any) {
      console.error('خطأ في إيقاف التوليد:', error);
      throw new Error(error.message || 'فشل في إيقاف توليد الرسالة');
    }
  }
}

export const chatService = new ChatService();