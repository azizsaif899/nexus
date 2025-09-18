# 👥 دليل إعداد المبرمج - للمبتدئين والمحترفين

## 🎯 **مرحباً بك في فريق FlowCanvasAI!**

هذا الدليل سيعلمك كيفية العمل مع المشروع خطوة بخطوة، سواء كنت مبتدئاً أو محترفاً.

---

## 🛠️ **المتطلبات الأساسية**

### **1. تثبيت الأدوات:**
```bash
# Git (لإدارة الكود)
https://git-scm.com/downloads

# Node.js (لتشغيل المشروع)
https://nodejs.org/

# VS Code (محرر الكود)
https://code.visualstudio.com/

# pnpm (مدير الحزم - أسرع من npm)
npm install -g pnpm
```

### **2. إعداد Git (مرة واحدة فقط):**
```bash
git config --global user.name "اسمك هنا"
git config --global user.email "your.email@example.com"
```

---

## 🚀 **الخطوة 1: تحميل المشروع**

### **أول مرة (Clone):**
```bash
# 1. افتح Terminal/Command Prompt
# 2. اذهب للمجلد الذي تريد العمل فيه
cd Desktop

# 3. حمل المشروع
git clone https://github.com/azizsaif899/nexus.git
cd nexus

# 4. ثبت التبعيات
npm install

# 5. تسجيل دخول Firebase (مرة واحدة فقط)
firebase login
```

---

## 🎮 **الخطوة 2: تشغيل المشروع**

### **تشغيل المشروع:**
```bash
# الطريقة السهلة (كل شيء معاً)
npm run dev:all

# أو تشغيل منفصل:
# Terminal 1 - الواجهة
npm run dev

# Terminal 2 - Firebase
firebase emulators:start

# ثم افتح المتصفح على:
http://localhost:9002
```

---

## 🔄 **الخطوة 3: سحب التحديثات (يومياً)**

### **كل صباح قبل العمل:**
```bash
# 1. احفظ عملك أولاً (إذا كان لديك تغييرات)
git add .
git commit -m "حفظ العمل الحالي"

# 2. اسحب التحديثات الجديدة
git pull origin main

# 3. حدث التبعيات (إذا تغيرت)
npm install

# 4. تأكد من تسجيل دخول Firebase
firebase login --reauth
```

---

## 📤 **الخطوة 4: رفع عملك**

### **عند انتهائك من العمل:**
```bash
# 1. تأكد من أن كل شيء يعمل
npm run build

# 2. أضف ملفاتك المعدلة
git add .

# 3. اكتب رسالة وصفية
git commit -m "✨ إضافة ميزة تسجيل الدخول"

# 4. ارفع للمستودع
git push origin main
```

### **أمثلة رسائل Commit جيدة:**
```bash
git commit -m "🐛 إصلاح خطأ في زر الحفظ"
git commit -m "✨ إضافة صفحة الإعدادات"  
git commit -m "🎨 تحسين تصميم الهيدر"
git commit -m "📝 تحديث التوثيق"
```

---

## 🏗️ **فهم بنية المشروع**

### **المجلدات المهمة:**
```
nexus/
├── src/                    # 🎨 الواجهة (Frontend)
│   ├── app/               # صفحات Next.js
│   ├── components/        # مكونات React
│   └── lib/               # مكتبات مساعدة
├── functions/             # ⚙️ الخلفية (Backend)
│   └── src/               # Cloud Functions
├── packages/              # 📦 مكتبات مشتركة
│   ├── ai-engine/         # محرك الذكاء الاصطناعي
│   └── security-core/     # نظام الأمان
├── dataconnect/           # 🗄️ قاعدة البيانات
├── config/                # ⚙️ إعدادات Firebase
└── docs/                  # 📚 التوثيق
```

---

## 🚨 **المشاكل الشائعة والحلول**

### **مشكلة: "git pull" يعطي خطأ**
```bash
# الحل:
git stash              # احفظ تغييراتك مؤقتاً
git pull origin main   # اسحب التحديثات
git stash pop          # استرجع تغييراتك
```

### **مشكلة: "npm run dev" لا يعمل**
```bash
# الحل:
rm -rf node_modules    # احذف المجلد
pnpm install           # أعد التثبيت
npm run dev            # جرب مرة أخرى
```

### **مشكلة: "التبعيات مفقودة"**
```bash
# الحل:
pnpm install           # ثبت التبعيات
```

---

## 📅 **الروتين اليومي**

### **🌅 الصباح (10 دقائق):**
```bash
cd nexus
git pull origin main
npm install
firebase login --reauth
npm run dev:all
```

### **🌙 نهاية اليوم (5 دقائق):**
```bash
git add .
git commit -m "وصف ما عملته اليوم"
git push origin main
```

---

## 🎯 **نصائح للنجاح**

### **✅ افعل:**
- اسحب التحديثات يومياً
- اكتب رسائل commit واضحة
- اختبر كودك قبل الرفع
- اسأل إذا لم تفهم شيئاً

### **❌ لا تفعل:**
- لا تعدل ملفات لا تفهمها
- لا ترفع كود مكسور
- لا تنس سحب التحديثات
- لا تخف من طلب المساعدة

---

**📅 آخر تحديث:** يناير 2025  
**📝 بواسطة:** عبدالعزيز سيف