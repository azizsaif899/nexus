# 🚀 بناء ورفع المشروع على Firebase

## الخطوات المطلوبة:

### 1️⃣ بناء المشروع:
```bash
npm run build
```

### 2️⃣ التحقق من dist:
```bash
dir dist
```

### 3️⃣ رفع على Firebase:
```bash
firebase deploy --only hosting
```

## أو استخدم الملف الجاهز:
```bash
FORCE-DEPLOY.bat
```

## المشكلة الحالية:
- مجلد `dist` غير موجود
- يجب بناء المشروع أولاً قبل الرفع

## الحل:
شغل الأوامر في Terminal الخاص بك في VS Code