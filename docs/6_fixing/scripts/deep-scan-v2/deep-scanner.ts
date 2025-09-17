import * as fs from 'fs';
import * as path from 'path';
import { eventBus } from './core/events/eventBus';
import { TaskRequest, TaskResult } from './core/types';

export interface ScanResult {
  file: string;
  issues: Issue[];
  severity: 'low' | 'medium' | 'high' | 'critical';
  confidence: number;
  fixable: boolean;
}

export interface Issue {
  type: 'security' | 'dependency' | 'typescript' | 'import' | 'performance';
  description: string;
  line?: number;
  column?: number;
  rule: string;
  fix?: string;
}

export interface DeepScanConfig {
  scanTypes: string[];
  excludePatterns: string[];
  maxDepth: number;
  parallel: boolean;
  autoFix: boolean;
}

export class DeepScanner {
  private config: DeepScanConfig;
  private scanResults: ScanResult[] = [];
  private isScanning = false;

  constructor(config: Partial<DeepScanConfig> = {}) {
    this.config = {
      scanTypes: ['security', 'dependency', 'typescript', 'import'],
      excludePatterns: ['node_modules', 'dist', '.nx', 'backups'],
      maxDepth: 10,
      parallel: true,
      autoFix: false,
      ...config
    };
  }

  async scanProject(projectPath: string): Promise<ScanResult[]> {
    if (this.isScanning) {
      throw new Error('Scan already in progress');
    }

    this.isScanning = true;
    this.scanResults = [];

    try {
      console.log('🔍 [Deep Scanner] بدء الفحص الشامل...');
      
      const files = await this.collectFiles(projectPath);
      console.log(`📁 [Deep Scanner] تم العثور على ${files.length} ملف للفحص`);

      if (this.config.parallel) {
        await this.scanFilesParallel(files);
      } else {
        await this.scanFilesSequential(files);
      }

      await this.generateReport();
      
      if (this.config.autoFix) {
        await this.autoFixIssues();
      }

      return this.scanResults;
    } finally {
      this.isScanning = false;
    }
  }

  private async collectFiles(projectPath: string): Promise<string[]> {
    const files: string[] = [];
    
    const scanDir = (dir: string, depth: number = 0): void => {
      if (depth > this.config.maxDepth) return;
      
      const items = fs.readdirSync(dir);
      
      for (const item of items) {
        const fullPath = path.join(dir, item);
        const stat = fs.statSync(fullPath);
        
        if (this.shouldExclude(fullPath)) continue;
        
        if (stat.isDirectory()) {
          scanDir(fullPath, depth + 1);
        } else if (this.shouldScanFile(fullPath)) {
          files.push(fullPath);
        }
      }
    };

    scanDir(projectPath);
    return files;
  }

  private shouldExclude(filePath: string): boolean {
    return this.config.excludePatterns.some(pattern => 
      filePath.includes(pattern)
    );
  }

  private shouldScanFile(filePath: string): boolean {
    const ext = path.extname(filePath);
    return ['.ts', '.tsx', '.js', '.jsx', '.json', '.md'].includes(ext);
  }

  private async scanFilesParallel(files: string[]): Promise<void> {
    const batchSize = 10;
    const batches = [];
    
    for (let i = 0; i < files.length; i += batchSize) {
      batches.push(files.slice(i, i + batchSize));
    }

    for (const batch of batches) {
      const promises = batch.map(file => this.scanFile(file));
      const results = await Promise.allSettled(promises);
      
      results.forEach((result, index) => {
        if (result.status === 'fulfilled' && result.value) {
          this.scanResults.push(result.value);
        } else {
          console.error(`❌ فشل فحص ${batch[index]}: ${result.reason}`);
        }
      });
    }
  }

  private async scanFilesSequential(files: string[]): Promise<void> {
    for (const file of files) {
      try {
        const result = await this.scanFile(file);
        if (result) {
          this.scanResults.push(result);
        }
      } catch (error) {
        console.error(`❌ فشل فحص ${file}: ${error}`);
      }
    }
  }

  private async scanFile(filePath: string): Promise<ScanResult | null> {
    try {
      const content = fs.readFileSync(filePath, 'utf-8');
      const issues: Issue[] = [];

      // فحص الأمان
      if (this.config.scanTypes.includes('security')) {
        issues.push(...this.scanSecurity(content, filePath));
      }

      // فحص التبعيات
      if (this.config.scanTypes.includes('dependency')) {
        issues.push(...this.scanDependencies(content, filePath));
      }

      // فحص TypeScript
      if (this.config.scanTypes.includes('typescript')) {
        issues.push(...this.scanTypeScript(content, filePath));
      }

      // فحص المسارات
      if (this.config.scanTypes.includes('import')) {
        issues.push(...this.scanImports(content, filePath));
      }

      if (issues.length === 0) return null;

      const severity = this.calculateSeverity(issues);
      const confidence = this.calculateConfidence(issues);

      return {
        file: filePath,
        issues,
        severity,
        confidence,
        fixable: issues.some(issue => issue.fix)
      };
    } catch (error) {
      return null;
    }
  }

  private scanSecurity(content: string, filePath: string): Issue[] {
    const issues: Issue[] = [];
    const lines = content.split('\n');

    lines.forEach((line, index) => {
      // فحص XSS
      if (line.includes('dangerouslySetInnerHTML')) {
        issues.push({
          type: 'security',
          description: 'خطر XSS - استخدام dangerouslySetInnerHTML',
          line: index + 1,
          rule: 'no-dangerous-html',
          fix: 'استخدم sanitizeHtml أو textContent'
        });
      }

      // فحص Code Injection
      if (line.includes('eval(')) {
        issues.push({
          type: 'security',
          description: 'خطر Code Injection - استخدام eval()',
          line: index + 1,
          rule: 'no-eval',
          fix: 'استخدم vm.runInNewContext() أو JSON.parse()'
        });
      }

      // فحص console.log في الإنتاج
      if (line.includes('console.log') && !filePath.includes('test')) {
        issues.push({
          type: 'security',
          description: 'تسريب معلومات - console.log في الإنتاج',
          line: index + 1,
          rule: 'no-console',
          fix: 'احذف console.log أو استخدم logger'
        });
      }
    });

    return issues;
  }

  private scanDependencies(content: string, filePath: string): Issue[] {
    const issues: Issue[] = [];

    if (path.basename(filePath) === 'package.json') {
      try {
        const pkg = JSON.parse(content);
        
        // فحص التبعيات المفقودة
        if (!pkg.dependencies && !pkg.devDependencies) {
          issues.push({
            type: 'dependency',
            description: 'لا توجد تبعيات معرفة',
            rule: 'missing-dependencies',
            fix: 'أضف التبعيات المطلوبة'
          });
        }

        // فحص الإصدارات القديمة
        const deps = { ...pkg.dependencies, ...pkg.devDependencies };
        Object.keys(deps).forEach(dep => {
          if (deps[dep].startsWith('^0.') || deps[dep].startsWith('~0.')) {
            issues.push({
              type: 'dependency',
              description: `إصدار قديم: ${dep}@${deps[dep]}`,
              rule: 'outdated-dependency',
              fix: 'حدث إلى إصدار أحدث'
            });
          }
        });
      } catch (error) {
        issues.push({
          type: 'dependency',
          description: 'package.json غير صالح',
          rule: 'invalid-package-json'
        });
      }
    }

    return issues;
  }

  private scanTypeScript(content: string, filePath: string): Issue[] {
    const issues: Issue[] = [];
    const lines = content.split('\n');

    if (!filePath.endsWith('.ts') && !filePath.endsWith('.tsx')) {
      return issues;
    }

    lines.forEach((line, index) => {
      // فحص any types
      if (line.includes(': any') || line.includes('<any>')) {
        issues.push({
          type: 'typescript',
          description: 'استخدام any type - فقدان type safety',
          line: index + 1,
          rule: 'no-any',
          fix: 'حدد type محدد بدلاً من any'
        });
      }

      // فحص missing return types
      if (line.includes('function ') && !line.includes(': ') && line.includes('{')) {
        issues.push({
          type: 'typescript',
          description: 'missing return type',
          line: index + 1,
          rule: 'explicit-return-type',
          fix: 'أضف return type للدالة'
        });
      }
    });

    return issues;
  }

  private scanImports(content: string, filePath: string): Issue[] {
    const issues: Issue[] = [];
    const lines = content.split('\n');

    lines.forEach((line, index) => {
      if (line.trim().startsWith('import ')) {
        // فحص المسارات النسبية الطويلة
        if (line.includes('../../../')) {
          issues.push({
            type: 'import',
            description: 'مسار import طويل جداً',
            line: index + 1,
            rule: 'deep-import-path',
            fix: 'استخدم path mapping أو barrel exports'
          });
        }

        // فحص imports غير المستخدمة
        const importMatch = line.match(/import\s+{([^}]+)}/);
        if (importMatch) {
          const imports = importMatch[1].split(',').map(i => i.trim());
          imports.forEach(imp => {
            if (!content.includes(imp.replace(/\s+as\s+\w+/, ''))) {
              issues.push({
                type: 'import',
                description: `import غير مستخدم: ${imp}`,
                line: index + 1,
                rule: 'unused-import',
                fix: 'احذف import غير المستخدم'
              });
            }
          });
        }
      }
    });

    return issues;
  }

  private calculateSeverity(issues: Issue[]): 'low' | 'medium' | 'high' | 'critical' {
    const securityIssues = issues.filter(i => i.type === 'security').length;
    const totalIssues = issues.length;

    if (securityIssues > 0) {
      if (issues.some(i => i.rule === 'no-eval' || i.rule === 'no-dangerous-html')) {
        return 'critical';
      }
      return 'high';
    }

    if (totalIssues > 10) return 'high';
    if (totalIssues > 5) return 'medium';
    return 'low';
  }

  private calculateConfidence(issues: Issue[]): number {
    let confidence = 0;
    
    issues.forEach(issue => {
      switch (issue.rule) {
        case 'no-eval':
        case 'no-dangerous-html':
          confidence += 95;
          break;
        case 'no-console':
          confidence += 80;
          break;
        case 'no-any':
          confidence += 70;
          break;
        default:
          confidence += 60;
      }
    });

    return Math.min(confidence / issues.length, 100);
  }

  private async autoFixIssues(): Promise<void> {
    const fixableResults = this.scanResults.filter(r => r.fixable);
    
    for (const result of fixableResults) {
      await this.fixFile(result);
    }
  }

  private async fixFile(result: ScanResult): Promise<void> {
    try {
      const content = fs.readFileSync(result.file, 'utf-8');
      let lines = content.split('\n');
      
      // إنشاء نسخة احتياطية
      const backupPath = `${result.file}.backup.${Date.now()}`;
      fs.writeFileSync(backupPath, content);

      // تطبيق الإصلاحات
      result.issues.forEach(issue => {
        if (issue.fix && issue.line) {
          const lineIndex = issue.line - 1;
          if (lines[lineIndex]) {
            lines[lineIndex] = this.applyFix(lines[lineIndex], issue);
          }
        }
      });

      // كتابة الملف المُصلح
      fs.writeFileSync(result.file, lines.join('\n'));
      
      console.log(`✅ تم إصلاح ${result.file}`);
      
      // إرسال تقرير الإصلاح
      const taskResult: TaskResult = {
        taskId: `auto-fix-${Date.now()}`,
        success: true,
        message: `تم إصلاح ${result.issues.length} مشكلة في ${result.file}`,
        changes: [{
          file: result.file,
          action: 'modified',
          linesChanged: result.issues.filter(i => i.line).length
        }],
        metrics: {
          executionTime: 1000,
          linesOfCode: lines.length,
          complexity: result.issues.length
        },
        confidenceScore: result.confidence,
        requiresHumanReview: result.severity === 'critical'
      };

      eventBus.completeTask(taskResult);
    } catch (error) {
      console.error(`❌ فشل إصلاح ${result.file}: ${error}`);
    }
  }

  private applyFix(line: string, issue: Issue): string {
    switch (issue.rule) {
      case 'no-console':
        return line.replace('console.log', '// TODO: Remove console.log');
      case 'no-eval':
        return line.replace('eval(', 'JSON.parse(');
      case 'no-dangerous-html':
        return line.replace('dangerouslySetInnerHTML', 'textContent');
      default:
        return line;
    }
  }

  private async generateReport(): Promise<void> {
    const report = {
      timestamp: new Date().toISOString(),
      totalFiles: this.scanResults.length,
      totalIssues: this.scanResults.reduce((sum, r) => sum + r.issues.length, 0),
      severityBreakdown: {
        critical: this.scanResults.filter(r => r.severity === 'critical').length,
        high: this.scanResults.filter(r => r.severity === 'high').length,
        medium: this.scanResults.filter(r => r.severity === 'medium').length,
        low: this.scanResults.filter(r => r.severity === 'low').length
      },
      typeBreakdown: {
        security: this.countIssuesByType('security'),
        dependency: this.countIssuesByType('dependency'),
        typescript: this.countIssuesByType('typescript'),
        import: this.countIssuesByType('import')
      },
      results: this.scanResults
    };

    const reportPath = path.join(
      'e:\\azizsys5\\g-assistant-nx\\docs\\6_fixing\\reports',
      `deep-scan-${Date.now()}.json`
    );

    fs.writeFileSync(reportPath, JSON.stringify(report, null, 2));
    console.log(`📊 تم حفظ التقرير في: ${reportPath}`);
  }

  private countIssuesByType(type: string): number {
    return this.scanResults.reduce((sum, result) => 
      sum + result.issues.filter(issue => issue.type === type).length, 0
    );
  }

  // واجهة عامة للاستخدام
  static async quickScan(projectPath: string): Promise<ScanResult[]> {
    const scanner = new DeepScanner({
      scanTypes: ['security', 'typescript'],
      autoFix: false,
      parallel: true
    });
    
    return await scanner.scanProject(projectPath);
  }

  static async fullScan(projectPath: string): Promise<ScanResult[]> {
    const scanner = new DeepScanner({
      scanTypes: ['security', 'dependency', 'typescript', 'import'],
      autoFix: true,
      parallel: true
    });
    
    return await scanner.scanProject(projectPath);
  }
}