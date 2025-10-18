@echo off
chcp 65001 >nul
color 0A

echo.
echo ===============================================
echo         🚀 Nexus AI - Quick Start
echo ===============================================
echo.

echo 🧹 تنظيف المنفذ 3000...
npx kill-port 3000 >nul 2>&1

echo 🗂️ تنظيف الكاش...
if exist "node_modules\.vite" rmdir /s /q "node_modules\.vite" >nul 2>&1
if exist "dist" rmdir /s /q "dist" >nul 2>&1

echo.
echo ▶️ تشغيل الخادم...
echo ===============================================
echo.

npx vite --port 3000 --host