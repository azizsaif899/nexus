# 📚 دليل مشروع FlowCanvasAI

## 🎯 نظرة عامة
منصة أتمتة مرئية مدعومة بالذكاء الاصطناعي لتطوير التطبيقات والأنظمة بطريقة بصرية تفاعلية.

## 🏗️ بنية المشروع
```
studio/
├── src/                    # الواجهة الأمامية (Next.js)
├── functions/              # الواجهة الخلفية (Firebase Functions)
├── apps/                   # التطبيقات الفرعية
├── packages/               # المكتبات المشتركة
├── dataconnect/           # قاعدة البيانات
├── config/                # إعدادات النشر
└── docs/                  # التوثيق
```

## 🚀 البدء السريع

### تشغيل المشروع:
```bash
git clone https://github.com/azizsaif899/nexus.git
cd nexus
npm install
npm run dev
```

### للمطورين الجدد:
1. **Frontend:** اعمل في مجلد `src/`
2. **Backend:** اعمل في مجلد `functions/`
3. **التصميم:** اعمل في `src/components/` و `src/app/`

## 📋 المهام اليومية

### 🌅 بداية اليوم:
- [ ] `git pull origin main`
- [ ] `npm install`
- [ ] `npm run dev`
- [ ] مراجعة المهام

### 🌙 نهاية اليوم:
- [ ] `git add .`
- [ ] `git commit -m "وصف العمل"`
- [ ] `git push origin main`

## 🛡️ قواعد الأمان
- **ممنوع:** تعديل إعدادات Firebase
- **ممنوع:** كشف مفاتيح API
- **مطلوب:** تشفير البيانات الحساسة
- **مطلوب:** اختبار الكود قبل الرفع

## 🎨 معايير التصميم
- **الألوان:** نظام داكن احترافي
- **الخطوط:** Cairo (عربي) + Inter (إنجليزي)
- **الأدوات:** Tailwind CSS + ShadCN UI
- **الاستجابة:** Mobile First

## 💻 معايير البرمجة
- **اللغة:** TypeScript
- **الواجهة:** React/Next.js
- **الخلفية:** NestJS/Firebase
- **الاختبار:** Jest + Testing Library

## 📞 الدعم
- **المطور الرئيسي:** عبدالعزيز سيف
- **البريد:** azizsaif.d@gmail.com
- **Discord:** @azizsaif899

---
**📅 آخر تحديث:** ديسمبر 2024