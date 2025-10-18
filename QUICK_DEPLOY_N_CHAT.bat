@echo off
echo ========================================
echo   نشر n-chat مباشرة (بدون build)
echo ========================================

echo [1/4] إنشاء Dockerfile مبسط...
cd apps\n-chat

echo FROM node:20-alpine > Dockerfile.simple
echo WORKDIR /app >> Dockerfile.simple
echo COPY package*.json ./ >> Dockerfile.simple
echo RUN npm install >> Dockerfile.simple
echo COPY . . >> Dockerfile.simple
echo EXPOSE 8080 >> Dockerfile.simple
echo ENV PORT=8080 >> Dockerfile.simple
echo CMD ["npm", "start"] >> Dockerfile.simple

echo [2/4] بناء Docker image...
docker build -f Dockerfile.simple -t gcr.io/gen-lang-client-0147492600/n-chat:latest .

echo [3/4] رفع للـ Container Registry...
docker push gcr.io/gen-lang-client-0147492600/n-chat:latest

echo [4/4] نشر على Cloud Run...
gcloud run deploy n-chat ^
  --image gcr.io/gen-lang-client-0147492600/n-chat:latest ^
  --platform managed ^
  --region us-central1 ^
  --allow-unauthenticated ^
  --port 8080 ^
  --memory 1Gi

echo ========================================
echo ✅ تم النشر!
gcloud run services describe n-chat --region=us-central1 --format="value(status.url)"
echo ========================================
pause