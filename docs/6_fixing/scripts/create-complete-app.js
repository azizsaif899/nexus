#!/usr/bin/env node

const fs = require('fs-extra');
const path = require('path');

console.log('🚀 إنشاء التطبيق الكامل...\n');

// إنشاء هيكل المشروع
const createProjectStructure = async () => {
  const structure = {
    'src': {
      'components': {
        'ui': {},
        'layout': {},
        'features': {}
      },
      'pages': {},
      'services': {},
      'hooks': {},
      'utils': {},
      'types': {}
    },
    'public': {},
    'server': {
      'controllers': {},
      'services': {},
      'middleware': {},
      'config': {}
    },
    'docs': {}
  };

  const createDir = async (basePath, structure) => {
    for (const [name, content] of Object.entries(structure)) {
      const fullPath = path.join(basePath, name);
      await fs.ensureDir(fullPath);
      
      if (typeof content === 'object' && Object.keys(content).length > 0) {
        await createDir(fullPath, content);
      }
    }
  };

  await createDir('.', structure);
  console.log('✅ تم إنشاء هيكل المشروع');
};

// إنشاء package.json
const createPackageJson = async () => {
  const packageJson = {
    "name": "azizsys-complete-app",
    "version": "1.0.0",
    "description": "تطبيق AzizSys الكامل مع جميع الخدمات",
    "scripts": {
      "dev": "concurrently \"npm run dev:client\" \"npm run dev:server\"",
      "dev:client": "vite",
      "dev:server": "nodemon server/index.js",
      "build": "vite build",
      "preview": "vite preview",
      "start": "node server/index.js"
    },
    "dependencies": {
      "react": "^18.2.0",
      "react-dom": "^18.2.0",
      "react-router-dom": "^6.8.0",
      "axios": "^1.3.0",
      "firebase": "^9.17.0",
      "@google/generative-ai": "^0.1.0",
      "express": "^4.18.0",
      "cors": "^2.8.5",
      "dotenv": "^16.0.0",
      "socket.io": "^4.6.0",
      "socket.io-client": "^4.6.0",
      "tailwindcss": "^3.2.0",
      "lucide-react": "^0.312.0"
    },
    "devDependencies": {
      "@vitejs/plugin-react": "^3.1.0",
      "vite": "^4.1.0",
      "concurrently": "^7.6.0",
      "nodemon": "^2.0.20",
      "autoprefixer": "^10.4.13",
      "postcss": "^8.4.21"
    }
  };

  await fs.writeJson('package.json', packageJson, { spaces: 2 });
  console.log('✅ تم إنشاء package.json');
};

// إنشاء ملف التكوين الرئيسي
const createMainConfig = async () => {
  const envTemplate = `# Firebase Configuration
VITE_FIREBASE_API_KEY=your_firebase_api_key
VITE_FIREBASE_AUTH_DOMAIN=your_project.firebaseapp.com
VITE_FIREBASE_PROJECT_ID=your_project_id
VITE_FIREBASE_STORAGE_BUCKET=your_project.appspot.com
VITE_FIREBASE_MESSAGING_SENDER_ID=123456789
VITE_FIREBASE_APP_ID=1:123456789:web:abcdef

# Gemini AI
VITE_GEMINI_API_KEY=your_gemini_api_key

# Server Configuration
PORT=3001
NODE_ENV=development`;

  await fs.writeFile('.env.example', envTemplate);
  await fs.writeFile('.env', envTemplate);
  console.log('✅ تم إنشاء ملفات التكوين');
};

// تشغيل الإعداد
const main = async () => {
  try {
    await createProjectStructure();
    await createPackageJson();
    await createMainConfig();
    
    console.log('\n🎉 تم إنشاء التطبيق بنجاح!');
    console.log('\n📋 الخطوات التالية:');
    console.log('1. npm install');
    console.log('2. تحديث ملف .env بالمعلومات الحقيقية');
    console.log('3. npm run dev');
    
  } catch (error) {
    console.error('❌ خطأ في الإنشاء:', error.message);
  }
};

main();