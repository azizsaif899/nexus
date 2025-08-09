const fs = require('fs');
const path = require('path');

// مجلد الوثائق
const DOCS_DIR = __dirname;
const OUTPUT_FILE = path.join(DOCS_DIR, 'docs_data.js');

// أنواع الملفات المدعومة
const SUPPORTED_EXTENSIONS = ['.md', '.txt', '.json'];

// تصنيف الملفات حسب الاسم والمسار
function categorizeFile(filePath, fileName) {
  const lowerName = fileName.toLowerCase();
  const lowerPath = filePath.toLowerCase();
  
  // تصنيف حسب المسار
  if (lowerPath.includes('process/guides') || lowerPath.includes('guides')) {
    return 'guide';
  }
  if (lowerPath.includes('process/development') || lowerPath.includes('development')) {
    return 'technical';
  }
  if (lowerPath.includes('tech/api') || lowerPath.includes('api')) {
    return 'technical';
  }
  if (lowerPath.includes('tech/architecture') || lowerPath.includes('architecture')) {
    return 'structure';
  }
  if (lowerPath.includes('tech/deployment') || lowerPath.includes('deployment')) {
    return 'technical';
  }
  if (lowerPath.includes('process/reviews') || lowerPath.includes('reviews')) {
    return 'report';
  }
  if (lowerPath.includes('reports')) {
    return 'report';
  }
  
  // تصنيف حسب اسم الملف
  if (lowerName.includes('guide') || lowerName.includes('manual') || lowerName.includes('boot')) {
    return 'guide';
  }
  if (lowerName.includes('report') || lowerName.includes('analysis') || lowerName.includes('summary')) {
    return 'report';
  }
  if (lowerName.includes('roadmap') || lowerName.includes('plan') || lowerName.includes('implementation')) {
    return 'roadmap';
  }
  if (lowerName.includes('test') || lowerName.includes('اختبار')) {
    return 'test_reports';
  }
  if (lowerName.includes('structure') || lowerName.includes('architecture') || lowerName.includes('system')) {
    return 'structure';
  }
  if (lowerName.includes('technical') || lowerName.includes('api') || lowerName.includes('deployment')) {
    return 'technical';
  }
  if (lowerName.includes('archive') || lowerName.includes('old') || lowerName.includes('backup')) {
    return 'archive';
  }
  if (lowerName.includes('project') || lowerName.includes('specific')) {
    return 'project_specific';
  }
  
  // افتراضي
  return 'technical';
}

// استخراج العنوان من محتوى الملف
function extractTitle(content, fileName) {
  // البحث عن أول عنوان في Markdown
  const h1Match = content.match(/^#\s+(.+)$/m);
  if (h1Match) {
    return h1Match[1].trim();
  }
  
  // البحث عن عنوان في التعليقات
  const commentMatch = content.match(/\/\*\*?\s*\n?\s*\*?\s*(.+?)\s*\*?\s*\n/);
  if (commentMatch) {
    return commentMatch[1].trim();
  }
  
  // استخدام اسم الملف كعنوان
  return fileName.replace(/\.[^/.]+$/, "").replace(/_/g, ' ');
}

// استخراج الوصف من محتوى الملف
function extractDescription(content) {
  // البحث عن أول فقرة بعد العنوان
  const lines = content.split('\n');
  let descriptionLines = [];
  let foundTitle = false;
  
  for (const line of lines) {
    const trimmed = line.trim();
    
    // تخطي العناوين والخطوط الفارغة
    if (trimmed.startsWith('#') || trimmed === '' || trimmed.startsWith('---')) {
      if (trimmed.startsWith('#')) foundTitle = true;
      continue;
    }
    
    // إذا وجدنا عنوان، ابدأ في جمع الوصف
    if (foundTitle && trimmed.length > 0) {
      descriptionLines.push(trimmed);
      if (descriptionLines.join(' ').length > 150) break;
    }
    
    // إذا لم نجد عنوان بعد، خذ أول سطر مفيد
    if (!foundTitle && trimmed.length > 10) {
      descriptionLines.push(trimmed);
      if (descriptionLines.join(' ').length > 150) break;
    }
  }
  
  let description = descriptionLines.join(' ').substring(0, 200);
  if (description.length === 200) description += '...';
  
  return description || 'وثيقة تقنية';
}

// تنسيق حجم الملف
function formatFileSize(bytes) {
  if (bytes < 1024) return bytes + 'B';
  if (bytes < 1024 * 1024) return Math.round(bytes / 1024) + 'KB';
  return (bytes / (1024 * 1024)).toFixed(1) + 'MB';
}

// قراءة الملفات بشكل تكراري
function readFilesRecursively(dir, baseDir = dir) {
  const files = [];
  
  try {
    const items = fs.readdirSync(dir);
    
    for (const item of items) {
      const fullPath = path.join(dir, item);
      const stat = fs.statSync(fullPath);
      
      if (stat.isDirectory()) {
        // تخطي مجلدات معينة
        if (['node_modules', '.git', 'dist', 'build'].includes(item)) {
          continue;
        }
        files.push(...readFilesRecursively(fullPath, baseDir));
      } else if (stat.isFile()) {
        const ext = path.extname(item);
        if (SUPPORTED_EXTENSIONS.includes(ext)) {
          try {
            const content = fs.readFileSync(fullPath, 'utf8');
            const relativePath = path.relative(baseDir, fullPath);
            
            files.push({
              title: extractTitle(content, item),
              description: extractDescription(content),
              fullPath: fullPath,
              relativePath: relativePath,
              fileName: item,
              size: formatFileSize(stat.size),
              date: stat.mtime.toLocaleDateString('ar-SA'),
              category: categorizeFile(relativePath, item),
              content: content
            });
          } catch (error) {
            console.warn(`تعذر قراءة الملف: ${fullPath}`, error.message);
          }
        }
      }
    }
  } catch (error) {
    console.warn(`تعذر قراءة المجلد: ${dir}`, error.message);
  }
  
  return files;
}

// توليد ملف البيانات
function generateDocsData() {
  console.log('🔍 جاري فحص الملفات في:', DOCS_DIR);
  
  const docs = readFilesRecursively(DOCS_DIR);
  
  console.log(`📄 تم العثور على ${docs.length} ملف`);
  
  // ترتيب حسب التاريخ (الأحدث أولاً)
  docs.sort((a, b) => new Date(b.date) - new Date(a.date));
  
  // إنشاء محتوى ملف JavaScript
  const jsContent = `// ملف البيانات المولد تلقائياً - لا تعدل يدوياً
// Generated: ${new Date().toLocaleString('ar-SA')}

const DOCS_DATA = ${JSON.stringify(docs, null, 2)};

// إحصائيات
const DOCS_STATS = {
  total: ${docs.length},
  categories: {
    ${Object.entries(docs.reduce((acc, doc) => {
      acc[doc.category] = (acc[doc.category] || 0) + 1;
      return acc;
    }, {})).map(([cat, count]) => `${cat}: ${count}`).join(',\n    ')}
  },
  lastGenerated: '${new Date().toISOString()}'
};

// تصدير للاستخدام في المتصفح
if (typeof module !== 'undefined' && module.exports) {
  module.exports = { DOCS_DATA, DOCS_STATS };
}`;

  // كتابة الملف
  fs.writeFileSync(OUTPUT_FILE, jsContent, 'utf8');
  
  console.log('✅ تم إنشاء ملف البيانات:', OUTPUT_FILE);
  console.log('📊 الإحصائيات:');
  
  // عرض إحصائيات التصنيف
  const categories = docs.reduce((acc, doc) => {
    acc[doc.category] = (acc[doc.category] || 0) + 1;
    return acc;
  }, {});
  
  Object.entries(categories).forEach(([category, count]) => {
    console.log(`   ${category}: ${count} ملف`);
  });
}

// تشغيل المولد
if (require.main === module) {
  generateDocsData();
}

module.exports = { generateDocsData };