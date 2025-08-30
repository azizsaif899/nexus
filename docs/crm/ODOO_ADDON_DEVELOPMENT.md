# 🔌 Odoo Addon Development - تطوير إضافة Odoo

## 📋 نظرة عامة

تم تطوير إضافة Odoo متكاملة تعمل كـ "سفارة ذكية" داخل نظام Odoo لإرسال التحديثات الفورية إلى G-Assistant.

---

## 🏗️ هيكل الإضافة

```
odoo-addon/g_assistant_connector/
├── __init__.py
├── __manifest__.py
├── models/
│   ├── __init__.py
│   ├── crm_lead.py
│   ├── sale_order.py
│   ├── g_assistant_config.py
│   └── res_config_settings.py
├── views/
│   ├── settings_view.xml
│   └── g_assistant_config_views.xml
├── data/
│   └── automated_actions.xml
├── security/
│   └── ir.model.access.csv
└── INSTALLATION_GUIDE.md
```

---

## 🔧 الملفات المطورة

### 1. `models/res_config_settings.py`
**الغرض:** إضافة إعدادات G-Assistant إلى واجهة إعدادات Odoo

```python
from odoo import models, fields

class ResConfigSettings(models.TransientModel):
    _inherit = 'res.config.settings'

    g_assistant_webhook_url = fields.Char(
        string='G-Assistant Webhook URL',
        config_parameter='g_assistant.webhook_url'
    )
    g_assistant_secret_key = fields.Char(
        string='G-Assistant Secret Key',
        config_parameter='g_assistant.secret_key'
    )
    g_assistant_enabled = fields.Boolean(
        string='Enable G-Assistant Integration',
        config_parameter='g_assistant.enabled'
    )
```

### 2. `models/crm_lead.py`
**الغرض:** توسيع نموذج العملاء المحتملين لإرسال webhooks

#### الميزات الرئيسية:
- **إرسال webhook تلقائي** عند التحديث
- **مصادقة HMAC-SHA256** للأمان
- **تسجيل مفصل** للأخطاء والنجاحات
- **معالجة الاستثناءات** لتجنب تعطيل Odoo

```python
def send_g_assistant_webhook(self):
    """Send webhook notification to G-Assistant"""
    # التحقق من تفعيل التكامل
    if not self.env['ir.config_parameter'].sudo().get_param('g_assistant.enabled'):
        return
    
    # جلب إعدادات الاتصال
    webhook_url = self.env['ir.config_parameter'].sudo().get_param('g_assistant.webhook_url')
    secret_key = self.env['ir.config_parameter'].sudo().get_param('g_assistant.secret_key')
    
    # إعداد البيانات والتوقيع
    payload = {
        'event': 'lead_updated',
        'data': {
            'id': record.id,
            'name': record.name,
            'partner_name': record.partner_name,
            'stage_name': record.stage_id.name,
            'expected_revenue': record.expected_revenue
        }
    }
    
    # إرسال مع مصادقة آمنة
    signature = hmac.new(secret_key.encode(), payload_json.encode(), hashlib.sha256).hexdigest()
```

### 3. `models/sale_order.py`
**الغرض:** توسيع نموذج أوامر البيع لإرسال webhooks

#### البيانات المرسلة:
- معرف الأمر والاسم
- بيانات العميل
- حالة الأمر
- المبلغ الإجمالي
- العملة المستخدمة

### 4. `views/settings_view.xml`
**الغرض:** واجهة مستخدم لإعدادات G-Assistant في Odoo

#### الحقول المتاحة:
- **تفعيل/إلغاء التكامل**
- **Webhook URL** - عنوان G-Assistant API
- **Secret Key** - مفتاح المصادقة (مخفي)

### 5. `data/automated_actions.xml`
**الغرض:** إعداد الإجراءات التلقائية لإرسال webhooks

#### الإجراءات المعرفة:
- **إرسال webhook عند إنشاء عميل محتمل جديد**
- **إرسال webhook عند تحديث عميل محتمل**
- **إرسال webhook عند إنشاء أمر بيع جديد**
- **إرسال webhook عند تحديث أمر بيع**

---

## 🔒 الأمان والمصادقة

### HMAC-SHA256 Signature:
```python
# إنشاء التوقيع
payload_json = json.dumps(payload, sort_keys=True)
signature = hmac.new(
    secret_key.encode('utf-8'),
    payload_json.encode('utf-8'),
    hashlib.sha256
).hexdigest()

# إضافة التوقيع للـ headers
headers = {
    'X-G-Assistant-Signature': f'sha256={signature}',
    'Content-Type': 'application/json'
}
```

### التحقق في G-Assistant:
```javascript
// التحقق من صحة التوقيع
const receivedSignature = req.headers['x-g-assistant-signature'];
const expectedSignature = crypto
    .createHmac('sha256', secretKey)
    .update(JSON.stringify(req.body))
    .digest('hex');

if (receivedSignature !== `sha256=${expectedSignature}`) {
    return res.status(401).json({ error: 'Invalid signature' });
}
```

---

## 📊 البيانات المرسلة

### Lead Update Webhook:
```json
{
  "event": "lead_updated",
  "timestamp": "2024-01-08T10:30:00.000Z",
  "data": {
    "id": 123,
    "name": "استفسار عن الخدمات التقنية",
    "partner_name": "أحمد علي",
    "email_from": "ahmed@example.com",
    "phone": "+966501234567",
    "stage_id": 2,
    "stage_name": "مؤهل",
    "user_id": 1,
    "team_id": 1,
    "expected_revenue": 50000.0,
    "probability": 75.0,
    "priority": "1",
    "source_id": "Meta Ads",
    "create_date": "2024-01-08T09:00:00.000Z",
    "write_date": "2024-01-08T10:30:00.000Z"
  }
}
```

### Sale Order Update Webhook:
```json
{
  "event": "sale_order_updated",
  "timestamp": "2024-01-08T11:15:00.000Z",
  "data": {
    "id": 456,
    "name": "SO001",
    "partner_id": 789,
    "partner_name": "شركة المستقبل للتقنية",
    "state": "sale",
    "amount_total": 75000.0,
    "amount_untaxed": 65217.39,
    "currency_id": "SAR",
    "user_id": 1,
    "team_id": 1,
    "date_order": "2024-01-08T11:00:00.000Z",
    "validity_date": "2024-02-07T11:00:00.000Z",
    "opportunity_id": 123
  }
}
```

---

## 🚀 التثبيت والإعداد

### 1. نسخ الملفات:
```bash
# نسخ إلى مجلد addons في Odoo
sudo cp -r odoo-addon/g_assistant_connector /opt/odoo/addons/

# تغيير الصلاحيات
sudo chown -R odoo:odoo /opt/odoo/addons/g_assistant_connector
```

### 2. إعادة تشغيل Odoo:
```bash
sudo systemctl restart odoo
```

### 3. تثبيت الإضافة:
1. اذهب إلى **Apps** في Odoo
2. فعّل **Developer Mode**
3. اضغط **Update Apps List**
4. ابحث عن "G-Assistant Connector"
5. اضغط **Install**

### 4. إعداد التكامل:
1. **Settings** → **General Settings**
2. ابحث عن **G-Assistant Integration**
3. فعّل **Enable G-Assistant Integration**
4. أدخل **Webhook URL** و **Secret Key**
5. اضغط **Save**

---

## 🧪 الاختبار والتحقق

### اختبار مع webhook.site:
```bash
# 1. اذهب إلى https://webhook.site
# 2. انسخ الـ URL الفريد
# 3. ضعه في إعدادات Odoo
# 4. قم بتحديث عميل محتمل
# 5. تحقق من وصول البيانات
```

### فحص السجلات:
```bash
# مراقبة سجلات Odoo
sudo tail -f /var/log/odoo/odoo.log | grep "G-Assistant"

# البحث عن رسائل النجاح
grep "Successfully sent webhook" /var/log/odoo/odoo.log

# البحث عن الأخطاء
grep "Failed to send webhook" /var/log/odoo/odoo.log
```

### اختبار الاتصال:
```python
# اختبار من Python console في Odoo
lead = env['crm.lead'].browse(1)
lead.send_g_assistant_webhook()
```

---

## 🛠️ استكشاف الأخطاء

### مشاكل شائعة:

#### 1. الإضافة لا تظهر في Apps:
```bash
# تحقق من الصلاحيات
ls -la /opt/odoo/addons/g_assistant_connector/

# تحقق من __manifest__.py
cat /opt/odoo/addons/g_assistant_connector/__manifest__.py
```

#### 2. خطأ في إرسال Webhook:
```bash
# تحقق من الإعدادات
# Settings → Technical → Parameters → System Parameters
# ابحث عن g_assistant.webhook_url و g_assistant.secret_key
```

#### 3. خطأ في الاستيراد:
```python
# تحقق من __init__.py في models
# تأكد من استيراد جميع الملفات
```

---

## 📈 التطوير المستقبلي

### ميزات مقترحة:
- **Batch Webhooks** - إرسال متعدد للتحديثات
- **Retry Mechanism** - إعادة المحاولة عند الفشل
- **Queue System** - نظام طوابير للإرسال
- **Custom Events** - أحداث مخصصة للإرسال
- **Dashboard Integration** - لوحة تحكم داخل Odoo

### تحسينات الأداء:
- **Async Requests** - طلبات غير متزامنة
- **Connection Pooling** - تجميع الاتصالات
- **Caching** - تخزين مؤقت للإعدادات
- **Rate Limiting** - تحديد معدل الإرسال

---

## ✅ الخلاصة

### ما تم إنجازه:
- ✅ **إضافة Odoo متكاملة** تعمل كسفارة ذكية
- ✅ **واجهة إعدادات سهلة** للمدراء
- ✅ **إرسال webhooks آمن** مع مصادقة HMAC
- ✅ **تسجيل شامل** للأخطاء والنجاحات
- ✅ **دعم العملاء المحتملين وأوامر البيع**
- ✅ **دليل تثبيت شامل** مع استكشاف الأخطاء

### النتيجة:
**إضافة Odoo احترافية جاهزة للإنتاج تحقق التكامل اللحظي مع G-Assistant!**