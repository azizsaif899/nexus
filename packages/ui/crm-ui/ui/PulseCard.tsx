import React from 'react';

interface PulseCardProps {
  type: 'opportunity' | 'risk' | 'trend';
  title: string;
  description: string;
  action?: string;
  priority: 'high' | 'medium' | 'low';
  onActionClick?: () => void;
}

export const PulseCard: React.FC<PulseCardProps> = ({
  type,
  title,
  description,
  action,
  priority,
  onActionClick
}) => {
  const getTypeConfig = () => {
    switch (type) {
      case 'opportunity':
        return {
          icon: '🚀',
          color: '#4CAF50',
          bgColor: '#4CAF5010'
        };
      case 'risk':
        return {
          icon: '⚠️',
          color: '#f44336',
          bgColor: '#f4433610'
        };
      case 'trend':
        return {
          icon: '📈',
          color: '#2196F3',
          bgColor: '#2196F310'
        };
    }
  };

  const getPriorityColor = () => {
    switch (priority) {
      case 'high': return '#f44336';
      case 'medium': return '#FF9800';
      case 'low': return '#4CAF50';
    }
  };

  const config = getTypeConfig();

  return (
    <div
      className="pulse-card"
      style={{
        background: 'white',
        border: `2px solid ${config.color}30`,
        borderRadius: '12px',
        padding: '20px',
        boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)',
        transition: 'transform 0.2s ease, box-shadow 0.2s ease'
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
      {/* Header */}
      <div style={{ 
        display: 'flex', 
        alignItems: 'center', 
        justifyContent: 'space-between',
        marginBottom: '12px'
      }}>
        <div style={{ display: 'flex', alignItems: 'center' }}>
          <span style={{ fontSize: '20px', marginRight: '8px' }}>{config.icon}</span>
          <span style={{
            fontSize: '12px',
            fontWeight: '600',
            color: config.color,
            textTransform: 'uppercase',
            letterSpacing: '0.5px'
          }}>
            {type === 'opportunity' ? 'فرصة' : type === 'risk' ? 'خطر' : 'اتجاه'}
          </span>
        </div>
        
        <span style={{
          fontSize: '10px',
          fontWeight: '600',
          color: getPriorityColor(),
          background: `${getPriorityColor()}20`,
          padding: '4px 8px',
          borderRadius: '8px',
          textTransform: 'uppercase'
        }}>
          {priority === 'high' ? 'عالي' : priority === 'medium' ? 'متوسط' : 'منخفض'}
        </span>
      </div>

      {/* Title */}
      <h3 style={{
        fontSize: '16px',
        fontWeight: 'bold',
        color: '#333',
        margin: '0 0 12px 0',
        lineHeight: '1.4'
      }}>
        {title}
      </h3>

      {/* Description */}
      <p style={{
        fontSize: '14px',
        color: '#666',
        lineHeight: '1.5',
        margin: '0 0 16px 0'
      }}>
        {description}
      </p>

      {/* Action Button */}
      {action && (
        <button
          onClick={onActionClick}
          style={{
            background: config.color,
            color: 'white',
            border: 'none',
            padding: '10px 16px',
            borderRadius: '8px',
            fontSize: '14px',
            fontWeight: '600',
            cursor: 'pointer',
            transition: 'background-color 0.2s ease',
            width: '100%'
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.opacity = '0.9';
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.opacity = '1';
          }}
        >
          {action}
        </button>
      )}
    </div>
  );
};