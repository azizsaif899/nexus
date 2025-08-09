/**
 * @file 30_tools/0_tools_catalog.js
 * @module System.Tools.Catalog
 * @version 1.1.0
 * @author عبدالعزيز
 * @description
 * كتالوج مركزي لتسجيل وإدارة جميع الأدوات (Functions) المتاحة في النظام.
 * يعمل كسجل موثوق يمكن للذكاء الاصطناعي الاستعلام عنه لاكتشاف الأدوات المتاحة.
 */

defineModule('System.Tools.Catalog', ({ Utils }) => {
    const Utils = GAssistant.Utils || (() => {
        throw new Error("Utils module not loaded");
    })();

    const registeredTools = {};
    const registeredDeclarations = {};

    /**
     * يسجل أداة جديدة مع تعريفها (schema).
     * @param {string} name - الاسم الكامل للأداة (e.g., 'Developer.reviewCode').
     * @param {function} func - الدالة الفعلية التي سيتم تنفيذها.
     * @param {object} declaration - كائن JSON Schema الذي يصف الدالة.
     */
    function register(name, func, declaration) {
        try {
            Utils.log(`Tools.Catalog: Registering tool '${name}'`);
            registeredTools[name] = func;
            registeredDeclarations[name] = declaration;
        } catch (e) {
            console.error(`Failed to register tool ${name}:`, e.message);
        }
    }

    /**
     * يجلب دالة قابلة للتنفيذ بالاسم.
     * @param {string} name - اسم الأداة.
     * @returns {function|null}
     */
    function getFunction(name) {
        return registeredTools[name] || null;
    }

    /**
     * يجلب تعريف (schema) دالة معينة بالاسم.
     * @param {string} name - اسم الأداة.
     * @returns {object|null}
     */
    function getDeclaration(name) {
        return registeredDeclarations[name] || null;
    }

    /**
     * يجلب جميع تعريفات الأدوات المسجلة.
     * @returns {object[]}
     */
    function getDeclarations() {
        return Object.values(registeredDeclarations);
    }

    return { register, getFunction, getDeclaration, getDeclarations };
});