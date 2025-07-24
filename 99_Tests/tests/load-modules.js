const fs = require('fs');
const path = require('path');
const vm = require('vm');

// Dynamically read the file order from appsscript.json
const manifestPath = path.join(__dirname, '..', 'appsscript.json');
const manifest = JSON.parse(fs.readFileSync(manifestPath, 'utf8'));
const fileOrder = manifest.files;

// The sandbox needs all the globals defined in setup.js
const sandbox = {
    ...global, // Pass all globals from the setup file (SpreadsheetApp, CacheService, etc.)
    console: console, // Explicitly pass console to the sandbox
};

// Create a context that will act as our shared global scope
const context = vm.createContext(sandbox);

console.log('--- Loading all project modules for local testing ---');

fileOrder.forEach(file => {
    // Construct the full path to the file. The paths in appsscript.json are relative to the root.
    const filePath = path.join(__dirname, '..', file);
    
    // Check if the file exists and is a JS/GS file
    if (fs.existsSync(filePath) && (path.extname(file) === '.js' || path.extname(file) === '.gs')) {
        const code = fs.readFileSync(filePath, 'utf8');
        try {
            // Run the script in the shared context
            vm.runInContext(code, context, { filename: file });
        } catch (e) {
            console.error(`\n❌ Error loading module: ${file}`);
            console.error(e);
            process.exit(1); // Exit if any module fails to load
        }
    }
});

console.log('--- All modules loaded successfully. Running tests... ---\n');

// Export the loaded GAssistant object so that test files can import it
module.exports = context.GAssistant;