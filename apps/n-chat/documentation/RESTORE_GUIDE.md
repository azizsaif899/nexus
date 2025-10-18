# 🔄 دليل الاستعادة السريع - FlowCanvasAI

<div align="center">

# 🛟 دليل استعادة المشروع

**للاستخدام في حالة الطوارئ**

</div>

---

## ⚡ استعادة سريعة (5 دقائق)

### السيناريو 1: استعادة كاملة من الصفر

```bash
# 1. إنشاء مجلد المشروع
mkdir flowcanvasai
cd flowcanvasai

# 2. تهيئة Git
git init

# 3. نسخ الملفات من النسخة الاحتياطية
# (افترض أن النسخة الاحتياطية في /backup/)

# 4. نسخ الملفات الأساسية
cp /backup/package.json ./
cp /backup/tsconfig.json ./
cp /backup/next.config.js ./
cp /backup/tailwind.config.js ./
cp /backup/.env.example ./
cp /backup/.gitignore ./
cp /backup/App.tsx ./

# 5. نسخ المجلدات
cp -r /backup/components ./
cp -r /backup/lib ./
cp -r /backup/styles ./
cp -r /backup/BACKEND ./
cp -r /backup/FINAL ./
cp -r /backup/docs ./
cp -r /backup/documentation ./
cp -r /backup/guidelines ./

# 6. تثبيت التبعيات
npm install

# 7. تشغيل
npm run dev

# ✅ تم! المشروع يعمل على http://localhost:3000
```

---

## 🎯 استعادة حسب السيناريو

### السيناريو 2: استعادة Frontend فقط

```bash
# الملفات المطلوبة:
✅ /App.tsx
✅ /components/ (all)
✅ /lib/ (all)
✅ /styles/globals.css
✅ /package.json
✅ /tsconfig.json
✅ /next.config.js
✅ /tailwind.config.js

# الأمر:
npm install
npm run dev
```

**الوقت**: 3 دقائق

---

### السيناريو 3: استعادة التوثيق فقط

```bash
# الملفات المطلوبة:
✅ /README.md
✅ /START_HERE.md
✅ /BACKEND_QUICK_START.md
✅ /DELIVERY_READY_REPORT.md
✅ /BACKEND/ (all)
✅ /FINAL/ (all)
✅ /docs/ (all)
✅ /documentation/ (all)
✅ /guidelines/Guidelines.md

# الأمر:
cp -r backup/docs/* ./docs/
cp -r backup/BACKEND/* ./BACKEND/
# إلخ...
```

**الوقت**: 2 دقيقة

---

### السيناريو 4: استعادة بعد تحديث فاشل

```bash
# 1. إيقاف التطبيق
# اضغط Ctrl+C

# 2. حذف التبعيات
rm -rf node_modules/
rm -rf .next/

# 3. استعادة package.json من النسخة الاحتياطية
cp backup/package.json ./package.json

# 4. إعادة التثبيت
npm install

# 5. إعادة التشغيل
npm run dev
```

**الوقت**: 5 دقائق

---

### السيناريو 5: استعادة بعد تعديلات خاطئة

```bash
# استعادة ملف محدد فقط:

# مثال: استعادة App.tsx
cp backup/App.tsx ./App.tsx

# مثال: استعادة globals.css
cp backup/styles/globals.css ./styles/globals.css

# مثال: استعادة مكون معين
cp backup/components/ConversationPageAccessible.tsx ./components/

# إعادة التشغيل
npm run dev
```

**الوقت**: 1 دقيقة

---

## 📋 Checklist الاستعادة

### قبل الاستعادة:

```
□ تأكد من وجود النسخة الاحتياطية
□ احفظ أي تغييرات حديثة مهمة
□ أوقف التطبيق إذا كان يعمل
□ تأكد من وجود مساحة كافية
```

### أثناء الاستعادة:

```
□ اتبع الخطوات بالترتيب
□ تحقق من نجاح كل خطوة
□ راقب رسائل الأخطاء
□ لا تتخطى خطوات
```

### بعد الاستعادة:

```
□ npm install (تثبيت التبعيات)
□ تحقق من .env.local
□ npm run dev (اختبار التشغيل)
□ تصفح http://localhost:3000
□ اختبار الميزات الأساسية
```

---

## 🚨 حالات الطوارئ

### المشكلة: npm install فشل

```bash
# الحل 1: مسح الذاكرة المؤقتة
npm cache clean --force
rm -rf node_modules/
rm package-lock.json
npm install

# الحل 2: استخدام yarn
yarn install

# الحل 3: تحديث npm
npm install -g npm@latest
npm install
```

---

### المشكلة: Build فشل

```bash
# الحل 1: مسح .next
rm -rf .next/
npm run build

# الحل 2: التحقق من TypeScript
npm run type-check

# الحل 3: استعادة tsconfig.json
cp backup/tsconfig.json ./tsconfig.json
npm run build
```

---

### المشكلة: التطبيق لا يعمل

```bash
# الحل 1: التحقق من المنفذ
# تأكد من أن المنفذ 3000 ليس مستخدماً
lsof -ti:3000 | xargs kill -9

# الحل 2: تغيير المنفذ
npm run dev -- -p 3001

# الحل 3: إعادة تشغيل كاملة
rm -rf node_modules/ .next/
npm install
npm run dev
```

---

### المشكلة: Tailwind لا يعمل

```bash
# الحل 1: التحقق من tailwind.config.js
cp backup/tailwind.config.js ./tailwind.config.js

# الحل 2: التحقق من globals.css
cp backup/styles/globals.css ./styles/globals.css

# الحل 3: إعادة البناء
rm -rf .next/
npm run dev
```

---

## 📁 الملفات الحرجة للاستعادة

### المستوى 1 (الأكثر أهمية):

```
🔴 /App.tsx
🔴 /package.json
🔴 /components/ConversationPageAccessible.tsx
🔴 /components/WhatsAppBubble.tsx
🔴 /styles/globals.css
```

**إذا فُقدت هذه الملفات، المشروع لن يعمل!**

---

### المستوى 2 (مهمة جداً):

```
🟡 /lib/i18n.ts
🟡 /lib/gemini-ai.ts
🟡 /tsconfig.json
🟡 /next.config.js
🟡 /tailwind.config.js
🟡 /.env.example
```

**إذا فُقدت هذه الملفات، بعض الميزات لن تعمل**

---

### المستوى 3 (مهمة):

```
🟢 /components/ui/* (40+ ملف)
🟢 /lib/utils.ts
🟢 /lib/mock-chat-data.ts
```

**المشروع يعمل، لكن مع ميزات ناقصة**

---

### المستوى 4 (التوثيق):

```
⚪ /README.md
⚪ /BACKEND/*
⚪ /FINAL/*
⚪ /docs/*
```

**المشروع يعمل بالكامل، لكن بدون توثيق**

---

## 🔧 أوامر استعادة سريعة

### استعادة الأساسيات فقط:

```bash
files=(
  "App.tsx"
  "package.json"
  "tsconfig.json"
  "next.config.js"
  "tailwind.config.js"
  ".env.example"
  ".gitignore"
)

for file in "${files[@]}"; do
  cp "backup/$file" "./$file"
done

cp -r backup/components ./
cp -r backup/lib ./
cp -r backup/styles ./

npm install
npm run dev
```

---

### استعادة كاملة:

```bash
# استعادة كل شيء
cp -r backup/* ./

# حذف الملفات المؤقتة
rm -rf node_modules/ .next/

# تثبيت وتشغيل
npm install
npm run dev
```

---

## 📊 مصفوفة الاستعادة

| الملف | الأولوية | الوقت | الصعوبة |
|------|---------|-------|---------|
| App.tsx | 🔴 عالية | 10 ث | سهل |
| package.json | 🔴 عالية | 10 ث | سهل |
| components/ | 🔴 عالية | 30 ث | سهل |
| styles/ | 🔴 عالية | 10 ث | سهل |
| lib/ | 🟡 متوسطة | 20 ث | سهل |
| docs/ | 🟢 منخفضة | 1 د | سهل |
| BACKEND/ | 🟢 منخفضة | 30 ث | سهل |

---

## ✅ التحقق من نجاح الاستعادة

### 1. تحقق من الملفات:

```bash
# تحقق من وجود الملفات الأساسية
ls -la App.tsx
ls -la package.json
ls -la components/
ls -la styles/globals.css
```

### 2. تحقق من التبعيات:

```bash
# تحقق من تثبيت الحزم
npm list --depth=0
```

### 3. تحقق من البناء:

```bash
# تحقق من عدم وجود أخطاء TypeScript
npm run type-check
```

### 4. تحقق من التشغيل:

```bash
# شغّل التطبيق
npm run dev

# افتح المتصفح
# http://localhost:3000

# تحقق من:
✅ الصفحة تحمّل
✅ المحادثات تظهر
✅ اللغة تتبدّل
✅ الثيم يتبدّل
```

---

## 📝 سجل الاستعادة

```
استخدم هذا القالب لتوثيق عمليات الاستعادة:

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
تاريخ الاستعادة:    ____________
السبب:              ____________
الملفات المستعادة:   ____________
المشاكل واجهتها:     ____________
الحل المستخدم:       ____________
النتيجة:            ✅ نجحت / ❌ فشلت
الوقت المستغرق:     ____________
ملاحظات:           ____________
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
```

---

## 🎯 نصائح لتجنب الحاجة للاستعادة

### 1. استخدم Git:

```bash
# commit بشكل منتظم
git add .
git commit -m "وصف التغييرات"

# branches للتجارب
git checkout -b feature/new-feature
```

### 2. نسخ احتياطية منتظمة:

```bash
# نسخة احتياطية يومية
./scripts/backup.sh

# أو يدوياً
cp -r . ../backup-$(date +%Y%m%d)
```

### 3. اختبر قبل التطبيق:

```bash
# اختبر أولاً
npm run type-check
npm run lint
npm run build

# ثم طبّق
git commit
```

---

<div align="center">

## 🛟 دليل الاستعادة جاهز!

**استخدمه عند الحاجة فقط**

**الوقاية خير من العلاج - استخدم Git!**

**Made with ❤️ by FlowCanvasAI Team**

</div>
