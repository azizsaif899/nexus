import { UserEvent, TimeRange } from './types';
import { EventEmitter } from 'events';

export class DataCollector extends EventEmitter {
  private events: UserEvent[] = [];
  private batchSize = 100;
  private flushInterval = 5000; // 5 seconds
  private timer?: NodeJS.Timeout;

  constructor() {
    super();
    this.startBatchProcessor();
  }

  async collect(event: UserEvent): Promise<void> {
    // Validate event
    if (!this.validateEvent(event)) {
      throw new Error('Invalid event data');
    }

    // Add timestamp if not provided
    if (!event.timestamp) {
      event.timestamp = new Date();
    }

    // Store event
    this.events.push(event);

    // Emit for real-time processing
    this.emit('event', event);

    // Flush if batch is full
    if (this.events.length >= this.batchSize) {
      await this.flush();
    }
  }

  async getUserEvents(userId: string, timeRange?: TimeRange): Promise<UserEvent[]> {
    let filtered = this.events.filter(event => event.userId === userId);

    if (timeRange) {
      filtered = filtered.filter(event => 
        event.timestamp >= timeRange.start && 
        event.timestamp <= timeRange.end
      );
    }

    return filtered.sort((a, b) => a.timestamp.getTime() - b.timestamp.getTime());
  }

  async getEventsByType(eventType: string, timeRange?: TimeRange): Promise<UserEvent[]> {
    let filtered = this.events.filter(event => event.eventType === eventType);

    if (timeRange) {
      filtered = filtered.filter(event => 
        event.timestamp >= timeRange.start && 
        event.timestamp <= timeRange.end
      );
    }

    return filtered;
  }

  async getEventsInTimeRange(timeRange: TimeRange): Promise<UserEvent[]> {
    return this.events.filter(event => 
      event.timestamp >= timeRange.start && 
      event.timestamp <= timeRange.end
    );
  }

  private validateEvent(event: UserEvent): boolean {
    return !!(
      event.id &&
      event.userId &&
      event.eventType &&
      typeof event.properties === 'object'
    );
  }

  private startBatchProcessor(): void {
    this.timer = setInterval(async () => {
      if (this.events.length > 0) {
        await this.flush();
      }
    }, this.flushInterval);
  }

  private async flush(): Promise<void> {
    if (this.events.length === 0) return;

    const batch = [...this.events];
    this.events = [];

    // Emit batch for processing
    this.emit('batch', batch);

    // Here you would typically send to a database or external service
    // Removed console.log
  }

  destroy(): void {
    if (this.timer) {
      clearInterval(this.timer);
    }
    this.removeAllListeners();
  }
}