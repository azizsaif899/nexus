import { useState, useCallback, useRef, useEffect } from 'react';

interface Message {
  id: string;
  senderId: string;
  content: string;
  timestamp: Date;
  type: 'text' | 'voice' | 'image' | 'file';
  voiceDuration?: number;
  isDelivered?: boolean;
  isRead?: boolean;
  isSent?: boolean;
}

interface Contact {
  id: string;
  name: string;
  avatar?: string;
  lastMessage: string;
  timestamp: string;
  unreadCount?: number;
  isOnline?: boolean;
  lastSeen?: string;
  isTyping?: boolean;
  isPinned?: boolean;
  isMuted?: boolean;
}

interface ChatState {
  selectedContact: string;
  message: string;
  isRecording: boolean;
  searchQuery: string;
  playingVoice: string | null;
  showInfoPanel: boolean;
  isTyping: boolean;
  isOnline: boolean;
  networkStatus: 'online' | 'connecting' | 'offline';
  contacts: Contact[];
  messages: Message[];
}

interface ChatActions {
  setSelectedContact: (id: string) => void;
  setMessage: (message: string) => void;
  setIsRecording: (recording: boolean) => void;
  setSearchQuery: (query: string) => void;
  setPlayingVoice: (id: string | null) => void;
  setShowInfoPanel: (show: boolean) => void;
  setIsTyping: (typing: boolean) => void;
  setNetworkStatus: (status: 'online' | 'connecting' | 'offline') => void;
  handleSendMessage: () => void;
  handleVoiceRecord: () => void;
  toggleVoicePlay: (messageId: string) => void;
  handleInputChange: (value: string) => void;
  clearMessage: () => void;
  addMessage: (message: Omit<Message, 'id' | 'timestamp'>) => void;
  markMessageAsRead: (messageId: string) => void;
  updateContactTyping: (contactId: string, isTyping: boolean) => void;
}

export function useChatState(initialContacts: Contact[], initialMessages: Message[]): [ChatState, ChatActions] {
  const [selectedContact, setSelectedContact] = useState<string>('1');
  const [message, setMessage] = useState('');
  const [isRecording, setIsRecording] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [playingVoice, setPlayingVoice] = useState<string | null>(null);
  const [showInfoPanel, setShowInfoPanel] = useState(false);
  const [isTyping, setIsTyping] = useState(false);
  const [isOnline, setIsOnline] = useState(true);
  const [networkStatus, setNetworkStatus] = useState<'online' | 'connecting' | 'offline'>('online');
  const [contacts, setContacts] = useState<Contact[]>(initialContacts);
  const [messages, setMessages] = useState<Message[]>(initialMessages);

  const debounceTimer = useRef<NodeJS.Timeout>();

  // Debounced typing indicator
  const handleInputChange = useCallback((value: string) => {
    setMessage(value);
    
    if (debounceTimer.current) {
      clearTimeout(debounceTimer.current);
    }
    
    if (value.trim()) {
      setIsTyping(true);
      debounceTimer.current = setTimeout(() => {
        setIsTyping(false);
      }, 1000);
    } else {
      setIsTyping(false);
    }
  }, []);

  // Enhanced message sending with validation
  const handleSendMessage = useCallback(() => {
    if (!message.trim()) return;
    
    // Performance measurement
    if (window.chatPerformance) {
      window.chatPerformance.markStart('message-render');
    }
    
    const newMessage: Message = {
      id: Date.now().toString(),
      senderId: 'me',
      content: message.trim(),
      timestamp: new Date(),
      type: 'text',
      isDelivered: false,
      isRead: false,
      isSent: true
    };
    
    setMessages(prev => [...prev, newMessage]);
    setMessage('');
    setIsTyping(false);
    
    // Simulate message delivery
    setTimeout(() => {
      setMessages(prev => 
        prev.map(msg => 
          msg.id === newMessage.id 
            ? { ...msg, isDelivered: true }
            : msg
        )
      );
    }, 1000);
    
    if (window.chatPerformance) {
      window.chatPerformance.markEnd('message-render');
    }
  }, [message]);

  // Voice recording with state management
  const handleVoiceRecord = useCallback(() => {
    setIsRecording(prev => !prev);
    // Here you would typically start/stop audio recording
  }, []);

  // Toggle voice message playback
  const toggleVoicePlay = useCallback((messageId: string) => {
    setPlayingVoice(prev => prev === messageId ? null : messageId);
  }, []);

  // Clear message
  const clearMessage = useCallback(() => {
    setMessage('');
    setIsTyping(false);
  }, []);

  // Add new message
  const addMessage = useCallback((messageData: Omit<Message, 'id' | 'timestamp'>) => {
    const newMessage: Message = {
      ...messageData,
      id: Date.now().toString(),
      timestamp: new Date()
    };
    
    setMessages(prev => [...prev, newMessage]);
  }, []);

  // Mark message as read
  const markMessageAsRead = useCallback((messageId: string) => {
    setMessages(prev => 
      prev.map(msg => 
        msg.id === messageId 
          ? { ...msg, isRead: true }
          : msg
      )
    );
  }, []);

  // Update contact typing status
  const updateContactTyping = useCallback((contactId: string, isTyping: boolean) => {
    setContacts(prev => 
      prev.map(contact => 
        contact.id === contactId 
          ? { ...contact, isTyping }
          : contact
      )
    );
  }, []);

  // Network status monitoring
  useEffect(() => {
    const updateNetworkStatus = () => {
      setNetworkStatus(navigator.onLine ? 'online' : 'offline');
    };

    window.addEventListener('online', updateNetworkStatus);
    window.addEventListener('offline', updateNetworkStatus);

    return () => {
      window.removeEventListener('online', updateNetworkStatus);
      window.removeEventListener('offline', updateNetworkStatus);
    };
  }, []);

  // Cleanup debounce timer
  useEffect(() => {
    return () => {
      if (debounceTimer.current) {
        clearTimeout(debounceTimer.current);
      }
    };
  }, []);

  const state: ChatState = {
    selectedContact,
    message,
    isRecording,
    searchQuery,
    playingVoice,
    showInfoPanel,
    isTyping,
    isOnline,
    networkStatus,
    contacts,
    messages
  };

  const actions: ChatActions = {
    setSelectedContact,
    setMessage,
    setIsRecording,
    setSearchQuery,
    setPlayingVoice,
    setShowInfoPanel,
    setIsTyping,
    setNetworkStatus,
    handleSendMessage,
    handleVoiceRecord,
    toggleVoicePlay,
    handleInputChange,
    clearMessage,
    addMessage,
    markMessageAsRead,
    updateContactTyping
  };

  return [state, actions];
}