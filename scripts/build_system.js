/**
 * @file scripts/build_system.js
 * @description نظام البناء والنشر للمشروع
 * @version 1.0.0
 */

const fs = require('fs');
const path = require('path');

class AzizSysBuildSystem {
  constructor() {
    this.srcDir = path.join(__dirname, '..', 'src');
    this.outputDir = path.join(__dirname, '..', 'gas_ready');
    this.buildOrder = [
      // الوحدات الأساسية أولاً
      '00_utils.js',
      '01_config.js',
      '00_main_initializer.js',
      
      // خدمات النظام
      'System/MenuTriggers.js',
      'Services/EmbeddingService.js',
      'AI/GeminiAdapter.js',
      'Tools/SheetsAnalyzer.js',
      
      // التكامل النهائي
      '99_final_integration.js'
    ];
  }
  
  async build() {
    try {
      console.log('🚀 بدء عملية البناء...');
      
      // إنشاء مجلد الإخراج
      this.ensureOutputDir();
      
      // نسخ الملفات الأساسية
      await this.copyEssentialFiles();
      
      // بناء الملفات المدمجة
      await this.buildCombinedFiles();
      
      // إنشاء ملف appsscript.json
      this.createAppsScriptManifest();
      
      // إنشاء تقرير البناء
      this.generateBuildReport();
      
      console.log('✅ تم البناء بنجاح!');
      console.log(`📁 الملفات الجاهزة في: ${this.outputDir}`);
      
    } catch (error) {
      console.error('❌ فشل في البناء:', error.message);
      throw error;
    }
  }
  
  ensureOutputDir() {
    if (!fs.existsSync(this.outputDir)) {
      fs.mkdirSync(this.outputDir, { recursive: true });
    }
    
    // مسح الملفات القديمة
    const files = fs.readdirSync(this.outputDir);
    files.forEach(file => {
      if (file.endsWith('.js') || file.endsWith('.html')) {
        fs.unlinkSync(path.join(this.outputDir, file));
      }
    });
  }
  
  async copyEssentialFiles() {
    // نسخ ملفات HTML
    const htmlFiles = [
      '10_ui/9_ui_enhanced_sidebar_v3.js', // يحتوي على HTML
      'src/UI/AssistantSidebar.html'
    ];
    
    htmlFiles.forEach(file => {
      const srcPath = path.join(__dirname, '..', file);
      if (fs.existsSync(srcPath)) {
        const content = fs.readFileSync(srcPath, 'utf8');
        
        if (file.endsWith('.js') && content.includes('createEnhancedSidebarHTML')) {
          // استخراج HTML من ملف JS
          this.extractAndSaveHTML(content, 'AssistantSidebar.html');
        } else if (file.endsWith('.html')) {
          const outputPath = path.join(this.outputDir, path.basename(file));
          fs.writeFileSync(outputPath, content);
        }
      }
    });
  }
  
  extractAndSaveHTML(jsContent, htmlFileName) {
    try {
      // البحث عن دالة createEnhancedSidebarHTML
      const htmlMatch = jsContent.match(/createEnhancedSidebarHTML\(\)\s*{\s*return\s*`([\s\S]*?)`;\s*}/);
      
      if (htmlMatch && htmlMatch[1]) {
        const htmlContent = htmlMatch[1]
          .replace(/\\\${/g, '${') // إصلاح template literals
          .replace(/\\\`/g, '`')   // إصلاح backticks
          .replace(/\\\\/g, '\\'); // إصلاح backslashes
        
        const outputPath = path.join(this.outputDir, htmlFileName);
        fs.writeFileSync(outputPath, htmlContent);
        console.log(`✅ تم استخراج HTML: ${htmlFileName}`);
      }
    } catch (error) {
      console.warn(`⚠️ فشل في استخراج HTML من ${jsContent.substring(0, 50)}...`);
    }
  }
  
  async buildCombinedFiles() {
    const combinedContent = [];
    
    // إضافة header
    combinedContent.push(this.getBuildHeader());
    
    // معالجة الملفات حسب الترتيب
    for (const fileName of this.buildOrder) {
      const filePath = path.join(this.srcDir, fileName);
      
      if (fs.existsSync(filePath)) {
        const content = fs.readFileSync(filePath, 'utf8');
        const processedContent = this.processFileContent(content, fileName);
        
        combinedContent.push(`\n// ===== ${fileName} =====\n`);
        combinedContent.push(processedContent);
        
        console.log(`✅ تمت معالجة: ${fileName}`);
      } else {
        console.warn(`⚠️ ملف مفقود: ${fileName}`);
      }
    }
    
    // حفظ الملف المدمج
    const outputPath = path.join(this.outputDir, 'Code.js');
    fs.writeFileSync(outputPath, combinedContent.join('\n'));
    
    console.log(`✅ تم إنشاء الملف المدمج: Code.js`);
  }
  
  processFileContent(content, fileName) {
    // إزالة التعليقات الزائدة
    let processed = content
      .replace(/\/\*\*[\s\S]*?\*\//g, '') // إزالة JSDoc comments
      .replace(/\/\/.*$/gm, '') // إزالة single line comments
      .replace(/^\s*$/gm, '') // إزالة الأسطر الفارغة
      .trim();
    
    // معالجة خاصة لملفات معينة
    if (fileName.includes('utils')) {
      // التأكد من تحميل Utils أولاً
      processed = `// تحميل أولوي للوحدة الأساسية\n${processed}`;
    }
    
    if (fileName.includes('final_integration')) {
      // إضافة تعليق نهائي
      processed += '\n\n// تم اكتمال تحميل النظام\nconsole.log("🎉 AzizSys تم تحميله بنجاح!");';
    }
    
    return processed;
  }
  
  getBuildHeader() {
    const now = new Date();
    return `/**
 * AzizSys - نظام إدارة ذكي متكامل
 * تم البناء: ${now.toISOString()}
 * الإصدار: 1.0.0
 * 
 * هذا الملف تم إنشاؤه تلقائياً - لا تقم بتعديله مباشرة
 */

// تهيئة النظام الأساسي
if (typeof GAssistant === 'undefined') {
  var GAssistant = {
    System: {},
    Utils: {},
    AI: {},
    Tools: {},
    UI: {},
    Agents: {}
  };
}`;
  }
  
  createAppsScriptManifest() {
    const manifest = {
      "timeZone": "Asia/Riyadh",
      "dependencies": {},
      "exceptionLogging": "STACKDRIVER",
      "runtimeVersion": "V8",
      "oauthScopes": [
        "https://www.googleapis.com/auth/spreadsheets",
        "https://www.googleapis.com/auth/script.external_request",
        "https://www.googleapis.com/auth/script.scriptapp",
        "https://www.googleapis.com/auth/drive.file"
      ],
      "urlFetchWhitelist": [
        "https://generativelanguage.googleapis.com/"
      ]
    };
    
    const outputPath = path.join(this.outputDir, 'appsscript.json');
    fs.writeFileSync(outputPath, JSON.stringify(manifest, null, 2));
    
    console.log('✅ تم إنشاء appsscript.json');
  }
  
  generateBuildReport() {
    const files = fs.readdirSync(this.outputDir);
    const report = {
      buildTime: new Date().toISOString(),
      files: files.map(file => {
        const filePath = path.join(this.outputDir, file);
        const stats = fs.statSync(filePath);
        return {
          name: file,
          size: stats.size,
          modified: stats.mtime
        };
      }),
      totalSize: files.reduce((sum, file) => {
        const filePath = path.join(this.outputDir, file);
        return sum + fs.statSync(filePath).size;
      }, 0)
    };
    
    const reportPath = path.join(this.outputDir, 'build_report.json');
    fs.writeFileSync(reportPath, JSON.stringify(report, null, 2));
    
    console.log('📊 تقرير البناء:');
    console.log(`   - عدد الملفات: ${report.files.length}`);
    console.log(`   - الحجم الإجمالي: ${Math.round(report.totalSize / 1024)} KB`);
    console.log(`   - وقت البناء: ${report.buildTime}`);
  }
  
  async deploy() {
    try {
      console.log('🚀 بدء عملية النشر...');
      
      // التحقق من وجود clasp
      const { execSync } = require('child_process');
      
      try {
        execSync('clasp --version', { stdio: 'ignore' });
      } catch (error) {
        throw new Error('clasp غير مثبت. يرجى تثبيته أولاً: npm install -g @google/clasp');
      }
      
      // التحقق من وجود .clasp.json
      const claspConfigPath = path.join(__dirname, '..', '.clasp.json');
      if (!fs.existsSync(claspConfigPath)) {
        throw new Error('ملف .clasp.json مفقود. يرجى ربط المشروع أولاً: clasp clone <scriptId>');
      }
      
      // نشر الملفات
      process.chdir(this.outputDir);
      execSync('clasp push', { stdio: 'inherit' });
      
      console.log('✅ تم النشر بنجاح!');
      
    } catch (error) {
      console.error('❌ فشل في النشر:', error.message);
      throw error;
    }
  }
}

// تشغيل البناء إذا تم استدعاء الملف مباشرة
if (require.main === module) {
  const builder = new AzizSysBuildSystem();
  
  const command = process.argv[2];
  
  switch (command) {
    case 'build':
      builder.build().catch(console.error);
      break;
    case 'deploy':
      builder.build()
        .then(() => builder.deploy())
        .catch(console.error);
      break;
    default:
      console.log('الاستخدام:');
      console.log('  node build_system.js build   - بناء المشروع');
      console.log('  node build_system.js deploy  - بناء ونشر المشروع');
  }
}

module.exports = AzizSysBuildSystem;