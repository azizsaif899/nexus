@echo off
echo Testing direct vite command...
cd /d "c:\nexus\apps\nexus-ai-main"
echo Current directory: %cd%
echo.
echo Files check:
if exist package.json echo ✅ package.json
if exist src\main.tsx echo ✅ main.tsx  
if exist vite.config.ts echo ✅ vite.config.ts
if exist node_modules echo ✅ node_modules
echo.
echo Starting vite directly...
npx vite --port 3000 --host 0.0.0.0 --open