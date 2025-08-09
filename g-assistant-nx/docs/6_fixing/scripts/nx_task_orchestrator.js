#!/usr/bin/env node

/**
 * منسق المهام لمشروع G-Assistant NX
 * يدير المهام والإصلاحات التلقائية
 */

const fs = require('fs');
const path = require('path');
const NxAutoFixer = require('./nx_auto_fix');
const NxProjectMonitor = require('./nx_project_monitor');

class NxTaskOrchestrator {
  constructor() {
    this.projectRoot = path.resolve(__dirname, '../../../');
    this.reportsDir = path.join(__dirname, '../reports');
    this.dashboardFile = path.join(this.reportsDir, 'nx_central_dashboard.json');
  }

  // تحديث اللوحة المركزية
  updateCentralDashboard() {
    console.log('📊 تحديث اللوحة المركزية...');
    
    const dashboard = {
      lastUpdate: new Date().toISOString(),
      project: 'g-assistant-nx',
      status: 'ACTIVE',
      tasks: {
        pending: [],
        inProgress: [],
        completed: [],
        failed: []
      },
      metrics: {
        totalTasks: 0,
        completionRate: 0,
        lastHealthCheck: null,
        systemHealth: 'UNKNOWN'
      }
    };

    // إضافة مهام افتراضية
    dashboard.tasks.pending = [
      {
        id: 'HEALTH_CHECK',
        title: 'فحص صحة النظام',
        priority: 'HIGH',
        assignedTo: 'NxAutoFixer',
        createdAt: new Date().toISOString()
      },
      {
        id: 'MONITOR_APPS',
        title: 'مراقبة التطبيقات',
        priority: 'MEDIUM',
        assignedTo: 'NxProjectMonitor',
        createdAt: new Date().toISOString()
      }
    ];

    dashboard.metrics.totalTasks = dashboard.tasks.pending.length;

    fs.writeFileSync(this.dashboardFile, JSON.stringify(dashboard, null, 2));
    console.log('✅ تم تحديث اللوحة المركزية');
    
    return dashboard;
  }

  // تنفيذ مهمة
  async executeTask(taskId) {
    console.log(`🔄 تنفيذ المهمة: ${taskId}`);
    
    const dashboard = JSON.parse(fs.readFileSync(this.dashboardFile, 'utf8'));
    const task = dashboard.tasks.pending.find(t => t.id === taskId);
    
    if (!task) {
      console.log(`❌ المهمة غير موجودة: ${taskId}`);
      return false;
    }

    // نقل المهمة إلى قيد التنفيذ
    dashboard.tasks.pending = dashboard.tasks.pending.filter(t => t.id !== taskId);
    task.startedAt = new Date().toISOString();
    dashboard.tasks.inProgress.push(task);
    
    fs.writeFileSync(this.dashboardFile, JSON.stringify(dashboard, null, 2));

    try {
      let result = false;
      
      switch (taskId) {
        case 'HEALTH_CHECK':
          const fixer = new NxAutoFixer();
          await fixer.runFullCheck();
          result = true;
          break;
          
        case 'MONITOR_APPS':
          const monitor = new NxProjectMonitor();
          monitor.run();
          result = true;
          break;
          
        default:
          console.log(`❌ مهمة غير معروفة: ${taskId}`);
          result = false;
      }

      // تحديث حالة المهمة
      const updatedDashboard = JSON.parse(fs.readFileSync(this.dashboardFile, 'utf8'));
      const inProgressTask = updatedDashboard.tasks.inProgress.find(t => t.id === taskId);
      
      if (inProgressTask) {
        updatedDashboard.tasks.inProgress = updatedDashboard.tasks.inProgress.filter(t => t.id !== taskId);
        inProgressTask.completedAt = new Date().toISOString();
        inProgressTask.status = result ? 'SUCCESS' : 'FAILED';
        
        if (result) {
          updatedDashboard.tasks.completed.push(inProgressTask);
        } else {
          updatedDashboard.tasks.failed.push(inProgressTask);
        }
        
        fs.writeFileSync(this.dashboardFile, JSON.stringify(updatedDashboard, null, 2));
      }

      return result;
    } catch (error) {
      console.log(`❌ خطأ في تنفيذ المهمة ${taskId}: ${error.message}`);
      return false;
    }
  }

  // تشغيل جميع المهام المعلقة
  async runAllPendingTasks() {
    console.log('🚀 تشغيل جميع المهام المعلقة...');
    
    const dashboard = JSON.parse(fs.readFileSync(this.dashboardFile, 'utf8'));
    const pendingTasks = [...dashboard.tasks.pending];
    
    for (const task of pendingTasks) {
      await this.executeTask(task.id);
    }
    
    console.log('✅ تم تنفيذ جميع المهام');
  }

  // تشغيل المنسق
  async run() {
    console.log('🎯 بدء تشغيل منسق المهام...');
    
    // إنشاء مجلد التقارير
    if (!fs.existsSync(this.reportsDir)) {
      fs.mkdirSync(this.reportsDir, { recursive: true });
    }
    
    // تحديث اللوحة المركزية
    this.updateCentralDashboard();
    
    // تنفيذ المهام
    await this.runAllPendingTasks();
    
    console.log('🎉 تم إكمال جميع المهام بنجاح!');
  }
}

// تشغيل المنسق
if (require.main === module) {
  const orchestrator = new NxTaskOrchestrator();
  orchestrator.run();
}

module.exports = NxTaskOrchestrator;