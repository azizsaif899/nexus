# 📋 خطة اليوم 93 - إصلاح شامل لـ API

**📅 التاريخ:** يوم 93  
**🎯 الهدف:** إصلاح جميع مشاكل API وتحقيق بناء ناجح 100%  
**⏱️ المدة المقدرة:** 8 ساعات  
**👥 المطورين المطلوبين:** 2 مطورين Backend + 1 DevOps

---

## 📊 الوضع الحالي
- **api:** ❌ 100+ أخطاء TypeScript
- **المشاكل الرئيسية:**
  - تبعيات مفقودة (tslib, typeorm, jwt, etc.)
  - مسارات استيراد خاطئة
  - تكوينات TypeScript معطلة
  - مشاكل في Entity definitions

---

## 🎯 المهام (15 مهمة)

### المرحلة 1: تحليل المشاكل (1.5 ساعة)

#### المهمة 1: تحليل أخطاء TypeScript
**المطور:** Backend Lead  
**الوقت:** 45 دقيقة  
**الوصف:** فحص وتصنيف جميع أخطاء TypeScript
```bash
cd apps\api
pnpm run build > build_errors_day93.log 2>&1
# تصنيف الأخطاء حسب النوع
```
**الاختبار:** إنشاء ملف تصنيف الأخطاء
**التقرير:** `typescript_errors_analysis_day93.json`

#### المهمة 2: فحص التبعيات المفقودة
**المطور:** Backend Lead  
**الوقت:** 30 دقيقة  
**الوصف:** تحديد جميع التبعيات المطلوبة
```bash
# فحص package.json مقابل الاستيرادات
grep -r "import.*from" src/ | grep -v node_modules > imports_day93.txt
```
**الاختبار:** قائمة شاملة بالتبعيات
**التقرير:** `missing_dependencies_day93.md`

#### المهمة 3: فحص تكوين TypeScript
**المطور:** DevOps  
**الوقت:** 15 دقيقة  
**الوصف:** مراجعة وإصلاح tsconfig.json
```json
{
  "compilerOptions": {
    "module": "commonjs",
    "target": "es2020",
    "experimentalDecorators": true,
    "emitDecoratorMetadata": true,
    "importHelpers": true
  }
}
```
**الاختبار:** `tsc --noEmit`
**التقرير:** `tsconfig_fixes_day93.json`

### المرحلة 2: إصلاح التبعيات (2 ساعات)

#### المهمة 4: تثبيت تبعيات NestJS الأساسية
**المطور:** Backend Dev  
**الوقت:** 30 دقيقة  
**الوصف:** تثبيت جميع تبعيات NestJS المطلوبة
```bash
cd apps\api
pnpm add @nestjs/config @nestjs/jwt @nestjs/swagger @nestjs/typeorm
pnpm add @nestjs/websockets @nestjs/passport
pnpm add tslib reflect-metadata
```
**الاختبار:** فحص package.json
**التقرير:** `nestjs_dependencies_day93.log`

#### المهمة 5: تثبيت تبعيات قاعدة البيانات
**المطور:** Backend Dev  
**الوقت:** 30 دقيقة  
**الوصف:** إضافة تبعيات TypeORM وقواعد البيانات
```bash
pnpm add typeorm mysql2 redis ioredis
pnpm add @types/bcrypt bcrypt
pnpm add class-validator class-transformer
```
**الاختبار:** اختبار الاتصال بقاعدة البيانات
**التقرير:** `database_dependencies_day93.log`

#### المهمة 6: تثبيت تبعيات الأمان والمساعدة
**المطور:** Backend Dev  
**الوقت:** 30 دقيقة  
**الوصف:** إضافة تبعيات الأمان والأدوات المساعدة
```bash
pnpm add cors helmet express-rate-limit
pnpm add passport passport-jwt
pnpm add joi rxjs socket.io
pnpm add @google-cloud/pubsub @google-cloud/bigquery
```
**الاختبار:** فحص الاستيرادات
**التقرير:** `security_dependencies_day93.log`

#### المهمة 7: إصلاح مسارات الحزم الداخلية
**المطور:** Backend Lead  
**الوقت:** 30 دقيقة  
**الوصف:** تحديث مسارات استيراد الحزم الداخلية
```bash
# تحديث المسارات
sed -i 's/@g-assistant-nx\/ai-engine/@azizsys\/domain\/ai-engine/g' src/**/*.ts
sed -i 's/@azizsys\/core-logic/@azizsys\/core\/core-logic/g' src/**/*.ts
sed -i 's/@g-assistant-nx\/security-core/@azizsys\/domain\/security-core/g' src/**/*.ts
```
**الاختبار:** فحص الاستيرادات الجديدة
**التقرير:** `import_paths_fix_day93.log`

### المرحلة 3: إصلاح الكود (3 ساعات)

#### المهمة 8: إصلاح Entity definitions
**المطور:** Backend Lead  
**الوقت:** 60 دقيقة  
**الوصف:** إصلاح تعريفات قاعدة البيانات
```typescript
// src/database/user.entity.ts
import { Entity, Column, PrimaryGeneratedColumn, Repository } from 'typeorm';

@Entity('users')
export class User {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ unique: true })
  email: string;
  
  // إصلاح باقي التعريفات
}
```
**الاختبار:** `pnpm run build` للـ entities
**التقرير:** `entity_fixes_day93.md`

#### المهمة 9: إصلاح Controllers والServices
**المطور:** Backend Dev  
**الوقت:** 60 دقيقة  
**الوصف:** إصلاح جميع Controllers والServices
```typescript
// إضافة decorators مفقودة
@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(User)
    private userRepository: Repository<User>
  ) {}
}
```
**الاختبار:** فحص كل controller
**التقرير:** `controllers_services_fix_day93.md`

#### المهمة 10: إصلاح Middleware والGuards
**المطور:** Backend Dev  
**الوقت:** 45 دقيقة  
**الوصف:** إصلاح Middleware وGuards
```typescript
@Injectable()
export class JwtAuthGuard extends AuthGuard('jwt') {
  canActivate(context: ExecutionContext): boolean {
    // إصلاح المنطق
    return super.canActivate(context);
  }
}
```
**الاختبار:** اختبار المصادقة
**التقرير:** `middleware_guards_fix_day93.md`

#### المهمة 11: إصلاح Gateway وWebSocket
**المطور:** Backend Lead  
**الوقت:** 15 دقيقة  
**الوصف:** إصلاح gateway/main.ts ومشاكل WebSocket
```typescript
// src/gateway/main.ts - إصلاح import.meta
const port = process.env.PORT || 3001;
const app = express();
```
**الاختبار:** تشغيل Gateway
**التقرير:** `gateway_websocket_fix_day93.md`

### المرحلة 4: اختبار وتحسين (1.5 ساعة)

#### المهمة 12: اختبار البناء التدريجي
**المطور:** DevOps  
**الوقت:** 30 دقيقة  
**الوصف:** اختبار بناء كل module على حدة
```bash
# اختبار تدريجي
tsc --noEmit src/auth/*.ts
tsc --noEmit src/database/*.ts
tsc --noEmit src/controllers/*.ts
```
**الاختبار:** بناء ناجح لكل module
**التقرير:** `incremental_build_test_day93.log`

#### المهمة 13: إصلاح الأخطاء المتبقية
**المطور:** Backend Lead + Backend Dev  
**الوقت:** 45 دقيقة  
**الوصف:** إصلاح آخر الأخطاء المتبقية
```bash
# تشغيل البناء وإصلاح الأخطاء واحد تلو الآخر
pnpm run build
# إصلاح كل خطأ على حدة
```
**الاختبار:** بناء ناجح 100%
**التقرير:** `final_fixes_day93.log`

#### المهمة 14: اختبار التشغيل والوظائف
**المطور:** DevOps  
**الوقت:** 15 دقيقة  
**الوصف:** اختبار تشغيل API والوظائف الأساسية
```bash
cd apps\api
pnpm run start:dev
# اختبار endpoints
curl http://localhost:3000/health
curl http://localhost:3000/auth/login
```
**الاختبار:** API يعمل بدون أخطاء
**التقرير:** `api_runtime_test_day93.log`

#### المهمة 15: توثيق الإصلاحات والدروس المستفادة
**المطور:** Backend Lead  
**الوقت:** 10 دقيقة  
**الوصف:** توثيق شامل لجميع الإصلاحات
```markdown
# تقرير إصلاح API - اليوم 93
## الأخطاء المصلحة: 100+
## التبعيات المضافة: 25+
## الملفات المحدثة: 50+
## معدل نجاح البناء: 100%
```
**الاختبار:** مراجعة التوثيق
**التقرير:** `DAY_093_API_FIX_COMPLETE.md`

---

## 🎯 معايير النجاح

### الأهداف الأساسية:
- ✅ بناء ناجح 100% لـ API
- ✅ تشغيل API بدون أخطاء
- ✅ جميع endpoints تعمل

### الأهداف الثانوية:
- ✅ تحسين أداء البناء
- ✅ توثيق شامل للإصلاحات
- ✅ اختبارات وحدة أساسية

---

## ⚠️ المخاطر والتحديات

### المخاطر العالية:
1. **تعارض التبعيات** - احتمال 50%
2. **مشاكل TypeORM** - احتمال 40%
3. **أخطاء runtime** - احتمال 30%

### خطط التعافي:
1. **نسخ احتياطية** لكل مرحلة
2. **اختبار تدريجي** لكل إصلاح
3. **فريق دعم** للمساعدة الفورية

---

## 📊 التقارير المطلوبة

### تقارير المراحل:
1. `typescript_errors_analysis_day93.json`
2. `missing_dependencies_day93.md`
3. `entity_fixes_day93.md`
4. `api_runtime_test_day93.log`

### التقرير النهائي:
- `DAY_093_API_FIX_COMPLETE.md`
- `DAY_093_PERFORMANCE_METRICS.json`
- `DAY_094_NEXT_OPTIMIZATIONS.md`

---

**🚀 بنهاية اليوم 93، سيكون API يعمل بكفاءة 100% مع جميع الوظائف المطلوبة!**