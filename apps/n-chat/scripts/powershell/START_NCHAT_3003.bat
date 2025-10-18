@echo off
title N-Chat System Manager - Port 3003
color 0A
chcp 65001 > nul

echo.
echo ========================================
echo    🚀 N-Chat System Manager
echo    Port: 3003 - Next.js 15.5.4 + React 19
echo    مدير نظام N-Chat الشامل
echo ========================================
echo.

echo 📋 Choose Action / اختر العملية:
echo.
echo    [1] Quick Start     - تشغيل سريع
echo    [2] Check Port      - فحص المنفذ
echo    [3] Kill Port       - إيقاف المنفذ  
echo    [4] Clear Cache     - تنظيف الكاش
echo    [5] Type Check      - فحص TypeScript
echo    [6] Build Project   - بناء المشروع
echo    [7] Clean Start     - تشغيل نظيف
echo    [8] Full Restart    - إعادة تشغيل كاملة
echo    [9] Production      - تشغيل الإنتاج
echo    [0] Exit            - خروج
echo.

set /p choice="Enter choice (1-9, 0): "

if "%choice%"=="1" goto quick_start
if "%choice%"=="2" goto check_port
if "%choice%"=="3" goto kill_port
if "%choice%"=="4" goto clear_cache
if "%choice%"=="5" goto type_check
if "%choice%"=="6" goto build
if "%choice%"=="7" goto clean_start
if "%choice%"=="8" goto full_restart
if "%choice%"=="9" goto start_prod
if "%choice%"=="0" goto exit
goto invalid

:quick_start
echo.
echo ⚡ Quick Start - التشغيل السريع
echo.
echo 🔥 Killing existing processes...
node scripts/kill-port.js
echo.
echo 🧹 Clearing cache...
node scripts/clear-cache.js
echo.
echo ⏳ Starting in 2 seconds...
timeout /t 2 /nobreak > nul
echo.
echo 🚀 Starting N-Chat System...
echo 📱 Available at: http://localhost:3003
echo 🛑 Press Ctrl+C to stop
echo.
node scripts/start-dev.js
goto end

:check_port
echo.
echo 🔍 Checking port 3003...
node scripts/check-port.js
goto menu

:kill_port
echo.
echo 🔥 Killing processes on port 3003...
node scripts/kill-port.js
goto menu

:clear_cache
echo.
echo 🧹 Clearing cache and temp files...
node scripts/clear-cache.js
goto menu

:type_check
echo.
echo 📝 TypeScript check...
npm run type-check
goto menu

:build
echo.
echo 🏗️ Building project...
npm run build
goto menu

:clean_start
echo.
echo 🧹 Clean start with cache clearing...
node scripts/clean-start.js
goto end

:full_restart
echo.
echo 🔄 Full restart with reinstall...
node scripts/full-restart.js
goto end

:start_prod
echo.
echo 🏭 Starting production server...
echo 📱 Available at: http://localhost:3003
node scripts/start-prod.js
goto end

:invalid
echo.
echo ❌ Invalid choice! / اختيار غير صحيح!
timeout /t 2 > nul
goto start

:menu
echo.
echo 🔄 Press any key to return to menu...
pause > nul
goto start

:exit
echo.
echo 👋 Goodbye! / وداعاً!
exit /b 0

:end
echo.
echo 🏁 Operation completed / انتهت العملية
pause

:start
cls
goto :eof