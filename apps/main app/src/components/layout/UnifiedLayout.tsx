import React, { Suspense, useState } from 'react';
import { UnifiedHeader } from './UnifiedHeader';
import { ModuleSidebar } from './ModuleSidebar';
import { LoadingSpinner } from '../ui/loading-spinner';
import { useAuth } from '../../shared/hooks/useAuth';
import { ModuleId } from '../../types/app.types';

interface UnifiedLayoutProps {
  currentModule: ModuleId;
  onModuleChange: (module: ModuleId) => void;
  children: React.ReactNode;
}

export const UnifiedLayout: React.FC<UnifiedLayoutProps> = ({ 
  currentModule, 
  onModuleChange, 
  children 
}) => {
  const { user, logout } = useAuth();
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);

  if (!user) {
    return (
      <div className="flex h-screen items-center justify-center">
        <LoadingSpinner size="lg" />
      </div>
    );
  }

  return (
    <div className="flex h-screen bg-background">
      {/* Sidebar */}
      <ModuleSidebar 
        currentModule={currentModule}
        isCollapsed={sidebarCollapsed}
        onToggle={() => setSidebarCollapsed(!sidebarCollapsed)}
      />

      {/* Main Content */}
      <div className="flex flex-1 flex-col overflow-hidden">
        {/* Header */}
        <UnifiedHeader
          currentModule={currentModule}
          onModuleChange={onModuleChange}
          user={user}
          onLogout={logout}
        />

        {/* Content Area */}
        <main className="flex-1 overflow-auto">
          <div className="container mx-auto p-6">
            <Suspense 
              fallback={
                <div className="flex h-64 items-center justify-center">
                  <LoadingSpinner size="lg" />
                </div>
              }
            >
              {children}
            </Suspense>
          </div>
        </main>
      </div>
    </div>
  );
};