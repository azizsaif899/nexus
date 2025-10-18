import React, { useState, useCallback, useRef, useEffect, KeyboardEvent } from 'react';
import { DesignProvider } from './design-system/DesignProvider';
import { WhatsAppBubble } from './WhatsAppBubble';
import { 
  Search,
  MoreVertical,
  Send,
  Smile,
  Paperclip,
  Mic,
  Phone,
  Video,
  Plus,
  Check,
  Circle,
  X,
  ChevronLeft,
  MessageCircle,
  Camera,
  ThumbsUp,
  Music,
  Table
} from 'lucide-react';
import { useTranslation, type Language } from '../lib/i18n';

// Social Media Icon Components
const SocialMediaIcons = {
  all: ({ isActive }: { isActive: boolean }) => (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
      <circle cx="12" cy="12" r="10" stroke={isActive ? '#4F97FF' : '#8696a0'} strokeWidth="2" fill="none"/>
      <circle cx="12" cy="12" r="3" fill={isActive ? '#4F97FF' : '#8696a0'}/>
      <path d="M12 2v4M12 18v4M2 12h4M18 12h4" stroke={isActive ? '#4F97FF' : '#8696a0'} strokeWidth="2"/>
    </svg>
  ),
  
  whatsapp: ({ isActive }: { isActive: boolean }) => (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347z" fill={isActive ? '#25D366' : '#8696a0'}/>
      <path d="M20.52 3.449C18.24 1.245 15.24 0 12.045 0 5.463 0 .104 5.334.101 11.893c0 2.096.547 4.142 1.588 5.945L0 24l6.335-1.652c1.746.943 3.71 1.444 5.71 1.447h.006c6.585 0 11.946-5.336 11.949-11.896 0-3.176-1.24-6.165-3.48-8.4zm-8.475 18.297c-1.776 0-3.517-.477-5.033-1.378l-.36-.214-3.74.977 1-3.645-.236-.374c-.99-1.574-1.512-3.393-1.511-5.26.003-5.45 4.46-9.884 9.942-9.884 2.656.001 5.153 1.035 7.033 2.91 1.88 1.876 2.914 4.367 2.913 7.015-.003 5.45-4.46 9.885-9.941 9.885z" fill={isActive ? '#25D366' : '#8696a0'}/>
    </svg>
  ),
  
  instagram: ({ isActive }: { isActive: boolean }) => (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
      <rect x="2" y="2" width="20" height="20" rx="5" stroke={isActive ? '#E4405F' : '#8696a0'} strokeWidth="2" fill="none"/>
      <circle cx="12" cy="12" r="4" stroke={isActive ? '#E4405F' : '#8696a0'} strokeWidth="2" fill="none"/>
      <circle cx="18" cy="6" r="1.5" fill={isActive ? '#E4405F' : '#8696a0'}/>
    </svg>
  ),
  
  facebook: ({ isActive }: { isActive: boolean }) => (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" fill={isActive ? '#1877F2' : '#8696a0'}/>
    </svg>
  ),
  
  snapchat: ({ isActive }: { isActive: boolean }) => (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M12.206.793c.99 0 4.347.276 5.93 3.821.529 1.193.403 3.219.299 4.847l-.003.06c-.012.18-.022.345-.03.51.075.045.203.09.401.09.3 0 .633-.09.936-.18.214-.067.396-.125.538-.125.168 0 .322.053.456.158.384.31.459.907.213 1.416-.245.51-.944 1.023-1.742 1.484-.053.03-.155.09-.214.12.09.195.293.63.443 1.021.12.33.27.75.405 1.173.12.375.345.576.63.576.099 0 .203-.03.315-.09.3-.15 1.244-.494 2.265-.494.645 0 1.156.18 1.515.533.449.434.674 1.095.674 1.966 0 1.799-1.42 2.684-2.82 3.474-.585.33-1.155.645-1.485.945-.21.195-.315.42-.315.63 0 .405.3.825.915 1.26.78.555 1.575 1.125 2.265 1.65.42.33.885.69 1.275 1.065.54.51.885 1.05 1.065 1.605.195.6.195 1.155 0 1.65-.21.51-.585.885-1.155 1.095-.555.195-1.155.18-1.785.165-.21 0-.42-.015-.63-.015-.42 0-.855.045-1.29.12-.51.09-1.05.21-1.59.33-.66.15-1.32.3-1.965.42-.465.09-.945.135-1.425.165-.48.03-.975.045-1.455.045-1.17 0-2.355-.18-3.51-.405-.555-.105-1.11-.24-1.665-.375-.585-.15-1.17-.3-1.755-.42-.435-.09-.87-.135-1.29-.135-.21 0-.435.015-.645.015-.63.015-1.23.03-1.785-.165-.57-.21-.945-.585-1.155-1.095-.195-.495-.195-1.05 0-1.65.18-.555.525-1.095 1.065-1.605.39-.375.855-.735 1.275-1.065.69-.525 1.485-1.095 2.265-1.65.615-.435.915-.855.915-1.26 0-.21-.105-.435-.315-.63-.33-.3-.9-.615-1.485-.945-1.4-.79-2.82-1.675-2.82-3.474 0-.871.225-1.532.674-1.966.359-.353.87-.533 1.515-.533 1.021 0 1.965.344 2.265.494.112.06.216.09.315.09.285 0 .51-.201.63-.576.135-.423.285-.843.405-1.173.15-.391.353-.826.443-1.021-.059-.03-.161-.09-.214-.12-.798-.461-1.497-.974-1.742-1.484-.246-.509-.171-1.106.213-1.416.134-.105.288-.158.456-.158.142 0 .324.058.538.125.303.09.636.18.936.18.198 0 .326-.045.401-.09-.008-.165-.018-.33-.03-.51l-.003-.06c-.104-1.628-.23-3.654.299-4.847C7.859 1.069 11.216.793 12.206.793z" fill={isActive ? '#FFFC00' : '#8696a0'} stroke={isActive ? '#000000' : '#8696a0'} strokeWidth="0.5"/>
    </svg>
  ),
  
  tiktok: ({ isActive }: { isActive: boolean }) => (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M19.59 6.69a4.83 4.83 0 0 1-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 0 1-5.2 1.74 2.89 2.89 0 0 1 2.31-4.64 2.93 2.93 0 0 1 .88.13V9.4a6.84 6.84 0 0 0-1-.05A6.33 6.33 0 0 0 5 20.1a6.34 6.34 0 0 0 10.86-4.43v-7a8.16 8.16 0 0 0 4.77 1.52v-3.4a4.85 4.85 0 0 1-1-.1z" fill={isActive ? '#000000' : '#8696a0'}/>
    </svg>
  ),
  
  googleMaps: ({ isActive }: { isActive: boolean }) => (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
      {/* Google Maps Pin Icon */}
      <path 
        d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7z" 
        fill={isActive ? '#EA4335' : '#8696a0'}
      />
      <circle 
        cx="12" 
        cy="9" 
        r="2.5" 
        fill="white"
      />
      {/* Additional Google Colors for branding */}
      {isActive && (
        <>
          <path 
            d="M12 9.5c-0.28 0-0.5-0.22-0.5-0.5s0.22-0.5 0.5-0.5 0.5 0.22 0.5 0.5-0.22 0.5-0.5 0.5z" 
            fill="#4285F4"
          />
        </>
      )}
    </svg>
  ),
};

interface ConversationPageProps {
  language: Language;
  onBackToHome: () => void;
  onLanguageChange?: (language: Language) => void;
  isDark?: boolean;
  onThemeChange?: (isDark: boolean) => void;
}

export const ConversationPage: React.FC<ConversationPageProps> = ({ 
  language, 
  isDark = true
}) => {
  // =========== State Management ===========
  const [messageText, setMessageText] = useState('');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedChat, setSelectedChat] = useState<string | null>('1');
  const [isTyping, setIsTyping] = useState(false);
  const [selectedPlatform, setSelectedPlatform] = useState<string>('all');
  const [selectedFilter, setSelectedFilter] = useState<string>('all');
  const [showChatList, setShowChatList] = useState(true);
  const [isMobile, setIsMobile] = useState(false);
  const [focusedChatIndex, setFocusedChatIndex] = useState<number>(0);
  const [liveAnnouncement, setLiveAnnouncement] = useState<string>('');
  const [isClient, setIsClient] = useState(false);
  const [selectedOption, setSelectedOption] = useState<string>('');
  
  // =========== Refs ===========
  const inputRef = useRef<HTMLInputElement>(null);
  const searchInputRef = useRef<HTMLInputElement>(null);
  const chatListRef = useRef<HTMLDivElement>(null);
  const chatItemRefs = useRef<(HTMLDivElement | null)[]>([]);
  
  // =========== Translation ===========
  const t = useTranslation(language);

  // =========== Client-side hydration ===========
  useEffect(() => {
    setIsClient(true);
  }, []);

  // =========== Mobile Detection ===========
  useEffect(() => {
    if (!isClient) return;
    
    const checkMobile = () => {
      const mobile = window.innerWidth < 768;
      setIsMobile(mobile);
      if (mobile && selectedChat) {
        setShowChatList(false);
      } else if (!mobile) {
        setShowChatList(true);
      }
    };
    
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, [selectedChat, isClient]);

  // =========== Focus Management ===========
  useEffect(() => {
    // Focus input when chat is selected
    if (selectedChat && inputRef.current && !isMobile) {
      setTimeout(() => {
        inputRef.current?.focus();
      }, 300);
    }
  }, [selectedChat, isMobile]);

  // =========== WhatsApp Colors ===========
  const whatsappColors = {
    deepBackground: '#111b21',
    sidebarBackground: '#111b21',
    headerBackground: '#202c33',
    chatBackground: '#0b141a',
    borderColor: '#313a43',
    primaryText: '#e9edef',
    secondaryText: '#8696a0',
    mutedText: '#667781',
    whatsappGreen: '#00a884',
    avatarColors: {
      green: '#00a884',
      purple: '#8B5CF6',
      red: '#EF4444',
      cyan: '#06B6D4',
      orange: '#F59E0B',
      pink: '#EC4899'
    },
    inputBackground: '#202c33',
    incomingBubbleBackground: '#202c33',
    outgoingBubbleBackground: '#005c4b'
  };

  // بيانات المحادثات
  const chats = [
    {
      id: '1',
      name: '+1 (718) 569-7677',
      lastMessage: 'This message can\'t be displayed',
      timestamp: '4/9/2025',
      avatar: '👤',
      avatarColor: whatsappColors.avatarColors.green,
      unreadCount: 1,
      isOnline: true,
      hasUnreadDot: true,
      isUnread: true,
      isNew: true,
      platform: 'whatsapp'
    },
    {
      id: '2',
      name: 'عبدالله',
      lastMessage: 'رسالتك الأخيرة',
      timestamp: '4/8/2025',
      avatar: 'ع',
      avatarColor: whatsappColors.avatarColors.purple,
      unreadCount: 3,
      isOnline: false,
      hasUnreadDot: false,
      isUnread: true,
      isNew: false,
      platform: 'whatsapp'
    },
    {
      id: '3',
      name: 'Khalid Family',
      lastMessage: 'Photo',
      timestamp: '4/7/2025',
      avatar: 'K',
      avatarColor: whatsappColors.avatarColors.red,
      unreadCount: 5,
      isOnline: true,
      hasUnreadDot: true,
      isUnread: true,
      isNew: true,
      platform: 'facebook'
    },
    {
      id: '4',
      name: 'Sarah Ahmed',
      lastMessage: 'شكراً على المساعدة',
      timestamp: '4/6/2025',
      avatar: 'S',
      avatarColor: whatsappColors.avatarColors.cyan,
      unreadCount: 0,
      isOnline: false,
      hasUnreadDot: false,
      isUnread: false,
      isNew: false,
      platform: 'whatsapp'
    },
    {
      id: '5',
      name: 'محمد علي',
      lastMessage: 'تم إرسال الملف',
      timestamp: '4/5/2025',
      avatar: 'م',
      avatarColor: whatsappColors.avatarColors.orange,
      unreadCount: 2,
      isOnline: true,
      hasUnreadDot: false,
      isUnread: true,
      isNew: false,
      platform: 'instagram'
    },
    {
      id: '6',
      name: 'Team Updates',
      lastMessage: 'Meeting at 3 PM',
      timestamp: '4/4/2025',
      avatar: 'T',
      avatarColor: whatsappColors.avatarColors.pink,
      unreadCount: 0,
      isOnline: false,
      hasUnreadDot: false,
      isUnread: false,
      isNew: false,
      platform: 'instagram'
    },
    {
      id: '7',
      name: 'ماما نجلى',
      lastMessage: 'وصلتني الصورة شكراً',
      timestamp: '4/3/2025',
      avatar: 'م',
      avatarColor: whatsappColors.avatarColors.green,
      unreadCount: 1,
      isOnline: true,
      hasUnreadDot: true,
      isUnread: true,
      isNew: true,
      platform: 'instagram'
    },
    {
      id: '8',
      name: 'Ahmed Store',
      lastMessage: 'الطلب جاهز للاستلام',
      timestamp: '4/2/2025',
      avatar: 'A',
      avatarColor: whatsappColors.avatarColors.purple,
      unreadCount: 0,
      isOnline: false,
      hasUnreadDot: false,
      isUnread: false,
      isNew: false,
      platform: 'facebook'
    },
    {
      id: '9',
      name: 'Support Team',
      lastMessage: 'How can we help you?',
      timestamp: '4/1/2025',
      avatar: 'S',
      avatarColor: whatsappColors.avatarColors.cyan,
      unreadCount: 0,
      isOnline: true,
      hasUnreadDot: false,
      isUnread: false,
      isNew: false,
      platform: 'whatsapp'
    },
    {
      id: '10',
      name: 'فريق العمل',
      lastMessage: 'تم الانتهاء من المشروع',
      timestamp: '3/31/2025',
      avatar: 'ف',
      avatarColor: whatsappColors.avatarColors.orange,
      unreadCount: 2,
      isOnline: false,
      hasUnreadDot: false,
      isUnread: true,
      isNew: false,
      platform: 'snapchat'
    },
    {
      id: '11',
      name: 'Tech News',
      lastMessage: 'New AI features released',
      timestamp: '3/30/2025',
      avatar: 'T',
      avatarColor: whatsappColors.avatarColors.red,
      unreadCount: 0,
      isOnline: false,
      hasUnreadDot: false,
      isUnread: false,
      isNew: false,
      platform: 'snapchat'
    },
    {
      id: '12',
      name: 'عائلة أحمد',
      lastMessage: 'صباح الخير',
      timestamp: '3/29/2025',
      avatar: 'ع',
      avatarColor: whatsappColors.avatarColors.pink,
      unreadCount: 1,
      isOnline: true,
      hasUnreadDot: false,
      isUnread: true,
      isNew: false,
      platform: 'tiktok'
    },
    {
      id: '13',
      name: 'موقع المطعم',
      lastMessage: 'موقعك الحالي: شارع الملك فهد',
      timestamp: '4/10/2025',
      avatar: '📍',
      avatarColor: whatsappColors.avatarColors.cyan,
      unreadCount: 2,
      isOnline: true,
      hasUnreadDot: true,
      isUnread: true,
      isNew: true,
      platform: 'google-maps'
    },
    {
      id: '14',
      name: 'Location Update',
      lastMessage: 'Your destination is 5 min away',
      timestamp: '4/9/2025',
      avatar: '🗺️',
      avatarColor: whatsappColors.avatarColors.green,
      unreadCount: 0,
      isOnline: false,
      hasUnreadDot: false,
      isUnread: false,
      isNew: false,
      platform: 'google-maps'
    },
  ];

  // Platform badges with real icons
  const platformIcons = [
    { 
      id: 'all', 
      name: t.allPlatforms, 
      IconComponent: SocialMediaIcons.all, 
      color: '#4F97FF', 
      label: t.allPlatforms 
    },
    { 
      id: 'whatsapp', 
      name: t.whatsapp, 
      IconComponent: SocialMediaIcons.whatsapp, 
      color: '#25D366', 
      label: t.whatsapp 
    },
    { 
      id: 'instagram', 
      name: t.instagram, 
      IconComponent: SocialMediaIcons.instagram, 
      color: '#E4405F', 
      label: t.instagram 
    },
    { 
      id: 'facebook', 
      name: t.facebook, 
      IconComponent: SocialMediaIcons.facebook, 
      color: '#1877F2', 
      label: t.facebook 
    },
    { 
      id: 'snapchat', 
      name: t.snapchat, 
      IconComponent: SocialMediaIcons.snapchat, 
      color: '#FFFC00', 
      label: t.snapchat 
    },
    { 
      id: 'tiktok', 
      name: t.tiktok, 
      IconComponent: SocialMediaIcons.tiktok, 
      color: '#000000', 
      label: t.tiktok 
    },
    { 
      id: 'google-maps', 
      name: t.googleMaps, 
      IconComponent: SocialMediaIcons.googleMaps, 
      color: '#4285F4', 
      label: t.googleMaps 
    },
  ];

  // Messages data
  const messages = [
    {
      id: '1',
      sender: 'incoming',
      content: 'مرحباً! كيف يمكنني مساعدتك اليوم؟',
      timestamp: '2:30 PM',
      status: null
    },
    {
      id: '2',
      sender: 'outgoing',
      content: 'أريد الاستفسار عن الخدمة',
      timestamp: '2:32 PM',
      status: 'read'
    },
    {
      id: '3',
      sender: 'incoming',
      content: 'با��تأكيد! يمكنني مساعدتك. ما هي التفاصيل التي تحتاج إلى معرفتها؟',
      timestamp: '2:33 PM',
      status: null
    },
  ];

  // =========== Filtered Chats ===========
  const filteredChats = chats.filter(chat => {
    const matchesSearch = searchQuery === '' || 
      chat.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      chat.lastMessage.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesPlatform = selectedPlatform === 'all' || chat.platform === selectedPlatform;
    const matchesFilter = selectedFilter === 'all' 
      ? true 
      : selectedFilter === 'unread' 
        ? chat.isUnread 
        : chat.isNew;
    return matchesSearch && matchesPlatform && matchesFilter;
  });

  const selectedChatData = chats.find(chat => chat.id === selectedChat);

  // Update chat item refs array
  useEffect(() => {
    chatItemRefs.current = chatItemRefs.current.slice(0, filteredChats.length);
  }, [filteredChats.length]);

  // =========== Unread Count Calculations ===========
  const getUnreadCountByPlatform = (platform: string) => {
    if (platform === 'all') {
      return chats.filter(c => c.isUnread).length;
    }
    return chats.filter(c => c.platform === platform && c.isUnread).length;
  };

  // =========== Event Handlers ===========
  const handleSendMessage = useCallback(() => {
    if (messageText.trim()) {
      console.log('Sending message:', messageText);
      setMessageText('');
      setLiveAnnouncement(language === 'ar' ? 'تم إرسال الرسالة' : 'Message sent');
      setTimeout(() => setLiveAnnouncement(''), 3000);
      inputRef.current?.focus();
    }
  }, [messageText, language]);

  const handleKeyPress = useCallback((e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  }, [handleSendMessage]);

  const handleChatSelect = useCallback((chatId: string, index: number) => {
    setSelectedChat(chatId);
    setFocusedChatIndex(index);
    const chat = chats.find(c => c.id === chatId);
    if (chat) {
      const unreadText = chat.unreadCount > 0 
        ? `${chat.unreadCount} ${t.unreadMessages}`
        : '';
      setLiveAnnouncement(
        `${t.chatSelected}: ${chat.name}. ${unreadText}`
      );
    }
    if (isMobile) {
      setShowChatList(false);
    }
  }, [isMobile, chats, t]);

  const handleBackToList = useCallback(() => {
    setShowChatList(true);
    setLiveAnnouncement(t.chatList);
    setTimeout(() => {
      chatItemRefs.current[focusedChatIndex]?.focus();
    }, 100);
  }, [focusedChatIndex, t]);

  // =========== Keyboard Navigation ===========
  const handleChatListKeyDown = useCallback((e: KeyboardEvent<HTMLDivElement>, index: number) => {
    const maxIndex = filteredChats.length - 1;
    
    switch(e.key) {
      case 'ArrowDown':
        e.preventDefault();
        const nextIndex = Math.min(index + 1, maxIndex);
        chatItemRefs.current[nextIndex]?.focus();
        setFocusedChatIndex(nextIndex);
        break;
        
      case 'ArrowUp':
        e.preventDefault();
        const prevIndex = Math.max(index - 1, 0);
        chatItemRefs.current[prevIndex]?.focus();
        setFocusedChatIndex(prevIndex);
        break;
        
      case 'Enter':
      case ' ':
        e.preventDefault();
        handleChatSelect(filteredChats[index].id, index);
        break;
        
      case 'Home':
        e.preventDefault();
        chatItemRefs.current[0]?.focus();
        setFocusedChatIndex(0);
        break;
        
      case 'End':
        e.preventDefault();
        chatItemRefs.current[maxIndex]?.focus();
        setFocusedChatIndex(maxIndex);
        break;
    }
  }, [filteredChats, handleChatSelect]);

  const handlePlatformKeyDown = useCallback((e: KeyboardEvent<HTMLButtonElement>, platformId: string, index: number) => {
    const maxIndex = platformIcons.length - 1;
    
    switch(e.key) {
      case 'ArrowRight':
        e.preventDefault();
        const nextIndex = language === 'ar' ? Math.max(index - 1, 0) : Math.min(index + 1, maxIndex);
        document.querySelector<HTMLButtonElement>(`[data-platform-index="${nextIndex}"]`)?.focus();
        break;
        
      case 'ArrowLeft':
        e.preventDefault();
        const prevIndex = language === 'ar' ? Math.min(index + 1, maxIndex) : Math.max(index - 1, 0);
        document.querySelector<HTMLButtonElement>(`[data-platform-index="${prevIndex}"]`)?.focus();
        break;
        
      case 'Enter':
      case ' ':
        e.preventDefault();
        setSelectedPlatform(platformId);
        setLiveAnnouncement(`${t.platformFilter}: ${platformIcons.find(p => p.id === platformId)?.label}`);
        break;
    }
  }, [language, platformIcons, t]);

  // Don't render until client-side hydration is complete
  if (!isClient) {
    return (
      <DesignProvider>
        <div 
          style={{
            height: '100vh',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            backgroundColor: whatsappColors.deepBackground,
            color: whatsappColors.primaryText
          }}
        >
          Loading...
        </div>
      </DesignProvider>
    );
  }

  return (
    <DesignProvider>
      {/* Live Announcements */}
      <div 
        role="status" 
        aria-live="polite" 
        aria-atomic="true" 
        className="sr-only"
      >
        {liveAnnouncement}
      </div>

      {/* Keyboard Navigation Hints */}
      <div className="sr-only" role="region" aria-label={t.useArrowKeys}>
        {t.useArrowKeys}. {t.pressEnterToSend}. {t.pressEscapeToClose}.
      </div>

      <div 
        style={{
          height: '100vh',
          display: 'flex',
          backgroundColor: whatsappColors.deepBackground,
          overflow: 'hidden'
        }}
      >
        {/* عمود الأيقونات الأيسر - Left Icon Column */}
        <aside
          role="complementary"
          aria-label="شريط الأدوات"
          style={{
            width: '64px',
            backgroundColor: '#0b141a',
            borderRight: `1px solid ${whatsappColors.borderColor}`,
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            padding: '16px 0',
            gap: '16px'
          }}
        >
          {/* إغلاق التطبيق - Close App */}
          <button
            onClick={() => {
              if (window.confirm('هل تريد إغلاق التطبيق؟')) {
                window.close();
              }
            }}
            style={{
              width: '48px',
              height: '48px',
              borderRadius: '12px',
              backgroundColor: 'transparent',
              border: 'none',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: '#ef4444',
              transition: 'all 0.2s ease'
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.backgroundColor = '#1f2937';
              e.currentTarget.style.color = '#dc2626';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.backgroundColor = 'transparent';
              e.currentTarget.style.color = '#ef4444';
            }}
            title="إغلاق التطبيق"
            aria-label="إغلاق التطبيق"
          >
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <line x1="18" y1="6" x2="6" y2="18"></line>
              <line x1="6" y1="6" x2="18" y2="18"></line>
            </svg>
          </button>

          {/* الرسائل الجديدة - New Messages */}
          <button
            onClick={() => {
              setLiveAnnouncement('تم فتح قائمة الرسائل الجديدة');
              // Add new messages logic here
            }}
            style={{
              width: '48px',
              height: '48px',
              borderRadius: '12px',
              backgroundColor: 'transparent',
              border: 'none',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: '#8696a0',
              transition: 'all 0.2s ease',
              position: 'relative'
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.backgroundColor = '#1f2937';
              e.currentTarget.style.color = '#3b82f6';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.backgroundColor = 'transparent';
              e.currentTarget.style.color = '#8696a0';
            }}
            title="الرسائل الجديدة"
            aria-label="الرسائل الجديدة"
          >
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="m3 21 1.9-5.7a8.5 8.5 0 1 1 3.8 3.8z"></path>
            </svg>
            {/* عداد الرسائل الجديدة */}
            <div
              style={{
                position: 'absolute',
                top: '4px',
                right: '4px',
                width: '18px',
                height: '18px',
                borderRadius: '50%',
                backgroundColor: '#ef4444',
                color: '#ffffff',
                fontSize: '10px',
                fontWeight: '600',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                border: '2px solid #0b141a'
              }}
            >
              5
            </div>
          </button>

          {/* الشاشة الرئيسية - Home */}
          <button
            onClick={() => {
              setLiveAnnouncement('تم الانتقال إلى الصفحة الرئيسية');
              window.location.href = '/home';
            }}
            style={{
              width: '48px',
              height: '48px',
              borderRadius: '12px',
              backgroundColor: selectedChat === null ? '#00a884' : 'transparent',
              border: 'none',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: selectedChat === null ? '#ffffff' : '#8696a0',
              transition: 'all 0.2s ease'
            }}
            onMouseEnter={(e) => {
              if (selectedChat !== null) {
                e.currentTarget.style.backgroundColor = '#1f2937';
                e.currentTarget.style.color = '#00a884';
              }
            }}
            onMouseLeave={(e) => {
              if (selectedChat !== null) {
                e.currentTarget.style.backgroundColor = 'transparent';
                e.currentTarget.style.color = '#8696a0';
              }
            }}
            title="الشاشة الرئيسية"
            aria-label="الشاشة الرئيسية"
          >
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="m3 9 9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"></path>
              <polyline points="9,22 9,12 15,12 15,22"></polyline>
            </svg>
          </button>

          {/* الأتمتة - Automation */}
          <button
            onClick={() => {
              setLiveAnnouncement('تم الانتقال إلى صفحة الأتمتة');
              window.location.href = '/automation';
            }}
            style={{
              width: '48px',
              height: '48px',
              borderRadius: '12px',
              backgroundColor: 'transparent',
              border: 'none',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: '#8696a0',
              transition: 'all 0.2s ease'
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.backgroundColor = '#1f2937';
              e.currentTarget.style.color = '#4f97ff';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.backgroundColor = 'transparent';
              e.currentTarget.style.color = '#8696a0';
            }}
            title="الأتمتة"
            aria-label="الأتمتة"
          >
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M12 2L2 7l10 5 10-5-10-5z"></path>
              <path d="M2 17l10 5 10-5"></path>
              <path d="M2 12l10 5 10-5"></path>
            </svg>
          </button>

          {/* البوت - Bot */}
          <button
            onClick={() => {
              setLiveAnnouncement('تم الانتقال إلى إعدادات البوت الذكي');
              window.location.href = '/bot-settings';
            }}
            style={{
              width: '48px',
              height: '48px',
              borderRadius: '12px',
              backgroundColor: 'transparent',
              border: 'none',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: '#8696a0',
              transition: 'all 0.2s ease'
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.backgroundColor = '#1f2937';
              e.currentTarget.style.color = '#10b981';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.backgroundColor = 'transparent';
              e.currentTarget.style.color = '#8696a0';
            }}
            title="البوت الذكي"
            aria-label="البوت الذكي"
          >
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M12 8V4H8"></path>
              <rect width="16" height="12" x="4" y="8" rx="2"></rect>
              <path d="M2 14h2"></path>
              <path d="M20 14h2"></path>
              <path d="M15 13v2"></path>
              <path d="M9 13v2"></path>
            </svg>
          </button>

          {/* حملات واتساب - WhatsApp Campaigns */}
          <button
            onClick={() => {
              setLiveAnnouncement('تم الانتقال إلى إدارة حملات واتساب');
              window.location.href = '/whatsapp-campaigns';
            }}
            style={{
              width: '48px',
              height: '48px',
              borderRadius: '12px',
              backgroundColor: 'transparent',
              border: 'none',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: '#8696a0',
              transition: 'all 0.2s ease'
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.backgroundColor = '#1f2937';
              e.currentTarget.style.color = '#00a884';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.backgroundColor = 'transparent';
              e.currentTarget.style.color = '#8696a0';
            }}
            title="حملات واتساب"
            aria-label="حملات واتساب"
          >
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M3 12a9 9 0 0 1 9-9 9.75 9.75 0 0 1 6.74 2.74L21 8"></path>
              <path d="M21 3v5h-5"></path>
              <path d="M21 12a9 9 0 0 1-9 9 9.75 9.75 0 0 1-6.74-2.74L3 16"></path>
              <path d="M3 21v-5h5"></path>
              <path d="M11 12h4l-2-2"></path>
              <path d="M13 14l2-2"></path>
            </svg>
          </button>

          {/* Spacer للدفع للأسفل */}
          <div style={{ flex: 1 }}></div>

          {/* تبديل الوضع الليلي/النهاري - Dark/Light Mode */}
          <button
            onClick={() => {
              setLiveAnnouncement('تم تغيير الوضع');
              // Add theme toggle logic here
            }}
            style={{
              width: '48px',
              height: '48px',
              borderRadius: '12px',
              backgroundColor: 'transparent',
              border: 'none',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: '#8696a0',
              transition: 'all 0.2s ease'
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.backgroundColor = '#1f2937';
              e.currentTarget.style.color = '#f59e0b';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.backgroundColor = 'transparent';
              e.currentTarget.style.color = '#8696a0';
            }}
            title="تبديل الوضع الليلي/النهاري"
            aria-label="تبديل الوضع الليلي/النهاري"
          >
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <circle cx="12" cy="12" r="5"></circle>
              <line x1="12" y1="1" x2="12" y2="3"></line>
              <line x1="12" y1="21" x2="12" y2="23"></line>
              <line x1="4.22" y1="4.22" x2="5.64" y2="5.64"></line>
              <line x1="18.36" y1="18.36" x2="19.78" y2="19.78"></line>
              <line x1="1" y1="12" x2="3" y2="12"></line>
              <line x1="21" y1="12" x2="23" y2="12"></line>
              <line x1="4.22" y1="19.78" x2="5.64" y2="18.36"></line>
              <line x1="18.36" y1="5.64" x2="19.78" y2="4.22"></line>
            </svg>
          </button>

          {/* الإعدادات - Settings */}
          <button
            onClick={() => {
              setLiveAnnouncement('تم فتح الإعدادات');
              // Add settings logic here
            }}
            style={{
              width: '48px',
              height: '48px',
              borderRadius: '12px',
              backgroundColor: 'transparent',
              border: 'none',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: '#8696a0',
              transition: 'all 0.2s ease'
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.backgroundColor = '#1f2937';
              e.currentTarget.style.color = '#8b5cf6';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.backgroundColor = 'transparent';
              e.currentTarget.style.color = '#8696a0';
            }}
            title="الإعدادات"
            aria-label="الإعدادات"
          >
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <circle cx="12" cy="12" r="3"></circle>
              <path d="M12 1v6m0 10v6m-7-7h6m10 0h6M7.05 7.05l4.24 4.24m7.42 0l4.24 4.24M7.05 16.95l4.24-4.24m7.42 0l4.24-4.24"></path>
            </svg>
          </button>
        </aside>

        {/* قائمة المحادثات - Sidebar */}
        <aside
          role="complementary"
          aria-label={t.chatList}
          style={{
            width: isMobile ? '100%' : '418px',
            backgroundColor: whatsappColors.sidebarBackground,
            borderRight: `1px solid ${whatsappColors.borderColor}`,
            display: isMobile && !showChatList ? 'none' : 'flex',
            flexDirection: 'column',
            position: isMobile ? 'absolute' : 'relative',
            top: 0,
            left: 0,
            bottom: 0,
            zIndex: isMobile ? 10 : 1,
            transition: 'transform 0.3s ease'
          }}
        >
          {/* رأس قائمة المحادثات */}
          <div
            style={{
              height: '59px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              padding: '0 16px',
              backgroundColor: whatsappColors.headerBackground,
              borderBottom: `1px solid ${whatsappColors.borderColor}`
            }}
          >
            <h1 
              style={{
                fontSize: '16px',
                fontWeight: 400,
                color: whatsappColors.primaryText,
                margin: 0
              }}
              id="chat-list-title"
            >
              {t.chatList}
            </h1>
            
            <div style={{ display: 'flex', gap: '20px' }}>
              <button
                aria-label={t.moreOptions}
                style={{
                  background: 'transparent',
                  border: 'none',
                  cursor: 'pointer',
                  color: whatsappColors.secondaryText,
                  padding: '8px',
                  borderRadius: '50%',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center'
                }}
              >
                <Plus size={20} />
              </button>
              <button
                aria-label={t.moreOptions}
                style={{
                  background: 'transparent',
                  border: 'none',
                  cursor: 'pointer',
                  color: whatsappColors.secondaryText,
                  padding: '8px',
                  borderRadius: '50%',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center'
                }}
              >
                <MoreVertical size={20} />
              </button>
            </div>
          </div>

          {/* منطقة التصفية والبحث */}
          <div 
            style={{ 
              padding: '12px 16px',
              display: 'flex',
              flexDirection: 'column',
              gap: '12px',
              backgroundColor: whatsappColors.sidebarBackground
            }}
          >
            {/* أيقونات المنصات */}
            <nav
              role="navigation"
              aria-label={t.platformFilter}
              style={{
                display: 'flex',
                gap: '8px',
                overflowX: 'auto',
                paddingBottom: '4px'
              }}
            >
              {platformIcons.map((platform, index) => {
                const unreadCount = getUnreadCountByPlatform(platform.id);
                const isSelected = selectedPlatform === platform.id;
                const IconComponent = platform.IconComponent;
                
                return (
                  <button
                    key={platform.id}
                    data-platform-index={index}
                    onClick={() => {
                      setSelectedPlatform(platform.id);
                      setLiveAnnouncement(`${t.platformFilter}: ${platform.label}`);
                    }}
                    onKeyDown={(e) => handlePlatformKeyDown(e, platform.id, index)}
                    aria-label={`${platform.label}${unreadCount > 0 ? `, ${unreadCount} ${t.unreadMessages}` : ''}`}
                    aria-pressed={isSelected}
                    style={{
                      position: 'relative',
                      width: '48px',
                      height: '48px',
                      borderRadius: '50%',
                      border: isSelected ? `2px solid ${platform.color}` : 'none',
                      cursor: 'pointer',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
                      backgroundColor: isSelected 
                        ? `${platform.color}15`
                        : whatsappColors.headerBackground,
                      flexShrink: 0,
                      transform: isSelected ? 'scale(1.05)' : 'scale(1)',
                      boxShadow: isSelected 
                        ? `0 0 0 3px ${platform.color}20, 0 2px 8px ${platform.color}30`
                        : 'none'
                    }}
                  >
                    <span 
                      aria-hidden="true"
                      style={{
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        transition: 'all 0.3s ease'
                      }}
                    >
                      <IconComponent isActive={isSelected} />
                    </span>
                    
                    {unreadCount > 0 && (
                      <span
                        aria-label={`${unreadCount} ${t.unreadMessages}`}
                        style={{
                          position: 'absolute',
                          top: '-2px',
                          right: '-2px',
                          minWidth: '20px',
                          height: '20px',
                          borderRadius: '50%',
                          backgroundColor: '#FF3B30',
                          color: '#FFFFFF',
                          fontSize: '11px',
                          fontWeight: 600,
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          padding: '0 5px',
                          border: `2px solid ${whatsappColors.sidebarBackground}`
                        }}
                      >
                        {unreadCount}
                      </span>
                    )}
                  </button>
                );
              })}
            </nav>

            {/* شريط الفلاتر */}
            <div
              role="tablist"
              aria-label={t.typeFilter}
              style={{
                display: 'flex',
                gap: '8px',
                padding: '4px 0'
              }}
            >
              {['all', 'unread', 'new'].map((filter) => {
                const isSelected = selectedFilter === filter;
                const label = filter === 'all' ? t.allChats : filter === 'unread' ? t.unreadChats : t.newChats;
                
                return (
                  <button
                    key={filter}
                    role="tab"
                    aria-selected={isSelected}
                    aria-controls="chat-list"
                    onClick={() => {
                      setSelectedFilter(filter);
                      setLiveAnnouncement(`${t.typeFilter}: ${label}`);
                    }}
                    style={{
                      padding: '6px 16px',
                      borderRadius: '16px',
                      border: 'none',
                      cursor: 'pointer',
                      fontSize: '13px',
                      fontWeight: '500',
                      transition: 'all 0.2s ease',
                      backgroundColor: isSelected 
                        ? whatsappColors.whatsappGreen 
                        : whatsappColors.headerBackground,
                      color: isSelected 
                        ? '#ffffff' 
                        : whatsappColors.secondaryText
                    }}
                  >
                    {label}
                  </button>
                );
              })}
            </div>

            {/* حقل البحث */}
            <div 
              role="search"
              style={{
                display: 'flex',
                alignItems: 'center',
                padding: '8px 12px',
                borderRadius: '8px',
                backgroundColor: whatsappColors.headerBackground,
                border: `1px solid ${whatsappColors.borderColor}`
              }}
            >
              <label htmlFor="chat-search" className="sr-only">
                {t.searchPlaceholder}
              </label>
              <Search 
                size={16} 
                style={{ color: whatsappColors.mutedText, marginLeft: '8px' }}
                aria-hidden="true"
              />
              <input
                id="chat-search"
                ref={searchInputRef}
                type="text"
                placeholder={t.searchPlaceholder}
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                aria-label={t.searchPlaceholder}
                aria-describedby="search-hint"
                style={{
                  flex: 1,
                  background: 'transparent',
                  border: 'none',
                  outline: 'none',
                  fontSize: '15px',
                  color: whatsappColors.primaryText,
                  fontFamily: 'inherit'
                }}
              />
              <span id="search-hint" className="sr-only">
                {language === 'ar' 
                  ? 'اكتب للبحث في المحادثات' 
                  : 'Type to search conversations'}
              </span>
            </div>
          </div>

          {/* قائمة المحادثات */}
          <div 
            ref={chatListRef}
            role="list"
            id="chat-list"
            aria-labelledby="chat-list-title"
            aria-live="polite"
            aria-relevant="additions removals"
            style={{ 
              flex: 1, 
              overflowY: 'auto',
              scrollbarWidth: 'none',
              msOverflowStyle: 'none'
            }}
            className="scrollbar-hide"
          >
            {filteredChats.length === 0 ? (
              <div 
                role="status"
                style={{
                  padding: '32px 16px',
                  textAlign: 'center',
                  color: whatsappColors.mutedText
                }}
              >
                {language === 'ar' ? 'لا توجد محادثات' : 'No conversations found'}
              </div>
            ) : (
              filteredChats.map((chat, index) => (
                <div
                  key={chat.id}
                  ref={(el) => chatItemRefs.current[index] = el}
                  role="listitem"
                  tabIndex={0}
                  aria-selected={selectedChat === chat.id}
                  aria-label={`${t.messageFrom} ${chat.name}. ${chat.lastMessage}. ${chat.timestamp}${chat.unreadCount > 0 ? `. ${chat.unreadCount} ${t.unreadMessages}` : ''}${chat.isOnline ? `. ${t.online}` : ''}`}
                  onClick={() => handleChatSelect(chat.id, index)}
                  onKeyDown={(e) => handleChatListKeyDown(e, index)}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    padding: isMobile ? '16px' : '12px 16px',
                    cursor: 'pointer',
                    backgroundColor: selectedChat === chat.id 
                      ? whatsappColors.headerBackground
                      : 'transparent',
                    transition: 'background-color 0.15s ease',
                    outline: 'none'
                  }}
                  onMouseEnter={(e) => {
                    if (selectedChat !== chat.id) {
                      e.currentTarget.style.backgroundColor = whatsappColors.headerBackground;
                    }
                  }}
                  onMouseLeave={(e) => {
                    if (selectedChat !== chat.id) {
                      e.currentTarget.style.backgroundColor = 'transparent';
                    }
                  }}
                >
                  {/* الأفاتار */}
                  <div style={{ position: 'relative', marginLeft: '12px' }}>
                    <div 
                      aria-hidden="true"
                      style={{
                        width: '49px',
                        height: '49px',
                        borderRadius: '50%',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        backgroundColor: chat.avatarColor,
                        color: '#FFFFFF',
                        fontSize: '18px',
                        fontWeight: 400
                      }}
                    >
                      {chat.avatar}
                    </div>
                    
                    {/* النقطة الخضراء - متصل */}
                    {chat.isOnline && (
                      <div 
                        aria-label={t.online}
                        style={{
                          position: 'absolute',
                          bottom: '2px',
                          right: '2px',
                          width: '14px',
                          height: '14px',
                          borderRadius: '50%',
                          backgroundColor: whatsappColors.whatsappGreen,
                          border: `2px solid ${whatsappColors.sidebarBackground}`
                        }}
                      />
                    )}
                    
                    {/* نقطة غير مقروءة */}
                    {chat.hasUnreadDot && (
                      <div 
                        aria-label={t.newMessage}
                        style={{
                          position: 'absolute',
                          top: '0',
                          right: '0',
                          width: '8px',
                          height: '8px',
                          borderRadius: '50%',
                          backgroundColor: whatsappColors.whatsappGreen
                        }}
                      />
                    )}
                  </div>
                  
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '4px' }}>
                      {/* اسم جهة الاتصال */}
                      <h3 
                        style={{
                          fontSize: '17px',
                          fontWeight: 400,
                          color: whatsappColors.primaryText,
                          margin: 0,
                          overflow: 'hidden',
                          textOverflow: 'ellipsis',
                          whiteSpace: 'nowrap',
                          maxWidth: '220px',
                          lineHeight: '22px'
                        }}
                      >
                        {chat.name}
                      </h3>
                      
                      {/* الوقت */}
                      <time 
                        dateTime={chat.timestamp}
                        style={{
                          fontSize: '12px',
                          color: whatsappColors.mutedText,
                          whiteSpace: 'nowrap',
                          marginRight: '8px',
                          marginTop: '2px'
                        }}
                      >
                        {chat.timestamp}
                      </time>
                    </div>
                    
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                      {/* معاينة الرسالة */}
                      <p 
                        style={{
                          fontSize: '14px',
                          color: whatsappColors.mutedText,
                          margin: 0,
                          overflow: 'hidden',
                          textOverflow: 'ellipsis',
                          whiteSpace: 'nowrap',
                          flex: 1,
                          lineHeight: '20px'
                        }}
                      >
                        {chat.lastMessage}
                      </p>
                      
                      {/* عداد الرسائل غير المقروءة */}
                      {chat.unreadCount > 0 && (
                        <div 
                          aria-label={`${chat.unreadCount} ${t.unreadMessages}`}
                          style={{
                            minWidth: '20px',
                            height: '20px',
                            borderRadius: '50%',
                            backgroundColor: whatsappColors.whatsappGreen,
                            color: '#FFFFFF',
                            fontSize: '12px',
                            fontWeight: 600,
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            marginLeft: '8px'
                          }}
                        >
                          {chat.unreadCount}
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
        </aside>

        {/* منطقة المحادثة الرئيسية */}
        <main 
          role="main"
          aria-label={selectedChatData ? `${t.messageFrom} ${selectedChatData.name}` : t.welcomeTitle}
          style={{ flex: 1, display: 'flex', flexDirection: 'column' }}
        >
          <div style={{ display: 'flex', flex: 1 }}>
            {/* منطقة المحادثة */}
            <div style={{ flex: 1, display: 'flex', flexDirection: 'column' }}>
              {selectedChatData ? (
            <>
              {/* رأس المحادثة */}
              <div
                style={{
                  height: '59px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  padding: '0 16px',
                  backgroundColor: whatsappColors.headerBackground,
                  borderBottom: `1px solid ${whatsappColors.borderColor}`
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center' }}>
                  {/* زر الرجوع للجوال */}
                  {isMobile && (
                    <button
                      onClick={handleBackToList}
                      aria-label={t.backToList}
                      style={{
                        width: '44px',
                        height: '44px',
                        borderRadius: '50%',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        background: 'transparent',
                        border: 'none',
                        cursor: 'pointer',
                        color: whatsappColors.primaryText,
                        marginLeft: '-8px',
                        marginRight: '4px'
                      }}
                    >
                      <ChevronLeft size={24} />
                    </button>
                  )}
                  
                  <div 
                    aria-hidden="true"
                    style={{
                      width: '40px',
                      height: '40px',
                      borderRadius: '50%',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      backgroundColor: selectedChatData.avatarColor,
                      color: '#FFFFFF',
                      fontSize: '16px',
                      marginLeft: '12px'
                    }}
                  >
                    {selectedChatData.avatar}
                  </div>
                  <div>
                    <h2 
                      id="chat-name"
                      style={{
                        fontSize: '16px',
                        fontWeight: 400,
                        color: whatsappColors.primaryText,
                        margin: 0
                      }}
                    >
                      {selectedChatData.name}
                    </h2>
                    <p 
                      role="status"
                      aria-live="polite"
                      style={{
                        fontSize: '13px',
                        color: whatsappColors.mutedText,
                        margin: 0
                      }}
                    >
                      {selectedChatData.isOnline ? t.online : t.lastSeenRecently}
                    </p>
                  </div>
                </div>
                
                {/* أيقونات الإجراءات */}
                <div 
                  role="group"
                  aria-label={language === 'ar' ? 'إجراءات المحادثة' : 'Chat actions'}
                  style={{ display: 'flex', alignItems: 'center', gap: '24px' }}
                >
                  <button
                    aria-label={t.voiceCall}
                    style={{
                      background: 'transparent',
                      border: 'none',
                      cursor: 'pointer',
                      color: whatsappColors.secondaryText,
                      padding: '8px',
                      borderRadius: '50%',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center'
                    }}
                  >
                    <Phone size={20} />
                  </button>
                  <button
                    aria-label={t.videoCall}
                    style={{
                      background: 'transparent',
                      border: 'none',
                      cursor: 'pointer',
                      color: whatsappColors.secondaryText,
                      padding: '8px',
                      borderRadius: '50%',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center'
                    }}
                  >
                    <Video size={20} />
                  </button>
                  <button
                    aria-label={t.moreOptions}
                    aria-haspopup="menu"
                    style={{
                      background: 'transparent',
                      border: 'none',
                      cursor: 'pointer',
                      color: whatsappColors.secondaryText,
                      padding: '8px',
                      borderRadius: '50%',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center'
                    }}
                  >
                    <MoreVertical size={20} />
                  </button>
                </div>
              </div>

              {/* منطقة الرسائل */}
              <section
                role="log"
                aria-label={language === 'ar' ? 'سجل المحادثة' : 'Chat history'}
                aria-live="polite"
                aria-relevant="additions"
                aria-atomic="false"
                style={{
                  flex: 1,
                  overflowY: 'auto',
                  padding: '12px',
                  backgroundColor: whatsappColors.chatBackground,
                  backgroundImage: 'url("data:image/svg+xml,%3Csvg width=\"260\" height=\"260\" viewBox=\"0 0 260 260\" xmlns=\"http://www.w3.org/2000/svg\"%3E%3Cg fill=\"none\" fill-rule=\"evenodd\"%3E%3Cg fill=\"%23182025\" fill-opacity=\"0.04\"%3E%3Cpath d=\"M24.37 16c.2.65.39 1.32.54 2H21.17l1.17-2h2.03zm.68 4h-2.85l1.17-2h2.02c.14.68.3 1.35.46 2z\"/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")',
                  display: 'flex',
                  flexDirection: 'column',
                  gap: '2px'
                }}
              >
                {messages.map((message) => (
                  <WhatsAppBubble
                    key={message.id}
                    sender={message.sender as 'incoming' | 'outgoing'}
                    content={message.content}
                    timestamp={message.timestamp}
                    status={message.status || undefined}
                    language={language}
                    isDark={true}
                  />
                ))}

                {/* مؤشر الكتابة */}
                {isTyping && (
                  <div 
                    role="status"
                    aria-live="polite"
                    aria-label={t.typing}
                    style={{ display: 'flex', justifyContent: 'flex-start' }}
                  >
                    <div 
                      style={{
                        backgroundColor: whatsappColors.incomingBubbleBackground,
                        borderRadius: '7.5px',
                        padding: '6px 7px 8px 9px',
                        maxWidth: '240px',
                        margin: '0 0 0 0',
                        boxShadow: '0 1px 0.5px rgba(0,0,0,0.13)'
                      }}
                    >
                      <div style={{ display: 'flex', gap: '4px', alignItems: 'center', height: '18px' }}>
                        {[0, 150, 300].map((delay, index) => (
                          <div 
                            key={index}
                            aria-hidden="true"
                            style={{
                              width: '8px',
                              height: '8px',
                              borderRadius: '50%',
                              backgroundColor: whatsappColors.secondaryText,
                              animation: `typingDots 1.4s infinite ease-in-out`,
                              animationDelay: `${delay}ms`
                            }}
                          />
                        ))}
                      </div>
                    </div>
                    <span className="sr-only">{t.typing}</span>
                  </div>
                )}
              </section>

              {/* شريط الخيارات */}
              <div 
                role="group"
                aria-label={language === 'ar' ? 'خيارات سريعة' : 'Quick options'}
                style={{
                  minHeight: '60px',
                  backgroundColor: whatsappColors.headerBackground,
                  width: '100%',
                  borderBottom: '1px solid rgba(134, 150, 160, 0.15)',
                  display: 'flex',
                  alignItems: 'center',
                  padding: '10px 16px',
                  gap: '8px',
                  flexWrap: 'wrap',
                  overflowX: 'auto',
                  justifyContent: 'space-between'
                }}
              >
                {(() => {
                  const options = [
                    { id: 'booked', label: t.booked },
                    { id: 'inquiry', label: t.inquiryOnly },
                    { id: 'complaint', label: t.complaint },
                    { id: 'wrong', label: t.wrongNumber },
                    { id: 'notInterested', label: t.notInterested },
                    { id: 'noResponse', label: t.noResponse }
                  ];

                  const handleConfirm = () => {
                    if (selectedOption) {
                      const option = options.find(o => o.id === selectedOption);
                      setLiveAnnouncement(
                        `${t.confirm}: ${option?.label}`
                      );
                      alert(`${t.confirm}: ${option?.label}`);
                    }
                  };

                  return (
                    <>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '8px', flexWrap: 'wrap', flex: 1 }}>
                        {options.map((option) => {
                          const isSelected = selectedOption === option.id;
                          return (
                            <button
                              key={option.id}
                              onClick={() => setSelectedOption(option.id)}
                              aria-pressed={isSelected}
                              aria-label={option.label}
                              style={{
                                display: 'flex',
                                alignItems: 'center',
                                gap: '6px',
                                padding: '6px 12px',
                                backgroundColor: isSelected 
                                  ? 'rgba(0, 168, 132, 0.15)' 
                                  : whatsappColors.inputBackground,
                                color: whatsappColors.primaryText,
                                border: isSelected 
                                  ? `1px solid ${whatsappColors.whatsappGreen}` 
                                  : `1px solid rgba(134, 150, 160, 0.2)`,
                                borderRadius: '18px',
                                fontSize: '13px',
                                cursor: 'pointer',
                                transition: 'all 0.2s ease',
                                whiteSpace: 'nowrap'
                              }}
                            >
                              {isSelected ? (
                                <Check size={16} style={{ color: whatsappColors.whatsappGreen }} aria-hidden="true" />
                              ) : (
                                <Circle size={16} style={{ color: whatsappColors.secondaryText }} aria-hidden="true" />
                              )}
                              <span>{option.label}</span>
                            </button>
                          );
                        })}
                      </div>

                      <button
                        onClick={handleConfirm}
                        disabled={!selectedOption}
                        aria-disabled={!selectedOption}
                        aria-label={`${t.confirm}${selectedOption ? `: ${options.find(o => o.id === selectedOption)?.label}` : ''}`}
                        style={{
                          display: 'flex',
                          alignItems: 'center',
                          gap: '6px',
                          padding: '8px 16px',
                          backgroundColor: selectedOption 
                            ? whatsappColors.whatsappGreen 
                            : 'rgba(134, 150, 160, 0.3)',
                          color: selectedOption ? '#FFFFFF' : whatsappColors.secondaryText,
                          border: 'none',
                          borderRadius: '8px',
                          fontSize: '14px',
                          fontWeight: '500',
                          cursor: selectedOption ? 'pointer' : 'not-allowed',
                          transition: 'all 0.2s ease',
                          whiteSpace: 'nowrap',
                          opacity: selectedOption ? 1 : 0.6
                        }}
                      >
                        <X size={16} aria-hidden="true" />
                        <span>{t.confirm}</span>
                      </button>
                    </>
                  );
                })()}
              </div>

              {/* شريط الإدخال */}
              <form
                onSubmit={(e) => {
                  e.preventDefault();
                  handleSendMessage();
                }}
                role="form"
                aria-label={language === 'ar' ? 'إرسال رسالة' : 'Send message'}
                style={{
                  padding: '20px 16px 10px',
                  backgroundColor: whatsappColors.headerBackground
                }}
              >
                <div style={{ display: 'flex', alignItems: 'flex-end', gap: '5px' }}>
                  <button 
                    type="button"
                    aria-label={t.attachFile}
                    style={{
                      padding: '8px',
                      borderRadius: '50%',
                      background: 'transparent',
                      border: 'none',
                      cursor: 'pointer',
                      color: whatsappColors.secondaryText,
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center'
                    }}
                  >
                    <Paperclip size={24} />
                  </button>

                  <div 
                    style={{
                      flex: 1,
                      minHeight: '40px',
                      maxHeight: '120px',
                      backgroundColor: whatsappColors.inputBackground,
                      borderRadius: '21px',
                      display: 'flex',
                      alignItems: 'center',
                      paddingLeft: '12px',
                      paddingRight: '40px',
                      position: 'relative'
                    }}
                  >
                    <label htmlFor="message-input" className="sr-only">
                      {t.typeMessage}
                    </label>
                    <input
                      id="message-input"
                      ref={inputRef}
                      type="text"
                      placeholder={t.typeMessage}
                      value={messageText}
                      onChange={(e) => setMessageText(e.target.value)}
                      onKeyPress={handleKeyPress}
                      aria-label={t.typeMessage}
                      aria-describedby="input-hint"
                      style={{
                        flex: 1,
                        background: 'transparent',
                        border: 'none',
                        outline: 'none',
                        fontSize: '15px',
                        color: whatsappColors.primaryText,
                        padding: '9px 0',
                        fontFamily: 'inherit'
                      }}
                    />
                    <span id="input-hint" className="sr-only">
                      {t.pressEnterToSend}
                    </span>
                    <button 
                      type="button"
                      aria-label={t.addEmoji}
                      style={{
                        position: 'absolute',
                        right: '8px',
                        padding: '4px',
                        background: 'transparent',
                        border: 'none',
                        cursor: 'pointer',
                        color: whatsappColors.secondaryText,
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center'
                      }}
                    >
                      <Smile size={20} />
                    </button>
                  </div>

                  <button 
                    type="submit"
                    disabled={!messageText.trim()}
                    aria-disabled={!messageText.trim()}
                    aria-label={t.sendMessage}
                    title={messageText.trim() ? t.sendMessage : t.typeMessage}
                    style={{
                      width: '40px',
                      height: '40px',
                      borderRadius: '50%',
                      backgroundColor: messageText.trim() 
                        ? whatsappColors.whatsappGreen 
                        : whatsappColors.headerBackground,
                      color: messageText.trim() 
                        ? '#FFFFFF' 
                        : whatsappColors.mutedText,
                      border: 'none',
                      cursor: messageText.trim() ? 'pointer' : 'not-allowed',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      transition: 'all 0.2s ease',
                      opacity: messageText.trim() ? 1 : 0.5
                    }}
                  >
                    <Send size={20} />
                  </button>
                </div>
              </form>
              </>
            ) : (
              /* شاشة الترحيب */
              <div 
                role="complementary"
                aria-label={t.welcomeTitle}
                style={{
                  flex: 1,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  backgroundColor: whatsappColors.chatBackground,
                  flexDirection: 'column',
                  textAlign: 'center'
                }}
              >
                <div>
                  <div 
                    aria-hidden="true"
                    style={{
                      width: '320px',
                      height: '320px',
                      margin: '0 auto 28px',
                      opacity: 0.06,
                      background: `url("data:image/svg+xml,%3Csvg width='320' height='320' viewBox='0 0 24 24' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath fill='%23${whatsappColors.primaryText.slice(1)}' d='M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884'/%3E%3C/svg%3E") center/contain no-repeat`
                    }}
                  />
                  
                  <h1 
                    style={{
                      fontSize: '32px',
                      fontWeight: 300,
                      color: whatsappColors.primaryText,
                      margin: '0 0 18px 0',
                      letterSpacing: '-0.25px'
                    }}
                  >
                    {t.welcomeTitle}
                  </h1>
                  
                  <p 
                    style={{
                      fontSize: '14px',
                      color: whatsappColors.mutedText,
                      margin: '0 0 4px 0',
                      lineHeight: '20px'
                    }}
                  >
                    {t.welcomeDescription}
                  </p>
                  
                  <p 
                    style={{
                      fontSize: '14px',
                      color: whatsappColors.mutedText,
                      margin: 0,
                      lineHeight: '20px'
                    }}
                  >
                    {language === 'ar' 
                      ? 'استخدم واتساب على 4 أجهزة مربوطة وهاتف واحد في نفس الوقت.'
                      : 'Use WhatsApp on up to 4 linked devices and 1 phone at the same time.'}
                  </p>
                </div>

                <div 
                  role="contentinfo"
                  style={{
                    position: 'absolute',
                    bottom: '28px',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '6px',
                    fontSize: '13px',
                    color: whatsappColors.mutedText
                  }}
                >
                  <svg width="16" height="16" viewBox="0 0 16 16" fill="currentColor" aria-hidden="true">
                    <path d="M8 1a7 7 0 100 14A7 7 0 008 1zM7 4a1 1 0 112 0v3a1 1 0 11-2 0V4zm2 6a1 1 0 11-2 0 1 1 0 012 0z"/>
                  </svg>
                  {t.endToEndEncrypted}
                </div>
              </div>
            )}
            </div>



          </div>
        </main>
      </div>

      <style jsx>{`
        @keyframes typingDots {
          0%, 60%, 100% {
            transform: translateY(0);
            opacity: 0.4;
          }
          30% {
            transform: translateY(-4px);
            opacity: 1;
          }
        }
        
        .scrollbar-hide::-webkit-scrollbar {
          display: none;
        }
        
        .scrollbar-hide {
          -ms-overflow-style: none;
          scrollbar-width: none;
        }
        
        input::placeholder {
          color: #667781;
          opacity: 1;
        }
        
        /* تحسينات الجوال */
        @media (max-width: 767px) {
          button {
            min-width: 44px;
            min-height: 44px;
          }
          
          svg {
            pointer-events: none;
          }
        }

        * {
          -webkit-overflow-scrolling: touch;
        }

        @media (max-width: 767px) {
          * {
            touch-action: manipulation;
          }
        }
      `}</style>
    </DesignProvider>
  );
};