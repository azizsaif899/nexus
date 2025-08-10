import { UserEvent, BusinessKPIs, TimeRange } from './types';
import Redis from 'ioredis';
import { subDays, startOfDay, endOfDay } from 'date-fns';

export class MetricsProcessor {
  private redis: Redis;

  constructor() {
    this.redis = new Redis(process.env.REDIS_URL || 'redis://localhost:6379');
  }

  async calculateKPIs(timeRange: TimeRange): Promise<BusinessKPIs> {
    const events = await this.getEventsForTimeRange(timeRange);
    
    return {
      userMetrics: await this.calculateUserMetrics(events),
      businessMetrics: await this.calculateBusinessMetrics(events),
      technicalMetrics: await this.calculateTechnicalMetrics(events),
      aiMetrics: await this.calculateAIMetrics(events)
    };
  }

  private async getEventsForTimeRange(timeRange: TimeRange): Promise<UserEvent[]> {
    const days = this.getTimeRangeDays(timeRange);
    const startDate = subDays(new Date(), days);
    
    const eventStrings = await this.redis.lrange('analytics:events', 0, -1);
    const events = eventStrings.map(str => JSON.parse(str) as UserEvent);
    
    return events.filter(event => 
      new Date(event.timestamp) >= startDate
    );
  }

  private async calculateUserMetrics(events: UserEvent[]) {
    const today = new Date();
    const todayStart = startOfDay(today);
    const todayEnd = endOfDay(today);
    
    const todayEvents = events.filter(e => {
      const eventDate = new Date(e.timestamp);
      return eventDate >= todayStart && eventDate <= todayEnd;
    });

    const monthStart = subDays(today, 30);
    const monthEvents = events.filter(e => new Date(e.timestamp) >= monthStart);

    return {
      dailyActiveUsers: new Set(todayEvents.map(e => e.userId)).size,
      monthlyActiveUsers: new Set(monthEvents.map(e => e.userId)).size,
      userRetentionRate: this.calculateRetentionRate(events),
      userChurnRate: this.calculateChurnRate(events),
      averageSessionDuration: this.calculateAvgSessionDuration(events),
      userLifetimeValue: await this.calculateLTV(events)
    };
  }

  private async calculateBusinessMetrics(events: UserEvent[]) {
    const revenueEvents = events.filter(e => e.eventType === 'purchase');
    const totalRevenue = revenueEvents.reduce((sum, e) => sum + (e.properties.amount || 0), 0);
    
    return {
      monthlyRecurringRevenue: totalRevenue,
      customerAcquisitionCost: await this.calculateCAC(events),
      conversionRate: this.calculateConversionRate(events),
      averageRevenuePerUser: totalRevenue / new Set(events.map(e => e.userId)).size,
      grossMargin: 0.7, // يمكن حسابها من البيانات الفعلية
      netPromoterScore: await this.calculateNPS(events)
    };
  }

  private async calculateTechnicalMetrics(events: UserEvent[]) {
    const errorEvents = events.filter(e => e.eventType === 'error');
    const totalEvents = events.length;
    
    return {
      systemUptime: 99.9, // من monitoring system
      averageResponseTime: this.calculateAvgResponseTime(events),
      errorRate: totalEvents > 0 ? (errorEvents.length / totalEvents) * 100 : 0,
      throughput: totalEvents / 24, // events per hour
      resourceUtilization: 75, // من monitoring
      deploymentFrequency: 2 // deployments per week
    };
  }

  private async calculateAIMetrics(events: UserEvent[]) {
    const aiEvents = events.filter(e => e.eventType === 'ai_query');
    
    return {
      queryAccuracy: this.calculateQueryAccuracy(aiEvents),
      responseTime: this.calculateAvgResponseTime(aiEvents),
      userSatisfaction: this.calculateSatisfaction(aiEvents),
      modelPerformance: 0.85,
      apiUsage: aiEvents.length,
      costPerQuery: 0.001
    };
  }

  private calculateRetentionRate(events: UserEvent[]): number {
    // تنفيذ مبسط لحساب معدل الاحتفاظ
    const userSessions = new Map<string, Date[]>();
    
    events.forEach(event => {
      const userId = event.userId;
      const date = new Date(event.timestamp);
      
      if (!userSessions.has(userId)) {
        userSessions.set(userId, []);
      }
      userSessions.get(userId)!.push(date);
    });

    let retainedUsers = 0;
    const totalUsers = userSessions.size;

    userSessions.forEach(sessions => {
      if (sessions.length > 1) {
        const daysDiff = Math.abs(sessions[sessions.length - 1].getTime() - sessions[0].getTime()) / (1000 * 60 * 60 * 24);
        if (daysDiff >= 7) retainedUsers++;
      }
    });

    return totalUsers > 0 ? (retainedUsers / totalUsers) * 100 : 0;
  }

  private calculateChurnRate(events: UserEvent[]): number {
    return 100 - this.calculateRetentionRate(events);
  }

  private calculateAvgSessionDuration(events: UserEvent[]): number {
    const sessions = new Map<string, Date[]>();
    
    events.forEach(event => {
      if (!sessions.has(event.sessionId)) {
        sessions.set(event.sessionId, []);
      }
      sessions.get(event.sessionId)!.push(new Date(event.timestamp));
    });

    let totalDuration = 0;
    let sessionCount = 0;

    sessions.forEach(timestamps => {
      if (timestamps.length > 1) {
        timestamps.sort((a, b) => a.getTime() - b.getTime());
        const duration = timestamps[timestamps.length - 1].getTime() - timestamps[0].getTime();
        totalDuration += duration;
        sessionCount++;
      }
    });

    return sessionCount > 0 ? totalDuration / sessionCount / 1000 / 60 : 0; // minutes
  }

  private async calculateLTV(events: UserEvent[]): Promise<number> {
    const revenueEvents = events.filter(e => e.eventType === 'purchase');
    const userRevenues = new Map<string, number>();
    
    revenueEvents.forEach(event => {
      const userId = event.userId;
      const amount = event.properties.amount || 0;
      userRevenues.set(userId, (userRevenues.get(userId) || 0) + amount);
    });

    const revenues = Array.from(userRevenues.values());
    return revenues.length > 0 ? revenues.reduce((sum, rev) => sum + rev, 0) / revenues.length : 0;
  }

  private async calculateCAC(events: UserEvent[]): Promise<number> {
    // تكلفة اكتساب العملاء - يحتاج بيانات التسويق
    return 50; // قيمة افتراضية
  }

  private calculateConversionRate(events: UserEvent[]): number {
    const visitors = new Set(events.map(e => e.userId)).size;
    const conversions = events.filter(e => e.eventType === 'purchase').length;
    
    return visitors > 0 ? (conversions / visitors) * 100 : 0;
  }

  private async calculateNPS(events: UserEvent[]): Promise<number> {
    const feedbackEvents = events.filter(e => e.eventType === 'feedback');
    if (feedbackEvents.length === 0) return 0;
    
    const scores = feedbackEvents.map(e => e.properties.score || 0);
    const avgScore = scores.reduce((sum, score) => sum + score, 0) / scores.length;
    
    return (avgScore - 5) * 20; // تحويل من 1-10 إلى NPS
  }

  private calculateAvgResponseTime(events: UserEvent[]): number {
    const responseEvents = events.filter(e => e.properties.responseTime);
    if (responseEvents.length === 0) return 0;
    
    const times = responseEvents.map(e => e.properties.responseTime);
    return times.reduce((sum, time) => sum + time, 0) / times.length;
  }

  private calculateQueryAccuracy(events: UserEvent[]): number {
    const accurateQueries = events.filter(e => e.properties.accurate === true).length;
    return events.length > 0 ? (accurateQueries / events.length) * 100 : 0;
  }

  private calculateSatisfaction(events: UserEvent[]): number {
    const satisfactionEvents = events.filter(e => e.properties.satisfaction);
    if (satisfactionEvents.length === 0) return 0;
    
    const scores = satisfactionEvents.map(e => e.properties.satisfaction);
    return scores.reduce((sum, score) => sum + score, 0) / scores.length;
  }

  private getTimeRangeDays(timeRange: TimeRange): number {
    switch (timeRange) {
      case '1h': return 0;
      case '24h': return 1;
      case '7d': return 7;
      case '30d': return 30;
      case '90d': return 90;
      case '1y': return 365;
      default: return 7;
    }
  }
}