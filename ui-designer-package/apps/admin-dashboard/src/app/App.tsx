import React from 'react';

export default function App() {
  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white shadow">
        <div className="max-w-7xl mx-auto py-6 px-4">
          <h1 className="text-3xl font-bold text-gray-900">
            🎛️ لوحة التحكم الإدارية
          </h1>
        </div>
      </header>
      
      <main className="max-w-7xl mx-auto py-6 px-4">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <div className="bg-white p-6 rounded-lg shadow">
            <h2 className="text-xl font-semibold mb-4">📊 الإحصائيات</h2>
            <p className="text-gray-600">عرض الإحصائيات الرئيسية</p>
          </div>
          
          <div className="bg-white p-6 rounded-lg shadow">
            <h2 className="text-xl font-semibold mb-4">👥 المستخدمون</h2>
            <p className="text-gray-600">إدارة المستخدمين</p>
          </div>
          
          <div className="bg-white p-6 rounded-lg shadow">
            <h2 className="text-xl font-semibold mb-4">⚙️ الإعدادات</h2>
            <p className="text-gray-600">إعدادات النظام</p>
          </div>
        </div>
      </main>
    </div>
  );
}