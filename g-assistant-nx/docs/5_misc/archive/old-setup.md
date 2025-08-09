# ⚙️ دليل الإعداد - AzizSys

## 📋 المتطلبات الأساسية

### البرامج المطلوبة
| البرنامج | الإصدار المطلوب | رابط التحميل |
|----------|-----------------|---------------|
| Node.js | 16.0.0+ | [nodejs.org](https://nodejs.org/) |
| npm | 8.0.0+ | يأتي مع Node.js |
| Git | أحدث إصدار | [git-scm.com](https://git-scm.com/) |
| Google Clasp | أحدث إصدار | `npm install -g @google/clasp` |

### حسابات مطلوبة
- ✅ حساب Google (للوصول إلى Apps Script)
- ✅ مفتاح Gemini API
- ⚠️ حساب WhatsApp Business (اختياري)

## 🚀 الإعداد السريع

### 1. استنساخ المشروع
```bash
git clone https://github.com/azizsaif899/g-assistant.git
cd g-assistant
```

### 2. تثبيت التبعيات
```bash
npm install
```

### 3. إعداد متغيرات البيئة
```bash
# نسخ ملف البيئة النموذجي
cp .env.example .env

# تحرير الملف وإضافة المفاتيح
nano .env
```

#### محتوى ملف .env
```env
# مفتاح Gemini AI (مطلوب)
GEMINI_API_KEY=your_gemini_api_key_here

# إعدادات النظام
DEBUG_MODE=true
AI_LONG_TERM_MEMORY_VERSION=1.0.1
LTM_FOLDER_NAME=AZIZSYS6_Memory

# إعدادات WhatsApp (اختياري)
WHATSAPP_TOKEN=your_whatsapp_token
WHATSAPP_VERIFY_TOKEN=your_verify_token

# إعدادات قاعدة البيانات (اختياري)
DATABASE_URL=your_database_url
```

### 4. إعداد Google Apps Script
```bash
# تسجيل الدخول إلى Google
clasp login

# إنشاء مشروع جديد أو ربط موجود
clasp create --type standalone --title "AzizSys"
# أو
clasp clone <script_id>
```

### 5. بناء ونشر المشروع
```bash
# بناء المشروع
npm run build

# نشر إلى Google Apps Script
npm run deploy
```

## 🔧 الإعداد المتقدم

### إعداد Google Apps Script

#### 1. إنشاء المشروع
1. اذهب إلى [script.google.com](https://script.google.com)
2. انقر على "مشروع جديد"
3. احذف `Code.gs` الافتراضي
4. انسخ Script ID من الرابط

#### 2. إعداد الصلاحيات
في ملف `appsscript.json`:
```json
{
  "timeZone": "Asia/Riyadh",
  "dependencies": {},
  "exceptionLogging": "STACKDRIVER",
  "runtimeVersion": "V8",
  "oauthScopes": [
    "https://www.googleapis.com/auth/spreadsheets",
    "https://www.googleapis.com/auth/script.external_request",
    "https://www.googleapis.com/auth/script.scriptapp",
    "https://www.googleapis.com/auth/drive.file"
  ],
  "urlFetchWhitelist": [
    "https://generativelanguage.googleapis.com/"
  ]
}
```

#### 3. إعداد Script Properties
في محرر Apps Script، اذهب إلى `Project Settings > Script Properties`:
```
GEMINI_API_KEY = your_api_key_here
AI_LONG_TERM_MEMORY_VERSION = 1.0.1
LTM_FOLDER_NAME = AZIZSYS6_Memory
DEBUG_MODE = true
```

### إعداد الواجهة الخارجية

#### 1. إعداد Python Backend
```bash
cd gemini_fullstack/backend

# إنشاء بيئة افتراضية
python -m venv venv
source venv/bin/activate  # Linux/Mac
# أو
venv\Scripts\activate     # Windows

# تثبيت التبعيات
pip install -r requirements.txt
```

#### 2. إعداد Frontend
```bash
cd gemini_fullstack/frontend

# تثبيت التبعيات
npm install

# تشغيل الخادم المحلي
npm run dev
```

## 🧪 اختبار الإعداد

### 1. اختبار Google Apps Script
```javascript
// في محرر Apps Script، شغّل هذه الدالة
function testSetup() {
  Logger.log('🧪 اختبار الإعداد...');
  
  // اختبار التهيئة
  try {
    onOpen();
    Logger.log('✅ التهيئة نجحت');
  } catch (error) {
    Logger.log('❌ خطأ في التهيئة: ' + error.message);
  }
  
  // اختبار Gemini API
  try {
    const config = GAssistant.Utils.Injector.get('Config');
    const apiKey = config.get('GEMINI_API_KEY');
    if (apiKey) {
      Logger.log('✅ مفتاح Gemini موجود');
    } else {
      Logger.log('❌ مفتاح Gemini مفقود');
    }
  } catch (error) {
    Logger.log('❌ خطأ في اختبار Gemini: ' + error.message);
  }
}
```

### 2. اختبار الواجهة
1. افتح Google Sheets
2. تحقق من ظهور قائمة "🤖 AZIZSYS6"
3. اختبر فتح السايدبار
4. جرب إرسال رسالة بسيطة

### 3. اختبار البناء المحلي
```bash
# اختبار البناء
npm run build

# التحقق من الملفات المُنتجة
ls -la gas_ready/

# يجب أن تشاهد:
# - Code.js
# - AssistantSidebar.html
# - appsscript.json
```

## 🔍 استكشاف الأخطاء الشائعة

### مشكلة: "clasp: command not found"
```bash
# الحل: تثبيت clasp عالمياً
npm install -g @google/clasp

# التحقق من التثبيت
clasp --version
```

### مشكلة: "Authorization required"
```bash
# الحل: تسجيل الدخول مرة أخرى
clasp logout
clasp login
```

### مشكلة: "Script file not found"
```bash
# الحل: التأكد من وجود .clasp.json
cat .clasp.json

# يجب أن يحتوي على:
{
  "scriptId": "your_script_id_here",
  "rootDir": "./gas_ready"
}
```

### مشكلة: السايدبار لا يظهر
1. تحقق من وجود `AssistantSidebar.html` في `gas_ready/`
2. تأكد من تشغيل `onOpen()` بنجاح
3. تحقق من console في محرر Apps Script

### مشكلة: خطأ في Gemini API
```javascript
// اختبار الاتصال
function testGeminiConnection() {
  try {
    const gemini = GAssistant.Utils.Injector.get('AI', 'GeminiAdapter');
    const result = gemini.generateContent({
      prompt: 'مرحبا، هل تعمل؟'
    });
    Logger.log('✅ Gemini يعمل: ' + result);
  } catch (error) {
    Logger.log('❌ خطأ Gemini: ' + error.message);
  }
}
```

## 📚 الخطوات التالية

بعد إكمال الإعداد:

1. 📖 راجع [دليل التطوير](development-workflow.md)
2. 🤖 تعرف على [الوكلاء الذكيون](agents-catalog-new.md)
3. 🔍 اكتشف [نظام التضمين](embeddings-guide-new.md)
4. 📱 طور [السايدبار](sidebar-development.md)

## 🆘 الحصول على المساعدة

إذا واجهت مشاكل:
1. راجع [دليل استكشاف الأخطاء](troubleshooting-new.md)
2. ابحث في [GitHub Issues](https://github.com/azizsaif899/g-assistant/issues)
3. اطرح سؤالاً في [Discussions](https://github.com/azizsaif899/g-assistant/discussions)