@echo off
:: N-Chat Management Script for Windows
:: سكريپت إدارة N-Chat لنظام Windows
chcp 65001 >nul
title N-Chat Management System

:MAIN_MENU
cls
echo.
echo ╔═══════════════════════════════════════════════════════════════╗
echo ║                    N-Chat Management System                   ║
echo ║                      نظام إدارة N-Chat                       ║
echo ╠═══════════════════════════════════════════════════════════════╣
echo ║  [1] فحص حالة المنفذ 3003              Check Port 3003        ║
echo ║  [2] إيقاف المنفذ 3003                 Kill Port 3003         ║
echo ║  [3] تنظيف التخزين المؤقت             Clear Cache             ║
echo ║  [4] بدء خادم التطوير                 Start Dev Server        ║
echo ║  [5] بدء خادم الإنتاج                 Start Prod Server       ║
echo ║  [6] تنظيف وبدء                      Clean Start             ║
echo ║  [7] إعادة تشغيل كاملة                Full Restart           ║
echo ║  [8] فحص TypeScript                   Type Check             ║
echo ║  [9] بناء المشروع                     Build Project          ║
echo ║  [0] خروج                            Exit                   ║
echo ╚═══════════════════════════════════════════════════════════════╝
echo.
set /p choice="اختر رقم العملية المطلوبة / Choose operation number: "

if "%choice%"=="1" goto CHECK_PORT
if "%choice%"=="2" goto KILL_PORT
if "%choice%"=="3" goto CLEAR_CACHE
if "%choice%"=="4" goto START_DEV
if "%choice%"=="5" goto START_PROD
if "%choice%"=="6" goto CLEAN_START
if "%choice%"=="7" goto FULL_RESTART
if "%choice%"=="8" goto TYPE_CHECK
if "%choice%"=="9" goto BUILD_PROJECT
if "%choice%"=="0" goto EXIT

echo خيار غير صحيح! / Invalid choice!
pause
goto MAIN_MENU

:CHECK_PORT
echo.
echo 🔍 فحص حالة المنفذ 3003...
cd /d "C:\nexus\apps\n-chat"
call npm run check-port
echo.
pause
goto MAIN_MENU

:KILL_PORT
echo.
echo 🔥 إيقاف المنفذ 3003...
cd /d "C:\nexus\apps\n-chat"
call npm run kill-port
echo.
pause
goto MAIN_MENU

:CLEAR_CACHE
echo.
echo 🧹 تنظيف ملفات التخزين المؤقت...
cd /d "C:\nexus\apps\n-chat"
call npm run clear-cache
echo.
pause
goto MAIN_MENU

:START_DEV
echo.
echo 🚀 بدء خادم التطوير...
echo للإيقاف اضغط Ctrl+C
cd /d "C:\nexus\apps\n-chat"
call npm run dev
echo.
pause
goto MAIN_MENU

:START_PROD
echo.
echo 🌟 بدء خادم الإنتاج...
cd /d "C:\nexus\apps\n-chat"
call npm run start
echo.
pause
goto MAIN_MENU

:CLEAN_START
echo.
echo 🧹 تنظيف وبدء...
cd /d "C:\nexus\apps\n-chat"
call npm run clean-start
echo.
pause
goto MAIN_MENU

:FULL_RESTART
echo.
echo 🔄 إعادة تشغيل كاملة...
cd /d "C:\nexus\apps\n-chat"
call npm run full-restart
echo.
pause
goto MAIN_MENU

:TYPE_CHECK
echo.
echo 🔍 فحص TypeScript...
cd /d "C:\nexus\apps\n-chat"
call npm run type-check
echo.
pause
goto MAIN_MENU

:BUILD_PROJECT
echo.
echo 🔨 بناء المشروع...
cd /d "C:\nexus\apps\n-chat"
call npm run build
echo.
pause
goto MAIN_MENU

:EXIT
echo.
echo شكراً لاستخدام نظام إدارة N-Chat
echo Thank you for using N-Chat Management System
echo.
exit /b 0