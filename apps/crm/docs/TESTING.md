# 🧪 دليل الاختبار - Testing Guide

> **المشروع:** CRM Nxs  
> **الإصدار:** 1.0.0  
> **التاريخ:** 2025-10-16

---

## 🎯 **نظرة عامة**

هذا الدليل يشرح كيفية اختبار تطبيق CRM Nxs للتأكد من جودته وخلوه من الأخطاء.

---

## ✅ **قائمة الاختبار السريعة - Quick Checklist**

### **اختبار أساسي:**

- [ ] ✅ التطبيق يعمل (`npm run dev`)
- [ ] ✅ لا توجد أخطاء TypeScript (`npm run type-check`)
- [ ] ✅ البناء ينجح (`npm run build`)
- [ ] ✅ جميع الصفحات تفتح (Dashboard, Leads, Pipeline, Tasks, Reports)
- [ ] ✅ Dark/Light Mode يعمل
- [ ] ✅ الخطوط تظهر (IBM Plex Sans Arabic)
- [ ] ✅ الألوان صحيحة (Gray Scale)

---

## 🖥️ **اختبار الواجهة - UI Testing**

### **1. اختبار الصفحات الرئيسية:**

#### **Dashboard:**
```bash
# افتح: http://localhost:5173
```

**تحقق من:**
- [ ] ✅ KPI Cards تظهر
- [ ] ✅ المخططات (LineChart, BarChart, PieChart) تعمل
- [ ] ✅ Recent Activities تظهر
- [ ] ✅ Responsive (Desktop/Tablet/Mobile)

#### **Leads Page:**
```bash
# افتح: Dashboard → Leads
```

**تحقق من:**
- [ ] ✅ جدول العملاء يظهر
- [ ] ✅ البحث يعمل
- [ ] ✅ الفلترة تعمل
- [ ] ✅ إضافة عميل جديد يعمل
- [ ] ✅ تعديل عميل يعمل
- [ ] ✅ حذف عميل يعمل

#### **Pipeline Board:**
```bash
# افتح: Dashboard → Pipeline
```

**تحقق من:**
- [ ] ✅ الأعمدة تظهر
- [ ] ✅ السحب والإفلات يعمل (React DnD)
- [ ] ✅ تحديث الحالة عند السحب
- [ ] ✅ Smooth animations

#### **Tasks:**
```bash
# افتح: Dashboard → Tasks
```

**تحقق من:**
- [ ] ✅ قائمة المهام تظهر
- [ ] ✅ الفلترة حسب الحالة تعمل
- [ ] ✅ إضافة مهمة جديدة
- [ ] ✅ تعديل مهمة
- [ ] ✅ حذف مهمة

#### **Reports:**
```bash
# افتح: Dashboard → Reports
```

**تحقق من:**
- [ ] ✅ التقارير تظهر
- [ ] ✅ المخططات التفصيلية تعمل
- [ ] ✅ تصدير PDF (قريباً)
- [ ] ✅ تصدير Excel (قريباً)

---

### **2. اختبار المكونات:**

#### **Buttons:**
```bash
# تحقق من جميع variants
```

- [ ] ✅ `variant="default"` - خلفية primary
- [ ] ✅ `variant="destructive"` - خلفية حمراء
- [ ] ✅ `variant="outline"` - حدود فقط
- [ ] ✅ `variant="ghost"` - شفاف
- [ ] ✅ `variant="secondary"` - خلفية ثانوية
- [ ] ✅ Hover states تعمل
- [ ] ✅ Disabled state يعمل

#### **Forms:**

- [ ] ✅ Input يقبل النص
- [ ] ✅ Validation تعمل
- [ ] ✅ Error messages تظهر
- [ ] ✅ Submit يعمل
- [ ] ✅ Reset يعمل

#### **Modals/Dialogs:**

- [ ] ✅ تفتح بشكل صحيح
- [ ] ✅ تغلق بالزر X
- [ ] ✅ تغلق بالنقر خارجها
- [ ] ✅ Overlay يظهر
- [ ] ✅ Animation سلسة

#### **Toast Notifications:**

- [ ] ✅ Success toast يظهر
- [ ] ✅ Error toast يظهر
- [ ] ✅ Info toast يظهر
- [ ] ✅ Auto-dismiss يعمل

---

## 🎨 **اختبار التصميم - Design Testing**

### **1. Typography:**

**تحقق من:**
- [ ] ✅ h1 = 24px, weight: 600
- [ ] ✅ h2 = 20px, weight: 600
- [ ] ✅ h3 = 18px, weight: 600
- [ ] ✅ p  = 16px, weight: 400
- [ ] ✅ button = 16px, weight: 500
- [ ] ✅ label = 14px, weight: 500

**كيفية التحقق:**
```javascript
// في DevTools Console:
const h1 = document.querySelector('h1')
const styles = window.getComputedStyle(h1)
console.log(styles.fontSize)      // يجب أن يكون "24px"
console.log(styles.fontWeight)    // يجب أن يكون "600"
```

### **2. Colors:**

**Dark Mode:**
- [ ] ✅ Background: #030213
- [ ] ✅ Foreground: #E6EDF3
- [ ] ✅ Primary: #6E7681

**Light Mode:**
- [ ] ✅ Background: #FFFFFF
- [ ] ✅ Foreground: #1F2328
- [ ] ✅ Primary: #6E7681

### **3. Spacing:**

- [ ] ✅ Cards لها padding مناسب
- [ ] ✅ Buttons لها padding مناسب
- [ ] ✅ Margins consistent
- [ ] ✅ Gap بين العناصر مناسب

---

## 📱 **اختبار Responsive**

### **Desktop (>= 1024px):**

- [ ] ✅ Sidebar مفتوح
- [ ] ✅ جميع الأعمدة ظاهرة
- [ ] ✅ Layout مناسب

### **Tablet (768px - 1023px):**

- [ ] ✅ Sidebar قابل للطي
- [ ] ✅ Grid responsive
- [ ] ✅ Touch targets كافية

### **Mobile (< 768px):**

- [ ] ✅ Sidebar overlay
- [ ] ✅ Single column layout
- [ ] ✅ Touch-friendly buttons
- [ ] ✅ Hamburger menu يعمل

**كيفية الاختبار:**
```bash
# في DevTools:
1. افتح DevTools (F12)
2. اضغط Toggle Device Toolbar (Ctrl+Shift+M)
3. جرب أحجام مختلفة:
   - iPhone SE (375px)
   - iPad (768px)
   - Desktop (1920px)
```

---

## 🌐 **اختبار المتصفحات - Browser Testing**

### **المتصفحات المطلوبة:**

- [ ] ✅ Chrome/Edge (latest)
- [ ] ✅ Firefox (latest)
- [ ] ✅ Safari (macOS/iOS)

### **ما تختبره:**

- [ ] ✅ Layout يظهر بشكل صحيح
- [ ] ✅ Fonts تحمّل
- [ ] ✅ Colors صحيحة
- [ ] ✅ Animations تعمل
- [ ] ✅ Interactions responsive

---

## ♿ **اختبار Accessibility**

### **Keyboard Navigation:**

```bash
# اختبر بالكيبورد فقط (بدون ماوس):
Tab         → التنقل للأمام
Shift+Tab   → التنقل للخلف
Enter       → تفعيل الزر
Space       → تحديد Checkbox
Esc         → إغلاق Modal
```

**تحقق من:**
- [ ] ✅ جميع العناصر قابلة للوصول بـ Tab
- [ ] ✅ Focus indicators واضحة
- [ ] ✅ Modals تُغلق بـ Esc
- [ ] ✅ Dropdown menus تعمل

### **Screen Reader:**

**Windows:**
```bash
# استخدم NVDA (مجاني):
https://www.nvaccess.org/download/
```

**macOS:**
```bash
# استخدم VoiceOver (مدمج):
Cmd + F5
```

**تحقق من:**
- [ ] ✅ Headings منطقية
- [ ] ✅ Buttons لها labels
- [ ] ✅ Images لها alt text
- [ ] ✅ Form fields لها labels

### **Contrast Checker:**

```bash
# استخدم DevTools:
1. Inspect Element
2. تحقق من Contrast Ratio
3. يجب أن يكون >= 4.5:1
```

- [ ] ✅ Text contrast >= 4.5:1
- [ ] ✅ Large text >= 3:1
- [ ] ✅ UI components >= 3:1

---

## ⚡ **اختبار الأداء - Performance Testing**

### **Lighthouse Audit:**

```bash
# في Chrome DevTools:
1. افتح DevTools (F12)
2. اذهب إلى "Lighthouse"
3. اختر "Performance"
4. اضغط "Generate report"
```

**الأهداف:**
- [ ] ✅ Performance >= 90
- [ ] ✅ Accessibility >= 95
- [ ] ✅ Best Practices >= 90
- [ ] ✅ SEO >= 90

### **Core Web Vitals:**

- [ ] ✅ LCP (Largest Contentful Paint) < 2.5s
- [ ] ✅ FID (First Input Delay) < 100ms
- [ ] ✅ CLS (Cumulative Layout Shift) < 0.1

### **Bundle Size:**

```bash
# بعد البناء:
npm run build

# تحقق من حجم dist/:
ls -lh dist/assets/
```

**الأهداف:**
- [ ] ✅ Initial bundle < 500KB (gzipped)
- [ ] ✅ Total size reasonable

---

## 🔒 **اختبار الأمان - Security Testing**

### **XSS Protection:**

- [ ] ✅ User input sanitized
- [ ] ✅ No inline scripts
- [ ] ✅ CSP headers (in production)

### **Secrets:**

- [ ] ✅ لا توجد API keys في الكود
- [ ] ✅ استخدام .env للمتغيرات الحساسة
- [ ] ✅ .env في .gitignore

---

## 🧪 **Automated Testing (قريباً)**

### **Unit Tests (Vitest):**

```typescript
// TODO: إضافة اختبارات
import { describe, it, expect } from 'vitest'
import { render, screen } from '@testing-library/react'

describe('Button', () => {
  it('renders correctly', () => {
    render(<Button>Click me</Button>)
    expect(screen.getByText('Click me')).toBeInTheDocument()
  })
})
```

### **E2E Tests (Playwright):**

```typescript
// TODO: إضافة اختبارات
import { test, expect } from '@playwright/test'

test('should login successfully', async ({ page }) => {
  await page.goto('http://localhost:5173')
  await page.click('text=Login')
  await page.fill('input[name="email"]', 'test@example.com')
  await page.fill('input[name="password"]', 'password')
  await page.click('button[type="submit"]')
  await expect(page).toHaveURL('/dashboard')
})
```

---

## 📝 **تقرير الاختبار - Test Report**

### **قالب التقرير:**

```markdown
# تقرير الاختبار - [التاريخ]

## النتائج العامة:
- ✅ الاختبارات الناجحة: X/Y
- ❌ الاختبارات الفاشلة: Z
- ⚠️ التحذيرات: W

## الأخطاء المكتشفة:
1. [وصف الخطأ]
   - الصفحة: [اسم الصفحة]
   - الخطوات: [كيفية إعادة إنتاج الخطأ]
   - الأولوية: [عالية/متوسطة/منخفضة]

## التحسينات المقترحة:
1. [وصف التحسين]
   - السبب: [لماذا]
   - التأثير: [high/medium/low]

## الخلاصة:
[ملخص عام]
```

---

## ✅ **Final Checklist قبل النشر**

### **الوظائف:**
- [ ] ✅ جميع الصفحات تعمل
- [ ] ✅ جميع الميزات تعمل
- [ ] ✅ لا توجد console errors
- [ ] ✅ لا توجد TypeScript errors

### **التصميم:**
- [ ] ✅ Typography صحيح
- [ ] ✅ Colors صحيحة
- [ ] ✅ Spacing consistent
- [ ] ✅ Dark/Light Mode يعمل

### **الأداء:**
- [ ] ✅ Lighthouse score >= 90
- [ ] ✅ Bundle size reasonable
- [ ] ✅ Load time < 3s

### **Accessibility:**
- [ ] ✅ Keyboard navigation يعمل
- [ ] ✅ Screen reader compatible
- [ ] ✅ Contrast ratios صحيحة

### **الأمان:**
- [ ] ✅ No exposed secrets
- [ ] ✅ Input sanitization
- [ ] ✅ HTTPS في الإنتاج

---

## 📚 **الموارد**

- [Chrome DevTools](https://developer.chrome.com/docs/devtools/)
- [Lighthouse](https://developers.google.com/web/tools/lighthouse)
- [NVDA Screen Reader](https://www.nvaccess.org/)
- [WebAIM Contrast Checker](https://webaim.org/resources/contrastchecker/)

---

**تم بواسطة:** فريق CRM Nxs  
**التاريخ:** 2025-10-16
