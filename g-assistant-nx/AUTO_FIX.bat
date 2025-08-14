@echo off
echo 🔧 AzizSys Auto-Fix System v2.0
echo.

cd /d "E:\azizsys5\g-assistant-nx"

echo 🔍 Running system health check...
call pnpm nx run-many --target=lint --all --parallel

echo 🧪 Running tests...
call pnpm nx run-many --target=test --all --parallel

echo 🔨 Auto-fixing code issues...
call pnpm nx run-many --target=lint --all --fix

echo 📦 Checking dependencies...
call pnpm audit --fix

echo 🏗️ Building all projects...
call pnpm nx run-many --target=build --all --parallel

echo 🧹 Cleaning cache...
call pnpm nx reset

echo ✅ Auto-fix completed!
echo 📋 Check the output above for any remaining issues.

pause