# Chat Hooks

This directory contains React hooks for managing chat functionality in the Nexus web-chatbot application.

## Available Hooks

### `useChat`
Main hook for chat functionality with WebSocket integration and Zustand state management.

```typescript
import { useChat } from '@/hooks/useChat';

const {
  messages,
  isLoading,
  sendMessage,
  loadMessages,
  clearMessages,
  sessionId
} = useChat();
```

### `useTyping`
Manages typing indicators for real-time chat.

```typescript
import { useTyping } from '@/hooks/useTyping';

const {
  isTyping,
  startTyping,
  stopTyping,
  typingUsers
} = useTyping({ sessionId: 'session-123' });
```

### `useConnection`
Manages WebSocket connection state and reconnection logic.

```typescript
import { useConnection } from '@/hooks/useConnection';

const {
  isConnected,
  isConnecting,
  connectionError,
  reconnect,
  disconnect
} = useConnection();
```

### `useOfflineMessages`
Handles offline message management and retry functionality.

```typescript
import { useOfflineMessages } from '@/hooks/useOfflineMessages';

const {
  offlineMessages,
  retryFailedMessages,
  clearOfflineMessages,
  hasOfflineMessages
} = useOfflineMessages();
```

### `useNotifications`
Manages in-app notifications and toast messages.

```typescript
import { useNotifications } from '@/hooks/useNotifications';

const {
  notifications,
  showSuccess,
  showError,
  showWarning,
  showInfo,
  removeNotification
} = useNotifications();
```

### `useFileUpload`
Manages file uploads with progress tracking, validation, and error handling.

### `useMessageSearch`
Provides advanced message search and filtering capabilities.

```typescript
import { useMessageSearch } from '@/hooks/useMessageSearch';

const {
  searchResults,
  performSearch,
  updateFilters,
  savedSearches,
  saveSearch
} = useMessageSearch();

### `useMessageReactions`
Manages message reactions and emoji interactions.

```typescript
import { useMessageReactions, COMMON_EMOJIS } from '@/hooks/useMessageReactions';

const {
  reactions,
  toggleReaction,
  getReactionSummary,
  clearReactions
} = useMessageReactions('current-user-id');

// Toggle reaction on message
toggleReaction('message-id', '👍');

### `useMessageEncryption`
Provides end-to-end message encryption using Web Crypto API.

```typescript
import { useMessageEncryption } from '@/hooks/useMessageEncryption';

const {
  encryptMessage,
  decryptMessage,
  generateKey,
  hasKeyForSession
} = useMessageEncryption();

// Generate encryption key for session
const keyId = await generateKey('session-123');

// Encrypt a message
const encrypted = await encryptMessage('Secret message', 'session-123');

// Decrypt a message
const decrypted = await decryptMessage(encrypted);
```

## Architecture

The hooks are built on top of:

- **Zustand**: For global state management (message store)
- **Socket.io**: For real-time WebSocket communication
- **React Query**: For API state management (fallback)
- **Local Storage**: For persistent settings

## Features

- ✅ Real-time messaging with WebSocket
- ✅ Optimistic updates for better UX
- ✅ Offline message handling and retry
- ✅ Typing indicators
- ✅ Connection management with auto-reconnect
- ✅ Comprehensive error handling
- ✅ Persistent user settings
- ✅ Notification system
- ✅ Message history and session management

## Usage Examples

### Basic Chat Implementation

```typescript
import { useChat, useConnection, useNotifications } from '@/hooks';

function ChatComponent() {
  const { messages, sendMessage, isLoading } = useChat();
  const { isConnected, connectionError } = useConnection();
  const { showError } = useNotifications();

  const handleSend = async (content: string) => {
    try {
      await sendMessage(content);
    } catch (error) {
      showError('Failed to send message', error.message);
    }
  };

  return (
    <div>
      {!isConnected && (
        <div className="connection-error">
          {connectionError || 'Disconnected'}
        </div>
      )}

      <MessageList messages={messages} />

      <MessageInput
        onSend={handleSend}
        disabled={!isConnected || isLoading}
      />
    </div>
  );
}
```

### Settings Management

```typescript
import { useSettings } from '@/hooks';

function SettingsPanel() {
  const { settings, updateSettings } = useSettings();

  return (
    <div>
      <label>
        <input
          type="checkbox"
          checked={settings.soundEnabled}
          onChange={(e) => updateSettings({ soundEnabled: e.target.checked })}
        />
        Enable sound notifications
      </label>

      <label>
        <input
          type="checkbox"
          checked={settings.typingIndicators}
          onChange={(e) => updateSettings({ typingIndicators: e.target.checked })}
        />
        Show typing indicators
      </label>
    </div>
  );
}
```