@echo off
chcp 65001 >nul
title G-Assistant NX - Quick Start (Legacy)
color 0A

echo.
echo ================================================
echo    G-Assistant NX - Quick Start (Legacy)
echo    استخدم UNIFIED_START.bat للنظام المحسن
echo ================================================
echo.

cd /d "%~dp0"

echo للنظام المحسن الجديد، استخدم:
echo UNIFIED_START.bat
echo.
echo أو اختر من الخيارات التالية:
echo.
echo [1] النظام الكامل
echo [2] لوحة التحكم فقط
echo [3] النظام التلقائي
echo [4] اختبار النظام
echo [U] النظام الموحد الجديد
echo.

set /p choice="اختر الرقم أو U: "

if "%choice%"=="1" (
    echo Starting full system...
    npm run start:daily
) else if "%choice%"=="2" (
    echo Opening dashboard...
    npm run dashboard
) else if "%choice%"=="3" (
    echo Starting auto system...
    npm run auto:enhanced
) else if "%choice%"=="4" (
    echo Testing system...
    npm run test:system
) else if "%choice%"=="U" (
    echo Starting unified system...
    call UNIFIED_START.bat
) else (
    echo Invalid choice
    pause
    goto :eof
)

echo.
pause