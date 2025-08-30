export class EventBus {
  emit(event: string, data: any): void {
    console.log(`Event emitted: ${event}`, data);
  }

  on(event: string, handler: (data: any) => void): void {
    console.log(`Event listener registered: ${event}`);
  }
}

export const eventBus = new EventBus();