/**
 * PerformanceProfiler - مراقب الأداء وتحليل الاختناقات
 * يقيس أوقات التنفيذ ويحدد نقاط البطء
 */
defineModule('System.PerformanceProfiler', function(injector) {
  const errorLogger = injector.get('System.ErrorLogger');
  
  let activeTimers = new Map();
  let performanceData = [];
  
  return {
    // بدء قياس الأداء
    startTimer(operationName, context = {}) {
      const timerId = `${operationName}_${Date.now()}`;
      activeTimers.set(timerId, {
        name: operationName,
        startTime: Date.now(),
        context: context
      });
      return timerId;
    },
    
    // إنهاء قياس الأداء
    endTimer(timerId) {
      const timer = activeTimers.get(timerId);
      if (!timer) {
        console.warn(`Timer ${timerId} not found`);
        return null;
      }
      
      const duration = Date.now() - timer.startTime;
      const result = {
        operation: timer.name,
        duration: duration,
        timestamp: new Date().toISOString(),
        context: timer.context,
        status: duration > 5000 ? 'SLOW' : duration > 2000 ? 'MEDIUM' : 'FAST'
      };
      
      performanceData.push(result);
      activeTimers.delete(timerId);
      
      // تسجيل العمليات البطيئة
      if (result.status === 'SLOW') {
        this.logSlowOperation(result);
      }
      
      return result;
    },
    
    // قياس دالة تلقائياً
    measureFunction(fn, operationName, context = {}) {
      const timerId = this.startTimer(operationName, context);
      
      try {
        const result = fn();
        this.endTimer(timerId);
        return result;
      } catch (error) {
        this.endTimer(timerId);
        errorLogger.logError(error, { operation: operationName, ...context });
        throw error;
      }
    },
    
    // قياس دالة async
    async measureAsyncFunction(fn, operationName, context = {}) {
      const timerId = this.startTimer(operationName, context);
      
      try {
        const result = await fn();
        this.endTimer(timerId);
        return result;
      } catch (error) {
        this.endTimer(timerId);
        errorLogger.logError(error, { operation: operationName, ...context });
        throw error;
      }
    },
    
    // تسجيل العمليات البطيئة
    logSlowOperation(result) {
      console.warn(`🐌 Slow operation detected: ${result.operation} (${result.duration}ms)`);
      
      try {
        const sheet = SpreadsheetApp.getActiveSpreadsheet()
          .getSheetByName('PerformanceLog') || 
          SpreadsheetApp.getActiveSpreadsheet().insertSheet('PerformanceLog');
        
        if (sheet.getLastRow() === 0) {
          sheet.getRange(1, 1, 1, 5).setValues([[
            'Timestamp', 'Operation', 'Duration (ms)', 'Status', 'Context'
          ]]);
        }
        
        sheet.appendRow([
          result.timestamp,
          result.operation,
          result.duration,
          result.status,
          JSON.stringify(result.context)
        ]);
      } catch (e) {
        console.error('Failed to log performance data:', e);
      }
    },
    
    // تحليل الأداء العام
    analyzePerformance() {
      if (performanceData.length === 0) return null;
      
      const analysis = {
        totalOperations: performanceData.length,
        averageDuration: performanceData.reduce((sum, op) => sum + op.duration, 0) / performanceData.length,
        slowOperations: performanceData.filter(op => op.status === 'SLOW').length,
        fastOperations: performanceData.filter(op => op.status === 'FAST').length,
        bottlenecks: this.identifyBottlenecks(),
        recommendations: this.generateRecommendations()
      };
      
      return analysis;
    },
    
    // تحديد الاختناقات
    identifyBottlenecks() {
      const operationStats = {};
      
      performanceData.forEach(op => {
        if (!operationStats[op.operation]) {
          operationStats[op.operation] = {
            count: 0,
            totalDuration: 0,
            maxDuration: 0,
            slowCount: 0
          };
        }
        
        const stats = operationStats[op.operation];
        stats.count++;
        stats.totalDuration += op.duration;
        stats.maxDuration = Math.max(stats.maxDuration, op.duration);
        if (op.status === 'SLOW') stats.slowCount++;
      });
      
      // ترتيب حسب متوسط الوقت
      return Object.entries(operationStats)
        .map(([name, stats]) => ({
          operation: name,
          averageDuration: stats.totalDuration / stats.count,
          maxDuration: stats.maxDuration,
          slowPercentage: (stats.slowCount / stats.count) * 100,
          totalCalls: stats.count
        }))
        .sort((a, b) => b.averageDuration - a.averageDuration)
        .slice(0, 5);
    },
    
    // توليد توصيات التحسين
    generateRecommendations() {
      const bottlenecks = this.identifyBottlenecks();
      const recommendations = [];
      
      bottlenecks.forEach(bottleneck => {
        if (bottleneck.averageDuration > 3000) {
          recommendations.push({
            operation: bottleneck.operation,
            issue: 'High average duration',
            suggestion: 'Consider caching, optimization, or breaking into smaller operations',
            priority: 'HIGH'
          });
        }
        
        if (bottleneck.slowPercentage > 50) {
          recommendations.push({
            operation: bottleneck.operation,
            issue: 'Frequently slow',
            suggestion: 'Review algorithm efficiency and data access patterns',
            priority: 'MEDIUM'
          });
        }
      });
      
      return recommendations;
    },
    
    // تقرير الأداء اليومي
    generateDailyPerformanceReport() {
      const analysis = this.analyzePerformance();
      if (!analysis) return 'No performance data available';
      
      return `📊 Daily Performance Report
      
Total Operations: ${analysis.totalOperations}
Average Duration: ${Math.round(analysis.averageDuration)}ms
Slow Operations: ${analysis.slowOperations} (${Math.round((analysis.slowOperations/analysis.totalOperations)*100)}%)

🔍 Top Bottlenecks:
${analysis.bottlenecks.map(b => 
  `• ${b.operation}: ${Math.round(b.averageDuration)}ms avg (${b.totalCalls} calls)`
).join('\n')}

💡 Recommendations:
${analysis.recommendations.map(r => 
  `• ${r.operation}: ${r.suggestion} (${r.priority})`
).join('\n')}`;
    },
    
    // مسح البيانات القديمة
    clearOldData(daysToKeep = 7) {
      const cutoffDate = new Date();
      cutoffDate.setDate(cutoffDate.getDate() - daysToKeep);
      
      performanceData = performanceData.filter(op => 
        new Date(op.timestamp) > cutoffDate
      );
      
      console.log(`🧹 Cleared performance data older than ${daysToKeep} days`);
    }
  };
});