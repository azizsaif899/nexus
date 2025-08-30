import { DomainEvent } from './event-types';

export type EventHandler<T extends DomainEvent = DomainEvent> = (event: T) => Promise<void> | void;

export class EventProcessor {
  private handlers = new Map<string, EventHandler[]>();
  private eventQueue: DomainEvent[] = [];
  private isProcessing = false;

  subscribe<T extends DomainEvent>(eventType: string, handler: EventHandler<T>): () => void {
    if (!this.handlers.has(eventType)) {
      this.handlers.set(eventType, []);
    }
    
    this.handlers.get(eventType)!.push(handler as EventHandler);
    
    // Return unsubscribe function
    return () => {
      const handlers = this.handlers.get(eventType);
      if (handlers) {
        const index = handlers.indexOf(handler as EventHandler);
        if (index > -1) {
          handlers.splice(index, 1);
        }
      }
    };
  }

  async publish(event: DomainEvent): Promise<void> {
    this.eventQueue.push(event);
    
    if (!this.isProcessing) {
      await this.processQueue();
    }
  }

  private async processQueue(): Promise<void> {
    this.isProcessing = true;
    
    while (this.eventQueue.length > 0) {
      const event = this.eventQueue.shift()!;
      await this.processEvent(event);
    }
    
    this.isProcessing = false;
  }

  private async processEvent(event: DomainEvent): Promise<void> {
    const handlers = this.handlers.get(event.type) || [];
    
    const promises = handlers.map(async (handler) => {
      try {
        await handler(event);
      } catch (error) {
        console.error(`Error processing event ${event.type}:`, error);
      }
    });
    
    await Promise.all(promises);
  }

  getEventStats(): { totalEvents: number; queueSize: number; handlerCount: number } {
    return {
      totalEvents: 0, // يمكن تتبعها لاحقاً
      queueSize: this.eventQueue.length,
      handlerCount: Array.from(this.handlers.values()).reduce((sum, handlers) => sum + handlers.length, 0)
    };
  }
}

export const eventProcessor = new EventProcessor();