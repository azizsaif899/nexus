/**
 * @file 90_System/02_EditorTriggers.js
 * @module System.Triggers
 * @version 2.0.0
 * @author عبدالعزيز
 * @description نقطة الدخول الرئيسية للتطبيق. مسؤول عن إنشاء القوائم، وإعداد المهام المجدولة،
 * وتنفيذ عمليات التحقق الأولية عند فتح المستند.
 */

'use strict';

/**
 * دالة مساعدة لإنشاء التغليف المطلوب للتشغيل الدوري.
 * يجب أن تكون دالة عامة ليتمكن Apps Script من استدعائها.
 */
function _scheduled_runProjectInsights() {
  // التأكد من أن النظام قد تم تهيئته بالكامل قبل التشغيل
  if (typeof GAssistant !== 'undefined' && GAssistant.Tools && GAssistant.Tools.ProjectInsights) {
    GAssistant.Tools.ProjectInsights.runScheduledInsights();
  } else {
    console.error('Trigger Error: GAssistant system not ready for scheduled task.');
  }
}

/**
 * دالة إعداد triggers المجدولة.
 * @private
 */
function _setupScheduledTriggers() {
  const triggerFunctionName = '_scheduled_runProjectInsights';
  const existingTriggers = ScriptApp.getProjectTriggers().map(t => t.getHandlerFunction());

  if (!existingTriggers.includes(triggerFunctionName)) {
    try {
      ScriptApp.newTrigger(triggerFunctionName)
        .timeBased()
        .everyDays(1)
        .atHour(2) // Runs between 2-3 AM
        .create();
      console.log(`✅ Trigger for '${triggerFunctionName}' created successfully.`);
    } catch (e) {
      console.error(`Failed to create trigger '${triggerFunctionName}'. This may be due to permissions. Error: ${e.message}`);
    }
  }
}

/**
 * الدالة الرئيسية التي يتم استدعاؤها تلقائيًا بواسطة Apps Script عند فتح المستند.
 * @public
 */
function onOpen(e) {
  try {
    // 1. إنشاء القوائم الأساسية في واجهة المستخدم.
    SpreadsheetApp.getUi()
      .createMenu('G-Assistant')
      .addItem('🤖 فتح المساعد', 'showAssistantSidebar')
      .addSeparator()
      .addItem('👨‍💻 أدوات المطورين', 'showDeveloperSidebar')
      .addItem('📊 حالة النظام', 'showSystemStatus')
      .addToUi();

    // 2. إعداد المهام المجدولة (فقط إذا كان المستخدم لديه الصلاحية).
    if (e && e.authMode !== ScriptApp.AuthMode.NONE) {
      _setupScheduledTriggers();
    }

    console.log('✅ G-Assistant UI and triggers initialized.');

  } catch (err) {
    console.error(`Fatal error during onOpen: ${err.stack || err.message}`);
    SpreadsheetApp.getUi().alert(`حدث خطأ فادح أثناء تهيئة G-Assistant: ${err.message}`);
  }
}