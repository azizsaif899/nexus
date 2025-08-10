export interface UserEvent {
  id: string;
  userId: string;
  eventType: string;
  timestamp: Date;
  properties: Record<string, any>;
  sessionId: string;
}

export interface BusinessKPIs {
  userMetrics: {
    dailyActiveUsers: number;
    monthlyActiveUsers: number;
    userRetentionRate: number;
    userChurnRate: number;
    averageSessionDuration: number;
    userLifetimeValue: number;
  };
  
  businessMetrics: {
    monthlyRecurringRevenue: number;
    customerAcquisitionCost: number;
    conversionRate: number;
    averageRevenuePerUser: number;
    grossMargin: number;
    netPromoterScore: number;
  };
  
  technicalMetrics: {
    systemUptime: number;
    averageResponseTime: number;
    errorRate: number;
    throughput: number;
    resourceUtilization: number;
    deploymentFrequency: number;
  };
  
  aiMetrics: {
    queryAccuracy: number;
    responseTime: number;
    userSatisfaction: number;
    modelPerformance: number;
    apiUsage: number;
    costPerQuery: number;
  };
}

export type TimeRange = '1h' | '24h' | '7d' | '30d' | '90d' | '1y';

export interface AnalyticsConfig {
  realTimeEnabled: boolean;
  batchSize: number;
  retentionDays: number;
  alertThresholds: Record<string, number>;
}