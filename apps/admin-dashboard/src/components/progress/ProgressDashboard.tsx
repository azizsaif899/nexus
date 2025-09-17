import React, { useState, useEffect } from 'react';

interface DayProgress {
  day: number;
  title: string;
  completed: number;
  total: number;
  percentage: number;
  status: string;
}

export const ProgressDashboard: React.FC = () => {
  const [progress, setProgress] = useState<DayProgress[]>([
    { day: 10, title: 'نظام الاختبارات الشامل', completed: 4, total: 13, percentage: 30.8, status: 'completed' },
    { day: 11, title: 'نظام النشر والتوزيع', completed: 5, total: 12, percentage: 41.7, status: 'completed' },
    { day: 12, title: 'نظام التحليلات والذكاء التجاري', completed: 6, total: 11, percentage: 54.5, status: 'completed' }
  ]);

  const overallStats = {
    totalTasks: 36,
    completedTasks: 15,
    percentage: 41.7
  };

  return (
    <div className="p-6">
      <h1 className="text-3xl font-bold mb-8">لوحة تتبع التقدم</h1>

      <div className="bg-white rounded-lg shadow p-6 mb-8">
        <h2 className="text-xl font-semibold mb-4">التقدم الإجمالي</h2>
        
        <div className="grid grid-cols-3 gap-6 mb-6">
          <div className="text-center">
            <div className="text-3xl font-bold text-blue-600">{overallStats.completedTasks}</div>
            <div className="text-sm text-gray-500">المهام المكتملة</div>
          </div>
          <div className="text-center">
            <div className="text-3xl font-bold text-gray-600">{overallStats.totalTasks}</div>
            <div className="text-sm text-gray-500">إجمالي المهام</div>
          </div>
          <div className="text-center">
            <div className="text-3xl font-bold text-green-600">{overallStats.percentage}%</div>
            <div className="text-sm text-gray-500">نسبة الإنجاز</div>
          </div>
        </div>

        <div className="w-full bg-gray-200 rounded-full h-3">
          <div 
            className="bg-blue-600 h-3 rounded-full"
            style={{ width: `${overallStats.percentage}%` }}
          ></div>
        </div>
      </div>

      <div className="bg-white rounded-lg shadow">
        <div className="p-6 border-b">
          <h2 className="text-xl font-semibold">التقدم اليومي</h2>
        </div>
        
        {progress.map((day) => (
          <div key={day.day} className="p-6 border-b last:border-b-0">
            <div className="flex justify-between items-center mb-4">
              <div>
                <h3 className="text-lg font-medium">اليوم {day.day}: {day.title}</h3>
                <p className="text-sm text-gray-500">{day.completed} من {day.total} مهام</p>
              </div>
              <div className="text-lg font-semibold">{day.percentage.toFixed(1)}%</div>
            </div>
            
            <div className="w-full bg-gray-200 rounded-full h-2">
              <div 
                className="bg-green-500 h-2 rounded-full"
                style={{ width: `${day.percentage}%` }}
              ></div>
            </div>
          </div>
        ))}
      </div>

      <div className="mt-8 grid grid-cols-4 gap-6">
        <div className="bg-red-50 rounded-lg p-6">
          <p className="text-sm font-medium text-red-600">حرجة</p>
          <p className="text-2xl font-bold text-red-900">9/9</p>
          <div className="w-full bg-red-200 rounded-full h-2 mt-2">
            <div className="bg-red-500 h-2 rounded-full w-full"></div>
          </div>
        </div>

        <div className="bg-yellow-50 rounded-lg p-6">
          <p className="text-sm font-medium text-yellow-600">عالية</p>
          <p className="text-2xl font-bold text-yellow-900">6/15</p>
          <div className="w-full bg-yellow-200 rounded-full h-2 mt-2">
            <div className="bg-yellow-500 h-2 rounded-full" style={{ width: '40%' }}></div>
          </div>
        </div>

        <div className="bg-blue-50 rounded-lg p-6">
          <p className="text-sm font-medium text-blue-600">متوسطة</p>
          <p className="text-2xl font-bold text-blue-900">0/8</p>
          <div className="w-full bg-blue-200 rounded-full h-2 mt-2">
            <div className="bg-blue-500 h-2 rounded-full w-0"></div>
          </div>
        </div>

        <div className="bg-green-50 rounded-lg p-6">
          <p className="text-sm font-medium text-green-600">منخفضة</p>
          <p className="text-2xl font-bold text-green-900">0/4</p>
          <div className="w-full bg-green-200 rounded-full h-2 mt-2">
            <div className="bg-green-500 h-2 rounded-full w-0"></div>
          </div>
        </div>
      </div>
    </div>
  );
};