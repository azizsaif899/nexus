# 🤖 FlowCanvasAI - منصة الأتمتة المرئية

> **منصة احترافية لبناء تدفقات العمل التلقائية مع الذكاء الاصطناعي**

## 🎯 **نظرة عامة**

FlowCanvasAI هي منصة متكاملة تجمع بين:
- **واجهة مرئية** لبناء تدفقات العمل بالسحب والإفلات
- **ذكاء اصطناعي متقدم** لتوليد التدفقات من النص
- **خلفية قوية** مع Firebase و Cloud Functions
- **أمان مؤسسي** وقابلية التوسع

---

## ✨ **الميزات الرئيسية**

### 🎨 **الواجهة (Frontend)**
- **Canvas تفاعلي** مع zoom وpan
- **سحب وإفلات ذكي** مع snapping تلقائي
- **ربط العقد** بخطوط منحنية جميلة
- **خصائص العقد** قابلة للتخصيص
- **تصميم متجاوب** مع دعم الثيمات

### 🤖 **الذكاء الاصطناعي**
- **Gemini 2.5 Flash** لتوليد التدفقات
- **معالجة اللغة الطبيعية** العربية والإنجليزية
- **تحسين التدفقات** تلقائياً
- **اقتراحات ذكية** للتحسين

### ⚙️ **الخلفية (Backend)**
- **Cloud Functions** مع NestJS
- **Firebase Data Connect** لقاعدة البيانات
- **نظام أمان متقدم** مع تشفير
- **APIs موثقة** مع Swagger

---

## 🛠️ **التقنيات المستخدمة**

### **Frontend:**
- Next.js 15 + React 18 + TypeScript
- Tailwind CSS + Radix UI + ShadCN
- Genkit للذكاء الاصطناعي

### **Backend:**
- NestJS + Firebase Functions
- Firebase Data Connect + BigQuery
- JWT Authentication + CORS

### **DevOps:**
- Firebase Hosting + Emulators
- Git + GitHub Actions
- Docker + Nginx

---

## 🚀 **البدء السريع**

### **للمبرمجين الجدد:**
```bash
# 1. حمل المشروع
git clone https://github.com/azizsaif899/nexus.git
cd nexus

# 2. ثبت التبعيات
npm install

# 3. انسخ متغيرات البيئة
cp .env.example .env
# عدل .env بمعلوماتك

# 4. شغل المشروع
npm run dev
```

### **للمطورين المتقدمين:**
```bash
# تشغيل كامل مع Firebase
npm run dev:all

# بناء للإنتاج
npm run build

# نشر على Firebase
npm run firebase:deploy
```

---

## 📁 **بنية المشروع**

```
nexus/
├── src/                    # 🎨 الواجهة
│   ├── app/               # صفحات Next.js
│   ├── components/        # مكونات React
│   ├── ai/               # خدمات الذكاء الاصطناعي
│   └── lib/              # مكتبات مساعدة
├── functions/             # ⚙️ الخلفية
│   └── src/              # Cloud Functions
├── packages/              # 📦 مكتبات مشتركة
│   ├── ai-engine/        # محرك AI
│   └── security-core/    # نظام الأمان
├── dataconnect/          # 🗄️ قاعدة البيانات
├── config/               # ⚙️ إعدادات
└── docs/                 # 📚 التوثيق
```

---

## 👥 **للفريق**

### **📚 اقرأ أولاً:**
- [دليل إعداد الفريق](docs/TEAM_SETUP_GUIDE.md) - للمبرمجين المبتدئين
- [إرشادات التطوير](docs/development/DEVELOPER_GUIDELINES.md)
- [قواعد الأمان](docs/ai-management/AI_RULES_AND_PROTOCOLS.md)

### **🔄 الروتين اليومي:**
```bash
# كل صباح
git pull origin main
npm install
npm run dev

# نهاية اليوم
git add .
git commit -m "وصف العمل المنجز"
git push origin main
```

---

## 🎮 **الاستخدام**

### **1. بناء تدفق عمل:**
- اسحب العناصر من الشريط الجانبي
- اربطها بالنقر على النقاط الزرقاء
- خصص الخصائص من خلال أيقونة الإعدادات

### **2. استخدام الذكاء الاصطناعي:**
- اكتب وصف التدفق في الشات
- سيقوم AI بتوليد التدفق تلقائياً
- اضغط "Apply to Canvas" لتطبيقه

### **3. تخصيص التصميم:**
- اذهب لصفحة `/design`
- غير الألوان والثيمات
- شاهد التغييرات مباشرة

---

## 📊 **الإحصائيات**

- **حجم البناء:** ~125 kB
- **وقت البناء:** ~17 ثانية
- **الصفحات:** 7 صفحات
- **المكونات:** 40+ مكون UI
- **اللغات:** العربية والإنجليزية

---

## 🤝 **المساهمة**

نرحب بالمساهمات! يرجى:

1. **Fork** المشروع
2. **إنشاء branch** للميزة الجديدة
3. **Commit** التغييرات مع رسائل واضحة
4. **Push** للـ branch
5. **إنشاء Pull Request**

---

## 📄 **الترخيص**

هذا المشروع مرخص تحت [MIT License](LICENSE).

---

## 📞 **التواصل**

- **المطور:** عبدالعزيز سيف
- **البريد:** azizsaif.d@gmail.com
- **GitHub:** [@azizsaif899](https://github.com/azizsaif899)

---

## 🙏 **شكر خاص**

- **Google** لـ Gemini AI و Firebase
- **Vercel** لـ Next.js
- **Radix UI** للمكونات الرائعة
- **المجتمع** للدعم والمساهمات

---

**تم تطويره بـ ❤️ في السعودية**