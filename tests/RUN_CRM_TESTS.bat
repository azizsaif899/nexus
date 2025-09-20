@echo off
echo.
echo ========================================
echo 🏢 AzizSys CRM Tests Runner
echo ========================================
echo.

echo 🔧 تشغيل اختبارات CRM...

echo.
echo 📋 1. اختبارات وحدة CRM
call npx vitest run tests/unit/crm-system.test.ts --reporter=verbose

echo.
echo 📋 2. اختبارات تكامل CRM  
call npx vitest run tests/integration/crm-integration.test.ts --reporter=verbose

echo.
echo 📊 3. إنشاء تقرير CRM
call node -r ts-node/register tests/test-scripts/demo-test-report.ts

echo.
echo 🌐 4. فتح التقرير
for /f "delims=" %%i in ('dir /b /o-d "test-reports\test-report-*.html" 2^>nul') do (
    start "" "test-reports\%%i"
    goto :done
)

:done
echo.
echo 🎉 تم الانتهاء من اختبارات CRM!
pause