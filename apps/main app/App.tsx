import React, { useState, Suspense } from 'react';
import { ThemeProvider } from "./components/ThemeContext";
import { UnifiedLayout } from './src/components/layout/UnifiedLayout';
import { DashboardModule } from './src/components/modules/dashboard/DashboardModule';
import { LoadingSpinner } from './src/components/ui/loading-spinner';
import { useAuth } from './src/shared/hooks/useAuth';
import { ModuleId } from './src/types/app.types';

// Marketing Landing Page Components (الصفحة الحالية)
import { Header } from "./components/Header";
import { HeroSection } from "./components/HeroSection";
import { AIPartnerSection } from "./components/AIPartnerSection";
import { PricingSection } from "./components/PricingSection";
import { BuiltToThinkSection } from "./components/BuiltToThinkSection";
import { FAQSection } from "./components/FAQSection";
import { Footer } from "./components/Footer";

// Import actual module components
import { AdminModule } from './src/components/modules/admin/AdminModule';
import { CRMModule } from './src/components/modules/crm/CRMModule';
import { ChatbotModule } from './src/components/modules/chatbot/ChatbotModule';
import { AnalyticsModule } from './src/components/modules/analytics/AnalyticsModule';
import { AutomationModule } from './src/components/modules/automation/AutomationModule';

export default function App() {
  const { isAuthenticated, loading } = useAuth();
  const [currentModule, setCurrentModule] = useState<ModuleId>(ModuleId.DASHBOARD);

  // Loading state
  if (loading) {
    return (
      <ThemeProvider>
        <div className="flex h-screen items-center justify-center bg-background">
          <LoadingSpinner size="lg" text="جاري التحميل..." />
        </div>
      </ThemeProvider>
    );
  }

  // إذا لم يكن المستخدم مسجل دخول، عرض الصفحة التسويقية
  if (!isAuthenticated) {
    return (
      <ThemeProvider>
        <div className="min-h-screen bg-background text-foreground">
          <Header />
          <main>
            <HeroSection />
            <AIPartnerSection />
            <PricingSection />
            <BuiltToThinkSection />
            <FAQSection />
          </main>
          <Footer />
        </div>
      </ThemeProvider>
    );
  }

  // إذا كان المستخدم مسجل دخول، عرض التطبيق الموحد
  const renderCurrentModule = () => {
    switch (currentModule) {
      case ModuleId.DASHBOARD:
        return <DashboardModule />;
      case ModuleId.ADMIN:
        return <AdminModule />;
      case ModuleId.CRM:
        return <CRMModule />;
      case ModuleId.CHATBOT:
        return <ChatbotModule />;
      case ModuleId.ANALYTICS:
        return <AnalyticsModule />;
      case ModuleId.AUTOMATION:
        return <AutomationModule />;
      default:
        return <DashboardModule />;
    }
  };

  return (
    <ThemeProvider>
      <UnifiedLayout
        currentModule={currentModule}
        onModuleChange={setCurrentModule}
      >
        {renderCurrentModule()}
      </UnifiedLayout>
    </ThemeProvider>
  );
}