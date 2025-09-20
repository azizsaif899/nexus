@echo off
chcp 65001 >nul
echo ⚠️ هذا السكربت قديم - استخدم النظام الموحد
echo ==========================================
echo.
echo 🎯 استخدم بدلاً:
echo    docs/6_fixing/core/UNIFIED_LAUNCHER.bat
echo.
echo أو: npm run unified:launcher
echo.
pause

set /p choice="هل تريد تشغيل النظام الموحد? (y/n): "
if /i "%choice%"=="y" (
    cd /d "%~dp0\..\core"
    call UNIFIED_LAUNCHER.bat
)