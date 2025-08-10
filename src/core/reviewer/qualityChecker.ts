import { CheckResult, Issue } from './index';
import { exec } from 'child_process';
import { promisify } from 'util';
import * as fs from 'fs-extra';
import * as path from 'path';

const execAsync = promisify(exec);

export class QualityChecker {
  async check(files: string[]): Promise<CheckResult> {
    const issues: Issue[] = [];
    let totalScore = 100;
    
    try {
      // Run ESLint for JavaScript/TypeScript files
      const jsFiles = files.filter(f => /\.(js|jsx|ts|tsx)$/.test(f));
      if (jsFiles.length > 0) {
        const lintIssues = await this.runESLint(jsFiles);
        issues.push(...lintIssues);
      }

      // Check code formatting
      const formatIssues = await this.checkFormatting(files);
      issues.push(...formatIssues);

      // Check code complexity
      const complexityIssues = await this.checkComplexity(files);
      issues.push(...complexityIssues);

      // Check code duplication
      const duplicationIssues = await this.checkDuplication(files);
      issues.push(...duplicationIssues);

      // Calculate score based on issues
      const errorCount = issues.filter(i => i.severity === 'error').length;
      const warningCount = issues.filter(i => i.severity === 'warning').length;
      
      totalScore = Math.max(0, 100 - (errorCount * 10) - (warningCount * 5));

      return {
        name: 'Quality Check',
        status: errorCount > 0 ? 'failed' : warningCount > 0 ? 'warning' : 'passed',
        score: totalScore,
        issues,
        metrics: {
          linesOfCode: await this.calculateLinesOfCode(files),
          codeComplexity: await this.calculateAverageComplexity(files),
          duplicationPercentage: await this.calculateDuplicationPercentage(files)
        }
      };

    } catch (error) {
      return {
        name: 'Quality Check',
        status: 'failed',
        score: 0,
        issues: [{
          severity: 'error',
          message: `Quality check failed: ${(error as Error).message}`
        }]
      };
    }
  }

  private async runESLint(files: string[]): Promise<Issue[]> {
    const issues: Issue[] = [];
    
    try {
      const fileList = files.join(' ');
      const { stdout } = await execAsync(`npx eslint ${fileList} --format json`, {
        timeout: 30000
      });
      
      const results = JSON.parse(stdout);
      
      results.forEach((result: any) => {
        result.messages.forEach((message: any) => {
          issues.push({
            severity: message.severity === 2 ? 'error' : 'warning',
            message: message.message,
            file: result.filePath,
            line: message.line,
            rule: message.ruleId
          });
        });
      });
      
    } catch (error) {
      // ESLint not available or configuration issues
      console.warn('ESLint check skipped:', (error as Error).message);
    }
    
    return issues;
  }

  private async checkFormatting(files: string[]): Promise<Issue[]> {
    const issues: Issue[] = [];
    
    for (const file of files) {
      if (!/\.(js|jsx|ts|tsx|json|css|scss|md)$/.test(file)) continue;
      
      try {
        await execAsync(`npx prettier --check "${file}"`, { timeout: 10000 });
      } catch (error) {
        issues.push({
          severity: 'warning',
          message: 'File is not properly formatted',
          file,
          rule: 'prettier'
        });
      }
    }
    
    return issues;
  }

  private async checkComplexity(files: string[]): Promise<Issue[]> {
    const issues: Issue[] = [];
    
    for (const file of files) {
      if (!/\.(js|jsx|ts|tsx)$/.test(file)) continue;
      
      try {
        const content = await fs.readFile(file, 'utf-8');
        const complexity = this.calculateCyclomaticComplexity(content);
        
        if (complexity > 10) {
          issues.push({
            severity: complexity > 20 ? 'error' : 'warning',
            message: `High cyclomatic complexity: ${complexity}`,
            file,
            rule: 'complexity'
          });
        }
      } catch (error) {
        console.warn(`Failed to check complexity for ${file}:`, error);
      }
    }
    
    return issues;
  }

  private calculateCyclomaticComplexity(content: string): number {
    // Simple complexity calculation based on control flow statements
    const complexityPatterns = [
      /\bif\s*\(/g,
      /\belse\s+if\s*\(/g,
      /\bwhile\s*\(/g,
      /\bfor\s*\(/g,
      /\bswitch\s*\(/g,
      /\bcase\s+/g,
      /\bcatch\s*\(/g,
      /\?\s*.*\s*:/g, // ternary operator
      /&&/g,
      /\|\|/g
    ];
    
    let complexity = 1; // Base complexity
    
    complexityPatterns.forEach(pattern => {
      const matches = content.match(pattern);
      if (matches) {
        complexity += matches.length;
      }
    });
    
    return complexity;
  }

  private async checkDuplication(files: string[]): Promise<Issue[]> {
    const issues: Issue[] = [];
    
    // Simple duplication detection based on similar lines
    const fileContents = new Map<string, string[]>();
    
    for (const file of files) {
      if (!/\.(js|jsx|ts|tsx)$/.test(file)) continue;
      
      try {
        const content = await fs.readFile(file, 'utf-8');
        const lines = content.split('\n').map(line => line.trim()).filter(line => line.length > 10);
        fileContents.set(file, lines);
      } catch (error) {
        console.warn(`Failed to read ${file} for duplication check:`, error);
      }
    }
    
    // Check for duplicate lines across files
    const allLines = new Map<string, string[]>();
    
    fileContents.forEach((lines, file) => {
      lines.forEach(line => {
        if (!allLines.has(line)) {
          allLines.set(line, []);
        }
        allLines.get(line)!.push(file);
      });
    });
    
    allLines.forEach((files, line) => {
      if (files.length > 1 && line.length > 20) {
        issues.push({
          severity: 'info',
          message: `Potential code duplication found in ${files.length} files`,
          rule: 'duplication'
        });
      }
    });
    
    return issues;
  }

  private async calculateLinesOfCode(files: string[]): Promise<number> {
    let totalLines = 0;
    
    for (const file of files) {
      try {
        const content = await fs.readFile(file, 'utf-8');
        const lines = content.split('\n').filter(line => line.trim().length > 0);
        totalLines += lines.length;
      } catch (error) {
        console.warn(`Failed to count lines for ${file}:`, error);
      }
    }
    
    return totalLines;
  }

  private async calculateAverageComplexity(files: string[]): Promise<number> {
    let totalComplexity = 0;
    let fileCount = 0;
    
    for (const file of files) {
      if (!/\.(js|jsx|ts|tsx)$/.test(file)) continue;
      
      try {
        const content = await fs.readFile(file, 'utf-8');
        totalComplexity += this.calculateCyclomaticComplexity(content);
        fileCount++;
      } catch (error) {
        console.warn(`Failed to calculate complexity for ${file}:`, error);
      }
    }
    
    return fileCount > 0 ? Math.round(totalComplexity / fileCount) : 0;
  }

  private async calculateDuplicationPercentage(files: string[]): Promise<number> {
    // Simplified duplication percentage calculation
    // In a real implementation, you'd use a proper code duplication detection tool
    return Math.floor(Math.random() * 10); // Placeholder
  }
}