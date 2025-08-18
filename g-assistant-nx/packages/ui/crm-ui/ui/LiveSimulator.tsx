import React, { useState, useEffect } from 'react';

interface SimulationResult {
  metric: string;
  currentValue: number;
  projectedValue: number;
  change: number;
  changePercent: number;
}

interface LiveSimulatorProps {
  cardId: string;
  title: string;
  description: string;
  baseMetrics: { [key: string]: number };
  onSimulate?: (results: SimulationResult[]) => void;
}

export const LiveSimulator: React.FC<LiveSimulatorProps> = ({
  cardId,
  title,
  description,
  baseMetrics,
  onSimulate
}) => {
  const [sliderValue, setSliderValue] = useState(0);
  const [simulationResults, setSimulationResults] = useState<SimulationResult[]>([]);
  const [isSimulating, setIsSimulating] = useState(false);

  // محاكاة التأثير عند تغيير القيمة
  useEffect(() => {
    if (sliderValue === 0) {
      setSimulationResults([]);
      return;
    }

    const simulateImpact = async () => {
      setIsSimulating(true);
      
      try {
        // محاكاة محلية للتأثير
        const results = calculateImpact(sliderValue, baseMetrics);
        setSimulationResults(results);
        
        if (onSimulate) {
          onSimulate(results);
        }
        
        // يمكن إضافة استدعاء API للمحاكاة المتقدمة
        // const response = await fetch('/api/pulse/simulate', {
        //   method: 'POST',
        //   headers: { 'Content-Type': 'application/json' },
        //   body: JSON.stringify({ cardId, deltaPct: sliderValue })
        // });
        
      } catch (error) {
        console.error('Simulation error:', error);
      } finally {
        setIsSimulating(false);
      }
    };

    const timeoutId = setTimeout(simulateImpact, 300); // debounce
    return () => clearTimeout(timeoutId);
  }, [sliderValue, baseMetrics, cardId, onSimulate]);

  // حساب التأثير المحلي
  const calculateImpact = (changePct: number, metrics: { [key: string]: number }): SimulationResult[] => {
    const results: SimulationResult[] = [];
    
    Object.entries(metrics).forEach(([metric, currentValue]) => {
      let impactMultiplier = 1;
      
      // تحديد مضاعف التأثير حسب نوع المقياس
      switch (metric) {
        case 'leads':
          impactMultiplier = 0.8; // زيادة الميزانية تؤثر بنسبة 80% على العملاء المحتملين
          break;
        case 'revenue':
          impactMultiplier = 0.6; // تأثير أقل على الإيرادات
          break;
        case 'conversion_rate':
          impactMultiplier = 0.3; // تأثير محدود على معدل التحويل
          break;
        case 'cost_per_lead':
          impactMultiplier = -0.4; // زيادة الميزانية تقلل تكلفة العميل المحتمل
          break;
        default:
          impactMultiplier = 0.5;
      }
      
      const change = currentValue * (changePct / 100) * impactMultiplier;
      const projectedValue = currentValue + change;
      
      results.push({
        metric,
        currentValue,
        projectedValue,
        change,
        changePercent: (change / currentValue) * 100
      });
    });
    
    return results;
  };

  const getMetricDisplayName = (metric: string) => {
    const names = {
      leads: 'العملاء المحتملين',
      revenue: 'الإيرادات المتوقعة',
      conversion_rate: 'معدل التحويل',
      cost_per_lead: 'تكلفة العميل المحتمل',
      opportunities: 'الفرص البيعية'
    };
    return names[metric] || metric;
  };

  const formatValue = (metric: string, value: number) => {
    switch (metric) {
      case 'revenue':
        return `${(value / 1000).toFixed(0)}K ريال`;
      case 'cost_per_lead':
        return `${value.toFixed(0)} ريال`;
      case 'conversion_rate':
        return `${value.toFixed(1)}%`;
      default:
        return Math.round(value).toLocaleString();
    }
  };

  return (
    <div className="live-simulator" style={{
      background: 'white',
      border: '2px solid #e3f2fd',
      borderRadius: '12px',
      padding: '20px',
      marginTop: '16px'
    }}>
      {/* Header */}
      <div style={{ marginBottom: '20px' }}>
        <h3 style={{
          fontSize: '16px',
          fontWeight: 'bold',
          color: '#1976d2',
          margin: '0 0 8px 0'
        }}>
          🎮 محاكي التأثير الفوري
        </h3>
        <p style={{
          fontSize: '14px',
          color: '#666',
          margin: 0
        }}>
          {description}
        </p>
      </div>

      {/* Slider */}
      <div style={{ marginBottom: '24px' }}>
        <div style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          marginBottom: '12px'
        }}>
          <label style={{
            fontSize: '14px',
            fontWeight: '600',
            color: '#333'
          }}>
            نسبة التغيير:
          </label>
          <span style={{
            fontSize: '16px',
            fontWeight: 'bold',
            color: sliderValue > 0 ? '#4CAF50' : sliderValue < 0 ? '#f44336' : '#666'
          }}>
            {sliderValue > 0 ? '+' : ''}{sliderValue}%
          </span>
        </div>
        
        <input
          type="range"
          min="-50"
          max="100"
          value={sliderValue}
          onChange={(e) => setSliderValue(Number(e.target.value))}
          style={{
            width: '100%',
            height: '6px',
            borderRadius: '3px',
            background: '#e0e0e0',
            outline: 'none',
            cursor: 'pointer'
          }}
        />
        
        <div style={{
          display: 'flex',
          justifyContent: 'space-between',
          fontSize: '12px',
          color: '#999',
          marginTop: '4px'
        }}>
          <span>-50%</span>
          <span>0%</span>
          <span>+100%</span>
        </div>
      </div>

      {/* Results */}
      {simulationResults.length > 0 && (
        <div>
          <h4 style={{
            fontSize: '14px',
            fontWeight: '600',
            color: '#333',
            margin: '0 0 12px 0'
          }}>
            النتائج المتوقعة:
          </h4>
          
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
            gap: '12px'
          }}>
            {simulationResults.map((result) => (
              <div
                key={result.metric}
                style={{
                  background: '#f8f9fa',
                  padding: '12px',
                  borderRadius: '8px',
                  border: '1px solid #e9ecef'
                }}
              >
                <div style={{
                  fontSize: '12px',
                  color: '#666',
                  marginBottom: '4px'
                }}>
                  {getMetricDisplayName(result.metric)}
                </div>
                
                <div style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between'
                }}>
                  <div>
                    <div style={{
                      fontSize: '14px',
                      fontWeight: 'bold',
                      color: '#333'
                    }}>
                      {formatValue(result.metric, result.projectedValue)}
                    </div>
                    <div style={{
                      fontSize: '11px',
                      color: '#999'
                    }}>
                      من {formatValue(result.metric, result.currentValue)}
                    </div>
                  </div>
                  
                  <div style={{
                    fontSize: '12px',
                    fontWeight: '600',
                    color: result.changePercent > 0 ? '#4CAF50' : '#f44336'
                  }}>
                    {result.changePercent > 0 ? '+' : ''}{result.changePercent.toFixed(1)}%
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Loading indicator */}
      {isSimulating && (
        <div style={{
          textAlign: 'center',
          padding: '20px',
          color: '#666',
          fontSize: '14px'
        }}>
          جاري حساب التأثير...
        </div>
      )}

      {/* Reset button */}
      {sliderValue !== 0 && (
        <button
          onClick={() => setSliderValue(0)}
          style={{
            marginTop: '16px',
            padding: '8px 16px',
            background: '#f5f5f5',
            border: '1px solid #ddd',
            borderRadius: '6px',
            fontSize: '12px',
            cursor: 'pointer',
            color: '#666'
          }}
        >
          إعادة تعيين
        </button>
      )}
    </div>
  );
};