@echo off
chcp 65001 >nul
title NexusChat Pro - AzizSys AI Assistant

echo.
echo +--------------------------------------------------------------+
echo ^|                    NexusChat Pro v2.0                       ^|
echo ^|              Advanced AI Chat Interface                      ^|
echo ^|                  AzizSys AI Assistant                        ^|
echo +--------------------------------------------------------------+
echo.

:MENU
echo اختر خياراً:
echo.
echo [1] تشغيل NexusChat Pro (التطوير)
echo [2] بناء المشروع للإنتاج
echo [3] تشغيل النسخة المبنية
echo [4] تثبيت التبعيات
echo [5] إعداد متغيرات البيئة
echo [6] فتح المجلد في VS Code
echo [0] خروج
echo.

set /p choice="أدخل اختيارك (0-6): "

if "%choice%"=="1" goto DEV_MODE
if "%choice%"=="2" goto BUILD_PROJECT
if "%choice%"=="3" goto SERVE_BUILT
if "%choice%"=="4" goto INSTALL_DEPS
if "%choice%"=="5" goto SETUP_ENV
if "%choice%"=="6" goto OPEN_VSCODE
if "%choice%"=="0" goto EXIT
goto INVALID_CHOICE

:DEV_MODE
echo.
echo 🚀 تشغيل NexusChat Pro في وضع التطوير...
echo.
echo تأكد من وجود مفتاح API في ملف .env
echo سيتم فتح المتصفح تلقائياً على: http://localhost:5173
echo.
echo للإيقاف: اضغط Ctrl+C
echo.
npm run dev
pause
goto MENU

:BUILD_PROJECT
echo.
echo 🔨 بناء المشروع للإنتاج...
echo.
npm run build
echo.
echo ✅ تم بناء المشروع بنجاح!
echo الملفات متوفرة في مجلد: dist/
echo.
pause
goto MENU

:SERVE_BUILT
echo.
echo 🌐 تشغيل النسخة المبنية...
echo.
echo سيتم فتح المتصفح على: http://localhost:5173
echo.
npm run serve
pause
goto MENU

:INSTALL_DEPS
echo.
echo 📦 تثبيت التبعيات...
echo.
npm install
echo.
echo ✅ تم تثبيت التبعيات بنجاح!
echo.
pause
goto MENU

:SETUP_ENV
echo.
echo ⚙️ إعداد متغيرات البيئة...
echo.

if not exist .env (
    if exist .env.example (
        copy .env.example .env
        echo ✅ تم إنشاء ملف .env من المثال
    ) else (
        echo # Gemini API Configuration > .env
        echo VITE_API_KEY=your_gemini_api_key_here >> .env
        echo ✅ تم إنشاء ملف .env جديد
    )
) else (
    echo ⚠️ ملف .env موجود بالفعل
)

echo.
echo 📝 يرجى تحرير ملف .env وإضافة مفتاح Gemini API الخاص بك:
echo VITE_API_KEY=your_actual_api_key_here
echo.
echo هل تريد فتح ملف .env للتحرير؟ (y/n)
set /p edit_env="اختيارك: "

if /i "%edit_env%"=="y" (
    notepad .env
)

pause
goto MENU

:OPEN_VSCODE
echo.
echo 💻 فتح المشروع في VS Code...
echo.
code .
echo.
echo ✅ تم فتح المشروع في VS Code
echo.
pause
goto MENU

:INVALID_CHOICE
echo.
echo ❌ اختيار غير صحيح! يرجى اختيار رقم من 0 إلى 6.
echo.
pause
goto MENU

:EXIT
echo.
echo 👋 شكراً لاستخدام NexusChat Pro!
echo.
echo 🌟 جزء من AzizSys AI Assistant v2.0
echo 🚀 تم تطويره بواسطة فريق AzizSys
echo.
pause
exit