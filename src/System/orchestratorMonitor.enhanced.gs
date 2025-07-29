/**
 * مراقب المنسق المحسن - دمج متتبع الأداء مع المراقبة الشاملة
 * @fileoverview Enhanced orchestrator monitor with function tracker integration
 * @version 2.0.0
 * @since 3.0.0
 */
defineModule('System.OrchestratorMonitor.Enhanced', function(injector) {
  
  return {
    /**
     * مراقبة شاملة محسنة للنظام
     * @returns {Object} تقرير مراقبة شامل مع بيانات الأداء
     * @example
     * const report = monitor.monitorSystemEnhanced();
     * @since 3.0.0
     */
    async monitorSystemEnhanced() {
      const monitoringReport = {
        timestamp: new Date().toISOString(),
        systemHealth: 'UNKNOWN',
        components: {},
        performance: {},
        functionMetrics: {},
        alerts: [],
        recommendations: [],
        cloudLoggingStatus: 'UNKNOWN'
      };

      try {
        // المراقبة الأساسية
        const baseMonitor = injector.get('System.OrchestratorMonitor');
        const baseReport = await baseMonitor.monitorSystem();
        
        // دمج التقرير الأساسي
        Object.assign(monitoringReport, baseReport);
        
        // إضافة مقاييس الأداء المتقدمة
        monitoringReport.functionMetrics = await this.getFunctionMetrics();
        
        // إضافة حالة Cloud Logging
        monitoringReport.cloudLoggingStatus = await this.checkCloudLoggingStatus();
        
        // إضافة تحليل الاتجاهات
        monitoringReport.trends = this.analyzeTrends();
        
        // تحديث التوصيات بناءً على البيانات المحسنة
        monitoringReport.recommendations.push(...this.generateEnhancedRecommendations(monitoringReport));
        
        // إرسال إلى Cloud Logging
        await this.sendMonitoringToCloud(monitoringReport);
        
        return monitoringReport;

      } catch (error) {
        console.error('خطأ في المراقبة المحسنة:', error);
        monitoringReport.systemHealth = 'CRITICAL';
        monitoringReport.alerts.push({
          level: 'CRITICAL',
          message: `فشل في المراقبة المحسنة: ${error.message}`
        });
        
        return monitoringReport;
      }
    },

    /**
     * الحصول على مقاييس الأداء من متتبع الدوال
     * @returns {Object} مقاييس الأداء الشاملة
     * @private
     */
    async getFunctionMetrics() {
      try {
        const tracker = injector.get('Utils.FunctionTracker');
        
        // إحصائيات عامة
        const overallStats = tracker.getPerformanceStats();
        
        // إحصائيات مفصلة للوحدات الحرجة
        const criticalModules = [
          'System.ToolExecutor',
          'System.IntentAnalyzer',
          'System.HybridPDFProcessor',
          'Services.DocumentAI'
        ];
        
        const moduleStats = {};
        for (const module of criticalModules) {
          moduleStats[module] = tracker.getPerformanceStats({
            functionId: module,
            hours: 24
          });
        }
        
        return {
          overall: overallStats,
          modules: moduleStats,
          topPerformers: this.identifyTopPerformers(overallStats),
          bottlenecks: this.identifyBottlenecks(moduleStats)
        };
        
      } catch (error) {
        console.error('فشل في جلب مقاييس الأداء:', error);
        return {
          overall: { totalCalls: 0, successRate: 0 },
          modules: {},
          error: error.message
        };
      }
    },

    /**
     * تحديد أفضل الدوال أداءً
     * @param {Object} stats - إحصائيات الأداء
     * @returns {Array} قائمة أفضل الدوال أداءً
     * @private
     */
    identifyTopPerformers(stats) {
      // محاكاة تحديد أفضل الدوال (في التطبيق الحقيقي ستكون من البيانات الفعلية)
      return [
        { functionId: 'System.DataValidator.validateExtractedData', avgDuration: 45, successRate: 98 },
        { functionId: 'Utils.ContextBuilder.buildAgentContext', avgDuration: 120, successRate: 99 }
      ];
    },

    /**
     * تحديد الاختناقات في الأداء
     * @param {Object} moduleStats - إحصائيات الوحدات
     * @returns {Array} قائمة الاختناقات
     * @private
     */
    identifyBottlenecks(moduleStats) {
      const bottlenecks = [];
      
      Object.entries(moduleStats).forEach(([module, stats]) => {
        if (stats.averageDuration > 3000) {
          bottlenecks.push({
            module: module,
            issue: 'بطء في الاستجابة',
            avgDuration: stats.averageDuration,
            severity: stats.averageDuration > 5000 ? 'HIGH' : 'MEDIUM'
          });
        }
        
        if (stats.successRate < 90) {
          bottlenecks.push({
            module: module,
            issue: 'معدل فشل عالي',
            successRate: stats.successRate,
            severity: stats.successRate < 80 ? 'HIGH' : 'MEDIUM'
          });
        }
      });
      
      return bottlenecks;
    },

    /**
     * فحص حالة Cloud Logging
     * @returns {string} حالة Cloud Logging
     * @private
     */
    async checkCloudLoggingStatus() {
      try {
        const logger = injector.get('Utils.SystemLogger');
        
        // اختبار إرسال سجل تجريبي
        const testResult = await logger.logInfo('مراقبة النظام - اختبار الاتصال', {
          test: true,
          timestamp: new Date().toISOString()
        });
        
        return testResult ? 'CONNECTED' : 'DISCONNECTED';
        
      } catch (error) {
        console.error('فشل في فحص Cloud Logging:', error);
        return 'ERROR';
      }
    },

    /**
     * تحليل الاتجاهات
     * @returns {Object} تحليل الاتجاهات
     * @private
     */
    analyzeTrends() {
      try {
        const tracker = injector.get('Utils.FunctionTracker');
        const performanceLog = tracker.getPerformanceLog();
        
        // تحليل الاتجاهات في آخر 24 ساعة
        const last24Hours = performanceLog.filter(log => {
          const logTime = new Date(log.timestamp);
          const cutoff = new Date(Date.now() - 24 * 60 * 60 * 1000);
          return logTime > cutoff;
        });
        
        const trends = {
          callVolumeIncrease: this.calculateCallVolumeChange(last24Hours),
          averageResponseTimeChange: this.calculateResponseTimeChange(last24Hours),
          errorRateChange: this.calculateErrorRateChange(last24Hours)
        };
        
        return trends;
        
      } catch (error) {
        return {
          callVolumeIncrease: 0,
          averageResponseTimeChange: 0,
          errorRateChange: 0,
          error: error.message
        };
      }
    },

    /**
     * حساب تغيير حجم الاستدعاءات
     * @param {Array} logs - سجلات الأداء
     * @returns {number} نسبة التغيير
     * @private
     */
    calculateCallVolumeChange(logs) {
      if (logs.length < 2) return 0;
      
      const midpoint = Math.floor(logs.length / 2);
      const firstHalf = logs.slice(0, midpoint).length;
      const secondHalf = logs.slice(midpoint).length;
      
      return secondHalf > 0 ? ((secondHalf - firstHalf) / firstHalf) * 100 : 0;
    },

    /**
     * حساب تغيير زمن الاستجابة
     * @param {Array} logs - سجلات الأداء
     * @returns {number} نسبة التغيير
     * @private
     */
    calculateResponseTimeChange(logs) {
      if (logs.length < 10) return 0;
      
      const midpoint = Math.floor(logs.length / 2);
      const firstHalf = logs.slice(0, midpoint);
      const secondHalf = logs.slice(midpoint);
      
      const avgFirst = firstHalf.reduce((sum, log) => sum + log.duration, 0) / firstHalf.length;
      const avgSecond = secondHalf.reduce((sum, log) => sum + log.duration, 0) / secondHalf.length;
      
      return avgFirst > 0 ? ((avgSecond - avgFirst) / avgFirst) * 100 : 0;
    },

    /**
     * حساب تغيير معدل الأخطاء
     * @param {Array} logs - سجلات الأداء
     * @returns {number} نسبة التغيير
     * @private
     */
    calculateErrorRateChange(logs) {
      if (logs.length < 10) return 0;
      
      const midpoint = Math.floor(logs.length / 2);
      const firstHalf = logs.slice(0, midpoint);
      const secondHalf = logs.slice(midpoint);
      
      const errorRateFirst = (firstHalf.filter(log => !log.success).length / firstHalf.length) * 100;
      const errorRateSecond = (secondHalf.filter(log => !log.success).length / secondHalf.length) * 100;
      
      return errorRateSecond - errorRateFirst;
    },

    /**
     * إنشاء توصيات محسنة
     * @param {Object} report - تقرير المراقبة
     * @returns {Array} قائمة التوصيات المحسنة
     * @private
     */
    generateEnhancedRecommendations(report) {
      const recommendations = [];
      
      // توصيات بناءً على الأداء
      if (report.functionMetrics.bottlenecks && report.functionMetrics.bottlenecks.length > 0) {
        recommendations.push('تحسين الدوال البطيئة المحددة في تحليل الاختناقات');
      }
      
      // توصيات بناءً على الاتجاهات
      if (report.trends.callVolumeIncrease > 50) {
        recommendations.push('زيادة حجم الاستدعاءات - فكر في تحسين الأداء أو زيادة الموارد');
      }
      
      if (report.trends.averageResponseTimeChange > 20) {
        recommendations.push('تدهور في زمن الاستجابة - مراجعة الدوال الحديثة');
      }
      
      // توصيات بناءً على Cloud Logging
      if (report.cloudLoggingStatus !== 'CONNECTED') {
        recommendations.push('إصلاح اتصال Cloud Logging لضمان المراقبة الشاملة');
      }
      
      return recommendations;
    },

    /**
     * إرسال تقرير المراقبة إلى Cloud Logging
     * @param {Object} report - تقرير المراقبة
     * @private
     */
    async sendMonitoringToCloud(report) {
      try {
        const logger = injector.get('Utils.SystemLogger');
        
        // إرسال ملخص التقرير
        await logger.logInfo('System Monitoring Report', {
          systemHealth: report.systemHealth,
          totalComponents: Object.keys(report.components).length,
          healthyComponents: Object.values(report.components).filter(c => c.status === 'HEALTHY').length,
          totalAlerts: report.alerts.length,
          criticalAlerts: report.alerts.filter(a => a.level === 'CRITICAL').length,
          functionMetrics: {
            totalCalls: report.functionMetrics.overall?.totalCalls || 0,
            successRate: report.functionMetrics.overall?.successRate || 0,
            bottlenecksCount: report.functionMetrics.bottlenecks?.length || 0
          },
          trends: report.trends,
          cloudLoggingStatus: report.cloudLoggingStatus
        });
        
        // إرسال التنبيهات الحرجة بشكل منفصل
        const criticalAlerts = report.alerts.filter(alert => alert.level === 'CRITICAL');
        for (const alert of criticalAlerts) {
          await logger.logToCloud({
            type: 'critical_alert',
            component: alert.component,
            message: alert.message,
            timestamp: new Date().toISOString()
          }, 'ERROR');
        }
        
      } catch (error) {
        console.error('فشل في إرسال تقرير المراقبة للسحابة:', error);
      }
    }
  };
});

/**
 * دالة عامة للمراقبة المحسنة
 * @returns {Object} تقرير المراقبة الشامل
 * @example
 * const report = monitorSystemEnhanced();
 * @since 3.0.0
 */
function monitorSystemEnhanced() {
  try {
    const monitor = GAssistant.Utils.Injector.get('System.OrchestratorMonitor.Enhanced');
    return monitor.monitorSystemEnhanced();
  } catch (error) {
    console.error('خطأ في المراقبة المحسنة:', error);
    return {
      systemHealth: 'CRITICAL',
      error: error.message,
      timestamp: new Date().toISOString()
    };
  }
}