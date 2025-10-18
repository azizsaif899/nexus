# ⚡ دليل البدء السريع - Quick Start Guide

> **نسخة نظيفة ومحدثة** - آخر تحديث: 2025-01-09 (v3.3.0)

---

## 🚀 التشغيل في 3 دقائق

### 1️⃣ التثبيت
```bash
# استنساخ المشروع
git clone https://github.com/your-username/visual-workflow-automation.git
cd visual-workflow-automation

# تثبيت المكتبات
npm install --legacy-peer-deps
```

### 2️⃣ التشغيل
```bash
# وضع التطوير
npm run dev

# افتح المتصفح
# http://localhost:4100
```

### 3️⃣ الاستخدام
1. اسحب عقدة من الشريط الجانبي
2. أفلتها في منطقة العمل
3. اضبط الإعدادات
4. اضغط "تشغيل" ▶️

**🎉 هذا كل شيء! التطبيق يعمل الآن.**

---

## 📋 المتطلبات

### الأساسية
- ✅ Node.js 18.0+ (موصى به: 24.9+)
- ✅ npm 8.0+ (موصى به: 11.60+)
- ✅ متصفح حديث (Chrome, Firefox, Safari, Edge)

### اختيارية
- 🔌 ActivePieces instance (للتنفيذ الفعلي)
- 🌐 HTTPS certificate (للإنتاج)

---

## 🎯 الأوامر المتاحة

```bash
# التطوير (Port 4100)
npm run dev

# البناء للإنتاج
npm run build

# تشغيل الإنتاج
npm start

# فحص الأخطاء
npm run lint

# فحص الأنواع
npm run type-check
```

---

## 📁 البنية الأساسية

```
/App.tsx                 ← المكون الرئيسي (ابدأ هنا!)
/app/page.tsx            ← استيراد من App.tsx
/components/             ← جميع المكونات
/lib/                    ← المكتبات المساعدة
/styles/globals.css      ← الأنماط (Tailwind v4)
```

---

## 🎨 الميزات الرئيسية

### ✨ واجهة احترافية
- 🌓 وضع فاتح/داكن (Gray Scale)
- 🌍 دعم عربي/إنجليزي (RTL/LTR)
- 🎭 Glassmorphism + Neumorphism
- ♿ WCAG AA compliant

### ⚙️ الوظائف
- 🔀 13 نوع عقدة مختلف
- 🔗 سحب وإفلات العقد
- ⚡ تنفيذ فوري أو حقيقي
- 💾 حفظ وتحميل سير العمل
- 📊 مراقبة الأداء

### 🔌 ActivePieces
- 📡 وضعان: Demo + Production
- 🔄 مزامنة تلقائية
- 📈 مراقبة التنفيذ
- 🛠️ إعداد سهل

---

## 🔧 الإعداد الأولي

### 1. متغيرات البيئة (اختياري)
```bash
# انسخ المثال
cp .env.example .env.local

# حرّر القيم
nano .env.local
```

```env
# ActivePieces (اختياري)
NEXT_PUBLIC_ACTIVEPIECES_URL=http://localhost:8080
NEXT_PUBLIC_ACTIVEPIECES_API_KEY=your-key-here

# Application
NEXT_PUBLIC_APP_URL=http://localhost:4100
```

### 2. ActivePieces (اختياري)
```bash
# لتشغيل ActivePieces محلياً
docker run -d \
  -p 8080:80 \
  -e AP_POSTGRES_DATABASE=activepieces \
  activepieces/activepieces:latest
```

---

## 📚 الموارد المفيدة

### 📖 التوثيق
- [README.md](../../README.md) - نظرة عامة شاملة
- [CHANGELOG.md](../CHANGELOG.md) - سجل التغييرات
- [Guidelines.md](../../guidelines/Guidelines.md) - إرشادات المشروع
- [DEPLOYMENT.md](../deployment/DEPLOYMENT.md) - دليل النشر
- [ACTIVEPIECES_SETUP.md](./ACTIVEPIECES_SETUP.md) - إعداد ActivePieces

---

## 🎓 أمثلة سريعة

### مثال 1: سير عمل بسيط
```
Webhook → Condition → Send Email
```

1. اسحب عقدة Webhook
2. اسحب عقدة Condition
3. اسحب عقدة Send Email
4. اربطهم معاً
5. اضغط تشغيل

### مثال 2: معالجة البيانات
```
Schedule → Database Read → Transform → HTTP Request
```

1. اسحب عقدة Schedule
2. اسحب عقدة Database Read
3. اسحب عقدة Transform
4. اسحب عقدة HTTP Request
5. اربطهم وشغل

---

## ❓ الأسئلة الشائعة

### Q: لماذا Port 4100 وليس 3000؟
**A:** لتجنب التعارض مع التطبيقات الأخرى. يمكنك تغييره في `package.json`.

### Q: هل يجب تثبيت ActivePieces؟
**A:** لا! التطبيق يعمل بوضع Demo افتراضياً. ActivePieces اختياري للتنفيذ الفعلي.

### Q: أين ملف `tailwind.config.js`؟
**A:** لا يوجد! نستخدم Tailwind v4 - التكوين في `styles/globals.css` مباشرةً.

### Q: كيف أغير اللغة؟
**A:** التطبيق يدعم RTL/LTR تلقائياً. اللغة الافتراضية عربية.

### Q: كيف أضيف عقدة جديدة؟
**A:** راجع `guidelines/Guidelines.md` - قسم "إضافة عقد جديدة".

---

## 🐛 حل المشاكل

### المشكلة: Port مشغول
```bash
# غير Port في package.json
"dev": "next dev -p 4200"  # بدلاً من 4100
```

### المشكلة: أخطاء TypeScript
```bash
# تحقق من الأنواع
npm run type-check

# نظف وأعد البناء
rm -rf .next
npm run dev
```

### المشكلة: أخطاء Tailwind
```bash
# تأكد من استخدام v4
npm list tailwindcss

# يجب أن يكون: tailwindcss@4.1.14
```

### المشكلة: ActivePieces لا يعمل
```bash
# تحقق من الاتصال
curl http://localhost:8080/api/v1/health

# تحقق من المتغيرات
cat .env.local
```

---

## 🚀 النشر السريع

### Vercel (موصى به)
```bash
# ثبت Vercel CLI
npm i -g vercel

# انشر
vercel
```

### Netlify
```bash
# بناء
npm run build

# رفع مجلد out/
netlify deploy --prod
```

### Docker
```bash
# بناء
docker build -t workflow-app .

# تشغيل
docker run -p 4100:4100 workflow-app
```

---

## ✅ قائمة التحقق

### قبل البدء
- [ ] Node.js 18+ مثبت
- [ ] npm محدث
- [ ] Git مثبت
- [ ] محرر كود (VS Code موصى به)

### بعد التثبيت
- [ ] `npm install` نجح
- [ ] `npm run dev` يعمل
- [ ] التطبيق يفتح في المتصفح
- [ ] لا توجد أخطاء في Console

### اختياري
- [ ] ActivePieces مثبت
- [ ] متغيرات البيئة معدة
- [ ] SSL/HTTPS معد

---

**🎉 مبروك! أنت جاهز للبدء!**

استمتع بإنشاء سير العمل الآلي الخاص بك! 🚀

---

*آخر تحديث: 2025-01-09*  
*الإصدار: 3.3.0*  
*الحالة: ✅ محدث*
