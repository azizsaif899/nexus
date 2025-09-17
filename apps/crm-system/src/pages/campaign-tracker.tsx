import React, { useState, useEffect } from 'react';

export const CampaignTracker: React.FC = () => {
  const [campaigns, setCampaigns] = useState([
    {
      id: '123456789',
      name: 'حملة الخدمات التقنية',
      platform: 'Facebook',
      status: 'Active',
      impressions: 125000,
      clicks: 3500,
      leads: 245,
      cost: 12500,
      cpl: 51.02,
      ctr: 2.8
    }
  ]);

  const syncWithMeta = async () => {
    try {
      const response = await fetch('/api/meta/campaigns');
      const data = await response.json();
      setCampaigns(data.campaigns || []);
      alert('✅ تم المزامنة مع Meta Ads بنجاح!');
    } catch (error) {
      console.error('Error syncing with Meta:', error);
      alert('❌ خطأ في المزامنة مع Meta');
    }
  };

  const exportToBigQuery = async () => {
    try {
      const response = await fetch('/api/analytics/export-campaigns', { method: 'POST' });
      const data = await response.json();
      alert(`✅ تم التصدير إلى BigQuery!\nالسجلات: ${data.rows || 0}`);
    } catch (error) {
      console.error('Error exporting to BigQuery:', error);
      alert('❌ خطأ في التصدير إلى BigQuery');
    }
  };

  const totalStats = {
    totalSpend: campaigns.reduce((sum, c) => sum + c.cost, 0),
    totalLeads: campaigns.reduce((sum, c) => sum + c.leads, 0),
    avgCPL: campaigns.reduce((sum, c) => sum + c.cost, 0) / campaigns.reduce((sum, c) => sum + c.leads, 0)
  };

  return (
    <div style={{ padding: '20px' }}>
      <h1>📊 تتبع حملات Meta</h1>
      
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '20px', marginBottom: '30px' }}>
        <div style={{ padding: '20px', backgroundColor: '#f5f5f5', borderRadius: '8px' }}>
          <h3>إجمالي الإنفاق</h3>
          <p style={{ fontSize: '24px', fontWeight: 'bold', color: '#1976d2' }}>
            ${totalStats.totalSpend.toLocaleString()}
          </p>
        </div>
        <div style={{ padding: '20px', backgroundColor: '#f5f5f5', borderRadius: '8px' }}>
          <h3>العملاء المحتملين</h3>
          <p style={{ fontSize: '24px', fontWeight: 'bold', color: '#4CAF50' }}>
            {totalStats.totalLeads}
          </p>
        </div>
        <div style={{ padding: '20px', backgroundColor: '#f5f5f5', borderRadius: '8px' }}>
          <h3>متوسط CPL</h3>
          <p style={{ fontSize: '24px', fontWeight: 'bold', color: '#FF9800' }}>
            ${totalStats.avgCPL.toFixed(2)}
          </p>
        </div>
        <div style={{ padding: '20px', backgroundColor: '#f5f5f5', borderRadius: '8px' }}>
          <h3>الحملات النشطة</h3>
          <p style={{ fontSize: '24px', fontWeight: 'bold', color: '#9C27B0' }}>
            {campaigns.filter(c => c.status === 'Active').length}
          </p>
        </div>
      </div>

      <div style={{ marginBottom: '20px' }}>
        <button 
          onClick={syncWithMeta}
          style={{ 
            padding: '10px 20px', 
            marginRight: '10px',
            backgroundColor: '#1877F2', 
            color: 'white', 
            border: 'none', 
            borderRadius: '5px' 
          }}
        >
          🔄 مزامنة مع Meta
        </button>
        <button 
          onClick={exportToBigQuery}
          style={{ 
            padding: '10px 20px', 
            backgroundColor: '#4285F4', 
            color: 'white', 
            border: 'none', 
            borderRadius: '5px' 
          }}
        >
          📊 تصدير إلى BigQuery
        </button>
      </div>

      <table style={{ width: '100%', borderCollapse: 'collapse', backgroundColor: 'white' }}>
        <thead>
          <tr style={{ backgroundColor: '#f8f9fa' }}>
            <th style={{ padding: '15px', textAlign: 'left' }}>الحملة</th>
            <th style={{ padding: '15px', textAlign: 'center' }}>المنصة</th>
            <th style={{ padding: '15px', textAlign: 'center' }}>الظهور</th>
            <th style={{ padding: '15px', textAlign: 'center' }}>النقرات</th>
            <th style={{ padding: '15px', textAlign: 'center' }}>العملاء</th>
            <th style={{ padding: '15px', textAlign: 'center' }}>التكلفة</th>
            <th style={{ padding: '15px', textAlign: 'center' }}>CPL</th>
            <th style={{ padding: '15px', textAlign: 'center' }}>CTR</th>
          </tr>
        </thead>
        <tbody>
          {campaigns.map((campaign) => (
            <tr key={campaign.id} style={{ borderBottom: '1px solid #dee2e6' }}>
              <td style={{ padding: '15px' }}>{campaign.name}</td>
              <td style={{ padding: '15px', textAlign: 'center' }}>{campaign.platform}</td>
              <td style={{ padding: '15px', textAlign: 'center' }}>{campaign.impressions.toLocaleString()}</td>
              <td style={{ padding: '15px', textAlign: 'center' }}>{campaign.clicks.toLocaleString()}</td>
              <td style={{ padding: '15px', textAlign: 'center', fontWeight: 'bold', color: '#4CAF50' }}>
                {campaign.leads}
              </td>
              <td style={{ padding: '15px', textAlign: 'center' }}>${campaign.cost.toLocaleString()}</td>
              <td style={{ padding: '15px', textAlign: 'center' }}>${campaign.cpl.toFixed(2)}</td>
              <td style={{ padding: '15px', textAlign: 'center' }}>{campaign.ctr}%</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};