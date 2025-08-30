# 📡 Odoo API Reference - مرجع سريع

## 🔗 الاتصال الأساسي

### **XML-RPC Endpoints:**
```
Authentication: /xmlrpc/2/common
Database Operations: /xmlrpc/2/object
```

### **REST API (إذا متوفر):**
```
Base URL: http://localhost:8070/api/v1/
Authentication: Bearer Token
```

---

## 🔑 المصادقة

### **XML-RPC Authentication:**
```javascript
const uid = await client.methodCall('authenticate', [
  'azizsys_crm',    // database
  'admin',          // username  
  'AzizSys2025!',   // password
  {}                // context
]);
```

### **Session Authentication:**
```javascript
const session = await fetch('/web/session/authenticate', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    db: 'azizsys_crm',
    login: 'admin',
    password: 'AzizSys2025!'
  })
});
```

---

## 👥 إدارة العملاء المحتملين

### **جلب جميع العملاء:**
```javascript
const leads = await odoo.searchRead('crm.lead', []);
```

### **البحث بشروط:**
```javascript
// عملاء من WhatsApp
const whatsappLeads = await odoo.searchRead('crm.lead', [
  ['source_id.name', '=', 'WhatsApp']
]);

// عملاء جدد (آخر 7 أيام)
const recentLeads = await odoo.searchRead('crm.lead', [
  ['create_date', '>=', '2025-01-01']
]);
```

### **إنشاء عميل جديد:**
```javascript
const leadId = await odoo.create('crm.lead', {
  name: 'أحمد محمد',
  phone: '+966501234567',
  email: 'ahmed@example.com',
  description: 'عميل من WhatsApp',
  source_id: 1,  // WhatsApp source
  stage_id: 1    // New lead stage
});
```

### **تحديث عميل:**
```javascript
await odoo.write('crm.lead', [leadId], {
  stage_id: 2,  // Qualified stage
  planned_revenue: 5000
});
```

---

## 📊 المراحل والمصادر

### **جلب مراحل المبيعات:**
```javascript
const stages = await odoo.searchRead('crm.stage', []);
// Result: [
//   { id: 1, name: 'New', sequence: 1 },
//   { id: 2, name: 'Qualified', sequence: 10 },
//   { id: 3, name: 'Proposition', sequence: 20 },
//   { id: 4, name: 'Won', sequence: 30 }
// ]
```

### **جلب مصادر العملاء:**
```javascript
const sources = await odoo.searchRead('utm.source', []);
// Result: [
//   { id: 1, name: 'WhatsApp' },
//   { id: 2, name: 'Website' },
//   { id: 3, name: 'Phone Call' }
// ]
```

---

## 📈 التقارير والإحصائيات

### **عدد العملاء حسب المرحلة:**
```javascript
const stageStats = await odoo.readGroup('crm.lead', [], 
  ['stage_id'], ['stage_id']
);
// Result: [
//   { stage_id: [1, 'New'], stage_id_count: 15 },
//   { stage_id: [2, 'Qualified'], stage_id_count: 8 }
// ]
```

### **إيرادات متوقعة:**
```javascript
const revenue = await odoo.readGroup('crm.lead', 
  [['stage_id', '!=', 4]], // Exclude won deals
  ['planned_revenue:sum'], []
);
```

### **معدل التحويل:**
```javascript
const totalLeads = await odoo.searchCount('crm.lead', []);
const wonLeads = await odoo.searchCount('crm.lead', [
  ['stage_id.name', '=', 'Won']
]);
const conversionRate = (wonLeads / totalLeads) * 100;
```

---

## 🔍 البحث المتقدم

### **عوامل البحث الشائعة:**
```javascript
// البحث بالنص
['name', 'ilike', 'أحمد']

// البحث بالتاريخ
['create_date', '>=', '2025-01-01']
['create_date', '<=', '2025-01-31']

// البحث بالقيم المتعددة
['stage_id', 'in', [1, 2, 3]]

// البحث بالعلاقات
['source_id.name', '=', 'WhatsApp']

// دمج الشروط (AND)
[
  ['name', 'ilike', 'أحمد'],
  ['phone', '!=', false]
]

// دمج الشروط (OR)
['|', 
  ['email', 'ilike', '@gmail.com'],
  ['email', 'ilike', '@hotmail.com']
]
```

---

## 📞 تكامل الأنشطة

### **إضافة نشاط متابعة:**
```javascript
const activityId = await odoo.create('mail.activity', {
  activity_type_id: 1, // Call
  summary: 'متابعة العميل',
  note: 'الاتصال بالعميل لمناقشة العرض',
  date_deadline: '2025-01-15',
  res_model: 'crm.lead',
  res_id: leadId,
  user_id: 1 // Assigned user
});
```

### **جلب الأنشطة المعلقة:**
```javascript
const activities = await odoo.searchRead('mail.activity', [
  ['res_model', '=', 'crm.lead'],
  ['date_deadline', '<=', new Date().toISOString().split('T')[0]]
]);
```

---

## 💬 الرسائل والتعليقات

### **إضافة تعليق:**
```javascript
await odoo.create('mail.message', {
  model: 'crm.lead',
  res_id: leadId,
  message_type: 'comment',
  body: 'تم التواصل مع العميل عبر WhatsApp',
  author_id: 1
});
```

### **جلب تاريخ المحادثات:**
```javascript
const messages = await odoo.searchRead('mail.message', [
  ['model', '=', 'crm.lead'],
  ['res_id', '=', leadId]
], ['date', 'author_id', 'body']);
```

---

## 🏢 إدارة الشركات

### **إنشاء شركة:**
```javascript
const partnerId = await odoo.create('res.partner', {
  name: 'شركة التقنية المتقدمة',
  is_company: true,
  phone: '+966112345678',
  email: 'info@techadvanced.com',
  website: 'https://techadvanced.com'
});
```

### **ربط العميل بالشركة:**
```javascript
await odoo.write('crm.lead', [leadId], {
  partner_id: partnerId
});
```

---

## 📊 تخصيص الحقول

### **إضافة حقول مخصصة:**
```javascript
// إنشاء حقل مخصص
await odoo.create('ir.model.fields', {
  name: 'x_whatsapp_number',
  field_description: 'WhatsApp Number',
  model_id: 'crm.lead',
  ttype: 'char',
  size: 20
});
```

### **استخدام الحقول المخصصة:**
```javascript
await odoo.write('crm.lead', [leadId], {
  x_whatsapp_number: '+966501234567'
});
```

---

## 🔒 الصلاحيات والأمان

### **فحص صلاحيات المستخدم:**
```javascript
const hasAccess = await odoo.checkAccessRights('crm.lead', 'write');
```

### **تطبيق قواعد الأمان:**
```javascript
// البحث مع قواعد الأمان
const userLeads = await odoo.searchRead('crm.lead', [
  ['user_id', '=', currentUserId]
]);
```

---

## 🧪 أمثلة عملية كاملة

### **مثال: معالجة رسالة WhatsApp:**
```javascript
async function processWhatsAppMessage(message) {
  try {
    // 1. البحث عن عميل موجود
    let leads = await odoo.searchRead('crm.lead', [
      ['phone', '=', message.from]
    ]);

    let leadId;
    
    if (leads.length === 0) {
      // 2. إنشاء عميل جديد
      leadId = await odoo.create('crm.lead', {
        name: message.profile?.name || message.from,
        phone: message.from,
        description: message.text?.body,
        source_id: await getWhatsAppSourceId()
      });
      
      console.log(`✅ عميل جديد: ${leadId}`);
    } else {
      leadId = leads[0].id;
      console.log(`📝 عميل موجود: ${leadId}`);
    }

    // 3. إضافة الرسالة كتعليق
    await odoo.create('mail.message', {
      model: 'crm.lead',
      res_id: leadId,
      message_type: 'comment',
      body: `رسالة WhatsApp: ${message.text?.body}`,
      author_id: 1
    });

    // 4. إنشاء نشاط متابعة
    await odoo.create('mail.activity', {
      activity_type_id: 1,
      summary: 'رد على رسالة WhatsApp',
      res_model: 'crm.lead',
      res_id: leadId,
      date_deadline: new Date(Date.now() + 24*60*60*1000).toISOString().split('T')[0]
    });

    return leadId;
  } catch (error) {
    console.error('خطأ في معالجة الرسالة:', error);
    throw error;
  }
}
```

---

## 🚨 معالجة الأخطاء

### **أخطاء شائعة:**
```javascript
try {
  const result = await odoo.create('crm.lead', data);
} catch (error) {
  if (error.message.includes('Access Denied')) {
    console.error('خطأ في الصلاحيات');
  } else if (error.message.includes('ValidationError')) {
    console.error('خطأ في البيانات المدخلة');
  } else if (error.message.includes('IntegrityError')) {
    console.error('خطأ في قيود قاعدة البيانات');
  }
}
```

---

## 📚 موارد إضافية

### **نماذج مهمة في CRM:**
- `crm.lead` - العملاء المحتملين
- `crm.stage` - مراحل المبيعات  
- `utm.source` - مصادر العملاء
- `res.partner` - الشركات والأشخاص
- `mail.activity` - الأنشطة والمهام
- `mail.message` - الرسائل والتعليقات

### **حقول مهمة:**
- `name` - اسم العميل
- `phone` - رقم الهاتف
- `email` - البريد الإلكتروني
- `stage_id` - مرحلة المبيعات
- `source_id` - مصدر العميل
- `planned_revenue` - الإيرادات المتوقعة
- `probability` - احتمالية النجاح
- `date_deadline` - تاريخ الإغلاق المتوقع

---

**🎯 هذا المرجع يغطي 90% من احتياجات تطوير CRM مع Odoo!**