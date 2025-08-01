@echo off
chcp 65001 >nul

echo نشر مشروع G-Assistant...

:: إنشاء مجلد dist
if not exist "dist" mkdir dist

:: نسخ الملفات الأساسية
copy "00_initializer.gs" "dist\" >nul 2>&1
copy "99_Code.gs" "dist\" >nul 2>&1
copy "appsscript.json" "dist\" >nul 2>&1

:: نسخ المجلدات
xcopy "00_utils" "dist\00_utils\" /E /I /Y >nul 2>&1
xcopy "10_ui" "dist\10_ui\" /E /I /Y >nul 2>&1
xcopy "20_ai" "dist\20_ai\" /E /I /Y >nul 2>&1
xcopy "25_ai_agents" "dist\25_ai_agents\" /E /I /Y >nul 2>&1
xcopy "30_tools" "dist\30_tools\" /E /I /Y >nul 2>&1
xcopy "35_accounting" "dist\35_accounting\" /E /I /Y >nul 2>&1
xcopy "40_memory" "dist\40_memory\" /E /I /Y >nul 2>&1
xcopy "40_security" "dist\40_security\" /E /I /Y >nul 2>&1
xcopy "50_analytics" "dist\50_analytics\" /E /I /Y >nul 2>&1
xcopy "55_operations" "dist\55_operations\" /E /I /Y >nul 2>&1
xcopy "70_telemetry" "dist\70_telemetry\" /E /I /Y >nul 2>&1
xcopy "75_metrics" "dist\75_metrics\" /E /I /Y >nul 2>&1
xcopy "80_api" "dist\80_api\" /E /I /Y >nul 2>&1
xcopy "85_tests" "dist\85_tests\" /E /I /Y >nul 2>&1
xcopy "90_System" "dist\90_System\" /E /I /Y >nul 2>&1
xcopy "config" "dist\config\" /E /I /Y >nul 2>&1
xcopy "updated_docs" "dist\updated_docs\" /E /I /Y >nul 2>&1
xcopy "doc" "dist\doc\" /E /I /Y >nul 2>&1
xcopy "scripts" "dist\scripts\" /E /I /Y >nul 2>&1
xcopy "tests" "dist\tests\" /E /I /Y >nul 2>&1

echo تم نسخ الملفات بنجاح

:: الانتقال لمجلد dist والنشر
cd dist
clasp push --force
cd ..

echo تم النشر بنجاح
pause