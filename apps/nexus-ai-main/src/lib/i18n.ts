export type Language = 'en' | 'ar';

export const translations = {
  en: {
    // Navigation
    nav: {
      features: 'Features',
      pricing: 'Pricing',
      faq: 'FAQ',
      contact: 'Contact',
      login: 'Login',
      signup: 'Sign Up',
      backToHome: 'Back to Home',
    },
    // App Selection
    appSelection: {
      title: 'Choose Your',
      subtitle: 'Application',
      description: 'Select the perfect tool for your needs and start your AI-powered journey',
      apps: {
        automation: {
          title: 'Automation',
          description: 'Automate repetitive tasks and workflows with intelligent AI solutions',
          features: ['Smart Workflows', 'Task Scheduling', 'API Integration', 'Real-time Monitoring'],
        },
        chat: {
          title: 'Conversations',
          description: 'AI-powered chat and customer engagement platform',
          features: ['Live Chat', 'AI Responses', 'Multi-channel', 'Analytics'],
        },
        customers: {
          title: 'Customers',
          description: 'Comprehensive customer relationship management system',
          features: ['Contact Management', 'Sales Pipeline', 'Reports', 'Team Collaboration'],
        },
      },
      selectButton: 'Select',
    },
    // Hero Section
    hero: {
      badge: 'AI-POWERED',
      title: 'WORK LESS.',
      subtitle: 'AUTOMATE MORE.',
      description: 'Transform your workflow with cutting-edge AI automation. Built for the future, designed for today.',
      cta: 'Get Started',
      learnMore: 'Learn More',
      stats: {
        tasks: 'Tasks Automated',
        hours: 'Hours Saved',
        accuracy: 'Accuracy Rate',
      }
    },
    // Partner Section
    partner: {
      badge: 'AI PROGRESS',
      title: 'YOUR AI PARTNER',
      subtitle: 'IN PROGRESS',
      description: 'Experience the next generation of automation with our intelligent AI system that adapts to your needs and scales with your ambitions.',
      features: {
        cloud: {
          title: 'Cloud AI ecosystem',
          description: 'Seamless integration across all platforms'
        },
        setup: {
          title: 'Bring setup on autopilot',
          description: 'Automated configuration and deployment'
        },
        target: {
          title: 'Target like machine',
          description: 'Precision-driven task execution'
        },
        scale: {
          title: 'Scale on command',
          description: 'Instant scaling for any workload'
        }
      }
    },
    // Pricing Section
    pricing: {
      badge: 'PLANS',
      title: 'POWERING PROGRESS',
      subtitle: 'AT EVERY LEVEL',
      monthly: '/ month',
      plans: {
        starter: {
          name: 'Starter',
          price: '29',
          features: [
            '50 automation tasks/month',
            'Basic AI assistance',
            'Email support',
            'Community access',
            'API access'
          ],
          cta: 'Get Started'
        },
        professional: {
          name: 'Professional',
          price: '79',
          features: [
            '500 automation tasks/month',
            'Advanced AI models',
            'Priority support',
            'Custom integrations',
            'Analytics dashboard',
            'Team collaboration'
          ],
          cta: 'Get Started'
        },
        enterprise: {
          name: 'Enterprise',
          price: '129',
          features: [
            'Unlimited automation tasks',
            'Premium AI models',
            '24/7 dedicated support',
            'Custom development',
            'Advanced analytics',
            'Multi-team management',
            'SLA guarantee'
          ],
          cta: 'Contact Sales'
        }
      }
    },
    // Scale Section
    scale: {
      badge: 'INTELLIGENCE',
      title: 'BUILT TO THINK.',
      subtitle: 'DESIGNED TO SCALE.',
      description: 'Our AI infrastructure is engineered to handle enterprise-level demands while maintaining the agility needed for rapid innovation.',
      features: {
        processing: {
          title: 'Advanced neural processing',
          description: 'Lightning-fast decision making powered by state-of-the-art AI models'
        },
        learning: {
          title: 'Continuous learning system',
          description: 'Constantly evolving to deliver better results with every interaction'
        },
        security: {
          title: 'Enterprise-grade security',
          description: 'Bank-level encryption and compliance with global security standards'
        }
      }
    },
    // FAQ Section
    faq: {
      badge: 'SUPPORT',
      title: 'FREQUENTLY ASKED',
      subtitle: 'QUESTIONS',
      questions: {
        q1: {
          question: 'How long it takes?',
          answer: 'Our onboarding process takes just 5 minutes. You can start automating tasks immediately after signing up.'
        },
        q2: {
          question: 'Features AI + Integration',
          answer: 'We offer comprehensive AI features including natural language processing, machine learning models, and seamless integration with 100+ popular tools and platforms.'
        },
        q3: {
          question: 'Growth kit (1-10 mo)',
          answer: 'Our Growth Kit is designed for businesses scaling from 1-10 months, providing guided automation strategies and dedicated support.'
        },
        q4: {
          question: 'Who can start AI Launch? Im busy!',
          answer: 'Anyone can start! Our AI handles the heavy lifting. Just set your goals and let the automation work for you - no technical expertise required.'
        },
        q5: {
          question: 'Is there an option for small teams/startups?',
          answer: 'Absolutely! Our Starter plan is perfect for small teams and startups, offering essential features at an affordable price point.'
        },
        q6: {
          question: 'Can I meet your specialists in real-time?',
          answer: 'Yes! Professional and Enterprise plans include real-time support with our specialists via chat, video calls, and screen sharing.'
        }
      }
    },
    // Footer
    footer: {
      company: {
        title: 'Company',
        about: 'About Us',
        careers: 'Careers',
        press: 'Press Kit',
        contact: 'Contact'
      },
      product: {
        title: 'Product',
        features: 'Features',
        pricing: 'Pricing',
        security: 'Security',
        updates: 'Updates'
      },
      resources: {
        title: 'Resources',
        documentation: 'Documentation',
        guides: 'Guides',
        blog: 'Blog',
        community: 'Community'
      },
      legal: {
        title: 'Legal',
        privacy: 'Privacy Policy',
        terms: 'Terms of Service',
        cookies: 'Cookie Policy'
      },
      newsletter: {
        title: 'Stay Updated',
        description: 'Get the latest updates and insights delivered to your inbox.',
        placeholder: 'Enter your email',
        subscribe: 'Subscribe'
      },
      copyright: '© 2025 Nexus AI. All rights reserved.',
      social: 'Follow us'
    }
  },
  ar: {
    // Navigation
    nav: {
      features: 'المميزات',
      pricing: 'الأسعار',
      faq: 'الأسئلة الشائعة',
      contact: 'تواصل معنا',
      login: 'دخول',
      signup: 'تسجيل',
      backToHome: 'العودة للرئيسية',
    },
    // App Selection
    appSelection: {
      title: 'اختر',
      subtitle: 'التطبيق المناسب',
      description: 'اختر الأداة المثالية لاحتياجاتك وابدأ رحلتك مع الذكاء الاصطناعي',
      apps: {
        automation: {
          title: 'الأتمتة',
          description: 'أتمت المهام المتكررة وسير العمل بحلول ذكاء اصطناعي ذكية',
          features: ['سير عمل ذكي', 'جدولة المهام', 'تكامل API', 'مراقبة فورية'],
        },
        chat: {
          title: 'المحادثات',
          description: 'منصة محادثة وتفاعل مع العملاء مدعومة بالذكاء الاصطناعي',
          features: ['دردشة مباشرة', 'ردود ذكية', 'متعدد القنوات', 'تحليلات'],
        },
        customers: {
          title: 'العملاء',
          description: 'نظام إدارة علاقات العملاء الشامل',
          features: ['إدارة جهات الاتصال', 'خط المبيعات', 'تقارير', 'تعاون الفريق'],
        },
      },
      selectButton: 'اختيار',
    },
    // Hero Section
    hero: {
      badge: 'مدعوم بالذكاء الاصطناعي',
      title: 'اعمل أقل.',
      subtitle: 'أتمت أكثر.',
      description: 'حوّل سير عملك باستخدام أحدث تقنيات الأتمتة بالذكاء الاصطناعي. مبني للمستقبل، مصمم لليوم.',
      cta: 'ابدأ الآن',
      learnMore: 'اعرف المزيد',
      stats: {
        tasks: 'مهمة مؤتمتة',
        hours: 'ساعة موفرة',
        accuracy: 'نسبة الدقة',
      }
    },
    // Partner Section
    partner: {
      badge: 'تقدم الذكاء الاصطناعي',
      title: 'شريكك في الذكاء الاصطناعي',
      subtitle: 'للتقدم المستمر',
      description: 'اختبر الجيل القادم من الأتمتة مع نظام الذكاء الاصطناعي الذكي الذي يتكيف مع احتياجاتك وينمو مع طموحاتك.',
      features: {
        cloud: {
          title: 'نظام سحابي متكامل',
          description: 'تكامل سلس عبر جميع المنصات'
        },
        setup: {
          title: 'إعداد تلقائي كامل',
          description: 'تكوين ونشر تلقائي'
        },
        target: {
          title: 'استهداف آلي دقيق',
          description: 'تنفيذ المهام بدقة عالية'
        },
        scale: {
          title: 'توسع فوري',
          description: 'توسع لحظي لأي حجم عمل'
        }
      }
    },
    // Pricing Section
    pricing: {
      badge: 'الباقات',
      title: 'دفع التقدم',
      subtitle: 'على كل المستويات',
      monthly: '/ شهرياً',
      plans: {
        starter: {
          name: 'المبتدئ',
          price: '29',
          features: [
            '50 مهمة أتمتة / شهر',
            'مساعدة ذكاء اصطناعي أساسية',
            'دعم عبر البريد الإلكتروني',
            'الوصول للمجتمع',
            'وصول API'
          ],
          cta: 'ابدأ الآن'
        },
        professional: {
          name: 'المحترف',
          price: '79',
          features: [
            '500 مهمة أتمتة / شهر',
            'نماذج ذكاء اصطناعي متقدمة',
            'دعم ذو أولوية',
            'تكاملات مخصصة',
            'لوحة تحليلات',
            'تعاون الفريق'
          ],
          cta: 'ابدأ الآن'
        },
        enterprise: {
          name: 'المؤسسات',
          price: '129',
          features: [
            'مهام أتمتة غير محدودة',
            'نماذج ذكاء اصطناعي متميزة',
            'دعم مخصص 24/7',
            'تطوير مخصص',
            'تحليلات متقدمة',
            'إدارة فرق متعددة',
            'ضمان SLA'
          ],
          cta: 'تواصل مع المبيعات'
        }
      }
    },
    // Scale Section
    scale: {
      badge: 'الذكاء',
      title: 'مبني للتفكير.',
      subtitle: 'مصمم للتوسع.',
      description: 'بنيتنا التحتية للذكاء الاصطناعي مصممة لمعالجة متطلبات المؤسسات الكبيرة مع الحفاظ على المرونة اللازمة للابتكار السريع.',
      features: {
        processing: {
          title: 'معالجة عصبية متقدمة',
          description: 'اتخاذ قرارات بسرعة البرق مدعوم بأحدث نماذج الذكاء الاصطناعي'
        },
        learning: {
          title: 'نظام تعلم مستمر',
          description: 'يتطور باستمرار لتقديم نتائج أفضل مع كل تفاعل'
        },
        security: {
          title: 'أمان على مستوى المؤسسات',
          description: 'تشفير بمستوى البنوك والامتثال لمعايير الأمان العالمية'
        }
      }
    },
    // FAQ Section
    faq: {
      badge: 'الدعم',
      title: 'الأسئلة',
      subtitle: 'الشائعة',
      questions: {
        q1: {
          question: 'كم يستغرق من الوقت؟',
          answer: 'عملية التسجيل تستغرق 5 دقائق فقط. يمكنك البدء في أتمتة المهام فوراً بعد التسجيل.'
        },
        q2: {
          question: 'مميزات الذكاء الاصطناعي والتكامل',
          answer: 'نقدم مميزات شاملة للذكاء الاصطناعي تشمل معالجة اللغة الطبيعية، نماذج التعلم الآلي، والتكامل السلس مع أكثر من 100 أداة ومنصة شهيرة.'
        },
        q3: {
          question: 'حزمة النمو (1-10 أشهر)',
          answer: 'حزمة النمو مصممة للشركات التي تتوسع من 1-10 أشهر، توفر استراتيجيات أتمتة موجهة ودعم مخصص.'
        },
        q4: {
          question: 'من يمكنه بدء الذكاء الاصطناعي؟ أنا مشغول!',
          answer: 'يمكن للجميع البدء! الذكاء الاصطناعي يتولى العمل الثقيل. فقط حدد أهدافك ودع الأتمتة تعمل من أجلك - لا حاجة لخبرة تقنية.'
        },
        q5: {
          question: 'هل يوجد خيار للفرق الصغيرة والشركات الناشئة؟',
          answer: 'بالتأكيد! باقة المبتدئ مثالية للفرق الصغيرة والشركات الناشئة، تقدم المميزات الأساسية بسعر معقول.'
        },
        q6: {
          question: 'هل يمكنني مقابلة المتخصصين في الوقت الفعلي؟',
          answer: 'نعم! باقات المحترف والمؤسسات تتضمن دعم فوري مع متخصصينا عبر الدردشة، مكالمات الفيديو، ومشاركة الشاشة.'
        }
      }
    },
    // Footer
    footer: {
      company: {
        title: 'الشركة',
        about: 'من نحن',
        careers: 'الوظائف',
        press: 'الإعلام',
        contact: 'تواصل معنا'
      },
      product: {
        title: 'المنتج',
        features: 'المميزات',
        pricing: 'الأسعار',
        security: 'الأمان',
        updates: 'التحديثات'
      },
      resources: {
        title: 'الموارد',
        documentation: 'التوثيق',
        guides: 'الأدلة',
        blog: 'المدونة',
        community: 'المجتمع'
      },
      legal: {
        title: 'قانوني',
        privacy: 'سياسة الخصوصية',
        terms: 'شروط الخدمة',
        cookies: 'سياسة ملفات تعريف الارتباط'
      },
      newsletter: {
        title: 'ابق على اطلاع',
        description: 'احصل على آخر التحديثات والرؤى في بريدك الإلكتروني.',
        placeholder: 'أدخل بريدك الإلكتروني',
        subscribe: 'اشترك'
      },
      copyright: '© 2025 Nexus AI. جميع الحقوق محفوظة.',
      social: 'تابعنا'
    }
  }
};

export function getTranslation(lang: Language) {
  return translations[lang];
}