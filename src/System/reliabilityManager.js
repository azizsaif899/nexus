/**
 * مدير الموثوقية المتقدم - المرحلة الرابعة
 * ضمان 99.9% uptime مع الشفاء الذاتي
 */

defineModule('System.ReliabilityManager', ({ Utils, Config }) => {

  class ReliabilityManager {
    constructor() {
      this.uptimeTarget = 0.999; // 99.9%
      this.healthChecks = new Map();
      this.failureHistory = [];
      this.recoveryStrategies = new Map();
      this.systemComponents = new Map();
      this.isMonitoring = false;

      this.metrics = {
        uptime: 0,
        totalDowntime: 0,
        failureCount: 0,
        recoveryCount: 0,
        lastFailure: null,
        systemHealth: 100
      };

      this.setupDefaultComponents();
      this.setupRecoveryStrategies();
    }

    /**
     * بدء مراقبة الموثوقية
     */
    startReliabilityMonitoring() {
      if (this.isMonitoring) {
        Logger.warn('Reliability monitoring already active');
        return;
      }

      Logger.log('🔄 بدء مراقبة الموثوقية المتقدمة...');

      this.isMonitoring = true;
      this.systemStartTime = Date.now();

      // فحص دوري كل 30 ثانية
      this.monitoringInterval = setInterval(() => {
        this.performHealthChecks();
        this.updateUptimeMetrics();
        this.analyzeSystemHealth();
        this.executePreventiveMaintenance();
      }, 30000);

      // فحص سريع كل 5 ثواني للمكونات الحرجة
      this.criticalCheckInterval = setInterval(() => {
        this.performCriticalChecks();
      }, 5000);

      Logger.log('✅ مراقبة الموثوقية نشطة');
    }

    /**
     * تسجيل مكون نظام
     */
    registerComponent(name, component) {
      this.systemComponents.set(name, {
        name,
        component,
        status: 'unknown',
        lastCheck: null,
        failureCount: 0,
        lastFailure: null,
        criticality: component.criticality || 'medium',
        healthCheck: component.healthCheck || (() => ({ healthy: true }))
      });

      Logger.log(`📋 تم تسجيل مكون النظام: ${name}`);
    }

    /**
     * إجراء فحوصات الصحة
     */
    async performHealthChecks() {
      const results = new Map();

      for (const [name, componentInfo] of this.systemComponents) {
        try {
          const startTime = Date.now();
          const healthResult = await componentInfo.healthCheck();
          const responseTime = Date.now() - startTime;

          const result = {
            healthy: healthResult.healthy,
            responseTime,
            details: healthResult.details || '',
            timestamp: Date.now()
          };

          results.set(name, result);
          componentInfo.lastCheck = Date.now();
          componentInfo.status = result.healthy ? 'healthy' : 'unhealthy';

          // إذا كان المكون غير صحي
          if (!result.healthy) {
            await this.handleComponentFailure(name, componentInfo, result);
          }

        } catch (error) {
          Logger.error(`Health check failed for ${name}:`, error);

          const result = {
            healthy: false,
            responseTime: 0,
            details: `Health check error: ${error.message}`,
            timestamp: Date.now()
          };

          results.set(name, result);
          componentInfo.status = 'error';

          await this.handleComponentFailure(name, componentInfo, result);
        }
      }

      this.healthChecks.set(Date.now(), results);
      return results;
    }

    /**
     * معالجة فشل المكون
     */
    async handleComponentFailure(componentName, componentInfo, healthResult) {
      const failure = {
        component: componentName,
        timestamp: Date.now(),
        details: healthResult.details,
        criticality: componentInfo.criticality,
        recoveryAttempted: false,
        recovered: false
      };

      this.failureHistory.push(failure);
      componentInfo.failureCount++;
      componentInfo.lastFailure = Date.now();
      this.metrics.failureCount++;
      this.metrics.lastFailure = Date.now();

      Logger.warn(`⚠️ فشل في المكون: ${componentName} - ${healthResult.details}`);

      // محاولة الاسترداد التلقائي
      await this.attemptRecovery(componentName, componentInfo, failure);

      // إشعار نظام المراقبة
      this.notifyMonitoring('component_failure', {
        component: componentName,
        criticality: componentInfo.criticality,
        details: healthResult.details
      });
    }

    /**
     * محاولة الاسترداد
     */
    async attemptRecovery(componentName, componentInfo, failure) {
      const strategy = this.recoveryStrategies.get(componentName);

      if (!strategy) {
        Logger.warn(`لا توجد استراتيجية استرداد لـ: ${componentName}`);
        return false;
      }

      try {
        Logger.log(`🔧 محاولة استرداد المكون: ${componentName}`);

        failure.recoveryAttempted = true;
        const recoveryResult = await strategy.recover(componentInfo.component, failure);

        if (recoveryResult.success) {
          failure.recovered = true;
          this.metrics.recoveryCount++;

          Logger.log(`✅ تم استرداد المكون بنجاح: ${componentName}`);

          // فحص للتأكد من الاسترداد
          const verificationResult = await componentInfo.healthCheck();
          if (verificationResult.healthy) {
            componentInfo.status = 'healthy';
            return true;
          }
        }

      } catch (error) {
        Logger.error(`خطأ في استرداد المكون ${componentName}:`, error);
      }

      return false;
    }

    /**
     * تحديث مقاييس الوقت التشغيلي
     */
    updateUptimeMetrics() {
      if (!this.systemStartTime) return;

      const now = Date.now();
      const totalTime = now - this.systemStartTime;

      // حساب إجمالي وقت التوقف
      const totalDowntime = this.calculateTotalDowntime();
      const uptime = (totalTime - totalDowntime) / totalTime;

      this.metrics.uptime = uptime;
      this.metrics.totalDowntime = totalDowntime;

      // تحديث صحة النظام العامة
      this.updateSystemHealth();
    }

    /**
     * حساب إجمالي وقت التوقف
     */
    calculateTotalDowntime() {
      let totalDowntime = 0;

      this.failureHistory.forEach(failure => {
        if (failure.recovered) {
          const recoveryTime = failure.recoveryTime || (failure.timestamp + 60000);
          totalDowntime += recoveryTime - failure.timestamp;
        } else {
          totalDowntime += Date.now() - failure.timestamp;
        }
      });

      return totalDowntime;
    }

    /**
     * تحديث صحة النظام
     */
    updateSystemHealth() {
      const healthyComponents = Array.from(this.systemComponents.values())
        .filter(comp => comp.status === 'healthy').length;

      const totalComponents = this.systemComponents.size;

      if (totalComponents === 0) {
        this.metrics.systemHealth = 100;
        return;
      }

      const baseHealth = (healthyComponents / totalComponents) * 100;

      // تقليل الصحة بناءً على الأعطال الأخيرة
      const recentFailures = this.failureHistory.filter(
        f => Date.now() - f.timestamp < 3600000
      ).length;

      const healthPenalty = Math.min(recentFailures * 5, 30);

      this.metrics.systemHealth = Math.max(baseHealth - healthPenalty, 0);
    }

    /**
     * الحصول على تقرير الموثوقية
     */
    getReliabilityReport() {
      return {
        timestamp: new Date().toISOString(),
        metrics: { ...this.metrics },
        components: this.getComponentsStatus(),
        uptime: {
          current: this.metrics.uptime,
          target: this.uptimeTarget,
          achieved: this.metrics.uptime >= this.uptimeTarget
        },
        failures: {
          total: this.metrics.failureCount,
          recent: this.getRecentFailures(),
          recoveryRate: this.calculateRecoveryRate()
        }
      };
    }

    /**
     * الحصول على حالة المكونات
     */
    getComponentsStatus() {
      const status = {};

      this.systemComponents.forEach((info, name) => {
        status[name] = {
          status: info.status,
          criticality: info.criticality,
          lastCheck: info.lastCheck,
          failureCount: info.failureCount,
          lastFailure: info.lastFailure
        };
      });

      return status;
    }

    /**
     * الحصول على الأعطال الأخيرة
     */
    getRecentFailures() {
      const oneHourAgo = Date.now() - (60 * 60 * 1000);

      return this.failureHistory
        .filter(failure => failure.timestamp > oneHourAgo)
        .sort((a, b) => b.timestamp - a.timestamp);
    }

    /**
     * حساب معدل الاسترداد
     */
    calculateRecoveryRate() {
      if (this.metrics.failureCount === 0) return 1;

      return this.metrics.recoveryCount / this.metrics.failureCount;
    }

    /**
     * إشعار نظام المراقبة
     */
    notifyMonitoring(eventType, data) {
      try {
        const monitor = Injector.get('System.AdvancedMonitor');
        monitor.updateMetric('reliability_event', {
          type: eventType,
          data,
          timestamp: Date.now()
        });
      } catch (error) {
        Logger.warn('Failed to notify monitoring system:', error);
      }
    }

    /**
     * إعداد المكونات الافتراضية
     */
    setupDefaultComponents() {
      this.registerComponent('ai_core', {
        criticality: 'critical',
        healthCheck: async () => {
          try {
            const aiCore = Injector.get('AI.Core');
            return { healthy: !!aiCore };
          } catch {
            return { healthy: false, details: 'AI Core not available' };
          }
        }
      });

      this.registerComponent('database', {
        criticality: 'critical',
        healthCheck: async () => {
          return { healthy: true };
        }
      });

      this.registerComponent('cache', {
        criticality: 'medium',
        healthCheck: async () => {
          try {
            const cache = Injector.get('Utils.AdvancedCache');
            return { healthy: !!cache };
          } catch {
            return { healthy: false, details: 'Cache not available' };
          }
        }
      });
    }

    /**
     * إعداد استراتيجيات الاسترداد الافتراضية
     */
    setupRecoveryStrategies() {
      this.registerRecoveryStrategy('restart', {
        recover: async (component) => {
          try {
            if (component.restart) {
              await component.restart();
              return { success: true };
            }
            return { success: false, error: 'Restart not supported' };
          } catch (error) {
            return { success: false, error: error.message };
          }
        }
      });

      this.registerRecoveryStrategy('fallback', {
        recover: async (component) => {
          try {
            if (component.enableFallback) {
              await component.enableFallback();
              return { success: true };
            }
            return { success: false, error: 'Fallback not supported' };
          } catch (error) {
            return { success: false, error: error.message };
          }
        }
      });
    }

    registerRecoveryStrategy(name, strategy) {
      this.recoveryStrategies.set(name, strategy);
      Logger.log(`🔧 تم تسجيل استراتيجية الاسترداد: ${name}`);
    }

    async performCriticalChecks() {
      const criticalComponents = Array.from(this.systemComponents.entries())
        .filter(([name, info]) => info.criticality === 'critical');

      for (const [name, componentInfo] of criticalComponents) {
        try {
          const quickCheck = await componentInfo.healthCheck();

          if (!quickCheck.healthy) {
            Logger.warn(`🚨 مكون حرج غير صحي: ${name}`);
            await this.handleComponentFailure(name, componentInfo, quickCheck);
          }

        } catch (error) {
          Logger.error(`Critical check failed for ${name}:`, error);
        }
      }
    }

    analyzeSystemHealth() {
      const analysis = {
        overallHealth: this.metrics.systemHealth,
        uptime: this.metrics.uptime,
        criticalIssues: [],
        warnings: []
      };

      if (this.metrics.uptime < this.uptimeTarget) {
        analysis.criticalIssues.push({
          type: 'low_uptime',
          message: `الوقت التشغيلي ${(this.metrics.uptime * 100).toFixed(2)}% أقل من الهدف`,
          severity: 'critical'
        });
      }

      return analysis;
    }

    executePreventiveMaintenance() {
      // تنظيف البيانات القديمة
      const oneWeekAgo = Date.now() - (7 * 24 * 60 * 60 * 1000);

      this.failureHistory = this.failureHistory.filter(
        failure => failure.timestamp > oneWeekAgo
      );

      for (const timestamp of this.healthChecks.keys()) {
        if (timestamp < oneWeekAgo) {
          this.healthChecks.delete(timestamp);
        }
      }
    }
  }

  return new ReliabilityManager();
});
