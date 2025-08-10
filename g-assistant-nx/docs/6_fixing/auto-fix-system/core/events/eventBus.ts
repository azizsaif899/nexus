import { EventEmitter } from 'events';
import { TaskRequest, TaskResult } from '../types';

class EventBus extends EventEmitter {
  private static instance: EventBus;

  private constructor() {
    super();
    this.setMaxListeners(100);
  }

  static getInstance(): EventBus {
    if (!EventBus.instance) {
      EventBus.instance = new EventBus();
    }
    return EventBus.instance;
  }

  // إرسال مهمة للمنفذ
  assignTask(task: TaskRequest): void {
    console.log(`[EventBus] Assigning task ${task.id} to executor`);
    this.emit('task:assigned', task);
  }

  // استلام نتيجة من المنفذ
  completeTask(result: TaskResult): void {
    console.log(`[EventBus] Task ${result.taskId} completed`);
    this.emit('task:completed', result);
  }

  // إرسال تحديث حالة
  updateStatus(status: any): void {
    this.emit('status:updated', status);
  }
}

export const eventBus = EventBus.getInstance();