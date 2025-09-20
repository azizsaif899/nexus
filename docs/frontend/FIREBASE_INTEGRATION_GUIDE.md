# 🔥 دليل تكامل Firebase مع Nexus.AI

## 📋 نظرة عامة

سنعتمد بالكامل على خدمات Firebase المجانية لتشغيل Nexus.AI، مما يوفر حلاً متكاملاً ومجانياً للبدء.

---

## 🔥 خدمات Firebase المستخدمة

### ✅ الخدمات الأساسية:
- **Firebase Authentication** - إدارة المستخدمين والمصادقة
- **Firebase Data Connect** - قاعدة بيانات GraphQL
- **Firebase Functions** - الوظائف الخلفية
- **Firebase Storage** - تخزين الملفات
- **Firebase Hosting** - استضافة التطبيق
- **Firebase Analytics** - تحليلات الاستخدام

---

## 🚀 إعداد Firebase

### 1. إنشاء مشروع Firebase:
```bash
# تثبيت Firebase CLI
npm install -g firebase-tools

# تسجيل الدخول
firebase login

# إنشاء مشروع جديد
firebase projects:create nexus-ai-azizsys

# ربط المشروع
firebase use nexus-ai-azizsys
```

### 2. تفعيل الخدمات:
```bash
# تفعيل Authentication
firebase auth:enable

# تفعيل Data Connect
firebase dataconnect:enable

# تفعيل Functions
firebase functions:enable

# تفعيل Storage
firebase storage:enable

# تفعيل Hosting
firebase hosting:enable
```

### 3. إعداد ملف firebase.json:
```json
{
  "hosting": {
    "public": "dist",
    "ignore": ["firebase.json", "**/.*", "**/node_modules/**"],
    "rewrites": [
      {
        "source": "**",
        "destination": "/index.html"
      }
    ]
  },
  "functions": {
    "source": "functions",
    "runtime": "nodejs18"
  },
  "dataconnect": {
    "source": "dataconnect",
    "serviceId": "nexus-ai-dataconnect"
  },
  "storage": {
    "rules": "storage.rules"
  }
}
```

---

## 🔐 Firebase Authentication

### إعداد المصادقة:
```typescript
// src/services/auth.service.ts
import { 
  signInWithEmailAndPassword, 
  createUserWithEmailAndPassword,
  signOut, 
  onAuthStateChanged,
  User
} from 'firebase/auth';
import { auth } from '../config/firebase';

export class AuthService {
  // تسجيل الدخول
  async login(email: string, password: string) {
    try {
      const result = await signInWithEmailAndPassword(auth, email, password);
      return { success: true, user: result.user };
    } catch (error) {
      return { success: false, error: error.message };
    }
  }

  // إنشاء حساب جديد
  async register(email: string, password: string) {
    try {
      const result = await createUserWithEmailAndPassword(auth, email, password);
      return { success: true, user: result.user };
    } catch (error) {
      return { success: false, error: error.message };
    }
  }

  // تسجيل الخروج
  async logout() {
    return await signOut(auth);
  }

  // مراقبة حالة المستخدم
  onAuthStateChange(callback: (user: User | null) => void) {
    return onAuthStateChanged(auth, callback);
  }

  // الحصول على المستخدم الحالي
  getCurrentUser() {
    return auth.currentUser;
  }

  // الحصول على التوكن
  async getIdToken() {
    const user = auth.currentUser;
    return user ? await user.getIdToken() : null;
  }
}
```

### React Hook للمصادقة:
```typescript
// src/hooks/useAuth.ts
import { useState, useEffect } from 'react';
import { User } from 'firebase/auth';
import { AuthService } from '../services/auth.service';

const authService = new AuthService();

export const useAuth = () => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = authService.onAuthStateChange((user) => {
      setUser(user);
      setLoading(false);
    });

    return unsubscribe;
  }, []);

  const login = async (email: string, password: string) => {
    setLoading(true);
    const result = await authService.login(email, password);
    setLoading(false);
    return result;
  };

  const logout = async () => {
    setLoading(true);
    await authService.logout();
    setLoading(false);
  };

  return {
    user,
    loading,
    login,
    logout,
    isAuthenticated: !!user
  };
};
```

---

## 📊 Firebase Data Connect

### إعداد Schema:
```graphql
# dataconnect/schema/nexus.gql
type User @table {
  id: String! @default(expr: "auth.uid")
  email: String! @col(dataType: "varchar(255)")
  displayName: String @col(dataType: "varchar(100)")
  role: String! @col(dataType: "varchar(20)") @default(value: "user")
  createdAt: Timestamp! @default(expr: "request.time")
  lastActiveAt: Timestamp @default(expr: "request.time")
}

type Customer @table {
  id: UUID! @default(expr: "uuidV4()")
  name: String! @col(dataType: "varchar(200)")
  email: String @col(dataType: "varchar(255)")
  phone: String @col(dataType: "varchar(20)")
  company: String @col(dataType: "varchar(200)")
  status: String! @col(dataType: "varchar(20)") @default(value: "active")
  createdBy: User!
  createdAt: Timestamp! @default(expr: "request.time")
  updatedAt: Timestamp @default(expr: "request.time")
}

type Lead @table {
  id: UUID! @default(expr: "uuidV4()")
  name: String! @col(dataType: "varchar(200)")
  email: String @col(dataType: "varchar(255)")
  phone: String @col(dataType: "varchar(20)")
  source: String @col(dataType: "varchar(100)")
  stage: String! @col(dataType: "varchar(50)") @default(value: "new")
  score: Int @default(value: 0)
  expectedRevenue: Float @default(value: 0)
  assignedTo: User
  createdAt: Timestamp! @default(expr: "request.time")
  updatedAt: Timestamp @default(expr: "request.time")
}

type ChatSession @table {
  id: UUID! @default(expr: "uuidV4()")
  user: User!
  agentType: String! @col(dataType: "varchar(50)")
  title: String @col(dataType: "varchar(200)")
  createdAt: Timestamp! @default(expr: "request.time")
  updatedAt: Timestamp @default(expr: "request.time")
  isActive: Boolean! @default(value: true)
}

type Message @table {
  id: UUID! @default(expr: "uuidV4()")
  session: ChatSession!
  role: String! @col(dataType: "varchar(20)")
  content: String! @col(dataType: "text")
  metadata: String @col(dataType: "jsonb")
  createdAt: Timestamp! @default(expr: "request.time")
}
```

### Operations (الاستعلامات):
```graphql
# dataconnect/operations/customers.gql
query GetCustomers {
  customers(orderBy: { createdAt: DESC }) {
    id
    name
    email
    phone
    company
    status
    createdAt
  }
}

mutation CreateCustomer($name: String!, $email: String, $phone: String, $company: String) {
  customer_insert(data: {
    name: $name
    email: $email
    phone: $phone
    company: $company
  }) {
    id
    name
    createdAt
  }
}

mutation UpdateCustomer($id: UUID!, $name: String, $email: String, $phone: String, $company: String, $status: String) {
  customer_update(id: $id, data: {
    name: $name
    email: $email
    phone: $phone
    company: $company
    status: $status
    updatedAt: "request.time"
  }) {
    id
    name
    updatedAt
  }
}
```

### خدمة البيانات:
```typescript
// src/services/data.service.ts
import { executeQuery, executeMutation } from '@firebase/data-connect';
import { dataConnect } from '../config/firebase';

export class DataService {
  // العملاء
  async getCustomers() {
    const query = `
      query GetCustomers {
        customers(orderBy: { createdAt: DESC }) {
          id name email phone company status createdAt
        }
      }
    `;
    return await executeQuery(dataConnect, query);
  }

  async createCustomer(customerData: any) {
    const mutation = `
      mutation CreateCustomer($name: String!, $email: String, $phone: String, $company: String) {
        customer_insert(data: {
          name: $name, email: $email, phone: $phone, company: $company
        }) {
          id name createdAt
        }
      }
    `;
    return await executeMutation(dataConnect, mutation, customerData);
  }

  // العملاء المحتملين
  async getLeads() {
    const query = `
      query GetLeads {
        leads(orderBy: { createdAt: DESC }) {
          id name email phone source stage score expectedRevenue createdAt
        }
      }
    `;
    return await executeQuery(dataConnect, query);
  }

  async updateLeadStage(leadId: string, stage: string) {
    const mutation = `
      mutation UpdateLeadStage($id: UUID!, $stage: String!) {
        lead_update(id: $id, data: { stage: $stage, updatedAt: "request.time" }) {
          id stage updatedAt
        }
      }
    `;
    return await executeMutation(dataConnect, mutation, { id: leadId, stage });
  }

  // جلسات الدردشة
  async createChatSession(agentType: string, title?: string) {
    const mutation = `
      mutation CreateChatSession($agentType: String!, $title: String) {
        chatSession_insert(data: { agentType: $agentType, title: $title }) {
          id createdAt
        }
      }
    `;
    return await executeMutation(dataConnect, mutation, { agentType, title });
  }

  async addMessage(sessionId: string, role: string, content: string, metadata?: any) {
    const mutation = `
      mutation AddMessage($sessionId: UUID!, $role: String!, $content: String!, $metadata: String) {
        message_insert(data: {
          session: { id: $sessionId }
          role: $role
          content: $content
          metadata: $metadata
        }) {
          id createdAt
        }
      }
    `;
    return await executeMutation(dataConnect, mutation, {
      sessionId,
      role,
      content,
      metadata: metadata ? JSON.stringify(metadata) : null
    });
  }
}
```

---

## ⚡ Firebase Functions

### إعداد Functions:
```typescript
// functions/src/index.ts
import { onRequest } from 'firebase-functions/v2/https';
import { onDocumentCreated } from 'firebase-functions/v2/firestore';
import { setGlobalOptions } from 'firebase-functions/v2';

setGlobalOptions({ region: 'us-central1' });

// API للذكاء الاصطناعي
export const aiChat = onRequest(async (req, res) => {
  try {
    const { message, sessionId, agentType } = req.body;
    
    // معالجة الرسالة بالذكاء الاصطناعي
    const aiResponse = await processAIMessage(message, agentType);
    
    // حفظ الرسالة في قاعدة البيانات
    await saveMessage(sessionId, 'assistant', aiResponse);
    
    res.json({ success: true, response: aiResponse });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

// معالجة العملاء المحتملين الجدد
export const processNewLead = onDocumentCreated('leads/{leadId}', async (event) => {
  const leadData = event.data?.data();
  
  if (leadData) {
    // تحليل العميل المحتمل
    const score = calculateLeadScore(leadData);
    
    // تحديث النقاط
    await event.data?.ref.update({ score });
    
    // إرسال إشعار للفريق
    if (score > 80) {
      await sendHighPriorityNotification(leadData);
    }
  }
});

// دوال مساعدة
async function processAIMessage(message: string, agentType: string): Promise<string> {
  // تكامل مع Gemini AI أو OpenAI
  // معالجة الرسالة وإرجاع الرد
  return `AI Response for ${agentType}: ${message}`;
}

function calculateLeadScore(leadData: any): number {
  let score = 0;
  
  // نقاط حسب المصدر
  if (leadData.source === 'website') score += 20;
  if (leadData.source === 'referral') score += 40;
  
  // نقاط حسب البيانات المتوفرة
  if (leadData.email) score += 20;
  if (leadData.phone) score += 20;
  if (leadData.company) score += 20;
  
  return Math.min(score, 100);
}
```

---

## 📱 React Hooks للبيانات

### Hook للعملاء:
```typescript
// src/hooks/useCustomers.ts
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { DataService } from '../services/data.service';

const dataService = new DataService();

export const useCustomers = () => {
  return useQuery({
    queryKey: ['customers'],
    queryFn: () => dataService.getCustomers(),
    staleTime: 5 * 60 * 1000, // 5 دقائق
  });
};

export const useCreateCustomer = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: (customerData: any) => dataService.createCustomer(customerData),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['customers'] });
    },
  });
};
```

### Hook للعملاء المحتملين:
```typescript
// src/hooks/useLeads.ts
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { DataService } from '../services/data.service';

const dataService = new DataService();

export const useLeads = () => {
  return useQuery({
    queryKey: ['leads'],
    queryFn: () => dataService.getLeads(),
    staleTime: 2 * 60 * 1000, // دقيقتان
  });
};

export const useUpdateLeadStage = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: ({ leadId, stage }: { leadId: string; stage: string }) => 
      dataService.updateLeadStage(leadId, stage),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['leads'] });
    },
  });
};
```

---

## 🔧 إعداد البيئة

### ملف .env:
```bash
# Firebase Configuration
REACT_APP_FIREBASE_API_KEY=your-api-key
REACT_APP_FIREBASE_AUTH_DOMAIN=nexus-ai-azizsys.firebaseapp.com
REACT_APP_FIREBASE_PROJECT_ID=nexus-ai-azizsys
REACT_APP_FIREBASE_STORAGE_BUCKET=nexus-ai-azizsys.appspot.com
REACT_APP_FIREBASE_MESSAGING_SENDER_ID=your-sender-id
REACT_APP_FIREBASE_APP_ID=your-app-id

# Data Connect Configuration
REACT_APP_DATA_CONNECT_CONNECTOR=default
REACT_APP_DATA_CONNECT_LOCATION=us-central1

# Environment
REACT_APP_ENVIRONMENT=development
```

### Firebase Config:
```typescript
// src/config/firebase.ts
import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getFunctions } from 'firebase/functions';
import { getStorage } from 'firebase/storage';
import { getAnalytics } from 'firebase/analytics';
import { connectDataConnect } from '@firebase/data-connect';

const firebaseConfig = {
  apiKey: process.env.REACT_APP_FIREBASE_API_KEY,
  authDomain: process.env.REACT_APP_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.REACT_APP_FIREBASE_PROJECT_ID,
  storageBucket: process.env.REACT_APP_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.REACT_APP_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.REACT_APP_FIREBASE_APP_ID
};

// تهيئة Firebase
const app = initializeApp(firebaseConfig);

// تصدير الخدمات
export const auth = getAuth(app);
export const functions = getFunctions(app);
export const storage = getStorage(app);
export const analytics = getAnalytics(app);

// Data Connect
export const dataConnect = connectDataConnect(app, {
  connector: process.env.REACT_APP_DATA_CONNECT_CONNECTOR || 'default',
  location: process.env.REACT_APP_DATA_CONNECT_LOCATION || 'us-central1'
});

export default app;
```

---

## 🚀 النشر على Firebase

### أوامر النشر:
```bash
# بناء التطبيق
npm run build

# نشر على Firebase Hosting
firebase deploy --only hosting

# نشر Functions
firebase deploy --only functions

# نشر Data Connect
firebase deploy --only dataconnect

# نشر كل شيء
firebase deploy
```

### إعداد CI/CD:
```yaml
# .github/workflows/firebase-deploy.yml
name: Deploy to Firebase
on:
  push:
    branches: [ main ]

jobs:
  deploy:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      
      - name: Setup Node.js
        uses: actions/setup-node@v3
        with:
          node-version: '18'
          
      - name: Install dependencies
        run: npm install
        
      - name: Build
        run: npm run build
        
      - name: Deploy to Firebase
        uses: FirebaseExtended/action-hosting-deploy@v0
        with:
          repoToken: '${{ secrets.GITHUB_TOKEN }}'
          firebaseServiceAccount: '${{ secrets.FIREBASE_SERVICE_ACCOUNT }}'
          projectId: nexus-ai-azizsys
```

---

## 💰 حدود الخطة المجانية

### 🔥 Firebase Free Tier:
- **Authentication**: 10,000 مستخدم شهرياً
- **Data Connect**: 1GB تخزين، 10GB نقل
- **Functions**: 125,000 استدعاء، 40,000 ثانية GB
- **Storage**: 5GB تخزين، 1GB نقل يومياً
- **Hosting**: 10GB تخزين، 360MB نقل يومياً

### 📊 مراقبة الاستخدام:
```typescript
// src/utils/usage-monitor.ts
export const trackUsage = {
  // تتبع استدعاءات Functions
  trackFunctionCall: (functionName: string) => {
    // Removed console.log}`);
    // إرسال إلى Analytics
  },
  
  // تتبع استعلامات البيانات
  trackDataQuery: (queryName: string, resultCount: number) => {
    // Removed console.log
  },
  
  // تتبع تحميل الملفات
  trackFileUpload: (fileSize: number) => {
    // Removed console.log
  }
};
```

---

**🔥 Firebase يوفر حلاً متكاملاً ومجانياً مثالياً لبدء Nexus.AI! 🔥**