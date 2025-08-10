import { TaskRequest, TaskResult, SystemHealth } from './core/types';
import { ConfigManager } from './core/config';
import * as fs from 'fs';
import * as path from 'path';

export class EnhancedOrchestrator {
  private static instance: EnhancedOrchestrator;
  private config = ConfigManager.getInstance().getConfig();
  private isRunning = false;
  private tasks: TaskRequest[] = [];
  private completedTasks: TaskResult[] = [];

  private constructor() {}

  static getInstance(): EnhancedOrchestrator {
    if (!EnhancedOrchestrator.instance) {
      EnhancedOrchestrator.instance = new EnhancedOrchestrator();
    }
    return EnhancedOrchestrator.instance;
  }

  async runCycle(): Promise<void> {
    if (this.isRunning) return;
    
    this.isRunning = true;
    console.log('🚀 بدء دورة الإصلاح الذكي');
    
    try {
      // 1. قراءة المهام المعلقة من central_dashboard
      const pendingTasks = await this.loadPendingTasks();
      
      // 2. مسح الملفات لأخطاء جديدة
      const files = await this.scanFiles();
      const errors = await this.detectErrors(files);
      const newTasks = this.createTasks(errors);
      
      // 3. دمج المهام (معلقة + جديدة)
      const allTasks = [...pendingTasks, ...newTasks];
      
      // 4. إرسال جميع المهام للمنفذ
      for (const task of allTasks) {
        await this.dispatchTask(task);
      }
      
      // 5. تحديث التقارير
      await this.updateReports();
      
      console.log(`✅ اكتملت الدورة - تم معالجة ${allTasks.length} مهام (${pendingTasks.length} معلقة + ${newTasks.length} جديدة)`);
      
    } catch (error) {
      console.error('❌ فشلت دورة الإصلاح:', error);
    } finally {
      this.isRunning = false;
    }
  }

  // دالة جديدة لقراءة المهام المعلقة
  private async loadPendingTasks(): Promise<TaskRequest[]> {
    try {
      const dashboardPath = this.config.paths.dashboardPath;
      if (!fs.existsSync(dashboardPath)) return [];
      
      const dashboard = JSON.parse(fs.readFileSync(dashboardPath, 'utf-8'));
      const pendingTasks = dashboard.tasksDetails?.filter((task: any) => 
        task.status === 'pending' && task.assignee === 'Amazon AI'
      ) || [];
      
      console.log(`📋 تم استلام ${pendingTasks.length} مهمة معلقة من central_dashboard`);
      
      return pendingTasks.map((task: any) => ({
        id: task.id,
        type: 'fix' as const,
        priority: task.priority as any,
        file: task.files_to_modify?.[0] || 'unknown',
        description: task.title,
        assignedTo: 'executor' as const,
        status: 'pending' as const,
        createdAt: task.created_at || new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        metadata: { 
          originalTask: task,
          acceptanceCriteria: task.acceptance_criteria
        }
      }));
      
    } catch (error) {
      console.warn('تعذر قراءة المهام المعلقة:', error);
      return [];
    }
  }

  // دالة قديمة محفوظة للتوافق
  private async processDailyPlan(): Promise<TaskRequest[]> {
    console.log('[Orchestrator] 📖 Reading daily plan from DAILY_BOOT.md...');
    const dailyBootPath = path.join(this.config.paths.repoRoot, 'docs', '6_fixing', 'DAILY_BOOT.md');
    const tasks: TaskRequest[] = [];

    try {
      const content = fs.readFileSync(dailyBootPath, 'utf-8');
      conimport * as fs from 'fs';
import * as path from 'path';

// ✅ أنواع البيانات الأساسية
interface TaskRequest {
  id: string;
  type: 'fix' | 'review' | 'test' | 'deploy';
  priority: 'low' | 'medium' | 'high' | 'critical';
  file: string;
  description: string;
  assignedTo: 'executor';
  status: 'pending' | 'in-progress' | 'completed' | 'failed';
  createdAt: string;
  updatedAt: string;
  metadata?: {
    geminiAnalysis?: string;
    backupPath?: string;
    errorType?: string;
    error?: any;
  };
}

interface TaskResult {
  taskId: string;
  success: boolean;
  message: string;
  changes: Array<{
    file: string;
    action: 'created' | 'modified' | 'deleted';
    linesChanged: number;
  }>;
  metrics: {
    executionTime: number;
    linesOfCode: number;
    complexity: number;
  };
  errors?: string[];
  confidenceScore?: number;
  requiresHumanReview?: boolean;
}

interface SystemHealth {
  status: 'healthy' | 'warning' | 'critical';
  score: number;
  lastUpdate: string;
  metrics: {
    totalTasks: number;
    completedTasks: number;
    failedTasks: number;
    averageExecutionTime: number;
    errorRate: number;
    averageConfidence: number;
  };
}

interface OrchestratorConfig {
  paths: {
    repoRoot: string;
    dailyBootPath: string;
    dashboardPath: string;
    reportsDir: string;
  };
  scanning: {
    interval: number;
    maxConcurrentTasks: number;
  };
}

/**
 * 🎯 Enhanced Orchestrator v3.0
 * منسق ذكي متكامل مع النظام المحسن
 */
export class EnhancedOrchestrator {
  private static instance: EnhancedOrchestrator;
  private tasks: TaskRequest[] = [];
  private completedTasks: TaskResult[] = [];
  private isRunning = false;
  private config: OrchestratorConfig;

  private constructor() {
    this.config = {
      paths: {
        repoRoot: process.cwd(),
        dailyBootPath: path.join(process.cwd(), 'docs/6_fixing/reports/DAILY_BOOT.md'),
        dashboardPath: path.join(process.cwd(), 'docs/6_fixing/reports/central_dashboard.json'),
        reportsDir: path.join(process.cwd(), 'docs/6_fixing/reports')
      },
      scanning: {
        interval: 30000, // 30 ثانية
        maxConcurrentTasks: 3
      }
    };
  }

  static getInstance(): EnhancedOrchestrator {
    if (!EnhancedOrchestrator.instance) {
      EnhancedOrchestrator.instance = new EnhancedOrchestrator();
    }
    return EnhancedOrchestrator.instance;
  }

  async start(): Promise<void> {
    if (this.isRunning) {
      console.log('[Orchestrator] ⚠️ النظام يعمل بالفعل');
      return;
    }

    this.isRunning = true;
    console.log('[Orchestrator] 🚀 بدء تشغيل النظام المحسن...');

    // تهيئة EventBus
    await this.initializeEventBus();

    // بدء دورة المسح والتنفيذ
    this.startScanningCycle();

    console.log('[Orchestrator] ✅ النظام جاهز ويعمل');
  }

  private async initializeEventBus(): Promise<void> {
    try {
      const { eventBus } = await import('./core/events/eventBus');
      
      // الاستماع لإكمال المهام
      eventBus.on('task:completed', (result: TaskResult) => {
        console.log(`[Orchestrator] ✅ تم إكمال المهمة: ${result.taskId}`);
        this.completedTasks.push(result);
        this.updateReports();
      });

      // الاستماع لفشل المهام
      eventBus.on('task:failed', (result: TaskResult) => {
        console.log(`[Orchestrator] ❌ فشلت المهمة: ${result.taskId}`);
        this.completedTasks.push(result);
        this.updateReports();
      });

      console.log('[Orchestrator] 🔗 تم تهيئة EventBus');
    } catch (error) {
      console.error('[Orchestrator] ❌ فشل تهيئة EventBus:', error);
    }
  }

  private startScanningCycle(): void {
    setInterval(async () => {
      try {
        await this.scanAndExecute();
      } catch (error) {
        console.error('[Orchestrator] ❌ خطأ في دورة المسح:', error);
      }
    }, this.config.scanning.interval);

    // تشغيل فوري
    this.scanAndExecute();
  }

  private async scanAndExecute(): Promise<void> {
    console.log('[Orchestrator] 🔍 بدء دورة مسح جديدة...');

    // 1. قراءة المهام من DAILY_BOOT.md
    const dailyTasks = await this.parseDailyBootTasks();
    
    // 2. مسح الملفات للأخطاء
    const files = await this.scanFiles();
    const errors = await this.detectErrors(files);
    const autoTasks = this.createTasks(errors);

    // 3. دمج المهام
    const allTasks = [...dailyTasks, ...autoTasks];
    
    // 4. إرسال المهام للتنفيذ
    for (const task of allTasks) {
      if (this.tasks.length < this.config.scanning.maxConcurrentTasks) {
        await this.dispatchTask(task);
      }
    }

    console.log(`[Orchestrator] 📋 تم العثور على ${allTasks.length} مهمة`);
  }

  private async parseDailyBootTasks(): Promise<TaskRequest[]> {
    const tasks: TaskRequest[] = [];
    
    try {
      const content = fs.readFileSync(this.config.paths.dailyBootPath, 'utf-8');
      
      // تحليل المهام باستخدام regex محسن
      const taskRegex = /\*\*المهمة:\s*`([^`]+)`\s*\(([^)]+)\)[^⭐]*\*\*[\s\S]*?\*\*الوصف:\*\*([^\r\n]+)[\s\S]*?\*\*المسؤول:\*\*\s*\*\*([^\*]+)\s*\(المنفذ\)\*\*/g;
      
      let match;
      while ((match = taskRegex.exec(content)) !== null) {
        const [_, id, priority, description, responsible] = match;

        if (responsible.trim().toLowerCase() === 'amazon') {
            const task: TaskRequest = {
                id: id.trim(),
                type: 'fix',
                priority: priority.trim() as TaskRequest['priority'],
                file: 'N/A - See Gemini Report', // سيتم تحديد الملف من تقرير Gemini
                description: description.trim(),
                assignedTo: 'executor',
                status: 'pending',
                createdAt: new Date().toISOString(),
                updatedAt: new Date().toISOString(),
                metadata: {
                    geminiAnalysis: `docs/6_fixing/reports/gemini_review_${id.trim()}.json`
                }
            };
            tasks.push(task);
        }
      }
      console.log(`[Orchestrator] ✅ Found and parsed ${tasks.length} tasks for Amazon.`);
    } catch (error) {
        console.error('[Orchestrator] ❌ Failed to read or parse DAILY_BOOT.md', error);
    }
    return tasks;
  }

  private async scanFiles(): Promise<string[]> {
    const repoRoot = this.config.paths.repoRoot;
    const files: string[] = [];
    
    // مسح المجلدات الرئيسية
    const scanDirs = ['apps', 'packages', 'auto-repair/src'];
    
    for (const dir of scanDirs) {
      const fullPath = path.join(repoRoot, dir);
      if (fs.existsSync(fullPath)) {
        const dirFiles = this.scanDirectory(fullPath);
        files.push(...dirFiles);
      }
    }
    
    return files.filter(f => f.endsWith('.ts') || f.endsWith('.js'));
  }

  private scanDirectory(dirPath: string): string[] {
    const files: string[] = [];
    
    try {
      const entries = fs.readdirSync(dirPath, { withFileTypes: true });
      
      for (const entry of entries) {
        const fullPath = path.join(dirPath, entry.name);
        
        if (entry.isFile()) {
          files.push(fullPath);
        } else if (entry.isDirectory() && !this.isIgnoredDir(entry.name)) {
          files.push(...this.scanDirectory(fullPath));
        }
      }
    } catch (error) {
      console.warn(`تعذر مسح المجلد: ${dirPath}`);
    }
    
    return files;
  }

  private isIgnoredDir(dirName: string): boolean {
    const ignored = ['node_modules', '.nx', 'dist', 'build', '.git'];
    return ignored.includes(dirName);
  }

  private async detectErrors(files: string[]): Promise<any[]> {
    const errors: any[] = [];
    
    for (const file of files) {
      try {
        const content = fs.readFileSync(file, 'utf-8');
        
        // تحديث hash الملف بعد القراءة
        const { SafetyChecks } = await import('./core/utils/safetyChecks');
        SafetyChecks.updateFileHash(file);
        
        // فحص بسيط للأخطاء الشائعة
        const lines = content.split('\n');
        lines.forEach((line, index) => {
          if (line.includes('console.log') && !line.includes('// TODO')) {
            errors.push({
              file,
              line: index + 1,
              message: 'Console.log statement found',
              severity: 'warning',
              fixable: true,
              errorType: 'syntax'
            });
          }
          
          if (line.includes('TODO') || line.includes('FIXME')) {
            errors.push({
              file,
              line: index + 1,
              message: 'TODO/FIXME comment found',
              severity: 'info',
              fixable: false,
              errorType: 'logic'
            });
          }
        });
        
      } catch (error) {
        console.warn(`تعذر تحليل الملف: ${file}`);
      }
    }
    
    return errors;
  }

  private createTasks(errors: any[]): TaskRequest[] {
    return errors.map(error => ({
      id: `TASK-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
      type: 'fix' as const,
      priority: error.severity === 'error' ? 'high' as const : 'medium' as const,
      file: error.file,
      description: error.message,
      assignedTo: 'executor' as const,
      status: 'pending' as const,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      metadata: { 
        error,
        errorType: error.errorType || 'unknown'
      }
    }));
  }

  // ✅ دالة محسنة لإرسال المهام عبر EventBus
  private async dispatchTask(task: TaskRequest): Promise<void> {
    try {
      const { eventBus } = await import('./core/events/eventBus');
      console.log(`[Orchestrator] إرسال مهمة ${task.id} للمنفذ`);
      eventBus.assignTask(task);
      
      // إضافة المهمة لقائمة المهام النشطة
      this.tasks.push(task);
    } catch (error) {
        console.error(`[Orchestrator] فشل إرسال المهمة ${task.id}`, error);
    }
  }


  private async executeTask(task: TaskRequest): Promise<void> {
    console.log(`🔧 تنفيذ المهمة: ${task.id}`);
    
    try {
      // فحص الأمان قبل التنفيذ
      const { SafetyChecks } = await import('./core/utils/safetyChecks');
      const { RollbackManager } = await import('./core/utils/rollbackManager');
      
      const safeToExecute = await SafetyChecks.preExecutionCheck(task.file);
      if (!safeToExecute) {
        throw new Error('Pre-execution check failed');
      }
      
      // إنشاء نسخة احتياطية
      const backupPath = await RollbackManager.createBackup(task.file);
      
      // محاكاة تنفيذ المهمة
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // حساب مؤشر الثقة
      const confidenceScore = SafetyChecks.calculateConfidenceScore(
        task.metadata?.errorType || 'unknown',
        'simple',
        1
      );
      
      const result: TaskResult = {
        taskId: task.id,
        success: true,
        message: 'تم تنفيذ المهمة بنجاح',
        changes: [{
          file: task.file,
          action: 'modified',
          linesChanged: 1
        }],
        metrics: {
          executionTime: 1000,
          linesOfCode: 100,
          complexity: 5
        },
        confidenceScore,
        requiresHumanReview: SafetyChecks.requiresHumanReview(confidenceScore, 1)
      };
      
      this.completedTasks.push(result);
      
      // تنظيف النسخة الاحتياطية عند النجاح
      RollbackManager.cleanupBackup(task.file);
      
    } catch (error) {
      // التراجع التلقائي عند الفشل
      const { RollbackManager } = await import('./core/utils/rollbackManager');
      await RollbackManager.rollbackOnFailure(task.file, (error as Error).message);
      
      const failedResult: TaskResult = {
        taskId: task.id,
        success: false,
        message: `فشل تنفيذ المهمة: ${(error as Error).message}`,
        changes: [],
        metrics: {
          executionTime: 1000,
          linesOfCode: 0,
          complexity: 0
        },
        errors: [(error as Error).message],
        confidenceScore: 0,
        requiresHumanReview: true
      };
      
      this.completedTasks.push(failedResult);
    }
  }

  private async updateReports(): Promise<void> {
    const dashboardPath = this.config.paths.dashboardPath;
    
    const dashboard = {
      lastUpdate: new Date().toISOString(),
      totalTasks: this.tasks.length + this.completedTasks.length,
      completedTasks: this.completedTasks.length,
      healthScore: this.calculateHealthScore(),
      status: this.getSystemStatus()
    };
    
    try {
      fs.writeFileSync(dashboardPath, JSON.stringify(dashboard, null, 2));
      console.log('📊 تم تحديث التقارير');
    } catch (error) {
      console.warn('تعذر تحديث التقارير:', error);
    }
  }

  private calculateHealthScore(): number {
    const total = this.tasks.length + this.completedTasks.length;
    if (total === 0) return 100;
    
    const completed = this.completedTasks.length;
    return Math.round((completed / total) * 100);
  }

  private getSystemStatus(): string {
    const score = this.calculateHealthScore();
    if (score >= 90) return 'healthy';
    if (score >= 70) return 'warning';
    return 'critical';
  }

  getSystemHealth(): SystemHealth {
    const failedTasks = this.completedTasks.filter(t => !t.success).length;
    const avgConfidence = this.completedTasks.length > 0 
      ? this.completedTasks.reduce((sum, t) => sum + (t.confidenceScore || 0), 0) / this.completedTasks.length
      : 0;
    
    return {
      status: this.getSystemStatus() as any,
      score: this.calculateHealthScore(),
      lastUpdate: new Date().toISOString(),
      metrics: {
        totalTasks: this.tasks.length + this.completedTasks.length,
        completedTasks: this.completedTasks.filter(t => t.success).length,
        failedTasks,
        averageExecutionTime: 1000,
        errorRate: failedTasks / Math.max(this.completedTasks.length, 1),
        averageConfidence: Math.round(avgConfidence)
      }
    };
  }
}