// Main entry point for the G-Assistant Auto-Fix System
export * from './types';
export * from './config';
export * from './events/eventBus';
export * from './plugins/pluginManager';
export * from './utils/fileHelpers';

// Core Services
export { Orchestrator } from './orchestrator/index';
export { Executor } from './executor/index';
export { Reviewer } from './reviewer/index';

// System Manager
export class AutoFixSystem {
  private orchestrator: any;
  private executor: any;
  private reviewer: any;

  constructor() {
    // تأخير التهيئة لتجنب مشاكل الاستيراد الدائري
    this.initializeComponents();
  }

  private async initializeComponents() {
    const { Orchestrator } = await import('./orchestrator/index');
    const { Executor } = await import('./executor/index');
    const { Reviewer } = await import('./reviewer/index');
    
    this.orchestrator = Orchestrator.getInstance();
    this.executor = Executor.getInstance();
    this.reviewer = Reviewer.getInstance();
  }

  async start(): Promise<void> {
    console.log('🚀 Starting G-Assistant Auto-Fix System...');
    
    // Ensure components are initialized
    await this.initializeComponents();
    
    // Initialize all components
    if (this.orchestrator) {
      this.orchestrator.start();
    }
    
    console.log('✅ Auto-Fix System started successfully');
  }

  async stop(): Promise<void> {
    console.log('⏹️ Stopping G-Assistant Auto-Fix System...');
    
    this.orchestrator.stop();
    
    console.log('✅ Auto-Fix System stopped successfully');
  }

  getSystemHealth() {
    return this.orchestrator.getSystemHealth();
  }

  async runManualCycle(): Promise<void> {
    await this.orchestrator.runCycle();
  }

  async reviewFiles(files: string[]): Promise<any> {
    return this.reviewer.reviewBranch('manual-review', files);
  }
}