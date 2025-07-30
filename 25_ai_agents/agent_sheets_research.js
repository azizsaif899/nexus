/**
 * @fileoverview Agent البحث الذكي في Google Sheets
 * يدمج مع النظام الحالي لتوفير قدرات بحث متقدمة
 */

const AI_AGENTS = AI_AGENTS || {};

AI_AGENTS.SheetsResearchAgent = class {
  constructor() {
    this.name = 'SheetsResearchAgent';
    this.capabilities = [
      'intelligent_search',
      'data_analysis',
      'trend_detection',
      'automated_insights'
    ];
  }

  /**
   * تحليل ذكي لبيانات الشيت
   */
  async analyzeSheetData(sheetData, query) {
    try {
      const prompt = `
تحليل بيانات Google Sheets:
الاستفسار: ${query}
البيانات: ${JSON.stringify(sheetData.slice(0, 10))}...

قم بتحليل البيانات وتقديم:
1. الأنماط المكتشفة
2. الإحصائيات المهمة  
3. التوصيات
4. الإجراءات المقترحة
`;

      const response = await AI.CORE.callGemini(prompt, {
        temperature: 0.3,
        maxTokens: 1000
      });

      return {
        analysis: response,
        insights: this.extractInsights(sheetData),
        recommendations: this.generateRecommendations(sheetData, query)
      };
    } catch (error) {
      console.error('خطأ في تحليل البيانات:', error);
      throw error;
    }
  }

  /**
   * استخراج الرؤى من البيانات
   */
  extractInsights(data) {
    const insights = [];
    
    if (data.length > 0) {
      insights.push(`إجمالي الصفوف: ${data.length}`);
      
      // تحليل الأعمدة
      const headers = data[0] || [];
      insights.push(`عدد الأعمدة: ${headers.length}`);
      
      // البحث عن الأعمدة الرقمية
      const numericColumns = this.findNumericColumns(data);
      if (numericColumns.length > 0) {
        insights.push(`أعمدة رقمية: ${numericColumns.join(', ')}`);
      }
    }
    
    return insights;
  }

  /**
   * توليد التوصيات
   */
  generateRecommendations(data, query) {
    const recommendations = [];
    
    if (data.length > 100) {
      recommendations.push('يُنصح بتطبيق فلاتر للبيانات الكبيرة');
    }
    
    if (query.includes('اتجاه') || query.includes('trend')) {
      recommendations.push('إنشاء رسم بياني لتتبع الاتجاهات');
    }
    
    return recommendations;
  }

  /**
   * البحث عن الأعمدة الرقمية
   */
  findNumericColumns(data) {
    if (data.length < 2) return [];
    
    const headers = data[0];
    const numericColumns = [];
    
    for (let i = 0; i < headers.length; i++) {
      const sampleValues = data.slice(1, 6).map(row => row[i]);
      const numericCount = sampleValues.filter(val => !isNaN(val) && val !== '').length;
      
      if (numericCount > sampleValues.length / 2) {
        numericColumns.push(headers[i]);
      }
    }
    
    return numericColumns;
  }

  /**
   * معالجة استفسار المستخدم
   */
  async processQuery(query, sheetId, range = 'A1:Z1000') {
    try {
      // جلب بيانات الشيت
      const sheetData = await this.getSheetData(sheetId, range);
      
      // تحليل البيانات
      const analysis = await this.analyzeSheetData(sheetData, query);
      
      // إنشاء التقرير النهائي
      const report = await this.generateReport(analysis, query);
      
      return {
        success: true,
        query,
        analysis,
        report,
        timestamp: new Date().toISOString()
      };
    } catch (error) {
      return {
        success: false,
        error: error.message,
        query,
        timestamp: new Date().toISOString()
      };
    }
  }

  /**
   * جلب بيانات الشيت
   */
  async getSheetData(sheetId, range) {
    try {
      const sheet = SpreadsheetApp.openById(sheetId);
      const dataRange = sheet.getRange(range);
      return dataRange.getValues();
    } catch (error) {
      throw new Error(`فشل في جلب البيانات: ${error.message}`);
    }
  }

  /**
   * إنشاء التقرير النهائي
   */
  async generateReport(analysis, originalQuery) {
    const prompt = `
بناءً على التحليل التالي:
${JSON.stringify(analysis, null, 2)}

والاستفسار الأصلي: "${originalQuery}"

قم بإنشاء تقرير شامل باللغة العربية يتضمن:
1. ملخص تنفيذي
2. النتائج الرئيسية
3. التوصيات العملية
4. الخطوات التالية المقترحة
`;

    return await AI.CORE.callGemini(prompt, {
      temperature: 0.2,
      maxTokens: 800
    });
  }
};

// تسجيل الـ Agent في النظام
if (typeof AI_AGENTS.CATALOG !== 'undefined') {
  AI_AGENTS.CATALOG.registerAgent('sheets_research', AI_AGENTS.SheetsResearchAgent);
}