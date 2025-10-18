# 🧪 CRM Nxs - مركز الاختبارات الشامل

> **نظام اختبارات احترافي للتصميم، التفاعل، الأداء، والوصولية مع تقارير تلقائية**

---

## 🎯 الجديد - نظام التقارير الآلي!

### ✨ الميزات الجديدة:
- 📊 **تقارير HTML احترافية** - تصميم جميل مع رسوم بيانية
- 📁 **تقارير JSON** - بيانات خام للتحليل والتكامل
- 💾 **حفظ تلقائي** - زر واحد لحفظ التقارير
- 📈 **إحصائيات شاملة** - معدل النجاح، الأخطاء، التحذيرات
- ⏱️ **قياس الأداء** - مدة كل اختبار بالميلي ثانية

### 🚀 البدء السريع:
```bash
npm run dev                      # تشغيل التطبيق
# افتح: http://localhost:5173/test
# اضغط: "تشغيل الكل"
# اضغط: "حفظ التقرير"
```

### 📖 للمزيد:
- **دليل شامل**: [TESTING_GUIDE.md](./TESTING_GUIDE.md)
- **بدء سريع**: [QUICK_START_ARABIC.md](./QUICK_START_ARABIC.md)
- **دليل التقارير**: [report/README.md](./report/README.md)
- **ملخص التنفيذ**: [IMPLEMENTATION_SUMMARY.md](./IMPLEMENTATION_SUMMARY.md)

---

## 📋 نظرة عامة

مجلد الاختبارات يحتوي على نظام شامل لاختبار جميع جوانب التطبيق من منظور المصمم والمطور.

### **الأنواع المتوفرة:**

1. **اختبارات التصميم البصري** (Visual Design Tests)
2. **اختبارات الاستجابة** (Responsive Tests)
3. **اختبارات الوصولية** (Accessibility Tests)
4. **اختبارات التفاعل** (Interaction Tests)
5. **اختبارات الأداء البصري** (Performance Tests)
6. **اختبارات E2E** (End-to-End Tests)

---

## 🚀 البداية السريعة

### **الوصول لصفحة الاختبارات:**

```
http://localhost:5173/test
```

أو من داخل التطبيق:
- افتح CRM Dashboard
- انتقل للرابط `/test` يدوياً

### **تشغيل جميع الاختبارات:**

```bash
# من واجهة الويب
انقر على "تشغيل جميع الاختبارات"
```

---

## 📁 هيكل المجلد

```
test/
├── README.md                      # هذا الملف
├── QUICK_START.md                 # دليل البداية السريعة
├── TestPage.tsx                   # الواجهة الرئيسية
├── specs/                         # ملفات الاختبار المتخصصة
│   ├── theme.spec.tsx             # اختبار الثيم
│   ├── colors.spec.tsx            # اختبار الألوان
│   ├── tailwind.spec.tsx          # اختبار Tailwind
│   ├── visual-regression.spec.tsx # اختبار التصميم البصري
│   ├── components.spec.tsx        # اختبار المكونات
│   ├── responsive.spec.tsx        # اختبار الاستجابة
│   ├── fonts-icons.spec.tsx       # اختبار الخطوط والأيقونات
│   ├── accessibility.spec.tsx     # اختبار الوصولية
│   └── performance-visual.spec.tsx # اختبار الأداء
└── components/                    # مكونات الاختبار القديمة
    ├── ChartsTest.tsx
    ├── DnDTest.tsx
    ├── RTLTest.tsx
    ├── ThemeTest.tsx
    └── UIComponentsTest.tsx
```

---

## 🧪 أنواع الاختبارات

### **1. اختبار الثيم (Theme Test)**
**الملف:** `specs/theme.spec.tsx`

**الغرض:**
- اختبار تبديل Dark/Light mode
- التحقق من ظهور الألوان الصحيحة
- فحص CSS variables

**ما يختبر:**
- تحميل CSS variables
- تطبيق الثيم على HTML
- التبديل التلقائي بين الأوضاع
- الانتقالات السلسة (transitions)

**كيفية الاستخدام:**
```tsx
// افتح TestPage → اختر "اختبار الثيم"
// انقر "تبديل إلى الداكن/الفاتح"
// راقب النتائج
```

---

### **2. اختبار الألوان (Colors Test)**
**الملف:** `specs/colors.spec.tsx`

**الغرض:**
- التحقق من تحميل متغيرات الألوان
- مقارنة الألوان الفعلية مع المتوقعة

**ما يختبر:**
- وجود المتغيرات في `:root`
- القيم الصحيحة للألوان في Dark/Light mode
- لوحة الألوان الكاملة

**كيفية الاستخدام:**
```tsx
// افتح TestPage → اختر "اختبار الألوان"
// شاهد جميع متغيرات الألوان
// تحقق من القيم الفعلية
```

---

### **3. اختبار Tailwind (Tailwind Test)**
**الملف:** `specs/tailwind.spec.tsx`

**الغرض:**
- التأكد من تحميل Tailwind config
- تطبيق classes مثل `bg-primary` أو `text-foreground`

**ما يختبر:**
- وجود classes في DOM
- تطبيق الأنماط الصحيحة
- Utility classes الأساسية

**كيفية الاستخدام:**
```tsx
// افتح TestPage → اختر "اختبار Tailwind"
// شاهد النتائج لكل class
// تحقق من القيم الفعلية
```

---

### **4. اختبار التصميم البصري (Visual Regression)**
**الملف:** `specs/visual-regression.spec.tsx`

**الغرض:**
- مقارنة لقطات شاشة
- التحقق من عدم تغيير التصميم (Glassmorphism، الخطوط العربية)

**ما يختبر:**
- اختلافات بصرية بين التصميم المتوقع والفعلي
- Glassmorphism effects
- Typography rendering

**كيفية الاستخدام:**
```tsx
// يتطلب أدوات خارجية مثل Percy أو Chromatic
// راجع التوثيق في الملف
```

---

### **5. اختبار المكونات (Components Test)**
**الملف:** `specs/components.spec.tsx`

**الغرض:**
- اختبار عرض المكونات مع الأنماط الصحيحة
- التحقق من جميع المكونات الأساسية

**ما يختبر:**
- Buttons، Badges، Inputs
- Form Controls (Checkbox، Switch، Slider)
- Cards، Glass Effects
- تطبيق Tailwind classes

**كيفية الاستخدام:**
```tsx
// افتح TestPage → اختر "اختبار المكونات"
// تفاعل مع المكونات
// تحقق من المظهر
```

---

### **6. اختبار الاستجابة (Responsive Test)**
**الملف:** `specs/responsive.spec.tsx`

**الغرض:**
- اختبار التصميم على أحجام مختلفة
- دعم RTL للعربية

**ما يختبر:**
- تغيير الألوان والتخطيط في الشاشات الصغيرة
- RTL mode
- Tailwind breakpoints
- Responsive grid

**كيفية الاستخدام:**
```tsx
// افتح TestPage → اختر "اختبار الاستجابة"
// غيّر حجم النافذة
// راقب التغييرات
```

---

### **7. اختبار الخطوط والأيقونات (Fonts & Icons Test)**
**الملف:** `specs/fonts-icons.spec.tsx`

**الغرض:**
- التأكد من تحميل خطوط Inter و IBM Plex Arabic
- ظهور أيقونات Lucide بشكل صحيح

**ما يختبر:**
- تحميل الخطوط
- عرض الخطوط بأوزان مختلفة
- ظهور الأيقونات
- أحجام الأيقونات

**كيفية الاستخدام:**
```tsx
// افتح TestPage → اختر "اختبار الخطوط والأيقونات"
// تحقق من حالة تحميل الخطوط
// شاهد معاينات الخطوط
```

---

### **8. اختبار الوصولية (Accessibility Test)**
**الملف:** `specs/accessibility.spec.tsx`

**الغرض:**
- ضمان التوافق مع معايير WCAG
- التنقل بالكيبورد
- دعم Screen Readers

**ما يختبر:**
- التباين اللوني (Contrast Ratio)
- التنقل بـ Tab
- مؤشرات التركيز (Focus Indicators)
- ARIA Labels
- RTL Support

**كيفية الاستخدام:**
```tsx
// افتح TestPage → اختر "اختبار الوصولية"
// استخدم Tab للتنقل
// تحقق من WCAG compliance
```

---

### **9. اختبار الأداء البصري (Performance Test)**
**الملف:** `specs/performance-visual.spec.tsx`

**الغرض:**
- قياس تأثير التصميم على الأداء
- مراقبة FPS

**ما يختبر:**
- FPS في الرسوم المتحركة
- تأثير Glassmorphism على الأداء
- Memory Usage
- DOM Nodes Count
- Re-render performance

**كيفية الاستخدام:**
```tsx
// افتح TestPage → اختر "اختبار الأداء البصري"
// انقر "بدء المراقبة"
// راقب FPS والذاكرة
```

---

## 📊 إحصائيات الاختبارات

```
✅ 14 مجموعة اختبار
✅ 9 ملفات spec متخصصة
✅ 5 مكونات اختبار قديمة
✅ تغطية شاملة للتصميم
✅ تغطية شاملة للتفاعل
✅ تغطية شاملة للأداء
✅ تغطية شاملة للوصولية

الحالة: 🟢 100% Ready
```

---

## 🛠️ أدوات الاختبار الموصى بها

### **للاختبارات المرئية:**
- **Chromatic**: للتكامل مع Storybook
- **Percy**: للتكامل مع CI/CD
- **Playwright**: للاختبارات البصرية المخصصة
- **BackstopJS**: أداة مفتوحة المصدر

### **للوصولية:**
- **axe-core**: فحص WCAG تلقائي
- **Lighthouse**: تقييم شامل
- **WAVE**: اختبار الوصولية في المتصفح

### **للأداء:**
- **Chrome DevTools**: Performance profiler
- **Lighthouse**: تقييم الأداء
- **WebPageTest**: اختبار شامل

---

## 🎯 أفضل الممارسات

### **عند إضافة اختبار جديد:**

1. أنشئ ملف في `specs/` بالصيغة: `[name].spec.tsx`
2. صدّر component باسم `[Name]TestRunner`
3. أضف الاختبار في `TestPage.tsx`
4. حدّث هذا README

### **عند كتابة الاختبارات:**

- ✅ استخدم مكونات UI الموجودة (Card، Button، Badge)
- ✅ أضف وصف واضح لكل اختبار
- ✅ استخدم icons من Lucide React
- ✅ أضف أمثلة مرئية عند الإمكان
- ✅ اكتب رسائل واضحة للنتائج

---

## 🔗 روابط مفيدة

- [Chromatic Documentation](https://www.chromatic.com/docs/)
- [Percy Documentation](https://docs.percy.io/)
- [Playwright Visual Comparisons](https://playwright.dev/docs/test-snapshots)
- [WCAG Guidelines](https://www.w3.org/WAI/WCAG21/quickref/)
- [Lighthouse](https://developers.google.com/web/tools/lighthouse)

---

## 📞 الدعم

إذا واجهت مشكلة:
1. راجع [`QUICK_START.md`](QUICK_START.md)
2. شغّل الاختبار مرة أخرى
3. تحقق من console للأخطاء

---

<div align="center">

**🧪 Happy Testing! 🚀**

**الإصدار:** 1.0.0  
**آخر تحديث:** الآن  
**الحالة:** ✅ Production Ready

</div>
