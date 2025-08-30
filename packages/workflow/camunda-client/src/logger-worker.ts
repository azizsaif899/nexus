import { BaseWorker } from './base-worker';

export class LoggerWorker extends BaseWorker {
  topicName = 'logger-task';

  async handler(task: any): Promise<any> {
    console.log('📝 Logger Worker executing:', {
      taskId: task.id,
      variables: task.variables,
      processInstanceId: task.processInstanceId
    });

    // Simulate some work
    await new Promise(resolve => setTimeout(resolve, 1000));

    return {
      message: 'Task logged successfully',
      timestamp: new Date().toISOString(),
      taskId: task.id
    };
  }
}