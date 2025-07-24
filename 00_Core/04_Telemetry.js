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

defineModule('System.Telemetry', ({ Utils, Config, ModuleVerifier }) => {
  // ✅ تفعيل فحص مسبق: التحقق من جاهزية الوحدات الأساسية قبل المتابعة
  if (typeof ModuleVerifier?.checkReady !== 'function' || !ModuleVerifier.checkReady('Config', ['get'])) {
    // لا يمكن استخدام Telemetry.logError هنا، لذا نستخدم Utils.error مباشرة
    Utils?.error("❌ Telemetry: وحدة 'Config' غير جاهزة. سيتم استخدام قيم افتراضية ولن يتم إرسال البيانات.");
    // إرجاع واجهة آمنة لمنع الانهيار الكامل للنظام
    const safeReturn = { track: () => {}, trackEvent: () => {}, trackError: () => {}, logError: (msg) => Utils?.error(`[VERIFICATION_FAILURE] ${msg}`) };
    return safeReturn;
  }

  const TELEMETRY_SHEET = Config.get('TELEMETRY_SHEET_NAME') || 'System_Telemetry';
  const GA_MEASUREMENT_ID = Config.get('GA_MEASUREMENT_ID'); // e.g., 'G-XXXXXXXXXX'
  const GA_API_SECRET = Config.get('GA_API_SECRET');

  /**
   * يرسل حدثًا إلى Google Analytics 4 Measurement Protocol.
   * @param {string} eventName - اسم الحدث.
   * @param {object} params - معلمات الحدث.
   * @private
   */
  function _sendToGoogleAnalytics(eventName, params = {}) {
    if (!GA_MEASUREMENT_ID || !GA_API_SECRET) {
      Utils.log('Telemetry: Google Analytics is not configured. Skipping GA event.');
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
        Utils.warn(`Telemetry: Failed to send event to Google Analytics. Code: ${response.getResponseCode()}`, response.getContentText());
      } else {
        Utils.log(`Telemetry: Event '${eventName}' sent to Google Analytics.`);
      }
    } catch (e) {
      Utils.error('Telemetry: Exception while sending event to Google Analytics.', e);
    }
  }

  /**
   * يسجل حدثًا في ورقة Google Sheet مخصصة للقياس عن بعد.
   * @param {string} eventName - اسم الحدث.
   * @param {object} params - معلمات الحدث.
   * @private
   */
  function _sendToSheet(eventName, params = {}) {
    Utils.executeSafely(() => {
      const sheet = Utils.getSheet(TELEMETRY_SHEET, ['Timestamp', 'EventName', 'Parameters']);
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
    Utils.validateString(eventName, 'eventName');
    Utils.log(`Telemetry.trackEvent: Received event '${eventName}'`, params);
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
