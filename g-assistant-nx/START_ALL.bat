@echo off
title AzizSys Full Stack Launcher
color 0A

echo.
echo ================================================
echo    🚀 AzizSys AI Assistant Full Stack
echo ================================================
echo.
echo Starting all services...
echo.

echo 📡 Starting API Server...
start "API Server" cmd /k "cd apps\api && npm run start:dev"
timeout /t 3 >nul

echo 💬 Starting Web Chatbot...
start "Web Chatbot" cmd /k "cd apps\web-chatbot && npm start"
timeout /t 2 >nul

echo 👨‍💼 Starting Admin Dashboard...
start "Admin Dashboard" cmd /k "cd apps\admin-dashboard && npm start"
timeout /t 2 >nul

echo 📊 Starting Dashboard Monitor...
start "Dashboard Monitor" cmd /k "cd docs\6_fixing\dashboard && set DASHBOARD_PORT=3001 && node server.js"

echo.
echo ✅ All services started!
echo.
echo 🌐 URLs:
echo   - API: http://localhost:3333
echo   - API Docs: http://localhost:3333/api/docs
echo   - Chatbot: http://localhost:4200
echo   - Admin: http://localhost:4201
echo   - Monitor: http://localhost:3001
echo.
pause