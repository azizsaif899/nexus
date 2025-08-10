import { useState, useEffect } from 'react';
import styles from './app.module.css';

interface SecurityStats {
  totalThreats: number;
  blockedIPs: number;
  averageCompliance: number;
  criticalFindings: number;
}

interface ThreatEvent {
  id: string;
  type: string;
  severity: 'low' | 'medium' | 'high' | 'critical';
  source: string;
  timestamp: string;
  blocked: boolean;
}

interface ComplianceStandard {
  id: string;
  name: string;
  compliance: number;
  status: 'good' | 'needs_attention' | 'critical';
}

export function SecurityDashboard() {
  const [stats, setStats] = useState<SecurityStats>({
    totalThreats: 0,
    blockedIPs: 0,
    averageCompliance: 0,
    criticalFindings: 0
  });
  const [threats, setThreats] = useState<ThreatEvent[]>([]);
  const [compliance, setCompliance] = useState<ComplianceStandard[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    loadSecurityData();
    const interval = setInterval(loadSecurityData, 60000); // Update every minute
    return () => clearInterval(interval);
  }, []);

  const loadSecurityData = async () => {
    try {
      // محاكاة البيانات الأمنية
      setStats({
        totalThreats: Math.floor(Math.random() * 50) + 10,
        blockedIPs: Math.floor(Math.random() * 20) + 5,
        averageCompliance: Math.floor(Math.random() * 30) + 70,
        criticalFindings: Math.floor(Math.random() * 5)
      });

      setThreats([
        {
          id: '1',
          type: 'SQL Injection',
          severity: 'high',
          source: '192.168.1.100',
          timestamp: new Date().toISOString(),
          blocked: true
        },
        {
          id: '2',
          type: 'Brute Force',
          severity: 'medium',
          source: '10.0.0.50',
          timestamp: new Date(Date.now() - 3600000).toISOString(),
          blocked: true
        },
        {
          id: '3',
          type: 'XSS Attempt',
          severity: 'high',
          source: '172.16.0.25',
          timestamp: new Date(Date.now() - 7200000).toISOString(),
          blocked: true
        }
      ]);

      setCompliance([
        { id: 'gdpr', name: 'GDPR', compliance: 85, status: 'good' },
        { id: 'iso27001', name: 'ISO 27001', compliance: 72, status: 'needs_attention' },
        { id: 'owasp', name: 'OWASP Top 10', compliance: 90, status: 'good' }
      ]);
    } catch (error) {
      console.error('Error loading security data:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case 'critical': return '#dc3545';
      case 'high': return '#fd7e14';
      case 'medium': return '#ffc107';
      default: return '#17a2b8';
    }
  };

  const getComplianceColor = (status: string) => {
    switch (status) {
      case 'good': return '#28a745';
      case 'needs_attention': return '#ffc107';
      case 'critical': return '#dc3545';
      default: return '#6c757d';
    }
  };

  if (isLoading) {
    return (
      <div className={styles.section}>
        <h2>🛡️ لوحة الأمان</h2>
        <p>جاري تحميل البيانات الأمنية...</p>
      </div>
    );
  }

  return (
    <div className={styles.section}>
      <h2>🛡️ لوحة الأمان المتقدمة</h2>
      
      {/* إحصائيات الأمان */}
      <div className={styles.statsGrid}>
        <div className={styles.statCard}>
          <h3>إجمالي التهديدات</h3>
          <div className={styles.statValue} style={{ color: '#dc3545' }}>
            {stats.totalThreats}
          </div>
          <div style={{ fontSize: '0.8rem', color: '#666' }}>
            آخر 24 ساعة
          </div>
        </div>

        <div className={styles.statCard}>
          <h3>عناوين IP محجوبة</h3>
          <div className={styles.statValue} style={{ color: '#fd7e14' }}>
            {stats.blockedIPs}
          </div>
          <div style={{ fontSize: '0.8rem', color: '#666' }}>
            نشطة حالياً
          </div>
        </div>

        <div className={styles.statCard}>
          <h3>متوسط الامتثال</h3>
          <div className={styles.statValue} style={{ color: '#28a745' }}>
            {stats.averageCompliance}%
          </div>
          <div style={{ fontSize: '0.8rem', color: '#666' }}>
            جميع المعايير
          </div>
        </div>

        <div className={styles.statCard}>
          <h3>النتائج الحرجة</h3>
          <div className={styles.statValue} style={{ color: stats.criticalFindings > 0 ? '#dc3545' : '#28a745' }}>
            {stats.criticalFindings}
          </div>
          <div style={{ fontSize: '0.8rem', color: '#666' }}>
            تحتاج إجراء فوري
          </div>
        </div>
      </div>

      {/* التهديدات الأخيرة */}
      <div style={{ marginTop: '2rem' }}>
        <h3>🚨 التهديدات الأخيرة</h3>
        <div style={{ 
          border: '1px solid #ddd', 
          borderRadius: '8px', 
          padding: '1rem',
          maxHeight: '300px',
          overflowY: 'auto'
        }}>
          {threats.map(threat => (
            <div 
              key={threat.id} 
              style={{
                padding: '0.75rem',
                margin: '0.5rem 0',
                backgroundColor: '#f8f9fa',
                borderRadius: '4px',
                borderLeft: `4px solid ${getSeverityColor(threat.severity)}`
              }}
            >
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <div>
                  <strong>{threat.type}</strong>
                  <span style={{ 
                    marginLeft: '1rem',
                    padding: '0.25rem 0.5rem',
                    borderRadius: '4px',
                    fontSize: '0.8rem',
                    backgroundColor: getSeverityColor(threat.severity),
                    color: 'white'
                  }}>
                    {threat.severity.toUpperCase()}
                  </span>
                </div>
                <span style={{ 
                  padding: '0.25rem 0.5rem',
                  borderRadius: '4px',
                  fontSize: '0.8rem',
                  backgroundColor: threat.blocked ? '#28a745' : '#dc3545',
                  color: 'white'
                }}>
                  {threat.blocked ? 'محجوب' : 'مسموح'}
                </span>
              </div>
              <div style={{ marginTop: '0.5rem', fontSize: '0.9rem' }}>
                <strong>المصدر:</strong> {threat.source}
              </div>
              <div style={{ fontSize: '0.8rem', color: '#666' }}>
                {new Date(threat.timestamp).toLocaleString('ar-SA')}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* حالة الامتثال */}
      <div style={{ marginTop: '2rem' }}>
        <h3>📋 حالة الامتثال</h3>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '1rem' }}>
          {compliance.map(standard => (
            <div 
              key={standard.id}
              style={{
                padding: '1rem',
                border: '1px solid #ddd',
                borderRadius: '8px',
                backgroundColor: '#f8f9fa'
              }}
            >
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <h4>{standard.name}</h4>
                <span style={{
                  padding: '0.25rem 0.5rem',
                  borderRadius: '4px',
                  fontSize: '0.8rem',
                  backgroundColor: getComplianceColor(standard.status),
                  color: 'white'
                }}>
                  {standard.status === 'good' ? 'جيد' : 
                   standard.status === 'needs_attention' ? 'يحتاج انتباه' : 'حرج'}
                </span>
              </div>
              <div style={{ marginTop: '0.5rem' }}>
                <div style={{ 
                  width: '100%', 
                  height: '8px', 
                  backgroundColor: '#e9ecef', 
                  borderRadius: '4px',
                  overflow: 'hidden'
                }}>
                  <div style={{
                    width: `${standard.compliance}%`,
                    height: '100%',
                    backgroundColor: getComplianceColor(standard.status),
                    transition: 'width 0.3s ease'
                  }} />
                </div>
                <div style={{ marginTop: '0.25rem', fontSize: '0.9rem', textAlign: 'center' }}>
                  {standard.compliance}% مكتمل
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* أزرار التحكم */}
      <div style={{ marginTop: '2rem', display: 'flex', gap: '1rem', flexWrap: 'wrap' }}>
        <button 
          className={styles.loginButton}
          onClick={loadSecurityData}
        >
          🔄 تحديث البيانات
        </button>
        <button 
          className={styles.loginButton}
          style={{ backgroundColor: '#dc3545' }}
        >
          🚫 حجب IP
        </button>
        <button 
          className={styles.loginButton}
          style={{ backgroundColor: '#28a745' }}
        >
          ✅ إلغاء حجب IP
        </button>
        <button 
          className={styles.loginButton}
          style={{ backgroundColor: '#17a2b8' }}
        >
          📊 تقرير الامتثال
        </button>
        <button 
          className={styles.loginButton}
          style={{ backgroundColor: '#6c757d' }}
        >
          🔍 فحص أمني
        </button>
      </div>
    </div>
  );
}