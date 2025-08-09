const fs = require('fs');
const path = require('path');

const docsDir = __dirname;
const outputFile = path.join(docsDir, 'docs_data.js');

// قراءة جميع ملفات .md
const mdFiles = fs.readdirSync(docsDir).filter(file => file.endsWith('.md'));

const allDocs = [];

mdFiles.forEach(fileName => {
    try {
        const content = fs.readFileSync(path.join(docsDir, fileName), 'utf8');
        const doc = parseMarkdownFile(fileName, content);
        allDocs.push(doc);
    } catch (error) {
        console.log(`تعذر قراءة الملف: ${fileName}`);
    }
});

function parseMarkdownFile(fileName, content) {
    const lines = content.split('\n');
    let title = fileName.replace('.md', '');
    let description = '';
    let category = 'technical';
    let icon = '📄';

    // استخراج العنوان
    for (let i = 0; i < Math.min(10, lines.length); i++) {
        const line = lines[i].trim();
        if (line.startsWith('# ')) {
            title = line.substring(2).trim();
            break;
        }
    }

    // استخراج الوصف
    for (let i = 0; i < Math.min(30, lines.length); i++) {
        const line = lines[i].trim();
        if (line && !line.startsWith('#') && !line.startsWith('**') && 
            !line.startsWith('---') && !line.startsWith('|') &&
            !line.startsWith('```') && line.length > 30) {
            description = line.substring(0, 200) + '...';
            break;
        }
    }

    // تحديد الفئة والأيقونة
    if (fileName.includes('GUIDE') || fileName.includes('MANUAL') || fileName.includes('CLIENT')) {
        category = 'guide';
        icon = '📖';
    } else if (fileName.includes('REPORT') || fileName.includes('SUCCESS') || 
              fileName.includes('ANALYSIS') || fileName.includes('STATUS') ||
              fileName.includes('VERIFICATION')) {
        category = 'report';
        icon = '📊';
    } else if (fileName.includes('ROADMAP') || fileName.includes('PLAN') ||
              fileName.includes('OCTOBER')) {
        category = 'roadmap';
        icon = '🗺️';
    } else if (fileName.includes('API') || fileName.includes('ARCHITECTURE') ||
              fileName.includes('SYSTEM') || fileName.includes('TROUBLESHOOTING') ||
              fileName.includes('DEPLOYMENT') || fileName.includes('INTEGRATION') ||
              fileName.includes('LIBRARY') || fileName.includes('USAGE') ||
              fileName.includes('VERSION') || fileName.includes('CHANGELOG')) {
        category = 'technical';
        icon = '🔧';
    } else if (fileName.includes('STRUCTURE') || fileName.includes('DOCUMENTATION')) {
        category = 'structure';
        icon = '🏗️';
    }

    return {
        name: fileName,
        title: `${icon} ${title}`,
        description: description || 'وثيقة تقنية متخصصة في نظام AzizSys',
        category: category,
        size: formatFileSize(content.length),
        date: new Date().toISOString().split('T')[0],
        content: content
    };
}

function formatFileSize(bytes) {
    if (bytes < 1024) return bytes + 'B';
    if (bytes < 1024 * 1024) return Math.round(bytes / 1024) + 'KB';
    return Math.round(bytes / (1024 * 1024)) + 'MB';
}

// كتابة البيانات
const jsContent = `// تم إنشاء هذا الملف تلقائياً
const DOCS_DATA = ${JSON.stringify(allDocs, null, 2)};`;

fs.writeFileSync(outputFile, jsContent, 'utf8');
console.log(`✅ تم إنشاء ${allDocs.length} مستند في ${outputFile}`);