# 🧪 دليل الاختبارات الشامل - AzizSys v2.0

## 🎯 نظرة عامة

نظام اختبارات متكامل وشامل يغطي جميع جوانب AzizSys AI Assistant v2.0، من الوحدات الأساسية إلى الميزات المتقدمة.

## 📋 أنواع الاختبارات

### 1. 🔧 اختبارات الوحدة (Unit Tests)
- **الموقع**: `tests/unit/`
- **الغرض**: اختبار المكونات الفردية بشكل معزول
- **التشغيل**: `npm run test:unit`

**ما يتم اختباره:**
- ✅ النظام الأساسي (Core System)
- ✅ محرك الذكاء الاصطناعي (AI Engine)
- ✅ نظام الأمان (Security Core)
- ✅ الوكلاء الذكيين (Sidebar Agents)
- ✅ منطق العمل (Business Logic)

### 2. 🔗 اختبارات التكامل (Integration Tests)
- **الموقع**: `tests/integration/`
- **الغرض**: اختبار تفاعل المكونات مع بعضها البعض
- **التشغيل**: `npm run test:integration`

**ما يتم اختباره:**
- ✅ واجهات برمجة التطبيقات (API Endpoints)
- ✅ قاعدة البيانات (Database Operations)
- ✅ التكامل مع الخدمات الخارجية
- ✅ تدفق البيانات بين المكونات

### 3. 🎭 اختبارات E2E (End-to-End Tests)
- **الموقع**: `tests/e2e/`
- **الغرض**: اختبار رحلة المستخدم الكاملة
- **التشغيل**: `npm run test:e2e`

**ما يتم اختباره:**
- ✅ رحلة المستخدم الكاملة
- ✅ واجهة المستخدم التفاعلية
- ✅ السايد بار الثوري
- ✅ البحث الذكي
- ✅ التوصيات الذكية
- ✅ الاستجابة للجوال

### 4. ⚡ اختبارات الأداء (Performance Tests)
- **الموقع**: `tests/performance/`
- **الغرض**: قياس الأداء والسرعة
- **التشغيل**: `npm run test:performance`

**ما يتم اختباره:**
- ✅ سرعة الاستجابة (< 500ms)
- ✅ الحمولة المتزامنة (50+ طلب)
- ✅ استهلاك الذاكرة
- ✅ اختبارات الضغط
- ✅ أداء قاعدة البيانات

### 5. 🔒 اختبارات الأمان (Security Tests)
- **الموقع**: `tests/security/`
- **الغرض**: فحص الثغرات الأمنية
- **التشغيل**: `npm run test:security`

**ما يتم اختباره:**
- ✅ المصادقة والتفويض
- ✅ حقن SQL
- ✅ هجمات XSS
- ✅ تشفير البيانات
- ✅ حدود المعدل (Rate Limiting)

## 🚀 تشغيل الاختبارات

### التشغيل السريع
```bash
# تشغيل جميع الاختبارات
npm run test:all

# أو استخدام السكريبت المرئي
./tests/RUN_ALL_TESTS.bat
```

### التشغيل المتقدم
```bash
# إعداد بيئة الاختبار
npm run test:setup

# تشغيل نوع محدد من الاختبارات
npm run test:unit
npm run test:integration
npm run test:e2e
npm run test:performance
npm run test:security

# تشغيل مع تقرير التغطية
npm run test:coverage

# تشغيل في وضع المراقبة
npm run test:watch

# تنظيف بيئة الاختبار
npm run test:cleanup
```

### التشغيل للتكامل المستمر (CI)
```bash
npm run test:ci
```

## 📊 التقارير

### تقارير HTML التفاعلية
- **الموقع**: `test-reports/`
- **المحتوى**: تقارير مرئية شاملة مع رسوم بيانية

### تقارير JSON
- **الموقع**: `test-reports/`
- **المحتوى**: بيانات خام للتحليل المتقدم

### تقرير التغطية
- **الموقع**: `coverage/`
- **المحتوى**: تحليل تغطية الكود

## 🔧 الإعداد والتكوين

### متطلبات النظام
- Node.js >= 18.0.0
- PostgreSQL (للاختبارات)
- Redis (اختياري)
- Chrome/Chromium (لاختبارات E2E)

### ملفات التكوين
- `vitest.config.ts` - تكوين Vitest
- `playwright.config.ts` - تكوين Playwright
- `tests/setup.ts` - إعداد عام للاختبارات
- `.env.test` - متغيرات البيئة للاختبار

### إعداد قاعدة البيانات
```bash
# إنشاء قاعدة بيانات الاختبار
createdb azizsys_test

# تشغيل migrations
npm run db:migrate:test
```

## 📈 معايير النجاح

### معدلات النجاح المطلوبة
- **اختبارات الوحدة**: 95%+
- **اختبارات التكامل**: 90%+
- **اختبارات E2E**: 85%+
- **اختبارات الأداء**: 80%+
- **اختبارات الأمان**: 100%

### معايير الأداء
- **سرعة الاستجابة**: < 500ms
- **الحمولة المتزامنة**: 50+ طلب
- **استهلاك الذاكرة**: < 10MB زيادة
- **تغطية الكود**: 80%+

## 🛠️ استكشاف الأخطاء

### مشاكل شائعة وحلولها

#### 1. فشل في الاتصال بقاعدة البيانات
```bash
# التحقق من حالة PostgreSQL
pg_isready

# إعادة إنشاء قاعدة البيانات
dropdb azizsys_test
createdb azizsys_test
npm run db:migrate:test
```

#### 2. فشل اختبارات E2E
```bash
# التحقق من تشغيل الخدمات
npm run dev:api &
npm run dev:admin-dashboard &

# تحديث المتصفحات
npx playwright install
```

#### 3. بطء في الاختبارات
```bash
# تشغيل متوازي محدود
npm run test:unit -- --reporter=dot --threads=2
```

## 📝 كتابة اختبارات جديدة

### مثال اختبار وحدة
```typescript
import { describe, it, expect } from 'vitest';
import { MyService } from './my-service';

describe('MyService', () => {
  it('should process data correctly', () => {
    const service = new MyService();
    const result = service.processData('test');
    expect(result).toBe('processed: test');
  });
});
```

### مثال اختبار تكامل
```typescript
import { describe, it, expect } from 'vitest';
import request from 'supertest';
import { app } from './app';

describe('API Integration', () => {
  it('should return user data', async () => {
    const response = await request(app)
      .get('/api/users/1')
      .expect(200);
    
    expect(response.body.id).toBe(1);
  });
});
```

### مثال اختبار E2E
```typescript
import { test, expect } from '@playwright/test';

test('user can login', async ({ page }) => {
  await page.goto('/login');
  await page.fill('[data-testid="email"]', 'test@example.com');
  await page.fill('[data-testid="password"]', 'password');
  await page.click('[data-testid="login-button"]');
  
  await expect(page).toHaveURL('/dashboard');
});
```

## 🎯 أفضل الممارسات

### 1. تسمية الاختبارات
- استخدم أسماء وصفية وواضحة
- ابدأ بـ "should" للسلوك المتوقع
- استخدم العربية للوصف عند الحاجة

### 2. تنظيم الاختبارات
- مجموعة واحدة لكل ملف/وحدة
- ترتيب منطقي للاختبارات
- استخدام `describe` للتجميع

### 3. البيانات التجريبية
- استخدم fixtures للبيانات المعقدة
- تجنب البيانات الحقيقية
- نظف البيانات بعد كل اختبار

### 4. Mock والتبعيات
- Mock الخدمات الخارجية
- استخدم dependency injection
- تجنب الاعتماد على الشبكة

## 📞 الدعم والمساعدة

### الحصول على المساعدة
- راجع الوثائق في `docs/testing/`
- تحقق من الأمثلة في `tests/examples/`
- اطلع على التقارير في `test-reports/`

### الإبلاغ عن المشاكل
- استخدم GitHub Issues
- أرفق تفاصيل البيئة
- قدم خطوات إعادة الإنتاج

---

## 🏆 الخلاصة

نظام الاختبارات في AzizSys v2.0 مصمم ليكون:
- **شامل**: يغطي جميع الجوانب
- **سريع**: نتائج في دقائق
- **موثوق**: نتائج متسقة
- **مرئي**: تقارير واضحة
- **قابل للصيانة**: سهل التحديث

**🎉 مع هذا النظام، يمكنك الثقة في جودة وموثوقية AzizSys v2.0!**