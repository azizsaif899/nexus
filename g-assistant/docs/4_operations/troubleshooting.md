# 🔧 دليل استكشاف الأخطاء - AzizSys

## 🚨 المشاكل الشائعة والحلول السريعة

### 1. مشاكل النشر والبناء

#### ❌ المشكلة: "clasp: command not found"
**الأعراض**: عدم التعرف على أمر clasp في الطرفية

**الحل**:
```bash
# تثبيت clasp عالمياً
npm install -g @google/clasp

# التحقق من التثبيت
clasp --version

# إذا لم يعمل، أعد تشغيل الطرفية
```

#### ❌ المشكلة: "Script file not found"
**الأعراض**: خطأ عند محاولة النشر

**التشخيص**:
```bash
# التحقق من وجود ملف .clasp.json
ls -la .clasp.json

# التحقق من محتوى الملف
cat .clasp.json
```

**الحل**:
```bash
# إنشاء ملف .clasp.json جديد
echo '{
  "scriptId": "your_script_id_here",
  "rootDir": "./gas_ready"
}' > .clasp.json

# أو ربط مشروع موجود
clasp clone <script_id>
```

#### ❌ المشكلة: ملفات مفقودة بعد البناء
**الأعراض**: مجلد gas_ready فارغ أو ناقص

**التشخيص**:
```bash
# فحص عملية البناء
npm run build 2>&1 | tee build.log

# التحقق من الملفات المُنتجة
ls -la gas_ready/
```

**الحل**:
```bash
# تنظيف وإعادة البناء
npm run clean
npm run build

# التحقق من وجود الملفات الأساسية
ls gas_ready/ | grep -E "(Code.js|AssistantSidebar.html|appsscript.json)"
```

### 2. مشاكل Google Apps Script

#### ❌ المشكلة: "ReferenceError: [function] is not defined"
**الأعراض**: خطأ في تحميل الوحدات

**التشخيص**:
```javascript
// في محرر Apps Script
function debugModules() {
  Logger.log('🔍 فحص الوحدات...');
  
  try {
    Logger.log('GAssistant:', typeof GAssistant);
    Logger.log('Utils:', typeof GAssistant.Utils);
    Logger.log('Injector:', typeof GAssistant.Utils.Injector);
  } catch (error) {
    Logger.log('❌ خطأ في التحقق:', error.message);
  }
}
```

**الحل**:
```javascript
// إعادة تهيئة النظام
function forceReinitialization() {
  try {
    // مسح الذاكرة المؤقتة
    if (typeof GAssistant !== 'undefined') {
      delete GAssistant;
    }
    
    // إعادة تحميل النظام
    eval(UrlFetchApp.fetch('https://your-backup-url/Code.js').getContentText());
    
    Logger.log('✅ تم إعادة التهيئة بنجاح');
  } catch (error) {
    Logger.log('❌ فشل في إعادة التهيئة:', error.message);
  }
}
```

#### ❌ المشكلة: السايدبار لا يظهر
**الأعراض**: القائمة تظهر لكن السايدبار فارغ

**التشخيص**:
```javascript
// اختبار عرض السايدبار
function testSidebar() {
  try {
    const html = HtmlService.createHtmlOutputFromFile('AssistantSidebar');
    SpreadsheetApp.getUi().showSidebar(html);
    Logger.log('✅ السايدبار يعمل');
  } catch (error) {
    Logger.log('❌ خطأ في السايدبار:', error.message);
  }
}
```

**الحل**:
```bash
# التحقق من وجود ملف HTML
ls gas_ready/AssistantSidebar.html

# إذا كان مفقوداً، أعد البناء
npm run build

# التحقق من محتوى الملف
head -20 gas_ready/AssistantSidebar.html
```

### 3. مشاكل الذكاء الاصطناعي

#### ❌ المشكلة: "API key not found"
**الأعراض**: خطأ في الاتصال بـ Gemini API

**التشخيص**:
```javascript
// فحص مفتاح API
function checkAPIKey() {
  const properties = PropertiesService.getScriptProperties();
  const apiKey = properties.getProperty('GEMINI_API_KEY');
  
  if (!apiKey) {
    Logger.log('❌ مفتاح API مفقود');
    return false;
  }
  
  Logger.log('✅ مفتاح API موجود:', apiKey.substring(0, 10) + '...');
  return true;
}
```

**الحل**:
```javascript
// إعداد مفتاح API
function setupAPIKey() {
  const properties = PropertiesService.getScriptProperties();
  properties.setProperty('GEMINI_API_KEY', 'your_actual_api_key_here');
  
  Logger.log('✅ تم إعداد مفتاح API');
}
```

#### ❌ المشكلة: استجابات بطيئة من Gemini
**الأعراض**: وقت انتظار طويل للردود

**التشخيص**:
```javascript
// قياس زمن الاستجابة
async function measureResponseTime() {
  const startTime = Date.now();
  
  try {
    const ai = GAssistant.Utils.Injector.get('AI', 'GeminiAdapter');
    const response = await ai.generateContent({
      prompt: 'مرحبا'
    });
    
    const endTime = Date.now();
    const duration = endTime - startTime;
    
    Logger.log(`⏱️ زمن الاستجابة: ${duration}ms`);
    
    if (duration > 10000) {
      Logger.log('⚠️ الاستجابة بطيئة جداً');
    }
    
  } catch (error) {
    Logger.log('❌ خطأ في قياس الأداء:', error.message);
  }
}
```

**الحل**:
```javascript
// تحسين إعدادات Gemini
const optimizedConfig = {
  temperature: 0.7,
  maxOutputTokens: 1000,  // تقليل عدد الرموز
  topK: 40,
  topP: 0.95
};

// استخدام نموذج أسرع للمهام البسيطة
function chooseOptimalModel(requestType) {
  const modelMap = {
    'simple_chat': 'gemini-1.5-flash',
    'complex_analysis': 'gemini-1.5-pro',
    'code_review': 'gemini-1.5-pro'
  };
  
  return modelMap[requestType] || 'gemini-1.5-flash';
}
```

### 4. مشاكل نظام التضمين

#### ❌ المشكلة: بحث دلالي لا يعطي نتائج
**الأعراض**: البحث يعيد مصفوفة فارغة

**التشخيص**:
```javascript
// فحص نظام التضمين
function debugEmbeddings() {
  try {
    const embeddingService = GAssistant.Utils.Injector.get('Services', 'EmbeddingService');
    
    if (!embeddingService) {
      Logger.log('❌ خدمة التضمين غير متاحة');
      return;
    }
    
    const stats = embeddingService.getStats();
    Logger.log('📊 إحصائيات التضمين:', JSON.stringify(stats));
    
    // اختبار بحث بسيط
    const results = embeddingService.searchSimilar('مرحبا', { limit: 5 });
    Logger.log('🔍 نتائج البحث:', results.length);
    
  } catch (error) {
    Logger.log('❌ خطأ في فحص التضمين:', error.message);
  }
}
```

**الحل**:
```javascript
// إعادة بناء فهرس التضمين
async function rebuildEmbeddingIndex() {
  try {
    const embeddingService = GAssistant.Utils.Injector.get('Services', 'EmbeddingService');
    
    // مسح الفهرس القديم
    embeddingService.clearCache();
    
    // إعادة فهرسة البيانات الأساسية
    const sampleTexts = [
      'مرحبا كيف حالك',
      'أحتاج مساعدة في التحليل المالي',
      'كيف أحسب الربح الصافي'
    ];
    
    for (const text of sampleTexts) {
      await embeddingService.generateEmbedding(text);
    }
    
    Logger.log('✅ تم إعادة بناء فهرس التضمين');
    
  } catch (error) {
    Logger.log('❌ فشل في إعادة البناء:', error.message);
  }
}
```

### 5. مشاكل الأداء

#### ❌ المشكلة: استهلاك ذاكرة عالي
**الأعراض**: بطء في النظام أو توقف مفاجئ

**التشخيص**:
```javascript
// مراقبة استهلاك الذاكرة
function monitorMemoryUsage() {
  const startTime = Date.now();
  
  // قياس حجم البيانات المحملة
  let memoryUsage = 0;
  
  try {
    // فحص حجم الذاكرة المؤقتة
    const injector = GAssistant.Utils.Injector;
    memoryUsage += JSON.stringify(injector._moduleExports).length;
    
    // فحص حجم التضمينات
    const embeddingService = injector.get('Services', 'EmbeddingService');
    if (embeddingService && embeddingService.cache) {
      memoryUsage += embeddingService.cache.size * 1000; // تقدير تقريبي
    }
    
    Logger.log(`💾 استهلاك الذاكرة التقديري: ${Math.round(memoryUsage / 1024)} KB`);
    
    if (memoryUsage > 5000000) { // 5MB
      Logger.log('⚠️ استهلاك ذاكرة عالي!');
      return true;
    }
    
  } catch (error) {
    Logger.log('❌ خطأ في مراقبة الذاكرة:', error.message);
  }
  
  return false;
}
```

**الحل**:
```javascript
// تنظيف الذاكرة
function cleanupMemory() {
  try {
    // مسح الذاكرة المؤقتة للتضمينات
    const embeddingService = GAssistant.Utils.Injector.get('Services', 'EmbeddingService');
    if (embeddingService) {
      embeddingService.clearCache();
    }
    
    // مسح الذاكرة المؤقتة للنظام
    const cache = CacheService.getScriptCache();
    cache.removeAll(['chat_history', 'temp_data']);
    
    // إجبار جمع القمامة (Garbage Collection)
    Utilities.sleep(100);
    
    Logger.log('✅ تم تنظيف الذاكرة');
    
  } catch (error) {
    Logger.log('❌ فشل في تنظيف الذاكرة:', error.message);
  }
}
```

## 🛠️ أدوات التشخيص المتقدمة

### أداة التشخيص الشامل
```javascript
function runComprehensiveDiagnostic() {
  Logger.log('🔍 بدء التشخيص الشامل...');
  
  const results = {
    system: checkSystemHealth(),
    modules: checkModulesStatus(),
    api: checkAPIConnectivity(),
    embeddings: checkEmbeddingsService(),
    performance: checkPerformance()
  };
  
  // إنشاء تقرير
  const report = generateDiagnosticReport(results);
  
  // حفظ التقرير في جدول
  saveDiagnosticReport(report);
  
  Logger.log('✅ اكتمل التشخيص الشامل');
  return report;
}

function checkSystemHealth() {
  const health = {
    timestamp: new Date(),
    gasVersion: 'V8',
    systemReady: false,
    errors: []
  };
  
  try {
    // فحص النظام الأساسي
    if (typeof GAssistant !== 'undefined' && GAssistant.System?.isReady) {
      health.systemReady = true;
    } else {
      health.errors.push('النظام الأساسي غير جاهز');
    }
    
    // فحص الخدمات الأساسية
    const requiredServices = ['SpreadsheetApp', 'HtmlService', 'PropertiesService'];
    for (const service of requiredServices) {
      if (typeof eval(service) === 'undefined') {
        health.errors.push(`خدمة مفقودة: ${service}`);
      }
    }
    
  } catch (error) {
    health.errors.push(`خطأ في فحص النظام: ${error.message}`);
  }
  
  return health;
}

function generateDiagnosticReport(results) {
  const report = {
    timestamp: new Date(),
    overall: 'healthy',
    details: results,
    recommendations: []
  };
  
  // تحليل النتائج وإضافة التوصيات
  if (!results.system.systemReady) {
    report.overall = 'critical';
    report.recommendations.push('إعادة تهيئة النظام الأساسي');
  }
  
  if (results.api.errors.length > 0) {
    report.overall = 'warning';
    report.recommendations.push('فحص إعدادات API');
  }
  
  if (results.performance.memoryHigh) {
    report.recommendations.push('تنظيف الذاكرة');
  }
  
  return report;
}
```

### مراقب الأخطاء التلقائي
```javascript
// نظام مراقبة الأخطاء
class ErrorMonitor {
  constructor() {
    this.errors = [];
    this.maxErrors = 100;
  }
  
  logError(error, context = '') {
    const errorEntry = {
      timestamp: new Date(),
      message: error.message,
      stack: error.stack,
      context: context,
      severity: this.determineSeverity(error)
    };
    
    this.errors.push(errorEntry);
    
    // الاحتفاظ بآخر 100 خطأ فقط
    if (this.errors.length > this.maxErrors) {
      this.errors.shift();
    }
    
    // إرسال تنبيه للأخطاء الحرجة
    if (errorEntry.severity === 'critical') {
      this.sendAlert(errorEntry);
    }
    
    // حفظ في جدول الأخطاء
    this.saveToSheet(errorEntry);
  }
  
  determineSeverity(error) {
    const criticalKeywords = ['API', 'Authentication', 'Permission'];
    const warningKeywords = ['Cache', 'Memory', 'Timeout'];
    
    const message = error.message.toLowerCase();
    
    if (criticalKeywords.some(keyword => message.includes(keyword.toLowerCase()))) {
      return 'critical';
    }
    
    if (warningKeywords.some(keyword => message.includes(keyword.toLowerCase()))) {
      return 'warning';
    }
    
    return 'info';
  }
  
  sendAlert(errorEntry) {
    try {
      // يمكن إرسال تنبيه عبر البريد الإلكتروني أو Slack
      const subject = `🚨 خطأ حرج في AzizSys: ${errorEntry.message}`;
      const body = `
        الوقت: ${errorEntry.timestamp}
        السياق: ${errorEntry.context}
        الرسالة: ${errorEntry.message}
        
        Stack Trace:
        ${errorEntry.stack}
      `;
      
      // MailApp.sendEmail('admin@example.com', subject, body);
      Logger.log('🚨 تنبيه خطأ حرج:', errorEntry.message);
      
    } catch (alertError) {
      Logger.log('❌ فشل في إرسال التنبيه:', alertError.message);
    }
  }
  
  saveToSheet(errorEntry) {
    try {
      const sheet = Utils.getSheet('System_Errors', [
        'Timestamp', 'Severity', 'Message', 'Context', 'Stack'
      ]);
      
      sheet.appendRow([
        errorEntry.timestamp,
        errorEntry.severity,
        errorEntry.message,
        errorEntry.context,
        errorEntry.stack
      ]);
      
    } catch (saveError) {
      Logger.log('❌ فشل في حفظ الخطأ:', saveError.message);
    }
  }
  
  getRecentErrors(hours = 24) {
    const cutoff = new Date(Date.now() - (hours * 60 * 60 * 1000));
    return this.errors.filter(error => error.timestamp > cutoff);
  }
  
  getErrorStats() {
    const recent = this.getRecentErrors();
    const stats = {
      total: recent.length,
      critical: recent.filter(e => e.severity === 'critical').length,
      warning: recent.filter(e => e.severity === 'warning').length,
      info: recent.filter(e => e.severity === 'info').length
    };
    
    return stats;
  }
}

// إنشاء مثيل عام لمراقب الأخطاء
const globalErrorMonitor = new ErrorMonitor();

// دالة مساعدة لتسجيل الأخطاء
function logError(error, context = '') {
  globalErrorMonitor.logError(error, context);
}
```

## 📞 الحصول على المساعدة

### قنوات الدعم
1. **GitHub Issues**: [فتح issue جديد](https://github.com/azizsaif899/g-assistant/issues)
2. **المناقشات**: [GitHub Discussions](https://github.com/azizsaif899/g-assistant/discussions)
3. **التوثيق**: راجع الأدلة الأخرى في المشروع

### معلومات مفيدة عند طلب المساعدة
```javascript
// جمع معلومات النظام للدعم
function collectSystemInfo() {
  const info = {
    timestamp: new Date(),
    version: GAssistant.System?.version || 'unknown',
    gasRuntime: 'V8',
    modules: Object.keys(GAssistant.Utils.Injector._moduleExports || {}),
    recentErrors: globalErrorMonitor.getRecentErrors(1),
    performance: {
      memoryUsage: monitorMemoryUsage(),
      responseTime: 'measure_needed'
    }
  };
  
  Logger.log('📋 معلومات النظام:', JSON.stringify(info, null, 2));
  return info;
}
```

### نصائح لتجنب المشاكل
1. **النسخ الاحتياطية**: احتفظ بنسخة احتياطية من المشروع دائماً
2. **الاختبار**: اختبر التغييرات في بيئة منفصلة أولاً
3. **المراقبة**: راقب الأخطاء والأداء بانتظام
4. **التحديث**: حدّث التبعيات والمكتبات بانتظام
5. **التوثيق**: وثّق أي تغييرات تقوم بها