# 📊 دليل BigQuery المفصل

## 🎯 ما هو BigQuery؟
BigQuery هو قاعدة بيانات سحابية من Google تتعامل مع البيانات الضخمة بسرعة فائقة.

## 🔍 شرح كل API:

### ✅ **BigQuery API** (المطلوب)
**الوظيفة:** العمليات الأساسية لقاعدة البيانات
**ما يفعله:**
- إنشاء وحذف الجداول
- إدراج البيانات
- تشغيل الاستعلامات (SELECT, INSERT, UPDATE, DELETE)
- إدارة Datasets

**مثال الاستخدام في مشروعنا:**
```javascript
// إنشاء جدول workflows
await workflowsTable.create({
  schema: [
    { name: 'id', type: 'STRING' },
    { name: 'name', type: 'STRING' },
    { name: 'nodes', type: 'JSON' }
  ]
});

// إدراج بيانات
await workflowsTable.insert([{
  id: '123',
  name: 'My Workflow',
  nodes: []
}]);

// استعلام
const [rows] = await bigquery.query('SELECT * FROM workflows');
```

### ❌ **BigQuery Connection API** (غير مطلوب)
**الوظيفة:** ربط BigQuery بقواعد بيانات خارجية
**مثال:** ربط BigQuery بـ MySQL أو PostgreSQL خارجي
**لماذا لا نحتاجه:** نحن نستخدم BigQuery كقاعدة بيانات رئيسية

### ❌ **BigQuery Data Policy API** (غير مطلوب)
**الوظيفة:** إدارة سياسات الأمان والخصوصية
**مثال:** إخفاء أرقام الهواتف، تشفير البيانات الحساسة
**لماذا لا نحتاجه:** مشروعنا بسيط ولا يحتاج سياسات معقدة

### ❌ **BigQuery Migration API** (غير مطلوب)
**الوظيفة:** نقل البيانات من أنظمة أخرى إلى BigQuery
**مثال:** نقل بيانات من Oracle أو SQL Server
**لماذا لا نحتاجه:** نحن ننشئ نظام جديد من الصفر

### ❌ **BigQuery Reservation API** (غير مطلوب)
**الوظيفة:** حجز موارد مدفوعة للأداء العالي
**مثال:** حجز 100 slots للاستعلامات السريعة
**لماذا لا نحتاجه:** النسخة المجانية كافية لمشروعنا

### ❌ **BigQuery Storage API** (غير مطلوب)
**الوظيفة:** قراءة البيانات بسرعة عالية جداً
**مثال:** قراءة مليارات الصفوف في ثوانٍ
**لماذا لا نحتاجه:** مشروعنا لا يحتاج هذه السرعة الفائقة

## 🚀 ما نحتاجه فقط:

### **BigQuery API** يوفر لنا:
1. **إنشاء Dataset:** مجلد لتنظيم الجداول
2. **إنشاء Tables:** جداول workflows و executions
3. **CRUD Operations:** إنشاء، قراءة، تحديث، حذف
4. **SQL Queries:** استعلامات معقدة
5. **JSON Support:** تخزين nodes و connections كـ JSON

## 📋 خطوات التفعيل:

### 1. في Google Cloud Console:
- اذهب إلى: **APIs & Services** → **Library**
- ابحث عن: **"BigQuery API"**
- اضغط **"Enable"**

### 2. تأكد من التفعيل:
- اذهب إلى: **APIs & Services** → **Enabled APIs**
- يجب أن ترى **"BigQuery API"** في القائمة

## 🎯 النتيجة:
بمجرد تفعيل **BigQuery API** فقط، ستتمكن من:
- إنشاء قاعدة البيانات
- تخزين workflows
- تشغيل الاستعلامات
- ربط API بالواجهة الأمامية

## 💡 نصيحة:
BigQuery مجاني حتى:
- **1 TB** استعلامات شهرياً
- **10 GB** تخزين
- هذا أكثر من كافٍ لمشروعنا!