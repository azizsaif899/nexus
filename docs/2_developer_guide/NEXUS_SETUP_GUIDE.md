# 🚀 Nexus Branch - Firebase Setup Guide

## ✅ تم إنشاء فرع nexus بنجاح!

**الفرع الحالي**: `nexus` ✅
**Firebase CLI**: مثبت ✅

---

## 🔥 خطوات إعداد Firebase

### 1. تسجيل الدخول (يدوياً)
```bash
npx firebase login
```
**ملاحظة**: ستحتاج تشغيل هذا الأمر في terminal منفصل

### 2. إنشاء/ربط مشروع Firebase
```bash
npx firebase init
```

### 3. اختيار الخدمات المطلوبة:
- [x] **Hosting** - لنشر الواجهات
- [x] **Functions** - للخادم الخلفي
- [x] **Firestore** - قاعدة البيانات
- [x] **Authentication** - نظام المصادقة

---

## 📁 هيكل المشروع المقترح

```
nexus/
├── 🌐 hosting/           # الواجهات (React Apps)
│   ├── admin-dashboard/  # لوحة التحكم
│   ├── web-chatbot/      # واجهة الدردشة
│   └── public/           # الملفات العامة
│
├── ⚡ functions/         # الخادم الخلفي
│   ├── src/
│   │   ├── api/          # NestJS APIs
│   │   ├── triggers/     # Firebase Triggers
│   │   └── index.ts      # نقطة الدخول
│   └── package.json
│
├── 🔥 firestore/        # قواعد قاعدة البيانات
│   ├── firestore.rules
│   └── firestore.indexes.json
│
└── firebase.json        # تكوين Firebase
```

---

## 🎯 الخطوات التالية

### بعد تسجيل الدخول:
1. **إعداد Hosting** للواجهات
2. **إعداد Functions** للخادم
3. **إعداد Firestore** لقاعدة البيانات
4. **ربط مع VS Code** للفريق

---

## 🛠️ أوامر مفيدة

```bash
# تشغيل محلي
npx firebase serve

# نشر للإنتاج
npx firebase deploy

# فحص المشروع
npx firebase projects:list

# إعداد emulators للتطوير
npx firebase emulators:start
```

---

## 📋 قائمة المراجعة

- [x] إنشاء فرع nexus
- [x] تثبيت Firebase CLI
- [ ] تسجيل الدخول لـ Firebase
- [ ] إنشاء مشروع Firebase
- [ ] إعداد Hosting
- [ ] إعداد Functions
- [ ] إعداد Firestore
- [ ] اختبار النشر

---

**🎯 الخطوة التالية**: قم بتشغيل `npx firebase login` في terminal منفصل