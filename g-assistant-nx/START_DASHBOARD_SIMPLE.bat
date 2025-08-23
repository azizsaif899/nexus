@echo off
echo Starting AzizSys Dashboard...

cd /d "E:\azizsys5\g-assistant-nx"

echo Installing dependencies...
call npm install

echo Starting Admin Dashboard...
cd apps\admin-dashboard
call npm install
call npm run dev

pause