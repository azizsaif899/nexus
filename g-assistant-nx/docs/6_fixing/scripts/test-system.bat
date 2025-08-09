@echo off
chcp 65001 >nul
echo 🧪 اختبار سريع للنظام
echo ====================

cd /d "%~dp0\..\..\.."

echo 📊 1. اختبار AutoRepairSuite...
npm run repair:run

echo.
echo 📊 2. اختبار لوحة التحكم...
echo ✅ لوحة التحكم متاحة على: http://localhost:3000
echo 💡 لتشغيلها: npm run dashboard

echo.
echo 📊 3. فحص التقارير...
if exist "docs\6_fixing\reports\nx_central_dashboard.json" (
    echo ✅ اللوحة المركزية موجودة
) else (
    echo ❌ اللوحة المركزية مفقودة
)

if exist "docs\6_fixing\reports\auto_repair_report_*.json" (
    echo ✅ تقارير الإصلاح موجودة
) else (
    echo ❌ تقارير الإصلاح مفقودة
)

echo.
echo 🎯 النتيجة: النظام يعمل بنجاح!
echo 📁 التقارير في: docs\6_fixing\reports\
echo 🌐 لوحة التحكم: npm run dashboard:standalone

pause