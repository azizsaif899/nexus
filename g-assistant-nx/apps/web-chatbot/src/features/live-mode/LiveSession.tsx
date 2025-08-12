import React, { useState, useEffect } from 'react';

interface LiveSessionProps {
  sessionId: string;
  userId: string;
}

export const LiveSession: React.FC<LiveSessionProps> = ({ sessionId, userId }) => {
  const [isConnected, setIsConnected] = useState(false);
  const [chartData, setChartData] = useState<any[]>([]);

  useEffect(() => {
    const ws = new WebSocket(`ws://localhost:3000/live/${sessionId}`);
    
    ws.onopen = () => setIsConnected(true);
    ws.onclose = () => setIsConnected(false);
    ws.onmessage = (event) => {
      const data = JSON.parse(event.data);
      if (data.type === 'chart-update') {
        setChartData(data.payload);
      }
    };

    return () => ws.close();
  }, [sessionId]);

  return (
    <div className="live-session">
      <div className={`status ${isConnected ? 'connected' : 'disconnected'}`}>
        {isConnected ? '🟢 متصل' : '🔴 غير متصل'}
      </div>
      <div className="live-content">
        <h3>🔴 Live Session: {sessionId}</h3>
        <div className="chart-container">
          {chartData.length > 0 && (
            <div>📊 Chart Data: {JSON.stringify(chartData)}</div>
          )}
        </div>
      </div>
    </div>
  );
};