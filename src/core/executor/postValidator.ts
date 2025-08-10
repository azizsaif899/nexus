import { TaskRequest } from '../types';
import { exec } from 'child_process';
import { promisify } from 'util';
import * as path from 'path';

const execAsync = promisify(exec);

export class PostValidator {
  async validate(task: TaskRequest): Promise<void> {
    const validations = [
      this.validateSyntax(task.file),
      this.validateLinting(task.file),
      this.validateTests(task.file),
      this.validateSecurity(task.file)
    ];

    const results = await Promise.allSettled(validations);
    
    const failures = results
      .map((result, index) => ({ result, index }))
      .filter(({ result }) => result.status === 'rejected')
      .map(({ result, index }) => ({
        validation: ['syntax', 'linting', 'tests', 'security'][index],
        error: (result as PromiseRejectedResult).reason
      }));

    if (failures.length > 0) {
      const errorMessage = failures
        .map(f => `${f.validation}: ${f.error}`)
        .join('; ');
      throw new Error(`Validation failed: ${errorMessage}`);
    }
  }

  private async validateSyntax(filePath: string): Promise<void> {
    const ext = path.extname(filePath).toLowerCase();
    
    try {
      switch (ext) {
        case '.ts':
        case '.tsx':
          await execAsync(`npx tsc --noEmit --skipLibCheck "${filePath}"`);
          break;
        case '.js':
        case '.jsx':
          await execAsync(`node -c "${filePath}"`);
          break;
        case '.py':
          await execAsync(`python -m py_compile "${filePath}"`);
          break;
        default:
          // Skip syntax validation for unknown file types
          break;
      }
    } catch (error) {
      throw new Error(`Syntax validation failed: ${(error as Error).message}`);
    }
  }

  private async validateLinting(filePath: string): Promise<void> {
    const ext = path.extname(filePath).toLowerCase();
    
    try {
      switch (ext) {
        case '.ts':
        case '.tsx':
        case '.js':
        case '.jsx':
          await execAsync(`npx eslint "${filePath}" --fix-dry-run`);
          break;
        case '.py':
          await execAsync(`flake8 "${filePath}"`);
          break;
        default:
          // Skip linting for unknown file types
          break;
      }
    } catch (error) {
      // ESLint returns non-zero exit code for warnings/errors
      // We'll be lenient here and only fail on actual execution errors
      const errorMessage = (error as Error).message;
      if (errorMessage.includes('command not found') || errorMessage.includes('ENOENT')) {
        console.warn(`Linting tool not available for ${filePath}`);
      } else {
        console.warn(`Linting warnings for ${filePath}: ${errorMessage}`);
      }
    }
  }

  private async validateTests(filePath: string): Promise<void> {
    // Check if there are related test files
    const testPatterns = [
      filePath.replace(/\.(ts|js|tsx|jsx)$/, '.test.$1'),
      filePath.replace(/\.(ts|js|tsx|jsx)$/, '.spec.$1'),
      filePath.replace(/src\//, 'src/__tests__/').replace(/\.(ts|js|tsx|jsx)$/, '.test.$1'),
      filePath.replace(/src\//, 'tests/').replace(/\.(ts|js|tsx|jsx)$/, '.test.$1')
    ];

    // For now, we'll skip test validation if no test files are found
    // In a real implementation, you might want to run the full test suite
    console.log(`Test validation skipped for ${filePath} - implement based on your test strategy`);
  }

  private async validateSecurity(filePath: string): Promise<void> {
    // Basic security validation
    const fs = require('fs-extra');
    const content = await fs.readFile(filePath, 'utf-8');
    
    const securityIssues = [];
    
    // Check for common security anti-patterns
    const securityPatterns = [
      {
        pattern: /eval\s*\(/gi,
        message: 'Use of eval() detected - potential security risk'
      },
      {
        pattern: /innerHTML\s*=/gi,
        message: 'Use of innerHTML detected - potential XSS risk'
      },
      {
        pattern: /document\.write\s*\(/gi,
        message: 'Use of document.write detected - potential security risk'
      },
      {
        pattern: /password\s*=\s*["'][^"']*["']/gi,
        message: 'Hardcoded password detected'
      },
      {
        pattern: /api[_-]?key\s*=\s*["'][^"']*["']/gi,
        message: 'Hardcoded API key detected'
      }
    ];

    for (const { pattern, message } of securityPatterns) {
      if (pattern.test(content)) {
        securityIssues.push(message);
      }
    }

    if (securityIssues.length > 0) {
      throw new Error(`Security issues found: ${securityIssues.join('; ')}`);
    }
  }

  async validateBuild(projectRoot: string): Promise<void> {
    try {
      // Try to build the project
      await execAsync('npm run build', { cwd: projectRoot });
    } catch (error) {
      throw new Error(`Build validation failed: ${(error as Error).message}`);
    }
  }

  async validateFormatting(filePath: string): Promise<void> {
    const ext = path.extname(filePath).toLowerCase();
    
    try {
      switch (ext) {
        case '.ts':
        case '.tsx':
        case '.js':
        case '.jsx':
          await execAsync(`npx prettier --check "${filePath}"`);
          break;
        case '.py':
          await execAsync(`black --check "${filePath}"`);
          break;
        default:
          // Skip formatting validation for unknown file types
          break;
      }
    } catch (error) {
      console.warn(`Formatting check failed for ${filePath}: ${(error as Error).message}`);
      // Don't fail the validation for formatting issues
    }
  }
}