# 🛠️ دليل استكشاف الأخطاء - Troubleshooting Guide

## 📋 مشاكل شائعة وحلولها

### 🚨 مشاكل التثبيت والإعداد

#### ❌ مشكلة: Node.js version غير متوافق
```bash
Error: The engine "node" is incompatible with this module
```

**الحل:**
```bash
# تحقق من إصدار Node.js الحالي
node --version

# تثبيت Node.js 18 أو أحدث
nvm install 18
nvm use 18

# أو تحديث Node.js مباشرة
curl -fsSL https://nodejs.org/dist/v18.18.0/node-v18.18.0-linux-x64.tar.xz
```

#### ❌ مشكلة: npm dependencies conflicts
```bash
npm ERR! peer dep missing
```

**الحل:**
```bash
# حذف node_modules وإعادة التثبيت
rm -rf node_modules package-lock.json
npm cache clean --force
npm install

# أو استخدام yarn
yarn install

# حل conflicts يدوياً
npm install --legacy-peer-deps
```

#### ❌ مشكلة: Port مُستخدم بالفعل
```bash
Error: listen EADDRINUSE: address already in use :::3000
```

**الحل:**
```bash
# العثور على العملية المستخدمة للـ port
lsof -ti:3000

# إيقاف العملية
kill -9 $(lsof -ti:3000)

# أو تشغيل على port مختلف
npm run dev -- -p 3001

# تعيين port افتراضي
echo "PORT=3001" >> .env.local
```

---

### 🔥 مشاكل Firebase

#### ❌ مشكلة: Firebase configuration invalid
```bash
Error: Firebase configuration object is invalid
```

**الحل:**
```bash
# التحقق من متغيرات البيئة
echo $NEXT_PUBLIC_FIREBASE_API_KEY
echo $NEXT_PUBLIC_FIREBASE_PROJECT_ID

# إضافة المتغيرات المفقودة في .env.local
NEXT_PUBLIC_FIREBASE_API_KEY=your_api_key
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=your_domain.firebaseapp.com
NEXT_PUBLIC_FIREBASE_PROJECT_ID=your_project_id
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=your_bucket.appspot.com
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=123456789
NEXT_PUBLIC_FIREBASE_APP_ID=1:123456789:web:abcdef

# إعادة تشغيل الخادم
npm run dev
```

#### ❌ مشكلة: Firestore permission denied
```bash
Error: Missing or insufficient permissions
```

**الحل:**
```typescript
// تحقق من قواعد Firestore
// firestore.rules
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    match /users/{userId} {
      allow read, write: if request.auth != null && request.auth.uid == userId;
    }
    
    match /workflows/{workflowId} {
      allow read, write: if request.auth != null && 
        resource.data.ownerId == request.auth.uid;
    }
  }
}
```

#### ❌ مشكلة: Firebase Auth not working
```bash
Error: Firebase Auth domain not authorized
```

**الحل:**
1. اذهب لـ Firebase Console
2. Authentication > Settings > Authorized domains
3. أضف domain الخاص بك (localhost:3000 للتطوير)

---

### 🤖 مشاكل الذكاء الاصطناعي

#### ❌ مشكلة: Gemini API key invalid
```bash
Error: API key not valid
```

**الحل:**
```bash
# التحقق من API key
echo $NEXT_PUBLIC_GEMINI_API_KEY

# الحصول على مفتاح جديد من
# https://ai.google.dev/

# إضافة المفتاح في .env.local
NEXT_PUBLIC_GEMINI_API_KEY=your_new_api_key
GEMINI_API_KEY=your_new_api_key

# اختبار الاتصال
curl -H "Content-Type: application/json" \
     -d '{"contents":[{"parts":[{"text":"Hello"}]}]}' \
     "https://generativelanguage.googleapis.com/v1beta/models/gemini-pro:generateContent?key=YOUR_API_KEY"
```

#### ❌ مشكلة: AI responses are slow
```bash
Warning: AI request taking too long
```

**الحل:**
```typescript
// تحسين إعدادات Gemini
const generationConfig = {
  temperature: 0.7,
  topK: 40,
  topP: 0.95,
  maxOutputTokens: 1024, // تقليل من 4096
};

// إضافة timeout
const controller = new AbortController();
setTimeout(() => controller.abort(), 10000); // 10 seconds

const response = await fetch(url, {
  signal: controller.signal,
  // ... other options
});
```

#### ❌ مشكلة: Rate limiting من AI API
```bash
Error: Quota exceeded for this API
```

**الحل:**
```typescript
// إضافة rate limiting
const rateLimiter = new Map();

export function checkRateLimit(userId: string) {
  const now = Date.now();
  const userLimits = rateLimiter.get(userId) || { count: 0, resetTime: now + 3600000 };
  
  if (now > userLimits.resetTime) {
    userLimits.count = 0;
    userLimits.resetTime = now + 3600000;
  }
  
  if (userLimits.count >= 100) { // 100 requests per hour
    throw new Error('Rate limit exceeded');
  }
  
  userLimits.count++;
  rateLimiter.set(userId, userLimits);
}
```

---

### 🎨 مشاكل الواجهة والتصميم

#### ❌ مشكلة: Tailwind classes لا تعمل
```bash
Warning: Tailwind classes not applying
```

**الحل:**
```javascript
// التحقق من tailwind.config.js
module.exports = {
  content: [
    './pages/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
    './app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  // ... rest of config
}

// إعادة بناء Tailwind
npm run build:css

// أو تشغيل في watch mode
npx tailwindcss -i ./styles/globals.css -o ./styles/output.css --watch
```

#### ❌ مشكلة: Dark mode لا يعمل
```bash
Issue: Theme toggle not working
```

**الحل:**
```typescript
// التحقق من theme provider
'use client';

import { createContext, useContext, useEffect, useState } from 'react';

const ThemeContext = createContext({});

export function ThemeProvider({ children }: { children: React.ReactNode }) {
  const [isDark, setIsDark] = useState(true);

  useEffect(() => {
    // تحميل الثيم من localStorage
    const savedTheme = localStorage.getItem('theme');
    if (savedTheme) {
      setIsDark(savedTheme === 'dark');
    }
  }, []);

  useEffect(() => {
    // تطبيق الثيم على document
    document.documentElement.classList.toggle('dark', isDark);
    localStorage.setItem('theme', isDark ? 'dark' : 'light');
  }, [isDark]);

  return (
    <ThemeContext.Provider value={{ isDark, setIsDark }}>
      {children}
    </ThemeContext.Provider>
  );
}
```

#### ❌ مشكلة: RTL support لا يعمل للعربية
```bash
Issue: Arabic text not displaying correctly
```

**الحل:**
```css
/* إضافة في globals.css */
[dir="rtl"] {
  direction: rtl;
  text-align: right;
}

[dir="rtl"] .container {
  margin-left: auto;
  margin-right: 0;
}

/* استخدام خطوط مناسبة للعربية */
.font-arabic {
  font-family: 'Cairo', 'Noto Sans Arabic', 'Inter', sans-serif;
}
```

---

### 📱 مشاكل الاستجابة والأجهزة المحمولة

#### ❌ مشكلة: Layout breaks على الموبايل
```bash
Issue: Mobile layout not responsive
```

**الحل:**
```css
/* التحقق من viewport meta tag */
<meta name="viewport" content="width=device-width, initial-scale=1" />

/* استخدام Tailwind responsive classes */
<div className="w-full md:w-1/2 lg:w-1/3">
  <!-- Content -->
</div>

/* تجنب fixed widths */
.container {
  width: 100%;
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 1rem;
}
```

#### ❌ مشكلة: Touch events لا تعمل
```bash
Issue: Touch interactions not working on mobile
```

**الحل:**
```typescript
// إضافة touch event handlers
const handleTouchStart = (e: TouchEvent) => {
  // Handle touch start
};

const handleTouchMove = (e: TouchEvent) => {
  // Handle touch move
};

const handleTouchEnd = (e: TouchEvent) => {
  // Handle touch end
};

useEffect(() => {
  const element = elementRef.current;
  if (element) {
    element.addEventListener('touchstart', handleTouchStart, { passive: false });
    element.addEventListener('touchmove', handleTouchMove, { passive: false });
    element.addEventListener('touchend', handleTouchEnd);

    return () => {
      element.removeEventListener('touchstart', handleTouchStart);
      element.removeEventListener('touchmove', handleTouchMove);
      element.removeEventListener('touchend', handleTouchEnd);
    };
  }
}, []);
```

---

### 🚀 مشاكل الأداء

#### ❌ مشكلة: Page load بطيء
```bash
Warning: First Contentful Paint > 3s
```

**الحل:**
```typescript
// 1. استخدام dynamic imports
const HeavyComponent = dynamic(() => import('./HeavyComponent'), {
  loading: () => <Skeleton />,
  ssr: false
});

// 2. تحسين الصور
import Image from 'next/image';

<Image
  src="/image.jpg"
  alt="Description"
  width={600}
  height={400}
  priority // للصور المهمة
  placeholder="blur"
  blurDataURL="data:image/jpeg;base64,..."
/>

// 3. استخدام Suspense
<Suspense fallback={<Loading />}>
  <AsyncComponent />
</Suspense>
```

#### ❌ مشكلة: Bundle size كبير
```bash
Warning: Bundle size > 1MB
```

**الحل:**
```bash
# تحليل Bundle
npm run analyze

# أو باستخدام webpack-bundle-analyzer
npm install --save-dev webpack-bundle-analyzer
```

```javascript
// next.config.js
const withBundleAnalyzer = require('@next/bundle-analyzer')({
  enabled: process.env.ANALYZE === 'true',
});

module.exports = withBundleAnalyzer({
  // ... config
});

// تشغيل التحليل
ANALYZE=true npm run build
```

#### ❌ مشكلة: Memory leaks
```bash
Warning: Memory usage increasing over time
```

**الحل:**
```typescript
// 1. تنظيف event listeners
useEffect(() => {
  const handleResize = () => {
    // Handle resize
  };

  window.addEventListener('resize', handleResize);
  
  return () => {
    window.removeEventListener('resize', handleResize);
  };
}, []);

// 2. تنظيف timers
useEffect(() => {
  const timer = setInterval(() => {
    // Do something
  }, 1000);

  return () => {
    clearInterval(timer);
  };
}, []);

// 3. إلغاء async operations
useEffect(() => {
  let cancelled = false;

  const fetchData = async () => {
    try {
      const data = await api.getData();
      if (!cancelled) {
        setData(data);
      }
    } catch (error) {
      if (!cancelled) {
        setError(error);
      }
    }
  };

  fetchData();

  return () => {
    cancelled = true;
  };
}, []);
```

---

### 🔒 مشاكل الأمان

#### ❌ مشكلة: CORS errors
```bash
Error: Access to fetch at 'api' from origin 'localhost' has been blocked by CORS
```

**الحل:**
```typescript
// app/api/*/route.ts
export async function OPTIONS(request: Request) {
  return new Response(null, {
    status: 200,
    headers: {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type, Authorization',
    },
  });
}

export async function POST(request: Request) {
  // Add CORS headers to all responses
  const response = NextResponse.json({ data: 'response' });
  response.headers.set('Access-Control-Allow-Origin', '*');
  return response;
}
```

#### ❌ مشكلة: JWT token expired
```bash
Error: Token has expired
```

**الحل:**
```typescript
// إضافة token refresh logic
const refreshToken = async () => {
  try {
    const response = await fetch('/api/auth/refresh', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${getRefreshToken()}`
      }
    });
    
    const { token } = await response.json();
    setAuthToken(token);
    return token;
  } catch (error) {
    // Redirect to login
    router.push('/login');
  }
};

// استخدام interceptor
axios.interceptors.response.use(
  (response) => response,
  async (error) => {
    if (error.response?.status === 401) {
      const newToken = await refreshToken();
      error.config.headers['Authorization'] = `Bearer ${newToken}`;
      return axios.request(error.config);
    }
    return Promise.reject(error);
  }
);
```

---

### 🔧 أدوات التشخيص

#### Performance Debugging
```bash
# Lighthouse audit
lighthouse https://your-app.com --output json --output-path ./report.json

# Core Web Vitals
npm install -g @lhci/cli
lhci autorun

# Memory profiling
node --inspect npm run dev
# ثم افتح chrome://inspect
```

#### Network Debugging
```bash
# تحليل network requests
curl -w "@curl-format.txt" -o /dev/null your-api-endpoint

# حيث curl-format.txt يحتوي على:
     time_namelookup:  %{time_namelookup}\n
        time_connect:  %{time_connect}\n
     time_appconnect:  %{time_appconnect}\n
    time_pretransfer:  %{time_pretransfer}\n
       time_redirect:  %{time_redirect}\n
  time_starttransfer:  %{time_starttransfer}\n
                     ----------\n
          time_total:  %{time_total}\n
```

#### Error Monitoring
```typescript
// Sentry integration
import * as Sentry from '@sentry/nextjs';

Sentry.init({
  dsn: process.env.SENTRY_DSN,
  environment: process.env.NODE_ENV,
});

// Custom error boundary
export class ErrorBoundary extends Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true };
  }

  componentDidCatch(error, errorInfo) {
    Sentry.captureException(error, { contexts: { react: errorInfo } });
  }

  render() {
    if (this.state.hasError) {
      return <ErrorFallback />;
    }

    return this.props.children;
  }
}
```

---

### 📞 الحصول على المساعدة

#### قنوات الدعم
- **GitHub Issues:** [إنشاء issue جديد](https://github.com/flowcanvas-ai/issues/new)
- **Discord:** [مجتمع المطورين](https://discord.gg/flowcanvas-dev)
- **Email:** support@flowcanvas-ai.com

#### معلومات مفيدة للدعم
عند طلب المساعدة، تأكد من تضمين:

```bash
# معلومات النظام
- OS: [macOS 13.0 / Windows 11 / Ubuntu 20.04]
- Node.js: [v18.18.0]
- npm: [v9.8.1]
- Browser: [Chrome 118.0]

# معلومات المشروع
- Next.js: [v15.0.0]
- React: [v18.2.0]
- التخصيصات الإضافية

# خطوات إعادة الإنتاج
1. اذهب إلى صفحة X
2. اضغط على الزر Y
3. لاحظ الخطأ Z

# رسالة الخطأ الكاملة
[نسخ النص الكامل للخطأ]

# لقطة شاشة (إذا أمكن)
[رفع صورة للمشكلة]
```

#### Self-Help Checklist
```bash
✅ تحقق من إصدار Node.js (18+)
✅ تحقق من متغيرات البيئة (.env.local)
✅ امسح cache (npm cache clean --force)
✅ أعد تثبيت dependencies (rm -rf node_modules && npm install)
✅ تحقق من network connectivity
✅ راجع browser console للأخطاء
✅ تحقق من وثائق API
✅ ابحث في GitHub issues الموجودة
```

---

*🛠️ معظم المشاكل يمكن حلها باتباع هذا الدليل. إذا استمرت المشكلة، لا تتردد في طلب المساعدة!*