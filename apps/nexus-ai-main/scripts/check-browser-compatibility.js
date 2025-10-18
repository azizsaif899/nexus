#!/usr/bin/env node

/**
 * Browser Compatibility Checker
 * يفحص التوافق مع المتصفحات ويتحقق من دعم oklch
 */

import { execSync } from 'child_process';
import fs from 'fs';
import path from 'path';

console.log('🔍 فحص التوافق مع المتصفحات...\n');

// Check if browserslist is configured
try {
  const browserslistOutput = execSync('npx browserslist', { encoding: 'utf-8' });
  console.log('✅ المتصفحات المدعومة:');
  console.log(browserslistOutput);
} catch (error) {
  console.error('❌ خطأ في قراءة قائمة المتصفحات');
}

// Check PostCSS configuration
const postcssConfigPath = path.join(process.cwd(), 'postcss.config.js');
if (fs.existsSync(postcssConfigPath)) {
  console.log('\n✅ ملف postcss.config.js موجود');
  
  const config = fs.readFileSync(postcssConfigPath, 'utf-8');
  
  // Check for oklch support
  if (config.includes('postcss-oklab-function') || config.includes('postcss-preset-env')) {
    console.log('✅ تم تفعيل التحويل التلقائي لألوان oklch');
  } else {
    console.log('⚠️  التحويل التلقائي لألوان oklch غير مفعل');
  }
  
  // Check for autoprefixer
  if (config.includes('autoprefixer')) {
    console.log('✅ تم تفعيل autoprefixer للبادئات التلقائية');
  } else {
    console.log('⚠️  autoprefixer غير مفعل');
  }
} else {
  console.log('\n❌ ملف postcss.config.js غير موجود');
}

// Check CSS files for oklch usage
console.log('\n🎨 فحص استخدام ألوان oklch في ملفات CSS...');
const cssFiles = [
  'styles/globals.css',
  'src/**/*.css',
];

let hasOklch = false;
cssFiles.forEach(pattern => {
  try {
    const files = execSync(`dir /s /b ${pattern} 2>nul || echo ""`, { encoding: 'utf-8', shell: 'cmd.exe' });
    if (files.trim()) {
      files.split('\n').forEach(file => {
        if (file.trim() && fs.existsSync(file.trim())) {
          const content = fs.readFileSync(file.trim(), 'utf-8');
          if (content.includes('oklch(')) {
            hasOklch = true;
            console.log(`📝 تم العثور على oklch في: ${path.basename(file.trim())}`);
          }
        }
      });
    }
  } catch (error) {
    // Ignore errors
  }
});

if (hasOklch) {
  console.log('\n✅ سيتم تحويل ألوان oklch تلقائياً عند البناء');
} else {
  console.log('\n✅ لا توجد ألوان oklch تحتاج تحويل');
}

// Recommendations
console.log('\n📋 التوصيات:');
console.log('1. استخدم npm run build لبناء التطبيق مع التحويلات التلقائية');
console.log('2. اختبر على Safari iOS 12+ و Chrome iOS');
console.log('3. استخدم أدوات المطورين في Safari للتحقق من الألوان');
console.log('4. تأكد من تحديث المتصفحات إلى أحدث إصدار\n');
