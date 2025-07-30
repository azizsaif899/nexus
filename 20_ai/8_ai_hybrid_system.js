/**
 * @fileoverview النظام الهجين المتقدم
 * يدمج بين النظام الداخلي والخارجي بذكاء
 */

const AI = AI || {};

// دمج مع النظام الهجين الموجود إذا كان متوفراً
if (typeof AI.CORE !== 'undefined') {
  console.log('دمج مع AI.CORE الموجود');
}

AI.HYBRID_SYSTEM = Object.assign(AI.HYBRID_SYSTEM || {}, {
  name: 'HybridSystem',
  version: '2.0.0',
  
  // إعدادات النظام
  config: {
    externalServiceUrl: 'http://localhost:3002',
    geminiServiceUrl: 'http://localhost:2024',
    fallbackEnabled: true,
    timeout: 30000,
    retryAttempts: 2
  },
  
  /**
   * معالجة ذكية للاستعلامات
   */
  async processIntelligent(query, options = {}) {
    const startTime = Date.now();
    
    try {
      // تحديد أفضل نظام للاستعلام
      const systemChoice = this.chooseOptimalSystem(query, options);
      
      let result;
      
      switch (systemChoice) {
        case 'external_priority':
          result = await this.tryExternalFirst(query, options);
          break;
          
        case 'internal_priority':
          result = await this.tryInternalFirst(query, options);
          break;
          
        case 'hybrid_parallel':
          result = await this.runParallel(query, options);
          break;
          
        default:
          result = await this.tryExternalFirst(query, options);
          break;
      }
      
      // إضافة معلومات الأداء
      result.performance = {
        processingTime: Date.now() - startTime,
        systemUsed: result.source,
        strategy: systemChoice
      };
      
      return result;
      
    } catch (error) {
      return {
        success: false,
        error: error.message,
        source: 'hybrid_system_error',
        performance: {
          processingTime: Date.now() - startTime,
          failed: true
        }
      };
    }
  },
  
  /**
   * اختيار النظام الأمثل
   */
  chooseOptimalSystem(query, options) {
    // استعلامات تحليل البيانات -> خارجي
    if (query.includes('تحليل') || query.includes('بيانات') || options.sheetData) {
      return 'external_priority';
    }
    
    // استعلامات بسيطة -> داخلي
    if (query.length < 50 && !options.complex) {
      return 'internal_priority';
    }
    
    // استعلامات معقدة -> متوازي
    if (options.iterative || options.complex) {
      return 'hybrid_parallel';
    }
    
    return 'external_priority';
  },
  
  /**
   * تجربة النظام الخارجي أولاً
   */
  async tryExternalFirst(query, options) {
    try {
      const externalResult = await this.callExternalService(query, options);
      if (externalResult.success) {
        return externalResult;
      }
    } catch (error) {
      console.warn('فشل النظام الخارجي:', error.message);
    }
    
    // الرجوع للنظام الداخلي
    if (this.config.fallbackEnabled) {
      return await this.callInternalSystem(query, options);
    }
    
    throw new Error('فشل في الاتصال بالأنظمة');
  },
  
  /**
   * تجربة النظام الداخلي أولاً
   */
  async tryInternalFirst(query, options) {
    try {
      const internalResult = await this.callInternalSystem(query, options);
      if (internalResult.success) {
        return internalResult;
      }
    } catch (error) {
      console.warn('فشل النظام الداخلي:', error.message);
    }
    
    // الرجوع للنظام الخارجي
    return await this.callExternalService(query, options);
  },
  
  /**
   * تشغيل متوازي للنظامين
   */
  async runParallel(query, options) {
    const promises = [
      this.callExternalService(query, options).catch(e => ({ success: false, error: e.message, source: 'external_failed' })),
      this.callInternalSystem(query, options).catch(e => ({ success: false, error: e.message, source: 'internal_failed' }))
    ];
    
    const results = await Promise.all(promises);
    
    // اختيار أفضل نتيجة
    const successfulResults = results.filter(r => r.success);
    
    if (successfulResults.length > 0) {
      // تفضيل النظام الخارجي إذا نجح
      const externalResult = successfulResults.find(r => r.source?.includes('external'));
      return externalResult || successfulResults[0];
    }
    
    // إذا فشل كلاهما، إرجاع تفاصيل الفشل
    return {
      success: false,
      error: 'فشل في كلا النظامين',
      details: results,
      source: 'parallel_failure'
    };
  },
  
  /**
   * استدعاء الخدمة الخارجية
   */
  async callExternalService(query, options) {
    const payload = {
      query: query,
      source: 'google_apps_script_hybrid',
      type: options.type || 'general',
      options: options,
      timestamp: new Date().toISOString()
    };
    
    const requestOptions = {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'X-Source': 'AzizSys-Hybrid'
      },
      payload: JSON.stringify(payload)
    };
    
    const response = UrlFetchApp.fetch(
      `${this.config.externalServiceUrl}/api/query`,
      requestOptions
    );
    
    const result = JSON.parse(response.getContentText());
    
    return {
      success: result.success,
      data: result.message || result.data,
      source: 'external_hybrid_service',
      timestamp: result.timestamp,
      type: result.type
    };
  },
  
  /**
   * استدعاء النظام الداخلي
   */
  async callInternalSystem(query, options) {
    try {
      let result;
      
      // استخدام AI.CORE إذا كان متوفراً
      if (typeof AI.CORE !== 'undefined') {
        result = await AI.CORE.callGemini(query, options);
      } else {
        // استخدام نظام بديل
        result = await this.basicGeminiCall(query, options);
      }
      
      return {
        success: true,
        data: result,
        source: 'internal_hybrid_system',
        timestamp: new Date().toISOString()
      };
      
    } catch (error) {
      return {
        success: false,
        error: error.message,
        source: 'internal_system_error'
      };
    }
  },
  
  /**
   * استدعاء Gemini أساسي
   */
  async basicGeminiCall(query, options) {
    // هذا fallback بسيط إذا لم يكن AI.CORE متوفراً
    const apiKey = PropertiesService.getScriptProperties().getProperty('GEMINI_API_KEY');
    
    if (!apiKey) {
      throw new Error('مفتاح Gemini API غير متوفر');
    }
    
    const url = 'https://generativelanguage.googleapis.com/v1beta/models/gemini-pro:generateContent';
    
    const payload = {
      contents: [{
        parts: [{
          text: query
        }]
      }],
      generationConfig: {
        temperature: options.temperature || 0.7,
        topP: options.topP || 0.8,
        topK: options.topK || 40,
        maxOutputTokens: options.maxTokens || 1024
      }
    };
    
    const response = UrlFetchApp.fetch(`${url}?key=${apiKey}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      payload: JSON.stringify(payload)
    });
    
    const result = JSON.parse(response.getContentText());
    
    if (result.candidates && result.candidates[0]) {
      return result.candidates[0].content.parts[0].text;
    }
    
    throw new Error('فشل في الحصول على رد من Gemini');
  },
  
  /**
   * تحليل بيانات الشيت بالنظام الهجين
   */
  async analyzeSheetHybrid(query, range = 'A1:Z100') {
    try {
      const sheet = SpreadsheetApp.getActiveSheet();
      const data = sheet.getRange(range).getValues();
      
      const options = {
        type: 'sheet_analysis',
        sheetData: data,
        range: range,
        sheetName: sheet.getName()
      };
      
      return await this.processIntelligent(query, options);
      
    } catch (error) {
      return {
        success: false,
        error: `خطأ في تحليل الشيت: ${error.message}`,
        source: 'sheet_analysis_error'
      };
    }
  },
  
  /**
   * البحث التكراري الهجين
   */
  async iterativeSearchHybrid(query, iterations = 3) {
    const options = {
      type: 'iterative_search',
      iterations: iterations,
      complex: true
    };
    
    return await this.processIntelligent(query, options);
  }
};

// الوظائف العامة للاستخدام
function processHybridQuery(query, options = {}) {
  return AI.HYBRID_SYSTEM.processIntelligent(query, options);
}

function analyzeSheetHybrid(query, range) {
  return AI.HYBRID_SYSTEM.analyzeSheetHybrid(query, range);
}

function iterativeSearchHybrid(query, iterations) {
  return AI.HYBRID_SYSTEM.iterativeSearchHybrid(query, iterations);
}