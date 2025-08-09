/**
 * @fileoverview أدوات البحث الذكي المتقدم
 * تدمج مع نظام LangGraph للبحث التكراري
 */

const TOOLS = TOOLS || {};

TOOLS.IntelligentSearch = {
  name: 'IntelligentSearch',
  version: '1.0.0',
  
  /**
   * البحث الذكي التكراري
   */
  async performIterativeSearch(query, context = {}) {
    try {
      const searchState = {
        originalQuery: query,
        context,
        searchQueries: [],
        results: [],
        reflections: [],
        isComplete: false,
        maxIterations: context.maxIterations || 3,
        currentIteration: 0
      };

      while (!searchState.isComplete && searchState.currentIteration < searchState.maxIterations) {
        // توليد استعلامات البحث
        const queries = await this.generateSearchQueries(searchState);
        searchState.searchQueries.push(...queries);

        // تنفيذ البحث
        const searchResults = await this.executeSearch(queries, context);
        searchState.results.push(...searchResults);

        // التفكير والتحليل
        const reflection = await this.reflectOnResults(searchState);
        searchState.reflections.push(reflection);

        // تحديد ما إذا كان البحث مكتملاً
        searchState.isComplete = reflection.isSufficient;
        searchState.currentIteration++;
      }

      // إنشاء الإجابة النهائية
      const finalAnswer = await this.synthesizeFinalAnswer(searchState);
      
      return {
        success: true,
        answer: finalAnswer,
        searchState,
        iterations: searchState.currentIteration
      };
    } catch (error) {
      return {
        success: false,
        error: error.message,
        query
      };
    }
  },

  /**
   * توليد استعلامات البحث
   */
  async generateSearchQueries(searchState) {
    const prompt = `
الاستفسار الأصلي: ${searchState.originalQuery}
التكرار الحالي: ${searchState.currentIteration + 1}
الاستعلامات السابقة: ${searchState.searchQueries.join(', ')}

قم بتوليد 2-3 استعلامات بحث جديدة ومحددة لتحسين النتائج:
`;

    const response = await AI.CORE.callGemini(prompt, {
      temperature: 0.8,
      maxTokens: 200
    });

    return response.split('\n')
      .filter(line => line.trim())
      .map(line => line.replace(/^[-*]\s*/, '').trim())
      .slice(0, 3);
  },

  /**
   * تنفيذ البحث
   */
  async executeSearch(queries, context) {
    const results = [];
    
    for (const query of queries) {
      try {
        let searchResult;
        
        if (context.searchType === 'sheets') {
          searchResult = await this.searchInSheets(query, context);
        } else if (context.searchType === 'web') {
          searchResult = await this.searchWeb(query);
        } else {
          searchResult = await this.searchGeneral(query, context);
        }
        
        results.push({
          query,
          result: searchResult,
          timestamp: new Date().toISOString()
        });
      } catch (error) {
        results.push({
          query,
          error: error.message,
          timestamp: new Date().toISOString()
        });
      }
    }
    
    return results;
  },

  /**
   * البحث في الشيتس
   */
  async searchInSheets(query, context) {
    if (!context.sheetId) {
      throw new Error('معرف الشيت مطلوب للبحث');
    }

    const sheet = SpreadsheetApp.openById(context.sheetId);
    const data = sheet.getDataRange().getValues();
    
    // البحث النصي البسيط
    const matches = [];
    for (let i = 0; i < data.length; i++) {
      for (let j = 0; j < data[i].length; j++) {
        const cellValue = String(data[i][j]).toLowerCase();
        if (cellValue.includes(query.toLowerCase())) {
          matches.push({
            row: i + 1,
            col: j + 1,
            value: data[i][j],
            context: data[i]
          });
        }
      }
    }
    
    return {
      matches,
      totalFound: matches.length,
      searchQuery: query
    };
  },

  /**
   * البحث العام
   */
  async searchGeneral(query, context) {
    // يمكن دمج مع APIs خارجية أو قواعد بيانات داخلية
    return {
      query,
      results: [`نتيجة عامة للبحث عن: ${query}`],
      source: 'general_search'
    };
  },

  /**
   * التفكير في النتائج
   */
  async reflectOnResults(searchState) {
    const prompt = `
الاستفسار الأصلي: ${searchState.originalQuery}
النتائج المجمعة: ${JSON.stringify(searchState.results.slice(-3), null, 2)}

قم بتحليل النتائج وحدد:
1. هل المعلومات كافية للإجابة على الاستفسار؟
2. ما هي الثغرات المعرفية المتبقية؟
3. ما هي الاستعلامات الإضافية المطلوبة؟

أجب بـ JSON:
{
  "isSufficient": boolean,
  "knowledgeGaps": ["gap1", "gap2"],
  "suggestedQueries": ["query1", "query2"]
}
`;

    const response = await AI.CORE.callGemini(prompt, {
      temperature: 0.3,
      maxTokens: 300
    });

    try {
      return JSON.parse(response);
    } catch {
      return {
        isSufficient: searchState.currentIteration >= 2,
        knowledgeGaps: ['تحليل غير مكتمل'],
        suggestedQueries: []
      };
    }
  },

  /**
   * تجميع الإجابة النهائية
   */
  async synthesizeFinalAnswer(searchState) {
    const prompt = `
الاستفسار الأصلي: ${searchState.originalQuery}
جميع النتائج: ${JSON.stringify(searchState.results, null, 2)}
التفكيرات: ${JSON.stringify(searchState.reflections, null, 2)}

قم بتجميع إجابة شاملة ومفيدة باللغة العربية تتضمن:
1. الإجابة المباشرة على الاستفسار
2. الأدلة والمصادر
3. التوصيات العملية
4. معلومات إضافية مفيدة
`;

    return await AI.CORE.callGemini(prompt, {
      temperature: 0.2,
      maxTokens: 800
    });
  },

  /**
   * واجهة مبسطة للاستخدام السريع
   */
  async quickSearch(query, options = {}) {
    return await this.performIterativeSearch(query, {
      maxIterations: 2,
      searchType: 'general',
      ...options
    });
  }
};

// تسجيل الأداة في الكتالوج
if (typeof TOOLS.CATALOG !== 'undefined') {
  TOOLS.CATALOG.registerTool('intelligent_search', TOOLS.IntelligentSearch);
}