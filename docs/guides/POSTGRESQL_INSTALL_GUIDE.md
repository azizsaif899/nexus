# 🐘 دليل تثبيت PostgreSQL

## ⚠️ مشكلة الصلاحيات
تم اكتشاف مشكلة في صلاحيات Chocolatey. يرجى اتباع الطرق البديلة:

## 🔧 طرق التثبيت البديلة

### الطريقة 1: التحميل المباشر (الأسهل)
1. اذهب إلى: https://www.postgresql.org/download/windows/
2. حمل PostgreSQL 16 أو 17
3. شغل الملف كـ Administrator
4. اتبع معالج التثبيت
5. **مهم:** احفظ كلمة مرور postgres

### الطريقة 2: Chocolatey مع صلاحيات Admin
```bash
# افتح PowerShell كـ Administrator
choco install postgresql --confirm
```

### الطريقة 3: winget (Windows Package Manager)
```bash
winget install PostgreSQL.PostgreSQL
```

## 🚀 بعد التثبيت

### 1. اختبار التثبيت
```bash
psql --version
```

### 2. إعداد قاعدة البيانات
```bash
# الاتصال بـ PostgreSQL
psql -U postgres

# إنشاء قاعدة البيانات
CREATE DATABASE workflows_db;

# الخروج
\q
```

### 3. تشغيل سكريبت الإعداد
```bash
psql -U postgres -d workflows_db -f apps/api/src/database/init.sql
```

### 4. تحديث ملف .env
```env
DB_NAME=workflows_db
DB_USER=postgres
DB_PASSWORD=كلمة_المرور_التي_اخترتها
DB_HOST=localhost
DB_PORT=5432
```

### 5. تشغيل الخادم
```bash
cd apps/api
npm run dev
```

## 🔍 استكشاف الأخطاء

### PostgreSQL لا يعمل
```bash
# Windows Services
services.msc
# ابحث عن postgresql وشغله
```

### مشكلة الاتصال
```bash
# تأكد من تشغيل الخدمة
net start postgresql-x64-16
```

## ✅ التحقق من النجاح
- الخادم يعمل على `http://localhost:3000`
- `/health` يظهر حالة OK
- `/api/workflows` يعمل بدون أخطاء

**🎯 بمجرد تثبيت PostgreSQL، النظام جاهز للعمل!**