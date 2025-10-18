@echo off
cd /d "C:\nexus\apps\nexus-ai-main"
if exist app rmdir /s /q app
if exist components rmdir /s /q components
if exist lib rmdir /s /q lib
if exist node_modules_old rmdir /s /q node_modules_old
if exist project rmdir /s /q project
echo Folders deleted successfully