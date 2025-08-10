import { EventEmitter } from 'events';
import { TaskRequest, TaskResult, ErrorInfo } from '../types';

interface EventMap {
  // Task Events
  'task:assigned': TaskRequest;
  'task:started': TaskRequest;
  'task:completed': TaskResult;
  'task:failed': { task: TaskRequest; error: Error };
  'task:needs_clarification': TaskRequest;
  
  // System Events
  'system:health_check': void;
  'system:backup_created': { file: string; backupPath: string };
  'system:error': ErrorInfo;
  
  // Plugin Events
  'plugin:loaded': { name: string; version: string };
  'plugin:error': { name: string; error: Error };
  
  // Orchestrator Events
  'orchestrator:cycle_start': void;
  'orchestrator:cycle_complete': { duration: number; tasksProcessed: number };
  
  // Reviewer Events
  'review:started': { branch: string };
  'review:completed': { branch: string; results: any };
  
  // Executor Events
  'executor:patch_applied': { file: string; success: boolean };
  'executor:rollback': { file: string; reason: string };
}

class TypedEventBus extends EventEmitter {
  emit<K extends keyof EventMap>(event: K, data: EventMap[K]): boolean {
    return super.emit(event, data);
  }

  on<K extends keyof EventMap>(event: K, listener: (data: EventMap[K]) => void): this {
    return super.on(event, listener);
  }

  once<K extends keyof EventMap>(event: K, listener: (data: EventMap[K]) => void): this {
    return super.once(event, listener);
  }

  off<K extends keyof EventMap>(event: K, listener: (data: EventMap[K]) => void): this {
    return super.off(event, listener);
  }
}

export const eventBus = new TypedEventBus();

// Event Logger
eventBus.on('task:completed', (result) => {
  console.log(`✅ Task ${result.taskId} completed successfully`);
});

eventBus.on('task:failed', ({ task, error }) => {
  console.error(`❌ Task ${task.id} failed: ${error.message}`);
});

eventBus.on('system:error', (error) => {
  console.error(`🚨 System Error: ${error.message} at ${error.file}:${error.line}`);
});