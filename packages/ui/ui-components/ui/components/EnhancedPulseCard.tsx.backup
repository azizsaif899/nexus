/**
 * 🎛️ Enhanced Pulse Card - TASK-017
 * بطاقات Pulse محسنة مع محاكي مدمج
 */

import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { SimulationEngine, SimulationResult } from '../../../../packages/core-logic/src/simulation-engine';
import { InteractiveSlider } from './InteractiveSlider';

interface PulseCardData {
  id: string;
  title: string;
  value: number;
  unit: string;
  icon: string;
  type: 'opportunity' | 'risk' | 'metric';
  trend: 'up' | 'down' | 'stable';
  aiInsight: string;
  simulationEnabled: boolean;
  scenarioId?: string;
}

interface EnhancedPulseCardProps {
  data: PulseCardData;
  onSimulate?: (result: SimulationResult) => void;
}

export const EnhancedPulseCard: React.FC<EnhancedPulseCardProps> = ({ 
  data, 
  onSimulate 
}) => {
  const [isSimulating, setIsSimulating] = useState(false);
  const [simulationResult, setSimulationResult] = useState<SimulationResult | null>(null);
  const [sliderValue, setSliderValue] = useState(0);
  const [simulationEngine] = useState(() => new SimulationEngine());

  // تشغيل المحاكاة
  const runSimulation = async (parameters: Record<string, number>) => {
    if (!data.scenarioId) return;

    setIsSimulating(true);
    try {
      const result = await simulationEngine.runSimulation(data.scenarioId, parameters);
      setSimulationResult(result);
      onSimulate?.(result);
    } catch (error) {
      console.error('❌ Simulation failed:', error);
    } finally {
      setIsSimulating(false);
    }
  };

  // معالجة تغيير الشريط
  const handleSliderChange = async (value: number) => {
    setSliderValue(value);
    
    if (data.simulationEnabled && data.scenarioId) {
      const parameters = { adjustment: value };
      await runSimulation(parameters);
    }
  };

  // حساب القيمة المحاكاة
  const getSimulatedValue = (): number => {
    if (!simulationResult) return data.value;
    
    const impact = simulationResult.impact;
    const baseValue = data.value;
    
    switch (data.type) {
      case 'opportunity':
        return baseValue + impact.revenue;
      case 'risk':
        return baseValue + Math.abs(impact.costs);
      default:
        return baseValue + impact.profit;
    }
  };

  // الحصول على لون البطاقة
  const getCardColor = () => {
    switch (data.type) {
      case 'opportunity':
        return 'border-green-500 bg-green-50';
      case 'risk':
        return 'border-red-500 bg-red-50';
      default:
        return 'border-blue-500 bg-blue-50';
    }
  };

  // الحصول على أيقونة الاتجاه
  const getTrendIcon = () => {
    if (simulationResult) {
      const change = getSimulatedValue() - data.value;
      if (change > 0) return '📈';
      if (change < 0) return '📉';
      return '➡️';
    }
    
    switch (data.trend) {
      case 'up': return '📈';
      case 'down': return '📉';
      default: return '➡️';
    }
  };

  return (
    <motion.div
      className={`rounded-xl shadow-lg p-6 border-l-4 ${getCardColor()}`}
      whileHover={{ scale: 1.02 }}
      transition={{ duration: 0.2 }}
    >
      {/* Header */}
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center space-x-3 rtl:space-x-reverse">
          <span className="text-2xl">{data.icon}</span>
          <h3 className="font-semibold text-gray-800">{data.title}</h3>
        </div>
        <div className="flex items-center space-x-2 rtl:space-x-reverse">
          <span className="text-lg">{getTrendIcon()}</span>
          {isSimulating && (
            <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-blue-500"></div>
          )}
        </div>
      </div>

      {/* Value Display */}
      <div className="mb-4">
        <div className="flex items-baseline space-x-2 rtl:space-x-reverse">
          <motion.span 
            className="text-3xl font-bold text-gray-900"
            key={getSimulatedValue()}
            initial={{ scale: 1.2, color: '#3b82f6' }}
            animate={{ scale: 1, color: '#111827' }}
            transition={{ duration: 0.3 }}
          >
            {getSimulatedValue().toLocaleString('ar-SA')}
          </motion.span>
          <span className="text-sm text-gray-500">{data.unit}</span>
        </div>

        {/* Change Indicator */}
        {simulationResult && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="mt-2"
          >
            <span className={`text-sm font-medium ${
              getSimulatedValue() > data.value ? 'text-green-600' : 'text-red-600'
            }`}>
              {getSimulatedValue() > data.value ? '+' : ''}
              {(getSimulatedValue() - data.value).toLocaleString('ar-SA')} {data.unit}
            </span>
            <span className="text-xs text-gray-500 mr-2">من المحاكاة</span>
          </motion.div>
        )}
      </div>

      {/* AI Insight */}
      <div className="bg-white rounded-lg p-3 mb-4">
        <div className="flex items-start space-x-2 rtl:space-x-reverse">
          <span className="text-sm">🧠</span>
          <p className="text-xs text-gray-700 leading-relaxed">
            {simulationResult?.recommendations?.[0] || data.aiInsight}
          </p>
        </div>
      </div>

      {/* Interactive Simulation */}
      {data.simulationEnabled && (
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-sm font-medium text-gray-700">محاكاة التأثير</span>
            <span className="text-xs text-gray-500">
              {sliderValue > 0 ? '+' : ''}{sliderValue}%
            </span>
          </div>
          
          <InteractiveSlider
            value={sliderValue}
            onChange={handleSliderChange}
            min={-50}
            max={100}
            step={5}
            disabled={isSimulating}
          />

          {/* Simulation Results */}
          {simulationResult && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              className="bg-gray-50 rounded-lg p-3 space-y-2"
            >
              <div className="flex items-center justify-between text-xs">
                <span>مستوى الثقة:</span>
                <span className="font-medium">
                  {(simulationResult.impact.confidence * 100).toFixed(0)}%
                </span>
              </div>
              <div className="flex items-center justify-between text-xs">
                <span>مستوى المخاطر:</span>
                <span className={`font-medium ${
                  simulationResult.impact.riskLevel === 'high' ? 'text-red-600' :
                  simulationResult.impact.riskLevel === 'medium' ? 'text-yellow-600' :
                  'text-green-600'
                }`}>
                  {simulationResult.impact.riskLevel === 'high' ? 'عالي' :
                   simulationResult.impact.riskLevel === 'medium' ? 'متوسط' : 'منخفض'}
                </span>
              </div>
            </motion.div>
          )}
        </div>
      )}

      {/* Action Button */}
      <div className="mt-4">
        <button
          className={`w-full py-2 px-4 rounded-lg text-sm font-medium transition-colors ${
            data.type === 'opportunity' 
              ? 'bg-green-600 text-white hover:bg-green-700'
              : data.type === 'risk'
              ? 'bg-red-600 text-white hover:bg-red-700'
              : 'bg-blue-600 text-white hover:bg-blue-700'
          }`}
          onClick={() => {
            if (simulationResult) {
              // Removed console.log
            }
          }}
          disabled={isSimulating}
        >
          {data.type === 'opportunity' ? 'اغتنام الفرصة' :
           data.type === 'risk' ? 'تخفيف المخاطر' : 'تطبيق التغيير'}
        </button>
      </div>
    </motion.div>
  );
};

// مجموعة بطاقات Pulse محسنة
export const EnhancedPulseGrid: React.FC = () => {
  const [pulseData] = useState<PulseCardData[]>([
    {
      id: 'revenue-opportunity',
      title: 'فرصة زيادة الإيرادات',
      value: 150000,
      unit: 'ريال',
      icon: '💰',
      type: 'opportunity',
      trend: 'up',
      aiInsight: 'زيادة الميزانية التسويقية بنسبة 20% قد تحقق عائد 150,000 ريال إضافي',
      simulationEnabled: true,
      scenarioId: 'marketing-boost'
    },
    {
      id: 'cost-risk',
      title: 'مخاطر زيادة التكاليف',
      value: 75000,
      unit: 'ريال',
      icon: '⚠️',
      type: 'risk',
      trend: 'up',
      aiInsight: 'ارتفاع أسعار المواد الخام قد يزيد التكاليف بـ 75,000 ريال',
      simulationEnabled: true,
      scenarioId: 'cost-increase'
    },
    {
      id: 'efficiency-metric',
      title: 'تحسين الكفاءة',
      value: 85,
      unit: '%',
      icon: '⚡',
      type: 'metric',
      trend: 'up',
      aiInsight: 'الكفاءة التشغيلية تحسنت بنسبة 15% هذا الشهر',
      simulationEnabled: true,
      scenarioId: 'efficiency-boost'
    }
  ]);

  const handleSimulation = (result: SimulationResult) => {
    // Removed console.log
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {pulseData.map((data, index) => (
        <motion.div
          key={data.id}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: index * 0.1 }}
        >
          <EnhancedPulseCard 
            data={data}
            onSimulate={handleSimulation}
          />
        </motion.div>
      ))}
    </div>
  );
};