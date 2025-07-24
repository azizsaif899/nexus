/**
 * @file AzizSysRunner.js
 * @description
 * نقطة انطلاق لتشغيل واختبار نظام AzizSys في بيئة JavaScript عامة (خارج Google Apps Script).
 * يقوم هذا الملف بتهيئة محاكاة لخدمات GAS، تحميل الوحدات الأساسية، واختبار وظيفة رئيسية.
 */

// 1. استيراد محاكي خدمات GAS والمحمل الأساسي
// في بيئة Node.js، ستكون هذه `require('./src/gas_mocks.js')`
// For simplicity here, we assume these files are loaded in order.

// Let's assume gas_mocks.js and core_loader.js are loaded before this script.

console.log("--- 🚀 AzizSys Runner Initializing ---");

// 2. تهيئة النظام باستخدام المحمل الجديد
const AzizSys = initializeAzizSys();

// 3. تعريف الوحدات الأساسية التي نريد اختبارها
// في تطبيق حقيقي، سيتم تحميل هذه الوحدات ديناميكيًا.

// Define a mock 'Security' module for dependency resolution
AzizSys.defineModule('System.Security', () => ({
    sanitize: (input) => input,
}));

// Define a mock 'Tools' module
AzizSys.defineModule('System.Tools', () => ({
    ProjectService: {
        getProjectSourceCode: () => 'mock code;'
    }
}));

// Define the modules we want to test
AzizSys.defineModuleFromPath('e:\\azizsys5\\src\\azizsys_core\\modules\\utils.js');
AzizSys.defineModuleFromPath('e:\\azizsys5\\src\\azizsys_core\\modules\\config.js');
AzizSys.defineModuleFromPath('e:\\azizsys5\\src\\azizsys_core\\modules\\tools\\project_insights.js');


console.log("\n--- 🔬 Running Core System Test ---");

try {
    // 4. محاولة الحصول على وحدة رئيسية والتحقق من تبعياتها
    console.log("Attempting to get 'System.ToolsProjectInsights'...");
    const { ToolsProjectInsights } = AzizSys.Injector.get('System.ToolsProjectInsights');

    if (ToolsProjectInsights && typeof ToolsProjectInsights.analyzeProject === 'function') {
        console.log("✅ SUCCESS: 'System.ToolsProjectInsights' module loaded successfully.");
        console.log("✅ SUCCESS: Dependencies (Utils, Config, Security, Tools) were resolved correctly.");

        // 5. تشغيل دالة رئيسية للتحقق من التفاعل الداخلي
        const result = ToolsProjectInsights.analyzeProject({ userQuery: 'test query' });
        console.log("Testing 'analyzeProject' function call...");
        if (result && result.type === 'success') {
            console.log("✅ SUCCESS: 'analyzeProject' executed without errors and returned the expected type.");
            console.log("   > Mocked AI Response Data:", JSON.stringify(result.data));
        } else {
            console.error("❌ FAILURE: 'analyzeProject' did not return a successful response.", result);
        }
    } else {
        console.error("❌ FAILURE: Could not retrieve 'System.ToolsProjectInsights' or its functions.");
    }

} catch (e) {
    console.error("❌ FATAL ERROR during test run:", e.message, e.stack);
}

console.log("\n--- 🏁 AzizSys Runner Finished ---");