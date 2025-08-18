// Analytics Core Types
export interface TimeRange {
  start: Date;
  end: Date;
}

export interface UserEvent {
  id: string;
  userId: string;
  eventType: string;
  timestamp: Date;
  properties: Record<string, any>;
  sessionId?: string;
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

export interface AnalyticsInsight {
  id: string;
  type: 'trend' | 'anomaly' | 'prediction' | 'recommendation';
  title: string;
  description: string;
  confidence: number;
  impact: 'low' | 'medium' | 'high' | 'critical';
  actionable: boolean;
  recommendations?: string[];
  data: any;
  generatedAt: Date;
}