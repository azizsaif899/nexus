/**
 * 🚀 Event Bus المركزي - TASK-001
 * ناقل الأحداث المركزي للنظام الحقيقي
 */

import { EventEmitter } from 'events';

// Mock Redis for development
class MockRedis {
  async xadd(...args: any[]) { return 'ok'; }
  async xread(...args: any[]) { return null; }
  async xrevrange(...args: any[]) { return []; }
  async quit() { return 'OK'; }
  on(event: string, callback: Function) { return this; }
}

export interface SystemEvent {
  id: string;
  type: string;
  source: string;
  data: any;
  timestamp: Date;
  userId?: string;
}

export class EventBus extends EventEmitter {
  private static instance: EventBus;
  private redis: MockRedis;
  private isConnected: boolean = false;

  static getInstance(): EventBus {
    if (!EventBus.instance) {
      EventBus.instance = new EventBus();
    }
    return EventBus.instance;
  }

  constructor() {
    super();
    this.redis = new MockRedis();

    this.setupRedisListeners();
  }

  private setupRedisListeners(): void {
    this.redis.on('connect', () => {
      this.isConnected = true;
      console.log('✅ Event Bus connected to Redis');
    });

    this.redis.on('error', (error) => {
      console.error('❌ Event Bus Redis error:', error);
      this.isConnected = false;
    });
  }

  /**
   * نشر حدث في النظام
   */
  async publish(event: Omit<SystemEvent, 'id' | 'timestamp'>): Promise<void> {
    const fullEvent: SystemEvent = {
      ...event,
      id: this.generateEventId(),
      timestamp: new Date()
    };

    try {
      // نشر في Redis Stream
      await this.redis.xadd(
        'system-events',
        '*',
        'event', JSON.stringify(fullEvent)
      );

      // إشعار المستمعين المحليين
      this.emit(event.type, fullEvent);
      this.emit('*', fullEvent);

      console.log(`📡 Event published: ${event.type}`);
    } catch (error) {
      console.error('❌ Failed to publish event:', error);
      throw error;
    }
  }

  /**
   * الاستماع لنوع معين من الأحداث
   */
  subscribe(eventType: string, callback: (event: SystemEvent) => void): void {
    this.on(eventType, callback);
  }

  /**
   * الاستماع لجميع الأحداث
   */
  subscribeAll(callback: (event: SystemEvent) => void): void {
    this.on('*', callback);
  }

  /**
   * إلغاء الاستماع
   */
  unsubscribe(eventType: string, callback: (event: SystemEvent) => void): void {
    this.off(eventType, callback);
  }

  /**
   * بدء استهلاك الأحداث من Redis Stream
   */
  async startConsuming(): Promise<void> {
    if (!this.isConnected) {
      throw new Error('Event Bus not connected to Redis');
    }

    console.log('🎧 Starting event consumption...');

    while (true) {
      try {
        const results = await this.redis.xread(
          'BLOCK', 1000,
          'STREAMS', 'system-events', '$'
        );

        if (results) {
          for (const [stream, messages] of results) {
            for (const [id, fields] of messages) {
              const eventData = JSON.parse(fields[1]);
              this.emit(eventData.type, eventData);
              this.emit('*', eventData);
            }
          }
        }
      } catch (error) {
        console.error('❌ Error consuming events:', error);
        await new Promise(resolve => setTimeout(resolve, 5000));
      }
    }
  }

  /**
   * الحصول على تاريخ الأحداث
   */
  async getEventHistory(eventType?: string, limit: number = 100): Promise<SystemEvent[]> {
    try {
      const results = await this.redis.xrevrange('system-events', '+', '-', 'COUNT', limit);
      
      return results
        .map(([id, fields]) => JSON.parse(fields[1]))
        .filter(event => !eventType || event.type === eventType);
    } catch (error) {
      console.error('❌ Failed to get event history:', error);
      return [];
    }
  }

  /**
   * إحصائيات الأحداث
   */
  async getEventStats(): Promise<{ total: number; byType: Record<string, number> }> {
    try {
      const events = await this.getEventHistory();
      const byType: Record<string, number> = {};

      events.forEach(event => {
        byType[event.type] = (byType[event.type] || 0) + 1;
      });

      return {
        total: events.length,
        byType
      };
    } catch (error) {
      console.error('❌ Failed to get event stats:', error);
      return { total: 0, byType: {} };
    }
  }

  private generateEventId(): string {
    return `evt_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
  }

  /**
   * إسناد مهمة للمنفذ
   */
  assignTask(task: any): void {
    this.publish({
      type: 'task.assigned',
      source: 'orchestrator',
      data: { task }
    });
  }

  /**
   * إغلاق الاتصال
   */
  async close(): Promise<void> {
    await this.redis.quit();
    this.isConnected = false;
    console.log('🔌 Event Bus disconnected');
  }
}

// Singleton instance
export const eventBus = new EventBus();

// أنواع الأحداث المعرفة مسبقاً
export enum EventTypes {
  // Additional types for compatibility
  USER_ACTION = 'user.action',
  SYSTEM_EVENT = 'system.event', 
  TASK_COMPLETED = 'task.completed',
  ERROR_OCCURRED = 'error.occurred',
  SYSTEM_ERROR = 'system.error',
}

export const EventTypesConst = {
  // CRM Events
  LEAD_CREATED: 'crm.lead.created',
  LEAD_UPDATED: 'crm.lead.updated',
  LEAD_STAGE_CHANGED: 'crm.lead.stage_changed',
  OPPORTUNITY_WON: 'crm.opportunity.won',
  OPPORTUNITY_LOST: 'crm.opportunity.lost',

  // User Events
  USER_LOGIN: 'user.login',
  USER_ACTION: 'user.action',
  USER_LOGOUT: 'user.logout',

  // System Events
  SYSTEM_HEALTH: 'system.health',
  SYSTEM_ERROR: 'system.error',
  SYSTEM_WARNING: 'system.warning',

  // AI Events
  AI_RECOMMENDATION: 'ai.recommendation',
  AI_ANALYSIS_COMPLETE: 'ai.analysis.complete',
  AI_PREDICTION: 'ai.prediction',

  // WhatsApp Events
  WHATSAPP_MESSAGE_RECEIVED: 'whatsapp.message.received',
  WHATSAPP_MESSAGE_SENT: 'whatsapp.message.sent'
} as const;