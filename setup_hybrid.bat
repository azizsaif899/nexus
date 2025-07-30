@echo off
chcp 65001 >nul
echo ========================================
echo إعداد الحل الهجين - AzizSys + Node.js
echo ========================================

REM إنشاء مجلد الخدمة الخارجية
if not exist "external_service" mkdir external_service
cd external_service

REM إنشاء package.json
echo {> package.json
echo   "name": "azizsys-gemini-service",>> package.json
echo   "version": "1.0.0",>> package.json
echo   "main": "server.js",>> package.json
echo   "scripts": {>> package.json
echo     "start": "node server.js",>> package.json
echo     "dev": "nodemon server.js">> package.json
echo   },>> package.json
echo   "dependencies": {>> package.json
echo     "@google/generative-ai": "^0.21.0",>> package.json
echo     "express": "^4.18.0",>> package.json
echo     "cors": "^2.8.5",>> package.json
echo     "dotenv": "^16.0.0">> package.json
echo   }>> package.json
echo }>> package.json

REM إنشاء .env
echo GEMINI_API_KEY=your_api_key_here> .env
echo PORT=3000>> .env

REM إنشاء server.js
echo const { GoogleGenerativeAI } = require('@google/generative-ai');> server.js
echo const express = require('express');>> server.js
echo const cors = require('cors');>> server.js
echo require('dotenv').config();>> server.js
echo.>> server.js
echo const app = express();>> server.js
echo app.use(cors());>> server.js
echo app.use(express.json({ limit: '50mb' }));>> server.js
echo.>> server.js
echo const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);>> server.js
echo.>> server.js
echo app.get('/health', (req, res) =^> res.json({ status: 'ok' }));>> server.js
echo.>> server.js
echo app.post('/api/stream', async (req, res) =^> {>> server.js
echo   // Streaming implementation>> server.js
echo   res.json({ message: 'Streaming endpoint ready' });>> server.js
echo });>> server.js
echo.>> server.js
echo app.listen(process.env.PORT, () =^> {>> server.js
echo   console.log(`Gemini service running on port ${process.env.PORT}`);>> server.js
echo });>> server.js

echo ✅ تم إنشاء الخدمة الخارجية
echo.
echo الخطوات التالية:
echo 1. cd external_service
echo 2. npm install
echo 3. أضف مفتاح API في .env
echo 4. npm start
echo.
echo ثم قم بتحديث NODE_SERVICE_URL في Config
pause