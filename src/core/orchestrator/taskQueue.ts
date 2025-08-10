import { TaskRequest, TaskResult } from '../types';
import { eventBus } from '../events/eventBus';

export class TaskQueue {
  private queue: TaskRequest[] = [];
  private processing = false;
  private completed: TaskResult[] = [];
  private failed: TaskRequest[] = [];

  enqueue(task: TaskRequest): void {
    this.queue.push(task);
    this.sortByPriority();
  }

  private sortByPriority(): void {
    const priorityOrder = { critical: 0, high: 1, medium: 2, low: 3 };
    this.queue.sort((a, b) => priorityOrder[a.priority] - priorityOrder[b.priority]);
  }

  async processAll(): Promise<void> {
    if (this.processing) return;
    
    this.processing = true;
    
    while (this.queue.length > 0) {
      const task = this.queue.shift()!;
      await this.processTask(task);
    }
    
    this.processing = false;
  }

  private async processTask(task: TaskRequest): Promise<void> {
    try {
      task.status = 'in_progress';
      task.updatedAt = new Date().toISOString();
      
      eventBus.emit('task:started', task);
      
      // The actual processing is handled by the executor
      // This is just queue management
      
      // Simulate processing time based on priority
      const processingTime = this.getProcessingTime(task.priority);
      await new Promise(resolve => setTimeout(resolve, processingTime));
      
      // Task completion will be handled by the executor
      // and communicated back via events
      
    } catch (error) {
      this.failed.push(task);
      eventBus.emit('task:failed', { task, error: error as Error });
    }
  }

  private getProcessingTime(priority: string): number {
    const times = { critical: 100, high: 200, medium: 500, low: 1000 };
    return times[priority as keyof typeof times] || 1000;
  }

  onTaskCompleted(result: TaskResult): void {
    this.completed.push(result);
  }

  onTaskFailed(task: TaskRequest): void {
    this.failed.push(task);
  }

  getQueueStatus(): {
    pending: number;
    processing: boolean;
    completed: number;
    failed: number;
  } {
    return {
      pending: this.queue.length,
      processing: this.processing,
      completed: this.completed.length,
      failed: this.failed.length
    };
  }

  getTotalTasks(): number {
    return this.queue.length + this.completed.length + this.failed.length;
  }

  getCompletedTasks(): number {
    return this.completed.length;
  }

  getFailedTasks(): number {
    return this.failed.length;
  }

  getPendingTasks(): TaskRequest[] {
    return [...this.queue];
  }

  getCompletedResults(): TaskResult[] {
    return [...this.completed];
  }

  getFailedTasks_(): TaskRequest[] {
    return [...this.failed];
  }

  clear(): void {
    this.queue = [];
    this.completed = [];
    this.failed = [];
  }

  retryFailed(): void {
    const failedTasks = [...this.failed];
    this.failed = [];
    
    failedTasks.forEach(task => {
      task.status = 'pending';
      task.updatedAt = new Date().toISOString();
      this.enqueue(task);
    });
  }
}