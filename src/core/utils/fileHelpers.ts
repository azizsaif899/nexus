import * as fs from 'fs-extra';
import * as path from 'path';
import { eventBus } from '../events/eventBus';

export class FileHelpers {
  static async createBackup(filePath: string): Promise<string> {
    const timestamp = Date.now();
    const backupPath = `${filePath}.backup.${timestamp}`;
    
    try {
      await fs.copy(filePath, backupPath);
      eventBus.emit('system:backup_created', { file: filePath, backupPath });
      return backupPath;
    } catch (error) {
      throw new Error(`Failed to create backup: ${error}`);
    }
  }

  static async applyPatch(filePath: string, patch: string): Promise<void> {
    try {
      const content = await fs.readFile(filePath, 'utf-8');
      const patchedContent = this.applyPatchToContent(content, patch);
      await fs.writeFile(filePath, patchedContent);
      
      eventBus.emit('executor:patch_applied', { file: filePath, success: true });
    } catch (error) {
      eventBus.emit('executor:patch_applied', { file: filePath, success: false });
      throw error;
    }
  }

  private static applyPatchToContent(content: string, patch: string): string {
    // Simple patch application - can be enhanced with proper diff/patch library
    const lines = content.split('\n');
    const patchLines = patch.split('\n');
    
    // Basic implementation - replace this with proper patch logic
    return patch;
  }

  static async restoreFromBackup(filePath: string, backupPath: string): Promise<void> {
    try {
      await fs.copy(backupPath, filePath);
      eventBus.emit('executor:rollback', { file: filePath, reason: 'Manual restore' });
    } catch (error) {
      throw new Error(`Failed to restore from backup: ${error}`);
    }
  }

  static isCodeFile(filePath: string): boolean {
    const codeExtensions = ['.ts', '.js', '.jsx', '.tsx', '.py', '.java', '.cpp', '.c', '.cs', '.go', '.rs'];
    const ext = path.extname(filePath).toLowerCase();
    return codeExtensions.includes(ext);
  }

  static async ensureDirectory(dirPath: string): Promise<void> {
    await fs.ensureDir(dirPath);
  }

  static async getFileStats(filePath: string): Promise<{ size: number; lines: number; lastModified: Date }> {
    const stats = await fs.stat(filePath);
    const content = await fs.readFile(filePath, 'utf-8');
    const lines = content.split('\n').length;
    
    return {
      size: stats.size,
      lines,
      lastModified: stats.mtime
    };
  }

  static async scanDirectory(dirPath: string, recursive = true): Promise<string[]> {
    const files: string[] = [];
    
    const scan = async (currentPath: string) => {
      const entries = await fs.readdir(currentPath, { withFileTypes: true });
      
      for (const entry of entries) {
        const fullPath = path.join(currentPath, entry.name);
        
        if (entry.isFile() && this.isCodeFile(fullPath)) {
          files.push(fullPath);
        } else if (entry.isDirectory() && recursive && !this.isIgnoredDirectory(entry.name)) {
          await scan(fullPath);
        }
      }
    };
    
    await scan(dirPath);
    return files;
  }

  private static isIgnoredDirectory(dirName: string): boolean {
    const ignoredDirs = ['node_modules', '.git', 'dist', 'build', '.next', 'coverage'];
    return ignoredDirs.includes(dirName);
  }
}