@echo off
echo 🔍 البحث عن العمليات على المنفذ 3000...

for /f "tokens=5" %%a in ('netstat -ano ^| findstr :3000') do (
    echo 🛑 إيقاف العملية %%a
    taskkill /PID %%a /F >nul 2>&1
)

echo ✅ تم تنظيف المنفذ 3000
pause