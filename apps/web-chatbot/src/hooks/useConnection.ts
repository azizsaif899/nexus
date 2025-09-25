import { useState, useEffect, useCallback } from 'react';
import { getWebSocketManager } from '../services/websocket.manager';

export interface UseConnectionReturn {
  isConnected: boolean;
  isConnecting: boolean;
  connectionError: string | null;
  reconnect: () => void;
  disconnect: () => void;
}

export const useConnection = (): UseConnectionReturn => {
  const [isConnected, setIsConnected] = useState(false);
  const [isConnecting, setIsConnecting] = useState(false);
  const [connectionError, setConnectionError] = useState<string | null>(null);

  const wsManager = getWebSocketManager();

  useEffect(() => {
    if (!wsManager) return;

    const handleConnect = () => {
      setIsConnected(true);
      setIsConnecting(false);
      setConnectionError(null);
    };

    const handleDisconnect = () => {
      setIsConnected(false);
      setIsConnecting(false);
    };

    const handleConnecting = () => {
      setIsConnecting(true);
      setConnectionError(null);
    };

    const handleError = (error: any) => {
      setConnectionError(error.message || 'Connection error');
      setIsConnecting(false);
    };

    wsManager.on('connected', handleConnect);
    wsManager.on('disconnected', handleDisconnect);
    wsManager.on('connecting', handleConnecting);
    wsManager.on('connection_error', handleError);

    // Set initial state
    setIsConnected(wsManager.isConnected());
    const state = wsManager.getConnectionState();
    setIsConnecting(state.isConnecting);

    return () => {
      wsManager.off('connected', handleConnect);
      wsManager.off('disconnected', handleDisconnect);
      wsManager.off('connecting', handleConnecting);
      wsManager.off('connection_error', handleError);
    };
  }, [wsManager]);

  const reconnect = useCallback(() => {
    if (wsManager && !wsManager.isConnected()) {
      wsManager.connect().catch(error => {
        setConnectionError(error.message || 'Reconnection failed');
      });
    }
  }, [wsManager]);

  const disconnect = useCallback(() => {
    if (wsManager) {
      wsManager.disconnect();
    }
  }, [wsManager]);

  return {
    isConnected,
    isConnecting,
    connectionError,
    reconnect,
    disconnect,
  };
};