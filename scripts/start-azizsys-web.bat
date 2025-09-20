@echo off
echo 🚀 Starting AzizSys Web Applications...

echo 📊 Starting Admin Dashboard...
start cmd /k "cd /d e:\azizsys5\g-assistant-nx && npm run dev:admin-dashboard"

timeout /t 3 /nobreak >nul

echo 💬 Starting Web Chatbot...
start cmd /k "cd /d e:\azizsys5\g-assistant-nx && npm run dev:web-chatbot"

timeout /t 3 /nobreak >nul

echo 🤖 Starting AI Dashboard...
start cmd /k "cd /d e:\azizsys5\g-assistant-nx && npm run dev:ai-dashboard"

echo ⏳ Waiting for applications to start...
timeout /t 10 /nobreak >nul

echo ✅ AzizSys Applications Started!
echo.
echo 🌐 Available URLs:
echo    📊 Admin Dashboard: http://localhost:3000
echo    💬 Web Chatbot: http://localhost:4200  
echo    🤖 AI Dashboard: http://localhost:4201
echo    🏢 Odoo CRM: http://localhost:8070
echo.
pause