import React, { useState, useEffect } from 'react';
import { GeminiClient } from '@azizsys/core-logic';

interface SystemMetrics {
  totalUsers: number;
  activeUsers: number;
  totalQueries: number;
  avgResponseTime: number;
  errorRate: number;
  topQueries: string[];
  userSatisfaction: number;
}

interface AIInsight {
  id: string;
  type: 'performance' | 'usage' | 'optimization' | 'prediction';
  title: string;
  description: string;
  impact: 'high' | 'medium' | 'low';
  recommendation: string;
  confidence: number;
  timestamp: Date;
}

export const AIInsights: React.FC = () => {
  const [insights, setInsights] = useState<AIInsight[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [metrics, setMetrics] = useState<SystemMetrics | null>(null);
  const [selectedInsight, setSelectedInsight] = useState<AIInsight | null>(null);

  const geminiClient = new GeminiClient({
    apiKey: process.env.REACT_APP_GEMINI_API_KEY || ''
  });

  useEffect(() => {
    loadSystemMetrics();
    generateInsights();
  }, []);

  const loadSystemMetrics = async () => {
    try {
      // In real implementation, this would fetch from API
      const mockMetrics: SystemMetrics = {
        totalUsers: 1250,
        activeUsers: 340,
        totalQueries: 15680,
        avgResponseTime: 1.2,
        errorRate: 0.03,
        topQueries: [
          'كيف يمكنني تحسين الأداء؟',
          'ما هي أفضل الممارسات؟',
          'شرح الميزة الجديدة',
          'حل مشكلة تقنية',
          'تحليل البيانات'
        ],
        userSatisfaction: 4.2
      };
      setMetrics(mockMetrics);
    } catch (error) {
      console.error('Failed to load metrics:', error);
    }
  };

  const generateInsights = async () => {
    setIsLoading(true);
    try {
      const insights = await Promise.all([
        generatePerformanceInsight(),
        generateUsageInsight(),
        generateOptimizationInsight(),
        generatePredictionInsight()
      ]);
      
      setInsights(insights.filter(Boolean));
    } catch (error) {
      console.error('Failed to generate insights:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const generatePerformanceInsight = async (): Promise<AIInsight> => {
    const prompt = `بناءً على البيانات التالية، قدم تحليلاً لأداء النظام:
- متوسط وقت الاستجابة: 1.2 ثانية
- معدل الأخطاء: 3%
- المستخدمون النشطون: 340 من أصل 1250

قدم تحليلاً مختصراً ومفيداً مع توصية للتحسين.`;

    const response = await geminiClient.generateResponse(prompt);
    
    return {
      id: 'perf-001',
      type: 'performance',
      title: 'تحليل أداء النظام',
      description: response.text.substring(0, 200) + '...',
      impact: 'high',
      recommendation: 'تحسين خوارزميات المعالجة وتحسين قاعدة البيانات',
      confidence: 0.85,
      timestamp: new Date()
    };
  };

  const generateUsageInsight = async (): Promise<AIInsight> => {
    const prompt = `حلل أنماط استخدام النظام:
- إجمالي الاستعلامات: 15,680
- أكثر الاستعلامات: تحسين الأداء، أفضل الممارسات، الميزات الجديدة
- رضا المستخدمين: 4.2/5

ما هي الاتجاهات والفرص؟`;

    const response = await geminiClient.generateResponse(prompt);
    
    return {
      id: 'usage-001',
      type: 'usage',
      title: 'تحليل أنماط الاستخدام',
      description: response.text.substring(0, 200) + '...',
      impact: 'medium',
      recommendation: 'تطوير محتوى تعليمي للاستعلامات الشائعة',
      confidence: 0.78,
      timestamp: new Date()
    };
  };

  const generateOptimizationInsight = async (): Promise<AIInsight> => {
    return {
      id: 'opt-001',
      type: 'optimization',
      title: 'فرص التحسين المكتشفة',
      description: 'تم اكتشاف إمكانية تحسين كفاءة النظام بنسبة 25% من خلال تحسين خوارزميات التخزين المؤقت',
      impact: 'high',
      recommendation: 'تطبيق نظام تخزين مؤقت ذكي للاستعلامات المتكررة',
      confidence: 0.92,
      timestamp: new Date()
    };
  };

  const generatePredictionInsight = async (): Promise<AIInsight> => {
    return {
      id: 'pred-001',
      type: 'prediction',
      title: 'توقعات النمو',
      description: 'بناءً على الاتجاهات الحالية، متوقع زيادة 40% في عدد المستخدمين خلال الشهر القادم',
      impact: 'medium',
      recommendation: 'التحضير لزيادة السعة والموارد',
      confidence: 0.73,
      timestamp: new Date()
    };
  };

  const getInsightIcon = (type: string) => {
    const icons = {
      performance: '⚡',
      usage: '📊',
      optimization: '🔧',
      prediction: '🔮'
    };
    return icons[type] || '💡';
  };

  const getImpactColor = (impact: string) => {
    const colors = {
      high: '#ff4757',
      medium: '#ffa502',
      low: '#2ed573'
    };
    return colors[impact] || '#747d8c';
  };

  if (isLoading) {
    return (
      <div className="ai-insights-loading">
        <div className="spinner"></div>
        <p>جاري تحليل البيانات بالذكاء الاصطناعي...</p>
      </div>
    );
  }

  return (
    <div className="ai-insights-container">
      <div className="insights-header">
        <h2>🤖 رؤى الذكاء الاصطناعي</h2>
        <button onClick={generateInsights} className="refresh-btn">
          🔄 تحديث الرؤى
        </button>
      </div>

      {metrics && (
        <div className="metrics-summary">
          <div className="metric-card">
            <h3>المستخدمون النشطون</h3>
            <div className="metric-value">{metrics.activeUsers}</div>
            <small>من أصل {metrics.totalUsers}</small>
          </div>
          <div className="metric-card">
            <h3>وقت الاستجابة</h3>
            <div className="metric-value">{metrics.avgResponseTime}s</div>
            <small>متوسط</small>
          </div>
          <div className="metric-card">
            <h3>رضا المستخدمين</h3>
            <div className="metric-value">{metrics.userSatisfaction}/5</div>
            <small>تقييم</small>
          </div>
          <div className="metric-card">
            <h3>معدل الأخطاء</h3>
            <div className="metric-value">{(metrics.errorRate * 100).toFixed(1)}%</div>
            <small>من الطلبات</small>
          </div>
        </div>
      )}

      <div className="insights-grid">
        {insights.map((insight) => (
          <div
            key={insight.id}
            className="insight-card"
            onClick={() => setSelectedInsight(insight)}
          >
            <div className="insight-header">
              <span className="insight-icon">{getInsightIcon(insight.type)}</span>
              <div className="insight-meta">
                <h3>{insight.title}</h3>
                <div className="insight-badges">
                  <span 
                    className="impact-badge"
                    style={{ backgroundColor: getImpactColor(insight.impact) }}
                  >
                    {insight.impact}
                  </span>
                  <span className="confidence-badge">
                    {Math.round(insight.confidence * 100)}% ثقة
                  </span>
                </div>
              </div>
            </div>
            <p className="insight-description">{insight.description}</p>
            <div className="insight-recommendation">
              <strong>التوصية:</strong> {insight.recommendation}
            </div>
          </div>
        ))}
      </div>

      {selectedInsight && (
        <div className="insight-modal" onClick={() => setSelectedInsight(null)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h2>{getInsightIcon(selectedInsight.type)} {selectedInsight.title}</h2>
              <button onClick={() => setSelectedInsight(null)}>✕</button>
            </div>
            <div className="modal-body">
              <p><strong>الوصف:</strong> {selectedInsight.description}</p>
              <p><strong>التوصية:</strong> {selectedInsight.recommendation}</p>
              <p><strong>مستوى التأثير:</strong> {selectedInsight.impact}</p>
              <p><strong>مستوى الثقة:</strong> {Math.round(selectedInsight.confidence * 100)}%</p>
            </div>
          </div>
        </div>
      )}

      <style jsx>{`
        .ai-insights-container {
          padding: 20px;
        }

        .insights-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 20px;
        }

        .refresh-btn {
          padding: 8px 16px;
          background: #007bff;
          color: white;
          border: none;
          border-radius: 4px;
          cursor: pointer;
        }

        .metrics-summary {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
          gap: 16px;
          margin-bottom: 30px;
        }

        .metric-card {
          background: white;
          padding: 20px;
          border-radius: 8px;
          box-shadow: 0 2px 4px rgba(0,0,0,0.1);
          text-align: center;
        }

        .metric-value {
          font-size: 2em;
          font-weight: bold;
          color: #007bff;
          margin: 8px 0;
        }

        .insights-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
          gap: 20px;
        }

        .insight-card {
          background: white;
          padding: 20px;
          border-radius: 8px;
          box-shadow: 0 2px 8px rgba(0,0,0,0.1);
          cursor: pointer;
          transition: transform 0.2s;
        }

        .insight-card:hover {
          transform: translateY(-2px);
        }

        .insight-header {
          display: flex;
          align-items: flex-start;
          gap: 12px;
          margin-bottom: 12px;
        }

        .insight-icon {
          font-size: 24px;
        }

        .insight-badges {
          display: flex;
          gap: 8px;
          margin-top: 4px;
        }

        .impact-badge, .confidence-badge {
          padding: 2px 8px;
          border-radius: 12px;
          font-size: 12px;
          color: white;
        }

        .confidence-badge {
          background: #6c757d;
        }

        .insight-description {
          margin: 12px 0;
          color: #666;
        }

        .insight-recommendation {
          font-size: 14px;
          color: #28a745;
        }

        .insight-modal {
          position: fixed;
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
          background: rgba(0,0,0,0.5);
          display: flex;
          align-items: center;
          justify-content: center;
          z-index: 1000;
        }

        .modal-content {
          background: white;
          padding: 24px;
          border-radius: 8px;
          max-width: 500px;
          width: 90%;
        }

        .modal-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 16px;
        }

        .ai-insights-loading {
          text-align: center;
          padding: 40px;
        }

        .spinner {
          width: 40px;
          height: 40px;
          border: 4px solid #f3f3f3;
          border-top: 4px solid #007bff;
          border-radius: 50%;
          animation: spin 1s linear infinite;
          margin: 0 auto 16px;
        }

        @keyframes spin {
          0% { transform: rotate(0deg); }
          100% { transform: rotate(360deg); }
        }
      `}</style>
    </div>
  );
};