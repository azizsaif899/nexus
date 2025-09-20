# ⚡ البدء السريع - 5 دقائق

## 🚀 خطوات سريعة

### 1. التثبيت (دقيقة واحدة):
```bash
npm install
```

### 2. التشغيل (30 ثانية):
```bash
npm run dev:admin
```

### 3. فتح المتصفح:
```
http://localhost:4200
```

## 🎯 أول مهمة (10 دقائق)

### غيّر لون الخلفية:
1. افتح: `apps/admin-dashboard/src/app/App.tsx`
2. غيّر: `bg-gray-50` إلى `bg-blue-50`
3. احفظ وشاهد التغيير

### أضف بطاقة جديدة:
```tsx
<div className="bg-white p-6 rounded-lg shadow">
  <h2 className="text-xl font-semibold mb-4">🎨 التصميم</h2>
  <p className="text-gray-600">مهمتك الأولى!</p>
</div>
```

## 📁 الملفات المهمة

### للتعديل السريع:
- `apps/admin-dashboard/src/app/App.tsx` - الصفحة الرئيسية
- `apps/admin-dashboard/src/styles.css` - الأنماط
- `tailwind.config.js` - الألوان والإعدادات

### للقراءة:
- `README_DESIGNER.md` - الدليل الكامل
- `DESIGNER_GUIDELINES.md` - النصائح المهمة

## 🎨 تغييرات سريعة

### الألوان:
```js
// في tailwind.config.js
colors: {
  primary: '#YOUR_COLOR',  // غيّر هنا
}
```

### الخطوط:
```css
/* في styles.css */
body {
  font-family: 'YOUR_FONT', sans-serif;
}
```

## 🔧 أوامر مفيدة

```bash
npm run dev:admin      # لوحة التحكم
npm run dev:chatbot    # واجهة الدردشة
npm run build          # بناء الإنتاج
npm run lint           # فحص الكود
```

## 📞 مساعدة سريعة

**مشكلة؟** اقرأ:
1. `COMMON_MISTAKES.md` - أخطاء شائعة
2. `DESIGNER_GUIDELINES.md` - نصائح مفصلة
3. تواصل مع الفريق

**جاهز؟** ابدأ بتغيير الألوان والنصوص! 🎨