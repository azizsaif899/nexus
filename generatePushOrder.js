const fs = require('fs');
const path = require('path');

// Paths to the relevant files
const ROOT_DIR = __dirname; // The script is in the root, so __dirname is the root.
const CLASP_PATH = path.join(ROOT_DIR, '.clasp.json');
const MANIFEST_PATH = path.join(ROOT_DIR, 'module_manifest.json');

/**
 * Performs a topological sort on the modules based on their dependencies.
 * @param {Array<Object>} modules - The list of modules from the manifest.
 * @returns {{sorted: Array<string>, isCyclic: boolean}} - The sorted list of module names and a flag for cycles.
 */
function topologicalSort(modules) {
    const adj = new Map();
    const inDegree = new Map();
    const moduleNames = modules.map(m => m.module);

    // Initialize graph
    for (const moduleName of moduleNames) {
        adj.set(moduleName, []);
        inDegree.set(moduleName, 0);
    }

    // Build adjacency list and in-degree map
    for (const module of modules) {
        for (const dep of module.dependencies) {
            if (adj.has(dep)) {
                adj.get(dep).push(module.module);
                inDegree.set(module.module, inDegree.get(module.module) + 1);
            } else {
                console.warn(`⚠️ Warning: Module '${module.module}' has a dependency '${dep}' which is not defined in the manifest. Ignoring this dependency.`);
            }
        }
    }

    // Initialize queue with nodes having in-degree of 0
    const queue = [];
    for (const [moduleName, degree] of inDegree.entries()) {
        if (degree === 0) {
            queue.push(moduleName);
        }
    }

    const sortedOrder = [];
    while (queue.length > 0) {
        const u = queue.shift();
        sortedOrder.push(u);

        for (const v of (adj.get(u) || [])) {
            inDegree.set(v, inDegree.get(v) - 1);
            if (inDegree.get(v) === 0) {
                queue.push(v);
            }
        }
    }

    if (sortedOrder.length !== modules.length) {
        return { sorted: [], isCyclic: true };
    }

    return { sorted: sortedOrder, isCyclic: false };
}

/**
 * Main function to generate and update the file push order.
 */
function generatePushOrder() {
    console.log('🚀 Starting automatic generation of filePushOrder...');

    if (!fs.existsSync(CLASP_PATH) || !fs.existsSync(MANIFEST_PATH)) {
        console.error('❌ Error: .clasp.json or module_manifest.json not found in the root directory.');
        return;
    }
    const claspConfig = JSON.parse(fs.readFileSync(CLASP_PATH, 'utf8'));
    const modules = JSON.parse(fs.readFileSync(MANIFEST_PATH, 'utf8'));

    const { sorted: sortedModuleNames, isCyclic } = topologicalSort(modules);

    if (isCyclic) {
        console.error('❌ CRITICAL ERROR: A dependency cycle was detected in module_manifest.json. Cannot generate a valid push order. Please fix the cycle.');
        return;
    }
    console.log('✅ Topological sort successful.');

    const moduleToFileMap = new Map(modules.map(m => [m.module, m.file]));
    const sortedModuleFiles = sortedModuleNames.map(name => moduleToFileMap.get(name));

    const allManifestFiles = new Set(modules.map(m => m.file));
    const allCurrentFiles = claspConfig.filePushOrder || [];
    const lateFilesPattern = /^(90_|95_|99_|00_initializer\.js|80_docs_auditor\.js)/;
    const lateFiles = allCurrentFiles.filter(file => lateFilesPattern.test(file) && !allManifestFiles.has(file));
    const otherNonModuleFiles = allCurrentFiles.filter(file => !allManifestFiles.has(file) && !lateFiles.includes(file));

    const finalOrder = [...new Set([...sortedModuleFiles, ...otherNonModuleFiles, ...lateFiles])];

    claspConfig.filePushOrder = finalOrder;
    fs.writeFileSync(CLASP_PATH, JSON.stringify(claspConfig, null, 2), 'utf8');

    console.log('✅ Successfully generated and updated .clasp.json with the new filePushOrder!');
    console.log(`Total files in order: ${finalOrder.length}`);
}

generatePushOrder();