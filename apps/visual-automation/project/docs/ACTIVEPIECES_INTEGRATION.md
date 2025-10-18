# 🔌 دليل تكامل ActivePieces الشامل
**ActivePieces Integration Complete Guide**

## 📋 جدول المحتويات

- [نظرة عامة](#نظرة-عامة)
- [طريقة تركيب العقد](#طريقة-تركيب-العقد)
- [أنواع العقد المتاحة](#أنواع-العقد-المتاحة)
- [التكوين والإعداد](#التكوين-والإعداد)
- [API Integration](#api-integration)
- [استكشاف الأخطاء](#استكشاف-الأخطاء)

---

## 🌟 نظرة عامة

نظامنا يدعم **ActivePieces Self-Hosted** من GitHub، مما يوفر:
- ✅ تنفيذ فعلي للأتمتة
- ✅ دعم +200 تطبيق وخدمة
- ✅ عقد مخصصة قابلة للتوسع
- ✅ مراقبة في الوقت الفعلي
- ✅ معالجة أخطاء متقدمة

### 🏗️ البنية المعمارية

```
┌─────────────────────────────────────────────┐
│         واجهة المستخدم (React UI)          │
│  WorkflowCanvasEnhanced + Node Sidebar     │
└──────────────────┬──────────────────────────┘
                   │
         ┌─────────▼──────────┐
         │  Automation SDK    │
         │  /lib/automation   │
         └─────────┬──────────┘
                   │
    ┌──────────────▼───────────────┐
    │   ActivePieces API Client    │
    │  /services/activepieces-*    │
    └──────────────┬───────────────┘
                   │
    ┌──────────────▼───────────────┐
    │  ActivePieces Self-Hosted    │
    │    GitHub Installation       │
    └──────────────────────────────┘
```

---

## 🔧 طريقة تركيب العقد

### 1️⃣ التثبيت الأساسي

#### خطوة 1: تثبيت ActivePieces Self-Hosted

```bash
# استنساخ المستودع من GitHub
git clone https://github.com/activepieces/activepieces.git
cd activepieces

# تثبيت Docker Compose
docker-compose up -d

# الوصول إلى لوحة التحكم
# http://localhost:8080
```

#### خطوة 2: إعداد المفاتيح

```typescript
// config/activepieces.config.ts
export const activePiecesConfig = {
  apiUrl: 'http://localhost:8080/api',
  apiKey: 'YOUR_API_KEY_HERE',
  projectId: 'YOUR_PROJECT_ID',
  mode: 'self-hosted' // أو 'demo'
}
```

#### خطوة 3: إضافة العقد إلى الواجهة

```typescript
// في NodeTypesSidebarEnhanced.tsx
const nodeTypes = [
  {
    id: 'activepieces-trigger',
    type: 'trigger',
    label: 'ActivePieces Trigger',
    icon: 'Zap',
    category: 'triggers',
    activePiecesType: 'webhook' // نوع العقدة في ActivePieces
  },
  // المزيد من العقد...
]
```

### 2️⃣ ربط العقد بـ ActivePieces

#### إنشاء Flow جديد

```typescript
import { createFlow, addNode } from './lib/automation-sdk'

// إنشاء Flow جديد
const flow = await createFlow({
  name: 'My Automation Flow',
  description: 'تدفق أتمتة مخصص'
})

// إضافة عقدة Trigger
await addNode(flow.id, {
  type: 'trigger',
  name: 'Webhook Trigger',
  settings: {
    url: 'https://api.example.com/webhook',
    method: 'POST'
  }
})

// إضافة عقدة Action
await addNode(flow.id, {
  type: 'action',
  name: 'Send Email',
  settings: {
    to: '{{trigger.email}}',
    subject: 'مرحباً',
    body: 'رسالة تلقائية'
  }
})
```

#### تنفيذ Flow

```typescript
import { executeFlow, getExecutionStatus } from './lib/automation-sdk'

// تنفيذ Flow
const execution = await executeFlow(flow.id, {
  input: { email: 'user@example.com' }
})

// مراقبة الحالة
const status = await getExecutionStatus(execution.id)
console.log('Status:', status.state) // running, success, failed
```

---

## 📦 أنواع العقد المتاحة

### 🎯 Trigger Nodes (عقد الإطلاق)

#### 1. Webhook Trigger
```typescript
{
  id: 'webhook-trigger',
  type: 'trigger',
  settings: {
    method: 'POST' | 'GET' | 'PUT' | 'DELETE',
    headers: Record<string, string>,
    authentication: 'none' | 'api-key' | 'oauth'
  }
}
```

#### 2. Schedule Trigger
```typescript
{
  id: 'schedule-trigger',
  type: 'trigger',
  settings: {
    cron: '0 9 * * *', // كل يوم الساعة 9 صباحاً
    timezone: 'Asia/Riyadh'
  }
}
```

#### 3. Email Trigger
```typescript
{
  id: 'email-trigger',
  type: 'trigger',
  settings: {
    email: 'automation@example.com',
    filter: {
      subject: 'فاتورة*',
      from: 'billing@*'
    }
  }
}
```

### ⚙️ Action Nodes (عقد الإجراءات)

#### 1. HTTP Request
```typescript
{
  id: 'http-request',
  type: 'action',
  settings: {
    url: 'https://api.example.com/data',
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': 'Bearer {{api_key}}'
    },
    body: {
      data: '{{trigger.data}}'
    }
  }
}
```

#### 2. Data Transformation
```typescript
{
  id: 'transform-data',
  type: 'action',
  settings: {
    operations: [
      { type: 'map', field: 'name', value: '{{input.fullName}}' },
      { type: 'filter', condition: 'age > 18' },
      { type: 'sort', field: 'date', order: 'desc' }
    ]
  }
}
```

#### 3. Database Operations
```typescript
{
  id: 'db-insert',
  type: 'action',
  settings: {
    connection: 'postgres://...',
    operation: 'insert',
    table: 'users',
    data: {
      name: '{{trigger.name}}',
      email: '{{trigger.email}}',
      created_at: '{{now}}'
    }
  }
}
```

### 🔀 Logic Nodes (عقد المنطق)

#### 1. Conditional Branch
```typescript
{
  id: 'condition',
  type: 'logic',
  settings: {
    conditions: [
      {
        field: '{{trigger.status}}',
        operator: 'equals',
        value: 'active',
        branch: 'yes'
      }
    ],
    defaultBranch: 'no'
  }
}
```

#### 2. Loop/Iterator
```typescript
{
  id: 'loop',
  type: 'logic',
  settings: {
    items: '{{trigger.items}}',
    maxIterations: 100,
    breakOn: 'error'
  }
}
```

#### 3. Delay/Wait
```typescript
{
  id: 'delay',
  type: 'logic',
  settings: {
    duration: 5000, // 5 ثوانٍ
    unit: 'milliseconds'
  }
}
```

### 🛡️ Error Handling Nodes

#### 1. Try-Catch
```typescript
{
  id: 'try-catch',
  type: 'error-handler',
  settings: {
    tryNodes: ['action-1', 'action-2'],
    catchNode: 'error-handler',
    finallyNode: 'cleanup'
  }
}
```

#### 2. Retry Logic
```typescript
{
  id: 'retry',
  type: 'error-handler',
  settings: {
    maxAttempts: 3,
    delayBetween: 1000,
    backoffMultiplier: 2,
    retryOn: ['network-error', 'timeout']
  }
}
```

---

## 🔑 التكوين والإعداد

### ملف التكوين الرئيسي

```typescript
// config/activepieces.config.ts
export interface ActivePiecesConfig {
  // معلومات الاتصال
  apiUrl: string
  apiKey: string
  projectId: string
  
  // الوضع
  mode: 'demo' | 'self-hosted' | 'cloud'
  
  // إعدادات التنفيذ
  execution: {
    timeout: number // بالثواني
    maxRetries: number
    parallelLimit: number
  }
  
  // إعدادات الأمان
  security: {
    encryptSecrets: boolean
    allowedDomains: string[]
    rateLimiting: {
      enabled: boolean
      maxRequestsPerMinute: number
    }
  }
  
  // إعدادات التسجيل
  logging: {
    level: 'debug' | 'info' | 'warn' | 'error'
    saveToFile: boolean
    maxFileSize: string
  }
}

export const activePiecesConfig: ActivePiecesConfig = {
  apiUrl: process.env.ACTIVEPIECES_API_URL || 'http://localhost:8080/api',
  apiKey: process.env.ACTIVEPIECES_API_KEY || '',
  projectId: process.env.ACTIVEPIECES_PROJECT_ID || '',
  
  mode: 'self-hosted',
  
  execution: {
    timeout: 300, // 5 دقائق
    maxRetries: 3,
    parallelLimit: 10
  },
  
  security: {
    encryptSecrets: true,
    allowedDomains: ['*.example.com'],
    rateLimiting: {
      enabled: true,
      maxRequestsPerMinute: 60
    }
  },
  
  logging: {
    level: 'info',
    saveToFile: true,
    maxFileSize: '10MB'
  }
}
```

### متغيرات البيئة

```bash
# .env.local
ACTIVEPIECES_API_URL=http://localhost:8080/api
ACTIVEPIECES_API_KEY=ap_your_api_key_here
ACTIVEPIECES_PROJECT_ID=project_xyz123
ACTIVEPIECES_MODE=self-hosted

# إعدادات اختيارية
ACTIVEPIECES_TIMEOUT=300
ACTIVEPIECES_MAX_RETRIES=3
ACTIVEPIECES_LOG_LEVEL=info
```

---

## 🔌 API Integration

### استخدام ActivePieces API

```typescript
// services/activepieces-api.ts
import { activePiecesConfig } from '../config/activepieces.config'

class ActivePiecesAPI {
  private baseUrl: string
  private apiKey: string
  
  constructor() {
    this.baseUrl = activePiecesConfig.apiUrl
    this.apiKey = activePiecesConfig.apiKey
  }
  
  // إنشاء Flow
  async createFlow(data: FlowData): Promise<Flow> {
    const response = await fetch(`${this.baseUrl}/flows`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${this.apiKey}`
      },
      body: JSON.stringify(data)
    })
    
    if (!response.ok) {
      throw new Error(`Failed to create flow: ${response.statusText}`)
    }
    
    return response.json()
  }
  
  // تحديث Flow
  async updateFlow(flowId: string, data: Partial<FlowData>): Promise<Flow> {
    const response = await fetch(`${this.baseUrl}/flows/${flowId}`, {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${this.apiKey}`
      },
      body: JSON.stringify(data)
    })
    
    return response.json()
  }
  
  // تنفيذ Flow
  async executeFlow(flowId: string, input: any): Promise<Execution> {
    const response = await fetch(`${this.baseUrl}/flows/${flowId}/execute`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${this.apiKey}`
      },
      body: JSON.stringify({ input })
    })
    
    return response.json()
  }
  
  // الحصول على حالة التنفيذ
  async getExecutionStatus(executionId: string): Promise<ExecutionStatus> {
    const response = await fetch(
      `${this.baseUrl}/executions/${executionId}`,
      {
        headers: {
          'Authorization': `Bearer ${this.apiKey}`
        }
      }
    )
    
    return response.json()
  }
  
  // الحصول على سجل التنفيذ
  async getExecutionLogs(executionId: string): Promise<ExecutionLog[]> {
    const response = await fetch(
      `${this.baseUrl}/executions/${executionId}/logs`,
      {
        headers: {
          'Authorization': `Bearer ${this.apiKey}`
        }
      }
    )
    
    return response.json()
  }
}

export const activePiecesAPI = new ActivePiecesAPI()
```

### مثال عملي كامل

```typescript
import { activePiecesAPI } from './services/activepieces-api'

// 1. إنشاء Flow جديد
async function createAutomationFlow() {
  const flow = await activePiecesAPI.createFlow({
    name: 'معالجة الطلبات التلقائية',
    description: 'يعالج الطلبات الجديدة ويرسل إشعارات',
    trigger: {
      type: 'webhook',
      name: 'طلب جديد',
      settings: {
        method: 'POST',
        path: '/new-order'
      }
    },
    actions: [
      {
        type: 'transform',
        name: 'تحويل البيانات',
        settings: {
          mapping: {
            orderId: '{{trigger.body.id}}',
            customerEmail: '{{trigger.body.email}}',
            total: '{{trigger.body.amount}}'
          }
        }
      },
      {
        type: 'http',
        name: 'حفظ في قاعدة البيانات',
        settings: {
          url: 'https://api.example.com/orders',
          method: 'POST',
          body: '{{previous.output}}'
        }
      },
      {
        type: 'email',
        name: 'إرسال بريد تأكيد',
        settings: {
          to: '{{trigger.body.email}}',
          subject: 'تم استلام طلبك #{{trigger.body.id}}',
          body: 'شكراً لطلبك. سنتواصل معك قريباً.'
        }
      }
    ]
  })
  
  console.log('Flow created:', flow.id)
  return flow
}

// 2. تنفيذ Flow
async function executeAutomation(flowId: string, orderData: any) {
  const execution = await activePiecesAPI.executeFlow(flowId, orderData)
  
  // مراقبة التنفيذ
  const checkStatus = async () => {
    const status = await activePiecesAPI.getExecutionStatus(execution.id)
    
    if (status.state === 'running') {
      console.log('جاري التنفيذ...')
      setTimeout(checkStatus, 1000)
    } else if (status.state === 'success') {
      console.log('اكتمل التنفيذ بنجاح!')
      console.log('النتيجة:', status.output)
    } else {
      console.error('فشل التنفيذ:', status.error)
    }
  }
  
  checkStatus()
}
```

---

## 🐛 استكشاف الأخطاء

### مشاكل شائعة وحلولها

#### 1. خطأ في الاتصال بـ API

```typescript
// المشكلة
Error: Failed to connect to ActivePieces API

// الحل
// 1. تأكد من تشغيل ActivePieces
docker ps | grep activepieces

// 2. تحقق من URL
curl http://localhost:8080/api/health

// 3. تحقق من API Key
console.log(process.env.ACTIVEPIECES_API_KEY)
```

#### 2. العقد لا تظهر في الواجهة

```typescript
// الحل: تحديث قائمة العقد
import { refreshNodeTypes } from './lib/automation-sdk'

await refreshNodeTypes()
```

#### 3. فشل تنفيذ Flow

```typescript
// الحصول على سجل الأخطاء التفصيلي
const logs = await activePiecesAPI.getExecutionLogs(executionId)

logs.forEach(log => {
  if (log.level === 'error') {
    console.error(`Error in ${log.nodeName}:`, log.message)
  }
})
```

#### 4. مشاكل الأداء

```typescript
// تفعيل Caching
const cache = new Map()

async function getCachedFlow(flowId: string) {
  if (cache.has(flowId)) {
    return cache.get(flowId)
  }
  
  const flow = await activePiecesAPI.getFlow(flowId)
  cache.set(flowId, flow)
  return flow
}
```

### رسائل الخطأ الشائعة

| الخطأ | السبب | الحل |
|------|------|-----|
| `ECONNREFUSED` | ActivePieces غير مشغل | تشغيل Docker: `docker-compose up -d` |
| `401 Unauthorized` | API Key خاطئ | تحديث المفتاح في `.env.local` |
| `404 Not Found` | Flow غير موجود | التحقق من Flow ID |
| `429 Too Many Requests` | تجاوز الحد | تفعيل Rate Limiting |
| `500 Internal Server Error` | خطأ في الخادم | مراجعة سجلات ActivePieces |

### أدوات التشخيص

```typescript
// أداة فحص الاتصال
async function diagnosticCheck() {
  console.log('🔍 بدء الفحص التشخيصي...')
  
  // 1. فحص الاتصال
  try {
    const health = await fetch(`${activePiecesConfig.apiUrl}/health`)
    console.log('✅ ActivePieces متصل')
  } catch (error) {
    console.error('❌ فشل الاتصال بـ ActivePieces')
    return
  }
  
  // 2. فحص المصادقة
  try {
    const flows = await activePiecesAPI.listFlows()
    console.log(`✅ المصادقة ناجحة (${flows.length} flows)`)
  } catch (error) {
    console.error('❌ فشلت المصادقة')
    return
  }
  
  // 3. فحص الأداء
  const start = Date.now()
  await activePiecesAPI.listFlows()
  const duration = Date.now() - start
  console.log(`⚡ زمن الاستجابة: ${duration}ms`)
  
  console.log('✅ الفحص التشخيصي اكتمل بنجاح')
}
```

---

## 📚 مراجع إضافية

- [ActivePieces Documentation](https://www.activepieces.com/docs)
- [GitHub Repository](https://github.com/activepieces/activepieces)
- [API Reference](https://www.activepieces.com/docs/api)
- [Community Forum](https://community.activepieces.com)

---

**آخر تحديث**: 2025-10-16  
**الإصدار**: 1.0.0
