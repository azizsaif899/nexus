# 🧹 خطة تنظيف مجلد السكريبتات

## 📊 الوضع الحالي
- **إجمالي الملفات**: ~200+ ملف
- **ملفات backup**: ~100+ ملف
- **مجلدات فرعية**: 4 مجلدات
- **ملفات مكررة**: عديدة

## 🎯 الهيكل المقترح

```
scripts/
├── 📁 core/                    # السكريبتات الأساسية
│   ├── auto-system-manager.js
│   ├── enhanced-reporter.js
│   ├── health-check-v2.js
│   └── monitor-dashboard.js
├── 📁 automation/              # سكريبتات الأتمتة
│   ├── amazon-q-auto.js
│   ├── gemini-auto.js
│   ├── nx_auto_fix.js
│   └── auto-fix-v2.js
├── 📁 nx-tools/               # أدوات NX
│   ├── nx_detailed_analyzer.js
│   ├── nx_project_monitor.js
│   ├── nx_task_orchestrator.js
│   └── smart-build.js
├── 📁 integrations/           # التكاملات
│   ├── setup-bigquery.js
│   ├── CREATE_GEMINI_BACKEND.js
│   ├── FIX_MISSING_ENDPOINTS.js
│   └── run-compliance-agent.js
├── 📁 utilities/              # الأدوات المساعدة
│   ├── docs_data.js
│   ├── generate_docs_data.js
│   ├── auto_update_docs.js
│   ├── notifications.js
│   ├── update_sprint_status.js
│   └── watch_mode.js
├── 📁 batch-scripts/          # ملفات BAT
│   ├── AUTO_REPAIR_WORKSHOP.bat
│   ├── AUTO_SYSTEM_LAUNCHER.bat
│   ├── daily-startup.bat
│   ├── FIREBASE_3DAY_PLAN.bat
│   ├── FIX_NX_CLOUD_FIREBASE.bat
│   ├── QUICK_FIX_BUILD_ERRORS.bat
│   ├── RUN_SCRIPTS_FROM_DASHBOARD.bat
│   ├── START_ALL_SERVICES.bat
│   └── cleanup-old-scripts.bat
├── 📁 typescript/             # ملفات TypeScript
│   └── run_cody_review.ts
├── 📁 archive/                # الأرشيف (موجود)
├── 📁 backups/                # النسخ الاحتياطية المنظمة
│   ├── 2025-01-08/
│   └── auto-generated/
└── 📁 temp/                   # الملفات المؤقتة
```

## 🗑️ ملفات للحذف
- جميع ملفات `.backup` (نقلها للأرشيف)
- الملفات المكررة
- مجلد "ديب سيك" (نقل المفيد منه)
- مجلد "al-dhabit" (دمجه مع core)

## ✅ خطوات التنفيذ
1. إنشاء الهيكل الجديد
2. نقل الملفات حسب التصنيف
3. حذف الملفات المكررة
4. تنظيف النسخ الاحتياطية
5. تحديث المراجع في الملفات

## 📋 ملاحظات
- الاحتفاظ بنسخة احتياطية كاملة قبل التنظيف
- فحص التبعيات بين الملفات
- تحديث التوثيق بعد التنظيف