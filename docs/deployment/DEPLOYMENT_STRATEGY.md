# 🚀 استراتيجية النشر الشاملة - Nexus AI

## 📊 **التوزيع المقترح**

### **Frontend Apps → Firebase Hosting**
```
nexus-ai-main.web.app       → التطبيق الرئيسي
admin.nexus-ai.web.app      → لوحة الإدارة
crm.nexus-ai.web.app        → نظام CRM
chat.nexus-ai.web.app       → تطبيق المحادثة
```

### **Backend API → Cloud Run**
```
api.nexus-ai.com            → NestJS API
Port: 8080 (Cloud Run default)
Auto-scaling: 0-100 instances
```

### **Database → Firebase + PostgreSQL**
```
Firestore                   → Real-time data
PostgreSQL (Cloud SQL)      → Relational data
Redis (Memorystore)         → Cache
```

---

## 🏗️ **معمارية النشر**

```
┌─────────────────────────────────────────────┐
│         Cloud Load Balancer                 │
│         nexus-ai.com                        │
└─────────────────────────────────────────────┘
                    │
        ┌───────────┴───────────┐
        │                       │
┌───────▼────────┐    ┌────────▼────────┐
│ Firebase       │    │ Cloud Run       │
│ Hosting        │    │ (API)           │
│ - nexus-ai     │    │ - NestJS        │
│ - admin        │    │ - WebSocket     │
│ - crm          │    │ - AI Services   │
│ - chat         │    └─────────────────┘
└────────────────┘              │
        │                       │
        └───────────┬───────────┘
                    │
        ┌───────────▼───────────┐
        │   Firebase Services   │
        │ - Firestore           │
        │ - Authentication      │
        │ - Storage             │
        │ - Functions           │
        └───────────────────────┘
```

---

## 💰 **إدارة المستخدمين والدفع**

### **1. Firebase Authentication**
```typescript
// packages/core/auth/src/auth-service.ts
import { getAuth } from 'firebase/auth';

export class AuthService {
  // Free tier: Email/Password
  async signUp(email: string, password: string) {
    return await createUserWithEmailAndPassword(auth, email, password);
  }
  
  // Premium: Google, GitHub OAuth
  async signInWithGoogle() {
    return await signInWithPopup(auth, googleProvider);
  }
}
```

### **2. نظام الاشتراكات (Subscription System)**

```typescript
// packages/domain/billing-core/src/subscription.service.ts
export interface SubscriptionPlan {
  id: string;
  name: 'free' | 'pro' | 'enterprise';
  price: number;
  features: {
    aiRequests: number;      // Free: 100, Pro: 10000, Enterprise: unlimited
    storage: number;         // GB
    users: number;
    support: 'community' | 'email' | '24/7';
  };
}

export class SubscriptionService {
  async createSubscription(userId: string, planId: string) {
    // Integration with Stripe/Paddle
    const subscription = await stripe.subscriptions.create({
      customer: userId,
      items: [{ price: planId }],
    });
    
    // Save to Firestore
    await db.collection('subscriptions').doc(userId).set({
      planId,
      status: 'active',
      startDate: new Date(),
      features: this.getPlanFeatures(planId)
    });
  }
  
  async checkQuota(userId: string, resource: string): Promise<boolean> {
    const subscription = await this.getUserSubscription(userId);
    const usage = await this.getUsage(userId, resource);
    return usage < subscription.features[resource];
  }
}
```

### **3. بوابات الدفع المقترحة**

```typescript
// config/payment/payment-providers.ts
export const PAYMENT_PROVIDERS = {
  // للسوق السعودي
  stripe: {
    enabled: true,
    currencies: ['SAR', 'USD'],
    methods: ['card', 'apple_pay', 'google_pay']
  },
  
  // للسوق العربي
  paddle: {
    enabled: true,
    currencies: ['SAR', 'AED', 'USD'],
    vat: true  // ضريبة القيمة المضافة
  },
  
  // محلي سعودي
  moyasar: {
    enabled: true,
    currencies: ['SAR'],
    methods: ['mada', 'visa', 'mastercard', 'apple_pay']
  }
};
```

---

## 🔐 **إدارة المستخدمين (User Management)**

### **Schema في Firestore**
```typescript
// users collection
{
  uid: string;
  email: string;
  displayName: string;
  role: 'user' | 'admin' | 'enterprise';
  subscription: {
    planId: string;
    status: 'active' | 'cancelled' | 'expired';
    currentPeriodEnd: Timestamp;
  };
  usage: {
    aiRequests: number;
    storage: number;
    lastReset: Timestamp;
  };
  metadata: {
    createdAt: Timestamp;
    lastLogin: Timestamp;
    ipAddress: string;
  };
}
```

### **Middleware للتحقق من الصلاحيات**
```typescript
// apps/api/src/guards/subscription.guard.ts
@Injectable()
export class SubscriptionGuard implements CanActivate {
  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest();
    const user = request.user;
    
    // Check subscription status
    const subscription = await this.subscriptionService.get(user.uid);
    if (subscription.status !== 'active') {
      throw new ForbiddenException('Subscription expired');
    }
    
    // Check quota
    const hasQuota = await this.subscriptionService.checkQuota(
      user.uid, 
      'aiRequests'
    );
    if (!hasQuota) {
      throw new ForbiddenException('Quota exceeded');
    }
    
    return true;
  }
}

// Usage
@Post('chat')
@UseGuards(JwtAuthGuard, SubscriptionGuard)
async chat(@Body() dto: ChatDto) {
  return this.aiService.chat(dto);
}
```

---

## 📦 **سكريبت النشر الموحد**

```bash
# scripts/deploy-all.sh
#!/bin/bash

echo "🚀 Building all apps..."
nx run-many -t build --configuration=production

echo "📦 Deploying Frontend to Firebase..."
firebase deploy --only hosting

echo "🐳 Building API Docker image..."
docker build -t gcr.io/nexus-ai/api:latest -f apps/api/Dockerfile .

echo "☁️ Deploying API to Cloud Run..."
gcloud run deploy nexus-api \
  --image gcr.io/nexus-ai/api:latest \
  --platform managed \
  --region us-central1 \
  --allow-unauthenticated \
  --min-instances 1 \
  --max-instances 100 \
  --memory 2Gi \
  --cpu 2

echo "✅ Deployment complete!"
```

---

## 💵 **نموذج التسعير المقترح**

```typescript
export const PRICING_PLANS = {
  free: {
    price: 0,
    currency: 'SAR',
    features: {
      aiRequests: 100,        // 100 طلب/شهر
      storage: 1,             // 1 GB
      users: 1,
      crm: false,
      automation: false,
      support: 'community'
    }
  },
  
  pro: {
    price: 99,               // 99 ريال/شهر
    currency: 'SAR',
    features: {
      aiRequests: 10000,
      storage: 50,
      users: 5,
      crm: true,
      automation: true,
      support: 'email'
    }
  },
  
  enterprise: {
    price: 499,              // 499 ريال/شهر
    currency: 'SAR',
    features: {
      aiRequests: -1,        // unlimited
      storage: 500,
      users: -1,             // unlimited
      crm: true,
      automation: true,
      whatsapp: true,
      customAI: true,
      support: '24/7'
    }
  }
};
```

---

## 🎯 **خطة التنفيذ**

### **المرحلة 1: إعداد البنية التحتية (أسبوع 1)**
- [ ] إنشاء Firebase projects منفصلة
- [ ] إعداد Cloud Run للـ API
- [ ] إعداد Cloud SQL (PostgreSQL)
- [ ] إعداد Redis Cache

### **المرحلة 2: نظام الاشتراكات (أسبوع 2)**
- [ ] تكامل Stripe/Moyasar
- [ ] Subscription Service
- [ ] Quota Management
- [ ] Billing Dashboard

### **المرحلة 3: إدارة المستخدمين (أسبوع 3)**
- [ ] User Management Dashboard
- [ ] Role-based Access Control
- [ ] Usage Analytics
- [ ] Email Notifications

### **المرحلة 4: النشر والاختبار (أسبوع 4)**
- [ ] CI/CD Pipeline
- [ ] Load Testing
- [ ] Security Audit
- [ ] Production Deployment

---

## 📊 **التكاليف المتوقعة (شهرياً)**

```
Firebase Hosting:     $0 - $25    (حسب الترافيك)
Cloud Run:            $50 - $200  (حسب الاستخدام)
Cloud SQL:            $50 - $150  (db-f1-micro)
Redis:                $30 - $100  (M1)
Firebase Services:    $25 - $100  (Firestore, Storage)
────────────────────────────────────────────
الإجمالي:            $155 - $575/شهر
```

**الإيرادات المتوقعة** (100 مستخدم):
- 70 Free: 0 ريال
- 25 Pro: 2,475 ريال
- 5 Enterprise: 2,495 ريال
- **الإجمالي: 4,970 ريال/شهر (~$1,325)**

---

## 🔧 **الأدوات المطلوبة**

```bash
# تثبيت الأدوات
npm install -g firebase-tools
npm install -g @google-cloud/cli
npm install stripe @stripe/stripe-js
npm install @nestjs/throttler  # Rate limiting
```

---

## 🎯 **التوصية النهائية**

**للبدء السريع:**
1. استخدم Firebase Hosting لكل التطبيقات
2. Cloud Run للـ API
3. Stripe للدفع (يدعم السعودية)
4. ابدأ بـ Free tier ثم وسّع

**للنمو:**
1. انقل لـ Kubernetes (GKE)
2. أضف CDN (Cloudflare)
3. Multi-region deployment
4. Custom domain + SSL
