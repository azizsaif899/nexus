@echo off
chcp 65001 >nul
title Deep Scan - نظام الفحص والإصلاح الشامل

echo.
echo ╔══════════════════════════════════════════════════════════════╗
echo ║                    🔍 Deep Scan v1.0                        ║
echo ║              نظام الفحص والإصلاح الشامل                    ║
echo ╚══════════════════════════════════════════════════════════════╝
echo.

cd /d "E:\azizsys5\g-assistant-nx"

:MENU
echo.
echo 🎯 اختر العملية المطلوبة:
echo.
echo [1] 🔍 فحص شامل (Scan Only)
echo [2] 🔧 فحص وإصلاح تلقائي (Scan + Auto Fix)
echo [3] 🏥 فحص صحة المشروع (Health Check)
echo [4] ⚡ إصلاح سريع لملف واحد (Quick Fix)
echo [5] 🛡️ فحص أمني فقط (Security Scan)
echo [6] 📊 تقرير مفصل (Detailed Report)
echo [7] ❓ مساعدة (Help)
echo [0] 🚪 خروج (Exit)
echo.

set /p choice="اختر رقم العملية: "

if "%choice%"=="1" goto SCAN_ONLY
if "%choice%"=="2" goto SCAN_AND_FIX
if "%choice%"=="3" goto HEALTH_CHECK
if "%choice%"=="4" goto QUICK_FIX
if "%choice%"=="5" goto SECURITY_SCAN
if "%choice%"=="6" goto DETAILED_REPORT
if "%choice%"=="7" goto HELP
if "%choice%"=="0" goto EXIT

echo ❌ اختيار غير صحيح!
goto MENU

:SCAN_ONLY
echo.
echo 🔍 بدء الفحص الشامل...
echo.
node -r ts-node/register packages/tooling/auto-fix-system/deep-scan-cli.ts scan --verbose
echo.
echo ✅ تم الانتهاء من الفحص!
pause
goto MENU

:SCAN_AND_FIX
echo.
echo 🔧 بدء الفحص والإصلاح التلقائي...
echo ⚠️ سيتم إنشاء نسخ احتياطية تلقائياً
echo.
node -r ts-node/register packages/tooling/auto-fix-system/deep-scan-cli.ts fix
echo.
echo ✅ تم الانتهاء من الإصلاح!
pause
goto MENU

:HEALTH_CHECK
echo.
echo 🏥 فحص صحة المشروع...
echo.
node -r ts-node/register packages/tooling/auto-fix-system/deep-scan-cli.ts health
echo.
pause
goto MENU

:QUICK_FIX
echo.
set /p filepath="📁 أدخل مسار الملف للإصلاح السريع: "
if "%filepath%"=="" (
    echo ❌ لم يتم تحديد مسار الملف!
    pause
    goto MENU
)
echo.
echo ⚡ إصلاح سريع للملف: %filepath%
echo.
node -r ts-node/register packages/tooling/auto-fix-system/deep-scan-cli.ts quick-fix "%filepath%"
echo.
pause
goto MENU

:SECURITY_SCAN
echo.
echo 🛡️ فحص أمني شامل...
echo.
node -r ts-node/register packages/tooling/auto-fix-system/deep-scan-cli.ts scan --scan-types security --severity critical,high --verbose
echo.
echo ✅ تم الانتهاء من الفحص الأمني!
pause
goto MENU

:DETAILED_REPORT
echo.
echo 📊 إنشاء تقرير مفصل...
echo.
set timestamp=%date:~-4,4%%date:~-10,2%%date:~-7,2%_%time:~0,2%%time:~3,2%%time:~6,2%
set timestamp=%timestamp: =0%
set reportfile=docs\6_fixing\reports\deep-scan-report-%timestamp%.json

node -r ts-node/register packages/tooling/auto-fix-system/deep-scan-cli.ts scan --output "%reportfile%" --verbose

echo.
echo 📄 تم حفظ التقرير في: %reportfile%
echo.
pause
goto MENU

:HELP
echo.
echo ❓ مساعدة Deep Scan:
echo.
echo 🔍 الفحص الشامل:
echo    - يفحص جميع ملفات المشروع
echo    - يكتشف المشاكل الأمنية والتقنية
echo    - يعرض تقريراً مفصلاً
echo.
echo 🔧 الإصلاح التلقائي:
echo    - يصلح المشاكل القابلة للإصلاح
echo    - ينشئ نسخ احتياطية تلقائياً
echo    - يوثق جميع التغييرات
echo.
echo 🏥 فحص الصحة:
echo    - يعطي نقاط صحة للمشروع
echo    - يحدد المشاكل الحرجة
echo    - يقترح التحسينات
echo.
echo ⚡ الإصلاح السريع:
echo    - يصلح ملف واحد فقط
echo    - سريع ومباشر
echo    - مناسب للإصلاحات الطارئة
echo.
pause
goto MENU

:EXIT
echo.
echo 👋 شكراً لاستخدام Deep Scan!
echo.
exit /b 0