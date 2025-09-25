import { useState, useEffect, useCallback, useRef } from 'react';
import { useMessageStore } from '../store/message.store';
import { getWebSocketManager } from '../services/websocket.manager';
import { chatService } from '../services/chat.service';

export interface UseChatOptions {
  sessionId?: string;
  autoConnect?: boolean;
  enableWebSocket?: boolean;
}

export interface UseChatReturn {
  messages: any[];
  isLoading: boolean;
  currentSessionId: string | null;
  isConnected: boolean;
  sendMessage: (content: string) => Promise<void>;
  clearMessages: () => void;
  setSessionId: (sessionId: string) => void;
  connect: () => Promise<void>;
  disconnect: () => void;
  error: string | null;
}

export const useChat = (options: UseChatOptions = {}): UseChatReturn => {
  const {
    sessionId,
    autoConnect = true,
    enableWebSocket = true,
  } = options;

  const [error, setError] = useState<string | null>(null);
  const [isConnected, setIsConnected] = useState(false);
  const wsManagerRef = useRef<any>(null);

  const {
    messages,
    isLoading,
    currentSessionId,
    addMessage,
    updateMessage,
    clearMessages,
    setSessionId,
    setLoading,
  } = useMessageStore();

  // Initialize WebSocket connection
  useEffect(() => {
    if (enableWebSocket && autoConnect) {
      connect();
    }

    return () => {
      if (wsManagerRef.current) {
        wsManagerRef.current.disconnect();
      }
    };
  }, [enableWebSocket, autoConnect]);

  // Set session ID when provided
  useEffect(() => {
    if (sessionId) {
      setSessionId(sessionId);
    }
  }, [sessionId, setSessionId]);

  const connect = useCallback(async () => {
    if (!enableWebSocket) return;

    try {
      setError(null);
      wsManagerRef.current = getWebSocketManager({
        url: process.env.NEXT_PUBLIC_WS_URL || 'ws://localhost:3001',
      });

      await wsManagerRef.current.connect();
      setIsConnected(true);

      // Set up event listeners
      wsManagerRef.current.on('chat_message', (data: any) => {
        addMessage({
          content: data.content,
          sender: data.sender || 'ai',
          sessionId: data.sessionId || currentSessionId,
          messageType: data.messageType || 'text',
          metadata: data.metadata,
        });
      });

      wsManagerRef.current.on('message', (data: any) => {
        // Handle general messages
        console.log('Received message:', data);
      });

      wsManagerRef.current.on('connection_error', (error: any) => {
        setError(`Connection error: ${error.message}`);
        setIsConnected(false);
      });

      wsManagerRef.current.on('disconnected', () => {
        setIsConnected(false);
      });

    } catch (err: any) {
      setError(`Failed to connect: ${err.message}`);
      setIsConnected(false);
    }
  }, [enableWebSocket, addMessage, currentSessionId]);

  const disconnect = useCallback(() => {
    if (wsManagerRef.current) {
      wsManagerRef.current.disconnect();
      wsManagerRef.current = null;
      setIsConnected(false);
    }
  }, []);

  const sendMessage = useCallback(async (content: string) => {
    if (!content.trim()) return;

    try {
      setError(null);
      setLoading(true);

      // Add optimistic message
      const messageId = addMessage({
        content,
        sender: 'user',
        sessionId: currentSessionId || undefined,
        messageType: 'text',
        isOptimistic: true,
      });

      // Send via WebSocket if connected
      if (isConnected && wsManagerRef.current) {
        wsManagerRef.current.sendMessage({
          content,
          sessionId: currentSessionId || undefined,
          timestamp: new Date(),
        });
      } else {
        // Fallback to HTTP API
        const response = await chatService.sendMessage(
          content,
          currentSessionId || undefined
        );

        // Update the optimistic message with server response
        updateMessage(messageId, {
          status: 'delivered',
          isOptimistic: false,
        });

        // Add AI response
        addMessage({
          content: response.response,
          sender: 'ai',
          sessionId: currentSessionId || undefined,
          messageType: 'text',
          metadata: {
            confidence: response.confidence,
            processingTime: response.processingTime,
          },
        });
      }

    } catch (err: any) {
      setError(`Failed to send message: ${err.message}`);

      // Mark message as failed
      const messages = useMessageStore.getState().messages;
      const lastMessage = messages[messages.length - 1];
      if (lastMessage && lastMessage.isOptimistic) {
        updateMessage(lastMessage.id, {
          status: 'error',
          metadata: { ...lastMessage.metadata, error: err.message },
          isOptimistic: false,
        });
      }
    } finally {
      setLoading(false);
    }
  }, [addMessage, updateMessage, currentSessionId, isConnected, setLoading]);

  return {
    messages,
    isLoading,
    currentSessionId,
    isConnected,
    sendMessage,
    clearMessages,
    setSessionId,
    connect,
    disconnect,
    error,
  };
};