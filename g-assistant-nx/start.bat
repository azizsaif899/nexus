@echo off
echo 🚀 تشغيل AzizSys AI Assistant...

REM تثبيت التبعيات إذا لم تكن موجودة
if not exist node_modules (
    echo 📦 تثبيت التبعيات...
    npm install
)

REM تشغيل الخادم
echo 🌐 بدء تشغيل الخادم...
npm start

pause