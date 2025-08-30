# 🏢 دليل المطور الشامل - نظام CRM

**الإصدار:** 2.0  
**التحديث الأخير:** يناير 2025  
**الحالة:** ✅ مكتمل وجاهز للتطوير

---

## 📋 جدول المحتويات

1. [نظرة عامة على النظام](#نظرة-عامة)
2. [مواصفات CRM التقنية](#مواصفات-crm)
3. [هيكل المشروع](#هيكل-المشروع)
4. [آلية عمل المطورين](#آلية-عمل-المطورين)
5. [الواجهة الأمامية](#الواجهة-الأمامية)
6. [التكامل مع الأنظمة](#التكامل)
7. [دليل التطوير](#دليل-التطوير)
8. [الاختبارات والنشر](#الاختبارات)

---

## 🎯 نظرة عامة على النظام {#نظرة-عامة}

### ما هو نظام CRM الخاص بنا؟

نظام **AzizSys CRM** هو حل متكامل لإدارة علاقات العملاء مبني بأحدث التقنيات:

- **🎨 واجهة حديثة**: React + TypeScript + Tailwind CSS
- **⚡ أداء عالي**: Vite + NX Monorepo
- **🔗 تكامل شامل**: BigQuery + Odoo + Meta Ads + WhatsApp
- **📱 متجاوب**: Mobile-first responsive design
- **🌐 دعم RTL**: واجهة عربية كاملة

### الميزات الأساسية:

```
✅ إدارة العملاء والعملاء المحتملين
✅ تتبع المبيعات والحملات التسويقية  
✅ لوحة تحكم تفاعلية مع KPIs
✅ تكامل مع Meta Ads و WhatsApp Business
✅ تصدير البيانات إلى BigQuery
✅ مزامنة مع Odoo CRM
```

---

## 🔧 مواصفات CRM التقنية {#مواصفات-crm}

### التقنيات المستخدمة:

#### Frontend Stack:
```json
{
  "framework": "React 18.2.0",
  "language": "TypeScript 4.9.5",
  "bundler": "Vite 4.1.4",
  "styling": "Tailwind CSS 3.2.7",
  "routing": "React Router DOM 6.8.0",
  "state": "@tanstack/react-query 4.24.0",
  "http": "Axios 1.3.0",
  "icons": "Lucide React 0.263.0"
}
```

#### Backend Integration:
```json
{
  "database": "BigQuery (Google Cloud)",
  "crm": "Odoo CRM",
  "ads": "Meta Ads API",
  "messaging": "WhatsApp Business API",
  "api": "NestJS (apps/api)"
}
```

#### Development Tools:
```json
{
  "monorepo": "NX Workspace",
  "testing": "Vitest + Playwright",
  "linting": "ESLint + Prettier",
  "ci/cd": "GitHub Actions"
}
```

### المتطلبات النظام:

```bash
# Node.js
node >= 18.0.0
npm >= 9.0.0

# المتصفحات المدعومة
Chrome >= 90
Firefox >= 88
Safari >= 14
Edge >= 90
```

---

## 📁 هيكل المشروع {#هيكل-المشروع}

### البنية العامة:

```
g-assistant-nx/
├── apps/
│   ├── crm-system/              # 🏢 تطبيق CRM الرئيسي
│   ├── api/                     # 🔌 Backend API
│   ├── admin-dashboard/         # 👨‍💼 لوحة الإدارة
│   └── web-chatbot/            # 🤖 Chatbot Interface
├── packages/
│   ├── crm-core/               # 📦 CRM Core Logic
│   ├── ui/crm-ui/             # 🎨 CRM UI Components
│   ├── domain/crm/            # 🏗️ CRM Domain Logic
│   └── integrations/          # 🔗 External Integrations
└── docs/crm/                  # 📚 CRM Documentation
```

### تفصيل مجلد CRM System:

```
apps/crm-system/
├── src/
│   ├── app/                    # التطبيق الرئيسي
│   │   └── App.tsx            # Root Component
│   ├── components/             # المكونات المشتركة
│   │   ├── Layout.tsx         # Layout الأساسي
│   │   ├── Navigation.tsx     # شريط التنقل
│   │   ├── CRMDashboard.tsx   # لوحة التحكم
│   │   └── ui/               # مكونات UI الأساسية
│   ├── pages/                 # الصفحات
│   │   ├── Dashboard.tsx      # الصفحة الرئيسية
│   │   ├── Customers.tsx      # إدارة العملاء
│   │   ├── Leads.tsx          # العملاء المحتملين
│   │   ├── Campaigns.tsx      # الحملات التسويقية
│   │   ├── campaign-tracker.tsx
│   │   ├── customer-360.tsx
│   │   └── crm-advanced.tsx
│   ├── services/              # خدمات API
│   │   └── crm.service.ts     # CRM API Service
│   ├── hooks/                 # React Hooks
│   │   └── useCRM.ts          # CRM Custom Hook
│   ├── types/                 # تعريفات TypeScript
│   │   └── crm.types.ts       # CRM Types
│   ├── utils/                 # أدوات مساعدة
│   │   └── crm.utils.ts       # CRM Utilities
│   ├── assets/                # الملفات الثابتة
│   └── styles.css             # Global Styles
├── docs/                      # التوثيق
│   ├── CRM_DEVELOPER_GUIDE.md
│   ├── CRM_ARCHITECTURE.md
│   ├── DESIGN_STRUCTURE.md
│   └── README.md
├── scripts/                   # Scripts للتطوير
│   ├── complete-crm-flow.js
│   ├── demo-whatsapp-crm.js
│   └── setup-whatsapp-crm.bat
├── tests/                     # الاختبارات
│   ├── crm-system.test.ts
│   ├── crm-integration.test.ts
│   └── crm-whatsapp.test.ts
├── package.json               # Dependencies
├── vite.config.ts            # Vite Configuration
├── tailwind.config.js        # Tailwind Configuration
├── tsconfig.json             # TypeScript Configuration
└── START_CRM.bat             # Quick Start Script
```

---

## 👨‍💻 آلية عمل المطورين {#آلية-عمل-المطورين}

### 🚀 البدء السريع:

#### 1. إعداد البيئة:
```bash
# استنساخ المشروع
git clone <repository-url>
cd g-assistant-nx

# تثبيت التبعيات
npm install

# تشغيل CRM System
nx serve crm-system

# أو استخدام الـ script السريع
cd apps/crm-system
./START_CRM.bat
```

#### 2. الوصول للتطبيق:
```
🌐 Development: http://localhost:4200
📱 Mobile View: http://localhost:4200 (responsive)
🔧 API Endpoint: http://localhost:3000/api
```

### 🔄 سير العمل للمطورين:

#### المرحلة 1: التحضير
```bash
# إنشاء branch جديد
git checkout -b feature/new-crm-feature

# تحديث التبعيات
npm install

# تشغيل الاختبارات
npm run test:crm
```

#### المرحلة 2: التطوير
```bash
# تشغيل التطبيق في وضع التطوير
nx serve crm-system

# تشغيل API في terminal منفصل
nx serve api

# مراقبة التغييرات
npm run dev:watch
```

#### المرحلة 3: الاختبار
```bash
# اختبارات الوحدة
npm run test:unit

# اختبارات التكامل
npm run test:integration

# اختبارات E2E
npm run test:e2e

# اختبارات CRM المخصصة
npm run test:crm
```

#### المرحلة 4: المراجعة والنشر
```bash
# بناء للإنتاج
nx build crm-system

# فحص الجودة
npm run lint
npm run type-check

# إرسال للمراجعة
git add .
git commit -m "feat: add new CRM feature"
git push origin feature/new-crm-feature
```

### 📋 معايير الكود:

#### TypeScript Standards:
```typescript
// ✅ استخدم interfaces للبيانات
interface Customer {
  id: string;
  name: string;
  email: string;
  phone?: string;
  status: 'active' | 'inactive' | 'pending';
  createdAt: Date;
}

// ✅ استخدم enums للثوابت
enum LeadStatus {
  NEW = 'new',
  QUALIFIED = 'qualified',
  PROPOSAL = 'proposal',
  CLOSED_WON = 'closed_won',
  CLOSED_LOST = 'closed_lost'
}

// ✅ استخدم generic types
interface ApiResponse<T> {
  success: boolean;
  data: T;
  message?: string;
}
```

#### React Component Standards:
```tsx
// ✅ Functional Components مع TypeScript
interface CustomerCardProps {
  customer: Customer;
  onEdit: (id: string) => void;
  onDelete: (id: string) => void;
}

export default function CustomerCard({ 
  customer, 
  onEdit, 
  onDelete 
}: CustomerCardProps) {
  return (
    <div className="card p-4 border rounded-lg">
      <h3 className="text-lg font-semibold">{customer.name}</h3>
      <p className="text-gray-600">{customer.email}</p>
      <div className="mt-4 flex gap-2">
        <button 
          onClick={() => onEdit(customer.id)}
          className="btn btn-primary"
        >
          تعديل
        </button>
        <button 
          onClick={() => onDelete(customer.id)}
          className="btn btn-danger"
        >
          حذف
        </button>
      </div>
    </div>
  );
}
```

#### CSS/Tailwind Standards:
```css
/* ✅ استخدم Tailwind classes */
.card {
  @apply bg-white rounded-lg shadow-sm border border-gray-200 p-4;
}

.btn {
  @apply px-4 py-2 rounded-md font-medium transition-colors;
}

.btn-primary {
  @apply bg-blue-600 text-white hover:bg-blue-700;
}

.btn-danger {
  @apply bg-red-600 text-white hover:bg-red-700;
}
```

---

## 🎨 الواجهة الأمامية {#الواجهة-الأمامية}

### 📱 الصفحات الأساسية:

#### 1. 📊 Dashboard (لوحة التحكم):
```tsx
// src/pages/Dashboard.tsx
export default function Dashboard() {
  return (
    <div className="p-6">
      {/* KPI Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <KPICard title="إجمالي العملاء" value="1,234" change="+12%" />
        <KPICard title="العملاء المحتملين" value="567" change="+8%" />
        <KPICard title="الإيرادات الشهرية" value="125,000 ريال" change="+15%" />
        <KPICard title="معدل التحويل" value="23%" change="+3%" />
      </div>

      {/* Charts Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
        <SalesPipelineChart />
        <MonthlyPerformanceChart />
      </div>

      {/* Recent Activities */}
      <RecentActivitiesList />
    </div>
  );
}
```

#### 2. 👥 Customers (إدارة العملاء):
```tsx
// src/pages/Customers.tsx
export default function Customers() {
  const [customers, setCustomers] = useState<Customer[]>([]);
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');

  return (
    <div className="p-6">
      {/* Header */}
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">إدارة العملاء</h1>
        <div className="flex gap-2">
          <ViewToggle mode={viewMode} onChange={setViewMode} />
          <button className="btn btn-primary">إضافة عميل</button>
        </div>
      </div>

      {/* Search & Filter */}
      <SearchAndFilter onFilter={handleFilter} />

      {/* Customer Grid/List */}
      {viewMode === 'grid' ? (
        <CustomerGrid customers={customers} />
      ) : (
        <CustomerList customers={customers} />
      )}
    </div>
  );
}
```

#### 3. 🎯 Leads (العملاء المحتملين):
```tsx
// src/pages/Leads.tsx
export default function Leads() {
  const [leads, setLeads] = useState<Lead[]>([]);

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-6">إدارة العملاء المحتملين</h1>
      
      {/* Pipeline Summary */}
      <PipelineSummary leads={leads} />

      {/* Kanban Board */}
      <KanbanBoard
        columns={[
          { id: 'new', title: 'جديد', leads: newLeads },
          { id: 'qualified', title: 'مؤهل', leads: qualifiedLeads },
          { id: 'proposal', title: 'عرض', leads: proposalLeads },
          { id: 'closed', title: 'مغلق', leads: closedLeads }
        ]}
        onDragEnd={handleDragEnd}
      />
    </div>
  );
}
```

#### 4. 📈 Campaigns (الحملات):
```tsx
// src/pages/Campaigns.tsx
export default function Campaigns() {
  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-6">تتبع الحملات</h1>
      
      {/* Campaign Summary */}
      <CampaignSummaryCards />

      {/* Meta Ads Integration */}
      <MetaAdsPanel />

      {/* Campaign Performance Table */}
      <CampaignPerformanceTable />

      {/* ROI Calculator */}
      <ROICalculator />
    </div>
  );
}
```

### 🧩 المكونات الأساسية:

#### KPI Card Component:
```tsx
// src/components/ui/KPICard.tsx
interface KPICardProps {
  title: string;
  value: string;
  change: string;
  trend?: 'up' | 'down';
  icon?: string;
}

export default function KPICard({ 
  title, 
  value, 
  change, 
  trend = 'up',
  icon 
}: KPICardProps) {
  return (
    <div className="card">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm text-gray-600">{title}</p>
          <p className="text-2xl font-bold">{value}</p>
        </div>
        {icon && <Icon name={icon} className="w-8 h-8 text-blue-600" />}
      </div>
      <div className={`flex items-center mt-2 text-sm ${
        trend === 'up' ? 'text-green-600' : 'text-red-600'
      }`}>
        <TrendIcon trend={trend} />
        <span>{change}</span>
      </div>
    </div>
  );
}
```

#### Customer Card Component:
```tsx
// src/components/CustomerCard.tsx
interface CustomerCardProps {
  customer: Customer;
  onEdit: (id: string) => void;
  onDelete: (id: string) => void;
  onView: (id: string) => void;
}

export default function CustomerCard({ 
  customer, 
  onEdit, 
  onDelete, 
  onView 
}: CustomerCardProps) {
  return (
    <div className="card hover:shadow-md transition-shadow">
      {/* Avatar & Name */}
      <div className="flex items-center mb-4">
        <Avatar src={customer.avatar} name={customer.name} />
        <div className="mr-3">
          <h3 className="font-semibold">{customer.name}</h3>
          <p className="text-sm text-gray-600">{customer.company}</p>
        </div>
      </div>

      {/* Contact Info */}
      <div className="space-y-2 mb-4">
        <div className="flex items-center text-sm">
          <Mail className="w-4 h-4 ml-2" />
          <span>{customer.email}</span>
        </div>
        <div className="flex items-center text-sm">
          <Phone className="w-4 h-4 ml-2" />
          <span>{customer.phone}</span>
        </div>
      </div>

      {/* Status & Value */}
      <div className="flex justify-between items-center mb-4">
        <StatusBadge status={customer.status} />
        <span className="font-semibold text-green-600">
          {customer.totalValue}
        </span>
      </div>

      {/* Actions */}
      <div className="flex gap-2">
        <button 
          onClick={() => onView(customer.id)}
          className="btn btn-sm btn-outline flex-1"
        >
          عرض
        </button>
        <button 
          onClick={() => onEdit(customer.id)}
          className="btn btn-sm btn-primary flex-1"
        >
          تعديل
        </button>
      </div>
    </div>
  );
}
```

### 🎨 Design System:

#### الألوان:
```css
:root {
  /* Primary Colors */
  --primary-50: #eff6ff;
  --primary-500: #3b82f6;
  --primary-600: #2563eb;
  --primary-700: #1d4ed8;

  /* Success Colors */
  --success-50: #f0fdf4;
  --success-500: #22c55e;
  --success-600: #16a34a;

  /* Warning Colors */
  --warning-50: #fffbeb;
  --warning-500: #f59e0b;
  --warning-600: #d97706;

  /* Danger Colors */
  --danger-50: #fef2f2;
  --danger-500: #ef4444;
  --danger-600: #dc2626;

  /* Gray Scale */
  --gray-50: #f9fafb;
  --gray-100: #f3f4f6;
  --gray-200: #e5e7eb;
  --gray-300: #d1d5db;
  --gray-400: #9ca3af;
  --gray-500: #6b7280;
  --gray-600: #4b5563;
  --gray-700: #374151;
  --gray-800: #1f2937;
  --gray-900: #111827;
}
```

#### Typography:
```css
.text-xs { font-size: 0.75rem; line-height: 1rem; }
.text-sm { font-size: 0.875rem; line-height: 1.25rem; }
.text-base { font-size: 1rem; line-height: 1.5rem; }
.text-lg { font-size: 1.125rem; line-height: 1.75rem; }
.text-xl { font-size: 1.25rem; line-height: 1.75rem; }
.text-2xl { font-size: 1.5rem; line-height: 2rem; }
.text-3xl { font-size: 1.875rem; line-height: 2.25rem; }
```

#### Spacing:
```css
.space-1 { margin: 0.25rem; }  /* 4px */
.space-2 { margin: 0.5rem; }   /* 8px */
.space-3 { margin: 0.75rem; }  /* 12px */
.space-4 { margin: 1rem; }     /* 16px */
.space-6 { margin: 1.5rem; }   /* 24px */
.space-8 { margin: 2rem; }     /* 32px */
```

---

## 🔗 التكامل مع الأنظمة {#التكامل}

### 1. 🗄️ BigQuery Integration:

#### إعداد الاتصال:
```typescript
// src/services/bigquery.service.ts
import { BigQuery } from '@google-cloud/bigquery';

class BigQueryService {
  private bigquery: BigQuery;

  constructor() {
    this.bigquery = new BigQuery({
      projectId: process.env.GOOGLE_CLOUD_PROJECT,
      keyFilename: process.env.GOOGLE_APPLICATION_CREDENTIALS
    });
  }

  async getCustomers(): Promise<Customer[]> {
    const query = `
      SELECT 
        customer_id,
        name,
        email,
        phone,
        status,
        created_at,
        total_value
      FROM \`${process.env.BIGQUERY_DATASET}.customers\`
      WHERE status = 'active'
      ORDER BY created_at DESC
    `;

    const [rows] = await this.bigquery.query(query);
    return rows.map(row => ({
      id: row.customer_id,
      name: row.name,
      email: row.email,
      phone: row.phone,
      status: row.status,
      createdAt: new Date(row.created_at),
      totalValue: row.total_value
    }));
  }

  async createCustomer(customer: CreateCustomerDto): Promise<void> {
    const query = `
      INSERT INTO \`${process.env.BIGQUERY_DATASET}.customers\`
      (customer_id, name, email, phone, status, created_at)
      VALUES (@id, @name, @email, @phone, @status, @createdAt)
    `;

    await this.bigquery.query({
      query,
      params: {
        id: customer.id,
        name: customer.name,
        email: customer.email,
        phone: customer.phone,
        status: customer.status,
        createdAt: new Date().toISOString()
      }
    });
  }
}
```

### 2. 🤖 Odoo CRM Integration:

#### Odoo API Service:
```typescript
// src/services/odoo.service.ts
import axios from 'axios';

class OdooService {
  private baseURL: string;
  private database: string;
  private username: string;
  private password: string;
  private uid: number | null = null;

  constructor() {
    this.baseURL = process.env.ODOO_URL || '';
    this.database = process.env.ODOO_DATABASE || '';
    this.username = process.env.ODOO_USERNAME || '';
    this.password = process.env.ODOO_PASSWORD || '';
  }

  async authenticate(): Promise<void> {
    const response = await axios.post(`${this.baseURL}/web/session/authenticate`, {
      jsonrpc: '2.0',
      method: 'call',
      params: {
        db: this.database,
        login: this.username,
        password: this.password
      }
    });

    this.uid = response.data.result.uid;
  }

  async getLeads(): Promise<Lead[]> {
    if (!this.uid) await this.authenticate();

    const response = await axios.post(`${this.baseURL}/web/dataset/call_kw`, {
      jsonrpc: '2.0',
      method: 'call',
      params: {
        model: 'crm.lead',
        method: 'search_read',
        args: [[]],
        kwargs: {
          fields: ['name', 'partner_name', 'email_from', 'phone', 'stage_id', 'expected_revenue']
        }
      }
    });

    return response.data.result.map((lead: any) => ({
      id: lead.id.toString(),
      name: lead.name,
      company: lead.partner_name,
      email: lead.email_from,
      phone: lead.phone,
      stage: lead.stage_id[1],
      value: lead.expected_revenue
    }));
  }

  async createLead(lead: CreateLeadDto): Promise<void> {
    if (!this.uid) await this.authenticate();

    await axios.post(`${this.baseURL}/web/dataset/call_kw`, {
      jsonrpc: '2.0',
      method: 'call',
      params: {
        model: 'crm.lead',
        method: 'create',
        args: [{
          name: lead.name,
          partner_name: lead.company,
          email_from: lead.email,
          phone: lead.phone,
          expected_revenue: lead.value
        }]
      }
    });
  }
}
```

### 3. 📱 WhatsApp Business Integration:

#### WhatsApp Service:
```typescript
// src/services/whatsapp.service.ts
import axios from 'axios';

class WhatsAppService {
  private accessToken: string;
  private phoneNumberId: string;

  constructor() {
    this.accessToken = process.env.WHATSAPP_ACCESS_TOKEN || '';
    this.phoneNumberId = process.env.WHATSAPP_PHONE_NUMBER_ID || '';
  }

  async sendMessage(to: string, message: string): Promise<void> {
    await axios.post(
      `https://graph.facebook.com/v18.0/${this.phoneNumberId}/messages`,
      {
        messaging_product: 'whatsapp',
        to: to,
        type: 'text',
        text: { body: message }
      },
      {
        headers: {
          'Authorization': `Bearer ${this.accessToken}`,
          'Content-Type': 'application/json'
        }
      }
    );
  }

  async sendTemplate(to: string, templateName: string, parameters: any[]): Promise<void> {
    await axios.post(
      `https://graph.facebook.com/v18.0/${this.phoneNumberId}/messages`,
      {
        messaging_product: 'whatsapp',
        to: to,
        type: 'template',
        template: {
          name: templateName,
          language: { code: 'ar' },
          components: [{
            type: 'body',
            parameters: parameters
          }]
        }
      },
      {
        headers: {
          'Authorization': `Bearer ${this.accessToken}`,
          'Content-Type': 'application/json'
        }
      }
    );
  }
}
```

### 4. 📊 Meta Ads Integration:

#### Meta Ads Service:
```typescript
// src/services/meta-ads.service.ts
import axios from 'axios';

class MetaAdsService {
  private accessToken: string;
  private adAccountId: string;

  constructor() {
    this.accessToken = process.env.META_ACCESS_TOKEN || '';
    this.adAccountId = process.env.META_AD_ACCOUNT_ID || '';
  }

  async getCampaigns(): Promise<Campaign[]> {
    const response = await axios.get(
      `https://graph.facebook.com/v18.0/${this.adAccountId}/campaigns`,
      {
        params: {
          fields: 'id,name,status,objective,created_time,updated_time',
          access_token: this.accessToken
        }
      }
    );

    return response.data.data.map((campaign: any) => ({
      id: campaign.id,
      name: campaign.name,
      status: campaign.status,
      objective: campaign.objective,
      createdAt: new Date(campaign.created_time),
      updatedAt: new Date(campaign.updated_time)
    }));
  }

  async getCampaignInsights(campaignId: string): Promise<CampaignInsights> {
    const response = await axios.get(
      `https://graph.facebook.com/v18.0/${campaignId}/insights`,
      {
        params: {
          fields: 'impressions,clicks,spend,cpm,cpc,ctr,reach',
          access_token: this.accessToken
        }
      }
    );

    const data = response.data.data[0];
    return {
      impressions: parseInt(data.impressions),
      clicks: parseInt(data.clicks),
      spend: parseFloat(data.spend),
      cpm: parseFloat(data.cpm),
      cpc: parseFloat(data.cpc),
      ctr: parseFloat(data.ctr),
      reach: parseInt(data.reach)
    };
  }
}
```

---

## 🛠️ دليل التطوير {#دليل-التطوير}

### إضافة صفحة جديدة:

#### 1. إنشاء الصفحة:
```tsx
// src/pages/NewPage.tsx
import React from 'react';
import Layout from '../components/Layout';

export default function NewPage() {
  return (
    <Layout>
      <div className="p-6">
        <h1 className="text-2xl font-bold mb-6">صفحة جديدة</h1>
        {/* محتوى الصفحة */}
      </div>
    </Layout>
  );
}
```

#### 2. إضافة Route:
```tsx
// src/app/App.tsx
import { Routes, Route } from 'react-router-dom';
import NewPage from '../pages/NewPage';

function App() {
  return (
    <Routes>
      {/* Routes الموجودة */}
      <Route path="/new-page" element={<NewPage />} />
    </Routes>
  );
}
```

#### 3. إضافة Navigation:
```tsx
// src/components/Navigation.tsx
const navigationItems = [
  // العناصر الموجودة
  { name: 'صفحة جديدة', href: '/new-page', icon: 'plus' }
];
```

### إضافة مكون جديد:

#### 1. إنشاء المكون:
```tsx
// src/components/NewComponent.tsx
import React from 'react';

interface NewComponentProps {
  title: string;
  data: any[];
  onAction: (id: string) => void;
}

export default function NewComponent({ 
  title, 
  data, 
  onAction 
}: NewComponentProps) {
  return (
    <div className="card">
      <h2 className="text-lg font-semibold mb-4">{title}</h2>
      <div className="space-y-2">
        {data.map(item => (
          <div key={item.id} className="flex justify-between items-center p-2 border rounded">
            <span>{item.name}</span>
            <button 
              onClick={() => onAction(item.id)}
              className="btn btn-sm btn-primary"
            >
              إجراء
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}
```

#### 2. إضافة Types:
```typescript
// src/types/crm.types.ts
export interface NewComponentData {
  id: string;
  name: string;
  status: string;
  createdAt: Date;
}
```

### إضافة خدمة API جديدة:

#### 1. إنشاء Service:
```typescript
// src/services/new.service.ts
import axios from 'axios';
import { NewComponentData } from '../types/crm.types';

class NewService {
  private baseURL = process.env.REACT_APP_API_URL || 'http://localhost:3000/api';

  async getData(): Promise<NewComponentData[]> {
    const response = await axios.get(`${this.baseURL}/new-data`);
    return response.data;
  }

  async createData(data: Partial<NewComponentData>): Promise<NewComponentData> {
    const response = await axios.post(`${this.baseURL}/new-data`, data);
    return response.data;
  }

  async updateData(id: string, data: Partial<NewComponentData>): Promise<NewComponentData> {
    const response = await axios.put(`${this.baseURL}/new-data/${id}`, data);
    return response.data;
  }

  async deleteData(id: string): Promise<void> {
    await axios.delete(`${this.baseURL}/new-data/${id}`);
  }
}

export default new NewService();
```

#### 2. إنشاء Custom Hook:
```typescript
// src/hooks/useNewData.ts
import { useState, useEffect } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import NewService from '../services/new.service';
import { NewComponentData } from '../types/crm.types';

export function useNewData() {
  const queryClient = useQueryClient();

  const {
    data: items = [],
    isLoading,
    error
  } = useQuery({
    queryKey: ['newData'],
    queryFn: NewService.getData
  });

  const createMutation = useMutation({
    mutationFn: NewService.createData,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['newData'] });
    }
  });

  const updateMutation = useMutation({
    mutationFn: ({ id, data }: { id: string; data: Partial<NewComponentData> }) =>
      NewService.updateData(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['newData'] });
    }
  });

  const deleteMutation = useMutation({
    mutationFn: NewService.deleteData,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['newData'] });
    }
  });

  return {
    items,
    isLoading,
    error,
    create: createMutation.mutate,
    update: updateMutation.mutate,
    delete: deleteMutation.mutate,
    isCreating: createMutation.isPending,
    isUpdating: updateMutation.isPending,
    isDeleting: deleteMutation.isPending
  };
}
```

### إضافة Utility Functions:

```typescript
// src/utils/helpers.ts
export function formatCurrency(amount: number, currency = 'SAR'): string {
  return new Intl.NumberFormat('ar-SA', {
    style: 'currency',
    currency: currency
  }).format(amount);
}

export function formatDate(date: Date): string {
  return new Intl.DateTimeFormat('ar-SA', {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  }).format(date);
}

export function getStatusColor(status: string): string {
  const colors = {
    active: 'text-green-600 bg-green-50',
    inactive: 'text-gray-600 bg-gray-50',
    pending: 'text-yellow-600 bg-yellow-50',
    closed: 'text-red-600 bg-red-50'
  };
  return colors[status as keyof typeof colors] || colors.inactive;
}

export function calculateROI(revenue: number, cost: number): number {
  if (cost === 0) return 0;
  return ((revenue - cost) / cost) * 100;
}
```

---

## 🧪 الاختبارات والنشر {#الاختبارات}

### أنواع الاختبارات:

#### 1. Unit Tests:
```typescript
// tests/unit/crm-utils.test.ts
import { describe, it, expect } from 'vitest';
import { formatCurrency, calculateROI } from '../src/utils/helpers';

describe('CRM Utils', () => {
  describe('formatCurrency', () => {
    it('should format currency correctly', () => {
      expect(formatCurrency(1000)).toBe('١٬٠٠٠٫٠٠ ر.س.');
      expect(formatCurrency(1500.50)).toBe('١٬٥٠٠٫٥٠ ر.س.');
    });
  });

  describe('calculateROI', () => {
    it('should calculate ROI correctly', () => {
      expect(calculateROI(1500, 1000)).toBe(50);
      expect(calculateROI(1000, 1000)).toBe(0);
      expect(calculateROI(500, 1000)).toBe(-50);
    });

    it('should handle zero cost', () => {
      expect(calculateROI(1000, 0)).toBe(0);
    });
  });
});
```

#### 2. Component Tests:
```typescript
// tests/unit/CustomerCard.test.tsx
import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import CustomerCard from '../src/components/CustomerCard';

const mockCustomer = {
  id: '1',
  name: 'أحمد محمد',
  email: 'ahmed@example.com',
  phone: '+966501234567',
  company: 'شركة التقنية',
  status: 'active' as const,
  totalValue: '25,000 ريال',
  createdAt: new Date()
};

describe('CustomerCard', () => {
  it('should render customer information', () => {
    const onEdit = vi.fn();
    const onDelete = vi.fn();
    const onView = vi.fn();

    render(
      <CustomerCard 
        customer={mockCustomer}
        onEdit={onEdit}
        onDelete={onDelete}
        onView={onView}
      />
    );

    expect(screen.getByText('أحمد محمد')).toBeInTheDocument();
    expect(screen.getByText('ahmed@example.com')).toBeInTheDocument();
    expect(screen.getByText('+966501234567')).toBeInTheDocument();
  });

  it('should call onEdit when edit button is clicked', () => {
    const onEdit = vi.fn();
    const onDelete = vi.fn();
    const onView = vi.fn();

    render(
      <CustomerCard 
        customer={mockCustomer}
        onEdit={onEdit}
        onDelete={onDelete}
        onView={onView}
      />
    );

    fireEvent.click(screen.getByText('تعديل'));
    expect(onEdit).toHaveBeenCalledWith('1');
  });
});
```

#### 3. Integration Tests:
```typescript
// tests/integration/crm-flow.test.ts
import { describe, it, expect, beforeEach } from 'vitest';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { BrowserRouter } from 'react-router-dom';
import App from '../src/app/App';

describe('CRM Integration Flow', () => {
  let queryClient: QueryClient;

  beforeEach(() => {
    queryClient = new QueryClient({
      defaultOptions: {
        queries: { retry: false },
        mutations: { retry: false }
      }
    });
  });

  const renderApp = () => {
    return render(
      <QueryClientProvider client={queryClient}>
        <BrowserRouter>
          <App />
        </BrowserRouter>
      </QueryClientProvider>
    );
  };

  it('should navigate from dashboard to customers page', async () => {
    renderApp();
    
    // Should start on dashboard
    expect(screen.getByText('لوحة التحكم')).toBeInTheDocument();
    
    // Navigate to customers
    fireEvent.click(screen.getByText('العملاء'));
    
    await waitFor(() => {
      expect(screen.getByText('إدارة العملاء')).toBeInTheDocument();
    });
  });

  it('should create new customer', async () => {
    renderApp();
    
    // Navigate to customers page
    fireEvent.click(screen.getByText('العملاء'));
    
    // Click add customer button
    fireEvent.click(screen.getByText('إضافة عميل'));
    
    // Fill form (assuming modal opens)
    fireEvent.change(screen.getByLabelText('الاسم'), {
      target: { value: 'عميل جديد' }
    });
    
    fireEvent.change(screen.getByLabelText('البريد الإلكتروني'), {
      target: { value: 'new@example.com' }
    });
    
    // Submit form
    fireEvent.click(screen.getByText('حفظ'));
    
    await waitFor(() => {
      expect(screen.getByText('تم إضافة العميل بنجاح')).toBeInTheDocument();
    });
  });
});
```

#### 4. E2E Tests:
```typescript
// tests/e2e/crm-workflow.spec.ts
import { test, expect } from '@playwright/test';

test.describe('CRM Workflow', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('http://localhost:4200');
  });

  test('should complete full customer management workflow', async ({ page }) => {
    // Navigate to customers page
    await page.click('text=العملاء');
    await expect(page.locator('h1')).toContainText('إدارة العملاء');

    // Add new customer
    await page.click('text=إضافة عميل');
    await page.fill('[data-testid="customer-name"]', 'عميل تجريبي');
    await page.fill('[data-testid="customer-email"]', 'test@example.com');
    await page.fill('[data-testid="customer-phone"]', '+966501234567');
    await page.click('text=حفظ');

    // Verify customer was added
    await expect(page.locator('text=عميل تجريبي')).toBeVisible();

    // Edit customer
    await page.click('[data-testid="edit-customer-btn"]');
    await page.fill('[data-testid="customer-name"]', 'عميل محدث');
    await page.click('text=حفظ');

    // Verify customer was updated
    await expect(page.locator('text=عميل محدث')).toBeVisible();

    // Delete customer
    await page.click('[data-testid="delete-customer-btn"]');
    await page.click('text=تأكيد الحذف');

    // Verify customer was deleted
    await expect(page.locator('text=عميل محدث')).not.toBeVisible();
  });

  test('should manage leads in kanban board', async ({ page }) => {
    // Navigate to leads page
    await page.click('text=العملاء المحتملين');
    await expect(page.locator('h1')).toContainText('إدارة العملاء المحتملين');

    // Add new lead
    await page.click('text=إضافة عميل محتمل');
    await page.fill('[data-testid="lead-name"]', 'عميل محتمل جديد');
    await page.fill('[data-testid="lead-company"]', 'شركة جديدة');
    await page.fill('[data-testid="lead-value"]', '50000');
    await page.click('text=حفظ');

    // Verify lead appears in "New" column
    const newColumn = page.locator('[data-testid="kanban-column-new"]');
    await expect(newColumn.locator('text=عميل محتمل جديد')).toBeVisible();

    // Drag lead to "Qualified" column
    const leadCard = newColumn.locator('[data-testid="lead-card"]').first();
    const qualifiedColumn = page.locator('[data-testid="kanban-column-qualified"]');
    
    await leadCard.dragTo(qualifiedColumn);

    // Verify lead moved to qualified column
    await expect(qualifiedColumn.locator('text=عميل محتمل جديد')).toBeVisible();
  });
});
```

### تشغيل الاختبارات:

```bash
# اختبارات الوحدة
npm run test:unit

# اختبارات التكامل
npm run test:integration

# اختبارات E2E
npm run test:e2e

# جميع الاختبارات
npm run test:all

# اختبارات مع تغطية الكود
npm run test:coverage

# اختبارات CRM المخصصة
npm run test:crm
```

### النشر:

#### 1. بناء للإنتاج:
```bash
# بناء CRM System
nx build crm-system

# بناء جميع التطبيقات
nx build-all

# فحص الجودة
npm run lint
npm run type-check
```

#### 2. النشر على الخادم:
```bash
# نشر على AWS
npm run deploy:aws

# نشر على Google Cloud
npm run deploy:gcp

# نشر محلي مع Docker
docker-compose up -d
```

#### 3. مراقبة الإنتاج:
```bash
# فحص صحة النظام
npm run health:check

# مراقبة الأداء
npm run monitor:performance

# عرض السجلات
npm run logs:view
```

---

## 📚 الموارد الإضافية

### الوثائق المرجعية:
- [CRM Architecture](./CRM_ARCHITECTURE.md)
- [API Reference](./CRM_API_REFERENCE.md)
- [Design System](./DESIGN_STRUCTURE.md)
- [User Guide](./USER_GUIDE.md)

### أدوات التطوير:
- **VS Code Extensions**: ES7+ React/Redux/React-Native snippets, Tailwind CSS IntelliSense
- **Browser DevTools**: React Developer Tools, Redux DevTools
- **Testing**: Vitest, Playwright, Testing Library

### المجتمع والدعم:
- **GitHub Issues**: لتقارير الأخطاء وطلبات الميزات
- **Documentation**: توثيق شامل ومحدث
- **Code Reviews**: مراجعة الكود قبل الدمج

---

## 🎊 الخلاصة

نظام **AzizSys CRM** هو حل متكامل وحديث لإدارة علاقات العملاء، مبني بأفضل الممارسات والتقنيات الحديثة. النظام جاهز للتطوير والتوسع مع:

✅ **بنية قوية ومرنة**  
✅ **واجهة مستخدم حديثة ومتجاوبة**  
✅ **تكامل شامل مع الأنظمة الخارجية**  
✅ **اختبارات شاملة وموثوقة**  
✅ **توثيق مفصل ومحدث**  

**🚀 جاهز للانطلاق والتطوير!**

---

*تم إنشاء هذا الدليل بواسطة فريق AzizSys - يناير 2025*