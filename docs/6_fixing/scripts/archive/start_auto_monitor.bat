@echo off
chcp 65001 >nul
echo 🔄 بدء المراقبة التلقائية - G-Assistant NX
echo =========================================

cd /d "%~dp0\..\..\.."

echo 📊 بدء مراقبة المشروع...
echo ⏰ سيتم فحص المشروع كل 5 دقائق
echo 🛑 اضغط Ctrl+C للإيقاف
echo.

node docs/6_fixing/scripts/watch_mode.js

echo.
echo 🛑 تم إيقاف المراقبة
pause