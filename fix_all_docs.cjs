const fs = require('fs');
const path = require('path');

function fixDocsRegistration(filePath) {
  try {
    let content = fs.readFileSync(filePath, 'utf-8');
    
    // البحث عن استدعاءات DocsManager خارج defineModule
    const outsideDocsPattern = /\}\);\s*\n\s*\/\/[^\n]*\n\s*DocsManager\.registerModuleDocs\([^;]+\);/g;
    
    if (outsideDocsPattern.test(content)) {
      console.log(`🔧 Fixing: ${filePath}`);
      
      // استخراج تسجيل الوثائق
      const docsMatch = content.match(/DocsManager\.registerModuleDocs\(([^;]+)\);/);
      if (docsMatch) {
        const docsCall = docsMatch[0];
        
        // إزالة التسجيل الخارجي
        content = content.replace(/\s*\/\/[^\n]*\n\s*DocsManager\.registerModuleDocs\([^;]+\);/, '');
        
        // إضافة التسجيل داخل المصنع
        content = content.replace(
          /return\s*\{([^}]+)\};\s*\}\);/,
          `// تسجيل الوثائق داخل المصنع\n    if (DocsManager && DocsManager.registerModuleDocs) {\n        ${docsCall}\n    }\n\n    return {$1};\n});`
        );
        
        fs.writeFileSync(filePath, content);
        console.log(`✅ Fixed: ${filePath}`);
        return true;
      }
    }
    return false;
  } catch (e) {
    console.log(`❌ Error fixing ${filePath}: ${e.message}`);
    return false;
  }
}

function fixAllFiles() {
  const directories = [
    '10_ui', '20_ai', '25_ai_agents', '30_tools', 
    '35_accounting', '55_operations', '75_metrics'
  ];
  
  let fixed = 0;
  
  directories.forEach(dir => {
    const dirPath = path.join(__dirname, dir);
    if (fs.existsSync(dirPath)) {
      const files = fs.readdirSync(dirPath);
      files.forEach(file => {
        if (file.endsWith('.js')) {
          const filePath = path.join(dirPath, file);
          if (fixDocsRegistration(filePath)) {
            fixed++;
          }
        }
      });
    }
  });
  
  console.log(`🎯 Fixed ${fixed} files`);
}

fixAllFiles();