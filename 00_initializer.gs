/**
 * @file 00_initializer.gs
 * @description نقطة التهيئة الموحدة - حل التبعيات الدائرية
 */

if (typeof GAssistant === 'undefined') {
  var GAssistant = {};
  GAssistant.UI = {};
  GAssistant.AI = {};
  GAssistant.Tools = {};
  GAssistant.System = {};
  GAssistant.Utils = {};
  GAssistant.Agents = {};
}

function initializeApp() {
  try {
    // تحميل الوحدات بالتسلسل الصحيح
    if (typeof GAssistant.Utils.Injector !== 'undefined') {
      GAssistant.Utils.Injector.buildAllModules();
    }
    
    // تشغيل التهيئة
    if (typeof initializeGAssistantSystem === 'function') {
      return initializeGAssistantSystem();
    }
    
    console.log('✅ System initialized successfully');
    return true;
  } catch (e) {
    console.error('❌ Initialization failed:', e.message);
    return false;
  }
}

// تشغيل التهيئة عند التحميل
if (typeof SpreadsheetApp !== 'undefined') {
  initializeApp();
}