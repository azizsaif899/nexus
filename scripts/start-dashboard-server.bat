@echo off
echo 🚀 Starting AzizSys Dashboard Server...

cd /d e:\azizsys5\g-assistant-nx\apps\admin-dashboard

echo 🌐 Starting HTTP server for dashboard...
echo Dashboard will be available at: http://localhost:3000

start cmd /k "python -m http.server 3000 2>nul || npx http-server -p 3000 2>nul || php -S localhost:3000 2>nul"

timeout /t 3 /nobreak >nul

echo ✅ Dashboard server started!
echo 🌐 Open: http://localhost:3000
echo 📊 Features:
echo    - Real-time CRM stats
echo    - WhatsApp integration status  
echo    - GTM analytics tracking
echo    - System health monitoring

start http://localhost:3000

pause