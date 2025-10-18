@echo off
chcp 65001 > nul
echo.
echo ====================================
echo ⚡ تحديث سريع لـ nexxs.ai
echo ====================================
echo.

cd /d "%~dp0"

echo 📦 بناء التطبيق...
call npm run build

if errorlevel 1 (
    echo.
    echo ❌ فشل البناء! تحقق من الأخطاء أعلاه.
    pause
    exit /b 1
)

echo.
echo 🚀 رفع التحديث إلى Firebase...
call firebase deploy --only hosting

if errorlevel 1 (
    echo.
    echo ❌ فشل النشر! تحقق من الأخطاء أعلاه.
    pause
    exit /b 1
)

echo.
echo ====================================
echo ✅ تم التحديث بنجاح!
echo ====================================
echo.
echo 🌐 الموقع: https://nexxs.ai
echo.
echo 💡 نصائح:
echo   - امسح الكاش قبل الاختبار (Ctrl+Shift+Delete)
echo   - أعد تحميل الصفحة بقوة (Ctrl+Shift+R)
echo   - التحديث قد يستغرق 1-2 دقيقة للظهور
echo.

pause
