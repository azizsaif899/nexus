# 📁 هيكل مشروع Nexus.AI الكامل

## 🎯 الهيكل المطلوب إنشاؤه

```
apps/nexus-ai/                           # التطبيق الموحد الجديد
├── public/                              # الملفات العامة
│   ├── favicon.ico
│   ├── logo.svg
│   ├── manifest.json
│   └── robots.txt
├── src/
│   ├── app/                            # التطبيق الرئيسي
│   │   ├── App.tsx                     # المكون الجذر
│   │   ├── store.ts                    # إعداد Zustand
│   │   └── router.tsx                  # إعداد React Router
│   ├── config/                         # إعدادات Firebase
│   │   ├── firebase.ts                 # إعداد Firebase
│   │   └── constants.ts                # الثوابت العامة
│   ├── services/                       # الخدمات
│   │   ├── auth.service.ts             # خدمة المصادقة
│   │   ├── data.service.ts             # خدمة البيانات
│   │   └── api.service.ts              # خدمة API عامة
│   ├── hooks/                          # React Hooks مشتركة
│   │   ├── useAuth.ts                  # Hook المصادقة
│   │   ├── useCustomers.ts             # Hook العملاء
│   │   ├── useLeads.ts                 # Hook العملاء المحتملين
│   │   └── useFirebase.ts              # Hook Firebase عام
│   ├── shared/                         # المكونات والأدوات المشتركة
│   │   ├── components/                 # مكونات UI مشتركة
│   │   │   ├── ui/                     # مكونات أساسية
│   │   │   │   ├── Button.tsx
│   │   │   │   ├── Card.tsx
│   │   │   │   ├── Input.tsx
│   │   │   │   ├── Modal.tsx
│   │   │   │   ├── LoadingSpinner.tsx
│   │   │   │   ├── DataTable.tsx
│   │   │   │   └── index.ts
│   │   │   ├── layout/                 # مكونات التخطيط
│   │   │   │   ├── Header.tsx
│   │   │   │   ├── Sidebar.tsx
│   │   │   │   ├── Layout.tsx
│   │   │   │   ├── ModuleRouter.tsx
│   │   │   │   └── index.ts
│   │   │   ├── forms/                  # مكونات النماذج
│   │   │   │   ├── FormField.tsx
│   │   │   │   ├── FormModal.tsx
│   │   │   │   └── index.ts
│   │   │   └── charts/                 # مكونات الرسوم البيانية
│   │   │       ├── LineChart.tsx
│   │   │       ├── BarChart.tsx
│   │   │       ├── PieChart.tsx
│   │   │       └── index.ts
│   │   ├── utils/                      # دوال مساعدة
│   │   │   ├── formatters.ts           # تنسيق البيانات
│   │   │   ├── validators.ts           # التحقق من البيانات
│   │   │   ├── constants.ts            # الثوابت
│   │   │   └── helpers.ts              # دوال مساعدة عامة
│   │   └── types/                      # أنواع TypeScript مشتركة
│   │       ├── auth.types.ts
│   │       ├── api.types.ts
│   │       ├── ui.types.ts
│   │       └── index.ts
│   ├── modules/                        # الوحدات الرئيسية
│   │   ├── admin/                      # وحدة الإدارة
│   │   │   ├── components/
│   │   │   │   ├── AdminDashboard.tsx
│   │   │   │   ├── UserManagement.tsx
│   │   │   │   ├── SystemSettings.tsx
│   │   │   │   ├── SecurityDashboard.tsx
│   │   │   │   └── index.ts
│   │   │   ├── pages/
│   │   │   │   ├── AdminPage.tsx
│   │   │   │   ├── UsersPage.tsx
│   │   │   │   ├── SettingsPage.tsx
│   │   │   │   └── index.ts
│   │   │   ├── hooks/
│   │   │   │   ├── useAdminStats.ts
│   │   │   │   ├── useUserManagement.ts
│   │   │   │   └── index.ts
│   │   │   ├── services/
│   │   │   │   ├── admin.service.ts
│   │   │   │   └── index.ts
│   │   │   ├── types/
│   │   │   │   ├── admin.types.ts
│   │   │   │   └── index.ts
│   │   │   └── AdminModule.tsx         # المكون الرئيسي للوحدة
│   │   ├── crm/                        # وحدة CRM
│   │   │   ├── components/
│   │   │   │   ├── CRMDashboard.tsx
│   │   │   │   ├── CustomerCard.tsx
│   │   │   │   ├── LeadCard.tsx
│   │   │   │   ├── KanbanBoard.tsx
│   │   │   │   ├── CampaignTracker.tsx
│   │   │   │   └── index.ts
│   │   │   ├── pages/
│   │   │   │   ├── CustomersPage.tsx
│   │   │   │   ├── LeadsPage.tsx
│   │   │   │   ├── CampaignsPage.tsx
│   │   │   │   ├── Customer360Page.tsx
│   │   │   │   └── index.ts
│   │   │   ├── hooks/
│   │   │   │   ├── useCustomers.ts
│   │   │   │   ├── useLeads.ts
│   │   │   │   ├── useCampaigns.ts
│   │   │   │   └── index.ts
│   │   │   ├── services/
│   │   │   │   ├── crm.service.ts
│   │   │   │   ├── odoo.service.ts
│   │   │   │   └── index.ts
│   │   │   ├── types/
│   │   │   │   ├── crm.types.ts
│   │   │   │   └── index.ts
│   │   │   └── CRMModule.tsx
│   │   ├── chatbot/                    # وحدة المساعد الذكي
│   │   │   ├── components/
│   │   │   │   ├── ChatInterface.tsx
│   │   │   │   ├── MessageBubble.tsx
│   │   │   │   ├── ChatInput.tsx
│   │   │   │   ├── AgentSelector.tsx
│   │   │   │   ├── KnowledgeBase.tsx
│   │   │   │   └── index.ts
│   │   │   ├── pages/
│   │   │   │   ├── ChatPage.tsx
│   │   │   │   ├── SessionsPage.tsx
│   │   │   │   └── index.ts
│   │   │   ├── hooks/
│   │   │   │   ├── useChat.ts
│   │   │   │   ├── useChatSessions.ts
│   │   │   │   └── index.ts
│   │   │   ├── services/
│   │   │   │   ├── chat.service.ts
│   │   │   │   ├── ai.service.ts
│   │   │   │   └── index.ts
│   │   │   ├── types/
│   │   │   │   ├── chat.types.ts
│   │   │   │   └── index.ts
│   │   │   └── ChatbotModule.tsx
│   │   ├── analytics/                  # وحدة التحليلات
│   │   │   ├── components/
│   │   │   │   ├── AnalyticsDashboard.tsx
│   │   │   │   ├── ReportViewer.tsx
│   │   │   │   ├── MetricsCard.tsx
│   │   │   │   ├── ChartContainer.tsx
│   │   │   │   └── index.ts
│   │   │   ├── pages/
│   │   │   │   ├── AnalyticsPage.tsx
│   │   │   │   ├── ReportsPage.tsx
│   │   │   │   └── index.ts
│   │   │   ├── hooks/
│   │   │   │   ├── useAnalytics.ts
│   │   │   │   ├── useReports.ts
│   │   │   │   └── index.ts
│   │   │   ├── services/
│   │   │   │   ├── analytics.service.ts
│   │   │   │   └── index.ts
│   │   │   ├── types/
│   │   │   │   ├── analytics.types.ts
│   │   │   │   └── index.ts
│   │   │   └── AnalyticsModule.tsx
│   │   └── automation/                 # وحدة الأتمتة
│   │       ├── components/
│   │       │   ├── WorkflowDesigner.tsx
│   │       │   ├── WorkflowCard.tsx
│   │       │   ├── TriggerSelector.tsx
│   │       │   ├── ActionBuilder.tsx
│   │       │   └── index.ts
│   │       ├── pages/
│   │       │   ├── AutomationPage.tsx
│   │       │   ├── WorkflowsPage.tsx
│   │       │   └── index.ts
│   │       ├── hooks/
│   │       │   ├── useWorkflows.ts
│   │       │   ├── useAutomation.ts
│   │       │   └── index.ts
│   │       ├── services/
│   │       │   ├── automation.service.ts
│   │       │   └── index.ts
│   │       ├── types/
│   │       │   ├── automation.types.ts
│   │       │   └── index.ts
│   │       └── AutomationModule.tsx
│   ├── assets/                         # الملفات الثابتة
│   │   ├── images/
│   │   │   ├── logo.svg
│   │   │   ├── icons/
│   │   │   └── illustrations/
│   │   ├── fonts/
│   │   └── data/
│   │       └── mock-data.json
│   ├── styles/                         # ملفات التصميم
│   │   ├── globals.css                 # الأنماط العامة
│   │   ├── components.css              # أنماط المكونات
│   │   ├── utilities.css               # فئات مساعدة
│   │   ├── variables.css               # متغيرات CSS
│   │   └── themes/
│   │       ├── light.css
│   │       └── dark.css
│   ├── __tests__/                      # الاختبارات
│   │   ├── components/
│   │   ├── modules/
│   │   ├── services/
│   │   ├── hooks/
│   │   └── integration/
│   ├── main.tsx                        # نقطة الدخول
│   └── vite-env.d.ts                   # تعريفات TypeScript
├── dataconnect/                        # Firebase Data Connect
│   ├── schema/
│   │   └── schema.gql                  # مخطط قاعدة البيانات
│   ├── operations/
│   │   ├── customers.gql
│   │   ├── leads.gql
│   │   ├── campaigns.gql
│   │   ├── analytics.gql
│   │   ├── workflows.gql
│   │   └── auth.gql
│   └── dataconnect.yaml               # إعدادات Data Connect
├── functions/                          # Firebase Functions
│   ├── src/
│   │   ├── index.ts                   # Functions الرئيسية
│   │   ├── ai/
│   │   │   ├── chat.ts
│   │   │   └── analysis.ts
│   │   ├── crm/
│   │   │   ├── leads.ts
│   │   │   └── campaigns.ts
│   │   └── utils/
│   │       └── helpers.ts
│   ├── package.json
│   └── tsconfig.json
├── storage.rules                       # قواعد Firebase Storage
├── firebase.json                       # إعدادات Firebase
├── .env                               # متغيرات البيئة
├── .env.example                       # مثال متغيرات البيئة
├── .gitignore
├── package.json
├── tsconfig.json
├── tsconfig.app.json
├── tsconfig.node.json
├── vite.config.ts
├── tailwind.config.js
├── postcss.config.js
├── jest.config.ts                     # إعدادات الاختبارات
├── playwright.config.ts               # إعدادات E2E
├── project.json                       # إعدادات NX
└── README.md
```

---

## 🚀 أوامر إنشاء الهيكل

### 1. إنشاء التطبيق الأساسي:
```bash
# إنشاء التطبيق
nx generate @nx/react:app nexus-ai

# الانتقال للمجلد
cd apps/nexus-ai
```

### 2. إنشاء هيكل المجلدات:
```bash
# إنشاء المجلدات الأساسية
mkdir -p src/{config,services,hooks,shared,modules,assets,styles,__tests__}

# إنشاء مجلدات shared
mkdir -p src/shared/{components,utils,types}
mkdir -p src/shared/components/{ui,layout,forms,charts}

# إنشاء مجلدات الوحدات
mkdir -p src/modules/{admin,crm,chatbot,analytics,automation}

# إنشاء هيكل كل وحدة
for module in admin crm chatbot analytics automation; do
  mkdir -p src/modules/$module/{components,pages,hooks,services,types}
done

# إنشاء مجلدات الأصول
mkdir -p src/assets/{images,fonts,data}
mkdir -p src/assets/images/{icons,illustrations}

# إنشاء مجلدات الأنماط
mkdir -p src/styles/themes

# إنشاء مجلدات الاختبارات
mkdir -p src/__tests__/{components,modules,services,hooks,integration}

# إنشاء مجلدات Firebase
mkdir -p dataconnect/{schema,operations}
mkdir -p functions/src/{ai,crm,utils}
```

### 3. إنشاء الملفات الأساسية:
```bash
# ملفات التكوين
touch src/config/{firebase.ts,constants.ts}

# ملفات الخدمات
touch src/services/{auth.service.ts,data.service.ts,api.service.ts}

# ملفات Hooks
touch src/hooks/{useAuth.ts,useCustomers.ts,useLeads.ts,useFirebase.ts}

# ملفات الأنماط
touch src/styles/{globals.css,components.css,utilities.css,variables.css}
touch src/styles/themes/{light.css,dark.css}

# ملفات Firebase
touch dataconnect/schema/schema.gql
touch dataconnect/operations/{customers.gql,leads.gql,campaigns.gql,analytics.gql,workflows.gql,auth.gql}
touch functions/src/index.ts

# ملفات الإعداد
touch {.env,.env.example,storage.rules,firebase.json}
```

### 4. إنشاء ملفات index.ts للتصدير:
```bash
# إنشاء ملفات index في المجلدات المهمة
touch src/shared/components/ui/index.ts
touch src/shared/components/layout/index.ts
touch src/shared/components/forms/index.ts
touch src/shared/components/charts/index.ts
touch src/shared/utils/index.ts
touch src/shared/types/index.ts

# إنشاء ملفات index للوحدات
for module in admin crm chatbot analytics automation; do
  touch src/modules/$module/{components,pages,hooks,services,types}/index.ts
  touch src/modules/$module/${module^}Module.tsx
done
```

---

## 📝 محتوى الملفات الأساسية

### src/config/firebase.ts:
```typescript
import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getFunctions } from 'firebase/functions';
import { getStorage } from 'firebase/storage';
import { getAnalytics } from 'firebase/analytics';
import { connectDataConnect } from '@firebase/data-connect';

const firebaseConfig = {
  apiKey: process.env.REACT_APP_FIREBASE_API_KEY,
  authDomain: process.env.REACT_APP_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.REACT_APP_FIREBASE_PROJECT_ID,
  storageBucket: process.env.REACT_APP_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.REACT_APP_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.REACT_APP_FIREBASE_APP_ID
};

const app = initializeApp(firebaseConfig);

export const auth = getAuth(app);
export const functions = getFunctions(app);
export const storage = getStorage(app);
export const analytics = getAnalytics(app);
export const dataConnect = connectDataConnect(app, {
  connector: 'default',
  location: 'us-central1'
});

export default app;
```

### src/app/App.tsx:
```typescript
import React from 'react';
import { BrowserRouter } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { Layout } from '../shared/components/layout';
import { useAuth } from '../hooks/useAuth';
import { LoadingSpinner } from '../shared/components/ui';

const queryClient = new QueryClient();

export const App: React.FC = () => {
  const { loading } = useAuth();

  if (loading) {
    return <LoadingSpinner />;
  }

  return (
    <QueryClientProvider client={queryClient}>
      <BrowserRouter>
        <Layout />
      </BrowserRouter>
    </QueryClientProvider>
  );
};

export default App;
```

### package.json (إضافات):
```json
{
  "dependencies": {
    "firebase": "^10.7.1",
    "@firebase/data-connect": "^0.1.0",
    "react-firebase-hooks": "^5.1.1",
    "@tanstack/react-query": "^4.29.0",
    "zustand": "^4.3.8",
    "react-hook-form": "^7.44.3",
    "framer-motion": "^10.12.16",
    "lucide-react": "^0.263.1"
  },
  "devDependencies": {
    "firebase-tools": "^13.0.0"
  },
  "scripts": {
    "firebase:emulators": "firebase emulators:start",
    "firebase:deploy": "firebase deploy"
  }
}
```

---

## ✅ قائمة التحقق

### إنشاء الهيكل:
- [ ] إنشاء التطبيق الأساسي
- [ ] إنشاء جميع المجلدات
- [ ] إنشاء الملفات الأساسية
- [ ] إعداد Firebase
- [ ] إعداد TypeScript
- [ ] إعداد Tailwind CSS

### تطوير المكونات:
- [ ] مكونات UI الأساسية
- [ ] مكونات Layout
- [ ] وحدة Admin
- [ ] وحدة CRM
- [ ] وحدة Chatbot
- [ ] وحدة Analytics
- [ ] وحدة Automation

### الاختبار والنشر:
- [ ] اختبارات Unit
- [ ] اختبارات Integration
- [ ] اختبارات E2E
- [ ] نشر على Firebase

---

**📁 هذا الهيكل يوفر أساساً قوياً ومنظماً لبناء Nexus.AI! 📁**