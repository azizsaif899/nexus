# 🎨 نظام التصميم الموحد - FlowCanvasAI

## 🎯 **نظرة عامة**

نظام تصميم شامل ومتسق لضمان تجربة مستخدم موحدة عبر جميع أجزاء المنصة.

---

## 🌙 **نظام الألوان**

### **الألوان الأساسية**
```css
:root {
  /* الألوان الأساسية */
  --background: 222.2 84% 4.9%;        /* #0a0a0b - خلفية داكنة */
  --foreground: 210 40% 98%;           /* #fafafa - نص أبيض */
  --primary: 217.2 91.2% 59.8%;        /* #3b82f6 - أزرق أساسي */
  --primary-foreground: 222.2 84% 4.9%; /* نص على الأزرق */
  
  /* الألوان الثانوية */
  --secondary: 217.2 32.6% 17.5%;      /* #1e293b - رمادي داكن */
  --secondary-foreground: 210 40% 98%; /* نص على الرمادي */
  --accent: 217.2 32.6% 17.5%;         /* لون التمييز */
  --accent-foreground: 210 40% 98%;    /* نص على التمييز */
  
  /* ألوان الحالة */
  --success: 142.1 76.2% 36.3%;        /* #16a34a - أخضر */
  --warning: 47.9 95.8% 53.1%;         /* #f59e0b - برتقالي */
  --error: 0 84.2% 60.2%;              /* #ef4444 - أحمر */
  --info: 217.2 91.2% 59.8%;           /* #3b82f6 - أزرق */
  
  /* ألوان مساعدة */
  --muted: 217.2 32.6% 17.5%;          /* خافت */
  --muted-foreground: 215 20.2% 65.1%; /* نص خافت */
  --border: 217.2 32.6% 17.5%;         /* حدود */
  --input: 217.2 32.6% 17.5%;          /* خلفية الإدخال */
  --ring: 217.2 91.2% 59.8%;           /* حلقة التركيز */
}
```

### **استخدام الألوان**
```jsx
// ✅ صحيح - استخدام متغيرات CSS
<div className="bg-background text-foreground">
  <button className="bg-primary text-primary-foreground">
    زر أساسي
  </button>
  <button className="bg-secondary text-secondary-foreground">
    زر ثانوي
  </button>
</div>

// ❌ خطأ - ألوان مباشرة
<div className="bg-gray-900 text-white">
  <button className="bg-blue-500 text-white">زر</button>
</div>
```

---

## 📝 **نظام الخطوط**

### **الخطوط المعتمدة**
```css
/* الخط الأساسي */
font-family: 'Cairo', 'Inter', sans-serif;

/* خطوط احتياطية */
--font-sans: 'Cairo', 'Inter', ui-sans-serif, system-ui;
--font-mono: 'Fira Code', ui-monospace, monospace;
```

### **أحجام النصوص**
```css
/* أحجام النصوص المعتمدة */
.text-xs    { font-size: 0.75rem; }   /* 12px */
.text-sm    { font-size: 0.875rem; }  /* 14px */
.text-base  { font-size: 1rem; }      /* 16px */
.text-lg    { font-size: 1.125rem; }  /* 18px */
.text-xl    { font-size: 1.25rem; }   /* 20px */
.text-2xl   { font-size: 1.5rem; }    /* 24px */
.text-3xl   { font-size: 1.875rem; }  /* 30px */
.text-4xl   { font-size: 2.25rem; }   /* 36px */
```

### **أوزان الخطوط**
```css
.font-light     { font-weight: 300; }
.font-normal    { font-weight: 400; }
.font-medium    { font-weight: 500; }
.font-semibold  { font-weight: 600; }
.font-bold      { font-weight: 700; }
```

---

## 📐 **المسافات والأبعاد**

### **نظام المسافات**
```css
/* المسافات الأساسية (8px base) */
.p-1   { padding: 0.25rem; }  /* 4px */
.p-2   { padding: 0.5rem; }   /* 8px */
.p-3   { padding: 0.75rem; }  /* 12px */
.p-4   { padding: 1rem; }     /* 16px */
.p-6   { padding: 1.5rem; }   /* 24px */
.p-8   { padding: 2rem; }     /* 32px */
.p-12  { padding: 3rem; }     /* 48px */
.p-16  { padding: 4rem; }     /* 64px */
```

### **الحدود والزوايا**
```css
/* زوايا مدورة */
.rounded-none  { border-radius: 0; }
.rounded-sm    { border-radius: 0.125rem; }  /* 2px */
.rounded       { border-radius: 0.25rem; }   /* 4px */
.rounded-md    { border-radius: 0.375rem; }  /* 6px */
.rounded-lg    { border-radius: 0.5rem; }    /* 8px */
.rounded-xl    { border-radius: 0.75rem; }   /* 12px */
.rounded-2xl   { border-radius: 1rem; }      /* 16px */
.rounded-full  { border-radius: 9999px; }
```

---

## 🎯 **مكونات التصميم**

### **الأزرار (Buttons)**
```jsx
// الزر الأساسي
<button className="
  inline-flex items-center justify-center
  px-4 py-2 text-sm font-medium
  bg-primary text-primary-foreground
  border border-transparent rounded-md
  hover:bg-primary/90
  focus:outline-none focus:ring-2 focus:ring-primary
  disabled:opacity-50 disabled:cursor-not-allowed
  transition-colors duration-200
">
  زر أساسي
</button>

// الزر الثانوي
<button className="
  inline-flex items-center justify-center
  px-4 py-2 text-sm font-medium
  bg-secondary text-secondary-foreground
  border border-border rounded-md
  hover:bg-secondary/80
  focus:outline-none focus:ring-2 focus:ring-secondary
">
  زر ثانوي
</button>
```

### **البطاقات (Cards)**
```jsx
<div className="
  bg-card text-card-foreground
  border border-border rounded-lg
  p-6 shadow-sm
  hover:shadow-md transition-shadow
">
  <h3 className="text-lg font-semibold mb-2">عنوان البطاقة</h3>
  <p className="text-muted-foreground">محتوى البطاقة</p>
</div>
```

### **حقول الإدخال (Inputs)**
```jsx
<input className="
  flex h-10 w-full
  px-3 py-2 text-sm
  bg-input text-foreground
  border border-border rounded-md
  placeholder:text-muted-foreground
  focus:outline-none focus:ring-2 focus:ring-primary
  disabled:opacity-50 disabled:cursor-not-allowed
" />
```

---

## 📱 **نظام الاستجابة**

### **نقاط التوقف**
```css
/* نقاط التوقف المعتمدة */
sm:   /* 640px+ - هواتف كبيرة */
md:   /* 768px+ - تابلت */
lg:   /* 1024px+ - لابتوب */
xl:   /* 1280px+ - ديسكتوب */
2xl:  /* 1536px+ - شاشات كبيرة */
```

### **شبكة التخطيط**
```jsx
// تخطيط متجاوب
<div className="
  grid grid-cols-1 gap-4
  md:grid-cols-2
  lg:grid-cols-3
  xl:grid-cols-4
">
  {items.map(item => (
    <Card key={item.id} />
  ))}
</div>

// حاوي متجاوب
<div className="
  container mx-auto
  px-4 sm:px-6 lg:px-8
  max-w-7xl
">
  المحتوى
</div>
```

---

## 🎨 **الظلال والتأثيرات**

### **الظلال**
```css
.shadow-sm   { box-shadow: 0 1px 2px 0 rgb(0 0 0 / 0.05); }
.shadow      { box-shadow: 0 1px 3px 0 rgb(0 0 0 / 0.1); }
.shadow-md   { box-shadow: 0 4px 6px -1px rgb(0 0 0 / 0.1); }
.shadow-lg   { box-shadow: 0 10px 15px -3px rgb(0 0 0 / 0.1); }
.shadow-xl   { box-shadow: 0 20px 25px -5px rgb(0 0 0 / 0.1); }
```

### **التحولات والرسوم المتحركة**
```css
/* تحولات سلسة */
.transition-all     { transition: all 150ms ease-in-out; }
.transition-colors  { transition: color, background-color 150ms ease-in-out; }
.transition-shadow  { transition: box-shadow 150ms ease-in-out; }

/* تأثيرات التمرير */
.hover:scale-105    { transform: scale(1.05); }
.hover:shadow-lg    { box-shadow: 0 10px 15px -3px rgb(0 0 0 / 0.1); }
```

---

## ♿ **إمكانية الوصول**

### **التباين والألوان**
```jsx
// تباين مناسب للنصوص
<p className="text-foreground">نص عادي (4.5:1)</p>
<p className="text-muted-foreground">نص خافت (3:1)</p>

// حالات التركيز
<button className="
  focus:outline-none 
  focus:ring-2 
  focus:ring-primary 
  focus:ring-offset-2
">
  زر قابل للوصول
</button>
```

### **العناصر التفاعلية**
```jsx
// أزرار مع تسميات واضحة
<button 
  aria-label="إغلاق النافذة"
  className="focus:ring-2 focus:ring-primary"
>
  <CloseIcon aria-hidden="true" />
</button>

// حقول إدخال مع تسميات
<label htmlFor="email" className="sr-only">
  البريد الإلكتروني
</label>
<input 
  id="email"
  type="email"
  aria-describedby="email-error"
  className="focus:ring-2 focus:ring-primary"
/>
```

---

## 🎯 **أفضل الممارسات**

### **✅ افعل:**
1. **استخدم متغيرات CSS** للألوان والمسافات
2. **طبق مبدأ Mobile First** في التصميم
3. **اختبر التباين** للتأكد من إمكانية الوصول
4. **استخدم الرسوم المتحركة** بحذر وبساطة

### **❌ لا تفعل:**
1. **لا تستخدم ألوان مباشرة** في الكود
2. **لا تتجاهل نقاط التوقف** المعتمدة
3. **لا تنس إمكانية الوصول** في التصميم
4. **لا تفرط في الرسوم المتحركة**

---

**📅 آخر تحديث:** يناير 2025  
**📝 بواسطة:** عبدالعزيز سيف