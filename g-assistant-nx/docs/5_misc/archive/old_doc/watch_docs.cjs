const fs = require('fs');
const path = require('path');
const { updateDocsViewer } = require('./auto_update_docs.cjs');

console.log('👁️ بدء مراقبة الملفات للتحديث التلقائي...');
console.log('📂 المجلد المراقب:', __dirname);
console.log('⏰ سيتم التحديث عند إضافة أو تعديل ملفات .md');
console.log('🛑 اضغط Ctrl+C للإيقاف\n');

// مراقبة المجلد للتغييرات
fs.watch(__dirname, { recursive: false }, (eventType, filename) => {
    if (filename && filename.endsWith('.md')) {
        console.log(`🔄 تم اكتشاف تغيير في: ${filename}`);
        console.log(`📅 الوقت: ${new Date().toLocaleString('ar-SA')}`);
        
        // انتظار قصير للتأكد من اكتمال الكتابة
        setTimeout(() => {
            try {
                updateDocsViewer();
                console.log('✅ تم التحديث بنجاح\n');
            } catch (error) {
                console.error('❌ خطأ في التحديث:', error.message);
            }
        }, 1000);
    }
});

// تحديث أولي
updateDocsViewer();

// إبقاء السكريبت يعمل
process.on('SIGINT', () => {
    console.log('\n🛑 تم إيقاف المراقبة');
    process.exit(0);
});