@echo off
chcp 65001 >nul
title G-Assistant NX - Quick Start
color 0A

echo.
echo ================================================
echo           G-Assistant NX - Quick Start
echo ================================================
echo.

cd /d "%~dp0"

echo Choose option:
echo.
echo [1] Full Daily Start (Recommended)
echo [2] Dashboard Only
echo [3] Auto System Only
echo [4] Test System
echo [5] Install Service
echo.

set /p choice="Choose number (1-5): "

if "%choice%"=="1" (
    echo Starting full system...
    npm run start:daily
) else if "%choice%"=="2" (
    echo Opening dashboard...
    npm run dashboard
) else if "%choice%"=="3" (
    echo Starting auto system...
    npm run auto:full
) else if "%choice%"=="4" (
    echo Testing system...
    npm run test:system
) else if "%choice%"=="5" (
    echo Installing service...
    npm run install:service
) else (
    echo Invalid choice
    pause
    goto :eof
)

echo.
pause