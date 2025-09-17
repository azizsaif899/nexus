import React from 'react';
import { 
  Users, 
  TrendingUp, 
  MessageCircle, 
  Activity,
  ArrowUpRight,
  ArrowDownRight,
  Calendar
} from 'lucide-react';

export const DashboardModule: React.FC = () => {
  return (
    <div className="space-y-6">
      {/* Welcome Section */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">
            مرحباً بك في Nexus.AI
          </h1>
          <p className="text-muted-foreground">
            نظرة عامة على أعمالك وأنشطتك اليومية
          </p>
        </div>
        <div className="flex items-center gap-2">
          <button className="inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-md px-3 py-2 text-sm font-medium border bg-background text-foreground hover:bg-accent hover:text-accent-foreground">
            <Calendar className="h-4 w-4" />
            اليوم
          </button>
          <button className="inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-md px-4 py-2 text-sm font-medium bg-primary text-primary-foreground hover:bg-primary/90">
            تقرير مفصل
          </button>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <div className="rounded-lg border bg-card text-card-foreground shadow-sm">
          <div className="flex flex-row items-center justify-between space-y-0 p-6 pb-2">
            <h3 className="text-sm font-medium">إجمالي المستخدمين</h3>
            <Users className="h-4 w-4 text-muted-foreground" />
          </div>
          <div className="p-6 pt-0">
            <div className="text-2xl font-bold">1,247</div>
            <div className="flex items-center text-xs text-green-600">
              <ArrowUpRight className="mr-1 h-3 w-3" />
              12.5% من الشهر الماضي
            </div>
          </div>
        </div>

        <div className="rounded-lg border bg-card text-card-foreground shadow-sm">
          <div className="flex flex-row items-center justify-between space-y-0 p-6 pb-2">
            <h3 className="text-sm font-medium">العملاء النشطين</h3>
            <Activity className="h-4 w-4 text-muted-foreground" />
          </div>
          <div className="p-6 pt-0">
            <div className="text-2xl font-bold">892</div>
            <div className="flex items-center text-xs text-green-600">
              <ArrowUpRight className="mr-1 h-3 w-3" />
              8.2% من الشهر الماضي
            </div>
          </div>
        </div>

        <div className="rounded-lg border bg-card text-card-foreground shadow-sm">
          <div className="flex flex-row items-center justify-between space-y-0 p-6 pb-2">
            <h3 className="text-sm font-medium">الإيرادات الشهرية</h3>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </div>
          <div className="p-6 pt-0">
            <div className="text-2xl font-bold">$45,600</div>
            <div className="flex items-center text-xs text-green-600">
              <ArrowUpRight className="mr-1 h-3 w-3" />
              15.3% من الشهر الماضي
            </div>
          </div>
        </div>

        <div className="rounded-lg border bg-card text-card-foreground shadow-sm">
          <div className="flex flex-row items-center justify-between space-y-0 p-6 pb-2">
            <h3 className="text-sm font-medium">تذاكر الدعم</h3>
            <MessageCircle className="h-4 w-4 text-muted-foreground" />
          </div>
          <div className="p-6 pt-0">
            <div className="text-2xl font-bold">23</div>
            <div className="flex items-center text-xs text-red-600">
              <ArrowDownRight className="mr-1 h-3 w-3" />
              -5.2% من الشهر الماضي
            </div>
          </div>
        </div>
      </div>

      {/* Content Area */}
      <div className="grid gap-6 lg:grid-cols-3">
        {/* Recent Activities */}
        <div className="lg:col-span-2">
          <div className="rounded-lg border bg-card text-card-foreground shadow-sm">
            <div className="flex flex-col space-y-1.5 p-6">
              <h3 className="flex items-center gap-2 font-semibold leading-none tracking-tight">
                <Activity className="h-5 w-5" />
                النشاطات الأخيرة
              </h3>
            </div>
            <div className="p-6 pt-0 space-y-4">
              <div className="flex items-start gap-4">
                <div className="relative flex h-8 w-8 shrink-0 overflow-hidden rounded-full">
                  <div className="flex h-full w-full items-center justify-center rounded-full bg-muted">
                    أم
                  </div>
                </div>
                <div className="flex-1 space-y-1">
                  <p className="text-sm">
                    <span className="font-medium">أحمد محمد</span> أضاف عميل جديد
                  </p>
                  <p className="text-xs text-muted-foreground">منذ 5 دقائق</p>
                </div>
              </div>
              
              <div className="flex items-start gap-4">
                <div className="relative flex h-8 w-8 shrink-0 overflow-hidden rounded-full">
                  <div className="flex h-full w-full items-center justify-center rounded-full bg-muted">
                    فع
                  </div>
                </div>
                <div className="flex-1 space-y-1">
                  <p className="text-sm">
                    <span className="font-medium">فاطمة علي</span> أكملت صفقة بقيمة $2,500
                  </p>
                  <p className="text-xs text-muted-foreground">منذ 15 دقيقة</p>
                </div>
              </div>

              <div className="flex items-start gap-4">
                <div className="relative flex h-8 w-8 shrink-0 overflow-hidden rounded-full">
                  <div className="flex h-full w-full items-center justify-center rounded-full bg-muted">
                    مح
                  </div>
                </div>
                <div className="flex-1 space-y-1">
                  <p className="text-sm">
                    <span className="font-medium">محمد حسن</span> رد على استفسار عميل
                  </p>
                  <p className="text-xs text-muted-foreground">منذ 30 دقيقة</p>
                </div>
              </div>

              <button className="w-full mt-4 inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-md px-4 py-2 text-sm font-medium border bg-background text-foreground hover:bg-accent hover:text-accent-foreground">
                عرض جميع النشاطات
              </button>
            </div>
          </div>
        </div>

        {/* Quick Actions */}
        <div className="space-y-6">
          <div className="rounded-lg border bg-card text-card-foreground shadow-sm">
            <div className="flex flex-col space-y-1.5 p-6">
              <h3 className="font-semibold leading-none tracking-tight">
                إجراءات سريعة
              </h3>
            </div>
            <div className="p-6 pt-0 space-y-3">
              <button className="w-full justify-start inline-flex items-center gap-2 whitespace-nowrap rounded-md px-4 py-2 text-sm font-medium border bg-background text-foreground hover:bg-accent hover:text-accent-foreground">
                <Users className="h-4 w-4" />
                إضافة عميل جديد
              </button>
              <button className="w-full justify-start inline-flex items-center gap-2 whitespace-nowrap rounded-md px-4 py-2 text-sm font-medium border bg-background text-foreground hover:bg-accent hover:text-accent-foreground">
                <MessageCircle className="h-4 w-4" />
                إنشاء تذكرة دعم
              </button>
              <button className="w-full justify-start inline-flex items-center gap-2 whitespace-nowrap rounded-md px-4 py-2 text-sm font-medium border bg-background text-foreground hover:bg-accent hover:text-accent-foreground">
                <TrendingUp className="h-4 w-4" />
                عرض التقارير
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};