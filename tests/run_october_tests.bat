@echo off
echo 🚀 تشغيل اختبارات خطة أكتوبر الشاملة
echo =====================================

:: التحقق من Node.js
node --version >nul 2>&1
if errorlevel 1 (
    echo ❌ Node.js غير مثبت
    pause
    exit /b 1
)

:: التحقق من المكتبات
echo 📦 التحقق من المكتبات...
if not exist node_modules\axios (
    echo 📥 تثبيت المكتبات المطلوبة...
    npm install axios
)

:: بدء خوادم الاختبار
echo 🔄 بدء الخوادم...

:: تشغيل Week 1 Server
cd /d "%~dp0..\october_implementation\week1_poc"
start "Week1 Server" cmd /c "node server.js"
timeout /t 3 >nul

:: تشغيل Week 2 Server  
cd /d "%~dp0..\october_implementation\week2_processor"
start "Week2 Server" cmd /c "node server.js"
timeout /t 3 >nul

:: العودة لمجلد الاختبارات
cd /d "%~dp0"

:: تشغيل الاختبارات
echo 🧪 تشغيل الاختبارات...
node test_october_integration.js

:: النتيجة
if errorlevel 1 (
    echo.
    echo ❌ فشل بعض الاختبارات
    echo 💡 تحقق من تشغيل الخوادم والإعدادات
) else (
    echo.
    echo ✅ جميع الاختبارات نجحت!
    echo 🎉 النظام جاهز للمرحلة التالية
)

echo.
echo 🛑 إيقاف الخوادم...
taskkill /f /im node.exe >nul 2>&1

pause