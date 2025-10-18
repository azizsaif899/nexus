# ⚡ البدء السريع - الباكند

<div align="center">

# 🚀 FlowCanvasAI Backend - Quick Start Guide

**للمطور الباكند: ابدأ هنا!**

</div>

---

## ⏱️ 15 دقيقة للبدء

### 1️⃣ التثبيت (دقيقتان)

```bash
# استنساخ المشروع (إذا لم يكن لديك)
git clone https://github.com/your-username/flowcanvasai.git
cd flowcanvasai

# تثبيت التبعيات
npm install
```

---

### 2️⃣ إعداد البيئة (5 دقائق)

```bash
# نسخ قالب Environment Variables
cp .env.example .env.local

# تعديل الملف
nano .env.local
# أو
code .env.local
```

#### املأ القيم الأساسية:

```env
# الحد الأدنى للبدء:
GEMINI_API_KEY=your_key_here
NEXT_PUBLIC_APP_URL=http://localhost:3000
```

---

### 3️⃣ إعداد Firebase (5 دقائق)

#### الخطوات:

1. **إنشاء مشروع**: https://console.firebase.google.com/
   - اضغط "Add project"
   - اسم المشروع: `FlowCanvasAI`
   - اتبع الخطوات

2. **الحصول على الإعدادات**:
   - اذهب إلى Project Settings ⚙️
   - اختر "Your apps" → Web
   - انسخ `firebaseConfig`

3. **إضافتها لـ .env.local**:
```env
NEXT_PUBLIC_FIREBASE_API_KEY=AIza...
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=your-app.firebaseapp.com
NEXT_PUBLIC_FIREBASE_PROJECT_ID=your-project-id
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=your-app.appspot.com
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=123456789
NEXT_PUBLIC_FIREBASE_APP_ID=1:123456789:web:abc123
```

---

### 4️⃣ إعداد Gemini AI (دقيقة واحدة)

1. **الحصول على API Key**: https://ai.google.dev/
   - اضغط "Get API Key"
   - أنشئ مفتاح جديد

2. **إضافته لـ .env.local**:
```env
GEMINI_API_KEY=your_actual_gemini_key_here
```

---

### 5️⃣ تشغيل المشروع (دقيقة واحدة)

```bash
# تشغيل الخادم
npm run dev

# افتح المتصفح
http://localhost:3000
```

---

## 🎯 المهام التالية (حسب الأولوية)

### 🔥 مهم جداً (اليوم الأول):

#### 1. إنشاء API Health Check
```bash
# أنشئ ملف: /app/api/health/route.ts
```

```typescript
import { NextResponse } from 'next/server';

export async function GET() {
  return NextResponse.json({
    status: 'ok',
    timestamp: new Date().toISOString(),
    version: '3.0.0'
  });
}
```

**اختبار**: http://localhost:3000/api/health

---

#### 2. إنشاء API Chat Route
```bash
# أنشئ ملف: /app/api/chat/route.ts
```

```typescript
import { NextRequest, NextResponse } from 'next/server';
import { GoogleGenerativeAI } from '@google/generative-ai';

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY!);

export async function POST(request: NextRequest) {
  try {
    const { message, language } = await request.json();
    
    const model = genAI.getGenerativeModel({ model: 'gemini-2.0-flash' });
    const result = await model.generateContent(message);
    const response = await result.response;
    const text = response.text();
    
    return NextResponse.json({
      success: true,
      response: text,
      language
    });
  } catch (error) {
    console.error('Chat API Error:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to process message' },
      { status: 500 }
    );
  }
}
```

**اختبار**: استخدم Postman أو curl

---

#### 3. تفعيل Firebase Authentication

```bash
# في Firebase Console:
1. اذهب إلى Authentication
2. اضغط "Get Started"
3. فعّل Email/Password
4. فعّل Google Sign-in
```

---

#### 4. إنشاء Firestore Database

```bash
# في Firebase Console:
1. اذهب إلى Firestore Database
2. اضغط "Create Database"
3. اختر "Start in test mode" (مؤقتاً)
4. اختر المنطقة: us-central
```

---

### 💡 مهم (اليوم الثاني):

#### 5. إنشاء Collections في Firestore

```javascript
// المجموعات المطلوبة:

conversations/
  ├── {conversationId}/
  │   ├── platform: string
  │   ├── title: string
  │   ├── lastMessage: string
  │   ├── timestamp: timestamp
  │   └── unread: number

messages/
  ├── {messageId}/
  │   ├── conversationId: string
  │   ├── sender: string
  │   ├── content: string
  │   ├── timestamp: timestamp
  │   └── status: string

users/
  ├── {userId}/
  │   ├── name: string
  │   ├── email: string
  │   ├── language: string
  │   └── createdAt: timestamp
```

---

#### 6. إنشاء API Conversations

```bash
# أنشئ ملف: /app/api/conversations/route.ts
```

```typescript
import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/firebase'; // ستحتاج إنشاء هذا
import { collection, getDocs, addDoc } from 'firebase/firestore';

export async function GET() {
  try {
    const conversationsRef = collection(db, 'conversations');
    const snapshot = await getDocs(conversationsRef);
    const conversations = snapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    }));
    
    return NextResponse.json({ success: true, conversations });
  } catch (error) {
    return NextResponse.json(
      { success: false, error: 'Failed to fetch conversations' },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const data = await request.json();
    const conversationsRef = collection(db, 'conversations');
    const docRef = await addDoc(conversationsRef, {
      ...data,
      timestamp: new Date()
    });
    
    return NextResponse.json({ 
      success: true, 
      id: docRef.id 
    });
  } catch (error) {
    return NextResponse.json(
      { success: false, error: 'Failed to create conversation' },
      { status: 500 }
    );
  }
}
```

---

#### 7. إنشاء Firebase Config

```bash
# أنشئ ملف: /lib/firebase.ts
```

```typescript
import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';
import { getStorage } from 'firebase/storage';

const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID,
};

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const db = getFirestore(app);
export const storage = getStorage(app);
```

---

### ⚙️ اختياري (اليوم الثالث):

#### 8. WhatsApp Business API (إذا لزم)
#### 9. Email Service (إذا لزم)
#### 10. Analytics Setup

---

## 📚 التوثيق الكامل

للمزيد من التفاصيل، راجع:

```
📁 /BACKEND/
├── 01_BACKEND_ARCHITECTURE.md      ← البنية المعمارية
├── 02_DATABASE_SCHEMA.md           ← هيكل قاعدة البيانات
├── 03_API_DOCUMENTATION.md         ← توثيق API
├── 04_FIREBASE_SETUP.md            ← إعداد Firebase التفصيلي
├── 05_GEMINI_AI_INTEGRATION.md     ← تكامل Gemini AI
├── 06_DEPLOYMENT_GUIDE.md          ← دليل النشر
└── 07_ENVIRONMENT_VARIABLES.md     ← متغيرات البيئة
```

---

## 🧪 الاختبار

### اختبار API Routes:

```bash
# Health Check
curl http://localhost:3000/api/health

# Chat (يحتاج Gemini API Key)
curl -X POST http://localhost:3000/api/chat \
  -H "Content-Type: application/json" \
  -d '{"message":"مرحباً","language":"ar"}'

# Conversations (يحتاج Firebase)
curl http://localhost:3000/api/conversations
```

---

## ❓ مشاكل شائعة وحلولها

### المشكلة 1: Firebase لا يعمل
```bash
✅ الحل:
- تأكد من نسخ جميع متغيرات Firebase
- تأكد من تفعيل Firebase في Console
- راجع: /BACKEND/04_FIREBASE_SETUP.md
```

### المشكلة 2: Gemini AI لا يستجيب
```bash
✅ الحل:
- تأكد من صحة API Key
- تأكد من تفعيل Gemini API
- راجع: /BACKEND/05_GEMINI_AI_INTEGRATION.md
```

### المشكلة 3: Build Errors
```bash
✅ الحل:
- حذف node_modules/ و .next/
- npm install مرة أخرى
- npm run build
```

---

## 📞 للمساعدة

```
📧 البريد: backend@flowcanvasai.com
📱 الدعم: راجع /BACKEND/README.md
📚 التوثيق: راجع /FINAL/README.md
```

---

## ✅ Checklist البدء السريع

```
□ npm install
□ cp .env.example .env.local
□ إعداد Firebase
□ إعداد Gemini AI
□ npm run dev
□ اختبار http://localhost:3000
□ إنشاء /app/api/health/route.ts
□ إنشاء /app/api/chat/route.ts
□ إنشاء /lib/firebase.ts
□ اختبار API Routes
□ اختبار Firebase Connection
□ اختبار Gemini AI
□ الاطلاع على /BACKEND/README.md
```

---

<div align="center">

**🚀 جاهز للبدء!**

ابدأ الآن وراجع التوثيق الكامل في `/BACKEND/`

**Made with ❤️ by FlowCanvasAI Team**

</div>
