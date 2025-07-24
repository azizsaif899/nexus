/**
 * @file 80_docs_auditor.js
 * @module System.Dev.DocsAuditor
 * @version 1.0.0
 * @author عبدالعزيز
 * @description
 * وحدة لمراجعة وتدقيق توثيق المشروع آليًا.
 * تقارن الوحدات والدوال المعرفة في النظام مع ما هو مسجل في DocsManager.
 */

defineModule('System.Dev.DocsAuditor', ({ Utils, DocsManager }) => {

    /**
     * يقوم بتشغيل عملية تدقيق التوثيق الكاملة ويطبع تقريرًا في السجلات.
     * @returns {object} كائن التقرير المفصل.
     */
    function runAudit() {
        Utils.log('Starting Documentation Audit...');
        const report = {
            undocumentedModules: [],
            mismatchedModules: [],
            summary: {
                totalModules: 0,
                documentedModules: 0,
                undocumentedFunctions: 0,
                staleDocs: 0,
            }
        };

        // المصدر الأول للحقيقة: جميع الوحدات المعرفة في النظام (من مسجل المصنع في Injector).
        const allModuleNames = Object.keys(GAssistant.Utils.Injector._moduleFactories);
        report.summary.totalModules = allModuleNames.length;

        // المصدر الثاني للحقيقة: جميع التوثيقات المسجلة في DocsManager.
        const allDocs = DocsManager.getAllDocs();
        const documentedModuleNames = Object.keys(allDocs);
        report.summary.documentedModules = documentedModuleNames.length;

        // الخطوة 1: البحث عن الوحدات غير الموثقة تمامًا.
        report.undocumentedModules = allModuleNames.filter(name => !documentedModuleNames.includes(name) && !name.startsWith('System.Tests'));

        // الخطوة 2: للوحدات الموثقة، ابحث عن الدوال غير الموثقة.
        documentedModuleNames.forEach(moduleName => {
            if (!allModuleNames.includes(moduleName)) return;

            const moduleMismatch = { moduleName: moduleName, undocumentedFunctions: [], staleDocumentation: [] };
            const moduleInstance = GAssistant.Utils.Injector._moduleExports[moduleName];
            if (!moduleInstance || typeof moduleInstance !== 'object') return;

            const actualFunctionNames = Object.keys(moduleInstance).filter(key => typeof moduleInstance[key] === 'function' && !key.startsWith('_'));
            const documentedFunctionNames = (allDocs[moduleName] || []).map(doc => doc.name);

            // البحث عن دوال موجودة في الكود ولكن غير موثقة.
            moduleMismatch.undocumentedFunctions = actualFunctionNames.filter(name => !documentedFunctionNames.includes(name));
            // البحث عن توثيق لدوال لم تعد موجودة في الكود.
            moduleMismatch.staleDocumentation = documentedFunctionNames.filter(name => !actualFunctionNames.includes(name));

            if (moduleMismatch.undocumentedFunctions.length > 0 || moduleMismatch.staleDocumentation.length > 0) {
                report.mismatchedModules.push(moduleMismatch);
                report.summary.undocumentedFunctions += moduleMismatch.undocumentedFunctions.length;
                report.summary.staleDocs += moduleMismatch.staleDocumentation.length;
            }
        });

        _logReport(report);
        return report;
    }

    /**
     * ينسق ويطبع تقرير التدقيق في سجلات Apps Script.
     * @param {object} report - كائن التقرير الناتج عن runAudit.
     * @private
     */
    function _logReport(report) {
        let output = '--- 📝 Documentation Audit Report ---\n\n';
        output += `📊 Summary: Total Modules: ${report.summary.totalModules}, Documented: ${report.summary.documentedModules}, Undocumented Functions: ${report.summary.undocumentedFunctions}, Stale Docs: ${report.summary.staleDocs}\n\n`;

        if (report.undocumentedModules.length > 0) {
            output += '🚫 Undocumented Modules (Missing from DocsManager):\n' + report.undocumentedModules.map(name => `  - ${name}`).join('\n') + '\n\n';
        }

        if (report.mismatchedModules.length > 0) {
            output += '⚠️ Mismatched Modules (Functions need attention):\n';
            report.mismatchedModules.forEach(m => {
                output += `  - Module: ${m.moduleName}\n`;
                if (m.undocumentedFunctions.length > 0) output += `    - ❓ Undocumented Functions: ${m.undocumentedFunctions.join(', ')}\n`;
                if (m.staleDocumentation.length > 0) output += `    - 👻 Stale Docs (Not in code): ${m.staleDocumentation.join(', ')}\n`;
            });
            output += '\n';
        }

        if (report.undocumentedModules.length === 0 && report.mismatchedModules.length === 0) output += '✅ Excellent! All modules and public functions are correctly documented.\n';
        output += '--- End of Report ---';
        Logger.log(output);
    }

    return { runAudit };
});