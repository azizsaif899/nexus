# 📋 إرشادات المشروع - Project Guidelines

## 🎨 نظام التصميم

### معايير الواجهة
- استخدام نظام الألوان Gray Scale في الوضع الداكن
- دعم كامل للغة العربية (RTL) والإنجليزية (LTR)
- استخدام خطوط Cairo للعربية و Inter للإنجليزية
- تطبيق Glassmorphism و Neumorphism للعناصر الاحترافية

### الألوان - Dark Mode
```css
--background: #202020           /* الخلفية الرئيسية */
--background-secondary: #2c2c2c /* الأسطح الثانوية */
--background-elevated: #1E2B35  /* الكروت والنوافذ */
--foreground: #EAEAEA           /* النص الرئيسي */
--foreground-muted: #667781     /* النص الثانوي */
--primary: #EAEAEA              /* اللون الأساسي - Gray */
```

### Typography
- **لا تستخدم** Tailwind classes للخطوط (text-2xl, font-bold, leading-none) إلا إذا طُلب صراحةً
- نظام الخطوط معرّف في globals.css ويُطبق تلقائياً
- استخدام clamp() للأحجام المتجاوبة

## 🏗️ البنية المعمارية

### المكونات الرئيسية
1. **WorkflowCanvasEnhanced** - منطقة العمل الرئيسية
   - 🎨 **Grid System**: نظام شبكة احترافي بنقاط (20×20px & 100×100px)
   - ✨ **Center Indicator**: مركز ثابت مع 3 حلقات وصليب
   - 📏 **Snap to Alignment**: قفز تلقائي للمحاذاة (15px threshold)
   - 🔍 **Zoom & Pan System**: تكبير/تصغير (25%-200%) + عجلة الماوس
2. **NodeTypesSidebarEnhanced** - الشريط الجانبي للعقد
3. **WorkflowToolbarEnhanced** - شريط الأدوات العلوي
4. **PropertyPanel** - لوحة الخصائص

### نظام الـ Z-Index
```
AI Chat Toggle: z-10004 (الأعلى - فوق كل شيء)
AI Chat Sidebar: z-10003
Sidebar Toggle: z-10002
Toast Notifications: z-9999
Sidebar: z-200
Toolbar: z-60
Canvas Controls: z-50
Canvas: z-10
```

### State Management
- استخدام React Hooks (useState, useCallback, useEffect)
- لا توجد مكتبات state management خارجية
- الـ state موزع بشكل منطقي بين المكونات

## 🎨 نظام الشبكة الاحترافي - Grid System

### المواصفات
- **الشبكة الصغيرة**: 20×20px | نقاط 0.8px
- **الشبكة الكبيرة**: 100×100px | نقاط 1.5px
- **المركز الثابت**: 3 حلقات + صليب (128px)
- **التكنولوجيا**: SVG Patterns
- **الأداء**: < 1% FPS impact, ~50KB memory

### دعم الثيم
```css
/* Light Mode */
grid-small: fill-foreground-muted/20
grid-large: fill-foreground-muted/30

/* Dark Mode */
grid-small: fill-foreground-muted/15
grid-large: fill-foreground-muted/25
```

### السلوك
- ✅ الشبكة تتحرك مع Pan
- ✅ المركز ثابت في viewport
- ✅ تكيف تلقائي مع الثيم
- ✅ Performance optimized

### التوثيق
راجع ملف `/docs/GRID_SYSTEM.md` للتفاصيل الكاملة

## 🔍 نظام التكبير والتصغير - Zoom & Pan System v1.4.0

### المواصفات
- **نطاق الزووم**: 25% - 200%
- **الخطوة**: 10% لكل ضغطة
- **عجلة الماوس**: Direct Scroll (جديد!) أو Ctrl/Cmd + Scroll
- **التحريك**: Middle Mouse Button (جديد!) أو Space + Drag
- **الأزرار**: Zoom In (+), Reset (=), Zoom Out (-), Fit All (⊡)
- **الموقع**: أسفل يمين الشاشة (fixed)

### التحكم المحسّن
```typescript
// Zoom - التكبير والتصغير
Scroll Up ↑          = Zoom In (NEW! Direct)
Scroll Down ↓        = Zoom Out (NEW! Direct)
Ctrl + Scroll Up     = Zoom In (Existing)
Ctrl + Scroll Down   = Zoom Out (Existing)

// Pan - التحريك
Middle Mouse + Drag  = Pan Canvas (NEW!)
Space + Left Drag    = Pan Canvas (Existing)

// Buttons
+ = Zoom In (10%)
= = Reset to 100%
- = Zoom Out (10%)
⊡ = Fit All Nodes (Auto-center)
```

### Transform
```css
transform: translate(x, y) scale(zoom/100);
transformOrigin: 0 0;  /* Fixed: من الزاوية اليسرى العليا */
transition: 200ms ease-out;
```

### ملاحظة مهمة:
- تم تغيير `transformOrigin` من `center center` إلى `0 0` في v1.4.2
- هذا يحل مشكلة Pan Direction (الاتجاه المعاكس)
- يحسّن دقة Fit All (احتواء العقد)

### الميزات الجديدة (v1.4.0)
- ✅ **Direct Scroll Zoom** - تكبير مباشر بدون Ctrl/Cmd
- ✅ **Middle Button Pan** - تحريك بزر الماوس الأوسط
- ✅ **Natural UX** - تجربة طبيعية مثل Figma و Adobe XD
- ✅ **Zero Breaking Changes** - الطرق القديمة ما زالت تعمل

### التوثيق
- راجع ملف `/docs/ZOOM_SYSTEM.md` للتفاصيل الكاملة
- راجع ملف `/CANVAS_CONTROLS_UPDATE.md` للتحديثات الجديدة
- راجع ملف `/CANVAS_QUICK_REFERENCE.md` للمرجع السريع

## ⚡ الأداء

### تحسينات الأداء
- استخدام `React.memo` للمكونات الثقيلة
- تجنب re-renders غير الضرورية
- استخدام `useCallback` للـ handlers
- Lazy loading للمكونات الكبيرة (معطل حالياً)

### Best Practices
- تقليل استخدام inline functions في JSX
- استخدام CSS transforms بدلاً من margin/padding للأنيميشن
- استخدام `will-change` بحذر

## 🔧 ActivePieces Integration

### أوضاع التشغيل
1. **Demo Mode** - محاكاة محلية (افتراضي)
2. **Production Mode** - تنفيذ فعلي على ActivePieces Self-Hosted

### الاتصال
- التحقق من الاتصال عبر `activePiecesAPI.isConnected()`
- إنشاء/تحديث الـ flows عبر API
- مراقبة حالة التنفيذ في الوقت الفعلي

## 🌐 الدعم متعدد اللغات

### RTL/LTR Support
- الواجهة الرئيسية بالعربية (RTL)
- دعم كامل للإنجليزية
- استخدام `dir="rtl"` و `dir="ltr"` حسب المحتوى
- الأيقونات المناسبة لكل اتجاه

## ♿ إمكانية الوصول (WCAG AA)

### المعايير المطلوبة
- تباين النصوص: 4.5:1 minimum
- التنقل بالكيبورد: كامل
- Focus indicators: واضحة ومرئية
- Screen reader support: كامل
- Reduced motion: احترام تفضيلات المستخدم

## 🔒 الأمان

### معايير الأمان
- تنظيف جميع المدخلات (sanitization)
- عدم تخزين بيانات حساسة في localStorage
- استخدام HTTPS فقط في الإنتاج
- CSP Headers معرفة بشكل صحيح

## 📦 إدارة التبعيات

### المكتبات الأساسية
- Next.js 15.5.0
- React 19.1.1
- Tailwind CSS v4.1.14
- TypeScript 5.9.2

### UI Components
- Shadcn/ui للمكونات الأساسية
- Lucide React للأيقونات
- Motion/React للأنيميشن
- React-DnD للسحب والإفلات

## 🚀 النشر

### البيئات
- **Development**: `npm run dev`
- **Production**: `npm run build && npm start`
- Port: 3005 (configurable)

### متطلبات النشر
- Node.js 18+
- ActivePieces instance (اختياري)
- HTTPS certificate (للإنتاج)

## 🧪 الاختبار

### مجلد الاختبار `/testing`

يحتوي على جميع أدوات وملفات الاختبار:

- **[test-project.sh](../testing/test-project.sh)** - اختبار تلقائي شامل (12 فحص)
- **[fix-imports.sh](../testing/fix-imports.sh)** - إصلاح مشاكل imports تلقائياً
- **[IMPORT_FIX_SUMMARY.md](../testing/IMPORT_FIX_SUMMARY.md)** - ملخص إصلاح 30 ملف
- **[README.md](../testing/README.md)** - دليل أدوات الاختبار

**الاستخدام**:
```bash
# اختبار شامل
bash testing/test-project.sh

# إصلاح imports
bash testing/fix-imports.sh
```

**التوثيق الكامل**: راجع [دليل الاختبار](../docs/project/TESTING_GUIDE.md)

---

## 📝 التوثيق

> **🎉 جديد!** تم إنشاء 3 أدلة إضافية في `/docs/project` للإعداد والتشغيل الكامل

### 📚 الأدلة الشاملة

#### 🎯 الفهارس الرئيسية
- **[📑 الفهرس السريع](../docs/INDEX.md)** ⚡ - بحث وتصفح سريع لكل المستندات
- **[📚 فهرس التوثيق الكامل](../docs/README_DOCUMENTATION.md)** ⭐ - الدليل الشامل مع مسارات تعليمية

#### 🚀 أدلة الإعداد والتشغيل (جديد!)
1. **[🚀 دليل الإعداد الكامل](../docs/project/COMPLETE_SETUP_GUIDE.md)**
   - التثبيت والإعداد خطوة بخطوة
   - تشغيل المشروع (Dev & Production)
   - تكامل ActivePieces الكامل
   - البناء والنشر
   - استكشاف الأخطاء وحلولها
   - قائمة التحقق النهائية (8 أقسام)

2. **[📁 دليل هيكل المشروع](../docs/project/PROJECT_STRUCTURE.md)**
   - الهيكل الكامل التفصيلي
   - شرح جميع المجلدات والملفات
   - إحصائيات المشروع (50+ مكون، 25+ دليل)
   - العلاقات بين المكونات
   - تدفق البيانات
   - نظام التصميم والأداء

3. **[✅ قائمة التحقق النهائية](../docs/project/PROJECT_CHECKLIST.md)**
   - 164 بند للتحقق قبل التسليم
   - 9 أقسام رئيسية
   - الوظائف، الواجهة، الأداء، الأمان
   - التوثيق، ActivePieces، الاختبار
   - النشر وما بعد التسليم
   - جدول الأولويات

#### 📘 الأدلة الأساسية (6 أدلة جديدة)
1. **[🔌 دليل تكامل ActivePieces](../docs/ACTIVEPIECES_INTEGRATION.md)**
   - طريقة تركيب العقد بالتفصيل
   - أنواع العقد المتاحة (+30 نوع)
   - أمثلة عملية كاملة مع أكواد
   - API Integration الكامل
   - استكشاف الأخطاء والحلول

2. **[🤖 دليل سايد بار الذكاء الاصطناعي](../docs/AI_CHAT_SIDEBAR.md)**
   - تركيب السايد بار مع الذكاء الاصطناعي
   - البنية المعمارية الكاملة
   - الميزات التفاعلية (دردشة، اقتراحات، توليد أكواد)
   - التخصيص والأمان والأداء

3. **[🎛️ دليل الأزرار والتحكمات](../docs/BUTTONS_AND_CONTROLS.md)**
   - شرح شامل لجميع الأزرار
   - شريط الأدوات العلوي (Toolbar)
   - أدوات التحكم في الكانفا (Zoom, Pan, Fit)
   - اختصارات لوحة المفاتيح (+30 اختصار)

4. **[🎨 دليل الهيكل والألوان](../docs/STRUCTURE_AND_COLORS.md)**
   - البنية المعمارية التفصيلية
   - نظام الألوان (Dark/Light Mode)
   - نظام الطباعة والخطوط (Cairo + Inter)
   - المسافات والتباعد
   - الظلال والتأثيرات (Glassmorphism, Neumorphism)

5. **[�� دليل العقد](../docs/NODES_GUIDE.md)**
   - شرح تفصيلي لأنواع العقد الـ4
   - بنية العقدة الكاملة
   - دورة الحياة والتنفيذ
   - الاتصالات بين العقد
   - معالجة الحالات والأخطاء

6. **[🔨 دليل إنشاء عقدة جديدة](../docs/CREATE_NEW_NODE.md)**
   - خطوات إنشاء عقدة (5 خطوات واضحة)
   - 3 أمثلة عملية كاملة (Slack, JSON Parser, Filter)
   - أفضل الممارسات
   - كتابة الاختبارات
   - التوثيق الصحيح

#### 📂 أدلة إضافية
- [⚙️ نظام Analytics & Monitoring](../docs/ANALYTICS_SYSTEM.md)
- [⚡ تحسين الأداء](../docs/PERFORMANCE_OPTIMIZATION.md)
- [📑 مكتبة القوالب](../docs/TEMPLATES_LIBRARY.md)
- [🔍 نظام الشبكة](../docs/GRID_SYSTEM.md)
- [🔍 نظام الزوم](../docs/ZOOM_SYSTEM.md)
- [📏 نظام التباعد الذكي](../docs/SMART_SPACING_SYSTEM.md)

#### 🚀 البدء السريع
- [📖 دليل التثبيت](../docs/setup/INSTALLATION_GUIDE.md)
- [⚡ البدء السريع](../docs/setup/QUICK_START.md)
- [🚢 النشر](../docs/DEPLOYMENT.md)
- [🔧 إعداد ActivePieces](../docs/ACTIVEPIECES_SETUP.md)

#### 📊 المراجع
- [📝 سجل التغييرات](../docs/CHANGELOG.md)
- [✨ الميزات المكتملة](../docs/FEATURES_COMPLETE.md)
- [🗺️ خطة التطوير](../docs/DEVELOPMENT_ROADMAP.md)
- [🔄 ملخص الترحيل](../docs/MIGRATION_SUMMARY.md)

### الملفات المطلوبة
- README.md - نظرة عامة
- CHANGELOG.md - سجل التغييرات
- DEPLOYMENT.md - تعليمات النشر
- ACTIVEPIECES_SETUP.md - إعداد ActivePieces

### التعليقات في الكود
- استخدام التعليقات بالعربية والإنجليزية
- شرح الأجزاء المعقدة فقط
- تجنب التعليقات الواضحة

## 🎯 القواعد العامة

### يُفضل
✅ استخدام functional components
✅ TypeScript للـ type safety
✅ CSS-in-JS عبر Tailwind
✅ Semantic HTML
✅ Mobile-first approach

### يُتجنب
❌ Class components
❌ Inline styles (إلا للضرورة)
❌ !important في CSS
❌ any في TypeScript
❌ console.log في الإنتاج (استخدم logger)

## 🔄 Git Workflow

### Commit Messages
- استخدام conventional commits
- أمثلة: `feat:`, `fix:`, `docs:`, `style:`, `refactor:`
- بالإنجليزية فقط

### Branching
- `main` - الإنتاج
- `develop` - التطوير
- `feature/*` - الميزات الجديدة
- `fix/*` - إصلاح الأخطاء

## 📊 المراقبة والتحليل

### Performance Monitoring
- استخدام logger للأحداث المهمة
- مراقبة execution times
- تتبع الأخطاء عبر ErrorBoundary

### Analytics (اختياري)
- Google Analytics
- Plausible Analytics
- Custom events للتفاعلات المهمة

---

## 🔧 إصلاحات TypeScript الأخيرة

**التاريخ**: 2025-01-16

✅ تم حل جميع أخطاء TypeScript (348 → 0):
- إصلاح imports بإصدارات في 6 ملفات
- تخفيف قواعد strict mode
- راجع `/TYPESCRIPT_FIXES.md` للتفاصيل

---

**آخر تحديث**: 2025-01-16  
**الإصدار**: 3.3.0