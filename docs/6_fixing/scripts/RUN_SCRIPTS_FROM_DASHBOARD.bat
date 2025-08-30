@echo off
chcp 65001 >nul
title تشغيل السكربتات من Dashboard

echo ╔══════════════════════════════════════════════════════════════════════════════╗
echo ║                    🔧 تشغيل السكربتات من Dashboard                          ║
echo ╚══════════════════════════════════════════════════════════════════════════════╝

set "SCRIPTS_PATH=%~dp0"
set "PROJECT_ROOT=E:\azizsys5\g-assistant-nx"

cd /d "%PROJECT_ROOT%"

:menu
echo.
echo 🎛️ اختر السكربت للتشغيل:
echo    1. 🔧 Auto Fix v2 - نظام الإصلاح التلقائي
echo    2. 🏥 Health Check v2 - فحص صحة النظام
echo    3. 🛡️ Compliance Agent - وكيل الرقيب
echo    4. 📊 Setup BigQuery - إعداد تحليلات البيانات
echo    5. 🧹 Cleanup Scripts - تنظيف السكربتات القديمة
echo    6. 🚀 تشغيل جميع السكربتات
echo    0. خروج

set /p choice="اختر الرقم: "

if "%choice%"=="1" (
    echo 🔧 تشغيل Auto Fix v2...
    node "%SCRIPTS_PATH%auto-fix-v2.js"
    pause
    goto menu
)

if "%choice%"=="2" (
    echo 🏥 تشغيل Health Check v2...
    node "%SCRIPTS_PATH%health-check-v2.js"
    pause
    goto menu
)

if "%choice%"=="3" (
    echo 🛡️ تشغيل Compliance Agent...
    node "%SCRIPTS_PATH%run-compliance-agent.js"
    pause
    goto menu
)

if "%choice%"=="4" (
    echo 📊 تشغيل Setup BigQuery...
    node "%SCRIPTS_PATH%setup-bigquery.js"
    pause
    goto menu
)

if "%choice%"=="5" (
    echo 🧹 تشغيل تنظيف السكربتات...
    call "%SCRIPTS_PATH%cleanup-old-scripts.bat"
    goto menu
)

if "%choice%"=="6" (
    echo 🚀 تشغيل جميع السكربتات...
    echo.
    echo 🔧 Auto Fix v2...
    node "%SCRIPTS_PATH%auto-fix-v2.js"
    echo.
    echo 🏥 Health Check v2...
    node "%SCRIPTS_PATH%health-check-v2.js"
    echo.
    echo 🛡️ Compliance Agent...
    node "%SCRIPTS_PATH%run-compliance-agent.js"
    echo.
    echo ✅ تم تشغيل جميع السكربتات!
    pause
    goto menu
)

if "%choice%"=="0" (
    echo 👋 إلى اللقاء!
    exit /b 0
)

echo ❌ اختيار غير صحيح
goto menu