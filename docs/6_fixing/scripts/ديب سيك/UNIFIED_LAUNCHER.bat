@echo off
chcp 65001 >nul
title 🔗 النظام المتكامل - ديب سيك + Deep Scan v2.0

echo.
echo ╔══════════════════════════════════════════════════════════════╗
echo ║                    🔗 النظام المتكامل                       ║
echo ║              ديب سيك + Deep Scan v2.0                      ║
echo ╚══════════════════════════════════════════════════════════════╝
echo.

cd /d "E:\azizsys5\g-assistant-nx\docs\6_fixing\scripts\ديب سيك"

:MENU
echo.
echo 🎯 اختر نوع الفحص:
echo.
echo [1] 🔗 فحص متكامل شامل (ديب سيك + Deep Scan v2.0)
echo [2] 🚀 Deep Scan v2.0 فقط (سريع ومتقدم)
echo [3] 🔍 ديب سيك فقط (عميق ومفصل)
echo [4] 🏥 فحص صحة النظام المتكامل
echo [5] 💾 دمج النسخ الاحتياطية
echo [6] 📊 عرض التقارير السابقة
echo [7] 🛠️ إعدادات النظام
echo [8] ❓ مساعدة ودليل الاستخدام
echo [0] 🚪 خروج
echo.

set /p choice="اختر رقم العملية: "

if "%choice%"=="1" goto INTEGRATED_SCAN
if "%choice%"=="2" goto DEEP_SCAN_V2_ONLY
if "%choice%"=="3" goto DEEPSEEK_ONLY
if "%choice%"=="4" goto HEALTH_CHECK
if "%choice%"=="5" goto MERGE_BACKUPS
if "%choice%"=="6" goto VIEW_REPORTS
if "%choice%"=="7" goto SYSTEM_SETTINGS
if "%choice%"=="8" goto HELP
if "%choice%"=="0" goto EXIT

echo ❌ اختيار غير صحيح!
goto MENU

:INTEGRATED_SCAN
echo.
echo 🔗 بدء الفحص المتكامل الشامل...
echo ⚠️ هذا قد يستغرق 5-10 دقائق
echo.
echo 📋 المراحل:
echo   1️⃣ Deep Scan v2.0 - فحص سريع ومتقدم
echo   2️⃣ ديب سيك - تحليل عميق ومفصل
echo   3️⃣ دمج النتائج وإنشاء تقرير موحد
echo.
pause
echo.
echo 🚀 تشغيل النظام المتكامل...
node integration-bridge.js scan
echo.
echo ✅ تم الانتهاء من الفحص المتكامل!
echo 📄 راجع التقارير في مجلد: ..\..\reports\
pause
goto MENU

:DEEP_SCAN_V2_ONLY
echo.
echo 🚀 تشغيل Deep Scan v2.0 فقط...
echo.
cd "..\deep-scan-v2"
if exist "START_DEEP_SCAN.bat" (
    call START_DEEP_SCAN.bat
) else (
    echo ❌ Deep Scan v2.0 غير موجود!
    echo 💡 تأكد من وجود المجلد: ..\deep-scan-v2\
    pause
)
cd "..\ديب سيك"
goto MENU

:DEEPSEEK_ONLY
echo.
echo 🔍 تشغيل ديب سيك فقط...
echo.
if exist "DEEPSEEK_MASTER.bat" (
    call DEEPSEEK_MASTER.bat
) else (
    echo 🐍 تشغيل ديب سيك مباشرة...
    python deepseek_fixer.py
)
echo.
pause
goto MENU

:HEALTH_CHECK
echo.
echo 🏥 فحص صحة النظام المتكامل...
echo.
node integration-bridge.js health
echo.
echo 📊 فحص إضافي للمكونات:
echo.

echo 🔍 فحص ديب سيك:
if exist "deepseek_fixer.py" (
    echo   ✅ ديب سيك موجود
) else (
    echo   ❌ ديب سيك غير موجود
)

echo 🚀 فحص Deep Scan v2.0:
if exist "..\deep-scan-v2\deep-scan-cli.ts" (
    echo   ✅ Deep Scan v2.0 موجود
) else (
    echo   ❌ Deep Scan v2.0 غير موجود
)

echo 💾 فحص النسخ الاحتياطية:
if exist "backups\" (
    echo   ✅ مجلد النسخ الاحتياطية موجود
    for /f %%i in ('dir /b backups\ ^| find /c /v ""') do echo   📁 عدد الملفات: %%i
) else (
    echo   ❌ مجلد النسخ الاحتياطية غير موجود
)

echo 📊 فحص التقارير:
if exist "..\..\reports\" (
    echo   ✅ مجلد التقارير موجود
) else (
    echo   ❌ مجلد التقارير غير موجود
)

echo.
pause
goto MENU

:MERGE_BACKUPS
echo.
echo 💾 دمج النسخ الاحتياطية...
echo.
node integration-bridge.js merge-backups
echo.
echo ✅ تم دمج النسخ الاحتياطية
pause
goto MENU

:VIEW_REPORTS
echo.
echo 📊 عرض التقارير السابقة...
echo.
if exist "..\..\reports\" (
    echo 📁 التقارير الموجودة:
    echo.
    dir "..\..\reports\*.json" /b /o-d 2>nul | findstr /i "unified\|deep-scan\|deepseek" | head -10
    echo.
    echo 🌐 التقارير HTML:
    dir "..\..\reports\*.html" /b /o-d 2>nul | head -5
    echo.
    set /p openReport="هل تريد فتح أحدث تقرير HTML؟ (y/n): "
    if /i "%openReport%"=="y" (
        for /f "delims=" %%i in ('dir "..\..\reports\*.html" /b /o-d 2^>nul ^| head -1') do (
            start "" "..\..\reports\%%i"
        )
    )
) else (
    echo ❌ لا توجد تقارير
    echo 💡 قم بتشغيل فحص أولاً
)
echo.
pause
goto MENU

:SYSTEM_SETTINGS
echo.
echo 🛠️ إعدادات النظام...
echo.
echo [1] 🔧 إعداد Python للديب سيك
echo [2] 🚀 إعداد Node.js لـ Deep Scan v2.0
echo [3] 📁 إنشاء مجلدات النظام
echo [4] 🔄 إعادة تعيين النظام
echo [5] 🔙 العودة للقائمة الرئيسية
echo.

set /p settingChoice="اختر الإعداد: "

if "%settingChoice%"=="1" goto SETUP_PYTHON
if "%settingChoice%"=="2" goto SETUP_NODEJS
if "%settingChoice%"=="3" goto CREATE_DIRS
if "%settingChoice%"=="4" goto RESET_SYSTEM
if "%settingChoice%"=="5" goto MENU

echo ❌ اختيار غير صحيح!
goto SYSTEM_SETTINGS

:SETUP_PYTHON
echo.
echo 🐍 فحص Python...
python --version 2>nul
if %errorlevel% neq 0 (
    echo ❌ Python غير مثبت
    echo 💡 قم بتثبيت Python من: https://python.org
) else (
    echo ✅ Python مثبت
    echo 📦 فحص المكتبات المطلوبة...
    pip install -r requirements.txt 2>nul
    echo ✅ تم تثبيت المكتبات
)
pause
goto SYSTEM_SETTINGS

:SETUP_NODEJS
echo.
echo 🚀 فحص Node.js...
node --version 2>nul
if %errorlevel% neq 0 (
    echo ❌ Node.js غير مثبت
    echo 💡 قم بتثبيت Node.js من: https://nodejs.org
) else (
    echo ✅ Node.js مثبت
    echo 📦 فحص TypeScript...
    tsc --version 2>nul
    if %errorlevel% neq 0 (
        echo 🔧 تثبيت TypeScript...
        npm install -g typescript ts-node
    )
    echo ✅ TypeScript جاهز
)
pause
goto SYSTEM_SETTINGS

:CREATE_DIRS
echo.
echo 📁 إنشاء مجلدات النظام...
if not exist "..\..\reports\" mkdir "..\..\reports\"
if not exist "..\..\logs\" mkdir "..\..\logs\"
if not exist "backups\" mkdir "backups\"
if not exist "reports\" mkdir "reports\"
if not exist "logs\" mkdir "logs\"
echo ✅ تم إنشاء جميع المجلدات
pause
goto SYSTEM_SETTINGS

:RESET_SYSTEM
echo.
echo 🔄 إعادة تعيين النظام...
echo ⚠️ هذا سيحذف جميع التقارير والسجلات المؤقتة
set /p confirmReset="هل أنت متأكد؟ (y/n): "
if /i "%confirmReset%"=="y" (
    echo 🗑️ حذف الملفات المؤقتة...
    del /q "..\..\reports\*.tmp" 2>nul
    del /q "logs\*.tmp" 2>nul
    echo ✅ تم إعادة التعيين
) else (
    echo ❌ تم الإلغاء
)
pause
goto SYSTEM_SETTINGS

:HELP
echo.
echo ❓ مساعدة ودليل الاستخدام
echo.
echo 📖 دليل النظام المتكامل:
echo.
echo 🔗 الفحص المتكامل:
echo    - يجمع بين قوة ديب سيك و Deep Scan v2.0
echo    - يوفر فحص شامل ومتعدد الطبقات
echo    - ينتج تقرير موحد مفصل
echo.
echo 🚀 Deep Scan v2.0:
echo    - فحص سريع ومتقدم
echo    - واجهات متعددة (CLI, HTML, Interactive)
echo    - فحص أمني متقدم وإدارة التبعيات
echo.
echo 🔍 ديب سيك:
echo    - تحليل عميق ومفصل
echo    - نسخ احتياطية شاملة
echo    - إصلاح متقدم للمشاكل المعقدة
echo.
echo 💡 نصائح:
echo    - ابدأ بالفحص المتكامل للحصول على أفضل النتائج
echo    - راجع التقارير HTML للحصول على عرض مرئي
echo    - استخدم فحص الصحة لحل المشاكل التقنية
echo.
echo 📞 للدعم:
echo    - راجع ملفات README في كل مجلد
echo    - فحص السجلات في مجلد logs/
echo    - استخدم فحص الصحة لتشخيص المشاكل
echo.
pause
goto MENU

:EXIT
echo.
echo 👋 شكراً لاستخدام النظام المتكامل!
echo 🔗 ديب سيك + Deep Scan v2.0
echo.
exit /b 0