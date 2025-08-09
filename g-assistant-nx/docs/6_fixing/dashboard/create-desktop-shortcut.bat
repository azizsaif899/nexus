@echo off
echo 🖥️ إنشاء اختصار سطح المكتب للوحة التحكم
echo ==========================================

set DESKTOP=%USERPROFILE%\Desktop
set SHORTCUT_NAME=لوحة تحكم الإصلاح الذاتي.lnk
set TARGET_FILE=%~dp0standalone.html

echo 📁 إنشاء اختصار على سطح المكتب...

powershell -Command "& {$WshShell = New-Object -comObject WScript.Shell; $Shortcut = $WshShell.CreateShortcut('%DESKTOP%\%SHORTCUT_NAME%'); $Shortcut.TargetPath = '%TARGET_FILE%'; $Shortcut.WorkingDirectory = '%~dp0'; $Shortcut.IconLocation = 'shell32.dll,13'; $Shortcut.Description = 'لوحة تحكم الإصلاح الذاتي - G-Assistant NX'; $Shortcut.Save()}"

if exist "%DESKTOP%\%SHORTCUT_NAME%" (
    echo ✅ تم إنشاء الاختصار بنجاح!
    echo 📍 الموقع: %DESKTOP%\%SHORTCUT_NAME%
    echo.
    echo 💡 الآن يمكنك:
    echo    1. النقر المزدوج على الاختصار لفتح لوحة التحكم
    echo    2. سحب ملفات JSON من مجلد reports إلى اللوحة
    echo    3. استخدام البيانات التجريبية للاختبار
    echo.
    echo 📂 ملفات التقارير في: docs\6_fixing\reports\
) else (
    echo ❌ فشل في إنشاء الاختصار
)

pause