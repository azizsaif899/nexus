import { create } from 'zustand';
import { subscribeWithSelector } from 'zustand/middleware';

export interface Message {
  id: string;
  content: string;
  sender: 'user' | 'ai';
  timestamp: Date;
  sessionId: string;
  status: 'sending' | 'sent' | 'delivered' | 'error';
  messageType: 'text' | 'streaming' | 'error' | 'system';
  metadata?: {
    confidence?: number;
    processingTime?: number;
    context?: string;
    error?: string;
    // File metadata
    fileUrl?: string;
    fileName?: string;
    fileSize?: number;
    fileType?: string;
  };
  isOptimistic?: boolean; // للتحديثات المتفائلة
}

export interface MessageStore {
  // State
  messages: Message[];
  isLoading: boolean;
  currentSessionId: string | null;
  messageQueue: Message[]; // قائمة انتظار للرسائل المرسلة
  lastMessageId: string | null;
  failedMessages: Message[]; // رسائل فاشلة تحتاج إعادة إرسال

  // Actions
  addMessage: (message: Omit<Message, 'id' | 'timestamp' | 'status'>) => string;
  updateMessage: (id: string, updates: Partial<Message>) => void;
  removeMessage: (id: string) => void;
  setLoading: (loading: boolean) => void;
  clearMessages: () => void;
  setSessionId: (sessionId: string) => void;

  // Optimistic updates
  addOptimisticMessage: (message: Omit<Message, 'id' | 'timestamp' | 'status' | 'isOptimistic'>) => string;
  confirmMessage: (optimisticId: string, serverMessage: Message) => void;
  failMessage: (optimisticId: string, error: string) => void;

  // Failed messages management
  addFailedMessage: (message: Message) => void;
  removeFailedMessage: (messageId: string) => void;
  retryFailedMessage: (messageId: string) => void;
  clearFailedMessages: () => void;
  getFailedMessages: () => Message[];

  // Message history
  loadMessages: (messages: Message[]) => void;
  appendMessages: (messages: Message[]) => void;

  // Queue management
  addToQueue: (message: Message) => void;
  removeFromQueue: (messageId: string) => void;
  processQueue: () => void;

  // Utility functions
  getMessagesBySession: (sessionId: string) => Message[];
  getLastMessage: () => Message | null;
  getMessageById: (id: string) => Message | undefined;
}

export const useMessageStore = create<MessageStore>()(
  subscribeWithSelector((set, get) => ({
    // Initial state
    messages: [],
    isLoading: false,
    currentSessionId: null,
    messageQueue: [],
    lastMessageId: null,
    failedMessages: [],

    // Actions
    addMessage: (message) => {
      const id = `msg-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
      const fullMessage: Message = {
        ...message,
        id,
        timestamp: new Date(),
        status: 'sent',
      };

      set((state) => ({
        messages: [...state.messages, fullMessage],
        lastMessageId: id,
      }));

      return id;
    },

    updateMessage: (id, updates) => {
      set((state) => ({
        messages: state.messages.map(msg =>
          msg.id === id ? { ...msg, ...updates } : msg
        ),
      }));
    },

    removeMessage: (id) => {
      set((state) => ({
        messages: state.messages.filter(msg => msg.id !== id),
        lastMessageId: state.lastMessageId === id ? null : state.lastMessageId,
      }));
    },

    setLoading: (loading) => set({ isLoading: loading }),

    clearMessages: () => set({
      messages: [],
      lastMessageId: null,
      messageQueue: [],
      failedMessages: []
    }),

    setSessionId: (sessionId) => set({ currentSessionId: sessionId }),

    // Optimistic updates
    addOptimisticMessage: (message) => {
      const id = `opt-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
      const optimisticMessage: Message = {
        ...message,
        id,
        timestamp: new Date(),
        status: 'sending',
        isOptimistic: true,
      };

      set((state) => ({
        messages: [...state.messages, optimisticMessage],
        lastMessageId: id,
      }));

      return id;
    },

    confirmMessage: (optimisticId, serverMessage) => {
      set((state) => ({
        messages: state.messages.map(msg =>
          msg.id === optimisticId
            ? { ...serverMessage, isOptimistic: false }
            : msg
        ),
      }));
    },

    failMessage: (optimisticId, error) => {
      set((state) => ({
        messages: state.messages.map(msg =>
          msg.id === optimisticId
            ? {
                ...msg,
                status: 'error' as const,
                metadata: { ...msg.metadata, error },
                isOptimistic: false
              }
            : msg
        ),
        failedMessages: [...state.failedMessages, {
          ...get().messages.find(msg => msg.id === optimisticId)!,
          status: 'error' as const,
          metadata: { ...get().messages.find(msg => msg.id === optimisticId)?.metadata, error }
        }],
      }));
    },

    // Failed messages management
    addFailedMessage: (message) => {
      set((state) => ({
        failedMessages: [...state.failedMessages, message],
      }));
    },

    removeFailedMessage: (messageId) => {
      set((state) => ({
        failedMessages: state.failedMessages.filter(msg => msg.id !== messageId),
      }));
    },

    retryFailedMessage: (messageId) => {
      set((state) => ({
        failedMessages: state.failedMessages.filter(msg => msg.id !== messageId),
      }));
    },

    clearFailedMessages: () => {
      set({ failedMessages: [] });
    },

    getFailedMessages: () => {
      return get().failedMessages;
    },

    // Message history
    loadMessages: (messages) => {
      set((state) => ({
        messages: [...messages],
        lastMessageId: messages.length > 0 ? messages[messages.length - 1].id : null,
      }));
    },

    appendMessages: (messages) => {
      set((state) => ({
        messages: [...state.messages, ...messages],
        lastMessageId: messages.length > 0 ? messages[messages.length - 1].id : state.lastMessageId,
      }));
    },

    // Queue management
    addToQueue: (message) => {
      set((state) => ({
        messageQueue: [...state.messageQueue, message],
      }));
    },

    removeFromQueue: (messageId) => {
      set((state) => ({
        messageQueue: state.messageQueue.filter(msg => msg.id !== messageId),
      }));
    },

    processQueue: () => {
      const { messageQueue } = get();
      // Process queued messages (implementation depends on chat service)
      console.log('Processing message queue:', messageQueue.length, 'messages');
    },

    // Utility functions
    getMessagesBySession: (sessionId) => {
      return get().messages.filter(msg => msg.sessionId === sessionId);
    },

    getLastMessage: () => {
      const { messages } = get();
      return messages.length > 0 ? messages[messages.length - 1] : null;
    },

    getMessageById: (id) => {
      return get().messages.find(msg => msg.id === id);
    },
  }))
);

// Selectors for common use cases
export const useMessageState = () => useMessageStore((state) => ({
  messages: state.messages,
  isLoading: state.isLoading,
  currentSessionId: state.currentSessionId,
}));

export const useMessageActions = () => useMessageStore((state) => ({
  addMessage: state.addMessage,
  updateMessage: state.updateMessage,
  removeMessage: state.removeMessage,
  setLoading: state.setLoading,
  clearMessages: state.clearMessages,
  setSessionId: state.setSessionId,
}));

export const useOptimisticUpdates = () => useMessageStore((state) => ({
  addOptimisticMessage: state.addOptimisticMessage,
  confirmMessage: state.confirmMessage,
  failMessage: state.failMessage,
}));