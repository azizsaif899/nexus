const { ChatGoogleGenerativeAI } = require('langchain-google-genai');
const { GoogleGenerativeAI } = require('@google/generative-ai');

class SheetsResearchAgent {
  constructor(apiKey) {
    this.apiKey = apiKey;
    this.genAI = new GoogleGenerativeAI(apiKey);
    this.llm = new ChatGoogleGenerativeAI({
      model: "gemini-2.0-flash-exp",
      temperature: 0.7,
      apiKey
    });
  }

  async analyzeSheetData(spreadsheetData, userQuery) {
    const prompt = `
تحليل بيانات Google Sheets:
البيانات: ${JSON.stringify(spreadsheetData, null, 2)}
استفسار المستخدم: ${userQuery}

قم بتحليل البيانات وتقديم إجابة شاملة مع:
1. تحليل البيانات المطلوبة
2. الإحصائيات المهمة
3. التوصيات
4. الإجراءات المقترحة
`;

    const response = await this.llm.invoke(prompt);
    return response.content;
  }

  async generateSearchQueries(userQuery) {
    const prompt = `
بناءً على الاستفسار: "${userQuery}"
قم بتوليد 3-5 استعلامات بحث محددة لتحليل بيانات Google Sheets:

مثال:
- البحث عن الاتجاهات الشهرية
- تحليل الأداء حسب الفئة
- مقارنة البيانات التاريخية
`;

    const response = await this.llm.invoke(prompt);
    return response.content.split('\n').filter(line => line.trim().startsWith('-'));
  }

  async processSheetQuery(spreadsheetId, query, sheetsAPI) {
    try {
      // 1. جلب بيانات الشيت
      const sheetData = await this.getSheetData(spreadsheetId, sheetsAPI);
      
      // 2. تحليل الاستفسار
      const searchQueries = await this.generateSearchQueries(query);
      
      // 3. تحليل البيانات
      const analysis = await this.analyzeSheetData(sheetData, query);
      
      return {
        originalQuery: query,
        searchQueries,
        analysis,
        data: sheetData
      };
    } catch (error) {
      throw new Error(`خطأ في معالجة الاستفسار: ${error.message}`);
    }
  }

  async getSheetData(spreadsheetId, sheetsAPI) {
    const response = await sheetsAPI.spreadsheets.values.get({
      spreadsheetId,
      range: 'A1:Z1000' // نطاق افتراضي
    });
    return response.data.values || [];
  }
}

module.exports = SheetsResearchAgent;