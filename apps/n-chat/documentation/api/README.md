# 🔌 API Documentation - FlowCanvasAI

## 📋 نظرة عامة على API

### 🌐 Base URL
```
Production: https://flowcanvas-ai.vercel.app/api
Development: http://localhost:3000/api
```

### 🔑 Authentication
جميع المسارات المحمية تتطلب JWT token في header:
```bash
Authorization: Bearer YOUR_JWT_TOKEN
```

### 📊 Response Format
```typescript
// Success Response
{
  "success": true,
  "data": any,
  "message"?: string,
  "meta"?: {
    "pagination": PaginationInfo,
    "timestamp": string,
    "version": string
  }
}

// Error Response
{
  "success": false,
  "error": string,
  "details"?: any,
  "code"?: string,
  "timestamp": string
}
```

---

## 🔐 Authentication API

### POST /api/auth/signin
تسجيل دخول المستخدم

**Request Body:**
```typescript
{
  "email": string,
  "password": string,
  "remember"?: boolean
}
```

**Response:**
```typescript
{
  "success": true,
  "data": {
    "user": User,
    "token": string,
    "expiresAt": string
  }
}
```

**Example:**
```bash
curl -X POST /api/auth/signin \
  -H "Content-Type: application/json" \
  -d '{
    "email": "user@example.com",
    "password": "password123"
  }'
```

### POST /api/auth/signup
إنشاء حساب جديد

**Request Body:**
```typescript
{
  "email": string,
  "password": string,
  "displayName": string,
  "preferences"?: UserPreferences
}
```

### POST /api/auth/refresh
تجديد الـ token

**Headers:**
```
Authorization: Bearer REFRESH_TOKEN
```

### POST /api/auth/logout
تسجيل خروج المستخدم

---

## 👤 User API

### GET /api/user/profile
جلب ملف المستخدم الشخصي

**Headers:**
```
Authorization: Bearer JWT_TOKEN
```

**Response:**
```typescript
{
  "success": true,
  "data": {
    "id": string,
    "email": string,
    "displayName": string,
    "photoURL"?: string,
    "preferences": UserPreferences,
    "subscription": SubscriptionInfo,
    "stats": UserStats,
    "createdAt": string,
    "lastActive": string
  }
}
```

### PUT /api/user/profile
تحديث ملف المستخدم

**Request Body:**
```typescript
{
  "displayName"?: string,
  "photoURL"?: string,
  "preferences"?: UserPreferences
}
```

### GET /api/user/subscription
معلومات الاشتراك

### PUT /api/user/subscription
تحديث الاشتراك

---

## 🎨 Workflows API

### GET /api/workflows
جلب قائمة المخططات

**Query Parameters:**
```typescript
{
  "page"?: number,        // default: 1
  "limit"?: number,       // default: 10, max: 50
  "search"?: string,      // البحث في العنوان والوصف
  "tags"?: string[],      // تصفية بالعلامات
  "public"?: boolean,     // مخططات عامة فقط
  "sortBy"?: "created" | "updated" | "views" | "title",
  "sortOrder"?: "asc" | "desc"
}
```

**Response:**
```typescript
{
  "success": true,
  "data": {
    "workflows": Workflow[],
    "pagination": {
      "page": number,
      "limit": number,
      "total": number,
      "totalPages": number,
      "hasNext": boolean,
      "hasPrev": boolean
    }
  }
}
```

**Example:**
```bash
curl "/api/workflows?page=1&limit=10&search=automation&tags=workflow,ai"
```

### POST /api/workflows
إنشاء مخطط جديد

**Request Body:**
```typescript
{
  "title": string,
  "description"?: string,
  "nodes": Node[],
  "connections": Connection[],
  "settings": {
    "autoSave": boolean,
    "public": boolean,
    "tags": string[]
  }
}
```

**Response:**
```typescript
{
  "success": true,
  "data": {
    "id": string,
    "workflow": Workflow
  }
}
```

### GET /api/workflows/[id]
جلب مخطط محدد

**Path Parameters:**
- `id`: معرف المخطط

**Query Parameters:**
```typescript
{
  "includeAnalytics"?: boolean,
  "includeHistory"?: boolean
}
```

### PUT /api/workflows/[id]
تحديث مخطط

**Request Body:**
```typescript
{
  "title"?: string,
  "description"?: string,
  "nodes"?: Node[],
  "connections"?: Connection[],
  "settings"?: WorkflowSettings
}
```

### DELETE /api/workflows/[id]
حذف مخطط

### POST /api/workflows/[id]/clone
نسخ مخطط

**Request Body:**
```typescript
{
  "title"?: string,
  "public"?: boolean
}
```

### GET /api/workflows/[id]/analytics
إحصائيات المخطط

**Query Parameters:**
```typescript
{
  "timeRange"?: "1d" | "7d" | "30d" | "90d" | "1y",
  "metrics"?: ("views" | "clones" | "executions")[]
}
```

---

## 🤖 AI API

### POST /api/ai/chat
محادثة مع الذكاء الاصطناعي

**Request Body:**
```typescript
{
  "message": string,
  "context"?: {
    "conversationId"?: string,
    "workflowId"?: string,
    "canvasState"?: object,
    "userIntent": string
  },
  "options"?: {
    "model"?: string,
    "temperature"?: number,
    "maxTokens"?: number,
    "stream"?: boolean
  }
}
```

**Response:**
```typescript
{
  "success": true,
  "data": {
    "response": string,
    "conversationId": string,
    "usage": {
      "promptTokens": number,
      "completionTokens": number,
      "totalTokens": number
    },
    "suggestions"?: string[],
    "timestamp": string
  }
}
```

**Rate Limits:**
- Free: 100 requests/hour
- Pro: 1000 requests/hour
- Enterprise: Unlimited

### POST /api/ai/analyze
تحليل مخطط بالذكاء الاصطناعي

**Request Body:**
```typescript
{
  "workflowId": string,
  "analysisType": "performance" | "optimization" | "security" | "all"
}
```

**Response:**
```typescript
{
  "success": true,
  "data": {
    "analysis": {
      "performance": PerformanceAnalysis,
      "suggestions": Suggestion[],
      "issues": Issue[],
      "score": number
    },
    "executionTime": number
  }
}
```

### POST /api/ai/generate
توليد كود من المخطط

**Request Body:**
```typescript
{
  "workflowId": string,
  "targetLanguage": "javascript" | "python" | "java" | "csharp" | "go",
  "framework"?: string,
  "options"?: {
    "includeComments": boolean,
    "includeTests": boolean,
    "codeStyle": "standard" | "clean" | "enterprise"
  }
}
```

### GET /api/ai/conversations
سجل المحادثات

**Query Parameters:**
```typescript
{
  "page"?: number,
  "limit"?: number,
  "search"?: string,
  "dateFrom"?: string,
  "dateTo"?: string
}
```

### GET /api/ai/conversations/[id]
محادثة محددة

### DELETE /api/ai/conversations/[id]
حذف محادثة

---

## 📊 Analytics API

### GET /api/analytics/overview
نظرة عامة على الإحصائيات

**Query Parameters:**
```typescript
{
  "timeRange"?: "1d" | "7d" | "30d" | "90d" | "1y",
  "timezone"?: string
}
```

**Response:**
```typescript
{
  "success": true,
  "data": {
    "workflows": {
      "total": number,
      "created": number,
      "updated": number
    },
    "ai": {
      "totalRequests": number,
      "tokensUsed": number,
      "averageResponseTime": number
    },
    "usage": {
      "activeUsers": number,
      "sessions": number,
      "pageViews": number
    },
    "performance": {
      "averageLoadTime": number,
      "errorRate": number,
      "uptime": number
    }
  }
}
```

### GET /api/analytics/workflows
إحصائيات المخططات

### GET /api/analytics/ai
إحصائيات الذكاء الاصطناعي

### GET /api/analytics/performance
إحصائيات الأداء

---

## 📁 File Upload API

### POST /api/upload
رفع ملف

**Request:** Multipart Form Data
```typescript
{
  "file": File,
  "type": "avatar" | "workflow_image" | "document",
  "folder"?: string
}
```

**Response:**
```typescript
{
  "success": true,
  "data": {
    "url": string,
    "filename": string,
    "size": number,
    "type": string,
    "uploadedAt": string
  }
}
```

**File Limits:**
- Max size: 10MB
- Allowed types: image/*, application/pdf, text/*
- Rate limit: 50 uploads/hour

### GET /api/upload/[filename]
جلب ملف

### DELETE /api/upload/[filename]
حذف ملف

---

## 🔔 Notifications API

### GET /api/notifications
جلب الإشعارات

**Query Parameters:**
```typescript
{
  "unreadOnly"?: boolean,
  "type"?: "system" | "workflow" | "ai" | "subscription",
  "page"?: number,
  "limit"?: number
}
```

### PUT /api/notifications/[id]/read
تعليم إشعار كمقروء

### POST /api/notifications/mark-all-read
تعليم جميع الإشعارات كمقروءة

### GET /api/notifications/preferences
تفضيلات الإشعارات

### PUT /api/notifications/preferences
تحديث تفضيلات الإشعارات

---

## 📈 Admin API (Enterprise Only)

### GET /api/admin/users
إدارة المستخدمين

### GET /api/admin/analytics
إحصائيات شاملة

### POST /api/admin/workflows/feature
إبراز مخطط

### GET /api/admin/system/health
حالة النظام

---

## 🚨 Error Codes

### Authentication Errors
- `AUTH_001`: Invalid credentials
- `AUTH_002`: Token expired
- `AUTH_003`: Account disabled
- `AUTH_004`: Email not verified

### Authorization Errors
- `AUTHZ_001`: Insufficient permissions
- `AUTHZ_002`: Resource not found
- `AUTHZ_003`: Access denied

### Validation Errors
- `VAL_001`: Required field missing
- `VAL_002`: Invalid format
- `VAL_003`: Value out of range
- `VAL_004`: Duplicate entry

### Rate Limiting
- `RATE_001`: Rate limit exceeded
- `RATE_002`: Quota exhausted
- `RATE_003`: Too many requests

### AI Service Errors
- `AI_001`: AI service unavailable
- `AI_002`: Invalid prompt
- `AI_003`: Context too large
- `AI_004`: Model overloaded

---

## 📝 Examples & SDKs

### JavaScript/TypeScript SDK
```typescript
import { FlowCanvasAPI } from '@flowcanvas/api-client';

const api = new FlowCanvasAPI({
  baseURL: 'https://flowcanvas-ai.vercel.app/api',
  apiKey: 'your-api-key'
});

// Create workflow
const workflow = await api.workflows.create({
  title: 'My Workflow',
  nodes: [...],
  connections: [...]
});

// AI Chat
const response = await api.ai.chat({
  message: 'Analyze my workflow',
  context: { workflowId: workflow.id }
});
```

### Python SDK
```python
from flowcanvas import FlowCanvasAPI

api = FlowCanvasAPI(
    base_url='https://flowcanvas-ai.vercel.app/api',
    api_key='your-api-key'
)

# Create workflow
workflow = api.workflows.create({
    'title': 'My Workflow',
    'nodes': [...],
    'connections': [...]
})

# AI Chat
response = api.ai.chat({
    'message': 'Analyze my workflow',
    'context': {'workflow_id': workflow['id']}
})
```

### cURL Examples
```bash
# Create workflow
curl -X POST "/api/workflows" \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "title": "My Workflow",
    "nodes": [],
    "connections": []
  }'

# AI Chat
curl -X POST "/api/ai/chat" \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "message": "Help me optimize this workflow",
    "context": {"workflowId": "workflow_123"}
  }'
```

---

## 🔧 Rate Limits

### Per User Limits
```
Free Tier:
- API Calls: 1,000/day
- AI Requests: 100/day
- File Uploads: 50/day
- Workflows: 10 total

Pro Tier:
- API Calls: 50,000/day
- AI Requests: 1,000/day
- File Uploads: 500/day
- Workflows: 500 total

Enterprise:
- Custom limits
- Dedicated support
- SLA guarantees
```

### Global Limits
- 10,000 requests/minute per IP
- 1MB max request size
- 30 second timeout

---

## 📞 Support & Contact

### API Support
- **Email:** api-support@flowcanvas-ai.com
- **Discord:** [Developer Community](https://discord.gg/flowcanvas-dev)
- **GitHub:** [API Issues](https://github.com/flowcanvas-ai/api/issues)

### Status Page
- **Status:** [status.flowcanvas-ai.com](https://status.flowcanvas-ai.com)
- **Uptime:** 99.9% SLA
- **Monitoring:** Real-time API monitoring

---

*🔌 هذا التوثيق محدث باستمرار مع إضافة ميزات جديدة*