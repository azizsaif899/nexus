import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';

// Layout Components
import DashboardLayout from './components/DashboardLayout';

// Pages
import Dashboard from '../pages/dashboard';
import CRMPage from '../pages/crm';
import CRMAdvancedPage from '../pages/crm-advanced';
import AdminPage from '../pages/admin';
import AnalyticsPage from '../pages/analytics';
import AIPage from '../pages/ai';
import AutomationPage from '../pages/automation';
import ReportsPage from '../pages/reports';
import MonitoringPage from '../pages/monitoring';

const queryClient = new QueryClient();

export function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <Router>
        <DashboardLayout>
          <Routes>
            <Route path="/" element={<Dashboard />} />
            <Route path="/admin" element={<AdminPage />} />
            <Route path="/crm" element={<CRMPage />} />
            <Route path="/crm-advanced" element={<CRMAdvancedPage />} />
            <Route path="/analytics" element={<AnalyticsPage />} />
            <Route path="/ai" element={<AIPage />} />
            <Route path="/automation" element={<AutomationPage />} />
            <Route path="/reports" element={<ReportsPage />} />
            <Route path="/monitoring" element={<MonitoringPage />} />
          </Routes>
        </DashboardLayout>
      </Router>
    </QueryClientProvider>
  );
}

export default App;