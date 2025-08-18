import { UserEvent, BusinessKPIs, TimeRange } from './types';

export class MetricsProcessor {
  private metricsCache = new Map<string, any>();
  private readonly CACHE_TTL = 5 * 60 * 1000; // 5 minutes

  async calculateKPIs(timeRange: TimeRange): Promise<BusinessKPIs> {
    const cacheKey = `kpis-${timeRange}`;
    const cached = this.getCachedMetrics(cacheKey);
    
    if (cached) {
      return cached;
    }

    const events = await this.getEventsForTimeRange(timeRange);
    const kpis = await this.computeKPIs(events);
    
    this.setCachedMetrics(cacheKey, kpis);
    return kpis;
  }

  private async computeKPIs(events: UserEvent[]): Promise<BusinessKPIs> {
    const userMetrics = await this.calculateUserMetrics(events);
    const businessMetrics = await this.calculateBusinessMetrics(events);
    const technicalMetrics = await this.calculateTechnicalMetrics(events);
    const aiMetrics = await this.calculateAIMetrics(events);

    return {
      userMetrics,
      businessMetrics,
      technicalMetrics,
      aiMetrics
    };
  }

  private async calculateUserMetrics(events: UserEvent[]): Promise<BusinessKPIs['userMetrics']> {
    const userEvents = events.filter(e => e.eventType === 'user_action');
    const uniqueUsers = new Set(userEvents.map(e => e.userId));
    
    const today = new Date();
    const todayEvents = userEvents.filter(e => 
      e.timestamp.toDateString() === today.toDateString()
    );
    const dailyActiveUsers = new Set(todayEvents.map(e => e.userId)).size;

    const monthStart = new Date(today.getFullYear(), today.getMonth(), 1);
    const monthlyEvents = userEvents.filter(e => e.timestamp >= monthStart);
    const monthlyActiveUsers = new Set(monthlyEvents.map(e => e.userId)).size;

    return {
      dailyActiveUsers,
      monthlyActiveUsers,
      userRetentionRate: await this.calculateRetentionRate(events),
      userChurnRate: await this.calculateChurnRate(events),
      averageSessionDuration: this.calculateAverageSessionDuration(events),
      userLifetimeValue: await this.calculateUserLTV(events)
    };
  }

  private async calculateBusinessMetrics(events: UserEvent[]): Promise<BusinessKPIs['businessMetrics']> {
    const businessEvents = events.filter(e => e.eventType === 'business_event');
    
    const revenueEvents = businessEvents.filter(e => 
      e.properties.eventType === 'revenue'
    );
    
    const monthlyRevenue = revenueEvents
      .filter(e => this.isCurrentMonth(e.timestamp))
      .reduce((sum, e) => sum + (e.properties.value || 0), 0);

    return {
      monthlyRecurringRevenue: monthlyRevenue,
      customerAcquisitionCost: await this.calculateCAC(events),
      conversionRate: await this.calculateConversionRate(events),
      averageRevenuePerUser: monthlyRevenue / (await this.getActiveUserCount(events)),
      grossMargin: 0.75, // Mock value
      netPromoterScore: 8.5 // Mock value
    };
  }

  private async calculateTechnicalMetrics(events: UserEvent[]): Promise<BusinessKPIs['technicalMetrics']> {
    const systemEvents = events.filter(e => e.eventType === 'system_event');
    
    const errorEvents = systemEvents.filter(e => 
      e.properties.eventType === 'error'
    );
    
    const responseTimeEvents = systemEvents.filter(e => 
      e.properties.eventType === 'response_time'
    );

    const avgResponseTime = responseTimeEvents.length > 0 
      ? responseTimeEvents.reduce((sum, e) => sum + e.properties.value, 0) / responseTimeEvents.length
      : 0;

    return {
      systemUptime: 99.9, // Mock value
      averageResponseTime: avgResponseTime,
      errorRate: errorEvents.length / systemEvents.length,
      throughput: await this.calculateThroughput(events),
      resourceUtilization: 0.65, // Mock value
      deploymentFrequency: await this.calculateDeploymentFrequency(events)
    };
  }

  private async calculateAIMetrics(events: UserEvent[]): Promise<BusinessKPIs['aiMetrics']> {
    const aiEvents = events.filter(e => 
      e.properties.eventType === 'ai_query' || 
      e.properties.eventType === 'ai_response'
    );

    const queryEvents = aiEvents.filter(e => e.properties.eventType === 'ai_query');
    const responseEvents = aiEvents.filter(e => e.properties.eventType === 'ai_response');

    const avgResponseTime = responseEvents.length > 0
      ? responseEvents.reduce((sum, e) => sum + (e.properties.responseTime || 0), 0) / responseEvents.length
      : 0;

    return {
      queryAccuracy: 0.92, // Mock value
      responseTime: avgResponseTime,
      userSatisfaction: 4.2, // Mock value
      modelPerformance: 0.88, // Mock value
      apiUsage: queryEvents.length,
      costPerQuery: 0.001 // Mock value
    };
  }

  private async calculateRetentionRate(events: UserEvent[]): Promise<number> {
    // Simplified retention calculation
    const thirtyDaysAgo = new Date(Date.now() - 30 * 24 * 60 * 60 * 1000);
    const oldUsers = new Set(
      events
        .filter(e => e.timestamp < thirtyDaysAgo)
        .map(e => e.userId)
    );
    
    const recentUsers = new Set(
      events
        .filter(e => e.timestamp >= thirtyDaysAgo)
        .map(e => e.userId)
    );

    const retainedUsers = [...oldUsers].filter(userId => recentUsers.has(userId));
    return oldUsers.size > 0 ? retainedUsers.length / oldUsers.size : 0;
  }

  private async calculateChurnRate(events: UserEvent[]): Promise<number> {
    const retentionRate = await this.calculateRetentionRate(events);
    return 1 - retentionRate;
  }

  private calculateAverageSessionDuration(events: UserEvent[]): number {
    const sessionDurations = new Map<string, number>();
    
    events.forEach(event => {
      const sessionId = event.sessionId;
      if (sessionId) {
        if (!sessionDurations.has(sessionId)) {
          sessionDurations.set(sessionId, 0);
        }
        sessionDurations.set(sessionId, sessionDurations.get(sessionId)! + 1);
      }
    });

    const durations = Array.from(sessionDurations.values());
    return durations.length > 0 
      ? durations.reduce((sum, duration) => sum + duration, 0) / durations.length 
      : 0;
  }

  private async calculateUserLTV(events: UserEvent[]): Promise<number> {
    // Simplified LTV calculation
    const revenueEvents = events.filter(e => 
      e.eventType === 'business_event' && e.properties.eventType === 'revenue'
    );
    
    const totalRevenue = revenueEvents.reduce((sum, e) => sum + e.properties.value, 0);
    const uniqueUsers = new Set(revenueEvents.map(e => e.userId)).size;
    
    return uniqueUsers > 0 ? totalRevenue / uniqueUsers : 0;
  }

  private async calculateCAC(events: UserEvent[]): Promise<number> {
    // Mock implementation
    return 25.50;
  }

  private async calculateConversionRate(events: UserEvent[]): Promise<number> {
    const signupEvents = events.filter(e => e.properties.action === 'signup');
    const purchaseEvents = events.filter(e => e.properties.action === 'purchase');
    
    return signupEvents.length > 0 ? purchaseEvents.length / signupEvents.length : 0;
  }

  private async getActiveUserCount(events: UserEvent[]): Promise<number> {
    const activeUsers = new Set(
      events
        .filter(e => this.isCurrentMonth(e.timestamp))
        .map(e => e.userId)
    );
    return activeUsers.size;
  }

  private async calculateThroughput(events: UserEvent[]): Promise<number> {
    const requestEvents = events.filter(e => 
      e.eventType === 'system_event' && e.properties.eventType === 'request'
    );
    
    // Requests per minute
    const timeSpanMinutes = 60; // Last hour
    return requestEvents.length / timeSpanMinutes;
  }

  private async calculateDeploymentFrequency(events: UserEvent[]): Promise<number> {
    const deploymentEvents = events.filter(e => 
      e.eventType === 'system_event' && e.properties.eventType === 'deployment'
    );
    
    // Deployments per week
    return deploymentEvents.length / 7;
  }

  private isCurrentMonth(date: Date): boolean {
    const now = new Date();
    return date.getMonth() === now.getMonth() && date.getFullYear() === now.getFullYear();
  }

  private async getEventsForTimeRange(timeRange: TimeRange): Promise<UserEvent[]> {
    // Mock implementation - in real scenario, this would query the database
    return [];
  }

  private getCachedMetrics(key: string): any {
    const cached = this.metricsCache.get(key);
    if (cached && Date.now() - cached.timestamp < this.CACHE_TTL) {
      return cached.data;
    }
    return null;
  }

  private setCachedMetrics(key: string, data: any): void {
    this.metricsCache.set(key, {
      data,
      timestamp: Date.now()
    });
  }
}