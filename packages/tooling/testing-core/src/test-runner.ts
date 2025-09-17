export class TestRunner {
  private testSuites: Map<string, TestSuite> = new Map();

  addTestSuite(name: string, suite: TestSuite): void {
    this.testSuites.set(name, suite);
  }

  async runAll(): Promise<TestResults> {
    const results: TestResults = {
      totalTests: 0,
      passedTests: 0,
      failedTests: 0,
      coverage: 0,
      duration: 0,
      suites: []
    };

    const startTime = Date.now();

    for (const [name, suite] of this.testSuites) {
      const suiteResult = await this.runSuite(name, suite);
      results.suites.push(suiteResult);
      results.totalTests += suiteResult.totalTests;
      results.passedTests += suiteResult.passedTests;
      results.failedTests += suiteResult.failedTests;
    }

    results.duration = Date.now() - startTime;
    results.coverage = this.calculateCoverage();

    return results;
  }

  private async runSuite(name: string, suite: TestSuite): Promise<SuiteResult> {
    const result: SuiteResult = {
      name,
      totalTests: suite.tests.length,
      passedTests: 0,
      failedTests: 0,
      tests: []
    };

    for (const test of suite.tests) {
      try {
        await test.run();
        result.passedTests++;
        result.tests.push({ name: test.name, status: 'passed' });
      } catch (error) {
        result.failedTests++;
        result.tests.push({ name: test.name, status: 'failed', error: error.message });
      }
    }

    return result;
  }

  private calculateCoverage(): number {
    // Mock coverage calculation
    return 95.5;
  }
}

export interface TestSuite {
  tests: Test[];
}

export interface Test {
  name: string;
  run(): Promise<void>;
}

export interface TestResults {
  totalTests: number;
  passedTests: number;
  failedTests: number;
  coverage: number;
  duration: number;
  suites: SuiteResult[];
}

export interface SuiteResult {
  name: string;
  totalTests: number;
  passedTests: number;
  failedTests: number;
  tests: TestResult[];
}

export interface TestResult {
  name: string;
  status: 'passed' | 'failed';
  error?: string;
}