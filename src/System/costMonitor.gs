/**
 * مراقب التكلفة وإدارة الاستخدام
 * @fileoverview Cost monitoring and usage management
 * @version 1.0.0
 * @since 3.0.0
 */
defineModule('System.CostMonitor', function(injector) {
  
  return {
    /**
     * تتبع استخدام API
     * @param {string} service - اسم الخدمة (gemini, document_ai, vertex_ai)
     * @param {Object} usage - تفاصيل الاستخدام
     * @param {number} usage.tokens - عدد الرموز المستخدمة
     * @param {number} usage.requests - عدد الطلبات
     * @param {number} usage.estimatedCost - التكلفة المقدرة
     * @since 3.0.0
     */
    trackAPIUsage(service, usage) {
      try {
        const usageData = {
          service: service,
          timestamp: new Date().toISOString(),
          userId: this.getCurrentUserId(),
          ...usage
        };

        // حفظ في السجل المحلي
        this.saveUsageRecord(usageData);
        
        // فحص الحدود
        this.checkUsageLimits(service, usage);
        
        // إرسال للمراقبة السحابية
        this.sendUsageToCloud(usageData);
        
      } catch (error) {
        console.error('فشل في تتبع الاستخدام:', error);
      }
    },

    /**
     * حفظ سجل الاستخدام
     * @param {Object} usageData - بيانات الاستخدام
     * @private
     */
    saveUsageRecord(usageData) {
      try {
        const usageLog = this.getUsageLog();
        usageLog.push(usageData);
        
        // الاحتفاظ بآخر 1000 سجل فقط
        if (usageLog.length > 1000) {
          usageLog.splice(0, usageLog.length - 1000);
        }
        
        PropertiesService.getScriptProperties().setProperty(
          'usage_log',
          JSON.stringify(usageLog)
        );
        
      } catch (error) {
        console.error('فشل في حفظ سجل الاستخدام:', error);
      }
    },

    /**
     * الحصول على سجل الاستخدام
     * @returns {Array} سجل الاستخدام
     * @private
     */
    getUsageLog() {
      try {
        const savedLog = PropertiesService.getScriptProperties()
          .getProperty('usage_log');
        return savedLog ? JSON.parse(savedLog) : [];
      } catch (error) {
        return [];
      }
    },

    /**
     * فحص حدود الاستخدام
     * @param {string} service - اسم الخدمة
     * @param {Object} usage - الاستخدام الحالي
     * @private
     */
    checkUsageLimits(service, usage) {
      const limits = this.getServiceLimits(service);
      const currentUsage = this.getCurrentUsage(service);
      
      // فحص الحد اليومي
      if (currentUsage.daily.requests >= limits.daily.requests) {
        this.triggerUsageAlert('DAILY_LIMIT_REACHED', service, currentUsage);
      }
      
      // فحص الحد الشهري
      if (currentUsage.monthly.estimatedCost >= limits.monthly.cost) {
        this.triggerUsageAlert('MONTHLY_COST_LIMIT', service, currentUsage);
      }
      
      // تحذير عند الوصول لـ 80% من الحد
      if (currentUsage.daily.requests >= limits.daily.requests * 0.8) {
        this.triggerUsageAlert('APPROACHING_DAILY_LIMIT', service, currentUsage);
      }
    },

    /**
     * الحصول على حدود الخدمة
     * @param {string} service - اسم الخدمة
     * @returns {Object} حدود الخدمة
     * @private
     */
    getServiceLimits(service) {
      const defaultLimits = {
        gemini: {
          daily: { requests: 1000, tokens: 100000 },
          monthly: { cost: 100 } // دولار
        },
        document_ai: {
          daily: { requests: 100, pages: 500 },
          monthly: { cost: 50 }
        },
        vertex_ai: {
          daily: { requests: 500, tokens: 50000 },
          monthly: { cost: 200 }
        }
      };

      // محاولة تحميل الحدود المخصصة
      try {
        const customLimits = PropertiesService.getScriptProperties()
          .getProperty('usage_limits');
        if (customLimits) {
          const parsed = JSON.parse(customLimits);
          return parsed[service] || defaultLimits[service];
        }
      } catch (error) {
        console.error('فشل في تحميل الحدود المخصصة:', error);
      }

      return defaultLimits[service] || defaultLimits.gemini;
    },

    /**
     * الحصول على الاستخدام الحالي
     * @param {string} service - اسم الخدمة
     * @returns {Object} الاستخدام الحالي
     * @private
     */
    getCurrentUsage(service) {
      const usageLog = this.getUsageLog();
      const now = new Date();
      const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
      const thisMonth = new Date(now.getFullYear(), now.getMonth(), 1);

      const dailyUsage = usageLog.filter(record => 
        record.service === service && 
        new Date(record.timestamp) >= today
      );

      const monthlyUsage = usageLog.filter(record => 
        record.service === service && 
        new Date(record.timestamp) >= thisMonth
      );

      return {
        daily: {
          requests: dailyUsage.length,
          tokens: dailyUsage.reduce((sum, record) => sum + (record.tokens || 0), 0),
          estimatedCost: dailyUsage.reduce((sum, record) => sum + (record.estimatedCost || 0), 0)
        },
        monthly: {
          requests: monthlyUsage.length,
          tokens: monthlyUsage.reduce((sum, record) => sum + (record.tokens || 0), 0),
          estimatedCost: monthlyUsage.reduce((sum, record) => sum + (record.estimatedCost || 0), 0)
        }
      };
    },

    /**
     * إطلاق تنبيه الاستخدام
     * @param {string} alertType - نوع التنبيه
     * @param {string} service - اسم الخدمة
     * @param {Object} usage - بيانات الاستخدام
     * @private
     */
    triggerUsageAlert(alertType, service, usage) {
      const alertMessages = {
        DAILY_LIMIT_REACHED: `تم الوصول للحد اليومي لخدمة ${service}. لن تتمكن من استخدام الخدمة حتى غداً.`,
        MONTHLY_COST_LIMIT: `تم الوصول للحد الشهري للتكلفة لخدمة ${service}. يرجى مراجعة الاستخدام.`,
        APPROACHING_DAILY_LIMIT: `تقترب من الحد اليومي لخدمة ${service}. الاستخدام الحالي: ${usage.daily.requests} طلب.`
      };

      const alertData = {
        type: alertType,
        service: service,
        message: alertMessages[alertType],
        usage: usage,
        timestamp: new Date().toISOString()
      };

      // تسجيل التنبيه
      this.logUsageAlert(alertData);
      
      // إرسال للمراقبة السحابية
      this.sendAlertToCloud(alertData);
    },

    /**
     * تسجيل تنبيه الاستخدام
     * @param {Object} alertData - بيانات التنبيه
     * @private
     */
    logUsageAlert(alertData) {
      try {
        const logger = injector.get('Utils.SystemLogger');
        logger.logToCloud({
          type: 'usage_alert',
          ...alertData
        }, 'WARNING');
      } catch (error) {
        console.error('فشل في تسجيل تنبيه الاستخدام:', error);
      }
    },

    /**
     * إرسال بيانات الاستخدام للسحابة
     * @param {Object} usageData - بيانات الاستخدام
     * @private
     */
    sendUsageToCloud(usageData) {
      try {
        const logger = injector.get('Utils.SystemLogger');
        logger.logToCloud({
          type: 'api_usage',
          ...usageData
        }, 'INFO');
      } catch (error) {
        console.error('فشل في إرسال بيانات الاستخدام:', error);
      }
    },

    /**
     * إرسال التنبيه للسحابة
     * @param {Object} alertData - بيانات التنبيه
     * @private
     */
    sendAlertToCloud(alertData) {
      try {
        const logger = injector.get('Utils.SystemLogger');
        logger.logToCloud({
          type: 'cost_alert',
          ...alertData
        }, 'ERROR');
      } catch (error) {
        console.error('فشل في إرسال التنبيه:', error);
      }
    },

    /**
     * الحصول على تقرير الاستخدام
     * @param {Object} options - خيارات التقرير
     * @param {string} options.period - الفترة (daily, weekly, monthly)
     * @param {string} options.service - الخدمة المحددة
     * @returns {Object} تقرير الاستخدام
     * @since 3.0.0
     */
    getUsageReport(options = {}) {
      try {
        const usageLog = this.getUsageLog();
        const period = options.period || 'daily';
        const service = options.service;
        
        let filteredLog = usageLog;
        
        // تصفية حسب الخدمة
        if (service) {
          filteredLog = filteredLog.filter(record => record.service === service);
        }
        
        // تصفية حسب الفترة
        const now = new Date();
        let startDate;
        
        switch (period) {
          case 'daily':
            startDate = new Date(now.getFullYear(), now.getMonth(), now.getDate());
            break;
          case 'weekly':
            startDate = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
            break;
          case 'monthly':
            startDate = new Date(now.getFullYear(), now.getMonth(), 1);
            break;
          default:
            startDate = new Date(now.getTime() - 24 * 60 * 60 * 1000);
        }
        
        filteredLog = filteredLog.filter(record => 
          new Date(record.timestamp) >= startDate
        );
        
        // حساب الإحصائيات
        const report = {
          period: period,
          service: service || 'all',
          startDate: startDate.toISOString(),
          endDate: now.toISOString(),
          totalRequests: filteredLog.length,
          totalTokens: filteredLog.reduce((sum, record) => sum + (record.tokens || 0), 0),
          totalCost: filteredLog.reduce((sum, record) => sum + (record.estimatedCost || 0), 0),
          serviceBreakdown: this.calculateServiceBreakdown(filteredLog),
          hourlyDistribution: this.calculateHourlyDistribution(filteredLog)
        };
        
        return report;
        
      } catch (error) {
        console.error('فشل في إنشاء تقرير الاستخدام:', error);
        return {
          error: 'فشل في إنشاء التقرير',
          totalRequests: 0,
          totalCost: 0
        };
      }
    },

    /**
     * حساب توزيع الخدمات
     * @param {Array} usageLog - سجل الاستخدام
     * @returns {Object} توزيع الخدمات
     * @private
     */
    calculateServiceBreakdown(usageLog) {
      const breakdown = {};
      
      usageLog.forEach(record => {
        if (!breakdown[record.service]) {
          breakdown[record.service] = {
            requests: 0,
            tokens: 0,
            cost: 0
          };
        }
        
        breakdown[record.service].requests++;
        breakdown[record.service].tokens += record.tokens || 0;
        breakdown[record.service].cost += record.estimatedCost || 0;
      });
      
      return breakdown;
    },

    /**
     * حساب التوزيع الساعي
     * @param {Array} usageLog - سجل الاستخدام
     * @returns {Object} التوزيع الساعي
     * @private
     */
    calculateHourlyDistribution(usageLog) {
      const distribution = {};
      
      usageLog.forEach(record => {
        const hour = new Date(record.timestamp).getHours();
        distribution[hour] = (distribution[hour] || 0) + 1;
      });
      
      return distribution;
    },

    /**
     * الحصول على معرف المستخدم الحالي
     * @returns {string} معرف المستخدم
     * @private
     */
    getCurrentUserId() {
      try {
        return Session.getActiveUser().getEmail();
      } catch (error) {
        return 'UNKNOWN_USER';
      }
    }
  };
});

/**
 * دالة عامة لتتبع استخدام API
 * @param {string} service - اسم الخدمة
 * @param {Object} usage - تفاصيل الاستخدام
 * @since 3.0.0
 */
function trackAPIUsage(service, usage) {
  try {
    const costMonitor = GAssistant.Utils.Injector.get('System.CostMonitor');
    costMonitor.trackAPIUsage(service, usage);
  } catch (error) {
    console.error('فشل في تتبع استخدام API:', error);
  }
}