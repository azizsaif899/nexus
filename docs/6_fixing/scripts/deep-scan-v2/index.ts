#!/usr/bin/env node

import { EnhancedOrchestrator } from './enhanced-orchestrator';
import { SmartExecutor } from './executor';
import { eventBus } from './core/events/eventBus';

class AutoFixSystem {
  private orchestrator: EnhancedOrchestrator;
  private executor: SmartExecutor;

  constructor() {
    this.orchestrator = EnhancedOrchestrator.getInstance();
    this.executor = SmartExecutor.startExecutor();
  }

  async start(): Promise<void> {
    // Removed console.log
    
    // الاستماع لإكمال المهام
    eventBus.on('task:completed', (result) => {
      // Removed console.log
    });

    // Removed console.log
  }

  async runCycle(): Promise<void> {
    // Removed console.log
    await this.orchestrator.runCycle();
  }

  getSystemHealth() {
    return this.orchestrator.getSystemHealth();
  }
}

// التشغيل المباشر
async function main() {
  const args = process.argv.slice(2);
  const system = new AutoFixSystem();
  
  await system.start();
  
  if (args.includes('--cycle')) {
    await system.runCycle();
  } else if (args.includes('--health')) {
    const health = system.getSystemHealth();
    // Removed console.log);
  } else {
    // Removed console.log
  }
}

if (require.main === module) {
  main().catch(console.error);
}

export { AutoFixSystem };