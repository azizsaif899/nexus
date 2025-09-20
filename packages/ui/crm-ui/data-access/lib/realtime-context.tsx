'use client';

import { createContext, useContext, useEffect, useState } from 'react';

interface RealtimeContextType {
  isConnected: boolean;
  connectionStatus: 'connecting' | 'connected' | 'disconnected';
  lastUpdate: Date | null;
}

const RealtimeContext = createContext<RealtimeContextType>({
  isConnected: false,
  connectionStatus: 'disconnected',
  lastUpdate: null
});

export function RealtimeProvider({ children }: { children: React.ReactNode }) {
  const [isConnected, setIsConnected] = useState(false);
  const [connectionStatus, setConnectionStatus] = useState<'connecting' | 'connected' | 'disconnected'>('disconnected');
  const [lastUpdate, setLastUpdate] = useState<Date | null>(null);

  useEffect(() => {
    // Simulate WebSocket connection
    setConnectionStatus('connecting');
    
    const timer = setTimeout(() => {
      setIsConnected(true);
      setConnectionStatus('connected');
      setLastUpdate(new Date());
    }, 2000);

    // Simulate periodic updates
    const updateTimer = setInterval(() => {
      if (isConnected) {
        setLastUpdate(new Date());
      }
    }, 10000);

    return () => {
      clearTimeout(timer);
      clearInterval(updateTimer);
    };
  }, [isConnected]);

  return (
    <RealtimeContext.Provider value={{
      isConnected,
      connectionStatus,
      lastUpdate
    }}>
      {children}
    </RealtimeContext.Provider>
  );
}

export const useRealtime = () => useContext(RealtimeContext);