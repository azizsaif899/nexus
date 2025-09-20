import { useState, useEffect } from 'react';
import styles from './app.module.css';

interface TestStats {
  totalTests: number;
  passedTests: number;
  failedTests: number;
  coverage: number;
}

interface TestSuite {
  name: string;
  status: 'passed' | 'failed' | 'running';
  tests: number;
  duration: number;
  coverage: number;
}

export function TestingDashboard() {
  const [stats, setStats] = useState<TestStats>({
    totalTests: 0,
    passedTests: 0,
    failedTests: 0,
    coverage: 0
  });
  const [suites, setSuites] = useState<TestSuite[]>([]);
  const [isRunning, setIsRunning] = useState(false);

  useEffect(() => {
    loadTestData();
  }, []);

  const loadTestData = async () => {
    try {
      setStats({
        totalTests: 247,
        passedTests: 235,
        failedTests: 12,
        coverage: 92.5
      });

      setSuites([
        { name: 'Core Logic Tests', status: 'passed', tests: 45, duration: 1250, coverage: 95.2 },
        { name: 'API Integration Tests', status: 'passed', tests: 67, duration: 3400, coverage: 89.8 },
        { name: 'WhatsApp Core Tests', status: 'failed', tests: 23, duration: 890, coverage: 87.1 },
        { name: 'Security Tests', status: 'passed', tests: 34, duration: 2100, coverage: 94.5 },
        { name: 'AI Engine Tests', status: 'passed', tests: 56, duration: 4200, coverage: 91.3 },
        { name: 'E2E Tests', status: 'passed', tests: 22, duration: 15600, coverage: 85.0 }
      ]);
    } catch (error) {
      console.error('Error loading test data:', error);
    }
  };

  const runAllTests = async () => {
    setIsRunning(true);
    
    // Simulate test execution
    /* PERFORMANCE: Cache array length */ /* PERFORMANCE: Cache array length */ for (let i = 0, len = suites.length; i < len; i++) {
      setSuites(prev => prev.map((suite, index) => 
        index === i ? { ...suite, status: 'running' as const } : suite
      ));
      
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      setSuites(prev => prev.map((suite, index) => 
        index === i ? { ...suite, status: Math.random() > 0.1 ? 'passed' as const : 'failed' as const } : suite
      ));
    }
    
    setIsRunning(false);
    loadTestData();
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'passed': return '#28a745';
      case 'failed': return '#dc3545';
      case 'running': return '#ffc107';
      default: return '#6c757d';
    }
  };

  const getCoverageColor = (coverage: number) => {
    if (coverage >= 90) return '#28a745';
    if (coverage >= 80) return '#ffc107';
    return '#dc3545';
  };

  return (
    <div className={styles.section}>
      <h2>🧪 لوحة الاختبارات</h2>
      
      {/* إحصائيات الاختبارات */}
      <div className={styles.statsGrid}>
        <div className={styles.statCard}>
          <h3>إجمالي الاختبارات</h3>
          <div className={styles.statValue} style={{ color: '#17a2b8' }}>
            {stats.totalTests}
          </div>
          <div style={{ fontSize: '0.8rem', color: '#666' }}>
            اختبار مسجل
          </div>
        </div>

        <div className={styles.statCard}>
          <h3>الاختبارات الناجحة</h3>
          <div className={styles.statValue} style={{ color: '#28a745' }}>
            {stats.passedTests}
          </div>
          <div style={{ fontSize: '0.8rem', color: '#666' }}>
            {stats.totalTests > 0 ? Math.round((stats.passedTests / stats.totalTests) * 100) : 0}% نجح
          </div>
        </div>

        <div className={styles.statCard}>
          <h3>الاختبارات الفاشلة</h3>
          <div className={styles.statValue} style={{ color: '#dc3545' }}>
            {stats.failedTests}
          </div>
          <div style={{ fontSize: '0.8rem', color: '#666' }}>
            يحتاج إصلاح
          </div>
        </div>

        <div className={styles.statCard}>
          <h3>تغطية الكود</h3>
          <div className={styles.statValue} style={{ color: getCoverageColor(stats.coverage) }}>
            {stats.coverage}%
          </div>
          <div style={{ fontSize: '0.8rem', color: '#666' }}>
            من الكود مغطى
          </div>
        </div>
      </div>

      {/* مجموعات الاختبارات */}
      <div style={{ marginTop: '2rem' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
          <h3>📋 مجموعات الاختبارات</h3>
          <button 
            className={styles.loginButton}
            onClick={runAllTests}
            disabled={isRunning}
            style={{ backgroundColor: isRunning ? '#6c757d' : '#28a745' }}
          >
            {isRunning ? '🔄 جاري التشغيل...' : '▶️ تشغيل جميع الاختبارات'}
          </button>
        </div>
        
        <div style={{ 
          border: '1px solid #ddd', 
          borderRadius: '8px', 
          overflow: 'hidden'
        }}>
          {suites.map((suite, index) => (
            <div 
              key={index} 
              style={{
                padding: '1rem',
                borderBottom: index < suites.length - 1 ? '1px solid #eee' : 'none',
                backgroundColor: '#f8f9fa'
              }}
            >
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <div>
                  <h4 style={{ margin: '0 0 0.5rem 0', display: 'flex', alignItems: 'center' }}>
                    {suite.name}
                    <span style={{
                      marginLeft: '1rem',
                      padding: '0.25rem 0.75rem',
                      borderRadius: '20px',
                      fontSize: '0.8rem',
                      backgroundColor: getStatusColor(suite.status),
                      color: 'white'
                    }}>
                      {suite.status === 'passed' ? '✅ نجح' : 
                       suite.status === 'failed' ? '❌ فشل' : 
                       '🔄 يعمل'}
                    </span>
                  </h4>
                  <div style={{ fontSize: '0.9rem', color: '#666' }}>
                    <span><strong>الاختبارات:</strong> {suite.tests}</span>
                    <span style={{ marginLeft: '1rem' }}><strong>المدة:</strong> {suite.duration}ms</span>
                  </div>
                </div>
                <div style={{ textAlign: 'right' }}>
                  <div style={{ fontSize: '1.2rem', fontWeight: 'bold', color: getCoverageColor(suite.coverage) }}>
                    {suite.coverage}%
                  </div>
                  <div style={{ fontSize: '0.8rem', color: '#666' }}>
                    تغطية
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* أنواع الاختبارات */}
      <div style={{ marginTop: '2rem' }}>
        <h3>🔬 أنواع الاختبارات</h3>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1rem' }}>
          {[
            { name: 'اختبارات الوحدة', icon: '🧩', count: 156, status: 'active' },
            { name: 'اختبارات التكامل', icon: '🔗', count: 67, status: 'active' },
            { name: 'اختبارات E2E', icon: '🎭', count: 22, status: 'active' },
            { name: 'اختبارات الأداء', icon: '⚡', count: 12, status: 'active' },
            { name: 'اختبارات الأمان', icon: '🛡️', count: 34, status: 'active' },
            { name: 'اختبارات البصرية', icon: '👁️', count: 8, status: 'pending' }
          ].map((testType, index) => (
            <div 
              key={index}
              style={{
                padding: '1rem',
                border: '1px solid #ddd',
                borderRadius: '8px',
                backgroundColor: '#f8f9fa',
                textAlign: 'center'
              }}
            >
              <div style={{ fontSize: '2rem', marginBottom: '0.5rem' }}>
                {testType.icon}
              </div>
              <div style={{ fontWeight: 'bold', marginBottom: '0.25rem' }}>
                {testType.name}
              </div>
              <div style={{ fontSize: '1.5rem', fontWeight: 'bold', color: '#17a2b8', marginBottom: '0.25rem' }}>
                {testType.count}
              </div>
              <div style={{
                padding: '0.25rem 0.5rem',
                borderRadius: '12px',
                fontSize: '0.8rem',
                backgroundColor: testType.status === 'active' ? '#28a745' : '#ffc107',
                color: 'white'
              }}>
                {testType.status === 'active' ? 'نشط' : 'معلق'}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* تقرير التغطية */}
      <div style={{ marginTop: '2rem' }}>
        <h3>📊 تفاصيل التغطية</h3>
        <div style={{ 
          border: '1px solid #ddd', 
          borderRadius: '8px', 
          padding: '1rem',
          backgroundColor: '#f8f9fa'
        }}>
          {[
            { name: 'العبارات (Statements)', value: 94.2, target: 90 },
            { name: 'الفروع (Branches)', value: 87.8, target: 85 },
            { name: 'الوظائف (Functions)', value: 96.1, target: 90 },
            { name: 'الأسطر (Lines)', value: 93.5, target: 90 }
          ].map((metric, index) => (
            <div key={index} style={{ marginBottom: '1rem' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.25rem' }}>
                <span>{metric.name}</span>
                <span style={{ 
                  fontWeight: 'bold',
                  color: metric.value >= metric.target ? '#28a745' : '#dc3545'
                }}>
                  {metric.value}%
                </span>
              </div>
              <div style={{ 
                width: '100%', 
                height: '8px', 
                backgroundColor: '#e9ecef', 
                borderRadius: '4px',
                overflow: 'hidden'
              }}>
                <div style={{
                  width: `${metric.value}%`,
                  height: '100%',
                  backgroundColor: metric.value >= metric.target ? '#28a745' : '#dc3545',
                  transition: 'width 0.3s ease'
                }} />
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* أزرار التحكم */}
      <div style={{ marginTop: '2rem', display: 'flex', gap: '1rem', flexWrap: 'wrap' }}>
        <button 
          className={styles.loginButton}
          onClick={loadTestData}
        >
          🔄 تحديث البيانات
        </button>
        <button 
          className={styles.loginButton}
          style={{ backgroundColor: '#17a2b8' }}
        >
          📊 تقرير مفصل
        </button>
        <button 
          className={styles.loginButton}
          style={{ backgroundColor: '#6c757d' }}
        >
          ⚙️ إعدادات الاختبارات
        </button>
        <button 
          className={styles.loginButton}
          style={{ backgroundColor: '#fd7e14' }}
        >
          🎯 اختبارات مخصصة
        </button>
        <button 
          className={styles.loginButton}
          style={{ backgroundColor: '#e83e8c' }}
        >
          📈 تحليل الاتجاهات
        </button>
      </div>
    </div>
  );
}