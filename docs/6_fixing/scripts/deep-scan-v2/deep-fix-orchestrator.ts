import { DeepScanner, ScanResult } from './deep-scanner';
import { SmartExecutor } from './executor';
import { eventBus } from './core/events/eventBus';
import { TaskRequest, TaskResult } from './core/types';
import * as fs from 'fs';
import * as path from 'path';

export interface FixSession {
  id: string;
  startTime: Date;
  endTime?: Date;
  totalIssues: number;
  fixedIssues: number;
  failedIssues: number;
  status: 'running' | 'completed' | 'failed' | 'paused';
  results: TaskResult[];
}

export interface DeepFixConfig {
  projectPath: string;
  autoFix: boolean;
  batchSize: number;
  maxConcurrent: number;
  priorityOrder: string[];
  backupEnabled: boolean;
  reportPath: string;
}

export class DeepFixOrchestrator {
  private scanner: DeepScanner;
  private executor: SmartExecutor;
  private currentSession: FixSession | null = null;
  private config: DeepFixConfig;
  private taskQueue: TaskRequest[] = [];
  private activeTasks: Map<string, TaskRequest> = new Map();

  constructor(config: Partial<DeepFixConfig> = {}) {
    this.config = {
      projectPath: 'e:\\azizsys5\\g-assistant-nx',
      autoFix: true,
      batchSize: 5,
      maxConcurrent: 3,
      priorityOrder: ['critical', 'high', 'medium', 'low'],
      backupEnabled: true,
      reportPath: 'e:\\azizsys5\\g-assistant-nx\\docs\\6_fixing\\reports',
      ...config
    };

    this.scanner = new DeepScanner({
      autoFix: false, // نتحكم نحن في الإصلاح
      parallel: true
    });

    this.executor = new SmartExecutor();
    this.setupEventListeners();
  }

  private setupEventListeners(): void {
    eventBus.on('task:completed', (result: TaskResult) => {
      this.handleTaskCompletion(result);
    });

    eventBus.on('task:failed', (result: TaskResult) => {
      this.handleTaskFailure(result);
    });
  }

  async startDeepFix(): Promise<FixSession> {
    if (this.currentSession?.status === 'running') {
      throw new Error('جلسة إصلاح قيد التشغيل بالفعل');
    }

    console.log('🚀 [Deep Fix] بدء جلسة الإصلاح الشامل...');
    
    // إنشاء جلسة جديدة
    this.currentSession = {
      id: `deep-fix-${Date.now()}`,
      startTime: new Date(),
      totalIssues: 0,
      fixedIssues: 0,
      failedIssues: 0,
      status: 'running',
      results: []
    };

    try {
      // المرحلة 1: الفحص الشامل
      console.log('🔍 [Deep Fix] المرحلة 1: الفحص الشامل...');
      const scanResults = await this.scanner.scanProject(this.config.projectPath);
      
      // المرحلة 2: تحليل وترتيب المهام
      console.log('📋 [Deep Fix] المرحلة 2: تحليل وترتيب المهام...');
      this.taskQueue = this.createTasksFromScanResults(scanResults);
      this.currentSession.totalIssues = this.taskQueue.length;
      
      // المرحلة 3: تنفيذ الإصلاحات
      console.log('🔧 [Deep Fix] المرحلة 3: تنفيذ الإصلاحات...');
      await this.executeTasks();
      
      // المرحلة 4: التحقق والتقرير النهائي
      console.log('📊 [Deep Fix] المرحلة 4: التحقق والتقرير النهائي...');
      await this.finalizeSession();
      
      return this.currentSession;
    } catch (error) {
      this.currentSession.status = 'failed';
      this.currentSession.endTime = new Date();
      throw error;
    }
  }

  private createTasksFromScanResults(scanResults: ScanResult[]): TaskRequest[] {
    const tasks: TaskRequest[] = [];
    
    // ترتيب النتائج حسب الأولوية
    const sortedResults = scanResults.sort((a, b) => {
      const priorityA = this.config.priorityOrder.indexOf(a.severity);
      const priorityB = this.config.priorityOrder.indexOf(b.severity);
      return priorityA - priorityB;
    });

    sortedResults.forEach((result, index) => {
      result.issues.forEach((issue, issueIndex) => {
        if (issue.fix) { // فقط المشاكل القابلة للإصلاح
          const task: TaskRequest = {
            id: `task-${index}-${issueIndex}`,
            type: 'fix',
            priority: this.mapSeverityToPriority(result.severity),
            file: result.file,
            description: issue.description,
            assignedTo: 'executor',
            status: 'pending',
            metadata: {
              issue,
              scanResult: result,
              errorType: issue.type,
              line: issue.line,
              rule: issue.rule,
              confidence: result.confidence
            }
          };
          tasks.push(task);
        }
      });
    });

    return tasks;
  }

  private mapSeverityToPriority(severity: string): 'low' | 'medium' | 'high' | 'critical' {
    return severity as 'low' | 'medium' | 'high' | 'critical';
  }

  private async executeTasks(): Promise<void> {
    console.log(`📋 [Deep Fix] تنفيذ ${this.taskQueue.length} مهمة...`);
    
    while (this.taskQueue.length > 0 || this.activeTasks.size > 0) {
      // تشغيل مهام جديدة حتى الحد الأقصى
      while (this.activeTasks.size < this.config.maxConcurrent && this.taskQueue.length > 0) {
        const task = this.taskQueue.shift()!;
        this.activeTasks.set(task.id, task);
        
        console.log(`🔧 [Deep Fix] تنفيذ: ${task.description}`);
        eventBus.assignTask(task);
      }
      
      // انتظار قصير قبل التحقق مرة أخرى
      await new Promise(resolve => setTimeout(resolve, 100));
    }
  }

  private handleTaskCompletion(result: TaskResult): void {
    if (!this.currentSession) return;
    
    this.activeTasks.delete(result.taskId);
    this.currentSession.results.push(result);
    
    if (result.success) {
      this.currentSession.fixedIssues++;
      console.log(`✅ [Deep Fix] نجح: ${result.message}`);
    } else {
      this.currentSession.failedIssues++;
      console.log(`❌ [Deep Fix] فشل: ${result.message}`);
    }
    
    // تحديث التقدم
    const progress = ((this.currentSession.fixedIssues + this.currentSession.failedIssues) / this.currentSession.totalIssues) * 100;
    console.log(`📊 [Deep Fix] التقدم: ${progress.toFixed(1)}%`);
  }

  private handleTaskFailure(result: TaskResult): void {
    this.handleTaskCompletion(result);
  }

  private async finalizeSession(): Promise<void> {
    if (!this.currentSession) return;
    
    this.currentSession.endTime = new Date();
    this.currentSession.status = 'completed';
    
    // إنشاء التقرير النهائي
    const report = {
      session: this.currentSession,
      summary: {
        duration: this.currentSession.endTime.getTime() - this.currentSession.startTime.getTime(),
        successRate: (this.currentSession.fixedIssues / this.currentSession.totalIssues) * 100,
        totalFiles: new Set(this.currentSession.results.map(r => r.changes?.[0]?.file)).size,
        backupsCreated: this.currentSession.results.filter(r => r.success).length
      },
      breakdown: {
        byType: this.getBreakdownByType(),
        bySeverity: this.getBreakdownBySeverity(),
        byFile: this.getBreakdownByFile()
      },
      recommendations: this.generateRecommendations()
    };
    
    // حفظ التقرير
    const reportPath = path.join(
      this.config.reportPath,
      `deep-fix-session-${this.currentSession.id}.json`
    );
    
    fs.writeFileSync(reportPath, JSON.stringify(report, null, 2));
    
    console.log(`📊 [Deep Fix] تم الانتهاء! التقرير: ${reportPath}`);
    console.log(`✅ نجح: ${this.currentSession.fixedIssues}/${this.currentSession.totalIssues}`);
    console.log(`❌ فشل: ${this.currentSession.failedIssues}/${this.currentSession.totalIssues}`);
  }

  private getBreakdownByType(): Record<string, number> {
    const breakdown: Record<string, number> = {};
    
    this.currentSession?.results.forEach(result => {
      const type = result.metadata?.issue?.type || 'unknown';
      breakdown[type] = (breakdown[type] || 0) + 1;
    });
    
    return breakdown;
  }

  private getBreakdownBySeverity(): Record<string, number> {
    const breakdown: Record<string, number> = {};
    
    this.currentSession?.results.forEach(result => {
      const severity = result.metadata?.scanResult?.severity || 'unknown';
      breakdown[severity] = (breakdown[severity] || 0) + 1;
    });
    
    return breakdown;
  }

  private getBreakdownByFile(): Record<string, number> {
    const breakdown: Record<string, number> = {};
    
    this.currentSession?.results.forEach(result => {
      const file = result.changes?.[0]?.file || 'unknown';
      breakdown[file] = (breakdown[file] || 0) + 1;
    });
    
    return breakdown;
  }

  private generateRecommendations(): string[] {
    const recommendations: string[] = [];
    
    if (!this.currentSession) return recommendations;
    
    const successRate = (this.currentSession.fixedIssues / this.currentSession.totalIssues) * 100;
    
    if (successRate < 80) {
      recommendations.push('معدل النجاح منخفض - راجع الأخطاء وحسن الإصلاحات');
    }
    
    const typeBreakdown = this.getBreakdownByType();
    if (typeBreakdown.security > 0) {
      recommendations.push('تم العثور على مشاكل أمنية - راجع الكود يدوياً');
    }
    
    if (typeBreakdown.dependency > 5) {
      recommendations.push('مشاكل تبعيات كثيرة - فكر في تحديث package.json');
    }
    
    return recommendations;
  }

  // واجهات عامة للاستخدام
  async pauseSession(): Promise<void> {
    if (this.currentSession) {
      this.currentSession.status = 'paused';
      console.log('⏸️ [Deep Fix] تم إيقاف الجلسة مؤقتاً');
    }
  }

  async resumeSession(): Promise<void> {
    if (this.currentSession?.status === 'paused') {
      this.currentSession.status = 'running';
      console.log('▶️ [Deep Fix] تم استئناف الجلسة');
      await this.executeTasks();
    }
  }

  getSessionStatus(): FixSession | null {
    return this.currentSession;
  }

  // إصلاح سريع لملف واحد
  async quickFixFile(filePath: string): Promise<TaskResult[]> {
    console.log(`🔧 [Deep Fix] إصلاح سريع: ${filePath}`);
    
    const scanResults = await this.scanner.scanProject(filePath);
    const tasks = this.createTasksFromScanResults(scanResults);
    
    const results: TaskResult[] = [];
    
    for (const task of tasks) {
      eventBus.assignTask(task);
      
      // انتظار النتيجة
      await new Promise<void>((resolve) => {
        const handler = (result: TaskResult) => {
          if (result.taskId === task.id) {
            results.push(result);
            eventBus.off('task:completed', handler);
            resolve();
          }
        };
        eventBus.on('task:completed', handler);
      });
    }
    
    return results;
  }

  // إحصائيات سريعة
  async getProjectHealth(): Promise<{
    totalFiles: number;
    totalIssues: number;
    criticalIssues: number;
    fixableIssues: number;
    healthScore: number;
  }> {
    const scanResults = await this.scanner.scanProject(this.config.projectPath);
    
    const totalFiles = scanResults.length;
    const totalIssues = scanResults.reduce((sum, r) => sum + r.issues.length, 0);
    const criticalIssues = scanResults.filter(r => r.severity === 'critical').length;
    const fixableIssues = scanResults.filter(r => r.fixable).length;
    
    const healthScore = Math.max(0, 100 - (totalIssues / totalFiles) * 10);
    
    return {
      totalFiles,
      totalIssues,
      criticalIssues,
      fixableIssues,
      healthScore: Math.round(healthScore)
    };
  }
}