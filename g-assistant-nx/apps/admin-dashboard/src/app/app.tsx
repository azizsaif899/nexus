import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';

// Layout Components
import DashboardLayout from './components/DashboardLayout';

// Pages
import Dashboard from '../pages/dashboard';
import CRMPage from '../pages/crm';
import AnalyticsPage from '../pages/analytics';
import AIPage from '../pages/ai';

const queryClient = new QueryClient();

export function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <Router>
        <DashboardLayout>
          <Routes>
            <Route path="/" element={<Dashboard />} />
            <Route path="/crm" element={<CRMPage />} />
            <Route path="/analytics" element={<AnalyticsPage />} />
            <Route path="/ai" element={<AIPage />} />
          </Routes>
        </DashboardLayout>
      </Router>
    </QueryClientProvider>
  );
}

export default App;