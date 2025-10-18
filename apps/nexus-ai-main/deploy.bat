@echo off
echo Building Nexus AI for production...
npm run build

echo Deploying to Firebase...
npx firebase-tools deploy --only hosting

echo Deployment complete!
echo Visit: https://nexxs.ai
pause