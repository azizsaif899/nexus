import React from 'react';
import { BarChart3, TrendingUp, PieChart, Target } from 'lucide-react';

export const AnalyticsModule: React.FC = () => {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">التحليلات والتقارير</h1>
          <p className="text-muted-foreground">
            تحليل البيانات والأداء وإنشاء التقارير التفصيلية
          </p>
        </div>
        <button className="inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-md px-4 py-2 text-sm font-medium bg-primary text-primary-foreground hover:bg-primary/90">
          <BarChart3 className="h-4 w-4" />
          تقرير جديد
        </button>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <div className="rounded-lg border bg-card text-card-foreground shadow-sm">
          <div className="flex flex-row items-center justify-between space-y-0 p-6 pb-2">
            <h3 className="text-sm font-medium">إجمالي المبيعات</h3>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </div>
          <div className="p-6 pt-0">
            <div className="text-2xl font-bold">$45,231</div>
            <p className="text-xs text-muted-foreground">+20.1% من الشهر الماضي</p>
          </div>
        </div>

        <div className="rounded-lg border bg-card text-card-foreground shadow-sm">
          <div className="flex flex-row items-center justify-between space-y-0 p-6 pb-2">
            <h3 className="text-sm font-medium">معدل التحويل</h3>
            <Target className="h-4 w-4 text-muted-foreground" />
          </div>
          <div className="p-6 pt-0">
            <div className="text-2xl font-bold">15.8%</div>
            <p className="text-xs text-muted-foreground">+2.3% من الأسبوع الماضي</p>
          </div>
        </div>

        <div className="rounded-lg border bg-card text-card-foreground shadow-sm">
          <div className="flex flex-row items-center justify-between space-y-0 p-6 pb-2">
            <h3 className="text-sm font-medium">معدل النقر</h3>
            <PieChart className="h-4 w-4 text-muted-foreground" />
          </div>
          <div className="p-6 pt-0">
            <div className="text-2xl font-bold">4.7%</div>
            <p className="text-xs text-muted-foreground">+1.2% من الشهر الماضي</p>
          </div>
        </div>

        <div className="rounded-lg border bg-card text-card-foreground shadow-sm">
          <div className="flex flex-row items-center justify-between space-y-0 p-6 pb-2">
            <h3 className="text-sm font-medium">معدل النمو</h3>
            <BarChart3 className="h-4 w-4 text-muted-foreground" />
          </div>
          <div className="p-6 pt-0">
            <div className="text-2xl font-bold">+12.5%</div>
            <p className="text-xs text-muted-foreground">نمو شهري</p>
          </div>
        </div>
      </div>

      <div className="text-center py-12">
        <BarChart3 className="mx-auto h-16 w-16 text-muted-foreground mb-4" />
        <h3 className="text-lg font-medium mb-2">قيد التطوير</h3>
        <p className="text-muted-foreground">
          نعمل على تطوير نظام تحليلات متقدم مع تقارير تفاعلية
        </p>
      </div>
    </div>
  );
};