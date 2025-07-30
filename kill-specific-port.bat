@echo off
echo جاري البحث عن العمليات التي تستخدم البورت %1...

for /f "tokens=5" %%a in ('netstat -aon ^| findstr :%1') do (
    echo العملية التي تستخدم البورت %1: %%a
    taskkill /f /pid %%a
)

echo تم تحرير البورت %1