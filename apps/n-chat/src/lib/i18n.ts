/**
 * نظام الترجمة المتكامل - FlowCanvasAI
 * يدعم العربية والإنجليزية مع RTL/LTR
 */

export type Language = 'ar' | 'en';

export interface TranslationKeys {
  // Navigation
  skipToMainContent: string;
  skipToNavigation: string;
  skipToFooter: string;
  
  // Chat List
  chatList: string;
  searchPlaceholder: string;
  allChats: string;
  unreadChats: string;
  newChats: string;
  
  // Platforms
  whatsapp: string;
  instagram: string;
  facebook: string;
  snapchat: string;
  tiktok: string;
  googleSheets: string;
  googleMaps: string;
  allPlatforms: string;
  
  // Chat Actions
  typeMessage: string;
  sendMessage: string;
  recordVoice: string;
  attachFile: string;
  addEmoji: string;
  videoCall: string;
  voiceCall: string;
  moreOptions: string;
  backToList: string;
  
  // Status
  online: string;
  offline: string;
  lastSeenRecently: string;
  typing: string;
  
  // Messages
  unreadMessages: string;
  newMessage: string;
  messageFrom: string;
  messageTo: string;
  
  // Options
  confirm: string;
  cancel: string;
  booked: string;
  inquiryOnly: string;
  complaint: string;
  wrongNumber: string;
  notInterested: string;
  noResponse: string;
  
  // Accessibility
  chatSelected: string;
  unreadCount: string;
  platformFilter: string;
  typeFilter: string;
  pressEnterToSend: string;
  pressEscapeToClose: string;
  useArrowKeys: string;
  
  // Loading
  loading: string;
  loadingConversation: string;
  
  // Errors
  errorOccurred: string;
  tryAgain: string;
  
  // Welcome
  welcomeTitle: string;
  welcomeDescription: string;
  endToEndEncrypted: string;
}

export const translations: Record<Language, TranslationKeys> = {
  ar: {
    // Navigation
    skipToMainContent: 'انتقل إلى المحتوى الرئيسي',
    skipToNavigation: 'انتقل إلى القائمة',
    skipToFooter: 'انتقل إلى التذييل',
    
    // Chat List
    chatList: 'قائمة المحادثات',
    searchPlaceholder: 'بحث أو بدء محادثة جديدة',
    allChats: 'الكل',
    unreadChats: 'غير مقروء',
    newChats: 'جديد',
    
    // Platforms
    whatsapp: 'واتساب',
    instagram: 'إنستقرام',
    facebook: 'فيسبوك',
    snapchat: 'سناب شات',
    tiktok: 'تيك توك',
    googleSheets: 'جداول قوقل',
    googleMaps: 'خرائط جوجل',
    allPlatforms: 'جميع المنصات',
    
    // Chat Actions
    typeMessage: 'اكتب رسالة',
    sendMessage: 'إرسال الرسالة',
    recordVoice: 'تسجيل رسالة صوتية',
    attachFile: 'إرفاق ملف',
    addEmoji: 'إضافة رمز تعبيري',
    videoCall: 'مكالمة فيديو',
    voiceCall: 'مكالمة صوتية',
    moreOptions: 'المزيد من الخيارات',
    backToList: 'العودة لقائمة المحادثات',
    
    // Status
    online: 'متصل',
    offline: 'غير متصل',
    lastSeenRecently: 'آخر ظهور مؤخراً',
    typing: 'يكتب...',
    
    // Messages
    unreadMessages: 'رسائل غير مقروءة',
    newMessage: 'رسالة جديدة',
    messageFrom: 'رسالة من',
    messageTo: 'رسالة إلى',
    
    // Options
    confirm: 'اعتماد',
    cancel: 'إلغاء',
    booked: 'تم الحجز',
    inquiryOnly: 'استفسار فقط',
    complaint: 'شكوى',
    wrongNumber: 'الرقم خاطئ',
    notInterested: 'لا يرغب',
    noResponse: 'لا يرد',
    
    // Accessibility
    chatSelected: 'المحادثة المختارة',
    unreadCount: 'عدد الرسائل غير المقروءة',
    platformFilter: 'تصفية حسب المنصة',
    typeFilter: 'تصفية حسب النوع',
    pressEnterToSend: 'اضغط Enter للإرسال',
    pressEscapeToClose: 'اضغط Escape للإغلاق',
    useArrowKeys: 'استخدم الأسهم للتنقل',
    
    // Loading
    loading: 'جاري التحميل...',
    loadingConversation: 'جاري تحميل المحادثة الذكية...',
    
    // Errors
    errorOccurred: 'حدث خطأ',
    tryAgain: 'حاول مرة أخرى',
    
    // Welcome
    welcomeTitle: 'WhatsApp for Windows',
    welcomeDescription: 'إرسال واستقبال الرسائل دون الحاجة لإبقاء هاتفك متصلاً.',
    endToEndEncrypted: 'مشفر من طرف إلى طرف'
  },
  en: {
    // Navigation
    skipToMainContent: 'Skip to main content',
    skipToNavigation: 'Skip to navigation',
    skipToFooter: 'Skip to footer',
    
    // Chat List
    chatList: 'Chat List',
    searchPlaceholder: 'Search or start a new chat',
    allChats: 'All',
    unreadChats: 'Unread',
    newChats: 'New',
    
    // Platforms
    whatsapp: 'WhatsApp',
    instagram: 'Instagram',
    facebook: 'Facebook',
    snapchat: 'Snapchat',
    tiktok: 'TikTok',
    googleSheets: 'Google Sheets',
    googleMaps: 'Google Maps',
    allPlatforms: 'All Platforms',
    
    // Chat Actions
    typeMessage: 'Type a message',
    sendMessage: 'Send message',
    recordVoice: 'Record voice message',
    attachFile: 'Attach file',
    addEmoji: 'Add emoji',
    videoCall: 'Video call',
    voiceCall: 'Voice call',
    moreOptions: 'More options',
    backToList: 'Back to chat list',
    
    // Status
    online: 'online',
    offline: 'offline',
    lastSeenRecently: 'last seen recently',
    typing: 'typing...',
    
    // Messages
    unreadMessages: 'unread messages',
    newMessage: 'new message',
    messageFrom: 'Message from',
    messageTo: 'Message to',
    
    // Options
    confirm: 'Confirm',
    cancel: 'Cancel',
    booked: 'Booked',
    inquiryOnly: 'Inquiry Only',
    complaint: 'Complaint',
    wrongNumber: 'Wrong Number',
    notInterested: 'Not Interested',
    noResponse: 'No Response',
    
    // Accessibility
    chatSelected: 'Chat selected',
    unreadCount: 'unread message count',
    platformFilter: 'Filter by platform',
    typeFilter: 'Filter by type',
    pressEnterToSend: 'Press Enter to send',
    pressEscapeToClose: 'Press Escape to close',
    useArrowKeys: 'Use arrow keys to navigate',
    
    // Loading
    loading: 'Loading...',
    loadingConversation: 'Loading smart conversation...',
    
    // Errors
    errorOccurred: 'An error occurred',
    tryAgain: 'Try again',
    
    // Welcome
    welcomeTitle: 'WhatsApp for Windows',
    welcomeDescription: 'Send and receive messages without keeping your phone online.',
    endToEndEncrypted: 'End-to-end encrypted'
  }
};

/**
 * Hook للحصول على الترجمة الحالية
 */
export function useTranslation(language: Language): TranslationKeys {
  return translations[language];
}

/**
 * Helper function للحصول على ترجمة مباشرة
 */
export function t(language: Language, key: keyof TranslationKeys): string {
  return translations[language][key];
}

/**
 * Helper للحصول على direction حسب اللغة
 */
export function getDirection(language: Language): 'rtl' | 'ltr' {
  return language === 'ar' ? 'rtl' : 'ltr';
}

/**
 * Helper للحصول على class للخط العربي
 */
export function getFontClass(language: Language): string {
  return language === 'ar' ? 'font-arabic' : '';
}