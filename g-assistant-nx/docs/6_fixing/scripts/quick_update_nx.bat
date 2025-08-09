@echo off
chcp 65001 >nul
echo ⚡ تحديث سريع - G-Assistant NX
echo ===============================

cd /d "%~dp0\..\..\.."

echo 📊 تشغيل AutoRepairSuite...
npm run repair:run

echo.
echo 📊 تحديث لوحة التحكم...
if exist "docs\6_fixing\reports\nx_central_dashboard.json" (
    echo ✅ تم تحديث اللوحة المركزية
) else (
    echo ❌ فشل في تحديث اللوحة
)

echo.
echo 🌐 فتح لوحة التحكم...
set /p choice="هل تريد فتح لوحة التحكم؟ (y/n): "
if /i "%choice%"=="y" npm run dashboard:standalone

echo.
echo ✅ تم التحديث السريع!
pause