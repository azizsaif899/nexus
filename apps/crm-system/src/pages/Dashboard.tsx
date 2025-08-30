import React from 'react';
import { Users, Target, TrendingUp, DollarSign, Plus, ArrowUp, ArrowDown } from 'lucide-react';

export default function Dashboard() {
  const stats = [
    {
      name: 'إجمالي العملاء',
      value: '1,234',
      change: '+12%',
      trend: 'up',
      icon: Users,
      color: 'blue'
    },
    {
      name: 'العملاء المحتملين',
      value: '89',
      change: '+8%',
      trend: 'up',
      icon: Target,
      color: 'green'
    },
    {
      name: 'الإيرادات الشهرية',
      value: '125,000 ريال',
      change: '-3%',
      trend: 'down',
      icon: DollarSign,
      color: 'purple'
    },
    {
      name: 'معدل التحويل',
      value: '24%',
      change: '+5%',
      trend: 'up',
      icon: TrendingUp,
      color: 'orange'
    }
  ];

  const recentActivities = [
    { id: 1, type: 'عميل جديد', name: 'أحمد محمد', time: 'منذ 5 دقائق' },
    { id: 2, type: 'صفقة مغلقة', name: 'شركة التقنية', time: 'منذ 15 دقيقة' },
    { id: 3, type: 'مكالمة متابعة', name: 'سارة أحمد', time: 'منذ 30 دقيقة' },
    { id: 4, type: 'عميل محتمل جديد', name: 'محمد علي', time: 'منذ ساعة' },
  ];

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">لوحة التحكم</h1>
          <p className="text-gray-600">مرحباً بك، إليك نظرة عامة على أداء CRM</p>
        </div>
        <div className="flex space-x-3 space-x-reverse">
          <button className="btn-primary flex items-center">
            <Plus className="h-4 w-4 ml-2" />
            إضافة عميل
          </button>
          <button className="btn-secondary">تصدير التقرير</button>
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat) => (
          <div key={stat.name} className="card">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">{stat.name}</p>
                <p className="text-2xl font-bold text-gray-900">{stat.value}</p>
                <div className="flex items-center mt-1">
                  {stat.trend === 'up' ? (
                    <ArrowUp className="h-4 w-4 text-green-500" />
                  ) : (
                    <ArrowDown className="h-4 w-4 text-red-500" />
                  )}
                  <span className={`text-sm font-medium ${
                    stat.trend === 'up' ? 'text-green-600' : 'text-red-600'
                  }`}>
                    {stat.change}
                  </span>
                </div>
              </div>
              <div className={`p-3 rounded-full bg-${stat.color}-100`}>
                <stat.icon className={`h-6 w-6 text-${stat.color}-600`} />
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Sales Pipeline Chart */}
        <div className="card">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">مسار المبيعات</h3>
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-sm text-gray-600">عملاء محتملين جدد</span>
              <div className="flex items-center">
                <div className="w-32 bg-gray-200 rounded-full h-2 ml-3">
                  <div className="bg-blue-600 h-2 rounded-full" style={{ width: '75%' }}></div>
                </div>
                <span className="text-sm font-medium">45</span>
              </div>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm text-gray-600">مؤهلين</span>
              <div className="flex items-center">
                <div className="w-32 bg-gray-200 rounded-full h-2 ml-3">
                  <div className="bg-green-600 h-2 rounded-full" style={{ width: '60%' }}></div>
                </div>
                <span className="text-sm font-medium">32</span>
              </div>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm text-gray-600">عروض أسعار</span>
              <div className="flex items-center">
                <div className="w-32 bg-gray-200 rounded-full h-2 ml-3">
                  <div className="bg-yellow-600 h-2 rounded-full" style={{ width: '40%' }}></div>
                </div>
                <span className="text-sm font-medium">18</span>
              </div>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm text-gray-600">صفقات مغلقة</span>
              <div className="flex items-center">
                <div className="w-32 bg-gray-200 rounded-full h-2 ml-3">
                  <div className="bg-purple-600 h-2 rounded-full" style={{ width: '25%' }}></div>
                </div>
                <span className="text-sm font-medium">12</span>
              </div>
            </div>
          </div>
        </div>

        {/* Recent Activities */}
        <div className="card">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">الأنشطة الأخيرة</h3>
          <div className="space-y-4">
            {recentActivities.map((activity) => (
              <div key={activity.id} className="flex items-center space-x-3 space-x-reverse">
                <div className="w-2 h-2 bg-blue-600 rounded-full"></div>
                <div className="flex-1">
                  <p className="text-sm font-medium text-gray-900">{activity.type}</p>
                  <p className="text-sm text-gray-600">{activity.name}</p>
                </div>
                <span className="text-xs text-gray-500">{activity.time}</span>
              </div>
            ))}
          </div>
          <button className="w-full mt-4 text-sm text-blue-600 hover:text-blue-800 font-medium">
            عرض جميع الأنشطة
          </button>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="card">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">إجراءات سريعة</h3>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <button className="p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors">
            <Users className="h-8 w-8 text-blue-600 mx-auto mb-2" />
            <span className="text-sm font-medium">إضافة عميل</span>
          </button>
          <button className="p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors">
            <Target className="h-8 w-8 text-green-600 mx-auto mb-2" />
            <span className="text-sm font-medium">عميل محتمل جديد</span>
          </button>
          <button className="p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors">
            <TrendingUp className="h-8 w-8 text-purple-600 mx-auto mb-2" />
            <span className="text-sm font-medium">إنشاء حملة</span>
          </button>
          <button className="p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors">
            <DollarSign className="h-8 w-8 text-orange-600 mx-auto mb-2" />
            <span className="text-sm font-medium">تقرير المبيعات</span>
          </button>
        </div>
      </div>
    </div>
  );
}