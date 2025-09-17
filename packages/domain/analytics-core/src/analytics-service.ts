import { Injectable } from '@nestjs/common';

@Injectable()
export class AnalyticsService {
  private events: any[] = [];
  private userSessions = new Map<string, any>();

  trackEvent(eventName: string, userId: string, properties: any = {}): void {
    const event = {
      eventName,
      userId,
      properties,
      timestamp: new Date(),
      sessionId: this.getOrCreateSession(userId)
    };
    
    this.events.push(event);
    this.processEvent(event);
  }

  trackPageView(userId: string, page: string, referrer?: string): void {
    this.trackEvent('page_view', userId, { page, referrer });
  }

  trackUserAction(userId: string, action: string, target: string): void {
    this.trackEvent('user_action', userId, { action, target });
  }

  getAnalytics(timeRange: string = '7d'): any {
    const cutoff = this.getTimeRangeCutoff(timeRange);
    const filteredEvents = this.events.filter(e => e.timestamp >= cutoff);
    
    return {
      totalEvents: filteredEvents.length,
      uniqueUsers: new Set(filteredEvents.map(e => e.userId)).size,
      topEvents: this.getTopEvents(filteredEvents),
      userEngagement: this.calculateEngagement(filteredEvents),
      timeRange
    };
  }

  getUserAnalytics(userId: string): any {
    const userEvents = this.events.filter(e => e.userId === userId);
    const session = this.userSessions.get(userId);
    
    return {
      totalEvents: userEvents.length,
      lastActivity: userEvents.length > 0 ? userEvents[userEvents.length - 1].timestamp : null,
      sessionDuration: session ? Date.now() - session.startTime : 0,
      topActions: this.getTopEvents(userEvents)
    };
  }

  private getOrCreateSession(userId: string): string {
    let session = this.userSessions.get(userId);
    
    if (!session || Date.now() - session.lastActivity > 30 * 60 * 1000) {
      session = {
        sessionId: `session_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
        startTime: Date.now(),
        lastActivity: Date.now()
      };
      this.userSessions.set(userId, session);
    } else {
      session.lastActivity = Date.now();
    }
    
    return session.sessionId;
  }

  private processEvent(event: any): void {
    // Process event for real-time analytics
    // Removed console.log
  }

  private getTimeRangeCutoff(timeRange: string): Date {
    const now = new Date();
    switch (timeRange) {
      case '1d': return new Date(now.getTime() - 24 * 60 * 60 * 1000);
      case '7d': return new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
      case '30d': return new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);
      default: return new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
    }
  }

  private getTopEvents(events: any[]): any[] {
    const eventCounts = events.reduce((acc, event) => {
      acc[event.eventName] = (acc[event.eventName] || 0) + 1;
      return acc;
    }, {});
    
    return Object.entries(eventCounts)
      .sort(([,a], [,b]) => (b as number) - (a as number))
      .slice(0, 10)
      .map(([name, count]) => ({ name, count }));
  }

  private calculateEngagement(events: any[]): number {
    const sessions = new Set(events.map(e => e.sessionId));
    return sessions.size > 0 ? events.length / sessions.size : 0;
  }
}