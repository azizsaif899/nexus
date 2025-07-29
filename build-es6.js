import fs from 'fs/promises';
import path from 'path';
import { transformFileAsync } from '@babel/core';

const ROOT_DIR = process.cwd();
const SRC_DIR = path.join(ROOT_DIR, 'src');
const DIST_DIR = path.join(ROOT_DIR, 'dist');

// ✅ إضافة: قائمة بالملفات والمجلدات القديمة التي تحتاج إلى نسخ
const LEGACY_ASSETS = [
    '00_utils.js',
    '01_config.js', 
    '02_intro.js',
    '98_Code.js',
    '99_Initializer.js',
    '01_emergency_fallbacks.js',
    '10_ui',
    '20_ai',
    '25_ai_agents',
    '30_tools',
    '35_accounting',
    '40_memory',
    '40_security',
    '50_analytics',
    '55_operations',
    '70_telemetry',
    '75_metrics',
    '80_api',
    '85_tests',
    '90_System',
    'AssistantSidebar.html',
    'DeveloperSidebar.html',
    'StatusSidebar.html'
];

/**
 * ES6 to defineModule Build Pipeline
 * يحول ملفات ES6 من src/ إلى defineModule في dist/
 */
async function transformES6ToDefineModule() {
  console.log('🚀 بدء عملية البناء المتكاملة...');
  
  try {
    // 1. تنظيف مجلد dist
    await fs.rm(DIST_DIR, { recursive: true, force: true });
    await fs.mkdir(DIST_DIR, { recursive: true });
    console.log('✅ تم تنظيف مجلد النشر (dist).');

    // 2. تحويل ملفات ES6 من src إلى dist
    // البحث عن جميع ملفات JS في src/
    const srcFiles = await findES6Files(SRC_DIR);
    console.log(`📁 تم العثور على ${srcFiles.length} ملف ES6`);
    
    // تحويل كل ملف
    for (const srcFile of srcFiles) {
      await transformSingleFile(srcFile);
    }
    
    console.log('✅ تم تحويل جميع ملفات ES6 بنجاح');

    // 3. نسخ الملفات القديمة إلى dist
    await copyLegacyAssets();
    
    // 4. تشغيل build.js لترتيب الملفات وإنشاء Manifest
    console.log('\n🔧 تشغيل المرحلة الثانية: ترتيب التبعيات وإنشاء Manifest...');
    const { execSync } = await import('child_process');
    execSync('node build.js', { stdio: 'inherit' });
    
  } catch (error) {
    console.error('❌ خطأ في تحويل ES6:', error);
    process.exit(1);
  }
}

async function copyLegacyAssets() {
    console.log('\n🔄 نسخ الأصول القديمة إلى مجلد dist...');
    let copiedCount = 0;
    for (const assetPath of LEGACY_ASSETS) {
        const source = path.join(ROOT_DIR, assetPath);
        const destination = path.join(DIST_DIR, assetPath);
        try {
            await fs.cp(source, destination, { recursive: true });
            copiedCount++;
        } catch (error) { /* تجاهل الملفات غير الموجودة */ }
    }
    console.log(`✅ تم نسخ ${copiedCount} من الأصول القديمة.`);
}

async function findES6Files(dir) {
  const files = [];
  
  async function scan(currentDir) {
    const entries = await fs.readdir(currentDir, { withFileTypes: true });
    
    for (const entry of entries) {
      const fullPath = path.join(currentDir, entry.name);
      
      if (entry.isDirectory()) {
        await scan(fullPath);
      } else if (entry.name.endsWith('.js')) {
        files.push(fullPath);
      }
    }
  }
  
  await scan(dir);
  return files;
}

async function transformSingleFile(srcPath) {
  try {
    const relativePath = path.relative(SRC_DIR, srcPath);
    const distPath = path.join(DIST_DIR, relativePath);
    
    // إنشاء مجلد الوجهة إذا لم يكن موجوداً
    await fs.mkdir(path.dirname(distPath), { recursive: true });
    
    // تحويل الملف باستخدام Babel
    const result = await transformFileAsync(srcPath, {
      envName: 'gas', // استخدام إعدادات GAS
      filename: srcPath
    });
    
    if (result && result.code) {
      await fs.writeFile(distPath, result.code, 'utf-8');
      console.log(`✅ تم تحويل: ${relativePath}`);
    } else {
      console.warn(`⚠️ لم يتم تحويل: ${relativePath}`);
    }
    
  } catch (error) {
    console.error(`❌ خطأ في تحويل ${srcPath}:`, error.message);
  }
}

// تشغيل البناء إذا تم استدعاء الملف مباشرة
if (import.meta.url === `file://${process.argv[1]}`) {
  transformES6ToDefineModule();
}

export { transformES6ToDefineModule };