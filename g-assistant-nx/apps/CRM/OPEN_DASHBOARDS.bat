@echo off
echo 🚀 Opening AzizSys CRM Dashboards...
echo.

cd /d "E:\azizsys5\g-assistant-nx\apps\CRM"

echo 🌐 Opening CRM Dashboard...
start "" "crm.html"

echo ⏳ Waiting...
timeout /t 2 /nobreak >nul

echo 📊 Opening Campaign Tracker...
start "" "campaigns.html"

echo.
echo ✅ CRM Dashboards opened successfully!
echo 📁 Location: E:\azizsys5\g-assistant-nx\apps\CRM\
echo 🏢 CRM Dashboard: crm.html
echo 📊 Campaign Tracker: campaigns.html
echo.

pause