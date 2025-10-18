# 📋 دليل الإرشادات - Guidelines

> **المشروع:** CRM Nxs  
> **الإصدار:** 1.0.0  
> **التاريخ:** 2025-10-16

---

## 🎯 **القاعدة الذهبية - Golden Rule**

### ⚠️ **القاعدة الأهم:**

```typescript
// ❌ لا تستخدم Typography Classes
<h1 className="text-3xl font-bold leading-tight">عنوان</h1>
<p className="text-base font-normal">نص</p>
<button className="text-sm font-medium">زر</button>

// ✅ استخدم HTML Elements مباشرة
<h1>عنوان</h1>  // 24px, 600 تلقائياً
<p>نص</p>       // 16px, 400 تلقائياً
<button>زر</button>  // 16px, 500 تلقائياً
```

**السبب:**  
نظام الطباعة معرّف في `globals.css` ويُطبق تلقائياً على HTML elements.

**الاستثناء الوحيد:**  
عندما يطلب المستخدم صراحةً تغيير الحجم/الوزن.

---

## 🎨 **نظام التصميم - Design System**

### **نظام الألوان - Gray Scale Dark Mode**

```css
/* Primary Colors - الألوان الأساسية */
--background: #030213;           /* الخلفية الرئيسية */
--background-secondary: #0A0E1A; /* الخلفية الثانوية */
--background-elevated: #0D1117;  /* الكروت والنوافذ */

/* Text Colors - ألوان النصوص */
--foreground: #E6EDF3;           /* النص الرئيسي */
--foreground-muted: #8B949E;     /* النص الثانوي */

/* Primary Color - اللون الأساسي */
--primary: #6E7681;              /* Gray */
--primary-foreground: #FFFFFF;

/* Accent Colors - ألوان التمييز */
--accent: #238636;               /* أخضر للنجاح */
--destructive: #DA3633;          /* أحمر للتحذير */
--warning: #9E6A03;              /* برتقالي للتنبيه */
--info: #0969DA;                 /* أزرق للمعلومات */

/* Borders & Inputs */
--border: #30363D;
--input: #0D1117;
--ring: #1F6FEB;
```

### **Light Mode**
```css
--background: #FFFFFF;
--foreground: #1F2328;
--primary: #6E7681;
/* ... */
```

راجع `styles/globals.css` للقائمة الكاملة.

---

## 🔤 **نظام الطباعة - Typography System**

### **الخطوط - Fonts**

#### **العربية:**
```css
font-family: 'IBM Plex Sans Arabic', sans-serif;
```

**الأوزان المتاحة:**
- 300 = Light
- 400 = Regular (افتراضي)
- 500 = Medium (للأزرار و Labels)
- 600 = Semibold (للعناوين)
- 700 = Bold (للتأكيد القوي)

#### **الإنجليزية:**
```css
font-family: 'Inter', sans-serif;
```

**الأوزان المتاحة:** نفسها

### **المقاسات - Sizes**

```css
/* Headers */
h1 = 24px, weight: 600, line-height: 1.3
h2 = 20px, weight: 600, line-height: 1.35
h3 = 18px, weight: 600, line-height: 1.4
h4 = 16px, weight: 600, line-height: 1.5
h5 = 14px, weight: 600, line-height: 1.5
h6 = 12px, weight: 600, line-height: 1.5

/* Body */
p      = 16px, weight: 400, line-height: 1.6
small  = 14px, weight: 400, line-height: 1.5
label  = 14px, weight: 500, line-height: 1.5
button = 16px, weight: 500, line-height: 1.5
```

### **الاستخدام الصحيح**

```typescript
// ✅ صحيح
<h1>لوحة التحكم</h1>
<p>مرحباً بك في نظام CRM</p>
<button>حفظ</button>
<label>اسم العميل</label>

// ✅ مع Tailwind utilities (للألوان والمسافات فقط)
<h1 className="text-primary mb-4">العنوان</h1>
<p className="text-foreground-muted mt-2">الوصف</p>

// ❌ خطأ
<h1 className="text-3xl font-bold">العنوان</h1>
<p className="text-sm">نص</p>
```

---

## 🏗️ **البنية المعمارية - Architecture**

### **هيكل المكونات**

```
/components
├── /crm                # مكونات CRM الرئيسية
│   ├── /dashboard      # Dashboard
│   ├── /leads          # Leads Management
│   ├── /pipeline       # Pipeline Board
│   ├── /tasks          # Tasks Management
│   └── /reports        # Reports
├── /ui                 # Shadcn/ui Components
└── /figma              # Figma Integration (محمي)
```

### **القواعد:**

#### 1. **المكونات الوظيفية (Functional Components)**
```typescript
// ✅ صحيح
const MyComponent: React.FC = () => {
  return <div>محتوى</div>
}

// ❌ خطأ
class MyComponent extends React.Component {
  render() {
    return <div>محتوى</div>
  }
}
```

#### 2. **TypeScript Strict Mode**
```typescript
// ✅ صحيح
interface Props {
  title: string
  count: number
}

const Card: React.FC<Props> = ({ title, count }) => {
  return <div>{title}: {count}</div>
}

// ❌ خطأ
const Card = (props: any) => {  // لا تستخدم any
  return <div>{props.title}</div>
}
```

#### 3. **State Management**
```typescript
// ✅ صحيح - useState
const [isOpen, setIsOpen] = useState(false)

// ✅ صحيح - useCallback للـ handlers
const handleClick = useCallback(() => {
  setIsOpen(prev => !prev)
}, [])

// ❌ خطأ - inline functions في render
<button onClick={() => setIsOpen(!isOpen)}>فتح</button>

// ✅ صحيح
<button onClick={handleClick}>فتح</button>
```

---

## 🎨 **Tailwind CSS Guidelines**

### **ما يجوز استخدامه:**

```typescript
// ✅ Spacing
className="p-6 m-4 gap-2 space-y-4"

// ✅ Colors
className="bg-background text-foreground border-border"

// ✅ Layout
className="flex items-center justify-between"

// ✅ Sizing
className="w-full h-screen max-w-4xl"

// ✅ Effects
className="shadow-lg rounded-xl opacity-50 hover:opacity-100"
```

### **ما لا يجوز استخدامه:**

```typescript
// ❌ Typography (إلا إذا طُلب صراحةً)
className="text-3xl font-bold leading-tight"

// ❌ Arbitrary values بدون داعي
className="text-[18px]"  // استخدم h3 بدلاً

// ❌ !important
className="!text-red-500"  // حاول تجنبه
```

---

## 🧩 **Shadcn/ui Components**

### **الاستخدام الصحيح:**

```typescript
// ✅ استيراد صحيح
import { Button } from './components/ui/button'
import { Card, CardHeader, CardTitle } from './components/ui/card'

// ✅ استخدام مباشر (بدون typography classes)
<Button>حفظ</Button>

// ✅ مع spacing/colors
<Button className="px-6 py-3 bg-primary">حفظ</Button>

// ✅ Card مع spacing صريح
<Card className="p-6 space-y-4">
  <CardHeader>
    <CardTitle>عنوان</CardTitle>
  </CardHeader>
</Card>
```

### **Override Typography (نادر!):**

```typescript
// فقط عند الضرورة
<Badge className="text-xs">صغير جداً</Badge>
```

---

## 📁 **تنظيم الملفات**

### **تسمية الملفات:**

```
✅ PascalCase للمكونات:
   - LeadsPage.tsx
   - DashboardCard.tsx
   - UserProfile.tsx

✅ camelCase للـ utilities:
   - utils.ts
   - constants.ts
   - validators.ts

✅ kebab-case للـ Shadcn/ui:
   - button.tsx
   - card.tsx
   - input.tsx
```

### **Imports Order:**

```typescript
// 1. React/External
import React from 'react'
import { useState } from 'react'

// 2. UI Components
import { Button } from './components/ui/button'
import { Card } from './components/ui/card'

// 3. Internal Components
import { LeadsTable } from './components/crm/leads/LeadsTable'

// 4. Utilities/Hooks
import { cn } from './lib/utils'
import { useAuth } from './hooks/useAuth'

// 5. Types
import type { Lead } from './types'

// 6. Constants
import { API_URL } from './constants'
```

---

## 🔄 **State Management**

### **Local State:**
```typescript
// ✅ useState
const [count, setCount] = useState(0)

// ✅ useReducer (للـ complex state)
const [state, dispatch] = useReducer(reducer, initialState)
```

### **Side Effects:**
```typescript
// ✅ useEffect
useEffect(() => {
  fetchData()
}, [dependencies])

// ✅ cleanup
useEffect(() => {
  const timer = setInterval(() => {}, 1000)
  return () => clearInterval(timer)
}, [])
```

### **Memoization:**
```typescript
// ✅ useMemo للحسابات الثقيلة
const expensiveValue = useMemo(() => {
  return computeExpensiveValue(input)
}, [input])

// ✅ useCallback للـ handlers
const handleClick = useCallback(() => {
  doSomething()
}, [dependencies])
```

---

## 🎭 **RTL/LTR Support**

### **التبديل التلقائي:**

```typescript
// ✅ استخدام dir attribute
<div dir="rtl">محتوى عربي</div>
<div dir="ltr">English content</div>

// ✅ مع Tailwind
<div className="rtl:text-right ltr:text-left">
  نص متكيف
</div>
```

### **الأيقونات:**

```typescript
// ✅ أيقونات متكيفة
import { ChevronRight, ChevronLeft } from 'lucide-react'

<div dir="rtl">
  {/* في RTL ستظهر اليسار */}
  <ChevronRight className="rtl:rotate-180" />
</div>
```

---

## ⚡ **Performance Best Practices**

### **1. React.memo:**
```typescript
// ✅ للمكونات الثقيلة
export const HeavyComponent = React.memo(({ data }) => {
  return <div>{/* expensive render */}</div>
})
```

### **2. Code Splitting:**
```typescript
// ✅ Lazy loading
const LeadsPage = lazy(() => import('./components/crm/leads/LeadsPage'))

<Suspense fallback={<Loading />}>
  <LeadsPage />
</Suspense>
```

### **3. تجنب Re-renders:**
```typescript
// ❌ خطأ - inline object
<Component style={{ color: 'red' }} />

// ✅ صحيح
const style = { color: 'red' }
<Component style={style} />

// أو استخدم Tailwind
<Component className="text-red-500" />
```

---

## ♿ **Accessibility (WCAG AA)**

### **التباين:**
```css
/* ✅ النسبة المطلوبة: 4.5:1 */
--foreground: #E6EDF3;  /* على */
--background: #030213;  /* = 14.8:1 ✓ */
```

### **Keyboard Navigation:**
```typescript
// ✅ focus visible
<button className="focus-visible:ring-2 focus-visible:ring-ring">
  زر
</button>

// ✅ tabindex
<div tabIndex={0} role="button">
  قابل للتركيز
</div>
```

### **Screen Readers:**
```typescript
// ✅ aria labels
<button aria-label="إغلاق النافذة">
  <X />
</button>

// ✅ semantic HTML
<nav>
  <ul>
    <li><a href="/dashboard">لوحة التحكم</a></li>
  </ul>
</nav>
```

---

## 🔒 **Security Best Practices**

### **1. تنظيف المدخلات:**
```typescript
import { sanitizeHtml } from './lib/security/sanitize'

// ✅ صحيح
const cleanInput = sanitizeHtml(userInput)
<div dangerouslySetInnerHTML={{ __html: cleanInput }} />
```

### **2. عدم تخزين بيانات حساسة:**
```typescript
// ❌ خطأ
localStorage.setItem('password', password)

// ✅ صحيح (استخدم session أو httpOnly cookies)
// لا تخزن كلمات السر في localStorage
```

### **3. استخدام env variables:**
```typescript
// ✅ صحيح
const API_URL = import.meta.env.VITE_API_URL

// ❌ خطأ
const API_KEY = 'hardcoded-api-key-123'  // لا!
```

---

## 🧪 **Testing Guidelines**

### **Component Testing:**
```typescript
// TODO: إضافة اختبارات
// يُفضل استخدام:
// - Vitest للوحدة
// - React Testing Library للمكونات
// - Playwright للـ E2E
```

---

## 🔄 **Git Workflow**

### **Commit Messages:**
```bash
# ✅ Conventional Commits
feat: add leads filter feature
fix: resolve dark mode toggle bug
docs: update setup guide
style: format code with prettier
refactor: simplify dashboard logic
perf: optimize pipeline board rendering
test: add tests for leads page
chore: update dependencies

# ❌ خطأ
"fixed stuff"
"wip"
"asdf"
```

### **Branching:**
```bash
main           # الإنتاج
develop        # التطوير
feature/*      # ميزات جديدة
fix/*          # إصلاح أخطاء
hotfix/*       # إصلاح عاجل
```

---

## 📦 **Dependencies Management**

### **إضافة مكتبة جديدة:**

```bash
# ✅ تثبيت مع حفظ
npm install package-name

# ✅ dev dependency
npm install -D package-name

# ✅ تحديد version محدد (عند الحاجة)
npm install package@1.2.3
```

### **المكتبات المعتمدة:**

```json
{
  "dependencies": {
    "react": "^19.1.1",
    "vite": "^6.0.5",
    "tailwindcss": "^4.1.14",
    "typescript": "^5.9.2",
    "lucide-react": "latest",
    "recharts": "latest",
    "react-dnd": "latest",
    "motion": "latest"
  }
}
```

راجع `package.json` للقائمة الكاملة.

---

## 🎯 **Do's and Don'ts**

### ✅ **افعل:**

- استخدم Functional Components
- استخدم TypeScript Strict Mode
- استخدم Tailwind للـ spacing/colors
- استخدم HTML elements للـ typography
- اكتب كود واضح وقابل للصيانة
- أضف تعليقات للأجزاء المعقدة فقط
- اتبع Conventional Commits

### ❌ **لا تفعل:**

- لا تستخدم Class Components
- لا تستخدم `any` في TypeScript
- لا تستخدم typography classes إلا للضرورة
- لا تستخدم `!important` في CSS
- لا تستخدم inline styles إلا للضرورة
- لا تترك `console.log` في الإنتاج
- لا تخزن بيانات حساسة في localStorage

---

## 📚 **المراجع**

### **التوثيق الداخلي:**
- [`SETUP.md`](./SETUP.md) - الإعداد
- [`DEVELOPMENT.md`](./DEVELOPMENT.md) - التطوير
- [`STYLING.md`](./STYLING.md) - التصميم
- [`COMPONENTS.md`](./COMPONENTS.md) - المكونات

### **التوثيق الخارجي:**
- [React 19 Docs](https://react.dev/)
- [Vite Docs](https://vitejs.dev/)
- [Tailwind CSS v4](https://tailwindcss.com/)
- [Shadcn/ui](https://ui.shadcn.com/)
- [TypeScript](https://www.typescriptlang.org/)

---

## ✅ **Checklist**

عند كتابة كود جديد، تأكد من:

- [ ] ✅ استخدام Functional Components
- [ ] ✅ TypeScript بدون `any`
- [ ] ✅ HTML elements بدون typography classes
- [ ] ✅ Tailwind للـ spacing/colors فقط
- [ ] ✅ Proper imports order
- [ ] ✅ useCallback للـ handlers
- [ ] ✅ React.memo للمكونات الثقيلة
- [ ] ✅ Accessibility (WCAG AA)
- [ ] ✅ RTL Support (إذا لزم)
- [ ] ✅ Conventional Commits
- [ ] ✅ لا `console.log` في الإنتاج

---

**تم بواسطة:** فريق CRM Nxs  
**التاريخ:** 2025-10-16  
**الحالة:** 🟢 Production Ready
