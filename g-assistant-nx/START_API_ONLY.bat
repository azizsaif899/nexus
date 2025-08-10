@echo off
title AzizSys API Server
color 0B

echo.
echo ================================================
echo    🚀 AzizSys API Server
echo ================================================
echo.

cd apps\api
echo 📡 Starting NestJS API Server...
echo 🌐 URL: http://localhost:3333
echo 📚 Docs: http://localhost:3333/api/docs
echo.
npm run start:dev