import { TaskRequest, TaskResult, FileChange, TaskMetrics } from '../types';
import { eventBus } from '../events/eventBus';
import { PluginManager } from '../plugins/pluginManager';
import { FileHelpers } from '../utils/fileHelpers';
import { BackupManager } from './backupManager';
import { PatchApplier } from './patchApplier';
import { PostValidator } from './postValidator';
import { RollbackManager } from './rollbackManager';

export class Executor {
  private static instance: Executor;
  private pluginManager = PluginManager.getInstance();
  private backupManager = new BackupManager();
  private patchApplier = new PatchApplier();
  private postValidator = new PostValidator();
  private rollbackManager = new RollbackManager();

  private constructor() {
    this.setupEventListeners();
  }

  static getInstance(): Executor {
    if (!Executor.instance) {
      Executor.instance = new Executor();
    }
    return Executor.instance;
  }

  private setupEventListeners(): void {
    eventBus.on('task:assigned', async (task) => {
      if (task.assignedTo === 'executor') {
        await this.executeTask(task);
      }
    });
  }

  async executeTask(task: TaskRequest): Promise<TaskResult> {
    const startTime = Date.now();
    let backupPath: string | undefined;
    
    try {
      // 1. Validate task
      this.validateTask(task);
      
      // 2. Run pre-task plugins
      await this.pluginManager.runPreTaskHooks(task);
      
      // 3. Create backup
      backupPath = await this.backupManager.createBackup(task.file);
      task.backupPath = backupPath;
      
      // 4. Apply patch/fix
      const changes = await this.applyFix(task);
      
      // 5. Validate changes
      await this.postValidator.validate(task);
      
      // 6. Calculate metrics
      const metrics = await this.calculateMetrics(task, startTime);
      
      // 7. Create result
      const result: TaskResult = {
        taskId: task.id,
        success: true,
        message: 'Task completed successfully',
        changes,
        metrics,
        errors: [],
        warnings: []
      };
      
      // 8. Run post-task plugins
      await this.pluginManager.runPostTaskHooks(task, result);
      
      // 9. Emit completion event
      eventBus.emit('task:completed', result);
      
      return result;
      
    } catch (error) {
      // Rollback on failure
      if (backupPath) {
        await this.rollbackManager.rollback(task.file, backupPath);
      }
      
      const result: TaskResult = {
        taskId: task.id,
        success: false,
        message: `Task failed: ${(error as Error).message}`,
        changes: [],
        metrics: await this.calculateMetrics(task, startTime),
        errors: [(error as Error).message],
        warnings: []
      };
      
      await this.pluginManager.runErrorHooks(error as Error, task);
      eventBus.emit('task:failed', { task, error: error as Error });
      
      return result;
    }
  }

  private validateTask(task: TaskRequest): void {
    if (!task.file) {
      throw new Error('Task file is required');
    }
    
    if (task.type === 'fix' && !task.patch && !task.description) {
      throw new Error('Fix tasks require either patch or description');
    }
  }

  private async applyFix(task: TaskRequest): Promise<FileChange[]> {
    const changes: FileChange[] = [];
    
    if (task.patch) {
      // Apply provided patch
      await this.patchApplier.applyPatch(task.file, task.patch);
      changes.push({
        file: task.file,
        action: 'modified',
        linesChanged: this.countPatchLines(task.patch),
        backupPath: task.backupPath
      });
    } else if (task.description) {
      // Generate and apply AI fix
      const generatedPatch = await this.generateAIFix(task);
      await this.patchApplier.applyPatch(task.file, generatedPatch);
      changes.push({
        file: task.file,
        action: 'modified',
        linesChanged: this.countPatchLines(generatedPatch),
        backupPath: task.backupPath
      });
    }
    
    return changes;
  }

  private async generateAIFix(task: TaskRequest): Promise<string> {
    // This would integrate with Gemini AI to generate fixes
    // For now, return a placeholder
    return `// AI-generated fix for: ${task.description}`;
  }

  private countPatchLines(patch: string): number {
    return patch.split('\n').length;
  }

  private async calculateMetrics(task: TaskRequest, startTime: number): Promise<TaskMetrics> {
    const executionTime = Date.now() - startTime;
    const fileStats = await FileHelpers.getFileStats(task.file);
    
    return {
      executionTime,
      linesOfCode: fileStats.lines,
      complexity: this.calculateComplexity(task.file),
      testCoverage: undefined, // Would be calculated by test runner
      securityScore: undefined // Would be calculated by security scanner
    };
  }

  private calculateComplexity(filePath: string): number {
    // Simple complexity calculation - can be enhanced
    return Math.floor(Math.random() * 10) + 1;
  }
}