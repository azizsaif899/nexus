/**
 * منسق المساعدين - Assistant Coordinator
 * يدير التنسيق والتعاون بين المساعدين المختلفين
 */
defineModule('System.Utils.AssistantCoordinator', ({ Utils, Config }) => {

  const assistantsConfig = JSON.parse(
    PropertiesService.getScriptProperties().getProperty('ASSISTANTS_CONFIG') || '{}'
  );

  return {
    /**
     * تحديد المساعد المسؤول عن ملف معين
     */
    getResponsibleAssistant(filePath) {
      for (const [assistantId, config] of Object.entries(assistantsConfig.assistants || {})) {
        const patterns = config.file_patterns || [];

        for (const pattern of patterns) {
          if (this.matchesPattern(filePath, pattern)) {
            return assistantId;
          }
        }
      }

      return 'human'; // افتراضي
    },

    /**
     * فحص تطابق النمط
     */
    matchesPattern(filePath, pattern) {
      // تحويل pattern إلى regex
      const regexPattern = pattern
        .replace(/\*\*/g, '.*')
        .replace(/\*/g, '[^/]*')
        .replace(/\./g, '\\.');

      const regex = new RegExp(`^${regexPattern}$`);
      return regex.test(filePath);
    },

    /**
     * طلب إذن للتعديل
     */
    async requestPermission(assistant, files, changeType) {
      const conflicts = [];

      for (const file of files) {
        const responsible = this.getResponsibleAssistant(file);
        if (responsible !== assistant && responsible !== 'human') {
          conflicts.push({
            file,
            responsible,
            current: assistant
          });
        }
      }

      if (conflicts.length > 0) {
        return {
          granted: false,
          conflicts,
          message: `تضارب في الصلاحيات: ${conflicts.length} ملف`
        };
      }

      return { granted: true };
    },

    /**
     * إشعار المساعدين بالتغييرات
     */
    async notifyAssistants(changes, excludeAssistant) {
      const notifications = [];

      for (const [assistantId, config] of Object.entries(assistantsConfig.assistants || {})) {
        if (assistantId === excludeAssistant) continue;

        const relevantChanges = changes.filter(change =>
          change.files.some(file =>
            this.getResponsibleAssistant(file) === assistantId
          )
        );

        if (relevantChanges.length > 0) {
          const notification = {
            to: assistantId,
            changes: relevantChanges,
            timestamp: new Date().toISOString(),
            action: this.getRecommendedAction(assistantId, relevantChanges)
          };

          notifications.push(notification);
          await this.sendNotification(notification);
        }
      }

      return notifications;
    },

    /**
     * الحصول على الإجراء المقترح
     */
    getRecommendedAction(assistantId, changes) {
      const config = assistantsConfig.assistants[assistantId];
      if (!config) return 'review';

      const changeTypes = changes.map(c => c.type);

      if (changeTypes.includes('critical')) {
        return 'immediate_review';
      }

      if (changeTypes.some(type => config.responsibilities.includes(type))) {
        return 'update_context';
      }

      return 'monitor';
    },

    /**
     * إرسال إشعار
     */
    async sendNotification(notification) {
      try {
        // حفظ في قاعدة البيانات المحلية
        this.saveNotification(notification);

        // إرسال webhook إذا كان متاح
        const config = assistantsConfig.assistants[notification.to];
        if (config?.notification_webhook) {
          await this.sendWebhook(config.notification_webhook, notification);
        }

        // إرسال إشعار عام إذا كان مفعل
        if (assistantsConfig.webhooks?.enabled) {
          await this.sendGeneralNotification(notification);
        }

      } catch (error) {
        Logger.error('خطأ في إرسال الإشعار:', error);
      }
    },

    /**
     * حفظ الإشعار
     */
    saveNotification(notification) {
      const notifications = this.getStoredNotifications();
      notifications.push(notification);

      // الاحتفاظ بآخر 100 إشعار فقط
      if (notifications.length > 100) {
        notifications.splice(0, notifications.length - 100);
      }

      PropertiesService.getScriptProperties()
        .setProperty('ASSISTANT_NOTIFICATIONS', JSON.stringify(notifications));
    },

    /**
     * الحصول على الإشعارات المحفوظة
     */
    getStoredNotifications() {
      const stored = PropertiesService.getScriptProperties()
        .getProperty('ASSISTANT_NOTIFICATIONS');
      return stored ? JSON.parse(stored) : [];
    },

    /**
     * إرسال webhook
     */
    async sendWebhook(webhookUrl, notification) {
      if (!webhookUrl) return;

      const payload = {
        text: `🤖 إشعار للمساعد ${notification.to}`,
        attachments: [{
          color: 'warning',
          fields: [{
            title: 'التغييرات',
            value: notification.changes.length,
            short: true
          }, {
            title: 'الإجراء المقترح',
            value: notification.action,
            short: true
          }]
        }]
      };

      try {
        await UrlFetchApp.fetch(webhookUrl, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          payload: JSON.stringify(payload)
        });
      } catch (error) {
        Logger.error('خطأ في webhook:', error);
      }
    },

    /**
     * إرسال إشعار عام
     */
    async sendGeneralNotification(notification) {
      const webhooks = assistantsConfig.webhooks || {};

      const message = `🔄 تحديث من ${notification.changes[0]?.assistant || 'مجهول'}: ${notification.changes.length} تغيير`;

      // Discord
      if (webhooks.discord_webhook) {
        await this.sendDiscordNotification(webhooks.discord_webhook, message);
      }

      // Slack
      if (webhooks.slack_webhook) {
        await this.sendSlackNotification(webhooks.slack_webhook, message);
      }
    },

    /**
     * إرسال إشعار Discord
     */
    async sendDiscordNotification(webhookUrl, message) {
      try {
        await UrlFetchApp.fetch(webhookUrl, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          payload: JSON.stringify({ content: message })
        });
      } catch (error) {
        Logger.error('خطأ في Discord webhook:', error);
      }
    },

    /**
     * إرسال إشعار Slack
     */
    async sendSlackNotification(webhookUrl, message) {
      try {
        await UrlFetchApp.fetch(webhookUrl, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          payload: JSON.stringify({ text: message })
        });
      } catch (error) {
        Logger.error('خطأ في Slack webhook:', error);
      }
    },

    /**
     * الحصول على حالة المساعدين
     */
    getAssistantsStatus() {
      const notifications = this.getStoredNotifications();
      const recentNotifications = notifications.filter(n =>
        new Date() - new Date(n.timestamp) < 24 * 60 * 60 * 1000 // آخر 24 ساعة
      );

      const status = {};

      for (const [assistantId, config] of Object.entries(assistantsConfig.assistants || {})) {
        const assistantNotifications = recentNotifications.filter(n => n.to === assistantId);

        status[assistantId] = {
          name: config.name,
          active: assistantNotifications.length > 0,
          lastActivity: assistantNotifications[0]?.timestamp || null,
          pendingNotifications: assistantNotifications.length,
          responsibilities: config.responsibilities
        };
      }

      return status;
    }
  };
});
