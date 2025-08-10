@echo off
chcp 65001 >nul
title G-Assistant NX - نظام الإصلاح الذاتي المحسن
color 0A

echo.
echo ================================================
echo    G-Assistant NX - نظام الإصلاح الذاتي المحسن
echo ================================================
echo.

cd /d "%~dp0"

echo اختر الخيار المناسب:
echo.
echo [1] بدء النظام الكامل (موصى به)
echo [2] لوحة التحكم فقط  
echo [3] دورة إصلاح واحدة
echo [4] مراجعة المشروع
echo [5] اختبار النظام
echo [6] تثبيت كخدمة
echo.

set /p choice="اختر الرقم (1-6): "

if "%choice%"=="1" (
    echo 🚀 بدء النظام الكامل...
    call :start_full_system
) else if "%choice%"=="2" (
    echo 📊 فتح لوحة التحكم...
    call :start_dashboard
) else if "%choice%"=="3" (
    echo 🔧 تشغيل دورة إصلاح واحدة...
    call :run_single_cycle
) else if "%choice%"=="4" (
    echo 🔍 مراجعة المشروع...
    call :review_project
) else if "%choice%"=="5" (
    echo 🧪 اختبار النظام...
    call :test_system
) else if "%choice%"=="6" (
    echo ⚙️ تثبيت كخدمة...
    call :install_service
) else (
    echo ❌ خيار غير صحيح
    pause
    goto :eof
)

echo.
echo ✅ تم الانتهاء
pause
goto :eof

:start_full_system
echo Starting enhanced auto-fix system...
start "Dashboard" cmd /k "npm run dashboard"
timeout /t 3 /nobreak >nul
npm run auto:enhanced
goto :eof

:start_dashboard
npm run dashboard
goto :eof

:run_single_cycle
node docs/6_fixing/auto-fix-system/index.ts --cycle
goto :eof

:review_project
npm run review:project
goto :eof

:test_system
npm run test:system
goto :eof

:install_service
npm run install:service
goto :eof