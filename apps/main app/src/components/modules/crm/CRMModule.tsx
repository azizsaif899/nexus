import React from 'react';
import { Users, UserPlus, TrendingUp, Phone } from 'lucide-react';

export const CRMModule: React.FC = () => {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">إدارة العملاء (CRM)</h1>
          <p className="text-muted-foreground">
            إدارة العملاء والمبيعات والعلاقات التجارية
          </p>
        </div>
        <button className="inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-md px-4 py-2 text-sm font-medium bg-primary text-primary-foreground hover:bg-primary/90">
          <UserPlus className="h-4 w-4" />
          عميل جديد
        </button>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <div className="rounded-lg border bg-card text-card-foreground shadow-sm">
          <div className="flex flex-row items-center justify-between space-y-0 p-6 pb-2">
            <h3 className="text-sm font-medium">إجمالي العملاء</h3>
            <Users className="h-4 w-4 text-muted-foreground" />
          </div>
          <div className="p-6 pt-0">
            <div className="text-2xl font-bold">1,247</div>
            <p className="text-xs text-muted-foreground">+12% من الشهر الماضي</p>
          </div>
        </div>

        <div className="rounded-lg border bg-card text-card-foreground shadow-sm">
          <div className="flex flex-row items-center justify-between space-y-0 p-6 pb-2">
            <h3 className="text-sm font-medium">العملاء المحتملين</h3>
            <UserPlus className="h-4 w-4 text-muted-foreground" />
          </div>
          <div className="p-6 pt-0">
            <div className="text-2xl font-bold">89</div>
            <p className="text-xs text-muted-foreground">+5% من الأسبوع الماضي</p>
          </div>
        </div>

        <div className="rounded-lg border bg-card text-card-foreground shadow-sm">
          <div className="flex flex-row items-center justify-between space-y-0 p-6 pb-2">
            <h3 className="text-sm font-medium">المبيعات</h3>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </div>
          <div className="p-6 pt-0">
            <div className="text-2xl font-bold">$45,230</div>
            <p className="text-xs text-muted-foreground">+20% من الشهر الماضي</p>
          </div>
        </div>

        <div className="rounded-lg border bg-card text-card-foreground shadow-sm">
          <div className="flex flex-row items-center justify-between space-y-0 p-6 pb-2">
            <h3 className="text-sm font-medium">المكالمات</h3>
            <Phone className="h-4 w-4 text-muted-foreground" />
          </div>
          <div className="p-6 pt-0">
            <div className="text-2xl font-bold">234</div>
            <p className="text-xs text-muted-foreground">هذا الأسبوع</p>
          </div>
        </div>
      </div>

      <div className="text-center py-12">
        <Users className="mx-auto h-16 w-16 text-muted-foreground mb-4" />
        <h3 className="text-lg font-medium mb-2">قيد التطوير</h3>
        <p className="text-muted-foreground">
          سيتم إضافة المزيد من الميزات قريباً لإدارة العملاء والمبيعات
        </p>
      </div>
    </div>
  );
};