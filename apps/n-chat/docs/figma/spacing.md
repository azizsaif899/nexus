# نظام المسافات - Spacing System

## الوحدة الأساسية
- **Base Unit**: 8px
- **نظام الضرب**: جميع المسافات مضاعفات للوحدة الأساسية (8px)

## وحدات المسافات الأساسية

| الاسم | الحجم | الاستخدام |
|------|-------|----------|
| **xs** | 4px (0.5x) | مسافات دقيقة جداً، حواف الأيقونات الصغيرة |
| **sm** | 8px (1x) | مسافات صغيرة، بين العناصر المترابطة |
| **md** | 16px (2x) | مسافات متوسطة، بين الأقسام الصغيرة |
| **lg** | 24px (3x) | مسافات كبيرة، بين الأقسام المتوسطة |
| **xl** | 32px (4x) | مسافات كبيرة جداً، بين الأقسام الرئيسية |
| **2xl** | 48px (6x) | مسافات كبيرة للغاية، فصل الأقسام الرئيسية |
| **3xl** | 64px (8x) | مسافات ضخمة، هوامش الصفحات الكبيرة |
| **4xl** | 96px (12x) | مسافات ضخمة جداً، هوامش الصفحات الرئيسية |

## مسافات خاصة لواجهة WhatsApp

| الاستخدام | الحجم | الملاحظة |
|----------|-------|----------|
| **مسافة بين الرسائل** | 8px | بين الرسائل من نفس المرسل |
| **مسافة بين المجموعات** | 16px | بين مجموعات رسائل مختلفة |
| **هامش الرسالة** | 12px | داخل فقاعة الرسالة |
| **مسافة الأفاتار** | 8px | بين الصورة والنص |
| **هامش الدردشة** | 16px | حواف منطقة المحادثة |
| **ارتفاع شريط الإدخال** | 56px | ارتفاع ثابت |
| **هامش قائمة المحادثات** | 0px | بدون مسافات بين العناصر |

## مسافات المكونات المحددة

### الأزرار
| نوع الزر | الحشو العمودي | الحشو الأفقي | الحد الأدنى للارتفاع |
|---------|-------------|-------------|-------------------|
| **زر صغير (sm)** | 8px | 16px | 32px |
| **زر متوسط (md)** | 12px | 24px | 40px |
| **زر كبير (lg)** | 16px | 32px | 48px |
| **زر ضخم (xl)** | 20px | 40px | 56px |

### البطاقات (Cards)
| المكون | الحشو | الهامش الخارجي |
|-------|-------|---------------|
| **بطاقة صغيرة** | 16px | 8px |
| **بطاقة متوسطة** | 24px | 16px |
| **بطاقة كبيرة** | 32px | 24px |

### النماذج (Forms)
| العنصر | الحشو | المسافة بين الحقول |
|-------|-------|------------------|
| **حقل إدخال** | 12px | 16px |
| **تسمية الحقل** | 0px | 8px (تحت التسمية) |
| **مجموعة حقول** | 0px | 24px |
| **أزرار النموذج** | - | 16px (بين الأزرار) |

## الشبكة والتخطيط (Grid & Layout)

### شبكة الصفحة الرئيسية
- **Container Max Width**: 1200px
- **Container Padding**: 24px (desktop), 16px (mobile)
- **مسافة الأعمدة**: 24px
- **مسافة الصفوف**: 32px

### شبكة مكونات التصميم
- **مسافة بين المكونات**: 16px
- **مسافة بين المجموعات**: 32px
- **هامش القسم**: 48px

### شبكة منشئ العمليات
- **مسافة الشبكة**: 20px
- **مسافة العقد**: 40px (الحد الأدنى)
- **هامش اللوحة**: 32px
- **مسافة الأدوات**: 16px

## مسافات متجاوبة حسب الشاشة

### Desktop (1024px+)
```css
:root {
  --spacing-xs: 4px;
  --spacing-sm: 8px;
  --spacing-md: 16px;
  --spacing-lg: 24px;
  --spacing-xl: 32px;
  --spacing-2xl: 48px;
  --spacing-3xl: 64px;
  --spacing-4xl: 96px;
}
```

### Tablet (768px - 1023px)
```css
@media (max-width: 1023px) {
  :root {
    --spacing-xs: 4px;
    --spacing-sm: 8px;
    --spacing-md: 12px;
    --spacing-lg: 20px;
    --spacing-xl: 28px;
    --spacing-2xl: 40px;
    --spacing-3xl: 56px;
    --spacing-4xl: 80px;
  }
}
```

### Mobile (320px - 767px)
```css
@media (max-width: 767px) {
  :root {
    --spacing-xs: 4px;
    --spacing-sm: 8px;
    --spacing-md: 12px;
    --spacing-lg: 16px;
    --spacing-xl: 24px;
    --spacing-2xl: 32px;
    --spacing-3xl: 48px;
    --spacing-4xl: 64px;
  }
}
```

## فئات CSS للاستخدام المباشر

### Padding
```css
.p-xs { padding: 4px; }
.p-sm { padding: 8px; }
.p-md { padding: 16px; }
.p-lg { padding: 24px; }
.p-xl { padding: 32px; }
.p-2xl { padding: 48px; }
.p-3xl { padding: 64px; }
.p-4xl { padding: 96px; }

/* اتجاهات محددة */
.px-sm { padding-left: 8px; padding-right: 8px; }
.py-sm { padding-top: 8px; padding-bottom: 8px; }
.pt-md { padding-top: 16px; }
.pb-md { padding-bottom: 16px; }
.pl-lg { padding-left: 24px; }
.pr-lg { padding-right: 24px; }
```

### Margin
```css
.m-xs { margin: 4px; }
.m-sm { margin: 8px; }
.m-md { margin: 16px; }
.m-lg { margin: 24px; }
.m-xl { margin: 32px; }
.m-2xl { margin: 48px; }
.m-3xl { margin: 64px; }
.m-4xl { margin: 96px; }

/* اتجاهات محددة */
.mx-auto { margin-left: auto; margin-right: auto; }
.my-lg { margin-top: 24px; margin-bottom: 24px; }
.mt-xl { margin-top: 32px; }
.mb-xl { margin-bottom: 32px; }
.ml-md { margin-left: 16px; }
.mr-md { margin-right: 16px; }
```

### Gap (للـ Flexbox والـ Grid)
```css
.gap-xs { gap: 4px; }
.gap-sm { gap: 8px; }
.gap-md { gap: 16px; }
.gap-lg { gap: 24px; }
.gap-xl { gap: 32px; }
.gap-2xl { gap: 48px; }

/* اتجاهات محددة */
.gap-x-sm { column-gap: 8px; }
.gap-y-sm { row-gap: 8px; }
.gap-x-md { column-gap: 16px; }
.gap-y-md { row-gap: 16px; }
```

## مسافات خاصة لمكونات محددة

### Header/Navigation
- **ارتفاع الهيدر**: 64px (desktop), 56px (mobile)
- **حشو الهيدر**: 0 24px (desktop), 0 16px (mobile)
- **مسافة بين عناصر التنقل**: 32px (desktop), 24px (mobile)

### Sidebar
- **عرض الـ Sidebar**: 280px (desktop), 100% (mobile)
- **حشو الـ Sidebar**: 24px 16px
- **مسافة بين عناصر القائمة**: 8px

### Chat Interface
- **عرض منطقة المحادثة**: calc(100% - 300px) (desktop), 100% (mobile)
- **حشو منطقة الرسائل**: 16px
- **مسافة بين فقاعات الرسائل**: 8px
- **هامش فقاعة الرسالة**: 12px 16px

### Workflow Canvas
- **حشو اللوحة**: 32px
- **مسافة الشبكة**: 20px
- **حد أدنى بين العقد**: 40px
- **حشو العقدة**: 16px 20px

## قواعد مهمة للمطورين

### 1. التناسق
```css
/* ✅ صحيح - استخدام النظام */
.component {
  padding: 16px;
  margin-bottom: 24px;
  gap: 8px;
}

/* ❌ خطأ - قيم عشوائية */
.component {
  padding: 15px;
  margin-bottom: 23px;
  gap: 9px;
}
```

### 2. المتغيرات CSS
```css
/* استخدم المتغيرات دائماً */
.component {
  padding: var(--spacing-md);
  margin: var(--spacing-lg) 0;
  gap: var(--spacing-sm);
}
```

### 3. التجاوب
```css
/* فئات تجاوبية */
.responsive-spacing {
  padding: var(--spacing-md);
}

@media (max-width: 767px) {
  .responsive-spacing {
    padding: var(--spacing-sm);
  }
}
```

### 4. تجنب المسافات السالبة
```css
/* ❌ تجنب هذا */
.component {
  margin-top: -10px;
}

/* ✅ استخدم هذا بدلاً من ذلك */
.component {
  transform: translateY(-10px);
}
```

## مسافات الحالات الخاصة

### Loading States
- **Skeleton Placeholder**: نفس مسافات المحتوى الأصلي
- **Loading Spinner**: 16px من جميع الجهات

### Error States  
- **رسالة الخطأ**: 16px حشو، 8px هامش
- **أيقونة الخطأ**: 8px مسافة من النص

### Empty States
- **محتوى فارغ**: 64px حشو عمودي، 32px أفقي
- **أيقونة الحالة الفارغة**: 24px هامش تحتي

## اختبار المسافات

### قائمة التحقق
- [ ] جميع المسافات من مضاعفات 8px
- [ ] المسافات متناسقة عبر المكونات المشابهة
- [ ] المسافات تعمل بشكل صحيح على جميع الشاشات
- [ ] لا توجد قيم سالبة للمسافات
- [ ] استخدام المتغيرات CSS بدلاً من القيم الثابتة

### أدوات قياس المسافات
```css
/* للتطوير - إظهار الشبكة */
.debug-spacing {
  background-image: 
    linear-gradient(rgba(255,0,0,0.1) 1px, transparent 1px),
    linear-gradient(90deg, rgba(255,0,0,0.1) 1px, transparent 1px);
  background-size: 8px 8px;
}
```