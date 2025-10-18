@echo off
title Nexus AI - Master Controller
color 0A
cls

:MAIN_MENU
echo ========================================
echo        NEXUS AI - MASTER CONTROLLER
echo ========================================
echo.
echo 1. تشغيل Nexus AI Main (Port 3000)
echo 2. تشغيل جميع التطبيقات
echo 3. تشخيص المشاكل
echo 4. تنظيف النظام
echo 5. خروج
echo.
set /p choice="اختر رقم (1-5): "

if "%choice%"=="1" goto START_MAIN
if "%choice%"=="2" goto START_ALL
if "%choice%"=="3" goto DIAGNOSE
if "%choice%"=="4" goto CLEANUP
if "%choice%"=="5" exit
goto MAIN_MENU

:START_MAIN
cls
echo 🚀 تشغيل Nexus AI Main...
echo.

REM Kill processes on port 3000
for /f "tokens=5" %%a in ('netstat -ano ^| findstr :3000 2^>nul') do taskkill /PID %%a /F >nul 2>&1

REM Navigate and start
cd /d "%~dp0apps\nexus-ai-main"
if not exist "node_modules" (
    echo 📦 تثبيت المكتبات...
    npm install
)

echo ✅ الخادم يعمل على http://localhost:3000
echo اضغط Ctrl+C للتوقف
npm run dev
pause
goto MAIN_MENU

:START_ALL
cls
echo 🚀 تشغيل جميع التطبيقات...
start "Nexus Main" cmd /c "cd /d %~dp0apps\nexus-ai-main && npm run dev"
start "Admin Dashboard" cmd /c "cd /d %~dp0apps\admin-dashboard && npm run dev"
start "Web Chatbot" cmd /c "cd /d %~dp0apps\web-chatbot && npm run dev"
echo ✅ تم تشغيل جميع التطبيقات
pause
goto MAIN_MENU

:DIAGNOSE
cls
echo 🔍 تشخيص النظام...
echo.

REM Check Node.js
node --version >nul 2>&1
if %errorlevel% neq 0 (
    echo ❌ Node.js غير مثبت
) else (
    echo ✅ Node.js متوفر
)

REM Check npm
npm --version >nul 2>&1
if %errorlevel% neq 0 (
    echo ❌ npm غير متوفر
) else (
    echo ✅ npm متوفر
)

REM Check ports
netstat -ano | findstr :3000 >nul 2>&1
if %errorlevel% equ 0 (
    echo ⚠️ المنفذ 3000 مشغول
) else (
    echo ✅ المنفذ 3000 متاح
)

REM Check directories
if exist "apps\nexus-ai-main" (
    echo ✅ مجلد nexus-ai-main موجود
) else (
    echo ❌ مجلد nexus-ai-main مفقود
)

pause
goto MAIN_MENU

:CLEANUP
cls
echo 🧹 تنظيف النظام...

REM Kill all node processes
taskkill /f /im node.exe >nul 2>&1
taskkill /f /im npm.exe >nul 2>&1

REM Clean ports
for /f "tokens=5" %%a in ('netstat -ano ^| findstr :3000 2^>nul') do taskkill /PID %%a /F >nul 2>&1
for /f "tokens=5" %%a in ('netstat -ano ^| findstr :3001 2^>nul') do taskkill /PID %%a /F >nul 2>&1
for /f "tokens=5" %%a in ('netstat -ano ^| findstr :4200 2^>nul') do taskkill /PID %%a /F >nul 2>&1

echo ✅ تم تنظيف النظام
pause
goto MAIN_MENU