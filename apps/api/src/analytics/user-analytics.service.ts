import { Injectable } from '@nestjs/common';

interface AnalyticsEvent {
  userId: string;
  event: string;
  properties: Record<string, any>;
  timestamp: Date;
}

@Injectable()
export class UserAnalyticsService {
  private events: AnalyticsEvent[] = [];

  async trackEvent(event: AnalyticsEvent): Promise<void> {
    this.events.push({ ...event, timestamp: new Date() });
  }

  async trackUserLogin(userId: string, ip: string): Promise<void> {
    await this.trackEvent({
      userId,
      event: 'user_login',
      properties: { ip },
      timestamp: new Date()
    });
  }

  async trackConversation(userId: string, agent: string, mode: string): Promise<void> {
    await this.trackEvent({
      userId,
      event: 'conversation',
      properties: { agent, mode },
      timestamp: new Date()
    });
  }

  async getUserStats(userId: string): Promise<any> {
    const userEvents = this.events.filter(e => e.userId === userId);
    return {
      totalEvents: userEvents.length,
      conversations: userEvents.filter(e => e.event === 'conversation').length,
      lastActivity: userEvents.length > 0 ? userEvents[userEvents.length - 1].timestamp : null
    };
  }

  async getSystemStats(): Promise<any> {
    const uniqueUsers = new Set(this.events.map(e => e.userId)).size;
    return {
      totalEvents: this.events.length,
      activeUsers: uniqueUsers
    };
  }
}
