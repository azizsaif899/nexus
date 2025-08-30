import React from 'react';

interface CRMDashboardProps {
  totalCustomers: number;
  activeCustomers: number;
  totalRevenue: number;
  totalLeads: number;
}

export const CRMDashboard: React.FC<CRMDashboardProps> = ({
  totalCustomers,
  activeCustomers,
  totalRevenue,
  totalLeads
}) => {
  return (
    <div className="crm-dashboard-stats">
      <div className="stat-card">
        <h3>إجمالي العملاء</h3>
        <div className="stat-value">{totalCustomers}</div>
      </div>
      <div className="stat-card">
        <h3>العملاء النشطين</h3>
        <div className="stat-value">{activeCustomers}</div>
      </div>
      <div className="stat-card">
        <h3>إجمالي القيمة</h3>
        <div className="stat-value">{totalRevenue.toLocaleString()} ر.س</div>
      </div>
      <div className="stat-card">
        <h3>العملاء المحتملين</h3>
        <div className="stat-value">{totalLeads}</div>
      </div>
    </div>
  );
};