import { create } from 'zustand';
import { devtools, persist } from 'zustand/middleware';

export interface Message {
  id: string;
  content: string;
  role: 'user' | 'assistant' | 'system';
  timestamp: Date;
  status: 'sending' | 'sent' | 'error';
  metadata?: {
    model?: string;
    tokens?: number;
    processingTime?: number;
  };
}

export interface ChatSession {
  id: string;
  title: string;
  messages: Message[];
  createdAt: Date;
  updatedAt: Date;
  isActive: boolean;
}

interface ChatState {
  sessions: ChatSession[];
  currentSessionId: string | null;
  isLoading: boolean;
  isConnected: boolean;
  error: string | null;

  createSession: (title?: string) => string;
  setCurrentSession: (sessionId: string) => void;
  deleteSession: (sessionId: string) => void;
  
  addMessage: (sessionId: string, message: Omit<Message, 'id' | 'timestamp'>) => void;
  updateMessage: (sessionId: string, messageId: string, updates: Partial<Message>) => void;
  deleteMessage: (sessionId: string, messageId: string) => void;
  
  setLoading: (loading: boolean) => void;
  setConnected: (connected: boolean) => void;
  setError: (error: string | null) => void;
  
  clearMessages: (sessionId: string) => void;
  clearAllSessions: () => void;
}

export const useChatStore = create<ChatState>()(
  devtools(
    persist(
      (set, get) => ({
        sessions: [],
        currentSessionId: null,
        isLoading: false,
        isConnected: false,
        error: null,

        createSession: (title = 'محادثة جديدة') => {
          const sessionId = `session_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
          const newSession: ChatSession = {
            id: sessionId,
            title,
            messages: [],
            createdAt: new Date(),
            updatedAt: new Date(),
            isActive: true
          };

          set((state) => ({
            sessions: [...state.sessions, newSession],
            currentSessionId: sessionId
          }));

          return sessionId;
        },

        setCurrentSession: (sessionId) => {
          set({ currentSessionId: sessionId });
        },

        deleteSession: (sessionId) => {
          set((state) => {
            const filteredSessions = state.sessions.filter(s => s.id !== sessionId);
            const newCurrentId = state.currentSessionId === sessionId 
              ? (filteredSessions[0]?.id || null) 
              : state.currentSessionId;

            return {
              sessions: filteredSessions,
              currentSessionId: newCurrentId
            };
          });
        },

        addMessage: (sessionId, messageData) => {
          const message: Message = {
            id: `msg_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
            timestamp: new Date(),
            ...messageData
          };

          set((state) => ({
            sessions: state.sessions.map(session => 
              session.id === sessionId 
                ? {
                    ...session,
                    messages: [...session.messages, message],
                    updatedAt: new Date()
                  }
                : session
            )
          }));
        },

        updateMessage: (sessionId, messageId, updates) => {
          set((state) => ({
            sessions: state.sessions.map(session =>
              session.id === sessionId
                ? {
                    ...session,
                    messages: session.messages.map(msg =>
                      msg.id === messageId ? { ...msg, ...updates } : msg
                    ),
                    updatedAt: new Date()
                  }
                : session
            )
          }));
        },

        deleteMessage: (sessionId, messageId) => {
          set((state) => ({
            sessions: state.sessions.map(session =>
              session.id === sessionId
                ? {
                    ...session,
                    messages: session.messages.filter(msg => msg.id !== messageId),
                    updatedAt: new Date()
                  }
                : session
            )
          }));
        },

        setLoading: (loading) => set({ isLoading: loading }),
        setConnected: (connected) => set({ isConnected: connected }),
        setError: (error) => set({ error }),

        clearMessages: (sessionId) => {
          set((state) => ({
            sessions: state.sessions.map(session =>
              session.id === sessionId
                ? { ...session, messages: [], updatedAt: new Date() }
                : session
            )
          }));
        },

        clearAllSessions: () => {
          set({
            sessions: [],
            currentSessionId: null,
            error: null
          });
        }
      }),
      {
        name: 'chat-store',
        partialize: (state) => ({
          sessions: state.sessions,
          currentSessionId: state.currentSessionId
        })
      }
    ),
    { name: 'chat-store' }
  )
);