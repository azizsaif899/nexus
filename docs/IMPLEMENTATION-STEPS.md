# 🚀 خطوات التنفيذ الفعلية - Activepieces Integration

## ✅ الملفات التي تم إنشاؤها الآن

### 1. Cloud Functions (Backend)
```
c:\nexus\functions\
├── src\
│   ├── index.ts                    ✅ Entry point
│   └── activepieces\
│       └── proxy.ts                ✅ Main proxy function
├── package.json                     ✅ Dependencies
└── tsconfig.json                    ✅ TypeScript config
```

### 2. React Services (Frontend)
```
c:\nexus\apps\nexus-ai-main\src\
├── services\
│   └── activepieces.service.ts      ✅ API service
├── hooks\
│   └── useActivepieces.ts           ✅ React hooks
└── components\
    └── Activepieces\
        ├── FlowsList.tsx            ✅ Flows list component
        └── QuotaDisplay.tsx         ✅ Quota display component
```

---

## 📝 الخطوات التالية (بالترتيب)

### Step 1: تثبيت Dependencies في Cloud Functions

```bash
cd c:\nexus\functions
npm install
```

هذا سيثبت:
- `firebase-functions` → للـ Cloud Functions
- `firebase-admin` → للتعامل مع Firebase
- `axios` → للطلبات HTTP
- `rate-limiter-flexible` → للـ rate limiting

---

### Step 2: إعداد Firebase Functions

```bash
# في مجلد nexus الرئيسي
firebase init functions
```

اختر:
- ✅ Use existing project: `gen-lang-client-0147492600`
- ✅ Language: TypeScript
- ✅ Use ESLint: Yes
- ❌ Install dependencies now: No (لأننا فعلناها في Step 1)

---

### Step 3: تعديل Environment Variables

أنشئ ملف `.env` في مجلد `functions`:

```bash
# c:\nexus\functions\.env
ACTIVEPIECES_API_URL=http://localhost:3000/api/v1
```

---

### Step 4: Deploy Cloud Function

```bash
cd c:\nexus
firebase deploy --only functions:activepiecesProxy
```

سيعطيك URL مثل:
```
https://us-central1-gen-lang-client-0147492600.cloudfunctions.net/activepiecesProxy
```

---

### Step 5: تحديث React Environment

أضف في `.env` للـ React app:

```bash
# c:\nexus\apps\nexus-ai-main\.env
REACT_APP_ACTIVEPIECES_PROXY_URL=https://us-central1-gen-lang-client-0147492600.cloudfunctions.net/activepiecesProxy
```

---

### Step 6: استخدام Components في React

في أي صفحة React:

```tsx
import { FlowsList } from './components/Activepieces/FlowsList';
import { QuotaDisplay } from './components/Activepieces/QuotaDisplay';

function Dashboard() {
  return (
    <div>
      <QuotaDisplay />
      <FlowsList />
    </div>
  );
}
```

---

### Step 7: إنشاء Firestore Collections

في Firebase Console → Firestore:

```
Collections:
1. activepieces_api_keys
2. activepieces_usage
3. activepieces_subscriptions
```

أو سيتم إنشاؤها تلقائياً عند أول استخدام.

---

### Step 8: تعديل Firestore Rules

```javascript
// Firebase Console → Firestore → Rules
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    
    // Activepieces data - only accessible by owner
    match /activepieces_api_keys/{userId} {
      allow read, write: if request.auth != null && request.auth.uid == userId;
    }
    
    match /activepieces_usage/{userId}/{document=**} {
      allow read: if request.auth != null && request.auth.uid == userId;
      allow write: if false; // Only Cloud Functions can write
    }
    
    match /activepieces_subscriptions/{userId} {
      allow read: if request.auth != null && request.auth.uid == userId;
      allow write: if false; // Only admins can write
    }
  }
}
```

---

## 🧪 الاختبار

### Test 1: Test Cloud Function محلياً

```bash
cd c:\nexus\functions
npm run serve
```

ثم في terminal آخر:

```bash
curl -X GET http://localhost:5001/gen-lang-client-0147492600/us-central1/activepiecesProxy/flows \
  -H "Authorization: Bearer YOUR_FIREBASE_TOKEN"
```

### Test 2: Test React Components

```bash
cd c:\nexus\apps\nexus-ai-main
npm start
```

افتح المتصفح وسجل دخول، ستشاهد:
- QuotaDisplay → يعرض الحصة
- FlowsList → يعرض الـ flows

---

## 🔄 التكامل مع Activepieces المحلي

إذا كان Activepieces يعمل على `localhost:8080`:

```typescript
// في functions/src/activepieces/proxy.ts
// غير هذا السطر:
const ACTIVEPIECES_API_URL = 'http://localhost:3000/api/v1';

// إلى:
const ACTIVEPIECES_API_URL = 'http://host.docker.internal:3000/api/v1';
// أو
const ACTIVEPIECES_API_URL = 'http://YOUR_LOCAL_IP:3000/api/v1';
```

---

## 📊 المراقبة

### في Firebase Console:

1. **Functions** → `activepiecesProxy` → Logs
2. **Firestore** → `activepieces_usage` → شاهد الاستخدام
3. **Authentication** → Users → تحقق من المستخدمين

---

## ⚠️ Troubleshooting

### Error: "Module not found"
```bash
cd c:\nexus\functions
npm install
npm run build
```

### Error: "CORS"
تحقق من أن Cloud Function يسمح بـ CORS (موجود في الكود).

### Error: "401 Unauthorized"
تحقق من Firebase token:
```typescript
const user = firebase.auth().currentUser;
const token = await user?.getIdToken();
console.log(token); // تأكد أنه موجود
```

### Error: "Quota exceeded"
افحص Firestore:
```javascript
// في Firestore Console
activepieces_subscriptions/[userId]
{
  plan: "free",
  monthlyQuota: 1000  // زوده إلى 10000 للاختبار
}
```

---

## 🎯 Next Steps

بعد ما كل شيء يشتغل:

1. ✅ أضف المزيد من Components (FlowBuilder, ExecutionHistory)
2. ✅ أضف Payment integration (Stripe)
3. ✅ Deploy إلى Production (Cloud Run + Cloud SQL)
4. ✅ أضف Analytics dashboard
5. ✅ أضف Email notifications

---

## 📚 الملفات المهمة للمراجعة

1. **`functions/src/activepieces/proxy.ts`**
   - الكود الرئيسي للـ proxy
   - Rate limiting
   - Quota checking
   - API key management

2. **`apps/nexus-ai-main/src/services/activepieces.service.ts`**
   - كل الـ API methods
   - Error handling
   - TypeScript types

3. **`apps/nexus-ai-main/src/hooks/useActivepieces.ts`**
   - React hooks جاهزة للاستخدام
   - State management
   - Auto-refresh

4. **`apps/nexus-ai-main/src/components/Activepieces/`**
   - UI components جاهزة
   - Tailwind CSS styling
   - Responsive design

---

**الآن كل شيء حقيقي وموجود - جاهز للتنفيذ! 🚀**
