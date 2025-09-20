@echo off
echo.
echo ========================================
echo 🧪 AzizSys v2.0 - Test Suite Runner
echo ========================================
echo.

echo 🔧 إعداد بيئة الاختبار...
call npm run test:setup
if %errorlevel% neq 0 (
    echo ❌ فشل في إعداد بيئة الاختبار
    pause
    exit /b 1
)

echo.
echo 🚀 بدء تشغيل جميع الاختبارات...
echo.

echo 📋 1. اختبارات الوحدة (Unit Tests)
call npm run test:unit
set unit_result=%errorlevel%

echo.
echo 📋 2. اختبارات التكامل (Integration Tests)  
call npm run test:integration
set integration_result=%errorlevel%

echo.
echo 📋 3. اختبارات E2E (End-to-End Tests)
call npm run test:e2e
set e2e_result=%errorlevel%

echo.
echo 📋 4. اختبارات الأداء (Performance Tests)
call npm run test:performance
set performance_result=%errorlevel%

echo.
echo 📋 5. اختبارات الأمان (Security Tests)
call npm run test:security
set security_result=%errorlevel%

echo.
echo 📊 إنشاء التقرير النهائي...
call npm run test:report

echo.
echo 🧹 تنظيف بيئة الاختبار...
call npm run test:cleanup

echo.
echo ========================================
echo 📊 ملخص النتائج
echo ========================================

if %unit_result% equ 0 (
    echo ✅ اختبارات الوحدة: نجحت
) else (
    echo ❌ اختبارات الوحدة: فشلت
)

if %integration_result% equ 0 (
    echo ✅ اختبارات التكامل: نجحت
) else (
    echo ❌ اختبارات التكامل: فشلت
)

if %e2e_result% equ 0 (
    echo ✅ اختبارات E2E: نجحت
) else (
    echo ❌ اختبارات E2E: فشلت
)

if %performance_result% equ 0 (
    echo ✅ اختبارات الأداء: نجحت
) else (
    echo ❌ اختبارات الأداء: فشلت
)

if %security_result% equ 0 (
    echo ✅ اختبارات الأمان: نجحت
) else (
    echo ❌ اختبارات الأمان: فشلت
)

echo.
set /a total_failed=%unit_result%+%integration_result%+%e2e_result%+%performance_result%+%security_result%

if %total_failed% equ 0 (
    echo 🎉 جميع الاختبارات نجحت بامتياز!
    echo 📄 تحقق من التقرير المفصل في مجلد test-reports
) else (
    echo ⚠️  بعض الاختبارات فشلت - يرجى مراجعة التفاصيل
    echo 📄 تحقق من التقرير المفصل في مجلد test-reports
)

echo.
echo ========================================
echo تم الانتهاء من جميع الاختبارات
echo ========================================
echo.

pause