@echo off
echo 🚀 Opening AzizSys Developer Dashboard...
echo.

cd /d "E:\azizsys5\g-assistant-nx\apps\admin-dashboard"

echo 🎨 Opening Main Dashboard...
start "" "AzizSys Developer Dashboard.html"

echo ⏳ Waiting...
timeout /t 2 /nobreak >nul

echo 📊 Opening Campaign Tracker...
start "" "campaigns.html"

echo.
echo ✅ Dashboards opened successfully!
echo 📁 Location: E:\azizsys5\g-assistant-nx\apps\admin-dashboard\
echo 🎨 Main Dashboard: 🎨 AzizSys Developer Dashboard.html
echo 📊 Campaign Tracker: campaigns.html
echo.

pause