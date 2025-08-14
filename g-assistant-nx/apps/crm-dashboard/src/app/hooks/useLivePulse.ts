'use client';

import { useState, useEffect } from 'react';
import { useWebSocket } from './useWebSocket';

export interface PulseMetrics {
  revenue: {
    current: number;
    target: number;
    change: number;
    trend: 'up' | 'down' | 'stable';
  };
  deals: {
    active: number;
    closed: number;
    conversion: number;
    pipeline: number;
  };
  customers: {
    total: number;
    new: number;
    active: number;
    churn: number;
  };
  team: {
    online: number;
    total: number;
    performance: number;
    activity: number;
  };
  system: {
    health: number;
    responseTime: number;
    uptime: number;
    errors: number;
  };
}

export function useLivePulse() {
  const [metrics, setMetrics] = useState<PulseMetrics>({
    revenue: { current: 0, target: 0, change: 0, trend: 'stable' },
    deals: { active: 0, closed: 0, conversion: 0, pipeline: 0 },
    customers: { total: 0, new: 0, active: 0, churn: 0 },
    team: { online: 0, total: 0, performance: 0, activity: 0 },
    system: { health: 0, responseTime: 0, uptime: 0, errors: 0 }
  });
  
  const [isLoading, setIsLoading] = useState(true);
  const [lastUpdate, setLastUpdate] = useState<Date>(new Date());
  const { subscribe, isConnected } = useWebSocket();

  // محاكاة البيانات الحية
  useEffect(() => {
    const generateMockMetrics = (): PulseMetrics => ({
      revenue: {
        current: Math.floor(Math.random() * 1000000) + 500000,
        target: 1200000,
        change: (Math.random() - 0.5) * 20,
        trend: Math.random() > 0.5 ? 'up' : 'down'
      },
      deals: {
        active: Math.floor(Math.random() * 50) + 20,
        closed: Math.floor(Math.random() * 10) + 5,
        conversion: Math.random() * 30 + 15,
        pipeline: Math.floor(Math.random() * 2000000) + 1000000
      },
      customers: {
        total: Math.floor(Math.random() * 1000) + 500,
        new: Math.floor(Math.random() * 20) + 5,
        active: Math.floor(Math.random() * 800) + 400,
        churn: Math.random() * 5 + 1
      },
      team: {
        online: Math.floor(Math.random() * 15) + 8,
        total: 25,
        performance: Math.random() * 30 + 70,
        activity: Math.random() * 40 + 60
      },
      system: {
        health: Math.random() * 20 + 80,
        responseTime: Math.random() * 200 + 100,
        uptime: 99.9,
        errors: Math.floor(Math.random() * 5)
      }
    });

    // تحديث أولي
    setMetrics(generateMockMetrics());
    setIsLoading(false);

    // تحديث دوري كل 5 ثوان
    const interval = setInterval(() => {
      setMetrics(generateMockMetrics());
      setLastUpdate(new Date());
    }, 5000);

    return () => clearInterval(interval);
  }, []);

  // الاستماع للتحديثات عبر WebSocket
  useEffect(() => {
    if (!isConnected) return;

    const unsubscribe = subscribe('pulse.update', (data: Partial<PulseMetrics>) => {
      setMetrics(prev => ({ ...prev, ...data }));
      setLastUpdate(new Date());
    });

    return unsubscribe;
  }, [isConnected, subscribe]);

  const getHealthStatus = (): 'excellent' | 'good' | 'warning' | 'critical' => {
    const avgHealth = (
      metrics.system.health +
      metrics.team.performance +
      (100 - metrics.customers.churn * 10) +
      (metrics.deals.conversion * 2)
    ) / 4;

    if (avgHealth >= 90) return 'excellent';
    if (avgHealth >= 75) return 'good';
    if (avgHealth >= 60) return 'warning';
    return 'critical';
  };

  const getRevenueProgress = (): number => {
    return Math.min((metrics.revenue.current / metrics.revenue.target) * 100, 100);
  };

  const getActiveAlertsCount = (): number => {
    let alerts = 0;
    
    if (metrics.system.health < 80) alerts++;
    if (metrics.system.errors > 3) alerts++;
    if (metrics.customers.churn > 4) alerts++;
    if (metrics.deals.conversion < 20) alerts++;
    if (metrics.team.performance < 70) alerts++;
    
    return alerts;
  };

  return {
    metrics,
    isLoading,
    lastUpdate,
    isConnected,
    healthStatus: getHealthStatus(),
    revenueProgress: getRevenueProgress(),
    activeAlerts: getActiveAlertsCount(),
    refresh: () => setLastUpdate(new Date())
  };
}