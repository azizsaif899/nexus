@echo off
echo ========================================
echo Checking Google Cloud Resources
echo ========================================
echo.

set PROJECT_ID=gen-lang-client-0147492600

echo [1] Checking Cloud Scheduler jobs...
gcloud scheduler jobs list --project=%PROJECT_ID%
echo.

echo [2] Checking Cloud Functions...
gcloud functions list --project=%PROJECT_ID%
echo.

echo [3] Checking Cloud Run services...
gcloud run services list --project=%PROJECT_ID%
echo.

echo ========================================
echo Manual Actions Required:
echo ========================================
echo.
echo [Apps Script] Open: https://script.google.com/home/projects
echo [Billing] Open: https://console.cloud.google.com/billing/reports?project=%PROJECT_ID%
echo [Scheduler] Open: https://console.cloud.google.com/cloudscheduler?project=%PROJECT_ID%
echo.
pause
