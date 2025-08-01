# 📋 دليل التشغيل المتقدم - AzizSys

## 🚨 إجراءات الطوارئ

### ⚡ ارتفاع زمن الاستجابة

#### التشخيص السريع
```bash
# فحص مقاييس الأداء الحالية
npm run monitor:start

# فحص استخدام الذاكرة
node -e "console.log(process.memoryUsage())"

# فحص معدل التخزين المؤقت
node -e "const cache = require('./src/services/HybridCacheManager.js'); console.log(cache.HybridCacheManager.getStats())"
```

#### خطوات الحل
1. **فحص التخزين المؤقت**
   ```javascript
   // في Google Apps Script Console
   const cache = Injector.get('Services.HybridCacheManager');
   const stats = cache.getStats();
   console.log('Cache Hit Rate:', stats.hitRate);
   ```

2. **تحسين الأداء**
   ```javascript
   // زيادة حجم التخزين المؤقت المحلي
   cache.maxLocalSize = 2000;
   
   // زيادة TTL للبيانات المستقرة
   cache.localTTL = 600000; // 10 دقائق
   ```

3. **مراقبة التحسن**
   ```bash
   # تشغيل اختبار الحمولة
   npm run test:load -- --duration=60s --vus=10
   ```

### 💰 ارتفاع تكاليف API

#### مراجعة التكلفة
```bash
# تقرير التكلفة اليومية
node -e "
const monitor = require('./monitoring/dashboard.js');
const metrics = monitor.PerformanceMonitor.getMetrics();
console.log('Daily Cost: $', metrics.cost.dailyEmbeddingCost);
"
```

#### تحسين التكلفة
1. **تحسين سياسة التخزين المؤقت**
   ```javascript
   // زيادة TTL للتخزين المؤقت
   const config = {
     cacheTTL: 7200000, // 2 ساعة
     batchSize: 50,     // معالجة مجمعة
     enableCompression: true
   };
   ```

2. **تفعيل ضغط الطلبات**
   ```javascript
   // في embeddingService.js
   const compressedText = text.length > 1000 ? 
     text.substring(0, 1000) + '...' : text;
   ```

3. **مراقبة الاستخدام**
   ```javascript
   // تتبع استخدام API
   const costTracker = {
     dailyLimit: 50,
     currentUsage: 0,
     alertThreshold: 0.8
   };
   ```

### 🔒 مشاكل الأمان

#### فحص الأسرار
```bash
# فحص حالة الأسرار
node -e "
const sm = require('./src/utils/secretManager.js');
console.log('Secrets Status:', sm.SecretManager.getStats());
"
```

#### تدوير الأسرار
```bash
# تدوير مفتاح Gemini
npm run secrets:rotate -- gemini-api-key

# تدوير مفتاح Pinecone
npm run secrets:rotate -- pinecone-api-key
```

## 📊 مراقبة الأداء

### مؤشرات الأداء الرئيسية (KPIs)

| المؤشر | الهدف | الحرج | الإجراء |
|---------|-------|-------|---------|
| زمن الاستجابة (p95) | < 200ms | > 500ms | تحسين التخزين المؤقت |
| معدل التخزين المؤقت | ≥ 85% | < 70% | زيادة حجم Cache |
| التكلفة اليومية | < $50 | > $80 | تحسين الاستخدام |
| معدل الأخطاء | < 1% | > 5% | فحص الأنظمة |

### لوحة المراقبة

```javascript
// تشغيل لوحة المراقبة
function startMonitoring() {
  const monitor = Injector.get('Monitoring.Dashboard');
  
  setInterval(() => {
    const report = monitor.PerformanceMonitor.generateReport();
    console.log(report.summary);
    
    // إرسال تنبيهات إذا لزم الأمر
    if (report.metrics.health.status === 'critical') {
      sendAlert(report);
    }
  }, 60000); // كل دقيقة
}
```

### التنبيهات التلقائية

```javascript
// إعداد التنبيهات
function setupAlerts() {
  const monitor = Injector.get('Monitoring.Dashboard');
  
  // تنبيه بطء الاستجابة
  monitor.onSlowResponse = (duration) => {
    if (duration > 200) {
      Logger.log(`⚠️ Slow response: ${duration}ms`);
      // إرسال إشعار
    }
  };
  
  // تنبيه ارتفاع التكلفة
  monitor.onHighCost = (cost) => {
    if (cost > 10) {
      Logger.log(`💰 High cost: $${cost}`);
      // إرسال تنبيه للفريق المالي
    }
  };
}
```

## 🔧 تحسين الأداء

### تحسين فهرسة المتجهات

```javascript
// إعدادات Pinecone المحسنة
const vectorDB = Injector.get('Connectors.VectorDB');

// تحسين البحث
const searchOptions = {
  topK: 10,
  threshold: 0.7,
  includeMetadata: true,
  // استخدام فلترة متقدمة
  filter: {
    category: { $in: ['financial', 'analysis'] },
    date: { $gte: '2024-01-01' }
  }
};
```

### ضبط التخزين المؤقت الهجين

```javascript
// إعدادات Cache محسنة
const cacheConfig = {
  layers: [
    {
      type: 'memory',
      ttl: 300000,      // 5 دقائق
      maxEntries: 2000  // زيادة الحجم
    },
    {
      type: 'properties',
      ttl: 3600000,     // ساعة
      compression: true  // ضغط البيانات
    },
    {
      type: 'vectordb',
      threshold: 50000,  // 50k embedding
      batchSize: 100     // معالجة مجمعة
    }
  ]
};
```

### تحسين استدعاءات API

```javascript
// تجميع الطلبات
class BatchProcessor {
  constructor() {
    this.queue = [];
    this.batchSize = 10;
    this.timeout = 1000; // 1 ثانية
  }
  
  async addRequest(text) {
    return new Promise((resolve) => {
      this.queue.push({ text, resolve });
      
      if (this.queue.length >= this.batchSize) {
        this.processBatch();
      } else {
        setTimeout(() => this.processBatch(), this.timeout);
      }
    });
  }
  
  async processBatch() {
    if (this.queue.length === 0) return;
    
    const batch = this.queue.splice(0, this.batchSize);
    const texts = batch.map(item => item.text);
    
    try {
      const embeddings = await this.generateBatchEmbeddings(texts);
      batch.forEach((item, index) => {
        item.resolve(embeddings[index]);
      });
    } catch (error) {
      batch.forEach(item => item.resolve(null));
    }
  }
}
```

## 🚀 خطة النشر المتقدمة

### النشر التدريجي (Canary Deployment)

```javascript
// إعدادات النشر التدريجي
const deploymentConfig = {
  phases: [
    { percentage: 5, duration: '1h', monitoring: 'intensive' },
    { percentage: 25, duration: '2h', monitoring: 'standard' },
    { percentage: 50, duration: '4h', monitoring: 'standard' },
    { percentage: 100, duration: 'stable', monitoring: 'continuous' }
  ],
  rollbackTriggers: [
    'error_rate > 2%',
    'response_time_p95 > 300ms',
    'cache_hit_rate < 70%'
  ]
};
```

### فحوصات الصحة

```javascript
// فحص صحة النظام
function healthCheck() {
  const checks = {
    database: checkDatabaseConnection(),
    cache: checkCacheHealth(),
    ai: checkAIServiceHealth(),
    vectordb: checkVectorDBHealth()
  };
  
  const overallHealth = Object.values(checks).every(check => check.status === 'healthy');
  
  return {
    status: overallHealth ? 'healthy' : 'unhealthy',
    checks,
    timestamp: new Date().toISOString()
  };
}
```

### خطة التراجع (Rollback Plan)

```javascript
// تفعيل خطة التراجع
function initiateRollback(reason) {
  Logger.log(`🚨 Initiating rollback: ${reason}`);
  
  // 1. إيقاف النشر الجديد
  stopDeployment();
  
  // 2. العودة للإصدار السابق
  revertToLastKnownGood();
  
  // 3. تنظيف البيانات المؤقتة
  clearTemporaryData();
  
  // 4. إشعار الفريق
  notifyTeam(`Rollback completed: ${reason}`);
}
```

## 📈 تقارير الأداء

### تقرير يومي

```javascript
// تقرير الأداء اليومي
function generateDailyReport() {
  const monitor = Injector.get('Monitoring.Dashboard');
  const report = monitor.PerformanceMonitor.generateReport();
  
  const dailyReport = {
    date: new Date().toISOString().split('T')[0],
    performance: report.metrics.performance,
    cost: report.metrics.cost,
    recommendations: report.recommendations,
    actions: generateActionItems(report)
  };
  
  // حفظ التقرير
  saveReport(dailyReport);
  
  // إرسال للفريق
  emailReport(dailyReport);
}
```

### مؤشرات الأعمال

```javascript
// مؤشرات الأعمال
const businessMetrics = {
  userSatisfaction: calculateUserSatisfaction(),
  featureUsage: trackFeatureUsage(),
  costEfficiency: calculateCostPerQuery(),
  systemReliability: calculateUptime()
};
```

---

## 📞 جهات الاتصال للطوارئ

- **فريق التطوير**: dev-team@azizsys.com
- **فريق العمليات**: ops-team@azizsys.com  
- **فريق الأمان**: security-team@azizsys.com
- **الإدارة**: management@azizsys.com

## 🔗 روابط مهمة

- [لوحة المراقبة](http://localhost:3000/monitoring)
- [تقارير الأداء](http://localhost:3000/reports)
- [سجلات النظام](http://localhost:3000/logs)
- [إعدادات التنبيهات](http://localhost:3000/alerts)

---

**آخر تحديث**: ديسمبر 2024  
**الإصدار**: 2.0.0  
**المسؤول**: فريق DevOps - AzizSys