import React from 'react';
import { Settings, Users, BarChart3, Shield } from 'lucide-react';

export const AdminModule: React.FC = () => {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">وحدة الإدارة</h1>
          <p className="text-muted-foreground">
            إدارة النظام والمستخدمين والإعدادات
          </p>
        </div>
        <button className="inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-md px-4 py-2 text-sm font-medium bg-primary text-primary-foreground hover:bg-primary/90">
          <Settings className="h-4 w-4" />
          الإعدادات
        </button>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <div className="rounded-lg border bg-card text-card-foreground shadow-sm">
          <div className="flex flex-row items-center justify-between space-y-0 p-6 pb-2">
            <h3 className="text-sm font-medium">المستخدمين</h3>
            <Users className="h-4 w-4 text-muted-foreground" />
          </div>
          <div className="p-6 pt-0">
            <div className="text-2xl font-bold">156</div>
            <p className="text-xs text-muted-foreground">مستخدم نشط</p>
          </div>
        </div>

        <div className="rounded-lg border bg-card text-card-foreground shadow-sm">
          <div className="flex flex-row items-center justify-between space-y-0 p-6 pb-2">
            <h3 className="text-sm font-medium">الأمان</h3>
            <Shield className="h-4 w-4 text-muted-foreground" />
          </div>
          <div className="p-6 pt-0">
            <div className="text-2xl font-bold">99%</div>
            <p className="text-xs text-muted-foreground">مستوى الحماية</p>
          </div>
        </div>

        <div className="rounded-lg border bg-card text-card-foreground shadow-sm">
          <div className="flex flex-row items-center justify-between space-y-0 p-6 pb-2">
            <h3 className="text-sm font-medium">الأداء</h3>
            <BarChart3 className="h-4 w-4 text-muted-foreground" />
          </div>
          <div className="p-6 pt-0">
            <div className="text-2xl font-bold">95%</div>
            <p className="text-xs text-muted-foreground">كفاءة النظام</p>
          </div>
        </div>
      </div>

      <div className="text-center py-12">
        <Settings className="mx-auto h-16 w-16 text-muted-foreground mb-4" />
        <h3 className="text-lg font-medium mb-2">قيد التطوير</h3>
        <p className="text-muted-foreground">
          هذه الوحدة سيتم تطويرها قريباً مع المزيد من الميزات المتقدمة
        </p>
      </div>
    </div>
  );
};