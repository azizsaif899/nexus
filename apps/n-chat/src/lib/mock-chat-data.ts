export interface Contact {
  id: string;
  name: string;
  avatar?: string;
  lastMessage: string;
  timestamp: string;
  unreadCount: number;
  isOnline: boolean;
  isTyping: boolean;
  lastSeen?: string;
  isGroup?: boolean;
  sentiment?: 'positive' | 'neutral' | 'negative';
  tags?: string[];
  phoneNumber?: string;
  email?: string;
  department?: string;
  priority?: 'low' | 'medium' | 'high' | 'urgent';
}

export interface Message {
  id: string;
  contactId: string;
  content: string;
  timestamp: Date;
  isUser: boolean;
  status: 'sending' | 'sent' | 'delivered' | 'read';
  type: 'text' | 'image' | 'voice' | 'document' | 'location';
  isAI?: boolean;
  translation?: string;
  sentiment?: 'positive' | 'neutral' | 'negative';
  metadata?: {
    fileSize?: number;
    fileName?: string;
    duration?: number;
    location?: { lat: number; lng: number; address: string };
  };
}

export interface SmartReply {
  id: string;
  text: string;
  confidence: number;
  category: 'question' | 'greeting' | 'confirmation' | 'support' | 'follow_up';
  language: 'ar' | 'en';
}

export interface ConversationAnalytics {
  totalMessages: number;
  responseTime: number;
  satisfactionScore: number;
  issuesResolved: number;
  escalationRate: number;
  commonTopics: string[];
  peakHours: number[];
  customerJourney: string[];
}

// Mock Contacts Data
export const mockContacts: Contact[] = [
  {
    id: '1',
    name: 'أحمد محمد العلي',
    avatar: '/avatars/01.png',
    lastMessage: 'شكراً لك على المساعدة الرائعة! استطعت حل المشكلة بنجاح.',
    timestamp: '10:30',
    unreadCount: 0,
    isOnline: true,
    isTyping: false,
    sentiment: 'positive',
    tags: ['عميل مميز', 'دعم فني', 'مشكلة محلولة'],
    phoneNumber: '+966501234567',
    email: 'ahmed.ali@example.com',
    department: 'دعم فني',
    priority: 'medium'
  },
  {
    id: '2',
    name: 'Sarah Johnson',
    avatar: '/avatars/02.png',
    lastMessage: 'I need urgent help with the pricing plans. Can someone assist me?',
    timestamp: '09:45',
    unreadCount: 3,
    isOnline: false,
    isTyping: false,
    lastSeen: '2 hours ago',
    sentiment: 'negative',
    tags: ['lead', 'pricing', 'urgent'],
    phoneNumber: '+1234567890',
    email: 'sarah.j@company.com',
    department: 'sales',
    priority: 'urgent'
  },
  {
    id: '3',
    name: 'فريق التطوير - مشروع Alpha',
    lastMessage: 'تم إنجاز المرحلة الثالثة من المشروع بنجاح ✅',
    timestamp: 'Yesterday',
    unreadCount: 0,
    isOnline: true,
    isTyping: false,
    isGroup: true,
    sentiment: 'positive',
    tags: ['فريق', 'مشروع', 'إنجاز'],
    department: 'development',
    priority: 'medium'
  },
  {
    id: '4',
    name: 'Maria Garcia',
    avatar: '/avatars/04.png',
    lastMessage: 'The automation workflow is not working as expected. Please check.',
    timestamp: '08:20',
    unreadCount: 1,
    isOnline: false,
    isTyping: false,
    lastSeen: '30 minutes ago',
    sentiment: 'negative',
    tags: ['bug report', 'automation', 'workflow'],
    phoneNumber: '+34612345678',
    email: 'maria.garcia@email.com',
    department: 'technical',
    priority: 'high'
  },
  {
    id: '5',
    name: 'David Chen',
    avatar: '/avatars/05.png',
    lastMessage: 'Great service! The new features are exactly what we needed.',
    timestamp: '07:15',
    unreadCount: 0,
    isOnline: true,
    isTyping: false,
    sentiment: 'positive',
    tags: ['feedback', 'new features', 'satisfied'],
    phoneNumber: '+8613812345678',
    email: 'david.chen@tech.com',
    department: 'product',
    priority: 'low'
  },
  {
    id: '6',
    name: 'فاطمة الزهراء',
    avatar: '/avatars/06.png',
    lastMessage: 'أحتاج مساعدة في فهم كيفية استخدام واجهة التصميم الجديدة',
    timestamp: '06:45',
    unreadCount: 2,
    isOnline: false,
    isTyping: false,
    lastSeen: '1 hour ago',
    sentiment: 'neutral',
    tags: ['تدريب', 'واجهة المستخدم', 'استفسار'],
    phoneNumber: '+966509876543',
    email: 'fatima.z@company.sa',
    department: 'training',
    priority: 'medium'
  }
];

// Mock Messages Data
export const mockMessages: Record<string, Message[]> = {
  '1': [
    {
      id: 'msg1_1',
      contactId: '1',
      content: 'مرحباً، أواجه مشكلة في تشغيل سير العمل الجديد',
      timestamp: new Date(Date.now() - 300000), // 5 minutes ago
      isUser: false,
      status: 'read',
      type: 'text',
      sentiment: 'neutral'
    },
    {
      id: 'msg1_2',
      contactId: '1',
      content: 'أهلاً وسهلاً! سأساعدك في حل هذه المشكلة. هل يمكنك وصف المشكلة بالتفصيل؟',
      timestamp: new Date(Date.now() - 270000),
      isUser: true,
      status: 'read',
      type: 'text'
    },
    {
      id: 'msg1_3',
      contactId: '1',
      content: 'عندما أحاول تشغيل السير، يظهر لي خطأ في العقدة الثالثة',
      timestamp: new Date(Date.now() - 240000),
      isUser: false,
      status: 'read',
      type: 'text',
      sentiment: 'negative'
    },
    {
      id: 'msg1_4',
      contactId: '1',
      content: 'فهمت المشكلة. هذا خطأ شائع يحدث عادة بسبب إعدادات العقدة. دعني أوضح لك الحل خطوة بخطوة:\n\n1. اذهب إلى العقدة الثالثة\n2. انقر على "إعدادات متقدمة"\n3. تأكد من أن المدخلات صحيحة\n4. احفظ التغييرات وجرب مرة أخرى',
      timestamp: new Date(Date.now() - 180000),
      isUser: true,
      status: 'read',
      type: 'text',
      isAI: true
    },
    {
      id: 'msg1_5',
      contactId: '1',
      content: 'ممتاز! لقد نجح الحل. شكراً لك على المساعدة الرائعة!',
      timestamp: new Date(Date.now() - 60000),
      isUser: false,
      status: 'read',
      type: 'text',
      sentiment: 'positive'
    }
  ],
  '2': [
    {
      id: 'msg2_1',
      contactId: '2',
      content: 'Hi, I\'m interested in your enterprise plan. Can you provide more details?',
      timestamp: new Date(Date.now() - 400000),
      isUser: false,
      status: 'read',
      type: 'text',
      sentiment: 'neutral'
    },
    {
      id: 'msg2_2',
      contactId: '2',
      content: 'Hello Sarah! I\'d be happy to help you with information about our enterprise plan. What specific features are you most interested in?',
      timestamp: new Date(Date.now() - 350000),
      isUser: true,
      status: 'read',
      type: 'text'
    },
    {
      id: 'msg2_3',
      contactId: '2',
      content: 'I need advanced automation features and API access for my team of 50+ users',
      timestamp: new Date(Date.now() - 300000),
      isUser: false,
      status: 'read',
      type: 'text',
      sentiment: 'positive'
    },
    {
      id: 'msg2_4',
      contactId: '2',
      content: 'Perfect! Our enterprise plan includes:\n\n✅ Unlimited automation workflows\n✅ Full API access\n✅ Advanced user management\n✅ Priority support\n✅ Custom integrations\n\nWould you like to schedule a demo?',
      timestamp: new Date(Date.now() - 120000),
      isUser: true,
      status: 'read',
      type: 'text',
      isAI: true
    }
  ]
};

// Mock Smart Replies
export const mockSmartReplies: SmartReply[] = [
  {
    id: 'sr1',
    text: 'شكراً لتواصلك معنا',
    confidence: 0.95,
    category: 'greeting',
    language: 'ar'
  },
  {
    id: 'sr2',
    text: 'هل تحتاج مساعدة إضافية؟',
    confidence: 0.90,
    category: 'follow_up',
    language: 'ar'
  },
  {
    id: 'sr3',
    text: 'سأقوم بمتابعة طلبك فوراً',
    confidence: 0.85,
    category: 'confirmation',
    language: 'ar'
  },
  {
    id: 'sr4',
    text: 'Thank you for reaching out',
    confidence: 0.95,
    category: 'greeting',
    language: 'en'
  },
  {
    id: 'sr5',
    text: 'Can I help you with anything else?',
    confidence: 0.88,
    category: 'follow_up',
    language: 'en'
  },
  {
    id: 'sr6',
    text: 'I\'ll look into this right away',
    confidence: 0.82,
    category: 'confirmation',
    language: 'en'
  }
];

// Mock Analytics Data
export const mockAnalytics: ConversationAnalytics = {
  totalMessages: 1247,
  responseTime: 2.3, // minutes
  satisfactionScore: 4.7,
  issuesResolved: 89,
  escalationRate: 5.2, // percentage
  commonTopics: ['technical support', 'pricing', 'features', 'automation', 'integration'],
  peakHours: [9, 10, 11, 14, 15, 16],
  customerJourney: ['inquiry', 'demo', 'trial', 'purchase', 'onboarding', 'support']
};

// Helper Functions
export const getContactById = (id: string): Contact | undefined => {
  return mockContacts.find(contact => contact.id === id);
};

export const getMessagesByContactId = (contactId: string): Message[] => {
  return mockMessages[contactId] || [];
};

export const getSmartRepliesByLanguage = (language: 'ar' | 'en'): SmartReply[] => {
  return mockSmartReplies.filter(reply => reply.language === language);
};

export const generateAIResponse = (userMessage: string, language: 'ar' | 'en'): string => {
  const responses = {
    ar: {
      greeting: 'مرحباً! كيف يمكنني مساعدتك اليوم؟',
      support: 'أفهم مشكلتك. دعني أساعدك في حلها.',
      automation: 'بخصوص الأتمتة، يمكنني توجيهك خطوة بخطوة.',
      pricing: 'بالنسبة للأسعار، لدينا خطط متنوعة تناسب احتياجاتك.',
      technical: 'هذه مشكلة تقنية شائعة. إليك الحل المناسب.',
      default: 'شكراً لرسالتك. سأتواصل معك قريباً بالتفاصيل.'
    },
    en: {
      greeting: 'Hello! How can I help you today?',
      support: 'I understand your issue. Let me help you solve it.',
      automation: 'Regarding automation, I can guide you step by step.',
      pricing: 'For pricing, we have various plans to suit your needs.',
      technical: 'This is a common technical issue. Here\'s the right solution.',
      default: 'Thank you for your message. I\'ll get back to you with details soon.'
    }
  };

  const message = userMessage.toLowerCase();
  const responseSet = responses[language];

  if (message.includes('مرحب') || message.includes('hello') || message.includes('hi')) {
    return responseSet.greeting;
  } else if (message.includes('مشكل') || message.includes('خطأ') || message.includes('problem') || message.includes('error')) {
    return responseSet.technical;
  } else if (message.includes('أتمتة') || message.includes('سير') || message.includes('automation') || message.includes('workflow')) {
    return responseSet.automation;
  } else if (message.includes('سعر') || message.includes('خطة') || message.includes('pricing') || message.includes('plan')) {
    return responseSet.pricing;
  } else if (message.includes('مساعد') || message.includes('دعم') || message.includes('help') || message.includes('support')) {
    return responseSet.support;
  } else {
    return responseSet.default;
  }
};

export const analyzeSentiment = (message: string): 'positive' | 'neutral' | 'negative' => {
  const positiveWords = ['شكر', 'ممتاز', 'رائع', 'جيد', 'thanks', 'great', 'excellent', 'good', 'perfect', 'amazing'];
  const negativeWords = ['مشكل', 'خطأ', 'سيء', 'فشل', 'problem', 'error', 'bad', 'failed', 'issue', 'broken'];
  
  const lowerMessage = message.toLowerCase();
  
  const hasPositive = positiveWords.some(word => lowerMessage.includes(word));
  const hasNegative = negativeWords.some(word => lowerMessage.includes(word));
  
  if (hasPositive && !hasNegative) return 'positive';
  if (hasNegative && !hasPositive) return 'negative';
  return 'neutral';
};

export const generateSmartReplies = (lastMessage: string, language: 'ar' | 'en'): SmartReply[] => {
  const sentiment = analyzeSentiment(lastMessage);
  const replies = getSmartRepliesByLanguage(language);
  
  // Filter replies based on context and sentiment
  return replies
    .filter(reply => {
      if (sentiment === 'positive' && reply.category === 'follow_up') return true;
      if (sentiment === 'negative' && reply.category === 'support') return true;
      if (reply.category === 'greeting') return true;
      return false;
    })
    .slice(0, 3); // Return top 3 suggestions
};