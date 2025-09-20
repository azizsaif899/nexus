import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { useEffect, useCallback } from 'react';
import { chatService } from '../services/chat.service';
import { websocketService, WebSocketMessage } from '../services/websocket.service';
import { useMessageStore, useMessageSelectors } from '../store/message.store';
import { useChatStore } from '../store/chat.store';

export const useChat = (sessionId?: string) => {
  const queryClient = useQueryClient();
  const messageStore = useMessageStore();
  const messageSelectors = useMessageSelectors();
  const chatStore = useChatStore();

  // الحصول على رسائل الجلسة الحالية
  const messages = sessionId ? messageSelectors.getSessionMessages(sessionId) : [];
  const isGenerating = messageStore.isGenerating;
  const error = messageStore.error;

  // إعداد WebSocket
  useEffect(() => {
    const connectWebSocket = async () => {
      try {
        await websocketService.connect();
        chatStore.setConnected(true);
      } catch (error) {
        console.error('فشل في الاتصال بـ WebSocket:', error);
        chatStore.setConnected(false);
      }
    };

    connectWebSocket();

    // الاشتراك في رسائل WebSocket
    const unsubscribeMessage = websocketService.on('stream_chunk', (message: WebSocketMessage) => {
      if (message.data?.content) {
        messageStore.appendToStreamingMessage(message.data.content);
      }
    });

    const unsubscribeStreamStart = websocketService.on('stream_start', (message: WebSocketMessage) => {
      if (message.messageId) {
        messageStore.startStreaming(message.messageId);
      }
    });

    const unsubscribeStreamEnd = websocketService.on('stream_end', (message: WebSocketMessage) => {
      messageStore.finishStreaming(message.data?.metadata);
    });

    const unsubscribeStatus = websocketService.onStatusChange((status) => {
      chatStore.setConnected(status === 'connected');
    });

    return () => {
      unsubscribeMessage();
      unsubscribeStreamStart();
      unsubscribeStreamEnd();
      unsubscribeStatus();
      websocketService.disconnect();
    };
  }, []);

  // إرسال رسالة
  const sendMessageMutation = useMutation({
    mutationFn: async (content: string) => {
      if (!sessionId) {
        throw new Error('لا توجد جلسة نشطة');
      }

      // إضافة رسالة المستخدم بشكل متفائل
      const userMessageId = messageStore.addOptimisticMessage(sessionId, content);

      try {
        // إرسال الرسالة للخادم
        const response = await chatService.sendMessage({
          content,
          role: 'user',
          sessionId
        });

        // تأكيد رسالة المستخدم
        messageStore.confirmOptimisticMessage(userMessageId, {
          id: response.id
        });

        // إضافة رسالة المساعد
        const assistantMessageId = messageStore.addMessage(sessionId, {
          content: '',
          role: 'assistant',
          status: 'streaming'
        });

        // إرسال طلب streaming عبر WebSocket
        websocketService.send({
          type: 'message',
          data: { content, sessionId },
          messageId: assistantMessageId
        });

        return response;
      } catch (error: any) {
        // رفض رسالة المستخدم في حالة الخطأ
        messageStore.rejectOptimisticMessage(userMessageId, error.message);
        throw error;
      }
    },
    onError: (error: any) => {
      messageStore.setError(error.message);
    }
  });

  // إيقاف التوليد
  const stopGenerationMutation = useMutation({
    mutationFn: async () => {
      if (!sessionId) return;
      
      await chatService.stopGeneration(sessionId);
      websocketService.send({
        type: 'stop',
        data: { sessionId }
      });
    },
    onSuccess: () => {
      messageStore.stopStreaming();
    }
  });

  // تحميل تاريخ المحادثة
  const { data: chatHistory, isLoading: isLoadingHistory } = useQuery({
    queryKey: ['chat-history', sessionId],
    queryFn: () => sessionId ? chatService.getChatHistory(sessionId) : Promise.resolve([]),
    enabled: !!sessionId,
    onSuccess: (data) => {
      if (sessionId && data) {
        messageStore.loadMessages(sessionId, data.map(msg => ({
          ...msg,
          id: msg.id || `msg_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
          timestamp: new Date(msg.timestamp || Date.now()),
          status: 'sent' as const
        })));
      }
    }
  });

  // إنشاء جلسة جديدة
  const createSessionMutation = useMutation({
    mutationFn: (title?: string) => chatService.createSession(title),
    onSuccess: (session) => {
      const newSessionId = chatStore.createSession(session.title);
      chatStore.setCurrentSession(newSessionId);
      queryClient.invalidateQueries({ queryKey: ['chat-sessions'] });
    }
  });

  // حذف جلسة
  const deleteSessionMutation = useMutation({
    mutationFn: (sessionId: string) => chatService.deleteSession(sessionId),
    onSuccess: (_, sessionId) => {
      chatStore.deleteSession(sessionId);
      messageStore.clearMessages(sessionId);
      queryClient.invalidateQueries({ queryKey: ['chat-sessions'] });
    }
  });

  // مسح رسائل الجلسة
  const clearMessages = useCallback(() => {
    if (sessionId) {
      messageStore.clearMessages(sessionId);
    }
  }, [sessionId]);

  // إعادة إرسال رسالة
  const resendMessage = useCallback((messageId: string) => {
    const message = messageSelectors.getMessageById(messageId);
    if (message && message.role === 'user') {
      sendMessageMutation.mutate(message.content);
    }
  }, [sendMessageMutation]);

  return {
    // البيانات
    messages,
    isGenerating,
    error,
    isLoadingHistory,
    isConnected: chatStore.isConnected,

    // العمليات
    sendMessage: sendMessageMutation.mutate,
    stopGeneration: stopGenerationMutation.mutate,
    createSession: createSessionMutation.mutate,
    deleteSession: deleteSessionMutation.mutate,
    clearMessages,
    resendMessage,

    // حالات التحميل
    isSending: sendMessageMutation.isPending,
    isStopping: stopGenerationMutation.isPending,
    isCreatingSession: createSessionMutation.isPending,
    isDeletingSession: deleteSessionMutation.isPending,

    // الأخطاء
    sendError: sendMessageMutation.error,
    stopError: stopGenerationMutation.error,
    createError: createSessionMutation.error,
    deleteError: deleteSessionMutation.error
  };
};