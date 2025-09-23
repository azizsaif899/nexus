# 💻 دليل مطور الواجهة الأمامية - Nexus.AI

## 🎯 مهمتك كمطور Frontend

أنت مسؤول عن تطوير **Nexus.AI** - الواجهة الموحدة التي تجمع جميع تطبيقات AzizSys في تجربة واحدة سلسة باستخدام React وTypeScript.

---

## 🏗️ البنية التقنية

### 📦 التقنيات الأساسية:
```json
{
  "framework": "React 18",
  "language": "TypeScript 5.0+",
  "bundler": "Vite",
  "styling": "Tailwind CSS",
  "routing": "React Router v6",
  "state": "Zustand + React Query",
  "backend": "Firebase + Data Connect"
}
```

### 🔧 إعداد المشروع:
```bash
# إنشاء التطبيق
nx generate @nx/react:app nexus-ai

# تثبيت التبعيات
npm install @tanstack/react-query zustand react-hook-form
npm install framer-motion lucide-react
npm install firebase @firebase/data-connect
npm install react-firebase-hooks
```

---

## 📁 هيكل المشروع

```
apps/nexus-ai/
├── src/
│   ├── app/
│   │   ├── App.tsx              # المكون الرئيسي
│   │   ├── store.ts             # Zustand store
│   │   └── router.tsx           # React Router setup
│   ├── modules/                 # الوحدات الفرعية
│   │   ├── admin/
│   │   │   ├── components/      # مكونات الإدارة
│   │   │   ├── hooks/           # Custom hooks
│   │   │   ├── services/        # API services
│   │   │   └── types/           # TypeScript types
│   │   ├── crm/
│   │   ├── chatbot/
│   │   ├── analytics/
│   │   └── automation/
│   ├── shared/
│   │   ├── components/
│   │   │   ├── ui/              # UI components
│   │   │   ├── layout/          # Layout components
│   │   │   └── forms/           # Form components
│   │   ├── hooks/               # Shared hooks
│   │   ├── services/            # Shared services
│   │   ├── utils/               # Utility functions
│   │   └── types/               # Shared types
│   ├── assets/
│   └── styles/
├── public/
└── tests/
```

---

## 🔥 تكامل Firebase

### 🌐 إعداد Firebase:
```typescript
// src/lib/firebase.ts
import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';
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
export const db = getFirestore(app);
export const dataConnect = connectDataConnect(app, {
  connector: 'default',
  location: 'us-central1'
});
```

### 🔐 Authentication Hook:
```typescript
// src/shared/hooks/useAuth.ts
import { useAuthState } from 'react-firebase-hooks';
import { signInWithEmailAndPassword, signOut } from 'firebase/auth';
import { auth } from '@/lib/firebase';

export const useAuth = () => {
  const [user, loading, error] = useAuthState(auth);

  const login = async (email: string, password: string) => {
    return await signInWithEmailAndPassword(auth, email, password);
  };

  const logout = async () => {
    return await signOut(auth);
  };

  return { user, loading, error, login, logout };
};
```

### 📊 Data Connect Integration:
```typescript
// src/shared/services/dataConnect.ts
import { executeQuery, executeMutation } from '@firebase/data-connect';
import { dataConnect } from '@/lib/firebase';

export const getUsers = async () => {
  const query = `
    query GetUsers {
      users {
        id
        email
        displayName
        createdAt
      }
    }
  `;
  return await executeQuery(dataConnect, query);
};

export const createChatSession = async (agentType: string, title?: string) => {
  const mutation = `
    mutation CreateChatSession($agentType: String!, $title: String) {
      chatSession_insert(data: {
        agentType: $agentType
        title: $title
      }) {
        id
        createdAt
      }
    }
  `;
  return await executeMutation(dataConnect, mutation, { agentType, title });
};
```

---

## 🧩 المكونات الأساسية

### 1. Layout Component:
```typescript
// src/shared/components/layout/Layout.tsx
import { useState } from 'react';
import { Header } from './Header';
import { Sidebar } from './Sidebar';

interface LayoutProps {
  children: React.ReactNode;
}

export const Layout: React.FC<LayoutProps> = ({ children }) => {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  return (
    <div className="min-h-screen bg-gray-50">
      <Header onMenuClick={() => setSidebarOpen(!sidebarOpen)} />
      <div className="flex">
        <Sidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />
        <main className="flex-1 p-6">
          {children}
        </main>
      </div>
    </div>
  );
};
```

### 2. Module Router:
```typescript
// src/app/router.tsx
import { createBrowserRouter } from 'react-router-dom';
import { lazy, Suspense } from 'react';
import { Layout } from '@/shared/components/layout/Layout';
import { LoadingSpinner } from '@/shared/components/ui/LoadingSpinner';

const AdminModule = lazy(() => import('@/modules/admin/AdminModule'));
const CRMModule = lazy(() => import('@/modules/crm/CRMModule'));
const ChatbotModule = lazy(() => import('@/modules/chatbot/ChatbotModule'));

const LazyWrapper = ({ children }: { children: React.ReactNode }) => (
  <Suspense fallback={<LoadingSpinner />}>
    {children}
  </Suspense>
);

export const router = createBrowserRouter([
  {
    path: '/',
    element: <Layout><AdminModule /></Layout>,
  },
  {
    path: '/admin',
    element: <Layout><LazyWrapper><AdminModule /></LazyWrapper></Layout>,
  },
  {
    path: '/crm',
    element: <Layout><LazyWrapper><CRMModule /></LazyWrapper></Layout>,
  },
  {
    path: '/chatbot',
    element: <Layout><LazyWrapper><ChatbotModule /></LazyWrapper></Layout>,
  },
]);
```

### 3. State Management:
```typescript
// src/app/store.ts
import { create } from 'zustand';
import { devtools } from 'zustand/middleware';

interface AppState {
  currentModule: string;
  user: User | null;
  sidebarOpen: boolean;
  setCurrentModule: (module: string) => void;
  setUser: (user: User | null) => void;
  toggleSidebar: () => void;
}

export const useAppStore = create<AppState>()(
  devtools(
    (set) => ({
      currentModule: 'admin',
      user: null,
      sidebarOpen: false,
      setCurrentModule: (module) => set({ currentModule: module }),
      setUser: (user) => set({ user }),
      toggleSidebar: () => set((state) => ({ sidebarOpen: !state.sidebarOpen })),
    }),
    { name: 'app-store' }
  )
);
```

---

## 🎨 UI Components

### 1. Button Component:
```typescript
// src/shared/components/ui/Button.tsx
import { ButtonHTMLAttributes, forwardRef } from 'react';
import { cn } from '@/shared/utils/cn';

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'outline';
  size?: 'sm' | 'md' | 'lg';
  loading?: boolean;
}

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant = 'primary', size = 'md', loading, children, ...props }, ref) => {
    return (
      <button
        className={cn(
          'inline-flex items-center justify-center rounded-lg font-medium transition-colors',
          'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500',
          'disabled:pointer-events-none disabled:opacity-50',
          {
            'bg-blue-600 text-white hover:bg-blue-700': variant === 'primary',
            'bg-gray-100 text-gray-900 hover:bg-gray-200': variant === 'secondary',
            'border border-gray-300 bg-transparent hover:bg-gray-50': variant === 'outline',
            'h-8 px-3 text-sm': size === 'sm',
            'h-10 px-4': size === 'md',
            'h-12 px-6 text-lg': size === 'lg',
          },
          className
        )}
        ref={ref}
        disabled={loading}
        {...props}
      >
        {loading && <LoadingSpinner className="mr-2 h-4 w-4" />}
        {children}
      </button>
    );
  }
);
```

### 2. Form Components:
```typescript
// src/shared/components/forms/FormField.tsx
import { useFormContext } from 'react-hook-form';
import { Input } from '@/shared/components/ui/Input';

interface FormFieldProps {
  name: string;
  label: string;
  type?: string;
  placeholder?: string;
  required?: boolean;
}

export const FormField: React.FC<FormFieldProps> = ({
  name,
  label,
  type = 'text',
  placeholder,
  required
}) => {
  const { register, formState: { errors } } = useFormContext();

  return (
    <div className="space-y-2">
      <label className="text-sm font-medium text-gray-700">
        {label}
        {required && <span className="text-red-500 ml-1">*</span>}
      </label>
      <Input
        type={type}
        placeholder={placeholder}
        {...register(name, { required: required && `${label} مطلوب` })}
        error={!!errors[name]}
      />
      {errors[name] && (
        <p className="text-sm text-red-600">{errors[name]?.message as string}</p>
      )}
    </div>
  );
};
```

---

## 🔄 دمج التطبيقات الحالية

### 📋 خطة الدمج:

#### المرحلة 1: Admin Dashboard
```typescript
// src/modules/admin/AdminModule.tsx
import { useQuery } from '@tanstack/react-query';
import { getDashboardStats } from './services/adminApi';

export const AdminModule: React.FC = () => {
  const { data: stats, isLoading } = useQuery({
    queryKey: ['dashboard-stats'],
    queryFn: getDashboardStats
  });

  if (isLoading) return <LoadingSpinner />;

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold">لوحة التحكم</h1>
      <StatsCards stats={stats} />
      <ChartsSection />
    </div>
  );
};
```

#### المرحلة 2: CRM System
```typescript
// src/modules/crm/CRMModule.tsx
import { useState } from 'react';
import { LeadsTable } from './components/LeadsTable';
import { CustomerDetails } from './components/CustomerDetails';

export const CRMModule: React.FC = () => {
  const [selectedCustomer, setSelectedCustomer] = useState<string | null>(null);

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
      <div className="lg:col-span-2">
        <LeadsTable onSelectCustomer={setSelectedCustomer} />
      </div>
      <div>
        {selectedCustomer && <CustomerDetails customerId={selectedCustomer} />}
      </div>
    </div>
  );
};
```

#### المرحلة 3: Web Chatbot
```typescript
// src/modules/chatbot/ChatbotModule.tsx
import { useChatSession } from './hooks/useChatSession';
import { ChatInterface } from './components/ChatInterface';

export const ChatbotModule: React.FC = () => {
  const { messages, sendMessage, isLoading } = useChatSession();

  return (
    <div className="h-full flex flex-col">
      <div className="flex-1 overflow-hidden">
        <ChatInterface 
          messages={messages}
          onSendMessage={sendMessage}
          isLoading={isLoading}
        />
      </div>
    </div>
  );
};
```

---

## 🧪 الاختبارات

### 🔬 Unit Tests:
```typescript
// src/shared/components/ui/__tests__/Button.test.tsx
import { render, screen, fireEvent } from '@testing-library/react';
import { Button } from '../Button';

describe('Button Component', () => {
  it('renders with correct text', () => {
    render(<Button>Click me</Button>);
    expect(screen.getByText('Click me')).toBeInTheDocument();
  });

  it('calls onClick when clicked', () => {
    const handleClick = jest.fn();
    render(<Button onClick={handleClick}>Click me</Button>);
    
    fireEvent.click(screen.getByText('Click me'));
    expect(handleClick).toHaveBeenCalledTimes(1);
  });

  it('shows loading state', () => {
    render(<Button loading>Loading</Button>);
    expect(screen.getByRole('button')).toBeDisabled();
  });
});
```

### 🔗 Integration Tests:
```typescript
// src/modules/admin/__tests__/AdminModule.integration.test.tsx
import { render, screen, waitFor } from '@testing-library/react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { AdminModule } from '../AdminModule';

const createTestQueryClient = () => new QueryClient({
  defaultOptions: { queries: { retry: false } }
});

describe('Admin Module Integration', () => {
  it('loads dashboard data on mount', async () => {
    const queryClient = createTestQueryClient();
    
    render(
      <QueryClientProvider client={queryClient}>
        <AdminModule />
      </QueryClientProvider>
    );

    await waitFor(() => {
      expect(screen.getByText('لوحة التحكم')).toBeInTheDocument();
    });
  });
});
```

---

## 🚀 الأداء والتحسين

### ⚡ Code Splitting:
```typescript
// src/utils/lazyImport.ts
import { lazy, ComponentType } from 'react';

export const lazyImport = <T extends ComponentType<any>>(
  importFunc: () => Promise<{ default: T }>
) => {
  return lazy(importFunc);
};

// الاستخدام
const AdminModule = lazyImport(() => import('@/modules/admin/AdminModule'));
```

### 🎯 Performance Monitoring:
```typescript
// src/utils/performance.ts
import { getCLS, getFID, getFCP, getLCP, getTTFB } from 'web-vitals';

export const initPerformanceMonitoring = () => {
  const sendToAnalytics = (metric: any) => {
    // إرسال المقاييس إلى Firebase Analytics
    console.log('Performance metric:', metric);
  };

  getCLS(sendToAnalytics);
  getFID(sendToAnalytics);
  getFCP(sendToAnalytics);
  getLCP(sendToAnalytics);
  getTTFB(sendToAnalytics);
};
```

---

## 🔧 أدوات التطوير

### 📝 package.json Scripts:
```json
{
  "scripts": {
    "dev": "vite",
    "build": "tsc && vite build",
    "preview": "vite preview",
    "test": "jest",
    "test:watch": "jest --watch",
    "test:coverage": "jest --coverage",
    "lint": "eslint src --ext ts,tsx --report-unused-disable-directives --max-warnings 0",
    "lint:fix": "eslint src --ext ts,tsx --fix",
    "type-check": "tsc --noEmit"
  }
}
```

### ⚙️ Vite Configuration:
```typescript
// vite.config.ts
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import path from 'path';

export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
    },
  },
  build: {
    rollupOptions: {
      output: {
        manualChunks: {
          vendor: ['react', 'react-dom'],
          firebase: ['firebase/app', 'firebase/auth', 'firebase/firestore'],
          ui: ['@tanstack/react-query', 'zustand', 'framer-motion'],
        },
      },
    },
  },
});
```

---

## 🔒 الأمان

### 🛡️ Input Sanitization:
```typescript
// src/shared/utils/sanitize.ts
import DOMPurify from 'dompurify';

export const sanitizeHtml = (dirty: string): string => {
  return DOMPurify.sanitize(dirty);
};

export const sanitizeInput = (input: string): string => {
  return input.trim().replace(/[<>]/g, '');
};
```

### 🔐 Protected Routes:
```typescript
// src/shared/components/auth/ProtectedRoute.tsx
import { Navigate } from 'react-router-dom';
import { useAuth } from '@/shared/hooks/useAuth';

interface ProtectedRouteProps {
  children: React.ReactNode;
}

export const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ children }) => {
  const { user, loading } = useAuth();

  if (loading) return <LoadingSpinner />;
  if (!user) return <Navigate to="/login" replace />;

  return <>{children}</>;
};
```

---

## 📚 معايير الكود

### 🎯 TypeScript Best Practices:
```typescript
// ✅ استخدم interfaces للProps
interface UserCardProps {
  user: User;
  onEdit: (id: string) => void;
  className?: string;
}

// ✅ استخدم Generic Types
interface ApiResponse<T> {
  data: T;
  status: number;
  message: string;
}

// ✅ استخدم Union Types
type Status = 'loading' | 'success' | 'error';

// ✅ استخدم Utility Types
type PartialUser = Partial<User>;
type UserEmail = Pick<User, 'email'>;
```

### 🧹 Code Style:
```typescript
// ✅ استخدم const assertions
const MODULES = ['admin', 'crm', 'chatbot'] as const;
type Module = typeof MODULES[number];

// ✅ استخدم Optional Chaining
const userName = user?.profile?.name ?? 'Guest';

// ✅ استخدم Template Literals
const apiUrl = `${baseUrl}/api/v1/${endpoint}`;

// ✅ استخدم Destructuring
const { data, error, isLoading } = useQuery(queryKey, queryFn);
```

---

## 🚀 النشر والتوزيع

### 📦 Build للإنتاج:
```bash
# بناء التطبيق
npm run build

# معاينة البناء
npm run preview

# تحليل Bundle Size
npm run build -- --analyze
```

### 🌐 Firebase Deployment:
```bash
# تسجيل الدخول
firebase login

# تهيئة المشروع
firebase init hosting

# النشر
firebase deploy --only hosting
```

---

## ⚠️ قيود مهمة

### 🚫 لا تؤثر على:
- **Backend APIs** - استخدم الخدمات الموجودة
- **Database Schema** - لا تغير في هيكل البيانات
- **Authentication Logic** - استخدم Firebase Auth
- **Business Logic** - في packages/core

### ✅ يمكنك التحكم في:
- **UI Components** - إنشاء وتعديل المكونات
- **State Management** - Zustand + React Query
- **Routing** - React Router configuration
- **Styling** - Tailwind CSS classes
- **Performance** - Code splitting وتحسينات

---

## 📞 الدعم والمساعدة

### 💬 قنوات التواصل:
- **Slack**: #frontend-dev
- **Email**: frontend@azizsys.com
- **Daily Standup**: 9:30 صباحاً
- **Code Review**: عبر GitHub PRs

### 🆘 عند مواجهة مشاكل:
1. تحقق من التوثيق
2. ابحث في GitHub Issues
3. اسأل في Slack
4. أنشئ Issue جديد

---

**💻 كود نظيف، أداء ممتاز، تجربة مستخدم رائعة! 💻**