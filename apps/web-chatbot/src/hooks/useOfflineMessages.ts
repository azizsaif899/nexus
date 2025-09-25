import { useState, useEffect, useCallback } from 'react';
import { useMessageStore } from '../store/message.store';
import { getWebSocketManager } from '../services/websocket.manager';
import type { Message } from '../store/message.store';

export interface UseOfflineMessagesReturn {
  offlineMessages: Message[];
  retryFailedMessages: () => void;
  clearOfflineMessages: () => void;
  hasOfflineMessages: boolean;
}

export const useOfflineMessages = (): UseOfflineMessagesReturn => {
  const [offlineMessages, setOfflineMessages] = useState<Message[]>([]);
  const { getFailedMessages, retryFailedMessage, clearFailedMessages } = useMessageStore();

  const wsManager = getWebSocketManager();

  useEffect(() => {
    const failedMessages = getFailedMessages();
    setOfflineMessages(failedMessages);
  }, [getFailedMessages]);

  const retryFailedMessages = useCallback(() => {
    const failedMessages = getFailedMessages();

    failedMessages.forEach((message: Message) => {
      if (wsManager && wsManager.isConnected()) {
        try {
          wsManager.sendMessage(message);
          retryFailedMessage(message.id);
        } catch (error) {
          console.error('Failed to retry message:', error);
        }
      }
    });
  }, [getFailedMessages, retryFailedMessage, wsManager]);

  const clearOfflineMessages = useCallback(() => {
    clearFailedMessages();
    setOfflineMessages([]);
  }, [clearFailedMessages]);

  const hasOfflineMessages = offlineMessages.length > 0;

  return {
    offlineMessages,
    retryFailedMessages,
    clearOfflineMessages,
    hasOfflineMessages,
  };
};