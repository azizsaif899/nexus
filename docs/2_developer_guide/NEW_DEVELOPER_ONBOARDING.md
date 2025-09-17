# 🚀 دليل المطور الجديد - AzizSys AI Assistant v2.0

## 📋 نظرة عامة سريعة

**AzizSys AI Assistant** هو نظام ذكي متكامل مبني بـ **NX Monorepo** يضم **74 حزمة** منظمة في **6 فئات** رئيسية.

---

## 🏗️ هيكل المشروع

### 📁 **المجلدات الرئيسية:**
```
g-assistant-nx/
├── apps/                    # 7 تطبيقات
│   ├── api/                 # NestJS API Server
│   ├── admin-dashboard/     # React Admin Panel
│   ├── web-chatbot/         # Web Interface
│   └── whatsapp-*-bot/      # WhatsApp Bots
├── packages/                # 74 حزمة منظمة
│   ├── core/               # 12 حزمة أساسية
│   ├── domain/             # 8 حزم منطق العمل
│   ├── ui/                 # 7 حزم واجهات
│   ├── features/           # 8 حزم ميزات متقدمة
│   ├── integrations/       # 7 حزم تكاملات
│   └── tooling/            # 11 حزمة أدوات
└── docs/                   # التوثيق الشامل
```

---

## ⚡ البدء السريع

### 1. **التثبيت:**
```bash
# استنساخ المشروع
git clone <repository-url>
cd g-assistant-nx

# تثبيت التبعيات
pnpm install

# تشغيل النظام
pnpm dev:all
```

### 2. **التطبيقات المتاحة:**
```bash
# API Server (Port 3000)
pnpm dev:api

# Admin Dashboard (Port 4200)
pnpm dev:admin-dashboard

# Web Chatbot (Port 4201)
pnpm dev:web-chatbot
```

---

## 📦 فهم الحزم (Packages)

### 🔧 **Core Packages** - الأساسيات:
```typescript
import { EventBus } from '@azizsys/core/event-bus';
import { CacheClient } from '@azizsys/core/cache-client';
import { ErrorHandler } from '@azizsys/core/error-handler';
```

### 🧠 **Domain Packages** - منطق العمل:
```typescript
import { AIEngine } from '@azizsys/domain/ai-engine';
import { AnalyticsCore } from '@azizsys/domain/analytics-core';
import { CRMService } from '@azizsys/domain/crm';
```

### 🎨 **UI Packages** - الواجهات:
```typescript
import { Button, Card } from '@azizsys/ui/ui-components';
import { CRMDashboard } from '@azizsys/ui/crm-ui';
import { AIInsights } from '@azizsys/ui/ai-ui';
```

---

## 🛠️ أدوات التطوير

### **البناء والاختبار:**
```bash
# بناء تطبيق محدد
pnpm build api
pnpm build admin-dashboard

# اختبار حزمة محددة
pnpm test @azizsys/core/event-bus

# اختبار شامل
pnpm test:all
```

### **إضافة حزمة جديدة:**
```bash
# إنشاء حزمة في core
nx generate @nx/js:library my-package --directory=packages/core

# إنشاء حزمة في domain
nx generate @nx/js:library my-domain --directory=packages/domain
```

---

## 📝 معايير الكود

### **TypeScript:**
- استخدم **strict mode**
- أضف **types** لجميع المتغيرات
- استخدم **interfaces** للكائنات

### **التسمية:**
```typescript
// Classes: PascalCase
class UserService {}

// Functions: camelCase
function getUserData() {}

// Constants: UPPER_SNAKE_CASE
const API_BASE_URL = 'https://api.example.com';
```

### **الاستيراد:**
```typescript
// مفضل - استيراد محدد
import { EventBus } from '@azizsys/core/event-bus';

// تجنب - استيراد شامل
import * as EventBus from '@azizsys/core/event-bus';
```

---

## 🔧 المهام الشائعة

### **إضافة endpoint جديد:**
1. أضف route في `apps/api/src/routes/`
2. أضف service في `packages/domain/`
3. أضف types في `packages/core/shared-types/`

### **إضافة مكون UI:**
1. أضف component في `packages/ui/ui-components/`
2. أضف styles حسب الحاجة
3. export في `index.ts`

### **إضافة تكامل جديد:**
1. أنشئ حزمة في `packages/integrations/`
2. أضف client class
3. أضف tests

---

## 🐛 استكشاف الأخطاء

### **مشاكل شائعة:**
```bash
# خطأ في الاستيراد
Error: Cannot find module '@azizsys/core/event-bus'
# الحل: تأكد من وجود package.json في الحزمة

# خطأ في البناء
Error: TypeScript compilation failed
# الحل: فحص tsconfig.json والتأكد من المسارات

# خطأ في التبعيات
Error: Module not found
# الحل: pnpm install أو إضافة dependency
```

---

## 📚 موارد مفيدة

### **التوثيق:**
- [دليل المطور الكامل](./AzizSys_Developer_Guide.md)
- [معايير الكود](./coding_standards.md)
- [مرجع API](../3_api/api_reference.md)

### **الأدوات:**
- **NX Console** - VS Code Extension
- **TypeScript** - Language Support
- **Prettier** - Code Formatting
- **ESLint** - Code Linting

---

## 🎯 الخطوات التالية

### **للمطور الجديد:**
1. **اقرأ** هذا الدليل كاملاً
2. **شغل** النظام محلياً
3. **استكشف** الحزم المختلفة
4. **ابدأ** بمهمة صغيرة
5. **اطلب المساعدة** عند الحاجة

### **مهام البداية المقترحة:**
- إضافة endpoint بسيط في API
- إنشاء مكون UI جديد
- كتابة test لحزمة موجودة
- تحسين documentation

---

**🚀 مرحباً بك في فريق AzizSys! نتطلع لمساهماتك المميزة! 🚀**