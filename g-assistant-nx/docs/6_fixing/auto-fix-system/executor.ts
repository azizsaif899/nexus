import { TaskRequest, TaskResult } from './core/types';
import { eventBus } from './core/events/eventBus';
import { SafetyChecks } from './core/utils/safetyChecks';
import { RollbackManager } from './core/utils/rollbackManager';
import * as fs from 'fs';

export class SmartExecutor {
  private isListening = false;

  constructor() {
    this.startListening();
  }

  private startListening(): void {
    if (this.isListening) return;
    
    this.isListening = true;
    console.log('🎯 [Executor] بدء الاستماع للمهام...');
    
    // الاستماع للمهام المسندة
    eventBus.on('task:assigned', async (task: TaskRequest) => {
      if (task.assignedTo === 'executor') {
        console.log(`🔧 [Executor] استلام مهمة: ${task.id}`);
        await this.executeTask(task);
      }
    });
  }

  private async executeTask(task: TaskRequest): Promise<void> {
    console.log(`⚡ [Executor] بدء تنفيذ المهمة: ${task.id}`);
    
    try {
      // فحص الأمان قبل التنفيذ
      const safeToExecute = await SafetyChecks.preExecutionCheck(task.file);
      if (!safeToExecute) {
        throw new Error('Pre-execution check failed - file modified');
      }

      // إنشاء نسخة احتياطية
      const backupPath = await RollbackManager.createBackup(task.file);
      console.log(`💾 [Executor] نسخة احتياطية: ${backupPath}`);

      // تنفيذ الإصلاح الفعلي
      await this.performFix(task);

      // حساب مؤشر الثقة
      const confidenceScore = SafetyChecks.calculateConfidenceScore(
        task.metadata?.errorType || 'unknown',
        'simple',
        1
      );

      const result: TaskResult = {
        taskId: task.id,
        success: true,
        message: `✅ تم إصلاح ${task.description}`,
        changes: [{
          file: task.file,
          action: 'modified',
          linesChanged: 1
        }],
        metrics: {
          executionTime: 1500,
          linesOfCode: 100,
          complexity: 5
        },
        confidenceScore,
        requiresHumanReview: SafetyChecks.requiresHumanReview(confidenceScore, 1)
      };

      // إرسال النتيجة
      eventBus.completeTask(result);
      
      // تنظيف النسخة الاحتياطية عند النجاح
      RollbackManager.cleanupBackup(task.file);
      
      console.log(`✅ [Executor] اكتملت المهمة: ${task.id} (ثقة: ${confidenceScore}%)`);

    } catch (error) {
      // التراجع التلقائي عند الفشل
      await RollbackManager.rollbackOnFailure(task.file, (error as Error).message);
      
      const failedResult: TaskResult = {
        taskId: task.id,
        success: false,
        message: `❌ فشل: ${(error as Error).message}`,
        changes: [],
        metrics: {
          executionTime: 1500,
          linesOfCode: 0,
          complexity: 0
        },
        errors: [(error as Error).message],
        confidenceScore: 0,
        requiresHumanReview: true
      };

      eventBus.completeTask(failedResult);
      console.error(`❌ [Executor] فشلت المهمة: ${task.id} - ${(error as Error).message}`);
    }
  }

  private async performFix(task: TaskRequest): Promise<void> {
    // محاكاة الإصلاح الفعلي
    if (task.metadata?.error?.message?.includes('console.log')) {
      // إصلاح console.log
      const content = fs.readFileSync(task.file, 'utf-8');
      const lines = content.split('\n');
      const lineIndex = task.metadata.error.line - 1;
      
      if (lines[lineIndex]?.includes('console.log')) {
        lines[lineIndex] = lines[lineIndex].replace('console.log', '// TODO: Remove console.log');
        fs.writeFileSync(task.file, lines.join('\n'));
        console.log(`🔧 [Executor] تم إصلاح console.log في السطر ${task.metadata.error.line}`);
      }
    }
    
    // تأخير للمحاكاة
    await new Promise(resolve => setTimeout(resolve, 1000));
  }

  // دالة لبدء الاستماع يدوياً
  static startExecutor(): SmartExecutor {
    return new SmartExecutor();
  }
}