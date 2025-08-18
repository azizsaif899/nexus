import { TestResults, CoverageReport } from './test-runner';

export class TestReporter {
  generateConsoleReport(results: TestResults): string {
    const report = [
      '🧪 Test Results Summary',
      '========================',
      `Total Tests: ${results.totalTests}`,
      `✅ Passed: ${results.passedTests}`,
      `❌ Failed: ${results.failedTests}`,
      `📊 Coverage: ${results.coverage.toFixed(2)}%`,
      `⏱️ Duration: ${results.duration}ms`,
      '',
      'Test Suites:',
      ...results.suites.map(suite => 
        `  ${suite.name}: ${suite.passedTests}/${suite.totalTests} passed`
      )
    ];

    return report.join('\n');
  }

  generateHTMLReport(results: TestResults, coverage: CoverageReport): string {
    return `
<!DOCTYPE html>
<html>
<head>
    <title>Test Report</title>
    <style>
        body { font-family: Arial, sans-serif; margin: 20px; }
        .summary { background: #f5f5f5; padding: 20px; border-radius: 8px; }
        .passed { color: #28a745; }
        .failed { color: #dc3545; }
        .coverage { color: #007bff; }
        table { width: 100%; border-collapse: collapse; margin-top: 20px; }
        th, td { padding: 12px; text-align: left; border-bottom: 1px solid #ddd; }
        th { background-color: #f8f9fa; }
    </style>
</head>
<body>
    <h1>🧪 Test Report</h1>
    
    <div class="summary">
        <h2>Summary</h2>
        <p><strong>Total Tests:</strong> ${results.totalTests}</p>
        <p class="passed"><strong>Passed:</strong> ${results.passedTests}</p>
        <p class="failed"><strong>Failed:</strong> ${results.failedTests}</p>
        <p class="coverage"><strong>Coverage:</strong> ${results.coverage.toFixed(2)}%</p>
        <p><strong>Duration:</strong> ${results.duration}ms</p>
    </div>

    <h2>Test Suites</h2>
    <table>
        <thead>
            <tr>
                <th>Suite Name</th>
                <th>Total Tests</th>
                <th>Passed</th>
                <th>Failed</th>
                <th>Success Rate</th>
            </tr>
        </thead>
        <tbody>
            ${results.suites.map(suite => `
                <tr>
                    <td>${suite.name}</td>
                    <td>${suite.totalTests}</td>
                    <td class="passed">${suite.passedTests}</td>
                    <td class="failed">${suite.failedTests}</td>
                    <td>${((suite.passedTests / suite.totalTests) * 100).toFixed(1)}%</td>
                </tr>
            `).join('')}
        </tbody>
    </table>

    <h2>Coverage Report</h2>
    <div class="summary">
        <p><strong>Overall Coverage:</strong> ${coverage.overallCoverage.toFixed(2)}%</p>
        <p><strong>Files Covered:</strong> ${coverage.totalFiles}</p>
        <p><strong>Lines Covered:</strong> ${coverage.coveredLines}/${coverage.totalLines}</p>
    </div>
</body>
</html>`;
  }

  generateJUnitXML(results: TestResults): string {
    const xml = [
      '<?xml version="1.0" encoding="UTF-8"?>',
      `<testsuites tests="${results.totalTests}" failures="${results.failedTests}" time="${results.duration / 1000}">`,
      ...results.suites.map(suite => [
        `  <testsuite name="${suite.name}" tests="${suite.totalTests}" failures="${suite.failedTests}">`,
        ...suite.tests.map(test => 
          test.status === 'passed' 
            ? `    <testcase name="${test.name}"/>`
            : `    <testcase name="${test.name}"><failure message="${test.error}"/></testcase>`
        ),
        '  </testsuite>'
      ].join('\n')),
      '</testsuites>'
    ];

    return xml.join('\n');
  }

  async saveReport(content: string, filePath: string): Promise<void> {
    // Mock file saving - في التطبيق الحقيقي سيتم حفظ الملف
    console.log(`Report saved to: ${filePath}`);
  }
}