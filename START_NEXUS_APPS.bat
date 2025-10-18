@echo off
title Nexus Master Manager - تشغيل سريع
color 0A
chcp 65001 > nul

echo.
echo ========================================
echo    🚀 Nexus Master Manager
echo    مدير تطبيقات Nexus الشامل
echo ========================================
echo.

echo 📋 Quick Actions / الإجراءات السريعة:
echo.
echo    [1] Start Both Apps     - شغل كلا التطبيقين
echo    [2] Interactive Manager - المدير التفاعلي
echo    [3] Status Check        - فحص الحالة
echo    [4] Stop All            - إيقاف الكل
echo    [0] Exit                - خروج
echo.

set /p choice="Enter choice (0-4): "

if "%choice%"=="1" goto start_both
if "%choice%"=="2" goto interactive
if "%choice%"=="3" goto status
if "%choice%"=="4" goto stop_all
if "%choice%"=="0" goto exit
goto invalid

:start_both
echo.
echo 🚀 Starting both applications...
powershell -ExecutionPolicy Bypass -File "Nexus-Master-Manager.ps1" -StartBoth
goto end

:interactive
echo.
echo 🎛️ Opening interactive manager...
powershell -ExecutionPolicy Bypass -File "Nexus-Master-Manager.ps1"
goto end

:status
echo.
echo 📊 Checking status...
powershell -ExecutionPolicy Bypass -File "Nexus-Master-Manager.ps1" -Action 3
goto menu

:stop_all
echo.
echo 🛑 Stopping all applications...
powershell -ExecutionPolicy Bypass -File "Nexus-Master-Manager.ps1" -Action 2
goto menu

:invalid
echo.
echo ❌ Invalid choice! / اختيار غير صحيح!
timeout /t 2 > nul
goto start

:menu
echo.
echo 🔄 Press any key to return to menu...
pause > nul
goto start

:exit
echo.
echo 👋 Goodbye! / وداعاً!
exit /b 0

:end
echo.
echo 🏁 Operation completed / انتهت العملية
pause

:start
cls
goto :eof