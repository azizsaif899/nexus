# 🩺 G-Assistant System Doctor v4.0 - دليل الاستخدام الشامل

## الاستخدام السريع

### 🔧 إصلاح شامل ونشر
```batch
.\fix_and_deploy.bat
```

### 📊 تحليل فقط
```batch
npm run doctor
```

### 🛠️ إصلاح تلقائي
```batch
npm run fix
```

### 📄 تقرير مفصل
```batch
npm run analyze
```

## جميع الأوامر المتاحة

### أوامر الإصلاح
```batch
npm run comprehensive-fix    # إصلاح شامل مع تقرير
npm run emergency-repair     # إصلاح طارئ
npm run auto-repair         # إصلاح تلقائي
```

### أوامر الاختبار
```batch
npm run run-tests           # اختبارات شاملة
npm run validate-deploy     # فحص جاهزية النشر
```

## الاستخدام المتقدم

### من سطر الأوامر
```bash
# تحليل أساسي
node system_doctor_final.cjs

# تحليل عميق مع إصلاح
node system_doctor_final.cjs --fix --deep

# تحليل شامل مع تقرير وفحص الملفات
node system_doctor_final.cjs --fix --deep --report --files
```

### في Google Apps Script

#### وظائف أساسية
```javascript
// فحص أساسي
testSystem()

// إصلاح تلقائي
fixSystem()

// تحليل شامل
fullAnalysis()
```

#### جميع وظائف الإصلاح (متضمنة في System Doctor)
```javascript
// COMPREHENSIVE_PROJECT_FIXER.cjs معادل
comprehensiveProjectFixer()

// COMPREHENSIVE_TESTS.js معادل
comprehensiveTests()

// AUTO_REPAIR_SYSTEM.js معادل
autoRepairSystem()

// DEPLOYMENT_VALIDATOR.js معادل
deploymentValidator()

// EMERGENCY_REPAIR.js معادل
emergencyRepairSystem()

// run_all_fixes.bat معادل
runAllFixes()
```

#### وظائف مساعدة
```javascript
// إصلاح سريع
quickFix()

// فحص صحة شامل
healthCheck()

// حالة النظام
systemStatus()

// توليد خطة إصلاح
generateRepairPlan()
```

## المخرجات

- **analysis-report.json**: تقرير تحليل شامل بصيغة JSON
- **REPAIR_PLAN.md**: خطة إصلاح مفصلة باللغة العربية

## الميزات الشاملة (جميع الملفات في ملف واحد!)

### ✅ متضمن في System Doctor:
1. **COMPREHENSIVE_PROJECT_FIXER** - إصلاح شامل محلي
2. **COMPREHENSIVE_TESTS** - اختبارات شاملة
3. **AUTO_REPAIR_SYSTEM** - نظام إصلاح تلقائي
4. **DEPLOYMENT_VALIDATOR** - فحص جاهزية النشر
5. **EMERGENCY_REPAIR** - إصلاح طارئ لـ Apps Script
6. **run_all_fixes.bat** - تشغيل جميع الإصلاحات

### ميزات إضافية:
- **تحليل شامل للمشروع**: فحص جميع الملفات والوحدات
- **إصلاح تلقائي**: إصلاح المشاكل تلقائياً
- **تقارير مفصلة**: JSON و Markdown
- **فحص بنية الملفات**: تحليل بنية المشروع
- **خطة إصلاح عربية**: اقتراحات مفصلة
- **واجهة CLI متقدمة**: أوامر متعددة

## حل المشاكل الشائعة

### مشكلة _moduleExports undefined
```javascript
// يتم إصلاحها تلقائياً بـ --fix
node system_doctor_final.cjs --fix
```

### مشاكل المصانع المعطلة
```javascript
// فحص وإصلاح المصانع
fixSystem()
```

### مشاكل التهيئة
```javascript
// إصلاح طارئ في Apps Script
emergencyRepair()
```

### التحليل المتقدم والتقارير
```javascript
// تحليل شامل مع تقرير عربي
masterAnalysis()

// تحليل إعادة الهيكلة فقط
analyzeCodeRefactoring()

// تحليل معماري فقط
analyzeArchitecture()

// إنشاء خطة تنفيذ مرحلية
createImplementationPlan()
```