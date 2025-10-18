# 📦 دليل العقد الشامل
**Workflow Nodes Complete Guide**

## 📋 جدول المحتويات

- [نظرة عامة](#نظرة-عامة)
- [أنواع العقد](#أنواع-العقد)
- [بنية العقدة](#بنية-العقدة)
- [عمل العقد](#عمل-العقد)
- [الاتصالات](#الاتصالات)
- [الحالات والأخطاء](#الحالات-والأخطاء)

---

## 🌟 نظرة عامة

العقد (Nodes) هي اللبنات الأساسية لبناء تدفقات الأتمتة. كل عقدة تمثل:
- ✅ إجراء واحد محدد
- ✅ نقطة قرار أو تحكم
- ✅ محفز لتشغيل التدفق
- ✅ معالج للبيانات أو الأخطاء

### المبادئ الأساسية

```
Input → [العقدة] → Output
  ↓         ↓         ↓
بيانات   معالجة    نتيجة
```

---

## 📚 أنواع العقد

### 1️⃣ Trigger Nodes (عقد الإطلاق)

عقد تبدأ تنفيذ التدفق عند حدوث حدث معين.

#### 🎯 Webhook Trigger
```typescript
{
  id: 'webhook-trigger',
  type: 'trigger',
  category: 'triggers',
  name: 'محفز Webhook',
  description: 'يبدأ التدفق عند استقبال طلب HTTP',
  icon: 'Webhook',
  color: '#8B5CF6',
  
  inputs: [],
  outputs: [{
    id: 'output',
    label: 'البيانات المستقبلة',
    type: 'any'
  }],
  
  settings: {
    url: {
      type: 'string',
      label: 'رابط Webhook',
      required: true,
      placeholder: 'https://api.example.com/webhook'
    },
    method: {
      type: 'select',
      label: 'الطريقة',
      options: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE'],
      default: 'POST'
    },
    authentication: {
      type: 'select',
      label: 'المصادقة',
      options: ['none', 'api-key', 'bearer-token', 'oauth'],
      default: 'none'
    }
  }
}
```

#### ⏰ Schedule Trigger
```typescript
{
  id: 'schedule-trigger',
  type: 'trigger',
  category: 'triggers',
  name: 'محفز الجدولة',
  description: 'يبدأ التدفق في أوقات محددة',
  icon: 'Clock',
  color: '#8B5CF6',
  
  settings: {
    cron: {
      type: 'string',
      label: 'تعبير Cron',
      required: true,
      placeholder: '0 9 * * *',
      help: 'مثال: 0 9 * * * (كل يوم الساعة 9 صباحاً)'
    },
    timezone: {
      type: 'timezone',
      label: 'المنطقة الزمنية',
      default: 'Asia/Riyadh'
    }
  }
}
```

#### 📧 Email Trigger
```typescript
{
  id: 'email-trigger',
  type: 'trigger',
  category: 'triggers',
  name: 'محفز البريد',
  description: 'يبدأ عند استقبال بريد جديد',
  icon: 'Mail',
  color: '#8B5CF6',
  
  settings: {
    email: {
      type: 'email',
      label: 'البريد الإلكتروني',
      required: true
    },
    filter: {
      type: 'object',
      label: 'التصفية',
      properties: {
        subject: { type: 'string', label: 'الموضوع' },
        from: { type: 'string', label: 'من' },
        hasAttachment: { type: 'boolean', label: 'له مرفق' }
      }
    }
  }
}
```

### 2️⃣ Action Nodes (عقد الإجراءات)

عقد تنفذ إجراءات ومهام محددة.

#### 🌐 HTTP Request
```typescript
{
  id: 'http-request',
  type: 'action',
  category: 'actions',
  name: 'طلب HTTP',
  description: 'إرسال طلب HTTP إلى API',
  icon: 'Globe',
  color: '#06B6D4',
  
  inputs: [{
    id: 'data',
    label: 'البيانات',
    type: 'any',
    optional: true
  }],
  
  outputs: [{
    id: 'response',
    label: 'الاستجابة',
    type: 'object'
  }],
  
  settings: {
    url: {
      type: 'string',
      label: 'الرابط',
      required: true,
      placeholder: 'https://api.example.com/data'
    },
    method: {
      type: 'select',
      label: 'الطريقة',
      options: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE'],
      default: 'GET'
    },
    headers: {
      type: 'keyvalue',
      label: 'الرؤوس',
      default: { 'Content-Type': 'application/json' }
    },
    body: {
      type: 'json',
      label: 'البيانات',
      dependsOn: { method: ['POST', 'PUT', 'PATCH'] }
    },
    timeout: {
      type: 'number',
      label: 'المهلة (ثانية)',
      default: 30,
      min: 1,
      max: 300
    }
  }
}
```

#### 🔄 Transform Data
```typescript
{
  id: 'transform-data',
  type: 'action',
  category: 'data',
  name: 'تحويل البيانات',
  description: 'تحويل وتعديل البيانات',
  icon: 'RefreshCw',
  color: '#10B981',
  
  inputs: [{
    id: 'input',
    label: 'البيانات',
    type: 'any',
    required: true
  }],
  
  outputs: [{
    id: 'output',
    label: 'البيانات المحولة',
    type: 'any'
  }],
  
  settings: {
    transformType: {
      type: 'select',
      label: 'نوع التحويل',
      options: [
        'map',      // تحويل الحقول
        'filter',   // تصفية
        'sort',     // ترتيب
        'group',    // تجميع
        'flatten',  // تسطيح
        'custom'    // كود مخصص
      ],
      default: 'map'
    },
    mapping: {
      type: 'object',
      label: 'تحويل الحقول',
      dependsOn: { transformType: 'map' }
    },
    filterCondition: {
      type: 'string',
      label: 'شرط التصفية',
      dependsOn: { transformType: 'filter' },
      placeholder: 'age > 18'
    },
    customCode: {
      type: 'code',
      label: 'كود JavaScript',
      language: 'javascript',
      dependsOn: { transformType: 'custom' }
    }
  }
}
```

#### 💾 Database Operation
```typescript
{
  id: 'database-operation',
  type: 'action',
  category: 'database',
  name: 'عملية قاعدة بيانات',
  description: 'التفاعل مع قواعد البيانات',
  icon: 'Database',
  color: '#06B6D4',
  
  settings: {
    connection: {
      type: 'connection',
      label: 'الاتصال',
      connectionType: 'database',
      required: true
    },
    operation: {
      type: 'select',
      label: 'العملية',
      options: ['select', 'insert', 'update', 'delete', 'query'],
      default: 'select'
    },
    table: {
      type: 'string',
      label: 'الجدول',
      required: true,
      dependsOn: { operation: ['select', 'insert', 'update', 'delete'] }
    },
    query: {
      type: 'code',
      label: 'استعلام SQL',
      language: 'sql',
      dependsOn: { operation: 'query' }
    }
  }
}
```

#### 📧 Send Email
```typescript
{
  id: 'send-email',
  type: 'action',
  category: 'communication',
  name: 'إرسال بريد',
  description: 'إرسال بريد إلكتروني',
  icon: 'Mail',
  color: '#06B6D4',
  
  settings: {
    to: {
      type: 'string',
      label: 'إلى',
      required: true,
      placeholder: 'user@example.com'
    },
    subject: {
      type: 'string',
      label: 'الموضوع',
      required: true
    },
    body: {
      type: 'richtext',
      label: 'النص',
      required: true
    },
    attachments: {
      type: 'array',
      label: 'المرفقات',
      itemType: 'file'
    },
    cc: {
      type: 'string',
      label: 'نسخة إلى'
    },
    bcc: {
      type: 'string',
      label: 'نسخة مخفية'
    }
  }
}
```

### 3️⃣ Logic Nodes (عقد المنطق)

عقد تتحكم في تدفق التنفيذ.

#### 🔀 Condition (If/Else)
```typescript
{
  id: 'condition',
  type: 'logic',
  category: 'logic',
  name: 'شرط',
  description: 'تنفيذ مشروط بناءً على شرط',
  icon: 'GitBranch',
  color: '#F59E0B',
  
  inputs: [{
    id: 'input',
    label: 'البيانات',
    type: 'any'
  }],
  
  outputs: [
    { id: 'true', label: 'صحيح', type: 'any' },
    { id: 'false', label: 'خطأ', type: 'any' }
  ],
  
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
      options: ['AND', 'OR'],
      default: 'AND'
    }
  }
}
```

#### 🔁 Loop (For Each)
```typescript
{
  id: 'loop',
  type: 'logic',
  category: 'logic',
  name: 'حلقة',
  description: 'تكرار على مجموعة من العناصر',
  icon: 'Repeat',
  color: '#F59E0B',
  
  inputs: [{
    id: 'items',
    label: 'العناصر',
    type: 'array',
    required: true
  }],
  
  outputs: [{
    id: 'item',
    label: 'العنصر الحالي',
    type: 'any'
  }],
  
  settings: {
    maxIterations: {
      type: 'number',
      label: 'الحد الأقصى للتكرارات',
      default: 100,
      min: 1,
      max: 10000
    },
    breakOn: {
      type: 'select',
      label: 'إيقاف عند',
      options: ['error', 'condition', 'never'],
      default: 'error'
    }
  }
}
```

#### ⏸️ Delay
```typescript
{
  id: 'delay',
  type: 'logic',
  category: 'logic',
  name: 'تأخير',
  description: 'انتظار لمدة محددة',
  icon: 'Timer',
  color: '#F59E0B',
  
  settings: {
    duration: {
      type: 'number',
      label: 'المدة',
      required: true,
      min: 1
    },
    unit: {
      type: 'select',
      label: 'الوحدة',
      options: [
        'milliseconds',
        'seconds',
        'minutes',
        'hours',
        'days'
      ],
      default: 'seconds'
    }
  }
}
```

#### 🔀 Switch
```typescript
{
  id: 'switch',
  type: 'logic',
  category: 'logic',
  name: 'تبديل',
  description: 'توجيه بناءً على قيمة',
  icon: 'SplitSquareVertical',
  color: '#F59E0B',
  
  inputs: [{
    id: 'value',
    label: 'القيمة',
    type: 'any'
  }],
  
  outputs: [
    { id: 'case1', label: 'حالة 1', type: 'any' },
    { id: 'case2', label: 'حالة 2', type: 'any' },
    { id: 'default', label: 'افتراضي', type: 'any' }
  ],
  
  settings: {
    cases: {
      type: 'array',
      label: 'الحالات',
      itemType: 'object',
      default: []
    }
  }
}
```

### 4️⃣ Error Handling Nodes (عقد معالجة الأخطاء)

عقد تتعامل مع الأخطاء والاستثناءات.

#### 🛡️ Try-Catch
```typescript
{
  id: 'try-catch',
  type: 'error-handler',
  category: 'error-handling',
  name: 'Try-Catch',
  description: 'محاولة تنفيذ ومعالجة الأخطاء',
  icon: 'Shield',
  color: '#EF4444',
  
  outputs: [
    { id: 'success', label: 'نجاح', type: 'any' },
    { id: 'error', label: 'خطأ', type: 'error' }
  ],
  
  settings: {
    tryNodes: {
      type: 'nodeselect',
      label: 'عقد Try',
      multiple: true
    },
    catchNode: {
      type: 'nodeselect',
      label: 'عقدة Catch'
    },
    finallyNode: {
      type: 'nodeselect',
      label: 'عقدة Finally',
      optional: true
    }
  }
}
```

#### 🔄 Retry Logic
```typescript
{
  id: 'retry',
  type: 'error-handler',
  category: 'error-handling',
  name: 'إعادة المحاولة',
  description: 'إعادة محاولة العملية عند الفشل',
  icon: 'RotateCw',
  color: '#EF4444',
  
  settings: {
    maxAttempts: {
      type: 'number',
      label: 'عدد المحاولات',
      default: 3,
      min: 1,
      max: 10
    },
    delayBetween: {
      type: 'number',
      label: 'التأخير بين المحاولات (ملي ثانية)',
      default: 1000,
      min: 0
    },
    backoffMultiplier: {
      type: 'number',
      label: 'معامل التأخير',
      default: 2,
      min: 1,
      help: 'يزيد التأخير بهذا المعامل مع كل محاولة'
    },
    retryOn: {
      type: 'multiselect',
      label: 'إعادة المحاولة عند',
      options: [
        'network-error',
        'timeout',
        '500-error',
        'rate-limit',
        'all'
      ],
      default: ['network-error', 'timeout']
    }
  }
}
```

#### ⚠️ Error Notification
```typescript
{
  id: 'error-notification',
  type: 'error-handler',
  category: 'error-handling',
  name: 'إشعار خطأ',
  description: 'إرسال إشعار عند حدوث خطأ',
  icon: 'AlertTriangle',
  color: '#EF4444',
  
  inputs: [{
    id: 'error',
    label: 'الخطأ',
    type: 'error'
  }],
  
  settings: {
    notificationType: {
      type: 'select',
      label: 'نوع الإشعار',
      options: ['email', 'slack', 'webhook', 'sms'],
      default: 'email'
    },
    recipients: {
      type: 'string',
      label: 'المستلمون',
      required: true
    },
    includeStackTrace: {
      type: 'boolean',
      label: 'تضمين Stack Trace',
      default: true
    }
  }
}
```

#### 📝 Error Logger
```typescript
{
  id: 'error-logger',
  type: 'error-handler',
  category: 'error-handling',
  name: 'مسجل الأخطاء',
  description: 'تسجيل الأخطاء في نظام السجلات',
  icon: 'FileText',
  color: '#EF4444',
  
  inputs: [{
    id: 'error',
    label: 'الخطأ',
    type: 'error'
  }],
  
  settings: {
    logLevel: {
      type: 'select',
      label: 'مستوى السجل',
      options: ['error', 'warn', 'info', 'debug'],
      default: 'error'
    },
    destination: {
      type: 'select',
      label: 'الوجهة',
      options: ['file', 'database', 'external-service'],
      default: 'file'
    },
    includeContext: {
      type: 'boolean',
      label: 'تضمين السياق',
      default: true
    }
  }
}
```

#### ✅ Fallback Handler
```typescript
{
  id: 'fallback',
  type: 'error-handler',
  category: 'error-handling',
  name: 'معالج احتياطي',
  description: 'استخدام قيمة افتراضية عند الفشل',
  icon: 'Package',
  color: '#EF4444',
  
  inputs: [{
    id: 'primary',
    label: 'الأساسي',
    type: 'any'
  }],
  
  outputs: [{
    id: 'output',
    label: 'الإخراج',
    type: 'any'
  }],
  
  settings: {
    fallbackValue: {
      type: 'any',
      label: 'القيمة الاحتياطية',
      required: true
    },
    fallbackNode: {
      type: 'nodeselect',
      label: 'عقدة احتياطية',
      optional: true
    }
  }
}
```

---

## 🏗️ بنية العقدة

### الهيكل الأساسي

```typescript
interface WorkflowNode {
  // المعرفات
  id: string                    // معرف فريد
  type: NodeType                // نوع العقدة
  category: NodeCategory        // الفئة
  
  // المعلومات
  name: string                  // الاسم
  description: string           // الوصف
  icon: IconName                // الأيقونة
  color: string                 // اللون
  
  // البيانات
  data: {
    label: string              // العنوان المعروض
    settings: Record<string, any>  // الإعدادات
    metadata?: any             // بيانات إضافية
  }
  
  // الموقع
  position: {
    x: number
    y: number
  }
  
  // المدخلات والمخرجات
  inputs: NodePort[]
  outputs: NodePort[]
  
  // الحالة
  status: NodeStatus
  error?: Error
  
  // الإعدادات
  settings: NodeSettings
}

interface NodePort {
  id: string
  label: string
  type: PortType
  required?: boolean
  optional?: boolean
}

type NodeStatus = 
  | 'idle'       // خامل
  | 'running'    // قيد التشغيل
  | 'success'    // نجح
  | 'error'      // فشل
  | 'warning'    // تحذير
  | 'disabled'   // معطل
```

### مثال عقدة كاملة

```typescript
const httpRequestNode: WorkflowNode = {
  id: 'node_abc123',
  type: 'action',
  category: 'actions',
  name: 'HTTP Request',
  description: 'إرسال طلب HTTP',
  icon: 'Globe',
  color: '#06B6D4',
  
  data: {
    label: 'جلب بيانات المستخدم',
    settings: {
      url: 'https://api.example.com/users',
      method: 'GET',
      headers: {
        'Authorization': 'Bearer {{api_key}}'
      }
    }
  },
  
  position: { x: 100, y: 200 },
  
  inputs: [{
    id: 'trigger',
    label: 'المدخل',
    type: 'exec'
  }],
  
  outputs: [
    {
      id: 'success',
      label: 'نجاح',
      type: 'exec'
    },
    {
      id: 'data',
      label: 'البيانات',
      type: 'object'
    }
  ],
  
  status: 'idle',
  
  settings: {
    timeout: 30,
    retryOnError: true,
    maxRetries: 3
  }
}
```

---

## ⚙️ عمل العقد

### دورة حياة العقدة

```
1. إنشاء (Create)
   ↓
2. إعداد (Configure)
   ↓
3. ربط (Connect)
   ↓
4. تحقق (Validate)
   ↓
5. تنفيذ (Execute)
   ├─ نجاح (Success) → Output
   └─ فشل (Error) → Error Handler
   ↓
6. تنظيف (Cleanup)
```

### التنفيذ

```typescript
async function executeNode(node: WorkflowNode, input: any): Promise<any> {
  try {
    // 1. التحقق من الصحة
    validateNode(node)
    
    // 2. معالجة المدخلات
    const processedInput = processInput(node, input)
    
    // 3. تنفيذ المنطق الأساسي
    const result = await node.execute(processedInput)
    
    // 4. معالجة المخرجات
    const output = processOutput(node, result)
    
    // 5. تحديث الحالة
    node.status = 'success'
    
    return output
    
  } catch (error) {
    // معالجة الأخطاء
    node.status = 'error'
    node.error = error
    
    // محاولة إعادة التنفيذ إذا كان مفعلاً
    if (node.settings.retryOnError) {
      return retryExecution(node, input)
    }
    
    throw error
  }
}
```

### المتغيرات والقيم الديناميكية

```typescript
// استخدام المتغيرات في الإعدادات
{
  url: '{{trigger.url}}',
  email: '{{user.email}}',
  amount: '{{order.total}}'
}

// معالجة المتغيرات
function resolveVariables(template: string, context: any): string {
  return template.replace(/\{\{([^}]+)\}\}/g, (match, path) => {
    return getValueByPath(context, path.trim())
  })
}

// مثال
const template = 'مرحباً {{user.name}}، طلبك رقم {{order.id}}'
const context = {
  user: { name: 'أحمد' },
  order: { id: '12345' }
}
const result = resolveVariables(template, context)
// "مرحباً أحمد، طلبك رقم 12345"
```

---

## 🔗 الاتصالات

### أنواع الاتصالات

```typescript
interface Connection {
  id: string
  source: string      // ID العقدة المصدر
  sourceOutput: string // ID المخرج
  target: string      // ID العقدة الهدف
  targetInput: string  // ID المدخل
  type: ConnectionType
}

type ConnectionType = 
  | 'exec'     // تنفيذ تسلسلي
  | 'data'     // نقل بيانات
  | 'condition' // شرطي
  | 'error'    // معالجة أخطاء
```

### إنشاء اتصال

```typescript
function createConnection(
  sourceNode: WorkflowNode,
  sourcePort: string,
  targetNode: WorkflowNode,
  targetPort: string
): Connection {
  // التحقق من صحة الاتصال
  validateConnection(sourceNode, sourcePort, targetNode, targetPort)
  
  return {
    id: generateId(),
    source: sourceNode.id,
    sourceOutput: sourcePort,
    target: targetNode.id,
    targetInput: targetPort,
    type: inferConnectionType(sourceNode, targetNode)
  }
}
```

### رسم الاتصالات

```typescript
function ConnectionLine({ connection }: { connection: Connection }) {
  const source = getNodePosition(connection.source)
  const target = getNodePosition(connection.target)
  
  // حساب المسار
  const path = calculatePath(source, target)
  
  return (
    <svg>
      <path
        d={path}
        stroke={getConnectionColor(connection.type)}
        strokeWidth={2}
        fill="none"
        className="transition-all hover:stroke-width-3"
      />
      
      {/* سهم الاتجاه */}
      <marker
        id="arrow"
        viewBox="0 0 10 10"
        refX="5"
        refY="5"
        markerWidth="6"
        markerHeight="6"
        orient="auto"
      >
        <path d="M 0 0 L 10 5 L 0 10 z" />
      </marker>
    </svg>
  )
}
```

---

## 🚨 الحالات والأخطاء

### حالات العقدة

```typescript
// ألوان حسب الحالة
const statusColors = {
  idle: '#667781',      // رمادي
  running: '#3B82F6',   // أزرق
  success: '#10B981',   // أخضر
  error: '#EF4444',     // أحمر
  warning: '#F59E0B',   // برتقالي
  disabled: '#9CA3AF'   // رمادي فاتح
}

// أيقونات الحالة
const statusIcons = {
  running: Loader2,     // مع أنيميشن دوران
  success: CheckCircle,
  error: XCircle,
  warning: AlertTriangle,
  disabled: BanIcon
}
```

### معالجة الأخطاء

```typescript
interface NodeError {
  code: string
  message: string
  details?: any
  timestamp: Date
  stack?: string
}

// أنواع الأخطاء
enum ErrorType {
  VALIDATION = 'validation_error',
  EXECUTION = 'execution_error',
  CONNECTION = 'connection_error',
  TIMEOUT = 'timeout_error',
  RATE_LIMIT = 'rate_limit_error'
}

// معالج الأخطاء
function handleNodeError(node: WorkflowNode, error: Error): void {
  const nodeError: NodeError = {
    code: error.name,
    message: error.message,
    details: error,
    timestamp: new Date(),
    stack: error.stack
  }
  
  // تسجيل الخطأ
  logger.error(`Node ${node.id} failed:`, nodeError)
  
  // تحديث حالة العقدة
  node.status = 'error'
  node.error = nodeError
  
  // إشعار المستخدم
  showErrorNotification(node, nodeError)
  
  // تشغيل معالج الأخطاء إن وجد
  if (node.errorHandler) {
    executeErrorHandler(node.errorHandler, nodeError)
  }
}
```

### عرض الأخطاء

```typescript
function NodeError({ node }: { node: WorkflowNode }) {
  if (!node.error) return null
  
  return (
    <Alert variant="error">
      <AlertTriangle className="w-4 h-4" />
      <AlertTitle>خطأ في {node.data.label}</AlertTitle>
      <AlertDescription>
        {node.error.message}
        
        {node.error.stack && (
          <details className="mt-2">
            <summary className="cursor-pointer text-sm">
              عرض التفاصيل
            </summary>
            <pre className="mt-2 text-xs overflow-x-auto">
              {node.error.stack}
            </pre>
          </details>
        )}
      </AlertDescription>
    </Alert>
  )
}
```

---

**آخر تحديث**: 2025-10-16  
**الإصدار**: 1.0.0
