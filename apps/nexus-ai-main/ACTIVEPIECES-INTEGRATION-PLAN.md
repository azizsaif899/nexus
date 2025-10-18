# 🎯 خطة البداية الصحيحة: Activepieces Integration

## 📊 الترتيب الموصى به

### ✅ **الترتيب الأمثل:**

```
1️⃣ رفع Activepieces أولاً (Self-hosted)
         ↓
2️⃣ اختباره والتأكد من عمله
         ↓
3️⃣ بناء API Layer في Firebase
         ↓
4️⃣ ربطه بالواجهة (Dashboard)
         ↓
5️⃣ اختبار التكامل الكامل
```

---

## 🎯 لماذا نرفع Activepieces أولاً؟

### الأسباب:

#### 1. **الاستقلالية** 🔧
```
✅ Activepieces يعمل بشكل مستقل
✅ لا يعتمد على الواجهة
✅ يمكن اختباره منفرداً
✅ يوفر API جاهزة للاستخدام
```

#### 2. **التطوير المتوازي** ⚡
```
✅ الفريق Backend يعمل على Activepieces
✅ الفريق Frontend يعمل على الواجهة
✅ توفير الوقت
✅ كفاءة أعلى
```

#### 3. **الاختبار المبكر** 🧪
```
✅ اختبار Activepieces منفرداً
✅ حل المشاكل مبكراً
✅ فهم API بشكل أفضل
✅ تصميم واجهة أفضل
```

#### 4. **المرونة** 🔄
```
✅ تغيير الواجهة بدون تأثير على Activepieces
✅ استخدام Activepieces من تطبيقات أخرى
✅ APIs جاهزة لأي تطبيق مستقبلي
```

---

## 📝 الخطة التفصيلية (المرحلة 1)

### الأسبوع 1: رفع Activepieces

#### اليوم 1-2: الإعداد المبدئي

```bash
# الخطوة 1: إنشاء مشروع Cloud Run
gcloud run deploy activepieces \
  --image=activepieces/activepieces:latest \
  --platform=managed \
  --region=us-central1 \
  --allow-unauthenticated \
  --min-instances=1 \
  --max-instances=10 \
  --memory=2Gi \
  --set-env-vars="AP_FRONTEND_URL=https://automation.nexxs.ai"

# الخطوة 2: إعداد PostgreSQL
gcloud sql instances create activepieces-db \
  --database-version=POSTGRES_14 \
  --tier=db-f1-micro \
  --region=us-central1

# الخطوة 3: إنشاء قاعدة البيانات
gcloud sql databases create activepieces \
  --instance=activepieces-db
```

#### اليوم 3-4: التكوين

```yaml
# activepieces-config.yaml
environment:
  - name: AP_POSTGRES_DATABASE
    value: activepieces
  - name: AP_POSTGRES_HOST
    value: /cloudsql/YOUR_PROJECT:us-central1:activepieces-db
  - name: AP_POSTGRES_USERNAME
    valueFrom:
      secretKeyRef:
        name: db-credentials
        key: username
  - name: AP_POSTGRES_PASSWORD
    valueFrom:
      secretKeyRef:
        name: db-credentials
        key: password
  - name: AP_FRONTEND_URL
    value: https://automation.nexxs.ai
  - name: AP_BACKEND_URL
    value: https://automation.nexxs.ai/api
  - name: AP_WEBHOOK_SECRETS
    valueFrom:
      secretKeyRef:
        name: ap-secrets
        key: webhook-secret
```

#### اليوم 5-7: الاختبار

```bash
# اختبار الوصول
curl https://automation.nexxs.ai/api/v1/health

# إنشاء مستخدم admin
curl -X POST https://automation.nexxs.ai/api/v1/users \
  -H "Content-Type: application/json" \
  -d '{
    "email": "admin@nexxs.ai",
    "password": "secure_password",
    "firstName": "Admin",
    "lastName": "Nexus"
  }'

# اختبار إنشاء Flow
curl -X POST https://automation.nexxs.ai/api/v1/flows \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "displayName": "Test Flow",
    "projectId": "YOUR_PROJECT_ID"
  }'
```

---

## 📝 الخطة التفصيلية (المرحلة 2)

### الأسبوع 2: بناء API Layer

```typescript
// libs/activepieces-integration/src/index.ts

import { initializeApp } from 'firebase-admin/app';
import { getFirestore } from 'firebase-admin/firestore';
import axios from 'axios';

// Initialize Firebase Admin
const app = initializeApp();
const db = getFirestore(app);

// Activepieces Client
export class ActivepiecesClient {
  private apiUrl = 'https://automation.nexxs.ai/api/v1';
  private apiKey: string;

  constructor(apiKey: string) {
    this.apiKey = apiKey;
  }

  // إنشاء Flow
  async createFlow(tenantId: string, flowData: FlowData) {
    try {
      // 1. التحقق من الاشتراك
      const subscription = await this.checkSubscription(tenantId);
      if (!subscription.active) {
        throw new Error('Subscription not active');
      }

      // 2. التحقق من الحصة
      const hasQuota = await this.checkQuota(tenantId, 'flows');
      if (!hasQuota) {
        throw new Error('Flow quota exceeded');
      }

      // 3. إنشاء Flow في Activepieces
      const response = await axios.post(
        `${this.apiUrl}/flows`,
        {
          displayName: flowData.name,
          projectId: await this.getProjectId(tenantId),
          definition: flowData.definition
        },
        {
          headers: {
            'Authorization': `Bearer ${this.apiKey}`,
            'Content-Type': 'application/json'
          }
        }
      );

      const flow = response.data;

      // 4. حفظ في Firestore
      await db.collection('tenants').doc(tenantId)
        .collection('flows').doc(flow.id).set({
          id: flow.id,
          name: flowData.name,
          status: flow.status,
          createdAt: new Date(),
          definition: flowData.definition
        });

      // 5. تحديث الحصة
      await this.incrementUsage(tenantId, 'flows');

      return flow;
    } catch (error) {
      console.error('Error creating flow:', error);
      throw error;
    }
  }

  // تنفيذ Flow
  async executeFlow(flowId: string, data: any) {
    const response = await axios.post(
      `${this.apiUrl}/flows/${flowId}/execute`,
      { payload: data },
      {
        headers: {
          'Authorization': `Bearer ${this.apiKey}`,
          'Content-Type': 'application/json'
        }
      }
    );
    return response.data;
  }

  // الحصول على Flows للـ Tenant
  async getFlows(tenantId: string) {
    const snapshot = await db.collection('tenants').doc(tenantId)
      .collection('flows').get();
    
    return snapshot.docs.map(doc => doc.data());
  }

  // حذف Flow
  async deleteFlow(tenantId: string, flowId: string) {
    // حذف من Activepieces
    await axios.delete(`${this.apiUrl}/flows/${flowId}`, {
      headers: { 'Authorization': `Bearer ${this.apiKey}` }
    });

    // حذف من Firestore
    await db.collection('tenants').doc(tenantId)
      .collection('flows').doc(flowId).delete();

    // تقليل الحصة
    await this.decrementUsage(tenantId, 'flows');
  }

  // Helper Methods
  private async checkSubscription(tenantId: string) {
    const doc = await db.collection('tenants').doc(tenantId).get();
    return doc.data()?.subscription || { active: false };
  }

  private async checkQuota(tenantId: string, feature: string) {
    const tenant = await db.collection('tenants').doc(tenantId).get();
    const data = tenant.data();
    
    const usage = data?.usage?.[feature] || 0;
    const limit = data?.subscription?.features?.[feature] || 0;
    
    if (limit === -1) return true; // Unlimited
    return usage < limit;
  }

  private async incrementUsage(tenantId: string, feature: string) {
    await db.collection('tenants').doc(tenantId).update({
      [`usage.${feature}`]: FieldValue.increment(1)
    });
  }

  private async decrementUsage(tenantId: string, feature: string) {
    await db.collection('tenants').doc(tenantId).update({
      [`usage.${feature}`]: FieldValue.increment(-1)
    });
  }

  private async getProjectId(tenantId: string) {
    // كل Tenant له Project منفصل في Activepieces
    const doc = await db.collection('tenants').doc(tenantId).get();
    return doc.data()?.activepiecesProjectId;
  }
}
```

---

## 📝 الخطة التفصيلية (المرحلة 3)

### الأسبوع 3: ربط الواجهة

```typescript
// apps/nexus-ai-main/src/services/activepieces.service.ts

import { httpsCallable } from 'firebase/functions';
import { functions } from '@/lib/firebase-config';

export class ActivepiecesService {
  // إنشاء Flow من الواجهة
  async createFlow(flowData: FlowData) {
    const createFlowFunction = httpsCallable(functions, 'createFlow');
    
    try {
      const result = await createFlowFunction({
        name: flowData.name,
        description: flowData.description,
        definition: flowData.definition,
        triggers: flowData.triggers,
        actions: flowData.actions
      });
      
      return result.data;
    } catch (error) {
      console.error('Error creating flow:', error);
      throw error;
    }
  }

  // الحصول على جميع Flows
  async getFlows() {
    const getFlowsFunction = httpsCallable(functions, 'getFlows');
    const result = await getFlowsFunction();
    return result.data;
  }

  // تنفيذ Flow
  async executeFlow(flowId: string, data: any) {
    const executeFlowFunction = httpsCallable(functions, 'executeFlow');
    return await executeFlowFunction({ flowId, data });
  }

  // حذف Flow
  async deleteFlow(flowId: string) {
    const deleteFlowFunction = httpsCallable(functions, 'deleteFlow');
    return await deleteFlowFunction({ flowId });
  }

  // تحديث Flow
  async updateFlow(flowId: string, updates: Partial<FlowData>) {
    const updateFlowFunction = httpsCallable(functions, 'updateFlow');
    return await updateFlowFunction({ flowId, updates });
  }

  // الحصول على إحصائيات Flow
  async getFlowStats(flowId: string) {
    const getFlowStatsFunction = httpsCallable(functions, 'getFlowStats');
    return await getFlowStatsFunction({ flowId });
  }
}

// استخدام في Component
import { ActivepiecesService } from '@/services/activepieces.service';

export function FlowManager() {
  const apService = new ActivepiecesService();
  const [flows, setFlows] = useState([]);

  useEffect(() => {
    async function loadFlows() {
      const data = await apService.getFlows();
      setFlows(data);
    }
    loadFlows();
  }, []);

  const handleCreateFlow = async (flowData) => {
    const newFlow = await apService.createFlow(flowData);
    setFlows([...flows, newFlow]);
  };

  return (
    <div>
      <button onClick={() => handleCreateFlow(...)}>
        Create Flow
      </button>
      {flows.map(flow => (
        <FlowCard key={flow.id} flow={flow} />
      ))}
    </div>
  );
}
```

---

## 🎯 الترتيب النهائي الموصى به

### ✅ المرحلة 1 (الأسبوع 1): رفع Activepieces

```bash
1. إعداد Cloud Run
2. إعداد PostgreSQL
3. تكوين Activepieces
4. اختبار API
5. إنشاء Documentation
```

### ✅ المرحلة 2 (الأسبوع 2): API Layer

```bash
1. بناء Firebase Cloud Functions
2. إنشاء Activepieces Client
3. إضافة Quota Management
4. إضافة Error Handling
5. اختبار APIs
```

### ✅ المرحلة 3 (الأسبوع 3): ربط الواجهة

```bash
1. إنشاء Services في React
2. بناء UI Components
3. إضافة State Management
4. اختبار التكامل
5. نشر التحديث
```

---

## 💡 الخلاصة والتوصية

### ✅ **ابدأ برفع Activepieces أولاً**

**الأسباب:**

1. **🔧 استقلالية كاملة**
   - يعمل بدون الواجهة
   - API جاهزة للاستخدام
   - يمكن اختباره منفرداً

2. **⚡ توفير الوقت**
   - تطوير متوازي
   - اختبار مبكر
   - حل المشاكل بسرعة

3. **📊 أساس قوي**
   - API موثوقة
   - Documentation جاهزة
   - تصميم واجهة أفضل

4. **🔄 مرونة أكبر**
   - استخدام من تطبيقات أخرى
   - تغيير الواجهة بسهولة
   - توسع مستقبلي

---

## 🚀 الخطوة الأولى الآن

### ابدأ بـ:

```bash
# 1. إنشاء مشروع Cloud Run لـ Activepieces
gcloud run deploy activepieces \
  --image=activepieces/activepieces:latest \
  --platform=managed \
  --region=us-central1 \
  --allow-unauthenticated

# 2. إعداد PostgreSQL
gcloud sql instances create activepieces-db \
  --database-version=POSTGRES_14 \
  --tier=db-f1-micro \
  --region=us-central1

# 3. ربط Cloud Run مع SQL
gcloud run services update activepieces \
  --add-cloudsql-instances=YOUR_PROJECT:us-central1:activepieces-db
```

---

## 📋 Checklist

### المرحلة 1: ✅ رفع Activepieces
- [ ] إنشاء Cloud Run Service
- [ ] إعداد PostgreSQL Database
- [ ] تكوين Environment Variables
- [ ] إعداد Custom Domain (automation.nexxs.ai)
- [ ] اختبار API
- [ ] إنشاء Admin User
- [ ] Documentation

### المرحلة 2: ⏳ API Layer (بعد المرحلة 1)
- [ ] بناء Cloud Functions
- [ ] إنشاء Activepieces Client
- [ ] Quota Management
- [ ] Error Handling
- [ ] Testing

### المرحلة 3: ⏳ ربط الواجهة (بعد المرحلة 2)
- [ ] React Services
- [ ] UI Components
- [ ] State Management
- [ ] Integration Testing
- [ ] Deployment

---

**🎯 التوصية النهائية:**

## ✅ ارفع Activepieces أولاً

**ثم** → بناء API Layer

**ثم** → ربط الواجهة

**هذا هو الترتيب الأمثل! 🚀**
