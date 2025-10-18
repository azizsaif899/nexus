# 🎨 دليل الهيكل والألوان الشامل
**Structure and Colors Complete Guide**

## 📋 جدول المحتويات

- [البنية المعمارية](#البنية-المعمارية)
- [نظام الألوان](#نظام-الألوان)
- [نظام الطباعة](#نظام-الطباعة)
- [المسافات والتباعد](#المسافات-والتباعد)
- [الظلال والتأثيرات](#الظلال-والتأثيرات)
- [الأنماط البصرية](#الأنماط-البصرية)

---

## 🏗️ البنية المعمارية

### التخطيط العام

```
┌─────────────────────────────────────────────────────────────────┐
│  Toolbar (z-60)                                                 │
│  ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━  │
└─────────────────────────────────────────────────────────────────┘

┌────────┐  ┌──────────────────────────┐  ┌──────────────────────┐
│        │  │                          │  │                      │
│ Nodes  │  │   Canvas (z-10)          │  │  Property Panel     │
│ Sidebar│  │                          │  │  (z-50)             │
│        │  │   [Workflow Nodes]       │  │                      │
│ (z-200)│  │                          │  │  [Node Settings]     │
│        │  │                          │  │                      │
│  [⇦]   │  │   Canvas Controls (z-50) │  │                      │
│        │  │   ┌─────────────┐        │  │                      │
└────────┘  │   │ + = - ⊡     │        │  └──────────────────────┘
            │   │ 100%        │        │
            │   └─────────────┘        │  ┌──────────────────────┐
            └──────────────────────────┘  │  AI Chat Sidebar     │
                                          │  (z-10001)           │
                                          │                      │
                                          │  [⇦]  [Chat]         │
                                          │                      │
                                          └──────────────────────┘

┌─────────────────────────────────────────────────────────────────┐
│  Toast Notifications (z-9999)                                   │
└─────────────────────────────────────────────────────────────────┘
```

### هرمية Z-Index

```typescript
const Z_INDEX = {
  // الطبقات الأساسية
  canvas: 10,
  canvasControls: 50,
  
  // الواجهات الجانبية
  toolbar: 60,
  propertyPanel: 50,
  nodesSidebar: 200,
  nodesSidebarToggle: 250,
  
  // الواجهات المتقدمة
  aiChatSidebar: 10001,
  
  // العناصر التفاعلية
  modal: 1000,
  dropdown: 100,
  tooltip: 9000,
  
  // الإشعارات
  toast: 9999
} as const
```

### البنية الهرمية للمكونات

```
App.tsx
├── ThemeProvider
├── ErrorBoundary
└── MainLayout
    ├── WorkflowToolbarEnhanced (z-60)
    │   ├── FileMenu
    │   ├── EditMenu
    │   ├── ViewMenu
    │   ├── ActionButtons
    │   └── SettingsButtons
    │
    ├── NodeTypesSidebarEnhanced (z-200)
    │   ├── SearchBar
    │   ├── CategoryFilter
    │   └── NodesList
    │       ├── TriggerNodes
    │       ├── ActionNodes
    │       ├── LogicNodes
    │       └── ErrorHandlingNodes
    │
    ├── WorkflowCanvasEnhanced (z-10)
    │   ├── GridSystem
    │   ├── CenterIndicator
    │   ├── WorkflowNodes[]
    │   │   ├── WorkflowNodeEnhanced
    │   │   │   ├── NodeHeader
    │   │   │   ├── NodeContent
    │   │   │   └── NodePorts
    │   │   └── ConnectionLine
    │   └── CanvasControls (z-50)
    │
    ├── PropertyPanel (z-50)
    │   ├── PanelHeader
    │   ├── TabsNavigation
    │   ├── TabsContent
    │   │   ├── GeneralSettings
    │   │   ├── AdvancedSettings
    │   │   ├── ConnectionsSettings
    │   │   └── ErrorHandling
    │   └── ActionButtons
    │
    ├── AIChatSidebar (z-10001)
    │   ├── ToggleButton
    │   ├── ChatContainer
    │   │   ├── MessagesList
    │   │   └── TypingIndicator
    │   ├── InputSection
    │   │   ├── TextInput
    │   │   ├── SendButton
    │   │   └── QuickSuggestions
    │   └── ScrollArea
    │
    └── Toaster (z-9999)
```

---

## 🎨 نظام الألوان

### الوضع الداكن (Dark Mode) - الافتراضي

#### الألوان الأساسية

```css
:root {
  /* الخلفيات - Backgrounds */
  --background: #202020;              /* الخلفية الرئيسية */
  --background-secondary: #2c2c2c;    /* الأسطح الثانوية */
  --background-elevated: #1E2B35;     /* الكروت والنوافذ */
  --background-hover: #353535;        /* حالة التحويم */
  --background-active: #404040;       /* حالة النشاط */
  
  /* النصوص - Foreground */
  --foreground: #EAEAEA;              /* النص الرئيسي */
  --foreground-muted: #667781;        /* النص الثانوي */
  --foreground-subtle: #9CA3AF;       /* النص الخفيف */
  
  /* اللون الأساسي - Primary */
  --primary: #EAEAEA;                 /* اللون الأساسي (Gray) */
  --primary-hover: #F5F5F5;           /* حالة التحويم */
  --primary-active: #DDDDDD;          /* حالة النشاط */
  --primary-foreground: #202020;      /* نص على الأساسي */
  
  /* اللون الثانوي - Secondary */
  --secondary: #667781;
  --secondary-hover: #7A8A95;
  --secondary-foreground: #EAEAEA;
  
  /* الحدود - Borders */
  --border: rgba(234, 234, 234, 0.2);
  --border-hover: rgba(234, 234, 234, 0.3);
  
  /* الظلال - Shadows */
  --shadow-sm: 0 1px 2px 0 rgba(0, 0, 0, 0.3);
  --shadow-md: 0 4px 6px -1px rgba(0, 0, 0, 0.4);
  --shadow-lg: 0 10px 15px -3px rgba(0, 0, 0, 0.5);
  --shadow-xl: 0 20px 25px -5px rgba(0, 0, 0, 0.6);
}
```

#### ألوان الحالات (State Colors)

```css
:root {
  /* النجاح - Success */
  --success: #10B981;                 /* أخضر */
  --success-hover: #059669;
  --success-bg: rgba(16, 185, 129, 0.1);
  --success-border: rgba(16, 185, 129, 0.3);
  
  /* الخطأ - Error */
  --error: #EF4444;                   /* أحمر */
  --error-hover: #DC2626;
  --error-bg: rgba(239, 68, 68, 0.1);
  --error-border: rgba(239, 68, 68, 0.3);
  
  /* التحذير - Warning */
  --warning: #F59E0B;                 /* برتقالي */
  --warning-hover: #D97706;
  --warning-bg: rgba(245, 158, 11, 0.1);
  --warning-border: rgba(245, 158, 11, 0.3);
  
  /* المعلومات - Info */
  --info: #3B82F6;                    /* أزرق */
  --info-hover: #2563EB;
  --info-bg: rgba(59, 130, 246, 0.1);
  --info-border: rgba(59, 130, 246, 0.3);
}
```

#### ألوان العقد (Node Colors)

```css
:root {
  /* عقد الإطلاق - Triggers */
  --node-trigger: #8B5CF6;            /* بنفسجي */
  --node-trigger-bg: rgba(139, 92, 246, 0.1);
  --node-trigger-border: rgba(139, 92, 246, 0.3);
  
  /* عقد الإجراءات - Actions */
  --node-action: #06B6D4;             /* سماوي */
  --node-action-bg: rgba(6, 182, 212, 0.1);
  --node-action-border: rgba(6, 182, 212, 0.3);
  
  /* عقد المنطق - Logic */
  --node-logic: #F59E0B;              /* برتقالي */
  --node-logic-bg: rgba(245, 158, 11, 0.1);
  --node-logic-border: rgba(245, 158, 11, 0.3);
  
  /* عقد معالجة الأخطاء - Error Handling */
  --node-error: #EF4444;              /* أحمر */
  --node-error-bg: rgba(239, 68, 68, 0.1);
  --node-error-border: rgba(239, 68, 68, 0.3);
  
  /* عقد البيانات - Data */
  --node-data: #10B981;               /* أخضر */
  --node-data-bg: rgba(16, 185, 129, 0.1);
  --node-data-border: rgba(16, 185, 129, 0.3);
}
```

### الوضع الفاتح (Light Mode)

```css
[data-theme="light"] {
  /* الخلفيات */
  --background: #FFFFFF;
  --background-secondary: #F9FAFB;
  --background-elevated: #FFFFFF;
  --background-hover: #F3F4F6;
  --background-active: #E5E7EB;
  
  /* النصوص */
  --foreground: #111827;
  --foreground-muted: #6B7280;
  --foreground-subtle: #9CA3AF;
  
  /* اللون الأساسي */
  --primary: #111827;
  --primary-hover: #1F2937;
  --primary-active: #374151;
  --primary-foreground: #FFFFFF;
  
  /* الحدود */
  --border: rgba(17, 24, 39, 0.1);
  --border-hover: rgba(17, 24, 39, 0.2);
  
  /* الظلال */
  --shadow-sm: 0 1px 2px 0 rgba(0, 0, 0, 0.05);
  --shadow-md: 0 4px 6px -1px rgba(0, 0, 0, 0.1);
  --shadow-lg: 0 10px 15px -3px rgba(0, 0, 0, 0.15);
  --shadow-xl: 0 20px 25px -5px rgba(0, 0, 0, 0.2);
}
```

### استخدام الألوان في الكود

```typescript
// في المكونات
<div className="bg-background text-foreground">
  <h1 className="text-foreground">عنوان</h1>
  <p className="text-foreground-muted">وصف</p>
</div>

// الحدود
<div className="border border-foreground-muted/20">
  محتوى بحدود
</div>

// الخلفيات
<div className="bg-background-elevated hover:bg-background-hover">
  عنصر قابل للتحويم
</div>

// ألوان العقد
<div className="bg-node-trigger-bg border border-node-trigger-border">
  <span className="text-node-trigger">Trigger Node</span>
</div>

// ألوان الحالات
<Alert variant="success">
  <div className="text-success">عملية ناجحة!</div>
</Alert>

<Alert variant="error">
  <div className="text-error">حدث خطأ!</div>
</Alert>
```

---

## 📝 نظام الطباعة

### الخطوط المستخدمة

```css
/* styles/globals.css */
@import url('https://fonts.googleapis.com/css2?family=Cairo:wght@200;300;400;500;600;700;800&display=swap');
@import url('https://fonts.googleapis.com/css2?family=Inter:wght@100;200;300;400;500;600;700;800;900&display=swap');

:root {
  /* عائلات الخطوط */
  --font-sans: 'Cairo', 'Inter', system-ui, -apple-system, sans-serif;
  --font-mono: 'Fira Code', 'Consolas', 'Monaco', monospace;
  
  /* الأحجام - مع clamp() للتجاوب */
  --text-xs: clamp(0.625rem, 0.8vw, 0.75rem);      /* 10-12px */
  --text-sm: clamp(0.75rem, 0.9vw, 0.875rem);      /* 12-14px */
  --text-base: clamp(0.875rem, 1vw, 1rem);         /* 14-16px */
  --text-lg: clamp(1rem, 1.125vw, 1.125rem);       /* 16-18px */
  --text-xl: clamp(1.125rem, 1.25vw, 1.25rem);     /* 18-20px */
  --text-2xl: clamp(1.25rem, 1.5vw, 1.5rem);       /* 20-24px */
  --text-3xl: clamp(1.5rem, 1.875vw, 1.875rem);    /* 24-30px */
  --text-4xl: clamp(1.875rem, 2.25vw, 2.25rem);    /* 30-36px */
  
  /* أوزان الخطوط */
  --font-light: 300;
  --font-normal: 400;
  --font-medium: 500;
  --font-semibold: 600;
  --font-bold: 700;
  --font-extrabold: 800;
  
  /* ارتفاع الأسطر */
  --leading-tight: 1.25;
  --leading-snug: 1.375;
  --leading-normal: 1.5;
  --leading-relaxed: 1.625;
  --leading-loose: 2;
  
  /* تباعد الأحرف */
  --tracking-tight: -0.025em;
  --tracking-normal: 0;
  --tracking-wide: 0.025em;
}
```

### التنسيقات الافتراضية

```css
/* العناوين */
h1 {
  font-size: var(--text-4xl);
  font-weight: var(--font-bold);
  line-height: var(--leading-tight);
  letter-spacing: var(--tracking-tight);
}

h2 {
  font-size: var(--text-3xl);
  font-weight: var(--font-bold);
  line-height: var(--leading-tight);
}

h3 {
  font-size: var(--text-2xl);
  font-weight: var(--font-semibold);
  line-height: var(--leading-snug);
}

h4 {
  font-size: var(--text-xl);
  font-weight: var(--font-semibold);
  line-height: var(--leading-snug);
}

h5 {
  font-size: var(--text-lg);
  font-weight: var(--font-medium);
  line-height: var(--leading-normal);
}

h6 {
  font-size: var(--text-base);
  font-weight: var(--font-medium);
  line-height: var(--leading-normal);
}

/* الفقرات */
p {
  font-size: var(--text-base);
  font-weight: var(--font-normal);
  line-height: var(--leading-relaxed);
}

/* النصوص الصغيرة */
small {
  font-size: var(--text-sm);
  line-height: var(--leading-normal);
}

/* الأكواد */
code, pre {
  font-family: var(--font-mono);
  font-size: var(--text-sm);
  line-height: var(--leading-normal);
}
```

### دعم اللغة العربية

```css
/* تحسينات للنصوص العربية */
[dir="rtl"] {
  font-family: 'Cairo', system-ui, -apple-system, sans-serif;
  letter-spacing: 0; /* إزالة تباعد الأحرف للعربية */
}

/* تحسين العرض */
[dir="rtl"] h1, 
[dir="rtl"] h2, 
[dir="rtl"] h3 {
  font-weight: var(--font-extrabold); /* وزن أثقل للعناوين العربية */
}

/* الأرقام العربية */
.arabic-numerals {
  font-feature-settings: "ss01"; /* استخدام الأرقام العربية */
}
```

---

## 📏 المسافات والتباعد

### نظام المسافات (Spacing Scale)

```css
:root {
  --space-0: 0;
  --space-px: 1px;
  --space-0_5: 0.125rem;  /* 2px */
  --space-1: 0.25rem;     /* 4px */
  --space-1_5: 0.375rem;  /* 6px */
  --space-2: 0.5rem;      /* 8px */
  --space-2_5: 0.625rem;  /* 10px */
  --space-3: 0.75rem;     /* 12px */
  --space-3_5: 0.875rem;  /* 14px */
  --space-4: 1rem;        /* 16px */
  --space-5: 1.25rem;     /* 20px */
  --space-6: 1.5rem;      /* 24px */
  --space-7: 1.75rem;     /* 28px */
  --space-8: 2rem;        /* 32px */
  --space-9: 2.25rem;     /* 36px */
  --space-10: 2.5rem;     /* 40px */
  --space-12: 3rem;       /* 48px */
  --space-16: 4rem;       /* 64px */
  --space-20: 5rem;       /* 80px */
  --space-24: 6rem;       /* 96px */
}
```

### استخدام المسافات

```typescript
// الهوامش والحشو
<div className="p-4">          // padding: 1rem (16px)
<div className="px-6 py-4">    // padding-x: 1.5rem, padding-y: 1rem
<div className="m-8">          // margin: 2rem (32px)
<div className="mx-auto">      // margin-x: auto (توسيط)
<div className="mt-2 mb-4">    // margin-top: 0.5rem, margin-bottom: 1rem

// الفجوات (Gap)
<div className="flex gap-2">   // gap: 0.5rem
<div className="grid gap-4">   // gap: 1rem
<div className="space-y-6">    // فجوة عمودية: 1.5rem
<div className="space-x-3">    // فجوة أفقية: 0.75rem
```

### الأبعاد القياسية

```css
:root {
  /* الأزرار */
  --button-height-sm: 2.25rem;   /* 36px */
  --button-height-md: 2.5rem;    /* 40px */
  --button-height-lg: 2.75rem;   /* 44px */
  
  /* الحقول */
  --input-height-sm: 2rem;       /* 32px */
  --input-height-md: 2.5rem;     /* 40px */
  --input-height-lg: 3rem;       /* 48px */
  
  /* الكروت */
  --card-padding: 1.5rem;        /* 24px */
  --card-radius: 0.75rem;        /* 12px */
  
  /* الشريط الجانبي */
  --sidebar-width: 20rem;        /* 320px */
  --sidebar-collapsed: 3rem;     /* 48px */
  
  /* الشريط العلوي */
  --toolbar-height: 4rem;        /* 64px */
}
```

---

## 🌈 الظلال والتأثيرات

### الظلال (Shadows)

```css
/* الظلال القياسية */
.shadow-xs {
  box-shadow: 0 1px 2px 0 rgba(0, 0, 0, 0.05);
}

.shadow-sm {
  box-shadow: 0 1px 3px 0 rgba(0, 0, 0, 0.1),
              0 1px 2px -1px rgba(0, 0, 0, 0.1);
}

.shadow-md {
  box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1),
              0 2px 4px -2px rgba(0, 0, 0, 0.1);
}

.shadow-lg {
  box-shadow: 0 10px 15px -3px rgba(0, 0, 0, 0.1),
              0 4px 6px -4px rgba(0, 0, 0, 0.1);
}

.shadow-xl {
  box-shadow: 0 20px 25px -5px rgba(0, 0, 0, 0.1),
              0 8px 10px -6px rgba(0, 0, 0, 0.1);
}

.shadow-2xl {
  box-shadow: 0 25px 50px -12px rgba(0, 0, 0, 0.25);
}

/* ظلال ملونة */
.shadow-primary {
  box-shadow: 0 10px 15px -3px rgba(234, 234, 234, 0.2);
}

.shadow-success {
  box-shadow: 0 10px 15px -3px rgba(16, 185, 129, 0.2);
}

.shadow-error {
  box-shadow: 0 10px 15px -3px rgba(239, 68, 68, 0.2);
}
```

### التأثيرات البصرية

#### Glassmorphism

```css
.glass {
  background: rgba(30, 43, 53, 0.7);
  backdrop-filter: blur(10px);
  -webkit-backdrop-filter: blur(10px);
  border: 1px solid rgba(234, 234, 234, 0.1);
  box-shadow: 0 8px 32px 0 rgba(0, 0, 0, 0.37);
}

.glass-light {
  background: rgba(255, 255, 255, 0.25);
  backdrop-filter: blur(10px);
  -webkit-backdrop-filter: blur(10px);
  border: 1px solid rgba(255, 255, 255, 0.18);
}
```

#### Neumorphism

```css
.neumorphic {
  background: var(--background-elevated);
  box-shadow: 
    8px 8px 16px rgba(0, 0, 0, 0.3),
    -8px -8px 16px rgba(255, 255, 255, 0.05);
  border-radius: 16px;
}

.neumorphic-inset {
  background: var(--background-elevated);
  box-shadow: 
    inset 8px 8px 16px rgba(0, 0, 0, 0.3),
    inset -8px -8px 16px rgba(255, 255, 255, 0.05);
  border-radius: 16px;
}
```

### الانتقالات (Transitions)

```css
:root {
  /* المدد */
  --duration-fast: 150ms;
  --duration-normal: 200ms;
  --duration-slow: 300ms;
  --duration-slower: 500ms;
  
  /* التسارع */
  --ease-in: cubic-bezier(0.4, 0, 1, 1);
  --ease-out: cubic-bezier(0, 0, 0.2, 1);
  --ease-in-out: cubic-bezier(0.4, 0, 0.2, 1);
  --ease-spring: cubic-bezier(0.68, -0.55, 0.265, 1.55);
}

/* الفئات المساعدة */
.transition-fast {
  transition: all var(--duration-fast) var(--ease-out);
}

.transition-normal {
  transition: all var(--duration-normal) var(--ease-out);
}

.transition-slow {
  transition: all var(--duration-slow) var(--ease-out);
}

.transition-spring {
  transition: all var(--duration-normal) var(--ease-spring);
}
```

---

## 🎭 الأنماط البصرية

### الحدود والزوايا

```css
:root {
  /* نصف القطر */
  --radius-none: 0;
  --radius-sm: 0.25rem;   /* 4px */
  --radius-md: 0.5rem;    /* 8px */
  --radius-lg: 0.75rem;   /* 12px */
  --radius-xl: 1rem;      /* 16px */
  --radius-2xl: 1.5rem;   /* 24px */
  --radius-3xl: 2rem;     /* 32px */
  --radius-full: 9999px;  /* دائري كامل */
  
  /* سُمك الحدود */
  --border-thin: 1px;
  --border-normal: 2px;
  --border-thick: 3px;
  --border-bold: 4px;
}
```

### التدرجات اللونية

```css
/* تدرجات حديثة */
.gradient-primary {
  background: linear-gradient(
    135deg,
    #EAEAEA 0%,
    #C0C0C0 100%
  );
}

.gradient-success {
  background: linear-gradient(
    135deg,
    #10B981 0%,
    #059669 100%
  );
}

.gradient-vibrant {
  background: linear-gradient(
    135deg,
    #8B5CF6 0%,
    #06B6D4 50%,
    #10B981 100%
  );
}

/* تدرجات شبكية */
.gradient-mesh {
  background: 
    radial-gradient(at 40% 20%, #8B5CF6 0px, transparent 50%),
    radial-gradient(at 80% 0%, #06B6D4 0px, transparent 50%),
    radial-gradient(at 0% 50%, #10B981 0px, transparent 50%),
    radial-gradient(at 80% 50%, #F59E0B 0px, transparent 50%),
    radial-gradient(at 0% 100%, #EF4444 0px, transparent 50%),
    radial-gradient(at 80% 100%, #8B5CF6 0px, transparent 50%);
}
```

### الأنماط النصية

```css
/* التزيينات */
.text-gradient {
  background: linear-gradient(135deg, #EAEAEA 0%, #667781 100%);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
}

.text-shadow {
  text-shadow: 0 2px 4px rgba(0, 0, 0, 0.3);
}

.text-outline {
  -webkit-text-stroke: 1px var(--foreground-muted);
}

/* التأثيرات */
.text-glow {
  text-shadow: 
    0 0 10px rgba(234, 234, 234, 0.5),
    0 0 20px rgba(234, 234, 234, 0.3),
    0 0 30px rgba(234, 234, 234, 0.1);
}
```

---

## 📱 التصميم المتجاوب

### نقاط الانقطاع (Breakpoints)

```css
:root {
  --screen-sm: 640px;   /* هواتف */
  --screen-md: 768px;   /* تابلت عمودي */
  --screen-lg: 1024px;  /* تابلت أفقي */
  --screen-xl: 1280px;  /* سطح مكتب */
  --screen-2xl: 1536px; /* شاشات كبيرة */
}

/* استعلامات الوسائط */
@media (min-width: 640px) {
  /* sm: */
}

@media (min-width: 768px) {
  /* md: */
}

@media (min-width: 1024px) {
  /* lg: */
}

@media (min-width: 1280px) {
  /* xl: */
}

@media (min-width: 1536px) {
  /* 2xl: */
}
```

### أمثلة التجاوب

```typescript
// عرض مختلف حسب الشاشة
<div className="w-full sm:w-1/2 lg:w-1/3 xl:w-1/4">
  محتوى متجاوب
</div>

// إخفاء على الشاشات الصغيرة
<div className="hidden md:block">
  يظهر فقط على الشاشات المتوسطة وأكبر
</div>

// تغيير الاتجاه
<div className="flex flex-col md:flex-row gap-4">
  عمودي على الهاتف، أفقي على التابلت
</div>

// نص متجاوب مع clamp()
<h1 style={{ fontSize: 'clamp(1.5rem, 3vw, 2.5rem)' }}>
  عنوان يتكيف مع حجم الشاشة
</h1>
```

---

**آخر تحديث**: 2025-10-16  
**الإصدار**: 1.0.0
