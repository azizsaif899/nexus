# 🚀 دليل الربط مع Meta - Meta Integration Guide

## 📋 **نظرة عامة**
الربط مع Meta **بسيط جداً** ويتم عبر 3 طرق رئيسية مع APIs جاهزة.

---

## 🎯 **الطرق المتاحة**

### 1️⃣ **Meta Lead Ads API** - ⭐ الأسهل
**الاستخدام:** جلب العملاء المحتملين من إعلانات Facebook/Instagram
**الصعوبة:** ⭐⭐☆☆☆ (سهل جداً)
**الوقت المطلوب:** 2-3 ساعات

```javascript
// مثال بسيط للربط
const getMetaLeads = async () => {
  const response = await fetch(
    `https://graph.facebook.com/v18.0/${PAGE_ID}/leadgen_forms`,
    {
      headers: {
        'Authorization': `Bearer ${ACCESS_TOKEN}`
      }
    }
  );
  return response.json();
};
```

### 2️⃣ **Meta Conversions API** - للتتبع المتقدم
**الاستخدام:** تتبع التحويلات وإرسال البيانات لـ Meta
**الصعوبة:** ⭐⭐⭐☆☆ (متوسط)
**الوقت المطلوب:** 4-6 ساعات

### 3️⃣ **WhatsApp Business API** - ✅ موجود بالفعل
**الاستخدام:** التفاعل مع العملاء عبر WhatsApp
**الصعوبة:** ✅ **مكتمل بالفعل**

---

## 🔧 **خطوات التطبيق البسيطة**

### الخطوة 1: إعداد Meta App
```bash
1. اذهب إلى developers.facebook.com
2. أنشئ تطبيق جديد
3. أضف Lead Ads API
4. احصل على Access Token
```

### الخطوة 2: إعداد Webhook
```javascript
// في apps/api/src/controllers/meta.controller.ts
@Controller('meta')
export class MetaController {
  
  @Post('webhook')
  async handleWebhook(@Body() data: any) {
    // معالجة Lead جديد من Meta
    if (data.entry?.[0]?.changes?.[0]?.value?.leadgen_id) {
      const leadId = data.entry[0].changes[0].value.leadgen_id;
      await this.processMetaLead(leadId);
    }
    return { status: 'ok' };
  }
  
  private async processMetaLead(leadId: string) {
    // جلب بيانات Lead من Meta
    const leadData = await this.getLeadFromMeta(leadId);
    
    // إضافة إلى Odoo CRM
    await this.crmService.createLead({
      name: leadData.field_data.find(f => f.name === 'full_name')?.values[0],
      email: leadData.field_data.find(f => f.name === 'email')?.values[0],
      phone: leadData.field_data.find(f => f.name === 'phone_number')?.values[0],
      source: 'meta_ads'
    });
  }
}
```

### الخطوة 3: جلب Leads تلقائياً
```javascript
// خدمة بسيطة لجلب Leads
class MetaLeadsService {
  async syncLeads() {
    const forms = await this.getLeadForms();
    
    for (const form of forms) {
      const leads = await this.getFormLeads(form.id);
      
      for (const lead of leads) {
        await this.addToOdoo(lead);
      }
    }
  }
  
  private async getLeadForms() {
    const response = await fetch(
      `https://graph.facebook.com/v18.0/${PAGE_ID}/leadgen_forms?access_token=${ACCESS_TOKEN}`
    );
    return response.json();
  }
}
```

---

## ⚙️ **الإعدادات المطلوبة**

### Environment Variables:
```env
# Meta Configuration
META_APP_ID=your_app_id
META_APP_SECRET=your_app_secret
META_ACCESS_TOKEN=your_access_token
META_PAGE_ID=your_page_id
META_WEBHOOK_VERIFY_TOKEN=your_verify_token

# Webhook URL
META_WEBHOOK_URL=https://yourdomain.com/api/meta/webhook
```

### Permissions المطلوبة:
```javascript
const requiredPermissions = [
  'leads_retrieval',        // جلب Leads
  'pages_manage_ads',       // إدارة الإعلانات
  'business_management'     // إدارة الأعمال
];
```

---

## 📊 **البيانات المتاحة من Meta**

### Lead Data Structure:
```javascript
const metaLead = {
  id: "lead_id",
  created_time: "2024-01-15T10:30:00Z",
  field_data: [
    { name: "full_name", values: ["أحمد محمد"] },
    { name: "email", values: ["ahmed@example.com"] },
    { name: "phone_number", values: ["+966501234567"] },
    { name: "company_name", values: ["شركة المثال"] },
    { name: "job_title", values: ["مدير المبيعات"] }
  ],
  ad_id: "ad_123456",
  form_id: "form_789012"
};
```

---

## 🚀 **التطبيق في النظام الحالي**

### إضافة إلى CRM Controller الموجود:
```javascript
// في apps/api/src/controllers/crm.controller.ts
@Post('sync-meta')
async syncWithMeta() {
  console.log('🔄 Syncing with Meta...');
  
  // جلب Leads من Meta API
  const metaLeads = await this.metaService.getNewLeads();
  
  // إضافة كل Lead إلى Odoo
  for (const lead of metaLeads) {
    await this.odooConnector.addCustomerFromMeta({
      name: lead.full_name,
      email: lead.email,
      phone: lead.phone_number,
      source: 'meta_ads',
      ad_id: lead.ad_id
    });
  }
  
  return { 
    success: true, 
    synced: metaLeads.length,
    message: `تم مزامنة ${metaLeads.length} عميل من Meta`
  };
}
```

---

## ⏱️ **الجدول الزمني للتطبيق**

| المرحلة | الوقت | الصعوبة |
|---------|-------|----------|
| إعداد Meta App | 30 دقيقة | ⭐☆☆☆☆ |
| تطوير Webhook | 2 ساعة | ⭐⭐☆☆☆ |
| تكامل مع Odoo | 1 ساعة | ⭐☆☆☆☆ |
| اختبار النظام | 1 ساعة | ⭐☆☆☆☆ |
| **المجموع** | **4.5 ساعة** | **⭐⭐☆☆☆** |

---

## 🎯 **الفوائد المباشرة**

### للمبيعات:
- ✅ **Leads تلقائية** من إعلانات Facebook/Instagram
- ✅ **استجابة فورية** للعملاء المهتمين
- ✅ **تتبع مصدر** كل عميل
- ✅ **تحليل أداء** الإعلانات

### للإدارة:
- ✅ **تقارير شاملة** عن أداء الإعلانات
- ✅ **ROI واضح** لكل حملة إعلانية
- ✅ **تحسين مستمر** للاستهداف
- ✅ **توفير وقت** الفريق

---

## 🔥 **الخلاصة**

**الربط مع Meta بسيط جداً ويمكن تطبيقه في نصف يوم عمل!**

### المطلوب فقط:
1. **Meta Developer Account** (مجاني)
2. **Access Token** (5 دقائق للحصول عليه)
3. **Webhook URL** (موجود في النظام)
4. **4-5 ساعات تطوير** (بسيط جداً)

### النتيجة:
**🚀 نظام CRM متكامل مع Meta يجلب العملاء تلقائياً من الإعلانات!**