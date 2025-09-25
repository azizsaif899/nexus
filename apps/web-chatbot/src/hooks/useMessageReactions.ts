import { useState, useCallback, useEffect } from 'react';
import { useMessageStore } from '../store/message.store';
import { getWebSocketManager } from '../services/websocket.manager';

export interface MessageReaction {
  emoji: string;
  userId: string;
  timestamp: Date;
}

export interface MessageReactions {
  [messageId: string]: MessageReaction[];
}

export interface ReactionSummary {
  emoji: string;
  count: number;
  users: string[];
  hasCurrentUser: boolean;
}

export interface UseMessageReactionsReturn {
  reactions: MessageReactions;
  addReaction: (messageId: string, emoji: string) => void;
  removeReaction: (messageId: string, emoji: string) => void;
  toggleReaction: (messageId: string, emoji: string) => void;
  getReactionSummary: (messageId: string) => ReactionSummary[];
  clearReactions: (messageId?: string) => void;
  isLoading: boolean;
}

const REACTIONS_KEY = 'nexus-message-reactions';

// Common emoji reactions
export const COMMON_EMOJIS = ['👍', '👎', '❤️', '😂', '😮', '😢', '😡', '🎉'];

export const useMessageReactions = (currentUserId?: string): UseMessageReactionsReturn => {
  const [reactions, setReactions] = useState<MessageReactions>({});
  const [isLoading, setIsLoading] = useState(false);

  const wsManager = getWebSocketManager();

  // Load reactions from localStorage on mount
  useEffect(() => {
    try {
      const saved = localStorage.getItem(REACTIONS_KEY);
      if (saved) {
        const parsed = JSON.parse(saved);
        // Convert timestamp strings back to Date objects
        const reactionsWithDates: MessageReactions = {};
        Object.entries(parsed).forEach(([messageId, reactionList]: [string, any]) => {
          reactionsWithDates[messageId] = reactionList.map((reaction: any) => ({
            ...reaction,
            timestamp: new Date(reaction.timestamp),
          }));
        });
        setReactions(reactionsWithDates);
      }
    } catch (error) {
      console.error('Failed to load reactions:', error);
    }
  }, []);

  // Save reactions to localStorage whenever they change
  useEffect(() => {
    try {
      localStorage.setItem(REACTIONS_KEY, JSON.stringify(reactions));
    } catch (error) {
      console.error('Failed to save reactions:', error);
    }
  }, [reactions]);

  // Listen for reaction updates from WebSocket
  useEffect(() => {
    if (!wsManager) return;

    const handleReactionUpdate = (data: any) => {
      if (data.type === 'reaction_added' || data.type === 'reaction_removed') {
        // Update local state with server data
        setReactions((prev: MessageReactions) => ({
          ...prev,
          [data.messageId]: data.reactions || []
        }));
      }
    };

    wsManager.on('reaction_update', handleReactionUpdate);

    return () => {
      wsManager.off('reaction_update', handleReactionUpdate);
    };
  }, [wsManager]);

  const saveReactions = useCallback((updatedReactions: MessageReactions) => {
    setReactions(updatedReactions);

    // Send to WebSocket if connected
    if (wsManager && wsManager.isConnected()) {
      // Broadcast reaction changes to other clients
      Object.entries(updatedReactions).forEach(([messageId, messageReactions]) => {
        wsManager.send('reaction_update', {
          messageId,
          reactions: messageReactions,
          type: 'reactions_sync'
        });
      });
    }
  }, [wsManager]);

  const addReaction = useCallback((messageId: string, emoji: string) => {
    if (!currentUserId) return;

    setReactions((prev: MessageReactions) => {
      const messageReactions = prev[messageId] || [];
      const existingReaction = messageReactions.find(
        (r: MessageReaction) => r.emoji === emoji && r.userId === currentUserId
      );

      if (existingReaction) {
        // User already reacted with this emoji, don't add duplicate
        return prev;
      }

      const newReaction: MessageReaction = {
        emoji,
        userId: currentUserId,
        timestamp: new Date(),
      };

      const updated = {
        ...prev,
        [messageId]: [...messageReactions, newReaction]
      };

      // Send to server
      if (wsManager && wsManager.isConnected()) {
        wsManager.send('add_reaction', {
          messageId,
          emoji,
          userId: currentUserId
        });
      }

      return updated;
    });
  }, [currentUserId, wsManager]);

  const removeReaction = useCallback((messageId: string, emoji: string) => {
    if (!currentUserId) return;

    setReactions((prev: MessageReactions) => {
      const messageReactions = prev[messageId] || [];
      const filtered = messageReactions.filter(
        (r: MessageReaction) => !(r.emoji === emoji && r.userId === currentUserId)
      );

      const updated = {
        ...prev,
        [messageId]: filtered
      };

      // Send to server
      if (wsManager && wsManager.isConnected()) {
        wsManager.send('remove_reaction', {
          messageId,
          emoji,
          userId: currentUserId
        });
      }

      return updated;
    });
  }, [currentUserId, wsManager]);

  const toggleReaction = useCallback((messageId: string, emoji: string) => {
    if (!currentUserId) return;

    const messageReactions = reactions[messageId] || [];
    const existingReaction = messageReactions.find(
      (r: MessageReaction) => r.emoji === emoji && r.userId === currentUserId
    );

    if (existingReaction) {
      removeReaction(messageId, emoji);
    } else {
      addReaction(messageId, emoji);
    }
  }, [reactions, currentUserId, addReaction, removeReaction]);

  const getReactionSummary = useCallback((messageId: string): ReactionSummary[] => {
    const messageReactions = reactions[messageId] || [];

    // Group reactions by emoji
    const emojiGroups: { [emoji: string]: string[] } = {};
    messageReactions.forEach((reaction: MessageReaction) => {
      if (!emojiGroups[reaction.emoji]) {
        emojiGroups[reaction.emoji] = [];
      }
      emojiGroups[reaction.emoji].push(reaction.userId);
    });

    // Convert to summary format
    return Object.entries(emojiGroups).map(([emoji, users]) => ({
      emoji,
      count: users.length,
      users,
      hasCurrentUser: currentUserId ? users.includes(currentUserId) : false
    })).sort((a, b) => b.count - a.count); // Sort by count descending
  }, [reactions, currentUserId]);

  const clearReactions = useCallback((messageId?: string) => {
    if (messageId) {
      // Clear reactions for specific message
      setReactions((prev: MessageReactions) => {
        const updated = { ...prev };
        delete updated[messageId];
        return updated;
      });

      // Send to server
      if (wsManager && wsManager.isConnected()) {
        wsManager.send('clear_reactions', { messageId });
      }
    } else {
      // Clear all reactions
      setReactions({});

      // Send to server
      if (wsManager && wsManager.isConnected()) {
        wsManager.send('clear_all_reactions', {});
      }
    }
  }, [wsManager]);

  return {
    reactions,
    addReaction,
    removeReaction,
    toggleReaction,
    getReactionSummary,
    clearReactions,
    isLoading,
  };
};