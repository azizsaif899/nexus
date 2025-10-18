# 📚 توثيق API شامل - FlowCanvasAI

## فهرس المحتويات
1. [نظرة عامة](#نظرة-عامة)
2. [المصادقة والأمان](#المصادقة-والأمان)
3. [Chat API](#chat-api)
4. [Workflow API](#workflow-api)
5. [Design System API](#design-system-api)
6. [User Management API](#user-management-api)
7. [AI Services API](#ai-services-api)
8. [File Management API](#file-management-api)
9. [Real-time Events](#real-time-events)
10. [Error Handling](#error-handling)

---

## نظرة عامة

### Base URL
```
Production: https://flowcanvasai.com/api
Development: http://localhost:3000/api
```

### API Version
```
Current Version: v1
Header: X-API-Version: v1
```

### Content Types
```
Request: application/json
Response: application/json
Files: multipart/form-data
```

---

## المصادقة والأمان

### Authentication Headers
```typescript
interface AuthHeaders {
  "Authorization": "Bearer <JWT_TOKEN>",
  "X-API-Key": "<API_KEY>", // For external integrations
  "X-Request-ID": "<UNIQUE_REQUEST_ID>", // For tracking
  "X-User-Agent": "FlowCanvasAI-Client/1.0"
}
```

### JWT Token Structure
```typescript
interface JWTPayload {
  sub: string;              // User ID
  email: string;            // User email
  role: "user" | "admin" | "enterprise";
  plan: "free" | "pro" | "enterprise";
  permissions: string[];    // User permissions
  iat: number;             // Issued at
  exp: number;             // Expires at
  iss: "flowcanvasai";     // Issuer
}
```

### Rate Limiting
```typescript
interface RateLimits {
  "free_tier": {
    "requests_per_minute": 60,
    "ai_calls_per_hour": 50,
    "file_uploads_per_day": 10
  },
  "pro_tier": {
    "requests_per_minute": 300,
    "ai_calls_per_hour": 500,
    "file_uploads_per_day": 100
  },
  "enterprise_tier": {
    "requests_per_minute": 1000,
    "ai_calls_per_hour": 2000,
    "file_uploads_per_day": 1000
  }
}
```

---

## Chat API

### 1. Send Message

#### Endpoint
```
POST /api/ai/chat
```

#### Request
```typescript
interface ChatRequest {
  message: string;
  type: "text" | "voice" | "image";
  conversationId?: string;
  context?: {
    currentPage?: string;
    selectedElements?: string[];
    workflowContext?: object;
  };
  settings?: {
    model: "gemini-2.0-flash" | "gemini-pro";
    temperature: number; // 0-1
    maxTokens: number;
  };
}
```

#### Response
```typescript
interface ChatResponse {
  success: boolean;
  data: {
    messageId: string;
    conversationId: string;
    response: {
      text: string;
      type: "text" | "code" | "workflow" | "design";
      metadata?: {
        confidence: number;
        processingTime: number;
        tokensUsed: number;
      };
    };
    suggestions?: string[];
    actions?: {
      type: "open_workflow" | "create_component" | "navigate";
      payload: object;
    }[];
  };
  timestamp: string;
}
```

#### Error Response
```typescript
interface ChatError {
  success: false;
  error: {
    code: "INVALID_INPUT" | "AI_SERVICE_ERROR" | "RATE_LIMITED" | "UNAUTHORIZED";
    message: string;
    details?: object;
  };
}
```

#### Example
```bash
curl -X POST https://flowcanvasai.com/api/ai/chat \
  -H "Authorization: Bearer YOUR_JWT_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "message": "أنشئ لي مكون زر احترافي",
    "type": "text",
    "context": {
      "currentPage": "design-library"
    }
  }'
```

### 2. Get Conversation History

#### Endpoint
```
GET /api/ai/chat/conversations/{conversationId}
```

#### Query Parameters
```typescript
interface ConversationQuery {
  limit?: number;      // Default: 50, Max: 100
  offset?: number;     // Default: 0
  before?: string;     // ISO timestamp
  after?: string;      // ISO timestamp
}
```

#### Response
```typescript
interface ConversationHistory {
  success: boolean;
  data: {
    conversationId: string;
    messages: {
      id: string;
      type: "user" | "assistant";
      content: string;
      timestamp: string;
      metadata?: object;
    }[];
    pagination: {
      total: number;
      hasMore: boolean;
      nextOffset?: number;
    };
  };
}
```

### 3. Delete Conversation

#### Endpoint
```
DELETE /api/ai/chat/conversations/{conversationId}
```

#### Response
```typescript
interface DeleteResponse {
  success: boolean;
  message: string;
}
```

---

## Workflow API

### 1. Create Workflow

#### Endpoint
```
POST /api/workflow
```

#### Request
```typescript
interface CreateWorkflowRequest {
  name: string;
  description?: string;
  category: "automation" | "data_processing" | "integration";
  isPublic: boolean;
  tags: string[];
  nodes: WorkflowNode[];
  connections: WorkflowConnection[];
  settings: WorkflowSettings;
}

interface WorkflowNode {
  id: string;
  type: "trigger" | "action" | "condition" | "data" | "schedule" | "integration" | "output";
  position: { x: number; y: number };
  config: {
    label: string;
    description?: string;
    properties: Record<string, any>;
  };
}

interface WorkflowConnection {
  id: string;
  sourceId: string;
  targetId: string;
  sourcePort?: string;
  targetPort?: string;
}

interface WorkflowSettings {
  timeout: number;
  retryCount: number;
  errorHandling: "stop" | "continue" | "retry";
  notifications: {
    onSuccess: boolean;
    onError: boolean;
    webhookUrl?: string;
  };
}
```

#### Response
```typescript
interface CreateWorkflowResponse {
  success: boolean;
  data: {
    workflowId: string;
    version: number;
    createdAt: string;
    status: "draft" | "active" | "paused";
  };
}
```

### 2. Get Workflow

#### Endpoint
```
GET /api/workflow/{workflowId}
```

#### Response
```typescript
interface GetWorkflowResponse {
  success: boolean;
  data: {
    id: string;
    name: string;
    description: string;
    category: string;
    isPublic: boolean;
    tags: string[];
    nodes: WorkflowNode[];
    connections: WorkflowConnection[];
    settings: WorkflowSettings;
    metadata: {
      createdAt: string;
      updatedAt: string;
      version: number;
      status: string;
      owner: {
        id: string;
        name: string;
      };
      stats: {
        executions: number;
        successRate: number;
        lastRun?: string;
      };
    };
  };
}
```

### 3. Update Workflow

#### Endpoint
```
PUT /api/workflow/{workflowId}
```

#### Request
```typescript
interface UpdateWorkflowRequest {
  name?: string;
  description?: string;
  nodes?: WorkflowNode[];
  connections?: WorkflowConnection[];
  settings?: Partial<WorkflowSettings>;
  tags?: string[];
}
```

### 4. Execute Workflow

#### Endpoint
```
POST /api/workflow/{workflowId}/execute
```

#### Request
```typescript
interface ExecuteWorkflowRequest {
  input?: Record<string, any>;
  settings?: {
    timeout?: number;
    dryRun?: boolean;
  };
}
```

#### Response
```typescript
interface ExecuteWorkflowResponse {
  success: boolean;
  data: {
    executionId: string;
    status: "running" | "completed" | "failed";
    startTime: string;
    endTime?: string;
    result?: Record<string, any>;
    logs: {
      nodeId: string;
      timestamp: string;
      level: "info" | "warning" | "error";
      message: string;
    }[];
  };
}
```

### 5. List Workflows

#### Endpoint
```
GET /api/workflow
```

#### Query Parameters
```typescript
interface ListWorkflowsQuery {
  category?: string;
  tags?: string[];
  isPublic?: boolean;
  status?: string;
  limit?: number;
  offset?: number;
  search?: string;
  sortBy?: "createdAt" | "updatedAt" | "name" | "executions";
  sortOrder?: "asc" | "desc";
}
```

---

## Design System API

### 1. Create Component

#### Endpoint
```
POST /api/design/components
```

#### Request
```typescript
interface CreateComponentRequest {
  name: string;
  category: "buttons" | "cards" | "forms" | "navigation" | "feedback";
  type: "react" | "vue" | "angular" | "html";
  code: string;
  props?: ComponentProp[];
  variants?: ComponentVariant[];
  documentation?: string;
  preview?: {
    thumbnail: string; // Base64 or URL
    examples: ComponentExample[];
  };
  tags: string[];
  isPublic: boolean;
}

interface ComponentProp {
  name: string;
  type: "string" | "number" | "boolean" | "object" | "array";
  required: boolean;
  defaultValue?: any;
  description: string;
}

interface ComponentVariant {
  name: string;
  props: Record<string, any>;
  description: string;
}

interface ComponentExample {
  name: string;
  code: string;
  props: Record<string, any>;
}
```

### 2. Get Component

#### Endpoint
```
GET /api/design/components/{componentId}
```

#### Response
```typescript
interface GetComponentResponse {
  success: boolean;
  data: {
    id: string;
    name: string;
    category: string;
    type: string;
    code: string;
    props: ComponentProp[];
    variants: ComponentVariant[];
    documentation: string;
    preview: {
      thumbnail: string;
      examples: ComponentExample[];
    };
    tags: string[];
    isPublic: boolean;
    metadata: {
      createdAt: string;
      updatedAt: string;
      version: number;
      downloads: number;
      likes: number;
      owner: {
        id: string;
        name: string;
      };
    };
  };
}
```

### 3. Search Components

#### Endpoint
```
GET /api/design/components/search
```

#### Query Parameters
```typescript
interface SearchComponentsQuery {
  q?: string;           // Search term
  category?: string;
  type?: string;
  tags?: string[];
  isPublic?: boolean;
  limit?: number;
  offset?: number;
  sortBy?: "relevance" | "downloads" | "likes" | "createdAt";
}
```

---

## User Management API

### 1. Get User Profile

#### Endpoint
```
GET /api/user/profile
```

#### Response
```typescript
interface UserProfile {
  success: boolean;
  data: {
    id: string;
    email: string;
    name: string;
    avatar?: string;
    plan: "free" | "pro" | "enterprise";
    role: "user" | "admin" | "enterprise";
    preferences: {
      language: "ar" | "en";
      theme: "light" | "dark" | "auto";
      notifications: {
        email: boolean;
        push: boolean;
        inApp: boolean;
      };
    };
    stats: {
      workflowsCreated: number;
      componentsCreated: number;
      aiInteractions: number;
      storageUsed: number; // in MB
    };
    limits: {
      workflows: number;
      components: number;
      aiCalls: number;
      storage: number; // in MB
    };
    subscription?: {
      status: "active" | "canceled" | "past_due";
      currentPeriodEnd: string;
      cancelAtPeriodEnd: boolean;
    };
  };
}
```

### 2. Update User Profile

#### Endpoint
```
PUT /api/user/profile
```

#### Request
```typescript
interface UpdateProfileRequest {
  name?: string;
  preferences?: {
    language?: "ar" | "en";
    theme?: "light" | "dark" | "auto";
    notifications?: {
      email?: boolean;
      push?: boolean;
      inApp?: boolean;
    };
  };
}
```

### 3. Get Usage Statistics

#### Endpoint
```
GET /api/user/usage
```

#### Query Parameters
```typescript
interface UsageQuery {
  period: "today" | "week" | "month" | "year";
  metric?: "workflows" | "ai_calls" | "storage" | "all";
}
```

---

## AI Services API

### 1. Generate Code

#### Endpoint
```
POST /api/ai/generate/code
```

#### Request
```typescript
interface GenerateCodeRequest {
  prompt: string;
  type: "react_component" | "workflow_node" | "api_endpoint" | "utility_function";
  framework?: "react" | "vue" | "angular" | "vanilla";
  language?: "typescript" | "javascript" | "python";
  style?: "tailwind" | "css_modules" | "styled_components";
  requirements?: string[];
}
```

#### Response
```typescript
interface GenerateCodeResponse {
  success: boolean;
  data: {
    code: string;
    explanation: string;
    suggestions: string[];
    metadata: {
      complexity: "simple" | "medium" | "complex";
      estimatedLines: number;
      dependencies: string[];
    };
  };
}
```

### 2. Analyze Design

#### Endpoint
```
POST /api/ai/analyze/design
```

#### Request
```typescript
interface AnalyzeDesignRequest {
  image: string; // Base64 encoded image
  type: "ui_screenshot" | "wireframe" | "sketch";
  context?: string;
}
```

#### Response
```typescript
interface AnalyzeDesignResponse {
  success: boolean;
  data: {
    components: {
      type: string;
      position: { x: number; y: number; width: number; height: number };
      properties: Record<string, any>;
      confidence: number;
    }[];
    layout: {
      type: "grid" | "flexbox" | "absolute";
      structure: object;
    };
    colors: {
      primary: string;
      secondary: string;
      accent: string;
      background: string;
    };
    suggestions: string[];
  };
}
```

---

## File Management API

### 1. Upload File

#### Endpoint
```
POST /api/files/upload
```

#### Request
```
Content-Type: multipart/form-data

file: <FILE>
type: "image" | "document" | "design" | "code"
folder?: string
```

#### Response
```typescript
interface UploadResponse {
  success: boolean;
  data: {
    fileId: string;
    filename: string;
    url: string;
    size: number;
    type: string;
    metadata: {
      uploadedAt: string;
      folder: string;
      mimeType: string;
    };
  };
}
```

### 2. Get File

#### Endpoint
```
GET /api/files/{fileId}
```

### 3. Delete File

#### Endpoint
```
DELETE /api/files/{fileId}
```

---

## Real-time Events

### WebSocket Connection
```
wss://flowcanvasai.com/api/realtime
```

### Authentication
```typescript
// Send after connection
{
  "type": "auth",
  "token": "JWT_TOKEN"
}
```

### Event Types

#### Chat Events
```typescript
// New message
{
  "type": "chat:message",
  "data": {
    "conversationId": string,
    "message": ChatMessage
  }
}

// Typing indicator
{
  "type": "chat:typing",
  "data": {
    "conversationId": string,
    "isTyping": boolean
  }
}
```

#### Workflow Events
```typescript
// Workflow update
{
  "type": "workflow:update",
  "data": {
    "workflowId": string,
    "changes": object
  }
}

// Execution status
{
  "type": "workflow:execution",
  "data": {
    "workflowId": string,
    "executionId": string,
    "status": "running" | "completed" | "failed"
  }
}
```

#### Collaboration Events
```typescript
// User presence
{
  "type": "presence:update", 
  "data": {
    "userId": string,
    "status": "online" | "offline" | "away",
    "lastSeen": string
  }
}

// Cursor tracking
{
  "type": "collaboration:cursor",
  "data": {
    "userId": string,
    "position": { x: number, y: number },
    "page": string
  }
}
```

---

## Error Handling

### Error Response Format
```typescript
interface APIError {
  success: false;
  error: {
    code: string;
    message: string;
    details?: object;
    requestId: string;
    timestamp: string;
  };
}
```

### Common Error Codes

#### Authentication Errors
```typescript
{
  "UNAUTHORIZED": "Token is missing or invalid",
  "TOKEN_EXPIRED": "JWT token has expired", 
  "INSUFFICIENT_PERMISSIONS": "User lacks required permissions",
  "ACCOUNT_SUSPENDED": "User account is suspended"
}
```

#### Validation Errors
```typescript
{
  "INVALID_INPUT": "Request data is invalid",
  "MISSING_REQUIRED_FIELD": "Required field is missing",
  "INVALID_FORMAT": "Data format is incorrect",
  "CONSTRAINT_VIOLATION": "Data violates constraints"
}
```

#### Rate Limiting Errors
```typescript
{
  "RATE_LIMITED": "Too many requests",
  "QUOTA_EXCEEDED": "Usage quota exceeded",
  "CONCURRENT_LIMIT": "Too many concurrent requests"
}
```

#### Service Errors
```typescript
{
  "AI_SERVICE_ERROR": "AI service unavailable",
  "DATABASE_ERROR": "Database operation failed",
  "EXTERNAL_SERVICE_ERROR": "External service error",
  "INTERNAL_SERVER_ERROR": "Unexpected server error"
}
```

### Error Handling Best Practices

#### Retry Logic
```typescript
interface RetryConfig {
  maxRetries: 3;
  backoffStrategy: "exponential" | "linear";
  retryableErrorCodes: [
    "RATE_LIMITED",
    "DATABASE_ERROR", 
    "EXTERNAL_SERVICE_ERROR"
  ];
}
```

#### Circuit Breaker
```typescript
interface CircuitBreakerConfig {
  failureThreshold: 5;
  recoveryTimeout: 30000; // 30 seconds
  monitoringPeriod: 60000; // 1 minute
}
```

---

## API Testing

### Health Check
```
GET /api/health
```

#### Response
```typescript
interface HealthResponse {
  status: "healthy" | "degraded" | "unhealthy";
  timestamp: string;
  services: {
    "database": "healthy" | "degraded" | "unhealthy";
    "ai_service": "healthy" | "degraded" | "unhealthy";
    "storage": "healthy" | "degraded" | "unhealthy";
    "external_apis": "healthy" | "degraded" | "unhealthy";
  };
  metrics: {
    uptime: number;
    responseTime: number;
    errorRate: number;
  };
}
```

### API Playground
```
GET /api/docs
```
Interactive API documentation and testing interface.

---

## SDK Examples

### JavaScript/TypeScript SDK
```typescript
import { FlowCanvasAI } from '@flowcanvasai/sdk';

const client = new FlowCanvasAI({
  apiKey: 'your-api-key',
  baseURL: 'https://flowcanvasai.com/api'
});

// Send chat message
const response = await client.chat.send({
  message: 'Create a button component',
  type: 'text'
});

// Create workflow
const workflow = await client.workflow.create({
  name: 'My Automation',
  nodes: [...],
  connections: [...]
});
```

### Python SDK
```python
from flowcanvasai import Client

client = Client(api_key='your-api-key')

# Send chat message
response = client.chat.send(
    message='Create a button component',
    type='text'
)

# Create workflow
workflow = client.workflow.create(
    name='My Automation',
    nodes=[...],
    connections=[...]
)
```

---

## Changelog

### v1.0.0 (Current)
- Initial API release
- Chat API with Gemini 2.0 Flash integration
- Workflow API with visual builder support
- Design System API
- Real-time WebSocket events
- Comprehensive error handling

### Future Versions
- v1.1.0: GraphQL API support
- v1.2.0: Advanced AI features
- v1.3.0: Enhanced collaboration
- v2.0.0: API versioning and breaking changes

---

هذا التوثيق يوفر مرجعاً شاملاً لجميع APIs في منصة FlowCanvasAI ويتم تحديثه باستمرار مع إضافة ميزات جديدة.