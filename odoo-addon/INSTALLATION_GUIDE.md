# 🔧 G-Assistant Connector - دليل التثبيت

## 📋 المتطلبات الأساسية
- Odoo 15.0+ 
- Python 3.8+
- مكتبة `requests` (مثبتة افتراضياً في Odoo)

## 🚀 خطوات التثبيت

### 1. نسخ الملفات
```bash
# نسخ مجلد الإضافة إلى مجلد addons في Odoo
cp -r g_assistant_connector /path/to/odoo/addons/
```

### 2. إعادة تشغيل Odoo
```bash
# إعادة تشغيل خادم Odoo
sudo systemctl restart odoo
```

### 3. تفعيل الإضافة
1. اذهب إلى **Apps** في Odoo
2. ابحث عن "G-Assistant Connector"
3. اضغط **Install**

### 4. إعداد التكامل
1. اذهب إلى **Settings** → **General Settings**
2. ابحث عن قسم **G-Assistant Integration**
3. فعّل **Enable G-Assistant Integration**
4. أدخل:
   - **Webhook URL**: `https://your-domain.com/api/webhook/odoo`
   - **Secret Key**: مفتاح سري للمصادقة

## 🧪 اختبار التكامل

### استخدام webhook.site للاختبار:
1. اذهب إلى https://webhook.site
2. انسخ الـ URL الفريد
3. ضعه في إعدادات G-Assistant Webhook URL
4. قم بتحديث عميل محتمل في Odoo
5. تحقق من وصول البيانات إلى webhook.site

## 📊 البيانات المرسلة

### عند تحديث العملاء المحتملين:
```json
{
  "event": "lead_updated",
  "timestamp": "2024-01-08T10:30:00",
  "data": {
    "id": 123,
    "name": "استفسار عن الخدمات",
    "partner_name": "أحمد علي",
    "email_from": "ahmed@example.com",
    "stage_name": "مؤهل",
    "expected_revenue": 50000,
    "probability": 75
  }
}
```

### عند تحديث أوامر البيع:
```json
{
  "event": "sale_order_updated", 
  "timestamp": "2024-01-08T10:30:00",
  "data": {
    "id": 456,
    "name": "SO001",
    "partner_name": "شركة المستقبل",
    "state": "sale",
    "amount_total": 75000
  }
}
```

## 🔒 الأمان
- جميع الـ webhooks موقعة بـ HMAC-SHA256
- التحقق من التوقيع في G-Assistant API مطلوب
- استخدم HTTPS دائماً للـ webhook URLs

## 🛠️ استكشاف الأخطاء
- تحقق من سجلات Odoo: `/var/log/odoo/odoo.log`
- ابحث عن رسائل "G-Assistant" في السجلات
- تأكد من صحة الـ webhook URL والـ secret key

## ✅ التحقق من نجاح التثبيت
عند تحديث عميل محتمل أو أمر بيع، يجب أن ترى في سجلات Odoo:
```
INFO: Successfully sent webhook for lead 123 to G-Assistant
```