@echo off
chcp 65001 >nul
title 🔍 DeepSeek AI Master Control v3.0

:MAIN_MENU
cls
echo.
echo ╔══════════════════════════════════════════════════════════════╗
echo ║                🔍 DeepSeek AI Master Control v3.0            ║
echo ║                     نظام الفحص والإصلاح الذكي               ║
echo ╠══════════════════════════════════════════════════════════════╣
echo ║                                                              ║
echo ║  1. 🔍 فحص شامل للكود (AI Analyzer)                        ║
echo ║  2. 🔧 إصلاح تلقائي للمشاكل (Auto Fixer)                   ║
echo ║  3. ⚡ فحص سريع (Quick Scan)                               ║
echo ║  4. 📊 عرض لوحة التحكم (Dashboard)                         ║
echo ║  5. 📋 عرض التقارير (View Reports)                         ║
echo ║  6. 🛠️  إعداد البيئة (Setup Environment)                   ║
echo ║  7. 🧹 تنظيف الملفات المؤقتة (Cleanup)                     ║
echo ║  8. ❓ مساعدة (Help)                                       ║
echo ║  0. 🚪 خروج (Exit)                                         ║
echo ║                                                              ║
echo ╚══════════════════════════════════════════════════════════════╝
echo.
set /p choice="اختر رقم العملية: "

if "%choice%"=="1" goto FULL_SCAN
if "%choice%"=="2" goto AUTO_FIX
if "%choice%"=="3" goto QUICK_SCAN
if "%choice%"=="4" goto DASHBOARD
if "%choice%"=="5" goto VIEW_REPORTS
if "%choice%"=="6" goto SETUP_ENV
if "%choice%"=="7" goto CLEANUP
if "%choice%"=="8" goto HELP
if "%choice%"=="0" goto EXIT

echo ❌ اختيار غير صحيح!
timeout /t 2 >nul
goto MAIN_MENU

:FULL_SCAN
cls
echo ╔══════════════════════════════════════════════════════════════╗
echo ║                    🔍 فحص شامل للكود                        ║
echo ╚══════════════════════════════════════════════════════════════╝
echo.
echo 🚀 بدء الفحص الشامل...
echo.

REM تفعيل البيئة الافتراضية
if exist "deepseek_env\Scripts\activate.bat" (
    call deepseek_env\Scripts\activate.bat
) else (
    echo ⚠️  البيئة الافتراضية غير موجودة. سيتم إنشاؤها...
    python -m venv deepseek_env
    call deepseek_env\Scripts\activate.bat
    pip install -r requirements.txt
)

REM تشغيل الفحص
python ai-analyzer.py --dir "..\..\..\.."

echo.
echo ✅ اكتمل الفحص الشامل!
echo 📄 يمكنك عرض التقرير من خلال لوحة التحكم
echo.
pause
goto MAIN_MENU

:AUTO_FIX
cls
echo ╔══════════════════════════════════════════════════════════════╗
echo ║                   🔧 إصلاح تلقائي للمشاكل                  ║
echo ╚══════════════════════════════════════════════════════════════╝
echo.
echo 🔧 بدء الإصلاح التلقائي...
echo.

REM تفعيل البيئة الافتراضية
if exist "deepseek_env\Scripts\activate.bat" (
    call deepseek_env\Scripts\activate.bat
) else (
    echo ❌ البيئة الافتراضية غير موجودة! قم بإعداد البيئة أولاً.
    pause
    goto MAIN_MENU
)

REM تشغيل الإصلاح
python deepseek_fixer.py --dir "..\..\..\.."

echo.
echo ✅ اكتمل الإصلاح التلقائي!
echo 📄 يمكنك عرض تقرير الإصلاح من خلال لوحة التحكم
echo.
pause
goto MAIN_MENU

:QUICK_SCAN
cls
echo ╔══════════════════════════════════════════════════════════════╗
echo ║                      ⚡ فحص سريع                            ║
echo ╚══════════════════════════════════════════════════════════════╝
echo.
echo ⚡ بدء الفحص السريع...
echo.

REM تفعيل البيئة الافتراضية
if exist "deepseek_env\Scripts\activate.bat" (
    call deepseek_env\Scripts\activate.bat
) else (
    echo ❌ البيئة الافتراضية غير موجودة! قم بإعداد البيئة أولاً.
    pause
    goto MAIN_MENU
)

REM تشغيل الفحص السريع
python simple-scan.py

echo.
echo ✅ اكتمل الفحص السريع!
echo.
pause
goto MAIN_MENU

:DASHBOARD
cls
echo ╔══════════════════════════════════════════════════════════════╗
echo ║                    📊 لوحة التحكم                           ║
echo ╚══════════════════════════════════════════════════════════════╝
echo.
echo 🌐 فتح لوحة التحكم التفاعلية...
echo.

REM فتح لوحة التحكم في المتصفح
start "" "dashboard.html"

echo ✅ تم فتح لوحة التحكم في المتصفح
echo.
pause
goto MAIN_MENU

:VIEW_REPORTS
cls
echo ╔══════════════════════════════════════════════════════════════╗
echo ║                     📋 عرض التقارير                         ║
echo ╚══════════════════════════════════════════════════════════════╝
echo.

echo 📊 تقارير الفحص:
echo ================
if exist "reports\*.json" (
    dir /b /o-d "reports\scan_report_*.json" 2>nul | findstr /r "scan_report_.*\.json" >nul
    if errorlevel 1 (
        echo لا توجد تقارير فحص
    ) else (
        for /f %%f in ('dir /b /o-d "reports\scan_report_*.json" 2^>nul') do (
            echo - %%f
        )
    )
) else (
    echo لا توجد تقارير فحص
)

echo.
echo 🔧 تقارير الإصلاح:
echo ==================
if exist "fix_reports\*.json" (
    dir /b /o-d "fix_reports\fix_report_*.json" 2>nul | findstr /r "fix_report_.*\.json" >nul
    if errorlevel 1 (
        echo لا توجد تقارير إصلاح
    ) else (
        for /f %%f in ('dir /b /o-d "fix_reports\fix_report_*.json" 2^>nul') do (
            echo - %%f
        )
    )
) else (
    echo لا توجد تقارير إصلاح
)

echo.
echo 📋 خطط الإصلاح:
echo ================
if exist "plans\*.json" (
    dir /b /o-d "plans\fix_plan_*.json" 2>nul | findstr /r "fix_plan_.*\.json" >nul
    if errorlevel 1 (
        echo لا توجد خطط إصلاح
    ) else (
        for /f %%f in ('dir /b /o-d "plans\fix_plan_*.json" 2^>nul') do (
            echo - %%f
        )
    )
) else (
    echo لا توجد خطط إصلاح
)

echo.
pause
goto MAIN_MENU

:SETUP_ENV
cls
echo ╔══════════════════════════════════════════════════════════════╗
echo ║                   🛠️  إعداد البيئة                          ║
echo ╚══════════════════════════════════════════════════════════════╝
echo.

echo 🔧 إعداد بيئة DeepSeek AI...
echo.

REM التحقق من وجود Python
python --version >nul 2>&1
if errorlevel 1 (
    echo ❌ Python غير مثبت! يرجى تثبيت Python أولاً.
    echo 🌐 تحميل من: https://python.org
    pause
    goto MAIN_MENU
)

echo ✅ Python متوفر
echo.

REM إنشاء البيئة الافتراضية
if not exist "deepseek_env" (
    echo 📦 إنشاء البيئة الافتراضية...
    python -m venv deepseek_env
    if errorlevel 1 (
        echo ❌ فشل في إنشاء البيئة الافتراضية!
        pause
        goto MAIN_MENU
    )
    echo ✅ تم إنشاء البيئة الافتراضية
) else (
    echo ✅ البيئة الافتراضية موجودة
)

echo.

REM تفعيل البيئة وتثبيت المتطلبات
echo 📦 تثبيت المتطلبات...
call deepseek_env\Scripts\activate.bat

REM إنشاء ملف المتطلبات إذا لم يكن موجوداً
if not exist "requirements.txt" (
    echo colorama==0.4.6 > requirements.txt
    echo rich==13.7.0 >> requirements.txt
    echo requests==2.31.0 >> requirements.txt
)

pip install -r requirements.txt

if errorlevel 1 (
    echo ❌ فشل في تثبيت المتطلبات!
    pause
    goto MAIN_MENU
)

echo.
echo ✅ تم إعداد البيئة بنجاح!
echo 🚀 يمكنك الآن استخدام جميع ميزات DeepSeek AI
echo.
pause
goto MAIN_MENU

:CLEANUP
cls
echo ╔══════════════════════════════════════════════════════════════╗
echo ║                  🧹 تنظيف الملفات المؤقتة                  ║
echo ╚══════════════════════════════════════════════════════════════╝
echo.

echo 🧹 تنظيف الملفات المؤقتة...
echo.

REM حذف ملفات Python المؤقتة
if exist "__pycache__" (
    rmdir /s /q "__pycache__"
    echo ✅ تم حذف __pycache__
)

REM حذف ملفات .pyc
del /s /q "*.pyc" >nul 2>&1
echo ✅ تم حذف ملفات .pyc

REM حذف التقارير القديمة (أكثر من 30 يوم)
echo 🗂️  تنظيف التقارير القديمة...

REM حذف السجلات القديمة
if exist "logs" (
    forfiles /p "logs" /s /m "*.log" /d -30 /c "cmd /c del @path" >nul 2>&1
    echo ✅ تم حذف السجلات القديمة
)

echo.
echo ✅ اكتمل التنظيف!
echo.
pause
goto MAIN_MENU

:HELP
cls
echo ╔══════════════════════════════════════════════════════════════╗
echo ║                        ❓ مساعدة                            ║
echo ╚══════════════════════════════════════════════════════════════╝
echo.
echo 📖 دليل استخدام DeepSeek AI Master Control:
echo.
echo 🔍 الفحص الشامل:
echo    - يقوم بفحص جميع ملفات المشروع
echo    - يكتشف المشاكل الأمنية والجودة
echo    - ينشئ تقرير مفصل بالنتائج
echo.
echo 🔧 الإصلاح التلقائي:
echo    - يقرأ تقرير الفحص
echo    - ينشئ خطة إصلاح مفصلة
echo    - يطبق الإصلاحات التلقائية الآمنة
echo    - ينشئ نسخ احتياطية قبل التعديل
echo.
echo ⚡ الفحص السريع:
echo    - فحص سريع للمشاكل الشائعة
echo    - مناسب للفحص اليومي
echo.
echo 📊 لوحة التحكم:
echo    - واجهة ويب تفاعلية
echo    - عرض التقارير والإحصائيات
echo    - مراقبة حالة المشروع
echo.
echo 🛠️  إعداد البيئة:
echo    - إنشاء البيئة الافتراضية
echo    - تثبيت المتطلبات
echo    - إعداد النظام للعمل
echo.
echo 📁 هيكل الملفات:
echo    - reports/     : تقارير الفحص
echo    - fix_reports/ : تقارير الإصلاح
echo    - plans/       : خطط الإصلاح
echo    - backups/     : النسخ الاحتياطية
echo    - logs/        : سجلات النظام
echo.
pause
goto MAIN_MENU

:EXIT
cls
echo.
echo 👋 شكراً لاستخدام DeepSeek AI Master Control
echo 🚀 نراك قريباً!
echo.
timeout /t 2 >nul
exit /b 0