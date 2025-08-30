@echo off
chcp 65001 >nul
title 🤖 AzizSys Dashboard Launcher
color 0B

:MENU
cls
echo.
echo ================================================
echo    🤖 AzizSys AI Assistant Dashboard
echo ================================================
echo.
echo اختر العملية المطلوبة:
echo.
echo [1] 🚀 تشغيل لوحة التحكم (خادم محلي)
echo [2] 🌐 فتح لوحة التحكم في المتصفح
echo [3] 🖥️ إنشاء اختصار سطح المكتب
echo [4] 📊 عرض حالة النظام
echo [5] ❌ خروج
echo.
set /p choice="أدخل اختيارك (1-5): "

if "%choice%"=="1" goto START_SERVER
if "%choice%"=="2" goto OPEN_BROWSER
if "%choice%"=="3" goto CREATE_SHORTCUT
if "%choice%"=="4" goto SHOW_STATUS
if "%choice%"=="5" goto EXIT
goto MENU

:START_SERVER
cls
echo.
echo 🚀 بدء تشغيل خادم لوحة التحكم...
echo ================================================
echo.
echo 📍 الرابط: http://localhost:3000
echo 🔄 للإيقاف: اضغط Ctrl+C
echo 📊 البيانات: يتم تحميلها من التقارير تلقائياً
echo.
cd /d "%~dp0"
node server.js
pause
goto MENU

:OPEN_BROWSER
echo.
echo 🌐 فتح لوحة التحكم في المتصفح...
start http://localhost:3000
echo ✅ تم فتح الرابط
timeout /t 2 >nul
goto MENU

:CREATE_SHORTCUT
echo.
echo 🖥️ إنشاء اختصار سطح المكتب...
set DESKTOP=%USERPROFILE%\Desktop
set SHORTCUT_NAME=AzizSys Dashboard.lnk
set TARGET_FILE=%~dp0DASHBOARD_LAUNCHER.bat

powershell -Command "& {$WshShell = New-Object -comObject WScript.Shell; $Shortcut = $WshShell.CreateShortcut('%DESKTOP%\%SHORTCUT_NAME%'); $Shortcut.TargetPath = '%TARGET_FILE%'; $Shortcut.WorkingDirectory = '%~dp0'; $Shortcut.IconLocation = 'shell32.dll,13'; $Shortcut.Description = 'AzizSys AI Assistant Dashboard'; $Shortcut.Save()}"

if exist "%DESKTOP%\%SHORTCUT_NAME%" (
    echo ✅ تم إنشاء الاختصار بنجاح!
    echo 📍 الموقع: %DESKTOP%\%SHORTCUT_NAME%
) else (
    echo ❌ فشل في إنشاء الاختصار
)
pause
goto MENU

:SHOW_STATUS
cls
echo.
echo 📊 حالة النظام الحالية
echo ================================================
echo.
echo 🔧 الخادم: متوقف (يحتاج تشغيل)
echo 📁 الملفات: موجودة
echo 🌐 المنفذ: 3000
echo 📊 البيانات: جاهزة للتحميل
echo.
echo 📂 مجلد التقارير: ..\reports\
if exist "..\reports\central_dashboard.json" (
    echo ✅ التقرير المركزي: موجود
) else (
    echo ⚠️ التقرير المركزي: غير موجود
)
echo.
pause
goto MENU

:EXIT
echo.
echo 👋 شكراً لاستخدام AzizSys Dashboard!
timeout /t 2 >nul
exit