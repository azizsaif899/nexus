# 📡 API Reference - Enhanced Version

## 🏥 Health Check Endpoints

### GET /health
فحص شامل لصحة جميع الخدمات

**Response:**
```json
{
  "timestamp": "2025-01-08T10:30:00.000Z",
  "status": "healthy",
  "services": {
    "api": true,
    "odoo": true,
    "redis": true
  }
}
```

### GET /health/ready
فحص جاهزية التطبيق

**Response:**
```json
{
  "status": "ready",
  "timestamp": "2025-01-08T10:30:00.000Z"
}
```

## 📱 WhatsApp Integration

### POST /webhook/whatsapp
استقبال رسائل WhatsApp

**Headers:**
```
Content-Type: application/json
X-Hub-Signature-256: sha256=...
```

**Request Body:**
```json
{
  "object": "whatsapp_business_account",
  "entry": [{
    "changes": [{
      "value": {
        "messages": [{
          "from": "966501234567",
          "text": { "body": "مرحبا" },
          "timestamp": "1640995200"
        }],
        "contacts": [{
          "profile": { "name": "أحمد محمد" },
          "wa_id": "966501234567"
        }]
      }
    }]
  }]
}
```

## 🏢 CRM Endpoints

### GET /api/leads
الحصول على قائمة العملاء المحتملين

**Query Parameters:**
- `page` (optional): رقم الصفحة
- `limit` (optional): عدد النتائج (افتراضي: 20)
- `source` (optional): مصدر العميل (whatsapp, website, etc.)

**Response:**
```json
{
  "success": true,
  "data": [
    {
      "id": 1,
      "name": "أحمد محمد",
      "phone": "+966501234567",
      "email": "ahmed@example.com",
      "description": "عميل محتمل من WhatsApp",
      "source_id": 1,
      "stage_id": 1,
      "created_at": "2025-01-01T00:00:00.000Z",
      "updated_at": "2025-01-08T10:30:00.000Z"
    }
  ],
  "pagination": {
    "page": 1,
    "limit": 20,
    "total": 50,
    "pages": 3
  }
}
```

### POST /api/leads
إنشاء عميل محتمل جديد

**Request Body:**
```json
{
  "name": "فاطمة أحمد",
  "phone": "+966507654321",
  "email": "fatima@example.com",
  "description": "استفسار عن الخدمات",
  "source_id": 1
}
```

**Response:**
```json
{
  "success": true,
  "data": {
    "id": 2,
    "name": "فاطمة أحمد",
    "phone": "+966507654321",
    "email": "fatima@example.com",
    "description": "استفسار عن الخدمات",
    "source_id": 1,
    "stage_id": 1,
    "created_at": "2025-01-08T10:30:00.000Z",
    "updated_at": "2025-01-08T10:30:00.000Z"
  }
}
```

### GET /api/leads/:id/activities
الحصول على أنشطة عميل محدد

**Response:**
```json
{
  "success": true,
  "data": [
    {
      "id": 1,
      "lead_id": 1,
      "type": "whatsapp",
      "description": "رسالة ترحيب تلقائية",
      "completed": true,
      "created_at": "2025-01-01T00:00:00.000Z"
    }
  ]
}
```

## 🔧 Package APIs

### @azizsys/json-rpc-client

```typescript
import { JsonRpcClient } from '@azizsys/json-rpc-client';

const client = new JsonRpcClient({
  baseUrl: 'http://localhost:8070',
  database: 'azizsys_crm',
  username: 'admin',
  password: 'password'
});

// المصادقة
await client.authenticate();

// إنشاء عميل
const result = await client.createLead({
  name: 'أحمد محمد',
  phone: '+966501234567'
});

// الحصول على العملاء
const leads = await client.getLeads();
```

### @azizsys/whatsapp-client

```typescript
import { WhatsAppClient } from '@azizsys/whatsapp-client';

const client = new WhatsAppClient({
  accessToken: 'your_token',
  phoneNumberId: 'your_phone_id'
});

// إرسال رسالة
await client.sendMessage('+966501234567', 'مرحبا بك');

// رد تلقائي
await client.sendAutoReply('+966501234567');

// تحليل webhook
const messages = client.parseWebhookData(webhookData);
```

### @azizsys/cache-client

```typescript
import { CacheClient } from '@azizsys/cache-client';

const cache = new CacheClient();

// حفظ في الكاش
await cache.set('leads:all', data, 300); // 5 دقائق

// استرجاع من الكاش
const cached = await cache.get('leads:all');

// كاش مع API call
const result = await cache.cacheOdooCall(
  'leads:all',
  () => rpcClient.getLeads(),
  300
);
```

### @azizsys/shared-hooks

```typescript
import { useLeads, useCreateLead, useHealthCheck } from '@azizsys/shared-hooks';

// في React component
function LeadsPage() {
  const { data: leads, isLoading } = useLeads();
  const createLead = useCreateLead();
  const { data: health } = useHealthCheck();

  const handleCreate = async (leadData) => {
    await createLead.mutateAsync(leadData);
  };

  return (
    <div>
      {isLoading ? 'Loading...' : leads?.data?.map(lead => ...)}
    </div>
  );
}
```

## ❌ Error Responses

جميع الأخطاء تتبع هذا التنسيق:

```json
{
  "success": false,
  "error": {
    "code": "ODOO_CONNECTION_FAILED",
    "message": "Failed to connect to Odoo server",
    "metadata": {
      "url": "http://localhost:8070",
      "timestamp": "2025-01-08T10:30:00.000Z"
    }
  }
}
```

### Error Codes
- `ODOO_CONNECTION_FAILED` - فشل الاتصال بـ Odoo
- `WHATSAPP_API_ERROR` - خطأ في WhatsApp API
- `VALIDATION_ERROR` - خطأ في التحقق من البيانات
- `CACHE_ERROR` - خطأ في Redis Cache
- `AUTHENTICATION_FAILED` - فشل المصادقة

## 🔒 Authentication

### JWT Token
```
Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```

### Scopes
- `read:leads` - قراءة العملاء المحتملين
- `write:activities` - كتابة الأنشطة
- `admin:all` - صلاحيات إدارية كاملة

---

**📚 للمزيد من التفاصيل، راجع [MONOREPO_GUIDE.md](./MONOREPO_GUIDE.md)**