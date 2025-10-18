# ⚡ مرجع سريع - Quick Reference

> **كل ما تحتاجه في صفحة واحدة**

---

## 🎯 القاعدة الذهبية

### **⚠️ لا تستخدم typography classes مطلقاً!**

```tsx
// ✅ صحيح
<h1>عنوان</h1>              // 24px, weight: 600 تلقائياً
<h2>عنوان فرعي</h2>         // 20px, weight: 600 تلقائياً
<p>فقرة عادية</p>           // 16px, weight: 400 تلقائياً
<small>نص صغير</small>       // 14px, weight: 400 تلقائياً
<label>تسمية</label>         // 14px, weight: 500 تلقائياً
<button>زر</button>          // 16px, weight: 500 تلقائياً

// ❌ خطأ
<h1 className="text-2xl font-bold">عنوان</h1>
<p className="text-base">فقرة</p>
<div className="text-sm font-medium">نص</div>
```

### **استخدم فقط:**
- **الألوان**: `text-foreground`, `text-muted-foreground`, `text-primary`
- **المسافات**: `p-4`, `m-2`, `gap-6`, `space-y-4`
- **العناصر HTML**: `<h1>`, `<h2>`, `<p>`, `<small>`, `<label>`, `<button>`

---

## 🚀 الأوامر الأساسية

### **تطوير:**
```bash
# Nx
nx serve CRM
nx build CRM --configuration=production
nx run CRM:preview

# npm
npm run dev
npm run build
npm run preview
```

### **اختبار:**
```bash
nx run CRM:type-check
nx run CRM:lint
nx run CRM:test
```

### **نشر:**
```bash
# Docker
nx run CRM:docker-build
nx run CRM:docker-run

# Cloud Run
nx run CRM:cloud-deploy
```

---

## 📁 هيكل المشروع

```
/CRM
├── /components          # المكونات
│   ├── /crm            # CRM components
│   └── /ui             # Shadcn/ui
├── /lib                # الأدوات
├── /services           # الخدمات
├── /styles             # التصميم
├── /docs               # التوثيق
├── /scripts            # السكريبتات
└── /test               # الاختبارات
```

---

## 🎨 نظام الألوان

### **Light Mode:**
```
--foreground: #252525           (Primary text)
--foreground-secondary: #343434 (Secondary text)
--foreground-muted: #717182     (Muted text)
--background: #ffffff           (Main background)
--primary: #030213              (Primary brand)
```

### **Dark Mode:**
```
--foreground: #EAEAEA           (Primary text)
--foreground-secondary: #cfcfcf (Secondary text)
--foreground-muted: #667781     (Muted text)
--background: #202020           (Main background)
--primary: #EAEAEA              (Primary gray)
```

---

## 📝 Typography System

```
h1:     24px, weight: 600
h2:     20px, weight: 600
h3:     18px, weight: 600
h4:     16px, weight: 600
p:      16px, weight: 400
small:  14px, weight: 400
label:  14px, weight: 500
button: 16px, weight: 500
```

---

## 🔧 أدوات التطوير

### **VSCode Extensions:**
- Nx Console
- Tailwind CSS IntelliSense
- ESLint
- Prettier

### **Chrome Extensions:**
- React Developer Tools
- Redux DevTools
- Lighthouse

---

## 🐛 حلول سريعة

### **Port already in use:**
```bash
nx serve CRM --port=5174
```

### **Module not found:**
```bash
npm cache clean --force
rm -rf node_modules package-lock.json
npm install
```

### **TypeScript errors:**
```bash
npx tsc --noEmit
```

### **Cache issues:**
```bash
nx reset
```

---

## 📚 الأدلة الكاملة

| الموضوع | الملف |
|---------|------|
| **تطوير تطبيقات** | [`NEW_APP_DEVELOPMENT_GUIDE.md`](NEW_APP_DEVELOPMENT_GUIDE.md) |
| **الإرشادات** | [`GUIDELINES.md`](GUIDELINES.md) |
| **التطوير** | [`DEVELOPMENT.md`](DEVELOPMENT.md) |
| **التصميم** | [`STYLING.md`](STYLING.md) |
| **المكونات** | [`COMPONENTS.md`](COMPONENTS.md) |
| **النشر** | [`DEPLOYMENT.md`](DEPLOYMENT.md) |
| **الاختبارات** | [`TESTING.md`](TESTING.md) |

---

<div align="center">

**Happy Coding! 🚀**

**[← العودة للتوثيق](README.md)**

</div>
