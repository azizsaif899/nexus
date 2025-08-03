/**
 * @file generate-indices.js
 * @module System.Dev.GenerateIndices
 * @description
 * يقوم هذا السكربت بالمرور على جميع المجلدات داخل `src/` وإنشاء ملفات `index.js`
 * (barrel files) تلقائيًا لتجميع وإعادة تصدير جميع الوحدات في كل مجلد.
 *
 * To run: `node src/dev_tools/generate-indices.js`
 */

// ES6 import removed for Apps Script compatibility
// ES6 import removed for Apps Script compatibility
const SRC_DIR = path.join(process.cwd(), 'src');

async function generateIndexForDir(dirPath) {
  const entries = await fs.readdir(dirPath, { withFileTypes: true });
  const exportLines = [];
  const subDirs = [];

  for (const entry of entries) {
    const entryPath = path.join(dirPath, entry.name);
    if (entry.isDirectory() && entry.name !== 'dev_tools') { // تجاهل مجلد الأدوات نفسه
      subDirs.push(entryPath);
    } else if (entry.name.endsWith('.js') && entry.name !== 'index.js' && !entry.name.endsWith('.test.js')) {
      exportLines.push(`export * from './${entry.name}';`);
    }
  }

  if (exportLines.length > 0) {
    const indexPath = path.join(dirPath, 'index.js');
    const content = `/**\n * @file Barrel file for the ${path.basename(dirPath)} module.\n * @description Aggregates and re-exports all modules in this directory.\n */\n\n` + exportLines.join('\n');
    await fs.writeFile(indexPath, content, 'utf8');
    console.log(`✅ Generated index for: ${path.relative(process.cwd(), dirPath)}`);
  }

  for (const subDir of subDirs) {
    await generateIndexForDir(subDir);
  }
}

async function main() {
  console.log('🚀 Generating barrel files (index.js)...');
  await generateIndexForDir(SRC_DIR);
  console.log('🎉 Finished generating index files.');
}

main().catch(console.error);
