import { FileHelpers } from '../utils/fileHelpers';
import { ConfigManager } from '../config';
import * as path from 'path';

export class Scanner {
  private config = ConfigManager.getInstance().getConfig();

  async scanRepository(): Promise<string[]> {
    const repoRoot = this.config.paths.repoRoot;
    const files = await FileHelpers.scanDirectory(repoRoot, true);
    
    // Filter out files that shouldn't be scanned
    const filteredFiles = files.filter(file => this.shouldScanFile(file));
    
    console.log(`📁 Scanned ${filteredFiles.length} files`);
    return filteredFiles;
  }

  async scanChangedFiles(): Promise<string[]> {
    // Implementation for scanning only changed files (git diff)
    // This would integrate with git to get only modified files
    return this.scanRepository();
  }

  private shouldScanFile(filePath: string): boolean {
    const relativePath = path.relative(this.config.paths.repoRoot, filePath);
    
    // Skip certain directories and files
    const skipPatterns = [
      /node_modules/,
      /\.git/,
      /dist/,
      /build/,
      /coverage/,
      /\.backup\./,
      /\.log$/,
      /\.md$/
    ];

    return !skipPatterns.some(pattern => pattern.test(relativePath));
  }

  async getFileMetadata(filePath: string): Promise<any> {
    const stats = await FileHelpers.getFileStats(filePath);
    return {
      path: filePath,
      size: stats.size,
      lines: stats.lines,
      lastModified: stats.lastModified,
      type: this.getFileType(filePath)
    };
  }

  private getFileType(filePath: string): string {
    const ext = path.extname(filePath).toLowerCase();
    const typeMap: Record<string, string> = {
      '.ts': 'typescript',
      '.js': 'javascript',
      '.jsx': 'react',
      '.tsx': 'react-typescript',
      '.py': 'python',
      '.java': 'java',
      '.cpp': 'cpp',
      '.c': 'c',
      '.cs': 'csharp',
      '.go': 'go',
      '.rs': 'rust'
    };
    
    return typeMap[ext] || 'unknown';
  }
}