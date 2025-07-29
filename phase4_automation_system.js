/**
 * المرحلة الرابعة: نظام الأتمتة
 * Phase 4: Automation System
 * 
 * نظام أتمتة متقدم للمهام المجدولة والمشغلات الذكية
 */

// 1. نظام المهام المجدولة
defineModule('System.TaskScheduler', function(injector) {
  const logging = injector.get('System.ExtendedLogging');
  const crud = injector.get('System.SheetsCRUD');

  return {
    scheduledTasks: [],

    scheduleTask(taskName, agentType, params, schedule) {
      logging.info('TaskScheduler', `Scheduling task: ${taskName}`);
      
      const task = {
        id: Date.now(),
        name: taskName,
        agentType: agentType,
        params: params,
        schedule: schedule,
        lastRun: null,
        nextRun: this.calculateNextRun(schedule),
        status: 'active'
      };

      this.scheduledTasks.push(task);
      this.saveTasksToSheet();
      
      logging.info('TaskScheduler', `Task scheduled: ${taskName} - Next run: ${task.nextRun}`);
      return { success: true, taskId: task.id };
    },

    calculateNextRun(schedule) {
      const now = new Date();
      switch (schedule.type) {
        case 'daily':
          const tomorrow = new Date(now);
          tomorrow.setDate(tomorrow.getDate() + 1);
          tomorrow.setHours(schedule.hour || 9, schedule.minute || 0, 0, 0);
          return tomorrow;
        case 'weekly':
          const nextWeek = new Date(now);
          nextWeek.setDate(nextWeek.getDate() + 7);
          return nextWeek;
        case 'monthly':
          const nextMonth = new Date(now);
          nextMonth.setMonth(nextMonth.getMonth() + 1);
          return nextMonth;
        default:
          return new Date(now.getTime() + 3600000); // 1 hour default
      }
    },

    async runScheduledTasks() {
      logging.info('TaskScheduler', 'Checking scheduled tasks');
      
      const now = new Date();
      const tasksToRun = this.scheduledTasks.filter(task => 
        task.status === 'active' && task.nextRun <= now
      );

      for (const task of tasksToRun) {
        try {
          await this.executeTask(task);
          task.lastRun = now;
          task.nextRun = this.calculateNextRun(task.schedule);
          logging.info('TaskScheduler', `Task executed: ${task.name}`);
        } catch (error) {
          logging.error('TaskScheduler', `Task execution failed: ${task.name}`, error.message);
        }
      }

      if (tasksToRun.length > 0) {
        this.saveTasksToSheet();
      }

      return { executed: tasksToRun.length };
    },

    async executeTask(task) {
      const router = injector.get('System.AgentRouter');
      const routing = await router.routeRequest(task.params.request || 'execute task', task.agentType);
      
      if (routing.success) {
        return await routing.agent.processRequest(task.params.request, task.params);
      }
      throw new Error('Failed to route task to agent');
    },

    saveTasksToSheet() {
      try {
        const taskData = this.scheduledTasks.map(task => [
          task.id,
          task.name,
          task.agentType,
          JSON.stringify(task.params),
          task.schedule.type,
          task.lastRun ? task.lastRun.toISOString() : '',
          task.nextRun.toISOString(),
          task.status
        ]);

        crud.createSheet('Scheduled_Tasks', [
          'ID', 'Name', 'Agent', 'Params', 'Schedule', 'Last Run', 'Next Run', 'Status'
        ]);
        
        if (taskData.length > 0) {
          crud.writeData('Scheduled_Tasks', `A2:H${taskData.length + 1}`, taskData);
        }
      } catch (error) {
        logging.error('TaskScheduler', 'Failed to save tasks to sheet', error.message);
      }
    }
  };
});

// 2. نظام المشغلات الذكية
defineModule('System.SmartTriggers', function(injector) {
  const logging = injector.get('System.ExtendedLogging');

  return {
    triggers: [],

    addTrigger(name, condition, action) {
      logging.info('SmartTriggers', `Adding trigger: ${name}`);
      
      const trigger = {
        id: Date.now(),
        name: name,
        condition: condition,
        action: action,
        active: true,
        lastTriggered: null
      };

      this.triggers.push(trigger);
      
      logging.info('SmartTriggers', `Trigger added: ${name}`);
      return { success: true, triggerId: trigger.id };
    },

    async checkTriggers(eventData) {
      logging.debug('SmartTriggers', 'Checking triggers for event', JSON.stringify(eventData));
      
      const triggeredActions = [];

      for (const trigger of this.triggers) {
        if (!trigger.active) continue;

        try {
          if (this.evaluateCondition(trigger.condition, eventData)) {
            await this.executeAction(trigger.action, eventData);
            trigger.lastTriggered = new Date();
            triggeredActions.push(trigger.name);
            
            logging.info('SmartTriggers', `Trigger executed: ${trigger.name}`);
          }
        } catch (error) {
          logging.error('SmartTriggers', `Trigger execution failed: ${trigger.name}`, error.message);
        }
      }

      return { triggered: triggeredActions };
    },

    evaluateCondition(condition, data) {
      try {
        switch (condition.type) {
          case 'value_change':
            return data.type === 'edit' && data.range === condition.range;
          case 'threshold':
            return data.value > condition.threshold;
          case 'time_based':
            const now = new Date();
            return now.getHours() === condition.hour;
          default:
            return false;
        }
      } catch (error) {
        logging.error('SmartTriggers', 'Condition evaluation failed', error.message);
        return false;
      }
    },

    async executeAction(action, data) {
      const router = injector.get('System.AgentRouter');
      
      switch (action.type) {
        case 'agent_call':
          const routing = await router.routeRequest(action.request, action.agentType);
          if (routing.success) {
            return await routing.agent.processRequest(action.request, data);
          }
          break;
        case 'notification':
          return this.sendNotification(action.message, data);
        case 'report':
          return this.generateReport(action.reportType, data);
        default:
          throw new Error(`Unknown action type: ${action.type}`);
      }
    },

    sendNotification(message, data) {
      logging.info('SmartTriggers', `Notification: ${message}`);
      // يمكن إضافة إرسال بريد إلكتروني هنا
      return { success: true, message: message };
    },

    generateReport(reportType, data) {
      logging.info('SmartTriggers', `Generating report: ${reportType}`);
      // يمكن إضافة توليد تقرير هنا
      return { success: true, reportType: reportType };
    }
  };
});

// 3. نظام الإشعارات التلقائية
defineModule('System.AutoNotifications', function(injector) {
  const logging = injector.get('System.ExtendedLogging');
  const crud = injector.get('System.SheetsCRUD');

  return {
    notifications: [],

    addNotificationRule(name, condition, message, recipients) {
      logging.info('AutoNotifications', `Adding notification rule: ${name}`);
      
      const rule = {
        id: Date.now(),
        name: name,
        condition: condition,
        message: message,
        recipients: recipients,
        active: true,
        lastSent: null
      };

      this.notifications.push(rule);
      
      logging.info('AutoNotifications', `Notification rule added: ${name}`);
      return { success: true, ruleId: rule.id };
    },

    async checkNotifications(eventData) {
      logging.debug('AutoNotifications', 'Checking notification rules');
      
      const sentNotifications = [];

      for (const rule of this.notifications) {
        if (!rule.active) continue;

        try {
          if (this.shouldNotify(rule.condition, eventData)) {
            await this.sendNotification(rule);
            rule.lastSent = new Date();
            sentNotifications.push(rule.name);
            
            logging.info('AutoNotifications', `Notification sent: ${rule.name}`);
          }
        } catch (error) {
          logging.error('AutoNotifications', `Notification failed: ${rule.name}`, error.message);
        }
      }

      return { sent: sentNotifications };
    },

    shouldNotify(condition, data) {
      // تحديد ما إذا كان يجب إرسال الإشعار
      switch (condition.type) {
        case 'error':
          return data.type === 'error';
        case 'completion':
          return data.type === 'task_completed';
        case 'threshold':
          return data.value && data.value > condition.value;
        default:
          return false;
      }
    },

    async sendNotification(rule) {
      // حفظ الإشعار في ورقة
      const notificationData = [[
        new Date().toISOString(),
        rule.name,
        rule.message,
        rule.recipients.join(', '),
        'sent'
      ]];

      try {
        crud.createSheet('Notifications_Log', [
          'Timestamp', 'Rule', 'Message', 'Recipients', 'Status'
        ]);
        
        const sheet = SpreadsheetApp.getActiveSpreadsheet().getSheetByName('Notifications_Log');
        const lastRow = sheet.getLastRow();
        crud.writeData('Notifications_Log', `A${lastRow + 1}:E${lastRow + 1}`, notificationData);
        
        return { success: true };
      } catch (error) {
        logging.error('AutoNotifications', 'Failed to log notification', error.message);
        return { success: false, error: error.message };
      }
    }
  };
});

// 4. محرك التقارير الدورية
defineModule('System.PeriodicReports', function(injector) {
  const logging = injector.get('System.ExtendedLogging');
  const crud = injector.get('System.SheetsCRUD');

  return {
    reports: [],

    scheduleReport(name, agentType, sheetName, frequency, recipients) {
      logging.info('PeriodicReports', `Scheduling report: ${name}`);
      
      const report = {
        id: Date.now(),
        name: name,
        agentType: agentType,
        sheetName: sheetName,
        frequency: frequency, // daily, weekly, monthly
        recipients: recipients,
        lastGenerated: null,
        nextGeneration: this.calculateNextGeneration(frequency),
        active: true
      };

      this.reports.push(report);
      
      logging.info('PeriodicReports', `Report scheduled: ${name}`);
      return { success: true, reportId: report.id };
    },

    calculateNextGeneration(frequency) {
      const now = new Date();
      switch (frequency) {
        case 'daily':
          return new Date(now.getTime() + 24 * 60 * 60 * 1000);
        case 'weekly':
          return new Date(now.getTime() + 7 * 24 * 60 * 60 * 1000);
        case 'monthly':
          const nextMonth = new Date(now);
          nextMonth.setMonth(nextMonth.getMonth() + 1);
          return nextMonth;
        default:
          return new Date(now.getTime() + 24 * 60 * 60 * 1000);
      }
    },

    async generateScheduledReports() {
      logging.info('PeriodicReports', 'Checking scheduled reports');
      
      const now = new Date();
      const reportsToGenerate = this.reports.filter(report => 
        report.active && report.nextGeneration <= now
      );

      const generatedReports = [];

      for (const report of reportsToGenerate) {
        try {
          const result = await this.generateReport(report);
          report.lastGenerated = now;
          report.nextGeneration = this.calculateNextGeneration(report.frequency);
          generatedReports.push(report.name);
          
          logging.info('PeriodicReports', `Report generated: ${report.name}`);
        } catch (error) {
          logging.error('PeriodicReports', `Report generation failed: ${report.name}`, error.message);
        }
      }

      return { generated: generatedReports };
    },

    async generateReport(report) {
      const router = injector.get('System.AgentRouter');
      const routing = await router.routeRequest(`generate report for ${report.sheetName}`, report.agentType);
      
      if (!routing.success) throw new Error('Failed to route report request');

      // توليد التقرير حسب نوع الوكيل
      let result;
      if (report.agentType === 'cfo') {
        result = await routing.agent.generateReport(report.sheetName, 'periodic');
      } else if (report.agentType === 'analyst') {
        result = await routing.agent.createVisualization(report.sheetName, 'periodic');
      } else {
        result = await routing.agent.processRequest(`generate report for ${report.sheetName}`);
      }

      // حفظ معلومات التقرير
      const reportData = [[
        new Date().toISOString(),
        report.name,
        report.agentType,
        report.sheetName,
        result.success ? 'generated' : 'failed',
        result.success ? (result.reportSheet || result.vizSheet || 'completed') : result.error
      ]];

      crud.createSheet('Reports_Log', [
        'Timestamp', 'Report Name', 'Agent Type', 'Source Sheet', 'Status', 'Output'
      ]);
      
      const sheet = SpreadsheetApp.getActiveSpreadsheet().getSheetByName('Reports_Log');
      const lastRow = sheet.getLastRow();
      crud.writeData('Reports_Log', `A${lastRow + 1}:F${lastRow + 1}`, reportData);

      return result;
    }
  };
});

// 5. نظام التحكم الرئيسي للأتمتة
defineModule('System.AutomationController', function(injector) {
  const scheduler = injector.get('System.TaskScheduler');
  const triggers = injector.get('System.SmartTriggers');
  const notifications = injector.get('System.AutoNotifications');
  const reports = injector.get('System.PeriodicReports');
  const logging = injector.get('System.ExtendedLogging');

  return {
    async runAutomationCycle() {
      logging.info('AutomationController', 'Starting automation cycle');
      
      const results = {
        timestamp: new Date().toISOString(),
        scheduledTasks: await scheduler.runScheduledTasks(),
        periodicReports: await reports.generateScheduledReports(),
        errors: []
      };

      logging.info('AutomationController', 'Automation cycle completed', JSON.stringify(results));
      return results;
    },

    handleEvent(eventType, eventData) {
      logging.debug('AutomationController', `Handling event: ${eventType}`);
      
      // تشغيل المشغلات
      triggers.checkTriggers({ type: eventType, ...eventData });
      
      // فحص الإشعارات
      notifications.checkNotifications({ type: eventType, ...eventData });
    },

    getAutomationStatus() {
      return {
        scheduledTasks: scheduler.scheduledTasks.length,
        activeTriggers: triggers.triggers.filter(t => t.active).length,
        notificationRules: notifications.notifications.filter(n => n.active).length,
        scheduledReports: reports.reports.filter(r => r.active).length
      };
    }
  };
});

// دوال مساعدة للاستخدام المباشر
function scheduleTask(taskName, agentType, params, schedule) {
  const scheduler = GAssistant.Utils.Injector.get('System.TaskScheduler');
  return scheduler.scheduleTask(taskName, agentType, params, schedule);
}

function addTrigger(name, condition, action) {
  const triggers = GAssistant.Utils.Injector.get('System.SmartTriggers');
  return triggers.addTrigger(name, condition, action);
}

function scheduleReport(name, agentType, sheetName, frequency, recipients = []) {
  const reports = GAssistant.Utils.Injector.get('System.PeriodicReports');
  return reports.scheduleReport(name, agentType, sheetName, frequency, recipients);
}

function runAutomation() {
  const controller = GAssistant.Utils.Injector.get('System.AutomationController');
  return controller.runAutomationCycle();
}

Logger.log('⚙️ Phase 4: Automation System loaded successfully');