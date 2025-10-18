# 🚀 دليل التثبيت والتشغيل

## المتطلبات
- Node.js 18+ (يُفضل 24.9+)
- npm 8+ (يُفضل 11.60+)

## خطوات التثبيت

### 1. تنظيف المشروع
```bash
rm -rf node_modules package-lock.json .next
```

### 2. إصلاح الاستيرادات (اختياري)
```bash
# تشغيل سكريبت الإصلاح التلقائي
npm run fix:imports
```

أو يدوياً:
```bash
# Linux/Mac
find components -name "*.tsx" -type f -exec sed -i 's/@[0-9]\+\.[0-9]\+\.[0-9]\+//g' {} \;

# أو استخدم السكريبت JavaScript
node fix-imports.js
```

### 3. تثبيت التبعيات
```bash
npm install --legacy-peer-deps
```

أو استخدم السكريبت الكامل:
```bash
npm run fix:all
```

### 4. التشغيل

**وضع التطوير:**
```bash
npm run dev
```
سيعمل على: http://localhost:4100

**البناء للإنتاج:**
```bash
npm run build
npm start
```

## الإصلاحات المطبقة ✅

1. ✅ إضافة `'use client'` إلى `/App.tsx`
2. ✅ تحديث `react-day-picker` من 8.10.1 إلى 9.4.3
3. ✅ إزالة `i18n` من `next.config.js` (غير مدعوم في App Router)
4. ✅ إزالة `optimizeFonts` و `optimizeScripts`
5. ✅ إنشاء `.npmrc` مع `legacy-peer-deps=true`
6. ✅ إصلاح استيراد `react-day-picker` في `components/ui/calendar.tsx`

## المشاكل الشائعة وحلولها

### ❌ خطأ: `Cannot find module '@tailwindcss/postcss'`
**الحل:**
```bash
npm install --legacy-peer-deps
```

### ❌ خطأ: `peer dependency warnings`
**الحل:** ملف `.npmrc` موجود بالفعل مع `legacy-peer-deps=true`

### ❌ خطأ: `Cannot find module 'lucide-react@0.487.0'`
**الحل:**
```bash
npm run fix:imports
npm install --legacy-peer-deps
```

### ❌ خطأ: `Could not find a production build`
**الحل:**
```bash
npm run build
```

### ❌ Port 4100 مشغول
**الحل:**
```bash
npm run dev -- -p 4200
```

## السكريبتات المتاحة

| السكريبت | الوصف |
|----------|-------|
| `npm run dev` | تشغيل وضع التطوير على port 4100 |
| `npm run build` | بناء المشروع للإنتاج |
| `npm start` | تشغيل النسخة المبنية |
| `npm run lint` | فحص الأكواد |
| `npm run type-check` | فحص أنواع TypeScript |
| `npm run fix:imports` | إصلاح الاستيرادات ذات الإصدارات |
| `npm run fix:all` | إصلاح شامل + تثبيت |

## التبعيات الرئيسية

- **Next.js**: 15.5.0
- **React**: 19.1.1
- **TypeScript**: 5.9.2
- **Tailwind CSS**: v4.1.14
- **Motion**: 11.16.4

## ملاحظات مهمة

1. **استخدم دائماً `--legacy-peer-deps`** عند التثبيت
2. **ملف `.npmrc` موجود** ويحتوي على `legacy-peer-deps=true`
3. **لا تحذف `.npmrc`** أبداً
4. **البورت الافتراضي**: 4100

## اختبار المشروع

بعد التثبيت:
```bash
npm run dev
```

افتح المتصفح على: http://localhost:4100

يجب أن ترى:
- ✅ صفحة بيضاء/داكنة بدون أخطاء
- ✅ شريط أدوات في الأعلى
- ✅ شريط جانبي على اليسار (RTL)
- ✅ منطقة عمل في الوسط

## الدعم

إذا واجهت أي مشاكل:
1. تأكد من Node.js 18+
2. احذف `node_modules` و `.next`
3. شغّل `npm run fix:all`
4. راجع ملف `FIX_COMMANDS.md`

---

**آخر تحديث**: 2025-01-09  
**الإصدار**: 3.3.0
