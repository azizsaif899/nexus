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

defineModule('System.AI.Context', ({ Utils, Config, DocsManager, AI, Telemetry }) => {

  const MODULE_VERSION = Config.get('AI_CONTEXT_VERSION') || '1.0.0';

  DocsManager.registerModuleDocs('System.AI.Context', [
    {
      name: 'build',
      version: MODULE_VERSION,
      description: 'يبني سياقًا شاملاً للطلب، يدمج معلومات من ورقة العمل النشطة وسجل المستخدم.',
      parameters: {
        type: 'OBJECT',
        properties: {
          sessionId: { type: 'STRING', description: 'معرف الجلسة الحالي لتتبع المحادثة.', required: true },
          includeSheetContext: { type: 'BOOLEAN', description: 'هل يجب تضمين سياق ورقة العمل النشطة؟', optional: true, default: true },
          includeUserActions: { type: 'BOOLEAN', description: 'هل يجب تضمين آخر إجراءات المستخدم؟', optional: true, default: true },
        },
        required: ['sessionId']
      },
      returns: {
        type: 'OBJECT',
        description: 'كائن يحتوي على التعليمات النظامية (systemInstruction) وسجل المحادثة (history).',
        properties: {
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

    Utils.log('AI.Context: Built context', { instructionLength: systemInstruction.length, historyLength: history.length });

    return {
      systemInstruction,
      history
    };
  }

  /**
   * يجمع السياق من ورقة العمل النشطة في Google Sheets.
   * @returns {string|null}
   * @private
   */
  function _buildSheetContext() {
    return Utils.executeSafely(() => {
      const ss = SpreadsheetApp.getActiveSpreadsheet();
      if (!ss) return null;

      const sheet = ss.getActiveSheet();
      const sheetName = sheet.getName();
      const dataRange = sheet.getDataRange();
      const headers = dataRange.getNumRows() > 0 ? sheet.getRange(1, 1, 1, dataRange.getLastColumn()).getValues()[0].filter(h => h && h.toString().trim()) : [];
      const namedRanges = ss.getNamedRanges().map(nr => ({ name: nr.getName(), range: nr.getRange().getA1Notation() }));

      let contextString = `Current context is Google Sheet: "${sheetName}".`;
      if (headers.length > 0) {
        contextString += `\n- The active sheet has the following columns: ${headers.join(', ')}.`;
      }
      if (namedRanges.length > 0) {
        const rangeInfo = namedRanges.map(nr => `${nr.name} (refers to ${nr.range})`).join('; ');
        contextString += `\n- The sheet contains these named ranges: ${rangeInfo}.`;
      }
      return contextString;
    }, 'Context._buildSheetContext', null);
  }

  /**
   * يجلب آخر الإجراءات (استدعاءات الأدوات) التي قام بها المستخدم من الذاكرة طويلة الأمد.
   * @param {string} sessionId - معرف الجلسة (قد يستخدم مستقبلاً لتخصيص الإجراءات).
   * @param {number} limit - عدد الإجراءات المراد جلبها.
   * @returns {string|null}
   * @private
   */
  function _getLastUserActions(sessionId, limit = 3) {
    return Utils.executeSafely(() => {
      if (!AI || !AI.LongTermMemory) return null;

      const recentInvocations = AI.LongTermMemory.load(25); // تحميل عدد أكبر للبحث عن استدعاءات الأدوات
      const toolCalls = recentInvocations
        .filter(event => event.type === 'ToolExecutorInvocation' && event.content?.status === 'success')
        .slice(-limit)
        .map(event => `User previously executed the tool '${event.content.functionName}'.`);

      if (toolCalls.length > 0) {
        return `Recent User Actions:\n- ${toolCalls.join('\n- ')}`;
      }
      return null;
    }, 'Context._getLastUserActions', null);
  }

  return { build };
});