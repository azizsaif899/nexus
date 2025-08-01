# دليل النشر - G-Assistant AI System

## 📋 تعريف الوثيقة
**الغرض**: دليل كامل لنشر مشروع G-Assistant داخل بيئة Google Workspace مع خطوات التثبيت والإعداد والتشغيل  
**الجمهور المستهدف**: مهندسو DevOps والمطورون ومديرو النظم  
**نوع الوثيقة**: وثيقة تقنية - دليل نشر وتشغيل  
**التحديث**: يتم تحديثها مع كل إصدار جديد أو تغيير في متطلبات النشر

---

**الإصدار**: 3.0.0  
**آخر تحديث**: ${new Date().toISOString()}  
**الحالة**: 🚀 جاهز للإنتاج

---

## 🎯 متطلبات النشر

### البيئة التقنية
- **Node.js**: v16.0.0 أو أحدث
- **Google Apps Script CLI**: `npm install -g @google/clasp`
- **Google Cloud Project**: مع APIs مفعلة
- **صلاحيات Google Workspace**: Sheets, Drive, Gmail

### المتطلبات السحابية
```bash
# Google Cloud APIs المطلوبة
- Generative Language API (Gemini)
- Vertex AI API
- Document AI API
- Cloud Logging API
- BigQuery API (اختياري)
```

---

## 🔧 خطوات النشر

### 1. إعداد البيئة المحلية
```bash
git clone https://github.com/azizsys/g-assistant.git
cd g-assistant
npm install
clasp login
```

### 2. إعداد Google Cloud
```bash
gcloud projects create your-project-id
gcloud services enable generativelanguage.googleapis.com
gcloud services enable aiplatform.googleapis.com
gcloud services enable documentai.googleapis.com
```

### 3. تكوين المتغيرات
```javascript
// في Google Apps Script > Project Settings > Script Properties
GEMINI_API_KEY=your_gemini_api_key
VERTEX_PROJECT_ID=your-project-id
VERTEX_SERVICE_ACCOUNT_KEY={"type":"service_account",...}
DEFAULT_TEMPERATURE=0.3
MAX_TOKENS=2000
```

### 4. النشر
```bash
npm run build
clasp push
clasp deploy --description "G-Assistant v3.0.0"
```

---

## ⚠️ تحذيرات مهمة

- **لا تشارك مفاتيح API** في الكود المصدري
- **استخدم PropertiesService** للإعدادات الحساسة
- **فعّل 2FA** على جميع الحسابات
- **نسخ احتياطي يومي** من Script Properties

---

## 📊 مراقبة الإنتاج

```javascript
// تفعيل المراقبة المتقدمة
const logger = GAssistant.Utils.Injector.get('Utils.SystemLogger');
logger.setLevel('INFO');

// مراقبة الاستخدام
const tracker = GAssistant.Utils.Injector.get('Utils.FunctionTracker');
const stats = tracker.getUsageStats();
```

---

## ✅ قائمة التحقق النهائية

- [ ] تم تثبيت جميع التبعيات
- [ ] تم إعداد Google Cloud Project
- [ ] تم تكوين Service Account
- [ ] تم تعيين جميع Script Properties
- [ ] تم اختبار الوحدات الأساسية
- [ ] تم تفعيل المراقبة والتسجيل

**🎉 مبروك! G-Assistant جاهز للإنتاج**