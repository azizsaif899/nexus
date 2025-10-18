# 🚀 البدء السريع - FlowCanvasAI

## 📋 المتطلبات الأساسية

### 🖥️ متطلبات النظام
- **Node.js** 18.0.0 أو أحدث
- **npm** 8.0.0 أو أحدث (أو yarn/pnpm)
- **Git** للتحكم في الإصدارات
- **محرر كود** (VS Code مُفضل)

### 🌐 متطلبات المتصفح
- **Chrome** 90+ (مُفضل)
- **Firefox** 85+
- **Safari** 14+
- **Edge** 90+

---

## ⚡ الإعداد السريع (5 دقائق)

### 1️⃣ استنساخ المشروع
```bash
git clone https://github.com/your-username/flowcanvas-ai.git
cd flowcanvas-ai
```

### 2️⃣ تثبيت التبعيات
```bash
# باستخدام npm
npm install

# أو باستخدام yarn
yarn install

# أو باستخدام pnpm
pnpm install
```

### 3️⃣ إعداد متغيرات البيئة
```bash
# نسخ ملف البيئة
cp .env.example .env.local

# تحرير الملف وإضافة المفاتيح
nano .env.local
```

### 4️⃣ تشغيل المشروع
```bash
npm run dev
```

### 5️⃣ فتح المشروع
افتح المتصفح على: `http://localhost:3000`

---

## 🔧 إعداد متغيرات البيئة

### Firebase Configuration
```env
NEXT_PUBLIC_FIREBASE_API_KEY=your_api_key_here
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=your_domain.firebaseapp.com
NEXT_PUBLIC_FIREBASE_PROJECT_ID=your_project_id
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=your_bucket.appspot.com
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=123456789
NEXT_PUBLIC_FIREBASE_APP_ID=1:123456789:web:abcdef
```

### Gemini AI Configuration
```env
NEXT_PUBLIC_GEMINI_API_KEY=your_gemini_api_key
GEMINI_API_KEY=your_gemini_api_key
```

### تكوين التطبيق
```env
NEXT_PUBLIC_APP_URL=http://localhost:3000
NEXT_PUBLIC_APP_NAME=FlowCanvasAI
NEXT_PUBLIC_APP_VERSION=3.0.0
```

---

## 🛠️ أوامر التطوير

### التطوير
```bash
npm run dev          # تشغيل خادم التطوير
npm run dev:turbo    # تشغيل مع Turbo (أسرع)
```

### البناء والاختبار
```bash
npm run build        # بناء للإنتاج
npm run start        # تشغيل النسخة المبنية
npm run lint         # فحص الكود
npm run type-check   # فحص الأنواع
```

### النشر
```bash
npm run deploy       # نشر على Vercel
npm run export       # تصدير ثابت
```

---

## 📱 اختبار الوظائف الأساسية

### ✅ قائمة التحقق
- [ ] الصفحة الرئيسية تعمل
- [ ] تبديل اللغة (عربي/إنجليزي)
- [ ] تبديل الثيم (فاتح/داكن)
- [ ] صفحة مكتبة التصميم
- [ ] صفحة الأتمتة
- [ ] مصمم سير العمل
- [ ] الذكاء الاصطناعي (إذا تم الإعداد)

### 🔧 حل المشاكل الشائعة

#### مشكلة: Node.js version
```bash
# تحديث Node.js
nvm install 18
nvm use 18
```

#### مشكلة: Port مُستخدم
```bash
# تشغيل على port مختلف
npm run dev -- -p 3001
```

#### مشكلة: Dependencies
```bash
# حذف node_modules وإعادة التثبيت
rm -rf node_modules package-lock.json
npm install
```

---

## 📚 الخطوات التالية

### 🔗 روابط مفيدة
- [مرجع المكونات الكامل](../components-reference.md)
- [الحالة الحالية للمشروع](../current-state.md)
- [دليل المطور](../development/architecture.md)
- [نشر المشروع](../deployment/deployment-guide.md)

### 📖 التعلم أكثر
1. اقرأ [نظرة عامة على البنية](../development/architecture.md)
2. تصفح [مرجع المكونات](../components-reference.md)
3. راجع [الحالة الحالية](../current-state.md)

---

## 🆘 المساعدة والدعم

### 💬 الحصول على المساعدة
- [الأسئلة الشائعة](../troubleshooting/faq.md)
- [دليل استكشاف الأخطاء](../troubleshooting/debugging.md)
- [مجتمع Discord](https://discord.gg/flowcanvas-ai)

### 📞 التواصل
- **البريد الإلكتروني:** support@flowcanvas-ai.com
- **تويتر:** @FlowCanvasAI
- **GitHub Issues:** [إنشاء issue جديد](https://github.com/your-username/flowcanvas-ai/issues)

---

*✅ مبروك! أنت الآن جاهز لبدء استخدام FlowCanvasAI*