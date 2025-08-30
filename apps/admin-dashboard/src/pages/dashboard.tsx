import React from 'react';

export default function Dashboard() {
  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4">🚀 لوحة التحكم الرئيسية</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <div className="bg-white p-6 rounded-lg shadow">
          <h2 className="text-lg font-semibold mb-2">📊 الإحصائيات</h2>
          <p className="text-gray-600">عرض الإحصائيات العامة للنظام</p>
        </div>
        <div className="bg-white p-6 rounded-lg shadow">
          <h2 className="text-lg font-semibold mb-2">👥 المستخدمين</h2>
          <p className="text-gray-600">إدارة المستخدمين والصلاحيات</p>
        </div>
        <div className="bg-white p-6 rounded-lg shadow">
          <h2 className="text-lg font-semibold mb-2">⚙️ الإعدادات</h2>
          <p className="text-gray-600">تكوين النظام والإعدادات</p>
        </div>
      </div>
    </div>
  );
}