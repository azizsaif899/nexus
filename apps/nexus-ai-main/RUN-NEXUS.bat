@echo off
chcp 65001 >nul
color 0A

:main
echo.
echo ===============================================
echo         🚀 Nexus AI - Development Server
echo ===============================================
echo.

echo 🧹 تنظيف المنفذ 3000...
npx kill-port 3000 >nul 2>&1

echo 🗂️ تنظيف الكاش...
if exist "node_modules\.vite" rmdir /s /q "node_modules\.vite" >nul 2>&1
if exist "dist" rmdir /s /q "dist" >nul 2>&1

echo.
echo ▶️ تشغيل الخادم على http://localhost:3000
echo 💡 للإيقاف اضغط Ctrl+C
echo ===============================================
echo.

npx vite --port 3000 --host

echo.
echo ⚠️ الخادم توقف!
set /p restart="هل تريد إعادة التشغيل؟ (y/n): "
if /i "%restart%"=="y" goto main
if /i "%restart%"=="yes" goto main

echo.
echo 👋 شكراً لاستخدام Nexus AI
echo.
pause