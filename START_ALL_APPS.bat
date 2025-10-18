@echo off
echo Starting Nexus AI Platform...
echo.

echo Starting Main Landing Page (Port 3000)...
start cmd /k "cd /d %~dp0\apps\nexus-ai-main && npm run dev"

timeout /t 3 /nobreak > nul

echo Starting N-Chat Application (Port 3003)...
start cmd /k "cd /d %~dp0\apps\n-chat && npm run dev"

timeout /t 3 /nobreak > nul

echo Starting Visual Automation (Port 3005)...
start cmd /k "cd /d %~dp0\apps\visual-automation && npm run dev"

timeout /t 3 /nobreak > nul

echo Starting Admin Dashboard (Port 3001)...
start cmd /k "cd /d %~dp0\apps\admin-dashboard && npm run dev"

timeout /t 3 /nobreak > nul

echo Starting API Server (Port 3000 - NestJS)...
start cmd /k "cd /d %~dp0\apps\api && npm run start:dev"

timeout /t 3 /nobreak > nul

echo Starting CRM System (Port 3002)...
start cmd /k "cd /d %~dp0\apps\crm-system && npm run dev"

echo.
echo All applications are starting...
echo Main page will be available at: http://localhost:3000
echo.
echo Press any key to close this window...
pause > nul