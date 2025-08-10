#!/usr/bin/env node

import { GoogleGenerativeAI } from '@google/generative-ai';
import * as fs from 'fs';
import * as path from 'path';

export class GeminiReviewer {
  private genAI: GoogleGenerativeAI;
  private model: any;
  private projectRoot: string;

  constructor() {
    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey) throw new Error('GEMINI_API_KEY required');
    
    this.genAI = new GoogleGenerativeAI(apiKey);
    this.model = this.genAI.getGenerativeModel({ model: 'gemini-pro' });
    this.projectRoot = path.resolve(__dirname, '../../../');
  }

  // مراجعة المشروع كاملاً
  async reviewProject(): Promise<any> {
    console.log('🔍 مراجعة المشروع كاملاً...');
    
    const projectStructure = this.analyzeProjectStructure();
    const reports = this.loadAllReports();
    const monthlyPlan = this.loadMonthlyPlan();
    
    const prompt = this.buildReviewPrompt(projectStructure, reports, monthlyPlan);
    const result = await this.model.generateContent(prompt);
    
    return this.parseReviewResult(result.response.text());
  }

  // تحليل بنية المشروع
  private analyzeProjectStructure() {
    const structure = {
      apps: this.scanDirectory('apps'),
      packages: this.scanDirectory('packages'),
      docs: this.scanDirectory('docs'),
      scripts: this.scanDirectory('scripts')
    };
    
    return structure;
  }

  // مسح مجلد
  private scanDirectory(dirName: string) {
    const dirPath = path.join(this.projectRoot, dirName);
    if (!fs.existsSync(dirPath)) return [];
    
    return fs.readdirSync(dirPath, { withFileTypes: true })
      .map(dirent => ({
        name: dirent.name,
        type: dirent.isDirectory() ? 'folder' : 'file',
        path: path.join(dirName, dirent.name)
      }));
  }

  // تحميل جميع التقارير
  private loadAllReports() {
    const reportsDir = path.join(this.projectRoot, 'docs/6_fixing/reports');
    const reports: any = {};
    
    if (fs.existsSync(reportsDir)) {
      fs.readdirSync(reportsDir)
        .filter(file => file.endsWith('.json'))
        .forEach(file => {
          try {
            const content = fs.readFileSync(path.join(reportsDir, file), 'utf8');
            reports[file] = JSON.parse(content);
          } catch (error) {
            console.warn(`تعذر قراءة ${file}`);
          }
        });
    }
    
    return reports;
  }

  // تحميل الخطة الشهرية
  private loadMonthlyPlan() {
    const planPath = path.join(this.projectRoot, 'docs/6_fixing/monthly_plans/MONTHLY_PLAN.md');
    
    if (fs.existsSync(planPath)) {
      return fs.readFileSync(planPath, 'utf8');
    }
    
    return 'لا توجد خطة شهرية';
  }

  // بناء prompt المراجعة
  private buildReviewPrompt(structure: any, reports: any, monthlyPlan: string) {
    const criticalErrors = this.extractCriticalErrors(reports);
    const monthlyTasks = this.extractMonthlyTasks(monthlyPlan);
    
    return `
أنت Gemini AI Reviewer المتقدم لمشروع G-Assistant NX.

مهمتك: ترتيب الأولويات بناءً على:
1. الأخطاء الحرجة من التقارير
2. المهام من الخطة الشهرية
3. حالة المشروع الحالية

الأخطاء الحرجة المكتشفة:
${JSON.stringify(criticalErrors, null, 2)}

مهام الخطة الشهرية:
${JSON.stringify(monthlyTasks, null, 2)}

بنية المشروع:
${JSON.stringify(structure, null, 2)}

المطلوب:
1. تحليل الأخطاء الحالية وترتيبها حسب الأولوية
2. تحديد ما يحتاج إصلاح/حذف/إنشاء
3. مراجعة التوافق مع الخطة الشهرية
4. اقتراح مهام يومية محددة

أجب بـ JSON:
{
  "projectHealth": "HEALTHY|WARNING|CRITICAL",
  "priorities": [
    {
      "priority": "HIGH|MEDIUM|LOW",
      "task": "وصف المهمة",
      "location": "مسار الملف",
      "action": "CREATE|UPDATE|DELETE|FIX",
      "estimatedTime": "الوقت المقدر",
      "reason": "سبب الأولوية"
    }
  ],
  "dailyTasks": ["مهمة 1", "مهمة 2"],
  "recommendations": ["توصية 1", "توصية 2"]
}
`;
  }

  // تحليل نتيجة المراجعة
  private parseReviewResult(response: string) {
    try {
      const jsonMatch = response.match(/```json\s*([\s\S]*?)\s*```/);
      if (jsonMatch) {
        return JSON.parse(jsonMatch[1]);
      }
      
      // محاولة تحليل مباشر
      return JSON.parse(response);
    } catch (error) {
      console.error('فشل تحليل رد Gemini:', error);
      return {
        projectHealth: 'WARNING',
        priorities: [],
        dailyTasks: ['مراجعة يدوية مطلوبة'],
        recommendations: ['تحقق من رد Gemini']
      };
    }
  }

  // حفظ تقرير المراجعة
  async saveReviewReport(review: any) {
    const timestamp = new Date().toISOString().split('T')[0];
    const reportPath = path.join(
      this.projectRoot, 
      'docs/6_fixing/reports', 
      `gemini_review_${timestamp}.json`
    );
    
    const fullReport = {
      timestamp: new Date().toISOString(),
      reviewer: 'Gemini AI Reviewer',
      version: '2.0',
      ...review
    };
    
    fs.writeFileSync(reportPath, JSON.stringify(fullReport, null, 2));
    
    // إنشاء ملف المهام اليومية
    await this.createDailyTasksFile(review.dailyTasks || []);
    
    console.log(`📊 تم حفظ تقرير المراجعة: ${reportPath}`);
    return reportPath;
  }

  // إنشاء ملف المهام اليومية
  private async createDailyTasksFile(tasks: string[]) {
    const timestamp = new Date().toISOString().split('T')[0];
    
    // تحديث DAILY_BOOT.md
    await this.updateDailyBoot(tasks);
    
    // إنشاء تقرير إضافي
    const tasksPath = path.join(
      this.projectRoot,
      'docs/6_fixing/reports',
      `daily_tasks_${timestamp}.md`
    );
    
    const content = `# 📋 المهام اليومية - ${timestamp}

## 🎯 المهام المطلوبة:

${tasks.map((task, index) => `${index + 1}. ${task}`).join('\n')}

## ✅ حالة التنفيذ:
- [ ] مراجعة التقرير الشامل
- [ ] تنفيذ المهام حسب الأولوية
- [ ] تحديث التقارير

---
تم إنشاؤه بواسطة: Gemini AI Reviewer
`;
    
    fs.writeFileSync(tasksPath, content);
    console.log(`📋 تم إنشاء ملف المهام اليومية: ${tasksPath}`);
  }

  // تحديث DAILY_BOOT.md
  private async updateDailyBoot(tasks: string[]) {
    const timestamp = new Date().toISOString().split('T')[0];
    const bootPath = path.join(this.projectRoot, 'docs/6_fixing/DAILY_BOOT.md');
    
    const reports = this.loadAllReports();
    const errorSources = this.analyzeErrorSources(reports);
    
    const content = `# 🚀 Daily Boot - ${timestamp}

## 📋 Today's Mission: G-Assistant NX Execution

**Main Goal**: Execute tasks from Gemini AI Reviewer

## 🎯 Priority Tasks

${this.formatTasksForBoot(tasks, errorSources)}

## 📊 Error Sources Analysis

${this.formatErrorSources(errorSources)}

## 📊 Status Updates

- **Gemini Review**: ✅ Completed
- **Amazon Executor**: ⏳ Ready to execute

---
*Generated by Gemini AI Reviewer at ${new Date().toLocaleString('ar-SA')}*`;
    
    fs.writeFileSync(bootPath, content);
    console.log(`🚀 تم تحديث DAILY_BOOT.md`);
  }

  // تحليل مصادر الأخطاء
  private analyzeErrorSources(reports: any) {
    const sources: any = {};
    
    Object.entries(reports).forEach(([filename, report]: [string, any]) => {
      if (report.errors && Array.isArray(report.errors)) {
        report.errors.forEach((error: any) => {
          const source = this.identifyErrorSource(error, filename);
          if (!sources[source]) sources[source] = [];
          sources[source].push({
            file: error.file || 'unknown',
            message: error.message,
            severity: error.severity,
            reportFile: filename
          });
        });
      }
    });
    
    return sources;
  }

  // تحديد مصدر الخطأ
  private identifyErrorSource(error: any, reportFile: string) {
    if (reportFile.includes('nx_monitor')) return 'nx_project_monitor.js';
    if (reportFile.includes('auto_fix')) return 'nx_auto_fix.js';
    if (reportFile.includes('detected_errors')) return 'detector.ts';
    if (error.source === 'build') return 'nx build system';
    return 'unknown script';
  }

  // تنسيق المهام
  private formatTasksForBoot(tasks: string[], errorSources: any) {
    return tasks.map((task, index) => `- [ ] **TASK-${index + 1}**: ${task}`).join('\n') || '- [ ] No tasks';
  }

  // تنسيق مصادر الأخطاء
  private formatErrorSources(sources: any) {
    let formatted = '';
    Object.entries(sources).forEach(([source, errors]: [string, any]) => {
      formatted += `\n### 📝 ${source}: ${errors.length} errors\n`;
    });
    return formatted || 'No error sources';
  }
}

// تشغيل مباشر
if (require.main === module) {
  const reviewer = new GeminiReviewer();
  reviewer.reviewProject().then(review => {
    reviewer.saveReviewReport(review);
    console.log('🎉 تمت المراجعة الشاملة');
  });
}