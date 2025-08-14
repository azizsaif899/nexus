@echo off
echo 🚀 Starting AzizSys AI Assistant v2.0 - Complete System
echo.

cd /d "E:\azizsys5\g-assistant-nx"

echo 📦 Installing dependencies...
call pnpm install

echo 🔧 Starting all services...
start "API Server" cmd /c "pnpm nx serve api"
timeout /t 3 /nobreak >nul

start "Admin Dashboard" cmd /c "pnpm nx serve admin-dashboard"
timeout /t 3 /nobreak >nul

start "Web Chatbot" cmd /c "pnpm nx serve web-chatbot"
timeout /t 3 /nobreak >nul

start "Gemini Backend" cmd /c "pnpm nx serve gemini-backend"

echo ⏳ Waiting for services to start...
timeout /t 10 /nobreak >nul

echo 🌐 Opening dashboards...
start http://localhost:4200
start http://localhost:4201
start http://localhost:4200/crm
start http://localhost:4200/campaigns

echo.
echo ✅ All services started successfully!
echo 🔧 API Server: http://localhost:3000
echo 📊 Admin Dashboard: http://localhost:4200
echo 💬 Web Chatbot: http://localhost:4201
echo 🤖 Gemini Backend: http://localhost:8000
echo 🏢 CRM Dashboard: http://localhost:4200/crm
echo 📈 Campaign Tracker: http://localhost:4200/campaigns
echo.

pause