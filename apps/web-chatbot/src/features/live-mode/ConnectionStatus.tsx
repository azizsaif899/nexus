import React from 'react';

interface ConnectionStatusProps {
  isConnected: boolean;
}

export const ConnectionStatus: React.FC<ConnectionStatusProps> = ({ isConnected }) => {
  return (
    <div className={`connection-status ${isConnected ? 'connected' : 'disconnected'}`}>
      <span className="status-indicator">
        {isConnected ? '🟢' : '🔴'}
      </span>
      <span className="status-text">
        {isConnected ? 'متصل' : 'غير متصل'}
      </span>
      {!isConnected && (
        <span className="reconnecting">🔄 محاولة إعادة الاتصال...</span>
      )}
    </div>
  );
};