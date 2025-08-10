import * as fs from 'fs-extra';
import { eventBus } from '../events/eventBus';
import { BackupManager } from './backupManager';

export class RollbackManager {
  private backupManager = new BackupManager();

  async rollback(filePath: string, backupPath: string, reason = 'Execution failed'): Promise<void> {
    try {
      // Verify backup exists
      if (!await fs.pathExists(backupPath)) {
        throw new Error(`Backup file not found: ${backupPath}`);
      }

      // Restore from backup
      await fs.copy(backupPath, filePath);
      
      eventBus.emit('executor:rollback', { file: filePath, reason });
      
      console.log(`🔄 Rolled back ${filePath} from backup: ${reason}`);
      
    } catch (error) {
      throw new Error(`Rollback failed for ${filePath}: ${(error as Error).message}`);
    }
  }

  async rollbackToLatest(filePath: string, reason = 'Manual rollback'): Promise<void> {
    const latestBackup = await this.backupManager.getLatestBackup(filePath);
    
    if (!latestBackup) {
      throw new Error(`No backup found for ${filePath}`);
    }
    
    await this.rollback(filePath, latestBackup, reason);
  }

  async rollbackMultiple(files: Array<{ filePath: string; backupPath: string }>, reason = 'Batch rollback'): Promise<void> {
    const results = await Promise.allSettled(
      files.map(({ filePath, backupPath }) => this.rollback(filePath, backupPath, reason))
    );

    const failures = results
      .map((result, index) => ({ result, index }))
      .filter(({ result }) => result.status === 'rejected')
      .map(({ result, index }) => ({
        file: files[index].filePath,
        error: (result as PromiseRejectedResult).reason
      }));

    if (failures.length > 0) {
      const errorMessage = failures
        .map(f => `${f.file}: ${f.error}`)
        .join('; ');
      throw new Error(`Some rollbacks failed: ${errorMessage}`);
    }
  }

  async createRollbackPlan(filePaths: string[]): Promise<Array<{ filePath: string; backupPath: string | null }>> {
    const plan = [];
    
    for (const filePath of filePaths) {
      const latestBackup = await this.backupManager.getLatestBackup(filePath);
      plan.push({
        filePath,
        backupPath: latestBackup
      });
    }
    
    return plan;
  }

  async validateRollbackPlan(plan: Array<{ filePath: string; backupPath: string | null }>): Promise<{
    valid: boolean;
    issues: string[];
  }> {
    const issues = [];
    
    for (const item of plan) {
      if (!item.backupPath) {
        issues.push(`No backup available for ${item.filePath}`);
        continue;
      }
      
      if (!await fs.pathExists(item.backupPath)) {
        issues.push(`Backup file missing: ${item.backupPath}`);
        continue;
      }
      
      if (!await fs.pathExists(item.filePath)) {
        issues.push(`Original file missing: ${item.filePath}`);
        continue;
      }
    }
    
    return {
      valid: issues.length === 0,
      issues
    };
  }

  async executeRollbackPlan(plan: Array<{ filePath: string; backupPath: string | null }>, reason = 'Planned rollback'): Promise<void> {
    // Validate plan first
    const validation = await this.validateRollbackPlan(plan);
    if (!validation.valid) {
      throw new Error(`Rollback plan validation failed: ${validation.issues.join('; ')}`);
    }
    
    // Execute rollbacks
    const validItems = plan.filter(item => item.backupPath);
    await this.rollbackMultiple(
      validItems.map(item => ({ filePath: item.filePath, backupPath: item.backupPath! })),
      reason
    );
  }

  async getRollbackHistory(filePath?: string): Promise<Array<{
    filePath: string;
    backupPath: string;
    timestamp: string;
    reason: string;
  }>> {
    // This would typically be stored in a database or log file
    // For now, return empty array - implement based on your logging strategy
    return [];
  }

  async canRollback(filePath: string): Promise<boolean> {
    const latestBackup = await this.backupManager.getLatestBackup(filePath);
    return latestBackup !== null && await fs.pathExists(latestBackup);
  }

  async getRollbackInfo(filePath: string): Promise<{
    canRollback: boolean;
    latestBackup: string | null;
    backupAge: number | null;
    backupSize: number | null;
  }> {
    const latestBackup = await this.backupManager.getLatestBackup(filePath);
    
    if (!latestBackup || !await fs.pathExists(latestBackup)) {
      return {
        canRollback: false,
        latestBackup: null,
        backupAge: null,
        backupSize: null
      };
    }
    
    const backupStats = await fs.stat(latestBackup);
    const backupAge = Date.now() - backupStats.mtime.getTime();
    
    return {
      canRollback: true,
      latestBackup,
      backupAge,
      backupSize: backupStats.size
    };
  }
}