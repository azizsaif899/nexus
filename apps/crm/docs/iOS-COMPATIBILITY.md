# 📱 دليل iOS - iOS Compatibility Guide

> **المشروع:** CRM Nxs  
> **الإصدار:** 1.0.0  
> **التاريخ:** 2025-10-16 - دليل توافق iOS

## نظرة عامة

هذا الدليل يشرح جميع الإصلاحات المطبقة لضمان عمل التطبيق بشكل كامل على **Chrome و Safari على iPhone**.

---

## ✅ المشاكل المحلولة

### 1️⃣ **Viewport Meta Tag**

**المشكلة:**
- `100vh` غير ثابت على iOS بسبب شريط العنوان المتحرك
- تكبير/تصغير غير متوقع

**الحل:**
```html
<meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=5.0, user-scalable=yes, viewport-fit=cover" />
```

**الملفات:**
- `/index.html`

---

### 2️⃣ **100vh Issue - مشكلة الارتفاع**

**المشكلة:**
- `100vh` يتضمن شريط العنوان على iOS
- يسبب قص أجزاء من الواجهة

**الحل:**
```typescript
// JavaScript Dynamic Calculation
const vh = window.innerHeight * 0.01;
document.documentElement.style.setProperty('--vh', `${vh}px`);

// CSS Usage
.h-screen-ios {
  height: 100vh;
  height: var(--mobile-vh, 100vh);
  height: -webkit-fill-available;
}
```

**الملفات:**
- `/lib/ios-viewport-fix.ts`
- `/styles/globals.css` (utilities)

---

### 3️⃣ **Safe Area Insets - الـ Notch**

**المشكلة:**
- محتوى يظهر تحت الـ Notch
- قص في الحواف

**الحل:**
```css
/* Safe Area Padding */
.pt-safe { padding-top: env(safe-area-inset-top); }
.pb-safe { padding-bottom: env(safe-area-inset-bottom); }
.p-safe {
  padding-top: env(safe-area-inset-top);
  padding-right: env(safe-area-inset-right);
  padding-bottom: env(safe-area-inset-bottom);
  padding-left: env(safe-area-inset-left);
}
```

**الملفات:**
- `/styles/globals.css`
- `/lib/ios-fixes.ts`

---

### 4️⃣ **Backdrop Filter Support**

**المشكلة:**
- `backdrop-filter` غير مدعوم في إصدارات iOS القديمة

**الحل:**
```css
.backdrop-blur-ios {
  -webkit-backdrop-filter: blur(20px);
  backdrop-filter: blur(20px);
}

/* Fallback */
@supports not (backdrop-filter: blur(20px)) {
  .backdrop-blur-ios {
    background: rgba(255, 255, 255, 0.95);
  }
}
```

**الملفات:**
- `/styles/globals.css`
- `/lib/ios-fixes.ts` (dynamic detection)

---

### 5️⃣ **Touch Events Optimization**

**المشكلة:**
- 300ms delay على الـ tap
- highlight color غير مرغوب
- callout على long press

**الحل:**
```css
.touch-optimized {
  -webkit-tap-highlight-color: transparent;
  -webkit-touch-callout: none;
  -webkit-user-select: none;
  user-select: none;
  touch-action: manipulation;
}
```

**الملفات:**
- `/styles/globals.css`
- `/lib/ios-fixes.ts`

---

### 6️⃣ **Input Zoom Prevention**

**المشكلة:**
- iOS يقوم بـ zoom عند font-size أقل من 16px

**الحل:**
```css
.input-ios-no-zoom {
  font-size: 16px !important;
  font-size: max(16px, 1rem) !important;
}
```

**الملفات:**
- `/styles/globals.css`
- `/lib/ios-fixes.ts`

---

### 7️⃣ **Fixed Positioning Fix**

**المشكلة:**
- `position: fixed` يختفي عند فتح الكيبورد
- `transform` على الـ parent يكسر fixed positioning

**الحل:**
```css
.fixed-ios {
  position: fixed;
  transform: translateZ(0);
  -webkit-transform: translateZ(0);
  backface-visibility: hidden;
  -webkit-backface-visibility: hidden;
}
```

**الملفات:**
- `/styles/globals.css`
- `/lib/ios-fixes.ts`

---

### 8️⃣ **Smooth Scrolling**

**المشكلة:**
- scroll غير سلس على iOS
- momentum scrolling مفقود

**الحل:**
```css
.scroll-smooth-ios {
  -webkit-overflow-scrolling: touch;
  overflow-y: auto;
  overscroll-behavior-y: contain;
}
```

**الملفات:**
- `/styles/globals.css`

---

### 9️⃣ **Keyboard Resize Handling**

**المشكلة:**
- تغيير حجم viewport عند فتح الكيبورد
- عناصر fixed تختفي

**الحل:**
```typescript
window.addEventListener('resize', () => {
  const currentHeight = window.innerHeight;
  const heightDiff = originalHeight - currentHeight;
  
  if (heightDiff > 150) {
    document.body.classList.add('ios-keyboard-open');
    // Scroll active input into view
  }
});
```

**الملفات:**
- `/lib/ios-fixes.ts`

---

### 🔟 **Font Loading Optimization**

**المشكلة:**
- FOIT (Flash of Invisible Text)
- FOUC (Flash of Unstyled Content)

**الحل:**
```css
@font-face {
  font-family: 'Inter';
  font-display: swap;
}
```

**الملفات:**
- `/lib/ios-fixes.ts`
- `/styles/globals.css`

---

## 📚 API Reference

### **initIOSFixes()**

تهيئة جميع إصلاحات iOS:

```typescript
import { initIOSFixes } from './lib/ios-fixes';

initIOSFixes();
```

**تشمل:**
- ✅ Prevent input zoom
- ✅ Handle keyboard resize
- ✅ Fix backdrop filter
- ✅ Fix fixed positioning
- ✅ Optimize touch events
- ✅ Handle safe area
- ✅ Optimize font loading
- ✅ Prevent rubber band scrolling
- ✅ Fix standalone mode
- ✅ Debug tools (dev only)

---

### **CSS Utility Classes**

#### **Height Classes:**
```html
<div className="h-screen-ios">...</div>
<div className="min-h-screen-ios">...</div>
<div className="max-h-screen-ios">...</div>
```

#### **Safe Area Classes:**
```html
<div className="pt-safe pb-safe">...</div>
<div className="p-safe">...</div>
<div className="mt-safe mb-safe">...</div>
```

#### **Touch Optimization:**
```html
<button className="touch-optimized">...</button>
```

#### **Smooth Scrolling:**
```html
<div className="scroll-smooth-ios">...</div>
```

#### **Fixed Positioning:**
```html
<div className="fixed-ios">...</div>
```

#### **Input No Zoom:**
```html
<input className="input-ios-no-zoom" />
```

#### **Backdrop Blur:**
```html
<div className="backdrop-blur-ios">...</div>
```

---

## 🧪 Testing على iPhone

### **طريقة الفحص:**

1. **Safari Web Inspector (macOS required):**
   ```bash
   # على Mac
   Safari > Develop > [Your iPhone] > [Your Site]
   ```

2. **Chrome Remote Debugging:**
   ```bash
   # على Mac/Windows
   chrome://inspect
   ```

3. **Manual Testing:**
   - ✅ فتح/إغلاق الكيبورد
   - ✅ تدوير الشاشة (Portrait/Landscape)
   - ✅ Scroll لأعلى/أسفل (شريط العنوان يختفي/يظهر)
   - ✅ Pinch to zoom
   - ✅ Touch interactions
   - ✅ Fixed elements visibility

---

## 🐛 Debug Mode

### **تفعيل Debug Panel:**

```typescript
// في Development Mode فقط
// اضغط 3 مرات سريعة على الشاشة
// سيظهر panel في الأسفل مع معلومات مفيدة
```

**المعلومات المعروضة:**
- User Agent
- Viewport Size
- Device Pixel Ratio
- Supports Backdrop Filter
- Supports Safe Area
- Is Standalone (PWA)
- Touch Points

---

## 📋 Checklist للمطورين

عند إضافة ميزة جديدة، تأكد من:

- [ ] استخدام `.h-screen-ios` بدلاً من `.h-screen`
- [ ] استخدام `.fixed-ios` لـ fixed elements
- [ ] إضافة `.touch-optimized` للأزرار
- [ ] استخدام `.input-ios-no-zoom` للـ inputs
- [ ] إضافة safe area padding إذا لزم الأمر
- [ ] اختبار على iPhone حقيقي
- [ ] فحص Console للأخطاء
- [ ] فحص viewport height عند فتح الكيبورد

---

## 🔧 Troubleshooting

### **المشكلة: التصميم لا يظهر كاملاً**

✅ **الحلول:**
1. فحص `--vh` variable في DevTools
2. التأكد من `initIOSFixes()` يعمل
3. فحص Console للأخطاء
4. استخدام `.h-screen-ios` بدلاً من `h-screen`
5. إضافة `.pb-safe` للعناصر السفلية

### **المشكلة: Zoom عند النقر على Input**

✅ **الحلول:**
1. إضافة `.input-ios-no-zoom` class
2. التأكد من `font-size >= 16px`
3. فحص viewport meta tag

### **المشكلة: Fixed Elements تختفي**

✅ **الحلول:**
1. إضافة `.fixed-ios` class
2. التأكد من عدم وجود `transform` على الـ parent
3. استخدام `translateZ(0)` للـ GPU acceleration

### **المشكلة: Backdrop Filter لا يعمل**

✅ **الحلول:**
1. إضافة `-webkit-backdrop-filter`
2. إضافة fallback background
3. فحص `@supports` في CSS

---

## 📊 Performance على iOS

### **Optimizations المطبقة:**

1. **GPU Acceleration:**
   ```css
   transform: translateZ(0);
   backface-visibility: hidden;
   ```

2. **Passive Event Listeners:**
   ```typescript
   element.addEventListener('scroll', handler, { passive: true });
   ```

3. **Will-Change (بحذر):**
   ```css
   will-change: transform;
   ```

4. **Font Display Swap:**
   ```css
   font-display: swap;
   ```

---

## 🎯 Best Practices

### **Do's ✅**

- استخدم `.h-screen-ios` دائماً
- أضف safe area padding
- اختبر على جهاز حقيقي
- استخدم `-webkit-` prefixes
- فعّل `font-display: swap`

### **Don'ts ❌**

- لا تستخدم `100vh` مباشرة
- لا تضع `transform` على body
- لا تستخدم `font-size < 16px` للـ inputs
- لا تنسى `-webkit-overflow-scrolling`
- لا تعتمد على User Agent detection

---

## 📚 Resources

- [WebKit Blog - Safe Area Insets](https://webkit.org/blog/7929/designing-websites-for-iphone-x/)
- [Can I Use - Backdrop Filter](https://caniuse.com/css-backdrop-filter)
- [MDN - env()](https://developer.mozilla.org/en-US/docs/Web/CSS/env())
- [Apple - Human Interface Guidelines](https://developer.apple.com/design/human-interface-guidelines/ios/overview/themes/)

---

**آخر تحديث:** 2025-01-15  
**الإصدار:** 1.0.0

---

## 💡 خلاصة سريعة

```typescript
// main.tsx
import { initIOSFixes, applyIOSCSS } from './lib/ios-fixes';

initIOSFixes();    // تهيئة جميع الإصلاحات
applyIOSCSS();     // تطبيق CSS خاص

// Component Usage
<div className="h-screen-ios p-safe">
  <header className="fixed-ios pt-safe">
    <input className="input-ios-no-zoom" />
  </header>
  
  <main className="scroll-smooth-ios">
    <button className="touch-optimized">Click</button>
  </main>
  
  <footer className="pb-safe">
    <div className="backdrop-blur-ios">...</div>
  </footer>
</div>
```

**الآن التطبيق جاهز 100% للعمل على iPhone! 🚀📱**
