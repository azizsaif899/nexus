/**
 * وكيل تنسيق التغييرات بين المساعدين
 * ChangeSyncAgent - Coordinates changes between AI assistants
 */
defineModule('System.Core.ChangeSyncAgent', ({ Utils, Config }) => {

  const ASSISTANTS = {
    COPILOT: 'copilot',
    GEMINI: 'gemini',
    HUMAN: 'human'
  };

  const CHANGE_TYPES = {
    UI: 'ui',
    AI: 'ai',
    CONFIG: 'config',
    CRITICAL: 'critical'
  };

  return {
    /**
     * تسجيل تغيير جديد
     */
    registerChange(assistant, changeType, files, description) {
      const change = {
        id: Utils.generateId(),
        assistant,
        changeType,
        files,
        description,
        timestamp: new Date().toISOString(),
        status: 'pending'
      };

      this.saveChange(change);
      this.notifyOtherAssistants(change);

      return change.id;
    },

    /**
     * إشعار المساعدين الآخرين
     */
    notifyOtherAssistants(change) {
      const otherAssistants = Object.values(ASSISTANTS)
        .filter(a => a !== change.assistant);

      otherAssistants.forEach(assistant => {
        this.sendNotification(assistant, change);
      });
    },

    /**
     * إرسال إشعار لمساعد محدد
     */
    sendNotification(assistant, change) {
      const notification = {
        to: assistant,
        type: 'change_notification',
        change: change,
        action: this.getRecommendedAction(assistant, change)
      };

      // حفظ في قائمة الإشعارات
      this.saveNotification(notification);

      // إرسال webhook إذا كان متاح
      if (Config.get('WEBHOOK_ENABLED')) {
        this.sendWebhook(notification);
      }
    },

    /**
     * الحصول على الإجراء المقترح
     */
    getRecommendedAction(assistant, change) {
      const actions = {
        [ASSISTANTS.COPILOT]: {
          [CHANGE_TYPES.AI]: 'update_ui_components',
          [CHANGE_TYPES.CONFIG]: 'refresh_settings',
          [CHANGE_TYPES.CRITICAL]: 'pause_operations'
        },
        [ASSISTANTS.GEMINI]: {
          [CHANGE_TYPES.UI]: 'update_context',
          [CHANGE_TYPES.CONFIG]: 'reload_models',
          [CHANGE_TYPES.CRITICAL]: 'safe_shutdown'
        }
      };

      return actions[assistant]?.[change.changeType] || 'review_changes';
    },

    /**
     * رفع التغييرات إلى GitHub
     */
    async pushToGitHub(changes, assistant) {
      try {
        // تجميع التغييرات حسب النوع
        const groupedChanges = this.groupChangesByType(changes);

        // إنشاء commit message
        const commitMessage = this.generateCommitMessage(groupedChanges, assistant);

        // تنفيذ Git commands
        const result = await this.executeGitCommands(commitMessage);

        // تحديث حالة التغييرات
        changes.forEach(change => {
          this.updateChangeStatus(change.id, 'pushed');
        });

        return result;

      } catch (error) {
        Logger.error('خطأ في رفع التغييرات:', error);
        throw error;
      }
    },

    /**
     * تجميع التغييرات حسب النوع
     */
    groupChangesByType(changes) {
      return changes.reduce((groups, change) => {
        if (!groups[change.changeType]) {
          groups[change.changeType] = [];
        }
        groups[change.changeType].push(change);
        return groups;
      }, {});
    },

    /**
     * توليد رسالة commit
     */
    generateCommitMessage(groupedChanges, assistant) {
      const emoji = {
        [CHANGE_TYPES.UI]: '🎨',
        [CHANGE_TYPES.AI]: '🤖',
        [CHANGE_TYPES.CONFIG]: '⚙️',
        [CHANGE_TYPES.CRITICAL]: '🚨'
      };

      let message = `${emoji[Object.keys(groupedChanges)[0]] || '🔧'} ${assistant.toUpperCase()}: `;

      const descriptions = Object.values(groupedChanges)
        .flat()
        .map(change => change.description)
        .slice(0, 3);

      message += descriptions.join(' + ');

      return message;
    },

    /**
     * تنفيذ أوامر Git
     */
    async executeGitCommands(commitMessage) {
      const commands = [
        'git add .',
        `git commit -m "${commitMessage}"`,
        'git push origin master'
      ];

      const results = [];
      for (const command of commands) {
        const result = await Utils.executeCommand(command);
        results.push(result);
      }

      return results;
    },

    /**
     * فحص التضارب
     */
    checkConflicts(newChange) {
      const recentChanges = this.getRecentChanges(5); // آخر 5 تغييرات

      const conflicts = recentChanges.filter(change => {
        return this.hasFileOverlap(newChange.files, change.files) &&
               change.status === 'pending';
      });

      return conflicts;
    },

    /**
     * فحص تداخل الملفات
     */
    hasFileOverlap(files1, files2) {
      return files1.some(file => files2.includes(file));
    },

    /**
     * حفظ التغيير
     */
    saveChange(change) {
      const changes = this.getStoredChanges();
      changes.push(change);
      PropertiesService.getScriptProperties()
        .setProperty('SYNC_CHANGES', JSON.stringify(changes));
    },

    /**
     * الحصول على التغييرات المحفوظة
     */
    getStoredChanges() {
      const stored = PropertiesService.getScriptProperties()
        .getProperty('SYNC_CHANGES');
      return stored ? JSON.parse(stored) : [];
    },

    /**
     * الحصول على التغييرات الحديثة
     */
    getRecentChanges(limit = 10) {
      return this.getStoredChanges()
        .sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp))
        .slice(0, limit);
    },

    /**
     * تحديث حالة التغيير
     */
    updateChangeStatus(changeId, status) {
      const changes = this.getStoredChanges();
      const change = changes.find(c => c.id === changeId);
      if (change) {
        change.status = status;
        change.updatedAt = new Date().toISOString();
        PropertiesService.getScriptProperties()
          .setProperty('SYNC_CHANGES', JSON.stringify(changes));
      }
    },

    /**
     * حفظ الإشعار
     */
    saveNotification(notification) {
      const notifications = this.getStoredNotifications();
      notifications.push(notification);
      PropertiesService.getScriptProperties()
        .setProperty('SYNC_NOTIFICATIONS', JSON.stringify(notifications));
    },

    /**
     * الحصول على الإشعارات
     */
    getStoredNotifications() {
      const stored = PropertiesService.getScriptProperties()
        .getProperty('SYNC_NOTIFICATIONS');
      return stored ? JSON.parse(stored) : [];
    },

    /**
     * إرسال webhook
     */
    async sendWebhook(notification) {
      const webhookUrl = Config.get('SYNC_WEBHOOK_URL');
      if (!webhookUrl) return;

      try {
        await UrlFetchApp.fetch(webhookUrl, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          payload: JSON.stringify(notification)
        });
      } catch (error) {
        Logger.error('خطأ في إرسال webhook:', error);
      }
    }
  };
});
