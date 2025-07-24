// *************************************************************************************************
// --- START OF FILE: 20_ai/6_ai_geminiAdapter.gs ---
// *************************************************************************************************

/**
 * @file 20_ai/6_ai_geminiAdapter.gs
 * @module System.AI.GeminiAdapter
 * @version 2.0.1 // ✅ تحديث الإصدار بعد التحسينات النهائية
 * @author عبدالعزيز
 * @description
 * وحدة وسيط موحدة لاستدعاء نموذج Gemini API مباشرة. تتولى:
 * • بناء الحمولة (Payload) وإرسال طلبات HTTP عبر UrlFetchApp.fetch
 * • تحليل الردود الخام من Gemini API
 * • تسجيل مقاييس التنفيذ في ورقة AI_Gemini_Metrics
 * • تضمين رقم إصدار الوحدة من Config في جميع السجلات
 * • **ملاحظة: لا تستدعي AI.Core أو أي وحدات عليا؛ وظيفتها هي الطبقة الأدنى للتفاعل مع API.**
 */

'use strict';

defineModule('System.AI.GeminiAdapter', ({ Utils, Config, DocsManager, AI, Telemetry }) => {
  const MODULE_VERSION = Config.get('GEMINI_ADAPTER_VERSION') || '2.0.1';
  const DEFAULT_MODEL = Config.get('GEMINI_DEFAULT_MODEL') || 'gemini-1.5-pro-latest';
  // const MAX_PROMPT_LEN = Config.get('GEMINI_MAX_PROMPT_LEN') || 8192; // ✅ تم إزالة هذا الثابت لأنه لم يعد يستخدم هنا
  const METRICS_SHEET = Config.get('AI_GEMINI_METRICS_SHEET') || 'AI_Gemini_Metrics'; // ✅ استخدام مفتاح Config
  const API_BASE_URL = 'https://generativelanguage.googleapis.com/v1beta';

  // مرحلة 9: تسجيل وثائق الوحدة
  DocsManager.registerModuleDocs('System.AI.GeminiAdapter', [
    {
      name: 'callGeminiApi',
      version: MODULE_VERSION,
      description: 'يرسل حمولة (payload) إلى Gemini API ويعيد الرد الخام (JSON).',
      parameters: {
        type: 'OBJECT',
        properties: {
          model: { type: 'STRING', description: 'اسم نموذج Gemini المستخدم.', required: true },
          payload: { type: 'OBJECT', description: 'الحمولة الكاملة للطلب.', required: true }
        },
        required: ['model', 'payload']
      },
      returns: { type: 'ANY', description: 'الرد الخام من Gemini API.' }
    },
    {
      name: 'healthCheck',
      version: MODULE_VERSION,
      description: 'يجري فحصًا بسيطًا للتأكد من استقرار اتصال Gemini API.'
    }
  ]);

  /**
   * يسجل استدعاء API في LTM، Telemetry، وSheet.
   * @param {string} action - نوع الإجراء (مثلاً 'callGeminiApi', 'healthCheck').
   * @param {string} status - حالة العملية ('success', 'api_error', 'exception', 'invalid_response').
   * @param {number} durationMs - مدة العملية بالمللي ثانية.
   * @param {object} [meta={}] - بيانات وصفية إضافية للتسجيل.
   * @private
   */
  function _record(action, status, durationMs, meta = {}) {
    const ts = new Date().toISOString();
    const rec = {
      module: 'System.AI.GeminiAdapter',
      action,
      version: MODULE_VERSION,
      timestamp: ts,
      status,
      durationMs,
      ...meta
    };

    // LongTermMemory
    AI.LongTermMemory.save('GeminiAdapterInvocation', rec);

    // Telemetry
    Telemetry.track('AI.GeminiAdapter.Invocation', rec);

    // Metrics Sheet
    const sheet = Utils.getSheet(METRICS_SHEET, [
      'Timestamp', 'Action', 'Model', 'DurationMs', 'Status', 'Version', 'PromptLength', 'ResponseLength', 'ErrorMessage'
    ]);
    if (sheet) {
      sheet.appendRow([
        new Date(),
        action,
        meta.model || DEFAULT_MODEL,
        durationMs,
        status,
        MODULE_VERSION,
        meta.promptLength || 0,
        meta.responseLength || 0,
        meta.errorMessage || ''
      ]);
    } else {
      Utils.warn(`System.AI.GeminiAdapter._record: Missing sheet '${METRICS_SHEET}'. Metrics not recorded.`);
    }
  }

  /**
   * يستدعي Gemini API مباشرة.
   * @param {{ model: string, payload: object }} args - اسم النموذج والحمولة الكاملة لـ API.
   * @returns {object} الرد الخام (JSON) من Gemini API.
   * @throws {Error} عند فشل الاستدعاء أو التحليل.
   */
  function callGeminiApi({ model, payload }) {
    const start = Date.now();
    let status = 'error';
    let errorMessage = '';
    let rawText = '';

    try {
      if (!model || typeof model !== 'string') {
        throw new Error('Model name is required.');
      }
      if (!payload || typeof payload !== 'object') {
        throw new Error('Payload object is required.');
      }

      const endpoint = `${API_BASE_URL}/models/${model}:generateContent?key=${Config.get('API_KEY')}`;
      const options = {
        method: 'post',
        contentType: 'application/json',
        payload: JSON.stringify(payload),
        muteHttpExceptions: true
      };

      Utils.log(`GeminiAdapter: calling API at ${endpoint}`);
      const response = UrlFetchApp.fetch(endpoint, options);
      rawText = response.getContentText();
      const code = response.getResponseCode();

      if (code >= 200 && code < 300) {
        status = 'success';
        return JSON.parse(rawText);
      } else {
        status = 'api_error';
        errorMessage = `HTTP ${code}: ${rawText}`;
        throw new Error(errorMessage);
      }

    } catch (e) {
      status = status === 'api_error' ? 'api_error' : 'exception'; // الحفاظ على حالة api_error إذا كانت من API
      errorMessage = e.message;
      Utils.error(`GeminiAdapter: ${errorMessage}`, e.stack);
      throw e; // إعادة رمي الخطأ ليتم التعامل معه في AI.Core (آلية إعادة المحاولة)

    } finally {
      const duration = Date.now() - start;
      _record('callGeminiApi', status, duration, {
        model,
        promptLength: JSON.stringify(payload).length,
        responseLength: rawText.length,
        errorMessage
      });
    }
  }

  /**
   * يجري فحصًا بسيطًا لاتصال API.
   * @returns {object} UiResponse موحد.
   */
  function healthCheck() {
    const start = Date.now();
    let status = 'error';
    let errorMessage = '';
    let responseLength = 0;
    const testPromptPayload = { contents: [{ role: 'user', parts: [{ text: 'ping' }] }] };

    try {
      // استخدام callGeminiApi مباشرة لفحص الصحة
      const result = callGeminiApi({ model: DEFAULT_MODEL, payload: testPromptPayload });
      
      // إذا لم يتم رمي خطأ، تحقق من محتوى الرد
      const textPart = result?.candidates?.[0]?.content?.parts?.[0]?.text;
      if (textPart) {
        status = 'success';
        responseLength = JSON.stringify(result).length; // طول الرد الكامل
        return { type: 'success', text: 'Gemini API is reachable.' };
      } else {
        status = 'invalid_response';
        errorMessage = 'API reachable but returned invalid content for health check.';
        responseLength = JSON.stringify(result).length;
        return { type: 'error', text: errorMessage };
      }
    } catch (e) {
      // سيتم التقاط الأخطاء التي رمتها callGeminiApi هنا
      status = 'exception';
      errorMessage = e.message;
      return { type: 'error', text: `Health check failed: ${errorMessage}` };
    } finally {
      const duration = Date.now() - start;
      _record('healthCheck', status, duration, {
        model: DEFAULT_MODEL,
        promptLength: JSON.stringify(testPromptPayload).length, // ✅ استخدام طول الـ payload الفعلي
        responseLength: responseLength,
        errorMessage: errorMessage
      });
    }
  }

  return {
    callGeminiApi,
    healthCheck
  };
});

// *************************************************************************************************
// --- END OF FILE: 20_ai/6_ai_geminiAdapter.gs ---
// *************************************************************************************************
