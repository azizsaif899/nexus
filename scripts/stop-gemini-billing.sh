#!/bin/bash

# Script to stop all Gemini API usage sources
PROJECT_ID="gen-lang-client-0147492600"

echo "🔍 Checking Cloud Scheduler jobs..."
gcloud scheduler jobs list --project=$PROJECT_ID

echo ""
echo "🔍 Checking Cloud Functions..."
gcloud functions list --project=$PROJECT_ID

echo ""
echo "🔍 Checking Cloud Run services..."
gcloud run services list --project=$PROJECT_ID

echo ""
echo "⚠️  To delete a scheduler job:"
echo "gcloud scheduler jobs delete JOB_NAME --project=$PROJECT_ID"

echo ""
echo "⚠️  To delete a function:"
echo "gcloud functions delete FUNCTION_NAME --region=REGION --project=$PROJECT_ID"

echo ""
echo "⚠️  To stop a Cloud Run service:"
echo "gcloud run services delete SERVICE_NAME --region=REGION --project=$PROJECT_ID"

echo ""
echo "📊 Check billing at:"
echo "https://console.cloud.google.com/billing/reports?project=$PROJECT_ID"
