// *************************************************************************************************
// --- START OF FILE: 70_telemetry/telemetry.js ---
// *************************************************************************************************
/**
 * @file 70_telemetry/telemetry.js
 * @module System.Telemetry
 * @version 2.0.0
 * @author عبدالعزيز
 * @description
 * وحدة مركزية لجمع بيانات القياس عن بعد (Telemetry) وإرسالها إلى وجهات محددة،
 * مثل Google Analytics أو Google Sheets، لتحليل سلوك النظام وأدائه.
 * هذا الملف هو النسخة الموحدة والصحيحة للوحدة.
 */

'use strict';

defineModule('System.Telemetry', () => {
  // ✅ Architectural Fix: Zero-dependency telemetry.
  // Dependencies are resolved softly to ensure this module NEVER fails.
  let _Utils, _Config;
  try {
    // Use the bootstrap injector which is always available.
    _Utils = GAssistant.System.Utils;
    _Config = GAssistant.Utils.Injector.get('Config').Config;
  } catch (e) {
    // If injector fails, fallback to the most basic logger.
    _Utils = {
      log: (msg) => Logger.log(msg),
      warn: (msg) => Logger.log(`[WARN] ${msg}`),
      error: (msg) => Logger.log(`[ERROR] ${msg}`),
      executeSafely: (fn) => { try { fn(); } catch (err) { Logger.log(`[FATAL] ${err}`); } },
      validateString: () => {}
    };
    _Config = null; // Config is not available.
    _Utils.warn('Telemetry: Could not resolve core dependencies. Using fallback logger.');
  }

  const TELEMETRY_SHEET = _Config ? _Config.get('TELEMETRY_SHEET_NAME') : 'System_Telemetry_Fallback';
  const GA_MEASUREMENT_ID = _Config ? _Config.get('GA_MEASUREMENT_ID') : null;
  const GA_API_SECRET = _Config ? _Config.get('GA_API_SECRET') : null;

  /**
   * يرسل حدثًا إلى Google Analytics 4 Measurement Protocol.
   * @param {string} eventName - اسم الحدث.
   * @param {object} params - معلمات الحدث.
   * @private
   */
  function _sendToGoogleAnalytics(eventName, params = {}) {
    if (!GA_MEASUREMENT_ID || !GA_API_SECRET) {
      // Do not log this every time to avoid noise.
      return;
    }

    const url = `https://www.google-analytics.com/mp/collect?measurement_id=${GA_MEASUREMENT_ID}&api_secret=${GA_API_SECRET}`;
    const payload = {
      client_id: Session.getTemporaryActiveUserKey() || 'unknown_user', // A unique identifier for the user
      events: [{
        name: eventName,
        params: {
          ...params,
          engagement_time_msec: '1', // Required parameter
          session_id: Session.getTemporaryActiveUserKey() // Can be used to group events
        }
      }]
    };

    const options = {
      method: 'post',
      contentType: 'application/json',
      payload: JSON.stringify(payload),
      muteHttpExceptions: true
    };

    try {
      const response = UrlFetchApp.fetch(url, options);
      if (response.getResponseCode() >= 400) {
        _Utils.warn(`Telemetry: Failed to send event to Google Analytics. Code: ${response.getResponseCode()}`, response.getContentText());
      } else {
        _Utils.log(`Telemetry: Event '${eventName}' sent to Google Analytics.`);
      }
    } catch (e) {
      _Utils.error('Telemetry: Exception while sending event to Google Analytics.', e);
    }
  }

  /**
   * يسجل حدثًا في ورقة Google Sheet مخصصة للقياس عن بعد.
   * @param {string} eventName - اسم الحدث.
   * @param {object} params - معلمات الحدث.
   * @private
   */
  function _sendToSheet(eventName, params = {}) {
    _Utils.executeSafely(() => {
      const sheet = _Utils.getSheet(TELEMETRY_SHEET, ['Timestamp', 'EventName', 'Parameters']);
      if (sheet) {
        sheet.appendRow([new Date(), eventName, JSON.stringify(params)]);
      }
    }, `Telemetry._sendToSheet[${eventName}]`);
  }

  /**
   * يتتبع حدثًا معينًا، مثل استدعاء دالة أو تفاعل مستخدم.
   * @param {string} eventName - اسم الحدث (e.g., 'UI.Button.Click').
   * @param {object} [params={}] - كائن يحتوي على بيانات إضافية للحدث.
   */
  function trackEvent(eventName, params = {}) {
    _Utils.validateString(eventName, 'eventName');
    _Utils.log(`Telemetry.trackEvent: Received event '${eventName}'`, params);
    _sendToGoogleAnalytics(eventName, params);
    _sendToSheet(eventName, params);
  }

  /**
   * الواجهة الموحدة لتتبع الأحداث.
   * هذه الدالة هي المحول الذي طلبته، وتوجه كل الاستدعاءات إلى trackEvent.
   * @param {...any} args - الوسائط التي يتم تمريرها إلى trackEvent.
   */
  function track(...args) {
    return trackEvent(...args);
  }

  /**
   * يتتبع حدث خطأ محدد.
   * @param {string} errorName - اسم الخطأ (e.g., 'API.RequestFailed').
   * @param {object} [params={}] - كائن يحتوي على تفاصيل الخطأ.
   */
  function trackError(errorName, params = {}) {
    return trackEvent(`error.${errorName}`, params);
  }

  /**
   * يسجل رسالة خطأ مباشرة في Logger، مع وسم Telemetry.
   * @param {string} msg - رسالة الخطأ.
   */
  function logError(msg) {
    Logger.log(`[ERROR][Telemetry] ${msg}`);
  }

  return { track, trackEvent, trackError, logError };
});
