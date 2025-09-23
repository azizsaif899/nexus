# 🎨 نظام التصميم المبسط - AzizSys AI Assistant

## 🚀 البدء السريع

### الألوان الأساسية
```css
/* استخدم هذه الألوان فقط */
Primary:   #3B82F6  /* الأزرق الأساسي */
Success:   #10B981  /* الأخضر للنجاح */
Warning:   #F59E0B  /* البرتقالي للتحذير */
Error:     #EF4444  /* الأحمر للخطأ */
Gray:      #6B7280  /* الرمادي للنصوص الثانوية */
```

### الخطوط
```css
/* العربية */
font-family: 'Cairo', sans-serif;

/* الإنجليزية */
font-family: 'Inter', sans-serif;

/* الأحجام */
Small:  14px
Normal: 16px
Large:  18px
Title:  24px
```

### المسافات
```css
/* استخدم مضاعفات 8px */
Small:  8px
Medium: 16px
Large:  24px
XLarge: 32px
```

## 🧩 المكونات الأساسية

### الأزرار
```jsx
// زر أساسي
<button className="bg-blue-500 text-white px-4 py-2 rounded-lg">
  إرسال
</button>

// زر ثانوي
<button className="border border-gray-300 text-gray-700 px-4 py-2 rounded-lg">
  إلغاء
</button>
```

### البطاقات
```jsx
<div className="bg-white border border-gray-200 rounded-xl p-6 shadow-sm">
  <h3 className="text-lg font-semibold mb-2">عنوان البطاقة</h3>
  <p className="text-gray-600">محتوى البطاقة</p>
</div>
```

### النماذج
```jsx
<div className="space-y-4">
  <label className="block text-sm font-medium text-gray-700">
    الاسم
  </label>
  <input 
    type="text" 
    className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500"
    placeholder="أدخل الاسم"
  />
</div>
```

## 📱 التصميم المتجاوب

### نقاط الكسر
```css
/* Mobile First */
@media (min-width: 768px)  { /* Tablet */ }
@media (min-width: 1024px) { /* Desktop */ }
```

### التخطيط
```jsx
// Mobile: مكدس عمودي
<div className="flex flex-col space-y-4 md:flex-row md:space-y-0 md:space-x-4">
  <div>المحتوى الأول</div>
  <div>المحتوى الثاني</div>
</div>
```

## 🌐 دعم اللغة العربية

### RTL Layout
```css
/* للعربية */
.rtl {
  direction: rtl;
  text-align: right;
}

/* للإنجليزية */
.ltr {
  direction: ltr;
  text-align: left;
}
```

### الخطوط العربية
```jsx
// تحديد الخط حسب اللغة
<div className={locale === 'ar' ? 'font-cairo' : 'font-inter'}>
  النص هنا
</div>
```

## ✅ قواعد بسيطة

### افعل:
- استخدم الألوان المحددة فقط
- اجعل النصوص 16px أو أكبر
- استخدم مسافات مضاعفات 8px
- اختبر على الهاتف والكمبيوتر

### لا تفعل:
- لا تستخدم ألوان عشوائية
- لا تجعل النص صغير جداً
- لا تنس دعم العربية
- لا تعقد التصميم

## 🎯 أمثلة سريعة

### Header
```jsx
<header className="bg-white border-b border-gray-200 px-6 py-4">
  <div className="flex items-center justify-between">
    <h1 className="text-xl font-bold text-gray-900">AzizSys</h1>
    <button className="bg-blue-500 text-white px-4 py-2 rounded-lg">
      تسجيل الدخول
    </button>
  </div>
</header>
```

### Sidebar
```jsx
<aside className="w-64 bg-gray-50 border-r border-gray-200 p-4">
  <nav className="space-y-2">
    <a href="#" className="block px-3 py-2 text-gray-700 hover:bg-gray-100 rounded-lg">
      لوحة التحكم
    </a>
    <a href="#" className="block px-3 py-2 text-gray-700 hover:bg-gray-100 rounded-lg">
      العملاء
    </a>
  </nav>
</aside>
```

### Card Grid
```jsx
<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
  <div className="bg-white border border-gray-200 rounded-xl p-6">
    <h3 className="text-lg font-semibold mb-2">إحصائية 1</h3>
    <p className="text-3xl font-bold text-blue-500">1,234</p>
  </div>
  {/* المزيد من البطاقات */}
</div>
```

## 🛠️ أدوات مساعدة

### Tailwind CSS Classes
```css
/* الألوان */
.text-primary { color: #3B82F6; }
.bg-primary { background-color: #3B82F6; }

/* المسافات */
.p-4 { padding: 1rem; }
.m-4 { margin: 1rem; }

/* التخطيط */
.flex { display: flex; }
.grid { display: grid; }
```

### CSS Variables
```css
:root {
  --color-primary: #3B82F6;
  --color-success: #10B981;
  --color-warning: #F59E0B;
  --color-error: #EF4444;
  --font-arabic: 'Cairo', sans-serif;
  --font-english: 'Inter', sans-serif;
}
```

---

**🎨 ابدأ التصميم الآن باستخدام هذه القواعد البسيطة!**