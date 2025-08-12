#!/usr/bin/env node

import { AICodeFixer } from './ai-fixer';
import { DetectedError } from './detector';
import * as fs from 'fs';
import * as path from 'path';
import { execSync } from 'child_process';

export interface TaskRequest {
  taskId: string;
  source: string;
  priority: 'HIGH' | 'MEDIUM' | 'LOW';
  action: 'FIX' | 'UPDATE' | 'DELETE';
  location: string;
  details: string;
  estimatedTime: string;
}

export class AmazonExecutor {
  private projectRoot: string;
  private backupsDir: string;
  private reportsDir: string;
  private isDryRun: boolean;

  constructor(isDryRun: boolean = false) {
    this.projectRoot = path.resolve(__dirname, '../../');
    this.backupsDir = path.join(this.projectRoot, '.backups');
    this.reportsDir = path.join(this.projectRoot, 'docs/6_fixing/reports');
    this.isDryRun = isDryRun;

    // إنشاء مجلد النسخ الاحتياطية
    if (!fs.existsSync(this.backupsDir)) {
      fs.mkdirSync(this.backupsDir, { recursive: true });
    }
  }

  // قراءة مهام اليوم من Gemini AI
  async readDailyTasks(): Promise<TaskRequest[]> {
    console.log('📋 قراءة المهام اليومية...');
    
    const today = new Date().toISOString().split('T')[0];
    const tasksFile = path.join(this.reportsDir, `daily_tasks_${today}.md`);
    const reviewFile = path.join(this.reportsDir, `gemini_review_${today}.json`);
    
    if (!fs.existsSync(reviewFile)) {
      console.log('❌ لا يوجد تقرير Gemini AI لليوم');
      return [];
    }
    
    const review = JSON.parse(fs.readFileSync(reviewFile, 'utf8'));
    return this.parseTasksFromReview(review);
  }

  // تحليل المهام من تقرير Gemini
  private parseTasksFromReview(review: any): TaskRequest[] {
    if (!review.priorities) return [];
    
    return review.priorities.map((priority: any, index: number) => ({
      taskId: `TASK-${Date.now()}-${index}`,
      source: 'gemini_review',
      priority: priority.priority,
      action: priority.action,
      location: priority.location,
      details: priority.task,
      estimatedTime: priority.estimatedTime
    }));
  }

  // تنفيذ مهمة واحدة
  async executeTask(task: TaskRequest): Promise<boolean> {
    console.log(`🔧 تنفيذ المهمة: ${task.taskId}`);
    console.log(`📍 الموقع: ${task.location}`);
    console.log(`⚡ الأولوية: ${task.priority}`);
    
    // التحقق من وضوح المهمة
    if (!this.isTaskClear(task)) {
      console.log('❓ المهمة غير واضحة، أحتاج تفاصيل أكثر');
      this.requestClarification(task);
      return false;
    }
    
    if (this.isDryRun) {
      console.log(`[DRY RUN] 📝 كان سيتم تنفيذ المهمة: ${task.taskId} - ${task.details}`);
      console.log(`[DRY RUN] ➡️  الإجراء: ${task.action} على ${task.location}`);
      return true; // محاكاة النجاح
    }

    try {
      // إنشاء نسخة احتياطية
      await this.createBackup(task.location);
      
      // تنفيذ المهمة حسب النوع
      switch (task.action) {
        case 'FIX':
        case 'UPDATE':
          return await this.updateFile(task);
        case 'DELETE':
          return await this.deleteFile(task);
        default:
          console.log(`❌ نوع مهمة غير مدعوم: ${task.action}`);
          return false;
      }
    } catch (error) {
      console.error(`❌ فشل تنفيذ المهمة: ${error}`);
      await this.restoreBackup(task.location);
      return false;
    }
  }

  // فحص وضوح المهمة
  private isTaskClear(task: TaskRequest): boolean {
    // فحص وجود التفاصيل الأساسية
    if (!task.location || !task.details) return false;
    
    // فحص وجود الملف
    const fullPath = path.join(this.projectRoot, task.location);
    if (!fs.existsSync(fullPath)) {
      console.log(`❌ الملف غير موجود: ${task.location}`);
      return false;
    }
    
    // فحص وضوح التفاصيل
    if (task.details.length < 20) {
      console.log('❌ التفاصيل قصيرة جداً');
      return false;
    }
    
    return true;
  }

  // طلب توضيحات
  private requestClarification(task: TaskRequest) {
    const clarificationRequest = {
      taskId: task.taskId,
      status: 'NEED_CLARIFICATION',
      questions: [
        'أي سطر بالضبط يحتاج تعديل؟',
        'ما هو الكود المتوقع؟',
        'هل هناك اختبارات محددة للتشغيل؟'
      ],
      timestamp: new Date().toISOString()
    };
    
    const clarificationPath = path.join(
      this.reportsDir, 
      `clarification_${task.taskId}.json`
    );
    
    fs.writeFileSync(
      clarificationPath, 
      JSON.stringify(clarificationRequest, null, 2)
    );
    
    console.log(`📝 تم حفظ طلب التوضيح: ${clarificationPath}`);
  }

  // إنشاء نسخة احتياطية
  private async createBackup(filePath: string): Promise<string> {
    const fullPath = path.join(this.projectRoot, filePath);
    if (this.isDryRun) {
      console.log(`[DRY RUN] 💾 كان سيتم إنشاء نسخة احتياطية لـ: ${filePath}`);
      return `${filePath}.backup.dryrun`;
    }

    const timestamp = Date.now();
    const backupName = `${path.basename(filePath)}.backup.${timestamp}`;
    const backupPath = path.join(this.backupsDir, backupName);
    
    fs.copyFileSync(fullPath, backupPath);
    
    console.log(`💾 تم إنشاء نسخة احتياطية: ${backupName}`);
    return backupPath;
  }

  // تحديث ملف
  private async updateFile(task: TaskRequest): Promise<boolean> {
    const fullPath = path.join(this.projectRoot, task.location);
    
    console.log(`✏️ محاولة تحديث/إصلاح الملف: ${task.location} (الإجراء: ${task.action})`);

    let modificationApplied = false;

    if (task.action === 'FIX') {
      try {
        const aiFixer = new AICodeFixer(undefined, this.isDryRun);
        const fileContent = fs.readFileSync(fullPath, 'utf8');

        const syntheticError: DetectedError = {
          id: task.taskId,
          file: task.location,
          line: 1,
          column: 1,
          message: task.details,
          source: 'GeminiReviewer',
          severity: 'error',
          context: fileContent.substring(0, 2000)
        };

        const fixSuggestion = await aiFixer.fixError(syntheticError, fileContent);

        if (fixSuggestion && fixSuggestion.confidence > 0.7) {
          modificationApplied = await aiFixer.applyFix(fixSuggestion, fullPath);
        } else {
          console.log('🤔 لم يتم العثور على إصلاح بمستوى ثقة كافٍ.');
        }
      } catch (error) {
        console.error('❌ حدث خطأ أثناء محاولة الإصلاح التلقائي:', error);
        modificationApplied = false;
      }
"E:\azizsys5\g-assistant-nx\docs\6_fixing\monthly_plans\DAILY_BOOT_38.md"    } else if (task.action === 'UPDATE') {
      try {
        const aiFixer = new AICodeFixer(undefined, this.isDryRun);
        const fileContent = fs.readFileSync(fullPath, 'utf8');

        // بالنسبة لمهام التحديث، تفاصيل المهمة هي التعليمات
        const updateRequest: DetectedError = {
            id: task.taskId,
            file: task.location,
            line: 1, // قد لا يكون رقم السطر مهماً للتحديث العام
            column: 1,
            message: `Update instruction: ${task.details}`,
            source: 'GeminiReviewer',
            severity: 'info',
            context: fileContent.substring(0, 2000)
        };

        // يمكننا استخدام نفس المصلح، لكن قد نحتاج لتعديل الـ prompt داخله لمهام التحديث
        const updateSuggestion = await aiFixer.fixError(updateRequest, fileContent);

        if (updateSuggestion && updateSuggestion.confidence > 0.65) { // يمكن استخدام نسبة ثقة مختلفة للتحديثات
            modificationApplied = await aiFixer.applyFix(updateSuggestion, fullPath);
        }
      } catch (error) {
          console.error('❌ حدث خطأ أثناء محاولة التحديث التلقائي:', error);
          modificationApplied = false;
      }
    } else {
      console.log(`[INFO] الإجراء '${task.action}' لم يتم تنفيذ منطق تعديل الكود له بعد.`);
    }

    // اختبار التغييرات فقط إذا تم تطبيق تعديل
    if (modificationApplied) {
      console.log('✅ تم تطبيق التعديل، بدء الاختبارات...');
      return await this.testChanges(task);
    } else {
      console.log('⚠️ لم يتم تطبيق أي تعديل، تخطي الاختبارات.');
      return false;
    }
  }

  // حذف ملف
  private async deleteFile(task: TaskRequest): Promise<boolean> {
    const fullPath = path.join(this.projectRoot, task.location);
    
    console.log(`🗑️ حذف الملف: ${task.location}`);
    
    // توثيق سبب الحذف
    const deleteLog = {
      file: task.location,
      reason: task.details,
      backup: await this.createBackup(task.location),
      timestamp: new Date().toISOString(),
      taskId: task.taskId
    };
    
    // الحذف
    fs.unlinkSync(fullPath);
    
    // حفظ سجل الحذف
    const logPath = path.join(this.reportsDir, `delete_log_${task.taskId}.json`);
    fs.writeFileSync(logPath, JSON.stringify(deleteLog, null, 2));
    
    console.log(`✅ تم حذف الملف مع التوثيق`);
    return true;
  }

  // اختبار التغييرات
  private async testChanges(task: TaskRequest): Promise<boolean> {
    console.log('🧪 اختبار التغييرات...');

    if (this.isDryRun) {
      console.log(`[DRY RUN] 🧪 كان سيتم اختبار التغييرات للمهمة: ${task.taskId}`);
      return true;
    }
    
    try {
      // تحديد المشروع من المسار
      const project = this.getProjectFromPath(task.location);
      
      if (project) {
        // اختبار المشروع المحدد
        execSync(`nx test ${project}`, { 
          cwd: this.projectRoot, 
          stdio: 'pipe' 
        });
        
        execSync(`nx lint ${project}`, { 
          cwd: this.projectRoot, 
          stdio: 'pipe' 
        });
      }
      
      console.log('✅ نجحت جميع الاختبارات');
      return true;
    } catch (error) {
      console.log('❌ فشلت الاختبارات');
      return false;
    }
  }

  // تحديد المشروع من المسار
  private getProjectFromPath(filePath: string): string | null {
    if (filePath.startsWith('apps/')) {
      return filePath.split('/')[1];
    }
    if (filePath.startsWith('packages/')) {
      return filePath.split('/')[1];
    }
    return null;
  }

  // استعادة النسخة الاحتياطية
  private async restoreBackup(filePath: string): Promise<void> {
    console.log(`🔄 استعادة النسخة الاحتياطية لـ: ${filePath}`);
    
    // البحث عن أحدث نسخة احتياطية
    const fileName = path.basename(filePath);
    const backupFiles = fs.readdirSync(this.backupsDir)
      .filter(f => f.startsWith(`${fileName}.backup.`))
      .sort()
      .reverse();
    
    if (backupFiles.length > 0) {
      const latestBackup = path.join(this.backupsDir, backupFiles[0]);
      const fullPath = path.join(this.projectRoot, filePath);
      
      fs.copyFileSync(latestBackup, fullPath);
      console.log('✅ تم استعادة النسخة الاحتياطية');
    }
  }

  // إنشاء تقرير GitHub
  async generateGitHubReport(tasks: TaskRequest[], results: boolean[]): Promise<void> {
    const timestamp = new Date().toISOString().split('T')[0];
    const reportPath = path.join(this.reportsDir, `github_report_${timestamp}.md`);
    
    let report = `# 📋 تقرير التغييرات - ${timestamp}\n\n`;
    
    report += `## 🎯 ملخص المهام:\n`;
    report += `- **إجمالي المهام**: ${tasks.length}\n`;
    report += `- **المهام المكتملة**: ${results.filter(r => r).length}\n`;
    report += `- **المهام الفاشلة**: ${results.filter(r => !r).length}\n\n`;
    
    report += `## 📝 التفاصيل:\n`;
    tasks.forEach((task, index) => {
      const status = results[index] ? '✅' : '❌';
      report += `### ${status} ${task.taskId}\n`;
      report += `- **الموقع**: \`${task.location}\`\n`;
      report += `- **النوع**: ${task.action}\n`;
      report += `- **الأولوية**: ${task.priority}\n`;
      report += `- **التفاصيل**: ${task.details}\n\n`;
    });
    
    report += `## ⚠️ نقاط مهمة للمراجعة:\n`;
    report += `- فحص جميع الاختبارات\n`;
    report += `- مراجعة النسخ الاحتياطية في \`.backups/\`\n`;
    report += `- التأكد من عدم كسر أي وظائف موجودة\n\n`;
    
    fs.writeFileSync(reportPath, report);
    console.log(`📊 تم إنشاء تقرير GitHub: ${reportPath}`);
  }

  // تشغيل المنفذ
  async run(): Promise<void> {
    console.log('🚀 بدء Amazon Executor v2.0');
    
    const tasks = await this.readDailyTasks();
    
    if (tasks.length === 0) {
      console.log('📭 لا توجد مهام لليوم');
      return;
    }
    
    console.log(`📋 تم العثور على ${tasks.length} مهمة`);
    
    const results: boolean[] = [];
    
    for (const task of tasks) {
      const result = await this.executeTask(task);
      results.push(result);
    }
    
    await this.generateGitHubReport(tasks, results);
    
    console.log('🎉 تم إكمال جميع المهام');
  }
}

// تشغيل مباشر
if (require.main === module) {
  const isDryRun = process.argv.includes('--dry-run');
  const executor = new AmazonExecutor(isDryRun);
  executor.run();
}