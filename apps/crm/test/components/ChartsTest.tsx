import * as React from 'react';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '../../components/ui/card';
import { Separator } from '../../components/ui/separator';
import {
  LineChart,
  Line,
  BarChart,
  Bar,
  AreaChart,
  Area,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer
} from 'recharts';

const salesData = [
  { month: 'يناير', sales: 4000, revenue: 2400, customers: 240 },
  { month: 'فبراير', sales: 3000, revenue: 1398, customers: 221 },
  { month: 'مارس', sales: 2000, revenue: 9800, customers: 229 },
  { month: 'أبريل', sales: 2780, revenue: 3908, customers: 200 },
  { month: 'مايو', sales: 1890, revenue: 4800, customers: 218 },
  { month: 'يونيو', sales: 2390, revenue: 3800, customers: 250 },
];

const pieData = [
  { name: 'عملاء جدد', value: 400 },
  { name: 'عملاء حاليون', value: 300 },
  { name: 'عملاء سابقون', value: 200 },
  { name: 'محتملون', value: 100 },
];

const COLORS = ['hsl(var(--primary))', 'hsl(var(--secondary))', 'hsl(var(--accent))', 'hsl(var(--muted))'];

export function ChartsTest() {
  return (
    <div className="p-8 space-y-8 max-w-7xl mx-auto">
      <div>
        <h1>اختبار المخططات</h1>
        <p className="text-muted-foreground">Recharts مع دعم الثيم المظلم/الفاتح</p>
      </div>

      <Separator />

      {/* Line Chart */}
      <Card>
        <CardHeader>
          <CardTitle>Line Chart - مخطط خطي</CardTitle>
          <CardDescription>المبيعات والإيرادات الشهرية</CardDescription>
        </CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={salesData}>
              <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
              <XAxis 
                dataKey="month" 
                className="text-xs fill-muted-foreground"
              />
              <YAxis className="text-xs fill-muted-foreground" />
              <Tooltip 
                contentStyle={{
                  backgroundColor: 'hsl(var(--card))',
                  border: '1px solid hsl(var(--border))',
                  borderRadius: '0.5rem',
                }}
              />
              <Legend />
              <Line 
                type="monotone" 
                dataKey="sales" 
                stroke="hsl(var(--primary))" 
                name="المبيعات"
                strokeWidth={2}
              />
              <Line 
                type="monotone" 
                dataKey="revenue" 
                stroke="hsl(var(--secondary))" 
                name="الإيرادات"
                strokeWidth={2}
              />
            </LineChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>

      {/* Bar Chart */}
      <Card>
        <CardHeader>
          <CardTitle>Bar Chart - مخطط شريطي</CardTitle>
          <CardDescription>عدد العملاء الشهري</CardDescription>
        </CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={salesData}>
              <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
              <XAxis 
                dataKey="month" 
                className="text-xs fill-muted-foreground"
              />
              <YAxis className="text-xs fill-muted-foreground" />
              <Tooltip 
                contentStyle={{
                  backgroundColor: 'hsl(var(--card))',
                  border: '1px solid hsl(var(--border))',
                  borderRadius: '0.5rem',
                }}
              />
              <Legend />
              <Bar 
                dataKey="customers" 
                fill="hsl(var(--primary))" 
                name="العملاء"
                radius={[8, 8, 0, 0]}
              />
            </BarChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>

      {/* Area Chart */}
      <Card>
        <CardHeader>
          <CardTitle>Area Chart - مخطط المساحة</CardTitle>
          <CardDescription>نمو المبيعات التراكمي</CardDescription>
        </CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={300}>
            <AreaChart data={salesData}>
              <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
              <XAxis 
                dataKey="month" 
                className="text-xs fill-muted-foreground"
              />
              <YAxis className="text-xs fill-muted-foreground" />
              <Tooltip 
                contentStyle={{
                  backgroundColor: 'hsl(var(--card))',
                  border: '1px solid hsl(var(--border))',
                  borderRadius: '0.5rem',
                }}
              />
              <Legend />
              <Area 
                type="monotone" 
                dataKey="sales" 
                stroke="hsl(var(--primary))" 
                fill="hsl(var(--primary) / 0.2)" 
                name="المبيعات"
              />
              <Area 
                type="monotone" 
                dataKey="revenue" 
                stroke="hsl(var(--secondary))" 
                fill="hsl(var(--secondary) / 0.2)" 
                name="الإيرادات"
              />
            </AreaChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>

      {/* Pie Chart */}
      <Card>
        <CardHeader>
          <CardTitle>Pie Chart - مخطط دائري</CardTitle>
          <CardDescription>توزيع العملاء حسب الفئة</CardDescription>
        </CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie
                data={pieData}
                cx="50%"
                cy="50%"
                labelLine={false}
                label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                outerRadius={80}
                fill="hsl(var(--primary))"
                dataKey="value"
              >
                {pieData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip 
                contentStyle={{
                  backgroundColor: 'hsl(var(--card))',
                  border: '1px solid hsl(var(--border))',
                  borderRadius: '0.5rem',
                }}
              />
            </PieChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>

      {/* Multiple Charts */}
      <div className="grid md:grid-cols-2 gap-4">
        <Card>
          <CardHeader>
            <CardTitle>مخطط صغير 1</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={200}>
              <LineChart data={salesData.slice(0, 4)}>
                <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
                <XAxis dataKey="month" className="text-xs fill-muted-foreground" />
                <YAxis className="text-xs fill-muted-foreground" />
                <Tooltip />
                <Line type="monotone" dataKey="sales" stroke="hsl(var(--primary))" strokeWidth={2} />
              </LineChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>مخطط صغير 2</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={200}>
              <BarChart data={salesData.slice(0, 4)}>
                <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
                <XAxis dataKey="month" className="text-xs fill-muted-foreground" />
                <YAxis className="text-xs fill-muted-foreground" />
                <Tooltip />
                <Bar dataKey="customers" fill="hsl(var(--secondary))" radius={[8, 8, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>

      {/* Success */}
      <Card className="border-green-500 bg-green-500/10">
        <CardContent className="pt-6">
          <p className="text-center">
            ✅ مخططات Recharts تعمل بشكل ممتاز! تتكيف مع الثيم المظلم/الفاتح تلقائياً.
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
