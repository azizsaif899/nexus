@echo off
title Nexus AI - Master Control
color 0A
cls

:MENU
echo ========================================
echo        NEXUS AI - MASTER CONTROL
echo ========================================
echo.
echo 1. Start Development Server
echo 2. Kill Port 3000 Processes
echo 3. Clean Cache
echo 4. Diagnose System
echo 5. Install Dependencies
echo 6. Full Reset (Clean + Install)
echo 7. Exit
echo.
set /p choice="Choose option (1-7): "

if "%choice%"=="1" goto START_DEV
if "%choice%"=="2" goto KILL_PORT
if "%choice%"=="3" goto CLEAN_CACHE
if "%choice%"=="4" goto DIAGNOSE
if "%choice%"=="5" goto INSTALL
if "%choice%"=="6" goto FULL_RESET
if "%choice%"=="7" exit
goto MENU

:START_DEV
cls
echo Starting Nexus AI Development Server...
call kill-port.bat 3000
npm run dev
pause
goto MENU

:KILL_PORT
cls
call kill-port.bat 3000
echo Port 3000 processes killed.
pause
goto MENU

:CLEAN_CACHE
cls
call clean-cache.bat
pause
goto MENU

:DIAGNOSE
cls
powershell -ExecutionPolicy Bypass -File "diagnose.ps1"
pause
goto MENU

:INSTALL
cls
echo Installing dependencies...
npm install
echo Dependencies installed.
pause
goto MENU

:FULL_RESET
cls
echo Full reset: cleaning and reinstalling...
call clean-cache.bat
if exist "node_modules" rmdir /s /q "node_modules"
if exist "package-lock.json" del "package-lock.json"
npm install
echo Full reset completed.
pause
goto MENU