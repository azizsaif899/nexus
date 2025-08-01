# 🚀 دليل النشر - AzizSys

## 🎯 نظرة عامة

هذا الدليل يوضح كيفية نشر نظام AzizSys في بيئة الإنتاج باتباع أفضل الممارسات مع عملية بناء احترافية.

## 📋 المتطلبات الأساسية

### البيئة المحلية
```bash
# التحقق من Node.js
node --version  # يجب أن يكون v16+

# التحقق من npm
npm --version

# التحقق من clasp
clasp --version
```

### مفاتيح API المطلوبة
- **GEMINI_API_KEY**: مفتاح Gemini AI
- **LANGSMITH_API_KEY**: مفتاح LangSmith (اختياري)
- **GOOGLE_SERVICE_ACCOUNT**: حساب الخدمة (للتكامل المتقدم)

## 🔧 المرحلة الأولى: الإعداد المحلي

### 1. تثبيت التبعيات
```bash
# الانتقال لمجلد المشروع
cd azizsys5

# تثبيت التبعيات
npm install

# تثبيت clasp عالمياً (إذا لم يكن مثبتاً)
npm install -g @google/clasp
```

### 2. إعداد البيئة
```bash
# نسخ ملف البيئة
copy .env.example .env

# تحرير الملف وإضافة المفاتيح
notepad .env
```

### 3. تسجيل الدخول إلى Google
```bash
# تسجيل الدخول
clasp login

# التحقق من الحالة
clasp list
```

## 🏗️ المرحلة الثانية: البناء والإصلاح

### 1. فحص صحة النظام
```bash
# فحص شامل للمشروع
npm run health-check

# إصلاح الأخطاء النحوية
npm run fix-syntax
```

### 2. عملية البناء
```bash
# بناء كامل مع تنظيف
npm run full-build

# أو بناء سريع
npm run build
```

### 3. التحقق من النتائج
- تحقق من مجلد `dist/` للملفات المعالجة
- تحقق من مجلد `gas_ready/` للنسخة الجاهزة
- راجع تقرير البناء في الطرفية

## 📤 المرحلة الثالثة: النشر في Google Apps Script

### 1. إنشاء مشروع جديد
```bash
# إنشاء مشروع جديد
clasp create --type standalone --title "AzizSys"

# أو ربط مشروع موجود
clasp clone [SCRIPT_ID]
```

### 2. تحديث ترتيب التحميل
```bash
# تحديث ترتيب الملفات
node scripts/generatePushOrder.js
```

### 3. رفع الملفات
```bash
# رفع جميع الملفات
clasp push

# رفع مع مراقبة التغييرات
clasp push --watch
```

## ⚙️ المرحلة الرابعة: التكوين

### 1. إعداد المتغيرات في Apps Script
```javascript
// في Properties > Script properties
GEMINI_API_KEY = "your_gemini_api_key_here"
AI_LONG_TERM_MEMORY_VERSION = "1.0.1"
LTM_FOLDER_NAME = "AZIZSYS_Memory"
SYSTEM_VERSION = "6.0.0"
```

### 2. إعداد الصلاحيات
```json
// في appsscript.json
{
  "oauthScopes": [
    "https://www.googleapis.com/auth/spreadsheets",
    "https://www.googleapis.com/auth/drive",
    "https://www.googleapis.com/auth/script.external_request"
  ]
}
```

### 3. تفعيل APIs المطلوبة
- Google Sheets API
- Google Drive API
- Google Apps Script API

## 🧪 المرحلة الخامسة: الاختبار

### 1. اختبار التهيئة
```javascript
// في محرر Apps Script
function testInitialization() {
  Logger.log('🧪 اختبار التهيئة...');
  initializeSystem();
  Logger.log('✅ اكتمل الاختبار');
}
```

### 2. اختبار الوحدات
```javascript
function testModules() {
  Logger.log('🧪 اختبار الوحدات...');
  
  // اختبار الوحدات الأساسية
  const results = runSystemTest();
  
  Logger.log('📊 نتائج الاختبار:', results);
}
```

### 3. اختبار الواجهة
1. شغّل دالة `onOpen()`
2. اذهب إلى Google Sheet جديد
3. تحقق من ظهور قائمة "🤖 AzizSys"
4. اختبر فتح المساعد الذكي

### 4. اختبار الوكلاء
```javascript
function testAgents() {
  // اختبار الوكيل المالي
  const cfoResult = testCFOAgent();
  
  // اختبار وكيل المطور
  const devResult = testDeveloperAgent();
  
  Logger.log('🤖 نتائج اختبار الوكلاء:', {
    cfo: cfoResult,
    developer: devResult
  });
}
```

## 🔍 استكشاف الأخطاء الشائعة

### خطأ: "ReferenceError: [function] is not defined"
**السبب**: ترتيب تحميل الملفات خاطئ
**الحل**:
```bash
# إعادة توليد ترتيب التحميل
node scripts/generatePushOrder.js
clasp push
```

### خطأ: "TypeError: Cannot read property of undefined"
**السبب**: وحدة لم يتم تحميلها بشكل صحيح
**الحل**:
```javascript
// التحقق من الوحدات
function debugModules() {
  Logger.log('الوحدات المحملة:', Object.keys(Injector.dependencyMap));
  Logger.log('حالة النظام:', ModuleVerifier.scanAll());
}
```

### خطأ: "Authorization required"
**السبب**: صلاحيات مفقودة
**الحل**:
1. تحقق من `appsscript.json`
2. أضف الصلاحيات المطلوبة
3. أعد النشر

### السايدبار لا يظهر
**السبب**: ملف HTML مفقود أو خطأ في الاسم
**الحل**:
1. تأكد من وجود `AssistantSidebar.html`
2. تحقق من دالة `onOpen()`
3. اختبر الصلاحيات

## ☁️ نشر Kubernetes المتقدم

### 1. إعداد الحاويات
```yaml
# config/kubernetes.yaml
apiVersion: apps/v1
kind: Deployment
metadata:
  name: azizsys-deployment
spec:
  replicas: 3
  selector:
    matchLabels:
      app: azizsys
  template:
    spec:
      containers:
      - name: azizsys
        image: gcr.io/your-project/azizsys:3.0.0
        ports:
        - containerPort: 8080
        env:
        - name: GEMINI_API_KEY
          valueFrom:
            secretKeyRef:
              name: api-secrets
              key: gemini-key
        - name: AI_MODELS_PATH
          value: "/models/v2"
        - name: REDIS_CONTEXT_TTL
          value: "2592000" # 30 يوم
        livenessProbe:
          httpGet:
            path: /health
            port: 8080
          initialDelaySeconds: 30
          periodSeconds: 10
```

### 2. Auto-scaling الذكي
```yaml
apiVersion: autoscaling/v2
kind: HorizontalPodAutoscaler
metadata:
  name: azizsys-hpa
spec:
  scaleTargetRef:
    apiVersion: apps/v1
    kind: Deployment
    name: azizsys-deployment
  minReplicas: 2
  maxReplicas: 10
  metrics:
  - type: Resource
    resource:
      name: cpu
      target:
        type: Utilization
        averageUtilization: 70
```

### 3. إعداد SSL/TLS
```bash
# إنشاء شهادة SSL
kubectl create secret tls azizsys-tls \
  --cert=path/to/tls.crt \
  --key=path/to/tls.key

# تفعيل HTTPS
kubectl apply -f config/ssl_config.json
```

## 📊 مراقبة الأداء

### 1. إعداد المراقبة
```javascript
function setupMonitoring() {
  // تفعيل نظام المراقبة
  const monitoring = Injector.get('System.Monitoring');
  monitoring.enable();
  
  // إعداد التنبيهات
  monitoring.setAlerts({
    responseTime: 2000,  // 2 ثانية
    errorRate: 0.05,     // 5%
    memoryUsage: 0.8     // 80%
  });
}
```

### 2. تقارير الأداء
```javascript
function generatePerformanceReport() {
  const metrics = Injector.get('System.Metrics');
  const report = metrics.generateReport();
  
  Logger.log('📈 تقرير الأداء:', report);
  
  // إرسال التقرير بالبريد الإلكتروني
  MailApp.sendEmail({
    to: 'admin@example.com',
    subject: 'AzizSys Performance Report',
    body: JSON.stringify(report, null, 2)
  });
}
```

## 🔄 التحديثات والصيانة

### 1. تحديث النظام
```bash
# سحب آخر التحديثات
git pull origin main

# إعادة البناء
npm run full-build

# النشر
clasp push
```

### 2. النسخ الاحتياطي
```javascript
function createBackup() {
  const backup = Injector.get('System.Backup');
  
  // إنشاء نسخة احتياطية
  const backupId = backup.create({
    includeData: true,
    includeConfig: true,
    includeMemory: true
  });
  
  Logger.log('💾 تم إنشاء النسخة الاحتياطية:', backupId);
}
```

### 3. الصيانة الدورية
```javascript
function performMaintenance() {
  // تنظيف الذاكرة
  const memory = Injector.get('AI.LongTermMemory');
  memory.cleanup();
  
  // تحديث الإحصائيات
  const metrics = Injector.get('System.Metrics');
  metrics.update();
  
  // فحص الأداء
  const health = healthCheck();
  Logger.log('🔧 نتائج الصيانة:', health);
}
```

## 📋 قائمة التحقق للنشر

### قبل النشر
- [ ] تشغيل `npm run health-check`
- [ ] تشغيل `npm run full-build`
- [ ] التحقق من ملف `.env`
- [ ] مراجعة `appsscript.json`
- [ ] اختبار محلي للوحدات

### أثناء النشر
- [ ] تشغيل `node scripts/generatePushOrder.js`
- [ ] تشغيل `clasp push`
- [ ] التحقق من عدم وجود أخطاء
- [ ] إعداد المتغيرات في Apps Script

### بعد النشر
- [ ] اختبار `initializeSystem()`
- [ ] اختبار `testModules()`
- [ ] اختبار الواجهة
- [ ] اختبار الوكلاء
- [ ] إعداد المراقبة

## 🎯 نصائح للنجاح

### ✅ افعل
- استخدم `npm run full-build` قبل كل نشر
- احتفظ بنسخ احتياطية منتظمة
- اختبر كل وحدة منفصلة
- راقب سجلات الأخطاء بانتظام
- وثق أي تغييرات مخصصة

### ❌ لا تفعل
- لا تنسخ الملفات من `src/` مباشرة
- لا تتجاهل ترتيب تحميل الملفات
- لا تنشر بدون اختبار محلي
- لا تنس إضافة مفاتيح API
- لا تتجاهل تحذيرات الأمان

## 📞 الدعم والمساعدة

### أوامر مفيدة
```bash
# فحص سريع
npm run health-check

# تحليل شامل
npm run analyze

# إعادة بناء كاملة
npm run clean && npm run full-build

# مراقبة التغييرات
clasp push --watch
```

### سجلات مفيدة
```javascript
// عرض حالة النظام
function debugSystem() {
  Logger.log('إصدار النظام:', GAssistant.version);
  Logger.log('الوحدات المحملة:', Object.keys(GAssistant.modules));
  Logger.log('حالة التهيئة:', GAssistant.initialized);
}
```

---

## 🎉 الخلاصة

باتباع هذا الدليل، ستضمن نشر نسخة مستقرة وموثوقة من AzizSys. عملية البناء المهنية تضمن:

- ✅ كود خالٍ من الأخطاء النحوية
- ✅ ترتيب تحميل صحيح للوحدات
- ✅ توافق كامل مع Google Apps Script
- ✅ اختبار شامل قبل النشر
- ✅ مراقبة مستمرة للأداء

**نجاح النشر = إصلاح + بناء + ترتيب + اختبار + مراقبة** 🎯