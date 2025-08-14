@echo off
echo.
echo ========================================
echo 🚀 AzizSys v2.0 - Quick Start
echo ========================================
echo.

echo 🔧 تثبيت التبعيات...
call npm install --force

echo.
echo 🚀 تشغيل لوحة التحكم...
start cmd /k "cd /d %~dp0 && npm run dev:admin-dashboard"

echo.
echo ⏳ انتظار 10 ثوان لتحميل الخدمة...
timeout /t 10 /nobreak

echo.
echo 🌐 فتح لوحة التحكم...
start http://localhost:4200

echo.
echo 📊 فتح CRM Dashboard...
timeout /t 3 /nobreak
start http://localhost:4200/crm/dashboard

echo.
echo ✅ تم تشغيل النظام بنجاح!
echo 🎯 استخدم Ctrl+K لفتح Co-pilot Bar
echo.
pause