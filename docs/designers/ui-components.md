# 🧩 دليل مكونات الواجهة - FlowCanvasAI

## 🎯 **نظرة عامة**
دليل شامل لجميع مكونات الواجهة المستخدمة في المنصة.

## 🔘 **الأزرار (Buttons)**

### **الزر الأساسي**
```jsx
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
```

### **الزر الثانوي**
```jsx
<button className="
  inline-flex items-center justify-center
  px-4 py-2 text-sm font-medium
  bg-secondary text-secondary-foreground
  border border-border rounded-md
  hover:bg-secondary/80
">
  زر ثانوي
</button>
```

## 📄 **البطاقات (Cards)**
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

## 📝 **حقول الإدخال (Inputs)**
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

## 🎨 **الألوان المستخدمة**
- `bg-primary` - الأزرق الأساسي
- `bg-secondary` - الرمادي الداكن
- `bg-background` - الخلفية الداكنة
- `text-foreground` - النص الأبيض
- `border-border` - حدود رمادية

## 📱 **الاستجابة**
```jsx
// شبكة متجاوبة
<div className="
  grid grid-cols-1 gap-4
  md:grid-cols-2
  lg:grid-cols-3
  xl:grid-cols-4
">
```

**📅 آخر تحديث:** يناير 2025