# 🔧 دليل المطور للخلفية - Backend Developer Guide

## 📋 فهرس المحتويات

### 🏗️ البنية والهيكل
- [نظرة عامة على البنية](#architecture-overview)
- [هيكل قاعدة البيانات](#database-structure)
- [API Routes](#api-routes)
- [المتغيرات والتكوين](#environment-configuration)

### 🔥 Firebase Backend
- [إعداد Firebase](#firebase-setup)
- [Firestore Database](#firestore-database)
- [Authentication](#authentication)
- [Cloud Functions](#cloud-functions)
- [Storage](#firebase-storage)

### 🤖 الذكاء الاصطناعي
- [Gemini AI Integration](#gemini-ai)
- [Chat API](#chat-api)
- [Voice Processing](#voice-processing)
- [Analytics & Insights](#ai-analytics)

### 🔐 الأمان والمصادقة
- [نظام المصادقة](#authentication-system)
- [حماية API](#api-security)
- [Rate Limiting](#rate-limiting)
- [CORS Configuration](#cors-setup)

### 📊 APIs والخدمات
- [REST API Documentation](#rest-api)
- [GraphQL (اختياري)](#graphql)
- [WebSocket للتحديثات الفورية](#websocket)
- [Third-party Integrations](#integrations)

### 🚀 النشر والإنتاج
- [إعداد الإنتاج](#production-setup)
- [مراقبة الأداء](#performance-monitoring)
- [Logging والتتبع](#logging)
- [Backup والاستعادة](#backup-restore)

---

## 🏗️ نظرة عامة على البنية {#architecture-overview}

### المكونات الأساسية
```
┌─────────────────────────────────────────────┐
│                Frontend                     │
│            (Next.js 15)                     │
└─────────────────┬───────────────────────────┘
                  │
┌─────────────────▼───────────────────────────┐
│              API Layer                      │
│         (Next.js API Routes)                │
└─────────────────┬───────────────────────────┘
                  │
┌─────────────────▼───────────────────────────┐
│            Business Logic                   │
│        (Services & Controllers)             │
└─────────────────┬───────────────────────────┘
                  │
┌─────────────────▼───────────────────────────┐
│              Data Layer                     │
│     (Firebase Firestore + Storage)         │
└─────────────────────────────────────────────┘
```

### تقنيات الخلفية
- **Platform:** Firebase (Google Cloud)
- **Database:** Firestore NoSQL
- **Authentication:** Firebase Auth
- **Storage:** Firebase Storage
- **Functions:** Cloud Functions (Node.js)
- **AI:** Gemini 2.0 Flash API
- **Hosting:** Vercel + Firebase

---

## 🔥 إعداد Firebase {#firebase-setup}

### 1. إنشاء مشروع Firebase
```bash
# تثبيت Firebase CLI
npm install -g firebase-tools

# تسجيل الدخول
firebase login

# إنشاء مشروع جديد
firebase projects:create flowcanvas-ai

# ربط المشروع المحلي
firebase use flowcanvas-ai
```

### 2. تكوين Firestore
```javascript
// firestore.rules
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    // Users can read/write their own data
    match /users/{userId} {
      allow read, write: if request.auth != null && request.auth.uid == userId;
    }
    
    // Workflows - private to user
    match /workflows/{workflowId} {
      allow read, write: if request.auth != null && 
        resource.data.ownerId == request.auth.uid;
    }
    
    // Public read for certain collections
    match /templates/{templateId} {
      allow read: if true;
      allow write: if request.auth != null;
    }
  }
}
```

### 3. Cloud Functions Setup
```typescript
// functions/src/index.ts
import { onRequest } from 'firebase-functions/v2/https';
import { onDocumentCreated } from 'firebase-functions/v2/firestore';
import { initializeApp } from 'firebase-admin/app';

initializeApp();

// AI Chat Function
export const aiChat = onRequest({
  cors: true,
  region: 'us-central1',
}, async (req, res) => {
  try {
    const { message, userId } = req.body;
    
    // Process AI request
    const response = await processAIRequest(message, userId);
    
    res.json({ success: true, response });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Workflow Auto-save
export const autoSaveWorkflow = onDocumentCreated(
  'workflows/{workflowId}',
  async (event) => {
    const workflowData = event.data?.data();
    
    // Auto-backup workflow
    await createBackup(workflowData);
    
    // Send analytics
    await trackWorkflowCreation(workflowData);
  }
);
```

---

## 🗄️ هيكل قاعدة البيانات {#database-structure}

### Firestore Collections

#### Users Collection
```typescript
interface User {
  id: string;
  email: string;
  displayName: string;
  photoURL?: string;
  preferences: {
    language: 'ar' | 'en';
    theme: 'light' | 'dark';
    notifications: boolean;
  };
  subscription: {
    plan: 'free' | 'pro' | 'enterprise';
    expiresAt?: Date;
    features: string[];
  };
  createdAt: Date;
  updatedAt: Date;
  lastActive: Date;
}
```

#### Workflows Collection
```typescript
interface Workflow {
  id: string;
  ownerId: string;
  title: string;
  description: string;
  nodes: Node[];
  connections: Connection[];
  settings: {
    autoSave: boolean;
    public: boolean;
    tags: string[];
  };
  stats: {
    views: number;
    clones: number;
    executions: number;
  };
  version: number;
  createdAt: Date;
  updatedAt: Date;
}
```

#### AI Conversations
```typescript
interface Conversation {
  id: string;
  userId: string;
  title: string;
  messages: Message[];
  context: {
    workflowId?: string;
    canvasState?: object;
    userIntent: string;
  };
  metadata: {
    model: string;
    tokens: number;
    cost: number;
  };
  createdAt: Date;
  updatedAt: Date;
}
```

---

## 🛡️ نظام المصادقة {#authentication-system}

### Firebase Authentication Setup
```typescript
// lib/auth.ts
import { 
  getAuth, 
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  signInWithPopup,
  GoogleAuthProvider,
  onAuthStateChanged
} from 'firebase/auth';

export class AuthService {
  private auth = getAuth();
  
  // Email/Password Sign In
  async signIn(email: string, password: string) {
    try {
      const result = await signInWithEmailAndPassword(this.auth, email, password);
      await this.updateUserActivity(result.user.uid);
      return result.user;
    } catch (error) {
      throw this.handleAuthError(error);
    }
  }
  
  // Google Sign In
  async signInWithGoogle() {
    const provider = new GoogleAuthProvider();
    provider.addScope('profile');
    provider.addScope('email');
    
    const result = await signInWithPopup(this.auth, provider);
    await this.createUserProfile(result.user);
    return result.user;
  }
  
  // Create User Profile in Firestore
  private async createUserProfile(user: User) {
    const userDoc: User = {
      id: user.uid,
      email: user.email!,
      displayName: user.displayName || '',
      photoURL: user.photoURL,
      preferences: {
        language: 'ar',
        theme: 'dark',
        notifications: true
      },
      subscription: {
        plan: 'free',
        features: ['basic_workflows', 'ai_chat']
      },
      createdAt: new Date(),
      updatedAt: new Date(),
      lastActive: new Date()
    };
    
    await setDoc(doc(db, 'users', user.uid), userDoc);
  }
}
```

### Middleware للحماية
```typescript
// middleware.ts
import { NextRequest, NextResponse } from 'next/server';
import { verifyAuth } from './lib/auth-middleware';

export async function middleware(request: NextRequest) {
  // Protected routes
  const protectedPaths = ['/api/workflows', '/api/ai', '/api/user'];
  
  if (protectedPaths.some(path => request.nextUrl.pathname.startsWith(path))) {
    const token = request.headers.get('authorization')?.replace('Bearer ', '');
    
    if (!token) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }
    
    try {
      const decodedToken = await verifyAuth(token);
      
      // Add user info to headers
      const requestHeaders = new Headers(request.headers);
      requestHeaders.set('x-user-id', decodedToken.uid);
      requestHeaders.set('x-user-email', decodedToken.email);
      
      return NextResponse.next({
        request: {
          headers: requestHeaders,
        },
      });
    } catch (error) {
      return NextResponse.json({ error: 'Invalid token' }, { status: 401 });
    }
  }
  
  return NextResponse.next();
}
```

---

## 🤖 تكامل الذكاء الاصطناعي {#gemini-ai}

### Gemini API Configuration
```typescript
// lib/gemini-ai.ts
import { GoogleGenerativeAI } from '@google/generative-ai';

export class GeminiService {
  private genAI: GoogleGenerativeAI;
  private model: any;
  
  constructor() {
    this.genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY!);
    this.model = this.genAI.getGenerativeModel({ 
      model: 'gemini-2.0-flash-exp',
      generationConfig: {
        temperature: 0.7,
        topK: 40,
        topP: 0.95,
        maxOutputTokens: 4096,
      }
    });
  }
  
  // Chat Completion
  async chatCompletion(
    message: string, 
    context: ChatContext,
    userId: string
  ): Promise<AIResponse> {
    try {
      // Build conversation history
      const history = await this.buildChatHistory(userId, context);
      
      // Create chat session
      const chat = this.model.startChat({
        history: history,
        generationConfig: {
          temperature: context.creative ? 0.9 : 0.7,
        }
      });
      
      // Send message
      const result = await chat.sendMessage(message);
      const response = result.response.text();
      
      // Save conversation
      await this.saveConversation(userId, message, response, context);
      
      // Track usage
      await this.trackAPIUsage(userId, result.response.usageMetadata);
      
      return {
        response,
        conversationId: context.conversationId,
        usage: result.response.usageMetadata,
        timestamp: new Date()
      };
      
    } catch (error) {
      console.error('Gemini API Error:', error);
      throw new Error('AI service temporarily unavailable');
    }
  }
  
  // Workflow Analysis
  async analyzeWorkflow(workflow: Workflow): Promise<WorkflowAnalysis> {
    const prompt = `
      Analyze this workflow and provide insights:
      ${JSON.stringify(workflow)}
      
      Provide analysis in JSON format with:
      - performance: efficiency score and bottlenecks
      - suggestions: improvement recommendations
      - complexity: workflow complexity assessment
      - security: security considerations
    `;
    
    const result = await this.model.generateContent(prompt);
    return JSON.parse(result.response.text());
  }
  
  // Code Generation
  async generateCode(
    workflow: Workflow, 
    targetLanguage: string
  ): Promise<CodeGenerationResult> {
    const prompt = `
      Generate ${targetLanguage} code for this workflow:
      ${JSON.stringify(workflow)}
      
      Requirements:
      - Clean, production-ready code
      - Proper error handling
      - Documentation and comments
      - Best practices for ${targetLanguage}
    `;
    
    const result = await this.model.generateContent(prompt);
    
    return {
      code: result.response.text(),
      language: targetLanguage,
      explanation: await this.explainCode(result.response.text()),
      dependencies: this.extractDependencies(result.response.text())
    };
  }
}
```

### Chat API Endpoint
```typescript
// app/api/ai/chat/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { GeminiService } from '@/lib/gemini-ai';
import { verifyAuthToken } from '@/lib/auth';
import { rateLimiter } from '@/lib/rate-limiter';

export async function POST(request: NextRequest) {
  try {
    // Verify authentication
    const userId = await verifyAuthToken(request);
    
    // Rate limiting
    const rateLimitResult = await rateLimiter.check(userId, 'ai-chat');
    if (!rateLimitResult.success) {
      return NextResponse.json(
        { error: 'Rate limit exceeded' },
        { status: 429 }
      );
    }
    
    const { message, context, options } = await request.json();
    
    // Validate input
    if (!message || message.length > 4000) {
      return NextResponse.json(
        { error: 'Invalid message length' },
        { status: 400 }
      );
    }
    
    // Process AI request
    const geminiService = new GeminiService();
    const response = await geminiService.chatCompletion(
      message,
      context,
      userId
    );
    
    return NextResponse.json({
      success: true,
      data: response
    });
    
  } catch (error) {
    console.error('AI Chat API Error:', error);
    
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

// GET - Conversation History
export async function GET(request: NextRequest) {
  try {
    const userId = await verifyAuthToken(request);
    const { searchParams } = new URL(request.url);
    const conversationId = searchParams.get('conversationId');
    
    const conversations = await getConversationHistory(userId, conversationId);
    
    return NextResponse.json({
      success: true,
      data: conversations
    });
    
  } catch (error) {
    return NextResponse.json(
      { error: 'Failed to fetch conversations' },
      { status: 500 }
    );
  }
}
```

---

## 📊 APIs والخدمات {#rest-api}

### Workflows API
```typescript
// app/api/workflows/route.ts
export async function POST(request: NextRequest) {
  const userId = await verifyAuthToken(request);
  const workflowData = await request.json();
  
  // Validate workflow data
  const validation = validateWorkflow(workflowData);
  if (!validation.valid) {
    return NextResponse.json(
      { error: validation.errors },
      { status: 400 }
    );
  }
  
  // Create workflow
  const workflow: Workflow = {
    id: generateId(),
    ownerId: userId,
    ...workflowData,
    createdAt: new Date(),
    updatedAt: new Date(),
    version: 1,
    stats: { views: 0, clones: 0, executions: 0 }
  };
  
  await createWorkflow(workflow);
  
  return NextResponse.json({
    success: true,
    data: workflow
  });
}

export async function GET(request: NextRequest) {
  const userId = await verifyAuthToken(request);
  const { searchParams } = new URL(request.url);
  
  const page = parseInt(searchParams.get('page') || '1');
  const limit = parseInt(searchParams.get('limit') || '10');
  const search = searchParams.get('search');
  const tags = searchParams.get('tags')?.split(',');
  
  const workflows = await getWorkflows({
    userId,
    page,
    limit,
    search,
    tags
  });
  
  return NextResponse.json({
    success: true,
    data: workflows
  });
}
```

### Analytics API
```typescript
// app/api/analytics/route.ts
export async function GET(request: NextRequest) {
  const userId = await verifyAuthToken(request);
  const { searchParams } = new URL(request.url);
  
  const timeRange = searchParams.get('range') || '7d';
  const workflowId = searchParams.get('workflowId');
  
  const analytics = await getAnalytics({
    userId,
    timeRange,
    workflowId
  });
  
  return NextResponse.json({
    success: true,
    data: {
      overview: analytics.overview,
      workflows: analytics.workflows,
      ai: analytics.aiUsage,
      performance: analytics.performance
    }
  });
}
```

---

## 🔐 الأمان والحماية {#api-security}

### Rate Limiting
```typescript
// lib/rate-limiter.ts
import { Redis } from '@upstash/redis';

export class RateLimiter {
  private redis = new Redis({
    url: process.env.UPSTASH_REDIS_REST_URL!,
    token: process.env.UPSTASH_REDIS_REST_TOKEN!,
  });
  
  async check(
    identifier: string, 
    operation: string, 
    limit = 100, 
    window = 3600
  ) {
    const key = `rate_limit:${operation}:${identifier}`;
    
    const current = await this.redis.incr(key);
    
    if (current === 1) {
      await this.redis.expire(key, window);
    }
    
    const ttl = await this.redis.ttl(key);
    
    return {
      success: current <= limit,
      limit,
      remaining: Math.max(0, limit - current),
      reset: new Date(Date.now() + ttl * 1000)
    };
  }
}
```

### Input Validation
```typescript
// lib/validation.ts
import Joi from 'joi';

export const workflowSchema = Joi.object({
  title: Joi.string().min(1).max(100).required(),
  description: Joi.string().max(500),
  nodes: Joi.array().items(Joi.object({
    id: Joi.string().required(),
    type: Joi.string().required(),
    position: Joi.object({
      x: Joi.number().required(),
      y: Joi.number().required()
    }).required(),
    data: Joi.object().required()
  })).required(),
  connections: Joi.array().items(Joi.object({
    id: Joi.string().required(),
    source: Joi.string().required(),
    target: Joi.string().required(),
    sourceHandle: Joi.string(),
    targetHandle: Joi.string()
  })),
  settings: Joi.object({
    autoSave: Joi.boolean(),
    public: Joi.boolean(),
    tags: Joi.array().items(Joi.string())
  })
});

export function validateWorkflow(data: any) {
  const { error, value } = workflowSchema.validate(data);
  
  return {
    valid: !error,
    errors: error?.details.map(d => d.message),
    data: value
  };
}
```

---

## 📊 مراقبة الأداء {#performance-monitoring}

### Performance Tracking
```typescript
// lib/performance.ts
export class PerformanceTracker {
  static async trackAPICall(
    endpoint: string,
    userId: string,
    duration: number,
    success: boolean
  ) {
    const metric = {
      timestamp: new Date(),
      endpoint,
      userId,
      duration,
      success,
      region: process.env.VERCEL_REGION || 'unknown'
    };
    
    // Send to analytics
    await this.sendToAnalytics(metric);
    
    // Alert if slow
    if (duration > 5000) {
      await this.sendSlowAPIAlert(metric);
    }
  }
  
  static async trackAIUsage(
    userId: string,
    model: string,
    tokens: number,
    cost: number
  ) {
    const usage = {
      timestamp: new Date(),
      userId,
      model,
      tokens,
      cost
    };
    
    await saveDoc('ai_usage', usage);
    await this.updateUserQuota(userId, tokens, cost);
  }
}
```

### Health Check
```typescript
// app/api/health/route.ts
export async function GET() {
  const checks = {
    timestamp: new Date().toISOString(),
    status: 'healthy',
    services: {
      database: await checkFirestore(),
      auth: await checkAuth(),
      ai: await checkGemini(),
      storage: await checkStorage()
    },
    performance: await getPerformanceMetrics()
  };
  
  const allHealthy = Object.values(checks.services).every(
    service => service.status === 'healthy'
  );
  
  return NextResponse.json(checks, {
    status: allHealthy ? 200 : 503
  });
}
```

---

## 🚀 نشر الإنتاج {#production-setup}

### Environment Variables
```bash
# Production Environment (.env.production)

# Firebase
NEXT_PUBLIC_FIREBASE_API_KEY=production_key
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=flowcanvas-ai.firebaseapp.com
NEXT_PUBLIC_FIREBASE_PROJECT_ID=flowcanvas-ai
FIREBASE_ADMIN_PRIVATE_KEY=private_key

# AI Services
GEMINI_API_KEY=production_gemini_key
OPENAI_API_KEY=backup_openai_key

# Security
JWT_SECRET=super_secure_jwt_secret
ENCRYPTION_KEY=encryption_key_for_sensitive_data

# Third-party Services
UPSTASH_REDIS_REST_URL=redis_url
UPSTASH_REDIS_REST_TOKEN=redis_token
SENDGRID_API_KEY=email_service_key

# Monitoring
SENTRY_DSN=sentry_error_tracking
ANALYTICS_API_KEY=analytics_key
```

### CI/CD Pipeline
```yaml
# .github/workflows/deploy.yml
name: Deploy to Production

on:
  push:
    branches: [main]

jobs:
  deploy:
    runs-on: ubuntu-latest
    
    steps:
      - uses: actions/checkout@v3
      
      - name: Setup Node.js
        uses: actions/setup-node@v3
        with:
          node-version: '18'
          cache: 'npm'
      
      - name: Install dependencies
        run: npm ci
        
      - name: Run tests
        run: npm run test
        
      - name: Build application
        run: npm run build
        env:
          NEXT_PUBLIC_FIREBASE_API_KEY: ${{ secrets.FIREBASE_API_KEY }}
          # ... other env vars
          
      - name: Deploy to Vercel
        uses: amondnet/vercel-action@v20
        with:
          vercel-token: ${{ secrets.VERCEL_TOKEN }}
          vercel-org-id: ${{ secrets.ORG_ID }}
          vercel-project-id: ${{ secrets.PROJECT_ID }}
          vercel-args: '--prod'
```

---

## 📞 الدعم والتواصل

### للمطورين
- **📧 البريد التقني:** dev@flowcanvas-ai.com
- **💬 Discord للمطورين:** [رابط المجتمع]
- **📚 الوثائق التقنية:** [رابط التوثيق]

### الموارد المفيدة
- [Firebase Documentation](https://firebase.google.com/docs)
- [Next.js API Routes](https://nextjs.org/docs/api-routes/introduction)
- [Gemini AI API](https://ai.google.dev/docs)
- [TypeScript Handbook](https://www.typescriptlang.org/docs)

---

*✅ هذا الدليل يوفر كل ما يحتاجه مطور الخلفية للعمل مع FlowCanvasAI*