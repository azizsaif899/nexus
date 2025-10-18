@echo off
title Fixing Dependencies
color 0C

echo ========================================
echo    🔧 إصلاح مشاكل المكتبات
echo ========================================
echo.

cd /d "C:\nexus\apps\visual-automation"

echo 🗑️ حذف الملفات القديمة...
if exist node_modules rmdir /s /q node_modules
if exist package-lock.json del package-lock.json
if exist yarn.lock del yarn.lock

echo.
echo 🧹 تنظيف cache...
npm cache clean --force

echo.
echo 📦 تثبيت المكتبات مع إصلاح التعارضات...
npm install --legacy-peer-deps --force

if %errorlevel% neq 0 (
    echo ❌ فشل في التثبيت
    pause
    exit /b 1
)

echo.
echo ✅ تم إصلاح المشاكل بنجاح
echo.
echo 🚀 تشغيل التطبيق...
npm run dev

pause