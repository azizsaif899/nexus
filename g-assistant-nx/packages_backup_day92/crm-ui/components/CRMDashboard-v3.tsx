import React, { useState, useEffect } from 'react';

interface Lead {
  id: number;
  name: string;
  partner_name: string;
  email: string;
  expected_revenue: number;
  probability: number;
  stage: string;
  source: 'Meta' | 'Website' | 'WhatsApp';
}

export const CRMDashboard: React.FC = () => {
  const [leads, setLeads] = useState<Lead[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadCRMData();
  }, []);

  const loadCRMData = async () => {
    const mockLeads: Lead[] = [
      {
        id: 1,
        name: 'استفسار خدمات',
        partner_name: 'أحمد علي',
        email: 'ahmed@example.com',
        expected_revenue: 50000,
        probability: 75,
        stage: 'مؤهل',
        source: 'Meta'
      }
    ];
    setLeads(mockLeads);
    setLoading(false);
  };

  const syncWithMeta = async () => {
    await fetch('/api/crm/sync-meta', { method: 'POST' });
    loadCRMData();
  };

  return (
    <div style={{ padding: '20px' }}>
      <h2>🏢 لوحة تحكم CRM</h2>
      
      <div style={{ marginBottom: '20px' }}>
        <button onClick={syncWithMeta} style={{ marginRight: '10px' }}>
          🔄 مزامنة مع Meta
        </button>
        <button onClick={loadCRMData}>
          🔄 تحديث البيانات
        </button>
      </div>

      <div>
        <h3>العملاء المحتملين ({leads.length})</h3>
        <table style={{ width: '100%', borderCollapse: 'collapse' }}>
          <thead>
            <tr style={{ backgroundColor: '#f5f5f5' }}>
              <th style={{ padding: '10px', border: '1px solid #ddd' }}>الاسم</th>
              <th style={{ padding: '10px', border: '1px solid #ddd' }}>البريد</th>
              <th style={{ padding: '10px', border: '1px solid #ddd' }}>المصدر</th>
              <th style={{ padding: '10px', border: '1px solid #ddd' }}>المرحلة</th>
              <th style={{ padding: '10px', border: '1px solid #ddd' }}>الإيرادات المتوقعة</th>
            </tr>
          </thead>
          <tbody>
            {leads.map((lead) => (
              <tr key={lead.id}>
                <td style={{ padding: '10px', border: '1px solid #ddd' }}>{lead.partner_name}</td>
                <td style={{ padding: '10px', border: '1px solid #ddd' }}>{lead.email}</td>
                <td style={{ padding: '10px', border: '1px solid #ddd' }}>{lead.source}</td>
                <td style={{ padding: '10px', border: '1px solid #ddd' }}>{lead.stage}</td>
                <td style={{ padding: '10px', border: '1px solid #ddd' }}>${lead.expected_revenue}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};