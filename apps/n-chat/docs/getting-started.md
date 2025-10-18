# 🚀 دليل البداية السريعة

## 📋 المحتويات
- [متطلبات النظام](#متطلبات-النظام)
- [التثبيت](#التثبيت)
- [الإعداد الأولي](#الإعداد-الأولي)
- [أول استخدام](#أول-استخدام)
- [المميزات الأساسية](#المميزات-الأساسية)
- [المساعدة](#المساعدة)

## متطلبات النظام

### 🖥️ **المتطلبات التقنية**
```bash
# Node.js
Node.js >= 18.0.0
npm >= 8.0.0 أو yarn >= 1.22.0

# المتصفحات المدعومة
Chrome >= 90
Firefox >= 88
Safari >= 14
Edge >= 90

# نظام التشغيل
Windows 10+, macOS 10.15+, Linux Ubuntu 18.04+
```

### 🔑 **الحسابات المطلوبة**
- **Firebase Account**: للخدمات الخلفية والذكاء الاصطناعي
- **Google Cloud**: لـ Gemini 2.0 Flash AI
- **GitHub Account**: (اختياري) للحفظ والمشاركة

## التثبيت

### 📦 **تحميل المشروع**
```bash
# استنساخ المشروع
git clone https://github.com/your-username/flowcanvasai.git
cd flowcanvasai

# تثبيت التبعيات
npm install
# أو
yarn install
```

### ⚙️ **إعداد متغيرات البيئة**
```bash
# إنشاء ملف البيئة
cp .env.example .env.local

# تحرير الملف وإضافة المفاتيح
nano .env.local
```

```env
# Firebase Configuration
NEXT_PUBLIC_FIREBASE_API_KEY=your_firebase_api_key
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=your_project.firebaseapp.com
NEXT_PUBLIC_FIREBASE_PROJECT_ID=your_project_id
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=your_project.appspot.com
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=123456789
NEXT_PUBLIC_FIREBASE_APP_ID=1:123456789:web:abcdef

# Gemini AI Configuration
NEXT_PUBLIC_GEMINI_API_KEY=your_gemini_api_key

# Development Configuration
NEXT_PUBLIC_ENV=development
NEXT_PUBLIC_APP_URL=http://localhost:3000
```

## الإعداد الأولي

### 🔥 **إعداد Firebase**
1. **إنشاء مشروع Firebase جديد**:
   ```bash
   # زيارة https://console.firebase.google.com
   # إنشاء مشروع جديد باسم "FlowCanvasAI"
   ```

2. **تفعيل الخدمات المطلوبة**:
   - ✅ **Authentication** (Email/Password, Google)
   - ✅ **Firestore Database**
   - ✅ **Storage**
   - ✅ **Functions** (اختياري)

3. **إعداد قواعد Firestore**:
   ```javascript
   // firestore.rules
   rules_version = '2';
   service cloud.firestore {
     match /databases/{database}/documents {
       // Chat messages
       match /chats/{chatId} {
         allow read, write: if request.auth != null;
       }
       
       // User profiles
       match /users/{userId} {
         allow read, write: if request.auth != null && request.auth.uid == userId;
       }
     }
   }
   ```

### 🤖 **إعداد Gemini AI**
1. **الحصول على API Key**:
   ```bash
   # زيارة https://makersuite.google.com/app/apikey
   # إنشاء API key جديد
   # إضافة المفتاح إلى .env.local
   ```

2. **تفعيل النموذج**:
   ```typescript
   // lib/gemini-ai.ts
   const genAI = new GoogleGenerativeAI(process.env.NEXT_PUBLIC_GEMINI_API_KEY);
   const model = genAI.getGenerativeModel({ 
     model: "gemini-2.0-flash-exp" 
   });
   ```

### 🎨 **إعداد التصميم**
```bash
# تأكد من أن Tailwind مُعد بشكل صحيح
npx tailwindcss --version

# تحقق من المتغيرات CSS
grep -r "--primary" styles/globals.css
```

## أول استخدام

### ▶️ **تشغيل المشروع**
```bash
# تشغيل الخادم المحلي
npm run dev
# أو
yarn dev

# الوصول للتطبيق
# افتح http://localhost:3000 في المتصفح
```

### 🎯 **أول زيارة**
1. **الصفحة الرئيسية**:
   - ستظهر لك الصفحة الرئيسية مع Hero Section
   - جرب تغيير اللغة من العربية للإنجليزية
   - جرب تغيير الثيم من الداكن للفاتح

2. **اختبار ChatSidebar**:
   ```bash
   # اضغط على أيقونة الدردشة في الأعلى
   # أو استخدم اختصار لوحة المفاتيح: Ctrl + /
   ```

3. **استكشاف الصفحات**:
   - **Design Library**: مكتبة المكونات والتصاميم
   - **Automation**: نظام الأتمتة والـ workflows
   - **Workflow Builder**: المصمم المرئي للعمليات

## المميزات الأساسية

### 🤖 **نظام الذكاء الاصطناعي**
```typescript
// استخدام ChatSidebar
import { ChatSidebar } from './components/ChatSidebar';

// في المكون الرئيسي
<ChatSidebar language="ar" />

// الميزات:
✅ دردشة ذكية مع Gemini 2.0
✅ دعم اللغتين العربية والإنجليزية  
✅ تأثيرات بلور متقدمة
✅ حفظ المحادثات في Firebase
✅ طي وفتح تلقائي مع حفظ الإعدادات
```

### 🎨 **نظام التصميم**
```css
/* الألوان الأساسية */
:root {
  --primary: #4F97FF;        /* الأزرق الأساسي */
  --chart-2: #1ABC9C;        /* الأخضر المكمل */
  --background: #F8F9FA;     /* خلفية فاتحة */
}

.dark {
  --background: #0F0F0F;     /* خلفية داكنة */
  --foreground: #F5F5F5;     /* نص فاتح */
}
```

### 🌐 **دعم التدويل**
```typescript
// تغيير اللغة
const [language, setLanguage] = useState<'ar' | 'en'>('ar');

// تطبيق RTL للعربية
useEffect(() => {
  document.documentElement.dir = language === 'ar' ? 'rtl' : 'ltr';
  document.body.classList.toggle('font-arabic', language === 'ar');
}, [language]);
```

### 🔧 **نظام الأتمتة**
```typescript
// استخدام Workflow Builder
import { VisualWorkflowPage } from './components/VisualWorkflowPage';

// الميزات:
✅ سحب وإفلات العقد
✅ ربط العمليات ببعضها
✅ تنفيذ Workflows حقيقية
✅ Analytics ومراقبة الأداء
```

## اختبار التطبيق

### 🧪 **اختبارات أساسية**
```bash
# اختبار المكونات
npm run test

# اختبار التغطية
npm run test:coverage

# اختبار الأداء
npm run test:performance
```

### ✅ **قائمة التحقق**
- [ ] تغيير اللغة يعمل بشكل صحيح
- [ ] تغيير الثيم يعمل بشكل صحيح
- [ ] ChatSidebar يفتح ويغلق بسلاسة
- [ ] الانيميشن تعمل بدون تأخير
- [ ] النظام responsive على الموبايل
- [ ] Firebase متصل بشكل صحيح
- [ ] Gemini AI يرد على الرسائل

## المساعدة والدعم

### 🆘 **مشاكل شائعة**

#### **1. خطأ في تحميل Firebase**
```bash
# الحل
# تأكد من صحة متغيرات البيئة
# تحقق من إعدادات Firebase Rules
```

#### **2. خطأ في Gemini AI**
```bash
# الحل  
# تأكد من صحة API Key
# تحقق من حصص الاستخدام في Google Cloud
```

#### **3. مشاكل في الانيميشن**
```css
/* الحل */
/* تأكد من تفعيل GPU acceleration */
.gpu-acceleration {
  transform: translateZ(0);
  backface-visibility: hidden;
}
```

### 📞 **طلب المساعدة**
- **GitHub Issues**: [github.com/your-repo/issues](https://github.com/your-repo/issues)
- **Discord Community**: [discord.gg/flowcanvasai](https://discord.gg/flowcanvasai)
- **Email Support**: support@flowcanvasai.com
- **Documentation**: [docs.flowcanvasai.com](https://docs.flowcanvasai.com)

### 📚 **موارد إضافية**
- [Firebase Documentation](https://firebase.google.com/docs)
- [Gemini AI Guide](https://ai.google.dev/docs)
- [Tailwind CSS Docs](https://tailwindcss.com/docs)
- [React Documentation](https://react.dev)

---

## 🎉 مبروك!

أنت الآن جاهز لاستخدام **FlowCanvasAI**! 

🚀 **الخطوات التالية**:
1. استكشف جميع الصفحات والمميزات
2. جرب إنشاء أول workflow في صفحة الأتمتة
3. اطلع على مكتبة التصميم للمكونات المتاحة
4. انضم لمجتمعنا على Discord لمشاركة تجربتك

**نتطلع لرؤية ما ستبنيه! 💪✨**