/**
 * build.js - يقوم هذا السكربت بتحويل كودنا الحديث إلى كود جاهز لـ Google Apps Script
 */

const fs = require('fs-extra');
const esbuild = require('esbuild');
const path = require('path');

async function build() {
  try {
    console.log('🚀 Starting sidebar build process...');

    // الخطوة 1: تنظيف مجلد "dist" لضمان بداية نظيفة
    await fs.emptyDir('./dist');
    console.log('✅ Cleaned dist directory.');

    // الخطوة 2: تجميع كل ملفات TypeScript/JavaScript في ملف واحد
    await esbuild.build({
      entryPoints: ['src/index.ts'],
      bundle: true,
      outfile: 'dist/Code.gs',
      format: 'iife',
      target: 'es5',
      platform: 'browser',
      globalName: 'GAssistant'
    });
    console.log('✅ Bundled TypeScript into Code.gs');

    // الخطوة 3: معالجة ملفات HTML و CSS
    const htmlPath = path.join('src/ui/Sidebar.html');
    const cssPath = path.join('src/ui/Sidebar.css');
    
    if (await fs.pathExists(htmlPath)) {
      let htmlContent = await fs.readFile(htmlPath, 'utf8');
      
      if (await fs.pathExists(cssPath)) {
        const cssContent = await fs.readFile(cssPath, 'utf8');
        htmlContent = htmlContent.replace('</head>', `<style>${cssContent}</style></head>`);
      }
      
      await fs.writeFile('dist/Sidebar.html', htmlContent);
      console.log('✅ Processed HTML and CSS files.');
    }

    // الخطوة 4: إنشاء ملف "appsscript.json" ديناميكيًا
    const manifest = {
      timeZone: 'Asia/Riyadh',
      dependencies: {},
      exceptionLogging: 'STACKDRIVER',
      runtimeVersion: 'V8'
    };
    await fs.writeJson('./dist/appsscript.json', manifest, { spaces: 2 });
    console.log('✅ Created appsscript.json manifest.');

    console.log('🎉 Sidebar build completed successfully!');
  } catch (error) {
    console.error('❌ Build failed:', error);
    process.exit(1);
  }
}

build();