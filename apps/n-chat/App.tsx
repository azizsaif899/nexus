import { useState, useEffect, Suspense, lazy } from 'react';
import { t } from './src/lib/i18n';

// React lazy loading لصفحة المحادثة
const ConversationPage = lazy(() => 
  import('./src/components/ConversationPageAccessible').then(mod => ({ 
    default: mod.ConversationPage 
  }))
);

// Main App Component
export default function App() {
  const [language, setLanguage] = useState<'ar' | 'en'>('ar');
  const [isDark, setIsDark] = useState(true);

  // Theme and direction setup
  useEffect(() => {
    const updateTheme = () => {
      document.documentElement.dir = language === 'ar' ? 'rtl' : 'ltr';
      document.documentElement.lang = language;
      document.documentElement.className = isDark ? 'dark' : 'light';
      
      // إعداد viewport للجوال
      let viewport = document.querySelector('meta[name="viewport"]');
      if (!viewport) {
        viewport = document.createElement('meta');
        viewport.setAttribute('name', 'viewport');
        document.head.appendChild(viewport);
      }
      viewport.setAttribute(
        'content', 
        'width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no, viewport-fit=cover'
      );
      
      // إضافة meta للـ accessibility
      let description = document.querySelector('meta[name="description"]');
      if (!description) {
        description = document.createElement('meta');
        description.setAttribute('name', 'description');
        document.head.appendChild(description);
      }
      description.setAttribute(
        'content',
        language === 'ar' 
          ? 'منصة FlowCanvasAI للأتمتة والذكاء الاصطناعي مع دعم كامل للمحادثات الذكية'
          : 'FlowCanvasAI - AI-powered automation platform with smart conversation support'
      );
    };
    
    updateTheme();
  }, [language, isDark]);

  return (
    <>
      {/* Skip Links - روابط التخطي للمحتوى */}
      <nav className="sr-only">
        <a href="#main-content" className="skip-link">
          {t(language, 'skipToMainContent')}
        </a>
      </nav>
      
      <div 
        className={`min-h-screen bg-background text-foreground transition-colors duration-300 ${language === 'ar' ? 'font-arabic' : ''}`}
        lang={language}
        dir={language === 'ar' ? 'rtl' : 'ltr'}
      >
        {/* Live Region للإعلانات المهمة */}
        <div 
          role="status" 
          aria-live="polite" 
          aria-atomic="true" 
          className="sr-only"
          id="live-announcements"
        >
          {/* سيتم تحديثها ديناميكياً */}
        </div>

        {/* Main Content */}
        <main 
          id="main-content" 
          className="transition-all duration-300"
          role="main"
          aria-label={language === 'ar' ? 'المحتوى الرئيسي' : 'Main content'}
        >
          <Suspense fallback={
            <div 
              className="min-h-screen flex items-center justify-center bg-background" 
              role="status" 
              aria-live="polite"
              aria-busy="true"
            >
              <div className="text-center">
                <div className="w-16 h-16 bg-gradient-to-br from-primary to-chart-2 rounded-2xl animate-pulse mx-auto mb-4" aria-hidden="true"></div>
                <p className="text-muted-foreground" aria-live="polite">
                  {t(language, 'loadingConversation')}
                </p>
                <span className="sr-only">
                  {language === 'ar' ? 'جاري تحميل التطبيق، الرجاء الانتظار' : 'Loading application, please wait'}
                </span>
              </div>
            </div>
          }>
            <ConversationPage 
              language={language} 
              onBackToHome={() => {}}
              onLanguageChange={setLanguage}
              isDark={isDark}
              onThemeChange={setIsDark}
            />
          </Suspense>
        </main>
      </div>
    </>
  );
}