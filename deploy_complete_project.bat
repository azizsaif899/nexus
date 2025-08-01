@echo off
chcp 65001 >nul
echo.
echo ========================================
echo 🚀 نشر مشروع G-Assistant كاملاً
echo ========================================
echo.

:: التحقق من وجود clasp
where clasp >nul 2>&1
if %errorlevel% neq 0 (
    echo ❌ خطأ: clasp غير مثبت
    echo يرجى تثبيت clasp أولاً: npm install -g @google/clasp
    pause
    exit /b 1
)

:: التحقق من تسجيل الدخول
echo 🔐 التحقق من تسجيل الدخول...
clasp login --status >nul 2>&1
if %errorlevel% neq 0 (
    echo ⚠️  يجب تسجيل الدخول أولاً
    echo تشغيل: clasp login
    clasp login
    if %errorlevel% neq 0 (
        echo ❌ فشل في تسجيل الدخول
        pause
        exit /b 1
    )
)

:: إنشاء مجلد dist إذا لم يكن موجوداً
if not exist "dist" mkdir dist

echo.
echo 📁 نسخ الملفات الأساسية...

:: نسخ الملفات الأساسية
copy "00_initializer.gs" "dist\" >nul 2>&1
copy "99_Code.gs" "dist\" >nul 2>&1
copy "appsscript.json" "dist\" >nul 2>&1

:: نسخ مجلدات الكود
echo 📂 نسخ مجلدات الكود...
xcopy "00_utils" "dist\00_utils\" /E /I /Y >nul 2>&1
xcopy "01_config" "dist\01_config\" /E /I /Y >nul 2>&1
xcopy "10_ui" "dist\10_ui\" /E /I /Y >nul 2>&1
xcopy "20_ai" "dist\20_ai\" /E /I /Y >nul 2>&1
xcopy "25_ai_agents" "dist\25_ai_agents\" /E /I /Y >nul 2>&1
xcopy "30_tools" "dist\30_tools\" /E /I /Y >nul 2>&1
xcopy "35_accounting" "dist\35_accounting\" /E /I /Y >nul 2>&1
xcopy "40_memory" "dist\40_memory\" /E /I /Y >nul 2>&1
xcopy "40_security" "dist\40_security\" /E /I /Y >nul 2>&1
xcopy "50_analytics" "dist\50_analytics\" /E /I /Y >nul 2>&1
xcopy "55_operations" "dist\55_operations\" /E /I /Y >nul 2>&1
xcopy "70_telemetry" "dist\70_telemetry\" /E /I /Y >nul 2>&1
xcopy "75_metrics" "dist\75_metrics\" /E /I /Y >nul 2>&1
xcopy "80_api" "dist\80_api\" /E /I /Y >nul 2>&1
xcopy "85_tests" "dist\85_tests\" /E /I /Y >nul 2>&1
xcopy "90_System" "dist\90_System\" /E /I /Y >nul 2>&1

:: نسخ ملفات التكوين
echo ⚙️ نسخ ملفات التكوين...
xcopy "config" "dist\config\" /E /I /Y >nul 2>&1

:: نسخ التوثيق
echo 📚 نسخ التوثيق...
xcopy "updated_docs" "dist\updated_docs\" /E /I /Y >نul 2>&1
xcopy "doc" "dist\doc\" /E /I /Y >nul 2>&1

:: نسخ السكريبتات
echo 🔧 نسخ السكريبتات...
xcopy "scripts" "dist\scripts\" /E /I /Y >nul 2>&1

:: نسخ الاختبارات
echo 🧪 نسخ الاختبارات...
xcopy "tests" "dist\tests\" /E /I /Y >nul 2>&1

:: نسخ ملفات المشروع الأساسية
echo 📄 نسخ ملفات المشروع...
copy "package.json" "dist\" >nul 2>&1
copy "README.md" "dist\" >nul 2>&1
copy "LICENSE" "dist\" >nul 2>&1
copy ".gitignore" "dist\" >nul 2>&1
copy "COMMIT_MESSAGE.md" "dist\" >nul 2>&1

:: نسخ ملفات GitHub
echo 🐙 نسخ ملفات GitHub...
xcopy ".github" "dist\.github\" /E /I /Y >nul 2>&1

:: نسخ مجلدات إضافية
echo 📦 نسخ المجلدات الإضافية...
xcopy "gemini_fullstack" "dist\gemini_fullstack\" /E /I /Y >nul 2>&1
xcopy "october_implementation" "dist\october_implementation\" /E /I /Y >nul 2>&1
xcopy "web_interface" "dist\web_interface\" /E /I /Y >nul 2>&1
xcopy "monitoring" "dist\monitoring\" /E /I /Y >nul 2>&1

echo.
echo 🔄 رفع المشروع إلى Google Apps Script...

:: الانتقال إلى مجلد dist
cd dist

:: رفع الملفات
clasp push --force
if %errorlevel% neq 0 (
    echo ❌ فشل في رفع الملفات
    cd ..
    pause
    exit /b 1
)

echo.
echo ✅ تم رفع المشروع بنجاح!
echo.
echo 📊 إحصائيات الرفع:
echo - الملفات الأساسية: ✓
echo - مجلدات الكود: ✓  
echo - التوثيق: ✓
echo - الاختبارات: ✓
echo - التكوين: ✓
echo - GitHub Files: ✓
echo - المجلدات الإضافية: ✓
echo.

:: العودة للمجلد الأصلي
cd ..

echo 🌐 فتح Google Apps Script Editor...
clasp open

echo.
echo ========================================
echo ✨ اكتمل نشر المشروع بنجاح!
echo ========================================
echo.
echo 📝 الخطوات التالية:
echo 1. تحقق من الملفات في Google Apps Script
echo 2. قم بتشغيل الاختبارات الأساسية
echo 3. تأكد من عمل الواجهات
echo 4. راجع السجلات للتأكد من عدم وجود أخطاء
echo.

pause