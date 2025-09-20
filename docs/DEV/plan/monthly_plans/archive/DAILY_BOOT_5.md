# 🚀 خطة اليوم 5: بناء الواجهة الخلفية (API)

**الهدف الرئيسي**: بناء API Gateway قوي باستخدام NestJS وتوفير نقاط الوصول (Endpoints) الأساسية التي تحتاجها الواجهات.

---

### 🟡 عالية الأولوية
- [x] **TASK-API-001**: إنشاء تطبيق `apps/api` باستخدام NestJS وإعداد الوحدات الأساسية (AuthModule, QueryModule). (المصدر: `MONTHLY_PLAN.md` - المرحلة 4.1)
- [x] **TASK-API-002**: بناء `QueryController` و `QueryService` في `apps/api` لمعالجة استعلامات الذكاء الاصطناعي، مع استدعاء `GeminiClient` من `core-logic`. (المصدر: `MONTHLY_PLAN.md` - المرحلة 4.1)

### 🔵 متوسطة الأولوية
- [x] **TASK-API-003**: بناء `AuthController` و `AuthService` مع منطق JWT للمصادقة. (المصدر: `MONTHLY_PLAN.md` - المرحلة 4.1)
- [x] **TASK-INTEG-001**: ربط `apps/web-chatbot` مع `apps/api` لجلب استجابات الذكاء الاصطناعي الحقيقية. (المصدر: أفضل الممارسات)