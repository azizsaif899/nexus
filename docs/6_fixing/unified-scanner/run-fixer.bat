@echo off
chcp 65001 >nul
echo Pro Safe Fixer - Professional Version
echo =====================================
echo.

if "%1"=="--help" (
    echo Usage:
    echo   run-fixer.bat                    - Normal run
    echo   run-fixer.bat --dry-run          - Test without changing files
    echo   run-fixer.bat --no-git          - Run without Git backup
    echo   run-fixer.bat --custom-report   - Use custom report
    echo   run-fixer.bat --help            - Show this help
    echo.
    pause
    exit /b
)

if "%1"=="--dry-run" (
    echo Test mode - No files will be changed
    node pro-safe-fixer.js --dry-run
) else if "%1"=="--no-git" (
    echo Running without Git backup
    node pro-safe-fixer.js --no-git
) else if "%1"=="--custom-report" (
    set /p report_path="Enter report path: "
    echo Cleaning old reports...
    del "fix-report.json" 2>nul
    del "fix-report.html" 2>nul
    node pro-safe-fixer.js --report "%report_path%"
) else (
    echo Starting safe fix process...
    
    echo Cleaning old reports...
    del "fix-report.json" 2>nul
    del "fix-report.html" 2>nul
    
    echo Using latest scan report: latest-scan-report.json
    node pro-safe-fixer.js --report "latest-scan-report.json"
)

echo.
echo Process completed
echo Check fix-report.html for details
echo.
pause