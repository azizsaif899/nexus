/**
 * مراقب المنسق - مراقبة أداء وحالة النظام
 * Status: 🟢 Stable
 */
defineModule('System.OrchestratorMonitor', function(injector) {
  
  return {
    /**
     * مراقبة شاملة للنظام
     */
    async monitorSystem() {
      const monitoringReport = {
        timestamp: new Date().toISOString(),
        systemHealth: 'UNKNOWN',
        components: {},
        performance: {},
        alerts: [],
        recommendations: []
      };

      try {
        // مراقبة المكونات الأساسية
        monitoringReport.components = await this.checkCoreComponents();
        
        // مراقبة الأداء
        monitoringReport.performance = await this.measurePerformance();
        
        // فحص التنبيهات
        monitoringReport.alerts = this.generateAlerts(monitoringReport);
        
        // إنشاء التوصيات
        monitoringReport.recommendations = this.generateRecommendations(monitoringReport);
        
        // تحديد الحالة العامة
        monitoringReport.systemHealth = this.calculateOverallHealth(monitoringReport);
        
        // حفظ التقرير
        await this.saveMonitoringReport(monitoringReport);
        
        return monitoringReport;

      } catch (error) {
        console.error('خطأ في مراقبة النظام:', error);
        monitoringReport.systemHealth = 'CRITICAL';
        monitoringReport.alerts.push({
          level: 'CRITICAL',
          message: `فشل في مراقبة النظام: ${error.message}`
        });
        
        return monitoringReport;
      }
    },

    /**
     * فحص المكونات الأساسية
     */
    async checkCoreComponents() {
      const components = {};
      const coreModules = [
        'System.IntentAnalyzer',
        'System.ToolExecutor', 
        'System.HybridPDFProcessor',
        'Services.DocumentAI',
        'Services.EnhancedVertexAI',
        'System.DataValidator',
        'Services.IntermediateStorage'
      ];

      for (const moduleName of coreModules) {
        components[moduleName] = await this.checkComponent(moduleName);
      }

      return components;
    },

    /**
     * فحص مكون واحد
     */
    async checkComponent(moduleName) {
      const componentStatus = {
        name: moduleName,
        status: 'UNKNOWN',
        responseTime: 0,
        lastCheck: new Date().toISOString(),
        errors: []
      };

      try {
        const startTime = Date.now();
        
        // محاولة تحميل المكون
        const module = injector.get(moduleName);
        
        if (!module) {
          componentStatus.status = 'FAILED';
          componentStatus.errors.push('فشل في تحميل المكون');
          return componentStatus;
        }

        // اختبار أساسي للمكون
        await this.testComponent(module, moduleName);
        
        componentStatus.responseTime = Date.now() - startTime;
        componentStatus.status = 'HEALTHY';

      } catch (error) {
        componentStatus.status = 'FAILED';
        componentStatus.errors.push(error.message);
        componentStatus.responseTime = Date.now() - startTime;
      }

      return componentStatus;
    },

    /**
     * اختبار مكون محدد
     */
    async testComponent(module, moduleName) {
      switch (moduleName) {
        case 'System.DataValidator':
          // اختبار سريع للمدقق
          const testData = { tables: [], entities: [] };
          module.validateExtractedData(testData);
          break;
          
        case 'Services.IntermediateStorage':
          // اختبار الاتصال بالتخزين
          module.getFromPropertiesService('test_key');
          break;
          
        case 'System.IntentAnalyzer':
          // اختبار تحليل النية
          module.getFallbackAgent();
          break;
          
        default:
          // اختبار عام - التحقق من وجود الدوال الأساسية
          if (typeof module !== 'object') {
            throw new Error('المكون ليس كائناً صالحاً');
          }
      }
    },

    /**
     * قياس الأداء
     */
    async measurePerformance() {
      const performance = {
        memoryUsage: this.getMemoryUsage(),
        responseTime: await this.measureResponseTime(),
        throughput: await this.measureThroughput(),
        errorRate: await this.calculateErrorRate()
      };

      return performance;
    },

    /**
     * الحصول على استخدام الذاكرة
     */
    getMemoryUsage() {
      try {
        // تقدير استخدام الذاكرة بناءً على البيانات المحفوظة
        const properties = PropertiesService.getScriptProperties().getProperties();
        const dataSize = JSON.stringify(properties).length;
        
        return {
          estimatedUsage: dataSize,
          unit: 'bytes',
          status: dataSize > 100000 ? 'HIGH' : 'NORMAL'
        };
      } catch (error) {
        return {
          estimatedUsage: 0,
          unit: 'bytes',
          status: 'UNKNOWN',
          error: error.message
        };
      }
    },

    /**
     * قياس زمن الاستجابة
     */
    async measureResponseTime() {
      const startTime = Date.now();
      
      try {
        // اختبار سريع للنظام
        const analyzer = injector.get('System.IntentAnalyzer');
        analyzer.getFallbackAgent();
        
        const responseTime = Date.now() - startTime;
        
        return {
          value: responseTime,
          unit: 'ms',
          status: responseTime > 2000 ? 'SLOW' : 'FAST'
        };
      } catch (error) {
        return {
          value: Date.now() - startTime,
          unit: 'ms',
          status: 'ERROR',
          error: error.message
        };
      }
    },

    /**
     * قياس الإنتاجية
     */
    async measureThroughput() {
      try {
        // قياس عدد العمليات المكتملة
        const stats = this.getSystemStats();
        
        return {
          operationsPerMinute: stats.recentOperations || 0,
          status: stats.recentOperations > 10 ? 'HIGH' : 'NORMAL'
        };
      } catch (error) {
        return {
          operationsPerMinute: 0,
          status: 'UNKNOWN',
          error: error.message
        };
      }
    },

    /**
     * حساب معدل الأخطاء
     */
    async calculateErrorRate() {
      try {
        const stats = this.getSystemStats();
        const totalOps = stats.totalOperations || 1;
        const errors = stats.totalErrors || 0;
        const errorRate = (errors / totalOps) * 100;
        
        return {
          percentage: Math.round(errorRate * 100) / 100,
          status: errorRate > 5 ? 'HIGH' : 'NORMAL'
        };
      } catch (error) {
        return {
          percentage: 0,
          status: 'UNKNOWN',
          error: error.message
        };
      }
    },

    /**
     * إنشاء التنبيهات
     */
    generateAlerts(report) {
      const alerts = [];

      // تنبيهات المكونات
      Object.values(report.components).forEach(component => {
        if (component.status === 'FAILED') {
          alerts.push({
            level: 'CRITICAL',
            component: component.name,
            message: `فشل في المكون: ${component.errors.join(', ')}`
          });
        }
        
        if (component.responseTime > 5000) {
          alerts.push({
            level: 'WARNING',
            component: component.name,
            message: `بطء في الاستجابة: ${component.responseTime}ms`
          });
        }
      });

      // تنبيهات الأداء
      if (report.performance.memoryUsage?.status === 'HIGH') {
        alerts.push({
          level: 'WARNING',
          component: 'Memory',
          message: 'استخدام عالي للذاكرة'
        });
      }

      if (report.performance.errorRate?.status === 'HIGH') {
        alerts.push({
          level: 'CRITICAL',
          component: 'System',
          message: `معدل أخطاء عالي: ${report.performance.errorRate.percentage}%`
        });
      }

      return alerts;
    },

    /**
     * إنشاء التوصيات
     */
    generateRecommendations(report) {
      const recommendations = [];

      // توصيات بناءً على التنبيهات
      const criticalAlerts = report.alerts.filter(a => a.level === 'CRITICAL');
      if (criticalAlerts.length > 0) {
        recommendations.push('إصلاح المشاكل الحرجة فوراً');
      }

      // توصيات الأداء
      if (report.performance.responseTime?.status === 'SLOW') {
        recommendations.push('تحسين أداء النظام - فحص العمليات البطيئة');
      }

      if (report.performance.memoryUsage?.status === 'HIGH') {
        recommendations.push('تنظيف البيانات القديمة وتحسين استخدام الذاكرة');
      }

      // توصيات عامة
      const healthyComponents = Object.values(report.components)
        .filter(c => c.status === 'HEALTHY').length;
      const totalComponents = Object.keys(report.components).length;
      
      if (healthyComponents / totalComponents < 0.8) {
        recommendations.push('فحص شامل للنظام - عدد كبير من المكونات غير صحية');
      }

      return recommendations;
    },

    /**
     * حساب الحالة العامة
     */
    calculateOverallHealth(report) {
      const criticalAlerts = report.alerts.filter(a => a.level === 'CRITICAL').length;
      const warningAlerts = report.alerts.filter(a => a.level === 'WARNING').length;
      
      const healthyComponents = Object.values(report.components)
        .filter(c => c.status === 'HEALTHY').length;
      const totalComponents = Object.keys(report.components).length;
      
      const healthRatio = healthyComponents / totalComponents;

      if (criticalAlerts > 0 || healthRatio < 0.5) {
        return 'CRITICAL';
      }
      
      if (warningAlerts > 2 || healthRatio < 0.8) {
        return 'WARNING';
      }
      
      return 'HEALTHY';
    },

    /**
     * حفظ تقرير المراقبة
     */
    async saveMonitoringReport(report) {
      try {
        const key = `monitoring_report_${Date.now()}`;
        PropertiesService.getScriptProperties().setProperty(
          key, 
          JSON.stringify(report)
        );
        
        // الاحتفاظ بآخر 10 تقارير فقط
        this.cleanupOldReports();
        
      } catch (error) {
        console.error('فشل في حفظ تقرير المراقبة:', error);
      }
    },

    /**
     * تنظيف التقارير القديمة
     */
    cleanupOldReports() {
      try {
        const properties = PropertiesService.getScriptProperties().getProperties();
        const reportKeys = Object.keys(properties)
          .filter(key => key.startsWith('monitoring_report_'))
          .sort()
          .reverse();
        
        // حذف التقارير الزائدة عن 10
        if (reportKeys.length > 10) {
          const keysToDelete = reportKeys.slice(10);
          keysToDelete.forEach(key => {
            PropertiesService.getScriptProperties().deleteProperty(key);
          });
        }
      } catch (error) {
        console.error('فشل في تنظيف التقارير القديمة:', error);
      }
    },

    /**
     * الحصول على إحصائيات النظام
     */
    getSystemStats() {
      try {
        const statsKey = 'system_stats';
        const savedStats = PropertiesService.getScriptProperties().getProperty(statsKey);
        
        if (savedStats) {
          return JSON.parse(savedStats);
        }
        
        return {
          totalOperations: 0,
          totalErrors: 0,
          recentOperations: 0,
          lastReset: new Date().toISOString()
        };
      } catch (error) {
        console.error('فشل في جلب إحصائيات النظام:', error);
        return {
          totalOperations: 0,
          totalErrors: 0,
          recentOperations: 0
        };
      }
    },

    /**
     * تحديث إحصائيات النظام
     */
    updateSystemStats(operation, success = true) {
      try {
        const stats = this.getSystemStats();
        
        stats.totalOperations = (stats.totalOperations || 0) + 1;
        if (!success) {
          stats.totalErrors = (stats.totalErrors || 0) + 1;
        }
        
        // تحديث العمليات الحديثة (آخر ساعة)
        const now = new Date();
        const lastReset = new Date(stats.lastReset || now);
        const hoursSinceReset = (now - lastReset) / (1000 * 60 * 60);
        
        if (hoursSinceReset >= 1) {
          stats.recentOperations = 1;
          stats.lastReset = now.toISOString();
        } else {
          stats.recentOperations = (stats.recentOperations || 0) + 1;
        }
        
        PropertiesService.getScriptProperties().setProperty(
          'system_stats', 
          JSON.stringify(stats)
        );
        
      } catch (error) {
        console.error('فشل في تحديث إحصائيات النظام:', error);
      }
    }
  };
});

/**
 * دالة عامة لمراقبة النظام
 */
function monitorSystemHealth() {
  try {
    const monitor = GAssistant.Utils.Injector.get('System.OrchestratorMonitor');
    return monitor.monitorSystem();
  } catch (error) {
    console.error('خطأ في مراقبة النظام:', error);
    return {
      systemHealth: 'CRITICAL',
      error: error.message,
      timestamp: new Date().toISOString()
    };
  }
}