// قائمة G-Assistant وإدارة التشغيل الآمن
function onOpen() {
  try {
    SpreadsheetApp.getUi()
      .createMenu('🚀 G-Assistant')
      .addItem('تهيئة النظام', 'initializeSystem')
      .addItem('تشخيص الوحدات', 'debugModules')
      .addItem('فحص الصحة', 'runHealthCheck')
      .addSeparator()
      .addItem('إعادة تشغيل', 'restartSystem')
      .addToUi();
  } catch (e) {
    Logger.log(`Menu creation failed: ${e.message}`);
  }
}

function restartSystem() {
  try {
    SpreadsheetApp.getUi().alert('🔄 إعادة تشغيل النظام...');
    initializeSystem();
    SpreadsheetApp.getUi().alert('✅ تم إعادة تشغيل النظام بنجاح!');
  } catch (e) {
    SpreadsheetApp.getUi().alert(`❌ فشل إعادة التشغيل: ${e.message}`);
  }
}

function runHealthCheck() {
  try {
    if (GAssistant?.System?.HealthCheck?.runHealthCheckAndSave) {
      const report = GAssistant.System.HealthCheck.runHealthCheckAndSave();
      SpreadsheetApp.getUi().alert(`📊 صحة النظام: ${report.systemStatus}`);
    } else {
      SpreadsheetApp.getUi().alert('⚠️ فحص الصحة غير متوفر');
    }
  } catch (e) {
    SpreadsheetApp.getUi().alert(`❌ فشل فحص الصحة: ${e.message}`);
  }
}