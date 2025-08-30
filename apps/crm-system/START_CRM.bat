@echo off
echo 🚀 Starting CRM System...
echo.

cd /d "e:\azizsys5\g-assistant-nx"

echo Installing dependencies...
call npm install

echo.
echo 🎯 Starting CRM System on port 4200...
echo.
echo 📱 Access CRM at: http://localhost:4200
echo.

call nx serve crm-system

pause