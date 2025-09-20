/**
 * 🚀 Test Runner Script - تشغيل جميع الاختبارات
 */

import { spawn } from 'child_process';
import { performance } from 'perf_hooks';

interface TestResult {
  suite: string;
  passed: number;
  failed: number;
  duration: number;
}

class TestRunner {
  private results: TestResult[] = [];
  private startTime: number = 0;

  async runAllTests(): Promise<void> {
    // Removed console.log
    this.startTime = performance.now();

    try {
      await this.runTestSuite('unit', 'npm run test:unit');
      await this.runTestSuite('integration', 'npm run test:integration');
      await this.runTestSuite('e2e', 'npm run test:e2e');
      await this.runTestSuite('performance', 'npm run test:performance');
      await this.runTestSuite('security', 'npm run test:security');
      
      this.generateFinalReport();
    } catch (error) {
      console.error('❌ فشل في تشغيل الاختبارات:', error);
      process.exit(1);
    }
  }

  private async runTestSuite(suiteName: string, command: string): Promise<void> {
    // Removed console.log
    const startTime = performance.now();

    return new Promise((resolve) => {
      const [cmd, ...args] = command.split(' ');
      const testProcess = spawn(cmd, args, { stdio: 'pipe', shell: true });

      let output = '';

      testProcess.stdout?.on('data', (data) => {
        output += data.toString();
        process.stdout.write(data);
      });

      testProcess.on('close', (code) => {
        const duration = performance.now() - startTime;
        const result = this.parseTestOutput(suiteName, output, duration);
        this.results.push(result);

        if (code === 0) {
          // Removed console.log
        } else {
          // Removed console.log
        }
        resolve();
      });
    });
  }

  private parseTestOutput(suiteName: string, output: string, duration: number): TestResult {
    const passedMatch = output.match(/(\d+) passing/);
    const failedMatch = output.match(/(\d+) failing/);

    return {
      suite: suiteName,
      passed: passedMatch ? parseInt(passedMatch[1]) : 0,
      failed: failedMatch ? parseInt(failedMatch[1]) : 0,
      duration: Math.round(duration)
    };
  }

  private generateFinalReport(): void {
    const totalDuration = performance.now() - this.startTime;
    const totalPassed = this.results.reduce((sum, r) => sum + r.passed, 0);
    const totalFailed = this.results.reduce((sum, r) => sum + r.failed, 0);
    const totalTests = totalPassed + totalFailed;
    const successRate = totalTests > 0 ? (totalPassed / totalTests) * 100 : 0;

    // Removed console.log
    // Removed console.log);

    this.results.forEach(result => {
      const status = result.failed === 0 ? '✅' : '❌';
      // Removed console.log`);
    });

    // Removed console.log);
    // Removed console.log
    // Removed console.log
    // Removed console.log
    // Removed console.log}%`);
    // Removed console.log}ms`);

    if (successRate >= 95) {
      // Removed console.log
    } else if (successRate >= 80) {
      // Removed console.log
    } else {
      // Removed console.log
    }
  }
}

if (require.main === module) {
  const runner = new TestRunner();
  runner.runAllTests().catch(console.error);
}

export { TestRunner };