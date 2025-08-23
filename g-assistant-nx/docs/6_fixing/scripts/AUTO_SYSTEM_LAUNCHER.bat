@echo off
echo 🔄 تم إعادة توجيه السكربت للنظام الموحد
echo ==========================================
echo ⚠️ هذا السكربت قديم - استخدم النظام الموحد الجديد
echo ================================================
echo.
echo 🎯 استخدم بدلاً من ذلك:
echo    docs/6_fixing/core/UNIFIED_LAUNCHER.bat
echo.
echo أو من npm:
echo    npm run unified:launcher
echo.
echo 📊 للداشبورد مباشرة:
echo    npm run dashboard
echo.
echo ✅ النظام الجديد أكثر تنظيماً وفعالية!
echo.
pause

echo.
echo 🚀 هل تريد تشغيل النظام الموحد الآن؟
set /p choice="(y/n): "
if /i "%choice%"=="y" (
    cd /d "%~dp0\..\core"
    call UNIFIED_LAUNCHER.bat
)