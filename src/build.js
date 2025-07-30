import fs from 'fs/promises';
import path from 'path';

// 💡 تغيير: الآن جذر العملية هو مجلد 'dist'
const ROOT_DIR = path.join(process.cwd(), 'dist');
const DIST_DIR = path.join(ROOT_DIR, 'dist');

// ملفات أساسية يجب أن تكون في البداية (بالترتيب الصحيح)
const PREPEND_FILES = [
    '00_utils.js',           // أولاً: نظام الوحدات والأدوات الأساسية
    '90_System/05_Types.js', // ثانياً: تعريف الأنواع
    '01_config.js',          // ثالثاً: الإعدادات (يحتاج Utils)
    '02_intro.js'            // رابعاً: المقدمة
];

// ملفات نقاط الدخول التي يجب أن تكون في النهاية
const APPEND_FILES = [
    '10_ui/1_ui_entry.js',
    '90_System/02_EditorTriggers.js',
    '99_Code.js',
    '99_Initializer.js'      // الأخير: التهيئة (يحتاج كل شيء آخر)
];

async function findSourceFiles() {
    // 💡 تغيير: البحث عن الملفات داخل مجلد 'dist' فقط
    const allFiles = [];
    const entries = await fs.readdir(ROOT_DIR, { recursive: true, withFileTypes: true });
    for (const entry of entries) {
        if (entry.isFile()) {
            // استخدام المسار النسبي داخل dist
            allFiles.push(path.relative(ROOT_DIR, path.join(entry.path, entry.name)));
        }
    }
    return allFiles.filter(f => f.endsWith('.js') || f.endsWith('.html'));
}

async function parseDependencies(files) {
    const dependencies = new Map();
    
    const modulePatterns = [
        /defineModule\s*\(\s*['"]([^'"]+)['"]\s*,\s*\[([^\]]*)\]\s*,/g,
        /defineModule\s*\(\s*['"]([^'"]+)['"]\s*,\s*\(\s*\{\s*([^}]*)\s*\}\s*\)/g,
        /defineModule\s*\(\s*['"]([^'"]+)['"]\s*,\s*\(\s*\)\s*=>/g,
        /defineModule\s*\(\s*['"]([^'"]+)['"]\s*,\s*\(\s*([^)]*)\s*\)\s*=>/g
    ];

    for (const file of files) {
        if (!file.endsWith('.js')) continue;

        try {
            const content = await fs.readFile(path.join(ROOT_DIR, file), 'utf-8');
            
            // ✅ إصلاح حاسم: البحث عن جميع defineModule في الملف، وليس فقط الأول
            for (const pattern of modulePatterns) {
                let match;
                pattern.lastIndex = 0; // 🐞 إصلاح: إعادة تعيين حالة Regex لمنع التداخل بين الأنماط
                while ((match = pattern.exec(content)) !== null) {
                    const moduleName = match[1];
                    let deps = [];
                    
                    if (match[2]) {
                        let depsStr = match[2].replace(/\/\/.*/g, '').replace(/[\n\r]/g, '').trim();
                        
                        // إزالة الأقواس المجعدة والمربعة
                        depsStr = depsStr.replace(/[{}\[\]]/g, '');
                        
                        if (depsStr.includes(',')) {
                            deps = depsStr.split(',')
                                .map(d => d.trim().replace(/['"]/g, '').split(':')[0].trim())
                                .filter(d => d && !d.includes('(') && !d.includes(')') && d.length > 0);
                        } else if (depsStr && !depsStr.includes('(')) {
                            const cleanDep = depsStr.replace(/['"]/g, '').split(':')[0].trim();
                            if (cleanDep.length > 0) {
                                deps = [cleanDep];
                            }
                        }
                    }
                    
                    dependencies.set(moduleName, { file, deps });
                    console.log(`📦 Found module: ${moduleName} in ${file} with deps: [${deps.join(', ')}]`);
                }
            }
        } catch (error) {
            console.warn(`⚠️ خطأ في قراءة الملف ${file}: ${error.message}`);
        }
    }
    
    return dependencies;
}

function resolveShortName(shortName, dependencies) {
    const shortNameMap = {
        // الوحدات الأساسية
        'Utils': 'System.Utils',
        'Config': 'System.Config', 
        'AI': 'System.AI',
        'UI': 'System.UI',
        'Tools': 'System.Tools',
        'Telemetry': 'System.Telemetry',
        'DocsManager': 'System.DocsManager',
        'Security': 'System.Security',
        'Memory': 'System.Memory',
        'Tests': 'System.Tests',
        
        // وحدات الواجهة
        'Dialogue': 'System.UI.Dialogue',
        
        // وحدات الذكاء الاصطناعي
        'Orchestrator': 'System.AI.Orchestrator',
        'JsonQuery': 'System.AI.JsonQuery',
        'CodeAssistance': 'System.AI.CodeAssistance',
        'Context': 'System.AI.Context',
        
        // وحدات العملاء
        'Router': 'System.Agents.Router',
        'AgentsCatalog': 'System.Agents.Catalog',
        'DevAgent': 'System.AgentDeveloper',
        'CFOAgent': 'System.AgentCFO',
        'GeneralAgent': 'System.AgentGeneral',
        
        // وحدات الوكلاء الجديدة
        'AgentTriggers': 'System.AgentTriggers',
        'AI.Agents.CFO': 'System.AI.Agents.CFO',
        'AI.Agents.Developer': 'System.AI.Agents.Developer',
        'AI.Agents.General': 'System.AI.Agents.General',
        'AI.Agents.RoleManager': 'System.AI.Agents.RoleManager',
        'AI.Agents.Orchestrator': 'System.AI.Agents.Orchestrator',
        'AI.CustomFunctions': 'System.AI.CustomFunctions',
        'AI.ModelManager': 'System.AI.ModelManager',
        'AI.MultimodalProcessor': 'System.AI.MultimodalProcessor',
        'AI.VertexAI': 'System.AI.VertexAI',
        'AI.DocumentAI': 'System.AI.DocumentAI',
        'AI.Agents.DatabaseManager': 'System.AI.Agents.DatabaseManager',
        'AI.GeminiWithFiles': 'System.AI.GeminiWithFiles',
        'AI.AutomationEngine': 'System.AI.AutomationEngine',
        
        // Core Enhanced Modules
        'Config.Enhanced': 'System.Config.Enhanced',
        'Auth': 'System.Auth',
        'Testing': 'System.Testing',
        'Setup': 'System.Setup',
        
        // Enhanced UI Modules
        'UI.Enhanced': 'System.UI.Enhanced',
        'UI.MessageProcessor': 'System.UI.MessageProcessor',
        
        // Advanced AI Modules
        'AI.IntentAnalyzer': 'System.AI.IntentAnalyzer',
        'AI.ToolExecutor': 'System.AI.ToolExecutor',
        'AI.FileProcessor': 'System.AI.FileProcessor',
        'AI.SmartTriggers': 'System.AI.SmartTriggers',
        
        // Enterprise Modules
        'PluginManager': 'System.PluginManager',
        'MLOps': 'System.MLOps',
        'WebhookManager': 'System.WebhookManager',
        'ComprehensiveTest': 'System.ComprehensiveTest',
        
        // File paths for new modules
        'System.AgentTriggers': 'src/agents/System.AgentTriggers.js',
        'System.AI.Agents.CFO': 'src/agents/System.AI.Agents.CFO.js',
        'System.AI.Agents.Developer': 'src/agents/System.AI.Agents.Developer.js',
        'System.AI.Agents.DatabaseManager': 'src/agents/System.AI.Agents.DatabaseManager.js',
        'System.AI.IntentAnalyzer': 'src/agents/System.AI.IntentAnalyzer.js',
        'System.AI.ToolExecutor': 'src/agents/System.AI.ToolExecutor.js',
        'System.AI.FileProcessor': 'src/agents/System.AI.FileProcessor.js',
        'System.UI.Enhanced': 'src/ui/System.UI.Enhanced.js',
        'System.Config.Enhanced': 'src/core/System.Config.Enhanced.js',
        'System.Auth': 'src/core/System.Auth.js',
        'System.PluginManager': 'src/core/System.PluginManager.js',
        'System.DependencyChecker': 'src/core/System.DependencyChecker.js',
        'System.EnhancedTest': 'src/core/System.EnhancedTest.js',
        
        // وحدات النظام
        'MetricsLogger': 'System.MetricsLogger',
        'ModuleVerifier': 'System.Dev.ModuleVerifier',
        'ProjectContextTracker': 'System.ProjectContextTracker',
        'Dispatcher': 'System.Dispatcher',
        
        // وحدات المحاسبة
        'ChartOfAccounts': 'System.Accounting.ChartOfAccounts',
        'Ledger': 'System.Accounting.Ledger',
        
        // وحدات API
        'API': 'System.API.Endpoints'
    };
    
    if (dependencies.has(shortName)) {
        return shortName;
    }
    
    const fullName = shortNameMap[shortName];
    if (fullName && dependencies.has(fullName)) {
        return fullName;
    }
    
    const systemName = `System.${shortName}`;
    if (dependencies.has(systemName)) {
        return systemName;
    }
    
    return null;
}

function topologicalSort(dependencies) {
    const sorted = [];
    const visited = new Set();
    const visiting = new Set();
    const moduleNames = Array.from(dependencies.keys());

    const visit = (moduleName) => {
        if (visited.has(moduleName)) return;
        if (visiting.has(moduleName)) {
            throw new Error(`🚨 خطأ: تم اكتشاف تبعية دائرية تتضمن الوحدة: ${moduleName}`);
        }

        visiting.add(moduleName);

        const node = dependencies.get(moduleName);
        if (node && node.deps) {
            for (const depName of node.deps) {
                const resolvedName = resolveShortName(depName, dependencies);
                if (resolvedName) {
                    visit(resolvedName);
                } else if (depName && depName.trim()) {
                    console.warn(`⚠️ تبعية غير موجودة: ${depName} مطلوبة بواسطة ${moduleName}`);
                }
            }
        }

        visiting.delete(moduleName);
        visited.add(moduleName);
        sorted.push(moduleName);
    };

    for (const moduleName of moduleNames) {
        if (!visited.has(moduleName)) {
            visit(moduleName);
        }
    }
    
    return sorted.map(name => dependencies.get(name).file);
}

async function generateDotFile(dependencies) {
    console.log('📊 Generating dependency graph DOT file...');
    let dotContent = 'digraph "G-Assistant Dependencies" {\n';
    dotContent += '  rankdir="LR";\n'; // Left-to-right layout
    dotContent += '  node [shape=box, style="rounded,filled", fillcolor="#EFEFEF", fontname="Arial"];\n';
    dotContent += '  edge [fontname="Arial"];\n\n';

    for (const [moduleName, node] of dependencies.entries()) {
        if (node.deps && node.deps.length > 0) {
            for (const depName of node.deps) {
                const resolvedDepName = resolveShortName(depName, dependencies);
                if (resolvedDepName) {
                    dotContent += `  "${moduleName}" -> "${resolvedDepName}";\n`;
                }
            }
        } else {
            // Add nodes that have no dependencies so they appear in the graph
            dotContent += `  "${moduleName}";\n`;
        }
    }

    dotContent += '}';
    await fs.writeFile(path.join(process.cwd(), 'dependency-graph.dot'), dotContent);
    console.log('✅ Dependency graph saved to dependency-graph.dot');
}

async function main() {
    console.log('🚀 بدء عملية ترتيب الملفات في مجلد dist...');
    // 💡 إزالة: لم يعد هذا السكريبت مسؤولاً عن التنظيف أو النسخ

    const allFiles = await findSourceFiles();
    const jsFiles = allFiles.filter(f => f.endsWith('.js'));
    
    console.log(`📁 تم العثور على ${jsFiles.length} ملف JavaScript في dist`);
    
    const dependencies = await parseDependencies(jsFiles);
    console.log(`🔗 تم تحليل ${dependencies.size} وحدة`);
    await generateDotFile(dependencies); // <-- إضافة: استدعاء دالة إنشاء الرسم البياني

    let sortedFiles = [];
    try {
        sortedFiles = topologicalSort(dependencies);
        console.log(`📋 تم ترتيب ${sortedFiles.length} وحدة حسب التبعيات`);
    } catch (error) {
        console.error('❌ خطأ في ترتيب التبعيات:', error.message);
        console.log('🔄 سيتم استخدام ترتيب افتراضي...');
        sortedFiles = jsFiles.filter(f => !PREPEND_FILES.includes(f) && !APPEND_FILES.includes(f));
    }

    // --- ✅ منطق محدث وموثوق لتجميع الملفات النهائية بدون تكرار ---
    // 1. ابدأ بالملفات التي تم فرزها حسب التبعيات.
    const mainSortedFiles = new Set(sortedFiles);

    // 2. أضف أي ملفات JS أخرى لم تكن جزءًا من نظام الوحدات (مثل ملفات HTML المحولة).
    jsFiles.forEach(file => mainSortedFiles.add(file));

    // 3. قم بإزالة الملفات التي سيتم إضافتها يدويًا في البداية والنهاية لتجنب التكرار.
    const specialFiles = new Set([...PREPEND_FILES, ...APPEND_FILES]);
    specialFiles.forEach(file => mainSortedFiles.delete(file));

    // 4. قم بتجميع القائمة النهائية بالترتيب الصحيح وباستخدام Set لضمان عدم التكرار.
    const mainFiles = Array.from(mainSortedFiles);

    const finalFileOrder = [...new Set([
        ...PREPEND_FILES,
        ...mainFiles,
        ...APPEND_FILES
    ])].map(p => p.replace(/\\/g, '/'));

    console.log(`✅ تم ترتيب ${finalFileOrder.length} ملف JavaScript بنجاح.`);

    // 💡 إزالة: لم يعد هذا السكريبت مسؤولاً عن النسخ

    // إنشاء appsscript.json
    // 💡 تغيير: قراءة الملف الأصلي من جذر المشروع
    const manifestPath = path.join(process.cwd(), 'appsscript.json');
    let manifest = {};
    
    try {
        manifest = JSON.parse(await fs.readFile(manifestPath, 'utf-8'));
    } catch (error) {
        console.warn('⚠️ لم يتم العثور على appsscript.json، سيتم إنشاء ملف جديد');
        manifest = {
            "timeZone": "Asia/Riyadh",
            "dependencies": {
                "enabledAdvancedServices": []
            },
            "exceptionLogging": "STACKDRIVER",
            "runtimeVersion": "V8"
        };
    }
    
    // ✅ إصلاح حاسم: بدلاً من حذف filePushOrder، نقوم بإنشائه بناءً على الترتيب الطوبولوجي.
    // هذا يضمن أن Google Apps Script سيحمل الملفات بالترتيب الصحيح الذي حسبناه.
    manifest.filePushOrder = finalFileOrder;

    // 💡 تغيير: الكتابة إلى مجلد dist
    const distManifestPath = path.join(ROOT_DIR, 'appsscript.json');
    await fs.writeFile(distManifestPath, JSON.stringify(manifest, null, 2));
    console.log('✅ تم إنشاء appsscript.json بنجاح.');

    console.log('\n✨ اكتملت عملية ترتيب الملفات بنجاح!');
    console.log('-------------------------------------');
    console.log(`📊 إحصائيات البناء:`);
    console.log(`   • ${jsFiles.length} ملف JavaScript`);
    console.log(`   • ${dependencies.size} وحدة معرفة`);
    console.log(`   • ${allFiles.length} ملف إجمالي`);
    console.log('-------------------------------------');
}

main().catch(error => {
    console.error('💥 خطأ فادح في عملية البناء:', error);
    process.exit(1);
});