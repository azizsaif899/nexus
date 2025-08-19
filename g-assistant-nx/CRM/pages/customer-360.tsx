import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';

interface Customer360Data {
  odoo: {
    id: number;
    name: string;
    email: string;
    phone: string;
    stage: string;
    opportunities: any[];
    activities: any[];
    expected_revenue: number;
  };
  meta: {
    source_campaign: string;
    ad_id: string;
    roas: number;
    cost_per_lead: number;
    interactions: any[];
  };
  analytics: {
    lead_score: number;
    temperature: 'Hot' | 'Warm' | 'Cold';
    last_interaction: string;
    conversion_probability: number;
  };
}

export const Customer360: React.FC = () => {
  const { customerId } = useParams<{ customerId: string }>();
  const [customerData, setCustomerData] = useState<Customer360Data | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchCustomer360Data();
  }, [customerId]);

  const fetchCustomer360Data = async () => {
    try {
      setLoading(true);
      
      // جلب البيانات من مصادر متعددة
      const [odooData, metaData, analyticsData] = await Promise.all([
        fetch(`/api/odoo/customers/${customerId}`).then(r => r.json()),
        fetch(`/api/meta/customer-insights/${customerId}`).then(r => r.json()),
        fetch(`/api/analytics/customer-score/${customerId}`).then(r => r.json())
      ]);

      setCustomerData({
        odoo: odooData.data,
        meta: metaData.data,
        analytics: analyticsData.data
      });
    } catch (error) {
      console.error('Error fetching customer 360 data:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return <div className="loading">جاري تحميل ملف العميل الشامل...</div>;
  }

  if (!customerData) {
    return <div className="error">خطأ في تحميل بيانات العميل</div>;
  }

  const getTemperatureColor = (temp: string) => {
    switch (temp) {
      case 'Hot': return '#ff4444';
      case 'Warm': return '#ff9800';
      case 'Cold': return '#2196f3';
      default: return '#666';
    }
  };

  return (
    <div className="customer-360" style={{ padding: '20px' }}>
      {/* Header */}
      <div className="customer-header" style={{ 
        background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
        color: 'white',
        padding: '30px',
        borderRadius: '15px',
        marginBottom: '30px'
      }}>
        <h1>{customerData.odoo.name}</h1>
        <div style={{ display: 'flex', gap: '20px', marginTop: '15px' }}>
          <span>📧 {customerData.odoo.email}</span>
          <span>📱 {customerData.odoo.phone}</span>
          <span style={{ 
            background: getTemperatureColor(customerData.analytics.temperature),
            padding: '5px 15px',
            borderRadius: '20px',
            fontSize: '14px'
          }}>
            🌡️ {customerData.analytics.temperature}
          </span>
        </div>
      </div>

      {/* Key Metrics */}
      <div className="metrics-grid" style={{ 
        display: 'grid', 
        gridTemplateColumns: 'repeat(4, 1fr)', 
        gap: '20px', 
        marginBottom: '30px' 
      }}>
        <div className="metric-card" style={{ 
          background: 'white', 
          padding: '20px', 
          borderRadius: '10px', 
          textAlign: 'center',
          boxShadow: '0 2px 4px rgba(0,0,0,0.1)'
        }}>
          <h3>Lead Score</h3>
          <div style={{ fontSize: '32px', fontWeight: 'bold', color: '#4CAF50' }}>
            {customerData.analytics.lead_score}/100
          </div>
        </div>
        
        <div className="metric-card" style={{ 
          background: 'white', 
          padding: '20px', 
          borderRadius: '10px', 
          textAlign: 'center',
          boxShadow: '0 2px 4px rgba(0,0,0,0.1)'
        }}>
          <h3>الإيرادات المتوقعة</h3>
          <div style={{ fontSize: '32px', fontWeight: 'bold', color: '#2196F3' }}>
            ${customerData.odoo.expected_revenue.toLocaleString()}
          </div>
        </div>

        <div className="metric-card" style={{ 
          background: 'white', 
          padding: '20px', 
          borderRadius: '10px', 
          textAlign: 'center',
          boxShadow: '0 2px 4px rgba(0,0,0,0.1)'
        }}>
          <h3>ROAS</h3>
          <div style={{ fontSize: '32px', fontWeight: 'bold', color: '#FF9800' }}>
            {customerData.meta.roas}x
          </div>
        </div>

        <div className="metric-card" style={{ 
          background: 'white', 
          padding: '20px', 
          borderRadius: '10px', 
          textAlign: 'center',
          boxShadow: '0 2px 4px rgba(0,0,0,0.1)'
        }}>
          <h3>احتمالية التحويل</h3>
          <div style={{ fontSize: '32px', fontWeight: 'bold', color: '#9C27B0' }}>
            {customerData.analytics.conversion_probability}%
          </div>
        </div>
      </div>

      {/* Content Sections */}
      <div className="content-grid" style={{ 
        display: 'grid', 
        gridTemplateColumns: '1fr 1fr', 
        gap: '30px' 
      }}>
        {/* Odoo Data */}
        <div className="section" style={{ 
          background: 'white', 
          padding: '25px', 
          borderRadius: '15px',
          boxShadow: '0 4px 6px rgba(0,0,0,0.1)'
        }}>
          <h2 style={{ color: '#1976d2', marginBottom: '20px' }}>📊 بيانات CRM</h2>
          
          <div className="info-item" style={{ marginBottom: '15px' }}>
            <strong>المرحلة الحالية:</strong> {customerData.odoo.stage}
          </div>
          
          <h3>الفرص البيعية ({customerData.odoo.opportunities.length})</h3>
          {customerData.odoo.opportunities.map((opp, index) => (
            <div key={index} style={{ 
              background: '#f5f5f5', 
              padding: '10px', 
              borderRadius: '8px', 
              marginBottom: '10px' 
            }}>
              <strong>{opp.name}</strong> - ${opp.expected_revenue.toLocaleString()}
              <br />
              <small>المرحلة: {opp.stage} | الاحتمالية: {opp.probability}%</small>
            </div>
          ))}

          <h3>آخر الأنشطة</h3>
          {customerData.odoo.activities.slice(0, 3).map((activity, index) => (
            <div key={index} style={{ 
              borderLeft: '3px solid #4CAF50', 
              paddingLeft: '10px', 
              marginBottom: '10px' 
            }}>
              <strong>{activity.type}</strong>
              <br />
              <small>{activity.date} - {activity.summary}</small>
            </div>
          ))}
        </div>

        {/* Meta & Analytics Data */}
        <div className="section" style={{ 
          background: 'white', 
          padding: '25px', 
          borderRadius: '15px',
          boxShadow: '0 4px 6px rgba(0,0,0,0.1)'
        }}>
          <h2 style={{ color: '#1877F2', marginBottom: '20px' }}>📱 بيانات Meta</h2>
          
          <div className="info-item" style={{ marginBottom: '15px' }}>
            <strong>مصدر الحملة:</strong> {customerData.meta.source_campaign}
          </div>
          
          <div className="info-item" style={{ marginBottom: '15px' }}>
            <strong>تكلفة العميل:</strong> ${customerData.meta.cost_per_lead}
          </div>

          <h3>تاريخ التفاعلات</h3>
          {customerData.meta.interactions.map((interaction, index) => (
            <div key={index} style={{ 
              background: '#e3f2fd', 
              padding: '10px', 
              borderRadius: '8px', 
              marginBottom: '10px' 
            }}>
              <strong>{interaction.type}</strong> - {interaction.platform}
              <br />
              <small>{interaction.timestamp}</small>
            </div>
          ))}

          <div style={{ 
            background: '#f0f8ff', 
            padding: '15px', 
            borderRadius: '10px', 
            marginTop: '20px' 
          }}>
            <h3 style={{ color: '#1976d2' }}>💡 رؤى ذكية</h3>
            <p>هذا العميل من حملة عالية الأداء مع ROAS {customerData.meta.roas}x</p>
            <p>آخر تفاعل: {customerData.analytics.last_interaction}</p>
            <p>يُنصح بالمتابعة خلال 24 ساعة للحصول على أفضل النتائج</p>
          </div>
        </div>
      </div>

      {/* Action Buttons */}
      <div className="actions" style={{ 
        marginTop: '30px', 
        textAlign: 'center' 
      }}>
        <button 
          style={{ 
            padding: '12px 24px', 
            margin: '0 10px', 
            background: '#4CAF50', 
            color: 'white', 
            border: 'none', 
            borderRadius: '8px', 
            cursor: 'pointer' 
          }}
          onClick={() => window.open(`/chat?customer=${customerId}`, '_blank')}
        >
          💬 بدء محادثة
        </button>
        
        <button 
          style={{ 
            padding: '12px 24px', 
            margin: '0 10px', 
            background: '#2196F3', 
            color: 'white', 
            border: 'none', 
            borderRadius: '8px', 
            cursor: 'pointer' 
          }}
          onClick={() => window.open(`https://odoo.com/crm/lead/${customerData.odoo.id}`, '_blank')}
        >
          🔗 فتح في Odoo
        </button>
      </div>
    </div>
  );
};