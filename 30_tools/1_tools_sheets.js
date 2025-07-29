/**
 * أدوات Google Sheets محسنة للأداء مع Batch Operations
 * يستخدم SheetsOptimizer و NetworkResilience لضمان الأداء العالي
 * 
 * @module System.ToolsSheets
 * @version 21 - Performance Optimized
 * @author عبدالعزيز
 * @requires System.SheetsOptimizer
 * @requires System.NetworkResilience
 * @requires System.ErrorLogger
 * @requires System.PerformanceProfiler
 * @since 6.1.0
 */

defineModule('System.ToolsSheets', function(injector) {
  const utils = injector.get('System.Utils');
  const ai = injector.get('System.AI');
  const ui = injector.get('System.UI');
  const sheetsOptimizer = injector.get('System.SheetsOptimizer');
  const networkResilience = injector.get('System.NetworkResilience');
  const errorLogger = injector.get('System.ErrorLogger');
  const performanceProfiler = injector.get('System.PerformanceProfiler');
  /**
   * تلخيص ورقة العمل النشطة باستخدام Gemini مع تحسين الأداء
   * @returns {Object} ملخص الورقة
   */
  function summarizeActiveSheetWithGemini() {
    const timerId = performanceProfiler.startTimer('summarize_sheet');
    
    try {
      const sheet = SpreadsheetApp.getActiveSheet();
      const dataRange = sheet.getDataRange();
      
      // استخدام batch read بدلاً من العمليات الفردية
      const data = sheetsOptimizer.batchRead(sheet, dataRange.getA1Notation());
      
      const sheetContext = {
        name: sheet.getName(),
        rows: data.length,
        cols: data[0]?.length || 0,
        headers: data[0] || [],
        sampleData: data.slice(1, 6) // أول 5 صفوف كعينة
      };
      
      const prompt = `بناءً على بيانات ورقة العمل: ${JSON.stringify(sheetContext)}، قدم ملخصاً شاملاً.`;
      
      // استخدام NetworkResilience للاتصال بـ Gemini
      const result = this._callGeminiAPI(prompt);
      
      performanceProfiler.endTimer(timerId);
      return result;
      
    } catch (error) {
      performanceProfiler.endTimer(timerId);
      errorLogger.logError(error, { operation: 'summarize_sheet' });
      throw error;
    }
  }

  /**
   * اقتراح صيغة باستخدام Gemini مع تحسين الأداء
   * @param {Object} params - المعاملات
   * @param {string} params.description - وصف الصيغة المطلوبة
   * @param {boolean} params.includeExplanation - تضمين الشرح
   * @returns {Object} الصيغة المقترحة
   */
  function suggestFormulaWithGemini({ description, includeExplanation = false }) {
    const timerId = performanceProfiler.startTimer('suggest_formula');
    
    try {
      const sheet = SpreadsheetApp.getActiveSheet();
      const dataRange = sheet.getDataRange();
      
      // قراءة مجمعة للسياق
      const data = sheetsOptimizer.batchRead(sheet, dataRange.getA1Notation());
      const context = {
        headers: data[0] || [],
        sampleData: data.slice(1, 3)
      };
      
      const prompt = `بناءً على البيانات: ${JSON.stringify(context)}، اقترح صيغة لـ: ${description}`;
      
      const result = this._callGeminiAPI(prompt);
      
      performanceProfiler.endTimer(timerId);
      return result;
      
    } catch (error) {
      performanceProfiler.endTimer(timerId);
      errorLogger.logError(error, { operation: 'suggest_formula', description });
      throw error;
    }
  }

  /**
   * إنشاء ورقة من قالب مع تحسين الأداء
   * @param {Object} params - المعاملات
   * @param {string} params.templateName - اسم القالب
   * @param {string} params.newSheetName - اسم الورقة الجديدة
   * @returns {Object} نتيجة العملية
   */
  function createSheetFromTemplate({ templateName, newSheetName }) {
    const timerId = performanceProfiler.startTimer('create_sheet_template');
    
    try {
      const templates = {
        "المالية الشهرية": ["التاريخ", "الوصف", "الإيراد", "المصروف", "الرصيد"],
        "قائمة المهام": ["المهمة", "الحالة", "الأولوية", "تاريخ الاستحقاق", "المسؤول"],
        "إدارة المخزون": ["معرف المنتج", "اسم المنتج", "الكمية الحالية", "نقطة إعادة الطلب", "المورد"]
      };
      
      const headers = templates[templateName];
      if (!headers) {
        throw new Error(`Template not found: ${templateName}`);
      }
      
      const spreadsheet = SpreadsheetApp.getActiveSpreadsheet();
      const sheet = spreadsheet.insertSheet(newSheetName);
      
      // استخدام batch write للعناوين
      sheetsOptimizer.batchWrite(sheet, 'A1', [headers]);
      
      // تنسيق العناوين بشكل مجمع
      sheetsOptimizer.batchFormat(sheet, `A1:${String.fromCharCode(64 + headers.length)}1`, {
        backgroundColor: [['#4285f4']],
        fontColor: [['white']]
      });
      
      performanceProfiler.endTimer(timerId);
      return { success: true, message: `تم إنشاء ورقة ${newSheetName} بنجاح` };
      
    } catch (error) {
      performanceProfiler.endTimer(timerId);
      errorLogger.logError(error, { operation: 'create_sheet_template', templateName, newSheetName });
      throw error;
    }
  }

  /**
   * استدعاء Gemini API مع NetworkResilience
   * @private
   * @param {string} prompt - النص المطلوب
   * @returns {Object} استجابة API
   */
  function _callGeminiAPI(prompt) {
    const apiKey = PropertiesService.getScriptProperties().getProperty('GEMINI_API_KEY');
    const url = 'https://generativelanguage.googleapis.com/v1beta/models/gemini-pro:generateContent';
    
    const payload = {
      contents: [{ parts: [{ text: prompt }] }]
    };
    
    const options = {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${apiKey}`,
        'Content-Type': 'application/json'
      },
      payload: JSON.stringify(payload)
    };
    
    const response = networkResilience.resilientFetch(url, options);
    return JSON.parse(response.getContentText());
  }
  
  return {
    summarizeActiveSheetWithGemini,
    suggestFormulaWithGemini,
    createSheetFromTemplate,
    _callGeminiAPI
  };
});
});

// *************************************************************************************************
// --- END OF FILE: 30_tools/tools_sheets.gs ---
// *************************************************************************************************