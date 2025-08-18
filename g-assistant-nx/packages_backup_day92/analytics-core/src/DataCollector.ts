import { Observable, Subject, BehaviorSubject } from 'rxjs';
import { buffer, debounceTime, filter } from 'rxjs/operators';
import { v4 as uuidv4 } from 'uuid';
import { UserEvent, AnalyticsConfig } from './types';

export class DataCollector {
  private eventStream = new Subject<UserEvent>();
  private config = new BehaviorSubject<AnalyticsConfig>({
    enableRealtime: true,
    batchSize: 100,
    retentionDays: 90,
    enablePredictive: true
  });

  constructor(private storage: EventStorage) {}

  // جمع الأحداث
  track(eventType: string, userId: string, properties: Record<string, any> = {}): void {
    const event: UserEvent = {
      id: uuidv4(),
      userId,
      eventType,
      timestamp: new Date(),
      properties,
      sessionId: this.getSessionId(userId)
    };

    this.eventStream.next(event);
  }

  // معالجة الأحداث بالدفعات
  getBatchedEvents(): Observable<UserEvent[]> {
    return this.eventStream.pipe(
      buffer(this.eventStream.pipe(debounceTime(1000))),
      filter(events => events.length > 0)
    );
  }

  // الأحداث المباشرة
  getRealTimeEvents(): Observable<UserEvent> {
    return this.eventStream.asObservable();
  }

  // تتبع أحداث المستخدم
  trackUserAction(userId: string, action: string, data?: any): void {
    this.track('user_action', userId, { action, ...data });
  }

  // تتبع أحداث النظام
  trackSystemEvent(eventType: string, data: any): void {
    this.track('system_event', 'system', { eventType, ...data });
  }

  // تتبع أحداث الأعمال
  trackBusinessEvent(eventType: string, userId: string, value: number, data?: any): void {
    this.track('business_event', userId, { eventType, value, ...data });
  }

  private getSessionId(userId: string): string {
    // منطق بسيط لإدارة الجلسات
    const sessionKey = `session_${userId}`;
    let sessionId = localStorage.getItem(sessionKey);
    
    if (!sessionId) {
      sessionId = uuidv4();
      localStorage.setItem(sessionKey, sessionId);
    }
    
    return sessionId;
  }

  // حفظ الأحداث
  async saveEvents(events: UserEvent[]): Promise<void> {
    await this.storage.saveEvents(events);
  }

  // استرجاع الأحداث
  async getEvents(userId?: string, timeRange?: TimeRange): Promise<UserEvent[]> {
    return this.storage.getEvents(userId, timeRange);
  }
}

export interface EventStorage {
  saveEvents(events: UserEvent[]): Promise<void>;
  getEvents(userId?: string, timeRange?: string): Promise<UserEvent[]>;
}