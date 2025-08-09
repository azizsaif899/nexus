// *************************************************************************************************
// --- START OF FILE: 80_api/api_endpoints.gs ---
// *************************************************************************************************

/**
 * @file 80_api/api_endpoints.gs
 * @module System.API.Endpoints
 * @version 20
 * @author عبدالعزيز
 * @description
 * واجهة REST API خارجية لمنظومة G-Assistant.
 * تم تحويلها إلى وحدة مؤجلة لضمان تهيئة التبعيات بشكل آمن.
 * تشمل: ask, summarizeSheet, getFinancialReport, getSchema
 * مرتبطة بـ: AI.Core, Tools.Accounting, Tools.Sheets, Telemetry
 */

defineModule('System.API.Endpoints', ({ Utils, AI, Tools, Telemetry }) => {
  function _formatResponse(success, payload) {
    return {
      success,
      timestamp: new Date().toISOString(),
      data: payload
    };
  }

  function _createErrorResponse(message, statusCode = 400) {
    Utils.warn('API Error:', { message, statusCode });
    Telemetry?.logEvent({
      type: 'API_ERROR',
      source: 'System.API.Endpoints',
      payload: { message, statusCode }
    });
    return _formatResponse(false, { error: message, statusCode });
  }

  function ask(params) {
    const { prompt, options } = params;
    if (!prompt) return _createErrorResponse("Parameter 'prompt' is required.");
    const result = AI.Core.ask(prompt, options || {});
    return _formatResponse(true, result);
  }

  function summarizeSheet(params) {
    const result = Tools.Sheets.summarizeActiveSheetWithGemini();
    return _formatResponse(true, result);
  }

  function getFinancialReport(params) {
    const { startDate, endDate } = params;
    if (!startDate || !endDate) return _createErrorResponse("Parameters 'startDate' and 'endDate' are required.");
    const result = Tools.Accounting.calculateGrossProfit({ startDate, endDate });
    return _formatResponse(true, result);
  }

  function getSchema() {
    const schema = {
      description: "G-Assistant REST API Endpoints",
      endpoints: {
        ask: {
          method: "POST",
          description: "يرسل استعلامًا إلى محرك الذكاء الاصطناعي.",
          params: { prompt: "string (required)", options: "object (optional)" }
        },
        summarizeSheet: {
          method: "POST",
          description: "يولد ملخصًا ذكيًا للورقة النشطة حاليًا.",
          params: { sheetName: "string (optional)" }
        },
        getFinancialReport: {
          method: "POST",
          description: "يحسب تقرير الربح الإجمالي لفترة محددة.",
          params: { startDate: "string (required)", endDate: "string (required)" }
        },
        getSchema: {
          method: "GET",
          description: "يعرض هذا التوثيق.",
          params: {}
        }
      }
    };
    return _formatResponse(true, schema);
  }

  return {
    ask,
    summarizeSheet,
    getFinancialReport,
    getSchema
  };
});