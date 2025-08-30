import { useState, useEffect } from 'react';
import styles from './app.module.css';

interface AIStats {
  totalModels: number;
  readyModels: number;
  trainingModels: number;
  averageAccuracy: number;
}

interface ModelInfo {
  id: string;
  name: string;
  type: string;
  accuracy: number;
  status: 'ready' | 'training' | 'deployed';
}

export function AIDashboard() {
  const [stats, setStats] = useState<AIStats>({
    totalModels: 0,
    readyModels: 0,
    trainingModels: 0,
    averageAccuracy: 0
  });
  const [models, setModels] = useState<ModelInfo[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    loadAIData();
    const interval = setInterval(loadAIData, 30000);
    return () => clearInterval(interval);
  }, []);

  const loadAIData = async () => {
    try {
      setStats({
        totalModels: 8,
        readyModels: 6,
        trainingModels: 1,
        averageAccuracy: 87
      });

      setModels([
        { id: '1', name: 'Sentiment Analysis', type: 'NLP', accuracy: 89, status: 'ready' },
        { id: '2', name: 'User Behavior Predictor', type: 'Recommendation', accuracy: 82, status: 'ready' },
        { id: '3', name: 'System Load Predictor', type: 'Regression', accuracy: 91, status: 'ready' },
        { id: '4', name: 'Image Classifier', type: 'Computer Vision', accuracy: 85, status: 'training' },
        { id: '5', name: 'Text Generator', type: 'NLP', accuracy: 88, status: 'ready' }
      ]);
    } catch (error) {
      console.error('Error loading AI data:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'ready': return '#28a745';
      case 'training': return '#ffc107';
      case 'deployed': return '#17a2b8';
      default: return '#6c757d';
    }
  };

  const getAccuracyColor = (accuracy: number) => {
    if (accuracy >= 90) return '#28a745';
    if (accuracy >= 80) return '#ffc107';
    return '#dc3545';
  };

  if (isLoading) {
    return (
      <div className={styles.section}>
        <h2>🤖 لوحة الذكاء الاصطناعي</h2>
        <p>جاري تحميل بيانات الذكاء الاصطناعي...</p>
      </div>
    );
  }

  return (
    <div className={styles.section}>
      <h2>🤖 لوحة الذكاء الاصطناعي المتقدمة</h2>
      
      {/* إحصائيات النماذج */}
      <div className={styles.statsGrid}>
        <div className={styles.statCard}>
          <h3>إجمالي النماذج</h3>
          <div className={styles.statValue} style={{ color: '#17a2b8' }}>
            {stats.totalModels}
          </div>
          <div style={{ fontSize: '0.8rem', color: '#666' }}>
            نماذج مسجلة
          </div>
        </div>

        <div className={styles.statCard}>
          <h3>النماذج الجاهزة</h3>
          <div className={styles.statValue} style={{ color: '#28a745' }}>
            {stats.readyModels}
          </div>
          <div style={{ fontSize: '0.8rem', color: '#666' }}>
            جاهزة للاستخدام
          </div>
        </div>

        <div className={styles.statCard}>
          <h3>النماذج قيد التدريب</h3>
          <div className={styles.statValue} style={{ color: '#ffc107' }}>
            {stats.trainingModels}
          </div>
          <div style={{ fontSize: '0.8rem', color: '#666' }}>
            يتم تدريبها حالياً
          </div>
        </div>

        <div className={styles.statCard}>
          <h3>متوسط الدقة</h3>
          <div className={styles.statValue} style={{ color: getAccuracyColor(stats.averageAccuracy) }}>
            {stats.averageAccuracy}%
          </div>
          <div style={{ fontSize: '0.8rem', color: '#666' }}>
            جميع النماذج
          </div>
        </div>
      </div>

      {/* قائمة النماذج */}
      <div style={{ marginTop: '2rem' }}>
        <h3>🧠 النماذج المتاحة</h3>
        <div style={{ 
          border: '1px solid #ddd', 
          borderRadius: '8px', 
          padding: '1rem',
          maxHeight: '400px',
          overflowY: 'auto'
        }}>
          {models.map(model => (
            <div 
              key={model.id} 
              style={{
                padding: '1rem',
                margin: '0.5rem 0',
                backgroundColor: '#f8f9fa',
                borderRadius: '8px',
                border: '1px solid #e9ecef'
              }}
            >
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <div>
                  <h4 style={{ margin: '0 0 0.5rem 0' }}>{model.name}</h4>
                  <div style={{ fontSize: '0.9rem', color: '#666' }}>
                    <strong>النوع:</strong> {model.type}
                  </div>
                </div>
                <div style={{ textAlign: 'right' }}>
                  <div style={{
                    padding: '0.25rem 0.75rem',
                    borderRadius: '20px',
                    fontSize: '0.8rem',
                    backgroundColor: getStatusColor(model.status),
                    color: 'white',
                    marginBottom: '0.5rem'
                  }}>
                    {model.status === 'ready' ? 'جاهز' : 
                     model.status === 'training' ? 'يتدرب' : 'منشور'}
                  </div>
                  <div style={{ fontSize: '0.9rem' }}>
                    <strong>الدقة:</strong> 
                    <span style={{ color: getAccuracyColor(model.accuracy), marginLeft: '0.5rem' }}>
                      {model.accuracy}%
                    </span>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* قدرات الذكاء الاصطناعي */}
      <div style={{ marginTop: '2rem' }}>
        <h3>⚡ القدرات المتاحة</h3>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1rem' }}>
          {[
            { name: 'معالجة اللغة الطبيعية', icon: '💬', status: 'active' },
            { name: 'التحليل التنبؤي', icon: '📈', status: 'active' },
            { name: 'الرؤية الحاسوبية', icon: '👁️', status: 'active' },
            { name: 'التعلم التكيفي', icon: '🧠', status: 'active' },
            { name: 'الأتمتة الذكية', icon: '🤖', status: 'active' },
            { name: 'نظام التوصيات', icon: '🎯', status: 'active' }
          ].map((capability, index) => (
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
                {capability.icon}
              </div>
              <div style={{ fontWeight: 'bold', marginBottom: '0.25rem' }}>
                {capability.name}
              </div>
              <div style={{
                padding: '0.25rem 0.5rem',
                borderRadius: '12px',
                fontSize: '0.8rem',
                backgroundColor: '#28a745',
                color: 'white'
              }}>
                نشط
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* أزرار التحكم */}
      <div style={{ marginTop: '2rem', display: 'flex', gap: '1rem', flexWrap: 'wrap' }}>
        <button 
          className={styles.loginButton}
          onClick={loadAIData}
        >
          🔄 تحديث البيانات
        </button>
        <button 
          className={styles.loginButton}
          style={{ backgroundColor: '#28a745' }}
        >
          🚀 تدريب نموذج جديد
        </button>
        <button 
          className={styles.loginButton}
          style={{ backgroundColor: '#17a2b8' }}
        >
          📊 تقرير الأداء
        </button>
        <button 
          className={styles.loginButton}
          style={{ backgroundColor: '#6c757d' }}
        >
          ⚙️ إعدادات النماذج
        </button>
        <button 
          className={styles.loginButton}
          style={{ backgroundColor: '#fd7e14' }}
        >
          🧪 اختبار النماذج
        </button>
      </div>
    </div>
  );
}