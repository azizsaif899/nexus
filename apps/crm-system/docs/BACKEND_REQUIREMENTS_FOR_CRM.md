# 🔧 متطلبات فريق الخلفية لإكمال وحدة CRM

**التاريخ:** اليوم  
**الأولوية:** عالية جداً  
**الحالة:** مطلوب فوري  

## 📋 نظرة عامة

هذه الوثيقة تحدد المتطلبات الدقيقة من فريق عمل الخلفية لإكمال تطوير الواجهة الأمامية لوحدة CRM بشكل كامل وموثوق. الهدف هو الانتقال من البيانات الوهمية إلى التكامل الحقيقي مع مصادر البيانات.

## 🎯 المتطلبات الأساسية

### 1. نقطة نهاية جلب تفاصيل العميل الكاملة

**المسار المطلوب:** `GET /api/customer/:customerId`

**الأهمية:** 🔴 حاسمة - أساس صفحة "ملف العميل 360 درجة"

**الوضع الحالي:**
- موجودة في `customer.routes.ts` 
- تستخدم `OdooClient`
- تحتوي على بيانات وهمية للأنشطة

**المطلوب:**
```typescript
interface CustomerDetailsResponse {
  id: string;
  name: string;
  email: string;
  phone: string;
  company?: string;
  stage: {
    id: string;
    name: string;
    color: string;
  };
  expectedRevenue: number;
  probability: number;
  source: string;
  assignedTo: {
    id: string;
    name: string;
    avatar?: string;
  };
  createdAt: string;
  updatedAt: string;
  // الفرص المرتبطة
  opportunities: Array<{
    id: string;
    name: string;
    value: number;
    stage: string;
    probability: number;
  }>;
  // معلومات إضافية من Odoo
  odooData: {
    partnerId: number;
    leadId?: number;
    tags: string[];
    description?: string;
  };
}
```

**التحقق المطلوب:**
- ✅ تأكيد أن النقطة تستخدم تكامل Odoo الحقيقي
- ✅ تأكيد أنها تجلب جميع البيانات المطلوبة
- ✅ توثيق هيكل الاستجابة الكامل

---

### 2. نقطة نهاية رؤى Meta Ads

**المسار المطلوب:** `GET /api/customer/:customerId/meta-insights`

**الأهمية:** 🟡 مهمة - لقسم رؤى Meta في صفحة العميل

**الوضع الحالي:**
- موجودة كافتراض في `customer.routes.ts`
- تستخدم بيانات محاكاة

**المطلوب:**
```typescript
interface MetaInsightsResponse {
  customerId: string;
  campaignData: {
    campaignId: string;
    campaignName: string;
    adSetName: string;
    adName: string;
    source: 'facebook' | 'instagram' | 'messenger';
  };
  metrics: {
    impressions: number;
    clicks: number;
    ctr: number; // Click-through rate
    cpc: number; // Cost per click
    cpm: number; // Cost per mille
    spend: number;
    conversions: number;
    roas: number; // Return on ad spend
  };
  attribution: {
    firstTouch: string; // تاريخ أول تفاعل
    lastTouch: string; // تاريخ آخر تفاعل
    touchpoints: number; // عدد نقاط التفاعل
  };
  demographics: {
    age: string;
    gender: string;
    location: string;
    interests: string[];
  };
}
```

**التحقق المطلوب:**
- ✅ تكامل حقيقي مع Meta API
- ✅ ربط البيانات بالعميل المحدد
- ✅ معالجة الحالات التي لا توجد فيها بيانات Meta

---

### 3. نقطة نهاية تحليل الشخصية

**المسار المطلوب:** `GET /api/customer/:customerId/personality`

**الأهمية:** 🟡 مهمة - لقسم تحليل الشخصية

**الوضع الحالي:**
- غير موجودة - بيانات وهمية في الواجهة الأمامية

**المطلوب:**
```typescript
interface PersonalityAnalysisResponse {
  customerId: string;
  analysis: {
    personalityType: string; // مثل: "Analytical", "Driver", "Expressive", "Amiable"
    confidence: number; // مستوى الثقة في التحليل (0-100)
    traits: Array<{
      name: string;
      score: number; // 0-100
      description: string;
    }>;
  };
  communicationStyle: {
    preferredChannel: 'email' | 'phone' | 'whatsapp' | 'meeting';
    responseTime: 'immediate' | 'same-day' | 'next-day' | 'flexible';
    tone: 'formal' | 'casual' | 'friendly' | 'professional';
  };
  recommendations: Array<{
    category: 'approach' | 'timing' | 'content' | 'follow-up';
    suggestion: string;
    priority: 'high' | 'medium' | 'low';
  }>;
  dataSource: {
    basedOn: string[]; // مصادر البيانات المستخدمة في التحليل
    lastUpdated: string;
    nextUpdate?: string;
  };
}
```

**التحقق المطلوب:**
- ✅ توضيح آلية توليد التحليل (AI، تخزين، ديناميكي)
- ✅ تحديد مصادر البيانات المستخدمة
- ✅ معالجة الحالات التي لا يوجد فيها تحليل

---

### 4. نقطة نهاية الجدول الزمني الموحد

**المسار المطلوب:** `GET /api/customer/:customerId/activities`

**الأهمية:** 🔴 حاسمة - الجدول الزمني الموحد ميزة أساسية

**الوضع الحالي:**
- بيانات وهمية في نقطة نهاية العميل الرئيسية

**المطلوب:**
```typescript
interface UnifiedTimelineResponse {
  customerId: string;
  activities: Array<{
    id: string;
    type: 'call' | 'email' | 'whatsapp' | 'meeting' | 'note' | 'task' | 'opportunity_update';
    timestamp: string;
    title: string;
    description: string;
    source: 'odoo' | 'whatsapp' | 'gmail' | 'meta' | 'manual';
    user: {
      id: string;
      name: string;
      avatar?: string;
    };
    metadata: {
      // بيانات إضافية حسب نوع النشاط
      duration?: number; // للمكالمات والاجتماعات (بالدقائق)
      direction?: 'inbound' | 'outbound'; // للمكالمات والرسائل
      status?: 'completed' | 'scheduled' | 'cancelled'; // للمهام والاجتماعات
      attachments?: Array<{
        name: string;
        url: string;
        type: string;
      }>;
      relatedRecords?: Array<{
        type: 'opportunity' | 'quote' | 'invoice';
        id: string;
        name: string;
      }>;
    };
    priority?: 'low' | 'medium' | 'high' | 'urgent';
  }>;
  pagination: {
    total: number;
    page: number;
    limit: number;
    hasNext: boolean;
    hasPrev: boolean;
  };
}
```

**المعاملات المدعومة:**
```typescript
interface TimelineQueryParams {
  page?: number;
  limit?: number;
  type?: string[]; // تصفية حسب نوع النشاط
  dateFrom?: string;
  dateTo?: string;
  source?: string[]; // تصفية حسب المصدر
  userId?: string; // تصفية حسب المستخدم
}
```

**التحقق المطلوب:**
- ✅ تجميع الأنشطة من جميع المصادر المتكاملة
- ✅ ترتيب زمني صحيح
- ✅ دعم التصفية والبحث
- ✅ معالجة الأداء للعملاء ذوي الأنشطة الكثيرة

---

### 5. نقطة نهاية إحصائيات لوحة التحكم

**المسار المطلوب:** `GET /api/crm/dashboard/stats`

**الأهمية:** 🟡 مهمة - بطاقات الإحصائيات الرئيسية

**الوضع الحالي:**
- نقطة نهاية افتراضية في الواجهة الأمامية

**المطلوب:**
```typescript
interface DashboardStatsResponse {
  totalLeads: {
    count: number;
    change: number; // التغيير من الفترة السابقة (%)
    trend: 'up' | 'down' | 'stable';
  };
  totalOpportunities: {
    count: number;
    value: number; // إجمالي قيمة الفرص
    change: number;
    trend: 'up' | 'down' | 'stable';
  };
  expectedRevenue: {
    amount: number;
    currency: string;
    change: number;
    trend: 'up' | 'down' | 'stable';
  };
  conversionRate: {
    rate: number; // نسبة مئوية
    change: number;
    trend: 'up' | 'down' | 'stable';
  };
  // إحصائيات إضافية
  averageDealSize: number;
  salesCycleLength: number; // بالأيام
  topPerformers: Array<{
    userId: string;
    name: string;
    deals: number;
    revenue: number;
  }>;
  // توزيع حسب المراحل
  stageDistribution: Array<{
    stageId: string;
    stageName: string;
    count: number;
    value: number;
  }>;
}
```

**المعاملات المدعومة:**
```typescript
interface StatsQueryParams {
  period?: 'today' | 'week' | 'month' | 'quarter' | 'year';
  dateFrom?: string;
  dateTo?: string;
  teamId?: string;
  userId?: string;
}
```

---

### 6. نقطة نهاية النبض الحي

**المسار المطلوب:** `GET /api/crm/dashboard/pulse`

**الأهمية:** 🟡 مهمة - رؤى وتوصيات ذكية

**الوضع الحالي:**
- موجودة في `pulse.routes.ts` ببيانات وهمية

**المطلوب:**
```typescript
interface PulseInsightsResponse {
  opportunities: Array<{
    id: string;
    type: 'hot_lead' | 'stale_opportunity' | 'high_value_deal' | 'quick_win';
    title: string;
    description: string;
    impact: 'high' | 'medium' | 'low';
    urgency: 'immediate' | 'this_week' | 'this_month';
    relatedCustomer: {
      id: string;
      name: string;
    };
    suggestedAction: {
      action: string;
      reason: string;
      expectedOutcome: string;
    };
    metrics?: {
      potentialRevenue?: number;
      probability?: number;
      daysInStage?: number;
    };
  }>;
  risks: Array<{
    id: string;
    type: 'deal_slipping' | 'customer_churn' | 'competitor_threat' | 'budget_concern';
    title: string;
    description: string;
    severity: 'critical' | 'high' | 'medium' | 'low';
    relatedCustomer: {
      id: string;
      name: string;
    };
    mitigation: {
      action: string;
      timeline: string;
      resources: string[];
    };
    impact?: {
      revenueAtRisk?: number;
      probability?: number;
    };
  }>;
  trends: Array<{
    id: string;
    type: 'performance' | 'market' | 'seasonal' | 'competitive';
    title: string;
    description: string;
    direction: 'positive' | 'negative' | 'neutral';
    confidence: number; // 0-100
    timeframe: string;
    data: Array<{
      period: string;
      value: number;
      change?: number;
    }>;
    recommendation?: string;
  }>;
  summary: {
    totalInsights: number;
    criticalItems: number;
    lastUpdated: string;
    nextUpdate: string;
  };
}
```

**التحقق المطلوب:**
- ✅ تكامل مع نظام AI لتوليد الرؤى
- ✅ تحديث دوري للبيانات
- ✅ ربط الرؤى بالعملاء والفرص الحقيقية

---

### 7. نقطة نهاية الاستعلام باللغة الطبيعية

**المسار المطلوب:** `POST /api/crm/natural-query`

**الأهمية:** 🟡 مهمة - شريط الأوامر الذكي

**الوضع الحالي:**
- نقطة نهاية افتراضية في الواجهة الأمامية

**المطلوب:**
```typescript
interface NaturalQueryRequest {
  query: string;
  context?: {
    userId?: string;
    currentPage?: string;
    filters?: Record<string, any>;
  };
  language?: 'ar' | 'en';
}

interface NaturalQueryResponse {
  queryId: string;
  interpretation: {
    intent: 'search' | 'filter' | 'report' | 'action' | 'question';
    entities: Array<{
      type: 'customer' | 'opportunity' | 'date' | 'amount' | 'stage' | 'user';
      value: string;
      confidence: number;
    }>;
    parameters: Record<string, any>;
  };
  results: {
    type: 'customers' | 'opportunities' | 'statistics' | 'insights' | 'actions';
    data: any; // البيانات المطلوبة حسب النوع
    count: number;
    executionTime: number; // بالميلي ثانية
  };
  suggestions?: Array<{
    query: string;
    description: string;
  }>;
  error?: {
    code: string;
    message: string;
    suggestions: string[];
  };
}
```

**أمثلة على الاستعلامات المدعومة:**
- "أظهر لي العملاء الجدد هذا الأسبوع"
- "ما هي الفرص التي تحتاج متابعة؟"
- "كم إجمالي المبيعات المتوقعة هذا الشهر؟"
- "من هو أفضل مندوب مبيعات؟"

---

## 🔧 متطلبات إضافية

### 1. تحسين نقطة نهاية العملاء المحتملين

**المسار:** `GET /api/leads`

**التحسينات المطلوبة:**
```typescript
interface LeadsQueryParams {
  // البحث
  search?: string; // البحث في الاسم، البريد، الشركة
  
  // التصفية
  stageId?: string[];
  assignedTo?: string[];
  source?: string[];
  dateFrom?: string;
  dateTo?: string;
  revenueMin?: number;
  revenueMax?: number;
  probabilityMin?: number;
  probabilityMax?: number;
  
  // الترتيب
  sortBy?: 'name' | 'createdAt' | 'updatedAt' | 'revenue' | 'probability';
  sortOrder?: 'asc' | 'desc';
  
  // الترقيم
  page?: number;
  limit?: number;
  
  // العرض
  include?: string[]; // مثل: ['opportunities', 'activities', 'meta_insights']
}
```

### 2. نقاط نهاية الإجراءات

**المطلوب:**
- `POST /api/customer/:customerId/activity` - إضافة نشاط جديد
- `PUT /api/customer/:customerId/stage` - تحديث مرحلة العميل
- `POST /api/customer/:customerId/note` - إضافة ملاحظة
- `POST /api/customer/:customerId/task` - إنشاء مهمة
- `POST /api/customer/:customerId/meeting` - جدولة اجتماع

### 3. نقاط نهاية التقارير

**المطلوب:**
- `GET /api/crm/reports/sales-funnel` - تقرير قمع المبيعات
- `GET /api/crm/reports/performance` - تقرير الأداء
- `GET /api/crm/reports/conversion` - تقرير معدلات التحويل

---

## 📚 متطلبات التوثيق

### 1. توثيق API شامل

**المطلوب إنشاء/تحديث:**
- `docs/api/CRM_API_REFERENCE.md` - مرجع شامل لجميع نقاط النهاية
- `docs/api/ODOO_INTEGRATION.md` - توثيق التكامل مع Odoo
- `docs/api/META_INTEGRATION.md` - توثيق التكامل مع Meta
- `docs/api/AI_SERVICES.md` - توثيق خدمات الذكاء الاصطناعي

### 2. أمثلة الاستخدام

**لكل نقطة نهاية:**
- أمثلة على الطلبات
- أمثلة على الاستجابات
- رموز الأخطاء المحتملة
- معالجة الحالات الاستثنائية

### 3. دليل التكامل

**للفريق الأمامي:**
- كيفية استخدام كل نقطة نهاية
- أفضل الممارسات
- معالجة الأخطاء
- التحسين والأداء

---

## ⚡ الأولويات والجدول الزمني

### الأولوية العالية (الأسبوع الأول):
1. ✅ تأكيد وتوثيق نقطة نهاية تفاصيل العميل
2. ✅ إكمال نقطة نهاية الجدول الزمني الموحد
3. ✅ تحسين نقطة نهاية العملاء المحتملين

### الأولوية المتوسطة (الأسبوع الثاني):
4. ✅ نقطة نهاية إحصائيات لوحة التحكم
5. ✅ نقطة نهاية النبض الحي
6. ✅ التوثيق الأساسي

### الأولوية المنخفضة (الأسبوع الثالث):
7. ✅ نقطة نهاية رؤى Meta
8. ✅ نقطة نهاية تحليل الشخصية
9. ✅ نقطة نهاية الاستعلام الطبيعي

---

## 🧪 متطلبات الاختبار

### اختبارات الوحدة:
- اختبار كل نقطة نهاية منفردة
- اختبار التكامل مع Odoo
- اختبار معالجة الأخطاء

### اختبارات التكامل:
- اختبار التدفق الكامل للبيانات
- اختبار الأداء مع بيانات كبيرة
- اختبار الأمان والصلاحيات

### اختبارات E2E:
- اختبار السيناريوهات الكاملة
- اختبار التفاعل بين الواجهة الأمامية والخلفية

---

## 🔒 متطلبات الأمان

### المصادقة والتفويض:
- التأكد من حماية جميع نقاط النهاية
- تطبيق صلاحيات الوصول المناسبة
- تسجيل العمليات الحساسة

### حماية البيانات:
- تشفير البيانات الحساسة
- تطبيق قواعد GDPR
- حماية من هجمات الحقن

---

## 📞 التواصل والمتابعة

### نقاط التواصل:
- **المطور الرئيسي للخلفية:** [اسم المطور]
- **مدير المشروع:** [اسم المدير]
- **فريق الواجهة الأمامية:** [أسماء الفريق]

### آلية المتابعة:
- اجتماعات يومية لمراجعة التقدم
- تحديثات أسبوعية للحالة
- مراجعة الكود قبل الدمج

### أدوات التتبع:
- GitHub Issues لتتبع المهام
- Slack للتواصل السريع
- Confluence للتوثيق

---

## ✅ قائمة التحقق النهائية

### قبل إعلان الاكتمال:
- [ ] جميع نقاط النهاية تعمل مع بيانات حقيقية
- [ ] التوثيق مكتمل ومحدث
- [ ] الاختبارات تمر بنجاح
- [ ] مراجعة الكود مكتملة
- [ ] الأداء محسن ومقبول
- [ ] الأمان مطبق بشكل صحيح
- [ ] الفريق الأمامي يؤكد التكامل الناجح

---

**ملاحظة:** هذه الوثيقة حية ويجب تحديثها حسب التقدم والتغييرات في المتطلبات.

**آخر تحديث:** اليوم  
**المراجع التالي:** بعد أسبوع من بدء التطوير