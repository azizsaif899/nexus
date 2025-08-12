import React, { useState, useEffect } from 'react';

interface ModelStats {
  name: string;
  usage: number;
  cost: number;
  avgResponseTime: number;
  successRate: number;
}

export const ModelSelectionStats: React.FC = () => {
  const [stats, setStats] = useState<ModelStats[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const mockStats: ModelStats[] = [
      {
        name: 'gemini-1.5-flash',
        usage: 1250,
        cost: 125.50,
        avgResponseTime: 1.2,
        successRate: 98.5
      },
      {
        name: 'gemini-1.5-pro',
        usage: 450,
        cost: 225.75,
        avgResponseTime: 2.8,
        successRate: 99.2
      },
      {
        name: 'gemini-2.0-flash-exp',
        usage: 800,
        cost: 160.00,
        avgResponseTime: 1.5,
        successRate: 97.8
      }
    ];

    setStats(mockStats);
    setLoading(false);
  }, []);

  if (loading) {
    return <div>🔄 جارٍ تحميل إحصائيات النماذج...</div>;
  }

  const totalCost = stats.reduce((sum, stat) => sum + stat.cost, 0);
  const mostUsed = stats.reduce((prev, current) => 
    prev.usage > current.usage ? prev : current
  );

  return (
    <div className="model-selection-stats">
      <h2>📊 إحصائيات اختيار النماذج</h2>
      
      <div className="summary">
        <div>💰 إجمالي التكلفة: ${totalCost.toFixed(2)}</div>
        <div>🏆 الأكثر استخداماً: {mostUsed.name}</div>
      </div>

      <table>
        <thead>
          <tr>
            <th>النموذج</th>
            <th>الاستخدامات</th>
            <th>التكلفة</th>
            <th>الاستجابة (ث)</th>
            <th>النجاح (%)</th>
          </tr>
        </thead>
        <tbody>
          {stats.map((stat) => (
            <tr key={stat.name}>
              <td>{stat.name}</td>
              <td>{stat.usage}</td>
              <td>${stat.cost.toFixed(2)}</td>
              <td>{stat.avgResponseTime}s</td>
              <td>{stat.successRate}%</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};