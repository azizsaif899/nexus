@echo off
title Nexus Master Manager - Windows Batch Launcher
color 0A
chcp 65001 > nul

echo.
echo ========================================
echo    🚀 Nexus Master Manager Launcher
echo    مدير تطبيقات Nexus الشامل
echo ========================================
echo.
echo Starting PowerShell Manager...
echo.

powershell -ExecutionPolicy Bypass -File "%~dp0Nexus-Master-Manager.ps1"

pause