const fs = require('fs');
const path = require('path');

const logFilePath = path.join(__dirname, '..', 'AzizSys_ErrorLog.js');

function displayLog() {
    console.clear();
    console.log('--- 🩺 AzizSys Live Error Log ---');
    console.log(`Last updated: ${new Date().toLocaleTimeString()}\n`);

    if (!fs.existsSync(logFilePath)) {
        console.log('🟡 Waiting for the first error log file to be created...');
        console.log('   Run `createLiveErrorFile()` in Apps Script and download the file to the project root.');
        return;
    }

    try {
        // نقرأ محتوى الملف ونزيل تعريف المتغير للحصول على JSON نقي
        const fileContent = fs.readFileSync(logFilePath, 'utf8');
        const jsonString = fileContent.replace('const AzizSys_ErrorLog =', '').replace(/;$/, '').trim();

        if (!jsonString) {
             console.log('✅ Log file is empty. No errors recorded yet.');
             return;
        }

        const errorLog = JSON.parse(jsonString);

        if (errorLog.length === 0) {
            console.log('✅ No errors recorded yet.');
            return;
        }

        errorLog.forEach(e => {
            const time = new Date(e.time).toLocaleTimeString('en-US');
            console.log(`[${time}] 📍 ${e.source} ➡️  ❌ ${e.message}`);
        });

    } catch (error) {
        console.error('❌ Failed to read or parse the error log file.');
        console.error(error);
    }
}

displayLog();