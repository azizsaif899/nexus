import { useState, useEffect } from 'react';
import styles from './app.module.css';

interface Report {
  id: string;
  title: string;
  type: 'daily' | 'weekly' | 'monthly' | 'error';
  date: string;
  status: 'completed' | 'in-progress' | 'failed';
  summary: string;
  details?: any;
}

interface ReportStats {
  totalReports: number;
  completedToday: number;
  errorsFound: number;
  successRate: number;
}

export function ReportsViewer() {
  const [reports, setReports] = useState<Report[]>([]);
  const [stats, setStats] = useState<ReportStats>({
    totalReports: 0,
    completedToday: 0,
    errorsFound: 0,
    successRate: 0
  });
  const [selectedReport, setSelectedReport] = useState<Report | null>(null);
  const [filter, setFilter] = useState<'all' | 'daily' | 'weekly' | 'monthly' | 'error'>('all');

  useEffect(() => {
    loadReports();
    const interval = setInterval(loadReports, 60000); // تحديث كل دقيقة
    return () => clearInterval(interval);
  }, []);

  const loadReports = async () => {
    try {
      // محاولة استدعاء API الحقيقي
      const response = await fetch('/api/reports');
      if (response.ok) {
        const data = await response.json();
        setReports(data.reports);
        setStats(data.stats);
      } else {
        loadMockReports();
      }
    } catch (error) {
      console.warn('API غير متاح، استخدام البيانات المحاكاة');
      loadMockReports();
    }
  };

  const loadMockReports = () => {
    const mockReports: Report[] = [
      {
        id: 'daily_94',
        title: 'تقرير اليوم 94 - Backend Security',
        type: 'daily',
        date: '2025-01-08',
        status: 'completed',
        summary: '15/15 مهمة مكتملة، 0 أخطاء، معدل نجاح 100%',
        details: {
          tasksCompleted: 15,
          totalTasks: 15,
          errors: 0,
          executionTime: '6 ساعات',
          files: ['apps/api/src/middleware/auth.ts', 'package.json']
        }
      },
      {
        id: 'daily_95',
        title: 'تقرير اليوم 95 - API Endpoints',
        type: 'daily',
        date: '2025-01-09',
        status: 'in-progress',
        summary: '8/15 مهمة مكتملة، جاري التنفيذ',
        details: {
          tasksCompleted: 8,
          totalTasks: 15,
          errors: 0,
          executionTime: '3 ساعات',
          currentTask: 'TASK-REDIS-001'
        }
      },
      {
        id: 'weekly_1',
        title: 'ملخص الأسبوع الأول',
        type: 'weekly',
        date: '2025-01-07',
        status: 'completed',
        summary: '7 أيام، 105 مهام، معدل نجاح 98%',
        details: {
          days: 7,
          totalTasks: 105,
          completedTasks: 103,
          failedTasks: 2,
          averageTime: '5.5 ساعات/يوم'
        }
      },
      {
        id: 'error_92',
        title: 'تقرير أخطاء اليوم 92',
        type: 'error',
        date: '2025-01-06',
        status: 'completed',
        summary: '3 أخطاء تم اكتشافها وإصلاحها',
        details: {
          errors: [
            { type: 'Database Connection', severity: 'high', fixed: true },
            { type: 'Memory Leak', severity: 'medium', fixed: true },
            { type: 'API Timeout', severity: 'low', fixed: true }
          ]
        }
      }
    ];

    setReports(mockReports);
    setStats({
      totalReports: mockReports.length,
      completedToday: mockReports.filter(r => r.date === '2025-01-09').length,
      errorsFound: 3,
      successRate: 98
    });
  };

  const filteredReports = reports.filter(report => 
    filter === 'all' || report.type === filter
  );

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed': return '#28a745';
      case 'in-progress': return '#ffc107';
      case 'failed': return '#dc3545';
      default: return '#6c757d';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'completed': return '✅';
      case 'in-progress': return '🔄';
      case 'failed': return '❌';
      default: return '📄';
    }
  };

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'daily': return '📅';
      case 'weekly': return '📊';
      case 'monthly': return '📈';
      case 'error': return '🚨';
      default: return '📄';
    }
  };

  const exportReport = (report: Report) => {
    const dataStr = JSON.stringify(report, null, 2);
    const dataBlob = new Blob([dataStr], { type: 'application/json' });
    const url = URL.createObjectURL(dataBlob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `${report.id}.json`;
    link.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className={styles.section}>
      <h2>📊 مركز التقارير الشامل</h2>
      
      {/* إحصائيات سريعة */}
      <div className={styles.statsGrid}>
        <div className={styles.statCard}>
          <h3>إجمالي التقارير</h3>
          <div className={styles.statValue}>{stats.totalReports}</div>
        </div>
        
        <div className={styles.statCard}>
          <h3>مكتمل اليوم</h3>
          <div className={styles.statValue} style={{ color: '#28a745' }}>
            {stats.completedToday}
          </div>
        </div>
        
        <div className={styles.statCard}>
          <h3>أخطاء مكتشفة</h3>
          <div className={styles.statValue} style={{ color: '#dc3545' }}>
            {stats.errorsFound}
          </div>
        </div>
        
        <div className={styles.statCard}>
          <h3>معدل النجاح</h3>
          <div className={styles.statValue} style={{ color: '#28a745' }}>
            {stats.successRate}%
          </div>
        </div>
      </div>

      {/* فلاتر */}
      <div style={{ margin: '2rem 0', display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
        {['all', 'daily', 'weekly', 'monthly', 'error'].map(filterType => (
          <button
            key={filterType}
            onClick={() => setFilter(filterType as any)}
            style={{
              padding: '0.5rem 1rem',
              border: '1px solid #ddd',
              borderRadius: '4px',
              backgroundColor: filter === filterType ? '#007bff' : 'white',
              color: filter === filterType ? 'white' : '#333',
              cursor: 'pointer'
            }}
          >
            {filterType === 'all' ? 'الكل' : 
             filterType === 'daily' ? 'يومي' :
             filterType === 'weekly' ? 'أسبوعي' :
             filterType === 'monthly' ? 'شهري' : 'أخطاء'}
          </button>
        ))}
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: selectedReport ? '1fr 1fr' : '1fr', gap: '2rem' }}>
        {/* قائمة التقارير */}
        <div>
          <h3>📋 قائمة التقارير</h3>
          <div style={{ 
            border: '1px solid #ddd', 
            borderRadius: '8px', 
            maxHeight: '500px', 
            overflowY: 'auto' 
          }}>
            {filteredReports.length === 0 ? (
              <p style={{ padding: '2rem', textAlign: 'center', color: '#666' }}>
                لا توجد تقارير متاحة
              </p>
            ) : (
              filteredReports.map(report => (
                <div 
                  key={report.id}
                  onClick={() => setSelectedReport(report)}
                  style={{
                    padding: '1rem',
                    borderBottom: '1px solid #eee',
                    cursor: 'pointer',
                    backgroundColor: selectedReport?.id === report.id ? '#f8f9fa' : 'white',
                    transition: 'background-color 0.2s'
                  }}
                  onMouseEnter={(e) => {
                    if (selectedReport?.id !== report.id) {
                      e.currentTarget.style.backgroundColor = '#f5f5f5';
                    }
                  }}
                  onMouseLeave={(e) => {
                    if (selectedReport?.id !== report.id) {
                      e.currentTarget.style.backgroundColor = 'white';
                    }
                  }}
                >
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                    <div style={{ flex: 1 }}>
                      <div style={{ fontWeight: 'bold', marginBottom: '0.25rem' }}>
                        {getTypeIcon(report.type)} {report.title}
                      </div>
                      <div style={{ fontSize: '0.9rem', color: '#666', marginBottom: '0.5rem' }}>
                        {report.summary}
                      </div>
                      <div style={{ fontSize: '0.8rem', color: '#999' }}>
                        {new Date(report.date).toLocaleDateString('ar-SA')}
                      </div>
                    </div>
                    <div style={{ 
                      color: getStatusColor(report.status),
                      fontWeight: 'bold',
                      marginLeft: '1rem'
                    }}>
                      {getStatusIcon(report.status)}
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>

        {/* تفاصيل التقرير المحدد */}
        {selectedReport && (
          <div>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
              <h3>📄 تفاصيل التقرير</h3>
              <div style={{ display: 'flex', gap: '0.5rem' }}>
                <button
                  onClick={() => exportReport(selectedReport)}
                  style={{
                    padding: '0.5rem 1rem',
                    backgroundColor: '#28a745',
                    color: 'white',
                    border: 'none',
                    borderRadius: '4px',
                    cursor: 'pointer'
                  }}
                >
                  📤 تصدير
                </button>
                <button
                  onClick={() => setSelectedReport(null)}
                  style={{
                    padding: '0.5rem 1rem',
                    backgroundColor: '#6c757d',
                    color: 'white',
                    border: 'none',
                    borderRadius: '4px',
                    cursor: 'pointer'
                  }}
                >
                  ✕ إغلاق
                </button>
              </div>
            </div>
            
            <div style={{ 
              border: '1px solid #ddd', 
              borderRadius: '8px', 
              padding: '1.5rem',
              backgroundColor: '#f8f9fa'
            }}>
              <div style={{ marginBottom: '1rem' }}>
                <strong>العنوان:</strong> {selectedReport.title}
              </div>
              <div style={{ marginBottom: '1rem' }}>
                <strong>النوع:</strong> {getTypeIcon(selectedReport.type)} {selectedReport.type}
              </div>
              <div style={{ marginBottom: '1rem' }}>
                <strong>التاريخ:</strong> {new Date(selectedReport.date).toLocaleDateString('ar-SA')}
              </div>
              <div style={{ marginBottom: '1rem' }}>
                <strong>الحالة:</strong> 
                <span style={{ color: getStatusColor(selectedReport.status), marginLeft: '0.5rem' }}>
                  {getStatusIcon(selectedReport.status)} {selectedReport.status}
                </span>
              </div>
              <div style={{ marginBottom: '1rem' }}>
                <strong>الملخص:</strong> {selectedReport.summary}
              </div>
              
              {selectedReport.details && (
                <div>
                  <strong>التفاصيل:</strong>
                  <pre style={{ 
                    backgroundColor: 'white', 
                    padding: '1rem', 
                    borderRadius: '4px',
                    border: '1px solid #ddd',
                    marginTop: '0.5rem',
                    fontSize: '0.9rem',
                    overflow: 'auto',
                    maxHeight: '300px'
                  }}>
                    {JSON.stringify(selectedReport.details, null, 2)}
                  </pre>
                </div>
              )}
            </div>
          </div>
        )}
      </div>

      {/* أزرار إضافية */}
      <div style={{ marginTop: '2rem', display: 'flex', gap: '1rem', flexWrap: 'wrap' }}>
        <button 
          className={styles.loginButton}
          onClick={loadReports}
        >
          🔄 تحديث التقارير
        </button>
        <button 
          className={styles.loginButton}
          style={{ backgroundColor: '#17a2b8' }}
          onClick={() => {
            const allReports = JSON.stringify(reports, null, 2);
            const blob = new Blob([allReports], { type: 'application/json' });
            const url = URL.createObjectURL(blob);
            const link = document.createElement('a');
            link.href = url;
            link.download = 'all_reports.json';
            link.click();
            URL.revokeObjectURL(url);
          }}
        >
          📦 تصدير الكل
        </button>
        <button 
          className={styles.loginButton}
          style={{ backgroundColor: '#6c757d' }}
        >
          📊 إحصائيات متقدمة
        </button>
      </div>
    </div>
  );
}