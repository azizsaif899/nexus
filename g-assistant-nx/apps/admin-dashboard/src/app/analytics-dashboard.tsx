import React, { useState, useEffect } from 'react';
import { Line, Bar, Doughnut, Pie } from 'react-chartjs-2';
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

const KPICard: React.FC<{
  title: string;
  value: string | number;
  trend: number;
  icon: string;
}> = ({ title, value, trend, icon }) => (
  <div className="bg-white p-6 rounded-lg shadow-md border">
    <div className="flex items-center justify-between">
      <div>
        <p className="text-sm font-medium text-gray-600">{title}</p>
        <p className="text-2xl font-bold text-gray-900">{value}</p>
      </div>
      <div className="text-3xl">{icon}</div>
    </div>
    <div className="mt-4">
      <span className={`text-sm font-medium ${trend >= 0 ? 'text-green-600' : 'text-red-600'}`}>
        {trend >= 0 ? '↗' : '↘'} {Math.abs(trend)}%
      </span>
      <span className="text-sm text-gray-500 ml-2">من الشهر الماضي</span>
    </div>
  </div>
);

const ChartCard: React.FC<{ title: string; children: React.ReactNode }> = ({ title, children }) => (
  <div className="bg-white p-6 rounded-lg shadow-md border">
    <h3 className="text-lg font-semibold text-gray-900 mb-4">{title}</h3>
    <div className="h-64">{children}</div>
  </div>
);

export const AnalyticsDashboard: React.FC = () => {
  const [kpis, setKpis] = useState<BusinessKPIs | null>(null);
  const [timeRange, setTimeRange] = useState<'7d' | '30d' | '90d'>('30d');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchKPIs();
  }, [timeRange]);

  const fetchKPIs = async () => {
    setLoading(true);
    try {
      // Mock data - في التطبيق الحقيقي سيتم جلب البيانات من API
      const mockKPIs: BusinessKPIs = {
        userMetrics: {
          dailyActiveUsers: 1250,
          monthlyActiveUsers: 15600,
          userRetentionRate: 0.78,
          userChurnRate: 0.22,
          averageSessionDuration: 12.5,
          userLifetimeValue: 450.75
        },
        businessMetrics: {
          monthlyRecurringRevenue: 125000,
          customerAcquisitionCost: 45.50,
          conversionRate: 0.085,
          averageRevenuePerUser: 8.75,
          grossMargin: 0.72,
          netPromoterScore: 8.2
        },
        technicalMetrics: {
          systemUptime: 99.95,
          averageResponseTime: 245,
          errorRate: 0.002,
          throughput: 1250,
          resourceUtilization: 0.68,
          deploymentFrequency: 2.5
        },
        aiMetrics: {
          queryAccuracy: 0.94,
          responseTime: 850,
          userSatisfaction: 4.3,
          modelPerformance: 0.91,
          apiUsage: 45600,
          costPerQuery: 0.0012
        }
      };
      
      setTimeout(() => {
        setKpis(mockKPIs);
        setLoading(false);
      }, 1000);
    } catch (error) {
      console.error('Error fetching KPIs:', error);
      setLoading(false);
    }
  };

  const userGrowthData = {
    labels: ['يناير', 'فبراير', 'مارس', 'أبريل', 'مايو', 'يونيو'],
    datasets: [
      {
        label: 'المستخدمون النشطون',
        data: [12000, 13500, 14200, 15100, 15600, 16200],
        borderColor: 'rgb(59, 130, 246)',
        backgroundColor: 'rgba(59, 130, 246, 0.1)',
        tension: 0.4,
      },
    ],
  };

  const revenueData = {
    labels: ['الاشتراكات', 'المبيعات المباشرة', 'الإعلانات', 'الخدمات'],
    datasets: [
      {
        data: [65, 20, 10, 5],
        backgroundColor: ['#3B82F6', '#10B981', '#F59E0B', '#EF4444'],
      },
    ],
  };

  const performanceData = {
    labels: ['وقت الاستجابة', 'معدل الأخطاء', 'الإنتاجية', 'استخدام الموارد'],
    datasets: [
      {
        label: 'الأداء الحالي',
        data: [245, 0.2, 85, 68],
        backgroundColor: 'rgba(16, 185, 129, 0.8)',
      },
      {
        label: 'الهدف',
        data: [200, 0.1, 90, 70],
        backgroundColor: 'rgba(59, 130, 246, 0.8)',
      },
    ],
  };

  const aiUsageData = {
    labels: ['الأسبوع 1', 'الأسبوع 2', 'الأسبوع 3', 'الأسبوع 4'],
    datasets: [
      {
        label: 'استعلامات الذكاء الاصطناعي',
        data: [8500, 12000, 15600, 18200],
        borderColor: 'rgb(168, 85, 247)',
        backgroundColor: 'rgba(168, 85, 247, 0.1)',
        tension: 0.4,
      },
    ],
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (!kpis) {
    return (
      <div className="text-center py-12">
        <p className="text-gray-500">فشل في تحميل البيانات</p>
      </div>
    );
  }

  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      <div className="mb-6">
        <h1 className="text-3xl font-bold text-gray-900">لوحة التحليلات والذكاء التجاري</h1>
        <div className="mt-4 flex space-x-4">
          {(['7d', '30d', '90d'] as const).map((range) => (
            <button
              key={range}
              onClick={() => setTimeRange(range)}
              className={`px-4 py-2 rounded-md text-sm font-medium ${
                timeRange === range
                  ? 'bg-blue-600 text-white'
                  : 'bg-white text-gray-700 hover:bg-gray-50'
              }`}
            >
              {range === '7d' ? '7 أيام' : range === '30d' ? '30 يوم' : '90 يوم'}
            </button>
          ))}
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <KPICard
          title="المستخدمون النشطون اليوم"
          value={kpis.userMetrics.dailyActiveUsers.toLocaleString()}
          trend={12.5}
          icon="👥"
        />
        <KPICard
          title="الإيرادات الشهرية"
          value={`$${kpis.businessMetrics.monthlyRecurringRevenue.toLocaleString()}`}
          trend={8.3}
          icon="💰"
        />
        <KPICard
          title="معدل التحويل"
          value={`${(kpis.businessMetrics.conversionRate * 100).toFixed(1)}%`}
          trend={-2.1}
          icon="📈"
        />
        <KPICard
          title="وقت الاستجابة"
          value={`${kpis.technicalMetrics.averageResponseTime}ms`}
          trend={-5.2}
          icon="⚡"
        />
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
        <ChartCard title="نمو المستخدمين">
          <Line data={userGrowthData} options={{ responsive: true, maintainAspectRatio: false }} />
        </ChartCard>
        
        <ChartCard title="توزيع الإيرادات">
          <Doughnut data={revenueData} options={{ responsive: true, maintainAspectRatio: false }} />
        </ChartCard>
        
        <ChartCard title="أداء النظام">
          <Bar data={performanceData} options={{ responsive: true, maintainAspectRatio: false }} />
        </ChartCard>
        
        <ChartCard title="استخدام الذكاء الاصطناعي">
          <Line data={aiUsageData} options={{ responsive: true, maintainAspectRatio: false }} />
        </ChartCard>
      </div>

      {/* Detailed Metrics */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="bg-white p-6 rounded-lg shadow-md border">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">مقاييس المستخدمين</h3>
          <div className="space-y-3">
            <div className="flex justify-between">
              <span className="text-gray-600">معدل الاحتفاظ</span>
              <span className="font-medium">{(kpis.userMetrics.userRetentionRate * 100).toFixed(1)}%</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">متوسط مدة الجلسة</span>
              <span className="font-medium">{kpis.userMetrics.averageSessionDuration} دقيقة</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">قيمة المستخدم مدى الحياة</span>
              <span className="font-medium">${kpis.userMetrics.userLifetimeValue}</span>
            </div>
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg shadow-md border">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">مقاييس الأعمال</h3>
          <div className="space-y-3">
            <div className="flex justify-between">
              <span className="text-gray-600">تكلفة اكتساب العميل</span>
              <span className="font-medium">${kpis.businessMetrics.customerAcquisitionCost}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">الهامش الإجمالي</span>
              <span className="font-medium">{(kpis.businessMetrics.grossMargin * 100).toFixed(1)}%</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">نقاط الترويج الصافي</span>
              <span className="font-medium">{kpis.businessMetrics.netPromoterScore}/10</span>
            </div>
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg shadow-md border">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">مقاييس الذكاء الاصطناعي</h3>
          <div className="space-y-3">
            <div className="flex justify-between">
              <span className="text-gray-600">دقة الاستعلامات</span>
              <span className="font-medium">{(kpis.aiMetrics.queryAccuracy * 100).toFixed(1)}%</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">رضا المستخدمين</span>
              <span className="font-medium">{kpis.aiMetrics.userSatisfaction}/5</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">تكلفة الاستعلام</span>
              <span className="font-medium">${kpis.aiMetrics.costPerQuery}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};