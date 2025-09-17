import { Client } from 'camunda-external-task-client-js';
// Temporary inline LoggerWorker until package is properly configured
class LoggerWorker {
  topicName = 'logger-task';

  async execute(task: any) {
    try {
      // Removed console.log

      await new Promise(resolve => setTimeout(resolve, 1000));

      return {
        success: true,
        result: {
          message: 'Task logged successfully',
          timestamp: new Date().toISOString(),
          taskId: task.id
        }
      };
    } catch (error) {
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error'
      };
    }
  }
}

export class CamundaWorkerManager {
  private client: Client;
  private workers: any[] = [];

  constructor() {
    this.client = new Client({
      baseUrl: 'http://localhost:8080/engine-rest'
    });
  }

  async start() {
    try {
      // Removed console.log
      
      // Register Logger Worker
      const loggerWorker = new LoggerWorker();
      const worker = this.client.subscribe(loggerWorker.topicName, async ({ task, taskService }) => {
        try {
          const result = await loggerWorker.execute(task);
          
          if (result.success) {
            await taskService.complete(task, result.result);
            // Removed console.log
          } else {
            await taskService.handleFailure(task, {
              errorMessage: result.error,
              retries: 3,
              retryTimeout: 5000
            });
            console.error(`❌ Task failed: ${task.id}`, result.error);
          }
        } catch (error) {
          console.error(`💥 Worker error: ${task.id}`, error);
          await taskService.handleFailure(task, {
            errorMessage: error instanceof Error ? error.message : 'Unknown error',
            retries: 0
          });
        }
      });

      this.workers.push(worker);
      // Removed console.log
      
    } catch (error) {
      console.error('❌ Failed to start Camunda Workers:', error);
      throw error;
    }
  }

  async stop() {
    // Removed console.log
    for (const worker of this.workers) {
      if (worker && typeof worker.stop === 'function') {
        await worker.stop();
      }
    }
    this.workers = [];
    // Removed console.log
  }

  getStatus() {
    return {
      workersCount: this.workers.length,
      camundaUrl: 'http://localhost:8080/engine-rest',
      status: this.workers.length > 0 ? 'running' : 'stopped'
    };
  }
}