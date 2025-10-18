# 💻 دليل التطوير - Development Guide

> **المشروع:** CRM Nxs  
> **الإصدار:** 1.0.0  
> **التاريخ:** 2025-10-16

---

## 🎯 **نظرة عامة**

هذا الدليل يشرح كيفية التطوير على مشروع CRM Nxs من الصفر.

---

## 🏗️ **البنية المعمارية**

### **النمط المستخدم:**
```
Component-Based Architecture
├── Feature-First Organization
├── Atomic Design (Atoms → Organisms)
└── Container/Presentational Pattern
```

### **هيكل المكونات:**

```
/components
├── /ui                 # Shadcn/ui (Atoms)
│   ├── button.tsx
│   ├── card.tsx
│   └── ...
├── /crm               # Feature Components (Molecules/Organisms)
│   ├── /dashboard
│   │   └── CRMDashboard.tsx
│   ├── /leads
│   │   └── LeadsPage.tsx
│   ├── /pipeline
│   │   └── PipelineBoard.tsx
│   ├── /tasks
│   │   └── TasksManagement.tsx
│   └── /reports
│       └── ReportsPage.tsx
├── /ai                # AI Features
│   └── AIChatSidebar.tsx
├── CRMLayout.tsx      # Layout Container
└── ThemeProvider.tsx  # Theme Context
```

---

## 📝 **إنشاء مكون جديد**

### **1. مكون UI (Shadcn/ui)**

```typescript
// components/ui/new-component.tsx
import * as React from 'react'
import { cn } from './utils'

interface NewComponentProps extends React.HTMLAttributes<HTMLDivElement> {
  variant?: 'default' | 'outline'
}

const NewComponent = React.forwardRef<HTMLDivElement, NewComponentProps>(
  ({ className, variant = 'default', ...props }, ref) => {
    return (
      <div
        ref={ref}
        className={cn(
          'base-classes-here',
          {
            'bg-primary': variant === 'default',
            'border': variant === 'outline'
          },
          className
        )}
        {...props}
      />
    )
  }
)
NewComponent.displayName = 'NewComponent'

export { NewComponent }
```

### **2. مكون Feature (CRM)**

```typescript
// components/crm/feature/FeaturePage.tsx
import React, { useState, useCallback } from 'react'
import { Card, CardHeader, CardTitle, CardContent } from '../../ui/card'
import { Button } from '../../ui/button'

export const FeaturePage: React.FC = () => {
  const [data, setData] = useState([])
  
  const handleAction = useCallback(() => {
    // منطق الإجراء
  }, [])
  
  return (
    <div className="p-6 space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>عنوان الميزة</CardTitle>
        </CardHeader>
        <CardContent>
          {/* المحتوى */}
        </CardContent>
      </Card>
    </div>
  )
}
```

---

## 🔄 **State Management**

### **Local State (useState)**

```typescript
// استخدام بسيط
const [count, setCount] = useState(0)

// مع نوع محدد
const [user, setUser] = useState<User | null>(null)

// مع initializer function (للقيم المعقدة)
const [data, setData] = useState(() => {
  return computeExpensiveValue()
})

// تحديث بناءً على القيمة السابقة
setCount(prev => prev + 1)
```

### **Complex State (useReducer)**

```typescript
interface State {
  loading: boolean
  data: any[]
  error: string | null
}

type Action =
  | { type: 'FETCH_START' }
  | { type: 'FETCH_SUCCESS'; payload: any[] }
  | { type: 'FETCH_ERROR'; payload: string }

const reducer = (state: State, action: Action): State => {
  switch (action.type) {
    case 'FETCH_START':
      return { ...state, loading: true, error: null }
    case 'FETCH_SUCCESS':
      return { ...state, loading: false, data: action.payload }
    case 'FETCH_ERROR':
      return { ...state, loading: false, error: action.payload }
    default:
      return state
  }
}

// الاستخدام
const [state, dispatch] = useReducer(reducer, {
  loading: false,
  data: [],
  error: null
})
```

### **Context (للـ Global State)**

```typescript
// contexts/ThemeContext.tsx
import { createContext, useContext, useState } from 'react'

interface ThemeContextType {
  theme: 'light' | 'dark'
  toggleTheme: () => void
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined)

export const ThemeProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [theme, setTheme] = useState<'light' | 'dark'>('dark')
  
  const toggleTheme = () => {
    setTheme(prev => prev === 'light' ? 'dark' : 'light')
  }
  
  return (
    <ThemeContext.Provider value={{ theme, toggleTheme }}>
      {children}
    </ThemeContext.Provider>
  )
}

export const useTheme = () => {
  const context = useContext(ThemeContext)
  if (!context) throw new Error('useTheme must be used within ThemeProvider')
  return context
}
```

---

## 🪝 **Custom Hooks**

### **مثال: useFetch**

```typescript
// lib/hooks/useFetch.ts
import { useState, useEffect } from 'react'

interface UseFetchResult<T> {
  data: T | null
  loading: boolean
  error: string | null
  refetch: () => void
}

export function useFetch<T>(url: string): UseFetchResult<T> {
  const [data, setData] = useState<T | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  
  const fetchData = async () => {
    try {
      setLoading(true)
      const response = await fetch(url)
      if (!response.ok) throw new Error('Failed to fetch')
      const json = await response.json()
      setData(json)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Unknown error')
    } finally {
      setLoading(false)
    }
  }
  
  useEffect(() => {
    fetchData()
  }, [url])
  
  return { data, loading, error, refetch: fetchData }
}

// الاستخدام
const { data, loading, error, refetch } = useFetch<User[]>('/api/users')
```

### **مثال: useLocalStorage**

```typescript
// lib/hooks/useLocalStorage.ts
import { useState, useEffect } from 'react'

export function useLocalStorage<T>(key: string, initialValue: T) {
  const [value, setValue] = useState<T>(() => {
    try {
      const item = window.localStorage.getItem(key)
      return item ? JSON.parse(item) : initialValue
    } catch {
      return initialValue
    }
  })
  
  useEffect(() => {
    try {
      window.localStorage.setItem(key, JSON.stringify(value))
    } catch (error) {
      console.error('Failed to save to localStorage:', error)
    }
  }, [key, value])
  
  return [value, setValue] as const
}

// الاستخدام
const [theme, setTheme] = useLocalStorage('theme', 'dark')
```

---

## 🔌 **API Integration**

### **مثال: خدمة API**

```typescript
// services/api.ts
const API_URL = import.meta.env.VITE_API_URL || '/api'

interface ApiResponse<T> {
  data: T
  message?: string
}

class ApiService {
  private async request<T>(
    endpoint: string,
    options?: RequestInit
  ): Promise<T> {
    const response = await fetch(`${API_URL}${endpoint}`, {
      headers: {
        'Content-Type': 'application/json',
        ...options?.headers
      },
      ...options
    })
    
    if (!response.ok) {
      throw new Error(`API Error: ${response.statusText}`)
    }
    
    const json: ApiResponse<T> = await response.json()
    return json.data
  }
  
  async getLeads() {
    return this.request<Lead[]>('/leads')
  }
  
  async createLead(lead: CreateLeadDto) {
    return this.request<Lead>('/leads', {
      method: 'POST',
      body: JSON.stringify(lead)
    })
  }
  
  async updateLead(id: string, lead: UpdateLeadDto) {
    return this.request<Lead>(`/leads/${id}`, {
      method: 'PUT',
      body: JSON.stringify(lead)
    })
  }
  
  async deleteLead(id: string) {
    return this.request<void>(`/leads/${id}`, {
      method: 'DELETE'
    })
  }
}

export const api = new ApiService()
```

### **الاستخدام في Component:**

```typescript
import { api } from '../../services/api'

export const LeadsPage: React.FC = () => {
  const [leads, setLeads] = useState<Lead[]>([])
  const [loading, setLoading] = useState(true)
  
  useEffect(() => {
    const fetchLeads = async () => {
      try {
        const data = await api.getLeads()
        setLeads(data)
      } catch (error) {
        console.error('Failed to fetch leads:', error)
      } finally {
        setLoading(false)
      }
    }
    
    fetchLeads()
  }, [])
  
  // ...
}
```

---

## 🎨 **Styling Best Practices**

### **1. استخدام Tailwind Classes**

```typescript
// ✅ صحيح - spacing/colors
<div className="p-6 space-y-4 bg-background">
  <h1>عنوان</h1>  {/* Typography من globals.css */}
  <p className="text-foreground-muted">وصف</p>
</div>

// ❌ خطأ - typography classes
<h1 className="text-3xl font-bold">عنوان</h1>
```

### **2. استخدام cn() utility**

```typescript
import { cn } from '../../lib/utils'

<div className={cn(
  'base-class',
  isActive && 'active-class',
  className  // من props
)}>
```

### **3. Conditional Styling**

```typescript
<Button
  className={cn(
    'px-4 py-2',
    {
      'bg-primary': variant === 'default',
      'bg-destructive': variant === 'destructive',
      'opacity-50': disabled
    }
  )}
>
```

---

## 🧪 **Testing (قريباً)**

### **مثال: Component Test**

```typescript
// TODO: إضافة اختبارات
// يُفضل استخدام:
// - Vitest
// - React Testing Library
// - Playwright للـ E2E

import { render, screen } from '@testing-library/react'
import { Button } from './Button'

describe('Button', () => {
  it('renders correctly', () => {
    render(<Button>Click me</Button>)
    expect(screen.getByText('Click me')).toBeInTheDocument()
  })
})
```

---

## 🔧 **Debugging**

### **React DevTools**

```typescript
// تفعيل في التطوير
if (import.meta.env.DEV) {
  // React DevTools متاحة تلقائياً
}
```

### **Console Logging (بحذر!)**

```typescript
// ✅ في التطوير فقط
if (import.meta.env.DEV) {
  console.log('Debug:', data)
}

// أو استخدم logger
import { logger } from '../lib/logger'
logger.debug('Debug message', data)
```

### **Performance Profiling**

```typescript
import { performanceMonitor } from '../lib/performance'

performanceMonitor.start('render-time')
// كود ...
performanceMonitor.end('render-time')
```

---

## 📦 **Adding New Dependencies**

### **التثبيت:**

```bash
# Production dependency
npm install package-name

# Dev dependency
npm install -D package-name

# إصدار محدد
npm install package@1.2.3
```

### **الاستخدام:**

```typescript
// ✅ استيراد عادي
import { Component } from 'package-name'

// ✅ استيراد مع version محدد (بعض المكتبات)
import { toast } from 'sonner@2.0.3'
```

---

## 🔄 **Git Workflow**

### **Branches:**

```bash
main           # الإنتاج (protected)
develop        # التطوير (protected)
feature/*      # ميزات جديدة
fix/*          # إصلاح أخطاء
hotfix/*       # إصلاح عاجل
```

### **Workflow:**

```bash
# 1. إنشاء فرع جديد
git checkout develop
git pull origin develop
git checkout -b feature/new-feature

# 2. التطوير
# ... اكتب الكود

# 3. Commit
git add .
git commit -m "feat: add new feature description"

# 4. Push
git push origin feature/new-feature

# 5. Pull Request
# افتح PR من feature/new-feature إلى develop
```

### **Commit Message Format:**

```
<type>: <description>

[optional body]

[optional footer]
```

**Types:**
- `feat` - ميزة جديدة
- `fix` - إصلاح خطأ
- `docs` - تحديث توثيق
- `style` - تنسيق الكود (لا يؤثر على المنطق)
- `refactor` - إعادة هيكلة
- `perf` - تحسين أداء
- `test` - إضافة اختبارات
- `chore` - مهام صيانة

**أمثلة:**

```bash
feat: add leads filter by status
fix: resolve dark mode toggle bug
docs: update setup guide
style: format code with prettier
refactor: simplify dashboard logic
perf: optimize pipeline board rendering
test: add tests for leads page
chore: update dependencies
```

---

## 🎯 **Best Practices Checklist**

قبل عمل commit، تأكد من:

- [ ] ✅ الكود يعمل بدون أخطاء
- [ ] ✅ TypeScript بدون أخطاء (`npm run type-check`)
- [ ] ✅ لا توجد `console.log` في الكود
- [ ] ✅ استخدام HTML elements بدون typography classes
- [ ] ✅ استخدام `useCallback` للـ handlers
- [ ] ✅ استخدام `React.memo` للمكونات الثقيلة
- [ ] ✅ Proper imports order
- [ ] ✅ Accessibility (WCAG AA)
- [ ] ✅ RTL Support (إذا لزم)
- [ ] ✅ Commit message صحيح

---

## 📚 **الموارد**

### **التوثيق الداخلي:**
- [`GUIDELINES.md`](./GUIDELINES.md) - القواعد الكاملة
- [`STYLING.md`](./STYLING.md) - نظام التصميم
- [`COMPONENTS.md`](./COMPONENTS.md) - دليل المكونات

### **التوثيق الخارجي:**
- [React 19 Docs](https://react.dev/)
- [TypeScript Handbook](https://www.typescriptlang.org/docs/)
- [Vite Guide](https://vitejs.dev/guide/)
- [Tailwind CSS](https://tailwindcss.com/docs)

---

## 💡 **نصائح إضافية**

### **1. استخدم VS Code Snippets:**

```json
// .vscode/snippets.json
{
  "React Component": {
    "prefix": "rfc",
    "body": [
      "import React from 'react'",
      "",
      "export const ${1:ComponentName}: React.FC = () => {",
      "  return (",
      "    <div>",
      "      $0",
      "    </div>",
      "  )",
      "}"
    ]
  }
}
```

### **2. استخدم TypeScript Utilities:**

```typescript
// Pick specific properties
type UserPreview = Pick<User, 'id' | 'name'>

// Omit specific properties
type UserWithoutPassword = Omit<User, 'password'>

// Partial (all optional)
type PartialUser = Partial<User>

// Required (all required)
type RequiredUser = Required<User>
```

### **3. استخدم Type Guards:**

```typescript
function isError(value: unknown): value is Error {
  return value instanceof Error
}

try {
  // ...
} catch (error) {
  if (isError(error)) {
    console.error(error.message)
  }
}
```

---

**تم بواسطة:** فريق CRM Nxs  
**التاريخ:** 2025-10-16  
**الحالة:** 🟢 Production Ready
