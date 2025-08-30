'use client';

import { useEffect, useState, useCallback } from 'react';
import { wsClient } from '../lib/websocket-client';

export function useWebSocket() {
  const [connectionState, setConnectionState] = useState<string>('disconnected');
  const [lastMessage, setLastMessage] = useState<any>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const connectWS = async () => {
      try {
        await wsClient.connect();
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Connection failed');
      }
    };

    connectWS();

    // Subscribe to connection events
    const unsubscribeConnected = wsClient.subscribe('connected', () => {
      setConnectionState('connected');
      setError(null);
    });

    const unsubscribeDisconnected = wsClient.subscribe('disconnected', () => {
      setConnectionState('disconnected');
    });

    const unsubscribeError = wsClient.subscribe('error', ({ error }) => {
      setError(error.message || 'WebSocket error');
    });

    // Update connection state periodically
    const stateInterval = setInterval(() => {
      setConnectionState(wsClient.getConnectionState());
    }, 1000);

    return () => {
      unsubscribeConnected();
      unsubscribeDisconnected();
      unsubscribeError();
      clearInterval(stateInterval);
    };
  }, []);

  const subscribe = useCallback((eventType: string, handler: (data: any) => void) => {
    return wsClient.subscribe(eventType, (data) => {
      setLastMessage({ type: eventType, data, timestamp: new Date() });
      handler(data);
    });
  }, []);

  const send = useCallback((data: any) => {
    wsClient.send(data);
  }, []);

  return {
    connectionState,
    lastMessage,
    error,
    subscribe,
    send,
    isConnected: connectionState === 'connected'
  };
}