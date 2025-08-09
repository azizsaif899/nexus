const fs = require('fs');
const path = require('path');

// تحديد جذر المشروع
const projectRoot = path.resolve(__dirname, '..'); // يذهب مجلد واحد للأعلى من 'doc'

// تحديد ملف الإخراج
const outputFile = path.join(__dirname, 'docs_data.js');

// المجلدات التي يجب استثناؤها من البحث
const excludeDirs = [
    'node_modules',
    '.git',
    'dist',
    'coverage',
    'gemini_fullstack', // إذا كان هذا مجلد مشروع فرعي لا يحتوي على وثائق عامة
    'october_implementation', // إذا كان هذا مجلد مشروع فرعي لا يحتوي على وثائق عامة
    '‏‏updated_docs - نسخة', // مجلد نسخة احتياطية
    '.vscode',
    '.amazonq',
    '.github',
    'scripts',
    'src', // إذا كانت ملفات .md هنا هي توثيق داخلي للكود وليست للواجهة
    'tests', // إذا كانت ملفات .md هنا هي تقارير اختبار فقط
    // أضف أي مجلدات أخرى لا تود فهرستها
];

const allDocs = [];

// دالة للبحث المتكرر عن ملفات .md
function findMarkdownFiles(currentDir) {
    const files = fs.readdirSync(currentDir);

    files.forEach(file => {
        const filePath = path.join(currentDir, file);
        const stat = fs.statSync(filePath);

        if (stat.isDirectory()) {
            // استثناء المجلدات غير المرغوب فيها
            if (!excludeDirs.includes(file)) {
                findMarkdownFiles(filePath); // البحث المتكرر
            }
        } else if (file.endsWith('.md')) {
            try {
                const content = fs.readFileSync(filePath, 'utf8');
                // تمرير المسار الكامل للملف لتحسين تحديد الفئة
                const doc = parseMarkdownFile(file, content, filePath);
                allDocs.push(doc);
            } catch (error) {
                console.log(`تعذر قراءة الملف: ${filePath} - ${error.message}`);
            }
        }
    });
}

// تعديل دالة parseMarkdownFile لتأخذ المسار الكامل
function parseMarkdownFile(fileName, content, fullPath) {
    const lines = content.split('\n');
    let title = fileName.replace('.md', '');
    let description = '';
    let category = 'technical'; // الفئة الافتراضية
    let icon = '📄';

    // استخراج العنوان من أول سطر يبدأ بـ #
    for (let i = 0; i < Math.min(10, lines.length); i++) {
        const line = lines[i].trim();
        if (line.startsWith('# ')) {
            title = line.substring(2).trim();
            break;
        }
    }

    // استخراج الوصف من أول فقرة مفيدة
    for (let i = 0; i < Math.min(30, lines.length); i++) {
        const line = lines[i].trim();
        if (line && !line.startsWith('#') && !line.startsWith('**') &&
            !line.startsWith('---') && !line.startsWith('|') &&
            !line.startsWith('```') && line.length > 30) {
            description = line.substring(0, 200) + '...';
            break;
        }
    }

    // تحديد الفئة والأيقونة بناءً على اسم الملف والمسار الكامل
    const lowerCaseFileName = fileName.toLowerCase();
    const relativePath = path.relative(projectRoot, fullPath).toLowerCase(); // المسار النسبي

    if (lowerCaseFileName.includes('guide') || lowerCaseFileName.includes('manual') || lowerCaseFileName.includes('client')) {
        category = 'guide';
        icon = '📖';
    } else if (lowerCaseFileName.includes('report') || lowerCaseFileName.includes('success') ||
              lowerCaseFileName.includes('analysis') || lowerCaseFileName.includes('status') ||
              lowerCaseFileName.includes('verification')) {
        category = 'report';
        icon = '📊';
    } else if (lowerCaseFileName.includes('roadmap') || lowerCaseFileName.includes('plan') ||
              lowerCaseFileName.includes('october')) {
        category = 'roadmap';
        icon = '🗺️';
    } else if (lowerCaseFileName.includes('api') || lowerCaseFileName.includes('architecture') ||
              lowerCaseFileName.includes('system') || lowerCaseFileName.includes('troubleshooting') ||
              lowerCaseFileName.includes('deployment') || lowerCaseFileName.includes('integration') ||
              lowerCaseFileName.includes('library') || lowerCaseFileName.includes('usage') ||
              lowerCaseFileName.includes('version') || lowerCaseFileName.includes('changelog')) {
        category = 'technical';
        icon = '🔧';
    } else if (lowerCaseFileName.includes('structure') || lowerCaseFileName.includes('documentation')) {
        category = 'structure';
        icon = '🏗️';
    }
    // إضافة تصنيفات جديدة بناءً على المسار إذا لزم الأمر
    else if (relativePath.includes('updated_docs')) {
        category = 'archive'; // فئة جديدة للوثائق المؤرشفة
        icon = '🗄️';
    } else if (relativePath.includes('tests')) {
        category = 'test_reports'; // فئة جديدة لتقارير الاختبار
        icon = '🧪';
    } else if (relativePath.includes('october_implementation')) {
        category = 'project_specific'; // فئة للمشاريع الفرعية
        icon = '💡';
    }


    return {
        name: fileName,
        fullPath: fullPath, // إضافة المسار الكامل لتسهيل الوصول إليه لاحقًا
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

// بدء البحث من جذر المشروع
findMarkdownFiles(projectRoot);

// كتابة البيانات
const jsContent = `// تم إنشاء هذا الملف تلقائياً\nconst DOCS_DATA = ${JSON.stringify(allDocs, null, 2)};`;

fs.writeFileSync(outputFile, jsContent, 'utf8');
console.log(`✅ تم إنشاء ${allDocs.length} مستند في ${outputFile}`);