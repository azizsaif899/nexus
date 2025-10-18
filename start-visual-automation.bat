@echo off
echo 🎯 Starting Visual Automation...
cd /d C:\nexus
powershell -ExecutionPolicy Bypass -File "visual-automation-manager.ps1" -Action start
pause