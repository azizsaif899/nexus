warning: in the working copy of '00_Core/00_Utils.js', LF will be replaced by CRLF the next time Git touches it
[1mdiff --git a/00_Core/00_Utils.js b/00_Core/00_Utils.js[m
[1mindex 58d1d51..0d76867 100644[m
[1m--- a/00_Core/00_Utils.js[m
[1m+++ b/00_Core/00_Utils.js[m
[36m@@ -226,8 +226,16 @@[m [mGAssistant.Utils.Injector = GAssistant.Utils.Injector || {[m
           GAssistant.System.Utils.log(`✅ Injector: تم حل التبعية '${name}' -> [${status}] (المصدر: ${resolutionSource})`);[m
           resolved[name] = moduleInstance;[m
         } else {[m
[31m-          GAssistant.System.Utils.warn(`❌ Injector: تعذر حل التبعية '${name}'.\n  > الأسباب المحتملة: 1) خطأ إملائي في الاسم. 2) الوحدة غير مسجلة في 'module_manifest.json'. 3) لم يتم تشغيل 'node scripts/generatePushOrder.js' بعد تعديل التبعيات.`);[m
[32m+[m[32m          const errorMessage = `❌ Injector: تعذر حل التبعية '${name}'.\n  > الأسباب المحتملة: 1) خطأ إملائي في الاسم. 2) الوحدة غير مسجلة في 'module_manifest.json'. 3) لم يتم تشغيل 'node scripts/generatePushOrder.js' بعد تعديل التبعيات.`;[m
[32m+[m[32m          GAssistant.System.Utils.warn(errorMessage);[m
           resolved[name] = undefined;[m
[32m+[m
[32m+[m[32m          // ✅ ربط معماري: تسجيل هذا الفشل الحرج في Telemetry.[m
[32m+[m[32m          // بما أن Telemetry الآن وحدة ذات تبعيات صفرية، فهذا الاستدعاء آمن.[m
[32m+[m[32m          const telemetry = GAssistant.System.Telemetry;[m
[32m+[m[32m          if (telemetry && typeof telemetry.trackError === 'function') {[m
[32m+[m[32m            telemetry.trackError('Injector.DependencyNotFound', { dependencyName: name });[m
[32m+[m[32m          }[m
         }[m
       } finally {[m
         // ✅ Always remove the module from the resolving set when done.[m
[36m@@ -699,11 +707,12 @@[m [mGAssistant.Utils.Injector = GAssistant.Utils.Injector || {[m
  * @param {function(object): object} factory - Factory receiving resolved dependencies.[m
  */[m
 this.defineModule = function(name, arg2, arg3) {[m
[31m-  let factory;[m
[32m+[m[32m  let factory, options = { isPlaceholder: false };[m
   // Handle overloaded function signature to support both old and new module definitions.[m
   // Signature 1: defineModule(name, factory)[m
   // Signature 2: defineModule(name, dependenciesArray, factory)[m
[31m-  if (typeof arg2 === 'function') {[m
[32m+[m[32m  // Signature 3: defineModule(name, dependenciesArray, factory, options)[m
[32m+[m[32m  if (typeof arg2 === 'function') { // Simplified signature[m
     factory = arg2;[m
   } else if (Array.isArray(arg2) && typeof arg3 === 'function') {[m
     factory = arg3;[m
[36m@@ -714,6 +723,11 @@[m [mthis.defineModule = function(name, arg2, arg3) {[m
     throw new TypeError(errorMessage);[m
   }[m
 [m
[32m+[m[32m  // Check for the new options object in the full signature[m
[32m+[m[32m  if (arguments.length === 4 && typeof arguments[3] === 'object') {[m
[32m+[m[32m    options = { ...options, ...arguments[3] };[m
[32m+[m[32m  }[m
[32m+[m
   const parts = name.split('.');[m
   let current = GAssistant;[m
 [m
[36m@@ -761,6 +775,11 @@[m [mthis.defineModule = function(name, arg2, arg3) {[m
   // Build the module[m
   const exports = factory(deps);[m
 [m
[32m+[m[32m  // ✅ Attach the placeholder flag to the exported module for the Injector to read[m
[32m+[m[32m  if (options.isPlaceholder) {[m
[32m+[m[32m    exports._isPlaceholder = true;[m
[32m+[m[32m  }[m
[32m+[m
   // Attach to namespace[m
   current[moduleName] = exports;[m
 [m
[36m@@ -783,7 +802,7 @@[m [mthis.defineModule = function(name, arg2, arg3) {[m
  * This resolves the "Utils.log is not a function" error.[m
  * ==============================================================================[m
  */[m
[31m-defineModule('System.Utils', () => {[m
[32m+[m[32mdefineModule('System.Utils', [], () => {[m
   // ✅ إشارة مرور (Semaphore) لمنع التكرار اللانهائي عند تصدير سجل الأخطاء.[m
   let _isExportingLog = false;[m
 [m
