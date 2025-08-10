#!/usr/bin/env node

import { CodeScanner } from './scanner';
import { ErrorDetector } from './detector';
import { AICodeFixer } from './ai-fixer';
import { AutoTester } from './auto-tester';
import * as path from 'path';
import * as fs from 'fs';

/**
 * منسق AutoRepairSuite - يدير العملية الكاملة
 */
class AutoRepairOrchestrator {
  private projectRoot: string;
  private reportsDir: string;

  constructor() {
    this.projectRoot = path.resolve(__dirname, '../../');
    this.reportsDir = path.join(this.projectRoot, 'docs/6_fixing/reports');
    
    // إنشاء مجلد التقارير إذا لم يكن موجوداً
    if (!fs.existsSync(this.reportsDir)) {
      fs.mkdirSync(this.reportsDir, { recursive: true });
    }
  }

  // تشغيل العملية الكاملة
  async run(): Promise<void> {
    console.log('🤖 بدء تشغيل AutoRepairSuite...');
    console.log('=====================================');

    try {
      // المرحلة 1: مسح الكود
      console.log('\n📡 المرحلة 1: مسح ملفات الكود');
      const scanner = new CodeScanner(this.projectRoot);
      const codeFiles = await scanner.scanSpecificPaths(['apps', 'packages']);
      
      const scanResultsPath = path.join(this.reportsDir, 'scan_results.json');
      await scanner.saveResults(codeFiles, scanResultsPath);

      // المرحلة 2: اكتشاف الأخطاء
      console.log('\n🔍 المرحلة 2: اكتشاف الأخطاء');
      const detector = new ErrorDetector(this.projectRoot);
      const errors = await detector.detectAllErrors();
      
      const errorsPath = path.join(this.reportsDir, 'detected_errors.json');
      await detector.saveErrors(errors, errorsPath);

      // المرحلة 3: تحديث اللوحة المركزية
      console.log('\n📊 المرحلة 3: تحديث اللوحة المركزية');
      await this.updateCentralDashboard(codeFiles.length, errors.length);

      // المرحلة 4: الإصلاح الذكي (إذا توفر GEMINI_API_KEY)
      let fixes = [];
      if (process.env.GEMINI_API_KEY && errors.length > 0) {
        console.log('\n🤖 المرحلة 4: الإصلاح الذكي بـ AI');
        fixes = await this.performAIFixes(errors);
      }

      // المرحلة 5: توليد التقرير النهائي
      console.log('\n📋 المرحلة 5: توليد التقرير النهائي');
      await this.generateFinalReport(codeFiles, errors, fixes);

      console.log('\n🎉 تم إكمال AutoRepairSuite بنجاح!');
      console.log(`📁 التقارير محفوظة في: ${this.reportsDir}`);

    } catch (error) {
      console.error('❌ خطأ في تشغيل AutoRepairSuite:', error);
      process.exit(1);
    }
  }

  // تحديث اللوحة المركزية
  private async updateCentralDashboard(totalFiles: number, totalErrors: number): Promise<void> {
    const dashboardPath = path.join(this.reportsDir, 'nx_central_dashboard.json');
    
    const dashboard = {
      lastUpdate: new Date().toISOString(),
      project: 'g-assistant-nx',
      status: totalErrors === 0 ? 'HEALTHY' : totalErrors < 10 ? 'WARNING' : 'CRITICAL',
      autoRepair: {
        lastRun: new Date().toISOString(),
        filesScanned: totalFiles,
        errorsDetected: totalErrors,
        status: 'COMPLETED'
      },
      tasks: {
        pending: totalErrors > 0 ? [{
          id: 'AUTO_REPAIR_NEEDED',
          title: `إصلاح ${totalErrors} خطأ مكتشف`,
          priority: totalErrors > 10 ? 'HIGH' : 'MEDIUM',
          createdAt: new Date().toISOString()
        }] : [],
        completed: [{
          id: 'AUTO_SCAN_COMPLETED',
          title: 'مسح تلقائي للمشروع',
          completedAt: new Date().toISOString(),
          status: 'SUCCESS'
        }]
      },
      metrics: {
        healthScore: Math.max(0, 100 - (totalErrors * 2)),
        totalFiles: totalFiles,
        totalErrors: totalErrors,
        lastHealthCheck: new Date().toISOString()
      }
    };

    fs.writeFileSync(dashboardPath, JSON.stringify(dashboard, null, 2));
    console.log('✅ تم تحديث اللوحة المركزية');
  }

  // الإصلاح الذكي باستخدام AI
  private async performAIFixes(errors: any[]): Promise<any[]> {
    try {
      const aiFixer = new AICodeFixer();
      const tester = new AutoTester(this.projectRoot);
      
      // فلترة الأخطاء القابلة للإصلاح (أول 5 فقط)
      const fixableErrors = errors
        .filter(e => e.severity === 'error' && e.file && e.line)
        .slice(0, 5);
      
      console.log(`🔧 إصلاح ${fixableErrors.length} خطأ باستخدام AI...`);
      
      const fixes = await aiFixer.fixMultipleErrors(fixableErrors);
      const successfulFixes = [];
      
      // تطبيق واختبار الإصلاحات
      for (const fix of fixes) {
        if (fix.confidence > 0.7) {
          const error = fixableErrors.find(e => e.id === fix.errorId);
          if (error) {
            const filePath = path.resolve(this.projectRoot, error.file);
            const applied = await aiFixer.applyFix(fix, filePath);
            
            if (applied) {
              // اختبار الإصلاح
              const testResults = await tester.testFix(fix, filePath);
              const allPassed = testResults.every(r => r.passed);
              
              if (allPassed) {
                successfulFixes.push({ ...fix, applied: true, tested: true });
                console.log(`✅ تم إصلاح: ${error.message}`);
              } else {
                console.log(`⚠️ فشل اختبار الإصلاح: ${error.message}`);
                // استعادة من النسخة الاحتياطية
                this.restoreBackup(filePath);
              }
            }
          }
        }
      }
      
      // حفظ تقرير الإصلاحات
      const fixReportPath = path.join(this.reportsDir, `ai_fixes_${new Date().toISOString().split('T')[0]}.json`);
      await aiFixer.saveFixReport(fixes, fixReportPath);
      
      console.log(`✅ تم إصلاح ${successfulFixes.length} من ${fixes.length} أخطاء بنجاح`);
      return successfulFixes;
      
    } catch (error) {
      console.error('❌ فشل في الإصلاح الذكي:', error);
      return [];
    }
  }

  // استعادة من النسخة الاحتياطية
  private restoreBackup(filePath: string): void {
    const backupFiles = require('fs').readdirSync(path.dirname(filePath))
      .filter((f: string) => f.startsWith(path.basename(filePath) + '.backup.'))
      .sort()
      .reverse();
    
    if (backupFiles.length > 0) {
      const latestBackup = path.join(path.dirname(filePath), backupFiles[0]);
      require('fs').copyFileSync(latestBackup, filePath);
      console.log(`💾 تم استعادة ${filePath} من النسخة الاحتياطية`);
    }
  }

  // توليد التقرير النهائي
  private async generateFinalReport(codeFiles: any[], errors: any[], fixes: any[] = []): Promise<void> {
    const timestamp = new Date().toISOString().split('T')[0];
    const reportPath = path.join(this.reportsDir, `auto_repair_report_${timestamp}.json`);

    const report = {
      timestamp: new Date().toISOString(),
      project: 'g-assistant-nx',
      summary: {
        totalFiles: codeFiles.length,
        totalErrors: errors.length,
        healthScore: Math.max(0, 100 - (errors.length * 2)),
        status: errors.length === 0 ? 'HEALTHY' : errors.length < 10 ? 'WARNING' : 'CRITICAL'
      },
      breakdown: {
        fileTypes: this.groupFilesByType(codeFiles),
        errorSeverity: this.groupErrorsBySeverity(errors),
        errorSources: this.groupErrorsBySource(errors)
      },
      recommendations: this.generateRecommendations(errors),
      nextSteps: [
        'مراجعة الأخطاء عالية الأولوية',
        'تشغيل الإصلاح التلقائي للأخطاء البسيطة',
        'تحديث التبعيات إذا لزم الأمر',
        'إجراء اختبارات شاملة بعد الإصلاح'
      ]
    };

    fs.writeFileSync(reportPath, JSON.stringify(report, null, 2));
    console.log(`✅ تم توليد التقرير النهائي: ${reportPath}`);
  }

  // تجميع الملفات حسب النوع
  private groupFilesByType(files: any[]) {
    return files.reduce((acc, file) => {
      acc[file.type] = (acc[file.type] || 0) + 1;
      return acc;
    }, {});
  }

  // تجميع الأخطاء حسب الخطورة
  private groupErrorsBySeverity(errors: any[]) {
    return errors.reduce((acc, error) => {
      acc[error.severity] = (acc[error.severity] || 0) + 1;
      return acc;
    }, {});
  }

  // تجميع الأخطاء حسب المصدر
  private groupErrorsBySource(errors: any[]) {
    return errors.reduce((acc, error) => {
      acc[error.source] = (acc[error.source] || 0) + 1;
      return acc;
    }, {});
  }

  // توليد التوصيات
  private generateRecommendations(errors: any[]): string[] {
    const recommendations: string[] = [];

    if (errors.length === 0) {
      recommendations.push('🎉 المشروع في حالة ممتازة - لا توجد أخطاء');
      return recommendations;
    }

    const criticalErrors = errors.filter(e => e.severity === 'error').length;
    const warnings = errors.filter(e => e.severity === 'warning').length;

    if (criticalErrors > 0) {
      recommendations.push(`🔴 إصلاح ${criticalErrors} خطأ حرج فوراً`);
    }

    if (warnings > 5) {
      recommendations.push(`🟡 مراجعة ${warnings} تحذير لتحسين جودة الكود`);
    }

    if (errors.some(e => e.source === 'typescript')) {
      recommendations.push('📝 مراجعة تكوين TypeScript');
    }

    if (errors.some(e => e.source === 'eslint')) {
      recommendations.push('🔧 تشغيل ESLint --fix للإصلاحات التلقائية');
    }

    return recommendations;
  }
}

// تشغيل المنسق
if (require.main === module) {
  const orchestrator = new AutoRepairOrchestrator();
  orchestrator.run();
}

export default AutoRepairOrchestrator;