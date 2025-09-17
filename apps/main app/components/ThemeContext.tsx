import React, { createContext, useContext, useState, useEffect } from 'react';

type Language = 'ar' | 'en';
type Theme = 'light' | 'dark';

interface ThemeContextType {
  language: Language;
  theme: Theme;
  setLanguage: (lang: Language) => void;
  setTheme: (theme: Theme) => void;
  toggleLanguage: () => void;
  toggleTheme: () => void;
  t: (key: string) => string;
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

const translations = {
  ar: {
    // Header
    'features': 'المميزات',
    'pricing': 'التسعير',
    'about': 'من نحن',
    'contact': 'تواصل معنا',
    'get_started': 'ابدأ الآن',
    
    // Hero Section
    'work_less': 'اعمل أقل.',
    'automate_more': 'أتمت أكثر.',
    'hero_description': 'استخدم قوة الذكاء الاصطناعي لأتمتة مهامك اليومية وزيادة الإنتاجية. حلول مخصصة لاحتياجاتك.',
    'start_free_trial': 'ابدأ التجربة المجانية',
    'watch_demo': 'شاهد العرض التوضيحي',
    
    // AI Partner Section
    'ai_partner_title': 'شريك الذكاء الاصطناعي الخاص بك',
    'ai_partner_description': 'اكتشف كيف يمكن لتقنياتنا المتقدمة في الذكاء الاصطناعي أن تحول طريقة عملك',
    'smart_automation': 'أتمتة ذكية',
    'smart_automation_desc': 'أتمت المهام المعقدة بكفاءة عالية',
    'advanced_analytics': 'تحليلات متقدمة',
    'advanced_analytics_desc': 'احصل على رؤى عميقة من بياناتك',
    'seamless_integration': 'تكامل سلس',
    'seamless_integration_desc': 'اربط مع جميع أدواتك المفضلة',
    
    // Pricing Section
    'pricing_title': 'خطط التسعير',
    'pricing_subtitle': 'اختر الخطة المناسبة لك',
    'starter': 'المبتدئ',
    'professional': 'المحترف',
    'enterprise': 'المؤسسات',
    'per_month': 'شهرياً',
    'free_forever': 'مجاني للأبد',
    'contact_us': 'تواصل معنا',
    'choose_plan': 'اختر الخطة',
    'basic_features': 'المميزات الأساسية',
    'advanced_features': 'المميزات المتقدمة',
    'premium_features': 'المميزات المميزة',
    'limited_usage': 'استخدام محدود',
    'unlimited_usage': 'استخدام غير محدود',
    'priority_support': 'دعم فني مميز',
    
    // Built to Think Section
    'built_to_think': 'مصمم للتفكير.',
    'designed_to_scale': 'مصمم للنمو.',
    'built_description': 'تقنياتنا المتقدمة في الذكاء الاصطناعي مصممة لتنمو مع احتياجاتك',
    'performance': 'الأداء',
    'performance_desc': 'أداء فائق السرعة',
    'security': 'الأمان',
    'security_desc': 'حماية متقدمة لبياناتك',
    'scalability': 'قابلية النمو',
    'scalability_desc': 'ينمو مع احتياجاتك',
    
    // FAQ Section
    'faq_title': 'الأسئلة المتكررة',
    'faq_question_1': 'ما هو الذكاء الاصطناعي؟',
    'faq_answer_1': 'الذكاء الاصطناعي هو تقنية تمكن الآلات من محاكاة الذكاء البشري وتنفيذ المهام بطريقة ذكية.',
    'faq_question_2': 'كيف يمكنني البدء؟',
    'faq_answer_2': 'يمكنك البدء بالتسجيل للحصول على حساب مجاني والاستفادة من فترة تجريبية.',
    'faq_question_3': 'هل الخدمة آمنة؟',
    'faq_answer_3': 'نعم، نحن نستخدم أحدث تقنيات الأمان لحماية بياناتك.',
    'faq_question_4': 'ما هي تكلفة الخدمة؟',
    'faq_answer_4': 'لدينا خطط متنوعة تناسب جميع الاحتياجات، بدءاً من الخطة المجانية.',
    
    // Footer
    'footer_description': 'نحن نساعدك على أتمتة مهامك وزيادة إنتاجيتك باستخدام أحدث تقنيات الذكاء الاصطناعي.',
    'quick_links': 'روابط سريعة',
    'support': 'الدعم',
    'legal': 'قانوني',
    'privacy_policy': 'سياسة الخصوصية',
    'terms_of_service': 'شروط الخدمة',
    'help_center': 'مركز المساعدة',
    'documentation': 'التوثيق',
    'all_rights_reserved': 'جميع الحقوق محفوظة'
  },
  en: {
    // Header
    'features': 'Features',
    'pricing': 'Pricing',
    'about': 'About',
    'contact': 'Contact',
    'get_started': 'Get Started',
    
    // Hero Section
    'work_less': 'WORK LESS.',
    'automate_more': 'AUTOMATE MORE.',
    'hero_description': 'Harness the power of AI to automate your daily tasks and boost productivity. Tailored solutions for your needs.',
    'start_free_trial': 'Start Free Trial',
    'watch_demo': 'Watch Demo',
    
    // AI Partner Section
    'ai_partner_title': 'Your AI Partner',
    'ai_partner_description': 'Discover how our advanced AI technologies can transform the way you work',
    'smart_automation': 'Smart Automation',
    'smart_automation_desc': 'Automate complex tasks with high efficiency',
    'advanced_analytics': 'Advanced Analytics',
    'advanced_analytics_desc': 'Get deep insights from your data',
    'seamless_integration': 'Seamless Integration',
    'seamless_integration_desc': 'Connect with all your favorite tools',
    
    // Pricing Section
    'pricing_title': 'Pricing Plans',
    'pricing_subtitle': 'Choose the right plan for you',
    'starter': 'Starter',
    'professional': 'Professional',
    'enterprise': 'Enterprise',
    'per_month': 'per month',
    'free_forever': 'Free Forever',
    'contact_us': 'Contact Us',
    'choose_plan': 'Choose Plan',
    'basic_features': 'Basic Features',
    'advanced_features': 'Advanced Features',
    'premium_features': 'Premium Features',
    'limited_usage': 'Limited Usage',
    'unlimited_usage': 'Unlimited Usage',
    'priority_support': 'Priority Support',
    
    // Built to Think Section
    'built_to_think': 'BUILT TO THINK.',
    'designed_to_scale': 'DESIGNED TO SCALE.',
    'built_description': 'Our advanced AI technologies are designed to grow with your needs',
    'performance': 'Performance',
    'performance_desc': 'Lightning-fast performance',
    'security': 'Security',
    'security_desc': 'Advanced protection for your data',
    'scalability': 'Scalability',
    'scalability_desc': 'Grows with your needs',
    
    // FAQ Section
    'faq_title': 'Frequently Asked Questions',
    'faq_question_1': 'What is Artificial Intelligence?',
    'faq_answer_1': 'Artificial Intelligence is a technology that enables machines to mimic human intelligence and perform tasks intelligently.',
    'faq_question_2': 'How can I get started?',
    'faq_answer_2': 'You can get started by signing up for a free account and enjoying a trial period.',
    'faq_question_3': 'Is the service secure?',
    'faq_answer_3': 'Yes, we use the latest security technologies to protect your data.',
    'faq_question_4': 'What is the cost of the service?',
    'faq_answer_4': 'We have various plans to suit all needs, starting from the free plan.',
    
    // Footer
    'footer_description': 'We help you automate your tasks and increase productivity using the latest AI technologies.',
    'quick_links': 'Quick Links',
    'support': 'Support',
    'legal': 'Legal',
    'privacy_policy': 'Privacy Policy',
    'terms_of_service': 'Terms of Service',
    'help_center': 'Help Center',
    'documentation': 'Documentation',
    'all_rights_reserved': 'All rights reserved'
  }
};

export const ThemeProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [language, setLanguage] = useState<Language>('en');
  const [theme, setTheme] = useState<Theme>('dark');

  useEffect(() => {
    const savedLanguage = localStorage.getItem('language') as Language;
    const savedTheme = localStorage.getItem('theme') as Theme;
    
    if (savedLanguage) setLanguage(savedLanguage);
    if (savedTheme) setTheme(savedTheme);
  }, []);

  useEffect(() => {
    localStorage.setItem('language', language);
    document.documentElement.setAttribute('dir', language === 'ar' ? 'rtl' : 'ltr');
    document.documentElement.setAttribute('lang', language);
  }, [language]);

  useEffect(() => {
    localStorage.setItem('theme', theme);
    if (theme === 'light') {
      document.documentElement.classList.add('light');
      document.documentElement.classList.remove('dark');
    } else {
      document.documentElement.classList.add('dark');
      document.documentElement.classList.remove('light');
    }
  }, [theme]);

  const toggleLanguage = () => {
    setLanguage(prev => prev === 'ar' ? 'en' : 'ar');
  };

  const toggleTheme = () => {
    setTheme(prev => prev === 'light' ? 'dark' : 'light');
  };

  const t = (key: string) => {
    return translations[language][key as keyof typeof translations[typeof language]] || key;
  };

  return (
    <ThemeContext.Provider value={{
      language,
      theme,
      setLanguage,
      setTheme,
      toggleLanguage,
      toggleTheme,
      t
    }}>
      {children}
    </ThemeContext.Provider>
  );
};

export const useTheme = () => {
  const context = useContext(ThemeContext);
  if (context === undefined) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  return context;
};