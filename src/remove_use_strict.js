const fs = require('fs');
const path = require('path');

const folderPath = './'; // المجلد الحالي

function processFile(filePath) {
  let content = fs.readFileSync(filePath, 'utf8');

  if (
    content.includes('defineModule') &&
    /\{\s*\w+/.test(content) &&
    (content.includes('') || content.includes(''))
  ) {
    content = content.replace(/["']use strict["'];?\s*\n?/g, '');
    fs.writeFileSync(filePath, content, 'utf8');
    console.log(`✔️ Removed from ${path.basename(filePath)}`);
  }
}

function processDirectory(dirPath) {
  const entries = fs.readdirSync(dirPath, { withFileTypes: true });

  for (const entry of entries) {
    const fullPath = path.join(dirPath, entry.name);

    if (entry.isDirectory() && !entry.name.startsWith('.') && entry.name !== 'node_modules' && entry.name !== 'backup_old_project') {
      processDirectory(fullPath);
    } else if (entry.isFile() && (entry.name.endsWith('.js') || entry.name.endsWith('.gs'))) {
      processFile(fullPath);
    }
  }
}

console.log('🚀 Starting to remove from files with defineModule...');
processDirectory(folderPath);
console.log('✅ Done!');
