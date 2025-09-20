import { useState, useEffect } from 'react';
import styles from './app.module.css';

interface SystemMetrics {
  cpu: number;
  memory: number;
  responseTime: number;
  uptime: number;
}

interface Alert {
  id: string;
  level: 'info' | 'warning' | 'critical';
  message: string;
  timestamp: string;
}

export function MonitoringDashboard() {
  const [metrics, setMetrics] = useState<SystemMetrics>({
    cpu: 0,
    memory: 0,
    responseTime: 0,
    uptime: 99.9
  });
  const [alerts, setAlerts] = useState<Alert[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    loadMonitoringData();
    const interval = setInterval(loadMonitoringData, 30000); // Update every 30 seconds
    return () => clearInterval(interval);
  }, []);

  const loadMonitoringData = async () => {
    try {
      // محاكاة البيانات
      setMetrics({
        cpu: Math.random() * 100,
        memory: Math.random() * 1000,
        responseTime: Math.random() * 2000,
        uptime: 99.9
      });

      setAlerts([
        {
          id: '1',
          level: 'warning',
          message: 'High CPU usage detected: 85%',
          timestamp: new Date().toISOString()
        },
        {
          id: '2',
          level: 'info',
          message: 'System backup completed successfully',
          timestamp: new Date(Date.now() - 3600000).toISOString()
        }
      ]);
    } catch (error) {
      console.error('Error loading monitoring data:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const getStatusColor = (value: number, thresholds: { warning: number; critical: number }) => {
    if (value >= thresholds.critical) return '#dc3545';
    if (value >= thresholds.warning) return '#ffc107';
    return '#28a745';
  };

  const getAlertColor = (level: string) => {
    switch (level) {
      case 'critical': return '#dc3545';
      case 'warning': return '#ffc107';
      default: return '#17a2b8';
    }
  };

  if (isLoading) {
    return (
      <div className={styles.section}>
        <h2>📊 لوحة المراقبة</h2>
        <p>جاري تحميل البيانات...</p>
      </div>
    );
  }

  return (
    <div className={styles.section}>
      <h2>📊 لوحة المراقبة المتقدمة</h2>
      
      {/* مقاييس النظام */}
      <div className={styles.statsGrid}>
        <div className={styles.statCard}>
          <h3>استخدام المعالج</h3>
          <div 
            className={styles.statValue}
            style={{ color: getStatusColor(metrics.cpu, { warning: 70, critical: 90 }) }}
          >
            {metrics.cpu.toFixed(1)}%
          </div>
          <div style={{ fontSize: '0.8rem', color: '#666' }}>
            {metrics.cpu > 90 ? 'حرج' : metrics.cpu > 70 ? 'تحذير' : 'طبيعي'}
          </div>
        </div>

        <div className={styles.statCard}>
          <h3>استخدام الذاكرة</h3>
          <div 
            className={styles.statValue}
            style={{ color: getStatusColor(metrics.memory, { warning: 700, critical: 900 }) }}
          >
            {metrics.memory.toFixed(0)} MB
          </div>
          <div style={{ fontSize: '0.8rem', color: '#666' }}>
            {metrics.memory > 900 ? 'حرج' : metrics.memory > 700 ? 'تحذير' : 'طبيعي'}
          </div>
        </div>

        <div className={styles.statCard}>
          <h3>زمن الاستجابة</h3>
          <div 
            className={styles.statValue}
            style={{ color: getStatusColor(metrics.responseTime, { warning: 1000, critical: 2000 }) }}
          >
            {metrics.responseTime.toFixed(0)} ms
          </div>
          <div style={{ fontSize: '0.8rem', color: '#666' }}>
            {metrics.responseTime > 2000 ? 'بطيء' : metrics.responseTime > 1000 ? 'متوسط' : 'سريع'}
          </div>
        </div>

        <div className={styles.statCard}>
          <h3>وقت التشغيل</h3>
          <div className={`${styles.statValue} ${styles.healthy}`}>
            {metrics.uptime}%
          </div>
          <div style={{ fontSize: '0.8rem', color: '#666' }}>
            متاح
          </div>
        </div>
      </div>

      {/* الإنذارات */}
      <div style={{ marginTop: '2rem' }}>
        <h3>🚨 الإنذارات النشطة</h3>
        <div style={{ 
          border: '1px solid #ddd', 
          borderRadius: '8px', 
          padding: '1rem',
          maxHeight: '300px',
          overflowY: 'auto'
        }}>
          {alerts.length === 0 ? (
            <p style={{ color: '#666', textAlign: 'center' }}>لا توجد إنذارات نشطة</p>
          ) : (
            alerts.map(alert => (
              <div 
                key={alert.id} 
                style={{
                  padding: '0.75rem',
                  margin: '0.5rem 0',
                  backgroundColor: '#f8f9fa',
                  borderRadius: '4px',
                  borderLeft: `4px solid ${getAlertColor(alert.level)}`
                }}
              >
                <div style={{ 
                  display: 'flex', 
                  justifyContent: 'space-between', 
                  alignItems: 'center' 
                }}>
                  <span style={{ 
                    fontWeight: 'bold',
                    color: getAlertColor(alert.level)
                  }}>
                    {alert.level.toUpperCase()}
                  </span>
                  <span style={{ fontSize: '0.8rem', color: '#666' }}>
                    {new Date(alert.timestamp).toLocaleString('ar-SA')}
                  </span>
                </div>
                <div style={{ marginTop: '0.25rem' }}>
                  {alert.message}
                </div>
              </div>
            ))
          )}
        </div>
      </div>

      {/* إحصائيات إضافية */}
      <div style={{ marginTop: '2rem' }}>
        <h3>📈 إحصائيات النظام</h3>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1rem' }}>
          <div style={{ padding: '1rem', border: '1px solid #ddd', borderRadius: '8px' }}>
            <h4>الأداء</h4>
            <p>متوسط زمن الاستجابة: {metrics.responseTime.toFixed(0)}ms</p>
            <p>معدل الأخطاء: 0.5%</p>
          </div>
          <div style={{ padding: '1rem', border: '1px solid #ddd', borderRadius: '8px' }}>
            <h4>الاستخدام</h4>
            <p>المستخدمون النشطون: 45</p>
            <p>الجلسات اليومية: 120</p>
          </div>
          <div style={{ padding: '1rem', border: '1px solid #ddd', borderRadius: '8px' }}>
            <h4>النسخ الاحتياطية</h4>
            <p>آخر نسخة: منذ ساعتين</p>
            <p>معدل النجاح: 98%</p>
          </div>
        </div>
      </div>

      {/* أزرار التحكم */}
      <div style={{ marginTop: '2rem', display: 'flex', gap: '1rem', flexWrap: 'wrap' }}>
        <button 
          className={styles.loginButton}
          onClick={loadMonitoringData}
        >
          🔄 تحديث البيانات
        </button>
        <button 
          className={styles.loginButton}
          style={{ backgroundColor: '#6c757d' }}
        >
          📊 عرض التقارير
        </button>
        <button 
          className={styles.loginButton}
          style={{ backgroundColor: '#17a2b8' }}
        >
          ⚙️ إعدادات المراقبة
        </button>
        <button 
          className={styles.loginButton}
          style={{ backgroundColor: '#28a745' }}
        >
          💾 إنشاء نسخة احتياطية
        </button>
        <button 
          className={styles.loginButton}
          style={{ backgroundColor: '#ffc107', color: '#000' }}
        >
          🔍 تحليل الأخطاء
        </button>
      </div>
    </div>
  );
}