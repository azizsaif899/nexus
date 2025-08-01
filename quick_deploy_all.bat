@echo off
chcp 65001 >nul
echo.
echo ========================================
echo ⚡ النشر السريع الشامل - G-Assistant
echo ========================================
echo.

:: تشغيل التحضير
echo 🔧 المرحلة 1: تحضير المشروع...
call prepare_for_deployment.bat

echo.
echo 🚀 المرحلة 2: النشر الشامل...
call deploy_complete_project.bat

echo.
echo ========================================
echo ✨ اكتمل النشر الشامل بنجاح!
echo ========================================
echo.

:: إنشاء تقرير النشر
echo 📊 إنشاء تقرير النشر...
echo # تقرير النشر الشامل - G-Assistant > deployment_report.md
echo. >> deployment_report.md
echo **تاريخ النشر**: %date% %time% >> deployment_report.md
echo **الإصدار**: 6.3.0 >> deployment_report.md
echo **حالة النشر**: ✅ مكتمل >> deployment_report.md
echo. >> deployment_report.md
echo ## 📁 الملفات المنشورة >> deployment_report.md
echo. >> deployment_report.md
echo ### الوحدات الأساسية >> deployment_report.md
dir /b 00_* >> temp_files.txt 2>nul
if exist temp_files.txt (
    for /f %%i in (temp_files.txt) do echo - %%i >> deployment_report.md
    del temp_files.txt
)
echo. >> deployment_report.md
echo ### وحدات الواجهة >> deployment_report.md
dir /b 10_* >> temp_files.txt 2>nul
if exist temp_files.txt (
    for /f %%i in (temp_files.txt) do echo - %%i >> deployment_report.md
    del temp_files.txt
)
echo. >> deployment_report.md
echo ### وحدات الذكاء الصناعي >> deployment_report.md
dir /b 20_* 25_* >> temp_files.txt 2>nul
if exist temp_files.txt (
    for /f %%i in (temp_files.txt) do echo - %%i >> deployment_report.md
    del temp_files.txt
)
echo. >> deployment_report.md
echo ### الأدوات والخدمات >> deployment_report.md
dir /b 30_* 35_* 40_* 50_* 55_* >> temp_files.txt 2>nul
if exist temp_files.txt (
    for /f %%i in (temp_files.txt) do echo - %%i >> deployment_report.md
    del temp_files.txt
)
echo. >> deployment_report.md
echo ### المراقبة والاختبارات >> deployment_report.md
dir /b 70_* 75_* 80_* 85_* 90_* >> temp_files.txt 2>nul
if exist temp_files.txt (
    for /f %%i in (temp_files.txt) do echo - %%i >> deployment_report.md
    del temp_files.txt
)
echo. >> deployment_report.md
echo ### التوثيق والإعدادات >> deployment_report.md
echo - updated_docs/ >> deployment_report.md
echo - doc/ >> deployment_report.md
echo - config/ >> deployment_report.md
echo - scripts/ >> deployment_report.md
echo - tests/ >> deployment_report.md
echo. >> deployment_report.md
echo ### الملفات الإضافية >> deployment_report.md
echo - gemini_fullstack/ >> deployment_report.md
echo - october_implementation/ >> deployment_report.md
echo - web_interface/ >> deployment_report.md
echo - monitoring/ >> deployment_report.md
echo - .github/ >> deployment_report.md
echo. >> deployment_report.md
echo ## 🔧 الخطوات التالية >> deployment_report.md
echo. >> deployment_report.md
echo 1. **التحقق من النشر**: >> deployment_report.md
echo    ```javascript >> deployment_report.md
echo    verifyDeployment(); >> deployment_report.md
echo    ``` >> deployment_report.md
echo. >> deployment_report.md
echo 2. **تهيئة النظام**: >> deployment_report.md
echo    ```javascript >> deployment_report.md
echo    initializeSystem(); >> deployment_report.md
echo    ``` >> deployment_report.md
echo. >> deployment_report.md
echo 3. **فحص الوحدات**: >> deployment_report.md
echo    ```javascript >> deployment_report.md
echo    reportModulesStatus(); >> deployment_report.md
echo    ``` >> deployment_report.md
echo. >> deployment_report.md
echo 4. **تشغيل الاختبارات**: >> deployment_report.md
echo    ```javascript >> deployment_report.md
echo    testSystem(); >> deployment_report.md
echo    ``` >> deployment_report.md
echo. >> deployment_report.md
echo ## 📞 الدعم >> deployment_report.md
echo. >> deployment_report.md
echo في حالة وجود مشاكل: >> deployment_report.md
echo - راجع السجلات في Google Apps Script >> deployment_report.md
echo - تحقق من صحة ملفات التكوين >> deployment_report.md
echo - تأكد من صلاحيات الوصول >> deployment_report.md

echo.
echo 📋 تم إنشاء تقرير النشر: deployment_report.md
echo.
echo 🎉 النشر الشامل مكتمل!
echo 📂 جميع الملفات والمجلدات تم رفعها بنجاح
echo 📚 التوثيق والإعدادات محدثة
echo 🔧 السكريپتات والأدوات جاهزة
echo.

pause