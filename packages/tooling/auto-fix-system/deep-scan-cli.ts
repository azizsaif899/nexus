#!/usr/bin/env node

import { DeepScanner } from './deep-scanner';
import { DeepFixOrchestrator } from './deep-fix-orchestrator';
import * as fs from 'fs';
import * as path from 'path';

interface CLIOptions {
  command: string;
  projectPath?: string;
  output?: string;
  autoFix?: boolean;
  scanTypes?: string[];
  severity?: string[];
  parallel?: boolean;
  verbose?: boolean;
}

class DeepScanCLI {
  private options: CLIOptions;

  constructor() {
    this.options = this.parseArgs();
  }

  private parseArgs(): CLIOptions {
    const args = process.argv.slice(2);
    const options: CLIOptions = {
      command: args[0] || 'help',
      projectPath: 'e:\\azizsys5\\g-assistant-nx',
      output: 'console',
      autoFix: false,
      scanTypes: ['security', 'dependency', 'typescript', 'import'],
      severity: ['critical', 'high', 'medium', 'low'],
      parallel: true,
      verbose: false
    };

    for (let i = 1; i < args.length; i++) {
      const arg = args[i];
      const nextArg = args[i + 1];

      switch (arg) {
        case '--path':
        case '-p':
          options.projectPath = nextArg;
          i++;
          break;
        case '--output':
        case '-o':
          options.output = nextArg;
          i++;
          break;
        case '--auto-fix':
        case '-f':
          options.autoFix = true;
          break;
        case '--scan-types':
        case '-t':
          options.scanTypes = nextArg.split(',');
          i++;
          break;
        case '--severity':
        case '-s':
          options.severity = nextArg.split(',');
          i++;
          break;
        case '--no-parallel':
          options.parallel = false;
          break;
        case '--verbose':
        case '-v':
          options.verbose = true;
          break;
      }
    }

    return options;
  }

  async run(): Promise<void> {
    try {
      switch (this.options.command) {
        case 'scan':
          await this.runScan();
          break;
        case 'fix':
          await this.runFix();
          break;
        case 'health':
          await this.runHealthCheck();
          break;
        case 'quick-fix':
          await this.runQuickFix();
          break;
        case 'help':
        default:
          this.showHelp();
          break;
      }
    } catch (error) {
      console.error('❌ خطأ:', error);
      process.exit(1);
    }
  }

  private async runScan(): Promise<void> {
    console.log('🔍 بدء الفحص الشامل...');
    console.log(`📁 المسار: ${this.options.projectPath}`);
    console.log(`🔧 أنواع الفحص: ${this.options.scanTypes?.join(', ')}`);
    
    const scanner = new DeepScanner({
      scanTypes: this.options.scanTypes || ['security'],
      parallel: this.options.parallel,
      autoFix: false
    });

    const results = await scanner.scanProject(this.options.projectPath!);
    
    // تصفية النتائج حسب الخطورة
    const filteredResults = results.filter(result => 
      this.options.severity?.includes(result.severity)
    );

    if (this.options.output === 'console') {
      this.displayResults(filteredResults);
    } else {
      await this.saveResults(filteredResults);
    }
  }

  private async runFix(): Promise<void> {
    console.log('🔧 بدء الإصلاح الشامل...');
    
    const orchestrator = new DeepFixOrchestrator({
      projectPath: this.options.projectPath!,
      autoFix: true
    });

    const session = await orchestrator.startDeepFix();
    
    console.log('\n📊 نتائج الإصلاح:');
    console.log(`✅ نجح: ${session.fixedIssues}`);
    console.log(`❌ فشل: ${session.failedIssues}`);
    console.log(`📈 معدل النجاح: ${((session.fixedIssues / session.totalIssues) * 100).toFixed(1)}%`);
  }

  private async runHealthCheck(): Promise<void> {
    console.log('🏥 فحص صحة المشروع...');
    
    const orchestrator = new DeepFixOrchestrator({
      projectPath: this.options.projectPath!
    });

    const health = await orchestrator.getProjectHealth();
    
    console.log('\n📊 تقرير صحة المشروع:');
    console.log(`📁 إجمالي الملفات: ${health.totalFiles}`);
    console.log(`🐛 إجمالي المشاكل: ${health.totalIssues}`);
    console.log(`🚨 مشاكل حرجة: ${health.criticalIssues}`);
    console.log(`🔧 قابل للإصلاح: ${health.fixableIssues}`);
    console.log(`💚 نقاط الصحة: ${health.healthScore}/100`);
    
    // تقييم الصحة
    if (health.healthScore >= 90) {
      console.log('🎉 المشروع في حالة ممتازة!');
    } else if (health.healthScore >= 70) {
      console.log('👍 المشروع في حالة جيدة');
    } else if (health.healthScore >= 50) {
      console.log('⚠️ المشروع يحتاج تحسين');
    } else {
      console.log('🚨 المشروع يحتاج إصلاح عاجل!');
    }
  }

  private async runQuickFix(): Promise<void> {
    const filePath = process.argv[3];
    if (!filePath) {
      console.error('❌ يرجى تحديد مسار الملف');
      return;
    }

    console.log(`🔧 إصلاح سريع: ${filePath}`);
    
    const orchestrator = new DeepFixOrchestrator();
    const results = await orchestrator.quickFixFile(filePath);
    
    console.log(`✅ تم إصلاح ${results.filter(r => r.success).length} مشكلة`);
    console.log(`❌ فشل في ${results.filter(r => !r.success).length} مشكلة`);
  }

  private displayResults(results: any[]): void {
    console.log('\n📊 نتائج الفحص:');
    console.log(`📁 الملفات المفحوصة: ${results.length}`);
    
    const totalIssues = results.reduce((sum, r) => sum + r.issues.length, 0);
    console.log(`🐛 إجمالي المشاكل: ${totalIssues}`);
    
    // تجميع حسب النوع
    const byType: Record<string, number> = {};
    const bySeverity: Record<string, number> = {};
    
    results.forEach(result => {
      bySeverity[result.severity] = (bySeverity[result.severity] || 0) + 1;
      
      result.issues.forEach((issue: any) => {
        byType[issue.type] = (byType[issue.type] || 0) + 1;
      });
    });
    
    console.log('\n📈 تجميع حسب النوع:');
    Object.entries(byType).forEach(([type, count]) => {
      console.log(`  ${this.getTypeIcon(type)} ${type}: ${count}`);
    });
    
    console.log('\n🚨 تجميع حسب الخطورة:');
    Object.entries(bySeverity).forEach(([severity, count]) => {
      console.log(`  ${this.getSeverityIcon(severity)} ${severity}: ${count}`);
    });
    
    if (this.options.verbose) {
      console.log('\n📋 تفاصيل المشاكل:');
      results.forEach(result => {
        if (result.issues.length > 0) {
          console.log(`\n📄 ${result.file}:`);
          result.issues.forEach((issue: any) => {
            console.log(`  ${this.getSeverityIcon(result.severity)} السطر ${issue.line}: ${issue.description}`);
            if (issue.fix) {
              console.log(`    💡 الإصلاح: ${issue.fix}`);
            }
          });
        }
      });
    }
  }

  private async saveResults(results: any[]): Promise<void> {
    const outputPath = this.options.output!;
    const report = {
      timestamp: new Date().toISOString(),
      projectPath: this.options.projectPath,
      scanOptions: {
        scanTypes: this.options.scanTypes,
        severity: this.options.severity,
        parallel: this.options.parallel
      },
      summary: {
        totalFiles: results.length,
        totalIssues: results.reduce((sum, r) => sum + r.issues.length, 0),
        fixableIssues: results.filter(r => r.fixable).length
      },
      results
    };

    fs.writeFileSync(outputPath, JSON.stringify(report, null, 2));
    console.log(`📄 تم حفظ التقرير في: ${outputPath}`);
  }

  private getTypeIcon(type: string): string {
    const icons: Record<string, string> = {
      security: '🛡️',
      dependency: '📦',
      typescript: '🔷',
      import: '📥',
      performance: '⚡'
    };
    return icons[type] || '🔧';
  }

  private getSeverityIcon(severity: string): string {
    const icons: Record<string, string> = {
      critical: '🚨',
      high: '🔴',
      medium: '🟡',
      low: '🟢'
    };
    return icons[severity] || '⚪';
  }

  private showHelp(): void {
    console.log(`
🔍 Deep Scan CLI - نظام الفحص والإصلاح الشامل

الاستخدام:
  deep-scan <command> [options]

الأوامر:
  scan          فحص المشروع بحثاً عن المشاكل
  fix           إصلاح المشاكل تلقائياً
  health        فحص صحة المشروع
  quick-fix     إصلاح سريع لملف واحد
  help          عرض هذه المساعدة

الخيارات:
  -p, --path <path>           مسار المشروع (افتراضي: المجلد الحالي)
  -o, --output <file>         حفظ النتائج في ملف (افتراضي: console)
  -f, --auto-fix             إصلاح تلقائي للمشاكل
  -t, --scan-types <types>    أنواع الفحص (security,dependency,typescript,import)
  -s, --severity <levels>     مستويات الخطورة (critical,high,medium,low)
  --no-parallel              تعطيل المعالجة المتوازية
  -v, --verbose               عرض تفاصيل إضافية

أمثلة:
  deep-scan scan                                    # فحص أساسي
  deep-scan scan -t security,typescript -v          # فحص أمني مع تفاصيل
  deep-scan fix -p ./my-project                     # إصلاح مشروع محدد
  deep-scan health                                  # فحص صحة المشروع
  deep-scan quick-fix ./src/app.ts                  # إصلاح ملف واحد
`);
  }
}

// تشغيل CLI إذا تم استدعاؤه مباشرة
if (require.main === module) {
  const cli = new DeepScanCLI();
  cli.run().catch(error => {
    console.error('❌ خطأ غير متوقع:', error);
    process.exit(1);
  });
}

export { DeepScanCLI };