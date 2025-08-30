export interface EventData {
  [key: string]: any;
}

export interface EventListener<T = EventData> {
  (data: T): void | Promise<void>;
}

export class EventBus {
  private listeners = new Map<string, EventListener[]>();

  on<T = EventData>(event: string, listener: EventListener<T>): void {
    const eventListeners = this.listeners.get(event) || [];
    eventListeners.push(listener as EventListener);
    this.listeners.set(event, eventListeners);
  }

  emit<T = EventData>(event: string, data: T): void {
    const eventListeners = this.listeners.get(event) || [];
    eventListeners.forEach(listener => {
      try {
        listener(data);
      } catch (error) {
        console.error(`Error in event listener for ${event}:`, error);
      }
    });
  }

  removeAllListeners(): void {
    this.listeners.clear();
  }
}

export const eventBus = new EventBus();