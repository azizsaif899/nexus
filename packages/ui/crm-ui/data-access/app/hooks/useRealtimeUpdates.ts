'use client';

import { useState, useEffect } from 'react';
import { useQuery } from '@tanstack/react-query';

interface PulseData {
  revenue: number;
  pipelineVelocity: number;
  winRate: number;
  newLeads: number;
  lastUpdated: string;
}

export function useRealtimeUpdates() {
  const [isConnected, setIsConnected] = useState(false);

  const { data, isLoading, error } = useQuery({
    queryKey: ['pulse-data'],
    queryFn: async (): Promise<PulseData> => {
      // Mock data - replace with actual API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      return {
        revenue: 1200000,
        pipelineVelocity: 25,
        winRate: 28,
        newLeads: 156,
        lastUpdated: new Date().toISOString()
      };
    },
    refetchInterval: 30000, // Refetch every 30 seconds
  });

  useEffect(() => {
    // Simulate WebSocket connection
    const timer = setTimeout(() => {
      setIsConnected(true);
    }, 1000);

    return () => clearTimeout(timer);
  }, []);

  return {
    data,
    isLoading,
    error,
    isConnected
  };
}