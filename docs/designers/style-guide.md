# 🎨 دليل الأنماط والألوان - FlowCanvasAI

## 🌙 **نظام الألوان**

### **الألوان الأساسية**
```css
--background: 222.2 84% 4.9%        /* #0a0a0b - خلفية داكنة */
--foreground: 210 40% 98%           /* #fafafa - نص أبيض */
--primary: 217.2 91.2% 59.8%        /* #3b82f6 - أزرق أساسي */
--secondary: 217.2 32.6% 17.5%      /* #1e293b - رمادي داكن */
```

### **ألوان الحالة**
```css
--success: 142.1 76.2% 36.3%        /* #16a34a - أخضر */
--warning: 47.9 95.8% 53.1%         /* #f59e0b - برتقالي */
--error: 0 84.2% 60.2%              /* #ef4444 - أحمر */
--info: 217.2 91.2% 59.8%           /* #3b82f6 - أزرق */
```

## 📝 **الخطوط**
```css
font-family: 'Cairo', 'Inter', sans-serif;

/* أحجام النصوص */
.text-xs    { font-size: 12px; }
.text-sm    { font-size: 14px; }
.text-base  { font-size: 16px; }
.text-lg    { font-size: 18px; }
.text-xl    { font-size: 20px; }
.text-2xl   { font-size: 24px; }
.text-4xl   { font-size: 36px; }
```

## 📐 **المسافات**
```css
.p-2   { padding: 8px; }
.p-4   { padding: 16px; }
.p-6   { padding: 24px; }
.p-8   { padding: 32px; }
.p-12  { padding: 48px; }
```

## 🎯 **الحدود والزوايا**
```css
.rounded-sm    { border-radius: 2px; }
.rounded-md    { border-radius: 6px; }
.rounded-lg    { border-radius: 8px; }
.rounded-xl    { border-radius: 12px; }
```

## 🎨 **الظلال**
```css
.shadow-sm   { box-shadow: 0 1px 2px 0 rgb(0 0 0 / 0.05); }
.shadow      { box-shadow: 0 1px 3px 0 rgb(0 0 0 / 0.1); }
.shadow-md   { box-shadow: 0 4px 6px -1px rgb(0 0 0 / 0.1); }
.shadow-lg   { box-shadow: 0 10px 15px -3px rgb(0 0 0 / 0.1); }
```

## 📱 **نقاط التوقف**
```css
sm:   /* 640px+ - هواتف كبيرة */
md:   /* 768px+ - تابلت */
lg:   /* 1024px+ - لابتوب */
xl:   /* 1280px+ - ديسكتوب */
2xl:  /* 1536px+ - شاشات كبيرة */
```

**📅 آخر تحديث:** يناير 2025