# 🚀 دليل النشر

## نشر الشريط الجانبي (Sidebar)

### المتطلبات
- Google Apps Script project
- clasp CLI مثبت ومصادق عليه

### خطوات النشر
```bash
cd monorepo-new/apps/sidebar
npm run build
npm run deploy
```

### التحقق من النشر
1. افتح Google Sheets
2. تحقق من ظهور قائمة "🤖 G-Assistant"
3. اختبر فتح الشريط الجانبي

## نشر واجهة الويب

### Vercel (موصى به)
```bash
cd monorepo-new/apps/web
vercel --prod
```

### Firebase Hosting
```bash
npm run build
firebase deploy --only hosting
```

## نشر بوابة الإدارة

### للفريق الداخلي فقط
```bash
cd monorepo-new/apps/admin
npm run build
# نشر على خادم داخلي آمن
```

## المتغيرات البيئية للإنتاج

### للـ Sidebar
```javascript
// في Google Apps Script Properties
GEMINI_API_KEY: "production_key"
ENVIRONMENT: "production"
```

### للـ Web
```env
NEXT_PUBLIC_API_URL=https://api.g-assistant.com
GEMINI_API_KEY=production_key
```

## التحقق من النشر

- [ ] Sidebar يعمل في Google Sheets
- [ ] واجهة الويب متاحة ومتجاوبة
- [ ] API endpoints تستجيب بشكل صحيح
- [ ] المتغيرات البيئية محدثة