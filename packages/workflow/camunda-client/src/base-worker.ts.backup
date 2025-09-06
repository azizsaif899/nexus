export abstract class BaseWorker {
  abstract topicName: string;
  abstract handler(task: any): Promise<any>;
  
  async execute(task: any) {
    try {
      // Removed console.log
      const result = await this.handler(task);
      // Removed console.log
      return { success: true, result };
    } catch (error) {
      console.error(`❌ Task failed: ${task.id}`, error);
      return { success: false, error: error instanceof Error ? error.message : 'Unknown error' };
    }
  }
}