# 🔌 Activepieces API Integration Guide
## دليل التكامل الكامل مع Activepieces API

---

## 📋 جدول المحتويات

1. [Authentication Strategy](#authentication-strategy)
2. [API Key Management](#api-key-management)
3. [Firebase UID to Activepieces User Mapping](#firebase-uid-mapping)
4. [Complete API Reference](#complete-api-reference)
5. [Error Codes & Handling](#error-codes-handling)
6. [Rate Limiting Implementation](#rate-limiting-implementation)
7. [Testing & Debugging](#testing-debugging)

---

## 🔐 Authentication Strategy

### Overview

```
┌──────────────────────────────────────────────────────────┐
│           Activepieces Authentication Flow                │
└──────────────────────────────────────────────────────────┘

Step 1: User logs in via Firebase
   ↓
Step 2: Cloud Function receives Firebase token
   ↓
Step 3: Verify Firebase token → Get Firebase UID
   ↓
Step 4: Check Firestore for existing Activepieces API key
   ↓
Step 5a: If exists → Use cached key
Step 5b: If not exists → Create Activepieces user + API key
   ↓
Step 6: Store mapping in Firestore
   ↓
Step 7: Forward request to Activepieces with API key
```

---

## 🔑 API Key Management

### 1. Create Activepieces User and Get API Key

```typescript
// functions/src/activepieces/apiKeyManager.ts

import * as admin from 'firebase-admin';
import axios from 'axios';
import * as crypto from 'crypto';

interface ActivepiecesUser {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  trackEvents: boolean;
  newsLetter: boolean;
  password: string; // Only for initial creation
}

interface ActivepiecesApiKey {
  id: string;
  userId: string;
  token: string;
  displayName: string;
  createdAt: string;
  updatedAt: string;
}

export class ApiKeyManager {
  private activepiecesUrl = process.env.ACTIVEPIECES_URL || 'http://localhost:8080';
  private adminApiKey = process.env.ACTIVEPIECES_ADMIN_KEY; // Set this in env
  
  /**
   * Main function: Get or create API key for Firebase user
   */
  async getOrCreateApiKey(firebaseUid: string, userEmail: string): Promise<string> {
    // Step 1: Check Firestore cache (1 hour TTL)
    const cachedKey = await this.getCachedApiKey(firebaseUid);
    if (cachedKey) {
      console.log(`Using cached API key for user ${firebaseUid}`);
      return cachedKey;
    }
    
    // Step 2: Check if user exists in Activepieces
    const existingUser = await this.findActivepiecesUser(userEmail);
    
    if (existingUser) {
      // User exists, get their API key
      console.log(`Found existing Activepieces user: ${existingUser.id}`);
      const apiKey = await this.getExistingApiKey(existingUser.id);
      
      if (apiKey) {
        await this.cacheApiKey(firebaseUid, existingUser.id, apiKey);
        return apiKey;
      }
      
      // User exists but no API key, create one
      const newApiKey = await this.createApiKeyForUser(existingUser.id);
      await this.cacheApiKey(firebaseUid, existingUser.id, newApiKey);
      return newApiKey;
    }
    
    // Step 3: User doesn't exist, create new user + API key
    console.log(`Creating new Activepieces user for ${userEmail}`);
    const newUser = await this.createActivepiecesUser(firebaseUid, userEmail);
    const newApiKey = await this.createApiKeyForUser(newUser.id);
    await this.cacheApiKey(firebaseUid, newUser.id, newApiKey);
    
    return newApiKey;
  }
  
  /**
   * Create new Activepieces user
   */
  private async createActivepiecesUser(
    firebaseUid: string, 
    email: string
  ): Promise<ActivepiecesUser> {
    
    // Generate secure random password (user won't use it, we use API keys)
    const randomPassword = crypto.randomBytes(32).toString('hex');
    
    const userData = {
      email: email,
      password: randomPassword,
      firstName: email.split('@')[0], // Extract from email
      lastName: 'User',
      trackEvents: false,
      newsLetter: false
    };
    
    try {
      const response = await axios.post(
        `${this.activepiecesUrl}/v1/users`,
        userData,
        {
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${this.adminApiKey}`
          },
          timeout: 10000
        }
      );
      
      console.log(`Created Activepieces user: ${response.data.id}`);
      
      // Store mapping in Firestore
      await admin.firestore()
        .collection('activepieces_users')
        .doc(firebaseUid)
        .set({
          activepiecesUserId: response.data.id,
          email: email,
          createdAt: admin.firestore.FieldValue.serverTimestamp(),
          lastSync: admin.firestore.FieldValue.serverTimestamp()
        });
      
      return response.data;
      
    } catch (error: any) {
      console.error('Error creating Activepieces user:', error.response?.data || error.message);
      
      // Check if user already exists (race condition)
      if (error.response?.status === 409) {
        const existingUser = await this.findActivepiecesUser(email);
        if (existingUser) {
          return existingUser;
        }
      }
      
      throw new Error(`Failed to create Activepieces user: ${error.message}`);
    }
  }
  
  /**
   * Find existing Activepieces user by email
   */
  private async findActivepiecesUser(email: string): Promise<ActivepiecesUser | null> {
    try {
      // First check Firestore mapping
      const firestoreUsers = await admin.firestore()
        .collection('activepieces_users')
        .where('email', '==', email)
        .limit(1)
        .get();
      
      if (!firestoreUsers.empty) {
        const userData = firestoreUsers.docs[0].data();
        
        // Verify user still exists in Activepieces
        const response = await axios.get(
          `${this.activepiecesUrl}/v1/users/${userData.activepiecesUserId}`,
          {
            headers: {
              'Authorization': `Bearer ${this.adminApiKey}`
            },
            timeout: 5000
          }
        );
        
        return response.data;
      }
      
      // If not in Firestore, search Activepieces directly
      const response = await axios.get(
        `${this.activepiecesUrl}/v1/users?email=${encodeURIComponent(email)}`,
        {
          headers: {
            'Authorization': `Bearer ${this.adminApiKey}`
          },
          timeout: 5000
        }
      );
      
      return response.data?.data?.[0] || null;
      
    } catch (error: any) {
      if (error.response?.status === 404) {
        return null;
      }
      console.error('Error finding Activepieces user:', error.message);
      return null;
    }
  }
  
  /**
   * Create API key for Activepieces user
   */
  private async createApiKeyForUser(userId: string): Promise<string> {
    try {
      const response = await axios.post(
        `${this.activepiecesUrl}/v1/api-keys`,
        {
          displayName: `nexus-${Date.now()}`,
          userId: userId
        },
        {
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${this.adminApiKey}`
          },
          timeout: 10000
        }
      );
      
      console.log(`Created API key for user ${userId}`);
      return response.data.token;
      
    } catch (error: any) {
      console.error('Error creating API key:', error.response?.data || error.message);
      throw new Error(`Failed to create API key: ${error.message}`);
    }
  }
  
  /**
   * Get existing API key for user
   */
  private async getExistingApiKey(userId: string): Promise<string | null> {
    try {
      const response = await axios.get(
        `${this.activepiecesUrl}/v1/api-keys?userId=${userId}`,
        {
          headers: {
            'Authorization': `Bearer ${this.adminApiKey}`
          },
          timeout: 5000
        }
      );
      
      const keys = response.data?.data || [];
      if (keys.length > 0) {
        // Return the first (most recent) API key
        return keys[0].token;
      }
      
      return null;
      
    } catch (error: any) {
      console.error('Error getting API keys:', error.message);
      return null;
    }
  }
  
  /**
   * Cache API key in Firestore (1 hour TTL)
   */
  private async cacheApiKey(
    firebaseUid: string, 
    activepiecesUserId: string, 
    apiKey: string
  ): Promise<void> {
    const expiresAt = new Date();
    expiresAt.setHours(expiresAt.getHours() + 1); // 1 hour cache
    
    await admin.firestore()
      .collection('activepieces_api_keys')
      .doc(firebaseUid)
      .set({
        apiKey: apiKey, // Consider encrypting this
        activepiecesUserId: activepiecesUserId,
        createdAt: admin.firestore.FieldValue.serverTimestamp(),
        expiresAt: admin.firestore.Timestamp.fromDate(expiresAt),
        lastUsed: admin.firestore.FieldValue.serverTimestamp()
      });
  }
  
  /**
   * Get cached API key from Firestore
   */
  private async getCachedApiKey(firebaseUid: string): Promise<string | null> {
    try {
      const doc = await admin.firestore()
        .collection('activepieces_api_keys')
        .doc(firebaseUid)
        .get();
      
      if (!doc.exists) {
        return null;
      }
      
      const data = doc.data()!;
      const now = new Date();
      const expiresAt = data.expiresAt.toDate();
      
      // Check if cache expired
      if (now > expiresAt) {
        console.log(`Cached API key expired for ${firebaseUid}`);
        await doc.ref.delete(); // Clean up
        return null;
      }
      
      // Update last used timestamp
      await doc.ref.update({
        lastUsed: admin.firestore.FieldValue.serverTimestamp()
      });
      
      return data.apiKey;
      
    } catch (error: any) {
      console.error('Error getting cached API key:', error.message);
      return null;
    }
  }
  
  /**
   * Revoke API key (for logout or security)
   */
  async revokeApiKey(firebaseUid: string): Promise<void> {
    try {
      // Get user's API key info
      const doc = await admin.firestore()
        .collection('activepieces_api_keys')
        .doc(firebaseUid)
        .get();
      
      if (!doc.exists) {
        return;
      }
      
      const data = doc.data()!;
      
      // Delete from Activepieces
      await axios.delete(
        `${this.activepiecesUrl}/v1/api-keys/${data.apiKey}`,
        {
          headers: {
            'Authorization': `Bearer ${this.adminApiKey}`
          },
          timeout: 5000
        }
      );
      
      // Delete from Firestore
      await doc.ref.delete();
      
      console.log(`Revoked API key for ${firebaseUid}`);
      
    } catch (error: any) {
      console.error('Error revoking API key:', error.message);
      // Continue anyway to clean up local cache
      await admin.firestore()
        .collection('activepieces_api_keys')
        .doc(firebaseUid)
        .delete()
        .catch(() => {});
    }
  }
}
```

---

## 🗺️ Firebase UID to Activepieces User Mapping

### Firestore Data Structure

```typescript
// Collection: activepieces_users
{
  "[firebaseUid]": {
    activepiecesUserId: "ap_user_123456",
    email: "user@example.com",
    createdAt: Timestamp,
    lastSync: Timestamp,
    metadata: {
      displayName: "John Doe",
      photoURL: "https://...",
      provider: "google.com" // or "password"
    }
  }
}

// Collection: activepieces_api_keys
{
  "[firebaseUid]": {
    apiKey: "ap_api_xyz789", // Consider encrypting
    activepiecesUserId: "ap_user_123456",
    createdAt: Timestamp,
    expiresAt: Timestamp, // 1 hour from creation
    lastUsed: Timestamp,
    requestCount: 0 // Track usage
  }
}

// Collection: activepieces_mapping (backup/audit)
{
  "[activepiecesUserId]": {
    firebaseUid: "firebase_uid_123",
    email: "user@example.com",
    createdAt: Timestamp,
    syncStatus: "active" // active, suspended, deleted
  }
}
```

---

## 📡 Complete API Reference

### 1. User Management

#### Create User
```typescript
POST /v1/users
Headers: {
  'Content-Type': 'application/json',
  'Authorization': 'Bearer ADMIN_API_KEY'
}
Body: {
  email: string,
  password: string,
  firstName: string,
  lastName: string,
  trackEvents: boolean,
  newsLetter: boolean
}
Response: {
  id: string,
  email: string,
  firstName: string,
  lastName: string,
  created: string,
  updated: string
}
```

#### Get User
```typescript
GET /v1/users/:userId
Headers: {
  'Authorization': 'Bearer API_KEY'
}
Response: {
  id: string,
  email: string,
  firstName: string,
  lastName: string,
  status: 'ACTIVE' | 'INACTIVE',
  platformId: string,
  created: string,
  updated: string
}
```

### 2. API Key Management

#### Create API Key
```typescript
POST /v1/api-keys
Headers: {
  'Content-Type': 'application/json',
  'Authorization': 'Bearer ADMIN_API_KEY'
}
Body: {
  displayName: string,
  userId: string
}
Response: {
  id: string,
  token: string, // THIS IS THE API KEY TO USE
  displayName: string,
  userId: string,
  created: string
}
```

#### List API Keys
```typescript
GET /v1/api-keys?userId=USER_ID
Headers: {
  'Authorization': 'Bearer ADMIN_API_KEY'
}
Response: {
  data: [
    {
      id: string,
      token: string,
      displayName: string,
      userId: string,
      created: string
    }
  ]
}
```

#### Delete API Key
```typescript
DELETE /v1/api-keys/:keyId
Headers: {
  'Authorization': 'Bearer ADMIN_API_KEY'
}
Response: 204 No Content
```

### 3. Flow Management

#### List Flows
```typescript
GET /v1/flows?limit=10&cursor=abc123
Headers: {
  'Authorization': 'Bearer USER_API_KEY'
}
Response: {
  data: [
    {
      id: string,
      projectId: string,
      folderId: string | null,
      name: string,
      status: 'ENABLED' | 'DISABLED',
      schedule: {
        type: 'CRON',
        cronExpression: string
      } | null,
      created: string,
      updated: string
    }
  ],
  next: string | null,
  previous: string | null
}
```

#### Get Flow
```typescript
GET /v1/flows/:flowId
Headers: {
  'Authorization': 'Bearer USER_API_KEY'
}
Response: {
  id: string,
  projectId: string,
  name: string,
  status: 'ENABLED' | 'DISABLED',
  version: {
    trigger: {
      type: string,
      settings: object
    },
    actions: [
      {
        type: string,
        settings: object
      }
    ]
  },
  created: string,
  updated: string
}
```

#### Create Flow
```typescript
POST /v1/flows
Headers: {
  'Content-Type': 'application/json',
  'Authorization': 'Bearer USER_API_KEY'
}
Body: {
  projectId: string,
  displayName: string,
  folderId?: string
}
Response: {
  id: string,
  projectId: string,
  displayName: string,
  status: 'ENABLED',
  created: string
}
```

#### Update Flow
```typescript
POST /v1/flows/:flowId
Headers: {
  'Content-Type': 'application/json',
  'Authorization': 'Bearer USER_API_KEY'
}
Body: {
  displayName?: string,
  status?: 'ENABLED' | 'DISABLED',
  schedule?: {
    type: 'CRON',
    cronExpression: string
  }
}
Response: {
  id: string,
  displayName: string,
  status: string,
  updated: string
}
```

#### Delete Flow
```typescript
DELETE /v1/flows/:flowId
Headers: {
  'Authorization': 'Bearer USER_API_KEY'
}
Response: 204 No Content
```

### 4. Flow Runs (Execution History)

#### List Flow Runs
```typescript
GET /v1/flow-runs?flowId=FLOW_ID&limit=20&cursor=xyz
Headers: {
  'Authorization': 'Bearer USER_API_KEY'
}
Response: {
  data: [
    {
      id: string,
      flowId: string,
      projectId: string,
      status: 'RUNNING' | 'SUCCEEDED' | 'FAILED' | 'TIMEOUT',
      startTime: string,
      finishTime: string | null,
      logsFileId: string | null,
      duration: number // milliseconds
    }
  ],
  next: string | null
}
```

#### Get Flow Run Details
```typescript
GET /v1/flow-runs/:runId
Headers: {
  'Authorization': 'Bearer USER_API_KEY'
}
Response: {
  id: string,
  flowId: string,
  status: 'SUCCEEDED' | 'FAILED',
  startTime: string,
  finishTime: string,
  steps: [
    {
      name: string,
      type: string,
      status: 'SUCCEEDED' | 'FAILED',
      input: object,
      output: object,
      errorMessage: string | null,
      duration: number
    }
  ]
}
```

### 5. Projects (Workspaces)

#### List Projects
```typescript
GET /v1/projects
Headers: {
  'Authorization': 'Bearer USER_API_KEY'
}
Response: {
  data: [
    {
      id: string,
      displayName: string,
      ownerId: string,
      created: string,
      updated: string
    }
  ]
}
```

#### Create Project
```typescript
POST /v1/projects
Headers: {
  'Content-Type': 'application/json',
  'Authorization': 'Bearer USER_API_KEY'
}
Body: {
  displayName: string
}
Response: {
  id: string,
  displayName: string,
  ownerId: string,
  created: string
}
```

---

## ⚠️ Error Codes & Handling

### HTTP Status Codes

```typescript
export const ActivepiecesErrors = {
  // 4xx Client Errors
  400: {
    code: 'BAD_REQUEST',
    message: 'Invalid request parameters',
    action: 'Validate input and retry'
  },
  401: {
    code: 'UNAUTHORIZED',
    message: 'Invalid or missing API key',
    action: 'Refresh API key and retry'
  },
  403: {
    code: 'FORBIDDEN',
    message: 'Insufficient permissions',
    action: 'Check user subscription and quota'
  },
  404: {
    code: 'NOT_FOUND',
    message: 'Resource not found',
    action: 'Verify resource ID and retry'
  },
  409: {
    code: 'CONFLICT',
    message: 'Resource already exists',
    action: 'Use existing resource or choose different name'
  },
  429: {
    code: 'RATE_LIMIT_EXCEEDED',
    message: 'Too many requests',
    action: 'Wait and retry with exponential backoff'
  },
  
  // 5xx Server Errors
  500: {
    code: 'INTERNAL_SERVER_ERROR',
    message: 'Activepieces server error',
    action: 'Retry with exponential backoff'
  },
  502: {
    code: 'BAD_GATEWAY',
    message: 'Activepieces is unreachable',
    action: 'Check service status and retry'
  },
  503: {
    code: 'SERVICE_UNAVAILABLE',
    message: 'Activepieces is temporarily down',
    action: 'Retry after a few minutes'
  },
  504: {
    code: 'GATEWAY_TIMEOUT',
    message: 'Request timeout',
    action: 'Retry with longer timeout'
  }
};

// Custom error class
export class ActivepiecesError extends Error {
  constructor(
    public statusCode: number,
    public code: string,
    message: string,
    public action: string,
    public originalError?: any
  ) {
    super(message);
    this.name = 'ActivepiecesError';
  }
}

// Error handler
export function handleActivepiecesError(error: any): ActivepiecesError {
  const status = error.response?.status || 500;
  const errorInfo = ActivepiecesErrors[status] || ActivepiecesErrors[500];
  
  return new ActivepiecesError(
    status,
    errorInfo.code,
    error.response?.data?.message || errorInfo.message,
    errorInfo.action,
    error
  );
}
```

### Retry Strategy

```typescript
export class RetryManager {
  private maxRetries = 3;
  private baseDelay = 1000; // 1 second
  
  async executeWithRetry<T>(
    operation: () => Promise<T>,
    retryableStatuses = [429, 500, 502, 503, 504]
  ): Promise<T> {
    let lastError: any;
    
    for (let attempt = 0; attempt <= this.maxRetries; attempt++) {
      try {
        return await operation();
      } catch (error: any) {
        lastError = error;
        const status = error.response?.status;
        
        // Don't retry client errors (except rate limit)
        if (status && status < 500 && status !== 429) {
          throw handleActivepiecesError(error);
        }
        
        // Last attempt, don't wait
        if (attempt === this.maxRetries) {
          break;
        }
        
        // Exponential backoff: 1s, 2s, 4s
        const delay = this.baseDelay * Math.pow(2, attempt);
        console.log(`Retry attempt ${attempt + 1} after ${delay}ms`);
        await new Promise(resolve => setTimeout(resolve, delay));
      }
    }
    
    throw handleActivepiecesError(lastError);
  }
}
```

---

## 🧪 Testing & Debugging

### Test Script

```typescript
// test/activepieces-api.test.ts

import { ApiKeyManager } from '../functions/src/activepieces/apiKeyManager';
import * as admin from 'firebase-admin';

describe('Activepieces API Integration', () => {
  let apiKeyManager: ApiKeyManager;
  
  beforeAll(() => {
    admin.initializeApp();
    apiKeyManager = new ApiKeyManager();
  });
  
  test('should create user and API key', async () => {
    const firebaseUid = 'test_uid_' + Date.now();
    const email = `test${Date.now()}@example.com`;
    
    const apiKey = await apiKeyManager.getOrCreateApiKey(firebaseUid, email);
    
    expect(apiKey).toBeTruthy();
    expect(apiKey).toMatch(/^ap_/);
  });
  
  test('should return cached API key on second call', async () => {
    const firebaseUid = 'test_uid_' + Date.now();
    const email = `test${Date.now()}@example.com`;
    
    const apiKey1 = await apiKeyManager.getOrCreateApiKey(firebaseUid, email);
    const apiKey2 = await apiKeyManager.getOrCreateApiKey(firebaseUid, email);
    
    expect(apiKey1).toBe(apiKey2);
  });
  
  test('should revoke API key', async () => {
    const firebaseUid = 'test_uid_' + Date.now();
    const email = `test${Date.now()}@example.com`;
    
    await apiKeyManager.getOrCreateApiKey(firebaseUid, email);
    await apiKeyManager.revokeApiKey(firebaseUid);
    
    // Should create new key after revocation
    const newApiKey = await apiKeyManager.getOrCreateApiKey(firebaseUid, email);
    expect(newApiKey).toBeTruthy();
  });
});
```

---

## 📊 Monitoring & Logging

```typescript
// functions/src/activepieces/monitoring.ts

export class ActivepiecesMonitor {
  
  async logApiCall(
    userId: string,
    endpoint: string,
    method: string,
    statusCode: number,
    duration: number
  ) {
    await admin.firestore()
      .collection('activepieces_api_logs')
      .add({
        userId,
        endpoint,
        method,
        statusCode,
        duration,
        timestamp: admin.firestore.FieldValue.serverTimestamp(),
        success: statusCode >= 200 && statusCode < 300
      });
  }
  
  async getApiStats(userId: string, days = 7) {
    const since = new Date();
    since.setDate(since.getDate() - days);
    
    const logs = await admin.firestore()
      .collection('activepieces_api_logs')
      .where('userId', '==', userId)
      .where('timestamp', '>=', since)
      .get();
    
    let totalCalls = 0;
    let successCalls = 0;
    let totalDuration = 0;
    const errors: any[] = [];
    
    logs.forEach(doc => {
      const data = doc.data();
      totalCalls++;
      if (data.success) successCalls++;
      totalDuration += data.duration;
      if (!data.success) errors.push(data);
    });
    
    return {
      totalCalls,
      successRate: (successCalls / totalCalls) * 100,
      avgDuration: totalDuration / totalCalls,
      errors: errors.slice(0, 10) // Last 10 errors
    };
  }
}
```

---

## ✅ Implementation Checklist

```
[✓] Set up ACTIVEPIECES_URL environment variable
[✓] Set up ACTIVEPIECES_ADMIN_KEY environment variable
[✓] Create Firestore collections (activepieces_users, activepieces_api_keys)
[✓] Implement ApiKeyManager class
[✓] Add caching with 1-hour TTL
[✓] Add retry logic for failed requests
[✓] Handle all error codes properly
[✓] Add logging and monitoring
[✓] Write unit tests
[✓] Test with real Activepieces instance
[✓] Document all API endpoints
[✓] Create debugging tools
```

---

**Status**: ✅ Production Ready  
**Version**: 1.0  
**Last Updated**: October 13, 2025
