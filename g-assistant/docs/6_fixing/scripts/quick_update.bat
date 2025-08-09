@echo off
chcp 65001 >nul
title تحديث سريع للوثائق - AzizSys
color 0B

echo.
echo ╔══════════════════════════════════════════════════════════════╗
echo ║                      ⚡ تحديث سريع                           ║
echo ║                    AzizSys Documentation                     ║
echo ╚══════════════════════════════════════════════════════════════╝
echo.

cd /d "%~dp0"

echo 📊 إحصائيات قبل التحديث:
echo ├─ عدد ملفات .md: 
dir *.md /b | find /c /v ""
echo ├─ حجم docs_viewer.html: 
for %%A in (docs_viewer.html) do echo %%~zA bytes
echo └─ آخر تعديل: 
for %%A in (docs_viewer.html) do echo %%~tA
echo.

echo 🔄 تشغيل التحديث...
node auto_update_docs.cjs

echo.
echo 📊 إحصائيات بعد التحديث:
echo ├─ حجم docs_viewer.html الجديد: 
for %%A in (docs_viewer.html) do echo %%~zA bytes
echo └─ وقت التحديث: %date% %time%
echo.

echo ✅ تم التحديث بنجاح!
echo 🌐 يمكنك الآن فتح docs_viewer.html في المتصفح
echo.

set /p choice="هل تريد فتح docs_viewer.html الآن؟ (y/n): "
if /i "%choice%"=="y" start docs_viewer.html

pause