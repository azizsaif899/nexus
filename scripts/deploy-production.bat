@echo off
echo ========================================
echo   Nexus AI - Production Deployment
echo ========================================
echo.

echo [1/5] Building all applications...
call nx run-many -t build --configuration=production --parallel=3

echo.
echo [2/5] Deploying Frontend apps to Firebase...
call firebase deploy --only hosting

echo.
echo [3/5] Building API Docker image...
docker build -t nexus-api:latest -f apps\api\Dockerfile .

echo.
echo [4/5] Deploying to Cloud Run...
gcloud run deploy nexus-api ^
  --image nexus-api:latest ^
  --platform managed ^
  --region us-central1 ^
  --allow-unauthenticated ^
  --min-instances 1 ^
  --max-instances 50 ^
  --memory 2Gi

echo.
echo [5/5] Running post-deployment checks...
curl -f https://nexus-api-xxxxx.run.app/health || echo "API health check failed!"

echo.
echo ========================================
echo   Deployment Complete!
echo ========================================
pause
