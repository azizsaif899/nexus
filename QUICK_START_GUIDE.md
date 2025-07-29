# 🚀 دليل البدء السريع - G-Assistant

**الوقت المطلوب:** 15-20 دقيقة  
**المستوى:** مطور مبتدئ إلى متوسط

---

## 📋 المتطلبات الأساسية

- حساب Google مع إمكانية الوصول لـ Google Apps Script
- مفتاح Gemini API من Google AI Studio
- معرفة أساسية بـ JavaScript

---

## 🛠️ الخطوة 1: إنشاء مشروع Google Apps Script

### 1.1 إنشاء المشروع
```bash
# تثبيت clasp CLI
npm install -g @google/clasp

# تسجيل الدخول
clasp login

# إنشاء مشروع جديد
clasp create --type sheets --title "G-Assistant"
```

### 1.2 إعداد المجلد المحلي
```bash
# استنساخ المشروع
git clone https://github.com/azizsys/g-assistant.git
cd g-assistant

# ربط بمشروع Apps Script
clasp clone [SCRIPT_ID]
```

---

## ⚙️ الخطوة 2: إعداد Script Properties

### 2.1 الإعدادات الأساسية
افتح Google Apps Script Console وأضف في Script Properties:

```javascript
// الإعدادات المطلوبة
GEMINI_API_KEY = "your_gemini_api_key_here"
GEMINI_MODEL = "gemini-2.0-flash-exp"
DEFAULT_TEMPERATURE = "0.3"
MAX_TOKENS = "2000"

// إعدادات اختيارية للميزات المتقدمة
VERTEX_PROJECT_ID = "your_gcp_project_id"
VERTEX_SERVICE_ACCOUNT_KEY = "your_service_account_json"
```

### 2.2 الحصول على Gemini API Key
1. اذهب إلى [Google AI Studio](https://makersuite.google.com/app/apikey)
2. أنشئ مفتاح API جديد
3. انسخ المفتاح وأضفه في Script Properties

---

## 🔨 الخطوة 3: بناء ونشر المشروع

### 3.1 تشغيل البناء
```bash
# تثبيت التبعيات
npm install

# تشغيل البناء
node build.js

# التحقق من النتائج
ls dist/
```

### 3.2 النشر إلى Apps Script
```bash
# نشر الملفات
clasp push

# إنشاء deployment
clasp deploy --description "G-Assistant v3.0.0"
```

---

## 🎯 الخطوة 4: اختبار النظام

### 4.1 التحقق من التحميل
افتح Google Sheets وشغل في Apps Script Console:

```javascript
// اختبار تحميل النظام
GAssistant.System.Setup.initializeProject();

// اختبار الوحدات الأساسية
GAssistant.System.EnhancedTest.runComprehensiveTest();
```

### 4.2 اختبار Gemini API
```javascript
// اختبار اتصال Gemini
GAssistant.AI.Core.ask("مرحبا، هل تعمل؟");

// اختبار الوظائف المخصصة
=GEMINI("ما هو 2+2؟")
```

---

## 🎨 الخطوة 5: تجربة الشريط الجانبي

### 5.1 عرض الشريط الجانبي
في Google Sheets:
1. اذهب إلى **Extensions > Apps Script**
2. شغل دالة `showEnhancedSidebar()`
3. أو استخدم القائمة المخصصة **G-Assistant > عرض الشريط الجانبي**

### 5.2 تجربة الوكلاء
جرب هذه الأوامر في الشريط الجانبي:

```
# وكيل المدير المالي
أنشئ تقرير مالي شهري

# وكيل المطور  
راجع الكود الحالي

# مدير قاعدة البيانات
استورد البيانات من ملف PDF
```

---

## 🔧 استكشاف الأخطاء

### مشاكل شائعة وحلولها:

#### خطأ "Gemini API Key not found"
```javascript
// تحقق من Script Properties
const key = PropertiesService.getScriptProperties().getProperty('GEMINI_API_KEY');
console.log('API Key:', key ? 'موجود' : 'مفقود');
```

#### خطأ "Module not found"
```javascript
// تحقق من تحميل الوحدات
console.log('GAssistant:', typeof GAssistant);
console.log('Modules:', Object.keys(GAssistant || {}));
```

#### مشاكل الأذونات
1. اذهب إلى Apps Script Console
2. **Deploy > Test deployments**
3. امنح الأذونات المطلوبة

---

## 📚 الخطوات التالية

### للمطورين:
1. **اقرأ [دليل المطور](DEVELOPER_GUIDE.md)** للتفاصيل التقنية
2. **استكشف [أمثلة الكود](examples/)** للاستخدامات المتقدمة
3. **راجع [API Documentation](API_DOCS.md)** للواجهات البرمجية

### للمستخدمين:
1. **اقرأ [دليل المستخدم](USER_MANUAL.md)** لتعلم الاستخدام
2. **جرب [القوالب الجاهزة](templates/)** للبدء السريع
3. **انضم لـ [مجتمع المطورين](COMMUNITY.md)** للدعم

---

## 🆘 الحصول على المساعدة

### الدعم التقني:
- **GitHub Issues**: [رفع مشكلة](https://github.com/azizsys/g-assistant/issues)
- **المجتمع**: [منتدى النقاش](https://github.com/azizsys/g-assistant/discussions)
- **الوثائق**: [مركز المساعدة](docs/)

### الموارد المفيدة:
- [Google Apps Script Documentation](https://developers.google.com/apps-script)
- [Gemini API Documentation](https://ai.google.dev/docs)
- [Google Sheets API](https://developers.google.com/sheets/api)

---

## ✅ قائمة التحقق

- [ ] إنشاء مشروع Apps Script
- [ ] إعداد Script Properties
- [ ] تشغيل build.js بنجاح
- [ ] نشر المشروع
- [ ] اختبار النظام الأساسي
- [ ] تجربة الشريط الجانبي
- [ ] اختبار الوكلاء المختلفين

**مبروك! G-Assistant جاهز للاستخدام** 🎉

---

*آخر تحديث: 2024-12-28*