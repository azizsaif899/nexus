@echo off
chcp 65001 >nul
title AzizSys Ultimate Dashboard - Port 4200

echo ╔══════════════════════════════════════════════════════════════════════════════╗
echo ║                    🎯 AzizSys Ultimate Dashboard v2.0                        ║
echo ║                           تشغيل على البورت 4200                             ║
echo ╚══════════════════════════════════════════════════════════════════════════════╝

set "DASHBOARD_PATH=%~dp0"
set "PROJECT_ROOT=E:\azizsys5\g-assistant-nx"

echo 📍 Dashboard Path: %DASHBOARD_PATH%
echo 📍 Project Root: %PROJECT_ROOT%
echo.

cd /d "%PROJECT_ROOT%"

:: فحص وجود package.json
if not exist "package.json" (
    echo ❌ package.json not found in %PROJECT_ROOT%
    pause
    exit /b 1
)

echo ✅ Project found
echo.

:menu
echo 🎛️ اختر طريقة التشغيل:
echo    1. 🎨 فتح Ultimate Dashboard HTML (فوري)
echo    2. 🚀 تشغيل NX Admin Dashboard (Port 4200)
echo    3. 📊 تشغيل Dashboard Server (Port 3001)
echo    4. 🔄 فحص البورتات المتاحة
echo    5. 🌐 فتح جميع الروابط
echo    0. خروج

set /p choice="اختر الرقم: "

if "%choice%"=="1" (
    echo 🎨 فتح Ultimate Dashboard HTML...
    start "" "%DASHBOARD_PATH%AzizSys_Ultimate_Dashboard.html"
    echo ✅ تم فتح Dashboard!
    goto menu
)

if "%choice%"=="2" (
    echo 🚀 تشغيل NX Admin Dashboard على البورت 4200...
    start "Admin Dashboard" cmd /k "nx serve admin-dashboard --port=4200"
    timeout /t 3 >nul
    echo ✅ Dashboard يعمل على: http://localhost:4200
    start "" "http://localhost:4200"
    goto menu
)

if "%choice%"=="3" (
    echo 📊 تشغيل Dashboard Server...
    if exist "docs\6_fixing\dashboard\server.js" (
        start "Dashboard Server" cmd /k "node docs\6_fixing\dashboard\server.js"
        timeout /t 3 >nul
        echo ✅ Dashboard Server يعمل على: http://localhost:3001
        start "" "http://localhost:3001"
    ) else (
        echo ❌ Dashboard Server غير موجود
    )
    goto menu
)

if "%choice%"=="4" (
    echo 🔄 فحص البورتات...
    netstat -an | findstr :4200 && echo ✅ Port 4200: مستخدم || echo ❌ Port 4200: متاح
    netstat -an | findstr :3001 && echo ✅ Port 3001: مستخدم || echo ❌ Port 3001: متاح
    netstat -an | findstr :3000 && echo ✅ Port 3000: مستخدم || echo ❌ Port 3000: متاح
    netstat -an | findstr :3333 && echo ✅ Port 3333: مستخدم || echo ❌ Port 3333: متاح
    echo.
    pause
    goto menu
)

if "%choice%"=="5" (
    echo 🌐 فتح جميع الروابط المتاحة...
    start "" "http://localhost:4200"
    start "" "http://localhost:3001"
    start "" "http://localhost:3000"
    start "" "http://localhost:3333"
    start "" "%DASHBOARD_PATH%AzizSys_Ultimate_Dashboard.html"
    echo ✅ تم فتح جميع الروابط!
    goto menu
)

if "%choice%"=="0" (
    echo 👋 إلى اللقاء!
    exit /b 0
)

echo ❌ اختيار غير صحيح
goto menu