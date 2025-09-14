import { DeepScanner, ScanResult } from './deep-scanner';
import { DeepFixOrchestrator, FixSession } from './deep-fix-orchestrator';
import { eventBus } from './core/events/eventBus';
import { TaskRequest, TaskResult } from './core/types';
import * as fs from 'fs';
import * as path from 'path';

export interface AutomationStatus {
  isRunning: boolean;
  completedTasks: number;
  totalTasks: number;
  errors: number;
  lastUpdate: string;
  currentDay: number;
  currentTask: string;
  deepScanEnabled: boolean;
  healthScore: number;
  criticalIssues: number;
}

export interface DailyBootTask {
  id: string;
  description: string;
  priority: 'critical' | 'high' | 'medium' | 'low';
  status: 'pending' | 'running' | 'completed' | 'failed';
  assignedTo: string;
  file?: string;
  metadata?: any;
}

export class EnhancedOrchestrator {
  private static instance: EnhancedOrchestrator;
  private deepScanner: DeepScanner;
  private deepFixOrchestrator: DeepFixOrchestrator;
  private currentSession: FixSession | null = null;
  private dailyTasks: DailyBootTask[] = [];
  private isRunning = false;
  
  private constructor() {
    this.deepScanner = new DeepScanner();
    this.deepFixOrchestrator = new DeepFixOrchestrator();
    this.setupEventListeners();
  }
  
  static getInstance(): EnhancedOrchestrator {
    if (!EnhancedOrchestrator.instance) {
      EnhancedOrchestrator.instance = new EnhancedOrchestrator();
    }
    return EnhancedOrchestrator.instance;
  }

  private setupEventListeners(): void {
    eventBus.on('task:completed', (result: TaskResult) => {
      console.log(`✅ [Enhanced Orchestrator] مهمة مكتملة: ${result.taskId}`);
    });

    eventBus.on('task:failed', (result: TaskResult) => {
      console.log(`❌ [Enhanced Orchestrator] مهمة فاشلة: ${result.taskId}`);
    });
  }
  
  async getStatus(): Promise<AutomationStatus> {
    const health = await this.deepFixOrchestrator.getProjectHealth();
    
    return {
      isRunning: this.isRunning,
      completedTasks: this.dailyTasks.filter(t => t.status === 'completed').length,
      totalTasks: this.dailyTasks.length,
      errors: this.dailyTasks.filter(t => t.status === 'failed').length,
      lastUpdate: new Date().toISOString(),
      currentDay: 127, // من DAILY_BOOT_127
      currentTask: this.getCurrentTask(),
      deepScanEnabled: true,
      healthScore: health.healthScore,
      criticalIssues: health.criticalIssues
    };
  }

  private getCurrentTask(): string {
    const runningTask = this.dailyTasks.find(t => t.status === 'running');
    if (runningTask) return runningTask.description;
    
    const pendingTask = this.dailyTasks.find(t => t.status === 'pending');
    if (pendingTask) return `التالي: ${pendingTask.description}`;
    
    return 'idle';
  }
  
  async start(): Promise<{ success: boolean; message: string }> {
    if (this.isRunning) {
      return { success: false, message: 'النظام يعمل بالفعل' };
    }

    try {
      this.isRunning = true;
      console.log('🚀 [Enhanced Orchestrator] بدء النظام المحسن...');
      
      // تحميل المهام اليومية
      await this.loadDailyTasks();
      
      // بدء Deep Scan
      console.log('🔍 [Enhanced Orchestrator] بدء Deep Scan...');
      this.currentSession = await this.deepFixOrchestrator.startDeepFix();
      
      return { success: true, message: 'تم بدء النظام المحسن بنجاح' };
    } catch (error) {
      this.isRunning = false;
      return { success: false, message: `فشل في بدء النظام: ${error}` };
    }
  }

  private async loadDailyTasks(): Promise<void> {
    try {
      const dailyBootPath = 'e:\\azizsys5\\g-assistant-nx\\docs\\6_fixing\\DAILY_BOOT_127_SECURITY_FIX.md';
      
      if (!fs.existsSync(dailyBootPath)) {
        console.log('⚠️ [Enhanced Orchestrator] ملف DAILY_BOOT غير موجود، إنشاء مهام افتراضية...');
        this.createDefaultTasks();
        return;
      }

      const content = fs.readFileSync(dailyBootPath, 'utf-8');
      this.dailyTasks = this.parseDailyBootTasks(content);
      
      console.log(`📋 [Enhanced Orchestrator] تم تحميل ${this.dailyTasks.length} مهمة`);
    } catch (error) {
      console.error('❌ [Enhanced Orchestrator] فشل تحميل المهام:', error);
      this.createDefaultTasks();
    }
  }

  private parseDailyBootTasks(content: string): DailyBootTask[] {
    const tasks: DailyBootTask[] = [];
    const lines = content.split('\n');
    
    let currentTask: Partial<DailyBootTask> = {};
    
    for (const line of lines) {
      // البحث عن مهام جديدة
      if (line.includes('**المهمة:**')) {
        if (currentTask.id) {
          tasks.push(currentTask as DailyBootTask);
        }
        
        const taskMatch = line.match(/`([^`]+)`/);
        if (taskMatch) {
          currentTask = {
            id: taskMatch[1],
            status: 'pending',
            assignedTo: 'executor'
          };
        }
      }
      
      // استخراج الوصف
      if (line.includes('**الوصف:**') && currentTask.id) {
        currentTask.description = line.replace('**الوصف:**', '').trim();
      }
      
      // استخراج الأولوية
      if (line.includes('Critical') && currentTask.id) {
        currentTask.priority = 'critical';
      } else if (line.includes('High') && currentTask.id) {
        currentTask.priority = 'high';
      } else if (line.includes('Medium') && currentTask.id) {
        currentTask.priority = 'medium';
      } else if (line.includes('Low') && currentTask.id) {
        currentTask.priority = 'low';
      }
      
      // استخراج الملفات
      if (line.includes('**الملفات:**') && currentTask.id) {
        const fileMatch = line.match(/`([^`]+)`/);
        if (fileMatch) {
          currentTask.file = fileMatch[1];
        }
      }
    }
    
    // إضافة المهمة الأخيرة
    if (currentTask.id) {
      tasks.push(currentTask as DailyBootTask);
    }
    
    return tasks;
  }

  private createDefaultTasks(): void {
    this.dailyTasks = [
      {
        id: 'TASK-SCAN-001',
        description: 'فحص شامل للمشروع',
        priority: 'high',
        status: 'pending',
        assignedTo: 'deep-scanner'
      },
      {
        id: 'TASK-SEC-001',
        description: 'إصلاح المشاكل الأمنية الحرجة',
        priority: 'critical',
        status: 'pending',
        assignedTo: 'executor'
      },
      {
        id: 'TASK-DEPS-001',
        description: 'إصلاح مشاكل التبعيات',
        priority: 'high',
        status: 'pending',
        assignedTo: 'executor'
      }
    ];
  }
  
  async stop(): Promise<{ success: boolean; message: string }> {
    try {
      this.isRunning = false;
      
      if (this.currentSession) {
        await this.deepFixOrchestrator.pauseSession();
      }
      
      return { success: true, message: 'تم إيقاف النظام بنجاح' };
    } catch (error) {
      return { success: false, message: `فشل في إيقاف النظام: ${error}` };
    }
  }
  
  async reset(): Promise<{ success: boolean; message: string }> {
    try {
      this.isRunning = false;
      this.currentSession = null;
      this.dailyTasks = [];
      
      return { success: true, message: 'تم إعادة تعيين النظام بنجاح' };
    } catch (error) {
      return { success: false, message: `فشل في إعادة التعيين: ${error}` };
    }
  }

  // واجهات جديدة لـ Deep Scan
  async runQuickScan(): Promise<ScanResult[]> {
    console.log('⚡ [Enhanced Orchestrator] تشغيل فحص سريع...');
    return await DeepScanner.quickScan('e:\\azizsys5\\g-assistant-nx');
  }

  async runFullScan(): Promise<ScanResult[]> {
    console.log('🔍 [Enhanced Orchestrator] تشغيل فحص شامل...');
    return await DeepScanner.fullScan('e:\\azizsys5\\g-assistant-nx');
  }

  async getProjectHealth(): Promise<any> {
    return await this.deepFixOrchestrator.getProjectHealth();
  }

  async executeNextTask(): Promise<TaskResult | null> {
    const nextTask = this.dailyTasks.find(t => t.status === 'pending');
    if (!nextTask) {
      console.log('📋 [Enhanced Orchestrator] لا توجد مهام معلقة');
      return null;
    }

    nextTask.status = 'running';
    console.log(`🔧 [Enhanced Orchestrator] تنفيذ المهمة: ${nextTask.description}`);

    const taskRequest: TaskRequest = {
      id: nextTask.id,
      type: 'fix',
      priority: nextTask.priority,
      file: nextTask.file || '',
      description: nextTask.description,
      assignedTo: nextTask.assignedTo,
      status: 'pending',
      metadata: nextTask.metadata
    };

    // إرسال المهمة للتنفيذ
    eventBus.assignTask(taskRequest);

    // انتظار النتيجة (محاكاة)
    return new Promise((resolve) => {
      const handler = (result: TaskResult) => {
        if (result.taskId === nextTask.id) {
          nextTask.status = result.success ? 'completed' : 'failed';
          eventBus.off('task:completed', handler);
          resolve(result);
        }
      };
      eventBus.on('task:completed', handler);
    });
  }

  getDailyTasks(): DailyBootTask[] {
    return this.dailyTasks;
  }

  getCurrentSession(): FixSession | null {
    return this.currentSession;
  }
}