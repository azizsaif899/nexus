import React, { useState, useEffect } from 'react';

const CrmDashboard: React.FC = () => {
  const [leads, setLeads] = useState([
    {
      id: 1,
      partner_name: 'أحمد علي',
      email: 'ahmed@example.com',
      expected_revenue: 50000,
      probability: 75,
      stage: 'مؤهل',
      source: 'Meta'
    },
    {
      id: 2,
      partner_name: 'سارة محمد',
      email: 'sara@company.com',
      expected_revenue: 25000,
      probability: 50,
      stage: 'جديد',
      source: 'Website'
    }
  ]);

  const syncWithMeta = () => {
    console.log('🔄 Syncing with Meta...');
  };

  return (
    <div style={{ padding: '20px' }}>
      <h2>🏢 لوحة تحكم CRM</h2>
      
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '20px', marginBottom: '30px' }}>
        <div style={{ padding: '20px', backgroundColor: '#f5f5f5', borderRadius: '8px' }}>
          <h3>العملاء المحتملين</h3>
          <p style={{ fontSize: '24px', fontWeight: 'bold', color: '#4CAF50' }}>{leads.length}</p>
        </div>
        <div style={{ padding: '20px', backgroundColor: '#f5f5f5', borderRadius: '8px' }}>
          <h3>الإيرادات المتوقعة</h3>
          <p style={{ fontSize: '24px', fontWeight: 'bold', color: '#2196F3' }}>
            ${leads.reduce((sum, lead) => sum + lead.expected_revenue, 0).toLocaleString()}
          </p>
        </div>
        <div style={{ padding: '20px', backgroundColor: '#f5f5f5', borderRadius: '8px' }}>
          <h3>متوسط الاحتمالية</h3>
          <p style={{ fontSize: '24px', fontWeight: 'bold', color: '#FF9800' }}>
            {Math.round(leads.reduce((sum, lead) => sum + lead.probability, 0) / leads.length)}%
          </p>
        </div>
      </div>

      <button 
        onClick={syncWithMeta}
        style={{ 
          padding: '10px 20px', 
          marginBottom: '20px',
          backgroundColor: '#1877F2', 
          color: 'white', 
          border: 'none', 
          borderRadius: '5px' 
        }}
      >
        🔄 مزامنة مع Meta
      </button>

      <table style={{ width: '100%', borderCollapse: 'collapse', backgroundColor: 'white' }}>
        <thead>
          <tr style={{ backgroundColor: '#f8f9fa' }}>
            <th style={{ padding: '15px', textAlign: 'left' }}>الاسم</th>
            <th style={{ padding: '15px', textAlign: 'left' }}>البريد</th>
            <th style={{ padding: '15px', textAlign: 'center' }}>المصدر</th>
            <th style={{ padding: '15px', textAlign: 'center' }}>المرحلة</th>
            <th style={{ padding: '15px', textAlign: 'right' }}>الإيرادات</th>
          </tr>
        </thead>
        <tbody>
          {leads.map((lead) => (
            <tr key={lead.id} style={{ borderBottom: '1px solid #dee2e6' }}>
              <td style={{ padding: '15px' }}>{lead.partner_name}</td>
              <td style={{ padding: '15px' }}>{lead.email}</td>
              <td style={{ padding: '15px', textAlign: 'center' }}>{lead.source}</td>
              <td style={{ padding: '15px', textAlign: 'center' }}>{lead.stage}</td>
              <td style={{ padding: '15px', textAlign: 'right' }}>${lead.expected_revenue.toLocaleString()}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default CrmDashboard;