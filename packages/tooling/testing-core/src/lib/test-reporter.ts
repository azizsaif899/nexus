export interface ReportConfig {
  outputDir: string;
  formats: ReportFormat[];
  includeDetails: boolean;
  includeTrends: boolean;
}

export type ReportFormat = 'html' | 'json' | 'xml' | 'console' | 'markdown';

export interface TestReport {
  summary: TestSummary;
  suites: TestSuiteReport[];
  coverage: CoverageReport;
  performance: PerformanceReport;
  timestamp: Date;
  duration: number;
}

export interface TestSummary {
  total: number;
  passed: number;
  failed: number;
  skipped: number;
  successRate: number;
}

export interface TestSuiteReport {
  name: string;
  tests: TestCaseReport[];
  duration: number;
  status: 'passed' | 'failed';
}

export interface TestCaseReport {
  name: string;
  status: 'passed' | 'failed' | 'skipped';
  duration: number;
  error?: TestError;
  assertions?: AssertionResult[];
}

export interface TestError {
  message: string;
  stack?: string;
  type: string;
}

export interface AssertionResult {
  description: string;
  passed: boolean;
  expected?: any;
  actual?: any;
}

export interface PerformanceReport {
  averageTestDuration: number;
  slowestTests: Array<{ name: string; duration: number }>;
  memoryUsage: number;
  cpuUsage: number;
}

export class TestReporter {
  private config: ReportConfig;

  constructor(config: ReportConfig) {
    this.config = {
      outputDir: './test-reports',
      formats: ['html', 'console'],
      includeDetails: true,
      includeTrends: false,
      ...config
    };
  }

  async generateReport(testResults: any, coverage: any): Promise<TestReport> {
    const report: TestReport = {
      summary: this.generateSummary(testResults),
      suites: this.generateSuiteReports(testResults),
      coverage: this.processCoverage(coverage),
      performance: this.generatePerformanceReport(testResults),
      timestamp: new Date(),
      duration: this.calculateTotalDuration(testResults)
    };

    await this.outputReports(report);
    return report;
  }

  private generateSummary(testResults: any): TestSummary {
    const total = testResults.length || 0;
    const passed = testResults.filter((t: any) => t.status === 'passed').length;
    const failed = testResults.filter((t: any) => t.status === 'failed').length;
    const skipped = testResults.filter((t: any) => t.status === 'skipped').length;
    const successRate = total > 0 ? (passed / total) * 100 : 0;

    return {
      total,
      passed,
      failed,
      skipped,
      successRate: Math.round(successRate * 100) / 100
    };
  }

  private generateSuiteReports(testResults: any): TestSuiteReport[] {
    // Group tests by suite
    const suiteMap = new Map<string, any[]>();
    
    testResults.forEach((test: any) => {
      const suiteName = test.suite || 'Default Suite';
      if (!suiteMap.has(suiteName)) {
        suiteMap.set(suiteName, []);
      }
      suiteMap.get(suiteName)!.push(test);
    });

    return Array.from(suiteMap.entries()).map(([name, tests]) => ({
      name,
      tests: tests.map(test => ({
        name: test.name,
        status: test.status,
        duration: test.duration || 0,
        error: test.error ? {
          message: test.error,
          type: 'TestError'
        } : undefined,
        assertions: test.assertions || []
      })),
      duration: tests.reduce((sum, test) => sum + (test.duration || 0), 0),
      status: tests.every(test => test.status === 'passed') ? 'passed' : 'failed'
    }));
  }

  private processCoverage(coverage: any): CoverageReport {
    return {
      statements: coverage?.statements || 0,
      branches: coverage?.branches || 0,
      functions: coverage?.functions || 0,
      lines: coverage?.lines || 0,
      files: coverage?.files || {},
      uncoveredLines: coverage?.uncoveredLines || [],
      threshold: {
        statements: 90,
        branches: 85,
        functions: 90,
        lines: 90
      },
      passed: this.checkCoverageThreshold(coverage)
    };
  }

  private checkCoverageThreshold(coverage: any): boolean {
    if (!coverage) return false;
    
    return coverage.statements >= 90 &&
           coverage.branches >= 85 &&
           coverage.functions >= 90 &&
           coverage.lines >= 90;
  }

  private generatePerformanceReport(testResults: any): PerformanceReport {
    const durations = testResults.map((t: any) => t.duration || 0);
    const averageTestDuration = durations.length > 0 
      ? durations.reduce((sum: number, d: number) => sum + d, 0) / durations.length 
      : 0;

    const slowestTests = testResults
      .sort((a: any, b: any) => (b.duration || 0) - (a.duration || 0))
      .slice(0, 5)
      .map((test: any) => ({
        name: test.name,
        duration: test.duration || 0
      }));

    return {
      averageTestDuration: Math.round(averageTestDuration),
      slowestTests,
      memoryUsage: this.getMemoryUsage(),
      cpuUsage: this.getCpuUsage()
    };
  }

  private getMemoryUsage(): number {
    if (typeof process !== 'undefined' && process.memoryUsage) {
      return Math.round(process.memoryUsage().heapUsed / 1024 / 1024); // MB
    }
    return 0;
  }

  private getCpuUsage(): number {
    // Simulate CPU usage
    return Math.round(Math.random() * 100);
  }

  private calculateTotalDuration(testResults: any): number {
    return testResults.reduce((sum: number, test: any) => sum + (test.duration || 0), 0);
  }

  private async outputReports(report: TestReport): Promise<void> {
    for (const format of this.config.formats) {
      switch (format) {
        case 'console':
          this.outputConsoleReport(report);
          break;
        case 'html':
          await this.outputHTMLReport(report);
          break;
        case 'json':
          await this.outputJSONReport(report);
          break;
        case 'xml':
          await this.outputXMLReport(report);
          break;
        case 'markdown':
          await this.outputMarkdownReport(report);
          break;
      }
    }
  }

  private outputConsoleReport(report: TestReport): void {
    console.log('\n🧪 Test Report Summary');
    console.log('======================');
    console.log(`Total Tests: ${report.summary.total}`);
    console.log(`✅ Passed: ${report.summary.passed}`);
    console.log(`❌ Failed: ${report.summary.failed}`);
    console.log(`⏭️ Skipped: ${report.summary.skipped}`);
    console.log(`📊 Success Rate: ${report.summary.successRate}%`);
    console.log(`⏱️ Duration: ${report.duration}ms`);

    console.log('\n📈 Coverage Summary');
    console.log('==================');
    console.log(`Statements: ${report.coverage.statements}%`);
    console.log(`Branches: ${report.coverage.branches}%`);
    console.log(`Functions: ${report.coverage.functions}%`);
    console.log(`Lines: ${report.coverage.lines}%`);
    console.log(`Threshold: ${report.coverage.passed ? '✅ PASSED' : '❌ FAILED'}`);

    if (report.summary.failed > 0) {
      console.log('\n❌ Failed Tests');
      console.log('===============');
      report.suites.forEach(suite => {
        suite.tests.filter(test => test.status === 'failed').forEach(test => {
          console.log(`- ${suite.name} > ${test.name}`);
          if (test.error) {
            console.log(`  Error: ${test.error.message}`);
          }
        });
      });
    }

    console.log('\n⚡ Performance');
    console.log('==============');
    console.log(`Average Test Duration: ${report.performance.averageTestDuration}ms`);
    console.log(`Memory Usage: ${report.performance.memoryUsage}MB`);
    
    if (report.performance.slowestTests.length > 0) {
      console.log('\nSlowest Tests:');
      report.performance.slowestTests.forEach((test, index) => {
        console.log(`${index + 1}. ${test.name}: ${test.duration}ms`);
      });
    }
  }

  private async outputHTMLReport(report: TestReport): Promise<void> {
    const html = this.generateHTMLReport(report);
    console.log('📄 HTML report generated (simulated)');
    // In real implementation: fs.writeFileSync(path.join(this.config.outputDir, 'report.html'), html);
  }

  private generateHTMLReport(report: TestReport): string {
    return `
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Test Report - ${report.timestamp.toISOString()}</title>
    <style>
        body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; margin: 0; padding: 20px; background: #f5f5f5; }
        .container { max-width: 1200px; margin: 0 auto; background: white; border-radius: 8px; box-shadow: 0 2px 10px rgba(0,0,0,0.1); }
        .header { background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; padding: 30px; border-radius: 8px 8px 0 0; }
        .summary { display: grid; grid-template-columns: repeat(auto-fit, minmax(200px, 1fr)); gap: 20px; padding: 30px; }
        .metric { text-align: center; padding: 20px; background: #f8f9fa; border-radius: 8px; border-left: 4px solid #007bff; }
        .metric-value { font-size: 2em; font-weight: bold; color: #333; }
        .metric-label { color: #666; margin-top: 5px; }
        .passed { border-left-color: #28a745; }
        .failed { border-left-color: #dc3545; }
        .coverage { border-left-color: #17a2b8; }
        .performance { border-left-color: #ffc107; }
        .section { padding: 30px; border-top: 1px solid #eee; }
        .test-suite { margin-bottom: 20px; border: 1px solid #ddd; border-radius: 6px; }
        .suite-header { background: #f8f9fa; padding: 15px; border-bottom: 1px solid #ddd; font-weight: bold; }
        .test-case { padding: 10px 15px; border-bottom: 1px solid #f0f0f0; display: flex; justify-content: space-between; align-items: center; }
        .test-case:last-child { border-bottom: none; }
        .status-passed { color: #28a745; }
        .status-failed { color: #dc3545; }
        .status-skipped { color: #6c757d; }
        .duration { color: #666; font-size: 0.9em; }
        .error { background: #f8d7da; color: #721c24; padding: 10px; margin-top: 10px; border-radius: 4px; font-family: monospace; font-size: 0.9em; }
    </style>
</head>
<body>
    <div class="container">
        <div class="header">
            <h1>🧪 Test Report</h1>
            <p>Generated on ${report.timestamp.toLocaleString()}</p>
            <p>Total Duration: ${report.duration}ms</p>
        </div>
        
        <div class="summary">
            <div class="metric">
                <div class="metric-value">${report.summary.total}</div>
                <div class="metric-label">Total Tests</div>
            </div>
            <div class="metric passed">
                <div class="metric-value">${report.summary.passed}</div>
                <div class="metric-label">Passed</div>
            </div>
            <div class="metric failed">
                <div class="metric-value">${report.summary.failed}</div>
                <div class="metric-label">Failed</div>
            </div>
            <div class="metric coverage">
                <div class="metric-value">${report.coverage.statements}%</div>
                <div class="metric-label">Coverage</div>
            </div>
            <div class="metric performance">
                <div class="metric-value">${report.performance.averageTestDuration}ms</div>
                <div class="metric-label">Avg Duration</div>
            </div>
        </div>
        
        <div class="section">
            <h2>📊 Test Suites</h2>
            ${report.suites.map(suite => `
                <div class="test-suite">
                    <div class="suite-header">
                        ${suite.name} (${suite.duration}ms)
                        <span class="status-${suite.status}">${suite.status.toUpperCase()}</span>
                    </div>
                    ${suite.tests.map(test => `
                        <div class="test-case">
                            <span>${test.name}</span>
                            <div>
                                <span class="status-${test.status}">${test.status.toUpperCase()}</span>
                                <span class="duration">${test.duration}ms</span>
                            </div>
                            ${test.error ? `<div class="error">${test.error.message}</div>` : ''}
                        </div>
                    `).join('')}
                </div>
            `).join('')}
        </div>
    </div>
</body>
</html>`;
  }

  private async outputJSONReport(report: TestReport): Promise<void> {
    const json = JSON.stringify(report, null, 2);
    console.log('📄 JSON report generated (simulated)');
    // In real implementation: fs.writeFileSync(path.join(this.config.outputDir, 'report.json'), json);
  }

  private async outputXMLReport(report: TestReport): Promise<void> {
    const xml = this.generateJUnitXML(report);
    console.log('📄 XML report generated (simulated)');
    // In real implementation: fs.writeFileSync(path.join(this.config.outputDir, 'junit.xml'), xml);
  }

  private generateJUnitXML(report: TestReport): string {
    return `<?xml version="1.0" encoding="UTF-8"?>
<testsuites tests="${report.summary.total}" failures="${report.summary.failed}" time="${report.duration / 1000}">
${report.suites.map(suite => `
    <testsuite name="${suite.name}" tests="${suite.tests.length}" failures="${suite.tests.filter(t => t.status === 'failed').length}" time="${suite.duration / 1000}">
${suite.tests.map(test => `
        <testcase name="${test.name}" time="${test.duration / 1000}">
            ${test.status === 'failed' && test.error ? `<failure message="${test.error.message}"></failure>` : ''}
            ${test.status === 'skipped' ? '<skipped/>' : ''}
        </testcase>`).join('')}
    </testsuite>`).join('')}
</testsuites>`;
  }

  private async outputMarkdownReport(report: TestReport): Promise<void> {
    const markdown = this.generateMarkdownReport(report);
    console.log('📄 Markdown report generated (simulated)');
    // In real implementation: fs.writeFileSync(path.join(this.config.outputDir, 'report.md'), markdown);
  }

  private generateMarkdownReport(report: TestReport): string {
    return `# 🧪 Test Report

**Generated:** ${report.timestamp.toLocaleString()}  
**Duration:** ${report.duration}ms

## 📊 Summary

| Metric | Value |
|--------|-------|
| Total Tests | ${report.summary.total} |
| Passed | ${report.summary.passed} ✅ |
| Failed | ${report.summary.failed} ❌ |
| Skipped | ${report.summary.skipped} ⏭️ |
| Success Rate | ${report.summary.successRate}% |

## 📈 Coverage

| Type | Coverage |
|------|----------|
| Statements | ${report.coverage.statements}% |
| Branches | ${report.coverage.branches}% |
| Functions | ${report.coverage.functions}% |
| Lines | ${report.coverage.lines}% |

## ⚡ Performance

- **Average Test Duration:** ${report.performance.averageTestDuration}ms
- **Memory Usage:** ${report.performance.memoryUsage}MB

### Slowest Tests
${report.performance.slowestTests.map((test, index) => 
  `${index + 1}. ${test.name}: ${test.duration}ms`
).join('\n')}

${report.summary.failed > 0 ? `
## ❌ Failed Tests

${report.suites.flatMap(suite => 
  suite.tests.filter(test => test.status === 'failed')
    .map(test => `- **${suite.name}** > ${test.name}${test.error ? `\n  \`${test.error.message}\`` : ''}`)
).join('\n')}
` : ''}
`;
  }
}

interface CoverageReport {
  statements: number;
  branches: number;
  functions: number;
  lines: number;
  files: Record<string, any>;
  uncoveredLines: number[];
  threshold: {
    statements: number;
    branches: number;
    functions: number;
    lines: number;
  };
  passed: boolean;
}