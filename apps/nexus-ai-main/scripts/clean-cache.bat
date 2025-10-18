@echo off
title Clean Cache
echo Cleaning cache and temporary files...

REM Clean Vite cache
if exist "node_modules\.vite" (
    echo Removing Vite cache...
    rmdir /s /q "node_modules\.vite"
)

REM Clean dist
if exist "dist" (
    echo Removing dist...
    rmdir /s /q "dist"
)

REM Clean npm cache
echo Cleaning npm cache...
npm cache clean --force >nul 2>&1

echo Cache cleaned successfully!