@echo off
echo 🔍 فحص شامل للمشروع...

echo.
echo 📊 عرض الملفات المتغيرة:
git status --porcelain

echo.
echo 📈 إحصائيات التغييرات:
git diff --stat

echo.
set /p confirm="هل تريد رفع جميع هذه التغييرات؟ (y/n): "
if /i "%confirm%" neq "y" (
    echo ❌ تم إلغاء العملية
    pause
    exit /b
)

echo.
echo 📝 إضافة جميع الملفات...
git add .

echo.
echo 💾 إنشاء commit شامل...
set commit_msg=تحديث شامل %date% %time%: جميع التعديلات المحلية والخارجية
git commit -m "%commit_msg%"

echo.
echo 🌐 رفع للـ GitHub...
git push origin master

if %errorlevel% equ 0 (
    echo ✅ نجح الرفع! تحقق من: https://github.com/azizsaif899/g-assistant
) else (
    echo ❌ فشل الرفع - تحقق من الاتصال
)

pause