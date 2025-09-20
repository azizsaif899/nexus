# 🚀 خطة اليوم 3: بناء وتأمين إضافة Sheets

**الهدف الرئيسي**: بناء الهيكل الداخلي لإضافة Google Sheets وتطوير عملية بناء ونشر مؤتمتة وآمنة بالكامل.

---

### 🟡 عالية الأولوية
- [x] **TASK-ADDON-001**: إعادة هيكلة `apps/sheets-addon` لفصل الكود إلى `src/server` و `src/client`. (المصدر: `MONTHLY_PLAN.md` - المرحلة 2.1)
- [x] **TASK-BUILD-001**: إعداد أداة البناء (Vite) في `apps/sheets-addon` لتجميع الواجهة الأمامية في ملف HTML واحد. (المصدر: `MONTHLY_PLAN.md` - المرحلة 2.2)

### 🔵 متوسطة الأولوية
- [x] **TASK-DEPLOY-001**: تكوين `.clasp.json` و `.claspignore` في `apps/sheets-addon` لضمان أن النشر يتم فقط من مجلد `dist/` المعزول. (المصدر: `MONTHLY_PLAN.md` - المرحلة 2.3)
- [x] **TASK-ADDON-002**: ربط الواجهة الأمامية للـ Sidebar مع الدوال الخلفية باستخدام `google.script.run`. (المصدر: `MONTHLY_PLAN.md` - المرحلة 2.1)