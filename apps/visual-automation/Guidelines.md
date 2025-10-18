# 📋 إرشادات المشروع - Project Guidelines

## 🎨 نظام التصميم

### الألوان - Dark Mode (Gray Scale)
```css
--background: #202020           /* الخلفية الرئيسية */
--background-secondary: #2c2c2c /* الأسطح الثانوية */
--background-elevated: #1E2B35  /* الكروت والنوافذ */
--foreground: #EAEAEA           /* النص الرئيسي */
--foreground-muted: #667781     /* النص الثانوي */
--primary: #EAEAEA              /* اللون الأساسي */
```

### Typography
- **لا تستخدم** Tailwind classes للخطوط (text-2xl, font-bold, leading-none) إلا إذا طُلب صراحةً
- نظام الخطوط معرّف في globals.css ويُطبق تلقائياً
- استخدام IBM Plex Sans Arabic للعربية و Inter للإنجليزية

## 🏗️ البنية المعمارية

### المكونات الرئيسية
1. **WorkflowCanvasEnhanced** - منطقة العمل مع Grid System
2. **NodeTypesSidebarEnhanced** - الشريط الجانبي للعقد
3. **WorkflowToolbarEnhanced** - شريط الأدوات العلوي
4. **PropertyPanel** - لوحة الخصائص
5. **AIChatSidebar** - سايد بار الذكاء الاصطناعي

### نظام الـ Z-Index
```
AI Chat Toggle: z-10004 (الأعلى)
AI Chat Sidebar: z-10003
Sidebar Toggle: z-10002
Toast Notifications: z-9999
Sidebar: z-200
Toolbar: z-60
Canvas Controls: z-50
Canvas: z-10
```

## 🔍 الميزات الرئيسية

### Grid System
- شبكة صغيرة: 20×20px
- شبكة كبيرة: 100×100px
- مركز ثابت مع مؤشر

### Zoom & Pan
- نطاق: 25% - 200%
- عجلة الماوس: Direct Scroll
- التحريك: Middle Mouse أو Space + Drag
- الأزرار: +, -, =, Fit All

### Smart Spacing
- مساحة وهمية للعقدة: 280×190px
- Snap to Alignment عند المحاذاة
- منع التداخل تلقائياً

## 🔧 ActivePieces Integration

### أوضاع التشغيل
1. **Demo Mode** - محاكاة محلية (افتراضي)
2. **Production Mode** - تنفيذ فعلي على ActivePieces Self-Hosted

### الاتصال
- التحقق: `activePiecesAPI.isConnected()`
- إنشاء/تحديث Flows عبر API
- مراقبة التنفيذ في الوقت الفعلي

## 📦 التقنيات المستخدمة

- **Framework**: Vite 6.0.5 + React 19
- **Styling**: Tailwind CSS v4.1.14
- **TypeScript**: 5.9.2
- **UI Components**: Shadcn/ui
- **Icons**: Lucide React
- **Animation**: Motion/React
- **DnD**: React-DnD

## 🚀 البدء السريع

```bash
# التثبيت
npm install

# التطوير
npm run dev

# البناء
npm run build

# المعاينة
npm run preview
```

## 🎯 القواعد العامة

### يُفضل ✅
- Functional components
- TypeScript للـ type safety
- CSS-in-JS عبر Tailwind
- Semantic HTML
- Mobile-first approach

### يُتجنب ❌
- Class components
- Inline styles (إلا للضرورة)
- !important في CSS
- any في TypeScript
- console.log في الإنتاج (استخدم logger)

## ♿ إمكانية الوصول (WCAG AA)

- تباين النصوص: 4.5:1 minimum
- التنقل بالكيبورد: كامل
- Focus indicators: واضحة
- Screen reader support: كامل
- Reduced motion: مدعوم

---

**آخر تحديث**: 2025-01-16  
**الإصدار**: 3.3.0
