@echo off
chcp 65001 >nul
echo.
echo ========================================
echo 🔧 تحضير مشروع G-Assistant للنشر
echo ========================================
echo.

:: تنظيف المجلدات القديمة
echo 🧹 تنظيف المجلدات القديمة...
if exist "dist" rmdir /s /q "dist"
if exist "gas_ready" rmdir /s /q "gas_ready"

:: إنشاء مجلد dist
mkdir dist

:: إنشاء ملف manifest محدث
echo 📋 إنشاء manifest محدث...
echo { > dist\project_manifest.json
echo   "name": "G-Assistant (AzizSys)", >> dist\project_manifest.json
echo   "version": "6.3.0", >> dist\project_manifest.json
echo   "description": "نظام إدارة ذكي متكامل مدعوم بالذكاء الصناعي", >> dist\project_manifest.json
echo   "deployment_date": "%date% %time%", >> dist\project_manifest.json
echo   "modules": { >> dist\project_manifest.json
echo     "core": ["00_utils", "01_config"], >> dist\project_manifest.json
echo     "ui": ["10_ui"], >> dist\project_manifest.json
echo     "ai": ["20_ai", "25_ai_agents"], >> dist\project_manifest.json
echo     "tools": ["30_tools"], >> dist\project_manifest.json
echo     "accounting": ["35_accounting"], >> dist\project_manifest.json
echo     "memory": ["40_memory"], >> dist\project_manifest.json
echo     "security": ["40_security"], >> dist\project_manifest.json
echo     "analytics": ["50_analytics"], >> dist\project_manifest.json
echo     "operations": ["55_operations"], >> dist\project_manifest.json
echo     "telemetry": ["70_telemetry", "75_metrics"], >> dist\project_manifest.json
echo     "api": ["80_api"], >> dist\project_manifest.json
echo     "tests": ["85_tests"], >> dist\project_manifest.json
echo     "system": ["90_System"] >> dist\project_manifest.json
echo   }, >> dist\project_manifest.json
echo   "documentation": ["updated_docs", "doc"], >> dist\project_manifest.json
echo   "configuration": ["config"], >> dist\project_manifest.json
echo   "scripts": ["scripts"], >> dist\project_manifest.json
echo   "tests": ["tests"] >> dist\project_manifest.json
echo } >> dist\project_manifest.json

:: إنشاء ملف README للنشر
echo 📖 إنشاء README للنشر...
echo # G-Assistant (AzizSys) - نظام إدارة ذكي متكامل > dist\DEPLOYMENT_README.md
echo. >> dist\DEPLOYMENT_README.md
echo ## 🚀 معلومات النشر >> dist\DEPLOYMENT_README.md
echo. >> dist\DEPLOYMENT_README.md
echo **تاريخ النشر**: %date% %time% >> dist\DEPLOYMENT_README.md
echo **الإصدار**: 6.3.0 >> dist\DEPLOYMENT_README.md
echo **البيئة**: Google Apps Script >> dist\DEPLOYMENT_README.md
echo. >> dist\DEPLOYMENT_README.md
echo ## 📁 محتويات المشروع >> dist\DEPLOYMENT_README.md
echo. >> dist\DEPLOYMENT_README.md
echo ### الوحدات الأساسية >> dist\DEPLOYMENT_README.md
echo - `00_utils/` - الأدوات المساعدة الأساسية >> dist\DEPLOYMENT_README.md
echo - `01_config/` - إعدادات النظام >> dist\DEPLOYMENT_README.md
echo - `10_ui/` - واجهة المستخدم >> dist\DEPLOYMENT_README.md
echo - `20_ai/` - نواة الذكاء الصناعي >> dist\DEPLOYMENT_README.md
echo - `25_ai_agents/` - الوكلاء الأذكياء >> dist\DEPLOYMENT_README.md
echo - `30_tools/` - الأدوات المتخصصة >> dist\DEPLOYMENT_README.md
echo. >> dist\DEPLOYMENT_README.md
echo ### الوحدات المتخصصة >> dist\DEPLOYMENT_README.md
echo - `35_accounting/` - النظام المحاسبي >> dist\DEPLOYMENT_README.md
echo - `40_memory/` - إدارة الذاكرة >> dist\DEPLOYMENT_README.md
echo - `40_security/` - الأمان >> dist\DEPLOYMENT_README.md
echo - `50_analytics/` - التحليلات >> dist\DEPLOYMENT_README.md
echo - `55_operations/` - العمليات >> dist\DEPLOYMENT_README.md
echo - `70_telemetry/` - القياسات >> dist\DEPLOYMENT_README.md
echo - `75_metrics/` - المقاييس >> dist\DEPLOYMENT_README.md
echo - `80_api/` - واجهات برمجة التطبيقات >> dist\DEPLOYMENT_README.md
echo - `85_tests/` - الاختبارات >> dist\DEPLOYMENT_README.md
echo - `90_System/` - النظام >> dist\DEPLOYMENT_README.md
echo. >> dist\DEPLOYMENT_README.md
echo ### التوثيق والإعدادات >> dist\DEPLOYMENT_README.md
echo - `updated_docs/` - التوثيق المحدث >> dist\DEPLOYMENT_README.md
echo - `doc/` - التوثيق الفني >> dist\DEPLOYMENT_README.md
echo - `config/` - ملفات التكوين >> dist\DEPLOYMENT_README.md
echo - `scripts/` - سكريبتات النشر >> dist\DEPLOYMENT_README.md
echo - `tests/` - مجموعة الاختبارات >> dist\DEPLOYMENT_README.md
echo. >> dist\DEPLOYMENT_README.md
echo ## 🔧 تعليمات ما بعد النشر >> dist\DEPLOYMENT_README.md
echo. >> dist\DEPLOYMENT_README.md
echo 1. تشغيل `initializeSystem()` في Google Apps Script >> dist\DEPLOYMENT_README.md
echo 2. التحقق من حالة الوحدات باستخدام `reportModulesStatus()` >> dist\DEPLOYMENT_README.md
echo 3. تشغيل الاختبارات الأساسية >> dist\DEPLOYMENT_README.md
echo 4. تكوين المتغيرات البيئية >> dist\DEPLOYMENT_README.md
echo 5. اختبار الواجهات >> dist\DEPLOYMENT_README.md

:: إنشاء سكريبت التحقق من النشر
echo 🔍 إنشاء سكريپت التحقق...
echo // سكريپت التحقق من نجاح النشر > dist\deployment_verification.gs
echo function verifyDeployment() { >> dist\deployment_verification.gs
echo   try { >> dist\deployment_verification.gs
echo     console.log('🔍 بدء التحقق من النشر...'); >> dist\deployment_verification.gs
echo     >> dist\deployment_verification.gs
echo     // التحقق من الوحدات الأساسية >> dist\deployment_verification.gs
echo     const coreModules = ['System.Utils', 'System.Config', 'System.UI']; >> dist\deployment_verification.gs
echo     let allModulesReady = true; >> dist\deployment_verification.gs
echo     >> dist\deployment_verification.gs
echo     coreModules.forEach(module =^> { >> dist\deployment_verification.gs
echo       if (typeof window[module] === 'undefined') { >> dist\deployment_verification.gs
echo         console.error(`❌ الوحدة غير موجودة: ${module}`); >> dist\deployment_verification.gs
echo         allModulesReady = false; >> dist\deployment_verification.gs
echo       } else { >> dist\deployment_verification.gs
echo         console.log(`✅ الوحدة جاهزة: ${module}`); >> dist\deployment_verification.gs
echo       } >> dist\deployment_verification.gs
echo     }); >> dist\deployment_verification.gs
echo     >> dist\deployment_verification.gs
echo     if (allModulesReady) { >> dist\deployment_verification.gs
echo       console.log('✅ تم النشر بنجاح - جميع الوحدات جاهزة'); >> dist\deployment_verification.gs
echo       return true; >> dist\deployment_verification.gs
echo     } else { >> dist\deployment_verification.gs
echo       console.error('❌ فشل النشر - بعض الوحدات غير جاهزة'); >> dist\deployment_verification.gs
echo       return false; >> dist\deployment_verification.gs
echo     } >> dist\deployment_verification.gs
echo   } catch (error) { >> dist\deployment_verification.gs
echo     console.error('❌ خطأ في التحقق من النشر:', error); >> dist\deployment_verification.gs
echo     return false; >> dist\deployment_verification.gs
echo   } >> dist\deployment_verification.gs
echo } >> dist\deployment_verification.gs

echo.
echo ✅ تم تحضير المشروع للنشر بنجاح!
echo.
echo 📊 الملفات المحضرة:
echo - project_manifest.json ✓
echo - DEPLOYMENT_README.md ✓  
echo - deployment_verification.gs ✓
echo.
echo 🚀 يمكنك الآن تشغيل: deploy_complete_project.bat
echo.

pause