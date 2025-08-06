# 🛠️ إعداد بيئة التطوير - دليل شامل

## 📋 المتطلبات الأساسية

### البرامج المطلوبة
| البرنامج | الإصدار المطلوب | رابط التحميل |
|----------|-----------------|---------------|
| Node.js | 18.0.0+ | [nodejs.org](https://nodejs.org/) |
| npm | 9.0.0+ | يأتي مع Node.js |
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

### 2. استخدام المستودع الجديد
```bash
cd monorepo-new
npm install
```

### 3. إعداد متغيرات البيئة
```bash
cp .env.example .env
# أضف مفاتيح API الخاصة بك
```

#### محتوى ملف .env
```env
# مفتاح Gemini AI (مطلوب)
GEMINI_API_KEY=your_gemini_api_key_here

# إعدادات Google Apps Script
SCRIPT_ID=your_google_apps_script_id
NODE_ENV=development

# إعدادات النظام
DEBUG_MODE=true
AI_LONG_TERM_MEMORY_VERSION=1.0.1
LTM_FOLDER_NAME=AZIZSYS6_Memory
```

### 4. إعداد Google Apps Script
```bash
# تسجيل الدخول إلى Google
clasp login

# للـ Sidebar
cd apps/sidebar
clasp create --type standalone --title "G-Assistant Sidebar"
```

### 5. بناء ونشر المشروع
```bash
# بناء الـ Sidebar
cd apps/sidebar
npm run build
npm run deploy
```

## 🔧 الإعداد المتقدم

### إعداد VS Code
الإضافات الموصى بها:
- ESLint
- Prettier
- TypeScript
- Google Apps Script

### إعداد Script Properties
في محرر Apps Script، اذهب إلى `Project Settings > Script Properties`:
```
GEMINI_API_KEY = your_api_key_here
AI_LONG_TERM_MEMORY_VERSION = 1.0.1
LTM_FOLDER_NAME = AZIZSYS6_Memory
DEBUG_MODE = true
```

## 🧪 اختبار الإعداد

### 1. اختبار البناء
```bash
cd apps/sidebar
npm run build
# يجب أن ترى ملفات في dist/
```

### 2. اختبار النشر
```bash
npm run deploy
# تحقق من عدم وجود أخطاء
```

### 3. اختبار الواجهة
1. افتح Google Sheets
2. تحقق من ظهور قائمة "🤖 G-Assistant"
3. اختبر فتح الشريط الجانبي

## 🔍 استكشاف الأخطاء

### مشكلة: "clasp: command not found"
```bash
npm install -g @google/clasp
clasp --version
```

### مشكلة: "Authorization required"
```bash
clasp logout
clasp login
```

### مشكلة: السايدبار لا يظهر
1. تحقق من وجود `Sidebar.html` في `dist/`
2. تأكد من تشغيل `onOpen()` بنجاح
3. تحقق من console في محرر Apps Script

## 📚 الخطوات التالية

بعد إكمال الإعداد:
1. 📖 راجع [معمارية المشروع](./architecture.md)
2. 🤖 تعرف على [معايير الكود](./coding_standards.md)
3. 🔍 اقرأ [دليل المساهمة](./contributing.md)