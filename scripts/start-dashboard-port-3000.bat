@echo off
echo 🚀 Starting AzizSys Dashboard on Port 3000...

cd /d e:\azizsys5\g-assistant-nx\apps\admin-dashboard

echo 🌐 Starting HTTP server...
echo Dashboard: http://localhost:3000

start cmd /k "python -m http.server 3000 2>nul || npx http-server -p 3000 2>nul || php -S localhost:3000 2>nul"

timeout /t 3 /nobreak >nul

echo ✅ Dashboard started successfully!
echo 🌐 URL: http://localhost:3000
echo 🏢 Odoo CRM: http://localhost:8070
echo 📊 GTM Container: GTM-58RWKC76

start http://localhost:3000

pause