@echo off
chcp 65001 >nul
echo 🔧 تثبيت النظام كخدمة Windows
echo ===============================

echo ⚠️ يتطلب تشغيل كمدير (Administrator)
echo.

cd /d "%~dp0\..\..\.."

echo 📦 تثبيت pm2 لإدارة الخدمات...
npm install -g pm2
npm install -g pm2-windows-startup

echo.
echo 🔧 إعداد الخدمة...
pm2 start docs/6_fixing/scripts/auto-system-manager.js --name "G-Assistant-Auto-System"

echo.
echo 🚀 تفعيل البدء التلقائي مع Windows...
pm2 startup
pm2 save

echo.
echo ✅ تم تثبيت النظام كخدمة!
echo.
echo 📊 أوامر إدارة الخدمة:
echo    pm2 status                 - عرض حالة الخدمات
echo    pm2 stop G-Assistant-Auto-System    - إيقاف الخدمة
echo    pm2 start G-Assistant-Auto-System   - تشغيل الخدمة
echo    pm2 restart G-Assistant-Auto-System - إعادة تشغيل
echo    pm2 logs G-Assistant-Auto-System    - عرض السجلات
echo    pm2 delete G-Assistant-Auto-System  - حذف الخدمة
echo.

pause