import React, { useState, useEffect } from 'react';
import { StatCard } from '../../components/crm/StatCard';
import { PulseCard } from '../../components/crm/PulseCard';
import { NaturalQueryBar } from '../../components/crm/NaturalQueryBar';

interface DashboardStats {
  totalLeads: number;
  totalOpportunities: number;
  totalRevenue: number;
  conversionRate: number;
}

interface PulseInsight {
  type: 'opportunity' | 'risk' | 'trend';
  title: string;
  description: string;
  action?: string;
  priority: 'high' | 'medium' | 'low';
}

export const CRMDashboard: React.FC = () => {
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [pulseInsights, setPulseInsights] = useState<PulseInsight[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      setLoading(true);
      
      // جلب الإحصائيات الأساسية
      const statsResponse = await fetch('/api/crm/dashboard/stats');
      const statsData = await statsResponse.json();
      
      // جلب رؤى The Pulse
      const pulseResponse = await fetch('/api/crm/dashboard/pulse');
      const pulseData = await pulseResponse.json();
      
      setStats(statsData.data);
      setPulseInsights(pulseData.data);
      
    } catch (error) {
      console.error('Error fetching dashboard data:', error);
      
      // بيانات تجريبية
      setStats({
        totalLeads: 156,
        totalOpportunities: 43,
        totalRevenue: 2450000,
        conversionRate: 27.6
      });
      
      setPulseInsights([
        {
          type: 'opportunity',
          title: 'فرصة: ندوات الويب تزيد التحويل',
          description: 'العملاء الذين يحضرون ندواتنا لديهم معدل إغلاق أعلى بنسبة 40%. نقترح دعوة 12 عميل محتمل للندوة القادمة.',
          action: 'إرسال دعوات الندوة',
          priority: 'high'
        },
        {
          type: 'risk',
          title: 'خطر: مشاكل في الميزة الأساسية',
          description: '5 من أهم صفقاتك تعتمد على الميزة X التي أبلغ المستخدمون عن مشاكل بها في نظام الدعم.',
          action: 'مراجعة تذاكر الدعم',
          priority: 'high'
        },
        {
          type: 'trend',
          title: 'اتجاه: زيادة في العملاء من الرياض',
          description: 'نمو 35% في العملاء المحتملين من منطقة الرياض هذا الشهر. فرصة لتوسيع الفريق المحلي.',
          action: 'تحليل السوق المحلي',
          priority: 'medium'
        }
      ]);
      
    } finally {
      setLoading(false);
    }
  };

  const handleNaturalQuery = async (query: string) => {
    try {
      const response = await fetch('/api/crm/natural-query', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ query })
      });
      
      const result = await response.json();
      
      if (result.success) {
        // توجيه المستخدم إلى صفحة النتائج
        window.location.href = `/crm/search?q=${encodeURIComponent(query)}&results=${encodeURIComponent(JSON.stringify(result.data))}`;
      }
    } catch (error) {
      console.error('Error processing natural query:', error);
    }
  };

  if (loading) {
    return (
      <div className="dashboard-loading" style={{ 
        display: 'flex', 
        justifyContent: 'center', 
        alignItems: 'center', 
        height: '400px' 
      }}>
        <div>جاري تحميل لوحة التحكم...</div>
      </div>
    );
  }

  return (
    <div className="crm-dashboard" style={{ padding: '20px' }}>
      {/* شريط البحث الطبيعي */}
      <div style={{ marginBottom: '30px' }}>
        <NaturalQueryBar 
          onQuery={handleNaturalQuery}
          placeholder="اسأل أي شيء عن عملائك... مثل: 'العملاء في الرياض الذين لم نتصل بهم منذ أسبوع'"
        />
      </div>

      {/* الإحصائيات الأساسية */}
      <div className="stats-grid" style={{ 
        display: 'grid', 
        gridTemplateColumns: 'repeat(4, 1fr)', 
        gap: '20px', 
        marginBottom: '40px' 
      }}>
        <StatCard
          title="العملاء المحتملين"
          value={stats?.totalLeads || 0}
          icon="👥"
          trend="+12%"
          color="#4CAF50"
        />
        <StatCard
          title="الفرص البيعية"
          value={stats?.totalOpportunities || 0}
          icon="💼"
          trend="+8%"
          color="#2196F3"
        />
        <StatCard
          title="الإيرادات المتوقعة"
          value={`${((stats?.totalRevenue || 0) / 1000000).toFixed(1)}M ريال`}
          icon="💰"
          trend="+15%"
          color="#FF9800"
        />
        <StatCard
          title="معدل التحويل"
          value={`${stats?.conversionRate || 0}%`}
          icon="📈"
          trend="+3.2%"
          color="#9C27B0"
        />
      </div>

      {/* The Pulse - الرؤى الاستباقية */}
      <div className="pulse-section">
        <h2 style={{ 
          fontSize: '24px', 
          fontWeight: 'bold', 
          marginBottom: '20px',
          color: '#1976d2'
        }}>
          🔮 The Pulse - رؤى استباقية
        </h2>
        
        <div className="pulse-grid" style={{ 
          display: 'grid', 
          gridTemplateColumns: 'repeat(auto-fit, minmax(400px, 1fr))', 
          gap: '20px' 
        }}>
          {pulseInsights.map((insight, index) => (
            <PulseCard
              key={index}
              type={insight.type}
              title={insight.title}
              description={insight.description}
              action={insight.action}
              priority={insight.priority}
              onActionClick={() => {
                console.log(`Action clicked: ${insight.action}`);
                // تنفيذ الإجراء المقترح
              }}
            />
          ))}
        </div>
      </div>

      {/* أزرار الإجراءات السريعة */}
      <div className="quick-actions" style={{ 
        marginTop: '40px',
        display: 'flex',
        gap: '15px',
        flexWrap: 'wrap'
      }}>
        <button 
          className="quick-action-btn"
          style={{
            padding: '12px 24px',
            background: '#4CAF50',
            color: 'white',
            border: 'none',
            borderRadius: '8px',
            cursor: 'pointer',
            fontSize: '16px'
          }}
          onClick={() => window.location.href = '/crm/leads'}
        >
          📋 عرض جميع العملاء المحتملين
        </button>
        
        <button 
          className="quick-action-btn"
          style={{
            padding: '12px 24px',
            background: '#2196F3',
            color: 'white',
            border: 'none',
            borderRadius: '8px',
            cursor: 'pointer',
            fontSize: '16px'
          }}
          onClick={() => window.location.href = '/crm/opportunities'}
        >
          💼 خط أنابيب المبيعات
        </button>
        
        <button 
          className="quick-action-btn"
          style={{
            padding: '12px 24px',
            background: '#FF9800',
            color: 'white',
            border: 'none',
            borderRadius: '8px',
            cursor: 'pointer',
            fontSize: '16px'
          }}
          onClick={() => window.location.href = '/crm/analytics'}
        >
          📊 التحليلات المتقدمة
        </button>
      </div>
    </div>
  );
};