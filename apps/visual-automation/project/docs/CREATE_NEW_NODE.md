# 🔨 دليل إنشاء عقدة جديدة
**Creating New Node - Step by Step Guide**

## 📋 جدول المحتويات

- [نظرة عامة](#نظرة-عامة)
- [الخطوات الأساسية](#الخطوات-الأساسية)
- [أمثلة عملية](#أمثلة-عملية)
- [أفضل الممارسات](#أفضل-الممارسات)
- [الاختبار والتوثيق](#الاختبار-والتوثيق)

---

## 🌟 نظرة عامة

إنشاء عقدة جديدة يتم في 5 خطوات رئيسية:

```
1. تعريف العقدة (Definition)
   ↓
2. تحديد الإعدادات (Settings)
   ↓
3. كتابة المنطق (Logic)
   ↓
4. إضافة إلى السايد بار (Registration)
   ↓
5. الاختبار والتوثيق (Testing & Docs)
```

---

## 📝 الخطوات الأساسية

### الخطوة 1: إنشاء ملف التعريف

أنشئ ملف جديد في `/types/nodes/` باسم العقدة:

```typescript
// types/nodes/my-custom-node.ts
import { WorkflowNode, NodeDefinition } from '../automation'

export interface MyCustomNodeData {
  // بيانات مخصصة للعقدة
  apiKey: string
  endpoint: string
  method: 'GET' | 'POST'
}

export interface MyCustomNodeSettings {
  // إعدادات العقدة
  timeout: number
  retryOnError: boolean
  maxRetries: number
}

export const MY_CUSTOM_NODE_DEFINITION: NodeDefinition = {
  // المعرفات
  id: 'my-custom-node',
  type: 'action', // أو 'trigger' أو 'logic' أو 'error-handler'
  category: 'custom',
  
  // المعلومات
  name: 'عقدتي المخصصة',
  nameEn: 'My Custom Node',
  description: 'وصف مختصر للعقدة',
  descriptionEn: 'Brief description of the node',
  
  // التصميم
  icon: 'Sparkles', // من lucide-react
  color: '#8B5CF6',
  
  // المدخلات
  inputs: [
    {
      id: 'trigger',
      label: 'المدخل',
      labelEn: 'Input',
      type: 'exec',
      required: true
    },
    {
      id: 'data',
      label: 'البيانات',
      labelEn: 'Data',
      type: 'any',
      optional: true
    }
  ],
  
  // المخرجات
  outputs: [
    {
      id: 'success',
      label: 'نجاح',
      labelEn: 'Success',
      type: 'exec'
    },
    {
      id: 'result',
      label: 'النتيجة',
      labelEn: 'Result',
      type: 'object'
    },
    {
      id: 'error',
      label: 'خطأ',
      labelEn: 'Error',
      type: 'error'
    }
  ],
  
  // الإعدادات
  settings: {
    apiKey: {
      type: 'string',
      label: 'مفتاح API',
      labelEn: 'API Key',
      required: true,
      sensitive: true, // يخفي القيمة
      placeholder: 'أدخل مفتاح API'
    },
    endpoint: {
      type: 'string',
      label: 'نقطة النهاية',
      labelEn: 'Endpoint',
      required: true,
      placeholder: 'https://api.example.com/data'
    },
    method: {
      type: 'select',
      label: 'الطريقة',
      labelEn: 'Method',
      options: [
        { value: 'GET', label: 'GET' },
        { value: 'POST', label: 'POST' },
        { value: 'PUT', label: 'PUT' },
        { value: 'DELETE', label: 'DELETE' }
      ],
      default: 'GET'
    },
    timeout: {
      type: 'number',
      label: 'المهلة (ثانية)',
      labelEn: 'Timeout (seconds)',
      default: 30,
      min: 1,
      max: 300,
      step: 1
    },
    retryOnError: {
      type: 'boolean',
      label: 'إعادة المحاولة عند الفشل',
      labelEn: 'Retry on error',
      default: false
    },
    maxRetries: {
      type: 'number',
      label: 'عدد المحاولات',
      labelEn: 'Max retries',
      default: 3,
      min: 1,
      max: 10,
      dependsOn: { retryOnError: true } // يظهر فقط إذا كان retryOnError = true
    },
    advancedOptions: {
      type: 'group',
      label: 'خيارات متقدمة',
      labelEn: 'Advanced options',
      collapsible: true,
      collapsed: true,
      fields: {
        customHeader: {
          type: 'keyvalue',
          label: 'رؤوس مخصصة',
          labelEn: 'Custom headers'
        },
        transformResponse: {
          type: 'code',
          label: 'تحويل الاستجابة',
          labelEn: 'Transform response',
          language: 'javascript',
          placeholder: 'return data.map(item => ({ ...item, processed: true }))'
        }
      }
    }
  },
  
  // الإعدادات الافتراضية
  defaultSettings: {
    timeout: 30,
    retryOnError: false,
    maxRetries: 3
  },
  
  // التحقق من الصحة
  validate: (settings: MyCustomNodeSettings): string[] => {
    const errors: string[] = []
    
    if (!settings.apiKey) {
      errors.push('مفتاح API مطلوب')
    }
    
    if (!settings.endpoint || !settings.endpoint.startsWith('http')) {
      errors.push('نقطة النهاية يجب أن تبدأ بـ http:// أو https://')
    }
    
    if (settings.timeout < 1 || settings.timeout > 300) {
      errors.push('المهلة يجب أن تكون بين 1 و 300 ثانية')
    }
    
    return errors
  },
  
  // التنفيذ
  execute: async (node: WorkflowNode, input: any, context: ExecutionContext): Promise<any> => {
    // المنطق الأساسي للعقدة
    return executeMyCustomNode(node, input, context)
  }
}
```

### الخطوة 2: كتابة منطق التنفيذ

أنشئ ملف التنفيذ في `/lib/nodes/executors/`:

```typescript
// lib/nodes/executors/my-custom-node.ts
import { WorkflowNode, ExecutionContext, ExecutionResult } from '../../../types/automation'
import { logger } from '../../logger'

export async function executeMyCustomNode(
  node: WorkflowNode,
  input: any,
  context: ExecutionContext
): Promise<ExecutionResult> {
  try {
    // 1. استخراج الإعدادات
    const { apiKey, endpoint, method, timeout } = node.data.settings
    
    // 2. التحقق من المتطلبات
    if (!apiKey || !endpoint) {
      throw new Error('مفتاح API ونقطة النهاية مطلوبان')
    }
    
    // 3. تنفيذ المنطق الأساسي
    logger.info(`Executing ${node.name} with endpoint: ${endpoint}`)
    
    const controller = new AbortController()
    const timeoutId = setTimeout(() => controller.abort(), timeout * 1000)
    
    const response = await fetch(endpoint, {
      method,
      headers: {
        'Authorization': `Bearer ${apiKey}`,
        'Content-Type': 'application/json'
      },
      body: method !== 'GET' ? JSON.stringify(input) : undefined,
      signal: controller.signal
    })
    
    clearTimeout(timeoutId)
    
    // 4. معالجة الاستجابة
    if (!response.ok) {
      throw new Error(`HTTP Error: ${response.status} ${response.statusText}`)
    }
    
    const result = await response.json()
    
    // 5. تحويل البيانات (إذا كان هناك كود تحويل)
    const transformCode = node.data.settings.advancedOptions?.transformResponse
    if (transformCode) {
      const transform = new Function('data', 'input', 'context', transformCode)
      result = transform(result, input, context)
    }
    
    // 6. إرجاع النتيجة
    logger.info(`${node.name} executed successfully`)
    
    return {
      success: true,
      output: result,
      metadata: {
        executionTime: Date.now() - context.startTime,
        endpoint,
        method,
        statusCode: response.status
      }
    }
    
  } catch (error) {
    // معالجة الأخطاء
    logger.error(`Error executing ${node.name}:`, error)
    
    // إعادة المحاولة إذا كان مفعلاً
    if (node.data.settings.retryOnError && context.retryCount < node.data.settings.maxRetries) {
      logger.info(`Retrying ${node.name} (attempt ${context.retryCount + 1})`)
      
      // انتظار قبل إعادة المحاولة
      await new Promise(resolve => setTimeout(resolve, 1000 * (context.retryCount + 1)))
      
      // إعادة التنفيذ
      return executeMyCustomNode(node, input, {
        ...context,
        retryCount: context.retryCount + 1
      })
    }
    
    // إرجاع خطأ
    return {
      success: false,
      error: {
        code: error.name,
        message: error.message,
        details: error,
        timestamp: new Date()
      }
    }
  }
}
```

### الخطوة 3: إضافة العقدة إلى السايد بار

عدّل ملف `lib/constants.ts` لإضافة العقدة:

```typescript
// lib/constants.ts
import { MY_CUSTOM_NODE_DEFINITION } from '../types/nodes/my-custom-node'

export const NODE_TYPES = {
  // ... العقد الموجودة
  
  // إضافة العقدة الجديدة
  myCustomNode: MY_CUSTOM_NODE_DEFINITION
}

// إضافة الفئة الجديدة إذا لزم الأمر
export const NODE_CATEGORIES = {
  // ... الفئات الموجودة
  
  custom: {
    id: 'custom',
    label: 'مخصص',
    labelEn: 'Custom',
    icon: 'Sparkles',
    color: '#8B5CF6'
  }
}
```

### الخطوة 4: تسجيل العقدة في السايد بار

عدّل `components/NodeTypesSidebarEnhanced.tsx`:

```typescript
// components/NodeTypesSidebarEnhanced.tsx
import { MY_CUSTOM_NODE_DEFINITION } from '../types/nodes/my-custom-node'

export function NodeTypesSidebarEnhanced() {
  const nodeTypes = [
    // ... العقد الموجودة
    
    // إضافة العقدة الجديدة
    {
      ...MY_CUSTOM_NODE_DEFINITION,
      draggable: true
    }
  ]
  
  // ...
}
```

### الخطوة 5: إنشاء مكون العرض (اختياري)

إذا كنت تريد عرضاً مخصصاً للعقدة، أنشئ مكون في `/components/nodes/`:

```typescript
// components/nodes/MyCustomNodeView.tsx
import React from 'react'
import { WorkflowNode } from '../../types/automation'
import { Sparkles, Check, X } from 'lucide-react'
import { Badge } from '../ui/badge'

interface MyCustomNodeViewProps {
  node: WorkflowNode
}

export function MyCustomNodeView({ node }: MyCustomNodeViewProps) {
  const { endpoint, method, timeout } = node.data.settings
  
  return (
    <div className="space-y-2">
      {/* معلومات الإعدادات */}
      <div className="flex items-center gap-2 text-sm">
        <Badge variant="outline">{method}</Badge>
        <span className="text-foreground-muted truncate">{endpoint}</span>
      </div>
      
      {/* حالة العقدة */}
      {node.status === 'success' && (
        <div className="flex items-center gap-1 text-xs text-success">
          <Check className="w-3 h-3" />
          <span>نجح</span>
        </div>
      )}
      
      {node.status === 'error' && (
        <div className="flex items-center gap-1 text-xs text-error">
          <X className="w-3 h-3" />
          <span>فشل</span>
        </div>
      )}
      
      {/* معلومات إضافية */}
      <div className="text-xs text-foreground-muted">
        المهلة: {timeout}ث
      </div>
    </div>
  )
}
```

ثم استخدمه في `WorkflowNodeEnhanced.tsx`:

```typescript
// components/WorkflowNodeEnhanced.tsx
import { MyCustomNodeView } from './nodes/MyCustomNodeView'

export function WorkflowNodeEnhanced({ data, id }: NodeProps) {
  // ...
  
  // في قسم محتوى العقدة
  {data.type === 'my-custom-node' && (
    <MyCustomNodeView node={node} />
  )}
}
```

---

## 🎯 أمثلة عملية

### مثال 1: عقدة إرسال رسالة Slack

```typescript
// types/nodes/slack-message.ts
export const SLACK_MESSAGE_NODE: NodeDefinition = {
  id: 'slack-message',
  type: 'action',
  category: 'communication',
  
  name: 'رسالة Slack',
  nameEn: 'Slack Message',
  description: 'إرسال رسالة إلى قناة Slack',
  descriptionEn: 'Send a message to a Slack channel',
  
  icon: 'MessageSquare',
  color: '#4A154B',
  
  inputs: [{
    id: 'trigger',
    label: 'المدخل',
    type: 'exec',
    required: true
  }],
  
  outputs: [{
    id: 'success',
    label: 'نجاح',
    type: 'exec'
  }],
  
  settings: {
    webhookUrl: {
      type: 'string',
      label: 'رابط Webhook',
      required: true,
      sensitive: true,
      placeholder: 'https://hooks.slack.com/services/...'
    },
    channel: {
      type: 'string',
      label: 'القناة',
      required: true,
      placeholder: '#general'
    },
    message: {
      type: 'richtext',
      label: 'الرسالة',
      required: true,
      placeholder: 'اكتب رسالتك هنا...'
    },
    username: {
      type: 'string',
      label: 'اسم المستخدم',
      default: 'Automation Bot'
    },
    emoji: {
      type: 'emoji',
      label: 'رمز تعبيري',
      default: ':robot_face:'
    }
  },
  
  execute: async (node, input, context) => {
    const { webhookUrl, channel, message, username, emoji } = node.data.settings
    
    const response = await fetch(webhookUrl, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        channel,
        text: message,
        username,
        icon_emoji: emoji
      })
    })
    
    if (!response.ok) {
      throw new Error(`Failed to send Slack message: ${response.statusText}`)
    }
    
    return { success: true, output: { sent: true } }
  }
}
```

### مثال 2: عقدة تحليل JSON

```typescript
// types/nodes/json-parser.ts
export const JSON_PARSER_NODE: NodeDefinition = {
  id: 'json-parser',
  type: 'action',
  category: 'data',
  
  name: 'محلل JSON',
  nameEn: 'JSON Parser',
  description: 'تحليل واستخراج بيانات JSON',
  descriptionEn: 'Parse and extract JSON data',
  
  icon: 'Braces',
  color: '#10B981',
  
  inputs: [
    {
      id: 'json',
      label: 'JSON',
      type: 'string',
      required: true
    }
  ],
  
  outputs: [
    {
      id: 'parsed',
      label: 'المحلل',
      type: 'object'
    }
  ],
  
  settings: {
    jsonPath: {
      type: 'string',
      label: 'مسار JSON',
      placeholder: '$.data.items[0]',
      help: 'استخدم JSONPath لاستخراج قيم محددة'
    },
    strict: {
      type: 'boolean',
      label: 'وضع صارم',
      default: true,
      help: 'فشل إذا كان JSON غير صالح'
    },
    defaultValue: {
      type: 'any',
      label: 'القيمة الافتراضية',
      help: 'يستخدم إذا فشل التحليل (في الوضع غير الصارم)'
    }
  },
  
  execute: async (node, input, context) => {
    const { jsonPath, strict, defaultValue } = node.data.settings
    
    try {
      let parsed = JSON.parse(input.json)
      
      // استخراج باستخدام JSONPath إذا تم تحديده
      if (jsonPath) {
        parsed = jsonpath.query(parsed, jsonPath)[0]
      }
      
      return { success: true, output: parsed }
      
    } catch (error) {
      if (strict) {
        throw error
      }
      
      return { success: true, output: defaultValue || null }
    }
  }
}
```

### مثال 3: عقدة تصفية البيانات

```typescript
// types/nodes/data-filter.ts
export const DATA_FILTER_NODE: NodeDefinition = {
  id: 'data-filter',
  type: 'action',
  category: 'data',
  
  name: 'تصفية البيانات',
  nameEn: 'Data Filter',
  description: 'تصفية مصفوفة من البيانات بناءً على شروط',
  descriptionEn: 'Filter an array of data based on conditions',
  
  icon: 'Filter',
  color: '#10B981',
  
  inputs: [{
    id: 'items',
    label: 'العناصر',
    type: 'array',
    required: true
  }],
  
  outputs: [{
    id: 'filtered',
    label: 'المصفى',
    type: 'array'
  }],
  
  settings: {
    conditions: {
      type: 'array',
      label: 'الشروط',
      itemType: 'condition',
      default: [{
        field: '',
        operator: 'equals',
        value: ''
      }]
    },
    logicOperator: {
      type: 'select',
      label: 'المشغل المنطقي',
      options: [
        { value: 'AND', label: 'AND (جميع الشروط)' },
        { value: 'OR', label: 'OR (أي شرط)' }
      ],
      default: 'AND'
    },
    limit: {
      type: 'number',
      label: 'الحد الأقصى',
      min: 0,
      placeholder: 'بدون حد'
    }
  },
  
  execute: async (node, input, context) => {
    const { conditions, logicOperator, limit } = node.data.settings
    const items = input.items
    
    // تطبيق التصفية
    let filtered = items.filter(item => {
      const results = conditions.map(cond => {
        const value = getValueByPath(item, cond.field)
        return evaluateCondition(value, cond.operator, cond.value)
      })
      
      return logicOperator === 'AND' 
        ? results.every(r => r)
        : results.some(r => r)
    })
    
    // تطبيق الحد الأقصى
    if (limit && limit > 0) {
      filtered = filtered.slice(0, limit)
    }
    
    return {
      success: true,
      output: filtered,
      metadata: {
        inputCount: items.length,
        outputCount: filtered.length,
        filtered: items.length - filtered.length
      }
    }
  }
}
```

---

## ✨ أفضل الممارسات

### 1. التسمية والتوثيق

```typescript
// ✅ جيد
{
  name: 'إرسال بريد إلكتروني',
  nameEn: 'Send Email',
  description: 'إرسال بريد إلكتروني عبر SMTP مع دعم المرفقات',
  descriptionEn: 'Send email via SMTP with attachment support'
}

// ❌ سيء
{
  name: 'Email',
  description: 'Sends email'
}
```

### 2. معالجة الأخطاء

```typescript
// ✅ جيد - أخطاء واضحة ومفيدة
try {
  const response = await fetch(url)
  if (!response.ok) {
    throw new Error(`HTTP ${response.status}: ${response.statusText}`)
  }
} catch (error) {
  if (error.name === 'AbortError') {
    throw new Error('انتهت المهلة الزمنية للطلب')
  }
  throw new Error(`فشل الاتصال بالخادم: ${error.message}`)
}

// ❌ سيء - خطأ غامض
try {
  await fetch(url)
} catch (error) {
  throw error
}
```

### 3. التحقق من الصحة

```typescript
// ✅ جيد - تحقق شامل
validate: (settings) => {
  const errors = []
  
  if (!settings.email || !isValidEmail(settings.email)) {
    errors.push('البريد الإلكتروني غير صالح')
  }
  
  if (settings.timeout < 1 || settings.timeout > 300) {
    errors.push('المهلة يجب أن تكون بين 1 و 300 ثانية')
  }
  
  return errors
}

// ❌ سيء - تحقق محدود
validate: (settings) => {
  return settings.email ? [] : ['Email required']
}
```

### 4. الأداء

```typescript
// ✅ جيد - معالجة دفعات كبيرة بكفاءة
execute: async (node, input, context) => {
  const items = input.items
  const batchSize = 100
  const results = []
  
  for (let i = 0; i < items.length; i += batchSize) {
    const batch = items.slice(i, i + batchSize)
    const batchResults = await Promise.all(
      batch.map(item => processItem(item))
    )
    results.push(...batchResults)
  }
  
  return { success: true, output: results }
}

// ❌ سيء - يعالج عنصر واحد في كل مرة
execute: async (node, input, context) => {
  const results = []
  for (const item of input.items) {
    results.push(await processItem(item))
  }
  return { success: true, output: results }
}
```

### 5. إعادة الاستخدام

```typescript
// ✅ جيد - دوال مساعدة قابلة لإعادة الاستخدام
// lib/nodes/helpers/http.ts
export async function makeHttpRequest(
  url: string,
  options: RequestOptions
): Promise<Response> {
  // منطق HTTP مشترك
}

// في العقدة
execute: async (node, input, context) => {
  const response = await makeHttpRequest(endpoint, {
    method: node.data.settings.method,
    headers: getHeaders(node),
    timeout: node.data.settings.timeout
  })
  return processResponse(response)
}
```

---

## 🧪 الاختبار والتوثيق

### كتابة اختبارات

```typescript
// __tests__/nodes/my-custom-node.test.ts
import { describe, it, expect, vi } from 'vitest'
import { executeMyCustomNode } from '../../lib/nodes/executors/my-custom-node'

describe('MyCustomNode', () => {
  it('should execute successfully with valid settings', async () => {
    const node = {
      id: 'test-node',
      type: 'my-custom-node',
      data: {
        settings: {
          apiKey: 'test-key',
          endpoint: 'https://api.example.com/data',
          method: 'GET',
          timeout: 30
        }
      }
    }
    
    const input = { test: 'data' }
    const context = {
      executionId: 'exec-123',
      startTime: Date.now(),
      retryCount: 0
    }
    
    // Mock fetch
    global.fetch = vi.fn().mockResolvedValue({
      ok: true,
      status: 200,
      json: async () => ({ result: 'success' })
    })
    
    const result = await executeMyCustomNode(node, input, context)
    
    expect(result.success).toBe(true)
    expect(result.output).toEqual({ result: 'success' })
  })
  
  it('should handle errors correctly', async () => {
    const node = {
      id: 'test-node',
      type: 'my-custom-node',
      data: {
        settings: {
          apiKey: '',
          endpoint: 'invalid-url'
        }
      }
    }
    
    const result = await executeMyCustomNode(node, {}, {})
    
    expect(result.success).toBe(false)
    expect(result.error).toBeDefined()
  })
})
```

### التوثيق

أضف التوثيق في `/docs/nodes/`:

```markdown
# عقدة [اسم العقدة]

## نظرة عامة
وصف شامل للعقدة ووظيفتها.

## الاستخدام
كيفية استخدام العقدة مع أمثلة.

## الإعدادات

### مفتاح API
- **النوع**: نص
- **مطلوب**: نعم
- **الوصف**: مفتاح API للمصادقة

## أمثلة

### مثال 1: استخدام أساسي
...

### مثال 2: استخدام متقدم
...

## استكشاف الأخطاء
- **خطأ X**: الحل Y
- **خطأ Z**: الحل W
```

---

## 📚 موارد إضافية

- [قائمة العقد الحالية](/docs/NODES_GUIDE.md)
- [ActivePieces API](/docs/ACTIVEPIECES_INTEGRATION.md)
- [أمثلة عقد جاهزة](/types/nodes/)
- [مكونات UI](/components/ui/)

---

**آخر تحديث**: 2025-10-16  
**الإصدار**: 1.0.0
