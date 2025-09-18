# 🔧 دليل التكامل للمبرمجين - الخلفية

## 📋 **الملفات المدمجة من nexus-v2**

### **🔗 API Routes (Next.js)**
```
src/app/api/
├── auth/route.ts          # المصادقة والتسجيل
├── chat/route.ts          # نظام الدردشة
├── crm/leads/route.ts     # إدارة العملاء المحتملين
├── monitoring/route.ts    # مراقبة النظام
└── webhook/route.ts       # معالجة Webhooks
```

### **☁️ Cloud Functions (Firebase)**
```
functions/src/index.ts     # 3 Cloud Functions:
├── processAIRequest       # معالجة طلبات AI
├── handleWhatsAppWebhook  # معالجة واتساب
└── syncWithBigQuery       # مزامنة البيانات
```

### **🧪 ملف الاختبار**
```
test-apis.js              # اختبار جميع APIs
```

---

## 🚀 **للمبرمجين الجدد**

### **1. تشغيل المشروع:**
```bash
git clone https://github.com/azizsaif899/nexux.git
cd nexux
npm install
npm run dev
```

### **2. اختبار APIs:**
```bash
# في terminal منفصل
node test-apis.js
```

### **3. تطوير Cloud Functions:**
```bash
cd functions
npm install
npm run build
```

---

## 📡 **APIs المتاحة**

| Endpoint | Method | الوصف |
|----------|--------|-------|
| `/api/auth` | GET/POST | المصادقة |
| `/api/chat` | GET/POST | الدردشة |
| `/api/crm/leads` | GET/POST | العملاء |
| `/api/monitoring` | GET/POST | المراقبة |
| `/api/webhook` | GET/POST | Webhooks |

---

## ⚙️ **Cloud Functions**

### **processAIRequest**
- **الغرض:** معالجة طلبات الذكاء الاصطناعي
- **المدخلات:** `{ message, type }`
- **المخرجات:** `{ success, message, type, timestamp }`

### **handleWhatsAppWebhook**
- **الغرض:** معالجة رسائل واتساب
- **المدخلات:** `{ messages, contacts }`
- **المخرجات:** `{ success, processed }`

### **syncWithBigQuery**
- **الغرض:** مزامنة البيانات مع BigQuery
- **المدخلات:** `{ data, table }`
- **المخرجات:** `{ success, table, rows_processed, timestamp }`

---

## 🔧 **إعداد البيئة**

### **متغيرات البيئة المطلوبة:**
```env
# Firebase
FIREBASE_PROJECT_ID=your-project-id
FIREBASE_API_KEY=your-api-key

# Google AI
GOOGLE_AI_API_KEY=your-gemini-key

# Database
DATABASE_URL=your-database-url
```

---

## 📝 **ملاحظات مهمة**

1. **جميع APIs تدعم GET و POST**
2. **Cloud Functions تستخدم Firebase Functions v2**
3. **الاختبارات تعمل على المنفذ 9002**
4. **جميع الاستجابات بصيغة JSON**

---

## 🛠️ **التطوير**

### **إضافة API جديد:**
```typescript
// src/app/api/new-endpoint/route.ts
import { NextRequest, NextResponse } from 'next/server';

export async function GET() {
  return NextResponse.json({ message: 'Hello World' });
}

export async function POST(request: NextRequest) {
  const body = await request.json();
  return NextResponse.json({ received: body });
}
```

### **إضافة Cloud Function:**
```typescript
// functions/src/index.ts
export const newFunction = onRequest(async (req, res) => {
  // منطق الدالة
  res.json({ success: true });
});
```

---

**تم إعداد المشروع بالكامل وجاهز للتطوير! 🎉**