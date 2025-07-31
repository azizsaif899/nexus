# 👨‍💻 دليل المطورين - AzizSys

## 🚀 نظرة عامة

AzizSys هو نظام إدارة ذكي متكامل مبني على Google Apps Script مع تكامل كامل مع Gemini AI. يستخدم النظام معمارية معيارية متقدمة مع نظام حقن التبعيات المخصص.

## 🏗️ المعمارية

### نظام الوحدات
```javascript
// تعريف وحدة جديدة
defineModule('System.Tools.NewTool', ({ Utils, Config }) => {
  return {
    processData(data) {
      // منطق المعالجة
    }
  };
});
```

### حقن التبعيات
```javascript
// الحصول على وحدة
const tool = Injector.get('System.Tools.NewTool');

// التحقق من جاهزية الوحدة
if (ModuleVerifier.isReady('AI.Core')) {
  // استخدام الوحدة
}
```

## 📦 إضافة وحدة جديدة

### 1. إنشاء الملف
```javascript
// في 30_tools/new_tool.js
defineModule('System.Tools.NewTool', ({ Utils, Config }) => {
  return {
    summarizeData() {
      // منطق التلخيص
    }
  };
});
```

### 2. تسجيل في المانيفست
```json
{
  "module": "System.Tools.NewTool",
  "file": "30_tools/new_tool.js",
  "dependencies": ["System.Utils", "System.Config"]
}
```

### 3. تحديث ترتيب التحميل
```bash
node scripts/generatePushOrder.js
```

### 4. التوثيق
```javascript
DocsManager.registerModuleDocs('System.Tools.NewTool', {
  summary: 'أداة تحليل وتلخيص البيانات',
  functions: {
    summarizeData: 'تلخيص جدول البيانات'
  }
});
```

## 🛡️ البرمجة الدفاعية

### التحقق من التبعيات
```javascript
if (!ModuleVerifier.isReady('AI.Core')) {
  return Dialogue.createError('الوحدة AI.Core غير جاهزة');
}
```

### استخدام Fallback
```javascript
const agent = Injector.get('AgentsCatalog')?.handleRequest ?? (() => {
  return Dialogue.createError('الوكيل غير متاح حالياً');
});
```

## 🔍 أدوات التشخيص

| الأداة | الوصف |
|-------|--------|
| `reportModulesStatus()` | حالة الوحدات الأساسية |
| `runDocumentationAudit()` | الوحدات غير الموثقة |
| `ModuleVerifier.scanAll()` | فحص جاهزية الوحدات |
| `DependencyGuardian.waitFor()` | انتظار تحميل وحدة |

## 🔄 سير العمل للنشر

### 1. البناء
```bash
node scripts/generatePushOrder.js
```

### 2. النشر
```bash
clasp push
```

### 3. الاختبار
```javascript
// في Google Apps Script Console
initializeSystem();
debugModules();
testSystem();
```

## 📋 أفضل الممارسات

### التسمية
- استخدم `System.Domain.Functionality`
- الوحدات الأساسية تبدأ بـ `00_`
- الواجهة تُحمل أخيراً

### تجنب التبعيات الدائرية
- استخدم نمط الكتالوج
- فصل المسؤوليات
- استخدم دوال التهيئة الخارجية

### معالجة الأخطاء
```javascript
try {
  const result = processData(data);
  return Dialogue.createSuccess(result);
} catch (error) {
  Logger.error('خطأ في معالجة البيانات', error);
  return Dialogue.createError('فشل في المعالجة');
}
```

## 🧪 الاختبارات

### اختبار الوحدة
```javascript
function testNewTool() {
  const tool = Injector.get('System.Tools.NewTool');
  const result = tool.summarizeData(testData);
  
  if (result.success) {
    Logger.log('✅ اختبار ناجح');
  } else {
    Logger.error('❌ اختبار فاشل');
  }
}
```

### اختبار التكامل
```javascript
function testSystemIntegration() {
  // اختبار تفاعل الوحدات
  const ai = Injector.get('AI.Core');
  const tools = Injector.get('Tools.Catalog');
  
  // اختبار السيناريو الكامل
}
```

## 🔧 استكشاف الأخطاء

### خطأ `defineModule is not defined`
- تحقق من ترتيب التحميل
- تأكد من تحميل `00_utils.js` أولاً

### خطأ `Cannot read properties of undefined`
- تحقق من تسجيل الوحدة في Injector
- استخدم `ModuleVerifier.isReady()`

### تبعيات دائرية
- راجع `module_manifest.json`
- استخدم نمط الكتالوج
- فصل المنطق المشترك

## 📚 الموارد

- [دليل المستخدم](./USER_MANUAL.md)
- [دليل النشر](./DEPLOYMENT_GUIDE.md)
- [إرشادات المعمارية](./ARCHITECTURE_GUIDELINES.md)
- [استكشاف الأخطاء](./TROUBLESHOOTING.md)