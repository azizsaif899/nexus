import { FileHelpers } from '../utils/fileHelpers';
import { ConfigManager } from '../config';
import * as path from 'path';
import * as fs from 'fs-extra';

export class BackupManager {
  private config = ConfigManager.getInstance().getConfig();
  private backupDir: string;

  constructor() {
    this.backupDir = this.config.paths.backupDir;
    this.ensureBackupDirectory();
  }

  private async ensureBackupDirectory(): Promise<void> {
    await FileHelpers.ensureDirectory(this.backupDir);
  }

  async createBackup(filePath: string): Promise<string> {
    const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
    const fileName = path.basename(filePath);
    const backupFileName = `${fileName}.${timestamp}.backup`;
    const backupPath = path.join(this.backupDir, backupFileName);

    await fs.copy(filePath, backupPath);
    
    // Store backup metadata
    await this.storeBackupMetadata(filePath, backupPath);
    
    return backupPath;
  }

  private async storeBackupMetadata(originalPath: string, backupPath: string): Promise<void> {
    const metadataPath = path.join(this.backupDir, 'backup-metadata.json');
    
    let metadata: any = {};
    if (await fs.pathExists(metadataPath)) {
      metadata = await fs.readJSON(metadataPath);
    }
    
    if (!metadata.backups) {
      metadata.backups = [];
    }
    
    metadata.backups.push({
      originalPath,
      backupPath,
      timestamp: new Date().toISOString(),
      size: (await fs.stat(originalPath)).size
    });
    
    await fs.writeJSON(metadataPath, metadata, { spaces: 2 });
  }

  async listBackups(filePath?: string): Promise<any[]> {
    const metadataPath = path.join(this.backupDir, 'backup-metadata.json');
    
    if (!await fs.pathExists(metadataPath)) {
      return [];
    }
    
    const metadata = await fs.readJSON(metadataPath);
    let backups = metadata.backups || [];
    
    if (filePath) {
      backups = backups.filter((backup: any) => backup.originalPath === filePath);
    }
    
    return backups.sort((a: any, b: any) => 
      new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime()
    );
  }

  async getLatestBackup(filePath: string): Promise<string | null> {
    const backups = await this.listBackups(filePath);
    return backups.length > 0 ? backups[0].backupPath : null;
  }

  async cleanupOldBackups(maxAge: number = 7 * 24 * 60 * 60 * 1000): Promise<void> {
    const metadataPath = path.join(this.backupDir, 'backup-metadata.json');
    
    if (!await fs.pathExists(metadataPath)) {
      return;
    }
    
    const metadata = await fs.readJSON(metadataPath);
    const backups = metadata.backups || [];
    const cutoffTime = Date.now() - maxAge;
    
    const validBackups = [];
    
    for (const backup of backups) {
      const backupTime = new Date(backup.timestamp).getTime();
      
      if (backupTime < cutoffTime) {
        // Delete old backup file
        try {
          await fs.remove(backup.backupPath);
          console.log(`🗑️ Deleted old backup: ${backup.backupPath}`);
        } catch (error) {
          console.warn(`Failed to delete backup ${backup.backupPath}:`, error);
        }
      } else {
        validBackups.push(backup);
      }
    }
    
    metadata.backups = validBackups;
    await fs.writeJSON(metadataPath, metadata, { spaces: 2 });
  }

  async getBackupStats(): Promise<{
    totalBackups: number;
    totalSize: number;
    oldestBackup: string | null;
    newestBackup: string | null;
  }> {
    const backups = await this.listBackups();
    
    if (backups.length === 0) {
      return {
        totalBackups: 0,
        totalSize: 0,
        oldestBackup: null,
        newestBackup: null
      };
    }
    
    const totalSize = backups.reduce((sum, backup) => sum + (backup.size || 0), 0);
    const sortedByTime = backups.sort((a, b) => 
      new Date(a.timestamp).getTime() - new Date(b.timestamp).getTime()
    );
    
    return {
      totalBackups: backups.length,
      totalSize,
      oldestBackup: sortedByTime[0]?.timestamp || null,
      newestBackup: sortedByTime[sortedByTime.length - 1]?.timestamp || null
    };
  }
}