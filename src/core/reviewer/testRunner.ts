import { CheckResult, Issue } from './index';
import { exec } from 'child_process';
import { promisify } from 'util';
import * as fs from 'fs-extra';
import * as path from 'path';

const execAsync = promisify(exec);

export class TestRunner {
  async check(files: string[]): Promise<CheckResult> {
    const issues: Issue[] = [];
    let totalScore = 100;
    
    try {
      // Check test coverage
      const coverageResult = await this.checkTestCoverage();
      if (coverageResult.issues.length > 0) {
        issues.push(...coverageResult.issues);
      }

      // Run unit tests
      const unitTestResult = await this.runUnitTests();
      if (unitTestResult.issues.length > 0) {
        issues.push(...unitTestResult.issues);
      }

      // Check test file existence
      const testFileIssues = await this.checkTestFiles(files);
      issues.push(...testFileIssues);

      // Check test quality
      const testQualityIssues = await this.checkTestQuality(files);
      issues.push(...testQualityIssues);

      // Calculate score
      const errorCount = issues.filter(i => i.severity === 'error').length;
      const warningCount = issues.filter(i => i.severity === 'warning').length;
      
      totalScore = Math.max(0, 100 - (errorCount * 15) - (warningCount * 5));

      return {
        name: 'Test Runner',
        status: errorCount > 0 ? 'failed' : warningCount > 0 ? 'warning' : 'passed',
        score: totalScore,
        issues,
        metrics: {
          testCoverage: coverageResult.coverage || 0,
          testCount: unitTestResult.testCount || 0,
          passedTests: unitTestResult.passedTests || 0,
          failedTests: unitTestResult.failedTests || 0
        }
      };

    } catch (error) {
      return {
        name: 'Test Runner',
        status: 'failed',
        score: 0,
        issues: [{
          severity: 'error',
          message: `Test runner failed: ${(error as Error).message}`
        }]
      };
    }
  }

  private async checkTestCoverage(): Promise<{ issues: Issue[]; coverage?: number }> {
    const issues: Issue[] = [];
    let coverage = 0;
    
    try {
      // Try to run coverage with different tools
      const coverageCommands = [
        'npm run test:coverage',
        'npx jest --coverage --silent',
        'npx nyc npm test'
      ];

      for (const command of coverageCommands) {
        try {
          const { stdout } = await execAsync(command, { timeout: 60000 });
          coverage = this.parseCoverageOutput(stdout);
          break;
        } catch (error) {
          // Try next command
          continue;
        }
      }

      if (coverage < 80) {
        issues.push({
          severity: coverage < 50 ? 'error' : 'warning',
          message: `Low test coverage: ${coverage}% (recommended: 80%+)`,
          rule: 'test-coverage'
        });
      }

    } catch (error) {
      issues.push({
        severity: 'warning',
        message: 'Could not determine test coverage',
        rule: 'test-coverage'
      });
    }
    
    return { issues, coverage };
  }

  private parseCoverageOutput(output: string): number {
    // Parse coverage from different formats
    const patterns = [
      /All files\s+\|\s+(\d+(?:\.\d+)?)/,  // Jest format
      /Statements\s+:\s+(\d+(?:\.\d+)?)%/, // NYC format
      /Lines\s+:\s+(\d+(?:\.\d+)?)%/,      // General format
    ];

    for (const pattern of patterns) {
      const match = output.match(pattern);
      if (match) {
        return parseFloat(match[1]);
      }
    }

    return 0;
  }

  private async runUnitTests(): Promise<{ 
    issues: Issue[]; 
    testCount?: number; 
    passedTests?: number; 
    failedTests?: number; 
  }> {
    const issues: Issue[] = [];
    let testCount = 0;
    let passedTests = 0;
    let failedTests = 0;
    
    try {
      const testCommands = [
        'npm test',
        'npx jest --passWithNoTests',
        'npx mocha',
        'yarn test'
      ];

      for (const command of testCommands) {
        try {
          const { stdout, stderr } = await execAsync(command, { timeout: 120000 });
          const result = this.parseTestOutput(stdout + stderr);
          
          testCount = result.total;
          passedTests = result.passed;
          failedTests = result.failed;
          
          if (failedTests > 0) {
            issues.push({
              severity: 'error',
              message: `${failedTests} test(s) failed`,
              rule: 'test-failure'
            });
          }
          
          break;
        } catch (error) {
          // If command fails, it might be test failures or missing test runner
          const errorMessage = (error as any).stdout || (error as Error).message;
          const result = this.parseTestOutput(errorMessage);
          
          if (result.failed > 0) {
            issues.push({
              severity: 'error',
              message: `${result.failed} test(s) failed`,
              rule: 'test-failure'
            });
            testCount = result.total;
            passedTests = result.passed;
            failedTests = result.failed;
            break;
          }
          
          continue;
        }
      }

      if (testCount === 0) {
        issues.push({
          severity: 'warning',
          message: 'No tests found or test runner not configured',
          rule: 'no-tests'
        });
      }

    } catch (error) {
      issues.push({
        severity: 'warning',
        message: 'Could not run tests',
        rule: 'test-runner-error'
      });
    }
    
    return { issues, testCount, passedTests, failedTests };
  }

  private parseTestOutput(output: string): { total: number; passed: number; failed: number } {
    let total = 0;
    let passed = 0;
    let failed = 0;

    // Jest format
    const jestMatch = output.match(/Tests:\s+(\d+)\s+failed,\s+(\d+)\s+passed,\s+(\d+)\s+total/);
    if (jestMatch) {
      failed = parseInt(jestMatch[1]);
      passed = parseInt(jestMatch[2]);
      total = parseInt(jestMatch[3]);
      return { total, passed, failed };
    }

    // Mocha format
    const mochaMatch = output.match(/(\d+)\s+passing.*?(\d+)\s+failing/);
    if (mochaMatch) {
      passed = parseInt(mochaMatch[1]);
      failed = parseInt(mochaMatch[2]);
      total = passed + failed;
      return { total, passed, failed };
    }

    // Generic format
    const passedMatch = output.match(/(\d+)\s+(?:tests?\s+)?passed/i);
    const failedMatch = output.match(/(\d+)\s+(?:tests?\s+)?failed/i);
    
    if (passedMatch) passed = parseInt(passedMatch[1]);
    if (failedMatch) failed = parseInt(failedMatch[1]);
    total = passed + failed;

    return { total, passed, failed };
  }

  private async checkTestFiles(files: string[]): Promise<Issue[]> {
    const issues: Issue[] = [];
    
    const sourceFiles = files.filter(f => 
      /\.(js|jsx|ts|tsx)$/.test(f) && 
      !f.includes('.test.') && 
      !f.includes('.spec.') &&
      !f.includes('__tests__')
    );

    for (const sourceFile of sourceFiles) {
      const hasTest = await this.hasCorrespondingTest(sourceFile);
      
      if (!hasTest) {
        issues.push({
          severity: 'info',
          message: 'No corresponding test file found',
          file: sourceFile,
          rule: 'missing-test'
        });
      }
    }
    
    return issues;
  }

  private async hasCorrespondingTest(sourceFile: string): Promise<boolean> {
    const dir = path.dirname(sourceFile);
    const basename = path.basename(sourceFile, path.extname(sourceFile));
    const ext = path.extname(sourceFile);
    
    const testPatterns = [
      path.join(dir, `${basename}.test${ext}`),
      path.join(dir, `${basename}.spec${ext}`),
      path.join(dir, '__tests__', `${basename}.test${ext}`),
      path.join(dir, '__tests__', `${basename}.spec${ext}`),
      path.join(dir, '..', 'tests', `${basename}.test${ext}`),
      path.join(dir, '..', '__tests__', `${basename}.test${ext}`)
    ];

    for (const testPath of testPatterns) {
      if (await fs.pathExists(testPath)) {
        return true;
      }
    }

    return false;
  }

  private async checkTestQuality(files: string[]): Promise<Issue[]> {
    const issues: Issue[] = [];
    
    const testFiles = files.filter(f => 
      f.includes('.test.') || f.includes('.spec.') || f.includes('__tests__')
    );

    for (const testFile of testFiles) {
      try {
        const content = await fs.readFile(testFile, 'utf-8');
        
        // Check for basic test patterns
        if (!content.includes('describe') && !content.includes('it') && !content.includes('test')) {
          issues.push({
            severity: 'warning',
            message: 'Test file does not contain recognizable test patterns',
            file: testFile,
            rule: 'test-structure'
          });
        }

        // Check for assertions
        const hasAssertions = /(?:expect|assert|should)\s*\(/.test(content);
        if (!hasAssertions) {
          issues.push({
            severity: 'warning',
            message: 'Test file does not contain assertions',
            file: testFile,
            rule: 'test-assertions'
          });
        }

        // Check for async test handling
        const hasAsyncTests = /(?:async|await|\.then\(|\.catch\()/.test(content);
        const hasAsyncHandling = /(?:done\(\)|return\s+\w+|await)/.test(content);
        
        if (hasAsyncTests && !hasAsyncHandling) {
          issues.push({
            severity: 'warning',
            message: 'Async tests may not be properly handled',
            file: testFile,
            rule: 'async-test-handling'
          });
        }

      } catch (error) {
        console.warn(`Failed to analyze test file ${testFile}:`, error);
      }
    }
    
    return issues;
  }

  async runSpecificTests(testPattern: string): Promise<CheckResult> {
    try {
      const { stdout, stderr } = await execAsync(`npx jest ${testPattern}`, { timeout: 60000 });
      const result = this.parseTestOutput(stdout + stderr);
      
      return {
        name: 'Specific Tests',
        status: result.failed > 0 ? 'failed' : 'passed',
        score: result.failed > 0 ? 0 : 100,
        issues: result.failed > 0 ? [{
          severity: 'error',
          message: `${result.failed} test(s) failed`,
          rule: 'test-failure'
        }] : [],
        metrics: result
      };
    } catch (error) {
      return {
        name: 'Specific Tests',
        status: 'failed',
        score: 0,
        issues: [{
          severity: 'error',
          message: `Test execution failed: ${(error as Error).message}`
        }]
      };
    }
  }
}