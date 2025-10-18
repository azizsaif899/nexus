# 🔥 دليل إعداد Firebase Studio مع FlowCanvasAI

## 📋 المتطلبات الأساسية

### 1. إنشاء مشروع Firebase جديد

#### 🔗 انتقل إلى Firebase Console
```
https://console.firebase.google.com
```

#### ➕ إنشاء مشروع جديد
1. اضغط على **"Create a project"** أو **"إضافة مشروع"**
2. أدخل اسم المشروع: `flowcanvas-ai`
3. اختر إعدادات Google Analytics (اختياري)
4. اضغط **"Create project"**

### 2. إعداد Web App في Firebase

#### 🌐 إضافة تطبيق ويب
```javascript
// في Firebase Console
1. اختر مشروعك
2. اضغط على أيقونة الويب </>
3. أدخل اسم التطبيق: "FlowCanvasAI Web"
4. تفعيل Firebase Hosting (اختياري)
5. اضغط "Register app"
```

#### 🔑 الحصول على Configuration Keys
```javascript
// Firebase سيعطيك هذه المعلومات:
const firebaseConfig = {
  apiKey: "AIzaSyXXXXXXXXXXXXXXXXXXXXXXXX",
  authDomain: "flowcanvas-ai.firebaseapp.com",
  projectId: "flowcanvas-ai",
  storageBucket: "flowcanvas-ai.appspot.com",
  messagingSenderId: "123456789012",
  appId: "1:123456789012:web:abcdef123456789012345",
  measurementId: "G-XXXXXXXXXX"
};
```

## 🗄️ إعداد قواعد البيانات

### 1. Firestore Database

#### 📊 إنشاء قاعدة البيانات
```javascript
// في Firebase Console:
1. اذهب إلى "Firestore Database"
2. اضغط "Create database"
3. اختر "Start in test mode" للبداية
4. اختر موقع البيانات (أقرب منطقة)
```

#### 🔐 قواعد الأمان الأساسية
```javascript
// Firestore Rules
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    // Allow read/write access for authenticated users
    match /users/{userId} {
      allow read, write: if request.auth != null && 
                           request.auth.uid == userId;
    }
    
    // Workflows - private to user
    match /workflows/{workflowId} {
      allow read, write: if request.auth != null && 
                           resource.data.ownerId == request.auth.uid;
    }
    
    // Conversations - private to user
    match /conversations/{conversationId} {
      allow read, write: if request.auth != null && 
                           resource.data.userId == request.auth.uid;
    }
    
    // Public read for design components
    match /designComponents/{componentId} {
      allow read: if true;
      allow write: if request.auth != null;
    }
    
    // Templates - public read, authenticated write
    match /templates/{templateId} {
      allow read: if true;
      allow write: if request.auth != null;
    }
  }
}
```

### 2. Firebase Storage

#### 📁 إعداد التخزين
```javascript
// في Firebase Console:
1. اذهب إلى "Storage"
2. اضغط "Get started"
3. اختر قواعد الأمان
4. اختر موقع التخزين
```

#### 🔐 قواعد أمان Storage
```javascript
// Storage Rules
rules_version = '2';
service firebase.storage {
  match /b/{bucket}/o {
    // User assets folder
    match /user-assets/{userId}/{allPaths=**} {
      allow read, write: if request.auth != null && 
                           request.auth.uid == userId;
    }
    
    // Public assets folder
    match /public-assets/{allPaths=**} {
      allow read: if true;
      allow write: if request.auth != null;
    }
    
    // Workflow exports
    match /workflow-exports/{userId}/{allPaths=**} {
      allow read, write: if request.auth != null && 
                           request.auth.uid == userId;
    }
  }
}
```

### 3. Firebase Authentication

#### 🔐 إعداد المصادقة
```javascript
// في Firebase Console:
1. اذهب إلى "Authentication"
2. اضغط "Get started"
3. في تبويب "Sign-in method"
4. فعّل الطرق المطلوبة:
   - Email/Password
   - Google
   - Anonymous (للتجربة)
```

## 📝 إعداد متغيرات البيئة

### 1. إنشاء ملف `.env.local`

```bash
# Firebase Configuration
NEXT_PUBLIC_FIREBASE_API_KEY=AIzaSyXXXXXXXXXXXXXXXXXXXXXXXX
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=flowcanvas-ai.firebaseapp.com
NEXT_PUBLIC_FIREBASE_PROJECT_ID=flowcanvas-ai
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=flowcanvas-ai.appspot.com
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=123456789012
NEXT_PUBLIC_FIREBASE_APP_ID=1:123456789012:web:abcdef123456789012345
NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID=G-XXXXXXXXXX

# Gemini AI Configuration
NEXT_PUBLIC_GEMINI_API_KEY=your_gemini_api_key_here
GEMINI_API_KEY=your_gemini_api_key_here

# App Configuration
NEXT_PUBLIC_APP_URL=http://localhost:3000
NODE_ENV=development
```

## 🗂️ **هيكل قاعدة البيانات المُنشأ تلقائياً**

### **📂 Collections الرئيسية:**

#### **1. users** - ملفات المستخدمين
```javascript
{
  "users/{userId}": {
    id: "user_456",
    email: "user@example.com",
    displayName: "اسم المستخدم",
    photoURL: "https://...",
    preferences: {
      language: "ar",
      theme: "dark",
      notifications: true
    },
    subscription: {
      plan: "free",
      features: ["basic_workflows", "ai_chat"]
    },
    createdAt: "2024-01-15T10:30:00Z",
    updatedAt: "2024-01-15T10:30:00Z"
  }
}
```

#### **2. workflows** - مشاريع سير العمل
```javascript
{
  "workflows/{workflowId}": {
    id: "workflow_123",
    ownerId: "user_456",
    title: "نظام التصميم v2.0",
    description: "مخطط لنظام تصميم متقدم",
    nodes: [...], // العقد والمكونات
    connections: [...], // الروابط بين العقد
    settings: {
      autoSave: true,
      public: false,
      tags: ["design", "system", "ui"]
    },
    stats: {
      views: 45,
      clones: 3,
      executions: 12
    },
    version: 1,
    createdAt: "2024-01-15T10:30:00Z",
    updatedAt: "2024-01-15T10:30:00Z"
  }
}
```

#### **3. conversations** - محادثات AI
```javascript
{
  "conversations/{conversationId}": {
    id: "conv_789",
    userId: "user_456",
    title: "مساعدة التصميم", 
    messages: [
      {
        role: "user",
        content: "كيف أستورد من Figma؟",
        timestamp: "2024-01-15T10:30:00Z"
      },
      {
        role: "assistant", 
        content: "يمكنك الاستيراد بنسخ رابط الملف...",
        timestamp: "2024-01-15T10:31:00Z"
      }
    ],
    context: {
      workflowId: "workflow_123",
      userIntent: "help_with_figma"
    },
    metadata: {
      model: "gemini-2.0-flash",
      tokens: 250,
      cost: 0.001
    },
    createdAt: "2024-01-15T09:00:00Z",
    updatedAt: "2024-01-15T10:30:00Z"
  }
}
```

#### **4. designComponents** - مكتبة المكونات
```javascript
{
  "designComponents/{componentId}": {
    id: "comp_001",
    name: "زر حديث",
    type: "BUTTON",
    category: "actions", 
    isPublic: true,
    codeSnippet: {
      react: "<Button className='...'>اضغط هنا</Button>",
      html: "<button class='...'>اضغط هنا</button>",
      vue: "<button class='...'>اضغط هنا</button>"
    },
    createdBy: "user_456",
    tags: ["button", "modern", "primary"],
    usage: {
      downloads: 156,
      likes: 23,
      views: 892
    },
    createdAt: "2024-01-10T14:00:00Z"
  }
}
```

---

## 🔐 **قواعد الأمان المُطبقة تلقائياً**

### **🛡️ Firestore Rules:**
```javascript
// المستخدم يمكنه قراءة/كتابة بياناته فقط
match /workflows/{workflowId} {
  allow read, write: if request.auth.uid == resource.data.ownerId;
}

// المكونات العامة للقراءة، المصادقة للكتابة
match /designComponents/{componentId} {
  allow read: if resource.data.isPublic == true;
  allow write: if request.auth != null;
}
```

## 🧪 **اختبار التكامل**

### 1. اختبار Firebase Connection
```typescript
// في المتصفح Console
import { db } from './lib/firebase';
console.log('Firebase initialized:', db);
```

### 2. اختبار قاعدة البيانات
```typescript
// إنشاء مستند تجريبي
const testData = {
  title: 'Test Workflow',
  ownerId: 'test-user',
  nodes: [],
  connections: [],
  createdAt: new Date()
};

// سيتم اختبار هذا تلقائياً في صفحة /setup
```

## 📞 الدعم والمساعدة

### **للدعم التقني:**
- **📧 البريد الإلكتروني:** firebase-support@flowcanvas-ai.com
- **💬 Discord:** [قناة الدعم التقني](https://discord.gg/flowcanvas-firebase)
- **📚 الوثائق:** `/docs/troubleshooting/firebase-issues.md`

### **موارد مفيدة:**
- [Firebase Documentation](https://firebase.google.com/docs)
- [Firestore Security Rules](https://firebase.google.com/docs/firestore/security/get-started)
- [Next.js Firebase Integration](https://firebase.google.com/docs/web/setup)

---

*🔥 Firebase Studio جاهز الآن للعمل مع FlowCanvasAI!*