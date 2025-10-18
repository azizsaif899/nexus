# 🎨 Design Tokens Reference

<div align="center">

# نظام Design Tokens
# Design Tokens System

**Nexus AI Design System**  
**Version**: 2.0.3  
**Last Updated**: October 5, 2025

</div>

---

## 📋 جدول المحتويات / Table of Contents

1. [ما هي Design Tokens؟](#what-are-tokens)
2. [نظام الألوان](#color-system)
3. [الخطوط والطباعة](#typography)
4. [المسافات والأحجام](#spacing)
5. [الثيمات](#themes)
6. [الاستخدام](#usage)

---

## <a id="what-are-tokens"></a>🎯 ما هي Design Tokens؟

**Design Tokens** هي القيم الأساسية للتصميم المخزنة كمتغيرات CSS، مما يسمح بـ:
- ✅ تناسق التصميم في جميع أنحاء التطبيق
- ✅ سهولة تغيير الألوان والثيمات
- ✅ دعم Light/Dark mode تلقائياً
- ✅ صيانة أسهل وأسرع

---

## <a id="color-system"></a>🎨 نظام الألوان / Color System

### Primary Colors / الألوان الأساسية

| Token | Light Mode | Dark Mode | الاستخدام / Usage |
|-------|-----------|-----------|-------------------|
| `--background` | `#ffffff` | `oklch(0.145 0 0)` | خلفية الصفحة الرئيسية |
| `--foreground` | `oklch(0.145 0 0)` | `oklch(0.985 0 0)` | لون النص الرئيسي |
| `--primary` | `#030213` | `oklch(0.985 0 0)` | اللون الأساسي للعلامة التجارية |
| `--primary-foreground` | `oklch(1 0 0)` | `oklch(0.205 0 0)` | نص على الخلفية الأساسية |

### Secondary Colors / الألوان الثانوية

| Token | Light Mode | Dark Mode | الاستخدام / Usage |
|-------|-----------|-----------|-------------------|
| `--secondary` | `oklch(0.95 0.0058 264.53)` | `oklch(0.269 0 0)` | عناصر ثانوية |
| `--secondary-foreground` | `#030213` | `oklch(0.985 0 0)` | نص على الخلفية الثانوية |
| `--muted` | `#ececf0` | `oklch(0.269 0 0)` | عناصر مخففة |
| `--muted-foreground` | `#717182` | `oklch(0.708 0 0)` | نص مخفف |

### UI Colors / ألوان الواجهة

| Token | Light Mode | Dark Mode | الاستخدام / Usage |
|-------|-----------|-----------|-------------------|
| `--card` | `#ffffff` | `oklch(0.145 0 0)` | خلفية البطاقات |
| `--card-foreground` | `oklch(0.145 0 0)` | `oklch(0.985 0 0)` | نص البطاقات |
| `--border` | `rgba(0, 0, 0, 0.1)` | `oklch(0.269 0 0)` | الحدود |
| `--input` | `transparent` | `oklch(0.269 0 0)` | خلفية الإدخال |
| `--input-background` | `#f3f3f5` | `oklch(0.205 0 0)` | خلفية حقول الإدخال |
| `--ring` | `oklch(0.708 0 0)` | `oklch(0.439 0 0)` | Focus ring |

### Semantic Colors / الألوان الدلالية

| Token | Light Mode | Dark Mode | الاستخدام / Usage |
|-------|-----------|-----------|-------------------|
| `--destructive` | `#d4183d` | `oklch(0.396 0.141 25.723)` | أزرار الحذف/الخطر |
| `--destructive-foreground` | `#ffffff` | `oklch(0.637 0.237 25.331)` | نص على الخلفية الخطرة |
| `--accent` | `#e9ebef` | `oklch(0.269 0 0)` | تمييز العناصر |
| `--accent-foreground` | `#030213` | `oklch(0.985 0 0)` | نص على الخلفية المميزة |

### Chart Colors / ألوان الرسوم البيانية

| Token | Light Mode | Dark Mode | الاستخدام / Usage |
|-------|-----------|-----------|-------------------|
| `--chart-1` | `oklch(0.646 0.222 41.116)` | `oklch(0.488 0.243 264.376)` | رسم بياني 1 |
| `--chart-2` | `oklch(0.6 0.118 184.704)` | `oklch(0.696 0.17 162.48)` | رسم بياني 2 |
| `--chart-3` | `oklch(0.398 0.07 227.392)` | `oklch(0.769 0.188 70.08)` | رسم بياني 3 |
| `--chart-4` | `oklch(0.828 0.189 84.429)` | `oklch(0.627 0.265 303.9)` | رسم بياني 4 |
| `--chart-5` | `oklch(0.769 0.188 70.08)` | `oklch(0.645 0.246 16.439)` | رسم بياني 5 |

---

## <a id="typography"></a>✍️ الخطوط والطباعة / Typography

### Font Families / عائلات الخطوط

| Token | Value | الاستخدام / Usage |
|-------|-------|-------------------|
| `--font-inter` | `'Inter', sans-serif` | للنصوص الإنجليزية (LTR) |
| `--font-cairo` | `'Cairo', sans-serif` | للنصوص العربية (RTL) |

### Font Weights / أوزان الخطوط

| Token | Value | الاستخدام / Usage |
|-------|-------|-------------------|
| `--font-weight-normal` | `400` | النص العادي |
| `--font-weight-medium` | `500` | العناوين والأزرار |

### Font Sizes / أحجام الخطوط

> ⚠️ **ملاحظة**: لا تستخدم Tailwind classes للخطوط (`text-xl`, `font-bold`) إلا إذا طلب المستخدم ذلك.  
> النظام يستخدم typography defaults من `globals.css`.

| Element | Font Size | Font Weight | Line Height |
|---------|-----------|-------------|-------------|
| `h1` | `var(--text-2xl)` | `500` | `1.5` |
| `h2` | `var(--text-xl)` | `500` | `1.5` |
| `h3` | `var(--text-lg)` | `500` | `1.5` |
| `h4` | `var(--text-base)` | `500` | `1.5` |
| `p` | `var(--text-base)` | `400` | `1.5` |
| `label` | `var(--text-base)` | `500` | `1.5` |
| `button` | `var(--text-base)` | `500` | `1.5` |
| `input` | `var(--text-base)` | `400` | `1.5` |

### Usage Example / مثال الاستخدام

```tsx
// ✅ صحيح - استخدام العناصر الافتراضية
<h1>Welcome to Nexus AI</h1>
<p>This text uses default typography</p>

// ❌ خطأ - لا تستخدم Tailwind classes للطباعة
<h1 className="text-4xl font-bold">Welcome</h1>

// ✅ استثناء - فقط إذا طلب المستخدم
<h1 className="text-5xl font-extrabold">Special Heading</h1>
```

---

## <a id="spacing"></a>📏 المسافات والأحجام / Spacing & Sizing

### Border Radius / نصف قطر الحدود

| Token | Value | الاستخدام / Usage |
|-------|-------|-------------------|
| `--radius` | `0.625rem` (10px) | الحجم الافتراضي |
| `--radius-sm` | `calc(var(--radius) - 4px)` | صغير (6px) |
| `--radius-md` | `calc(var(--radius) - 2px)` | متوسط (8px) |
| `--radius-lg` | `var(--radius)` | كبير (10px) |
| `--radius-xl` | `calc(var(--radius) + 4px)` | كبير جداً (14px) |

### Responsive Breakpoints / نقاط التوقف

| Breakpoint | Value | الاستخدام / Usage |
|-----------|-------|-------------------|
| `sm` | `640px` | الهواتف الكبيرة |
| `md` | `768px` | الأجهزة اللوحية |
| `lg` | `1024px` | الشاشات الصغيرة |
| `xl` | `1280px` | الشاشات الكبيرة |

---

## <a id="themes"></a>🌓 الثيمات / Themes

### Theme Modes / أوضاع الثيم

| Mode | Description |
|------|-------------|
| **Light** | الوضع النهاري - خلفية بيضاء، نص داكن |
| **Dark** | الوضع الليلي - خلفية داكنة، نص فاتح |
| **System** | تلقائي - يتبع إعدادات النظام |

### Theme Switching / تبديل الثيمات

```tsx
import { useTheme } from './contexts/ThemeContext';

function MyComponent() {
  const { theme, setTheme } = useTheme();
  
  return (
    <button onClick={() => setTheme('dark')}>
      Dark Mode
    </button>
  );
}
```

### CSS Classes for Themes

```css
/* Light mode styles */
.light {
  --background: #ffffff;
  --foreground: oklch(0.145 0 0);
}

/* Dark mode styles */
.dark {
  --background: oklch(0.145 0 0);
  --foreground: oklch(0.985 0 0);
}
```

---

## <a id="usage"></a>💡 الاستخدام / Usage

### في CSS / In CSS

```css
.my-component {
  background-color: var(--background);
  color: var(--foreground);
  border: 1px solid var(--border);
  border-radius: var(--radius);
  font-family: var(--font-inter);
}
```

### في Tailwind / In Tailwind

```tsx
// استخدام الألوان
<div className="bg-background text-foreground">
  <h1 className="text-primary">Title</h1>
  <p className="text-muted-foreground">Description</p>
</div>

// استخدام border radius
<div className="rounded-lg">Content</div>
<div className="rounded-xl">Content</div>
```

### في React Components

```tsx
function Card({ children }: { children: React.ReactNode }) {
  return (
    <div className="bg-card text-card-foreground border border-border rounded-lg p-6">
      {children}
    </div>
  );
}
```

---

## 🎯 Best Practices / أفضل الممارسات

### ✅ افعل / Do

```tsx
// استخدم tokens للألوان
<div className="bg-background text-foreground">

// استخدم العناصر الدلالية
<button className="bg-destructive text-destructive-foreground">

// استخدم responsive utilities
<div className="p-4 md:p-6 lg:p-8">
```

### ❌ لا تفعل / Don't

```tsx
// لا تستخدم hex colors مباشرة
<div style={{ backgroundColor: '#ffffff' }}>

// لا تستخدم font classes إلا بطلب
<h1 className="text-4xl font-bold">

// لا تستخدم قيم ثابتة
<div style={{ borderRadius: '10px' }}>
```

---

## 🔄 تحديث Tokens / Updating Tokens

### لتغيير لون معين / To Change a Specific Color

1. افتح `/styles/globals.css`
2. ابحث عن token المطلوب في `:root` (light mode)
3. ابحث عنه في `.dark` (dark mode)
4. غيّر القيمة
5. احفظ - سيتم تطبيق التغيير تلقائياً!

```css
/* Example: تغيير اللون الأساسي */
:root {
  --primary: #0066cc; /* اللون الجديد */
}

.dark {
  --primary: #66aaff; /* اللون الجديد للوضع الداكن */
}
```

---

## 📚 الموارد الإضافية / Additional Resources

### الملفات ذات الصلة / Related Files
- [`/styles/globals.css`](../styles/globals.css) - ملف Design Tokens الرئيسي
- [`/docs/Guidelines.md`](./Guidelines.md) - إرشادات التصميم
- [`/docs/COMPONENT_LIBRARY.md`](./COMPONENT_LIBRARY.md) - مكتبة المكونات

### روابط مفيدة / Useful Links
- [Tailwind CSS v4 Docs](https://tailwindcss.com/docs)
- [oklch() Color Space](https://oklch.com/)
- [shadcn/ui Components](https://ui.shadcn.com/)

---

## 🎨 لوحة الألوان الكاملة / Complete Color Palette

### Light Mode Preview

```
Background:  ████████  #ffffff
Foreground:  ████████  oklch(0.145 0 0)
Primary:     ████████  #030213
Secondary:   ████████  oklch(0.95 0.0058 264.53)
Muted:       ████████  #ececf0
Accent:      ████████  #e9ebef
Destructive: ████████  #d4183d
Border:      ████████  rgba(0, 0, 0, 0.1)
```

### Dark Mode Preview

```
Background:  ████████  oklch(0.145 0 0)
Foreground:  ████████  oklch(0.985 0 0)
Primary:     ████████  oklch(0.985 0 0)
Secondary:   ████████  oklch(0.269 0 0)
Muted:       ████████  oklch(0.269 0 0)
Accent:      ████████  oklch(0.269 0 0)
Destructive: ████████  oklch(0.396 0.141 25.723)
Border:      ████████  oklch(0.269 0 0)
```

---

<div align="center">

## ✨ نظام متكامل وسهل الاستخدام! ✨
## Complete and Easy-to-Use System!

**Version**: 2.0.3  
**Status**: 🟢 Complete  
**Last Updated**: October 5, 2025

**للمكونات / For Components**: [`COMPONENT_LIBRARY.md`](./COMPONENT_LIBRARY.md)

</div>