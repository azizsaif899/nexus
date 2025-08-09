# دليل استخدام المكتبة - G-Assistant AI System

## 📋 تعريف الوثيقة
**الغرض**: دليل شامل لاستخدام G-Assistant كمكتبة خارجية في مشاريع Google Apps Script الأخرى للاستفادة من قدراته المتقدمة في الذكاء الاصطناعي والأتمتة  
**الجمهور المستهدف**: المطورون الخارجيون والفرق التقنية التي تريد دمج G-Assistant في مشاريعها  
**نوع الوثيقة**: وثيقة تقنية - دليل تكامل وAPI  
**التحديث**: يتم تحديثها مع كل إصدار جديد أو إضافة ميزات API جديدة

---

**الإصدار**: 3.0.0  
**آخر تحديث**: ${new Date().toISOString()}

---

## 📚 استيراد G-Assistant كمكتبة خارجية

يمكن استخدام G-Assistant كمكتبة في مشاريع Google Apps Script الأخرى للاستفادة من قدراته المتقدمة.

---

## 🚀 التثبيت والإعداد

### 1. إضافة المكتبة
```javascript
// في مشروع Apps Script الخاص بك
// اذهب إلى Libraries > Add a library
// أدخل Script ID: 1BxKMvhuDub9Z2kMF_your_script_id_here
// اختر أحدث إصدار واحفظ
```

### 2. تهيئة المكتبة
```javascript
/**
 * تهيئة مكتبة G-Assistant في مشروعك
 */
function initializeGAssistant() {
  // تحقق من توفر المكتبة
  if (typeof GAssistantLib === 'undefined') {
    throw new Error('G-Assistant library not found. Please add it to your project.');
  }
  
  // تهيئة الإعدادات الأساسية
  GAssistantLib.initialize({
    apiKey: 'your_gemini_api_key',
    projectId: 'your_vertex_project_id',
    logLevel: 'INFO'
  });
  
  console.log('G-Assistant library initialized successfully');
}
```

---

## 🤖 استخدام الوكلاء الذكيين

### الوكيل المالي (CFO Agent)
```javascript
/**
 * استخدام الوكيل المالي لتحليل البيانات
 */
function useCFOAgent() {
  // الحصول على الوكيل المالي
  const cfoAgent = GAssistantLib.getAgent('CFO');
  
  // تشغيل تقرير الربح والخسارة
  const pnlReport = cfoAgent.runMonthlyPNL();
  console.log('P&L Report:', pnlReport);
  
  // تحليل الاتجاهات المالية
  const trends = cfoAgent.analyzeFinancialTrends({ period: '3months' });
  console.log('Financial Trends:', trends);
  
  // استعلام مالي عام
  const analysis = cfoAgent.handleRequest({
    sessionId: 'user123',
    message: 'ما هي أفضل استراتيجية لتقليل التكاليف؟',
    intent: { type: 'general_query' }
  });
  console.log('Financial Advice:', analysis);
}
```

### وكيل المطور (Developer Agent)
```javascript
/**
 * استخدام وكيل المطور لمراجعة الكود
 */
function useDeveloperAgent() {
  const devAgent = GAssistantLib.getAgent('Developer');
  
  // مراجعة كود
  const codeToReview = `
    function calculateTotal(items) {
      let total = 0;
      for (let i = 0; i < items.length; i++) {
        total += items[i].price;
      }
      return total;
    }
  `;
  
  const review = devAgent.reviewCode(codeToReview);
  console.log('Code Review:', review);
  
  // توليد كود
  const newCode = devAgent.generateCode({
    description: 'دالة لحساب المتوسط من مصفوفة أرقام',
    language: 'javascript'
  });
  console.log('Generated Code:', newCode);
}
```

### مدير قاعدة البيانات (Database Manager)
```javascript
/**
 * استخدام مدير قاعدة البيانات
 */
function useDatabaseManager() {
  const dbManager = GAssistantLib.getAgent('DatabaseManager');
  
  // تنظيم البيانات
  const organizationResult = dbManager.organizeData({
    sheetName: 'CustomerData',
    criteria: 'remove_duplicates'
  });
  console.log('Data Organization:', organizationResult);
  
  // التحقق من جودة البيانات
  const validation = dbManager.validateData({
    range: 'A1:Z100',
    rules: ['no_empty_cells', 'valid_emails', 'consistent_formats']
  });
  console.log('Data Validation:', validation);
}
```

---

## 🛠️ استخدام الأدوات المتقدمة

### ورشة الكود الآمنة
```javascript
/**
 * استخدام ورشة الكود لتعديلات آمنة
 */
function useCodeWorkshop() {
  const workshop = GAssistantLib.getWorkshop();
  
  // إنشاء ملف جديد
  const createResult = workshop.applyCodeModification({
    targetFile: 'MyNewModule.gs',
    operation: 'CREATE',
    content: `
      function myNewFunction() {
        return 'Hello from new module!';
      }
    `,
    metadata: {
      author: 'external_project',
      reason: 'adding_new_functionality'
    }
  });
  
  console.log('File Creation:', createResult);
  
  // تحديث ملف موجود
  const updateResult = workshop.applyCodeModification({
    targetFile: 'MyNewModule.gs',
    operation: 'UPDATE',
    content: `
      function myNewFunction() {
        console.log('Updated function');
        return 'Hello from updated module!';
      }
    `
  });
  
  console.log('File Update:', updateResult);
}
```

### مولد التوثيق
```javascript
/**
 * استخدام مولد التوثيق التلقائي
 */
function useDocumentationGenerator() {
  const docGen = GAssistantLib.getDocumentationGenerator();
  
  // توليد توثيق للمشروع الحالي
  const projectDocs = docGen.generateProjectDocumentation({
    format: 'markdown',
    includeExamples: true,
    includeStats: true,
    outputPath: 'docs/'
  });
  
  console.log('Project Documentation:', projectDocs);
  
  // توليد توثيق لدالة محددة
  const functionDocs = docGen.generateFunctionDocumentation({
    functionName: 'myFunction',
    includeUsageExamples: true
  });
  
  console.log('Function Documentation:', functionDocs);
}
```

### متتبع الأداء
```javascript
/**
 * استخدام متتبع الأداء
 */
function usePerformanceTracker() {
  const tracker = GAssistantLib.getPerformanceTracker();
  
  // تتبع دالة معينة
  function mySlowFunction() {
    Utilities.sleep(2000); // محاكاة عملية بطيئة
    return 'Done';
  }
  
  const trackedFunction = tracker.trackFunction('mySlowFunction', mySlowFunction);
  const result = trackedFunction();
  
  // الحصول على إحصائيات الأداء
  const stats = tracker.getFunctionStats('mySlowFunction');
  console.log('Performance Stats:', stats);
  
  // تقرير أداء شامل
  const report = tracker.generatePerformanceReport();
  console.log('Performance Report:', report);
}
```

---

## 🔧 التكامل مع Google Sheets

### معالجة البيانات الذكية
```javascript
/**
 * معالجة بيانات الجدول باستخدام الذكاء الاصطناعي
 */
function processSheetData() {
  const sheet = SpreadsheetApp.getActiveSheet();
  const data = sheet.getDataRange().getValues();
  
  // تحليل البيانات باستخدام G-Assistant
  const analysis = GAssistantLib.analyzeData({
    data: data,
    analysisType: 'financial', // أو 'statistical', 'predictive'
    includeRecommendations: true
  });
  
  console.log('Data Analysis:', analysis);
  
  // إنشاء تقرير تلقائي
  const report = GAssistantLib.generateReport({
    data: data,
    reportType: 'summary',
    includeCharts: true,
    outputSheet: 'Analysis_Report'
  });
  
  console.log('Report Generated:', report);
}
```

### الدوال المخصصة في الخلايا
```javascript
/**
 * إضافة دوال G-Assistant المخصصة للاستخدام في الخلايا
 */

/**
 * دالة مخصصة لتحليل النص باستخدام Gemini
 * @param {string} text النص المراد تحليله
 * @param {string} analysisType نوع التحليل (sentiment, summary, keywords)
 * @return {string} نتيجة التحليل
 * @customfunction
 */
function GASSISTANT_ANALYZE(text, analysisType = 'summary') {
  try {
    const result = GAssistantLib.analyzeText({
      text: text,
      type: analysisType
    });
    
    return result.text || result.summary || 'تعذر التحليل';
  } catch (e) {
    return `خطأ: ${e.message}`;
  }
}

/**
 * دالة مخصصة لتوليد المحتوى
 * @param {string} prompt الطلب أو الوصف
 * @param {number} maxLength الحد الأقصى لطول النص
 * @return {string} المحتوى المولد
 * @customfunction
 */
function GASSISTANT_GENERATE(prompt, maxLength = 500) {
  try {
    const result = GAssistantLib.generateContent({
      prompt: prompt,
      maxTokens: maxLength,
      temperature: 0.7
    });
    
    return result.text || 'تعذر التوليد';
  } catch (e) {
    return `خطأ: ${e.message}`;
  }
}
```

---

## 📊 مراقبة الاستخدام والأداء

### إعداد المراقبة
```javascript
/**
 * إعداد مراقبة شاملة للمكتبة
 */
function setupMonitoring() {
  // تفعيل التسجيل المتقدم
  GAssistantLib.enableAdvancedLogging({
    level: 'INFO',
    includePerformanceMetrics: true,
    sendToCloudLogging: true
  });
  
  // إعداد تنبيهات الأداء
  GAssistantLib.setPerformanceAlerts({
    slowFunctionThreshold: 5000, // 5 ثوان
    memoryUsageThreshold: 100, // 100 MB
    errorRateThreshold: 0.05 // 5%
  });
  
  // تفعيل تتبع الاستخدام
  GAssistantLib.enableUsageTracking({
    trackFunctionCalls: true,
    trackDataProcessing: true,
    generateDailyReports: true
  });
}
```

### تقارير الاستخدام
```javascript
/**
 * توليد تقارير استخدام المكتبة
 */
function generateUsageReports() {
  // تقرير الاستخدام اليومي
  const dailyReport = GAssistantLib.getUsageReport('daily');
  console.log('Daily Usage:', dailyReport);
  
  // تقرير الأداء
  const performanceReport = GAssistantLib.getPerformanceReport();
  console.log('Performance Report:', performanceReport);
  
  // إحصائيات الوكلاء
  const agentStats = GAssistantLib.getAgentStatistics();
  console.log('Agent Statistics:', agentStats);
  
  // إرسال التقارير بالبريد الإلكتروني
  GAssistantLib.emailReports({
    recipients: ['admin@company.com'],
    frequency: 'weekly',
    includeCharts: true
  });
}
```

---

## 🔒 الأمان وأفضل الممارسات

### إدارة المفاتيح الآمنة
```javascript
/**
 * إعداد آمن للمفاتيح والإعدادات
 */
function secureSetup() {
  // استخدام PropertiesService لحفظ المفاتيح الحساسة
  const properties = PropertiesService.getScriptProperties();
  
  // تعيين المفاتيح (مرة واحدة فقط)
  properties.setProperties({
    'GASSISTANT_API_KEY': 'your_secure_api_key',
    'GASSISTANT_PROJECT_ID': 'your_project_id',
    'GASSISTANT_LOG_LEVEL': 'INFO'
  });
  
  // تهيئة المكتبة بالمفاتيح الآمنة
  GAssistantLib.initializeSecure({
    getApiKey: () => properties.getProperty('GASSISTANT_API_KEY'),
    getProjectId: () => properties.getProperty('GASSISTANT_PROJECT_ID'),
    getLogLevel: () => properties.getProperty('GASSISTANT_LOG_LEVEL')
  });
}
```

### التحكم في الصلاحيات
```javascript
/**
 * إعداد التحكم في الصلاحيات
 */
function setupAccessControl() {
  // تحديد المستخدمين المصرح لهم
  const authorizedUsers = [
    'admin@company.com',
    'developer@company.com'
  ];
  
  // فحص الصلاحيات قبل كل عملية
  GAssistantLib.setAccessControl({
    checkUserPermissions: true,
    authorizedUsers: authorizedUsers,
    requireAuthentication: true,
    logAccessAttempts: true
  });
}
```

---

## 🧪 اختبار التكامل

### اختبارات أساسية
```javascript
/**
 * اختبار التكامل الأساسي مع المكتبة
 */
function testLibraryIntegration() {
  const tests = [];
  
  // اختبار تهيئة المكتبة
  try {
    GAssistantLib.initialize({ apiKey: 'test_key' });
    tests.push({ name: 'Library Initialization', status: 'PASS' });
  } catch (e) {
    tests.push({ name: 'Library Initialization', status: 'FAIL', error: e.message });
  }
  
  // اختبار الوكلاء
  try {
    const cfo = GAssistantLib.getAgent('CFO');
    if (cfo && typeof cfo.handleRequest === 'function') {
      tests.push({ name: 'CFO Agent Access', status: 'PASS' });
    } else {
      tests.push({ name: 'CFO Agent Access', status: 'FAIL', error: 'Agent not accessible' });
    }
  } catch (e) {
    tests.push({ name: 'CFO Agent Access', status: 'FAIL', error: e.message });
  }
  
  // اختبار الأدوات
  try {
    const workshop = GAssistantLib.getWorkshop();
    if (workshop && typeof workshop.applyCodeModification === 'function') {
      tests.push({ name: 'Code Workshop Access', status: 'PASS' });
    } else {
      tests.push({ name: 'Code Workshop Access', status: 'FAIL', error: 'Workshop not accessible' });
    }
  } catch (e) {
    tests.push({ name: 'Code Workshop Access', status: 'FAIL', error: e.message });
  }
  
  // طباعة النتائج
  console.log('Integration Test Results:');
  tests.forEach(test => {
    console.log(`${test.status === 'PASS' ? '✅' : '❌'} ${test.name}`);
    if (test.error) console.log(`   Error: ${test.error}`);
  });
  
  return tests;
}
```

---

## 📋 أمثلة عملية شاملة

### مشروع تحليل مالي متكامل
```javascript
/**
 * مثال شامل: نظام تحليل مالي باستخدام G-Assistant
 */
function createFinancialAnalysisSystem() {
  // تهيئة النظام
  initializeGAssistant();
  
  // إعداد الجداول المطلوبة
  const sheets = {
    transactions: SpreadsheetApp.getActiveSpreadsheet().getSheetByName('Transactions'),
    reports: SpreadsheetApp.getActiveSpreadsheet().getSheetByName('Reports') || 
             SpreadsheetApp.getActiveSpreadsheet().insertSheet('Reports'),
    dashboard: SpreadsheetApp.getActiveSpreadsheet().getSheetByName('Dashboard') || 
               SpreadsheetApp.getActiveSpreadsheet().insertSheet('Dashboard')
  };
  
  // تحليل البيانات المالية
  const cfoAgent = GAssistantLib.getAgent('CFO');
  
  // تشغيل التحليلات المختلفة
  const analyses = {
    monthly: cfoAgent.runMonthlyPNL(),
    trends: cfoAgent.analyzeFinancialTrends({ period: '6months' }),
    recommendations: cfoAgent.handleRequest({
      sessionId: 'financial_system',
      message: 'قدم توصيات لتحسين الأداء المالي بناءً على البيانات الحالية',
      intent: { type: 'general_query' }
    })
  };
  
  // إنشاء التقارير
  const docGen = GAssistantLib.getDocumentationGenerator();
  const financialReport = docGen.generateCustomReport({
    title: 'تقرير التحليل المالي الشامل',
    data: analyses,
    includeCharts: true,
    format: 'html'
  });
  
  // حفظ النتائج في الجداول
  sheets.reports.clear();
  sheets.reports.getRange(1, 1).setValue('تقرير التحليل المالي');
  sheets.reports.getRange(2, 1).setValue(new Date());
  sheets.reports.getRange(4, 1).setValue(JSON.stringify(analyses, null, 2));
  
  // إرسال التقرير بالبريد الإلكتروني
  const owner = SpreadsheetApp.getActiveSpreadsheet().getOwner().getEmail();
  MailApp.sendEmail({
    to: owner,
    subject: 'تقرير التحليل المالي الشامل',
    htmlBody: financialReport
  });
  
  console.log('Financial Analysis System created successfully');
  return analyses;
}
```

---

## 🔄 التحديث والصيانة

### تحديث المكتبة
```javascript
/**
 * فحص وتحديث إصدار المكتبة
 */
function updateLibrary() {
  // فحص الإصدار الحالي
  const currentVersion = GAssistantLib.getVersion();
  console.log('Current version:', currentVersion);
  
  // فحص التحديثات المتاحة
  const updates = GAssistantLib.checkForUpdates();
  if (updates.available) {
    console.log('Update available:', updates.latestVersion);
    console.log('Changes:', updates.changelog);
    
    // تحديث تلقائي (إذا كان مفعلاً)
    if (updates.autoUpdate) {
      const updateResult = GAssistantLib.performUpdate();
      console.log('Update result:', updateResult);
    }
  } else {
    console.log('Library is up to date');
  }
}
```

---

## 📞 الدعم والمساعدة

### الحصول على المساعدة
- **GitHub Repository**: [github.com/azizsys/g-assistant](https://github.com/azizsys/g-assistant)
- **Documentation**: مراجعة مجلد `docs/` للتفاصيل الكاملة
- **Issues**: استخدم GitHub Issues للمشاكل التقنية
- **Discussions**: GitHub Discussions للأسئلة العامة

### معلومات التشخيص
```javascript
/**
 * جمع معلومات التشخيص للدعم الفني
 */
function collectDiagnostics() {
  const diagnostics = {
    libraryVersion: GAssistantLib.getVersion(),
    timestamp: new Date().toISOString(),
    environment: {
      appsScriptVersion: Utilities.getUuid(), // معرف فريد للجلسة
      timezone: Session.getScriptTimeZone(),
      locale: Session.getActiveUserLocale()
    },
    configuration: GAssistantLib.getConfiguration(),
    performance: GAssistantLib.getPerformanceMetrics(),
    errors: GAssistantLib.getRecentErrors()
  };
  
  console.log('Diagnostics:', JSON.stringify(diagnostics, null, 2));
  return diagnostics;
}
```

---

**🎯 G-Assistant كمكتبة: قوة الذكاء الاصطناعي في متناول مشاريعك**

*تم إنشاء هذا الدليل تلقائياً من نظام التوثيق المتقدم*