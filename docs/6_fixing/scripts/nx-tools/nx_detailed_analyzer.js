#!/usr/bin/env node

/**
 * محلل مفصل لأخطاء مشروع G-Assistant NX
 * يحدد مواقع الأخطاء بدقة
 */

const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

class NxDetailedAnalyzer {
  constructor() {
    this.projectRoot = path.resolve(__dirname, '../../../');
    this.reportsDir = path.join(__dirname, '../reports');
  }

  // تحليل أخطاء البناء بالتفصيل
  analyzeBuildErrors() {
    // Removed console.log
    
    const errors = [];
    const appsDir = path.join(this.projectRoot, 'apps');
    const apps = fs.readdirSync(appsDir);

    for (const app of apps) {
      try {
        execSync(`nx build ${app}`, { 
          cwd: this.projectRoot, 
          stdio: 'pipe' 
        });
      } catch (error) {
        const errorDetails = this.parseError(error.stdout?.toString() || error.stderr?.toString(), app);
        errors.push({
          app,
          type: 'BUILD_ERROR',
          details: errorDetails,
          timestamp: new Date().toISOString(),
          severity: this.calculateSeverity(errorDetails)
        });
      }
    }

    return errors;
  }

  // تحليل مشاكل TypeScript
  analyzeTypeScriptErrors() {
    // Removed console.log
    
    const errors = [];
    
    try {
      execSync('npx tsc --noEmit', { 
        cwd: this.projectRoot, 
        stdio: 'pipe' 
      });
    } catch (error) {
      const output = error.stdout?.toString() || error.stderr?.toString();
      const tsErrors = this.parseTSErrors(output);
      errors.push(...tsErrors);
    }

    return errors;
  }

  // تحليل مشاكل ESLint
  analyzeESLintErrors() {
    // Removed console.log
    
    const errors = [];
    
    try {
      execSync('nx run-many --target=lint --all', { 
        cwd: this.projectRoot, 
        stdio: 'pipe' 
      });
    } catch (error) {
      const output = error.stdout?.toString() || error.stderr?.toString();
      const lintErrors = this.parseLintErrors(output);
      errors.push(...lintErrors);
    }

    return errors;
  }

  // تحليل نص الخطأ
  parseError(errorText, context) {
    const lines = errorText.split('\n');
    const errorInfo = {
      file: null,
      line: null,
      column: null,
      message: '',
      code: null,
      stack: []
    };

    for (const line of lines) {
      // البحث عن مسار الملف
      const fileMatch = line.match(/([^:]+\.(?:ts|js|tsx|jsx)):(\d+):(\d+)/);
      if (fileMatch) {
        errorInfo.file = fileMatch[1];
        errorInfo.line = parseInt(fileMatch[2]);
        errorInfo.column = parseInt(fileMatch[3]);
      }

      // البحث عن رسالة الخطأ
      if (line.includes('error') || line.includes('Error')) {
        errorInfo.message = line.trim();
      }

      // جمع Stack trace
      if (line.trim().startsWith('at ')) {
        errorInfo.stack.push(line.trim());
      }
    }

    return errorInfo;
  }

  // تحليل أخطاء TypeScript
  parseTSErrors(output) {
    const errors = [];
    const lines = output.split('\n');

    for (const line of lines) {
      const match = line.match(/(.+\.ts)\((\d+),(\d+)\): error TS(\d+): (.+)/);
      if (match) {
        errors.push({
          type: 'TYPESCRIPT_ERROR',
          file: match[1],
          line: parseInt(match[2]),
          column: parseInt(match[3]),
          code: `TS${match[4]}`,
          message: match[5],
          severity: 'HIGH',
          timestamp: new Date().toISOString()
        });
      }
    }

    return errors;
  }

  // تحليل أخطاء ESLint
  parseLintErrors(output) {
    const errors = [];
    const lines = output.split('\n');

    for (const line of lines) {
      const match = line.match(/(.+):(\d+):(\d+): (.+) \((.+)\)/);
      if (match) {
        errors.push({
          type: 'ESLINT_ERROR',
          file: match[1],
          line: parseInt(match[2]),
          column: parseInt(match[3]),
          message: match[4],
          rule: match[5],
          severity: this.getLintSeverity(match[4]),
          timestamp: new Date().toISOString()
        });
      }
    }

    return errors;
  }

  // حساب شدة الخطأ
  calculateSeverity(errorDetails) {
    if (errorDetails.message.includes('Cannot resolve')) return 'CRITICAL';
    if (errorDetails.message.includes('Type error')) return 'HIGH';
    if (errorDetails.message.includes('Warning')) return 'MEDIUM';
    return 'LOW';
  }

  // تحديد شدة خطأ ESLint
  getLintSeverity(message) {
    if (message.includes('error')) return 'HIGH';
    if (message.includes('warning')) return 'MEDIUM';
    return 'LOW';
  }

  // توليد تقرير مفصل
  generateDetailedReport() {
    // Removed console.log

    const report = {
      timestamp: new Date().toISOString(),
      project: 'g-assistant-nx',
      analysis: {
        buildErrors: this.analyzeBuildErrors(),
        typeScriptErrors: this.analyzeTypeScriptErrors(),
        lintErrors: this.analyzeESLintErrors()
      },
      summary: {
        totalErrors: 0,
        criticalErrors: 0,
        highErrors: 0,
        mediumErrors: 0,
        lowErrors: 0,
        affectedFiles: new Set()
      }
    };

    // حساب الإحصائيات
    const allErrors = [
      ...report.analysis.buildErrors,
      ...report.analysis.typeScriptErrors,
      ...report.analysis.lintErrors
    ];

    report.summary.totalErrors = allErrors.length;

    allErrors.forEach(error => {
      if (error.file) report.summary.affectedFiles.add(error.file);
      
      switch (error.severity) {
        case 'CRITICAL': report.summary.criticalErrors++; break;
        case 'HIGH': report.summary.highErrors++; break;
        case 'MEDIUM': report.summary.mediumErrors++; break;
        case 'LOW': report.summary.lowErrors++; break;
      }
    });

    report.summary.affectedFiles = Array.from(report.summary.affectedFiles);

    // حفظ التقرير
    const timestamp = new Date().toISOString().split('T')[0];
    const reportFile = path.join(this.reportsDir, `detailed_analysis_${timestamp}.json`);
    fs.writeFileSync(reportFile, JSON.stringify(report, null, 2));

    // Removed console.log
    // Removed console.log
    // Removed console.log
    // Removed console.log
    // Removed console.log

    return report;
  }
}

if (require.main === module) {
  const analyzer = new NxDetailedAnalyzer();
  analyzer.generateDetailedReport();
}

module.exports = NxDetailedAnalyzer;