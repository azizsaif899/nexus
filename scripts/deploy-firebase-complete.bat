@echo off
echo ========================================
echo   Firebase Multi-tenant Deployment
echo ========================================

echo [1/6] Installing Firebase CLI...
npm install -g firebase-tools

echo [2/6] Login to Firebase...
firebase login

echo [3/6] Initialize Firebase project...
firebase init

echo [4/6] Building applications...
nx build nexus-ai-main --configuration=production
nx build admin-dashboard --configuration=production
nx build api --configuration=production

echo [5/6] Deploying Firestore rules...
firebase deploy --only firestore:rules

echo [6/6] Deploying all services...
firebase deploy --only hosting,functions

echo ========================================
echo   Deployment URLs:
echo   Main App: https://nexus-ai-main.web.app
echo   Admin: https://admin-nexus-ai.web.app  
echo   API: https://us-central1-nexus-ai.cloudfunctions.net/api
echo ========================================
pause