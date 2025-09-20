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
    // Removed console.log
    
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
    // Removed console.log
    
    return dashboard;
  }

  // تنفيذ مهمة
  async executeTask(taskId) {
    // Removed console.log
    
    const dashboard = JSON.parse(fs.readFileSync(this.dashboardFile, 'utf8'));
    const task = dashboard.tasks.pending.find(t => t.id === taskId);
    
    if (!task) {
      // Removed console.log
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
          // Removed console.log
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
      // Removed console.log
      return false;
    }
  }

  // تشغيل جميع المهام المعلقة
  async runAllPendingTasks() {
    // Removed console.log
    
    const dashboard = JSON.parse(fs.readFileSync(this.dashboardFile, 'utf8'));
    const pendingTasks = [...dashboard.tasks.pending];
    
    for (const task of pendingTasks) {
      await this.executeTask(task.id);
    }
    
    // Removed console.log
  }

  // تشغيل المنسق
  async run() {
    // Removed console.log
    
    // إنشاء مجلد التقارير
    if (!fs.existsSync(this.reportsDir)) {
      fs.mkdirSync(this.reportsDir, { recursive: true });
    }
    
    // تحديث اللوحة المركزية
    this.updateCentralDashboard();
    
    // تنفيذ المهام
    await this.runAllPendingTasks();
    
    // Removed console.log
  }
}

// تشغيل المنسق
if (require.main === module) {
  const orchestrator = new NxTaskOrchestrator();
  orchestrator.run();
}

module.exports = NxTaskOrchestrator;