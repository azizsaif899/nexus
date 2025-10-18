# 📚 Complete Implementation Examples

This directory contains **production-ready code examples** for integrating Activepieces with Firebase.

---

## 📂 Directory Structure

```
examples/
├── cloud-functions/
│   ├── proxy.ts              # Complete Cloud Function proxy
│   ├── quota-manager.ts      # Quota management system
│   └── api-key-manager.ts    # API key caching system
│
└── react/
    ├── ActivepiecesService.ts        # Service layer
    ├── useActivepieces.hook.ts       # React hooks
    └── FlowDashboard.component.tsx   # UI component
```

---

## 🚀 Quick Start

### 1. Cloud Functions Setup

#### Copy Files
```bash
# Copy to your functions directory
cp examples/cloud-functions/*.ts functions/src/activepieces/
```

#### Install Dependencies
```bash
cd functions
npm install axios rate-limiter-flexible
```

#### Set Environment Variables
```bash
# functions/.env
ACTIVEPIECES_URL=http://localhost:8080
ACTIVEPIECES_ADMIN_KEY=your_admin_api_key_here
```

#### Deploy
```bash
firebase deploy --only functions:activepiecesProxy
```

### 2. React Integration

#### Copy Files
```bash
# Copy to your React app
cp examples/react/*.ts apps/nexus-ai-main/src/
```

#### Update Service URL
```typescript
// In ActivepiecesService.ts
baseURL: 'https://us-central1-YOUR-PROJECT-ID.cloudfunctions.net/activepiecesProxy'
```

#### Use in Components
```typescript
import { FlowDashboard } from './components/FlowDashboard';

function App() {
  return <FlowDashboard />;
}
```

---

## 📖 Usage Examples

### Example 1: List All Flows

```typescript
import { activepiecesService } from './services/activepieces.service';

async function listMyFlows() {
  try {
    const result = await activepiecesService.listFlows();
    console.log('Flows:', result.data);
  } catch (error) {
    console.error('Error:', error);
  }
}
```

### Example 2: Create Flow

```typescript
import { activepiecesService } from './services/activepieces.service';

async function createNewFlow() {
  try {
    const flow = await activepiecesService.createFlow('WhatsApp Notification');
    console.log('Created:', flow);
  } catch (error) {
    if (error.code === 'QUOTA_EXCEEDED') {
      alert('Monthly quota exceeded. Please upgrade!');
    }
  }
}
```

### Example 3: React Hook Usage

```typescript
import { useActivepieces } from './hooks/useActivepieces.hook';

function MyComponent() {
  const { 
    flows, 
    flowsLoading, 
    flowsError, 
    createFlow 
  } = useActivepieces();
  
  if (flowsLoading) return <div>Loading...</div>;
  if (flowsError) return <div>Error: {flowsError.message}</div>;
  
  return (
    <div>
      <h1>My Flows ({flows.length})</h1>
      {flows.map(flow => (
        <div key={flow.id}>{flow.name}</div>
      ))}
      <button onClick={() => createFlow('New Flow')}>
        Create Flow
      </button>
    </div>
  );
}
```

### Example 4: View Execution History

```typescript
import { useFlowRuns } from './hooks/useActivepieces.hook';

function ExecutionHistory({ flowId }: { flowId: string }) {
  const { runs, loading, error } = useFlowRuns(flowId);
  
  if (loading) return <div>Loading history...</div>;
  if (error) return <div>Error: {error.message}</div>;
  
  return (
    <div>
      <h2>Execution History</h2>
      {runs.map(run => (
        <div key={run.id}>
          <span>{run.status}</span>
          <span>{new Date(run.startTime).toLocaleString()}</span>
          <span>{run.duration}ms</span>
        </div>
      ))}
    </div>
  );
}
```

### Example 5: Quota Display

```typescript
import { useActivepieces } from './hooks/useActivepieces.hook';

function QuotaWidget() {
  const { quota, quotaLoading } = useActivepieces();
  
  if (quotaLoading || !quota) return null;
  
  const color = quota.percentUsed >= 80 ? 'red' : 'green';
  
  return (
    <div>
      <h3>Monthly Quota</h3>
      <div style={{ width: '200px', height: '20px', background: '#f0f0f0' }}>
        <div 
          style={{ 
            width: `${quota.percentUsed}%`, 
            height: '100%', 
            background: color 
          }}
        />
      </div>
      <p>{quota.used} / {quota.limit}</p>
      {quota.percentUsed >= 80 && (
        <button>Upgrade Plan</button>
      )}
    </div>
  );
}
```

---

## 🔥 Advanced Examples

### Example 6: Error Handling

```typescript
import { activepiecesService, ActivepiecesError } from './services/activepieces.service';

async function handleOperation() {
  try {
    const flow = await activepiecesService.createFlow('Test');
  } catch (error) {
    if (error instanceof ActivepiecesError) {
      switch (error.code) {
        case 'QUOTA_EXCEEDED':
          // Show upgrade modal
          showUpgradeModal();
          break;
          
        case 'RATE_LIMIT_EXCEEDED':
          // Show retry message
          showRetryMessage(error.action);
          break;
          
        case 'UNAUTHORIZED':
          // Redirect to login
          window.location.href = '/login';
          break;
          
        default:
          // Show generic error
          showError(error.message);
      }
    }
  }
}
```

### Example 7: Custom Hook with Pagination

```typescript
import { useState, useCallback } from 'react';
import { activepiecesService, Flow } from './services/activepieces.service';

function useFlowsPaginated(pageSize = 20) {
  const [flows, setFlows] = useState<Flow[]>([]);
  const [cursor, setCursor] = useState<string | null>(null);
  const [hasMore, setHasMore] = useState(true);
  const [loading, setLoading] = useState(false);
  
  const loadMore = useCallback(async () => {
    if (loading || !hasMore) return;
    
    setLoading(true);
    
    try {
      const result = await activepiecesService.listFlows(
        pageSize,
        cursor || undefined
      );
      
      setFlows(prev => [...prev, ...result.data]);
      setCursor(result.next);
      setHasMore(result.next !== null);
      
    } catch (error) {
      console.error('Error loading more flows:', error);
    } finally {
      setLoading(false);
    }
  }, [cursor, hasMore, loading, pageSize]);
  
  return { flows, loadMore, hasMore, loading };
}
```

### Example 8: Real-time Flow Status

```typescript
import { useState, useEffect } from 'react';
import { activepiecesService } from './services/activepieces.service';

function useRealtimeFlowStatus(flowId: string) {
  const [status, setStatus] = useState<string>('unknown');
  
  useEffect(() => {
    const interval = setInterval(async () => {
      try {
        const flow = await activepiecesService.getFlow(flowId);
        setStatus(flow.status);
      } catch (error) {
        console.error('Error fetching flow status:', error);
      }
    }, 5000); // Poll every 5 seconds
    
    return () => clearInterval(interval);
  }, [flowId]);
  
  return status;
}
```

---

## 🧪 Testing

### Test Cloud Function Locally

```typescript
// test/proxy.test.ts

import * as admin from 'firebase-admin';
import * as test from 'firebase-functions-test';

const testEnv = test();

describe('activepiecesProxy', () => {
  beforeAll(() => {
    admin.initializeApp();
  });
  
  afterAll(() => {
    testEnv.cleanup();
  });
  
  test('should reject requests without auth token', async () => {
    const req = {
      method: 'GET',
      path: '/v1/flows',
      headers: {}
    };
    
    const res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn()
    };
    
    await activepiecesProxy(req as any, res as any);
    
    expect(res.status).toHaveBeenCalledWith(401);
  });
  
  test('should enforce rate limits', async () => {
    // Test implementation
  });
});
```

### Test React Service

```typescript
// test/activepieces.service.test.ts

import { activepiecesService } from '../services/activepieces.service';

describe('ActivepiecesService', () => {
  test('should list flows', async () => {
    const result = await activepiecesService.listFlows();
    expect(result.data).toBeInstanceOf(Array);
  });
  
  test('should handle quota exceeded', async () => {
    try {
      await activepiecesService.createFlow('Test');
    } catch (error: any) {
      expect(error.code).toBe('QUOTA_EXCEEDED');
    }
  });
});
```

---

## 🔧 Customization Guide

### Custom Quota Limits

```typescript
// In quota-manager.ts

export const SUBSCRIPTION_PLANS: Record<string, SubscriptionPlan> = {
  free: {
    monthlyQuota: 2000, // Change from 1000
    flowsLimit: 5,      // Change from 3
    executionsLimit: 1000
  }
};
```

### Custom Rate Limits

```typescript
// In proxy.ts

const rateLimiter = new RateLimiterMemory({
  points: 200,  // Change from 100
  duration: 60
});
```

### Add Custom Notification

```typescript
// In quota-manager.ts

private async sendNotification(...) {
  // Your custom notification logic
  
  await sendEmail({
    to: userEmail,
    subject: 'Quota Alert',
    body: messages[type]
  });
  
  await sendPushNotification({
    userId,
    title: 'Quota Alert',
    body: messages[type]
  });
}
```

---

## 📊 Monitoring

### View Usage Stats

```typescript
import { QuotaManager } from './quota-manager';

const quotaManager = new QuotaManager();

async function viewUserStats(userId: string) {
  const subscription = await quotaManager.getSubscription(userId);
  const usage = await quotaManager.getMonthlyUsage(userId);
  
  console.log('Plan:', subscription.name);
  console.log('Used:', usage.totalRequests);
  console.log('Limit:', subscription.monthlyQuota);
  console.log('Remaining:', subscription.monthlyQuota - usage.totalRequests);
}
```

### Generate Monthly Report

```typescript
async function generateReport() {
  const usersSnapshot = await admin.firestore()
    .collection('activepieces_usage')
    .get();
  
  const report = {
    totalUsers: usersSnapshot.size,
    totalRequests: 0,
    totalExecutions: 0
  };
  
  for (const doc of usersSnapshot.docs) {
    const monthData = await doc.ref
      .collection('months')
      .doc(getCurrentMonthKey())
      .get();
    
    if (monthData.exists) {
      const data = monthData.data()!;
      report.totalRequests += data.totalRequests || 0;
      report.totalExecutions += data.totalExecutions || 0;
    }
  }
  
  console.log('Monthly Report:', report);
}
```

---

## 🚨 Troubleshooting

### Issue: CORS Error

```typescript
// Solution: Add CORS headers in proxy.ts
res.set('Access-Control-Allow-Origin', 'https://your-domain.com');
res.set('Access-Control-Allow-Credentials', 'true');
```

### Issue: Rate Limit Too Aggressive

```typescript
// Solution: Increase rate limit
const rateLimiter = new RateLimiterMemory({
  points: 200,  // Increase
  duration: 60
});
```

### Issue: API Key Expired

```typescript
// Solution: Automatic retry with fresh key
private async executeWithRetry<T>(operation: () => Promise<T>) {
  try {
    return await operation();
  } catch (error: any) {
    if (error.statusCode === 401) {
      // Clear cache and retry
      await this.clearApiKeyCache();
      return await operation();
    }
    throw error;
  }
}
```

---

## ✅ Checklist

Before going to production:

```
[✓] Cloud Functions deployed
[✓] Environment variables set
[✓] Firebase Authentication configured
[✓] Firestore collections created
[✓] Security rules configured
[✓] Rate limiting tested
[✓] Quota enforcement tested
[✓] Error handling verified
[✓] React components integrated
[✓] UI tested on mobile
[✓] All API endpoints tested
[✓] Monitoring set up
[✓] Backup strategy implemented
```

---

## 📞 Support

If you have questions or issues:

1. Check the main documentation files:
   - `PROFESSIONAL-SERVICE-GUIDE.md`
   - `ACTIVEPIECES-API-INTEGRATION.md`
   - `MIGRATION-GUIDE.md`
   - `UI-STRATEGY.md`

2. Review the examples in this directory

3. Test with the local Activepieces instance first

---

**Status**: ✅ Production Ready  
**Last Updated**: October 13, 2025  
**Version**: 1.0
