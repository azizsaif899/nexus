# 🚀 نظام الأتمتة المرئية - Visual Automation Platform

> **لوحة أتمتة احترافية مرئية** تفوق n8n مع واجهة عربية كاملة وتكامل ActivePieces

[![React](https://img.shields.io/badge/React-19.1.1-blue.svg)](https://reactjs.org/)
[![Vite](https://img.shields.io/badge/Vite-6.0.5-purple.svg)](https://vitejs.dev/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.9.2-blue.svg)](https://www.typescriptlang.org/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind-4.1.14-38bdf8.svg)](https://tailwindcss.com/)

---

## ✨ الميزات الرئيسية

### 🎨 واجهة احترافية
- **Dark/Light Mode** مع نظام ألوان Gray Scale احترافي
- **RTL/LTR Support** دعم كامل للعربية والإنجليزية
- **Glassmorphism & Neumorphism** تأثيرات بصرية متقدمة
- **Responsive Design** متجاوب على جميع الأجهزة

### 🔧 منطقة العمل التفاعلية
- **Grid System** شبكة احترافية (20×20px & 100×100px)
- **Zoom & Pan** تكبير/تصغير (25%-200%) مع عجلة الماوس
- **Smart Spacing** منع التداخل تلقائياً (280×190px)
- **Snap to Alignment** قفز للمحاذاة عند الاقتراب
- **Drag & Drop** سحب وإفلات سلس للعقد

### 📊 العقد والأتمتة
- **13 نوع عقدة**: HTTP, Database, Transform, Condition, Loop, Trigger, وغيرها
- **6 قوالب جاهزة**: Email Marketing, Data Sync, Customer Onboarding, وأكثر
- **5 عقد معالجة أخطاء**: Try-Catch, Retry, Fallback, Error Logger, Dead Letter
- **Connection System** ربط العقد بخطوط تفاعلية

### 🤖 ذكاء اصطناعي
- **AI Chat Sidebar** مساعد ذكي على الجهة اليمنى
- **Quick Actions** اقتراحات سريعة للأتمتة
- **Code Generation** توليد أكواد تلقائياً
- **Workflow Optimization** تحسين سير العمل

### 📈 تحليلات ومراقبة
- **Execution History** سجل التنفيذ الكامل
- **Performance Analytics** تحليل الأداء
- **Error Tracking** تتبع الأخطاء
- **Resource Usage** استهلاك الموارد
- **Cost Analysis** تحليل التكاليف
- **Realtime Monitoring** مراقبة مباشرة

### ⚡ الأداء
- **Optimized Rendering** تحسينات عرض متقدمة
- **Lazy Loading** تحميل كسول للمكونات
- **Virtual Scrolling** تمرير وهمي للقوائم
- **Code Splitting** تقسيم الكود
- **< 1% FPS impact** تأثير أقل من 1% على الأداء

---

## 🚀 البدء السريع

### المتطلبات
- **Node.js** 18+ أو أعلى
- **npm** أو **yarn** أو **pnpm**
- **(اختياري)** ActivePieces instance للتنفيذ الفعلي

### التثبيت

```bash
# استنساخ المشروع
git clone https://github.com/your-username/visual-automation-platform.git
cd visual-automation-platform

# تثبيت التبعيات
npm install

# تشغيل بيئة التطوير
npm run dev
```

سيعمل التطبيق على: **http://localhost:5173**

### البناء للإنتاج

```bash
# بناء المشروع
npm run build

# معاينة البناء
npm run preview
```

---

## 🔌 تكامل ActivePieces

### الإعداد (اختياري)

1. **تشغيل ActivePieces محلياً**:
```bash
git clone https://github.com/activepieces/activepieces.git
cd activepieces
docker-compose up
```

2. **الاتصال من الواجهة**:
   - انقر على **"ActivePieces Setup"** من شريط الأدوات
   - أدخل API URL: `http://localhost:3000`
   - أدخل API Key من لوحة ActivePieces
   - انقر "اتصال"

3. **التشغيل**:
   - الآن عند الضغط على "تشغيل"، سيتم التنفيذ الفعلي على ActivePieces
   - بدون الاتصال، يعمل التطبيق في **Demo Mode** (محاكاة محلية)

---

## 📁 هيكل المشروع

```
/
├── App.tsx                 # المكون الرئيسي
├── components/             # جميع المكونات
│   ├── WorkflowCanvasEnhanced.tsx       # منطقة العمل
│   ├── NodeTypesSidebarEnhanced.tsx     # شريط العقد
│   ├── WorkflowToolbarEnhanced.tsx      # شريط الأدوات
│   ├── AIChatSidebar.tsx                # AI Chat
│   ├── PropertyPanel.tsx                # لوحة الخصائص
│   ├── analytics/          # مكونات التحليلات
│   ├── templates/          # مكونات القوالب
│   └── ui/                 # Shadcn/ui components
├── hooks/                  # React Hooks مخصصة
├── lib/                    # مكتبات ومساعدات
├── services/               # خدمات ActivePieces
├── styles/                 # ملفات CSS
├── types/                  # TypeScript types
└── data/                   # بيانات ثابتة (قوالب)
```

---

## ⌨️ اختصارات لوحة المفاتيح

### Canvas Controls
- **+** - تكبير
- **-** - تصغير
- **=** - إعادة تعيين الزوم
- **Scroll Wheel** - تكبير/تصغير مباشر
- **Space + Drag** - تحريك الكانفا
- **Middle Mouse** - تحريك الكانفا

### File Operations
- **Ctrl/Cmd + S** - حفظ
- **Ctrl/Cmd + O** - فتح
- **Ctrl/Cmd + E** - تصدير

### Editing
- **Ctrl/Cmd + Z** - تراجع
- **Ctrl/Cmd + Y** - إعادة
- **Delete** - حذف العقدة المحددة
- **Escape** - إلغاء التحديد

### Search & Navigation
- **Ctrl/Cmd + F** - بحث
- **Ctrl/Cmd + Shift + A** - التحليلات
- **Ctrl/Cmd + Shift + T** - القوالب
- **?** - عرض المساعدة

### Workflow
- **Ctrl/Cmd + R** - تشغيل
- **Ctrl/Cmd + .** - إيقاف
- **Ctrl/Cmd + P** - معاينة
- **Ctrl/Cmd + L** - ترتيب تلقائي

---

## 🎨 نظام التصميم

### الألوان - Dark Mode
```css
--background: #202020           /* الخلفية */
--background-secondary: #2c2c2c /* الأسطح الثانوية */
--background-elevated: #1E2B35  /* الكروت */
--foreground: #EAEAEA           /* النص الرئيسي */
--foreground-muted: #667781     /* النص الثانوي */
--primary: #EAEAEA              /* اللون الأساسي */
```

### Typography
- **عربي**: IBM Plex Sans Arabic
- **إنجليزي**: Inter
- **Code**: JetBrains Mono

### الأحجام المحددة (لا تغيّر)
- **h1**: 24px, weight: 600
- **h2**: 20px, weight: 600
- **h3**: 18px, weight: 600
- **h4**: 16px, weight: 600
- **p**: 16px, weight: 400
- **small**: 14px, weight: 400
- **label**: 14px, weight: 500
- **button**: 16px, weight: 500

---

## 📊 إحصائيات المشروع

- **50+ مكون** React قابل لإعادة الاستخدام
- **13 نوع عقدة** للأتمتة
- **6 قوالب جاهزة** للاستخدام الفوري
- **5 عقد معالجة أخطاء** متقدمة
- **30+ اختصار** لوحة مفاتيح
- **100% TypeScript** مع type safety كامل
- **WCAG AA** متوافق مع معايير الوصول

---

## 🔒 الأمان

- **Input Sanitization** تنظيف جميع المدخلات
- **No Sensitive Data** عدم تخزين بيانات حساسة في localStorage
- **HTTPS Only** في الإنتاج
- **CSP Headers** معرّفة بشكل صحيح
- **Error Boundaries** لمنع أخطاء React من تعطيل التطبيق

---

## 📝 الترخيص

هذا المشروع مرخص تحت **MIT License**.

---

## 🤝 المساهمة

نرحب بالمساهمات! يرجى اتباع الخطوات:

1. Fork المشروع
2. إنشاء branch جديد (`git checkout -b feature/AmazingFeature`)
3. Commit التغييرات (`git commit -m 'Add some AmazingFeature'`)
4. Push إلى Branch (`git push origin feature/AmazingFeature`)
5. فتح Pull Request

---

## 📧 التواصل

- **المطور**: [اسمك]
- **البريد الإلكتروني**: your.email@example.com
- **GitHub**: [@yourusername](https://github.com/yourusername)

---

## 🙏 شكر وتقدير

- [ActivePieces](https://www.activepieces.com/) - نظام الأتمتة
- [Shadcn/ui](https://ui.shadcn.com/) - مكونات UI
- [Lucide Icons](https://lucide.dev/) - الأيقونات
- [Tailwind CSS](https://tailwindcss.com/) - Framework CSS

---

**صُنع بـ ❤️ في [بلدك]**
