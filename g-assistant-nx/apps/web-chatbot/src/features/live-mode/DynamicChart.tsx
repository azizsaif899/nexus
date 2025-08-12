import React from 'react';

interface ChartData {
  label: string;
  value: number;
}

interface DynamicChartProps {
  data: ChartData[];
  type?: 'bar' | 'line' | 'pie';
}

export const DynamicChart: React.FC<DynamicChartProps> = ({ data, type = 'bar' }) => {
  if (!data || data.length === 0) {
    return <div className="chart-placeholder">📊 لا توجد بيانات للعرض</div>;
  }

  const maxValue = Math.max(...data.map(d => d.value));

  return (
    <div className="dynamic-chart">
      <h4>📊 {type === 'bar' ? 'رسم بياني شريطي' : 'رسم بياني'}</h4>
      <div className="chart-container">
        {data.map((item, index) => (
          <div key={index} className="chart-item">
            <div className="chart-label">{item.label}</div>
            <div className="chart-bar">
              <div 
                className="chart-fill"
                style={{ 
                  width: `${(item.value / maxValue) * 100}%`,
                  backgroundColor: `hsl(${index * 60}, 70%, 50%)`
                }}
              />
            </div>
            <div className="chart-value">{item.value}</div>
          </div>
        ))}
      </div>
    </div>
  );
};