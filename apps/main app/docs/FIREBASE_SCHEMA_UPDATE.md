# 🔥 تحديث Firebase Schema للمشروع

## 📋 نظرة عامة

يحتاج المشروع إلى تحديث Firebase Data Connect Schema لدعم جميع وحدات Nexus.AI (Admin, CRM, Chatbot, Analytics, Automation).

---

## 🗄️ Schema المحدث المطلوب

### إضافة الجداول المطلوبة لـ dataconnect/schema/schema.gql:

```graphql
# إضافة جداول CRM
type Customer @table {
  id: UUID! @default(expr: "uuidV4()")
  name: String! @col(dataType: "varchar(200)")
  email: String @col(dataType: "varchar(255)")
  phone: String @col(dataType: "varchar(20)")
  company: String @col(dataType: "varchar(200)")
  status: String! @col(dataType: "varchar(20)") @default(value: "active")
  source: String @col(dataType: "varchar(100)")
  tags: String @col(dataType: "text")
  notes: String @col(dataType: "text")
  createdBy: User!
  assignedTo: User
  createdAt: Timestamp! @default(expr: "request.time")
  updatedAt: Timestamp @default(expr: "request.time")
}

type Lead @table {
  id: UUID! @default(expr: "uuidV4()")
  name: String! @col(dataType: "varchar(200)")
  email: String @col(dataType: "varchar(255)")
  phone: String @col(dataType: "varchar(20)")
  company: String @col(dataType: "varchar(200)")
  source: String @col(dataType: "varchar(100)")
  stage: String! @col(dataType: "varchar(50)") @default(value: "new")
  score: Int @default(value: 0)
  expectedRevenue: Float @default(value: 0)
  probability: Int @default(value: 0)
  notes: String @col(dataType: "text")
  assignedTo: User
  createdAt: Timestamp! @default(expr: "request.time")
  updatedAt: Timestamp @default(expr: "request.time")
}

type Campaign @table {
  id: UUID! @default(expr: "uuidV4()")
  name: String! @col(dataType: "varchar(200)")
  description: String @col(dataType: "text")
  type: String! @col(dataType: "varchar(50)")
  status: String! @col(dataType: "varchar(20)") @default(value: "draft")
  budget: Float @default(value: 0)
  spent: Float @default(value: 0)
  impressions: Int @default(value: 0)
  clicks: Int @default(value: 0)
  conversions: Int @default(value: 0)
  startDate: Date
  endDate: Date
  createdBy: User!
  createdAt: Timestamp! @default(expr: "request.time")
  updatedAt: Timestamp @default(expr: "request.time")
}

# إضافة جداول Analytics
type AnalyticsReport @table {
  id: UUID! @default(expr: "uuidV4()")
  name: String! @col(dataType: "varchar(200)")
  type: String! @col(dataType: "varchar(50)")
  dateRange: String! @col(dataType: "varchar(50)")
  data: String! @col(dataType: "jsonb")
  createdBy: User!
  createdAt: Timestamp! @default(expr: "request.time")
}

type Metric @table {
  id: UUID! @default(expr: "uuidV4()")
  name: String! @col(dataType: "varchar(100)")
  value: Float!
  unit: String @col(dataType: "varchar(20)")
  category: String! @col(dataType: "varchar(50)")
  date: Date!
  metadata: String @col(dataType: "jsonb")
  createdAt: Timestamp! @default(expr: "request.time")
}

# إضافة جداول Automation
type Workflow @table {
  id: UUID! @default(expr: "uuidV4()")
  name: String! @col(dataType: "varchar(200)")
  description: String @col(dataType: "text")
  trigger: String! @col(dataType: "varchar(100)")
  actions: String! @col(dataType: "jsonb")
  conditions: String @col(dataType: "jsonb")
  isActive: Boolean! @default(value: false)
  createdBy: User!
  createdAt: Timestamp! @default(expr: "request.time")
  updatedAt: Timestamp @default(expr: "request.time")
}

type WorkflowExecution @table {
  id: UUID! @default(expr: "uuidV4()")
  workflow: Workflow!
  status: String! @col(dataType: "varchar(20)")
  input: String @col(dataType: "jsonb")
  output: String @col(dataType: "jsonb")
  error: String @col(dataType: "text")
  startedAt: Timestamp! @default(expr: "request.time")
  completedAt: Timestamp
}

# إضافة جداول Admin
type SystemSetting @table {
  id: UUID! @default(expr: "uuidV4()")
  key: String! @col(dataType: "varchar(100)")
  value: String! @col(dataType: "text")
  type: String! @col(dataType: "varchar(20)")
  description: String @col(dataType: "text")
  updatedBy: User!
  updatedAt: Timestamp! @default(expr: "request.time")
}

type AuditLog @table {
  id: UUID! @default(expr: "uuidV4()")
  user: User!
  action: String! @col(dataType: "varchar(100)")
  resource: String! @col(dataType: "varchar(100)")
  resourceId: String @col(dataType: "varchar(100)")
  details: String @col(dataType: "jsonb")
  ipAddress: String @col(dataType: "varchar(45)")
  userAgent: String @col(dataType: "text")
  createdAt: Timestamp! @default(expr: "request.time")
}

# إضافة جداول Notifications
type Notification @table {
  id: UUID! @default(expr: "uuidV4()")
  user: User!
  title: String! @col(dataType: "varchar(200)")
  message: String! @col(dataType: "text")
  type: String! @col(dataType: "varchar(50)")
  isRead: Boolean! @default(value: false)
  actionUrl: String @col(dataType: "varchar(500)")
  createdAt: Timestamp! @default(expr: "request.time")
  readAt: Timestamp
}

# تحديث جدول User
type User @table {
  id: String! @default(expr: "auth.uid")
  email: String! @col(dataType: "varchar(255)")
  displayName: String @col(dataType: "varchar(100)")
  role: String! @col(dataType: "varchar(20)") @default(value: "user")
  department: String @col(dataType: "varchar(50)")
  isActive: Boolean! @default(value: true)
  lastLoginAt: Timestamp
  createdAt: Timestamp! @default(expr: "request.time")
  updatedAt: Timestamp @default(expr: "request.time")
}
```

---

## 📝 Operations المطلوبة

### إنشاء ملفات Operations في dataconnect/operations/:

#### 1. customers.gql:
```graphql
# جلب العملاء
query GetCustomers($limit: Int, $offset: Int) {
  customers(limit: $limit, offset: $offset, orderBy: { createdAt: DESC }) {
    id name email phone company status source
    assignedTo { id displayName }
    createdAt updatedAt
  }
}

# إنشاء عميل جديد
mutation CreateCustomer($data: Customer_Data!) {
  customer_insert(data: $data) {
    id name email createdAt
  }
}

# تحديث عميل
mutation UpdateCustomer($id: UUID!, $data: Customer_Data!) {
  customer_update(id: $id, data: $data) {
    id name updatedAt
  }
}

# حذف عميل
mutation DeleteCustomer($id: UUID!) {
  customer_delete(id: $id) {
    id
  }
}
```

#### 2. leads.gql:
```graphql
# جلب العملاء المحتملين
query GetLeads($stage: String, $limit: Int) {
  leads(where: { stage: { _eq: $stage } }, limit: $limit, orderBy: { score: DESC }) {
    id name email phone company source stage score expectedRevenue probability
    assignedTo { id displayName }
    createdAt updatedAt
  }
}

# تحديث مرحلة العميل المحتمل
mutation UpdateLeadStage($id: UUID!, $stage: String!) {
  lead_update(id: $id, data: { stage: $stage, updatedAt: "request.time" }) {
    id stage updatedAt
  }
}

# تحويل عميل محتمل إلى عميل
mutation ConvertLeadToCustomer($leadId: UUID!, $customerData: Customer_Data!) {
  customer_insert(data: $customerData) {
    id name
  }
  lead_update(id: $leadId, data: { stage: "converted" }) {
    id stage
  }
}
```

#### 3. campaigns.gql:
```graphql
# جلب الحملات
query GetCampaigns($status: String) {
  campaigns(where: { status: { _eq: $status } }, orderBy: { createdAt: DESC }) {
    id name description type status budget spent
    impressions clicks conversions
    startDate endDate
    createdBy { id displayName }
    createdAt
  }
}

# إنشاء حملة جديدة
mutation CreateCampaign($data: Campaign_Data!) {
  campaign_insert(data: $data) {
    id name createdAt
  }
}

# تحديث إحصائيات الحملة
mutation UpdateCampaignStats($id: UUID!, $impressions: Int!, $clicks: Int!, $spent: Float!) {
  campaign_update(id: $id, data: {
    impressions: $impressions
    clicks: $clicks
    spent: $spent
    updatedAt: "request.time"
  }) {
    id impressions clicks spent updatedAt
  }
}
```

#### 4. analytics.gql:
```graphql
# جلب التقارير
query GetReports($type: String, $limit: Int) {
  analyticsReports(where: { type: { _eq: $type } }, limit: $limit, orderBy: { createdAt: DESC }) {
    id name type dateRange data
    createdBy { id displayName }
    createdAt
  }
}

# جلب المقاييس
query GetMetrics($category: String!, $startDate: Date!, $endDate: Date!) {
  metrics(where: {
    category: { _eq: $category }
    date: { _gte: $startDate, _lte: $endDate }
  }, orderBy: { date: ASC }) {
    id name value unit date metadata
  }
}

# إضافة مقياس جديد
mutation AddMetric($data: Metric_Data!) {
  metric_insert(data: $data) {
    id name value createdAt
  }
}
```

#### 5. workflows.gql:
```graphql
# جلب سير العمل
query GetWorkflows($isActive: Boolean) {
  workflows(where: { isActive: { _eq: $isActive } }, orderBy: { createdAt: DESC }) {
    id name description trigger isActive
    createdBy { id displayName }
    createdAt updatedAt
  }
}

# تفعيل/إلغاء تفعيل سير العمل
mutation ToggleWorkflow($id: UUID!, $isActive: Boolean!) {
  workflow_update(id: $id, data: { isActive: $isActive, updatedAt: "request.time" }) {
    id isActive updatedAt
  }
}

# تسجيل تنفيذ سير العمل
mutation LogWorkflowExecution($data: WorkflowExecution_Data!) {
  workflowExecution_insert(data: $data) {
    id status startedAt
  }
}
```

---

## 🔧 خطوات التطبيق

### 1. تحديث Schema:
```bash
# نسخ احتياطية من الملف الحالي
cp dataconnect/schema/schema.gql dataconnect/schema/schema.gql.backup

# إضافة الجداول الجديدة إلى schema.gql
# (نسخ المحتوى أعلاه وإضافته للملف)
```

### 2. إنشاء Operations:
```bash
# إنشاء ملفات Operations
mkdir -p dataconnect/operations
touch dataconnect/operations/customers.gql
touch dataconnect/operations/leads.gql
touch dataconnect/operations/campaigns.gql
touch dataconnect/operations/analytics.gql
touch dataconnect/operations/workflows.gql
```

### 3. نشر التحديثات:
```bash
# نشر Schema الجديد
firebase deploy --only dataconnect

# اختبار الاتصال
firebase dataconnect:sql:shell
```

### 4. تحديث الكود:
```typescript
// تحديث خدمات البيانات لاستخدام Operations الجديدة
// src/services/data.service.ts

import { executeQuery, executeMutation } from '@firebase/data-connect';
import { dataConnect } from '../config/firebase';

export class DataService {
  // العملاء
  async getCustomers(limit = 50, offset = 0) {
    return await executeQuery(dataConnect, 'GetCustomers', { limit, offset });
  }

  async createCustomer(data: any) {
    return await executeMutation(dataConnect, 'CreateCustomer', { data });
  }

  // العملاء المحتملين
  async getLeads(stage?: string, limit = 50) {
    return await executeQuery(dataConnect, 'GetLeads', { stage, limit });
  }

  async updateLeadStage(id: string, stage: string) {
    return await executeMutation(dataConnect, 'UpdateLeadStage', { id, stage });
  }

  // الحملات
  async getCampaigns(status?: string) {
    return await executeQuery(dataConnect, 'GetCampaigns', { status });
  }

  async createCampaign(data: any) {
    return await executeMutation(dataConnect, 'CreateCampaign', { data });
  }

  // التحليلات
  async getReports(type?: string, limit = 20) {
    return await executeQuery(dataConnect, 'GetReports', { type, limit });
  }

  async getMetrics(category: string, startDate: string, endDate: string) {
    return await executeQuery(dataConnect, 'GetMetrics', { category, startDate, endDate });
  }

  // سير العمل
  async getWorkflows(isActive?: boolean) {
    return await executeQuery(dataConnect, 'GetWorkflows', { isActive });
  }

  async toggleWorkflow(id: string, isActive: boolean) {
    return await executeMutation(dataConnect, 'ToggleWorkflow', { id, isActive });
  }
}
```

---

## 🧪 اختبار Schema

### اختبار الاتصال:
```bash
# اختبار الاستعلامات
firebase dataconnect:sql:shell

# تشغيل استعلام تجريبي
SELECT * FROM users LIMIT 5;
SELECT * FROM customers LIMIT 5;
```

### اختبار من التطبيق:
```typescript
// src/tests/firebase-integration.test.ts
import { DataService } from '../services/data.service';

const dataService = new DataService();

describe('Firebase Data Connect Integration', () => {
  test('should fetch customers', async () => {
    const result = await dataService.getCustomers(10);
    expect(result.data).toBeDefined();
    expect(Array.isArray(result.data.customers)).toBe(true);
  });

  test('should create customer', async () => {
    const customerData = {
      name: 'Test Customer',
      email: 'test@example.com',
      phone: '+1234567890'
    };
    
    const result = await dataService.createCustomer(customerData);
    expect(result.data.customer_insert.id).toBeDefined();
  });
});
```

---

**🔥 هذا التحديث يوفر قاعدة بيانات شاملة لجميع وحدات Nexus.AI! 🔥**