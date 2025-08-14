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
    console.log('🚀 بدء تشغيل جميع الاختبارات - AzizSys v2.0\n');
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
    console.log(`\n🧪 تشغيل اختبارات ${suiteName}...`);
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
          console.log(`✅ اختبارات ${suiteName} مكتملة بنجاح`);
        } else {
          console.log(`❌ فشل في اختبارات ${suiteName}`);
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

    console.log('\n📊 تقرير الاختبارات النهائي');
    console.log('═'.repeat(50));

    this.results.forEach(result => {
      const status = result.failed === 0 ? '✅' : '❌';
      console.log(`${status} ${result.suite}: ${result.passed} نجح، ${result.failed} فشل (${result.duration}ms)`);
    });

    console.log('─'.repeat(50));
    console.log(`📈 إجمالي الاختبارات: ${totalTests}`);
    console.log(`✅ نجح: ${totalPassed}`);
    console.log(`❌ فشل: ${totalFailed}`);
    console.log(`📊 معدل النجاح: ${successRate.toFixed(2)}%`);
    console.log(`⏱️  الوقت الإجمالي: ${Math.round(totalDuration)}ms`);

    if (successRate >= 95) {
      console.log('\n🎉 ممتاز! جميع الاختبارات تعمل بشكل مثالي');
    } else if (successRate >= 80) {
      console.log('\n⚠️  جيد، لكن يحتاج بعض التحسينات');
    } else {
      console.log('\n🚨 يحتاج إصلاحات عاجلة');
    }
  }
}

if (require.main === module) {
  const runner = new TestRunner();
  runner.runAllTests().catch(console.error);
}

export { TestRunner };