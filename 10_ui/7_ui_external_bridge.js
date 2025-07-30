/**
 * @fileoverview جسر الربط مع الواجهة الخارجية المحسن
 * يربط Google Apps Script مع النظام الخارجي مع ميزات هجينة
 */

const UI = UI || {};

// دمج مع الجسر الموجود إذا كان متوفراً
if (typeof UI.ENHANCED_SIDEBAR !== 'undefined') {
  console.log('دمج مع السايدبار المحسن الموجود');
}

UI.ExternalBridge = Object.assign(UI.ExternalBridge || {}, {
  name: 'ExternalBridge',
  version: '1.0.0',
  
  // عناوين الخدمات (محدثة)
  EXTERNAL_SERVICE_URL: 'http://localhost:3002',
  GEMINI_SERVICE_URL: 'http://localhost:2024',
  
  // حالة الاتصال
  connectionStatus: {
    external: false,
    gemini: false,
    lastCheck: null
  },
  
  /**
   * إرسال طلب للنظام الخارجي
   */
  async sendToExternal(query, options = {}) {
    try {
      const payload = {
        query: query,
        source: 'google_apps_script',
        spreadsheetId: SpreadsheetApp.getActiveSpreadsheet().getId(),
        timestamp: new Date().toISOString(),
        ...options
      };
      
      const response = await this.makeRequest(
        `${this.GEMINI_SERVICE_URL}/api/query`,
        'POST',
        payload
      );
      
      return {
        success: true,
        data: response,
        source: 'external_system'
      };
    } catch (error) {
      console.error('خطأ في الاتصال بالنظام الخارجي:', error);
      return {
        success: false,
        error: error.message,
        fallback: await this.fallbackToInternal(query, options)
      };
    }
  },
  
  /**
   * الرجوع للنظام الداخلي عند فشل الخارجي
   */
  async fallbackToInternal(query, options) {
    try {
      if (typeof AI !== 'undefined' && AI.CORE) {
        return await AI.CORE.callGemini(query, options);
      }
      return 'النظام الداخلي غير متوفر';
    } catch (error) {
      return 'فشل في الاتصال بالأنظمة';
    }
  },
  
  /**
   * إرسال طلب HTTP
   */
  async makeRequest(url, method, payload) {
    const options = {
      method: method,
      headers: {
        'Content-Type': 'application/json',
        'X-Source': 'AzizSys-GAS'
      },
      payload: JSON.stringify(payload)
    };
    
    const response = UrlFetchApp.fetch(url, options);
    return JSON.parse(response.getContentText());
  },
  
  /**
   * تحديث السايدبار بالنتائج
   */
  updateSidebar(result) {
    try {
      if (typeof UI.ENHANCED_SIDEBAR !== 'undefined') {
        UI.ENHANCED_SIDEBAR.displayResult(result);
      }
      
      // إرسال للسايدبار العادي أيضاً
      const html = HtmlService.createHtmlOutput(`
        <div style="padding: 10px; font-family: Arial;">
          <h3>نتيجة البحث الذكي</h3>
          <div style="background: #f5f5f5; padding: 10px; border-radius: 5px;">
            ${result.success ? result.data.message || result.data : result.error}
          </div>
          <small>المصدر: ${result.source || 'نظام داخلي'}</small>
        </div>
      `);
      
      SpreadsheetApp.getUi().showSidebar(html);
    } catch (error) {
      console.error('خطأ في تحديث السايدبار:', error);
    }
  },
  
  /**
   * معالج الأحداث من السايدبار
   */
  async handleSidebarQuery(query, options = {}) {
    const result = await this.sendToExternal(query, options);
    this.updateSidebar(result);
    return result;
  },
  
  /**
   * ربط مع أدوات الشيتس
   */
  async processSheetData(query, range = 'A1:Z1000') {
    try {
      const sheet = SpreadsheetApp.getActiveSheet();
      const data = sheet.getRange(range).getValues();
      
      const payload = {
        query: query,
        sheetData: data,
        sheetName: sheet.getName(),
        range: range
      };
      
      return await this.sendToExternal(query, payload);
    } catch (error) {
      return {
        success: false,
        error: `خطأ في معالجة بيانات الشيت: ${error.message}`
      };
    }
  }
};

// تسجيل الوظائف العامة
function queryExternalSystem(query, options = {}) {
  return UI.ExternalBridge.handleSidebarQuery(query, options);
}

function processCurrentSheet(query, range) {
  return UI.ExternalBridge.processSheetData(query, range);
}