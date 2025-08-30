# 🚀 AzizSys Workflow API

## 📋 نظرة عامة
خادم API لإدارة وتنفيذ workflows الأتمتة المرئية مع دعم PostgreSQL.

## 🛠️ الإعداد والتثبيت

### 1. تثبيت PostgreSQL
```bash
# على Windows (باستخدام Chocolatey)
choco install postgresql

# أو تحميل من الموقع الرسمي
# https://www.postgresql.org/download/windows/
```

### 2. إعداد قاعدة البيانات
```bash
# الاتصال بـ PostgreSQL
psql -U postgres

# تشغيل ملف الإعداد
\i src/database/init.sql
```

### 3. تثبيت التبعيات
```bash
# في مجلد apps/api
npm install

# أو باستخدام pnpm
pnpm install
```

### 4. إعداد متغيرات البيئة
```bash
# نسخ ملف البيئة
cp .env.example .env

# تعديل القيم حسب إعداداتك
DB_NAME=workflows_db
DB_USER=postgres
DB_PASSWORD=your_password
DB_HOST=localhost
DB_PORT=5432
```

### 5. تشغيل الخادم
```bash
# وضع التطوير
npm run dev

# أو
pnpm dev
```

## 📡 نقاط النهاية (Endpoints)

### Workflows
- `GET /api/workflows` - جلب جميع workflows
- `GET /api/workflows/:id` - جلب workflow محدد
- `POST /api/workflows` - إنشاء workflow جديد
- `PUT /api/workflows/:id` - تحديث workflow
- `DELETE /api/workflows/:id` - حذف workflow
- `POST /api/workflows/:id/execute` - تشغيل workflow

### الصحة
- `GET /health` - فحص حالة الخادم

## 📊 هيكل البيانات

### Workflow
```json
{
  "id": "uuid",
  "name": "اسم الـ workflow",
  "description": "وصف اختياري",
  "nodes": [
    {
      "id": "node-1",
      "type": "trigger",
      "position": {"x": 100, "y": 100}
    }
  ],
  "connections": [
    {
      "source": "node-1",
      "target": "node-2"
    }
  ],
  "status": "active",
  "created_at": "2024-01-15T10:30:00Z",
  "updated_at": "2024-01-15T10:30:00Z",
  "created_by": "user_id",
  "is_active": true
}
```

## 🔧 أوامر مفيدة

```bash
# اختبار اتصال قاعدة البيانات
npm run db:test

# إعادة تهيئة قاعدة البيانات
npm run db:init

# بناء المشروع
npm run build

# تشغيل الاختبارات
npm test
```

## 🐛 استكشاف الأخطاء

### مشكلة اتصال قاعدة البيانات
```bash
# التأكد من تشغيل PostgreSQL
sudo service postgresql status

# إعادة تشغيل PostgreSQL
sudo service postgresql restart
```

### مشكلة التبعيات
```bash
# حذف node_modules وإعادة التثبيت
rm -rf node_modules
npm install
```

## 📝 ملاحظات مهمة

1. **الأمان**: تأكد من تعيين كلمة مرور قوية لقاعدة البيانات
2. **البيئة**: لا تضع ملف `.env` في Git
3. **الأداء**: استخدم connection pooling للإنتاج
4. **المراقبة**: فعل logging في بيئة الإنتاج

## 🚀 الخطوات التالية

1. ✅ إعداد قاعدة البيانات
2. ✅ إنشاء API endpoints
3. 🔄 تطوير محرك تنفيذ workflows
4. 🔄 ربط الواجهة الأمامية
5. 🔄 إضافة المصادقة والتفويض
6. 🔄 تطبيق اختبارات شاملة