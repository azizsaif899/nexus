import React from 'react';
import { Zap, Play, Settings, Clock } from 'lucide-react';

export const AutomationModule: React.FC = () => {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">الأتمتة والسير الآلي</h1>
          <p className="text-muted-foreground">
            أتمتة العمليات وتطوير سير العمل الذكي
          </p>
        </div>
        <button className="inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-md px-4 py-2 text-sm font-medium bg-primary text-primary-foreground hover:bg-primary/90">
          <Zap className="h-4 w-4" />
          سير عمل جديد
        </button>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <div className="rounded-lg border bg-card text-card-foreground shadow-sm">
          <div className="flex flex-row items-center justify-between space-y-0 p-6 pb-2">
            <h3 className="text-sm font-medium">العمليات النشطة</h3>
            <Play className="h-4 w-4 text-muted-foreground" />
          </div>
          <div className="p-6 pt-0">
            <div className="text-2xl font-bold">18</div>
            <p className="text-xs text-muted-foreground">عملية تعمل حالياً</p>
          </div>
        </div>

        <div className="rounded-lg border bg-card text-card-foreground shadow-sm">
          <div className="flex flex-row items-center justify-between space-y-0 p-6 pb-2">
            <h3 className="text-sm font-medium">الوقت المُوفر</h3>
            <Clock className="h-4 w-4 text-muted-foreground" />
          </div>
          <div className="p-6 pt-0">
            <div className="text-2xl font-bold">47h</div>
            <p className="text-xs text-muted-foreground">هذا الأسبوع</p>
          </div>
        </div>

        <div className="rounded-lg border bg-card text-card-foreground shadow-sm">
          <div className="flex flex-row items-center justify-between space-y-0 p-6 pb-2">
            <h3 className="text-sm font-medium">معدل الكفاءة</h3>
            <Zap className="h-4 w-4 text-muted-foreground" />
          </div>
          <div className="p-6 pt-0">
            <div className="text-2xl font-bold">89%</div>
            <p className="text-xs text-muted-foreground">+5% من الشهر الماضي</p>
          </div>
        </div>

        <div className="rounded-lg border bg-card text-card-foreground shadow-sm">
          <div className="flex flex-row items-center justify-between space-y-0 p-6 pb-2">
            <h3 className="text-sm font-medium">القواعد النشطة</h3>
            <Settings className="h-4 w-4 text-muted-foreground" />
          </div>
          <div className="p-6 pt-0">
            <div className="text-2xl font-bold">42</div>
            <p className="text-xs text-muted-foreground">قاعدة مُفعلة</p>
          </div>
        </div>
      </div>

      <div className="text-center py-12">
        <Zap className="mx-auto h-16 w-16 text-muted-foreground mb-4" />
        <h3 className="text-lg font-medium mb-2">قيد التطوير</h3>
        <p className="text-muted-foreground">
          نعمل على تطوير نظام أتمتة متقدم لتبسيط العمليات التجارية
        </p>
      </div>
    </div>
  );
};