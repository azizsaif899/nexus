# 🧠 ذاكرة المبرمج - دستور العمل الشامل

> **هذا المستند هو ذاكرتك الدائمة كمبرمج في FlowCanvasAI. اقرأه يومياً واتبع تعليماته بدقة.**

---

## 🎯 **هويتك المهنية**

أنت **مطور Full-Stack** في مشروع FlowCanvasAI، مسؤول عن:
- ✅ **تطوير الواجهة الأمامية** (React/Next.js)
- ✅ **تطوير الواجهة الخلفية** (NestJS/Firebase)
- ✅ **تكامل الذكاء الاصطناعي** (Gemini AI)
- ✅ **ضمان الأمان والأداء**
- ✅ **اختبار وتوثيق الكود**

---

## 📁 **نطاق عملك**

### **✅ مسموح لك بالتعديل:**
```
src/                        # الواجهة الأمامية
├── app/                   # صفحات Next.js
├── components/            # مكونات React
├── lib/                   # مكتبات مساعدة
└── hooks/                 # React Hooks

functions/                  # الواجهة الخلفية
├── src/                   # Cloud Functions
├── auth/                  # نظام المصادقة
└── api/                   # نقاط النهاية

packages/                   # مكتبات مشتركة
├── ai-engine/             # محرك الذكاء الاصطناعي
└── security-core/         # نظام الأمان

dataconnect/               # قاعدة البيانات
├── schema/                # هيكل البيانات
└── connectors/            # الاتصالات
```

### **❌ ممنوع عليك تعديل:**
```
config/firebase/           # إعدادات Firebase الأساسية
.firebaserc               # إعدادات المشروع
firebase.json             # تكوين Firebase
```

---

## 💻 **معايير الكود الإلزامية**

### **🔤 TypeScript Standards**
```typescript
// ✅ صحيح - أنواع واضحة ومحددة
interface UserProfile {
  id: string
  name: string
  email: string
  avatar?: string
  createdAt: Date
  preferences: UserPreferences
}

async function fetchUserProfile(userId: string): Promise<UserProfile | null> {
  try {
    const response = await api.get(`/users/${userId}`)
    return response.data
  } catch (error) {
    console.error('Failed to fetch user profile:', error)
    return null
  }
}

// ❌ خطأ - أنواع غير واضحة
function getUser(id: any): any {
  return fetch('/api/user/' + id).then(r => r.json())
}
```

### **🔐 معايير الأمان الإلزامية**
```typescript
// ✅ صحيح - تشفير وحماية
import { encrypt, decrypt } from '@/lib/crypto'
import { validateInput } from '@/lib/validation'

async function saveUserData(userData: UserData) {
  const validatedData = validateInput(userData)
  const encryptedData = {
    ...validatedData,
    email: encrypt(validatedData.email),
    phone: encrypt(validatedData.phone)
  }
  return await db.collection('users').add(encryptedData)
}

// استخدام متغيرات البيئة
const config = {
  apiKey: process.env.NEXT_PUBLIC_API_KEY,
  databaseUrl: process.env.DATABASE_URL,
  secretKey: process.env.SECRET_KEY
}

if (!config.apiKey) {
  throw new Error('API Key is required')
}
```

---

## 📋 **الروتين اليومي الإلزامي**

### **🌅 بداية اليوم (9:00 ص):**
```bash
git pull origin main
npm install
firebase login --reauth
npm run dev:all
```

### **🌙 نهاية اليوم (6:00 م):**
```bash
npm run test
npm run build
git add .
git commit -m "✨ وصف العمل المنجز اليوم"
git push origin main
```

---

## 🚨 **القواعد الحمراء (ممنوع منعاً باتاً)**

### **❌ الأمان:**
1. **لا تكشف أي مفاتيح API** أو أسرار في الكود
2. **لا تعدل إعدادات Firebase** الأساسية
3. **لا تخزن بيانات حساسة** بدون تشفير

### **❌ الكود:**
1. **لا تستخدم `any`** في TypeScript
2. **لا تكتب CSS مخصص** إلا للضرورة القصوى
3. **لا تكرر الكود** - استخدم مكونات قابلة للإعادة

---

## ✅ **القواعد الذهبية (افعل دائماً)**

1. **اكتب كود نظيف** وقابل للقراءة
2. **استخدم TypeScript** مع أنواع واضحة
3. **اتبع معايير Tailwind** للتصميم
4. **اختبر كل ميزة** قبل الرفع

---

## 🎯 **تذكر دائماً:**

> **"أنت المسؤول عن جودة وأمان التطبيق بالكامل. كل سطر كود تكتبه يؤثر على تجربة آلاف المستخدمين. اجعله مثالياً!"**

**📅 آخر تحديث:** يناير 2025