@echo off
chcp 65001 >nul
title 🎯 AzizSys Unified Control Center
color 0B

:MENU
cls
echo.
echo ╔══════════════════════════════════════════════════════════════╗
echo ║                🎯 AzizSys Unified Control Center             ║
echo ║                      مركز التحكم الموحد                      ║
echo ╚══════════════════════════════════════════════════════════════╝
echo.
echo اختر العملية المطلوبة:
echo.
echo [1] 🚀 Start Development Environment
echo [2] 📊 Open Comprehensive Dashboard  
echo [3] 🔧 Run System Maintenance
echo [4] 📋 Generate Current Report
echo [5] 🧹 Quick System Cleanup
echo [6] ❌ Exit
echo.
set /p choice="أدخل اختيارك (1-6): "

if "%choice%"=="1" goto START_DEV
if "%choice%"=="2" goto OPEN_DASHBOARD
if "%choice%"=="3" goto RUN_MAINTENANCE
if "%choice%"=="4" goto GENERATE_REPORT
if "%choice%"=="5" goto CLEANUP
if "%choice%"=="6" goto EXIT
goto MENU

:START_DEV
cls
echo.
echo 🚀 بدء بيئة التطوير...
cd /d "%~dp0\..\..\.."
echo 📦 تحقق من التبعيات...
if not exist "node_modules" pnpm install
echo 🔧 تشغيل النظام...
start "API Server" cmd /k "pnpm nx serve api"
timeout /t 2 >nul
start "Admin Dashboard" cmd /k "pnpm nx serve admin-dashboard"
timeout /t 2 >nul
start "Web Chatbot" cmd /k "pnpm nx serve web-chatbot"
echo ✅ تم تشغيل بيئة التطوير!
pause
goto MENU

:OPEN_DASHBOARD
cls
echo.
echo 📊 فتح لوحة التحكم الشاملة...
cd /d "%~dp0\..\dashboard"
start "Dashboard Server" cmd /k "node server.js"
timeout /t 3 >nul
start http://localhost:3000
echo ✅ تم فتح لوحة التحكم!
pause
goto MENU

:RUN_MAINTENANCE
cls
echo.
echo 🔧 تشغيل صيانة النظام...
cd /d "%~dp0\..\scripts"
call cleanup-old-scripts.bat
echo ✅ تمت الصيانة!
pause
goto MENU

:GENERATE_REPORT
cls
echo.
echo 📋 إنشاء تقرير حالي...
cd /d "%~dp0\..\scripts"
node enhanced-reporter.js
echo ✅ تم إنشاء التقرير!
pause
goto MENU

:CLEANUP
cls
echo.
echo 🧹 تنظيف سريع للنظام...
cd /d "%~dp0\..\..\.."
echo 🗑️ حذف ملفات مؤقتة...
if exist "*.log" del *.log
if exist "temp\" rmdir /s /q temp
echo ✅ تم التنظيف!
pause
goto MENU

:EXIT
echo.
echo 👋 شكراً لاستخدام مركز التحكم الموحد!
timeout /t 2 >nul
exit