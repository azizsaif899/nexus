const fs = require('fs');
const path = require('path');

console.log('🔥 إعداد نظام Multi-tenant...');

// 1. إنشاء Firebase config
const firebaseConfig = `// Firebase Configuration
import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';

const firebaseConfig = {
  // سيتم إضافة التكوين من Firebase Console
  apiKey: process.env.VITE_FIREBASE_API_KEY,
  authDomain: process.env.VITE_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.VITE_FIREBASE_PROJECT_ID,
  storageBucket: process.env.VITE_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.VITE_FIREBASE_APP_ID
};

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const db = getFirestore(app);
export default app;
`;

// 2. إنشاء .env للمتغيرات
const envTemplate = `# Firebase Configuration
VITE_FIREBASE_API_KEY=your_api_key_here
VITE_FIREBASE_AUTH_DOMAIN=your_project.firebaseapp.com
VITE_FIREBASE_PROJECT_ID=your_project_id
VITE_FIREBASE_STORAGE_BUCKET=your_project.appspot.com
VITE_FIREBASE_MESSAGING_SENDER_ID=123456789
VITE_FIREBASE_APP_ID=1:123456789:web:abcdef

# App Configuration
VITE_APP_NAME=Nexus AI
VITE_APP_VERSION=1.0.0
`;

// كتابة الملفات
fs.writeFileSync('libs/firebase-client/src/firebase-config.ts', firebaseConfig);
fs.writeFileSync('.env.firebase', envTemplate);

console.log('✅ تم إنشاء:');
console.log('  - libs/firebase-client/src/firebase-config.ts');
console.log('  - .env.firebase');
console.log('');
console.log('📋 الخطوات التالية:');
console.log('1. انسخ Firebase config من Console');
console.log('2. املأ .env.firebase بالقيم الصحيحة');
console.log('3. شغل: npm run dev:nexus-ai-main');