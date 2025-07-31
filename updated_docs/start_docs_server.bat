@echo off
chcp 65001 >nul
echo 📚 بدء تشغيل خادم الوثائق...
echo.

REM التحقق من وجود Node.js
node --version >nul 2>&1
if errorlevel 1 (
    echo ❌ Node.js غير مثبت
    echo 💡 يرجى تثبيت Node.js من: https://nodejs.org
    pause
    exit /b 1
)

echo ✅ Node.js متوفر
echo.

REM تحديث المستندات
echo 🔄 تحديث قائمة المستندات...
node auto_update_docs.js

REM بدء الخادم المحلي
echo 🌐 بدء الخادم المحلي...
echo 📍 الرابط: http://localhost:8080
echo 🔄 التحديث التلقائي: مفعل
echo ⏹️  للإيقاف: اضغط Ctrl+C
echo.

REM تشغيل خادم بسيط
python -m http.server 8080 2>nul || (
    echo ❌ Python غير متوفر، محاولة استخدام Node.js...
    npx http-server -p 8080 -o
)

pause