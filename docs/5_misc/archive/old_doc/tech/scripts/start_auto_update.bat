@echo off
chcp 65001 >nul
title نظام التحديث التلقائي للوثائق - AzizSys
color 0A

echo.
echo ╔══════════════════════════════════════════════════════════════╗
echo ║                    🔄 نظام التحديث التلقائي                    ║
echo ║                        AzizSys Docs                          ║
echo ╚══════════════════════════════════════════════════════════════╝
echo.

cd /d "%~dp0"

echo 📂 المجلد الحالي: %CD%
echo 📊 عدد الملفات الحالية: 
dir *.md /b | find /c /v ""
echo.

echo 🔍 فحص الملفات...
if not exist "docs_viewer.html" (
    echo ❌ ملف docs_viewer.html غير موجود!
    pause
    exit /b 1
)

echo ✅ جميع الملفات موجودة
echo.

echo 🚀 بدء التحديث التلقائي...
echo ⏰ سيتم تحديث docs_viewer.html عند إضافة أو تعديل ملفات .md
echo 🌐 يمكنك فتح docs_viewer.html في المتصفح لرؤية النتائج
echo 🛑 اضغط Ctrl+C للإيقاف
echo.

node watch_docs.cjs

echo.
echo 🛑 تم إيقاف المراقب
pause