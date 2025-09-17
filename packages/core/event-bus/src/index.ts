export class EventBus {
  emit(event: string, data: any): void {
    // Removed console.log
  }

  on(event: string, handler: (data: any) => void): void {
    // Removed console.log
  }
}

export const eventBus = new EventBus();