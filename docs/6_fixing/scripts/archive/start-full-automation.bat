@echo off
chcp 65001 >nul
echo 🤖 تشغيل النظام التلقائي الشامل
echo ===============================

cd /d "%~dp0\..\..\.."

echo 📊 بدء مدير النظام التلقائي...
echo.
echo ✅ العمليات التلقائية:
echo    - مراقبة المشروع كل 5 دقائق
echo    - فحص وإصلاح الأخطاء تلقائياً
echo    - تحديث اللوحة المركزية
echo    - تسجيل جميع العمليات
echo.
echo 🌐 لوحة التحكم متاحة على: http://localhost:3000
echo 📊 سجل العمليات: docs\6_fixing\reports\auto_system_log.json
echo.
echo 🛑 للإيقاف: اضغط Ctrl+C
echo.

node docs/6_fixing/scripts/auto-system-manager.js

echo.
echo 🛑 تم إيقاف النظام التلقائي
pause