import React from 'react';
import { 
  TrendingUp, Users, DollarSign, Target, 
  ArrowUp, ArrowDown, Activity
} from 'lucide-react';
import { Card } from '../../ui/card';
import { useTheme } from '../../ThemeProvider';
import { 
  LineChart, Line, BarChart, Bar, PieChart, Pie, Cell,
  XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer
} from 'recharts';

interface KPICardProps {
  title: string;
  value: string | number;
  change: number;
  icon: React.ReactNode;
  color: string;
}

function KPICard({ title, value, change, icon, color }: KPICardProps) {
  const isPositive = change >= 0;
  
  return (
    <Card className="glass-light p-6 hover:glass-medium transition-all">
      <div className="flex items-start justify-between">
        <div className="flex-1">
          <small className="text-foreground-muted mb-2 block">
            {title}
          </small>
          <h2 className="mb-2">
            {value}
          </h2>
          <div className={`flex items-center gap-1 ${isPositive ? 'text-success' : 'text-destructive'}`}>
            {isPositive ? <ArrowUp className="w-4 h-4" /> : <ArrowDown className="w-4 h-4" />}
            <small>
              {Math.abs(change)}% من الشهر الماضي
            </small>
          </div>
        </div>
        <div 
          className="w-14 h-14 rounded-xl glass-medium flex items-center justify-center"
          style={{ color }}
        >
          {icon}
        </div>
      </div>
    </Card>
  );
}

export function CRMDashboard() {
  const { resolvedTheme } = useTheme();

  // KPIs Data
  const kpis = [
    {
      title: 'إجمالي العملاء المحتملين',
      value: '1,284',
      change: 12.5,
      icon: <Users className="w-7 h-7" />,
      color: resolvedTheme === 'dark' ? '#EAEAEA' : '#030213'
    },
    {
      title: 'معدل التحويل',
      value: '24.8%',
      change: 3.2,
      icon: <Target className="w-7 h-7" />,
      color: '#059669'
    },
    {
      title: 'الإيرادات المتوقعة',
      value: '2.4M ر.س',
      change: 18.7,
      icon: <DollarSign className="w-7 h-7" />,
      color: '#d97706'
    },
    {
      title: 'المهام المعلقة',
      value: '47',
      change: -5.3,
      icon: <Activity className="w-7 h-7" />,
      color: '#d4183d'
    },
  ];

  // Revenue Trends Data
  const revenueData = [
    { month: 'يناير', revenue: 185000, leads: 120 },
    { month: 'فبراير', revenue: 220000, leads: 145 },
    { month: 'مارس', revenue: 195000, leads: 132 },
    { month: 'أبريل', revenue: 275000, leads: 168 },
    { month: 'مايو', revenue: 315000, leads: 198 },
    { month: 'يونيو', revenue: 345000, leads: 215 },
  ];

  // Sales Pipeline Data
  const pipelineData = [
    { stage: 'عميل محتمل', count: 45, value: 450000 },
    { stage: 'مؤهل', count: 32, value: 680000 },
    { stage: 'عرض', count: 18, value: 920000 },
    { stage: 'مفاوضات', count: 12, value: 540000 },
    { stage: 'مغلق', count: 8, value: 320000 },
  ];

  // Lead Sources Data
  const leadSourcesData = [
    { name: 'الموقع الإلكتروني', value: 35, color: '#030213' },
    { name: 'وسائل التواصل', value: 28, color: '#059669' },
    { name: 'الإحالات', value: 22, color: '#d97706' },
    { name: 'الإعلانات', value: 15, color: '#d4183d' },
  ];

  // Team Performance Data
  const teamData = [
    { name: 'أحمد', deals: 24, revenue: 480000 },
    { name: 'سارة', deals: 19, revenue: 420000 },
    { name: 'محمد', deals: 16, revenue: 380000 },
    { name: 'فاطمة', deals: 14, revenue: 340000 },
    { name: 'عمر', deals: 11, revenue: 290000 },
  ];

  const COLORS = ['#030213', '#059669', '#d97706', '#d4183d'];

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div>
        <h1 className="mb-2">
          لوحة التحكم
        </h1>
        <p className="text-foreground-muted">
          نظرة شاملة على أداء المبيعات والعملاء
        </p>
      </div>

      {/* KPIs Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {kpis.map((kpi, index) => (
          <KPICard key={index} {...kpi} />
        ))}
      </div>

      {/* Charts Row 1 */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Revenue Trends */}
        <Card className="glass-light p-6">
          <div className="mb-6">
            <h3 className="mb-1">
              اتجاهات الإيرادات
            </h3>
            <small className="text-foreground-muted block">
              الإيرادات والعملاء المحتملين خلال 6 أشهر
            </small>
          </div>
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={revenueData}>
              <CartesianGrid strokeDasharray="3 3" stroke={resolvedTheme === 'dark' ? '#2c2c2c' : '#f1f1f5'} />
              <XAxis 
                dataKey="month" 
                stroke={resolvedTheme === 'dark' ? '#667781' : '#717182'}
                style={{ fontSize: '12px' }}
              />
              <YAxis 
                stroke={resolvedTheme === 'dark' ? '#667781' : '#717182'}
                style={{ fontSize: '12px' }}
              />
              <Tooltip 
                contentStyle={{
                  backgroundColor: resolvedTheme === 'dark' ? '#1E2B35' : '#ffffff',
                  border: '1px solid ' + (resolvedTheme === 'dark' ? '#202020' : 'rgba(0,0,0,0.1)'),
                  borderRadius: '8px',
                  color: resolvedTheme === 'dark' ? '#EAEAEA' : '#252525'
                }}
              />
              <Legend />
              <Line 
                type="monotone" 
                dataKey="revenue" 
                stroke={resolvedTheme === 'dark' ? '#EAEAEA' : '#030213'} 
                strokeWidth={3}
                name="الإيرادات"
                dot={{ fill: resolvedTheme === 'dark' ? '#EAEAEA' : '#030213', r: 5 }}
              />
              <Line 
                type="monotone" 
                dataKey="leads" 
                stroke="#059669" 
                strokeWidth={3}
                name="العملاء"
                dot={{ fill: '#059669', r: 5 }}
              />
            </LineChart>
          </ResponsiveContainer>
        </Card>

        {/* Sales Pipeline Funnel */}
        <Card className="glass-light p-6">
          <div className="mb-6">
            <h3 className="mb-1">
              مخطط قمع المبيعات
            </h3>
            <small className="text-foreground-muted block">
              توزيع العملاء حسب مراحل البيع
            </small>
          </div>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={pipelineData} layout="vertical">
              <CartesianGrid strokeDasharray="3 3" stroke={resolvedTheme === 'dark' ? '#2c2c2c' : '#f1f1f5'} />
              <XAxis 
                type="number" 
                stroke={resolvedTheme === 'dark' ? '#667781' : '#717182'}
                style={{ fontSize: '12px' }}
              />
              <YAxis 
                type="category" 
                dataKey="stage" 
                stroke={resolvedTheme === 'dark' ? '#667781' : '#717182'}
                style={{ fontSize: '12px' }}
                width={80}
              />
              <Tooltip 
                contentStyle={{
                  backgroundColor: resolvedTheme === 'dark' ? '#1E2B35' : '#ffffff',
                  border: '1px solid ' + (resolvedTheme === 'dark' ? '#202020' : 'rgba(0,0,0,0.1)'),
                  borderRadius: '8px',
                  color: resolvedTheme === 'dark' ? '#EAEAEA' : '#252525'
                }}
              />
              <Bar 
                dataKey="count" 
                fill={resolvedTheme === 'dark' ? '#EAEAEA' : '#030213'} 
                radius={[0, 8, 8, 0]}
                name="عدد العملاء"
              />
            </BarChart>
          </ResponsiveContainer>
        </Card>
      </div>

      {/* Charts Row 2 */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Lead Sources */}
        <Card className="glass-light p-6">
          <div className="mb-6">
            <h3 className="mb-1">
              مصادر العملاء
            </h3>
            <small className="text-foreground-muted block">
              توزيع العملاء حسب مصدر القدوم
            </small>
          </div>
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie
                data={leadSourcesData}
                cx="50%"
                cy="50%"
                labelLine={false}
                label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                outerRadius={100}
                fill="#8884d8"
                dataKey="value"
              >
                {leadSourcesData.map((entry, index) => (
                  <Cell 
                    key={`cell-${index}`} 
                    fill={resolvedTheme === 'dark' && index === 0 ? '#EAEAEA' : entry.color} 
                  />
                ))}
              </Pie>
              <Tooltip 
                contentStyle={{
                  backgroundColor: resolvedTheme === 'dark' ? '#1E2B35' : '#ffffff',
                  border: '1px solid ' + (resolvedTheme === 'dark' ? '#202020' : 'rgba(0,0,0,0.1)'),
                  borderRadius: '8px',
                  color: resolvedTheme === 'dark' ? '#EAEAEA' : '#252525'
                }}
              />
            </PieChart>
          </ResponsiveContainer>
        </Card>

        {/* Team Performance */}
        <Card className="glass-light p-6">
          <div className="mb-6">
            <h3 className="mb-1">
              أداء الفريق
            </h3>
            <small className="text-foreground-muted block">
              الصفقات والإيرادات لكل عضو
            </small>
          </div>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={teamData}>
              <CartesianGrid strokeDasharray="3 3" stroke={resolvedTheme === 'dark' ? '#2c2c2c' : '#f1f1f5'} />
              <XAxis 
                dataKey="name" 
                stroke={resolvedTheme === 'dark' ? '#667781' : '#717182'}
                style={{ fontSize: '12px' }}
              />
              <YAxis 
                stroke={resolvedTheme === 'dark' ? '#667781' : '#717182'}
                style={{ fontSize: '12px' }}
              />
              <Tooltip 
                contentStyle={{
                  backgroundColor: resolvedTheme === 'dark' ? '#1E2B35' : '#ffffff',
                  border: '1px solid ' + (resolvedTheme === 'dark' ? '#202020' : 'rgba(0,0,0,0.1)'),
                  borderRadius: '8px',
                  color: resolvedTheme === 'dark' ? '#EAEAEA' : '#252525'
                }}
              />
              <Legend />
              <Bar 
                dataKey="deals" 
                fill="#059669" 
                radius={[8, 8, 0, 0]}
                name="الصفقات"
              />
              <Bar 
                dataKey="revenue" 
                fill={resolvedTheme === 'dark' ? '#EAEAEA' : '#030213'} 
                radius={[8, 8, 0, 0]}
                name="الإيرادات"
              />
            </BarChart>
          </ResponsiveContainer>
        </Card>
      </div>

      {/* Recent Activity */}
      <Card className="glass-light p-6">
        <div className="mb-4">
          <h3 className="font-semibold mb-1" style={{ fontSize: '18px' }}>
            النشاط الأخير
          </h3>
          <p className="text-foreground-muted" style={{ fontSize: '13px' }}>
            آخر التحديثات والإجراءات
          </p>
        </div>
        <div className="space-y-4">
          {[
            { action: 'تم إضافة عميل جديد', name: 'شركة التقنية الحديثة', time: 'منذ 5 دقائق' },
            { action: 'تم نقل الصفقة إلى', name: 'مرحلة المفاوضات', time: 'منذ 15 دقيقة' },
            { action: 'تم إنشاء مهمة جديدة', name: 'متابعة مع العميل', time: 'منذ ساعة' },
            { action: 'تم إغلاق صفقة بقيمة', name: '125,000 ر.س', time: 'منذ ساعتين' },
          ].map((item, index) => (
            <div 
              key={index}
              className="flex items-start gap-4 p-3 rounded-lg hover:bg-hover-bg transition-colors"
            >
              <div className="w-2 h-2 rounded-full bg-primary mt-2"></div>
              <div className="flex-1">
                <p className="text-foreground">
                  {item.action} <span className="font-medium">{item.name}</span>
                </p>
                <p className="text-foreground-muted" style={{ fontSize: '12px' }}>
                  {item.time}
                </p>
              </div>
            </div>
          ))}
        </div>
      </Card>
    </div>
  );
}
