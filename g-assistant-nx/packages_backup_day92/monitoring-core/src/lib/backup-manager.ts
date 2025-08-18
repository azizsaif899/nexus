export interface BackupConfig {
  name: string;
  source: string;
  destination: string;
  schedule: string; // cron format
  retention: number; // days
  compression: boolean;
}

export interface BackupStatus {
  id: string;
  config: string;
  status: 'running' | 'completed' | 'failed';
  startTime: Date;
  endTime?: Date;
  size?: number;
  error?: string;
}

export class BackupManager {
  private configs = new Map<string, BackupConfig>();
  private backups: BackupStatus[] = [];
  private schedules = new Map<string, NodeJS.Timeout>();

  addBackupConfig(config: BackupConfig): void {
    this.configs.set(config.name, config);
    this.scheduleBackup(config);
  }

  private scheduleBackup(config: BackupConfig): void {
    // Simple interval-based scheduling (in production, use proper cron)
    const interval = this.parseCronToInterval(config.schedule);
    
    const timeoutId = setInterval(() => {
      this.executeBackup(config.name);
    }, interval);
    
    this.schedules.set(config.name, timeoutId);
  }

  private parseCronToInterval(cron: string): number {
    // Simplified cron parsing - in production use proper cron library
    if (cron.includes('daily') || cron.includes('0 0 *')) {
      return 24 * 60 * 60 * 1000; // 24 hours
    }
    if (cron.includes('hourly') || cron.includes('0 *')) {
      return 60 * 60 * 1000; // 1 hour
    }
    return 60 * 60 * 1000; // Default 1 hour
  }

  async executeBackup(configName: string): Promise<BackupStatus> {
    const config = this.configs.get(configName);
    if (!config) {
      throw new Error(`Backup config ${configName} not found`);
    }

    const backup: BackupStatus = {
      id: `backup_${Date.now()}`,
      config: configName,
      status: 'running',
      startTime: new Date()
    };

    this.backups.push(backup);

    try {
      // Simulate backup process
      await this.performBackup(config);
      
      backup.status = 'completed';
      backup.endTime = new Date();
      backup.size = Math.floor(Math.random() * 1000000); // Random size in bytes
      
      // Clean old backups
      this.cleanOldBackups(config);
      
    } catch (error) {
      backup.status = 'failed';
      backup.endTime = new Date();
      backup.error = error.message;
    }

    return backup;
  }

  private async performBackup(config: BackupConfig): Promise<void> {
    // Simulate backup operation
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        if (Math.random() > 0.1) { // 90% success rate
          resolve();
        } else {
          reject(new Error('Backup failed: Disk space insufficient'));
        }
      }, 2000);
    });
  }

  private cleanOldBackups(config: BackupConfig): void {
    const cutoffDate = new Date();
    cutoffDate.setDate(cutoffDate.getDate() - config.retention);
    
    this.backups = this.backups.filter(backup => 
      backup.config !== config.name || backup.startTime >= cutoffDate
    );
  }

  getBackupHistory(configName?: string, limit = 50): BackupStatus[] {
    let filtered = this.backups;
    
    if (configName) {
      filtered = filtered.filter(b => b.config === configName);
    }
    
    return filtered
      .sort((a, b) => b.startTime.getTime() - a.startTime.getTime())
      .slice(0, limit);
  }

  getBackupConfigs(): BackupConfig[] {
    return Array.from(this.configs.values());
  }

  removeBackupConfig(name: string): boolean {
    const timeout = this.schedules.get(name);
    if (timeout) {
      clearInterval(timeout);
      this.schedules.delete(name);
    }
    
    return this.configs.delete(name);
  }

  getBackupStats(): {
    totalConfigs: number;
    successRate: number;
    lastBackup?: Date;
    totalSize: number;
  } {
    const recentBackups = this.backups.filter(b => 
      b.startTime >= new Date(Date.now() - 7 * 24 * 60 * 60 * 1000)
    );
    
    const successful = recentBackups.filter(b => b.status === 'completed');
    const successRate = recentBackups.length > 0 ? (successful.length / recentBackups.length) * 100 : 0;
    
    const lastBackup = this.backups.length > 0 
      ? this.backups.sort((a, b) => b.startTime.getTime() - a.startTime.getTime())[0].startTime
      : undefined;
    
    const totalSize = successful.reduce((sum, b) => sum + (b.size || 0), 0);

    return {
      totalConfigs: this.configs.size,
      successRate,
      lastBackup,
      totalSize
    };
  }
}