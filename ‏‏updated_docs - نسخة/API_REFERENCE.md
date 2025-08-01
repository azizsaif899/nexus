# 📚 مرجع API - AzizSys

## 🎯 نظرة عامة

هذا المرجع يوضح جميع واجهات البرمجة المتاحة في نظام AzizSys للمطورين والمستخدمين المتقدمين.

## 🌍 واجهات API الجديدة (v2)

### معالجة متعددة اللغات
```javascript
// POST /v2/process
const response = await fetch('/v2/process', {
  method: 'POST',
  headers: {
    'Authorization': 'Bearer {TOKEN}',
    'Content-Type': 'application/json'
  },
  body: JSON.stringify({
    "text": "نص المدخل",
    "language": "ar|en|fr",
    "context": {} // اختياري
  })
});
```

### إدارة السياق
```javascript
// GET /v2/context/:userId
const contextData = await fetch('/v2/context/user123', {
  headers: { 'Authorization': 'Bearer {TOKEN}' }
});

// Response
{
  "status": "success",
  "context": {
    "conversation_history": [],
    "preferences": {},
    "last_interaction": "2024-12-19T10:30:00Z"
  }
}
```

### معالجة التشابه الدلالي
```javascript
// POST /v2/embedding/similarity
const similarity = await fetch('/v2/embedding/similarity', {
  method: 'POST',
  body: JSON.stringify({
    "query": "البحث عن مستندات مشابهة",
    "threshold": 0.8,
    "limit": 10
  })
});
```

## 🤖 AI Core API

### AI.Core.query()
```javascript
AI.Core.query(prompt, options = {})
```

**المعاملات:**
- `prompt` (string): النص المراد معالجته
- `options` (object): خيارات إضافية
  - `model` (string): نموذج Gemini المستخدم
  - `temperature` (number): درجة الإبداع (0-1)
  - `maxTokens` (number): الحد الأقصى للرموز

**المثال:**
```javascript
const response = await AI.Core.query("حلل هذه البيانات المالية", {
  model: "gemini-pro",
  temperature: 0.1
});
```

### AI.LongTermMemory
```javascript
// حفظ في الذاكرة
AI.LongTermMemory.store(key, data, category);

// استرجاع من الذاكرة
const data = AI.LongTermMemory.retrieve(key);

// البحث في الذاكرة
const results = AI.LongTermMemory.search(query);
```

## 🤵 Agents API

### Agents.CFO
```javascript
// تحليل مالي
const analysis = await Agents.CFO.analyzeFinancials(data);

// إنشاء تقرير مالي
const report = await Agents.CFO.generateReport(type, period);

// حساب المؤشرات المالية
const metrics = Agents.CFO.calculateMetrics(financialData);
```

### Agents.Developer
```javascript
// مراجعة الكود
const review = await Agents.Developer.reviewCode(code);

// إنشاء وثائق
const docs = await Agents.Developer.generateDocs(codebase);

// تحليل الأداء
const performance = Agents.Developer.analyzePerformance(code);
```

## 📊 Tools API

### Tools.Sheets
```javascript
// قراءة البيانات
const data = Tools.Sheets.read(range);

// كتابة البيانات
Tools.Sheets.write(range, data);

// إنشاء ورقة جديدة
const sheet = Tools.Sheets.createSheet(name, headers);

// تنسيق البيانات
Tools.Sheets.format(range, formatting);
```

### Tools.Financial
```javascript
// حساب الربح والخسارة
const pl = Tools.Financial.calculatePL(revenue, expenses);

// تحليل التدفق النقدي
const cashFlow = Tools.Financial.analyzeCashFlow(data);

// حساب النسب المالية
const ratios = Tools.Financial.calculateRatios(financials);
```

## 🎨 UI API

### UI.Sidebar
```javascript
// فتح الشريط الجانبي
UI.Sidebar.show();

// إغلاق الشريط الجانبي
UI.Sidebar.hide();

// تحديث المحتوى
UI.Sidebar.update(content);

// إضافة رسالة
UI.Sidebar.addMessage(message, type);
```

### UI.ConfigPanel
```javascript
// فتح لوحة الإعدادات
UI.ConfigPanel.open();

// حفظ الإعدادات
UI.ConfigPanel.save(settings);

// استرجاع الإعدادات
const settings = UI.ConfigPanel.load();
```

## ⚙️ System API

### System.Config
```javascript
// الحصول على إعداد
const value = System.Config.get(key);

// تعيين إعداد
System.Config.set(key, value);

// حفظ الإعدادات
System.Config.save();

// إعادة تحميل الإعدادات
System.Config.reload();
```

### System.Logger
```javascript
// تسجيل معلومات
System.Logger.info(message, data);

// تسجيل تحذير
System.Logger.warn(message, data);

// تسجيل خطأ
System.Logger.error(message, error);

// تسجيل تشخيص
System.Logger.debug(message, data);
```

## 🔧 Utils API

### Utils.DataProcessor
```javascript
// تنظيف البيانات
const cleaned = Utils.DataProcessor.clean(data);

// تحويل البيانات
const converted = Utils.DataProcessor.convert(data, format);

// التحقق من صحة البيانات
const isValid = Utils.DataProcessor.validate(data, schema);
```

### Utils.FileHandler
```javascript
// قراءة ملف
const content = Utils.FileHandler.read(fileId);

// كتابة ملف
Utils.FileHandler.write(fileId, content);

// إنشاء ملف
const newFile = Utils.FileHandler.create(name, content);
```

## 🔍 Monitoring API

### System.Monitoring
```javascript
// تفعيل المراقبة
System.Monitoring.enable();

// الحصول على المقاييس
const metrics = System.Monitoring.getMetrics();

// إعداد التنبيهات
System.Monitoring.setAlerts(config);

// إنشاء تقرير
const report = System.Monitoring.generateReport();
```

## 🔐 Security API

### System.Security
```javascript
// تشفير البيانات
const encrypted = System.Security.encrypt(data);

// فك التشفير
const decrypted = System.Security.decrypt(encryptedData);

// التحقق من الصلاحيات
const hasPermission = System.Security.checkPermission(action);
```

## 📱 Automation API

### Automation.TaskScheduler
```javascript
// جدولة مهمة
Automation.TaskScheduler.schedule(task, interval);

// إلغاء مهمة
Automation.TaskScheduler.cancel(taskId);

// الحصول على المهام المجدولة
const tasks = Automation.TaskScheduler.getTasks();
```

### Automation.SmartTriggers
```javascript
// إضافة مشغل
Automation.SmartTriggers.add(event, callback);

// إزالة مشغل
Automation.SmartTriggers.remove(triggerId);

// تفعيل المشغلات
Automation.SmartTriggers.enable();
```

## 🧪 Testing API

### Testing.UnitTest
```javascript
// إنشاء اختبار
Testing.UnitTest.create(name, testFunction);

// تشغيل الاختبارات
const results = Testing.UnitTest.run();

// إنشاء تقرير
const report = Testing.UnitTest.generateReport();
```

## 📊 الوظائف المخصصة في Google Sheets

### GEMINI()
```excel
=GEMINI("ما هو عاصمة السعودية؟")
=GEMINI(A1, "PRO", 0.1)
```

### GEMINI_ANALYZE()
```excel
=GEMINI_ANALYZE(A1:C10, "summary")
=GEMINI_ANALYZE(D1:D20, "trends")
```

### GEMINI_CODE()
```excel
=GEMINI_CODE("دالة لحساب الضريبة", "javascript")
```

### GEMINI_FORMULA()
```excel
=GEMINI_FORMULA("حساب النسبة المئوية للنمو")
```

## 🔄 Event System

### إطلاق الأحداث
```javascript
// إطلاق حدث
EventSystem.emit('user_action', data);

// الاستماع للأحداث
EventSystem.on('user_action', callback);

// إزالة مستمع
EventSystem.off('user_action', callback);
```

### الأحداث المتاحة
- `system_ready`: النظام جاهز
- `user_query`: استعلام المستخدم
- `agent_response`: استجابة الوكيل
- `data_updated`: تحديث البيانات
- `error_occurred`: حدوث خطأ

## 📋 أمثلة عملية

### مثال شامل: تحليل مالي
```javascript
async function performFinancialAnalysis() {
  try {
    // قراءة البيانات
    const data = Tools.Sheets.read('A1:Z100');
    
    // تنظيف البيانات
    const cleanData = Utils.DataProcessor.clean(data);
    
    // تحليل مالي
    const analysis = await Agents.CFO.analyzeFinancials(cleanData);
    
    // إنشاء تقرير
    const report = await Agents.CFO.generateReport('monthly', analysis);
    
    // عرض النتائج
    UI.Sidebar.addMessage(report, 'success');
    
    // حفظ في الذاكرة
    AI.LongTermMemory.store('last_analysis', analysis, 'financial');
    
    return analysis;
    
  } catch (error) {
    System.Logger.error('خطأ في التحليل المالي', error);
    UI.Sidebar.addMessage('فشل في التحليل', 'error');
  }
}
```

### مثال: أتمتة التقارير
```javascript
function setupAutomatedReports() {
  // جدولة تقرير شهري
  Automation.TaskScheduler.schedule({
    name: 'monthly_report',
    function: generateMonthlyReport,
    interval: 'monthly',
    day: 1,
    hour: 9
  });
  
  // إعداد مشغل عند تغيير البيانات
  Automation.SmartTriggers.add('data_change', (event) => {
    if (event.range.includes('Revenue')) {
      generateQuickAnalysis();
    }
  });
}
```

## 🔍 استكشاف الأخطاء

### أخطاء شائعة
```javascript
// خطأ في الوحدة
if (!ModuleVerifier.isReady('AI.Core')) {
  throw new Error('وحدة AI.Core غير جاهزة');
}

// خطأ في API
try {
  const response = await AI.Core.query(prompt);
} catch (error) {
  if (error.code === 'RATE_LIMIT') {
    // إعادة المحاولة بعد تأخير
    await Utils.delay(1000);
    return AI.Core.query(prompt);
  }
}
```

---

## 📞 الدعم

للحصول على مساعدة إضافية:
- راجع [دليل المطورين](./DEVELOPER_GUIDE.md)
- تحقق من [استكشاف الأخطاء](./TROUBLESHOOTING.md)
- اطلع على [أمثلة عملية](./EXAMPLES.md)