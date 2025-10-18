# نظام الخطوط - Typography System

## عائلات الخطوط الأساسية

### العربية
- **الخط الأساسي**: Cairo, Noto Sans Arabic, Inter
- **خط WhatsApp**: Segoe UI, Helvetica Neue, Noto Naskh Arabic

### الإنجليزية  
- **الخط الأساسي**: Inter, Helvetica Neue, sans-serif
- **خط WhatsApp**: Segoe UI, Helvetica Neue, sans-serif

## نظام الأحجام والأوزان

| الاستخدام | عائلة الخط | الحجم (px) | الوزن | line-height | letter-spacing |
|-----------|------------|-----------|-------|-------------|----------------|
| **عنوان رئيسي (Hero)** | Cairo | 72-144 | Black (900) | 0.9 | -0.03em |
| **عنوان كبير (H1)** | Cairo | 48-60 | Bold (700) | 1.1 | -0.02em |
| **عنوان متوسط (H2)** | Cairo | 32-40 | Bold (700) | 1.2 | -0.01em |
| **عنوان صغير (H3)** | Cairo | 24-28 | SemiBold (600) | 1.3 | 0 |
| **عنوان فرعي (H4)** | Cairo | 20-22 | SemiBold (600) | 1.4 | 0 |
| **نص أساسي (Body Large)** | Cairo | 18 | Regular (400) | 1.6 | 0.01em |
| **نص أساسي (Body)** | Cairo | 16 | Regular (400) | 1.5 | 0.01em |
| **نص صغير (Small)** | Cairo | 14 | Regular (400) | 1.4 | 0.005em |
| **نص دقيق (Caption)** | Cairo | 12 | Regular (400) | 1.3 | 0.005em |
| **زر كبير (Button Large)** | Cairo | 16 | SemiBold (600) | 1.5 | 0 |
| **زر متوسط (Button)** | Cairo | 14 | Medium (500) | 1.5 | 0 |
| **زر صغير (Button Small)** | Cairo | 12 | Medium (500) | 1.3 | 0 |

## خطوط WhatsApp المحددة

| العنصر | عائلة الخط | الحجم (px) | الوزن | line-height | ملاحظات |
|--------|------------|-----------|-------|-------------|----------|
| **رسالة نصية** | Segoe UI | 15 | Regular (400) | 20px | نص الرسائل الأساسي |
| **اسم جهة الاتصال** | Segoe UI | 17 | SemiBold (600) | 20px | في قائمة المحادثات |
| **وقت الرسالة** | Segoe UI | 12 | Regular (400) | 14px | طوابع زمنية |
| **معاينة الرسالة** | Segoe UI | 14 | Regular (400) | 18px | في قائمة المحادثات |
| **حالة المستخدم** | Segoe UI | 13 | Regular (400) | 16px | "متصل"، "آخر ظهور" |
| **عنوان الدردشة** | Segoe UI | 16 | Medium (500) | 20px | في شريط الدردشة العلوي |

## خطوط عربية متخصصة

| الاستخدام | عائلة الخط | الحجم (px) | الوزن | خصائص إضافية |
|-----------|------------|-----------|-------|----------------|
| **نص رسائل عربية** | Noto Naskh Arabic | 15 | Regular (400) | `font-feature-settings: "kern" 1` |
| **عناوين عربية كبيرة** | Cairo | 48 | ExtraBold (800) | `letter-spacing: -0.02em` |
| **نص واجهة عربية** | Cairo | 14 | Medium (500) | `text-rendering: optimizeLegibility` |

## إعدادات CSS المطلوبة

### النص الأساسي
```css
.typography-base {
  font-family: 'Cairo', 'Noto Sans Arabic', 'Inter', sans-serif;
  font-size: 16px;
  font-weight: 400;
  line-height: 1.5;
  letter-spacing: 0.01em;
  text-rendering: optimizeLegibility;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
}
```

### خط WhatsApp
```css
.whatsapp-text {
  font-family: "Segoe UI", "Helvetica Neue", "Noto Naskh Arabic", sans-serif;
  font-size: 15px;
  font-weight: 400;
  line-height: 20px;
  letter-spacing: 0.01em;
  word-break: break-word;
  overflow-wrap: break-word;
}
```

### العناوين الكبيرة
```css
.hero-title {
  font-family: 'Cairo', sans-serif;
  font-size: clamp(3rem, 8vw, 9rem);
  font-weight: 900;
  line-height: 0.9;
  letter-spacing: -0.03em;
}
```

## دعم اللغات (RTL/LTR)

### إعدادات العربية
```css
.arabic-text {
  direction: rtl;
  text-align: right;
  font-family: 'Cairo', 'Noto Sans Arabic', sans-serif;
  unicode-bidi: embed;
}
```

### إعدادات الإنجليزية
```css
.english-text {
  direction: ltr;
  text-align: left;
  font-family: 'Inter', 'Helvetica Neue', sans-serif;
  unicode-bidi: embed;
}
```

## فئات CSS للاستخدام المباشر

### العناوين
```css
.text-hero { font-size: clamp(4rem, 10vw, 9rem); font-weight: 900; }
.text-h1 { font-size: clamp(2.5rem, 5vw, 3.75rem); font-weight: 700; }
.text-h2 { font-size: clamp(2rem, 4vw, 2.5rem); font-weight: 700; }
.text-h3 { font-size: clamp(1.5rem, 3vw, 1.75rem); font-weight: 600; }
.text-h4 { font-size: clamp(1.25rem, 2vw, 1.375rem); font-weight: 600; }
```

### النصوص
```css
.text-body-lg { font-size: 1.125rem; font-weight: 400; }
.text-body { font-size: 1rem; font-weight: 400; }
.text-sm { font-size: 0.875rem; font-weight: 400; }
.text-xs { font-size: 0.75rem; font-weight: 400; }
```

### الأزرار
```css
.text-button-lg { font-size: 1rem; font-weight: 600; }
.text-button { font-size: 0.875rem; font-weight: 500; }
.text-button-sm { font-size: 0.75rem; font-weight: 500; }
```

## أحجام استجابة الشاشة

### Desktop (1024px+)
- العناوين: أحجام كاملة
- النص الأساسي: 16px
- النص الصغير: 14px

### Tablet (768px - 1023px)  
- العناوين: تقليل 20%
- النص الأساسي: 16px
- النص الصغير: 14px

### Mobile (320px - 767px)
- العناوين: تقليل 30%
- النص الأساسي: 16px (للقراءة)
- النص الصغير: 14px

## إرشادات الاستخدام

### للمطورين
1. استخدم دائماً المتغيرات المحددة
2. لا تضع أحجام خطوط ثابتة للعناوين الكبيرة
3. استخدم `clamp()` للعناوين المتجاوبة
4. تأكد من دعم RTL للنصوص العربية

### للمصممين  
1. العناوين الكبيرة تحتاج `letter-spacing` سالب
2. النصوص العادية تحتاج `letter-spacing` موجب خفيف
3. استخدم `line-height` متناسق مع حجم الخط
4. تأكد من التباين الكافي للألوان

## اختبار جودة الخط

### نص عربي للاختبار
```
العنوان الرئيسي: منصة FlowCanvasAI الاحترافية
النص الأساسي: تطبيق ذكي متطور للأتمتة والذكاء الاصطناعي مع واجهة محادثة تشبه WhatsApp
النص الصغير: آخر تحديث: منذ 5 دقائق
```

### نص إنجليزي للاختبار
```
Main Title: FlowCanvasAI Professional Platform  
Body Text: Advanced AI automation application with WhatsApp-like chat interface
Small Text: Last updated: 5 minutes ago
```

## ملاحظات تقنية

1. **تحسين الأداء**: استخدم `font-display: swap` لتحميل الخطوط
2. **تحسين القراءة**: فعّل `text-rendering: optimizeLegibility`
3. **تنعيم الخط**: استخدم `-webkit-font-smoothing: antialiased`
4. **دعم المتصفحات**: قدم خطوط احتياطية دائماً