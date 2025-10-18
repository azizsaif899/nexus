# 📋 توجيهات مصمم الواجهة - CRM Nxs

**التاريخ:** 16 أكتوبر 2025  
**المشروع:** CRM Nxs - نظام إدارة علاقات العملاء  
**الحالة:** جاهز للتطوير مع نظام تصميم محسن

---

## 🎯 المهمة الرئيسية

إنشاء واجهة مستخدم احترافية لنظام CRM باللغة العربية مع دعم كامل للـ RTL والثيم الداكن/الفاتح.

---

## 📚 الملفات المرجعية

### ملفات الإرشادات (اقرأها بعناية)
- ✅ `/Guidelines.md` - الإرشادات الرئيسية الصحيحة
- ✅ `/STYLING_GUIDE.md` - دليل التنسيق
- ✅ `/SHADCN_UI_FIXES.md` - إصلاحات مكونات Shadcn
- ✅ `/IMPORTANT_GUIDELINES_NOTE.md` - تنبيهات مهمة

### ملفات التصميم
- ✅ `/styles/globals.css` - نظام التصميم الكامل (محسن)
- ✅ `/tailwind.config.js` - إعدادات Tailwind v4
- ✅ `/postcss.config.cjs` - إعدادات PostCSS

---

## 🎨 نظام التصميم المُعتمد

### الألوان - Gray Scale Professional
```css
/* Light Mode */
--background: #ffffff
--foreground: #252525
--primary: #030213
--success: #059669
--warning: #d97706
--destructive: #d4183d

/* Dark Mode */
--background: #202020
--foreground: #EAEAEA
--primary: #EAEAEA
--success: #EAEAEA
--warning: #cfcfcf
--destructive: #667781
```

### الخطوط
- **العربية:** IBM Plex Sans Arabic
- **الإنجليزية:** Inter
- **الأحجام:** h1=24px, h2=20px, h3=18px, h4=16px, body=16px

### Glass Effects
```css
.glass-light { /* خفيف */ }
.glass-medium { /* متوسط */ }
.glass-button-primary { /* أزرار */ }
```

---

## 🏗️ البنية المطلوبة

### الصفحات الرئيسية
1. **Dashboard** - لوحة تحكم مع مخططات Recharts
2. **Leads** - إدارة العملاء المحتملين
3. **Pipeline** - خط المبيعات مع React DnD
4. **Tasks** - إدارة المهام
5. **Reports** - التقارير مع تصدير PDF/Excel

### المكونات المطلوبة
- ✅ **CRMLayout** - التخطيط الرئيسي مع Navigation
- ✅ **CRMDashboard** - لوحة التحكم
- ✅ **LeadsPage** - صفحة العملاء
- ✅ **PipelineBoard** - لوحة خط المبيعات
- ✅ **TasksManagement** - إدارة المهام
- ✅ **ReportsPage** - صفحة التقارير

---

## ⚠️ القواعد المهمة جداً

### Typography (أهم شيء)
```typescript
// ✅ الصحيح - استخدم عناصر HTML مباشرة
<h1>عنوان رئيسي</h1>        // 24px, 600 weight تلقائياً
<h2>عنوان فرعي</h2>        // 20px, 600 weight تلقائياً
<p>نص عادي</p>             // 16px, 400 weight تلقائياً
<button>زر</button>        // 16px, 500 weight تلقائياً

// ❌ خطأ - لا تستخدم classes للخطوط
<h1 className="text-2xl font-bold">عنوان</h1>
<p className="text-base font-normal">نص</p>
```

### الألوان
```typescript
// ✅ استخدم CSS variables
className="bg-primary text-primary-foreground"
className="bg-background text-foreground"

// ❌ لا تستخدم ألوان hardcoded
className="bg-blue-500 text-white"
```

### RTL Support
```css
/* يتم تطبيق الخط العربي تلقائياً */
[dir="rtl"] { font-family: var(--font-arabic); }
[dir="ltr"] { font-family: var(--font-inter); }
```

---

## 🔧 الإعدادات التقنية

### التقنيات المستخدمة
- **React 19** + TypeScript
- **Vite 6** + Tailwind CSS v4
- **Shadcn/ui** components
- **Recharts** للمخططات
- **React DnD** للسحب والإفلات

### ملفات التكوين
```javascript
// tailwind.config.js - مُعد مسبقاً
// postcss.config.cjs - مُعد مسبقاً
// package.json - مُعد مسبقاً
```

---

## 📋 خطة العمل

### المرحلة 1: الإعداد الأساسي
1. ✅ تشغيل التطبيق: `npm run dev`
2. ✅ التحقق من التصميم الأساسي
3. ✅ اختبار الثيم الداكن/الفاتح

### المرحلة 2: تطوير المكونات
1. تطوير **CRMLayout** مع Navigation
2. تطوير **CRMDashboard** مع المخططات
3. تطوير **LeadsPage** مع CRUD
4. تطوير **PipelineBoard** مع React DnD
5. تطوير **TasksManagement**
6. تطوير **ReportsPage**

### المرحلة 3: التحسينات
1. تحسين الأداء (Lazy Loading)
2. إضافة Animations
3. تحسين Accessibility (WCAG AA)
4. إضافة PWA features

---

## 🎯 المعايير المطلوبة

### الجودة
- ✅ **WCAG AA** compliance
- ✅ Mobile-first responsive
- ✅ RTL support كامل
- ✅ Performance optimization

### التصميم
- ✅ Glass effects
- ✅ Professional color scheme
- ✅ Consistent typography
- ✅ Smooth animations

### التجربة
- ✅ Intuitive navigation
- ✅ Fast loading
- ✅ Error handling
- ✅ Toast notifications

---

## 🚀 كيفية البدء

```bash
# تثبيت التبعيات
npm install

# تشغيل التطبيق
npm run dev

# فتح المتصفح
http://localhost:4100
```

---

## 📞 الدعم والمساعدة

### الملفات المساعدة
- `/docs/` - توثيق شامل
- `/ATTTRIBUTIONS.md` - التراخيص
- `/TESTING_CHECKLIST.md` - قائمة الاختبارات

### نصائح مهمة
1. **اقرأ Guidelines.md** بعناية قبل البدء
2. **استخدم نظام الألوان** من globals.css
3. **تجنب Typography classes** - استخدم HTML elements
4. **اختبر على الأجهزة المحمولة** مبكراً
5. **استخدم Shadcn/ui components** المُعدلة

---

## 🎨 أمثلة التصميم

### بطاقة KPI
```typescript
<Card className="glass-light p-6">
  <CardHeader className="pb-2">
    <CardTitle className="text-sm font-medium">إجمالي العملاء</CardTitle>
  </CardHeader>
  <CardContent>
    <div className="text-2xl font-bold">1,234</div>
    <p className="text-xs text-muted-foreground">+12% من الشهر الماضي</p>
  </CardContent>
</Card>
```

### زر أساسي
```typescript
<Button className="glass-button-primary">
  إضافة عميل جديد
</Button>
```

### مخطط
```typescript
<ResponsiveContainer width="100%" height={300}>
  <LineChart data={data}>
    <Line type="monotone" dataKey="value" stroke="var(--primary)" />
  </LineChart>
</ResponsiveContainer>
```

---

**نصيحة ذهبية:** ابدأ بقراءة `/Guidelines.md` و `/STYLING_GUIDE.md` قبل كتابة أي كود!

**تاريخ الإنشاء:** 16 أكتوبر 2025  
**الحالة:** جاهز للتطوير 🚀</content>
<parameter name="filePath">c:\nexus\UI_DESIGNER_GUIDE.md