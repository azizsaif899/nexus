import { useEffect, useState, lazy, Suspense } from 'react';
import { ThemeProvider } from './contexts/ThemeContext';
import { LanguageProvider } from './contexts/LanguageContext';
import { Header } from './components/Header';
import { HeroSection } from './components/HeroSection';

// Lazy load heavy components to reduce initial forced reflows
const PartnerSection = lazy(() => import('./components/PartnerSection').then(m => ({ default: m.PartnerSection })));
const FeaturesSection = lazy(() => import('./components/FeaturesSection').then(m => ({ default: m.FeaturesSection })));
const PricingSection = lazy(() => import('./components/PricingSection').then(m => ({ default: m.PricingSection })));
const ScaleSection = lazy(() => import('./components/ScaleSection').then(m => ({ default: m.ScaleSection })));
const FAQSection = lazy(() => import('./components/FAQSection').then(m => ({ default: m.FAQSection })));
const Footer = lazy(() => import('./components/Footer').then(m => ({ default: m.Footer })));
const AppSelectionPage = lazy(() => import('./components/AppSelectionPage').then(m => ({ default: m.AppSelectionPage })));

// Simple routing type
type Route = 'home' | 'app-selection';

export default function App() {
  const [currentRoute, setCurrentRoute] = useState<Route>('home');

  // Initialize theme and language as early as possible
  useEffect(() => {
    // This runs immediately to prevent flash
    const initTheme = () => {
      try {
        const theme = localStorage.getItem('theme') || 'system';
        const root = document.documentElement;
        
        if (theme === 'dark') {
          root.classList.add('dark');
          root.classList.remove('light');
        } else if (theme === 'light') {
          root.classList.add('light');
          root.classList.remove('dark');
        } else {
          const systemTheme = window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
          root.classList.add(systemTheme);
          root.classList.remove(systemTheme === 'dark' ? 'light' : 'dark');
        }
      } catch (e) {
        console.error('Failed to initialize theme:', e);
      }
    };

    const initLanguage = () => {
      try {
        const lang = localStorage.getItem('language') || 'en';
        document.documentElement.dir = lang === 'ar' ? 'rtl' : 'ltr';
        document.documentElement.lang = lang;
      } catch (e) {
        console.error('Failed to initialize language:', e);
      }
    };

    initTheme();
    initLanguage();
  }, []);

  // Navigation functions
  const navigateToAppSelection = () => {
    setCurrentRoute('app-selection');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const navigateToHome = () => {
    setCurrentRoute('home');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // Loading fallback component
  const LoadingFallback = () => (
    <div className="flex items-center justify-center py-8">
      <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
    </div>
  );

  return (
    <ThemeProvider>
      <LanguageProvider>
        <Suspense fallback={<LoadingFallback />}>
          {currentRoute === 'app-selection' ? (
            <AppSelectionPage onBack={navigateToHome} />
          ) : (
            <div className="min-h-screen bg-background text-foreground">
              <Header onLoginClick={navigateToAppSelection} />
              <main>
                <HeroSection onGetStartedClick={navigateToAppSelection} />
                <Suspense fallback={<LoadingFallback />}>
                  <PartnerSection />
                </Suspense>
                <Suspense fallback={<LoadingFallback />}>
                  <FeaturesSection />
                </Suspense>
                <Suspense fallback={<LoadingFallback />}>
                  <PricingSection />
                </Suspense>
                <Suspense fallback={<LoadingFallback />}>
                  <ScaleSection />
                </Suspense>
                <Suspense fallback={<LoadingFallback />}>
                  <FAQSection />
                </Suspense>
              </main>
              <Suspense fallback={<LoadingFallback />}>
                <Footer />
              </Suspense>
            </div>
          )}
        </Suspense>
      </LanguageProvider>
    </ThemeProvider>
  );
}
