# دليل استكشاف الأخطاء وإصلاحها - G-Assistant

## 📋 تعريف الوثيقة
**الغرض**: دليل شامل لاستكشاف وحل المشاكل المحتملة أثناء تشغيل مشروع G-Assistant، ويقدم حلولًا ذكية لكل حالة، تشمل التحقق الذاتي، المسارات البديلة، والرد التلقائي من الوكلاء  
**الجمهور المستهدف**: المطورون والدعم الفني ومديرو النظم  
**نوع الوثيقة**: وثيقة تقنية - دليل استكشاف وحلول  
**التحديث**: يتم تحديثها باستمرار مع اكتشاف مشاكل جديدة أو تطوير حلول محسنة

---

**الإصدار**: 3.0.0  
**آخر تحديث**: ${new Date().toISOString()}

---

## 🚨 المشاكل الشائعة والحلول السريعة

### ❌ المشكلة: "G-Assistant لا يستجيب"

#### الأعراض:
- الشريط الجانبي لا يفتح
- لا توجد استجابة عند الضغط على الأزرار
- رسائل خطأ "Script timeout"

#### الحلول السريعة:
```javascript
// 1. إعادة تحميل الصفحة
location.reload();

// 2. فحص حالة النظام
function quickDiagnostic() {
  try {
    const injector = GAssistant?.Utils?.Injector;
    if (!injector) {
      console.error('❌ Injector not loaded');
      return false;
    }
    
    const config = injector.get('System.Config.Enhanced');
    if (!config) {
      console.error('❌ Config not available');
      return false;
    }
    
    console.log('✅ Basic system check passed');
    return true;
  } catch (e) {
    console.error('❌ System check failed:', e.message);
    return false;
  }
}

// 3. إعادة تهيئة النظام
function reinitializeSystem() {
  delete window.GAssistant;
  // إعادة تحميل الكود الأساسي
  eval(UrlFetchApp.fetch('script_url').getContentText());
}
```

---

### ❌ المشكلة: "API Key غير صحيح"

#### الأعراض:
- رسائل خطأ "Invalid API key"
- فشل في الاتصال بـ Gemini
- استجابات فارغة من AI

#### الحلول:
```javascript
// 1. التحقق من صحة API Key
function validateApiKey() {
  const config = GAssistant.Utils.Injector.get('System.Config.Enhanced');
  const apiKey = config.get('GEMINI_API_KEY');
  
  if (!apiKey) {
    console.error('❌ API Key not found');
    return false;
  }
  
  if (apiKey.length < 30) {
    console.error('❌ API Key too short');
    return false;
  }
  
  // اختبار الاتصال
  try {
    const response = UrlFetchApp.fetch(
      `https://generativelanguage.googleapis.com/v1beta/models?key=${apiKey}`
    );
    
    if (response.getResponseCode() === 200) {
      console.log('✅ API Key valid');
      return true;
    } else {
      console.error('❌ API Key invalid');
      return false;
    }
  } catch (e) {
    console.error('❌ API connection failed:', e.message);
    return false;
  }
}

// 2. إعادة تعيين API Key
function resetApiKey() {
  const newKey = Browser.inputBox('Enter new Gemini API Key:');
  if (newKey) {
    PropertiesService.getScriptProperties().setProperty('GEMINI_API_KEY', newKey);
    console.log('✅ API Key updated');
  }
}
```

---

### ❌ المشكلة: "الوكلاء لا يعملون"

#### الأعراض:
- رسائل "Agent not found"
- استجابات عامة بدلاً من متخصصة
- أخطاء في تحليل النوايا

#### الحلول:
```javascript
// 1. فحص حالة الوكلاء
function checkAgentsStatus() {
  const agents = ['CFO', 'Developer', 'DatabaseManager', 'General'];
  const results = {};
  
  agents.forEach(agentName => {
    try {
      const agent = GAssistant.Utils.Injector.get(`System.AI.Agents.${agentName}`);
      results[agentName] = agent ? '✅ Available' : '❌ Not found';
    } catch (e) {
      results[agentName] = `❌ Error: ${e.message}`;
    }
  });
  
  console.table(results);
  return results;
}

// 2. إعادة تحميل الوكلاء
function reloadAgents() {
  const agentModules = [
    'System.AI.Agents.CFO',
    'System.AI.Agents.Developer', 
    'System.AI.Agents.DatabaseManager',
    'System.AI.Agents.General'
  ];
  
  agentModules.forEach(module => {
    try {
      GAssistant.Utils.Injector.reload(module);
      console.log(`✅ ${module} reloaded`);
    } catch (e) {
      console.error(`❌ Failed to reload ${module}:`, e.message);
    }
  });
}
```

---

### ❌ المشكلة: "بطء في الاستجابة"

#### الأعراض:
- زمن استجابة أكثر من 10 ثوان
- انقطاع العمليات الطويلة
- رسائل timeout

#### الحلول:
```javascript
// 1. تحسين الأداء
function optimizePerformance() {
  // تفعيل التخزين المؤقت
  const cache = CacheService.getScriptCache();
  cache.put('performance_mode', 'optimized', 3600);
  
  // تقليل مستوى التسجيل
  const logger = GAssistant.Utils.Injector.get('Utils.SystemLogger');
  logger.setLevel('WARN');
  
  // تحسين إعدادات AI
  const config = GAssistant.Utils.Injector.get('System.Config.Enhanced');
  config.set('DEFAULT_TEMPERATURE', '0.1'); // استجابة أسرع
  config.set('MAX_TOKENS', '1000'); // أقل استهلاكاً
  
  console.log('✅ Performance optimized');
}

// 2. مراقبة الأداء
function monitorPerformance() {
  const tracker = GAssistant.Utils.Injector.get('Utils.FunctionTracker');
  const stats = tracker.getPerformanceStats();
  
  console.log('📊 Performance Stats:');
  console.log(`Average Response Time: ${stats.avgResponseTime}ms`);
  console.log(`Memory Usage: ${stats.memoryUsage}MB`);
  console.log(`Error Rate: ${stats.errorRate}%`);
  
  if (stats.avgResponseTime > 5000) {
    console.warn('⚠️ Slow response time detected');
    optimizePerformance();
  }
}
```

---

## 🔧 أدوات التشخيص المتقدمة

### 🩺 فحص صحة النظام الشامل
```javascript
/**
 * فحص شامل لصحة النظام
 */
function comprehensiveHealthCheck() {
  const healthReport = {
    timestamp: new Date().toISOString(),
    overall: 'healthy',
    issues: [],
    warnings: [],
    details: {}
  };
  
  console.log('🔍 Starting comprehensive health check...');
  
  // 1. فحص الوحدات الأساسية
  try {
    const coreModules = [
      'System.Utils.Injector',
      'System.Config.Enhanced',
      'Utils.SystemLogger',
      'Utils.ErrorRouter'
    ];
    
    coreModules.forEach(module => {
      try {
        const moduleInstance = GAssistant.Utils.Injector.get(module);
        if (moduleInstance) {
          healthReport.details[module] = '✅ OK';
        } else {
          healthReport.issues.push(`${module} not available`);
          healthReport.overall = 'unhealthy';
        }
      } catch (e) {
        healthReport.issues.push(`${module} error: ${e.message}`);
        healthReport.overall = 'unhealthy';
      }
    });
  } catch (e) {
    healthReport.issues.push(`Core modules check failed: ${e.message}`);
    healthReport.overall = 'critical';
  }
  
  // 2. فحص الإعدادات
  try {
    const config = GAssistant.Utils.Injector.get('System.Config.Enhanced');
    const validation = config.validateConfig();
    
    if (!validation.valid) {
      validation.missing.forEach(key => {
        healthReport.warnings.push(`Missing config: ${key}`);
      });
      if (healthReport.overall === 'healthy') {
        healthReport.overall = 'warning';
      }
    }
    
    healthReport.details.configuration = validation.valid ? '✅ Valid' : '⚠️ Issues';
  } catch (e) {
    healthReport.issues.push(`Configuration check failed: ${e.message}`);
    healthReport.overall = 'unhealthy';
  }
  
  // 3. فحص الوكلاء
  try {
    const agentStatus = checkAgentsStatus();
    let agentIssues = 0;
    
    Object.entries(agentStatus).forEach(([agent, status]) => {
      if (status.includes('❌')) {
        agentIssues++;
        healthReport.warnings.push(`Agent ${agent} not working`);
      }
    });
    
    if (agentIssues > 0 && healthReport.overall === 'healthy') {
      healthReport.overall = 'warning';
    }
    
    healthReport.details.agents = `${Object.keys(agentStatus).length - agentIssues}/${Object.keys(agentStatus).length} working`;
  } catch (e) {
    healthReport.issues.push(`Agents check failed: ${e.message}`);
  }
  
  // 4. فحص الأداء
  try {
    const tracker = GAssistant.Utils.Injector.get('Utils.FunctionTracker');
    const perfStats = tracker.getPerformanceStats();
    
    if (perfStats.avgResponseTime > 5000) {
      healthReport.warnings.push('Slow response time');
    }
    
    if (perfStats.errorRate > 0.1) {
      healthReport.warnings.push('High error rate');
    }
    
    healthReport.details.performance = {
      responseTime: `${perfStats.avgResponseTime}ms`,
      errorRate: `${(perfStats.errorRate * 100).toFixed(1)}%`,
      memoryUsage: `${perfStats.memoryUsage}MB`
    };
  } catch (e) {
    healthReport.warnings.push('Performance monitoring unavailable');
  }
  
  // 5. فحص الاتصالات الخارجية
  try {
    const apiValid = validateApiKey();
    healthReport.details.externalServices = apiValid ? '✅ Connected' : '❌ Connection issues';
    
    if (!apiValid && healthReport.overall === 'healthy') {
      healthReport.overall = 'warning';
    }
  } catch (e) {
    healthReport.warnings.push('External services check failed');
  }
  
  // طباعة التقرير
  console.log('\n📋 Health Check Report:');
  console.log(`Overall Status: ${getStatusEmoji(healthReport.overall)} ${healthReport.overall.toUpperCase()}`);
  
  if (healthReport.issues.length > 0) {
    console.log('\n❌ Critical Issues:');
    healthReport.issues.forEach(issue => console.log(`  • ${issue}`));
  }
  
  if (healthReport.warnings.length > 0) {
    console.log('\n⚠️ Warnings:');
    healthReport.warnings.forEach(warning => console.log(`  • ${warning}`));
  }
  
  console.log('\n📊 System Details:');
  Object.entries(healthReport.details).forEach(([key, value]) => {
    console.log(`  ${key}: ${typeof value === 'object' ? JSON.stringify(value) : value}`);
  });
  
  return healthReport;
}

function getStatusEmoji(status) {
  switch (status) {
    case 'healthy': return '✅';
    case 'warning': return '⚠️';
    case 'unhealthy': return '❌';
    case 'critical': return '🚨';
    default: return '❓';
  }
}
```

### 🔍 أداة تشخيص الأخطاء
```javascript
/**
 * تشخيص متقدم للأخطاء
 */
function advancedErrorDiagnostic(error) {
  const diagnostic = {
    timestamp: new Date().toISOString(),
    error: {
      message: error.message,
      stack: error.stack,
      name: error.name
    },
    context: {},
    suggestions: []
  };
  
  // تحليل نوع الخطأ
  if (error.message.includes('API key')) {
    diagnostic.suggestions.push('Check API key configuration');
    diagnostic.suggestions.push('Verify API key permissions');
    diagnostic.context.apiKeyStatus = validateApiKey();
  }
  
  if (error.message.includes('timeout')) {
    diagnostic.suggestions.push('Increase timeout settings');
    diagnostic.suggestions.push('Optimize query complexity');
    diagnostic.context.performanceStats = getPerformanceStats();
  }
  
  if (error.message.includes('not found') || error.message.includes('undefined')) {
    diagnostic.suggestions.push('Check module dependencies');
    diagnostic.suggestions.push('Verify module loading order');
    diagnostic.context.moduleStatus = checkModuleStatus();
  }
  
  if (error.message.includes('quota') || error.message.includes('limit')) {
    diagnostic.suggestions.push('Check API usage limits');
    diagnostic.suggestions.push('Implement rate limiting');
    diagnostic.context.usageStats = getUsageStats();
  }
  
  // جمع معلومات السياق
  diagnostic.context.systemHealth = comprehensiveHealthCheck();
  diagnostic.context.recentLogs = getRecentLogs(10);
  
  console.log('🔍 Error Diagnostic Report:');
  console.log(JSON.stringify(diagnostic, null, 2));
  
  return diagnostic;
}
```

---

## 🛠️ أدوات الإصلاح التلقائي

### 🔧 إصلاح تلقائي للمشاكل الشائعة
```javascript
/**
 * إصلاح تلقائي للمشاكل الشائعة
 */
function autoFix() {
  const fixes = [];
  
  console.log('🔧 Starting automatic fixes...');
  
  // 1. إصلاح إعدادات مفقودة
  try {
    const config = GAssistant.Utils.Injector.get('System.Config.Enhanced');
    const validation = config.validateConfig();
    
    if (!validation.valid) {
      validation.missing.forEach(key => {
        const defaultValue = getDefaultConfigValue(key);
        if (defaultValue) {
          config.set(key, defaultValue);
          fixes.push(`Set default value for ${key}`);
        }
      });
    }
  } catch (e) {
    console.error('Failed to fix configuration:', e.message);
  }
  
  // 2. تنظيف الذاكرة
  try {
    if (typeof gc === 'function') {
      gc();
      fixes.push('Memory cleanup performed');
    }
  } catch (e) {
    // تجاهل إذا لم تكن متاحة
  }
  
  // 3. إعادة تحميل الوحدات المعطلة
  try {
    const brokenModules = findBrokenModules();
    brokenModules.forEach(module => {
      try {
        GAssistant.Utils.Injector.reload(module);
        fixes.push(`Reloaded module: ${module}`);
      } catch (e) {
        console.error(`Failed to reload ${module}:`, e.message);
      }
    });
  } catch (e) {
    console.error('Failed to reload modules:', e.message);
  }
  
  // 4. تحسين الأداء
  try {
    optimizePerformance();
    fixes.push('Performance optimization applied');
  } catch (e) {
    console.error('Failed to optimize performance:', e.message);
  }
  
  // 5. تنظيف البيانات المؤقتة
  try {
    CacheService.getScriptCache().removeAll();
    fixes.push('Cache cleared');
  } catch (e) {
    console.error('Failed to clear cache:', e.message);
  }
  
  console.log(`✅ Auto-fix completed. Applied ${fixes.length} fixes:`);
  fixes.forEach(fix => console.log(`  • ${fix}`));
  
  return fixes;
}

function getDefaultConfigValue(key) {
  const defaults = {
    'DEFAULT_TEMPERATURE': '0.3',
    'MAX_TOKENS': '2000',
    'TIMEOUT_MS': '30000',
    'VERTEX_LOCATION': 'us-central1'
  };
  return defaults[key];
}

function findBrokenModules() {
  const allModules = [
    'System.Config.Enhanced',
    'System.AI.Agents.CFO',
    'System.AI.Agents.Developer',
    'Utils.SystemLogger',
    'Utils.FunctionTracker'
  ];
  
  return allModules.filter(module => {
    try {
      const instance = GAssistant.Utils.Injector.get(module);
      return !instance;
    } catch (e) {
      return true;
    }
  });
}
```

---

## 📊 مراقبة الأداء والتنبيهات

### 📈 مراقبة الأداء في الوقت الفعلي
```javascript
/**
 * مراقبة الأداء المستمرة
 */
function startPerformanceMonitoring() {
  const monitoringInterval = 60000; // دقيقة واحدة
  
  function performanceCheck() {
    try {
      const tracker = GAssistant.Utils.Injector.get('Utils.FunctionTracker');
      const stats = tracker.getCurrentStats();
      
      // فحص زمن الاستجابة
      if (stats.avgResponseTime > 5000) {
        sendAlert('PERFORMANCE', 'High response time detected', {
          responseTime: stats.avgResponseTime,
          threshold: 5000
        });
      }
      
      // فحص معدل الأخطاء
      if (stats.errorRate > 0.1) {
        sendAlert('ERROR_RATE', 'High error rate detected', {
          errorRate: stats.errorRate,
          threshold: 0.1
        });
      }
      
      // فحص استخدام الذاكرة
      if (stats.memoryUsage > 80) {
        sendAlert('MEMORY', 'High memory usage detected', {
          memoryUsage: stats.memoryUsage,
          threshold: 80
        });
      }
      
    } catch (e) {
      console.error('Performance monitoring failed:', e.message);
    }
  }
  
  // تشغيل الفحص الأولي
  performanceCheck();
  
  // جدولة الفحوصات الدورية
  ScriptApp.newTrigger('performanceCheck')
    .timeBased()
    .everyMinutes(1)
    .create();
  
  console.log('✅ Performance monitoring started');
}

function sendAlert(type, message, data) {
  const alert = {
    type: type,
    message: message,
    data: data,
    timestamp: new Date().toISOString(),
    severity: getSeverity(type, data)
  };
  
  console.warn(`🚨 ALERT [${alert.severity}]: ${message}`);
  
  // إرسال بريد إلكتروني للتنبيهات الحرجة
  if (alert.severity === 'CRITICAL') {
    try {
      MailApp.sendEmail({
        to: SpreadsheetApp.getActiveSpreadsheet().getOwner().getEmail(),
        subject: `G-Assistant Alert: ${type}`,
        body: `Alert: ${message}\nData: ${JSON.stringify(data, null, 2)}\nTime: ${alert.timestamp}`
      });
    } catch (e) {
      console.error('Failed to send alert email:', e.message);
    }
  }
  
  // حفظ في سجل التنبيهات
  logAlert(alert);
}

function getSeverity(type, data) {
  switch (type) {
    case 'PERFORMANCE':
      return data.responseTime > 10000 ? 'CRITICAL' : 'WARNING';
    case 'ERROR_RATE':
      return data.errorRate > 0.2 ? 'CRITICAL' : 'WARNING';
    case 'MEMORY':
      return data.memoryUsage > 90 ? 'CRITICAL' : 'WARNING';
    default:
      return 'INFO';
  }
}
```

---

## 🔄 إجراءات الاسترداد

### 💾 نسخ احتياطية واسترداد
```javascript
/**
 * إنشاء نسخة احتياطية شاملة
 */
function createFullBackup() {
  const backup = {
    timestamp: new Date().toISOString(),
    version: '3.0.0',
    configuration: {},
    modules: {},
    data: {}
  };
  
  try {
    // نسخ الإعدادات
    const properties = PropertiesService.getScriptProperties().getProperties();
    backup.configuration = properties;
    
    // نسخ حالة الوحدات
    const moduleList = Object.keys(GAssistant.Utils.Injector._modules || {});
    backup.modules = {
      count: moduleList.length,
      list: moduleList,
      status: 'active'
    };
    
    // نسخ البيانات المهمة
    backup.data = {
      functionRegistry: getFunctionRegistryData(),
      performanceStats: getPerformanceStats(),
      userSettings: getUserSettings()
    };
    
    // حفظ النسخة الاحتياطية
    const backupString = JSON.stringify(backup, null, 2);
    DriveApp.createFile(`G-Assistant-Backup-${Date.now()}.json`, backupString);
    
    console.log('✅ Full backup created successfully');
    return backup;
    
  } catch (e) {
    console.error('❌ Backup creation failed:', e.message);
    throw e;
  }
}

/**
 * استرداد من النسخة الاحتياطية
 */
function restoreFromBackup(backupData) {
  try {
    console.log('🔄 Starting system restore...');
    
    // استرداد الإعدادات
    if (backupData.configuration) {
      PropertiesService.getScriptProperties().setProperties(backupData.configuration);
      console.log('✅ Configuration restored');
    }
    
    // إعادة تهيئة النظام
    delete window.GAssistant;
    
    // إعادة تحميل الوحدات
    eval(getSystemCode());
    
    console.log('✅ System restore completed');
    
    // التحقق من صحة الاستعادة
    const healthCheck = comprehensiveHealthCheck();
    if (healthCheck.overall === 'healthy') {
      console.log('✅ Restore verification passed');
    } else {
      console.warn('⚠️ Restore verification has issues');
    }
    
    return true;
    
  } catch (e) {
    console.error('❌ Restore failed:', e.message);
    return false;
  }
}
```

---

## 📞 الحصول على المساعدة

### 🆘 متى تطلب المساعدة
- المشكلة تستمر بعد تجربة الحلول المقترحة
- أخطاء حرجة تؤثر على العمل
- فقدان البيانات أو الإعدادات
- مشاكل في الأمان أو الخصوصية

### 📧 معلومات مطلوبة عند طلب المساعدة
```javascript
/**
 * جمع معلومات التشخيص للدعم الفني
 */
function collectSupportInfo() {
  const supportInfo = {
    timestamp: new Date().toISOString(),
    version: '3.0.0',
    environment: {
      timezone: Session.getScriptTimeZone(),
      locale: Session.getActiveUserLocale(),
      userEmail: Session.getActiveUser().getEmail()
    },
    systemHealth: comprehensiveHealthCheck(),
    recentErrors: getRecentErrors(20),
    configuration: getConfigurationSummary(),
    performance: getPerformanceStats()
  };
  
  // إزالة المعلومات الحساسة
  delete supportInfo.configuration.GEMINI_API_KEY;
  delete supportInfo.configuration.VERTEX_SERVICE_ACCOUNT_KEY;
  
  const supportData = JSON.stringify(supportInfo, null, 2);
  console.log('📋 Support Information:');
  console.log(supportData);
  
  // حفظ في ملف للإرسال
  DriveApp.createFile(`G-Assistant-Support-${Date.now()}.json`, supportData);
  
  return supportInfo;
}
```

### 📞 قنوات الدعم
- **GitHub Issues**: للمشاكل التقنية والأخطاء
- **Documentation**: مراجعة `docs/` للحلول المفصلة
- **Community Forum**: للأسئلة والنقاشات
- **Email Support**: للمساعدة المباشرة

---

**🔧 استكشاف الأخطاء بذكاء يوفر الوقت ويحسن الأداء**

*تم إنشاء هذا الدليل تلقائياً من نظام التشخيص المتقدم*