# Script to stop all Gemini API usage sources
$PROJECT_ID = "gen-lang-client-0147492600"

Write-Host "🔍 Checking Cloud Scheduler jobs..." -ForegroundColor Yellow
gcloud scheduler jobs list --project=$PROJECT_ID

Write-Host ""
Write-Host "🔍 Checking Cloud Functions..." -ForegroundColor Yellow
gcloud functions list --project=$PROJECT_ID

Write-Host ""
Write-Host "🔍 Checking Cloud Run services..." -ForegroundColor Yellow
gcloud run services list --project=$PROJECT_ID

Write-Host ""
Write-Host "⚠️  To delete a scheduler job:" -ForegroundColor Red
Write-Host "gcloud scheduler jobs delete JOB_NAME --project=$PROJECT_ID"

Write-Host ""
Write-Host "⚠️  To delete a function:" -ForegroundColor Red
Write-Host "gcloud functions delete FUNCTION_NAME --region=REGION --project=$PROJECT_ID"

Write-Host ""
Write-Host "⚠️  To stop a Cloud Run service:" -ForegroundColor Red
Write-Host "gcloud run services delete SERVICE_NAME --region=REGION --project=$PROJECT_ID"

Write-Host ""
Write-Host "📊 Check billing at:" -ForegroundColor Cyan
Write-Host "https://console.cloud.google.com/billing/reports?project=$PROJECT_ID"

Write-Host ""
Write-Host "🔗 Check Apps Script triggers at:" -ForegroundColor Cyan
Write-Host 'https://script.google.com/home/projects'
