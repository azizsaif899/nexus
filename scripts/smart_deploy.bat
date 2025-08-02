@echo off
setlocal enabledelayedexpansion

echo 🤖 نظام النشر الذكي - Smart Deploy System
echo ==========================================

:: تحديد المساعد المسؤول
set /p ASSISTANT="من المساعد المسؤول؟ (copilot/gemini/human): "
if "%ASSISTANT%"=="" set ASSISTANT=human

:: تحديد نوع التغيير
echo.
echo أنواع التغييرات المتاحة:
echo 1. UI - واجهة المستخدم
echo 2. AI - ذكاء اصطناعي  
echo 3. CONFIG - إعدادات
echo 4. CRITICAL - حرج
echo.
set /p CHANGE_TYPE_NUM="اختر نوع التغيير (1-4): "

:: تحويل الرقم إلى نوع
if "%CHANGE_TYPE_NUM%"=="1" set CHANGE_TYPE=ui
if "%CHANGE_TYPE_NUM%"=="2" set CHANGE_TYPE=ai
if "%CHANGE_TYPE_NUM%"=="3" set CHANGE_TYPE=config
if "%CHANGE_TYPE_NUM%"=="4" set CHANGE_TYPE=critical

:: وصف التغيير
set /p DESCRIPTION="وصف التغيير: "
if "%DESCRIPTION%"=="" set DESCRIPTION=تحديث عام

:: فحص الحالة
echo.
echo 🔍 فحص حالة Git...
git status --porcelain > temp_status.txt
set /p GIT_STATUS=<temp_status.txt
del temp_status.txt

if "%GIT_STATUS%"=="" (
    echo ✅ لا توجد تغييرات للرفع
    pause
    exit /b 0
)

:: فحص التضارب
echo 🔍 فحص التضارب مع المساعدين الآخرين...
:: هنا يمكن إضافة فحص أكثر تعقيداً

:: إنشاء رسالة commit ذكية
call :generate_commit_message

:: عرض ملخص
echo.
echo 📋 ملخص العملية:
echo المساعد: %ASSISTANT%
echo نوع التغيير: %CHANGE_TYPE%
echo الوصف: %DESCRIPTION%
echo رسالة Commit: %COMMIT_MESSAGE%
echo.

:: تأكيد المتابعة
set /p CONFIRM="هل تريد المتابعة؟ (y/n): "
if /i not "%CONFIRM%"=="y" (
    echo ❌ تم الإلغاء
    pause
    exit /b 1
)

:: تنفيذ العملية
echo.
echo 🚀 بدء عملية النشر...

:: إضافة الملفات
echo 📁 إضافة الملفات...
git add .
if errorlevel 1 (
    echo ❌ خطأ في إضافة الملفات
    pause
    exit /b 1
)

:: إنشاء commit
echo 💾 إنشاء commit...
git commit -m "%COMMIT_MESSAGE%"
if errorlevel 1 (
    echo ❌ خطأ في إنشاء commit
    pause
    exit /b 1
)

:: رفع إلى GitHub
echo 🌐 رفع إلى GitHub...
git push origin master
if errorlevel 1 (
    echo ❌ خطأ في الرفع إلى GitHub
    pause
    exit /b 1
)

:: تسجيل العملية
call :log_operation

echo.
echo ✅ تم النشر بنجاح!
echo 🔗 المشروع: https://github.com/azizsaif899/g-assistant
echo 📊 المساعد %ASSISTANT% رفع تغييرات من نوع %CHANGE_TYPE%

:: إشعار المساعدين الآخرين
call :notify_other_assistants

pause
exit /b 0

:generate_commit_message
:: توليد رسالة commit ذكية
set EMOJI=🔧
if "%CHANGE_TYPE%"=="ui" set EMOJI=🎨
if "%CHANGE_TYPE%"=="ai" set EMOJI=🤖
if "%CHANGE_TYPE%"=="config" set EMOJI=⚙️
if "%CHANGE_TYPE%"=="critical" set EMOJI=🚨

set COMMIT_MESSAGE=%EMOJI% %ASSISTANT%: %DESCRIPTION%

:: إضافة timestamp
for /f "tokens=1-3 delims=/ " %%a in ('date /t') do set DATE=%%c-%%a-%%b
for /f "tokens=1-2 delims=: " %%a in ('time /t') do set TIME=%%a:%%b
set COMMIT_MESSAGE=%COMMIT_MESSAGE% [%DATE% %TIME%]

goto :eof

:log_operation
:: تسجيل العملية في ملف log
echo %DATE% %TIME% - %ASSISTANT% - %CHANGE_TYPE% - %DESCRIPTION% >> deploy_log.txt
goto :eof

:notify_other_assistants
:: إشعار المساعدين الآخرين (محاكاة)
echo 📢 إشعار المساعدين الآخرين...

if not "%ASSISTANT%"=="copilot" (
    echo   → إشعار Copilot: تحديث %CHANGE_TYPE%
)

if not "%ASSISTANT%"=="gemini" (
    echo   → إشعار Gemini: تحديث %CHANGE_TYPE%
)

:: يمكن إضافة webhook أو API call هنا
goto :eof