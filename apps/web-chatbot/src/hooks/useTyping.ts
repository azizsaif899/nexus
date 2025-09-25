import { useState, useEffect, useCallback } from 'react';
import { useMessageStore } from '../store/message.store';
import { getWebSocketManager } from '../services/websocket.manager';

export interface UseTypingOptions {
  sessionId?: string;
  throttleMs?: number;
}

export interface UseTypingReturn {
  isTyping: boolean;
  startTyping: () => void;
  stopTyping: () => void;
  typingUsers: string[];
}

export const useTyping = (options: UseTypingOptions = {}): UseTypingReturn => {
  const { sessionId, throttleMs = 1000 } = options;
  const [isTyping, setIsTyping] = useState(false);
  const [typingUsers, setTypingUsers] = useState<string[]>([]);
  const [typingTimeout, setTypingTimeout] = useState<NodeJS.Timeout | null>(null);

  const wsManager = getWebSocketManager();

  useEffect(() => {
    if (!wsManager) return;

    const handleTyping = (data: any) => {
      if (data.sessionId === sessionId || !sessionId) {
        if (data.isTyping) {
          setTypingUsers(prev => {
            if (!prev.includes(data.userId)) {
              return [...prev, data.userId];
            }
            return prev;
          });
        } else {
          setTypingUsers(prev => prev.filter(id => id !== data.userId));
        }
      }
    };

    wsManager.on('typing', handleTyping);

    return () => {
      wsManager.off('typing', handleTyping);
    };
  }, [sessionId, wsManager]);

  const startTyping = useCallback(() => {
    if (isTyping) return;

    setIsTyping(true);

    if (wsManager && wsManager.isConnected()) {
      wsManager.sendTyping(true);
    }

    // Clear existing timeout
    if (typingTimeout) {
      clearTimeout(typingTimeout);
    }

    // Set new timeout to stop typing
    const timeout = setTimeout(() => {
      stopTyping();
    }, throttleMs);

    setTypingTimeout(timeout);
  }, [isTyping, wsManager, throttleMs, typingTimeout]);

  const stopTyping = useCallback(() => {
    if (!isTyping) return;

    setIsTyping(false);

    if (wsManager && wsManager.isConnected()) {
      wsManager.sendTyping(false);
    }

    if (typingTimeout) {
      clearTimeout(typingTimeout);
      setTypingTimeout(null);
    }
  }, [isTyping, wsManager, typingTimeout]);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      if (typingTimeout) {
        clearTimeout(typingTimeout);
      }
      stopTyping();
    };
  }, [typingTimeout, stopTyping]);

  return {
    isTyping,
    startTyping,
    stopTyping,
    typingUsers,
  };
};