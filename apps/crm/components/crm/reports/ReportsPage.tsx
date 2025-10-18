import React, { useState } from 'react';
import { 
  FileText, Download, Printer, TrendingUp, 
  Users, DollarSign, Target, Calendar
} from 'lucide-react';
import { Card } from '../../ui/card';
import { Button } from '../../ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../../ui/select';
import { useTheme } from '../../ThemeProvider';
import { toast } from 'sonner';
import { 
  LineChart, Line, BarChart, Bar, PieChart, Pie, Cell,
  XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer
} from 'recharts';

function ReportsPage() {
  const { resolvedTheme } = useTheme();
  const [reportType, setReportType] = useState('monthly');
  const [reportPeriod, setReportPeriod] = useState('current-month');

  // Sample Report Data
  const monthlyData = [
    { month: 'يناير', leads: 145, converted: 28, revenue: 420000 },
    { month: 'فبراير', leads: 168, converted: 35, revenue: 525000 },
    { month: 'مارس', leads: 152, converted: 31, revenue: 465000 },
    { month: 'أبريل', leads: 189, converted: 42, revenue: 630000 },
    { month: 'مايو', leads: 203, converted: 48, revenue: 720000 },
    { month: 'يونيو', leads: 215, converted: 53, revenue: 795000 },
  ];

  const sourceData = [
    { name: 'الموقع', value: 35, color: '#030213' },
    { name: 'السوشيال', value: 28, color: '#059669' },
    { name: 'إحالات', value: 22, color: '#d97706' },
    { name: 'إعلانات', value: 15, color: '#d4183d' },
  ];

  const handleExportPDF = () => {
    toast.success('جاري تصدير التقرير بصيغة PDF...');
  };

  const handleExportExcel = () => {
    toast.success('جاري تصدير التقرير بصيغة Excel...');
  };

  const handlePrint = () => {
    window.print();
    toast.success('جاري الطباعة...');
  };

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="font-semibold mb-2" style={{ fontSize: '24px' }}>
            التقارير والتحليلات
          </h2>
          <p className="text-foreground-muted">
            تقارير شاملة عن الأداء والمبيعات
          </p>
        </div>
        <div className="flex items-center gap-3">
          <Button variant="outline" onClick={handlePrint} className="gap-2">
            <Printer className="w-4 h-4" />
            طباعة
          </Button>
          <Button variant="outline" onClick={handleExportExcel} className="gap-2">
            <Download className="w-4 h-4" />
            Excel
          </Button>
          <Button className="glass-button-primary gap-2" onClick={handleExportPDF}>
            <Download className="w-4 h-4" />
            PDF
          </Button>
        </div>
      </div>

      {/* Report Controls */}
      <div className="flex items-center gap-4 flex-wrap">
        <div>
          <label className="text-foreground-muted mb-2 block" style={{ fontSize: '13px' }}>
            نوع التقرير
          </label>
          <Select value={reportType} onValueChange={setReportType}>
            <SelectTrigger className="w-48">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="monthly">تقرير شهري</SelectItem>
              <SelectItem value="quarterly">تقرير ربع سنوي</SelectItem>
              <SelectItem value="yearly">تقرير سنوي</SelectItem>
              <SelectItem value="custom">تقرير مخصص</SelectItem>
            </SelectContent>
          </Select>
        </div>
        <div>
          <label className="text-foreground-muted mb-2 block" style={{ fontSize: '13px' }}>
            الفترة الزمنية
          </label>
          <Select value={reportPeriod} onValueChange={setReportPeriod}>
            <SelectTrigger className="w-48">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="current-month">الشهر الحالي</SelectItem>
              <SelectItem value="last-month">الشهر الماضي</SelectItem>
              <SelectItem value="last-3-months">آخر 3 أشهر</SelectItem>
              <SelectItem value="last-6-months">آخر 6 أشهر</SelectItem>
              <SelectItem value="current-year">السنة الحالية</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      {/* Key Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card className="glass-light p-6">
          <div className="flex items-center justify-between mb-4">
            <div className="w-12 h-12 rounded-xl glass-medium flex items-center justify-center">
              <Users className="w-6 h-6 text-primary" />
            </div>
            <TrendingUp className="w-5 h-5 text-success" />
          </div>
          <p className="text-foreground-muted mb-1" style={{ fontSize: '13px' }}>
            إجمالي العملاء
          </p>
          <p className="font-semibold" style={{ fontSize: '28px' }}>1,072</p>
          <p className="text-success" style={{ fontSize: '12px' }}>+12.5% من الشهر الماضي</p>
        </Card>

        <Card className="glass-light p-6">
          <div className="flex items-center justify-between mb-4">
            <div className="w-12 h-12 rounded-xl glass-medium flex items-center justify-center">
              <Target className="w-6 h-6 text-success" />
            </div>
            <TrendingUp className="w-5 h-5 text-success" />
          </div>
          <p className="text-foreground-muted mb-1" style={{ fontSize: '13px' }}>
            معدل التحويل
          </p>
          <p className="font-semibold" style={{ fontSize: '28px' }}>24.8%</p>
          <p className="text-success" style={{ fontSize: '12px' }}>+3.2% من الشهر الماضي</p>
        </Card>

        <Card className="glass-light p-6">
          <div className="flex items-center justify-between mb-4">
            <div className="w-12 h-12 rounded-xl glass-medium flex items-center justify-center">
              <DollarSign className="w-6 h-6 text-warning" />
            </div>
            <TrendingUp className="w-5 h-5 text-success" />
          </div>
          <p className="text-foreground-muted mb-1" style={{ fontSize: '13px' }}>
            إجمالي الإيرادات
          </p>
          <p className="font-semibold" style={{ fontSize: '28px' }}>3.5M</p>
          <p className="text-success" style={{ fontSize: '12px' }}>+18.7% من الشهر الماضي</p>
        </Card>

        <Card className="glass-light p-6">
          <div className="flex items-center justify-between mb-4">
            <div className="w-12 h-12 rounded-xl glass-medium flex items-center justify-center">
              <Calendar className="w-6 h-6 text-destructive" />
            </div>
            <TrendingUp className="w-5 h-5 text-destructive" />
          </div>
          <p className="text-foreground-muted mb-1" style={{ fontSize: '13px' }}>
            متوسط دورة البيع
          </p>
          <p className="font-semibold" style={{ fontSize: '28px' }}>21 يوم</p>
          <p className="text-destructive" style={{ fontSize: '12px' }}>-5.3% من الشهر الماضي</p>
        </Card>
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Performance Trends */}
        <Card className="glass-light p-6">
          <h3 className="font-semibold mb-6" style={{ fontSize: '18px' }}>
            اتجاه الأداء
          </h3>
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={monthlyData}>
              <CartesianGrid strokeDasharray="3 3" stroke={resolvedTheme === 'dark' ? '#2c2c2c' : '#f1f1f5'} />
              <XAxis dataKey="month" stroke={resolvedTheme === 'dark' ? '#667781' : '#717182'} />
              <YAxis stroke={resolvedTheme === 'dark' ? '#667781' : '#717182'} />
              <Tooltip 
                contentStyle={{
                  backgroundColor: resolvedTheme === 'dark' ? '#1E2B35' : '#ffffff',
                  border: '1px solid ' + (resolvedTheme === 'dark' ? '#202020' : 'rgba(0,0,0,0.1)'),
                  borderRadius: '8px'
                }}
              />
              <Legend />
              <Line type="monotone" dataKey="leads" stroke="#030213" strokeWidth={2} name="العملاء" />
              <Line type="monotone" dataKey="converted" stroke="#059669" strokeWidth={2} name="المحولين" />
            </LineChart>
          </ResponsiveContainer>
        </Card>

        {/* Revenue by Month */}
        <Card className="glass-light p-6">
          <h3 className="font-semibold mb-6" style={{ fontSize: '18px' }}>
            الإيرادات الشهرية
          </h3>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={monthlyData}>
              <CartesianGrid strokeDasharray="3 3" stroke={resolvedTheme === 'dark' ? '#2c2c2c' : '#f1f1f5'} />
              <XAxis dataKey="month" stroke={resolvedTheme === 'dark' ? '#667781' : '#717182'} />
              <YAxis stroke={resolvedTheme === 'dark' ? '#667781' : '#717182'} />
              <Tooltip 
                contentStyle={{
                  backgroundColor: resolvedTheme === 'dark' ? '#1E2B35' : '#ffffff',
                  border: '1px solid ' + (resolvedTheme === 'dark' ? '#202020' : 'rgba(0,0,0,0.1)'),
                  borderRadius: '8px'
                }}
              />
              <Bar dataKey="revenue" fill={resolvedTheme === 'dark' ? '#EAEAEA' : '#030213'} radius={[8, 8, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </Card>
      </div>

      {/* Summary Table */}
      <Card className="glass-light p-6">
        <h3 className="font-semibold mb-4" style={{ fontSize: '18px' }}>
          ملخص التقرير
        </h3>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="border-b border-border">
              <tr>
                <th className="text-right p-3 text-foreground-muted" style={{ fontSize: '14px' }}>المقياس</th>
                <th className="text-right p-3 text-foreground-muted" style={{ fontSize: '14px' }}>القيمة</th>
                <th className="text-right p-3 text-foreground-muted" style={{ fontSize: '14px' }}>التغيير</th>
              </tr>
            </thead>
            <tbody>
              <tr className="border-b border-border">
                <td className="p-3">إجمالي العملاء المحتملين</td>
                <td className="p-3 font-medium">1,072</td>
                <td className="p-3 text-success">+12.5%</td>
              </tr>
              <tr className="border-b border-border">
                <td className="p-3">العملاء المحولين</td>
                <td className="p-3 font-medium">266</td>
                <td className="p-3 text-success">+8.3%</td>
              </tr>
              <tr className="border-b border-border">
                <td className="p-3">متوسط قيمة الصفقة</td>
                <td className="p-3 font-medium">13,157 ر.س</td>
                <td className="p-3 text-success">+5.7%</td>
              </tr>
              <tr>
                <td className="p-3">إجمالي الإيرادات</td>
                <td className="p-3 font-medium">3,500,000 ر.س</td>
                <td className="p-3 text-success">+18.7%</td>
              </tr>
            </tbody>
          </table>
        </div>
      </Card>
    </div>
  );
}

export default ReportsPage;
