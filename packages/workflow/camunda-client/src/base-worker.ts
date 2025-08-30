export abstract class BaseWorker {
  abstract topicName: string;
  abstract handler(task: any): Promise<any>;
  
  async execute(task: any) {
    try {
      console.log(`🔄 Processing task: ${task.id} for topic: ${this.topicName}`);
      const result = await this.handler(task);
      console.log(`✅ Task completed: ${task.id}`);
      return { success: true, result };
    } catch (error) {
      console.error(`❌ Task failed: ${task.id}`, error);
      return { success: false, error: error instanceof Error ? error.message : 'Unknown error' };
    }
  }
}