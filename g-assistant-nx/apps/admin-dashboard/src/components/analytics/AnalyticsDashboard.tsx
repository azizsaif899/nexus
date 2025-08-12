import React, { useState, useEffect } from 'react';
import { Line, Bar, Doughnut } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  ArcElement,
  Title,
  Tooltip,
  Legend,
} from 'chart.js';

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  ArcElement,
  Title,
  Tooltip,
  Legend
);

interface BusinessKPIs {
  userMetrics: {
    dailyActiveUsers: number;
    monthlyActiveUsers: number;
    userRetentionRate: number;
    userChurnRate: number;
    averageSessionDuration: number;
    userLifetimeValue: number;
  };
  businessMetrics: {
    monthlyRecurringRevenue: number;
    customerAcquisitionCost: number;
    conversionRate: number;
    averageRevenuePerUser: number;
    grossMargin: number;
    netPromoterScore: number;
  };
  technicalMetrics: {
    systemUptime: number;
    averageResponseTime: number;
    errorRate: number;
    throughput: number;
    resourceUtilization: number;
    deploymentFrequency: number;
  };
  aiMetrics: {
    queryAccuracy: number;
    responseTime: number;
    userSatisfaction: number;
    modelPerformance: number;
    apiUsage: number;
    costPerQuery: number;
  };
}

interface AnalyticsInsight {
  id: string;
  type: 'trend' | 'anomaly' | 'prediction' | 'recommendation';
  title: string;
  description: string;
  confidence: number;
  impact: 'low' | 'medium' | 'high' | 'critical';
  actionable: boolean;
  recommendations?: string[];
  data: any;
  generatedAt: Date;
}

export const AnalyticsDashboard: React.FC = () => {
  const [kpis, setKpis] = useState<BusinessKPIs | null>(null);
  const [insights, setInsights] = useState<AnalyticsInsight[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Mock data for demonstration
    const mockKPIs: BusinessKPIs = {
      userMetrics: {
        dailyActiveUsers: 1250,
        monthlyActiveUsers: 15000,
        userRetentionRate: 0.85,
        userChurnRate: 0.15,
        averageSessionDuration: 420,
        userLifetimeValue: 850
      },
      businessMetrics: {
        monthlyRecurringRevenue: 125000,
        customerAcquisitionCost: 45,
        conversionRate: 3.2,
        averageRevenuePerUser: 8.33,
        grossMargin: 0.72,
        netPromoterScore: 42
      },
      technicalMetrics: {
        systemUptime: 99.8,
        averageResponseTime: 245,
        errorRate: 0.8,
        throughput: 1200,
        resourceUtilization: 68,
        deploymentFrequency: 12
      },
      aiMetrics: {
        queryAccuracy: 92.5,
        responseTime: 1.2,
        userSatisfaction: 4.3,
        modelPerformance: 88,
        apiUsage: 25000,
        costPerQuery: 0.008
      }
    };

    const mockInsights: AnalyticsInsight[] = [
      {
        id: '1',
        type: 'trend',
        title: 'نمو قوي في المستخدمين',
        description: 'زيادة 15% في المستخدمين النشطين هذا الشهر',
        confidence: 0.92,
        impact: 'high',
        actionable: true,
        recommendations: ['زيادة الاستثمار في التسويق', 'تحسين البنية التحتية'],
        data: {},
        generatedAt: new Date()
      },
      {
        id: '2',
        type: 'anomaly',
        title: 'انخفاض في معدل التحويل',
        description: 'معدل التحويل انخفض بنسبة 8% الأسبوع الماضي',
        confidence: 0.87,
        impact: 'medium',
        actionable: true,
        recommendations: ['مراجعة صفحة الهبوط', 'تحسين عملية التسجيل'],
        data: {},
        generatedAt: new Date()
      }
    ];

    setTimeout(() => {
      setKpis(mockKPIs);
      setInsights(mockInsights);
      setLoading(false);
    }, 1000);
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (!kpis) return null;

  return (
    <div className="space-y-6 p-6">
      <h1 className="text-3xl font-bold text-gray-900">لوحة التحليلات والذكاء التجاري</h1>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <KPICard
          title="المستخدمون النشطون اليوم"
          value={kpis.userMetrics.dailyActiveUsers.toLocaleString()}
          trend={{ direction: 'up', percentage: 12.5 }}
          icon="👥"
          color="blue"
        />
        <KPICard
          title="الإيرادات الشهرية"
          value={`$${kpis.businessMetrics.monthlyRecurringRevenue.toLocaleString()}`}
          trend={{ direction: 'up', percentage: 8.3 }}
          icon="💰"
          color="green"
        />
        <KPICard
          title="معدل التحويل"
          value={`${kpis.businessMetrics.conversionRate.toFixed(1)}%`}
          trend={{ direction: 'down', percentage: 2.1 }}
          icon="📈"
          color="purple"
        />
        <KPICard
          title="وقت الاستجابة"
          value={`${kpis.technicalMetrics.averageResponseTime}ms`}
          trend={{ direction: 'up', percentage: 5.2 }}
          icon="⚡"
          color="orange"
        />
      </div>

      {/* Charts Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <ChartCard title="نمو المستخدمين">
          <Line
            data={{
              labels: ['يناير', 'فبراير', 'مارس', 'أبريل', 'مايو', 'يونيو'],
              datasets: [{
                label: 'المستخدمون النشطون',
                data: [8000, 9500, 11000, 12500, 14000, 15000],
                borderColor: 'rgb(59, 130, 246)',
                backgroundColor: 'rgba(59, 130, 246, 0.1)',
                tension: 0.4,
              }],
            }}
            options={{
              responsive: true,
              maintainAspectRatio: false,
              plugins: { legend: { position: 'top' as const } },
              scales: { y: { beginAtZero: true } },
            }}
          />
        </ChartCard>
        
        <ChartCard title="توزيع الإيرادات">
          <Doughnut
            data={{
              labels: ['الاشتراكات الشهرية', 'الاشتراكات السنوية', 'المبيعات الفردية'],
              datasets: [{
                data: [75000, 37500, 12500],
                backgroundColor: ['#3B82F6', '#10B981', '#F59E0B'],
              }],
            }}
            options={{
              responsive: true,
              maintainAspectRatio: false,
              plugins: { legend: { position: 'bottom' as const } },
            }}
          />
        </ChartCard>
        
        <ChartCard title="أداء النظام">
          <Bar
            data={{
              labels: ['وقت الاستجابة', 'معدل الأخطاء', 'الإنتاجية', 'وقت التشغيل'],
              datasets: [{
                label: 'الأداء',
                data: [24.5, 0.8, 120, 99.8],
                backgroundColor: ['#EF4444', '#F59E0B', '#10B981', '#3B82F6'],
              }],
            }}
            options={{
              responsive: true,
              maintainAspectRatio: false,
              plugins: { legend: { display: false } },
              scales: { y: { beginAtZero: true } },
            }}
          />
        </ChartCard>
        
        <ChartCard title="استخدام الذكاء الاصطناعي">
          <Line
            data={{
              labels: ['الاستعلامات', 'الدقة', 'الرضا', 'الأداء'],
              datasets: [{
                label: 'مؤشرات الذكاء الاصطناعي',
                data: [250, 92.5, 86, 88],
                borderColor: 'rgb(147, 51, 234)',
                backgroundColor: 'rgba(147, 51, 234, 0.1)',
                tension: 0.4,
              }],
            }}
            options={{
              responsive: true,
              maintainAspectRatio: false,
              plugins: { legend: { position: 'top' as const } },
              scales: { y: { beginAtZero: true } },
            }}
          />
        </ChartCard>
      </div>

      {/* Insights Section */}
      <div className="bg-white rounded-lg shadow p-6">
        <h2 className="text-xl font-semibold mb-4">الرؤى الذكية</h2>
        <div className="space-y-4">
          {insights.map((insight) => (
            <InsightCard key={insight.id} insight={insight} />
          ))}
        </div>
      </div>
    </div>
  );
};

interface KPICardProps {
  title: string;
  value: string;
  trend: { direction: 'up' | 'down' | 'neutral'; percentage: number };
  icon: string;
  color: 'blue' | 'green' | 'purple' | 'orange';
}

const KPICard: React.FC<KPICardProps> = ({ title, value, trend, icon, color }) => {
  const colorClasses = {
    blue: 'bg-blue-50 border-blue-200 text-blue-800',
    green: 'bg-green-50 border-green-200 text-green-800',
    purple: 'bg-purple-50 border-purple-200 text-purple-800',
    orange: 'bg-orange-50 border-orange-200 text-orange-800'
  };

  return (
    <div className={`rounded-lg border p-6 ${colorClasses[color]}`}>
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm font-medium opacity-75">{title}</p>
          <p className="text-2xl font-bold">{value}</p>
        </div>
        <div className="text-3xl">{icon}</div>
      </div>
      <div className="mt-4 flex items-center">
        <span className={`text-sm ${
          trend.direction === 'up' ? 'text-green-600' : 
          trend.direction === 'down' ? 'text-red-600' : 'text-gray-600'
        }`}>
          {trend.direction === 'up' ? '↗' : trend.direction === 'down' ? '↘' : '→'} 
          {Math.abs(trend.percentage).toFixed(1)}%
        </span>
        <span className="text-sm text-gray-600 mr-2">من الفترة السابقة</span>
      </div>
    </div>
  );
};

interface ChartCardProps {
  title: string;
  children: React.ReactNode;
}

const ChartCard: React.FC<ChartCardProps> = ({ title, children }) => (
  <div className="bg-white rounded-lg shadow p-6">
    <h3 className="text-lg font-semibold mb-4">{title}</h3>
    <div className="h-64">
      {children}
    </div>
  </div>
);

interface InsightCardProps {
  insight: AnalyticsInsight;
}

const InsightCard: React.FC<InsightCardProps> = ({ insight }) => {
  const impactColors = {
    low: 'bg-gray-100 text-gray-800',
    medium: 'bg-yellow-100 text-yellow-800',
    high: 'bg-orange-100 text-orange-800',
    critical: 'bg-red-100 text-red-800'
  };

  const typeIcons = {
    trend: '📈',
    anomaly: '⚠️',
    prediction: '🔮',
    recommendation: '💡'
  };

  return (
    <div className="border rounded-lg p-4 hover:shadow-md transition-shadow">
      <div className="flex items-start justify-between">
        <div className="flex-1">
          <div className="flex items-center space-x-2 mb-2">
            <span className="text-lg">{typeIcons[insight.type]}</span>
            <h4 className="font-semibold">{insight.title}</h4>
            <span className={`px-2 py-1 rounded-full text-xs font-medium ${impactColors[insight.impact]}`}>
              {insight.impact}
            </span>
          </div>
          <p className="text-gray-600 mb-2">{insight.description}</p>
          {insight.recommendations && insight.recommendations.length > 0 && (
            <div className="mt-2">
              <p className="text-sm font-medium text-gray-700 mb-1">التوصيات:</p>
              <ul className="text-sm text-gray-600 space-y-1">
                {insight.recommendations.map((rec, index) => (
                  <li key={index} className="flex items-start">
                    <span className="text-blue-500 mr-1">•</span>
                    {rec}
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>
        <div className="text-sm text-gray-500">
          {Math.round(insight.confidence * 100)}% ثقة
        </div>
      </div>
    </div>
  );
};