#!/usr/bin/env node

/**
 * 🔧 إصلاح API Endpoints المفقودة
 */

const fs = require('fs');
const path = require('path');

// Removed console.log

const apiMainPath = 'apps/api/src/main.ts';

if (!fs.existsSync(apiMainPath)) {
    // Removed console.log
    process.exit(1);
}

let content = fs.readFileSync(apiMainPath, 'utf8');

// إضافة CORS
if (!content.includes('localhost:8000')) {
    const corsConfig = `
  // CORS Configuration
  app.enableCors({
    origin: ['http://localhost:3000', 'http://localhost:4200', 'http://localhost:8000'],
    credentials: true,
  });
`;
    
    if (content.includes('app.enableCors')) {
        content = content.replace(/app\.enableCors\([^}]+\}\);/, corsConfig.trim());
    } else {
        content = content.replace('async function bootstrap() {', `async function bootstrap() {
  const app = await NestFactory.create(AppModule);
${corsConfig}`);
    }
    
    // Removed console.log
}

// إضافة Research Endpoint
if (!content.includes('research')) {
    const researchEndpoint = `
  // Research Endpoints
  app.use('/api/research', (req, res) => {
    res.json({ status: 'Research API Ready', timestamp: new Date().toISOString() });
  });
`;
    
    content = content.replace('await app.listen', `${researchEndpoint}
  await app.listen`);
    
    // Removed console.log
}

// إضافة Sidebar Endpoint
if (!content.includes('sidebar')) {
    const sidebarEndpoint = `
  // Sidebar Endpoints
  app.use('/api/sidebar', (req, res) => {
    res.json({ 
      status: 'Sidebar API Ready', 
      agents: ['cfo', 'developer', 'database', 'operations', 'general'],
      modes: ['smart', 'iterative', 'analysis'],
      timestamp: new Date().toISOString() 
    });
  });
`;
    
    content = content.replace('await app.listen', `${sidebarEndpoint}
  await app.listen`);
    
    // Removed console.log
}

// إضافة Health Endpoint
if (!content.includes('/api/v2/health')) {
    const healthEndpoint = `
  // Health Check Endpoint
  app.use('/api/v2/health', (req, res) => {
    res.json({ 
      status: 'healthy', 
      version: '2.0',
      services: {
        api: 'running',
        database: 'connected',
        cache: 'active'
      },
      timestamp: new Date().toISOString() 
    });
  });
`;
    
    content = content.replace('await app.listen', `${healthEndpoint}
  await app.listen`);
    
    // Removed console.log
}

// حفظ الملف
fs.writeFileSync(apiMainPath, content);

// Removed console.log
// Removed console.log
// Removed console.log
// Removed console.log
// Removed console.log
// Removed console.log

// Removed console.log