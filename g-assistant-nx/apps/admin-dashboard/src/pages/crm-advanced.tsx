import React, { useState } from 'react';

interface Customer {
  id: string;
  name: string;
  email: string;
  phone: string;
  status: 'active' | 'inactive' | 'pending';
  lastContact: string;
  value: number;
}

interface Lead {
  id: string;
  name: string;
  source: string;
  score: number;
  stage: 'new' | 'qualified' | 'proposal' | 'negotiation' | 'closed';
}

export default function CRMAdvancedPage() {
  const [customers] = useState<Customer[]>([
    { id: '1', name: 'أحمد محمد', email: 'ahmed@example.com', phone: '+966501234567', status: 'active', lastContact: '2025-08-15', value: 15000 },
    { id: '2', name: 'فاطمة علي', email: 'fatima@example.com', phone: '+966507654321', status: 'pending', lastContact: '2025-08-10', value: 8500 },
    { id: '3', name: 'محمد السعد', email: 'mohammed@example.com', phone: '+966509876543', status: 'active', lastContact: '2025-08-18', value: 22000 }
  ]);

  const [leads] = useState<Lead[]>([
    { id: '1', name: 'شركة التقنية المتقدمة', source: 'Website', score: 85, stage: 'qualified' },
    { id: '2', name: 'مؤسسة الابتكار', source: 'LinkedIn', score: 72, stage: 'proposal' },
    { id: '3', name: 'مجموعة الرقمنة', source: 'Referral', score: 91, stage: 'negotiation' }
  ]);

  const [activeTab, setActiveTab] = useState<'customers' | 'leads' | 'analytics'>('customers');

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active': return '#10B981';
      case 'pending': return '#F59E0B';
      case 'inactive': return '#EF4444';
      default: return '#6B7280';
    }
  };

  const getStageColor = (stage: string) => {
    switch (stage) {
      case 'new': return '#3B82F6';
      case 'qualified': return '#10B981';
      case 'proposal': return '#F59E0B';
      case 'negotiation': return '#8B5CF6';
      case 'closed': return '#059669';
      default: return '#6B7280';
    }
  };

  return (
    <div className="crm-dashboard">
      <div className="dashboard-header">
        <h1>📊 CRM Dashboard</h1>
        <div className="crm-stats">
          <div className="stat-card">
            <h3>إجمالي العملاء</h3>
            <div className="stat-value">{customers.length}</div>
          </div>
          <div className="stat-card">
            <h3>العملاء النشطين</h3>
            <div className="stat-value">{customers.filter(c => c.status === 'active').length}</div>
          </div>
          <div className="stat-card">
            <h3>إجمالي القيمة</h3>
            <div className="stat-value">{customers.reduce((sum, c) => sum + c.value, 0).toLocaleString()} ر.س</div>
          </div>
          <div className="stat-card">
            <h3>العملاء المحتملين</h3>
            <div className="stat-value">{leads.length}</div>
          </div>
        </div>
      </div>

      {/* Navigation Tabs */}
      <div className="crm-tabs">
        <button 
          className={`tab ${activeTab === 'customers' ? 'active' : ''}`}
          onClick={() => setActiveTab('customers')}
        >
          👥 العملاء
        </button>
        <button 
          className={`tab ${activeTab === 'leads' ? 'active' : ''}`}
          onClick={() => setActiveTab('leads')}
        >
          🎯 العملاء المحتملين
        </button>
        <button 
          className={`tab ${activeTab === 'analytics' ? 'active' : ''}`}
          onClick={() => setActiveTab('analytics')}
        >
          📈 التحليلات
        </button>
      </div>

      {/* Customers Tab */}
      {activeTab === 'customers' && (
        <div className="tab-content">
          <div className="section-header">
            <h2>👥 إدارة العملاء</h2>
            <button className="btn-primary">➕ إضافة عميل جديد</button>
          </div>
          <div className="customers-table">
            <table>
              <thead>
                <tr>
                  <th>الاسم</th>
                  <th>البريد الإلكتروني</th>
                  <th>الهاتف</th>
                  <th>الحالة</th>
                  <th>آخر تواصل</th>
                  <th>القيمة</th>
                  <th>الإجراءات</th>
                </tr>
              </thead>
              <tbody>
                {customers.map(customer => (
                  <tr key={customer.id}>
                    <td>{customer.name}</td>
                    <td>{customer.email}</td>
                    <td>{customer.phone}</td>
                    <td>
                      <span 
                        className="status-badge"
                        style={{ backgroundColor: getStatusColor(customer.status) }}
                      >
                        {customer.status}
                      </span>
                    </td>
                    <td>{customer.lastContact}</td>
                    <td>{customer.value.toLocaleString()} ر.س</td>
                    <td>
                      <button className="btn-small">✏️ تعديل</button>
                      <button className="btn-small">📞 اتصال</button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Leads Tab */}
      {activeTab === 'leads' && (
        <div className="tab-content">
          <div className="section-header">
            <h2>🎯 العملاء المحتملين</h2>
            <button className="btn-primary">➕ إضافة عميل محتمل</button>
          </div>
          <div className="leads-grid">
            {leads.map(lead => (
              <div key={lead.id} className="lead-card">
                <div className="lead-header">
                  <h3>{lead.name}</h3>
                  <span className="lead-score">نقاط: {lead.score}</span>
                </div>
                <div className="lead-details">
                  <p><strong>المصدر:</strong> {lead.source}</p>
                  <p>
                    <strong>المرحلة:</strong> 
                    <span 
                      className="stage-badge"
                      style={{ backgroundColor: getStageColor(lead.stage) }}
                    >
                      {lead.stage}
                    </span>
                  </p>
                </div>
                <div className="lead-actions">
                  <button className="btn-small">📧 إرسال عرض</button>
                  <button className="btn-small">📞 متابعة</button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Analytics Tab */}
      {activeTab === 'analytics' && (
        <div className="tab-content">
          <h2>📈 تحليلات CRM</h2>
          <div className="analytics-grid">
            <div className="chart-card">
              <h3>توزيع العملاء حسب الحالة</h3>
              <div className="chart-placeholder">
                📊 رسم بياني دائري
              </div>
            </div>
            <div className="chart-card">
              <h3>نمو العملاء الشهري</h3>
              <div className="chart-placeholder">
                📈 رسم بياني خطي
              </div>
            </div>
            <div className="chart-card">
              <h3>أداء المبيعات</h3>
              <div className="chart-placeholder">
                📊 رسم بياني عمودي
              </div>
            </div>
            <div className="chart-card">
              <h3>مصادر العملاء المحتملين</h3>
              <div className="chart-placeholder">
                🎯 رسم بياني شعاعي
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}