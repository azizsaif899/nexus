/**
 * @fileoverview السايدبار المحسن مع الربط الخارجي
 */

const UI = UI || {};

UI.ENHANCED_SIDEBAR_V2 = {
  name: 'EnhancedSidebarV2',
  
  /**
   * إنشاء السايدبار المحسن
   */
  create() {
    const html = HtmlService.createTemplateFromFile('enhanced_sidebar_v2');
    const htmlOutput = html.evaluate()
      .setWidth(400)
      .setTitle('AzizSys - البحث الذكي المتقدم');
    
    SpreadsheetApp.getUi().showSidebar(htmlOutput);
  },
  
  /**
   * معالجة الاستعلام
   */
  async processQuery(query, options = {}) {
    try {
      // محاولة النظام الخارجي أولاً
      let result = await UI.ExternalBridge.sendToExternal(query, options);
      
      // إذا فشل، استخدم النظام الداخلي
      if (!result.success && typeof AI !== 'undefined') {
        result = {
          success: true,
          data: await AI.CORE.callGemini(query, options),
          source: 'internal_system'
        };
      }
      
      return result;
    } catch (error) {
      return {
        success: false,
        error: error.message,
        source: 'error'
      };
    }
  },
  
  /**
   * تحليل بيانات الشيت
   */
  async analyzeSheet(query, range = 'A1:Z100') {
    try {
      const sheet = SpreadsheetApp.getActiveSheet();
      const data = sheet.getRange(range).getValues();
      
      const analysisQuery = `
تحليل البيانات التالية من Google Sheets:
الاستفسار: ${query}
البيانات: ${JSON.stringify(data.slice(0, 10))}...

قدم تحليلاً شاملاً مع:
1. الأنماط المكتشفة
2. الإحصائيات المهمة
3. التوصيات
4. الرؤى المفيدة
`;

      return await this.processQuery(analysisQuery, {
        type: 'sheet_analysis',
        sheetData: data,
        range: range
      });
    } catch (error) {
      return {
        success: false,
        error: `خطأ في تحليل الشيت: ${error.message}`
      };
    }
  },
  
  /**
   * البحث الذكي التكراري
   */
  async smartSearch(query, iterations = 3) {
    const results = [];
    let currentQuery = query;
    
    for (let i = 0; i < iterations; i++) {
      const result = await this.processQuery(currentQuery, {
        iteration: i + 1,
        previousResults: results
      });
      
      results.push(result);
      
      // تحسين الاستعلام للتكرار التالي
      if (result.success && i < iterations - 1) {
        currentQuery = `بناءً على النتيجة السابقة: "${result.data}", قم بتعميق البحث حول: ${query}`;
      }
    }
    
    return {
      success: true,
      iterations: results,
      finalResult: results[results.length - 1],
      summary: this.summarizeIterations(results)
    };
  },
  
  /**
   * تلخيص التكرارات
   */
  summarizeIterations(results) {
    const successful = results.filter(r => r.success);
    return {
      totalIterations: results.length,
      successfulIterations: successful.length,
      sources: [...new Set(results.map(r => r.source))],
      combinedInsights: successful.map(r => r.data).join('\n\n---\n\n')
    };
  }
};

// الوظائف المساعدة للسايدبار
function createEnhancedSidebar() {
  UI.ENHANCED_SIDEBAR_V2.create();
}

function processUserQuery(query, options = {}) {
  return UI.ENHANCED_SIDEBAR_V2.processQuery(query, options);
}

function analyzeCurrentSheet(query, range) {
  return UI.ENHANCED_SIDEBAR_V2.analyzeSheet(query, range);
}

function performSmartSearch(query, iterations) {
  return UI.ENHANCED_SIDEBAR_V2.smartSearch(query, iterations || 3);
}