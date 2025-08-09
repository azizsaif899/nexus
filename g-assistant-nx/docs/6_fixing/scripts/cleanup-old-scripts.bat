@echo off
echo 🧹 تنظيف السكربتات القديمة
echo ============================

cd /d "%~dp0"

echo 📋 السكربتات المقترحة للحذف:
echo.
echo ⚠️ السكربتات القديمة:
echo    - auto_update_docs.js (مدمج في النظام الجديد)
echo    - docs_data.js (تم نقله للـ dashboard)
echo    - generate_docs_data.js (مدمج في النظام الجديد)
echo    - update_sprint_status.js (قديم)
echo.
echo ✅ السكربتات المفيدة (ستبقى):
echo    - nx_auto_fix.js
echo    - nx_project_monitor.js
echo    - nx_task_orchestrator.js
echo    - nx_detailed_analyzer.js
echo    - watch_mode.js
echo    - run_nx_automation.bat
echo    - setup-ai-repair.bat
echo.

set /p choice="هل تريد حذف السكربتات القديمة؟ (y/n): "

if /i "%choice%"=="y" (
    echo 🗑️ حذف السكربتات القديمة...
    
    if exist auto_update_docs.js (
        del auto_update_docs.js
        echo ✅ تم حذف auto_update_docs.js
    )
    
    if exist docs_data.js (
        del docs_data.js
        echo ✅ تم حذف docs_data.js
    )
    
    if exist generate_docs_data.js (
        del generate_docs_data.js
        echo ✅ تم حذف generate_docs_data.js
    )
    
    if exist update_sprint_status.js (
        del update_sprint_status.js
        echo ✅ تم حذف update_sprint_status.js
    )
    
    if exist temp\ (
        rmdir /s /q temp
        echo ✅ تم حذف مجلد temp
    )
    
    echo.
    echo 🎉 تم تنظيف السكربتات القديمة بنجاح!
    echo 📁 السكربتات المتبقية هي الأحدث والأكثر فعالية
    
) else (
    echo ℹ️ تم إلغاء عملية التنظيف
)

echo.
pause