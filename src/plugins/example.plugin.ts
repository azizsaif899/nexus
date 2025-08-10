import { Plugin, TaskRequest, TaskResult } from '../core/types';

// Example plugin implementation
export const examplePlugin: Plugin = {
  name: 'Example Plugin',
  version: '1.0.0',
  enabled: true,
  config: {
    maxRetries: 3,
    timeout: 5000
  },
  hooks: {
    beforeTask: async (task: TaskRequest) => {
      console.log(`🔌 Example Plugin: Processing task ${task.id}`);
      
      // Add custom logic before task execution
      if (task.priority === 'critical') {
        console.log('⚡ Critical task detected - applying special handling');
      }
    },
    
    afterTask: async (task: TaskRequest, result: TaskResult) => {
      console.log(`🔌 Example Plugin: Task ${task.id} completed with status: ${result.success}`);
      
      // Add custom logic after task completion
      if (result.success) {
        console.log('✅ Task completed successfully');
      } else {
        console.log('❌ Task failed, logging for analysis');
      }
    },
    
    onError: async (error: Error, task: TaskRequest) => {
      console.error(`🔌 Example Plugin: Error in task ${task.id}:`, error.message);
      
      // Add custom error handling logic
      // Could send notifications, log to external systems, etc.
    }
  }
};

export default examplePlugin;