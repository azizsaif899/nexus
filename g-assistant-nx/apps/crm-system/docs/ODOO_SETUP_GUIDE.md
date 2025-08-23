# 🚀 دليل تثبيت Odoo CRM المجاني

## 📋 المتطلبات:
- ✅ Docker Desktop مثبت
- ✅ 4GB RAM متاحة
- ✅ 10GB مساحة تخزين

## ⚡ التثبيت السريع:

### 1. تشغيل Odoo:
```bash
cd scripts
setup-odoo.bat
```

### 2. الوصول إلى Odoo:
- 🌐 افتح: http://localhost:8069
- 📊 اسم قاعدة البيانات: `azizsys_crm`
- 👤 إنشاء حساب المدير

### 3. تثبيت الوحدات:
- ✅ CRM (إدارة العملاء)
- ✅ Sales (المبيعات)
- ✅ Contacts (جهات الاتصال)

## 🔧 التكامل مع AzizSys:

### ربط WhatsApp Bot:
```typescript
import { OdooConnector } from '@azizsys/odoo-integration';

const odoo = new OdooConnector({
  url: 'http://localhost:8069',
  database: 'azizsys_crm',
  username: 'admin',
  password: 'your_password'
});

await odoo.addCustomerFromWhatsApp({
  name: 'أحمد محمد',
  phone: '+966501234567',
  source: 'whatsapp',
  status: 'lead'
});
```

## 📊 الميزات:
- 👥 إدارة العملاء
- 📈 تتبع المبيعات
- 📋 المهام والمتابعات
- 📊 التقارير التلقائية