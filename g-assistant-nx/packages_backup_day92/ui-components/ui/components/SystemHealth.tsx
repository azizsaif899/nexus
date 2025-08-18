import React from 'react';

interface HealthMetric {
  name: string;
  status: 'healthy' | 'warning' | 'critical';
  value: string;
}

const SystemHealth: React.FC = () => {
  const metrics: HealthMetric[] = [
    { name: 'CPU Usage', status: 'healthy', value: '45%' },
    { name: 'Memory Usage', status: 'healthy', value: '62%' },
    { name: 'Database', status: 'healthy', value: 'Connected' },
    { name: 'API Response', status: 'healthy', value: '120ms' }
  ];

  return (
    <div className="system-health">
      <h2>System Health</h2>
      {metrics.map((metric) => (
        <div key={metric.name} className={`metric ${metric.status}`}>
          <span>{metric.name}</span>
          <span>{metric.value}</span>
        </div>
      ))}
    </div>
  );
};

export default SystemHealth;