@echo off
echo 🔧 Generating Firebase Data Connect SDK...
echo.

cd /d "%~dp0"

echo 📦 Generating JavaScript SDK...
firebase dataconnect:sdk:generate --language=javascript --force

echo.
echo ✅ SDK Generated Successfully!
echo 📁 Location: ../g-assistant-nx/dataconnect-generated/js/example-connector
echo.
echo 🔄 Installing dependencies...
cd ../g-assistant-nx
pnpm install

echo.
echo 🎉 Ready to use! Import the SDK in your applications:
echo import { dataConnect } from '@azizsys/data-connect-core';
echo.

pause