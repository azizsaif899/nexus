@echo off
chcp 65001 > nul
echo.
echo ====================================
echo 🌐 إضافة النطاق المخصص nexxs.ai
echo ====================================
echo.

cd /d "%~dp0"

echo 📋 فتح Firebase Console...
echo.
echo سيتم فتح المتصفح على صفحة إعدادات الاستضافة
echo.
echo الخطوات المطلوبة:
echo 1. اضغط على "Add custom domain"
echo 2. أدخل: nexxs.ai
echo 3. اتبع التعليمات للحصول على سجلات DNS
echo.

start https://console.firebase.google.com/project/gen-lang-client-0147492600/hosting/sites

echo.
echo ✅ تم فتح المتصفح
echo.
echo بعد إضافة النطاق في Firebase، ستحتاج إلى:
echo - نسخ سجلات DNS التي يعطيك إياها Firebase
echo - إضافتها في لوحة تحكم النطاق (حيث اشتريت nexxs.ai)
echo.

pause
