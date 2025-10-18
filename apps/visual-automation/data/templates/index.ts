/**
 * Templates Library - مكتبة القوالب الجاهزة
 * نظام قوالب احترافي لسير العمل
 */

export interface WorkflowTemplate {
  id: string;
  name: string;
  nameAr: string;
  description: string;
  descriptionAr: string;
  category: 'business' | 'marketing' | 'development' | 'automation' | 'integration' | 'data';
  difficulty: 'beginner' | 'intermediate' | 'advanced';
  estimatedTime: string; // "5 minutes", "15 minutes"
  tags: string[];
  author: string;
  rating: number; // 0-5
  usageCount: number;
  nodes: any[];
  connections: any[];
  thumbnail?: string;
  features: string[];
  requirements?: string[];
  createdAt: string;
  updatedAt: string;
}

// ============================================
// 📧 Email Automation Templates
// ============================================

export const emailWelcomeTemplate: WorkflowTemplate = {
  id: 'email-welcome-sequence',
  name: 'Welcome Email Sequence',
  nameAr: 'سلسلة رسائل الترحيب',
  description: 'Automatically send a series of welcome emails to new subscribers',
  descriptionAr: 'إرسال سلسلة من رسائل الترحيب تلقائياً للمشتركين الجدد',
  category: 'marketing',
  difficulty: 'beginner',
  estimatedTime: '5 دقائق',
  tags: ['email', 'automation', 'marketing', 'welcome'],
  author: 'Automation Team',
  rating: 4.8,
  usageCount: 1250,
  features: [
    'رسائل ترحيب تلقائية',
    'جدولة زمنية ذكية',
    'تتبع الفتح والنقر',
    'تخصيص المحتوى'
  ],
  requirements: ['Email service integration', 'Active subscriber list'],
  nodes: [
    {
      id: 'node-1',
      type: 'webhook-trigger',
      position: { x: 400, y: 300 },
      data: { 
        label: 'مشترك جديد',
        config: {
          event: 'new_subscriber',
          source: 'signup_form'
        }
      }
    },
    {
      id: 'node-2',
      type: 'delay',
      position: { x: 700, y: 300 },
      data: { 
        label: 'انتظار يوم واحد',
        config: {
          duration: 86400,
          unit: 'seconds'
        }
      }
    },
    {
      id: 'node-3',
      type: 'email-send',
      position: { x: 1000, y: 300 },
      data: { 
        label: 'رسالة ترحيب #1',
        config: {
          subject: 'مرحباً بك في {{company_name}}',
          template: 'welcome_email_1'
        }
      }
    },
    {
      id: 'node-4',
      type: 'delay',
      position: { x: 1300, y: 300 },
      data: { 
        label: 'انتظار 3 أيام',
        config: {
          duration: 259200,
          unit: 'seconds'
        }
      }
    },
    {
      id: 'node-5',
      type: 'email-send',
      position: { x: 1600, y: 300 },
      data: { 
        label: 'رسالة ترحيب #2',
        config: {
          subject: 'نصائح للبدء',
          template: 'welcome_email_2'
        }
      }
    }
  ],
  connections: [
    { id: 'c1', source: 'node-1', target: 'node-2' },
    { id: 'c2', source: 'node-2', target: 'node-3' },
    { id: 'c3', source: 'node-3', target: 'node-4' },
    { id: 'c4', source: 'node-4', target: 'node-5' }
  ],
  createdAt: '2025-01-01T00:00:00Z',
  updatedAt: '2025-01-10T00:00:00Z'
};

// ============================================
// 💾 Data Sync Templates
// ============================================

export const dataSyncTemplate: WorkflowTemplate = {
  id: 'database-sync',
  name: 'Database Synchronization',
  nameAr: 'مزامنة قواعد البيانات',
  description: 'Sync data between two databases automatically',
  descriptionAr: 'مزامنة البيانات بين قاعدتي بيانات تلقائياً',
  category: 'data',
  difficulty: 'intermediate',
  estimatedTime: '10 دقائق',
  tags: ['database', 'sync', 'automation', 'data'],
  author: 'Data Team',
  rating: 4.6,
  usageCount: 850,
  features: [
    'مزامنة ثنائية الاتجاه',
    'كشف التغييرات',
    'معالجة الأخطاء',
    'سجل المزامنة'
  ],
  requirements: ['Database credentials', 'Network access'],
  nodes: [
    {
      id: 'node-1',
      type: 'schedule-trigger',
      position: { x: 400, y: 300 },
      data: { 
        label: 'كل ساعة',
        config: {
          cron: '0 * * * *',
          timezone: 'Asia/Riyadh'
        }
      }
    },
    {
      id: 'node-2',
      type: 'database-read',
      position: { x: 700, y: 300 },
      data: { 
        label: 'قراءة من DB1',
        config: {
          connection: 'primary_db',
          query: 'SELECT * FROM users WHERE updated_at > ?'
        }
      }
    },
    {
      id: 'node-3',
      type: 'transform',
      position: { x: 1000, y: 300 },
      data: { 
        label: 'تحويل البيانات',
        config: {
          mapping: {
            id: 'user_id',
            email: 'email_address'
          }
        }
      }
    },
    {
      id: 'node-4',
      type: 'database-write',
      position: { x: 1300, y: 300 },
      data: { 
        label: 'كتابة إلى DB2',
        config: {
          connection: 'secondary_db',
          table: 'synced_users',
          operation: 'upsert'
        }
      }
    }
  ],
  connections: [
    { id: 'c1', source: 'node-1', target: 'node-2' },
    { id: 'c2', source: 'node-2', target: 'node-3' },
    { id: 'c3', source: 'node-3', target: 'node-4' }
  ],
  createdAt: '2025-01-02T00:00:00Z',
  updatedAt: '2025-01-12T00:00:00Z'
};

// ============================================
// 📱 Social Media Templates
// ============================================

export const socialMediaTemplate: WorkflowTemplate = {
  id: 'social-media-posting',
  name: 'Multi-Platform Social Posting',
  nameAr: 'نشر على منصات التواصل',
  description: 'Post content to multiple social media platforms simultaneously',
  descriptionAr: 'نشر المحتوى على عدة منصات تواصل اجتماعي في آن واحد',
  category: 'marketing',
  difficulty: 'beginner',
  estimatedTime: '7 دقائق',
  tags: ['social media', 'marketing', 'automation', 'content'],
  author: 'Marketing Team',
  rating: 4.7,
  usageCount: 2100,
  features: [
    'نشر متعدد المنصات',
    'جدولة المحتوى',
    'تخصيص لكل منصة',
    'تتبع الأداء'
  ],
  requirements: ['Social media API keys', 'Content ready'],
  nodes: [
    {
      id: 'node-1',
      type: 'webhook-trigger',
      position: { x: 400, y: 300 },
      data: { 
        label: 'محتوى جديد',
        config: {
          event: 'new_content',
          source: 'content_management_system'
        }
      }
    },
    {
      id: 'node-2',
      type: 'http-request',
      position: { x: 700, y: 200 },
      data: { 
        label: 'نشر على Twitter',
        config: {
          url: 'https://api.twitter.com/2/tweets',
          method: 'POST'
        }
      }
    },
    {
      id: 'node-3',
      type: 'http-request',
      position: { x: 700, y: 400 },
      data: { 
        label: 'نشر على Facebook',
        config: {
          url: 'https://graph.facebook.com/me/feed',
          method: 'POST'
        }
      }
    },
    {
      id: 'node-4',
      type: 'notification',
      position: { x: 1000, y: 300 },
      data: { 
        label: 'إشعار النجاح',
        config: {
          message: 'تم النشر بنجاح على جميع المنصات'
        }
      }
    }
  ],
  connections: [
    { id: 'c1', source: 'node-1', target: 'node-2' },
    { id: 'c2', source: 'node-1', target: 'node-3' },
    { id: 'c3', source: 'node-2', target: 'node-4' },
    { id: 'c4', source: 'node-3', target: 'node-4' }
  ],
  createdAt: '2025-01-03T00:00:00Z',
  updatedAt: '2025-01-11T00:00:00Z'
};

// ============================================
// 🔔 Notification Templates
// ============================================

export const alertSystemTemplate: WorkflowTemplate = {
  id: 'alert-notification-system',
  name: 'Smart Alert System',
  nameAr: 'نظام التنبيهات الذكي',
  description: 'Monitor systems and send alerts when issues are detected',
  descriptionAr: 'مراقبة الأنظمة وإرسال تنبيهات عند اكتشاف المشاكل',
  category: 'automation',
  difficulty: 'intermediate',
  estimatedTime: '12 دقيقة',
  tags: ['monitoring', 'alerts', 'automation', 'notifications'],
  author: 'DevOps Team',
  rating: 4.9,
  usageCount: 650,
  features: [
    'مراقبة متعددة المصادر',
    'تنبيهات فورية',
    'تصعيد تلقائي',
    'سجل الأحداث'
  ],
  requirements: ['Monitoring endpoints', 'Notification channels'],
  nodes: [
    {
      id: 'node-1',
      type: 'schedule-trigger',
      position: { x: 400, y: 300 },
      data: { 
        label: 'كل 5 دقائق',
        config: {
          cron: '*/5 * * * *'
        }
      }
    },
    {
      id: 'node-2',
      type: 'http-request',
      position: { x: 700, y: 300 },
      data: { 
        label: 'فحص الخادم',
        config: {
          url: 'https://api.example.com/health',
          method: 'GET',
          timeout: 5000
        }
      }
    },
    {
      id: 'node-3',
      type: 'condition',
      position: { x: 1000, y: 300 },
      data: { 
        label: 'حالة الخادم؟',
        config: {
          condition: 'status !== 200'
        }
      }
    },
    {
      id: 'node-4',
      type: 'email-send',
      position: { x: 1300, y: 200 },
      data: { 
        label: 'تنبيه Email',
        config: {
          to: 'ops@company.com',
          subject: '⚠️ تحذير: خادم متوقف'
        }
      }
    },
    {
      id: 'node-5',
      type: 'notification',
      position: { x: 1300, y: 400 },
      data: { 
        label: 'تنبيه Slack',
        config: {
          channel: '#alerts',
          message: 'الخادم الرئيسي لا يستجيب'
        }
      }
    }
  ],
  connections: [
    { id: 'c1', source: 'node-1', target: 'node-2' },
    { id: 'c2', source: 'node-2', target: 'node-3' },
    { id: 'c3', source: 'node-3', target: 'node-4', condition: 'true' },
    { id: 'c4', source: 'node-3', target: 'node-5', condition: 'true' }
  ],
  createdAt: '2025-01-04T00:00:00Z',
  updatedAt: '2025-01-13T00:00:00Z'
};

// ============================================
// 📊 Business Templates
// ============================================

export const leadProcessingTemplate: WorkflowTemplate = {
  id: 'lead-processing-automation',
  name: 'Lead Processing Automation',
  nameAr: 'أتمتة معالجة العملاء المحتملين',
  description: 'Automatically process and qualify new leads',
  descriptionAr: 'معالجة وتأهيل العملاء المحتملين الجدد تلقائياً',
  category: 'business',
  difficulty: 'advanced',
  estimatedTime: '15 دقيقة',
  tags: ['crm', 'sales', 'automation', 'leads'],
  author: 'Sales Team',
  rating: 4.5,
  usageCount: 480,
  features: [
    'تأهيل العملاء تلقائياً',
    'تسجيل النقاط',
    'توزيع ذكي',
    'متابعة تلقائية'
  ],
  requirements: ['CRM integration', 'Lead scoring rules'],
  nodes: [
    {
      id: 'node-1',
      type: 'webhook-trigger',
      position: { x: 400, y: 300 },
      data: { 
        label: 'عميل محتمل جديد'
      }
    },
    {
      id: 'node-2',
      type: 'http-request',
      position: { x: 700, y: 300 },
      data: { 
        label: 'إثراء البيانات',
        config: {
          url: 'https://api.clearbit.com/v2/companies/find',
          method: 'GET'
        }
      }
    },
    {
      id: 'node-3',
      type: 'transform',
      position: { x: 1000, y: 300 },
      data: { 
        label: 'حساب النقاط'
      }
    },
    {
      id: 'node-4',
      type: 'condition',
      position: { x: 1300, y: 300 },
      data: { 
        label: 'نقاط عالية؟',
        config: {
          condition: 'score >= 80'
        }
      }
    },
    {
      id: 'node-5',
      type: 'http-request',
      position: { x: 1600, y: 200 },
      data: { 
        label: 'إضافة لـ CRM',
        config: {
          url: 'https://api.crm.com/leads',
          method: 'POST'
        }
      }
    },
    {
      id: 'node-6',
      type: 'email-send',
      position: { x: 1600, y: 400 },
      data: { 
        label: 'إرسال للمبيعات',
        config: {
          to: 'sales@company.com'
        }
      }
    }
  ],
  connections: [
    { id: 'c1', source: 'node-1', target: 'node-2' },
    { id: 'c2', source: 'node-2', target: 'node-3' },
    { id: 'c3', source: 'node-3', target: 'node-4' },
    { id: 'c4', source: 'node-4', target: 'node-5', condition: 'true' },
    { id: 'c5', source: 'node-4', target: 'node-6', condition: 'true' }
  ],
  createdAt: '2025-01-05T00:00:00Z',
  updatedAt: '2025-01-14T00:00:00Z'
};

// ============================================
// 🔧 Development Templates
// ============================================

export const cicdTemplate: WorkflowTemplate = {
  id: 'cicd-deployment-pipeline',
  name: 'CI/CD Deployment Pipeline',
  nameAr: 'خط أنابيب النشر المستمر',
  description: 'Automated build, test, and deployment pipeline',
  descriptionAr: 'خط أنابيب آلي للبناء والاختبار والنشر',
  category: 'development',
  difficulty: 'advanced',
  estimatedTime: '20 دقيقة',
  tags: ['cicd', 'deployment', 'automation', 'devops'],
  author: 'DevOps Team',
  rating: 4.8,
  usageCount: 320,
  features: [
    'بناء تلقائي',
    'اختبارات آلية',
    'نشر مرحلي',
    'rollback تلقائي'
  ],
  requirements: ['Git repository', 'Server access', 'Test suite'],
  nodes: [
    {
      id: 'node-1',
      type: 'webhook-trigger',
      position: { x: 400, y: 300 },
      data: { 
        label: 'Git Push',
        config: {
          event: 'push',
          branch: 'main'
        }
      }
    },
    {
      id: 'node-2',
      type: 'http-request',
      position: { x: 700, y: 300 },
      data: { 
        label: 'تشغيل الاختبارات'
      }
    },
    {
      id: 'node-3',
      type: 'condition',
      position: { x: 1000, y: 300 },
      data: { 
        label: 'الاختبارات نجحت؟'
      }
    },
    {
      id: 'node-4',
      type: 'http-request',
      position: { x: 1300, y: 200 },
      data: { 
        label: 'بناء التطبيق'
      }
    },
    {
      id: 'node-5',
      type: 'http-request',
      position: { x: 1600, y: 200 },
      data: { 
        label: 'نشر على الإنتاج'
      }
    },
    {
      id: 'node-6',
      type: 'notification',
      position: { x: 1900, y: 200 },
      data: { 
        label: 'إشعار النجاح'
      }
    }
  ],
  connections: [
    { id: 'c1', source: 'node-1', target: 'node-2' },
    { id: 'c2', source: 'node-2', target: 'node-3' },
    { id: 'c3', source: 'node-3', target: 'node-4', condition: 'true' },
    { id: 'c4', source: 'node-4', target: 'node-5' },
    { id: 'c5', source: 'node-5', target: 'node-6' }
  ],
  createdAt: '2025-01-06T00:00:00Z',
  updatedAt: '2025-01-15T00:00:00Z'
};

// ============================================
// Export All Templates
// ============================================

export const allTemplates: WorkflowTemplate[] = [
  emailWelcomeTemplate,
  dataSyncTemplate,
  socialMediaTemplate,
  alertSystemTemplate,
  leadProcessingTemplate,
  cicdTemplate
];

export const templatesByCategory = {
  business: [leadProcessingTemplate],
  marketing: [emailWelcomeTemplate, socialMediaTemplate],
  development: [cicdTemplate],
  automation: [alertSystemTemplate],
  data: [dataSyncTemplate],
  integration: []
};

export const templatesByDifficulty = {
  beginner: [emailWelcomeTemplate, socialMediaTemplate],
  intermediate: [dataSyncTemplate, alertSystemTemplate],
  advanced: [leadProcessingTemplate, cicdTemplate]
};

// Helper functions
export function getTemplateById(id: string): WorkflowTemplate | undefined {
  return allTemplates.find(t => t.id === id);
}

export function searchTemplates(query: string): WorkflowTemplate[] {
  const lowerQuery = query.toLowerCase();
  return allTemplates.filter(t => 
    t.name.toLowerCase().includes(lowerQuery) ||
    t.nameAr.includes(query) ||
    t.description.toLowerCase().includes(lowerQuery) ||
    t.descriptionAr.includes(query) ||
    t.tags.some(tag => tag.toLowerCase().includes(lowerQuery))
  );
}

export function getPopularTemplates(limit: number = 3): WorkflowTemplate[] {
  return [...allTemplates]
    .sort((a, b) => b.usageCount - a.usageCount)
    .slice(0, limit);
}

export function getTopRatedTemplates(limit: number = 3): WorkflowTemplate[] {
  return [...allTemplates]
    .sort((a, b) => b.rating - a.rating)
    .slice(0, limit);
}
