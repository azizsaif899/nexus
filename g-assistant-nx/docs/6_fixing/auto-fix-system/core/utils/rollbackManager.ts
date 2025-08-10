import * as fs from 'fs';
import * as path from 'path';

export class RollbackManager {
  private static backups = new Map<string, string>();

  // إنشاء نسخة احتياطية
  static async createBackup(filePath: string): Promise<string> {
    try {
      const timestamp = Date.now();
      const backupPath = `${filePath}.backup.${timestamp}`;
      
      if (fs.existsSync(filePath)) {
        fs.copyFileSync(filePath, backupPath);
        this.backups.set(filePath, backupPath);
        console.log(`✅ Backup created: ${backupPath}`);
        return backupPath;
      }
      
      throw new Error(`File not found: ${filePath}`);
    } catch (error) {
      console.error(`❌ Backup failed for ${filePath}:`, error);
      throw error;
    }
  }

  // التراجع التلقائي
  static async rollbackOnFailure(filePath: string, reason = 'Execution failed'): Promise<void> {
    try {
      const backupPath = this.backups.get(filePath);
      
      if (!backupPath || !fs.existsSync(backupPath)) {
        throw new Error(`No backup found for ${filePath}`);
      }

      // استعادة من النسخة الاحتياطية
      fs.copyFileSync(backupPath, filePath);
      console.log(`🔄 Rollback completed for ${filePath}: ${reason}`);
      
      // تنظيف النسخة الاحتياطية
      this.cleanupBackup(filePath);
      
    } catch (error) {
      console.error(`❌ Rollback failed for ${filePath}:`, error);
      throw error;
    }
  }

  // تنظيف النسخة الاحتياطية
  static cleanupBackup(filePath: string): void {
    try {
      const backupPath = this.backups.get(filePath);
      if (backupPath && fs.existsSync(backupPath)) {
        fs.unlinkSync(backupPath);
        this.backups.delete(filePath);
        console.log(`🗑️ Backup cleaned: ${backupPath}`);
      }
    } catch (error) {
      console.warn(`⚠️ Cleanup failed for ${filePath}:`, error);
    }
  }

  // التحقق من وجود نسخة احتياطية
  static hasBackup(filePath: string): boolean {
    const backupPath = this.backups.get(filePath);
    return backupPath ? fs.existsSync(backupPath) : false;
  }

  // الحصول على مسار النسخة الاحتياطية
  static getBackupPath(filePath: string): string | undefined {
    return this.backups.get(filePath);
  }
}