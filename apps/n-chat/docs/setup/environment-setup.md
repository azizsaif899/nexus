# 🌍 إعداد البيئة - Environment Setup

## 🔧 دليل إعداد متغيرات البيئة

لتشغيل FlowCanvasAI بكامل إمكانياته، تحتاج إلى إعداد متغيرات البيئة التالية:

## 📋 المتغيرات المطلوبة

### 🔥 Firebase Configuration
```bash
NEXT_PUBLIC_FIREBASE_API_KEY=your_firebase_api_key_here
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=your-project.firebaseapp.com
NEXT_PUBLIC_FIREBASE_PROJECT_ID=your-project-id
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=your-project.appspot.com
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=123456789
NEXT_PUBLIC_FIREBASE_APP_ID=1:123456789:web:abc123def456
NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID=G-XXXXXXXXXX
```

### 🤖 Google Gemini AI
```bash
NEXT_PUBLIC_GEMINI_API_KEY=your_gemini_api_key_here
GEMINI_MODEL=gemini-2.0-flash-exp
GEMINI_TEMPERATURE=0.7
GEMINI_MAX_TOKENS=4096
```

### 🎨 Figma API (اختياري)
```bash
FIGMA_ACCESS_TOKEN=your_figma_personal_access_token
FIGMA_BASE_URL=https://api.figma.com/v1
```

### 🌐 إعدادات التطبيق العامة
```bash
NODE_ENV=development
NEXT_PUBLIC_APP_URL=http://localhost:3000
NEXT_PUBLIC_APP_NAME=FlowCanvasAI
NEXT_PUBLIC_APP_VERSION=3.0.0
```

## 🚀 البدء السريع

### 1. إنشاء ملف `.env.local`
```bash
# في الجذر الرئيسي للمشروع
touch .env.local
```

### 2. نسخ القالب
```bash
# نسخ من ملف المثال
cp .env.example .env.local

# أو إنشاء يدوي
nano .env.local
```

### 3. إعادة تشغيل الخادم
```bash
npm run dev
# أو
yarn dev
```

## 🔑 كيفية الحصول على API Keys

### 🔥 إعداد Firebase
1. اذهب إلى [Firebase Console](https://console.firebase.google.com/)
2. أنشئ مشروعاً جديداً أو اختر موجود
3. اذهب إلى Project Settings > General > Your apps
4. أضف web app جديد إذا لم يكن موجود
5. انسخ قيم التكوين إلى `.env.local`

### 🤖 إعداد Gemini AI
1. اذهب إلى [Google AI Studio](https://makersuite.google.com/app/apikey)
2. سجل الدخول بحساب Google
3. اضغط "Create API Key"
4. انسخ المفتاح المولد إلى `NEXT_PUBLIC_GEMINI_API_KEY`

### 🎨 إعداد Figma API
1. اذهب إلى [Figma Account Settings](https://www.figma.com/settings)
2. انتقل إلى "Personal access tokens"
3. اضغط "Create new token"
4. أعطه اسماً وانسخ التوكن
5. أضفه إلى `FIGMA_ACCESS_TOKEN`

## 🔄 وضع العرض التوضيحي

إذا لم تقم بإعداد API keys، سيعمل التطبيق في **Demo Mode** مع:
- ✅ واجهة المستخدم الكاملة
- 🤖 مساعد AI محاكي
- 🔥 قاعدة بيانات محلية مؤقتة
- 🎨 استيراد Figma محاكي

### ميزات وضع العرض:
- جميع الواجهات تعمل بشكل طبيعي
- البيانات لا تُحفظ بشكل دائم
- الردود من AI محاكية ولكن ذكية
- مثالي للتطوير والاختبار

## 🛠️ قوالب البيئات

### Development Template
```bash
# .env.local for development
NODE_ENV=development
NEXT_PUBLIC_FIREBASE_API_KEY=demo-api-key
NEXT_PUBLIC_FIREBASE_PROJECT_ID=flowcanvas-ai-dev
NEXT_PUBLIC_GEMINI_API_KEY=demo-key
FIGMA_ACCESS_TOKEN=demo-token
```

### Production Template
```bash
# .env.production for production
NODE_ENV=production
NEXT_PUBLIC_FIREBASE_API_KEY=your_real_firebase_key
NEXT_PUBLIC_FIREBASE_PROJECT_ID=your_real_project_id
NEXT_PUBLIC_GEMINI_API_KEY=your_real_gemini_key
FIGMA_ACCESS_TOKEN=your_real_figma_token
```

## 🔐 أفضل ممارسات الأمان

### ✅ افعل:
- استخدم بادئة `NEXT_PUBLIC_` للمتغيرات من جانب العميل
- احتفظ بالمفاتيح الحساسة في جانب الخادم فقط
- استخدم مشاريع مختلفة للتطوير/الاختبار/الإنتاج
- قم بتدوير API keys دورياً
- أضف `.env*` إلى `.gitignore`

### ❌ لا تفعل:
- رفع ملفات `.env` إلى version control
- مشاركة API keys في قنوات عامة
- استخدام مفاتيح الإنتاج في التطوير
- تخزين بيانات حساسة في متغيرات العميل

## 🆘 استكشاف الأخطاء

### المشاكل الشائعة:

#### "process is not defined"
- **المشكلة**: متغيرات البيئة غير مكونة بشكل صحيح
- **الحل**: أنشئ ملف `.env.local` مع المتغيرات المناسبة

#### "Firebase project not found"
- **المشكلة**: معرف المشروع أو API key خاطئ
- **الحل**: تحقق مرة أخرى من إعدادات Firebase console

#### "Gemini API quota exceeded"
- **المشكلة**: طلبات API كثيرة جداً
- **الحل**: راجع الاستخدام في Google Cloud Console

#### "Figma authentication failed"
- **المشكلة**: توكن غير صالح أو منتهي الصلاحية
- **الحل**: أنشئ personal access token جديد

### وضع التشخيص:
```bash
# أضف هذا لرؤية حالة التكوين
console.log('Config loaded:', typeof window !== 'undefined');
```

## 📞 الدعم

إذا واجهت مشاكل في الإعداد:

1. **تحقق من Console**: افتح Developer Tools للاطلاع على الأخطاء
2. **راجع التوثيق**: كل خدمة لها دليل إعداد مفصل
3. **جرب Demo Mode**: للتأكد من أن التطبيق يعمل
4. **اتصل بالدعم**: عبر GitHub Issues

## 🚀 الخطوات التالية

بمجرد إعداد المتغيرات:
- 🔥 Firebase: تخزين وإدارة البيانات
- 🤖 Gemini AI: ذكاء اصطناعي حقيقي
- 🎨 Figma: استيراد التصميمات الفعلية
- 🔄 Real-time sync: مزامنة فورية

---

**💡 نصيحة:** ابدأ بـ Demo Mode للتعرف على التطبيق، ثم أضف API keys تدريجياً حسب احتياجك.