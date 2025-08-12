# 📚 مرجع واجهة برمجة التطبيقات - AzizSys AI Assistant v2.0

**🎯 النقلة النوعية الكبرى - API Reference المحدث للنظام الهجين**  
**📅 آخر تحديث:** 2025-01-09  
**🔗 Base URL:** `https://api.azizsys.com/v2`  

---

## 🆕 الجديد في v2.0

### 🎨 Sidebar Agents API
- **5 وكلاء ذكيين متخصصين** مع endpoints مخصصة
- **3 أوضاع معالجة** قابلة للتخصيص
- **تبديل ديناميكي** بين الوكلاء والأوضاع

### 🔍 Hybrid Search API
- **October Implementation** - بحث ذكي مع استشهادات
- **Gemini Research Agent** - بحث هجين (Python + TypeScript)
- **Research Core** - بحث أساسي محسن

### 🐍 Python Services Integration
- **LangGraph Research** - بحث متعدد المراحل
- **FastAPI Backend** - خدمات Python عالية الأداء
- **WebSocket Streaming** - تحديثات فورية

---

## 🎨 Sidebar Agents API

### POST /api/v2/sidebar/query
**تنفيذ استعلام عبر الوكلاء الذكيين**

```typescript
// Request
interface SidebarQueryRequest {
  agent: 'cfo' | 'developer' | 'database' | 'operations' | 'general';
  mode: 'smart' | 'iterative' | 'analysis';
  query: string;
  context?: any;
  userId?: string;
}

// Response
interface SidebarQueryResponse {
  success: boolean;
  agent: string;
  mode: string;
  response: string;
  processingTime: number;
  confidence: number;
  timestamp: string;
}
```

### POST /api/v2/research/start
**بدء بحث متقدم باستخدام النظام الهجين**

```typescript
interface ResearchRequest {
  query: string;
  searchSystem: 'october' | 'gemini' | 'research-core' | 'all';
  options?: {
    maxResults?: number;
    includeCitations?: boolean;
    enableStreaming?: boolean;
    language?: 'ar' | 'en';
  };
}

interface ResearchResponse {
  success: boolean;
  searchId: string;
  results: {
    answer: string;
    sources: Source[];
    citations: Citation[];
    confidence: number;
  };
}
```

### GET /api/v2/health/python
**فحص صحة خدمات Python**

```typescript
interface PythonHealthResponse {
  status: 'healthy' | 'unhealthy';
  services: Array<{
    name: 'gemini-research-agent' | 'langgraph-backend';
    port: number;
    status: 'running' | 'stopped' | 'error';
    uptime: number;
  }>;
}
```

---

## 🔐 Authentication

### POST /api/v2/auth/login
```typescript
interface LoginRequest {
  email: string;
  password: string;
}

interface LoginResponse {
  success: boolean;
  tokens: {
    accessToken: string;
    refreshToken: string;
  };
  user: {
    id: string;
    email: string;
    role: string;
    preferences: {
      defaultAgent: string;
      defaultMode: string;
    };
  };
}
```

---

## 📝 Error Handling

```typescript
interface ErrorResponse {
  success: false;
  error: {
    code: string;
    message: string;
    timestamp: string;
  };
}
```

### Common Error Codes
- `AGENT_NOT_FOUND` - الوكيل المطلوب غير موجود
- `PYTHON_SERVICE_DOWN` - خدمة Python غير متاحة
- `SEARCH_TIMEOUT` - انتهت مهلة البحث
- `RATE_LIMIT_EXCEEDED` - تجاوز حد الطلبات

---

## 🚀 Rate Limiting

- **Sidebar Agents:** 1000 requests/hour
- **Research API:** 100 requests/hour
- **Health Checks:** Unlimited

---

## 🔗 WebSocket Connections

### Real-time Features
- **Research Streaming:** `wss://api.azizsys.com/v2/research/stream`
- **Agent Chat:** `wss://api.azizsys.com/v2/sidebar/chat`

```javascript
const ws = new WebSocket('wss://api.azizsys.com/v2/research/stream');
ws.onmessage = (event) => {
  const data = JSON.parse(event.data);
  console.log('Received:', data);
};
```

---

**📧 للدعم التقني:** api-support@azizsys.com