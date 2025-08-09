@echo off
echo Starting AzizSys Web Interface...
cd /d "%~dp0"
node backend/simple-server.js
pause