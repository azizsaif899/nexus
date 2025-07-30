@echo off
echo جاري البحث عن العمليات المشغولة للبورت %1...
for /f "tokens=5" %%a in ('netstat -aon ^| findstr :%1') do (
    echo قتل العملية %%a
    taskkill /f /pid %%a
)
echo تم تحرير البورت %1