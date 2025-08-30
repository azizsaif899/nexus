import React from 'react';

interface StatCardProps {
  title: string;
  value: string | number;
  icon: string;
  trend?: string;
  color: string;
}

export const StatCard: React.FC<StatCardProps> = ({ 
  title, 
  value, 
  icon, 
  trend, 
  color 
}) => {
  return (
    <div 
      className="stat-card"
      style={{
        background: 'white',
        padding: '24px',
        borderRadius: '12px',
        boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)',
        border: `2px solid ${color}20`,
        transition: 'transform 0.2s ease, box-shadow 0.2s ease',
        cursor: 'pointer'
      }}
      onMouseEnter={(e) => {
        e.currentTarget.style.transform = 'translateY(-2px)';
        e.currentTarget.style.boxShadow = '0 8px 15px rgba(0, 0, 0, 0.15)';
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.transform = 'translateY(0)';
        e.currentTarget.style.boxShadow = '0 4px 6px rgba(0, 0, 0, 0.1)';
      }}
    >
      <div style={{ display: 'flex', alignItems: 'center', marginBottom: '12px' }}>
        <span style={{ fontSize: '24px', marginRight: '12px' }}>{icon}</span>
        <h3 style={{ 
          fontSize: '14px', 
          color: '#666', 
          margin: 0,
          fontWeight: '500'
        }}>
          {title}
        </h3>
      </div>
      
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <span style={{ 
          fontSize: '28px', 
          fontWeight: 'bold', 
          color: color,
          lineHeight: '1'
        }}>
          {typeof value === 'number' ? value.toLocaleString() : value}
        </span>
        
        {trend && (
          <span style={{ 
            fontSize: '12px', 
            color: trend.startsWith('+') ? '#4CAF50' : '#f44336',
            background: trend.startsWith('+') ? '#4CAF5020' : '#f4433620',
            padding: '4px 8px',
            borderRadius: '12px',
            fontWeight: '600'
          }}>
            {trend}
          </span>
        )}
      </div>
    </div>
  );
};