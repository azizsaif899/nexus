#!/usr/bin/env node
const fs = require('fs');
const path = require('path');

// Removed console.log

// فحص ملفات Python للعثور على imports
function scanPythonFiles(dir) {
  const imports = new Set();
  
  function scanDir(currentDir) {
    try {
      const files = fs.readdirSync(currentDir);
      
      files.forEach(file => {
        const filePath = path.join(currentDir, file);
        const stat = fs.statSync(filePath);
        
        if (stat.isDirectory() && !file.startsWith('.') && file !== 'node_modules') {
          scanDir(filePath);
        } else if (file.endsWith('.py')) {
          const content = fs.readFileSync(filePath, 'utf8');
          
          // استخراج imports
          const importLines = content.match(/^(from|import)\s+([a-zA-Z_][a-zA-Z0-9_.-]*)/gm);
          if (importLines) {
            importLines.forEach(line => {
              const match = line.match(/^(?:from|import)\s+([a-zA-Z_][a-zA-Z0-9_.-]*)/);
              if (match) {
                const pkg = match[1].split('.')[0];
                if (!['os', 'sys', 'json', 'time', 'datetime', 'typing', 'pathlib'].includes(pkg)) {
                  imports.add(pkg);
                }
              }
            });
          }
        }
      });
    } catch (error) {
      // تجاهل الأخطاء
    }
  }
  
  scanDir(dir);
  return Array.from(imports);
}

// مكتبات أساسية مع إصداراتها
const corePackages = {
  'fastapi': '0.110.0',
  'uvicorn': '0.29.0',
  'requests': '2.31.0',
  'pydantic': '2.7.4',
  'httpx': '0.28.1',
  'python-dotenv': '1.0.1'
};

// فحص المشروع
const projectDir = path.join(__dirname, '..');
const foundImports = scanPythonFiles(projectDir);

// Removed console.log

// إنشاء requirements.txt
let requirements = '';

// إضافة المكتبات الأساسية
Object.entries(corePackages).forEach(([pkg, version]) => {
  requirements += `${pkg}==${version}\n`;
});

// إضافة مكتبات إضافية مكتشفة
foundImports.forEach(pkg => {
  if (!corePackages[pkg]) {
    requirements += `${pkg}\n`;
  }
});

// كتابة الملف
fs.writeFileSync(path.join(projectDir, 'requirements-auto.txt'), requirements);

// Removed console.log
// Removed console.log
// Removed console.log