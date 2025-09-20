import { create } from 'zustand';
import { devtools } from 'zustand/middleware';

export interface MessageMetadata {
  model?: string;
  tokens?: number;
  processingTime?: number;
  temperature?: number;
  maxTokens?: number;
}

export interface ChatMessage {
  id: string;
  content: string;
  role: 'user' | 'assistant' | 'system';
  timestamp: Date;
  status: 'sending' | 'sent' | 'error' | 'streaming';
  sessionId: string;
  metadata?: MessageMetadata;
  error?: string;
}

interface MessageState {
  // الحالة
  messages: Record<string, ChatMessage[]>; // sessionId -> messages
  streamingMessage: string | null; // ID of currently streaming message
  isGenerating: boolean;
  error: string | null;

  // الإجراءات
  addMessage: (sessionId: string, message: Omit<ChatMessage, 'id' | 'timestamp'>) => string;
  updateMessage: (messageId: string, updates: Partial<ChatMessage>) => void;
  deleteMessage: (sessionId: string, messageId: string) => void;
  
  // Streaming
  startStreaming: (messageId: string) => void;
  appendToStreamingMessage: (content: string) => void;
  finishStreaming: (metadata?: MessageMetadata) => void;
  stopStreaming: () => void;
  
  // Session management
  loadMessages: (sessionId: string, messages: ChatMessage[]) => void;
  clearMessages: (sessionId: string) => void;
  clearAllMessages: () => void;
  
  // Optimistic updates
  addOptimisticMessage: (sessionId: string, content: string) => string;
  confirmOptimisticMessage: (messageId: string, serverData: Partial<ChatMessage>) => void;
  rejectOptimisticMessage: (messageId: string, error: string) => void;
  
  // Utilities
  setError: (error: string | null) => void;
  setGenerating: (generating: boolean) => void;
}

export const useMessageStore = create<MessageState>()(
  devtools(
    (set, get) => ({
      // الحالة الأولية
      messages: {},
      streamingMessage: null,
      isGenerating: false,
      error: null,

      // إضافة رسالة جديدة
      addMessage: (sessionId, messageData) => {
        const messageId = `msg_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
        const message: ChatMessage = {
          id: messageId,
          timestamp: new Date(),
          sessionId,
          ...messageData
        };

        set((state) => ({
          messages: {
            ...state.messages,
            [sessionId]: [...(state.messages[sessionId] || []), message]
          }
        }));

        return messageId;
      },

      // تحديث رسالة موجودة
      updateMessage: (messageId, updates) => {
        set((state) => {
          const newMessages = { ...state.messages };
          
          for (const sessionId in newMessages) {
            const sessionMessages = newMessages[sessionId];
            const messageIndex = sessionMessages.findIndex(m => m.id === messageId);
            
            if (messageIndex !== -1) {
              newMessages[sessionId] = [
                ...sessionMessages.slice(0, messageIndex),
                { ...sessionMessages[messageIndex], ...updates },
                ...sessionMessages.slice(messageIndex + 1)
              ];
              break;
            }
          }

          return { messages: newMessages };
        });
      },

      // حذف رسالة
      deleteMessage: (sessionId, messageId) => {
        set((state) => ({
          messages: {
            ...state.messages,
            [sessionId]: (state.messages[sessionId] || []).filter(m => m.id !== messageId)
          }
        }));
      },

      // بدء streaming
      startStreaming: (messageId) => {
        set({ 
          streamingMessage: messageId, 
          isGenerating: true 
        });
        
        get().updateMessage(messageId, { 
          status: 'streaming',
          content: '' 
        });
      },

      // إضافة محتوى للرسالة المتدفقة
      appendToStreamingMessage: (content) => {
        const { streamingMessage } = get();
        if (!streamingMessage) return;

        set((state) => {
          const newMessages = { ...state.messages };
          
          for (const sessionId in newMessages) {
            const sessionMessages = newMessages[sessionId];
            const messageIndex = sessionMessages.findIndex(m => m.id === streamingMessage);
            
            if (messageIndex !== -1) {
              const currentMessage = sessionMessages[messageIndex];
              newMessages[sessionId] = [
                ...sessionMessages.slice(0, messageIndex),
                { 
                  ...currentMessage, 
                  content: currentMessage.content + content 
                },
                ...sessionMessages.slice(messageIndex + 1)
              ];
              break;
            }
          }

          return { messages: newMessages };
        });
      },

      // إنهاء streaming
      finishStreaming: (metadata) => {
        const { streamingMessage } = get();
        if (!streamingMessage) return;

        get().updateMessage(streamingMessage, {
          status: 'sent',
          metadata
        });

        set({ 
          streamingMessage: null, 
          isGenerating: false 
        });
      },

      // إيقاف streaming
      stopStreaming: () => {
        const { streamingMessage } = get();
        if (streamingMessage) {
          get().updateMessage(streamingMessage, {
            status: 'error',
            error: 'تم إيقاف التوليد'
          });
        }

        set({ 
          streamingMessage: null, 
          isGenerating: false 
        });
      },

      // تحميل رسائل جلسة
      loadMessages: (sessionId, messages) => {
        set((state) => ({
          messages: {
            ...state.messages,
            [sessionId]: messages
          }
        }));
      },

      // مسح رسائل جلسة
      clearMessages: (sessionId) => {
        set((state) => ({
          messages: {
            ...state.messages,
            [sessionId]: []
          }
        }));
      },

      // مسح جميع الرسائل
      clearAllMessages: () => {
        set({ messages: {} });
      },

      // إضافة رسالة متفائلة (Optimistic)
      addOptimisticMessage: (sessionId, content) => {
        return get().addMessage(sessionId, {
          content,
          role: 'user',
          status: 'sending'
        });
      },

      // تأكيد الرسالة المتفائلة
      confirmOptimisticMessage: (messageId, serverData) => {
        get().updateMessage(messageId, {
          ...serverData,
          status: 'sent'
        });
      },

      // رفض الرسالة المتفائلة
      rejectOptimisticMessage: (messageId, error) => {
        get().updateMessage(messageId, {
          status: 'error',
          error
        });
      },

      // تعيين خطأ
      setError: (error) => {
        set({ error });
      },

      // تعيين حالة التوليد
      setGenerating: (generating) => {
        set({ isGenerating: generating });
      }
    }),
    {
      name: 'message-store'
    }
  )
);

// Selectors مفيدة
export const useMessageSelectors = () => {
  const store = useMessageStore();
  
  return {
    getSessionMessages: (sessionId: string) => store.messages[sessionId] || [],
    getMessageById: (messageId: string) => {
      for (const sessionMessages of Object.values(store.messages)) {
        const message = sessionMessages.find(m => m.id === messageId);
        if (message) return message;
      }
      return null;
    },
    isStreamingMessage: (messageId: string) => store.streamingMessage === messageId,
    getLastMessage: (sessionId: string) => {
      const messages = store.messages[sessionId] || [];
      return messages[messages.length - 1] || null;
    },
    getMessageCount: (sessionId: string) => (store.messages[sessionId] || []).length
  };
};