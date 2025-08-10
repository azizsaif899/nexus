import { UserEvent, AnalyticsConfig } from './types';
import Redis from 'ioredis';

export class DataCollector {
  private redis: Redis;
  private config: AnalyticsConfig;
  private eventBuffer: UserEvent[] = [];

  constructor(config: AnalyticsConfig) {
    this.config = config;
    this.redis = new Redis(process.env.REDIS_URL || 'redis://localhost:6379');
    
    if (config.realTimeEnabled) {
      setInterval(() => this.flushBuffer(), 5000);
    }
  }

  async trackEvent(event: Omit<UserEvent, 'id' | 'timestamp'>): Promise<void> {
    const fullEvent: UserEvent = {
      ...event,
      id: this.generateEventId(),
      timestamp: new Date()
    };

    this.eventBuffer.push(fullEvent);

    if (this.eventBuffer.length >= this.config.batchSize) {
      await this.flushBuffer();
    }
  }

  async trackUserAction(userId: string, action: string, properties: Record<string, any> = {}): Promise<void> {
    await this.trackEvent({
      userId,
      eventType: 'user_action',
      properties: { action, ...properties },
      sessionId: await this.getSessionId(userId)
    });
  }

  async trackPageView(userId: string, page: string, referrer?: string): Promise<void> {
    await this.trackEvent({
      userId,
      eventType: 'page_view',
      properties: { page, referrer },
      sessionId: await this.getSessionId(userId)
    });
  }

  private async flushBuffer(): Promise<void> {
    if (this.eventBuffer.length === 0) return;

    const events = [...this.eventBuffer];
    this.eventBuffer = [];

    try {
      await this.redis.lpush('analytics:events', ...events.map(e => JSON.stringify(e)));
      
      if (this.config.realTimeEnabled) {
        await this.redis.publish('analytics:realtime', JSON.stringify({
          type: 'events_batch',
          count: events.length,
          timestamp: new Date()
        }));
      }
    } catch (error) {
      console.error('Failed to flush events:', error);
      this.eventBuffer.unshift(...events);
    }
  }

  private generateEventId(): string {
    return `evt_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
  }

  private async getSessionId(userId: string): Promise<string> {
    const sessionKey = `session:${userId}`;
    let sessionId = await this.redis.get(sessionKey);
    
    if (!sessionId) {
      sessionId = `sess_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
      await this.redis.setex(sessionKey, 1800, sessionId); // 30 minutes
    }
    
    return sessionId;
  }
}