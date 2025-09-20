# 📅 إعادة تنظيم الملفات - اليوم 1

**التاريخ:** 2025-01-08  
**الهدف:** إنشاء الهيكل الجديد وتحليل التبعيات  
**المهام:** 15 مهمة منظمة  

---

## 🎯 مهام اليوم الأول (15 مهمة)

### 📁 المجموعة الأولى: إنشاء الهيكل الجديد (5 مهام)

#### 1. إنشاء مجلد config/
- **الوصف:** إنشاء مجلد config مع المجلدات الفرعية
- **المجلدات:** firebase/, security/, build/, deployment/
- **الهدف:** تجميع جميع الإعدادات في مكان واحد

#### 2. إنشاء مجلد docs/
- **الوصف:** إنشاء مجلد docs مع التصنيفات
- **المجلدات:** setup/, guides/, deployment/, troubleshooting/
- **الهدف:** تنظيم جميع الوثائق بشكل منطقي

#### 3. إنشاء مجلد scripts/
- **الوصف:** إنشاء مجلد scripts للسكريبتات
- **المجلدات:** build/, test/, deploy/, maintenance/
- **الهدف:** تجميع جميع السكريبتات التشغيلية

#### 4. إنشاء مجلد tests/
- **الوصف:** إنشاء مجلد tests منظم
- **المجلدات:** unit/, integration/, e2e/, reports/
- **الهدف:** تنظيم جميع الاختبارات والتقارير

#### 5. إنشاء مجلد tools/
- **الوصف:** إنشاء مجلد tools للأدوات
- **المجلدات:** monitoring/, infrastructure/, utilities/
- **الهدف:** تجميع أدوات التطوير والمراقبة

### 🔍 المجموعة الثانية: تحليل التبعيات (5 مهام)

#### 6. فحص firebase.json
- **الوصف:** تحليل المسارات المرجعية في firebase.json
- **التحقق:** hosting, functions, firestore, emulators
- **الهدف:** فهم التبعيات قبل النقل

#### 7. فحص package.json
- **الوصف:** تحليل scripts والمسارات في package.json
- **التحقق:** build scripts, test scripts, paths
- **الهدف:** تحديد ما يحتاج تحديث بعد النقل

#### 8. فحص nx.json
- **الوصف:** فهم إعدادات nx والمسارات
- **التحقق:** projects, targets, namedInputs
- **الهدف:** ضمان عدم كسر nx configuration

#### 9. فحص tsconfig files
- **الوصف:** تحليل مسارات TypeScript
- **التحقق:** paths, references, extends
- **الهدف:** فهم تبعيات TypeScript

#### 10. فحص docker configs
- **الوصف:** فهم إعدادات Docker والمسارات
- **التحقق:** Dockerfile, docker-compose, volumes
- **الهدف:** ضمان عمل Docker بعد النقل

### 📋 المجموعة الثالثة: تحديد الملفات المكررة (5 مهام)

#### 11. تحليل service-account files
- **الوصف:** تحديد النسخة الصحيحة من service-account
- **الملفات:** service-account-key.json, .backup
- **الهدف:** الاحتفاظ بالنسخة الصحيحة فقط

#### 12. تحليل .env files
- **الوصف:** دمج وتنظيم ملفات البيئة
- **الملفات:** .env, .env.backup, .env.example, .env.production
- **الهدف:** توحيد إعدادات البيئة

#### 13. تحليل tsconfig files
- **الوصف:** توحيد إعدادات TypeScript
- **الملفات:** tsconfig.json, tsconfig-root.json, tsconfig.base.json
- **الهدف:** تبسيط إعدادات TypeScript

#### 14. تحليل test files
- **الوصف:** تجميع ملفات الاختبار المبعثرة
- **الملفات:** test-*.json, *-test.json, comprehensive-test.json
- **الهدف:** تنظيم جميع ملفات الاختبار

#### 15. إنشاء قائمة الملفات للحذف
- **الوصف:** تحديد الملفات المكررة والمؤقتة للحذف
- **الملفات:** backups, duplicates, temp files
- **الهدف:** تنظيف المشروع من الملفات غير الضرورية

---

## 📊 مخرجات اليوم الأول

### ✅ الهيكل الجديد المُنشأ
```
g-assistant-nx/
├── config/
│   ├── firebase/
│   ├── security/
│   ├── build/
│   └── deployment/
├── docs/
│   ├── setup/
│   ├── guides/
│   ├── deployment/
│   └── troubleshooting/
├── scripts/
│   ├── build/
│   ├── test/
│   ├── deploy/
│   └── maintenance/
├── tests/
│   ├── unit/
│   ├── integration/
│   ├── e2e/
│   └── reports/
└── tools/
    ├── monitoring/
    ├── infrastructure/
    └── utilities/
```

### 📋 تقارير التحليل
- **dependency-analysis.json** - تحليل التبعيات
- **duplicate-files.json** - قائمة الملفات المكررة
- **migration-plan.json** - خطة النقل التفصيلية

---

## 🔄 الاستعداد لليوم الثاني

### المهام المجدولة لليوم 2:
1. نقل إعدادات Firebase
2. نقل ملفات الأمان
3. تحديث المسارات في الإعدادات
4. اختبار الوظائف بعد النقل

### نقاط التحقق:
- ✅ الهيكل الجديد مُنشأ
- ✅ التبعيات محللة
- ✅ الملفات المكررة محددة
- ✅ خطة النقل جاهزة