/**
 * CRM Dashboard Component - لوحة إدارة CRM
 */

import React, { useState, useEffect } from 'react';

interface CRMStats {
  totalLeads: number;
  whatsappLeads: number;
  convertedCustomers: number;
  conversionRate: number;
  todayMessages: number;
}

export const CRMDashboard: React.FC = () => {
  const [stats, setStats] = useState<CRMStats>({
    totalLeads: 0,
    whatsappLeads: 0,
    convertedCustomers: 0,
    conversionRate: 0,
    todayMessages: 0
  });

  const [recentLeads, setRecentLeads] = useState([
    { id: 1, name: 'أحمد محمد', phone: '+966501234567', source: 'WhatsApp', status: 'جديد' },
    { id: 2, name: 'فاطمة علي', phone: '+966507654321', source: 'WhatsApp', status: 'متابعة' },
    { id: 3, name: 'محمد سالم', phone: '+966509876543', source: 'الموقع', status: 'عميل' }
  ]);

  useEffect(() => {
    fetchCRMData();
    const interval = setInterval(fetchCRMData, 30000); // تحديث كل 30 ثانية
    return () => clearInterval(interval);
  }, []);

  const fetchCRMData = async () => {
    try {
      // محاكاة جلب البيانات
      setStats({
        totalLeads: 15,
        whatsappLeads: 8,
        convertedCustomers: 3,
        conversionRate: 20,
        todayMessages: 5
      });
    } catch (error) {
      console.error('خطأ في جلب بيانات CRM:', error);
    }
  };

  return (
    <div className="crm-dashboard">
      <div className="dashboard-header">
        <h2>📊 لوحة إدارة CRM</h2>
        <div className="header-actions">
          <button 
            onClick={() => window.open('http://localhost:8070', '_blank')}
            className="btn-primary"
          >
            🔗 فتح Odoo CRM
          </button>
          <button onClick={fetchCRMData} className="btn-secondary">
            🔄 تحديث
          </button>
        </div>
      </div>

      {/* إحصائيات سريعة */}
      <div className="stats-grid">
        <div className="stat-card">
          <div className="stat-icon">👥</div>
          <div className="stat-content">
            <h3>{stats.totalLeads}</h3>
            <p>إجمالي العملاء المحتملين</p>
          </div>
        </div>

        <div className="stat-card whatsapp">
          <div className="stat-icon">📱</div>
          <div className="stat-content">
            <h3>{stats.whatsappLeads}</h3>
            <p>عملاء من WhatsApp</p>
          </div>
        </div>

        <div className="stat-card success">
          <div className="stat-icon">✅</div>
          <div className="stat-content">
            <h3>{stats.convertedCustomers}</h3>
            <p>عملاء محولين</p>
          </div>
        </div>

        <div className="stat-card rate">
          <div className="stat-icon">📈</div>
          <div className="stat-content">
            <h3>{stats.conversionRate}%</h3>
            <p>معدل التحويل</p>
          </div>
        </div>
      </div>

      {/* العملاء الجدد */}
      <div className="recent-leads">
        <h3>🆕 العملاء المحتملين الجدد</h3>
        <div className="leads-table">
          <table>
            <thead>
              <tr>
                <th>الاسم</th>
                <th>الهاتف</th>
                <th>المصدر</th>
                <th>الحالة</th>
                <th>الإجراءات</th>
              </tr>
            </thead>
            <tbody>
              {recentLeads.map(lead => (
                <tr key={lead.id}>
                  <td>{lead.name}</td>
                  <td>{lead.phone}</td>
                  <td>
                    <span className={`source-badge ${lead.source === 'WhatsApp' ? 'whatsapp' : 'web'}`}>
                      {lead.source === 'WhatsApp' ? '📱' : '🌐'} {lead.source}
                    </span>
                  </td>
                  <td>
                    <span className={`status-badge ${lead.status}`}>
                      {lead.status}
                    </span>
                  </td>
                  <td>
                    <button className="btn-small">👁️ عرض</button>
                    <button className="btn-small">📞 اتصال</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* رسائل اليوم */}
      <div className="today-messages">
        <h3>📱 رسائل WhatsApp اليوم: {stats.todayMessages}</h3>
        <div className="message-preview">
          <p>آخر رسالة: "مرحباً، أريد الاستفسار عن خدماتكم" - أحمد محمد</p>
          <small>منذ 5 دقائق</small>
        </div>
      </div>
    </div>
  );
};