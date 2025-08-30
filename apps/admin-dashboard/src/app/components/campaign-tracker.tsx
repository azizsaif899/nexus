import React, { useState } from 'react';

const CampaignTracker: React.FC = () => {
  const [campaigns] = useState([
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
      ctr: 2.8,
      conversion_rate: 7.0
    },
    {
      id: '987654321',
      name: 'حملة المنتجات الرقمية',
      platform: 'Instagram',
      status: 'Active',
      impressions: 89000,
      clicks: 2100,
      leads: 156,
      cost: 8900,
      cpl: 57.05,
      ctr: 2.4,
      conversion_rate: 7.4
    }
  ]);

  const totalStats = {
    totalSpend: campaigns.reduce((sum, c) => sum + c.cost, 0),
    totalLeads: campaigns.reduce((sum, c) => sum + c.leads, 0),
    avgCPL: campaigns.reduce((sum, c) => sum + c.cost, 0) / campaigns.reduce((sum, c) => sum + c.leads, 0)
  };

  const syncWithMeta = () => {
    console.log('🔄 Syncing with Meta Ads API...');
  };

  return (
    <div style={{ padding: '20px' }}>
      <h2>📊 تتبع حملات Meta</h2>
      
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
              <td style={{ padding: '15px', textAlign: 'center' }}>
                <span style={{ 
                  padding: '4px 8px', 
                  borderRadius: '4px', 
                  backgroundColor: campaign.platform === 'Facebook' ? '#1877F2' : '#E4405F',
                  color: 'white',
                  fontSize: '12px'
                }}>
                  {campaign.platform}
                </span>
              </td>
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

export default CampaignTracker;