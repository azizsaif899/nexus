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
    console.log('🚀 بدء نظام الإصلاح الذاتي المحسن...');
    
    // الاستماع لإكمال المهام
    eventBus.on('task:completed', (result) => {
      console.log(`📋 [System] اكتملت المهمة: ${result.taskId} - ${result.success ? '✅ نجح' : '❌ فشل'}`);
    });

    console.log('✅ النظام جاهز ويستمع للمهام');
  }

  async runCycle(): Promise<void> {
    console.log('🔄 بدء دورة إصلاح جديدة...');
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
    console.log('📊 حالة النظام:', JSON.stringify(health, null, 2));
  } else {
    console.log('💡 استخدم --cycle لتشغيل دورة أو --health لفحص الحالة');
  }
}

if (require.main === module) {
  main().catch(console.error);
}

export { AutoFixSystem };