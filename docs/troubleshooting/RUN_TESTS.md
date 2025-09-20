# 🧪 تشغيل اختبارات API

## 📋 الخطوات:

### 1. تأكد من إعداد Google Cloud:
```env
# في apps/api/.env
GOOGLE_CLOUD_PROJECT_ID=your-project-id
GOOGLE_APPLICATION_CREDENTIALS=E:\azizsys5\g-assistant-nx\service-account.json
```

### 2. تشغيل الخادم:
```bash
# في terminal أول
cd apps/api
npm run dev
```

### 3. تشغيل الاختبارات:
```bash
# في terminal ثاني
node test-api.js
```

## 🎯 النتائج المتوقعة:

### ✅ إذا نجح كل شيء:
```
🧪 اختبار API endpoints...

1️⃣ اختبار /health
✅ النتيجة: { status: 'OK', service: 'AzizSys Workflow API' }

2️⃣ اختبار GET /api/workflows
✅ النتيجة: { success: true, data: [], message: 'تم جلب workflows بنجاح' }

3️⃣ اختبار POST /api/workflows
✅ النتيجة: { success: true, data: { id: '...', name: 'Test Workflow' } }

4️⃣ اختبار GET /api/workflows/:id
✅ النتيجة: { success: true, data: { id: '...', name: 'Test Workflow' } }

5️⃣ اختبار PUT /api/workflows/:id
✅ النتيجة: { success: true, data: { id: '...', name: 'Updated Test Workflow' } }

6️⃣ اختبار POST /api/workflows/:id/execute
✅ النتيجة: { success: true, message: 'تم بدء تشغيل workflow' }

7️⃣ اختبار GET /api/workflows (بعد الإنشاء)
✅ النتيجة: { success: true, data: [{ id: '...', name: 'Updated Test Workflow' }] }

8️⃣ اختبار DELETE /api/workflows/:id
✅ النتيجة: { success: true, message: 'تم حذف workflow بنجاح' }

🎊 جميع الاختبارات نجحت!
```

## ❌ إذا ظهرت أخطاء:

### خطأ BigQuery:
- تأكد من Project ID صحيح
- تأكد من ملف service-account.json موجود
- تأكد من تفعيل BigQuery API

### خطأ الاتصال:
- تأكد من تشغيل الخادم على المنفذ 3000
- تأكد من عدم وجود firewall يمنع الاتصال

## 🚀 بعد نجاح الاختبارات:
- ✅ API يعمل مع BigQuery
- ✅ جميع CRUD operations تعمل
- ✅ النظام جاهز للواجهة الأمامية
- ✅ يمكن تطوير محرك تنفيذ workflows