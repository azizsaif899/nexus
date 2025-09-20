/**
 * 📊 Test Report Generator
 * مولد تقارير الاختبارات الشاملة
 */

import fs from 'fs';
import path from 'path';

interface TestMetrics {
  totalTests: number;
  passed: number;
  failed: number;
  skipped: number;
  duration: number;
  coverage: {
    lines: number;
    functions: number;
    branches: number;
    statements: number;
  };
}

interface TestSuiteResult {
  name: string;
  metrics: TestMetrics;
  details: TestDetail[];
}

interface TestDetail {
  name: string;
  status: 'passed' | 'failed' | 'skipped';
  duration: number;
  error?: string;
}

class TestReportGenerator {
  private results: TestSuiteResult[] = [];
  private startTime: Date = new Date();

  addTestSuite(result: TestSuiteResult): void {
    this.results.push(result);
  }

  generateHTMLReport(): string {
    const totalMetrics = this.calculateTotalMetrics();
    const successRate = (totalMetrics.passed / totalMetrics.totalTests) * 100;

    return `
<!DOCTYPE html>
<html dir="rtl" lang="ar">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>تقرير الاختبارات - AzizSys v2.0</title>
    <style>
        body {
            font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
            margin: 0;
            padding: 20px;
            background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
            color: #333;
        }
        .container {
            max-width: 1200px;
            margin: 0 auto;
            background: white;
            border-radius: 15px;
            box-shadow: 0 20px 40px rgba(0,0,0,0.1);
            overflow: hidden;
        }
        .header {
            background: linear-gradient(135deg, #4facfe 0%, #00f2fe 100%);
            color: white;
            padding: 30px;
            text-align: center;
        }
        .header h1 {
            margin: 0;
            font-size: 2.5em;
            font-weight: 300;
        }
        .summary {
            display: grid;
            grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
            gap: 20px;
            padding: 30px;
            background: #f8f9fa;
        }
        .metric-card {
            background: white;
            padding: 20px;
            border-radius: 10px;
            text-align: center;
            box-shadow: 0 5px 15px rgba(0,0,0,0.08);
            transition: transform 0.3s ease;
        }
        .metric-card:hover {
            transform: translateY(-5px);
        }
        .metric-value {
            font-size: 2.5em;
            font-weight: bold;
            margin: 10px 0;
        }
        .metric-label {
            color: #666;
            font-size: 0.9em;
        }
        .passed { color: #28a745; }
        .failed { color: #dc3545; }
        .skipped { color: #ffc107; }
        .duration { color: #17a2b8; }
        .coverage { color: #6f42c1; }
        .success-rate {
            font-size: 3em;
            color: ${successRate >= 90 ? '#28a745' : successRate >= 70 ? '#ffc107' : '#dc3545'};
        }
        .test-suites {
            padding: 30px;
        }
        .suite {
            margin-bottom: 30px;
            border: 1px solid #e9ecef;
            border-radius: 10px;
            overflow: hidden;
        }
        .suite-header {
            background: #f8f9fa;
            padding: 20px;
            border-bottom: 1px solid #e9ecef;
        }
        .suite-name {
            font-size: 1.3em;
            font-weight: bold;
            margin-bottom: 10px;
        }
        .suite-metrics {
            display: flex;
            gap: 20px;
            flex-wrap: wrap;
        }
        .suite-metric {
            padding: 5px 10px;
            border-radius: 5px;
            font-size: 0.9em;
        }
        .test-details {
            padding: 20px;
        }
        .test-item {
            display: flex;
            justify-content: space-between;
            align-items: center;
            padding: 10px 0;
            border-bottom: 1px solid #f1f3f4;
        }
        .test-item:last-child {
            border-bottom: none;
        }
        .test-status {
            padding: 4px 8px;
            border-radius: 4px;
            font-size: 0.8em;
            font-weight: bold;
        }
        .status-passed {
            background: #d4edda;
            color: #155724;
        }
        .status-failed {
            background: #f8d7da;
            color: #721c24;
        }
        .status-skipped {
            background: #fff3cd;
            color: #856404;
        }
        .coverage-bar {
            width: 100%;
            height: 20px;
            background: #e9ecef;
            border-radius: 10px;
            overflow: hidden;
            margin: 10px 0;
        }
        .coverage-fill {
            height: 100%;
            background: linear-gradient(90deg, #28a745, #20c997);
            transition: width 0.5s ease;
        }
        .footer {
            background: #343a40;
            color: white;
            padding: 20px;
            text-align: center;
        }
        @media (max-width: 768px) {
            .summary {
                grid-template-columns: 1fr;
            }
            .suite-metrics {
                flex-direction: column;
            }
        }
    </style>
</head>
<body>
    <div class="container">
        <div class="header">
            <h1>🧪 تقرير الاختبارات الشامل</h1>
            <p>AzizSys AI Assistant v2.0</p>
            <p>تاريخ التشغيل: ${this.startTime.toLocaleDateString('ar-SA')}</p>
        </div>

        <div class="summary">
            <div class="metric-card">
                <div class="metric-value success-rate">${successRate.toFixed(1)}%</div>
                <div class="metric-label">معدل النجاح</div>
            </div>
            <div class="metric-card">
                <div class="metric-value">${totalMetrics.totalTests}</div>
                <div class="metric-label">إجمالي الاختبارات</div>
            </div>
            <div class="metric-card">
                <div class="metric-value passed">${totalMetrics.passed}</div>
                <div class="metric-label">نجح</div>
            </div>
            <div class="metric-card">
                <div class="metric-value failed">${totalMetrics.failed}</div>
                <div class="metric-label">فشل</div>
            </div>
            <div class="metric-card">
                <div class="metric-value skipped">${totalMetrics.skipped}</div>
                <div class="metric-label">تم تخطيه</div>
            </div>
            <div class="metric-card">
                <div class="metric-value duration">${(totalMetrics.duration / 1000).toFixed(2)}s</div>
                <div class="metric-label">الوقت الإجمالي</div>
            </div>
        </div>

        <div class="test-suites">
            <h2>📋 تفاصيل مجموعات الاختبارات</h2>
            ${this.results.map(suite => this.generateSuiteHTML(suite)).join('')}
        </div>

        <div class="footer">
            <p>تم إنشاء هذا التقرير تلقائياً بواسطة AzizSys Test Runner</p>
            <p>© 2024 AzizSys - جميع الحقوق محفوظة</p>
        </div>
    </div>
</body>
</html>`;
  }

  private generateSuiteHTML(suite: TestSuiteResult): string {
    const successRate = (suite.metrics.passed / suite.metrics.totalTests) * 100;
    
    return `
        <div class="suite">
            <div class="suite-header">
                <div class="suite-name">🧪 ${suite.name}</div>
                <div class="suite-metrics">
                    <span class="suite-metric status-passed">${suite.metrics.passed} نجح</span>
                    <span class="suite-metric status-failed">${suite.metrics.failed} فشل</span>
                    <span class="suite-metric status-skipped">${suite.metrics.skipped} تخطي</span>
                    <span class="suite-metric">${(suite.metrics.duration / 1000).toFixed(2)}s</span>
                </div>
                <div class="coverage-bar">
                    <div class="coverage-fill" style="width: ${successRate}%"></div>
                </div>
                <small>معدل النجاح: ${successRate.toFixed(1)}%</small>
            </div>
            <div class="test-details">
                ${suite.details.map(test => `
                    <div class="test-item">
                        <span>${test.name}</span>
                        <div>
                            <span class="test-status status-${test.status}">${this.getStatusText(test.status)}</span>
                            <small style="margin-right: 10px;">${test.duration}ms</small>
                        </div>
                    </div>
                `).join('')}
            </div>
        </div>`;
  }

  private getStatusText(status: string): string {
    const statusMap: { [key: string]: string } = {
      'passed': 'نجح',
      'failed': 'فشل',
      'skipped': 'تخطي'
    };
    return statusMap[status] || status;
  }

  private calculateTotalMetrics(): TestMetrics {
    return this.results.reduce((total, suite) => ({
      totalTests: total.totalTests + suite.metrics.totalTests,
      passed: total.passed + suite.metrics.passed,
      failed: total.failed + suite.metrics.failed,
      skipped: total.skipped + suite.metrics.skipped,
      duration: total.duration + suite.metrics.duration,
      coverage: {
        lines: Math.max(total.coverage.lines, suite.metrics.coverage.lines),
        functions: Math.max(total.coverage.functions, suite.metrics.coverage.functions),
        branches: Math.max(total.coverage.branches, suite.metrics.coverage.branches),
        statements: Math.max(total.coverage.statements, suite.metrics.coverage.statements)
      }
    }), {
      totalTests: 0,
      passed: 0,
      failed: 0,
      skipped: 0,
      duration: 0,
      coverage: { lines: 0, functions: 0, branches: 0, statements: 0 }
    });
  }

  saveReport(): void {
    const reportsDir = path.join(process.cwd(), 'test-reports');
    if (!fs.existsSync(reportsDir)) {
      fs.mkdirSync(reportsDir, { recursive: true });
    }

    const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
    const htmlPath = path.join(reportsDir, `test-report-${timestamp}.html`);
    const jsonPath = path.join(reportsDir, `test-report-${timestamp}.json`);

    // حفظ التقرير HTML
    fs.writeFileSync(htmlPath, this.generateHTMLReport());
    
    // حفظ البيانات JSON
    fs.writeFileSync(jsonPath, JSON.stringify({
      timestamp: this.startTime.toISOString(),
      results: this.results,
      summary: this.calculateTotalMetrics()
    }, null, 2));

    // Removed console.log
    // Removed console.log
    // Removed console.log
  }
}

export { TestReportGenerator, TestSuiteResult, TestMetrics, TestDetail };