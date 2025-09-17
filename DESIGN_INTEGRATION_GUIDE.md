# 🎨 دليل التصميم والتكامل - AzizSys AI Assistant v2.0

## 📋 نظرة عامة

هذا الدليل الشامل للتعامل مع المشروع من ناحية التصميم والربط والتكامل واللغات، مصمم للمصممين والمطورين والمتكاملين.

---

## 🎯 1. التصميم (Design)

### 🎨 نظام التصميم الموحد

#### الألوان الأساسية
```css
/* الألوان الرئيسية */
--primary-blue: #3B82F6;
--primary-dark: #1E40AF;
--primary-light: #93C5FD;

/* الألوان الوظيفية */
--success: #10B981;
--warning: #F59E0B;
--error: #EF4444;
--info: #3B82F6;

/* الألوان المحايدة */
--gray-50: #F9FAFB;
--gray-100: #F3F4F6;
--gray-500: #6B7280;
--gray-900: #111827;

/* الخلفيات */
--bg-primary: #FFFFFF;
--bg-secondary: #F9FAFB;
--bg-dark: #1F2937;
```

#### الخطوط والنصوص
```css
/* العائلات */
--font-arabic: 'Cairo', 'Tajawal', sans-serif;
--font-english: 'Inter', system-ui, sans-serif;
--font-mono: 'JetBrains Mono', monospace;

/* الأحجام */
--text-xs: 0.75rem;    /* 12px */
--text-sm: 0.875rem;   /* 14px */
--text-base: 1rem;     /* 16px */
--text-lg: 1.125rem;   /* 18px */
--text-xl: 1.25rem;    /* 20px */
--text-2xl: 1.5rem;    /* 24px */
--text-3xl: 1.875rem;  /* 30px */

/* الأوزان */
--font-light: 300;
--font-normal: 400;
--font-medium: 500;
--font-semibold: 600;
--font-bold: 700;
```

#### المسافات والأبعاد
```css
/* المسافات */
--space-1: 0.25rem;   /* 4px */
--space-2: 0.5rem;    /* 8px */
--space-3: 0.75rem;   /* 12px */
--space-4: 1rem;      /* 16px */
--space-6: 1.5rem;    /* 24px */
--space-8: 2rem;      /* 32px */
--space-12: 3rem;     /* 48px */

/* الحدود المنحنية */
--radius-sm: 0.25rem;  /* 4px */
--radius-md: 0.5rem;   /* 8px */
--radius-lg: 0.75rem;  /* 12px */
--radius-xl: 1rem;     /* 16px */

/* الظلال */
--shadow-sm: 0 1px 2px rgba(0,0,0,0.05);
--shadow-md: 0 4px 6px rgba(0,0,0,0.07);
--shadow-lg: 0 10px 15px rgba(0,0,0,0.1);
```

### 📱 التصميم المتجاوب

#### نقاط الكسر
```css
/* Mobile First Approach */
@media (min-width: 640px)  { /* sm */ }
@media (min-width: 768px)  { /* md */ }
@media (min-width: 1024px) { /* lg */ }
@media (min-width: 1280px) { /* xl */ }
@media (min-width: 1536px) { /* 2xl */ }
```

#### سلوك التخطيط
```css
/* Mobile (< 768px) */
.layout-mobile {
  --sidebar-width: 0;
  --content-padding: 1rem;
  --header-height: 56px;
}

/* Desktop (>= 1024px) */
.layout-desktop {
  --sidebar-width: 280px;
  --content-padding: 2rem;
  --header-height: 64px;
}
```

---

## 🔗 2. الربط والتكامل (Integration)

### 🏗️ معمارية التكامل

#### Frontend Integration
```typescript
// React Component Integration
import { useQuery } from '@tanstack/react-query';
import { apiClient } from '@packages/core/api-client';

interface ComponentProps {
  userId: string;
  locale: 'ar' | 'en';
}

export const IntegratedComponent: React.FC<ComponentProps> = ({ 
  userId, 
  locale 
}) => {
  const { data, isLoading } = useQuery({
    queryKey: ['user', userId],
    queryFn: () => apiClient.getUser(userId)
  });

  return (
    <div className={`component ${locale === 'ar' ? 'rtl' : 'ltr'}`}>
      {/* Component content */}
    </div>
  );
};
```

#### Backend Integration
```typescript
// NestJS Service Integration
import { Injectable } from '@nestjs/common';
import { AIEngineService } from '@packages/ai-engine';
import { SecurityService } from '@packages/security-core';

@Injectable()
export class IntegratedService {
  constructor(
    private aiEngine: AIEngineService,
    private security: SecurityService
  ) {}

  async processRequest(data: any) {
    // Security validation
    await this.security.validateRequest(data);
    
    // AI processing
    const result = await this.aiEngine.process(data);
    
    return result;
  }
}
```

### 🔌 APIs والخدمات

#### REST API Integration
```typescript
// API Client Configuration
export const apiConfig = {
  baseURL: process.env.API_BASE_URL || 'http://localhost:3333',
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
    'Accept-Language': 'ar,en'
  }
};

// Service Integration
export class APIService {
  async get<T>(endpoint: string): Promise<T> {
    const response = await fetch(`${apiConfig.baseURL}${endpoint}`, {
      headers: apiConfig.headers
    });
    return response.json();
  }
}
```

#### WebSocket Integration
```typescript
// Real-time Communication
import { io, Socket } from 'socket.io-client';

export class WebSocketService {
  private socket: Socket;

  connect() {
    this.socket = io(process.env.WS_URL || 'ws://localhost:3333');
    
    this.socket.on('connect', () => {
      console.log('Connected to WebSocket');
    });
  }

  emit(event: string, data: any) {
    this.socket.emit(event, data);
  }
}
```

### 🔄 State Management
```typescript
// Zustand Store Integration
import { create } from 'zustand';
import { persist } from 'zustand/middleware';

interface AppState {
  user: User | null;
  locale: 'ar' | 'en';
  theme: 'light' | 'dark';
  setUser: (user: User) => void;
  setLocale: (locale: 'ar' | 'en') => void;
}

export const useAppStore = create<AppState>()(
  persist(
    (set) => ({
      user: null,
      locale: 'ar',
      theme: 'light',
      setUser: (user) => set({ user }),
      setLocale: (locale) => set({ locale })
    }),
    { name: 'app-store' }
  )
);
```

---

## 🌐 3. اللغات والترجمة (Internationalization)

### 🔤 إعداد i18n

#### React i18next Configuration
```typescript
// i18n.ts
import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import Backend from 'i18next-http-backend';
import LanguageDetector from 'i18next-browser-languagedetector';

i18n
  .use(Backend)
  .use(LanguageDetector)
  .use(initReactI18next)
  .init({
    fallbackLng: 'ar',
    debug: process.env.NODE_ENV === 'development',
    
    interpolation: {
      escapeValue: false
    },
    
    backend: {
      loadPath: '/locales/{{lng}}/{{ns}}.json'
    }
  });

export default i18n;
```

#### Translation Files Structure
```
public/locales/
├── ar/
│   ├── common.json
│   ├── dashboard.json
│   ├── chatbot.json
│   └── crm.json
└── en/
    ├── common.json
    ├── dashboard.json
    ├── chatbot.json
    └── crm.json
```

#### Usage in Components
```typescript
// Component with Translation
import { useTranslation } from 'react-i18next';

export const TranslatedComponent = () => {
  const { t, i18n } = useTranslation('dashboard');
  
  const changeLanguage = (lng: string) => {
    i18n.changeLanguage(lng);
    document.dir = lng === 'ar' ? 'rtl' : 'ltr';
  };

  return (
    <div>
      <h1>{t('welcome')}</h1>
      <button onClick={() => changeLanguage('ar')}>
        العربية
      </button>
      <button onClick={() => changeLanguage('en')}>
        English
      </button>
    </div>
  );
};
```

### 🎨 RTL/LTR Styling
```css
/* RTL Support */
.rtl {
  direction: rtl;
  text-align: right;
}

.ltr {
  direction: ltr;
  text-align: left;
}

/* Logical Properties */
.component {
  margin-inline-start: 1rem;
  margin-inline-end: 2rem;
  padding-inline: 1rem;
  border-inline-start: 2px solid var(--primary-blue);
}

/* Language-specific Fonts */
:lang(ar) {
  font-family: var(--font-arabic);
}

:lang(en) {
  font-family: var(--font-english);
}
```

---

## 🛠️ 4. أدوات التطوير والتكامل

### 📦 Package Management
```json
// package.json scripts for integration
{
  "scripts": {
    "dev": "nx run-many -t serve --parallel=3",
    "build": "nx run-many -t build",
    "test": "nx run-many -t test",
    "lint": "nx run-many -t lint",
    "type-check": "nx run-many -t typecheck",
    "i18n:extract": "i18next-scanner",
    "design:tokens": "style-dictionary build"
  }
}
```

### 🎨 Design Tokens Integration
```javascript
// style-dictionary.config.js
module.exports = {
  source: ['tokens/**/*.json'],
  platforms: {
    css: {
      transformGroup: 'css',
      buildPath: 'packages/ui/styles/',
      files: [{
        destination: 'tokens.css',
        format: 'css/variables'
      }]
    },
    js: {
      transformGroup: 'js',
      buildPath: 'packages/ui/tokens/',
      files: [{
        destination: 'tokens.js',
        format: 'javascript/es6'
      }]
    }
  }
};
```

### 🧪 Testing Integration
```typescript
// Component Testing with i18n
import { render, screen } from '@testing-library/react';
import { I18nextProvider } from 'react-i18next';
import i18n from '../i18n/test-config';
import { Component } from './Component';

const renderWithI18n = (component: React.ReactElement) => {
  return render(
    <I18nextProvider i18n={i18n}>
      {component}
    </I18nextProvider>
  );
};

test('renders component with Arabic text', () => {
  renderWithI18n(<Component />);
  expect(screen.getByText('مرحباً')).toBeInTheDocument();
});
```

---

## 🚀 5. سير العمل والنشر

### 🔄 Development Workflow
```bash
# 1. Setup Development Environment
git clone <repository>
cd g-assistant-nx
pnpm install

# 2. Start Development Servers
pnpm run dev  # All apps in parallel

# 3. Design Integration
pnpm run design:tokens  # Generate design tokens
pnpm run i18n:extract   # Extract translation keys

# 4. Testing
pnpm run test           # Run all tests
pnpm run lint           # Code quality check

# 5. Build for Production
pnpm run build          # Build all apps
```

### 📦 Deployment Pipeline
```yaml
# .github/workflows/deploy.yml
name: Deploy
on:
  push:
    branches: [main]

jobs:
  deploy:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - uses: actions/setup-node@v3
        with:
          node-version: '18.17.0'
      
      - name: Install dependencies
        run: pnpm install
      
      - name: Build applications
        run: pnpm run build
      
      - name: Deploy to Firebase
        run: pnpm run deploy
```

---

## 📋 6. قوائم المراجعة

### ✅ Design Checklist
- [ ] نظام الألوان متسق
- [ ] الخطوط واضحة ومقروءة
- [ ] التصميم متجاوب
- [ ] دعم RTL/LTR
- [ ] إمكانية الوصول (a11y)
- [ ] الحركات والانتقالات سلسة

### ✅ Integration Checklist
- [ ] APIs تعمل بشكل صحيح
- [ ] State management متسق
- [ ] Error handling شامل
- [ ] Loading states واضحة
- [ ] Real-time updates تعمل
- [ ] Security measures مطبقة

### ✅ Localization Checklist
- [ ] جميع النصوص قابلة للترجمة
- [ ] التخطيط يدعم RTL
- [ ] التواريخ والأرقام محلية
- [ ] الخطوط مناسبة للغات
- [ ] اختبار جميع اللغات
- [ ] Fallback للنصوص المفقودة

---

## 🔧 7. استكشاف الأخطاء

### 🐛 مشاكل شائعة وحلولها

#### مشكلة RTL Layout
```css
/* المشكلة: العناصر لا تنعكس بشكل صحيح */
.problematic {
  float: left; /* ❌ */
  margin-left: 1rem; /* ❌ */
}

/* الحل: استخدام Logical Properties */
.solution {
  float: inline-start; /* ✅ */
  margin-inline-start: 1rem; /* ✅ */
}
```

#### مشكلة Font Loading
```css
/* المشكلة: الخطوط لا تحمل بشكل صحيح */
@import url('https://fonts.googleapis.com/css2?family=Cairo:wght@300;400;500;600;700&display=swap');

/* الحل: Font Display Optimization */
@font-face {
  font-family: 'Cairo';
  src: url('./fonts/cairo.woff2') format('woff2');
  font-display: swap; /* ✅ */
}
```

#### مشكلة API Integration
```typescript
// المشكلة: API calls تفشل
const fetchData = async () => {
  const response = await fetch('/api/data'); // ❌
  return response.json();
};

// الحل: Error Handling
const fetchData = async () => {
  try {
    const response = await fetch('/api/data');
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    return await response.json();
  } catch (error) {
    console.error('Fetch error:', error);
    throw error;
  }
};
```

---

## 📞 8. الدعم والموارد

### 🔗 روابط مفيدة
- **[Figma Design System](https://figma.com/azizsys-design-system)**
- **[Storybook Components](http://localhost:6006)**
- **[API Documentation](http://localhost:3333/api)**
- **[i18n Management](https://locize.com)**

### 📚 مراجع تقنية
- **React**: [reactjs.org](https://reactjs.org)
- **NestJS**: [nestjs.com](https://nestjs.com)
- **NX**: [nx.dev](https://nx.dev)
- **i18next**: [i18next.com](https://i18next.com)
- **Tailwind CSS**: [tailwindcss.com](https://tailwindcss.com)

### 💬 قنوات التواصل
- **Slack**: #design-dev-integration
- **Email**: integration@azizsys.com
- **GitHub Issues**: للمشاكل التقنية
- **Figma Comments**: للملاحظات التصميمية

---

## 🎯 الخلاصة

هذا الدليل يوفر إطار عمل شامل للتعامل مع جميع جوانب التصميم والتكامل في مشروع AzizSys AI Assistant v2.0. اتبع هذه الإرشادات لضمان تجربة متسقة وعالية الجودة عبر جميع التطبيقات والمنصات.

**🚀 ابدأ الآن واصنع تجربة استثنائية!**