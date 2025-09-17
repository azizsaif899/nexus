const fs = require('fs');
const path = require('path');

// قراءة جميع ملفات .md في المجلد
function scanMarkdownFiles() {
    const docsDir = __dirname;
    const files = fs.readdirSync(docsDir).filter(file => file.endsWith('.md'));
    
    return files.map(file => {
        const filePath = path.join(docsDir, file);
        const stats = fs.statSync(filePath);
        const content = fs.readFileSync(filePath, 'utf8');
        
        // استخراج العنوان من أول سطر
        const firstLine = content.split('\n')[0];
        const title = firstLine.startsWith('#') ? firstLine.replace(/^#+\s*/, '') : file.replace('.md', '');
        
        // استخراج الوصف من ثاني سطر أو أول فقرة
        const lines = content.split('\n').filter(line => line.trim());
        let description = 'وثيقة تقنية';
        for (let i = 1; i < lines.length; i++) {
            if (!lines[i].startsWith('#') && lines[i].trim().length > 10) {
                description = lines[i].trim().substring(0, 100) + '...';
                break;
            }
        }
        
        // تحديد الفئة بناءً على اسم الملف
        let category = 'technical';
        if (file.toLowerCase().includes('guide') || file.toLowerCase().includes('manual')) {
            category = 'guide';
        } else if (file.toLowerCase().includes('report') || file.toLowerCase().includes('status')) {
            category = 'report';
        } else if (file.toLowerCase().includes('roadmap') || file.toLowerCase().includes('plan')) {
            category = 'roadmap';
        }
        
        return {
            name: file,
            title: `📄 ${title}`,
            description: description,
            category: category,
            size: `${Math.round(stats.size / 1024)}KB`,
            date: stats.mtime.toISOString().split('T')[0],
            content: content
        };
    });
}

// تحديث ملف docs_viewer.html
function updateDocsViewer() {
    const docs = scanMarkdownFiles();
    const htmlPath = path.join(__dirname, 'docs_viewer.html');
    
    if (!fs.existsSync(htmlPath)) {
        console.log('❌ ملف docs_viewer.html غير موجود');
        return;
    }
    
    let html = fs.readFileSync(htmlPath, 'utf8');
    
    // تحديث مصفوفة docs في JavaScript
    const docsArrayStart = html.indexOf('const docs = [');
    const docsArrayEnd = html.indexOf('];', docsArrayStart) + 2;
    
    if (docsArrayStart === -1) {
        console.log('❌ لم يتم العثور على مصفوفة docs');
        return;
    }
    
    const newDocsArray = `const docs = ${JSON.stringify(docs, null, 12)};`;
    html = html.substring(0, docsArrayStart) + newDocsArray + html.substring(docsArrayEnd);
    
    // تحديث محتوى المستندات
    const docContentsStart = html.indexOf('const docContents = {');
    const docContentsEnd = html.indexOf('};', docContentsStart) + 2;
    
    if (docContentsStart !== -1) {
        const docContents = {};
        docs.forEach(doc => {
            docContents[doc.name] = doc.content;
        });
        
        const newDocContents = `const docContents = ${JSON.stringify(docContents, null, 12)};`;
        html = html.substring(0, docContentsStart) + newDocContents + html.substring(docContentsEnd);
    }
    
    fs.writeFileSync(htmlPath, html, 'utf8');
    console.log(`✅ تم تحديث docs_viewer.html بـ ${docs.length} مستند`);
    
    // طباعة الملفات المحدثة
    console.log('\n📋 الملفات المحدثة:');
    docs.forEach(doc => {
        console.log(`  • ${doc.name} (${doc.size})`);
    });
}

// تشغيل التحديث
if (require.main === module) {
    console.log('🔄 بدء تحديث الوثائق...');
    updateDocsViewer();
    console.log('✅ تم الانتهاء من التحديث');
}

module.exports = { scanMarkdownFiles, updateDocsViewer };