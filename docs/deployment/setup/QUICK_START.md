# ⚡ دليل البدء السريع - AzizSys AI Assistant

**اجعل النظام يعمل في أقل من 10 دقائق!**

## 🎯 الهدف
تشغيل النظام محلياً للتطوير والاختبار

## ✅ المتطلبات (تحقق أولاً)

```bash
# تحقق من Node.js (يجب أن يكون 18+)
node --version

# تحقق من PNPM (إذا لم يكن مثبت، ثبته)
pnpm --version
# إذا لم يكن موجود: npm install -g pnpm
```

## 🚀 خطوات التشغيل

### الخطوة 1: التحميل والتثبيت
```bash
git clone https://github.com/yourusername/azizsys-ai-assistant.git
cd azizsys-ai-assistant/g-assistant-nx
pnpm install
```

### الخطوة 2: إعداد البيئة الأساسي
```bash
# انسخ ملف البيئة
cp .env.example .env

# افتح .env وأضف على الأقل:
# FIREBASE_API_KEY=your_key_here
# GEMINI_API_KEY=your_key_here
```

### الخطوة 3: التشغيل
```bash
# تشغيل التطبيق الرئيسي
pnpm dev:web-chatbot
```

🎉 **افتح المتصفح:** http://localhost:3000

## 🔧 إعداد سريع للمفاتيح

### Firebase API Key (5 دقائق)
1. اذهب إلى [Firebase Console](https://console.firebase.google.com)
2. أنشئ مشروع جديد أو اختر موجود
3. اذهب إلى Project Settings > General
4. انسخ `apiKey` من Firebase config
5. أضفه في `.env` كـ `FIREBASE_API_KEY=`

### Gemini API Key (3 دقائق)
1. اذهب إلى [Google AI Studio](https://makersuite.google.com/app/apikey)
2. انقر "Create API Key"
3. انسخ المفتاح
4. أضفه في `.env` كـ `GEMINI_API_KEY=`

## 🧪 اختبار سريع

```bash
# اختبار أن كل شيء يعمل
pnpm test:quick

# اختبار الاتصال بـ APIs
pnpm test:connections
```

## 🎛️ تشغيل تطبيقات أخرى

```bash
# لوحة الإدارة
pnpm dev:admin-dashboard
# http://localhost:4200

# API Server
pnpm dev:api  
# http://localhost:3333

# تشغيل كل شيء معاً
pnpm dev:all
```

## ❌ حل المشاكل الشائعة

### مشكلة: "Module not found"
```bash
# احذف node_modules وأعد التثبيت
rm -rf node_modules
pnpm install
```

### مشكلة: "Port already in use"
```bash
# غير المنفذ في .env
PORT=3001
```

### مشكلة: "Firebase connection failed"
```bash
# تأكد من صحة FIREBASE_API_KEY و FIREBASE_PROJECT_ID
```

## 📱 الوصول للتطبيقات

| التطبيق | الرابط | الوصف |
|---------|--------|-------|
| Web Chatbot | http://localhost:3000 | الواجهة الرئيسية |
| Admin Dashboard | http://localhost:4200 | لوحة الإدارة |
| API Server | http://localhost:3333 | REST API |

## 🎯 الخطوات التالية

1. **اقرأ [دليل الإعداد الكامل](SECURITY_SETUP.md)** للحصول على جميع الميزات
2. **جرب الوكلاء الذكيين** في الواجهة الرئيسية
3. **استكشف [التوثيق](docs/)** لفهم النظام أكثر

## 🆘 تحتاج مساعدة؟

- [🐛 تقرير مشكلة](https://github.com/yourusername/azizsys-ai-assistant/issues)
- [💬 مناقشة](https://github.com/yourusername/azizsys-ai-assistant/discussions)
- [📧 تواصل مباشر](mailto:support@azizsys.com)

---

**🚀 مبروك! النظام يعمل الآن. استمتع بالاستكشاف!**