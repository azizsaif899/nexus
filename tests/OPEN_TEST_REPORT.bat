@echo off
echo.
echo ========================================
echo 📊 AzizSys v2.0 - Test Report Viewer
echo ========================================
echo.

echo 🔍 البحث عن أحدث تقرير...

for /f "delims=" %%i in ('dir /b /o-d "test-reports\test-report-*.html" 2^>nul') do (
    set "latest_report=%%i"
    goto :found
)

:not_found
echo ❌ لم يتم العثور على تقارير
echo 💡 قم بتشغيل: npm run test:demo-report
pause
exit /b 1

:found
echo ✅ تم العثور على التقرير: %latest_report%
echo.
echo 🌐 فتح التقرير في المتصفح...

start "" "test-reports\%latest_report%"

echo.
echo 🎉 تم فتح التقرير بنجاح!
echo 📊 استمتع بمراجعة نتائج الاختبارات
echo.
pause