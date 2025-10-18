# FlowCanvasAI - دليل التطوير والتصميم

## 🏗️ بنية المشروع (Next.js 15 App Router)

تم ترقية المشروع إلى Next.js 15 مع App Router للحصول على أداء محسّن وتجربة تطوير أفضل.

### 📁 هيكل الملفات الجديد

```
FlowCanvasAI/
├── app/                          # Next.js App Router
│   ├── layout.tsx               # Root layout مع Providers
│   ├── page.tsx                 # الصفحة الرئيسية
│   ├── conversation/page.tsx    # صفحة المحادثة
│   ├── design-library/page.tsx  # مكتبة التصميم
│   ├── automation/page.tsx      # صفحة الأتمتة
│   ├── workflow-builder/page.tsx # منشئ سير العمل
│   └── api/                     # API Routes
│       ├── health/route.ts      # مراقبة الصحة
│       └── ai/chat/route.ts     # AI Chat API
├── components/                   # مكونات React
├── lib/                         # مكتبات ومساعدات
├── styles/                      # ملفات CSS
└── middleware.ts                # Next.js Middleware
```

## 🎨 نظام التصميم

### الألوان الأساسية
- **Primary**: `#4F97FF` - الأزرق الأساسي للمنصة
- **Secondary**: `#1ABC9C` - الأخضر المكمل
- **Background Dark**: `#0F0F0F` - خلفية داكنة عميقة
- **Background Light**: `#F8F9FA` - خلفية فاتحة

### الخطوط
- **العربية**: `'Cairo', 'Noto Sans Arabic', 'Inter'`
- **الإنجليزية**: `'Inter', 'Helvetica Neue'`
- **رسائل WhatsApp**: `'Segoe UI', 'Helvetica Neue', 'Noto Naskh Arabic'`

### أحجام الخطوط
- لا تستخدم فئات Tailwind للخطوط (`text-2xl`, `font-bold`) إلا إذا طُلب ذلك
- استخدم النظام الافتراضي في `globals.css`

## 🛠️ قواعد التطوير

### Next.js 15 Guidelines

#### 1. استخدام Server Components افتراضياً
```tsx
// ✅ جيد - Server Component
export default function HomePage() {
  return <div>محتوى ثابت</div>
}

// ⚠️ استخدم فقط عند الحاجة
'use client'
export default function InteractiveComponent() {
  const [state, setState] = useState()
  return <div>محتوى تفاعلي</div>
}
```

#### 2. Metadata API
```tsx
import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'العنوان',
  description: 'الوصف',
  keywords: ['كلمة1', 'كلمة2'],
}
```

#### 3. Loading States
```tsx
// loading.tsx في كل مجلد صفحة
export default function Loading() {
  return <div>جاري التحميل...</div>
}
```

### مكونات React

#### استخدام ShadCN
```tsx
// ✅ صحيح
import { Button } from "./components/ui/button"
import { Card } from "./components/ui/card"

// ❌ خطأ - لا تستخدم مسارات مختلفة
import { Button } from "@/components/ui/button"
```

#### إدارة الحالة
```tsx
// للحالات البسيطة
const [state, setState] = useState()

// للحالات المعقدة
const { data, loading } = useCustomHook()
```

### التصميم المتجاوب

#### Breakpoints
```css
/* Mobile First */
@media (min-width: 640px)  { /* sm */ }
@media (min-width: 768px)  { /* md */ }
@media (min-width: 1024px) { /* lg */ }
@media (min-width: 1280px) { /* xl */ }
```

#### WhatsApp Design System
```css
/* استخدم متغيرات WhatsApp المحددة */
--whatsapp-header-bg: #075E54;
--whatsapp-sidebar-bg: #FFFFFF;
--whatsapp-conversation-bg: #ECE5DD;
--whatsapp-bubble-incoming-bg: #FFFFFF;
--whatsapp-bubble-outgoing-bg: #DCF8C6;
```

## 🌍 دعم متعدد اللغات

### RTL/LTR Support
```tsx
// Arabic (RTL)
<div className="rtl" dir="rtl" lang="ar">
  المحتوى العربي
</div>

// English (LTR)
<div className="ltr" dir="ltr" lang="en">
  English Content
</div>
```

### Font Families
```css
/* Arabic */
.font-arabic {
  font-family: 'Cairo', 'Noto Sans Arabic', 'Inter';
}

/* WhatsApp Arabic */
.whatsapp-font-arabic {
  font-family: "Segoe UI", "Helvetica Neue", "Noto Naskh Arabic";
}
```

## 🚀 الأداء والتحسين

### Core Web Vitals
- استخدم `Image` من Next.js للصور
- استخدم `dynamic` للمكونات الثقيلة
- استخدم `Suspense` للتحميل التدريجي

### Bundle Optimization
```tsx
// Lazy Loading
import dynamic from 'next/dynamic'

const HeavyComponent = dynamic(() => import('./HeavyComponent'), {
  loading: () => <p>جاري التحميل...</p>
})
```

## 🔒 الأمان

### Headers
```js
// next.config.js
headers: [
  {
    key: 'X-Frame-Options',
    value: 'DENY'
  },
  {
    key: 'X-Content-Type-Options', 
    value: 'nosniff'
  }
]
```

### Environment Variables
```env
# .env.local
GEMINI_API_KEY=your_key_here
FIREBASE_CONFIG=your_config_here
```

## 📱 مكونات WhatsApp

### رسائل النصوص
```tsx
<div className="whatsapp-bubble-text arabic">
  النص العربي هنا
</div>
```

### فقاعات الرسائل
```tsx
<div className="whatsapp-bubble-outgoing">
  <div className="whatsapp-bubble-text">المحتوى</div>
  <div className="whatsapp-bubble-timestamp">الوقت</div>
</div>
```

### الرسائل الصوتية
```tsx
<div className="whatsapp-voice-bubble-outgoing">
  <button className="whatsapp-voice-play-btn">▶</button>
  <div className="whatsapp-waveform">
    {/* waveform bars */}
  </div>
  <span className="whatsapp-voice-duration">0:15</span>
</div>
```

## 🎭 الرسوم المتحركة

### CSS Animations
```css
@keyframes fadeInUp {
  from {
    opacity: 0;
    transform: translateY(30px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

.animate-fade-in-up {
  animation: fadeInUp 0.6s ease-out;
}
```

### Framer Motion (استخدم motion/react)
```tsx
import { motion } from 'motion/react'

<motion.div
  initial={{ opacity: 0 }}
  animate={{ opacity: 1 }}
  transition={{ duration: 0.3 }}
>
  المحتوى
</motion.div>
```

## 📋 قائمة التحقق للتطوير

### ✅ قبل إنشاء مكون جديد
- [ ] هل يمكن استخدام مكون ShadCN موجود؟
- [ ] هل يحتاج لحالة (Client Component)؟
- [ ] هل يدعم RTL/LTR؟
- [ ] هل يتبع نظام التصميم؟

### ✅ قبل إنشاء صفحة جديدة
- [ ] إضافة Metadata مناسب
- [ ] إضافة Loading state
- [ ] اختبار الاستجابة
- [ ] دعم SEO

### ✅ قبل النشر
- [ ] اختبار الأداء
- [ ] التحقق من إمكانية الوصول
- [ ] اختبار متعدد المتصفحات
- [ ] فحص الأمان

## 🔗 روابط مفيدة

- [Next.js 15 Docs](https://nextjs.org/docs)
- [ShadCN Components](https://ui.shadcn.com/)
- [Tailwind CSS](https://tailwindcss.com/)
- [Motion (Framer Motion)](https://motion.dev/)

---

## 📞 للدعم والمساعدة

إذا كنت بحاجة لمساعدة أو لديك أسئلة، راجع:
- ملف `README.md` الرئيسي
- مجلد `docs/` للوثائق التفصيلية
- أمثلة في مجلد `components/`