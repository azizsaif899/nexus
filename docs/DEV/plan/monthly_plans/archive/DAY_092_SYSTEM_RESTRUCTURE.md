# 📋 خطة اليوم 92 - إعادة هيكلة النظام الشاملة

**📅 التاريخ:** يوم 92  
**🎯 الهدف:** إعادة هيكلة packages وإصلاح مشاكل البناء  
**⏱️ المدة المقدرة:** 8 ساعات  
**👥 المطورين المطلوبين:** 3 مطورين (Backend, Frontend, DevOps)

---

## 📊 الوضع الحالي
- **74 حزمة** غير منظمة في packages/
- **معدل نجاح البناء:** 17% (1/6 تطبيقات)
- **admin-dashboard:** ✅ يعمل
- **api:** ❌ 100+ أخطاء TypeScript
- **web-chatbot:** ❌ خطأ في @google/genai

---

## 🎯 المهام (15 مهمة)

### المرحلة 1: تحليل وتخطيط (2 ساعة)

#### المهمة 1: تحليل الحزم الحالية
**المطور:** DevOps  
**الوقت:** 30 دقيقة  
**الوصف:** فحص وتصنيف جميع الحزم في packages/
```bash
# الأوامر
cd E:\azizsys5\g-assistant-nx\packages
dir /b > packages_list.txt
# تصنيف الحزم حسب النوع
```
**الاختبار:** إنشاء ملف تصنيف الحزم
**التقرير:** `packages_analysis_day92.json`

#### المهمة 2: إنشاء هيكل المجلدات الجديد
**المطور:** DevOps  
**الوقت:** 30 دقيقة  
**الوصف:** إنشاء المجلدات الفرعية للتنظيم
```bash
mkdir packages\core packages\domain packages\ui packages\features packages\integrations packages\tooling
```
**الاختبار:** التأكد من إنشاء 6 مجلدات
**التقرير:** `folder_structure_day92.md`

#### المهمة 3: تحديث pnpm-workspace.yaml
**المطور:** DevOps  
**الوقت:** 20 دقيقة  
**الوصف:** تحديث workspace لدعم المجلدات الفرعية
```yaml
packages:
  - 'apps/*'
  - 'packages/*'
  - 'packages/core/*'
  - 'packages/domain/*'
  - 'packages/ui/*'
  - 'packages/features/*'
  - 'packages/integrations/*'
  - 'packages/tooling/*'
```
**الاختبار:** `pnpm install --dry-run`
**التقرير:** `workspace_config_day92.yaml`

#### المهمة 4: نسخ احتياطية
**المطور:** DevOps  
**الوقت:** 40 دقيقة  
**الوصف:** إنشاء نسخ احتياطية كاملة
```bash
xcopy packages packages_backup_day92 /E /I
xcopy apps apps_backup_day92 /E /I
```
**الاختبار:** التأكد من النسخ الاحتياطية
**التقرير:** `backup_status_day92.log`

### المرحلة 2: نقل الحزم (3 ساعات)

#### المهمة 5: نقل حزم Core
**المطور:** Backend  
**الوقت:** 45 دقيقة  
**الوصف:** نقل الحزم الأساسية
```bash
move packages\api-client packages\core\
move packages\config-core packages\core\
move packages\error-handler packages\core\
move packages\gateway-core packages\core\
move packages\json-rpc-client packages\core\
move packages\cache-client packages\core\
move packages\shared-types packages\core\
```
**الاختبار:** فحص المسارات الجديدة
**التقرير:** `core_packages_migration_day92.md`

#### المهمة 6: نقل حزم Domain
**المطور:** Backend  
**الوقت:** 45 دقيقة  
**الوصف:** نقل حزم منطق الأعمال
```bash
move packages\crm packages\domain\
move packages\ai-engine packages\domain\
move packages\ml-core packages\domain\
move packages\analytics-core packages\domain\
move packages\billing-core packages\domain\
move packages\compliance-core packages\domain\
```
**الاختبار:** فحص التبعيات
**التقرير:** `domain_packages_migration_day92.md`

#### المهمة 7: نقل حزم UI
**المطور:** Frontend  
**الوقت:** 30 دقيقة  
**الوصف:** نقل مكونات الواجهة
```bash
move packages\ui-components packages\ui\
move packages\sidebar-agents packages\ui\
move packages\notifications packages\ui\
```
**الاختبار:** اختبار استيراد المكونات
**التقرير:** `ui_packages_migration_day92.md`

#### المهمة 8: نقل حزم Features
**المطور:** Backend  
**الوقت:** 30 دقيقة  
**الوصف:** نقل الميزات المستقلة
```bash
move packages\advanced-features packages\features\
move packages\advanced-security packages\features\
move packages\performance-optimization packages\features\
move packages\live-sessions packages\features\
```
**الاختبار:** فحص الميزات
**التقرير:** `features_packages_migration_day92.md`

#### المهمة 9: نقل حزم Integrations
**المطور:** Backend  
**الوقت:** 45 دقيقة  
**الوصف:** نقل التكاملات الخارجية
```bash
move packages\odoo-integration packages\integrations\
move packages\whatsapp-core packages\integrations\
move packages\bigquery-client packages\integrations\
move packages\gtm-engine packages\integrations\
```
**الاختبار:** اختبار الاتصالات الخارجية
**التقرير:** `integrations_packages_migration_day92.md`

### المرحلة 3: إصلاح التبعيات (2 ساعة)

#### المهمة 10: إصلاح api dependencies
**المطور:** Backend  
**الوقت:** 60 دقيقة  
**الوصف:** إضافة التبعيات المفقودة لـ api
```bash
cd apps\api
pnpm add tslib typeorm @nestjs/jwt @nestjs/config @nestjs/swagger
pnpm add bcrypt class-validator cors helmet express-rate-limit
pnpm add @nestjs/websockets socket.io rxjs joi
```
**الاختبار:** `pnpm run build`
**التقرير:** `api_dependencies_fix_day92.log`

#### المهمة 11: إصلاح web-chatbot dependencies
**المطور:** Frontend  
**الوقت:** 30 دقيقة  
**الوصف:** إصلاح خطأ @google/genai
```bash
cd apps\web-chatbot
pnpm add @google/generative-ai
# تحديث vite.config.ts
```
**الاختبار:** `pnpm run build`
**التقرير:** `chatbot_dependencies_fix_day92.log`

#### المهمة 12: تحديث import paths
**المطور:** Backend + Frontend  
**الوقت:** 30 دقيقة  
**الوصف:** تحديث مسارات الاستيراد في جميع الملفات
```bash
# البحث والاستبدال
find . -name "*.ts" -o -name "*.tsx" | xargs sed -i 's/@azizsys\/api-client/@azizsys\/core\/api-client/g'
```
**الاختبار:** فحص الاستيرادات
**التقرير:** `import_paths_update_day92.log`

### المرحلة 4: الاختبار والتحقق (1 ساعة)

#### المهمة 13: اختبار بناء جميع التطبيقات
**المطور:** DevOps  
**الوقت:** 30 دقيقة  
**الوصف:** اختبار البناء لجميع التطبيقات
```bash
cd apps\admin-dashboard && pnpm run build
cd apps\api && pnpm run build
cd apps\web-chatbot && pnpm run build
cd apps\sheets-addon && pnpm run build
cd apps\whatsapp-exec-bot && pnpm run build
cd apps\whatsapp-query-bot && pnpm run build
```
**الاختبار:** معدل نجاح البناء > 80%
**التقرير:** `build_test_results_day92.json`

#### المهمة 14: اختبار تشغيل التطبيقات
**المطور:** DevOps  
**الوقت:** 20 دقيقة  
**الوصف:** اختبار تشغيل التطبيقات الأساسية
```bash
cd apps\admin-dashboard && pnpm run dev &
cd apps\api && pnpm run start:dev &
# فحص http://localhost:3000 و http://localhost:5000
```
**الاختبار:** التطبيقات تعمل بدون أخطاء
**التقرير:** `runtime_test_results_day92.log`

#### المهمة 15: توثيق النتائج النهائية
**المطور:** DevOps  
**الوقت:** 10 دقيقة  
**الوصف:** إنشاء تقرير شامل للنتائج
```markdown
# تقرير اليوم 92
- معدل نجاح البناء: X%
- التطبيقات العاملة: X/6
- الحزم المنظمة: X/74
- المشاكل المتبقية: [قائمة]
```
**الاختبار:** مراجعة التقرير
**التقرير:** `DAY_092_FINAL_REPORT.md`

---

## 🎯 معايير النجاح

### الأهداف الأساسية:
- ✅ تنظيم 74 حزمة في 6 مجلدات فرعية
- ✅ معدل نجاح البناء > 80% (5/6 تطبيقات)
- ✅ إصلاح مشاكل api و web-chatbot

### الأهداف الثانوية:
- ✅ توثيق شامل لجميع التغييرات
- ✅ نسخ احتياطية آمنة
- ✅ اختبارات شاملة

---

## ⚠️ المخاطر والتحديات

### المخاطر العالية:
1. **كسر التبعيات** - احتمال 60%
2. **مشاكل import paths** - احتمال 70%
3. **تعارض الإصدارات** - احتمال 40%

### خطط التعافي:
1. **استخدام النسخ الاحتياطية** فوراً عند أي مشكلة
2. **التراجع التدريجي** مهمة بمهمة
3. **فريق دعم جاهز** للمساعدة

---

## 📊 التقارير المطلوبة

### تقارير المراحل:
1. `packages_analysis_day92.json`
2. `core_packages_migration_day92.md`
3. `api_dependencies_fix_day92.log`
4. `build_test_results_day92.json`

### التقرير النهائي:
- `DAY_092_FINAL_REPORT.md`
- `DAY_092_LESSONS_LEARNED.md`
- `DAY_093_NEXT_STEPS.md`

---

**🚀 بنهاية اليوم 92، سيكون لدينا نظام منظم وقابل للصيانة مع معدل نجاح بناء عالي!**