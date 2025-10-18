import React, { useState, lazy, Suspense } from 'react';
import { ThemeProvider } from './components/ThemeProvider';
import { Toaster } from './components/ui/sonner';
import { QueryClientProvider } from '@tanstack/react-query';
import { ReactQueryDevtools } from '@tanstack/react-query-devtools';
import { queryClient } from './lib/react-query';
import { CRMLayout } from './components/crm/CRMLayout';
import { CRMDashboard } from './components/crm/dashboard/CRMDashboard';

// Code Splitting - Lazy load secondary pages
const PipelineBoard = lazy(() => import('./components/crm/pipeline/PipelineBoard'));
const TasksManagement = lazy(() => import('./components/crm/tasks/TasksManagement'));
const ReportsPage = lazy(() => import('./components/crm/reports/ReportsPage'));
const LeadsPage = lazy(() => import('./components/crm/leads/LeadsPage'));
const AIChatSidebar = lazy(() => import('./components/ai/AIChatSidebar'));
const TestPage = lazy(() => import('./test/TestPage'));

// Loading fallback component
const PageLoader = () => (
  <div className="flex items-center justify-center min-h-screen">
    <div className="flex flex-col items-center gap-4">
      <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
      <p className="text-sm text-muted-foreground">جاري التحميل...</p>
    </div>
  </div>
);

function AppContent() {
  const [currentPage, setCurrentPage] = useState(() => {
    // Check if we're on /test route
    if (window.location.pathname === '/test') {
      return 'test';
    }
    return 'dashboard';
  });

  const renderPage = () => {
    switch (currentPage) {
      case 'test':
        return (
          <Suspense fallback={<PageLoader />}>
            <TestPage />
          </Suspense>
        );
      case 'dashboard':
        return <CRMDashboard />;
      case 'leads':
        return (
          <Suspense fallback={<PageLoader />}>
            <LeadsPage />
          </Suspense>
        );
      case 'pipeline':
        return (
          <Suspense fallback={<PageLoader />}>
            <PipelineBoard />
          </Suspense>
        );
      case 'tasks':
        return (
          <Suspense fallback={<PageLoader />}>
            <TasksManagement />
          </Suspense>
        );
      case 'reports':
        return (
          <Suspense fallback={<PageLoader />}>
            <ReportsPage />
          </Suspense>
        );
      default:
        return <CRMDashboard />;
    }
  };

  // If on test page, render without CRMLayout
  if (currentPage === 'test') {
    return (
      <>
        {renderPage()}
        <Toaster position="top-center" />
      </>
    );
  }

  return (
    <>
      <CRMLayout currentPage={currentPage} onPageChange={setCurrentPage}>
        {renderPage()}
        <Toaster position="top-center" />
      </CRMLayout>
      
      {/* AI Chat Sidebar - Independent floating layer */}
      <Suspense fallback={null}>
        <AIChatSidebar />
      </Suspense>
    </>
  );
}

export default function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <ThemeProvider defaultTheme="system">
        <AppContent />
        {/* React Query DevTools - فقط في التطوير */}
        <ReactQueryDevtools initialIsOpen={false} position="bottom-right" />
      </ThemeProvider>
    </QueryClientProvider>
  );
}
