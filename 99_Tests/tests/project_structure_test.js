/**
 * Reads project_manifest.json from Drive root and returns it as parsed JSON.
 */
function _loadManifest() {
  const files = DriveApp.getFilesByName('project_manifest.json');
  if (!files.hasNext()) {
    throw new Error('project_manifest.json not found in Drive root!');
  }
  const file = files.next();
  const text = file.getBlob().getDataAsString();
  return JSON.parse(text);
}


/**
 * Tests project structure against the manifest:
 * 1. Verifies each listed file exists in Drive root.
 * 2. If an entry has `module`, checks for defineModule('moduleName').
 * 3. If an entry has `defines`, checks that each symbol is defined.
 */
function testProjectStructure() {
  const manifest = _loadManifest();
  const missing = [];

  manifest.modules.forEach(entry => {
    try {
      // 1) Check file exists
      const name = entry.file;
      const files = DriveApp.getFilesByName(name);
      if (!files.hasNext()) {
        throw new Error('File not found');
      }
      const content = files.next().getBlob().getDataAsString();

      // 2) If `module` is specified, verify defineModule call
      if (entry.module) {
        const marker = `defineModule('${entry.module}`;
        if (content.indexOf(marker) < 0) {
          throw new Error(`Missing defineModule call for ${entry.module}`);
        }
      }

      // 3) If `defines` array is present, verify each symbol
      if (Array.isArray(entry.defines)) {
        entry.defines.forEach(symbol => {
          const regex = new RegExp(`\\b${symbol}\\b`);
          if (!regex.test(content)) {
            throw new Error(`Missing symbol definition: ${symbol}`);
          }
        });
      }

    } catch (e) {
      missing.push({ file: entry.file, error: e.message });
    }
  });

  // Report results
  if (missing.length) {
    Logger.log('❌ Project Structure Test FAILED:');
    missing.forEach(m => Logger.log(`• ${m.file}: ${m.error}`));
    throw new Error('Some files/modules are missing—راجع الـLogs');
  } else {
    Logger.log('✅ All files and modules are present and correct!');
  }
}


/**
 * Default function to run from the Apps Script editor ▶️ Run button.
 */
function myFunction() {
  testProjectStructure();
}
