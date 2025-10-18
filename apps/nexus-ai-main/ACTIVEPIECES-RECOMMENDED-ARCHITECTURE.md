# 🏗️ Architecture الموصى بها - التنفيذ الكامل

## 🎯 **الحل المثالي: API Gateway + Cloud Functions**

---

## 📐 **Architecture Overview:**

```
┌──────────────────────────────────────────────────┐
│         nexus-ai-main (React SPA)                │
│         https://nexxs.ai                         │
│  ┌────────────────────────────────────────────┐  │
│  │  Firebase Authentication ✅                │  │
│  │  ├─ Google Sign-In                         │  │
│  │  ├─ Email/Password                         │  │
│  │  └─ Phone Auth                             │  │
│  └────────────────────────────────────────────┘  │
│  ┌────────────────────────────────────────────┐  │
│  │  ActivepiecesService                       │  │
│  │  ├─ listFlows()                            │  │
│  │  ├─ createFlow(data)                       │  │
│  │  ├─ executeFlow(id, input)                 │  │
│  │  └─ getExecutions()                        │  │
│  └────────────────────────────────────────────┘  │
└──────────────────┬───────────────────────────────┘
                   │
                   │ HTTPS + Firebase ID Token
                   │
                   ↓
┌──────────────────────────────────────────────────┐
│    Firebase Cloud Functions (API Gateway) 🚀    │
│                                                  │
│  ┌────────────────────────────────────────────┐ │
│  │  activepiecesProxy                         │ │
│  │  ├─ 1. Verify Firebase token              │ │
│  │  ├─ 2. Rate limiting                       │ │
│  │  ├─ 3. Get/Create Activepieces user       │ │
│  │  ├─ 4. Check subscription quota           │ │
│  │  ├─ 5. Get/Cache API key                  │ │
│  │  ├─ 6. Forward request                    │ │
│  │  ├─ 7. Track usage                        │ │
│  │  └─ 8. Return enhanced response           │ │
│  └────────────────────────────────────────────┘ │
│                                                  │
│  Caching: Firestore + (optional) Redis          │
│  Monitoring: Cloud Logging + Analytics          │
└──────────────────┬───────────────────────────────┘
                   │
                   │ Internal network (secure)
                   │
                   ↓
┌──────────────────────────────────────────────────┐
│         Cloud Run (Production) 🐳                │
│                                                  │
│  ┌────────────────────────────────────────────┐ │
│  │  Activepieces Container                    │ │
│  │  Port: 8080 (internal only)                │ │
│  │  - No public access                        │ │
│  │  - API only mode                           │ │
│  └────────────────────────────────────────────┘ │
│  ┌────────────────────────────────────────────┐ │
│  │  Cloud SQL PostgreSQL                      │ │
│  │  - Private IP                              │ │
│  │  - Automatic backups                       │ │
│  └────────────────────────────────────────────┘ │
│  ┌────────────────────────────────────────────┐ │
│  │  Memorystore Redis (optional)              │ │
│  │  - Session caching                         │ │
│  │  - API key caching                         │ │
│  └────────────────────────────────────────────┘ │
└──────────────────────────────────────────────────┘
```

---

## 💻 **الكود الكامل:**

### **1. Cloud Function - API Gateway**

```typescript
// functions/src/activepieces/proxy.ts

import * as functions from 'firebase-functions';
import * as admin from 'firebase-admin';
import axios from 'axios';
import { RateLimiterMemory } from 'rate-limiter-flexible';

// Configuration
const ACTIVEPIECES_URL = process.env.ACTIVEPIECES_URL || 'http://localhost:8080';
const API_KEY_CACHE_TTL = 3600; // 1 hour

// Rate limiter: 100 requests per minute per user
const rateLimiter = new RateLimiterMemory({
  points: 100,
  duration: 60,
});

// ============================================
// Main Proxy Function
// ============================================
export const activepiecesProxy = functions
  .region('us-central1')
  .runWith({
    timeoutSeconds: 300,
    memory: '512MB',
  })
  .https.onRequest(async (req, res) => {
    // CORS
    res.set('Access-Control-Allow-Origin', 'https://nexxs.ai');
    res.set('Access-Control-Allow-Credentials', 'true');
    res.set('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, PATCH');
    res.set('Access-Control-Allow-Headers', 'Authorization, Content-Type');

    if (req.method === 'OPTIONS') {
      res.status(204).send('');
      return;
    }

    try {
      // 1. Extract and verify Firebase token
      const idToken = extractToken(req);
      if (!idToken) {
        res.status(401).json({ error: 'No authentication token provided' });
        return;
      }

      const decodedToken = await admin.auth().verifyIdToken(idToken);
      const uid = decodedToken.uid;
      const email = decodedToken.email!;

      // 2. Rate limiting
      try {
        await rateLimiter.consume(uid);
      } catch (rateLimiterError) {
        res.status(429).json({
          error: 'Too many requests',
          retryAfter: 60,
        });
        return;
      }

      // 3. Check subscription and quota
      const subscription = await getSubscription(uid);
      if (!subscription.isActive) {
        res.status(403).json({
          error: 'No active subscription',
          upgradeUrl: 'https://nexxs.ai/pricing',
        });
        return;
      }

      const quota = await checkQuota(uid, subscription);
      if (quota.exceeded) {
        res.status(429).json({
          error: 'Monthly quota exceeded',
          quotaLimit: quota.limit,
          quotaUsed: quota.used,
          upgradeUrl: 'https://nexxs.ai/pricing',
        });
        return;
      }

      // 4. Get or create Activepieces user
      const apUser = await getOrCreateActivepiecesUser(uid, email);

      // 5. Get API key (with caching)
      const apiKey = await getActivepiecesApiKey(uid, apUser.activepiecesId);

      // 6. Forward request to Activepieces
      const apResponse = await axios({
        method: req.method as any,
        url: `${ACTIVEPIECES_URL}${req.path}`,
        data: req.body,
        params: req.query,
        headers: {
          'Authorization': `Bearer ${apiKey}`,
          'Content-Type': 'application/json',
        },
        validateStatus: () => true, // Don't throw on any status
        timeout: 60000, // 60 seconds
      });

      // 7. Track usage
      await trackUsage(uid, {
        endpoint: req.path,
        method: req.method,
        timestamp: admin.firestore.FieldValue.serverTimestamp(),
        statusCode: apResponse.status,
      });

      // 8. Enhance response with metadata
      const enhancedResponse = {
        ...apResponse.data,
        _metadata: {
          userId: uid,
          timestamp: new Date().toISOString(),
          quotaRemaining: quota.limit - quota.used - 1,
          quotaLimit: quota.limit,
          subscriptionTier: subscription.tier,
        },
      };

      // 9. Return response
      res.status(apResponse.status).json(enhancedResponse);

      // 10. Log for analytics (async, don't wait)
      logAnalytics(uid, req.path, req.method, apResponse.status).catch(console.error);

    } catch (error: any) {
      console.error('Proxy error:', error);

      // Detailed error handling
      if (error.code === 'auth/id-token-expired') {
        res.status(401).json({ error: 'Token expired', action: 'refresh' });
      } else if (error.code === 'auth/argument-error') {
        res.status(401).json({ error: 'Invalid token' });
      } else if (error.code === 'ECONNREFUSED') {
        res.status(503).json({ error: 'Service temporarily unavailable' });
      } else {
        res.status(500).json({
          error: 'Internal server error',
          requestId: req.headers['x-request-id'] || 'unknown',
        });
      }
    }
  });

// ============================================
// Helper Functions
// ============================================

function extractToken(req: functions.https.Request): string | null {
  const authHeader = req.headers.authorization;
  if (!authHeader) return null;
  
  const parts = authHeader.split(' ');
  if (parts.length !== 2 || parts[0] !== 'Bearer') return null;
  
  return parts[1];
}

async function getSubscription(uid: string) {
  const doc = await admin.firestore()
    .collection('subscriptions')
    .doc(uid)
    .get();

  if (!doc.exists) {
    // Default free tier
    return {
      isActive: true,
      tier: 'free',
      quotas: {
        flowExecutions: 100,
        flows: 5,
      },
    };
  }

  return doc.data();
}

async function checkQuota(uid: string, subscription: any) {
  const now = new Date();
  const monthStart = new Date(now.getFullYear(), now.getMonth(), 1);

  const usageDoc = await admin.firestore()
    .collection('usage')
    .doc(uid)
    .collection('monthly')
    .doc(monthStart.toISOString().substring(0, 7)) // YYYY-MM
    .get();

  const used = usageDoc.exists ? usageDoc.data()!.flowExecutions || 0 : 0;
  const limit = subscription.quotas.flowExecutions;

  return {
    used,
    limit,
    exceeded: used >= limit,
  };
}

async function getOrCreateActivepiecesUser(uid: string, email: string) {
  const userDoc = await admin.firestore()
    .collection('activepieces_users')
    .doc(uid)
    .get();

  if (userDoc.exists) {
    return userDoc.data();
  }

  // Create new user in Activepieces
  const apUser = await createActivepiecesUser(email, uid);

  // Save to Firestore
  const userData = {
    activepiecesId: apUser.id,
    email,
    createdAt: admin.firestore.FieldValue.serverTimestamp(),
  };

  await admin.firestore()
    .collection('activepieces_users')
    .doc(uid)
    .set(userData);

  return userData;
}

async function createActivepiecesUser(email: string, firebaseUid: string) {
  const response = await axios.post(
    `${ACTIVEPIECES_URL}/api/v1/users`,
    {
      email,
      password: generateSecurePassword(32),
      firstName: 'User',
      lastName: firebaseUid.substring(0, 8),
    },
    {
      headers: {
        'Authorization': `Bearer ${process.env.ACTIVEPIECES_ADMIN_KEY}`,
      },
    }
  );

  return response.data;
}

async function getActivepiecesApiKey(uid: string, activepiecesUserId: string): Promise<string> {
  // Try cache first
  const cacheDoc = await admin.firestore()
    .collection('api_key_cache')
    .doc(uid)
    .get();

  if (cacheDoc.exists) {
    const cache = cacheDoc.data()!;
    const expiresAt = cache.expiresAt.toDate();
    
    if (expiresAt > new Date()) {
      return cache.apiKey;
    }
  }

  // Generate new API key
  const response = await axios.post(
    `${ACTIVEPIECES_URL}/api/v1/api-keys`,
    {
      displayName: `nexus-${uid}`,
    },
    {
      headers: {
        'Authorization': `Bearer ${process.env.ACTIVEPIECES_ADMIN_KEY}`,
      },
    }
  );

  const apiKey = response.data.value;

  // Cache it
  await admin.firestore()
    .collection('api_key_cache')
    .doc(uid)
    .set({
      apiKey,
      expiresAt: new Date(Date.now() + API_KEY_CACHE_TTL * 1000),
      updatedAt: admin.firestore.FieldValue.serverTimestamp(),
    });

  return apiKey;
}

async function trackUsage(uid: string, data: any) {
  const now = new Date();
  const monthKey = now.toISOString().substring(0, 7); // YYYY-MM

  const usageRef = admin.firestore()
    .collection('usage')
    .doc(uid)
    .collection('monthly')
    .doc(monthKey);

  await usageRef.set(
    {
      flowExecutions: admin.firestore.FieldValue.increment(1),
      lastUsed: admin.firestore.FieldValue.serverTimestamp(),
    },
    { merge: true }
  );

  // Log detailed usage
  await admin.firestore()
    .collection('usage_logs')
    .add({
      uid,
      ...data,
    });
}

async function logAnalytics(uid: string, path: string, method: string, statusCode: number) {
  // Log to Google Analytics or custom analytics
  console.log('Analytics:', { uid, path, method, statusCode });
}

function generateSecurePassword(length: number): string {
  const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789!@#$%^&*';
  let password = '';
  for (let i = 0; i < length; i++) {
    password += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return password;
}
```

### **2. React Service**

```typescript
// apps/nexus-ai-main/src/services/activepieces.service.ts

import { auth } from '../lib/firebase';

const API_BASE_URL = process.env.NODE_ENV === 'production'
  ? 'https://us-central1-gen-lang-client-0147492600.cloudfunctions.net/activepiecesProxy'
  : '/api/activepieces'; // Local proxy

class ActivepiecesService {
  private async getAuthToken(): Promise<string> {
    const user = auth.currentUser;
    if (!user) {
      throw new Error('User not authenticated');
    }
    return await user.getIdToken();
  }

  private async request<T>(
    endpoint: string,
    options: RequestInit = {}
  ): Promise<T> {
    const token = await this.getAuthToken();

    const response = await fetch(`${API_BASE_URL}${endpoint}`, {
      ...options,
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json',
        ...options.headers,
      },
    });

    if (!response.ok) {
      const error = await response.json();
      throw new ActivepiecesError(error, response.status);
    }

    return response.json();
  }

  // Flows Management
  async listFlows() {
    return this.request('/api/v1/flows');
  }

  async createFlow(flowData: any) {
    return this.request('/api/v1/flows', {
      method: 'POST',
      body: JSON.stringify(flowData),
    });
  }

  async updateFlow(flowId: string, flowData: any) {
    return this.request(`/api/v1/flows/${flowId}`, {
      method: 'PUT',
      body: JSON.stringify(flowData),
    });
  }

  async deleteFlow(flowId: string) {
    return this.request(`/api/v1/flows/${flowId}`, {
      method: 'DELETE',
    });
  }

  // Execution
  async executeFlow(flowId: string, input: any) {
    return this.request(`/api/v1/flows/${flowId}/execute`, {
      method: 'POST',
      body: JSON.stringify({ input }),
    });
  }

  async getExecutions(flowId?: string) {
    const endpoint = flowId
      ? `/api/v1/flows/${flowId}/executions`
      : '/api/v1/executions';
    return this.request(endpoint);
  }
}

class ActivepiecesError extends Error {
  constructor(
    public data: any,
    public statusCode: number
  ) {
    super(data.error || 'Activepieces request failed');
    this.name = 'ActivepiecesError';
  }

  isQuotaExceeded() {
    return this.statusCode === 429 && this.data.quotaLimit;
  }

  isUnauthorized() {
    return this.statusCode === 401;
  }
}

export const activepiecesService = new ActivepiecesService();
export { ActivepiecesError };
```

---

## ✅ **المميزات:**

```
✅ أمان كامل: Firebase tokens only
✅ Quota management: تلقائي
✅ Rate limiting: 100 req/min per user
✅ Caching: API keys cached
✅ Error handling: شامل
✅ Analytics: مدمج
✅ Scalable: Cloud Functions auto-scale
✅ Cost-effective: $0.40 per 1M requests
```

---

## 🎯 **الخلاصة:**

هذا الـ Architecture هو **الأفضل** لأنه:

1. ✅ Production-ready
2. ✅ Secure by design
3. ✅ Scalable automatically
4. ✅ Easy to maintain
5. ✅ Cost-effective
6. ✅ Feature-rich

**هذا بالضبط Option 3 الذي ننصح به!** 🏆
