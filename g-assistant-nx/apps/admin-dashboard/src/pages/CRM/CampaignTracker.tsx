import React, { useState, useEffect } from 'react';

interface Campaign {
  id: string;
  name: string;
  platform: 'Facebook' | 'Instagram';
  status: 'Active' | 'Paused' | 'Completed';
  impressions: number;
  clicks: number;
  leads: number;
  cost: number;
  cpl: number; // Cost Per Lead
  ctr: number; // Click Through Rate
  conversion_rate: number;
  roas: number; // Return on Ad Spend
  quality_score: number;
}

export const CampaignTracker: React.FC = () => {
  const [campaigns, setCampaigns] = useState<Campaign[]>([]);
  const [totalStats, setTotalStats] = useState({
    totalSpend: 0,
    totalLeads: 0,
    avgCPL: 0,
    avgROAS: 0
  });

  useEffect(() => {
    loadCampaignData();
  }, []);

  const loadCampaignData = async () => {
    // Mock data - في الإنتاج من Meta Ads API
    const mockCampaigns: Campaign[] = [
      {
        id: '123456789',
        name: 'حملة الخدمات التقنية - فيسبوك',
        platform: 'Facebook',
        status: 'Active',
        impressions: 125000,
        clicks: 3500,
        leads: 245,
        cost: 12500,
        cpl: 51.02,
        ctr: 2.8,
        conversion_rate: 7.0,
        roas: 4.2,
        quality_score: 8.5
      },
      {
        id: '987654321',
        name: 'حملة المنتجات الرقمية - إنستاجرام',
        platform: 'Instagram',
        status: 'Active',
        impressions: 89000,
        clicks: 2100,
        leads: 156,
        cost: 8900,
        cpl: 57.05,
        ctr: 2.4,
        conversion_rate: 7.4,
        roas: 3.8,
        quality_score: 7.2
      }
    ];

    setCampaigns(mockCampaigns);
    
    const totalSpend = mockCampaigns.reduce((sum, c) => sum + c.cost, 0);
    const totalLeads = mockCampaigns.reduce((sum, c) => sum + c.leads, 0);
    
    setTotalStats({
      totalSpend,
      totalLeads,
      avgCPL: totalSpend / totalLeads,
      avgROAS: mockCampaigns.reduce((sum, c) => sum + c.roas, 0) / mockCampaigns.length
    });
  };

  const syncWithMeta = async () => {
    console.log('🔄 Syncing with Meta Ads API...');
    await fetch('/api/meta/sync-campaigns', { method: 'POST' });
    loadCampaignData();
  };

  const exportToBI = async () => {
    console.log('📊 Exporting to BigQuery...');
    await fetch('/api/analytics/export-campaigns', { method: 'POST' });
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Active': return '#4CAF50';
      case 'Paused': return '#FF9800';
      case 'Completed': return '#757575';
      default: return '#757575';
    }
  };

  const getQualityColor = (score: number) => {
    if (score >= 8) return '#4CAF50';
    if (score >= 6) return '#FF9800';
    return '#F44336';
  };

  return (
    <div style={{ padding: '20px' }}>
      <h2>📊 تتبع حملات Meta Lead Ads</h2>
      
      {/* إحصائيات سريعة */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '20px', marginBottom: '30px' }}>
        <div style={{ padding: '20px', backgroundColor: '#f5f5f5', borderRadius: '8px' }}>
          <h3>إجمالي الإنفاق</h3>
          <p style={{ fontSize: '24px', fontWeight: 'bold', color: '#1976d2' }}>
            ${totalStats.totalSpend.toLocaleString()}
          </p>
        </div>
        <div style={{ padding: '20px', backgroundColor: '#f5f5f5', borderRadius: '8px' }}>
          <h3>إجمالي العملاء المحتملين</h3>
          <p style={{ fontSize: '24px', fontWeight: 'bold', color: '#4CAF50' }}>
            {totalStats.totalLeads}
          </p>
        </div>
        <div style={{ padding: '20px', backgroundColor: '#f5f5f5', borderRadius: '8px' }}>
          <h3>متوسط تكلفة العميل</h3>
          <p style={{ fontSize: '24px', fontWeight: 'bold', color: '#FF9800' }}>
            ${totalStats.avgCPL.toFixed(2)}
          </p>
        </div>
        <div style={{ padding: '20px', backgroundColor: '#f5f5f5', borderRadius: '8px' }}>
          <h3>متوسط العائد على الإنفاق</h3>
          <p style={{ fontSize: '24px', fontWeight: 'bold', color: '#9C27B0' }}>
            {totalStats.avgROAS.toFixed(1)}x
          </p>
        </div>
      </div>

      {/* أزرار التحكم */}
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
          onClick={exportToBI}
          style={{ 
            padding: '10px 20px', 
            marginRight: '10px', 
            backgroundColor: '#4285F4', 
            color: 'white', 
            border: 'none', 
            borderRadius: '5px' 
          }}
        >
          📊 تصدير إلى BigQuery
        </button>
        <button 
          onClick={loadCampaignData}
          style={{ 
            padding: '10px 20px', 
            backgroundColor: '#4CAF50', 
            color: 'white', 
            border: 'none', 
            borderRadius: '5px' 
          }}
        >
          🔄 تحديث البيانات
        </button>
      </div>

      {/* جدول الحملات */}
      <div style={{ backgroundColor: 'white', borderRadius: '8px', overflow: 'hidden', boxShadow: '0 2px 4px rgba(0,0,0,0.1)' }}>
        <table style={{ width: '100%', borderCollapse: 'collapse' }}>
          <thead style={{ backgroundColor: '#f8f9fa' }}>
            <tr>
              <th style={{ padding: '15px', textAlign: 'left', borderBottom: '1px solid #dee2e6' }}>الحملة</th>
              <th style={{ padding: '15px', textAlign: 'center', borderBottom: '1px solid #dee2e6' }}>المنصة</th>
              <th style={{ padding: '15px', textAlign: 'center', borderBottom: '1px solid #dee2e6' }}>الحالة</th>
              <th style={{ padding: '15px', textAlign: 'center', borderBottom: '1px solid #dee2e6' }}>الظهور</th>
              <th style={{ padding: '15px', textAlign: 'center', borderBottom: '1px solid #dee2e6' }}>النقرات</th>
              <th style={{ padding: '15px', textAlign: 'center', borderBottom: '1px solid #dee2e6' }}>العملاء المحتملين</th>
              <th style={{ padding: '15px', textAlign: 'center', borderBottom: '1px solid #dee2e6' }}>التكلفة</th>
              <th style={{ padding: '15px', textAlign: 'center', borderBottom: '1px solid #dee2e6' }}>CPL</th>
              <th style={{ padding: '15px', textAlign: 'center', borderBottom: '1px solid #dee2e6' }}>CTR</th>
              <th style={{ padding: '15px', textAlign: 'center', borderBottom: '1px solid #dee2e6' }}>معدل التحويل</th>
              <th style={{ padding: '15px', textAlign: 'center', borderBottom: '1px solid #dee2e6' }}>ROAS</th>
              <th style={{ padding: '15px', textAlign: 'center', borderBottom: '1px solid #dee2e6' }}>جودة</th>
            </tr>
          </thead>
          <tbody>
            {campaigns.map((campaign) => (
              <tr key={campaign.id} style={{ borderBottom: '1px solid #dee2e6' }}>
                <td style={{ padding: '15px' }}>
                  <strong>{campaign.name}</strong>
                  <br />
                  <small style={{ color: '#6c757d' }}>ID: {campaign.id}</small>
                </td>
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
                <td style={{ padding: '15px', textAlign: 'center' }}>
                  <span style={{ 
                    padding: '4px 8px', 
                    borderRadius: '4px', 
                    backgroundColor: getStatusColor(campaign.status),
                    color: 'white',
                    fontSize: '12px'
                  }}>
                    {campaign.status}
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
                <td style={{ padding: '15px', textAlign: 'center' }}>{campaign.conversion_rate}%</td>
                <td style={{ padding: '15px', textAlign: 'center', fontWeight: 'bold' }}>
                  {campaign.roas.toFixed(1)}x
                </td>
                <td style={{ padding: '15px', textAlign: 'center' }}>
                  <span style={{ 
                    padding: '4px 8px', 
                    borderRadius: '4px', 
                    backgroundColor: getQualityColor(campaign.quality_score),
                    color: 'white',
                    fontSize: '12px'
                  }}>
                    {campaign.quality_score}/10
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* رسائل تحليلية */}
      <div style={{ marginTop: '30px', padding: '20px', backgroundColor: '#e3f2fd', borderRadius: '8px' }}>
        <h3>💡 رؤى تحليلية</h3>
        <ul>
          <li>حملة فيسبوك تحقق أداءً أفضل بـ ROAS {campaigns[0]?.roas.toFixed(1)}x</li>
          <li>متوسط تكلفة العميل المحتمل: ${totalStats.avgCPL.toFixed(2)}</li>
          <li>إجمالي العائد المتوقع: ${(totalStats.totalSpend * totalStats.avgROAS).toLocaleString()}</li>
        </ul>
      </div>
    </div>
  );
};