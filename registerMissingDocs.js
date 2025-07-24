const fs = require('fs');
const path = require('path');

// --- Configuration ---
const ROOT_DIR = path.join(__dirname, '..');
const MANIFEST_PATH = path.join(ROOT_DIR, 'module_manifest.json');
// We will scan all JS files in the root directory to find all registrations.
const SRC_DIRS = [ROOT_DIR];

// --- Helper Functions ---

/**
 * Recursively finds all .js files in a directory.
 * @param {string} dir - The directory to scan.
 * @returns {string[]} - An array of full file paths.
 */
function getAllJsFiles(dir) {
    let results = [];
    const list = fs.readdirSync(dir);
    list.forEach(file => {
        const filePath = path.join(dir, file);
        const stat = fs.statSync(filePath);
        if (stat && stat.isDirectory()) {
            // Exclude node_modules and other non-source directories
            if (file !== 'node_modules' && file !== '.git' && file !== 'scripts') {
                results = results.concat(getAllJsFiles(filePath));
            }
        } else if (path.extname(file) === '.js' || path.extname(file) === '.gs') {
            results.push(filePath);
        }
    });
    return results;
}

/**
 * Extracts all documented module names from the project.
 * @returns {Set<string>} A set of documented module names.
 */
function getDocumentedModules() {
    const documented = new Set();
    const allFiles = SRC_DIRS.flatMap(dir => getAllJsFiles(dir));
    const regex = /DocsManager\.registerModuleDocs\s*\(\s*['"]([^'"]+)['"]/g;

    allFiles.forEach(file => {
        try {
            const content = fs.readFileSync(file, 'utf8');
            let match;
            while ((match = regex.exec(content)) !== null) {
                documented.add(match[1]);
            }
        } catch (e) {
            console.warn(`⚠️ Could not read file: ${file}`);
        }
    });
    return documented;
}

/**
 * Extracts all defined module names from the project using defineModule.
 * @returns {Set<string>} A set of defined module names.
 */
function getDefinedModules() {
    const defined = new Set();
    const allFiles = SRC_DIRS.flatMap(dir => getAllJsFiles(dir));
    const regex = /defineModule\s*\(\s*['"]([^'"]+)['"]/g;

    allFiles.forEach(file => {
        try {
            const content = fs.readFileSync(file, 'utf8');
            let match;
            while ((match = regex.exec(content)) !== null) {
                // Ignore placeholder modules if needed, or handle them specifically
                if (content.includes(`'${match[1]}', [], () => { return {}; }, { isPlaceholder: true }`)) continue;
                defined.add(match[1]);
            }
        } catch (e) {
            console.warn(`⚠️ Could not read file: ${file}`);
        }
    });
    return defined;
}


/**
 * Extracts public function names from a module's source code.
 * @param {string} sourceCode - The source code of the module file.
 * @returns {string[]} An array of public function names.
 */
function extractPublicFunctions(sourceCode) {
    const returnMatch = sourceCode.match(/return\s*\{([\s\S]*?)\};/);
    if (!returnMatch || !returnMatch[1]) {
        return [];
    }

    const returnBlock = returnMatch[1];
    // This regex handles `myFunc, anotherFunc: someVar, thirdFunc`
    const functions = returnBlock
        .split(',')
        .map(part => part.split(':')[0].trim())
        .filter(name => name && !name.startsWith('//')); // Filter out empty strings and comments

    return functions;
}


// --- Main Script ---

function generateMissingDocs() {
    console.log('🩺 Starting documentation scaffolding script...');

    try {
        const manifest = JSON.parse(fs.readFileSync(MANIFEST_PATH, 'utf8'));
        const allModules = new Map(manifest.map(m => [m.module, m.file]));
        const documentedModules = getDocumentedModules();

        const undocumentedModules = Array.from(allModules.keys()).filter(
            moduleName => !documentedModules.has(moduleName) && !moduleName.includes('.Dev.') && !moduleName.endsWith('namespace')
        );

        if (undocumentedModules.length === 0) {
            console.log('✅ Excellent! All modules are documented.');
            return;
        }

        console.log(`\n⚠️ Found ${undocumentedModules.length} undocumented modules. Generating scaffolds:\n`);

        undocumentedModules.forEach(moduleName => {
            const filePath = path.join(ROOT_DIR, allModules.get(moduleName));
            let snippet = `\n// --- Auto-generated documentation for ${moduleName} ---\n`;
            snippet += `DocsManager.registerModuleDocs('${moduleName}', [\n`;

            try {
                const sourceCode = fs.readFileSync(filePath, 'utf8');
                const functions = extractPublicFunctions(sourceCode);

                if (functions.length > 0) {
                    functions.forEach(funcName => {
                        snippet += `  { name: '${funcName}', description: 'TODO: Add description.' },\n`;
                    });
                } else {
                    snippet += `  // No public functions found to document.\n`;
                }

            } catch (e) {
                snippet += `  // Could not read or parse file: ${filePath}\n`;
            }

            snippet += `]);\n`;
            console.log(snippet);
        });

        console.log('\n📋 Please copy the snippets above and paste them into their respective module files.');

    } catch (e) {
        console.error(`❌ An error occurred: ${e.message}`);
    }
}

/**
 * Verifies the integrity of the module_manifest.json file.
 * 1. Checks for modules defined in code but not in the manifest.
 * 2. Checks for modules in the manifest but not defined in code (orphans).
 */
function verifyModuleManifest() {
    console.log('\n\n🩺 Starting module manifest verification...');
    try {
        const manifest = JSON.parse(fs.readFileSync(MANIFEST_PATH, 'utf8'));
        const registeredModules = new Set(manifest.map(m => m.module));
        const definedModules = getDefinedModules();

        // Check 1: Modules defined in code but not in manifest
        const unregistered = [...definedModules].filter(m => !registeredModules.has(m));
        if (unregistered.length > 0) {
            console.log(`\n❌ Found ${unregistered.length} modules defined in code but NOT registered in module_manifest.json:`);
            unregistered.forEach(moduleName => console.log(`  - ${moduleName}`));
            console.log('\n📋 Please add these modules to your module_manifest.json file.');
        } else {
            console.log('✅ All defined modules are correctly registered in the manifest.');
        }

        // Check 2: Modules in manifest but not defined in code (orphans)
        const orphans = [...registeredModules].filter(m => !definedModules.has(m));
        if (orphans.length > 0) {
            console.log(`\n⚠️ Found ${orphans.length} orphan modules registered in the manifest but NOT defined in any .js file:`);
            orphans.forEach(moduleName => console.log(`  - ${moduleName}`));
            console.log('\n📋 Please review and remove these from module_manifest.json if they are no longer needed.');
        } else {
            console.log('✅ No orphan modules found in the manifest.');
        }

    } catch (e) {
        console.error(`❌ An error occurred during manifest verification: ${e.message}`);
    }
}

generateMissingDocs();
verifyModuleManifest();