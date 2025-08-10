import { CronJob } from 'cron';
import { ConfigManager } from '../config';
import { eventBus } from '../events/eventBus';
import { PluginManager } from '../plugins/pluginManager';
import { TaskRequest, SystemHealth } from '../types';
import { Scanner } from './scanner';
import { Detector } from './detector';
import { TaskQueue } from './taskQueue';

export class Orchestrator {
  private static instance: Orchestrator;
  private config = ConfigManager.getInstance().getConfig();
  private pluginManager = PluginManager.getInstance();
  private scanner = new Scanner();
  private detector = new Detector();
  private taskQueue = new TaskQueue();
  private cronJob?: CronJob;
  private isRunning = false;

  private constructor() {
    this.setupEventListeners();
  }

  static getInstance(): Orchestrator {
    if (!Orchestrator.instance) {
      Orchestrator.instance = new Orchestrator();
    }
    return Orchestrator.instance;
  }

  private setupEventListeners(): void {
    eventBus.on('task:completed', (result) => {
      this.updateSystemHealth(result);
    });

    eventBus.on('task:failed', ({ task, error }) => {
      this.handleTaskFailure(task, error);
    });
  }

  start(): void {
    if (this.isRunning) return;

    this.cronJob = new CronJob(
      this.config.scheduler.interval,
      () => this.runCycle(),
      null,
      true,
      this.config.scheduler.timezone
    );

    this.isRunning = true;
    console.log('🚀 Orchestrator started');
  }

  stop(): void {
    if (this.cronJob) {
      this.cronJob.stop();
      this.cronJob = undefined;
    }
    this.isRunning = false;
    console.log('⏹️ Orchestrator stopped');
  }

  async runCycle(): Promise<void> {
    if (this.isRunning) return; // Prevent overlapping cycles
    
    this.isRunning = true;
    const startTime = Date.now();
    
    try {
      eventBus.emit('orchestrator:cycle_start', undefined);
      
      // 1. Scan for files
      const files = await this.scanner.scanRepository();
      
      // 2. Detect errors
      const errors = await this.detector.detectErrors(files);
      
      // 3. Create tasks
      const tasks = this.createTasksFromErrors(errors);
      
      // 4. Queue tasks
      for (const task of tasks) {
        this.taskQueue.enqueue(task);
        eventBus.emit('task:assigned', task);
      }
      
      // 5. Process tasks
      await this.taskQueue.processAll();
      
      const duration = Date.now() - startTime;
      eventBus.emit('orchestrator:cycle_complete', { 
        duration, 
        tasksProcessed: tasks.length 
      });
      
    } catch (error) {
      console.error('❌ Orchestrator cycle failed:', error);
    } finally {
      this.isRunning = false;
    }
  }

  private createTasksFromErrors(errors: any[]): TaskRequest[] {
    return errors.map(error => ({
      id: `TASK-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
      type: 'fix' as const,
      priority: this.determinePriority(error),
      file: error.file,
      description: error.message,
      assignedTo: 'executor' as const,
      status: 'pending' as const,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      metadata: { error }
    }));
  }

  private determinePriority(error: any): 'low' | 'medium' | 'high' | 'critical' {
    if (error.severity === 'error') return 'high';
    if (error.severity === 'warning') return 'medium';
    return 'low';
  }

  private updateSystemHealth(result: any): void {
    // Update system health metrics
    console.log('📊 Updating system health metrics');
  }

  private handleTaskFailure(task: TaskRequest, error: Error): void {
    console.error(`❌ Task ${task.id} failed:`, error.message);
    // Implement retry logic or escalation
  }

  getSystemHealth(): SystemHealth {
    return {
      status: 'healthy',
      score: 95,
      lastUpdate: new Date().toISOString(),
      metrics: {
        totalTasks: this.taskQueue.getTotalTasks(),
        completedTasks: this.taskQueue.getCompletedTasks(),
        failedTasks: this.taskQueue.getFailedTasks(),
        averageExecutionTime: 1500,
        errorRate: 0.05
      }
    };
  }
}