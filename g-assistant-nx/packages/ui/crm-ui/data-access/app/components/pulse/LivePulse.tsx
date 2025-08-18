'use client';

import { motion } from 'framer-motion';
import { Activity, TrendingUp, Users, DollarSign, Zap, AlertTriangle } from 'lucide-react';
import { useLivePulse } from '../../hooks/useLivePulse';

export function LivePulse() {
  const { 
    metrics, 
    isLoading, 
    lastUpdate, 
    isConnected, 
    healthStatus, 
    revenueProgress, 
    activeAlerts 
  } = useLivePulse();

  if (isLoading) {
    return (
      <div className="bg-white rounded-lg shadow-sm border p-6">
        <div className="animate-pulse">
          <div className="h-6 bg-gray-200 rounded w-1/3 mb-4"></div>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {[...Array(4)].map((_, i) => (
              <div key={i} className="h-20 bg-gray-200 rounded"></div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  const getHealthColor = () => {
    switch (healthStatus) {
      case 'excellent': return 'text-green-600 bg-green-100';
      case 'good': return 'text-blue-600 bg-blue-100';
      case 'warning': return 'text-yellow-600 bg-yellow-100';
      case 'critical': return 'text-red-600 bg-red-100';
    }
  };

  const getHealthLabel = () => {
    switch (healthStatus) {
      case 'excellent': return 'ممتاز';
      case 'good': return 'جيد';
      case 'warning': return 'تحذير';
      case 'critical': return 'حرج';
    }
  };

  return (
    <div className="bg-white rounded-lg shadow-sm border">
      {/* رأس النبض */}
      <div className="p-6 border-b">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="relative">
              <Activity className="w-6 h-6 text-blue-600" />
              <motion.div
                animate={{ scale: [1, 1.2, 1] }}
                transition={{ duration: 2, repeat: Infinity }}
                className={`absolute -top-1 -right-1 w-3 h-3 rounded-full ${
                  isConnected ? 'bg-green-500' : 'bg-red-500'
                }`}
              />
            </div>
            <div>
              <h3 className="text-lg font-semibold text-gray-900">النبض الحي للشركة</h3>
              <p className="text-sm text-gray-600">
                آخر تحديث: {lastUpdate.toLocaleTimeString('ar-SA')}
              </p>
            </div>
          </div>
          
          <div className="flex items-center space-x-3">
            {activeAlerts > 0 && (
              <div className="flex items-center space-x-1 text-red-600">
                <AlertTriangle className="w-4 h-4" />
                <span className="text-sm font-medium">{activeAlerts} تنبيه</span>
              </div>
            )}
            
            <div className={`px-3 py-1 rounded-full text-sm font-medium ${getHealthColor()}`}>
              {getHealthLabel()}
            </div>
          </div>
        </div>
      </div>

      {/* مقاييس النبض */}
      <div className="p-6">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {/* الإيرادات */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="relative overflow-hidden"
          >
            <div className="bg-gradient-to-br from-green-50 to-green-100 rounded-lg p-4">
              <div className="flex items-center justify-between mb-3">
                <DollarSign className="w-8 h-8 text-green-600" />
                <div className={`text-xs px-2 py-1 rounded-full ${
                  metrics.revenue.trend === 'up' 
                    ? 'bg-green-200 text-green-800' 
                    : 'bg-red-200 text-red-800'
                }`}>
                  {metrics.revenue.change > 0 ? '+' : ''}{metrics.revenue.change.toFixed(1)}%
                </div>
              </div>
              
              <div className="space-y-2">
                <div className="text-2xl font-bold text-gray-900">
                  {(metrics.revenue.current / 1000000).toFixed(1)}M ريال
                </div>
                <div className="text-sm text-gray-600">
                  من {(metrics.revenue.target / 1000000).toFixed(1)}M هدف
                </div>
                
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <motion.div
                    initial={{ width: 0 }}
                    animate={{ width: `${revenueProgress}%` }}
                    transition={{ duration: 1 }}
                    className="bg-green-500 h-2 rounded-full"
                  />
                </div>
              </div>
            </div>
          </motion.div>

          {/* الصفقات */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
          >
            <div className="bg-gradient-to-br from-blue-50 to-blue-100 rounded-lg p-4">
              <div className="flex items-center justify-between mb-3">
                <TrendingUp className="w-8 h-8 text-blue-600" />
                <div className="text-xs text-blue-600 font-medium">
                  {metrics.deals.conversion.toFixed(1)}% تحويل
                </div>
              </div>
              
              <div className="space-y-2">
                <div className="text-2xl font-bold text-gray-900">
                  {metrics.deals.active}
                </div>
                <div className="text-sm text-gray-600">صفقة نشطة</div>
                
                <div className="flex justify-between text-xs text-gray-500">
                  <span>مغلقة: {metrics.deals.closed}</span>
                  <span>خط الأنابيب: {(metrics.deals.pipeline / 1000000).toFixed(1)}M</span>
                </div>
              </div>
            </div>
          </motion.div>

          {/* العملاء */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
          >
            <div className="bg-gradient-to-br from-purple-50 to-purple-100 rounded-lg p-4">
              <div className="flex items-center justify-between mb-3">
                <Users className="w-8 h-8 text-purple-600" />
                <div className="text-xs text-purple-600 font-medium">
                  +{metrics.customers.new} جديد
                </div>
              </div>
              
              <div className="space-y-2">
                <div className="text-2xl font-bold text-gray-900">
                  {metrics.customers.total}
                </div>
                <div className="text-sm text-gray-600">إجمالي العملاء</div>
                
                <div className="flex justify-between text-xs text-gray-500">
                  <span>نشط: {metrics.customers.active}</span>
                  <span>تسرب: {metrics.customers.churn.toFixed(1)}%</span>
                </div>
              </div>
            </div>
          </motion.div>

          {/* الفريق */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
          >
            <div className="bg-gradient-to-br from-orange-50 to-orange-100 rounded-lg p-4">
              <div className="flex items-center justify-between mb-3">
                <Zap className="w-8 h-8 text-orange-600" />
                <div className="text-xs text-orange-600 font-medium">
                  {metrics.team.performance.toFixed(0)}% أداء
                </div>
              </div>
              
              <div className="space-y-2">
                <div className="text-2xl font-bold text-gray-900">
                  {metrics.team.online}/{metrics.team.total}
                </div>
                <div className="text-sm text-gray-600">متصل الآن</div>
                
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <motion.div
                    initial={{ width: 0 }}
                    animate={{ width: `${metrics.team.activity}%` }}
                    transition={{ duration: 1, delay: 0.5 }}
                    className="bg-orange-500 h-2 rounded-full"
                  />
                </div>
              </div>
            </div>
          </motion.div>
        </div>

        {/* مؤشرات النظام */}
        <div className="mt-6 p-4 bg-gray-50 rounded-lg">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-center">
            <div>
              <div className="text-lg font-semibold text-gray-900">
                {metrics.system.health.toFixed(1)}%
              </div>
              <div className="text-xs text-gray-600">صحة النظام</div>
            </div>
            
            <div>
              <div className="text-lg font-semibold text-gray-900">
                {metrics.system.responseTime.toFixed(0)}ms
              </div>
              <div className="text-xs text-gray-600">زمن الاستجابة</div>
            </div>
            
            <div>
              <div className="text-lg font-semibold text-gray-900">
                {metrics.system.uptime}%
              </div>
              <div className="text-xs text-gray-600">وقت التشغيل</div>
            </div>
            
            <div>
              <div className="text-lg font-semibold text-gray-900">
                {metrics.system.errors}
              </div>
              <div className="text-xs text-gray-600">أخطاء</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}