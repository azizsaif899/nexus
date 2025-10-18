#!/bin/bash

# Firebase Setup Script for FlowCanvasAI
# This script helps you set up Firebase project quickly

set -e

echo "🔥 إعداد Firebase لمشروع FlowCanvasAI"
echo "=================================="

# Check if Firebase CLI is installed
if ! command -v firebase &> /dev/null; then
    echo "❌ Firebase CLI غير مُثبت. يرجى تثبيته أولاً:"
    echo "npm install -g firebase-tools"
    exit 1
fi

# Login to Firebase
echo "🔐 تسجيل الدخول إلى Firebase..."
firebase login

# Initialize Firebase project
echo "🚀 تهيئة مشروع Firebase..."
firebase init

# Set up environment variables
echo "⚙️ إعداد متغيرات البيئة..."
if [ ! -f .env.local ]; then
    echo "إنشاء ملف .env.local..."
    cat > .env.local << EOL
# Firebase Configuration
NEXT_PUBLIC_FIREBASE_API_KEY=your_api_key_here
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=your_project.firebaseapp.com
NEXT_PUBLIC_FIREBASE_PROJECT_ID=your_project_id
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=your_project.appspot.com
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=your_sender_id
NEXT_PUBLIC_FIREBASE_APP_ID=your_app_id

# Gemini AI Configuration
GEMINI_API_KEY=your_gemini_api_key_here

# Next.js Configuration
NEXTAUTH_SECRET=your_nextauth_secret_here
NEXTAUTH_URL=http://localhost:3000
EOL
    echo "✅ تم إنشاء ملف .env.local"
    echo "⚠️ يرجى تحديث القيم في .env.local"
else
    echo "ℹ️ ملف .env.local موجود بالفعل"
fi

# Install dependencies
echo "📦 تثبيت التبعيات..."
npm install

# Build the project
echo "🔨 بناء المشروع..."
npm run build

# Deploy to Firebase (optional)
read -p "هل تريد نشر المشروع على Firebase الآن؟ (y/n): " -n 1 -r
echo
if [[ $REPLY =~ ^[Yy]$ ]]; then
    echo "🚀 نشر المشروع..."
    npm run deploy
    echo "✅ تم نشر المشروع بنجاح!"
else
    echo "ℹ️ يمكنك نشر المشروع لاحقاً باستخدام: npm run deploy"
fi

echo ""
echo "🎉 تم إكمال إعداد Firebase بنجاح!"
echo "📚 للمزيد من المعلومات، راجع: docs/setup/firebase-setup.md"