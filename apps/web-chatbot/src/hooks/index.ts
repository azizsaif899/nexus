// Main chat hooks
export { useChat } from './useChat';

// Additional utility hooks
export { useTyping } from './useTyping';
export { useConnection } from './useConnection';
export { useOfflineMessages } from './useOfflineMessages';
export { useNotifications } from './useNotifications';
export { useSettings } from './useSettings';
export { useFileUpload } from './useFileUpload';
export { useMessageSearch } from './useMessageSearch';
export { useMessageReactions } from './useMessageReactions';
export { useMessageEncryption } from './useMessageEncryption';

// Re-export types
export type { UseChatReturn } from './useChat';
export type { UseTypingReturn, UseTypingOptions } from './useTyping';
export type { UseConnectionReturn } from './useConnection';
export type { UseOfflineMessagesReturn } from './useOfflineMessages';
export type { UseNotificationsReturn, Notification } from './useNotifications';
export type { UseSettingsReturn, ChatSettings } from './useSettings';
export type { UseFileUploadReturn, FileUploadProgress, FileUploadOptions } from './useFileUpload';
export type { UseMessageSearchReturn, SearchFilters, SearchResult, SavedSearch } from './useMessageSearch';
export type { UseMessageReactionsReturn, MessageReaction, MessageReactions, ReactionSummary } from './useMessageReactions';
export type { UseMessageEncryptionReturn, EncryptionKey, EncryptedMessage } from './useMessageEncryption';