# 🔐 دمج Firebase Authentication مع Activepieces

## ❓ السؤال: هل يمكن إلغاء تسجيل الدخول في Activepieces واعتماد Firebase؟

---

## ✅ الإجابة: نعم ممكن! لكن بطريقة ذكية

### **الاستراتيجية المثالية:**

```
┌────────────────────────────────────────────┐
│  المستخدم يسجل دخول في nexus-ai-main      │
│  عبر Firebase Authentication ✅            │
└──────────────┬─────────────────────────────┘
               │
               ▼
┌────────────────────────────────────────────┐
│  nexus-ai-main Backend                     │
│  ├─ يتحقق من Firebase token               │
│  ├─ ينشئ/يجلب حساب Activepieces           │
│  └─ يولد API Key لـ Activepieces           │
└──────────────┬─────────────────────────────┘
               │
               ▼
┌────────────────────────────────────────────┐
│  Activepieces API                          │
│  ├─ يستقبل requests مع API Key            │
│  ├─ لا يحتاج login UI                     │
│  └─ الواجهة مخفية، فقط API                │
└────────────────────────────────────────────┘
```

---

## 🎯 **الحلول المتاحة:**

### **Option 1: إخفاء UI + API Only** ⭐⭐⭐⭐⭐ (الأفضل)

```yaml
الفكرة:
  - المستخدم لا يرى واجهة Activepieces أبداً
  - كل شيء يحدث عبر nexus-ai-main
  - Activepieces يعمل كـ backend فقط

المميزات:
  ✅ UX موحد (Firebase فقط)
  ✅ أمان أعلى (لا وصول مباشر)
  ✅ تحكم كامل (Quota, permissions)
  ✅ UI مخصص في Dashboard

العيوب:
  ⚠️ تحتاج بناء UI للـ flows
  ⚠️ تحتاج Firebase Cloud Functions
```

#### التنفيذ:

```typescript
// 1. في nexus-ai-main - Firebase Cloud Function
export const getActivepiecesToken = functions.https.onCall(async (data, context) => {
  // التحقق من Firebase auth
  if (!context.auth) {
    throw new functions.https.HttpsError('unauthenticated', 'User not authenticated');
  }

  const uid = context.auth.uid;
  
  // إنشاء/جلب user في Activepieces
  const apUser = await createOrGetActivepiecesUser(uid);
  
  // توليد API key
  const apiKey = await generateActivepiecesApiKey(apUser.id);
  
  return { apiKey, userId: apUser.id };
});

// 2. في React App
const ActivepiecesService = {
  async init() {
    const getToken = httpsCallable(functions, 'getActivepiecesToken');
    const result = await getToken();
    this.apiKey = result.data.apiKey;
  },
  
  async createFlow(flowData) {
    const response = await fetch(`${ACTIVEPIECES_URL}/api/v1/flows`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${this.apiKey}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(flowData)
    });
    return response.json();
  },
  
  async executeFlow(flowId, input) {
    // تنفيذ flow
  }
};
```

---

### **Option 2: Single Sign-On (SSO)** ⭐⭐⭐⭐

```yaml
الفكرة:
  - المستخدم يسجل دخول بـ Firebase
  - nexus-ai-main يوجهه لـ Activepieces مع token
  - Activepieces يستخدم Custom Authentication

المميزات:
  ✅ يمكن استخدام UI الأصلي
  ✅ المستخدم يسجل دخول مرة واحدة
  ✅ مرونة أكبر

العيوب:
  ⚠️ يحتاج تعديل Activepieces (معقد)
  ⚠️ أو استخدام reverse proxy
```

#### التنفيذ البسيط (بدون تعديل Activepieces):

```typescript
// Firebase Cloud Function - Proxy
export const activepiecesProxy = functions.https.onRequest(async (req, res) => {
  // التحقق من Firebase session
  const token = req.headers.authorization;
  const decodedToken = await admin.auth().verifyIdToken(token);
  
  // إنشاء session في Activepieces
  const apToken = await createActivepiecesSession(decodedToken.uid);
  
  // توجيه مع token
  res.redirect(`http://localhost:8080?token=${apToken}`);
});
```

---

### **Option 3: Embedded iFrame** ⭐⭐⭐

```yaml
الفكرة:
  - عرض Activepieces داخل iframe
  - Auto-login عبر postMessage
  - UI موحد

المميزات:
  ✅ سريع التنفيذ
  ✅ UI الأصلي متاح
  ✅ لا يحتاج تعديل كود

العيوب:
  ⚠️ مشاكل CORS محتملة
  ⚠️ أقل أماناً
  ⚠️ UX أقل جودة
```

---

## 🏆 **التوصية: Option 1 (API Only)**

### لماذا؟

```
1️⃣ UX أفضل:
   - المستخدم يرى واجهة واحدة (nexus-ai-main)
   - تصميم موحد
   - لا confusion

2️⃣ أمان أعلى:
   - Firebase tokens فقط
   - لا وصول مباشر لـ Activepieces
   - تحكم كامل في permissions

3️⃣ Monetization سهل:
   - ربط مباشر بـ subscription system
   - quota management
   - usage tracking

4️⃣ Customization:
   - UI مخصص لاحتياجاتك
   - flow templates جاهزة
   - AI-powered flow builder
```

---

## 🚀 **خطة التنفيذ (Option 1)**

### Phase 1: Backend Setup

```typescript
// functions/src/activepieces/index.ts
import * as functions from 'firebase-functions';
import * as admin from 'firebase-admin';
import axios from 'axios';

const ACTIVEPIECES_URL = process.env.ACTIVEPIECES_URL || 'http://localhost:8080';

// إنشاء user في Activepieces
async function createActivepiecesUser(firebaseUid: string, email: string) {
  try {
    const response = await axios.post(`${ACTIVEPIECES_URL}/api/v1/users`, {
      email,
      password: generateSecurePassword(), // random password
      firstName: 'User',
      lastName: firebaseUid.substring(0, 8),
    });
    
    // حفظ في Firestore
    await admin.firestore().collection('activepieces_users').doc(firebaseUid).set({
      activepiecesId: response.data.id,
      email,
      createdAt: admin.firestore.FieldValue.serverTimestamp()
    });
    
    return response.data;
  } catch (error) {
    console.error('Error creating Activepieces user:', error);
    throw error;
  }
}

// توليد API key
async function generateApiKey(userId: string) {
  const response = await axios.post(`${ACTIVEPIECES_URL}/api/v1/api-keys`, {
    userId,
    displayName: 'nexus-ai-main'
  });
  return response.data.value;
}

// Cloud Function الرئيسية
export const initActivepieces = functions.https.onCall(async (data, context) => {
  if (!context.auth) {
    throw new functions.https.HttpsError('unauthenticated', 'Not authenticated');
  }
  
  const uid = context.auth.uid;
  const email = context.auth.token.email!;
  
  // تحقق إذا user موجود
  const userDoc = await admin.firestore().collection('activepieces_users').doc(uid).get();
  
  let activepiecesUserId;
  if (!userDoc.exists) {
    // إنشاء جديد
    const apUser = await createActivepiecesUser(uid, email);
    activepiecesUserId = apUser.id;
  } else {
    activepiecesUserId = userDoc.data()!.activepiecesId;
  }
  
  // توليد API key
  const apiKey = await generateApiKey(activepiecesUserId);
  
  return {
    apiKey,
    userId: activepiecesUserId,
    baseUrl: ACTIVEPIECES_URL
  };
});

// Proxy للـ API calls
export const activepiecesApi = functions.https.onRequest(async (req, res) => {
  // CORS
  res.set('Access-Control-Allow-Origin', '*');
  
  if (req.method === 'OPTIONS') {
    res.set('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE');
    res.set('Access-Control-Allow-Headers', 'Authorization, Content-Type');
    res.status(204).send('');
    return;
  }
  
  // التحقق من Firebase token
  const token = req.headers.authorization?.replace('Bearer ', '');
  if (!token) {
    res.status(401).json({ error: 'Unauthorized' });
    return;
  }
  
  try {
    await admin.auth().verifyIdToken(token);
    
    // Forward request to Activepieces
    const apResponse = await axios({
      method: req.method as any,
      url: `${ACTIVEPIECES_URL}${req.path}`,
      data: req.body,
      headers: {
        'Content-Type': 'application/json'
      }
    });
    
    res.status(apResponse.status).json(apResponse.data);
  } catch (error: any) {
    res.status(error.response?.status || 500).json({ 
      error: error.message 
    });
  }
});
```

### Phase 2: React Integration

```typescript
// src/services/activepieces.service.ts
import { httpsCallable } from 'firebase/functions';
import { functions } from '../lib/firebase';

class ActivepiecesService {
  private apiKey: string | null = null;
  private userId: string | null = null;
  private baseUrl: string | null = null;
  private initialized = false;

  async init() {
    if (this.initialized) return;
    
    const initFunction = httpsCallable(functions, 'initActivepieces');
    const result = await initFunction();
    const data = result.data as any;
    
    this.apiKey = data.apiKey;
    this.userId = data.userId;
    this.baseUrl = data.baseUrl;
    this.initialized = true;
  }

  private async request(endpoint: string, options: RequestInit = {}) {
    if (!this.initialized) await this.init();
    
    const response = await fetch(`${this.baseUrl}${endpoint}`, {
      ...options,
      headers: {
        'Authorization': `Bearer ${this.apiKey}`,
        'Content-Type': 'application/json',
        ...options.headers
      }
    });
    
    if (!response.ok) {
      throw new Error(`Activepieces API error: ${response.statusText}`);
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
      body: JSON.stringify(flowData)
    });
  }

  async updateFlow(flowId: string, flowData: any) {
    return this.request(`/api/v1/flows/${flowId}`, {
      method: 'PUT',
      body: JSON.stringify(flowData)
    });
  }

  async deleteFlow(flowId: string) {
    return this.request(`/api/v1/flows/${flowId}`, {
      method: 'DELETE'
    });
  }

  // Flow Execution
  async executeFlow(flowId: string, input: any) {
    return this.request(`/api/v1/flows/${flowId}/execute`, {
      method: 'POST',
      body: JSON.stringify({ input })
    });
  }

  // Execution History
  async getExecutions(flowId?: string) {
    const endpoint = flowId 
      ? `/api/v1/flows/${flowId}/executions` 
      : '/api/v1/executions';
    return this.request(endpoint);
  }
}

export const activepiecesService = new ActivepiecesService();
```

### Phase 3: React Components

```typescript
// src/components/Automations/FlowsList.tsx
import { useEffect, useState } from 'react';
import { activepiecesService } from '../../services/activepieces.service';

export function FlowsList() {
  const [flows, setFlows] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadFlows();
  }, []);

  async function loadFlows() {
    try {
      const data = await activepiecesService.listFlows();
      setFlows(data.flows || []);
    } catch (error) {
      console.error('Error loading flows:', error);
    } finally {
      setLoading(false);
    }
  }

  async function executeFlow(flowId: string) {
    try {
      await activepiecesService.executeFlow(flowId, {});
      alert('Flow executed successfully!');
    } catch (error) {
      alert('Error executing flow');
    }
  }

  if (loading) return <div>Loading...</div>;

  return (
    <div className="flows-list">
      <h2>My Automations</h2>
      {flows.map((flow: any) => (
        <div key={flow.id} className="flow-card">
          <h3>{flow.displayName}</h3>
          <p>{flow.description}</p>
          <button onClick={() => executeFlow(flow.id)}>
            Run Flow
          </button>
        </div>
      ))}
    </div>
  );
}
```

---

## 💰 **Quota & Subscription Integration**

```typescript
// في Cloud Function
export const executeFlowWithQuota = functions.https.onCall(async (data, context) => {
  if (!context.auth) throw new Error('Unauthenticated');
  
  const uid = context.auth.uid;
  
  // تحقق من subscription
  const subscription = await getSubscription(uid);
  if (!subscription.isActive) {
    throw new Error('No active subscription');
  }
  
  // تحقق من quota
  const usage = await getMonthlyUsage(uid);
  if (usage >= subscription.plan.flowExecutions) {
    throw new Error('Monthly quota exceeded');
  }
  
  // تنفيذ flow
  const result = await activepiecesService.executeFlow(
    data.flowId,
    data.input
  );
  
  // تسجيل usage
  await incrementUsage(uid);
  
  return result;
});
```

---

## ✅ **الخلاصة:**

```
✅ نعم، يمكنك إلغاء UI الخاص بـ Activepieces
✅ استخدم Firebase Authentication فقط
✅ Activepieces يعمل كـ backend API
✅ UI مخصص في nexus-ai-main
✅ تحكم كامل في permissions & quota
✅ UX موحد وأفضل
```

---

## 🚀 **الخطوات التالية:**

```
1. شغّل Activepieces (✅ تم)
2. أنشئ Firebase Cloud Functions
3. أنشئ ActivepiecesService في React
4. بناء UI للـ flows
5. اختبار التكامل
6. ربط بـ subscription system
```

**هل تريد أن نبدأ بإنشاء Cloud Functions؟** 🔥
