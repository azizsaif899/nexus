/**
 * مدير المراجعة البشرية - Human Review Manager
 * يدير طلبات المراجعة البشرية والإشعارات
 */
defineModule('System.Core.HumanReviewManager', ({ Utils, Config }) => {

  return {
    /**
     * طلب مراجعة بشرية
     */
    async requestReview(reviewData) {
      const reviewId = Utils.generateId();
      const review = {
        id: reviewId,
        ...reviewData,
        status: 'pending',
        createdAt: new Date().toISOString(),
        priority: this.calculatePriority(reviewData),
        estimatedTime: this.estimateReviewTime(reviewData)
      };

      // حفظ طلب المراجعة
      this.saveReviewRequest(review);

      // إرسال الإشعارات
      await this.sendReviewNotifications(review);

      // جدولة التذكيرات
      this.scheduleReminders(review);

      return {
        reviewId,
        status: 'requested',
        estimatedTime: review.estimatedTime
      };
    },

    /**
     * حساب الأولوية
     */
    calculatePriority(reviewData) {
      const { changeType, assistant, files, impact } = reviewData;

      let priority = 'medium';

      // أولوية عالية للتغييرات الحرجة
      if (changeType === 'critical' || changeType === 'security') {
        priority = 'urgent';
      }

      // أولوية عالية للملفات الحساسة
      const criticalFiles = ['src/core/', 'config/', 'package.json', 'security/'];
      if (files.some(file => criticalFiles.some(critical => file.includes(critical)))) {
        priority = priority === 'medium' ? 'high' : priority;
      }

      // أولوية عالية للتأثير الكبير
      if (impact === 'high' || impact === 'breaking') {
        priority = priority === 'medium' ? 'high' : priority;
      }

      return priority;
    },

    /**
     * تقدير وقت المراجعة
     */
    estimateReviewTime(reviewData) {
      const { changeType, files, complexity } = reviewData;

      let baseTime = 15; // دقائق

      // وقت إضافي حسب نوع التغيير
      const timeMultipliers = {
        critical: 3,
        security: 2.5,
        config: 2,
        ai: 1.8,
        ui: 1.2,
        docs: 0.8,
        test: 1
      };

      baseTime *= timeMultipliers[changeType] || 1;

      // وقت إضافي حسب عدد الملفات
      baseTime += files.length * 2;

      // وقت إضافي حسب التعقيد
      if (complexity === 'high') {
        baseTime *= 1.5;
      } else if (complexity === 'low') {
        baseTime *= 0.8;
      }

      return Math.round(baseTime);
    },

    /**
     * إرسال إشعارات المراجعة
     */
    async sendReviewNotifications(review) {
      const notifications = [];

      // إشعار Slack
      const slackNotification = await this.sendSlackReviewRequest(review);
      if (slackNotification.success) {
        notifications.push({ type: 'slack', success: true });
      }

      // إشعار Discord
      const discordNotification = await this.sendDiscordReviewRequest(review);
      if (discordNotification.success) {
        notifications.push({ type: 'discord', success: true });
      }

      // إشعار Email (للحالات الحرجة)
      if (review.priority === 'urgent') {
        const emailNotification = await this.sendEmailReviewRequest(review);
        if (emailNotification.success) {
          notifications.push({ type: 'email', success: true });
        }
      }

      // تحديث سجل الإشعارات
      this.updateReviewNotifications(review.id, notifications);

      return notifications;
    },

    /**
     * إرسال طلب مراجعة عبر Slack
     */
    async sendSlackReviewRequest(review) {
      try {
        const webhookUrl = Config.get('SLACK_WEBHOOK_URL');
        if (!webhookUrl) {
          return { success: false, reason: 'webhook_not_configured' };
        }

        const priorityEmojis = {
          urgent: '🚨',
          high: '⚠️',
          medium: '📋',
          low: '📝'
        };

        const payload = {
          text: `${priorityEmojis[review.priority]} طلب مراجعة بشرية`,
          attachments: [{
            color: this.getPriorityColor(review.priority),
            fields: [
              {
                title: 'المساعد',
                value: review.assistant,
                short: true
              },
              {
                title: 'نوع التغيير',
                value: review.changeType,
                short: true
              },
              {
                title: 'الأولوية',
                value: review.priority,
                short: true
              },
              {
                title: 'الوقت المتوقع',
                value: `${review.estimatedTime} دقيقة`,
                short: true
              },
              {
                title: 'الملفات المتأثرة',
                value: review.files.length,
                short: true
              },
              {
                title: 'السبب',
                value: review.reason || 'مراجعة روتينية',
                short: false
              }
            ],
            actions: [
              {
                type: 'button',
                text: '✅ موافقة',
                style: 'primary',
                value: `approve_${review.id}`
              },
              {
                type: 'button',
                text: '❌ رفض',
                style: 'danger',
                value: `reject_${review.id}`
              },
              {
                type: 'button',
                text: '📝 طلب تعديل',
                value: `request_changes_${review.id}`
              }
            ]
          }]
        };

        const response = await UrlFetchApp.fetch(webhookUrl, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          payload: JSON.stringify(payload)
        });

        return {
          success: response.getResponseCode() === 200,
          response: response.getContentText()
        };

      } catch (error) {
        Logger.error('خطأ في إرسال إشعار Slack:', error);
        return { success: false, error: error.message };
      }
    },

    /**
     * إرسال طلب مراجعة عبر Discord
     */
    async sendDiscordReviewRequest(review) {
      try {
        const webhookUrl = Config.get('DISCORD_WEBHOOK_URL');
        if (!webhookUrl) {
          return { success: false, reason: 'webhook_not_configured' };
        }

        const embed = {
          title: '📋 طلب مراجعة بشرية',
          description: review.reason || 'مراجعة مطلوبة',
          color: this.getPriorityColorHex(review.priority),
          fields: [
            {
              name: 'المساعد',
              value: review.assistant,
              inline: true
            },
            {
              name: 'نوع التغيير',
              value: review.changeType,
              inline: true
            },
            {
              name: 'الأولوية',
              value: review.priority,
              inline: true
            },
            {
              name: 'الملفات',
              value: review.files.slice(0, 5).join('\n') +
                     (review.files.length > 5 ? `\n... و ${review.files.length - 5} ملف آخر` : ''),
              inline: false
            }
          ],
          timestamp: new Date().toISOString(),
          footer: {
            text: `Review ID: ${review.id}`
          }
        };

        const payload = {
          embeds: [embed]
        };

        const response = await UrlFetchApp.fetch(webhookUrl, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          payload: JSON.stringify(payload)
        });

        return {
          success: response.getResponseCode() === 200,
          response: response.getContentText()
        };

      } catch (error) {
        Logger.error('خطأ في إرسال إشعار Discord:', error);
        return { success: false, error: error.message };
      }
    },

    /**
     * جدولة التذكيرات
     */
    scheduleReminders(review) {
      const reminders = [];

      // تذكير بعد نصف الوقت المتوقع
      const halfTimeReminder = {
        reviewId: review.id,
        type: 'half_time',
        scheduledAt: new Date(Date.now() + (review.estimatedTime * 30 * 1000)), // نصف الوقت بالثواني
        message: `تذكير: مراجعة ${review.id} في انتظار الموافقة`
      };
      reminders.push(halfTimeReminder);

      // تذكير عند انتهاء الوقت المتوقع
      const overdueReminder = {
        reviewId: review.id,
        type: 'overdue',
        scheduledAt: new Date(Date.now() + (review.estimatedTime * 60 * 1000)), // الوقت الكامل بالثواني
        message: `تحذير: مراجعة ${review.id} متأخرة عن الموعد المتوقع`
      };
      reminders.push(overdueReminder);

      // حفظ التذكيرات
      this.saveReminders(reminders);
    },

    /**
     * معالجة رد المراجع
     */
    async processReviewResponse(reviewId, action, reviewer, comments = '') {
      const review = this.getReviewRequest(reviewId);
      if (!review) {
        return { success: false, reason: 'review_not_found' };
      }

      const response = {
        reviewId,
        action, // approve, reject, request_changes
        reviewer,
        comments,
        timestamp: new Date().toISOString()
      };

      // تحديث حالة المراجعة
      review.status = action === 'approve' ? 'approved' :
        action === 'reject' ? 'rejected' : 'changes_requested';
      review.reviewedAt = response.timestamp;
      review.reviewer = reviewer;
      review.reviewComments = comments;

      // حفظ التحديث
      this.updateReviewRequest(review);

      // إشعار المساعد المطلوب
      await this.notifyAssistant(review, response);

      // إلغاء التذكيرات
      this.cancelReminders(reviewId);

      return { success: true, review, response };
    },

    /**
     * إشعار المساعد بنتيجة المراجعة
     */
    async notifyAssistant(review, response) {
      const coordinator = Injector.get('System.Utils.AssistantCoordinator');

      const notification = {
        to: review.assistant,
        type: 'review_response',
        reviewId: review.id,
        action: response.action,
        reviewer: response.reviewer,
        comments: response.comments,
        timestamp: response.timestamp
      };

      await coordinator.sendNotification(notification);
    },

    /**
     * الحصول على لون الأولوية
     */
    getPriorityColor(priority) {
      const colors = {
        urgent: 'danger',
        high: 'warning',
        medium: 'good',
        low: '#36a64f'
      };
      return colors[priority] || colors.medium;
    },

    /**
     * الحصول على لون الأولوية (Hex)
     */
    getPriorityColorHex(priority) {
      const colors = {
        urgent: 0xff0000,
        high: 0xff9900,
        medium: 0x36a64f,
        low: 0x0099ff
      };
      return colors[priority] || colors.medium;
    },

    /**
     * حفظ طلب المراجعة
     */
    saveReviewRequest(review) {
      const reviews = this.getStoredReviews();
      reviews.push(review);

      PropertiesService.getScriptProperties()
        .setProperty('REVIEW_REQUESTS', JSON.stringify(reviews));
    },

    /**
     * الحصول على طلبات المراجعة المحفوظة
     */
    getStoredReviews() {
      const stored = PropertiesService.getScriptProperties()
        .getProperty('REVIEW_REQUESTS');
      return stored ? JSON.parse(stored) : [];
    },

    /**
     * الحصول على طلب مراجعة محدد
     */
    getReviewRequest(reviewId) {
      const reviews = this.getStoredReviews();
      return reviews.find(r => r.id === reviewId);
    },

    /**
     * تحديث طلب المراجعة
     */
    updateReviewRequest(updatedReview) {
      const reviews = this.getStoredReviews();
      const index = reviews.findIndex(r => r.id === updatedReview.id);

      if (index !== -1) {
        reviews[index] = updatedReview;
        PropertiesService.getScriptProperties()
          .setProperty('REVIEW_REQUESTS', JSON.stringify(reviews));
      }
    },

    /**
     * الحصول على المراجعات المعلقة
     */
    getPendingReviews() {
      const reviews = this.getStoredReviews();
      return reviews.filter(r => r.status === 'pending')
        .sort((a, b) => {
          // ترتيب حسب الأولوية ثم التاريخ
          const priorityOrder = { urgent: 0, high: 1, medium: 2, low: 3 };
          const priorityDiff = priorityOrder[a.priority] - priorityOrder[b.priority];

          if (priorityDiff !== 0) return priorityDiff;

          return new Date(a.createdAt) - new Date(b.createdAt);
        });
    }
  };
});
