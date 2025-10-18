const fs = require('fs');
const path = require('path');

const basePath = 'C:\\nexus\\apps\\nexus-ai-main';
const foldersToDelete = ['app', 'components', 'lib', 'node_modules_old', 'project'];

// Kill Node.js processes first
const { exec } = require('child_process');
exec('taskkill /F /IM node.exe', (error) => {
  if (error) console.log('No node processes to kill or error:', error.message);
});

// Delete folders
foldersToDelete.forEach(folder => {
  const folderPath = path.join(basePath, folder);
  try {
    if (fs.existsSync(folderPath)) {
      fs.rmSync(folderPath, { recursive: true, force: true });
      console.log(`✅ Deleted: ${folder}`);
    } else {
      console.log(`⚠️ Not found: ${folder}`);
    }
  } catch (error) {
    console.log(`❌ Error deleting ${folder}:`, error.message);
  }
});

console.log('🎯 Deletion process completed');