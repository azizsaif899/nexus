// *************************************************************************************************
// --- START OF FILE: 10_ui/2_ui_developerSidebar.gs ---
// *************************************************************************************************

/**
 * @file 10_ui/2_ui_developerSidebar.gs
 * @module System.UI.DeveloperSidebar
 * @version 1.1.1 // ✅ تحديث الإصدار للدلالة على التغييرات في معالجة الطلبات
 * @author عبدالعزيز
 * @description
 * وحدة عرض شريط أدوات المطورين Sidebar داخل Google Sheets،
 * وتعامل مع طلبات المستخدم من الواجهة إلى النظام.
 * المراحل المعمارية المطبقة:
 * • 1 defineModule وربط التبعيات
 * • 4 واجهة تفاعلية – إظهار Sidebar
 * • 6 معالجة طلبات المستخدم (Client→Server)
 * • 9 تسجيل الوثائق في DocsManager
 * • 10 حفظ استدعاءات Sidebar وطلبات المستخدم في LongTermMemory
 * • 11 إرسال Telemetry عند الفتح وعند الطلب
 * • 17 تسجيل مقاييس العرض والطلبات في أوراق Google Sheets
 * • 18 تضمين رقم الإصدار في البيانات الوصفية
 */

'use strict';

defineModule('System.UI.DeveloperSidebar', ({ Utils, Config, DocsManager, AI, Telemetry, UI }) => { // ✅ إضافة UI
  const MODULE_VERSION = Config.get('DEVELOPER_SIDEBAR_VERSION') || '1.1.1';
  const UI_METRICS_SHEET = 'UI_Metrics'; // اسم ورقة المقاييس لواجهة المستخدم

  // مرحلة 9: تسجيل وثائق الوظائف
  DocsManager.registerModuleDocs('System.UI.DeveloperSidebar', [
    {
      name: 'showDeveloperSidebar',
      version: MODULE_VERSION,
      description: 'يفتح شريط أدوات المطور في واجهة Google Sheets.'
    },
    {
      name: 'handleDeveloperRequest',
      version: MODULE_VERSION,
      description: 'يتلقى طلبات المستخدم من Sidebar ويحوّلها إلى IntentAnalyzer لتحديد النية، ثم يوجهها للأدوات المناسبة أو AI.Core.',
      parameters: {
        type: 'OBJECT',
        properties: {
          action: { type: 'STRING', description: 'الطلب النصي من المستخدم.', required: true },
          code: { type: 'STRING', description: 'كود لإرساله إلى الأدوات (اختياري).', optional: true },
          description: { type: 'STRING', description: 'وصف لتوليد كود جديد (اختياري).', optional: true },
          sessionId: { type: 'STRING', description: 'معرف الجلسة للمحادثة (اختياري).', optional: true } // ✅ إضافة sessionId
        },
        required: ['action']
      }
    }
  ]);

  /**
   * يفتح شريط أدوات المطورين في واجهة Google Sheets.
   * @returns {object} UiResponse
   */
  function showDeveloperSidebar() {
    const start = Date.now();
    let status = 'error';
    try {
      const html = HtmlService.createTemplateFromFile('DeveloperSidebar')
        .evaluate()
        .setTitle('🛠️ ورشة عمل المطورين');

      SpreadsheetApp.getUi().showSidebar(html);

      // حفظ الحدث في LongTermMemory
      AI.LongTermMemory.save('DeveloperSidebarOpened', {
        module: 'UI.DeveloperSidebar',
        version: MODULE_VERSION,
        timestamp: new Date().toISOString()
      });

      // إرسال Telemetry
      Telemetry.track('UI.DeveloperSidebar.Open', {
        version: MODULE_VERSION,
        timestamp: new Date().toISOString()
      });

      // تسجيل المقياس في ورقة UI_Metrics
      const sheet = Utils.getSheet(UI_METRICS_SHEET, ['Timestamp', 'Component', 'Version', 'Action']);
      if (sheet) {
        sheet.appendRow([new Date(), 'DeveloperSidebar', MODULE_VERSION, 'open']);
      }
      status = 'success';
      return UI.Dialogue.createInfo('تم فتح شريط أدوات المطور.');
    } catch (e) {
      status = 'exception';
      Utils.error(`System.UI.DeveloperSidebar.showDeveloperSidebar failed: ${e.message}`, e.stack);
      return UI.Dialogue.createError(`فشل فتح شريط أدوات المطور: ${e.message}`);
    } finally {
      // يمكن إضافة تسجيل _recordInvocation هنا إذا أردت مقاييس مفصلة لفتح الشريط
    }
  }

  /**
   * يتلقى طلبات مطور من الواجهة (Sidebar) ويعالجها.
   * @param {{ action: string, code?: string, description?: string, sessionId?: string }} request
   * @returns {object} نتيجة معالجة النية واستدعاء الأداة
   */
  function handleDeveloperRequest(request) {
    const start = Date.now();
    let status = 'error';
    let errorMessage = '';
    let finalResponse = UI.Dialogue.createError('حدث خطأ غير متوقع في معالجة الطلب.'); // استجابة افتراضية

    try {
      Utils.validateString(request.action, 'action');
      const sessionId = request.sessionId || 'default'; // استخدام sessionId أو قيمة افتراضية

      // حفظ الطلب في LongTermMemory
      AI.LongTermMemory.save('DeveloperSidebarRequest', {
        module: 'UI.DeveloperSidebar',
        version: MODULE_VERSION,
        request,
        timestamp: new Date().toISOString()
      });

      // إرسال Telemetry
      Telemetry.track('UI.DeveloperSidebar.Request', {
        version: MODULE_VERSION,
        action: request.action
      });

      // تسجيل مقياس الطلب في الورقة
      const sheet = Utils.getSheet(UI_METRICS_SHEET, ['Timestamp', 'Component', 'Version', 'Action', 'RequestType']);
      if (sheet) {
        sheet.appendRow([new Date(), 'DeveloperSidebar', MODULE_VERSION, 'request', 'user_prompt']);
      }

      // 1. تحديد النية باستخدام AI.IntentAnalyzer.detectIntent
      const intentResult = AI.IntentAnalyzer.detectIntent({ userPrompt: request.action });
      Utils.log(`UI.DeveloperSidebar: Intent detected: ${JSON.stringify(intentResult)}`);

      if (intentResult.type === 'tool_call' && intentResult.toolName) {
        // 2. إذا كانت النية هي استدعاء أداة مباشرة
        Utils.log(`UI.DeveloperSidebar: Detected direct tool call: ${intentResult.toolName}`);
        Telemetry.track('UI.DeveloperSidebar.DirectToolCall', { toolName: intentResult.toolName, prompt: request.action });

        const [modulePrefix, toolFunctionName] = intentResult.toolName.split('.');

        // التحقق من وجود الوحدة والدالة في System.Tools.Developer
        if (AI.Tools && AI.Tools.Developer && typeof AI.Tools.Developer[toolFunctionName] === 'function') {
          const toolFunction = AI.Tools.Developer[toolFunctionName];
          const toolArgs = intentResult.args || {};

          // دمج أي كود أو وصف من طلب الواجهة مع الوسائط المستخرجة من النية
          if (request.code) toolArgs.code = request.code;
          if (request.description) toolArgs.description = request.description;
          // يمكن تمرير originalQuery للوظائف التي تحتاجه
          if (request.action) toolArgs.originalQuery = request.action;

          finalResponse = toolFunction(toolArgs);
          status = finalResponse.type === 'error' ? 'tool_execution_error' : 'tool_executed';
        } else {
          // إذا كانت الأداة المكتشفة غير موجودة أو غير قابلة للاستدعاء
          Utils.warn(`UI.DeveloperSidebar: Detected tool '${intentResult.toolName}' not found or callable. Falling back to AI.Core.ask.`);
          finalResponse = AI.Core.ask(request.action, { sessionId: sessionId });
          status = 'fallback_to_core';
        }
      } else if (intentResult.type === 'general_query') {
        // 3. إذا كانت النية استعلامًا عامًا، مررها إلى AI.Core.ask
        Utils.log('UI.DeveloperSidebar: No direct tool detected. Passing to AI.Core.ask.');
        Telemetry.track('UI.DeveloperSidebar.GeneralQuery', { prompt: request.action });
        finalResponse = AI.Core.ask(request.action, { sessionId: sessionId });
        status = 'general_query_to_core';
      } else if (intentResult.type === 'clarification_needed') {
        // 4. إذا كانت النية تتطلب توضيحًا
        Utils.log('UI.DeveloperSidebar: Intent Analyzer needs clarification.');
        Telemetry.track('UI.DeveloperSidebar.ClarificationNeeded', { prompt: request.action, errorMessage: intentResult.errorMessage });
        finalResponse = UI.Dialogue.createWarning(intentResult.errorMessage || 'الرجاء توضيح طلبك. لم أتمكن من فهم النية بوضوح.');
        status = 'clarification_needed';
      } else {
        // 5. نوع نية غير متوقع
        Utils.error(`UI.DeveloperSidebar: Unexpected intent type from IntentAnalyzer: ${intentResult.type}`);
        finalResponse = UI.Dialogue.createError('حدث خطأ غير متوقع في تحليل النية.');
        status = 'unexpected_intent_type';
      }
      return finalResponse;

    } catch (e) {
      errorMessage = e.message;
      Utils.error(`System.UI.DeveloperSidebar.handleDeveloperRequest failed: ${errorMessage}`, e.stack);
      status = 'exception';
      return UI.Dialogue.createError(`💥 خطأ في معالجة طلب المطور: ${errorMessage}`);
    } finally {
      // تسجيل مقاييس مفصلة لـ handleDeveloperRequest
      const duration = Date.now() - start;
      const metricsSheet = Utils.getSheet(UI_METRICS_SHEET, ['Timestamp', 'Component', 'Version', 'Action', 'Status', 'DurationMs', 'IntentType', 'ToolName', 'ErrorMessage']);
      if (metricsSheet) {
        metricsSheet.appendRow([
          new Date(),
          'DeveloperSidebar',
          MODULE_VERSION,
          'handleRequest',
          status,
          duration,
          intentResult ? intentResult.type : 'N/A',
          intentResult && intentResult.toolName ? intentResult.toolName : 'N/A',
          errorMessage
        ]);
      }
    }
  }

  return {
    showDeveloperSidebar,
    handleDeveloperRequest
  };
});

// *************************************************************************************************
// --- END OF FILE: 10_ui/2_ui_developerSidebar.gs ---
// *************************************************************************************************
