@echo off
echo 🛠️ AzizSys System Repair & Recovery
echo.

cd /d "E:\azizsys5\g-assistant-nx"

echo 🔄 Step 1: Cleaning node_modules...
rmdir /s /q node_modules 2>nul
rmdir /s /q .nx\cache 2>nul

echo 📦 Step 2: Reinstalling dependencies...
call pnpm install --frozen-lockfile

echo 🔧 Step 3: Rebuilding all packages...
call pnpm nx run-many --target=build --all --parallel

echo 🧪 Step 4: Running health checks...
call pnpm nx run system-health:health-check

echo 🔍 Step 5: Checking for missing files...
if not exist "apps\api\src\main.ts" echo ❌ API main.ts missing
if not exist "apps\admin-dashboard\src\main.tsx" echo ❌ Dashboard main.tsx missing
if not exist "apps\web-chatbot\src\main.tsx" echo ❌ Chatbot main.tsx missing

echo 🏥 Step 6: Running auto-repair scripts...
call node scripts\auto-fix-v2.js

echo ✅ System repair completed!
echo 🚀 Try running START_ALL.bat now

pause