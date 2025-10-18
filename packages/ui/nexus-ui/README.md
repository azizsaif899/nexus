# 🎨 Nexus Design System

مكتبة التصميم المشتركة لجميع تطبيقات Nexus AI

## 📦 التثبيت

```bash
npm install @nexus/ui
```

## 🎯 الاستخدام

### الألوان

```typescript
import { nexusColors } from '@nexus/ui';

// الألوان الأساسية
const primary = nexusColors.primary[500]; // #0ea5e9
const secondary = nexusColors.secondary[500]; // #a855f7

// ألوان التمييز
const cyan = nexusColors.accent.cyan; // #06b6d4
const blue = nexusColors.accent.blue; // #3b82f6
```

### التدرجات

```typescript
import { nexusGradients } from '@nexus/ui';

const heroGradient = nexusGradients.hero;
// 'linear-gradient(to right, #06b6d4, #3b82f6)'
```

### الثيم

```typescript
import { nexusTheme } from '@nexus/ui';

const spacing = nexusTheme.spacing.md; // 1rem
const radius = nexusTheme.radius.lg; // 0.5rem
```

### CSS Classes

```html
<!-- التدرجات -->
<div class="nexus-gradient-primary">خلفية متدرجة</div>
<div class="nexus-text-gradient">نص متدرج</div>

<!-- التأثيرات -->
<div class="nexus-glass">تأثير زجاجي</div>
<div class="nexus-fade-in">حركة ظهور</div>
```

## 🌈 لوحة الألوان

### الألوان الأساسية
- **Primary**: `#0ea5e9` (Cyan 500)
- **Secondary**: `#a855f7` (Purple 500)

### ألوان التمييز
- **Cyan**: `#06b6d4`
- **Blue**: `#3b82f6`
- **Purple**: `#8b5cf6`
- **Pink**: `#ec4899`

### الألوان الدلالية
- **Success**: `#10b981`
- **Warning**: `#f59e0b`
- **Error**: `#ef4444`
- **Info**: `#3b82f6`

## 🎨 التدرجات المحددة مسبقاً

```css
/* التدرج الأساسي */
.nexus-gradient-primary {
  background: linear-gradient(135deg, #06b6d4 0%, #3b82f6 50%, #8b5cf6 100%);
}

/* تدرج البطل */
.nexus-gradient-hero {
  background: linear-gradient(to right, #06b6d4, #3b82f6);
}

/* تدرج التمييز */
.nexus-gradient-accent {
  background: linear-gradient(to right, #8b5cf6, #ec4899);
}
```

## 📱 الاستجابة

```typescript
// نقاط التوقف
const breakpoints = nexusTheme.breakpoints;
// sm: '640px', md: '768px', lg: '1024px', xl: '1280px'
```

## 🌙 الوضع المظلم

```typescript
import { nexusDarkTheme } from '@nexus/ui';

// يتم تطبيقه تلقائياً مع class="dark"
```

## 🔧 التخصيص

```typescript
// إنشاء ثيم مخصص
const customTheme = {
  ...nexusTheme,
  colors: {
    ...nexusTheme.colors,
    primary: {
      ...nexusTheme.colors.primary,
      500: '#your-color',
    },
  },
};
```

## 📚 أمثلة الاستخدام

### React Component

```tsx
import { nexusColors, nexusTheme } from '@nexus/ui';

const Button = ({ children }) => (
  <button
    style={{
      background: nexusColors.primary[500],
      borderRadius: nexusTheme.radius.md,
      padding: `${nexusTheme.spacing.sm} ${nexusTheme.spacing.md}`,
    }}
  >
    {children}
  </button>
);
```

### CSS-in-JS

```typescript
const styles = {
  card: {
    background: nexusColors.background.light,
    border: `1px solid ${nexusColors.neutral[200]}`,
    borderRadius: nexusTheme.radius.lg,
    boxShadow: nexusTheme.shadows.md,
  },
};
```

## 🚀 الميزات

- ✅ **ألوان متسقة** عبر جميع التطبيقات
- ✅ **دعم الوضع المظلم** تلقائياً
- ✅ **دعم اللغة العربية** مع RTL
- ✅ **تدرجات جاهزة** للاستخدام
- ✅ **نظام تباعد** منطقي
- ✅ **TypeScript** مدعوم بالكامل
- ✅ **CSS Classes** جاهزة
- ✅ **تأثيرات بصرية** محسنة

## 📄 الترخيص

MIT License - Nexus AI Team