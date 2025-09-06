import * as fs from 'fs';
import * as path from 'path';
import { glob } from 'glob';

export interface CodeFile {
  path: string;
  content: string;
  type: 'typescript' | 'javascript' | 'json';
  size: number;
  lastModified: Date;
}

export class CodeScanner {
  private projectRoot: string;
  private patterns = ['**/*.ts', '**/*.js', '**/*.tsx', '**/*.jsx'];
  private excludePatterns = ['**/node_modules/**', '**/dist/**', '**/*.d.ts'];

  constructor(projectRoot: string = process.cwd()) {
    this.projectRoot = projectRoot;
  }

  // مسح ملفات الكود
  async scanCodeFiles(): Promise<CodeFile[]> {
    // Removed console.log
    
    const files: CodeFile[] = [];
    
    for (const pattern of this.patterns) {
      const matches = await glob(pattern, {
        cwd: this.projectRoot,
        ignore: this.excludePatterns,
        absolute: true
      });

      for (const filePath of matches) {
        try {
          const stats = fs.statSync(filePath);
          const content = fs.readFileSync(filePath, 'utf-8');
          
          files.push({
            path: path.relative(this.projectRoot, filePath),
            content,
            type: this.getFileType(filePath),
            size: stats.size,
            lastModified: stats.mtime
          });
        } catch (error) {
          console.warn(`⚠️ تعذر قراءة الملف: ${filePath}`);
        }
      }
    }

    // Removed console.log
    return files;
  }

  // تحديد نوع الملف
  private getFileType(filePath: string): CodeFile['type'] {
    const ext = path.extname(filePath);
    switch (ext) {
      case '.ts':
      case '.tsx':
        return 'typescript';
      case '.js':
      case '.jsx':
        return 'javascript';
      case '.json':
        return 'json';
      default:
        return 'javascript';
    }
  }

  // مسح مجلدات محددة
  async scanSpecificPaths(paths: string[]): Promise<CodeFile[]> {
    // Removed console.log}`);
    
    const files: CodeFile[] = [];
    
    for (const targetPath of paths) {
      const fullPath = path.join(this.projectRoot, targetPath);
      
      if (!fs.existsSync(fullPath)) {
        console.warn(`⚠️ المجلد غير موجود: ${targetPath}`);
        continue;
      }

      for (const pattern of this.patterns) {
        const matches = await glob(pattern, {
          cwd: fullPath,
          ignore: this.excludePatterns,
          absolute: true
        });

        for (const filePath of matches) {
          try {
            const stats = fs.statSync(filePath);
            const content = fs.readFileSync(filePath, 'utf-8');
            
            files.push({
              path: path.relative(this.projectRoot, filePath),
              content,
              type: this.getFileType(filePath),
              size: stats.size,
              lastModified: stats.mtime
            });
          } catch (error) {
            console.warn(`⚠️ تعذر قراءة الملف: ${filePath}`);
          }
        }
      }
    }

    // Removed console.log
    return files;
  }

  // حفظ نتائج المسح
  async saveResults(files: CodeFile[], outputPath: string): Promise<void> {
    const results = {
      timestamp: new Date().toISOString(),
      totalFiles: files.length,
      totalSize: files.reduce((sum, f) => sum + f.size, 0),
      fileTypes: this.groupByType(files),
      files: files.map(f => ({
        path: f.path,
        type: f.type,
        size: f.size,
        lastModified: f.lastModified
      }))
    };

    fs.writeFileSync(outputPath, JSON.stringify(results, null, 2));
    // Removed console.log
  }

  // تجميع الملفات حسب النوع
  private groupByType(files: CodeFile[]) {
    return files.reduce((acc, file) => {
      acc[file.type] = (acc[file.type] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);
  }
}

// تشغيل المسح إذا تم استدعاء الملف مباشرة
if (require.main === module) {
  const scanner = new CodeScanner();
  scanner.scanCodeFiles().then(files => {
    const outputPath = path.join(__dirname, '../../docs/6_fixing/reports/scan_results.json');
    scanner.saveResults(files, outputPath);
  });
}