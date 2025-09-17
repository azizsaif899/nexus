# 🏗️ هيكل CRM - البنية التفصيلية

## 📊 البنية العامة

```
🏢 AzizSys CRM System
├── 🗄️ Database Layer (PostgreSQL)
├── 🔗 Integration Layer (Odoo API)
├── 🔄 Business Logic Layer (TypeScript)
├── 🎨 Presentation Layer (React/HTML)
├── 📊 Analytics Layer (GTM)
└── 📱 Communication Layer (WhatsApp)
```

---

## 🗄️ طبقة قاعدة البيانات (Database Layer)

### **الموقع:** `docker/odoo-setup.yml`
```yaml
# PostgreSQL Database Configuration
postgres:
  image: postgres:15
  environment:
    POSTGRES_DB: postgres
    POSTGRES_USER: odoo
    POSTGRES_PASSWORD: odoo123
  ports:
    - "5433:5432"
```

### **الجداول الرئيسية:**
```sql
-- جدول العملاء المحتملين
crm_lead:
├── id (Primary Key)
├── name (اسم العميل)
├── phone (رقم الهاتف)
├── email (البريد الإلكتروني)
├── description (وصف الطلب)
├── source_id (مصدر العميل)
├── stage_id (مرحلة المبيعات)
├── user_id (المندوب المسؤول)
├── planned_revenue (الإيرادات المتوقعة)
├── probability (احتمالية النجاح)
├── create_date (تاريخ الإنشاء)
└── write_date (تاريخ آخر تحديث)

-- جدول مراحل المبيعات
crm_stage:
├── id (Primary Key)
├── name (اسم المرحلة)
├── sequence (ترتيب المرحلة)
├── fold (مطوية أم لا)
└── probability (احتمالية افتراضية)

-- جدول مصادر العملاء
utm_source:
├── id (Primary Key)
├── name (اسم المصدر)
└── create_date (تاريخ الإنشاء)

-- جدول الرسائل والتعليقات
mail_message:
├── id (Primary Key)
├── model (نوع السجل)
├── res_id (معرف السجل)
├── body (محتوى الرسالة)
├── author_id (كاتب الرسالة)
└── date (تاريخ الرسالة)

-- جدول الأنشطة والمهام
mail_activity:
├── id (Primary Key)
├── activity_type_id (نوع النشاط)
├── summary (ملخص النشاط)
├── note (ملاحظات)
├── date_deadline (تاريخ الاستحقاق)
├── res_model (نوع السجل)
├── res_id (معرف السجل)
└── user_id (المستخدم المسؤول)
```

---

## 🔗 طبقة التكامل (Integration Layer)

### **1. Odoo Connector**
**الموقع:** `packages/odoo-integration/src/odoo-connector.ts`
```typescript
/**
 * الموصل الرئيسي مع Odoo CRM
 * المسؤوليات:
 * - الاتصال مع Odoo API
 * - المصادقة والأمان
 * - تنفيذ العمليات CRUD
 */
export class OdooConnector {
  private config: OdooConfig;
  private client: XMLRPCClient;
  
  // الاتصال والمصادقة
  async authenticate(): Promise<number>
  
  // العمليات الأساسية
  async create(model: string, data: any): Promise<number>
  async read(model: string, ids: number[]): Promise<any[]>
  async write(model: string, ids: number[], data: any): Promise<boolean>
  async unlink(model: string, ids: number[]): Promise<boolean>
  
  // البحث والاستعلام
  async search(model: string, domain: any[]): Promise<number[]>
  async searchRead(model: string, domain: any[]): Promise<any[]>
  async searchCount(model: string, domain: any[]): Promise<number>
  
  // التقارير والتجميع
  async readGroup(model: string, domain: any[], fields: string[], groupby: string[]): Promise<any[]>
}
```

### **2. WhatsApp CRM Bridge**
**الموقع:** `packages/odoo-integration/src/whatsapp-crm-bridge.ts`
```typescript
/**
 * جسر التكامل بين WhatsApp و CRM
 * المسؤوليات:
 * - معالجة رسائل WhatsApp
 * - تحويل الرسائل لعملاء في CRM
 * - إرسال الردود التلقائية
 */
export class WhatsAppCRMBridge {
  private odoo: OdooConnector;
  private gtm: GTMEngine;
  
  // معالجة الرسائل
  async processWhatsAppMessage(message: WhatsAppMessage): Promise<void>
  
  // إدارة العملاء
  async createLeadFromMessage(message: WhatsAppMessage): Promise<number>
  async updateExistingLead(leadId: number, message: WhatsAppMessage): Promise<void>
  
  // الردود التلقائية
  async sendAutoReply(phone: string, customerName: string): Promise<void>
  
  // الإشعارات
  async notifySalesTeam(leadId: number, customerName: string): Promise<void>
}
```

### **3. CRM Webhook Handler**
**الموقع:** `apps/whatsapp-exec-bot/src/crm-webhook.ts`
```typescript
/**
 * معالج Webhook لاستقبال رسائل WhatsApp
 * المسؤوليات:
 * - استقبال Webhook من WhatsApp
 * - التحقق من صحة البيانات
 * - توجيه الرسائل للمعالجة
 */
export class WhatsAppCRMWebhook {
  private crmBridge: WhatsAppCRMBridge;
  
  // معالجة Webhook
  async handleWebhook(req: Request, res: Response): Promise<void>
  
  // معالجة الرسائل
  async processMessage(message: any): Promise<void>
  
  // التحقق من البيانات
  private validateWebhookData(data: any): boolean
}
```

---

## 🔄 طبقة منطق الأعمال (Business Logic Layer)

### **1. CRM Service**
**الموقع:** `packages/core-logic/src/crm/crm.service.ts`
```typescript
/**
 * خدمة CRM الرئيسية
 * المسؤوليات:
 * - منطق الأعمال للـ CRM
 * - إدارة دورة حياة العميل
 * - حساب الإحصائيات
 */
export class CRMService {
  private odoo: OdooConnector;
  
  // إدارة العملاء المحتملين
  async createLead(leadData: CreateLeadDto): Promise<Lead>
  async updateLead(leadId: number, updateData: UpdateLeadDto): Promise<Lead>
  async deleteLead(leadId: number): Promise<void>
  async getLead(leadId: number): Promise<Lead>
  async getLeads(filters?: LeadFilters): Promise<Lead[]>
  
  // إدارة المراحل
  async moveLeadToStage(leadId: number, stageId: number): Promise<void>
  async getStages(): Promise<Stage[]>
  
  // الإحصائيات
  async getCRMStats(): Promise<CRMStats>
  async getConversionRate(): Promise<number>
  async getLeadsBySource(): Promise<SourceStats[]>
  
  // التقارير
  async generateDailyReport(): Promise<DailyReport>
  async generateMonthlyReport(): Promise<MonthlyReport>
}
```

### **2. Lead Management**
**الموقع:** `packages/core-logic/src/crm/lead-manager.ts`
```typescript
/**
 * مدير العملاء المحتملين
 * المسؤوليات:
 * - إدارة دورة حياة العميل
 * - تطبيق قواعد الأعمال
 * - المتابعة التلقائية
 */
export class LeadManager {
  // دورة حياة العميل
  async qualifyLead(leadId: number): Promise<void>
  async convertToOpportunity(leadId: number, dealValue: number): Promise<void>
  async markAsWon(leadId: number): Promise<void>
  async markAsLost(leadId: number, reason: string): Promise<void>
  
  // المتابعة التلقائية
  async scheduleFollowUp(leadId: number, days: number): Promise<void>
  async processStaleLeads(): Promise<void>
  
  // التصنيف والتقييم
  async scoreLeads(): Promise<void>
  async assignToSalesperson(leadId: number): Promise<void>
}
```

### **3. Activity Manager**
**الموقع:** `packages/core-logic/src/crm/activity-manager.ts`
```typescript
/**
 * مدير الأنشطة والمهام
 * المسؤوليات:
 * - إدارة مهام فريق المبيعات
 * - جدولة الأنشطة
 * - تتبع الإنجاز
 */
export class ActivityManager {
  // إدارة الأنشطة
  async createActivity(activityData: CreateActivityDto): Promise<Activity>
  async updateActivity(activityId: number, updateData: UpdateActivityDto): Promise<Activity>
  async completeActivity(activityId: number): Promise<void>
  
  // الجدولة
  async scheduleCall(leadId: number, dateTime: Date): Promise<Activity>
  async scheduleEmail(leadId: number, dateTime: Date): Promise<Activity>
  async scheduleMeeting(leadId: number, dateTime: Date): Promise<Activity>
  
  // التتبع
  async getOverdueActivities(): Promise<Activity[]>
  async getTodayActivities(userId: number): Promise<Activity[]>
  async getActivityStats(userId: number): Promise<ActivityStats>
}
```

---

## 🎨 طبقة العرض (Presentation Layer)

### **1. CRM Dashboard Component**
**الموقع:** `apps/admin-dashboard/src/components/CRMDashboard.tsx`
```typescript
/**
 * لوحة تحكم CRM الرئيسية
 * المسؤوليات:
 * - عرض إحصائيات CRM
 * - إدارة العملاء المحتملين
 * - التفاعل مع المستخدم
 */
export const CRMDashboard: React.FC = () => {
  // الحالة
  const [stats, setStats] = useState<CRMStats>();
  const [leads, setLeads] = useState<Lead[]>([]);
  const [loading, setLoading] = useState(true);
  
  // التأثيرات
  useEffect(() => {
    fetchCRMData();
    const interval = setInterval(fetchCRMData, 30000);
    return () => clearInterval(interval);
  }, []);
  
  // الوظائف
  const fetchCRMData = async () => { /* جلب البيانات */ };
  const updateLeadStage = async (leadId: number, stageId: number) => { /* تحديث المرحلة */ };
  const createNewLead = async (leadData: CreateLeadDto) => { /* إنشاء عميل */ };
  
  // العرض
  return (
    <div className="crm-dashboard">
      <StatsCards stats={stats} />
      <LeadsTable leads={leads} onUpdateStage={updateLeadStage} />
      <ActivityPanel />
    </div>
  );
};
```

### **2. Leads Management Component**
**الموقع:** `apps/admin-dashboard/src/components/LeadsManagement.tsx`
```typescript
/**
 * مكون إدارة العملاء المحتملين
 * المسؤوليات:
 * - عرض قائمة العملاء
 * - تحرير بيانات العملاء
 * - إدارة المراحل
 */
export const LeadsManagement: React.FC = () => {
  // عرض العملاء في جدول
  // إمكانية التحرير والحذف
  // فلترة وبحث
  // تصدير البيانات
};
```

### **3. Analytics Dashboard**
**الموقع:** `apps/admin-dashboard/src/components/AnalyticsDashboard.tsx`
```typescript
/**
 * لوحة التحليلات والتقارير
 * المسؤوليات:
 * - عرض الرسوم البيانية
 * - تحليل الأداء
 * - تقارير مفصلة
 */
export const AnalyticsDashboard: React.FC = () => {
  // رسوم بيانية للمبيعات
  // تحليل مصادر العملاء
  // معدلات التحويل
  // أداء فريق المبيعات
};
```

---

## 📊 طبقة التحليلات (Analytics Layer)

### **1. GTM Engine**
**الموقع:** `packages/gtm-engine/src/gtm-manager.ts`
```typescript
/**
 * محرك Google Tag Manager
 * المسؤوليات:
 * - تتبع أحداث CRM
 * - إرسال البيانات لـ Google Analytics
 * - قياس الأداء
 */
export class GTMEngine {
  private containerId = 'GTM-58RWKC76';
  
  // تتبع الأحداث
  trackWhatsAppInteraction(action: string, phone: string): void
  trackNewLead(leadData: any): void
  trackConversion(conversionData: any): void
  trackLeadStageChange(leadId: number, oldStage: string, newStage: string): void
  
  // قياس الأداء
  trackPageView(page: string): void
  trackUserAction(action: string, category: string): void
  
  // البيانات المخصصة
  setCustomDimension(index: number, value: string): void
  setCustomMetric(index: number, value: number): void
}
```

### **2. Analytics Service**
**الموقع:** `packages/analytics-core/src/analytics.service.ts`
```typescript
/**
 * خدمة التحليلات
 * المسؤوليات:
 * - جمع وتحليل البيانات
 * - إنشاء التقارير
 * - حساب المقاييس
 */
export class AnalyticsService {
  // تحليل الأداء
  async calculateConversionRate(period: DateRange): Promise<number>
  async getSourcePerformance(period: DateRange): Promise<SourcePerformance[]>
  async getSalesTeamPerformance(period: DateRange): Promise<TeamPerformance[]>
  
  // التقارير
  async generateDashboardData(): Promise<DashboardData>
  async generateExecutiveReport(period: DateRange): Promise<ExecutiveReport>
  
  // التنبؤات
  async predictMonthlyRevenue(): Promise<number>
  async identifyTopLeads(): Promise<Lead[]>
}
```

---

## 📱 طبقة التواصل (Communication Layer)

### **1. WhatsApp Service**
**الموقع:** `packages/whatsapp-core/src/whatsapp.service.ts`
```typescript
/**
 * خدمة WhatsApp
 * المسؤوليات:
 * - إرسال واستقبال الرسائل
 * - إدارة القوالب
 * - معالجة الوسائط
 */
export class WhatsAppService {
  // إرسال الرسائل
  async sendMessage(to: string, message: string): Promise<void>
  async sendTemplate(to: string, templateName: string, params: any[]): Promise<void>
  async sendMedia(to: string, mediaUrl: string, caption?: string): Promise<void>
  
  // استقبال الرسائل
  async processIncomingMessage(webhook: WhatsAppWebhook): Promise<void>
  
  // إدارة القوالب
  async createTemplate(templateData: TemplateData): Promise<void>
  async getApprovedTemplates(): Promise<Template[]>
}
```

### **2. Notification Service**
**الموقع:** `packages/notifications/src/notification.service.ts`
```typescript
/**
 * خدمة الإشعارات
 * المسؤوليات:
 * - إرسال إشعارات للفريق
 * - إدارة التنبيهات
 * - تخصيص الإشعارات
 */
export class NotificationService {
  // إشعارات البريد الإلكتروني
  async sendEmailNotification(to: string, subject: string, body: string): Promise<void>
  
  // إشعارات WhatsApp
  async sendWhatsAppNotification(to: string, message: string): Promise<void>
  
  // إشعارات النظام
  async sendSystemNotification(userId: number, notification: SystemNotification): Promise<void>
  
  // إشعارات المهام
  async notifyTaskAssignment(taskId: number, assigneeId: number): Promise<void>
  async notifyTaskOverdue(taskId: number): Promise<void>
}
```

---

## 🔧 ملفات التكوين والإعداد

### **1. Docker Configuration**
**الموقع:** `docker/odoo-setup.yml`
```yaml
# إعداد Odoo و PostgreSQL
# المنافذ والمتغيرات
# إعدادات الأمان
```

### **2. Environment Configuration**
**الموقع:** `.env`
```env
# إعدادات قاعدة البيانات
ODOO_URL=http://localhost:8070
ODOO_DATABASE=azizsys_crm
ODOO_USERNAME=admin
ODOO_PASSWORD=AzizSys2025!

# إعدادات WhatsApp
WHATSAPP_TOKEN=your_token
WHATSAPP_PHONE_NUMBER_ID=your_phone_id

# إعدادات GTM
GTM_CONTAINER_ID=GTM-58RWKC76

# إعدادات الأمان
JWT_SECRET=your_jwt_secret
ENCRYPTION_KEY=your_encryption_key
```

### **3. API Routes Configuration**
**الموقع:** `apps/api/src/routes/crm.routes.ts`
```typescript
/**
 * مسارات API للـ CRM
 * المسؤوليات:
 * - تعريف endpoints
 * - التحقق من الصلاحيات
 * - معالجة الطلبات
 */

// GET /api/crm/leads - جلب العملاء
// POST /api/crm/leads - إنشاء عميل
// PUT /api/crm/leads/:id - تحديث عميل
// DELETE /api/crm/leads/:id - حذف عميل
// GET /api/crm/stats - الإحصائيات
// POST /api/crm/webhook/whatsapp - webhook WhatsApp
```

---

## 🧪 ملفات الاختبار

### **1. Integration Tests**
**الموقع:** `tests/integration/crm-integration.test.ts`
```typescript
/**
 * اختبارات التكامل للـ CRM
 * المسؤوليات:
 * - اختبار التكامل مع Odoo
 * - اختبار WhatsApp webhook
 * - اختبار GTM tracking
 */
describe('CRM Integration Tests', () => {
  test('should create lead from WhatsApp message');
  test('should update lead stage');
  test('should send auto-reply');
  test('should track GTM events');
});
```

### **2. Unit Tests**
**الموقع:** `tests/unit/crm-service.test.ts`
```typescript
/**
 * اختبارات الوحدة لخدمة CRM
 * المسؤوليات:
 * - اختبار منطق الأعمال
 * - اختبار الحسابات
 * - اختبار التحقق من البيانات
 */
describe('CRM Service Tests', () => {
  test('should calculate conversion rate correctly');
  test('should validate lead data');
  test('should assign leads to salespeople');
});
```

---

## 📋 ملفات التوثيق

### **1. API Documentation**
**الموقع:** `docs/api/crm-api.md`
```markdown
# CRM API Documentation
- Endpoints description
- Request/Response examples
- Authentication
- Error codes
```

### **2. User Guide**
**الموقع:** `docs/crm/USER_GUIDE.md`
```markdown
# CRM User Guide
- How to use the dashboard
- Managing leads
- Creating reports
- Best practices
```

---

## 🎯 الخلاصة

### **الملفات الأساسية للعمل:**
1. `docker/odoo-setup.yml` - قاعدة البيانات
2. `packages/odoo-integration/` - التكامل الأساسي
3. `apps/admin-dashboard/` - الواجهة الرئيسية
4. `packages/gtm-engine/` - التتبع والتحليلات
5. `scripts/quick-start-odoo.bat` - التشغيل

### **تدفق البيانات:**
```
WhatsApp → Webhook → CRM Bridge → Odoo → Database
                                    ↓
Dashboard ← API ← Business Logic ← GTM Analytics
```

**هذا هو الهيكل الكامل لنظام CRM الحقيقي! 🏗️**