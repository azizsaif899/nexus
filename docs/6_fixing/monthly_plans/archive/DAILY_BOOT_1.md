# 🚀 خطة اليوم 1: تأسيس الهيكل ومعايير الجودة

**الهدف الرئيسي**: بناء هيكل Monorepo احترافي، وفرض معايير جودة وكتابة كود موحدة بشكل آلي.

---

### 🔴 حرجة
- [ ] **TASK-SETUP-001**: تهيئة المشروع باستخدام `pnpm` و `Turborepo` وإنشاء الهيكل الأساسي للمجلدات (`apps`, `packages`). (المصدر: `MONTHLY_PLAN.md` - المرحلة 1.1)

### 🟡 عالية الأولوية
- [ ] **TASK-CONFIG-001**: إنشاء حزمة `packages/config` تحتوي على إعدادات `tsconfig.json` و `eslint-preset` الموحدة. (المصدر: `MONTHLY_PLAN.md` - المرحلة 1.2)
- [ ] **TASK-CI-001**: إنشاء ملف `ci.yml` أساسي في `.github/workflows` يقوم بتشغيل `lint` و `test` عند كل Pull Request. (المصدر: `MONTHLY_PLAN.md` - المرحلة 1.3)
- [ ] **TASK-CONFIG-002**: تطبيق الإعدادات المركزية (tsconfig, eslint) على جميع مساحات العمل في `apps` و `packages`. (المصدر: `MONTHLY_PLAN.md` - المرحلة 1.2)