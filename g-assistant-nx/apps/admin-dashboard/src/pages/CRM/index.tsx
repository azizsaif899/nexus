import React from 'react';
import { Routes, Route } from 'react-router-dom';
import { Box, Container } from '@mui/material';
import CRMDashboard from '../../components/CRM/CRMDashboard';
import CustomersPage from './CustomersPage';
import CampaignsPage from './CampaignsPage';
import ReportsPage from './ReportsPage';
import AutomationPage from './AutomationPage';

const CRMPages: React.FC = () => {
  // بيانات تجريبية للوحة التحكم
  const dashboardStats = {
    totalCustomers: 1250,
    newLeads: 89,
    activeCampaigns: 12,
    monthlyRevenue: 125000,
    conversionRate: 24.5,
    responseRate: 78.2
  };

  return (
    <Container maxWidth="xl" sx={{ py: 3 }}>
      <Routes>
        <Route 
          path="/" 
          element={<CRMDashboard stats={dashboardStats} />} 
        />
        <Route 
          path="/dashboard" 
          element={<CRMDashboard stats={dashboardStats} />} 
        />
        <Route path="/customers" element={<CustomersPage />} />
        <Route path="/campaigns" element={<CampaignsPage />} />
        <Route path="/reports" element={<ReportsPage />} />
        <Route path="/automation" element={<AutomationPage />} />
      </Routes>
    </Container>
  );
};

export default CRMPages;