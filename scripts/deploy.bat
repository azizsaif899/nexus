@echo off
setlocal

echo.
echo =================================================
echo  G-Assistant - Automated Deployment Script
echo =================================================
echo.

echo [INFO] Verifying prerequisites...

REM Check if node_modules exists
if not exist "node_modules" (
    echo [WARN] node_modules folder not found.
    echo [INFO] Running 'npm install' to install dependencies...
    npm install
    if %errorlevel% neq 0 (
        echo [ERROR] Failed to install npm dependencies. Please check for errors.
        goto :end
    )
    echo [SUCCESS] Dependencies installed successfully.
) else (
    echo [SUCCESS] node_modules found.
)

echo.
echo [INFO] Starting the build and deployment process...
echo        (This will run 'npm run deploy')
echo.

REM Run the deployment command from package.json
npm run deploy

REM Check the result of the last command
if %errorlevel% neq 0 (
    echo.
    echo [ERROR] ^>^>^> DEPLOYMENT FAILED! ^<^<^<
    echo         Please review the error messages above.
    goto :end
)

echo.
echo [SUCCESS] ^>^>^> DEPLOYMENT SUCCESSFUL! ^<^<^<
echo           Your project has been built and pushed to Google Apps Script.
echo.

REM The script ID is taken from your .clasp.json file
set SCRIPT_ID=1dbSoTHmQ6z6WkG98lVqCyatm8mwZCTVrSqefwNcxoTWsQ_I3ZL_7q2zm
echo [INFO] Opening your Apps Script project in the browser...
start "" "https://script.google.com/d/%SCRIPT_ID%/edit"

:end
echo.
echo Press any key to exit.
pause >nul