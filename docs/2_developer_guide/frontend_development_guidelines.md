# 🎨 دليل تطوير الواجهات الأمامية - AzizSys AI Assistant

## 📋 نظرة عامة للمبرمج الجديد

**مرحباً بك في فريق تطوير الواجهات!** هذا الدليل سيوضح لك كل ما تحتاجه للعمل على واجهات AzizSys AI Assistant.

---

## 🏗️ هيكل مشروع الواجهات

### 📁 **التطبيقات الرئيسية:**
```
apps/
├── admin-dashboard/         # لوحة الإدارة (React + TypeScript)
├── web-chatbot/            # واجهة الشات بوت (React + TypeScript)  
├── ai-dashboard/           # لوحة الذكاء الاصطناعي
└── sheets-addon/           # إضافة Google Sheets
```

### 📦 **حزم الواجهات:**
```
packages/ui/
├── ui-components/          # المكونات الأساسية
├── crm-ui/                # واجهات CRM متخصصة
├── ai-ui/                 # واجهات الذكاء الاصطناعي
├── analytics-ui/          # واجهات التحليلات
├── shared-ui/             # hooks وservices مشتركة
├── sidebar-agents/        # وكلاء الشريط الجانبي
└── notifications/         # نظام الإشعارات
```

**📖 المرجع:** [`packages/README.md`](../packages/README.md)

---

## 🎯 مهامك كمطور واجهات

### **المهام الأساسية:**
1. **تطوير مكونات UI** قابلة للإعادة الاستخدام
2. **تنفيذ التصاميم** حسب المواصفات
3. **تحسين تجربة المستخدم** (UX/UI)
4. **ضمان الاستجابة** على جميع الأجهزة
5. **تكامل مع APIs** الخلفية

### **المهام المتقدمة:**
- تطوير **وكلاء ذكيين** تفاعليين
- تنفيذ **الرسوم البيانية** التفاعلية
- إنشاء **لوحات تحكم** ديناميكية
- تطوير **تجارب محادثة** ذكية

---

## 📐 القواعد والمعايير

### **🎨 معايير التصميم:**
- **نظام الألوان:** استخدم متغيرات CSS المحددة
- **التباعد:** استخدم وحدات 8px (8, 16, 24, 32...)
- **الخطوط:** Roboto للإنجليزية، Cairo للعربية
- **الأيقونات:** Material Icons أو Lucide React

### **⚛️ معايير React:**
```typescript
// ✅ صحيح - مكون وظيفي مع TypeScript
interface ButtonProps {
  variant: 'primary' | 'secondary';
  onClick: () => void;
  children: React.ReactNode;
}

export const Button: React.FC<ButtonProps> = ({ variant, onClick, children }) => {
  return (
    <button 
      className={`btn btn-${variant}`}
      onClick={onClick}
    >
      {children}
    </button>
  );
};

// ❌ خاطئ - بدون types
export const Button = ({ variant, onClick, children }) => {
  // ...
};
```

### **📱 معايير الاستجابة:**
```css
/* Mobile First Approach */
.component {
  /* Mobile styles */
}

@media (min-width: 768px) {
  .component {
    /* Tablet styles */
  }
}

@media (min-width: 1024px) {
  .component {
    /* Desktop styles */
  }
}
```

**📖 المرجع:** [`docs/2_developer_guide/coding_standards.md`](./coding_standards.md)

---

## 🛠️ الأدوات والتقنيات

### **التقنيات الأساسية:**
- **React 18** - مكتبة الواجهات
- **TypeScript** - لغة البرمجة
- **Tailwind CSS** - إطار التصميم
- **Vite** - أداة البناء
- **React Router** - التنقل

### **المكتبات المساعدة:**
- **React Query** - إدارة البيانات
- **Zustand** - إدارة الحالة
- **React Hook Form** - إدارة النماذج
- **Framer Motion** - الحركات والانتقالات
- **Chart.js** - الرسوم البيانية

### **أدوات التطوير:**
```bash
# تشغيل التطبيق
pnpm dev:admin-dashboard
pnpm dev:web-chatbot

# بناء للإنتاج
pnpm build admin-dashboard

# اختبار المكونات
pnpm test ui-components

# فحص الكود
pnpm lint:fix
```

---

## 🚀 البدء السريع

### **1. إعداد البيئة:**
```bash
# استنساخ المشروع
git clone <repository-url>
cd g-assistant-nx

# تثبيت التبعيات
pnpm install

# تشغيل لوحة الإدارة
pnpm dev:admin-dashboard
```

### **2. إنشاء مكون جديد:**
```bash
# إنشاء مكون في ui-components
nx generate @nx/react:component MyComponent --project=ui-components --export
```

### **3. استخدام المكونات الموجودة:**
```typescript
import { Button, Card, Input } from '@azizsys/ui/ui-components';
import { CRMDashboard } from '@azizsys/ui/crm-ui';

export const MyPage = () => {
  return (
    <Card>
      <CRMDashboard />
      <Button variant="primary" onClick={() => {}}>
        حفظ
      </Button>
    </Card>
  );
};
```

**📖 المرجع:** [`docs/2_developer_guide/NEW_DEVELOPER_ONBOARDING.md`](./NEW_DEVELOPER_ONBOARDING.md)

---

## ⚠️ تجنب الأخطاء الشائعة

### **🚫 أخطاء يجب تجنبها:**

1. **عدم استخدام TypeScript:**
```typescript
// ❌ خاطئ
const handleClick = (data) => {
  // ...
};

// ✅ صحيح
const handleClick = (data: UserData) => {
  // ...
};
```

2. **تجاهل الاستجابة:**
```css
/* ❌ خاطئ - أحجام ثابتة */
.sidebar {
  width: 300px;
}

/* ✅ صحيح - مرن */
.sidebar {
  width: 100%;
  max-width: 300px;
}
```

3. **عدم معالجة حالات التحميل:**
```typescript
// ✅ صحيح
const MyComponent = () => {
  const { data, loading, error } = useQuery();
  
  if (loading) return <LoadingSpinner />;
  if (error) return <ErrorMessage error={error} />;
  
  return <div>{data}</div>;
};
```

4. **تجاهل إمكانية الوصول:**
```typescript
// ✅ صحيح
<button 
  aria-label="إغلاق النافذة"
  onClick={onClose}
>
  ×
</button>
```

---

## 🎨 نظام التصميم

### **الألوان الأساسية:**
```css
:root {
  --primary: #2563eb;
  --secondary: #64748b;
  --success: #10b981;
  --warning: #f59e0b;
  --error: #ef4444;
  --background: #ffffff;
  --surface: #f8fafc;
  --text-primary: #1e293b;
  --text-secondary: #64748b;
}
```

### **المكونات الأساسية:**
- **Button** - [`packages/ui/ui-components/src/components/Button.tsx`](../../packages/ui/ui-components/src/components/Button.tsx)
- **Card** - [`packages/ui/ui-components/src/components/Card.tsx`](../../packages/ui/ui-components/src/components/Card.tsx)
- **Input** - [`packages/ui/ui-components/src/components/Input.tsx`](../../packages/ui/ui-components/src/components/Input.tsx)
- **LoadingSpinner** - [`packages/ui/ui-components/src/components/LoadingSpinner.tsx`](../../packages/ui/ui-components/src/components/LoadingSpinner.tsx)

### **المكونات المتقدمة:**
- **CoPilotBar** - [`packages/ui/crm-ui/ui/CoPilotBar.tsx`](../../packages/ui/crm-ui/ui/CoPilotBar.tsx)
- **SmartKPICard** - [`packages/ui/ui-components/ui/components/SmartKPICard.tsx`](../../packages/ui/ui-components/ui/components/SmartKPICard.tsx)
- **RealtimeCharts** - [`packages/ui/ui-components/ui/components/RealtimeCharts.tsx`](../../packages/ui/ui-components/ui/components/RealtimeCharts.tsx)

---

## 🔗 التكامل مع الخلفية

### **استخدام APIs:**
```typescript
import { useQuery, useMutation } from '@tanstack/react-query';

// جلب البيانات
const useUsers = () => {
  return useQuery({
    queryKey: ['users'],
    queryFn: () => fetch('/api/users').then(res => res.json())
  });
};

// تحديث البيانات
const useCreateUser = () => {
  return useMutation({
    mutationFn: (userData: CreateUserData) => 
      fetch('/api/users', {
        method: 'POST',
        body: JSON.stringify(userData)
      })
  });
};
```

### **إدارة الحالة:**
```typescript
import { create } from 'zustand';

interface AppState {
  user: User | null;
  setUser: (user: User) => void;
  theme: 'light' | 'dark';
  toggleTheme: () => void;
}

export const useAppStore = create<AppState>((set) => ({
  user: null,
  setUser: (user) => set({ user }),
  theme: 'light',
  toggleTheme: () => set((state) => ({ 
    theme: state.theme === 'light' ? 'dark' : 'light' 
  }))
}));
```

---

## 🧪 الاختبارات

### **اختبار المكونات:**
```typescript
import { render, screen, fireEvent } from '@testing-library/react';
import { Button } from './Button';

describe('Button Component', () => {
  it('should render correctly', () => {
    render(<Button variant="primary">Click me</Button>);
    expect(screen.getByText('Click me')).toBeInTheDocument();
  });

  it('should handle click events', () => {
    const handleClick = jest.fn();
    render(<Button onClick={handleClick}>Click me</Button>);
    
    fireEvent.click(screen.getByText('Click me'));
    expect(handleClick).toHaveBeenCalledTimes(1);
  });
});
```

### **تشغيل الاختبارات:**
```bash
# اختبار مكون محدد
pnpm test ui-components

# اختبار مع التغطية
pnpm test:coverage

# اختبار E2E
pnpm test:e2e
```

---

## 📚 المصادر والمراجع

### **التوثيق الداخلي:**
- [دليل المطور الجديد](./NEW_DEVELOPER_ONBOARDING.md)
- [معايير الكود](./coding_standards.md)
- [هيكل الحزم](../../packages/README.md)
- [مرجع API](../3_api/api_reference.md)

### **المصادر الخارجية:**
- [React Documentation](https://react.dev/)
- [TypeScript Handbook](https://www.typescriptlang.org/docs/)
- [Tailwind CSS](https://tailwindcss.com/docs)
- [React Query](https://tanstack.com/query/latest)
- [Testing Library](https://testing-library.com/docs/react-testing-library/intro/)

### **أدوات التصميم:**
- [Figma](https://www.figma.com/) - التصاميم والنماذج
- [Storybook](https://storybook.js.org/) - عرض المكونات
- [Chromatic](https://www.chromatic.com/) - اختبار المكونات البصري

---

## 🎯 الميزات المتقدمة

### **الوكلاء الذكيين:**
```typescript
// مثال على وكيل CFO
import { CFOAgent } from '@azizsys/ui/sidebar-agents';

export const FinancialDashboard = () => {
  return (
    <div className="dashboard">
      <CFOAgent 
        onAnalysisComplete={(data) => {
          // معالجة نتائج التحليل المالي
        }}
      />
    </div>
  );
};
```

### **الرسوم البيانية التفاعلية:**
```typescript
import { RealtimeCharts } from '@azizsys/ui/ui-components';

export const AnalyticsDashboard = () => {
  return (
    <RealtimeCharts
      type="line"
      data={chartData}
      realtime={true}
      updateInterval={5000}
    />
  );
};
```

### **واجهة المحادثة الذكية:**
```typescript
import { CoPilotBar } from '@azizsys/ui/crm-ui';

export const SmartInterface = () => {
  const [isOpen, setIsOpen] = useState(false);
  
  return (
    <>
      <CoPilotBar 
        isOpen={isOpen}
        onClose={() => setIsOpen(false)}
      />
      {/* باقي المحتوى */}
    </>
  );
};
```

---

## 🚀 الخطوات التالية

### **للمبتدئين:**
1. **اقرأ** هذا الدليل كاملاً
2. **استكشف** المكونات الموجودة
3. **ابدأ** بمهمة بسيطة (إنشاء مكون Button)
4. **اطلب المراجعة** من الفريق

### **للمتقدمين:**
1. **طور** وكلاء ذكيين جدد
2. **حسن** الأداء والاستجابة
3. **اكتب** اختبارات شاملة
4. **ساهم** في نظام التصميم

---

## 🎊 رؤيتنا وأهدافنا

**نحن نبني واجهات ذكية تتفاعل مع المستخدم بطريقة طبيعية وبديهية.**

### **المبادئ الأساسية:**
- **البساطة** - واجهات سهلة الاستخدام
- **الذكاء** - تفاعل ذكي مع المستخدم
- **الجمال** - تصميم أنيق ومتسق
- **الأداء** - سرعة واستجابة عالية

### **الهدف النهائي:**
إنشاء تجربة مستخدم استثنائية تجعل التفاعل مع الذكاء الاصطناعي أمراً طبيعياً وممتعاً.

---

**🎨 مرحباً بك في فريق تطوير الواجهات! نتطلع لإبداعاتك المميزة! 🎨**