# 🌍 أمثلة حقيقية - CRM Integration

## 🎯 سيناريوهات العمل الحقيقية

### 📱 **السيناريو 1: رسالة WhatsApp جديدة**

#### **الرسالة الواردة:**
```json
{
  "from": "+966501234567",
  "profile": { "name": "أحمد محمد" },
  "text": { "body": "مرحباً، أريد الاستفسار عن خدماتكم" },
  "timestamp": "1704722400"
}
```

#### **المعالجة الكاملة:**
```typescript
async function handleWhatsAppMessage(message: WhatsAppMessage) {
  console.log(`📱 رسالة جديدة من ${message.profile.name}`);

  // 1. البحث عن عميل موجود
  const existingLeads = await odoo.searchRead('crm.lead', [
    ['phone', '=', message.from]
  ]);

  let leadId: number;
  let isNewCustomer = false;

  if (existingLeads.length === 0) {
    // 2. إنشاء عميل جديد
    leadId = await odoo.create('crm.lead', {
      name: message.profile.name,
      phone: message.from,
      email: `${message.from.replace('+', '').replace(/\s/g, '')}@whatsapp.temp`,
      description: `رسالة WhatsApp: ${message.text.body}`,
      source_id: await getSourceId('WhatsApp'),
      stage_id: 1, // New lead
      user_id: await getAvailableSalesperson()
    });

    isNewCustomer = true;
    console.log(`✅ عميل جديد تم إنشاؤه: ${leadId}`);
  } else {
    leadId = existingLeads[0].id;
    console.log(`📝 عميل موجود: ${leadId}`);
  }

  // 3. إضافة الرسالة كسجل
  await odoo.create('mail.message', {
    model: 'crm.lead',
    res_id: leadId,
    message_type: 'comment',
    body: `<p><strong>رسالة WhatsApp:</strong><br/>${message.text.body}</p>`,
    author_id: 1,
    date: new Date(parseInt(message.timestamp) * 1000).toISOString()
  });

  // 4. إنشاء مهمة متابعة
  await odoo.create('mail.activity', {
    activity_type_id: 1, // Phone call
    summary: isNewCustomer ? 'الاتصال بعميل جديد من WhatsApp' : 'متابعة رسالة WhatsApp',
    note: `العميل كتب: "${message.text.body}"`,
    date_deadline: getNextBusinessDay(),
    res_model: 'crm.lead',
    res_id: leadId,
    user_id: await getAssignedSalesperson(leadId)
  });

  // 5. إرسال رد تلقائي
  await sendAutoReply(message.from, message.profile.name, isNewCustomer);

  // 6. تتبع GTM
  gtm.trackEvent({
    event: 'whatsapp_message_received',
    customer_id: leadId,
    customer_name: message.profile.name,
    is_new_customer: isNewCustomer
  });

  // 7. إشعار فريق المبيعات
  await notifySalesTeam(leadId, message.profile.name, isNewCustomer);

  return { leadId, isNewCustomer };
}
```

#### **النتيجة المتوقعة:**
```
✅ عميل جديد تم إنشاؤه: 156
📤 رد تلقائي تم إرساله
🔔 تم إشعار مندوب المبيعات: سارة أحمد
📊 تم تسجيل الحدث في GTM
⏰ مهمة متابعة مجدولة لغداً الساعة 9:00 ص
```

---

### 💰 **السيناريو 2: تحويل عميل محتمل إلى صفقة**

#### **العميل يقرر الشراء:**
```typescript
async function convertLeadToOpportunity(leadId: number, dealValue: number) {
  console.log(`💰 تحويل العميل ${leadId} إلى صفقة بقيمة ${dealValue} ريال`);

  // 1. تحديث مرحلة العميل
  await odoo.write('crm.lead', [leadId], {
    stage_id: 3, // Proposition stage
    planned_revenue: dealValue,
    probability: 75, // 75% chance of closing
    date_deadline: getDateAfterDays(30) // Expected close in 30 days
  });

  // 2. إنشاء عرض سعر
  const quoteId = await odoo.create('sale.order', {
    partner_id: await getOrCreatePartner(leadId),
    opportunity_id: leadId,
    amount_total: dealValue,
    state: 'draft'
  });

  // 3. إضافة منتجات للعرض
  await odoo.create('sale.order.line', {
    order_id: quoteId,
    product_id: await getProductId('خدمة استشارية'),
    product_uom_qty: 1,
    price_unit: dealValue
  });

  // 4. إنشاء مهمة إرسال العرض
  await odoo.create('mail.activity', {
    activity_type_id: 2, // Email
    summary: 'إرسال عرض السعر للعميل',
    note: `عرض سعر رقم ${quoteId} بقيمة ${dealValue} ريال`,
    date_deadline: new Date().toISOString().split('T')[0],
    res_model: 'crm.lead',
    res_id: leadId,
    user_id: await getAssignedSalesperson(leadId)
  });

  // 5. تتبع التحويل في GTM
  gtm.trackEvent({
    event: 'lead_converted_to_opportunity',
    lead_id: leadId,
    opportunity_value: dealValue,
    conversion_stage: 'proposition'
  });

  // 6. إشعار الإدارة
  await notifyManagement(`تم تحويل عميل إلى صفقة بقيمة ${dealValue} ريال`);

  console.log(`✅ تم إنشاء عرض سعر رقم ${quoteId}`);
  return { quoteId, leadId };
}
```

---

### 📊 **السيناريو 3: تقرير أداء يومي**

#### **تقرير تلقائي كل صباح:**
```typescript
async function generateDailyReport() {
  console.log('📊 إنشاء تقرير الأداء اليومي...');

  // 1. إحصائيات العملاء الجدد
  const newLeadsToday = await odoo.searchRead('crm.lead', [
    ['create_date', '>=', getTodayStart()],
    ['create_date', '<=', getTodayEnd()]
  ]);

  // 2. إحصائيات WhatsApp
  const whatsappLeadsToday = newLeadsToday.filter(lead => 
    lead.source_id && lead.source_id[1] === 'WhatsApp'
  );

  // 3. الصفقات المغلقة اليوم
  const wonDealsToday = await odoo.searchRead('crm.lead', [
    ['stage_id.name', '=', 'Won'],
    ['date_closed', '>=', getTodayStart()],
    ['date_closed', '<=', getTodayEnd()]
  ]);

  // 4. إجمالي الإيرادات
  const totalRevenue = wonDealsToday.reduce((sum, deal) => 
    sum + (deal.planned_revenue || 0), 0
  );

  // 5. المهام المعلقة
  const pendingActivities = await odoo.searchRead('mail.activity', [
    ['date_deadline', '<=', new Date().toISOString().split('T')[0]],
    ['res_model', '=', 'crm.lead']
  ]);

  // 6. أفضل مندوب مبيعات
  const salesPerformance = await odoo.readGroup('crm.lead', 
    [['stage_id.name', '=', 'Won'], ['date_closed', '>=', getMonthStart()]], 
    ['user_id', 'planned_revenue:sum'], 
    ['user_id']
  );

  const topSalesperson = salesPerformance.sort((a, b) => 
    b.planned_revenue - a.planned_revenue
  )[0];

  // 7. إنشاء التقرير
  const report = {
    date: new Date().toLocaleDateString('ar-SA'),
    newLeads: {
      total: newLeadsToday.length,
      whatsapp: whatsappLeadsToday.length,
      website: newLeadsToday.length - whatsappLeadsToday.length
    },
    closedDeals: {
      count: wonDealsToday.length,
      revenue: totalRevenue
    },
    pendingTasks: pendingActivities.length,
    topSalesperson: topSalesperson ? {
      name: topSalesperson.user_id[1],
      revenue: topSalesperson.planned_revenue
    } : null
  };

  // 8. إرسال التقرير
  await sendDailyReportEmail(report);
  await postToSlack(formatReportForSlack(report));

  console.log('✅ تم إرسال التقرير اليومي');
  return report;
}
```

#### **نموذج التقرير:**
```
📊 تقرير الأداء اليومي - 8 يناير 2025

👥 العملاء الجدد: 12 عميل
   📱 من WhatsApp: 8 عملاء (67%)
   🌐 من الموقع: 4 عملاء (33%)

💰 الصفقات المغلقة: 3 صفقات
   💵 إجمالي الإيرادات: 45,000 ريال
   📈 متوسط قيمة الصفقة: 15,000 ريال

⏰ المهام المعلقة: 7 مهام
   🔴 متأخرة: 2 مهام
   🟡 اليوم: 5 مهام

🏆 أفضل مندوب: سارة أحمد (125,000 ريال هذا الشهر)
```

---

### 🔄 **السيناريو 4: متابعة تلقائية للعملاء**

#### **نظام المتابعة الذكي:**
```typescript
async function runAutomaticFollowUp() {
  console.log('🔄 تشغيل نظام المتابعة التلقائية...');

  // 1. العملاء بدون رد لأكثر من 3 أيام
  const staleLeads = await odoo.searchRead('crm.lead', [
    ['stage_id.name', '=', 'New'],
    ['create_date', '<=', getDateBefore(3)],
    ['activity_ids', '=', false] // No pending activities
  ]);

  for (const lead of staleLeads) {
    // إنشاء مهمة متابعة
    await odoo.create('mail.activity', {
      activity_type_id: 1, // Phone call
      summary: 'متابعة عميل بدون رد',
      note: `العميل ${lead.name} لم يتم التواصل معه منذ ${getDaysSince(lead.create_date)} أيام`,
      date_deadline: new Date().toISOString().split('T')[0],
      res_model: 'crm.lead',
      res_id: lead.id,
      user_id: lead.user_id[0]
    });

    console.log(`📞 مهمة متابعة للعميل ${lead.name}`);
  }

  // 2. العروض المعلقة لأكثر من أسبوع
  const staleQuotes = await odoo.searchRead('crm.lead', [
    ['stage_id.name', '=', 'Proposition'],
    ['write_date', '<=', getDateBefore(7)]
  ]);

  for (const lead of staleQuotes) {
    // إرسال رسالة WhatsApp تذكيرية
    await sendWhatsAppReminder(lead.phone, lead.name);
    
    // تحديث احتمالية النجاح
    await odoo.write('crm.lead', [lead.id], {
      probability: Math.max(lead.probability - 10, 10) // تقليل الاحتمالية
    });

    console.log(`📱 تذكير WhatsApp للعميل ${lead.name}`);
  }

  // 3. العملاء الفائزين - طلب مراجعة
  const recentWins = await odoo.searchRead('crm.lead', [
    ['stage_id.name', '=', 'Won'],
    ['date_closed', '>=', getDateBefore(7)],
    ['date_closed', '<=', getDateBefore(3)]
  ]);

  for (const lead of recentWins) {
    await sendReviewRequest(lead.phone, lead.name);
    console.log(`⭐ طلب مراجعة من العميل ${lead.name}`);
  }

  console.log(`✅ تمت معالجة ${staleLeads.length + staleQuotes.length + recentWins.length} عميل`);
}
```

---

### 📈 **السيناريو 5: تحليل الأداء الشهري**

#### **تقرير شامل للإدارة:**
```typescript
async function generateMonthlyAnalysis() {
  console.log('📈 إنشاء تحليل الأداء الشهري...');

  const monthStart = getMonthStart();
  const monthEnd = getMonthEnd();

  // 1. إحصائيات شاملة
  const stats = {
    // العملاء الجدد
    newLeads: await odoo.searchCount('crm.lead', [
      ['create_date', '>=', monthStart],
      ['create_date', '<=', monthEnd]
    ]),

    // الصفقات المغلقة
    wonDeals: await odoo.searchRead('crm.lead', [
      ['stage_id.name', '=', 'Won'],
      ['date_closed', '>=', monthStart],
      ['date_closed', '<=', monthEnd]
    ]),

    // الصفقات المفقودة
    lostDeals: await odoo.searchRead('crm.lead', [
      ['stage_id.name', '=', 'Lost'],
      ['date_closed', '>=', monthStart],
      ['date_closed', '<=', monthEnd]
    ])
  };

  // 2. تحليل المصادر
  const sourceAnalysis = await odoo.readGroup('crm.lead',
    [['create_date', '>=', monthStart], ['create_date', '<=', monthEnd]],
    ['source_id', 'planned_revenue:sum'],
    ['source_id']
  );

  // 3. أداء فريق المبيعات
  const salesTeamPerformance = await odoo.readGroup('crm.lead',
    [['stage_id.name', '=', 'Won'], ['date_closed', '>=', monthStart]],
    ['user_id', 'planned_revenue:sum'],
    ['user_id']
  );

  // 4. تحليل الوقت للإغلاق
  const avgClosingTime = await calculateAverageClosingTime(monthStart, monthEnd);

  // 5. معدل التحويل
  const totalLeads = stats.newLeads;
  const convertedLeads = stats.wonDeals.length;
  const conversionRate = totalLeads > 0 ? (convertedLeads / totalLeads) * 100 : 0;

  // 6. إنشاء التقرير النهائي
  const analysis = {
    period: `${monthStart} - ${monthEnd}`,
    summary: {
      newLeads: totalLeads,
      wonDeals: convertedLeads,
      lostDeals: stats.lostDeals.length,
      conversionRate: Math.round(conversionRate * 100) / 100,
      totalRevenue: stats.wonDeals.reduce((sum, deal) => sum + deal.planned_revenue, 0),
      avgClosingTime: avgClosingTime
    },
    sourceBreakdown: sourceAnalysis.map(source => ({
      name: source.source_id[1],
      leads: source.source_id_count,
      revenue: source.planned_revenue
    })),
    salesTeamPerformance: salesTeamPerformance.map(person => ({
      name: person.user_id[1],
      deals: person.user_id_count,
      revenue: person.planned_revenue
    })).sort((a, b) => b.revenue - a.revenue)
  };

  // 7. حفظ التقرير وإرساله
  await saveMonthlyReport(analysis);
  await sendExecutiveReport(analysis);

  console.log('✅ تم إنشاء وإرسال التحليل الشهري');
  return analysis;
}
```

---

### 🎯 **السيناريو 6: تكامل كامل مع WhatsApp Business**

#### **معالجة متقدمة للرسائل:**
```typescript
class AdvancedWhatsAppProcessor {
  async processIncomingMessage(webhook: WhatsAppWebhook) {
    const { messages, contacts } = webhook;

    for (const message of messages) {
      const contact = contacts.find(c => c.wa_id === message.from);
      
      // 1. تحليل نوع الرسالة
      const messageType = this.analyzeMessageType(message);
      
      // 2. معالجة حسب النوع
      switch (messageType) {
        case 'new_inquiry':
          await this.handleNewInquiry(message, contact);
          break;
        case 'follow_up':
          await this.handleFollowUp(message, contact);
          break;
        case 'complaint':
          await this.handleComplaint(message, contact);
          break;
        case 'order_request':
          await this.handleOrderRequest(message, contact);
          break;
        default:
          await this.handleGeneralMessage(message, contact);
      }
    }
  }

  private analyzeMessageType(message: any): string {
    const text = message.text?.body?.toLowerCase() || '';
    
    if (text.includes('شكوى') || text.includes('مشكلة')) {
      return 'complaint';
    } else if (text.includes('طلب') || text.includes('أريد شراء')) {
      return 'order_request';
    } else if (text.includes('متابعة') || text.includes('العرض')) {
      return 'follow_up';
    } else {
      return 'new_inquiry';
    }
  }

  private async handleNewInquiry(message: any, contact: any) {
    // إنشاء عميل جديد مع تصنيف ذكي
    const leadId = await odoo.create('crm.lead', {
      name: contact.profile?.name || message.from,
      phone: message.from,
      description: message.text?.body,
      source_id: await this.getWhatsAppSourceId(),
      stage_id: 1,
      priority: this.calculatePriority(message.text?.body),
      tag_ids: await this.generateTags(message.text?.body)
    });

    // رد ذكي حسب المحتوى
    const smartReply = await this.generateSmartReply(message.text?.body);
    await this.sendWhatsAppMessage(message.from, smartReply);

    return leadId;
  }

  private async generateSmartReply(messageContent: string): Promise<string> {
    const content = messageContent.toLowerCase();
    
    if (content.includes('سعر') || content.includes('تكلفة')) {
      return `شكراً لاستفسارك عن الأسعار! 💰
      
سيقوم فريق المبيعات بإرسال عرض سعر مفصل خلال ساعتين.

في الأثناء، يمكنك زيارة موقعنا: www.azizsys.com

هل لديك أي متطلبات خاصة؟`;
    } else if (content.includes('خدمة') || content.includes('منتج')) {
      return `مرحباً بك في AzizSys! 🚀

نحن متخصصون في:
• تطوير الأنظمة الذكية
• تكامل الذكاء الاصطناعي  
• حلول CRM المتقدمة

سيتواصل معك مستشارنا خلال 30 دقيقة لمناقشة احتياجاتك.`;
    } else {
      return `أهلاً وسهلاً! 👋

شكراً لتواصلك مع AzizSys. تم استلام رسالتك وسيرد عليك فريقنا المختص قريباً.

⏰ وقت الاستجابة المتوقع: أقل من ساعة
📞 للاستفسارات العاجلة: 920000000

نقدر ثقتك بنا! 🙏`;
    }
  }
}
```

---

## 🎯 الخلاصة العملية

### **أهم النقاط للمطور:**

1. **ابدأ بالبيانات الحقيقية** - لا تعتمد على البيانات الوهمية
2. **اختبر كل API call** قبل بناء الواجهة
3. **استخدم TypeScript** لتجنب الأخطاء
4. **وثق كل function** مع أمثلة حقيقية
5. **راقب الأداء** باستمرار
6. **اعتمد على الأحداث** للتكامل بين الأنظمة

### **الأدوات المساعدة:**
- **Postman** لاختبار API
- **TypeScript** للأمان
- **Jest** للاختبارات
- **Winston** للسجلات
- **Prometheus** للمراقبة

**🚀 مع هذه الأمثلة، ستبني CRM حقيقي وفعال!**