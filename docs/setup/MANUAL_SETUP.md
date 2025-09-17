# 🛠️ إعداد يدوي لقاعدة البيانات

## 📋 الخطوات اليدوية:

### 1. افتح Command Prompt كـ Administrator
- اضغط `Win + R`
- اكتب `cmd`
- اضغط `Ctrl + Shift + Enter`

### 2. انتقل لمجلد المشروع:
```cmd
cd /d E:\azizsys5\g-assistant-nx
```

### 3. إنشاء قاعدة البيانات:
```cmd
"C:\Program Files\PostgreSQL\17\bin\psql" -U postgres -c "CREATE DATABASE workflows_db;"
```

### 4. تشغيل سكريبت الإعداد:
```cmd
"C:\Program Files\PostgreSQL\17\bin\psql" -U postgres -d workflows_db -f apps\api\src\database\init.sql
```

### 5. تحديث كلمة المرور:
- افتح `apps\api\.env`
- غير `DB_PASSWORD=postgres` لكلمة المرور الصحيحة

### 6. تشغيل الخادم:
```cmd
cd apps\api
npm run dev
```

## 🔍 اختبار النجاح:
- افتح المتصفح: `http://localhost:3000/health`
- يجب أن تظهر: `{"status": "OK"}`

## ⚠️ إذا واجهت مشاكل:
1. تأكد من تشغيل PostgreSQL service
2. تأكد من كلمة مرور postgres
3. تأكد من وجود الملف `init.sql`