@echo off
echo ========================================
echo   نشر n-chat على Cloud Run
echo ========================================

echo [1/5] بناء التطبيق...
call nx build n-chat --configuration=production

echo [2/5] بناء Docker image...
cd apps\n-chat
docker build -t gcr.io/nexus-ai-assistant/n-chat:latest .

echo [3/5] رفع الصورة لـ Google Container Registry...
docker push gcr.io/nexus-ai-assistant/n-chat:latest

echo [4/5] نشر على Cloud Run...
gcloud run deploy n-chat ^
  --image gcr.io/nexus-ai-assistant/n-chat:latest ^
  --platform managed ^
  --region us-central1 ^
  --allow-unauthenticated ^
  --port 8080 ^
  --memory 1Gi ^
  --cpu 1 ^
  --min-instances 0 ^
  --max-instances 10

echo [5/5] الحصول على URL...
gcloud run services describe n-chat --region=us-central1 --format="value(status.url)"

echo ========================================
echo ✅ تم النشر بنجاح!
echo التطبيق متاح على Cloud Run
echo الواجهة الرئيسية على Firebase
echo ========================================
pause