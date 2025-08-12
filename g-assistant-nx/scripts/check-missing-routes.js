#!/usr/bin/env node
const fs = require('fs');
const path = require('path');

console.log('🔍 فحص المسارات الناقصة في API...\n');

// المسارات المطلوبة للنظام الهجين
const requiredRoutes = [
  '/api/v2/health',
  '/api/hybrid/status',
  '/api/hybrid/sync',
  '/api/hybrid/research',
  '/api/agents/cfo',
  '/api/agents/developer',
  '/api/agents/database',
  '/api/agents/operations',
  '/api/agents/general'
];

// فحص ملف API Server
function checkAPIServer() {
  const serverPath = path.join(__dirname, '..', 'apps', 'api', 'server.js');
  
  if (!fs.existsSync(serverPath)) {
    console.log('❌ ملف API Server غير موجود');
    return [];
  }
  
  const content = fs.readFileSync(serverPath, 'utf8');
  const foundRoutes = [];
  
  requiredRoutes.forEach(route => {
    const routePattern = route.replace(/:\w+/g, '\\w+');
    const regex = new RegExp(`['"\`]${routePattern}['"\`]`, 'g');
    
    if (regex.test(content)) {
      foundRoutes.push(route);
      console.log(`✅ ${route} - موجود`);
    } else {
      console.log(`❌ ${route} - مفقود`);
    }
  });
  
  return foundRoutes;
}

// فحص Gemini Backend
function checkGeminiBackend() {
  const backendPath = path.join(__dirname, '..', 'apps', 'gemini-research-agent', 'main.py');
  
  if (!fs.existsSync(backendPath)) {
    console.log('❌ ملف Gemini Backend غير موجود');
    return [];
  }
  
  const content = fs.readFileSync(backendPath, 'utf8');
  const pythonRoutes = ['/health', '/research', '/api/hybrid/status', '/api/hybrid/sync'];
  const foundRoutes = [];
  
  pythonRoutes.forEach(route => {
    if (content.includes(`"${route}"`) || content.includes(`'${route}'`)) {
      foundRoutes.push(route);
      console.log(`✅ Python ${route} - موجود`);
    } else {
      console.log(`❌ Python ${route} - مفقود`);
    }
  });
  
  return foundRoutes;
}

// تشغيل الفحص
console.log('📡 فحص API Server:');
const apiRoutes = checkAPIServer();

console.log('\n🐍 فحص Gemini Backend:');
const pythonRoutes = checkGeminiBackend();

console.log('\n📊 النتائج:');
console.log(`API Server: ${apiRoutes.length}/${requiredRoutes.length} مسارات موجودة`);
console.log(`Gemini Backend: ${pythonRoutes.length}/4 مسارات موجودة`);

if (apiRoutes.length === requiredRoutes.length && pythonRoutes.length === 4) {
  console.log('🎉 جميع المسارات موجودة!');
} else {
  console.log('⚠️ بعض المسارات مفقودة - تحتاج إضافة');
}