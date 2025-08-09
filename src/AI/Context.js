/**
 * @file 20_ai/4_ai_context.js
 * @module System.AI.Context
 * @version 1.0.0
 * @author عبدالعزيز
 * @description
 * وحدة متخصصة لبناء سياق ديناميكي وذكي للطلبات المرسلة إلى الذكاء الاصطناعي.
 * تجمع معلومات من بيئة المستخدم الحالية (مثل Google Sheets) ومن سجل تفاعلاته
 * لتزويد النموذج بفهم أعمق للمهمة المطلوبة.
 */

defineModule('System.AI.Context', [
  'System.Utils',
  'System.Config', 
  'System.DocsManager',
  'System.AI',
  'System.Telemetry',
  'System.Tools'
], function(Utils, Config, DocsManager, AI, Telemetry, Tools) {

  const MODULE_VERSION = Config.get('AI_CONTEXT_VERSION') || '1.0.0';

  DocsManager.registerModuleDocs('System.AI.Context', [
    {
      name: 'build',
      version: MODULE_VERSION,
      description: 'يبني سياقًا شاملاً للطلب، يدمج معلومات من ورقة العمل النشطة وسجل المستخدم.',
      parameters: {,
        type: 'OBJECT',
        properties: {,
          sessionId: { type: 'STRING', description: 'معرف الجلسة الحالي لتتبع المحادثة.', required: true },
          includeSheetContext: { type: 'BOOLEAN', description: 'هل يجب تضمين سياق ورقة العمل النشطة؟', optional: true, default: true },
          includeUserActions: { type: 'BOOLEAN', description: 'هل يجب تضمين آخر إجراءات المستخدم؟', optional: true, default: true }
        },
        required: ['sessionId']
      },
      returns: {,
        type: 'OBJECT',
        description: 'كائن يحتوي على التعليمات النظامية (systemInstruction) وسجل المحادثة (history).',
        properties: {,
          systemInstruction: { type: 'STRING', description: 'نص السياق المجمع لإرشاد النموذج.' },
          history: { type: 'ARRAY', description: 'سجل الرسائل في الجلسة الحالية.' }
        }
      }
    }
  ]);

  /**
   * يبني سياقًا شاملاً للطلب.
   * @param {{ sessionId: string, includeSheetContext?: boolean, includeUserActions?: boolean }} args
   * @returns {{systemInstruction: string, history: object[]}}
   */
  function build({ sessionId, includeSheetContext = true, includeUserActions = true }) {
    const contextParts = [];

    if (includeSheetContext) {
      const sheetContext = _buildSheetContext();
      if (sheetContext) {
        contextParts.push(sheetContext);
      }
    }

    if (includeUserActions) {
      const userActions = _getLastUserActions(sessionId);
      if (userActions) {
        contextParts.push(userActions);
      }
    }

    const systemInstruction = contextParts.join('\n\n');
    const history = AI.Memory.getSessionHistory({ sessionId });

    return {
      systemInstruction,
      history
    };
  }

  /**
   * يبني سياق ورقة العمل النشطة
   * @private
   */
  function _buildSheetContext() {
    try {
      const sheet = SpreadsheetApp.getActiveSheet();
      if (!sheet) return null;

      const sheetName = sheet.getName();
      const range = sheet.getDataRange();
      const values = range.getValues();

      return `السياق الحالي: ورقة العمل "${sheetName}" تحتوي على ${values.length} صف و ${values[0]?.length || 0} عمود.`;
    } catch (error) {
      Telemetry.logError('Context._buildSheetContext', error);
      return null;
    }
  }

  /**
   * يحصل على آخر إجراءات المستخدم
   * @private
   */
  function _getLastUserActions(sessionId) {
    try {
      // TODO: تنفيذ منطق الحصول على آخر إجراءات المستخدم
      return null;
    } catch (error) {
      Telemetry.logError('Context._getLastUserActions', error);
      return null;
    }
  }

  return {
    build
  };
});