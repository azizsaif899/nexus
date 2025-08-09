/**
 * وحدة التحكم في واجهة المستخدم المحسنة
 * تتعامل مع جميع طلبات الواجهة مع معالجة شاملة للأخطاء
 */
defineModule('System.UI.Controller', function(injector) {
  
  return {
    /**
     * معالجة رسالة المستخدم
     */
    async processUserMessage(message, selectedAgent = 'General') {
      try {
        const orchestrator = injector.get('System.AI.Orchestrator.Enhanced');
        const context = {
          startTime: Date.now(),
          selectedAgent: selectedAgent,
          userAgent: Session.getActiveUser().getEmail()
        };
        
        const result = await orchestrator.processRequest(message, context);
        
        return {
          success: true,
          message: result.response?.content || result.response || 'تم المعالجة بنجاح',
          agent: result.agent,
          confidence: result.confidence,
          processingTime: result.metadata?.processingTime
        };
        
      } catch (error) {
        console.error('خطأ في معالجة الرسالة:', error);
        return {
          success: false,
          message: 'عذراً، حدث خطأ في معالجة طلبك. يرجى المحاولة مرة أخرى.',
          error: error.message
        };
      }
    },

    /**
     * حفظ تاريخ المحادثة
     */
    saveChatHistory(chatHistory) {
      try {
        const userEmail = Session.getActiveUser().getEmail();
        const key = `chat_history_${userEmail}`;
        
        PropertiesService.getUserProperties().setProperty(
          key, 
          JSON.stringify({
            history: chatHistory,
            lastUpdated: new Date().toISOString()
          })
        );
        
        return { success: true };
        
      } catch (error) {
        console.error('خطأ في حفظ التاريخ:', error);
        throw new Error('فشل في حفظ تاريخ المحادثة');
      }
    },

    /**
     * تحميل تاريخ المحادثة
     */
    loadChatHistory() {
      try {
        const userEmail = Session.getActiveUser().getEmail();
        const key = `chat_history_${userEmail}`;
        
        const savedData = PropertiesService.getUserProperties().getProperty(key);
        
        if (savedData) {
          const parsed = JSON.parse(savedData);
          return parsed.history || [];
        }
        
        return [];
        
      } catch (error) {
        console.error('خطأ في تحميل التاريخ:', error);
        throw new Error('فشل في تحميل تاريخ المحادثة');
      }
    },

    /**
     * مسح تاريخ المحادثة
     */
    clearChatHistory() {
      try {
        const userEmail = Session.getActiveUser().getEmail();
        const key = `chat_history_${userEmail}`;
        
        PropertiesService.getUserProperties().deleteProperty(key);
        
        return { success: true };
        
      } catch (error) {
        console.error('خطأ في مسح التاريخ:', error);
        throw new Error('فشل في مسح تاريخ المحادثة');
      }
    },

    /**
     * تصدير تاريخ المحادثة
     */
    exportChatHistory() {
      try {
        const chatHistory = this.loadChatHistory();
        
        if (!chatHistory.length) {
          throw new Error('لا يوجد تاريخ محادثة للتصدير');
        }
        
        // إنشاء محتوى النص
        let content = `# تاريخ محادثة G-Assistant\n`;
        content += `التاريخ: ${new Date().toLocaleString('ar-SA')}\n\n`;
        
        chatHistory.forEach((msg, index) => {
          const timestamp = new Date(msg.timestamp).toLocaleString('ar-SA');
          const role = msg.type === 'user' ? 'المستخدم' : 'المساعد';
          content += `## ${index + 1}. ${role} - ${timestamp}\n`;
          content += `${msg.content}\n\n`;
        });
        
        // إنشاء ملف في Drive
        const blob = Utilities.newBlob(content, 'text/plain', 'chat_history.md');
        const file = DriveApp.createFile(blob);
        
        // مشاركة الملف
        file.setSharing(DriveApp.Access.ANYONE_WITH_LINK, DriveApp.Permission.VIEW);
        
        return file.getUrl();
        
      } catch (error) {
        console.error('خطأ في التصدير:', error);
        throw new Error('فشل في تصدير تاريخ المحادثة');
      }
    },

    /**
     * الحصول على إحصائيات الاستخدام
     */
    getUsageStats() {
      try {
        const userEmail = Session.getActiveUser().getEmail();
        const statsKey = `usage_stats_${userEmail}`;
        
        const savedStats = PropertiesService.getUserProperties().getProperty(statsKey);
        
        if (savedStats) {
          return JSON.parse(savedStats);
        }
        
        return {
          totalMessages: 0,
          agentUsage: {},
          lastActivity: null
        };
        
      } catch (error) {
        console.error('خطأ في جلب الإحصائيات:', error);
        throw new Error('فشل في جلب إحصائيات الاستخدام');
      }
    },

    /**
     * تحديث إحصائيات الاستخدام
     */
    updateUsageStats(agent) {
      try {
        const stats = this.getUsageStats();
        
        stats.totalMessages = (stats.totalMessages || 0) + 1;
        stats.agentUsage[agent] = (stats.agentUsage[agent] || 0) + 1;
        stats.lastActivity = new Date().toISOString();
        
        const userEmail = Session.getActiveUser().getEmail();
        const statsKey = `usage_stats_${userEmail}`;
        
        PropertiesService.getUserProperties().setProperty(
          statsKey, 
          JSON.stringify(stats)
        );
        
        return stats;
        
      } catch (error) {
        console.error('خطأ في تحديث الإحصائيات:', error);
        throw new Error('فشل في تحديث إحصائيات الاستخدام');
      }
    }
  };
});