@echo off
chcp 65001 >nul
title مراقب الوثائق التلقائي - AzizSys
echo 👁️ مراقب الوثائق التلقائي - AzizSys
echo =====================================
echo.
echo 🔄 سيتم تحديث docs_viewer.html تلقائياً عند إضافة أو تعديل ملفات .md
echo 🛑 اضغط Ctrl+C للإيقاف
echo.

cd /d "%~dp0"
node watch_docs.cjs