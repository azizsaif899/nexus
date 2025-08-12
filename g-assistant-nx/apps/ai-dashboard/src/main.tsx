import React from 'react';
import ReactDOM from 'react-dom/client';
import './styles.css';

interface AIModel {
  id: string;
  name: string;
  type: string;
  accuracy: number;
  status: 'training' | 'ready' | 'deployed';
  lastTrained: Date;
}

interface AIMetrics {
  totalModels: number;
  activeModels: number;
  averageAccuracy: number;
  totalPredictions: number;
}

function AIDashboard() {
  const [metrics, setMetrics] = React.useState<AIMetrics>({
    totalModels: 8,
    activeModels: 6,
    averageAccuracy: 87.5,
    totalPredictions: 15420
  });

  const [models, setModels] = React.useState<AIModel[]>([
    { id: '1', name: 'Sentiment Analyzer', type: 'NLP', accuracy: 89.2, status: 'ready', lastTrained: new Date() },
    { id: '2', name: 'Recommendation Engine', type: 'ML', accuracy: 82.7, status: 'deployed', lastTrained: new Date() },
    { id: '3', name: 'Computer Vision', type: 'CV', accuracy: 91.3, status: 'ready', lastTrained: new Date() },
    { id: '4', name: 'Neural Network', type: 'DL', accuracy: 85.9, status: 'training', lastTrained: new Date() }
  ]);

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'ready': return '#28a745';
      case 'training': return '#ffc107';
      case 'deployed': return '#17a2b8';
      default: return '#6c757d';
    }
  };

  return (
    <div style={{ padding: '2rem', fontFamily: 'Arial, sans-serif' }}>
      <h1 style={{ textAlign: 'center', color: '#333', marginBottom: '2rem' }}>
        🤖 لوحة تحكم الذكاء الاصطناعي المتقدمة
      </h1>

      {/* Metrics Cards */}
      <div style={{ 
        display: 'grid', 
        gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', 
        gap: '1rem',
        marginBottom: '2rem'
      }}>
        <div style={{ 
          padding: '1.5rem', 
          backgroundColor: '#f8f9fa', 
          borderRadius: '8px',
          border: '1px solid #dee2e6',
          textAlign: 'center'
        }}>
          <h3 style={{ color: '#17a2b8', margin: '0 0 0.5rem 0' }}>إجمالي النماذج</h3>
          <div style={{ fontSize: '2rem', fontWeight: 'bold', color: '#333' }}>
            {metrics.totalModels}
          </div>
        </div>

        <div style={{ 
          padding: '1.5rem', 
          backgroundColor: '#f8f9fa', 
          borderRadius: '8px',
          border: '1px solid #dee2e6',
          textAlign: 'center'
        }}>
          <h3 style={{ color: '#28a745', margin: '0 0 0.5rem 0' }}>النماذج النشطة</h3>
          <div style={{ fontSize: '2rem', fontWeight: 'bold', color: '#333' }}>
            {metrics.activeModels}
          </div>
        </div>

        <div style={{ 
          padding: '1.5rem', 
          backgroundColor: '#f8f9fa', 
          borderRadius: '8px',
          border: '1px solid #dee2e6',
          textAlign: 'center'
        }}>
          <h3 style={{ color: '#fd7e14', margin: '0 0 0.5rem 0' }}>متوسط الدقة</h3>
          <div style={{ fontSize: '2rem', fontWeight: 'bold', color: '#333' }}>
            {metrics.averageAccuracy}%
          </div>
        </div>

        <div style={{ 
          padding: '1.5rem', 
          backgroundColor: '#f8f9fa', 
          borderRadius: '8px',
          border: '1px solid #dee2e6',
          textAlign: 'center'
        }}>
          <h3 style={{ color: '#6f42c1', margin: '0 0 0.5rem 0' }}>إجمالي التنبؤات</h3>
          <div style={{ fontSize: '2rem', fontWeight: 'bold', color: '#333' }}>
            {metrics.totalPredictions.toLocaleString()}
          </div>
        </div>
      </div>

      {/* Models Table */}
      <div style={{ marginBottom: '2rem' }}>
        <h2 style={{ color: '#333', marginBottom: '1rem' }}>🧠 النماذج المتاحة</h2>
        <div style={{ 
          border: '1px solid #dee2e6', 
          borderRadius: '8px', 
          overflow: 'hidden',
          backgroundColor: 'white'
        }}>
          <table style={{ width: '100%', borderCollapse: 'collapse' }}>
            <thead style={{ backgroundColor: '#f8f9fa' }}>
              <tr>
                <th style={{ padding: '1rem', textAlign: 'right', borderBottom: '1px solid #dee2e6' }}>اسم النموذج</th>
                <th style={{ padding: '1rem', textAlign: 'center', borderBottom: '1px solid #dee2e6' }}>النوع</th>
                <th style={{ padding: '1rem', textAlign: 'center', borderBottom: '1px solid #dee2e6' }}>الدقة</th>
                <th style={{ padding: '1rem', textAlign: 'center', borderBottom: '1px solid #dee2e6' }}>الحالة</th>
                <th style={{ padding: '1rem', textAlign: 'center', borderBottom: '1px solid #dee2e6' }}>آخر تدريب</th>
              </tr>
            </thead>
            <tbody>
              {models.map(model => (
                <tr key={model.id}>
                  <td style={{ padding: '1rem', borderBottom: '1px solid #dee2e6' }}>
                    {model.name}
                  </td>
                  <td style={{ padding: '1rem', textAlign: 'center', borderBottom: '1px solid #dee2e6' }}>
                    <span style={{
                      padding: '0.25rem 0.75rem',
                      borderRadius: '12px',
                      fontSize: '0.8rem',
                      backgroundColor: '#e9ecef',
                      color: '#495057'
                    }}>
                      {model.type}
                    </span>
                  </td>
                  <td style={{ padding: '1rem', textAlign: 'center', borderBottom: '1px solid #dee2e6' }}>
                    <span style={{ 
                      color: model.accuracy >= 90 ? '#28a745' : model.accuracy >= 80 ? '#ffc107' : '#dc3545',
                      fontWeight: 'bold'
                    }}>
                      {model.accuracy}%
                    </span>
                  </td>
                  <td style={{ padding: '1rem', textAlign: 'center', borderBottom: '1px solid #dee2e6' }}>
                    <span style={{
                      padding: '0.25rem 0.75rem',
                      borderRadius: '12px',
                      fontSize: '0.8rem',
                      backgroundColor: getStatusColor(model.status),
                      color: 'white'
                    }}>
                      {model.status === 'ready' ? 'جاهز' : 
                       model.status === 'training' ? 'يتدرب' : 'منشور'}
                    </span>
                  </td>
                  <td style={{ padding: '1rem', textAlign: 'center', borderBottom: '1px solid #dee2e6' }}>
                    {model.lastTrained.toLocaleDateString('ar-SA')}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Action Buttons */}
      <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap', justifyContent: 'center' }}>
        <button style={{
          padding: '0.75rem 1.5rem',
          backgroundColor: '#007bff',
          color: 'white',
          border: 'none',
          borderRadius: '6px',
          cursor: 'pointer',
          fontSize: '1rem'
        }}>
          🚀 تدريب نموذج جديد
        </button>
        <button style={{
          padding: '0.75rem 1.5rem',
          backgroundColor: '#28a745',
          color: 'white',
          border: 'none',
          borderRadius: '6px',
          cursor: 'pointer',
          fontSize: '1rem'
        }}>
          📊 تقرير الأداء
        </button>
        <button style={{
          padding: '0.75rem 1.5rem',
          backgroundColor: '#17a2b8',
          color: 'white',
          border: 'none',
          borderRadius: '6px',
          cursor: 'pointer',
          fontSize: '1rem'
        }}>
          ⚙️ إعدادات النماذج
        </button>
      </div>
    </div>
  );
}

const root = ReactDOM.createRoot(document.getElementById('root') as HTMLElement);
root.render(<AIDashboard />);