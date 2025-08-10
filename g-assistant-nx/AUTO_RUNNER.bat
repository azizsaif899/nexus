@echo off
chcp 65001 >nul
title G-Assistant NX - تشغيل تلقائي مستمر
color 0B

echo 🚀 بدء النظام التلقائي المستمر...
echo ⏰ سيعمل كل 5 دقائق
echo 🛑 للإيقاف اضغط Ctrl+C

cd /d "%~dp0"

:loop
echo.
echo ================================
echo ⏰ %date% %time%
echo 🔄 تشغيل دورة إصلاح جديدة...
echo ================================

npx ts-node docs/6_fixing/auto-fix-system/index.ts --cycle

echo ✅ انتهت الدورة - انتظار 5 دقائق...
timeout /t 300 /nobreak >nul

goto loop