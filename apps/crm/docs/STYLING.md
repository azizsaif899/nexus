# 🎨 دليل التصميم - Styling Guide

> **المشروع:** CRM Nxs  
> **الإصدار:** 1.0.0  
> **التاريخ:** 2025-10-16

---

## 🎯 **القاعدة الذهبية**

### ⚠️ **لا تستخدم Typography Classes**

```typescript
// ❌ خطأ
<h1 className="text-3xl font-bold leading-tight">عنوان</h1>
<p className="text-base font-normal">نص</p>
<button className="text-sm font-medium">زر</button>

// ✅ صحيح
<h1>عنوان</h1>       // 24px, 600 من globals.css
<p>نص</p>            // 16px, 400 من globals.css
<button>زر</button>  // 16px, 500 من globals.css
```

---

## 🎨 **نظام الألوان - Color System**

### **Dark Mode (الافتراضي)**

```css
/* Background Colors */
--background: #030213;           /* الخلفية الرئيسية */
--background-secondary: #0A0E1A; /* الخلفية الثانوية */
--background-elevated: #0D1117;  /* الكروت والنوافذ */

/* Text Colors */
--foreground: #E6EDF3;           /* النص الرئيسي */
--foreground-muted: #8B949E;     /* النص الثانوي */

/* Primary */
--primary: #6E7681;              /* اللون الأساسي (Gray) */
--primary-foreground: #FFFFFF;   /* نص على Primary */
--primary-hover: #8B949E;        /* Primary Hover */

/* Accent Colors */
--accent: #238636;               /* أخضر - نجاح */
--accent-foreground: #FFFFFF;

--destructive: #DA3633;          /* أحمر - تحذير */
--destructive-foreground: #FFFFFF;

--warning: #9E6A03;              /* برتقالي - تنبيه */
--warning-foreground: #FFFFFF;

--info: #0969DA;                 /* أزرق - معلومات */
--info-foreground: #FFFFFF;

/* Borders & Inputs */
--border: #30363D;
--input: #0D1117;
--ring: #1F6FEB;

/* Card */
--card: #0D1117;
--card-foreground: #E6EDF3;

/* Secondary */
--secondary: #21262D;
--secondary-foreground: #E6EDF3;

/* Muted */
--muted: #21262D;
--muted-foreground: #8B949E;
```

### **Light Mode**

```css
/* Background Colors */
--background: #FFFFFF;
--background-secondary: #F6F8FA;
--background-elevated: #FFFFFF;

/* Text Colors */
--foreground: #1F2328;
--foreground-muted: #636C76;

/* Primary */
--primary: #6E7681;
--primary-foreground: #FFFFFF;
--primary-hover: #57606A;

/* ... باقي الألوان */
```

---

## 🔤 **نظام الطباعة - Typography**

### **الخطوط - Fonts**

#### **العربية:**
```css
font-family: 'IBM Plex Sans Arabic', sans-serif;
```

**استيراد في index.html:**
```html
<link href="https://fonts.googleapis.com/css2?family=IBM+Plex+Sans+Arabic:wght@300;400;500;600;700&display=swap" rel="stylesheet">
```

**الأوزان:**
- 300 = Light
- 400 = Regular (الافتراضي)
- 500 = Medium (أزرار، labels)
- 600 = Semibold (عناوين)
- 700 = Bold (تأكيد قوي)

#### **الإنجليزية:**
```css
font-family: 'Inter', sans-serif;
```

**الأوزان:** نفسها

---

### **المقاسات والأوزان - Sizes & Weights**

```css
/* Headers - العناوين */
h1 {
  font-size: 24px;
  font-weight: 600;
  line-height: 1.3;
}

h2 {
  font-size: 20px;
  font-weight: 600;
  line-height: 1.35;
}

h3 {
  font-size: 18px;
  font-weight: 600;
  line-height: 1.4;
}

h4 {
  font-size: 16px;
  font-weight: 600;
  line-height: 1.5;
}

h5 {
  font-size: 14px;
  font-weight: 600;
  line-height: 1.5;
}

h6 {
  font-size: 12px;
  font-weight: 600;
  line-height: 1.5;
}

/* Body - النصوص */
p, body {
  font-size: 16px;
  font-weight: 400;
  line-height: 1.6;
}

small {
  font-size: 14px;
  font-weight: 400;
  line-height: 1.5;
}

/* Form Elements */
label {
  font-size: 14px;
  font-weight: 500;
  line-height: 1.5;
}

button {
  font-size: 16px;
  font-weight: 500;
  line-height: 1.5;
}

input, textarea, select {
  font-size: 16px;
  font-weight: 400;
  line-height: 1.5;
}
```

---

## 🎨 **الاستخدام في Tailwind**

### **ما يجوز:**

```typescript
// ✅ Colors
className="bg-background text-foreground"
className="bg-primary text-primary-foreground"
className="border-border"

// ✅ Spacing
className="p-6 m-4 gap-2 space-y-4"
className="px-4 py-2 mb-2"

// ✅ Layout
className="flex items-center justify-between"
className="grid grid-cols-3 gap-4"

// ✅ Sizing
className="w-full h-screen max-w-4xl"
className="min-h-[200px]"

// ✅ Effects
className="shadow-lg rounded-xl opacity-50"
className="hover:bg-primary-hover transition-colors"
```

### **ما لا يجوز (إلا للضرورة):**

```typescript
// ❌ Typography classes
className="text-3xl font-bold leading-tight"
className="text-sm"

// ❌ Arbitrary values بدون داعي
className="text-[18px]"  // استخدم h3 بدلاً من ذلك

// ❌ !important
className="!bg-red-500"
```

---

## 🧩 **المكونات - Components**

### **Button**

```typescript
import { Button } from './components/ui/button'

// ✅ استخدام أساسي
<Button>حفظ</Button>

// ✅ مع variants
<Button variant="default">افتراضي</Button>
<Button variant="destructive">حذف</Button>
<Button variant="outline">تحديد</Button>
<Button variant="ghost">إلغاء</Button>

// ✅ مع sizes
<Button size="default">عادي</Button>
<Button size="sm">صغير</Button>
<Button size="lg">كبير</Button>

// ✅ مع spacing
<Button className="px-6 py-3">واسع</Button>
```

### **Card**

```typescript
import { Card, CardHeader, CardTitle, CardContent } from './components/ui/card'

// ✅ يجب إضافة spacing صراحةً
<Card className="p-6">
  <CardHeader className="mb-4">
    <CardTitle>عنوان الكارت</CardTitle>
  </CardHeader>
  <CardContent className="space-y-4">
    {/* المحتوى */}
  </CardContent>
</Card>
```

### **Input**

```typescript
import { Input } from './components/ui/input'
import { Label } from './components/ui/label'

<div className="space-y-2">
  <Label htmlFor="name">الاسم</Label>
  <Input
    id="name"
    type="text"
    placeholder="أدخل الاسم"
    className="w-full"
  />
</div>
```

---

## 🌈 **الثيمات - Themes**

### **التبديل بين Dark/Light:**

```typescript
import { useTheme } from './components/ThemeProvider'

export const MyComponent = () => {
  const { theme, setTheme } = useTheme()
  
  return (
    <button onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}>
      تبديل الوضع
    </button>
  )
}
```

### **Conditional Styling:**

```typescript
// ✅ باستخدام Tailwind variants
<div className="bg-white dark:bg-background">
  محتوى يتكيف مع الثيم
</div>

// ✅ باستخدام CSS variables
<div className="bg-background text-foreground">
  يتغير تلقائياً مع الثيم
</div>
```

---

## 🎭 **RTL/LTR Support**

### **التبديل التلقائي:**

```typescript
// في HTML
<html dir="rtl" lang="ar">  {/* للعربية */}
<html dir="ltr" lang="en">  {/* للإنجليزية */}

// في Component
<div dir="rtl">محتوى عربي</div>
<div dir="ltr">English content</div>
```

### **Tailwind RTL Utilities:**

```typescript
// ✅ تلقائي حسب dir
<div className="text-right rtl:text-right ltr:text-left">
  نص متكيف
</div>

// ✅ أيقونات
<ChevronRight className="rtl:rotate-180" />

// ✅ Padding/Margin
<div className="ps-4 pe-2">  {/* يتكيف مع RTL/LTR */}
```

---

## 📐 **Spacing System**

```css
/* Tailwind Spacing Scale */
0   = 0px
0.5 = 2px
1   = 4px
2   = 8px
3   = 12px
4   = 16px
5   = 20px
6   = 24px
8   = 32px
10  = 40px
12  = 48px
16  = 64px
20  = 80px
24  = 96px
```

### **الاستخدام:**

```typescript
// Padding
className="p-6"      // 24px جميع الجوانب
className="px-4"     // 16px أفقي
className="py-2"     // 8px عمودي

// Margin
className="m-4"      // 16px جميع الجوانب
className="mb-2"     // 8px أسفل

// Gap (Flexbox/Grid)
className="gap-4"    // 16px
className="space-y-6"  // 24px بين العناصر
```

---

## 🎨 **Shadows**

```css
/* Tailwind Shadows */
shadow-sm   = 0 1px 2px rgba(0,0,0,0.05)
shadow      = 0 1px 3px rgba(0,0,0,0.1)
shadow-md   = 0 4px 6px rgba(0,0,0,0.1)
shadow-lg   = 0 10px 15px rgba(0,0,0,0.1)
shadow-xl   = 0 20px 25px rgba(0,0,0,0.1)
shadow-2xl  = 0 25px 50px rgba(0,0,0,0.25)
```

### **الاستخدام:**

```typescript
<Card className="shadow-lg">
  كارت مع ظل كبير
</Card>

<Button className="shadow-sm hover:shadow-md transition-shadow">
  زر مع ظل ديناميكي
</Button>
```

---

## 🔘 **Border Radius**

```css
/* Tailwind Border Radius */
rounded-none  = 0px
rounded-sm    = 2px
rounded       = 4px
rounded-md    = 6px
rounded-lg    = 8px
rounded-xl    = 12px
rounded-2xl   = 16px
rounded-full  = 9999px
```

### **الاستخدام:**

```typescript
<div className="rounded-xl">زوايا دائرية</div>
<Button className="rounded-full">زر دائري</Button>
```

---

## ⚡ **Transitions & Animations**

### **Transitions:**

```typescript
// ✅ مع Tailwind
<button className="transition-colors duration-200 hover:bg-primary">
  زر مع تأثير
</button>

// ✅ مع CSS
.button {
  transition: all 200ms ease-out;
}

// ✅ مع Motion
import { motion } from 'motion/react'

<motion.div
  initial={{ opacity: 0 }}
  animate={{ opacity: 1 }}
  transition={{ duration: 0.3 }}
>
  محتوى
</motion.div>
```

---

## 🎯 **أمثلة عملية**

### **1. Card مع Header وActions:**

```typescript
<Card className="p-6 space-y-4">
  <div className="flex items-center justify-between">
    <h3>عنوان الكارت</h3>
    <Button variant="ghost" size="sm">
      <MoreVertical className="size-4" />
    </Button>
  </div>
  
  <p className="text-foreground-muted">
    وصف الكارت هنا
  </p>
  
  <div className="flex gap-2">
    <Button>حفظ</Button>
    <Button variant="outline">إلغاء</Button>
  </div>
</Card>
```

### **2. Form مع Validation:**

```typescript
<form className="space-y-6">
  <div className="space-y-2">
    <Label htmlFor="email">البريد الإلكتروني</Label>
    <Input
      id="email"
      type="email"
      placeholder="example@email.com"
      className={cn(
        'w-full',
        hasError && 'border-destructive'
      )}
    />
    {hasError && (
      <p className="text-sm text-destructive">
        البريد الإلكتروني مطلوب
      </p>
    )}
  </div>
  
  <Button type="submit" className="w-full">
    إرسال
  </Button>
</form>
```

### **3. List مع Hover Effects:**

```typescript
<div className="space-y-2">
  {items.map(item => (
    <div
      key={item.id}
      className={cn(
        'p-4 rounded-lg border border-border',
        'hover:bg-accent/10 transition-colors cursor-pointer'
      )}
    >
      <h4>{item.title}</h4>
      <p className="text-foreground-muted">{item.description}</p>
    </div>
  ))}
</div>
```

---

## ♿ **Accessibility**

### **التباين - Contrast:**

```css
/* ✅ النسبة المطلوبة: 4.5:1 */
--foreground: #E6EDF3;    /* على */
--background: #030213;    /* = 14.8:1 ✓ */

--primary-foreground: #FFFFFF;  /* على */
--primary: #6E7681;             /* = 4.6:1 ✓ */
```

### **Focus States:**

```typescript
<button className="focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2">
  زر قابل للتركيز
</button>
```

### **Screen Readers:**

```typescript
<button aria-label="إغلاق النافذة">
  <X className="size-4" />
</button>

<div role="alert" aria-live="polite">
  تم الحفظ بنجاح
</div>
```

---

## 📚 **المراجع**

- [`globals.css`](../styles/globals.css) - جميع المتغيرات
- [`tailwind.config.js`](../tailwind.config.js) - تكوين Tailwind
- [`GUIDELINES.md`](./GUIDELINES.md) - القواعد الكاملة

---

**تم بواسطة:** فريق CRM Nxs  
**التاريخ:** 2025-10-16
