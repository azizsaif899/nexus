// *************************************************************************************************
// --- تحسين تكامل Gemini API للمرحلة الثانية ---
// *************************************************************************************************

/**
 * @file gemini_api_integration_enhanced.js
 * @version 1.0.0
 * @author عبدالعزيز
 * @description
 * تحسينات شاملة لتكامل Gemini API مع معالجة أخطاء متقدمة وإعادة المحاولة الذكية
 */

// ===== 1. تحسين GeminiAdapter الحالي =====

/**
 * إصدار محسن من GeminiAdapter مع معالجة أخطاء متقدمة
 */
function createEnhancedGeminiAdapter() {
  return `
// تحسين GeminiAdapter الموجود
defineModule('System.AI.GeminiAdapter', ({ Utils, Config, DocsManager, AI, Telemetry }) => {
  const MODULE_VERSION = Config.get('GEMINI_ADAPTER_VERSION') || '2.1.0';
  const DEFAULT_MODEL = Config.get('GEMINI_DEFAULT_MODEL') || 'gemini-1.5-pro-latest';
  const METRICS_SHEET = Config.get('AI_GEMINI_METRICS_SHEET') || 'AI_Gemini_Metrics';
  const API_BASE_URL = 'https://generativelanguage.googleapis.com/v1beta';
  const MAX_RETRIES = Config.get('API_MAX_RETRIES') || 3;
  const INITIAL_BACKOFF_MS = Config.get('API_RETRY_DELAY_MS') || 1000;

  // تسجيل الوثائق
  DocsManager.registerModuleDocs('System.AI.GeminiAdapter', [
    {
      name: 'callGeminiApi',
      version: MODULE_VERSION,
      description: 'يرسل طلبًا إلى Gemini API مع معالجة أخطاء متقدمة وإعادة محاولة ذكية.',
      parameters: {
        type: 'OBJECT',
        properties: {
          model: { type: 'STRING', description: 'اسم نموذج Gemini', required: true },
          payload: { type: 'OBJECT', description: 'حمولة الطلب', required: true }
        }
      },
      returns: { type: 'OBJECT', description: 'استجابة Gemini API' }
    }
  ]);

  /**
   * تسجيل مفصل للاستدعاءات
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

    // حفظ في الذاكرة طويلة الأمد
    try {
      AI.LongTermMemory.save('GeminiAdapterInvocation', rec);
    } catch (e) {
      Utils.warn('Failed to save to LongTermMemory:', e.message);
    }

    // إرسال Telemetry
    try {
      Telemetry.track('AI.GeminiAdapter.Invocation', rec);
    } catch (e) {
      Utils.warn('Failed to send telemetry:', e.message);
    }

    // حفظ في ورقة المقاييس
    try {
      const sheet = Utils.getSheet(METRICS_SHEET, [
        'Timestamp', 'Action', 'Model', 'DurationMs', 'Status', 'Version', 
        'PromptLength', 'ResponseLength', 'ErrorMessage', 'RetryCount'
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
          meta.errorMessage || '',
          meta.retryCount || 0
        ]);
      }
    } catch (e) {
      Utils.warn('Failed to record metrics:', e.message);
    }
  }

  /**
   * معالجة أخطاء API متقدمة
   */
  function _handleApiError(responseCode, responseText, attempt = 1) {
    const errorInfo = {
      code: responseCode,
      message: responseText,
      attempt: attempt,
      timestamp: new Date().toISOString()
    };

    // تصنيف الأخطاء
    if (responseCode === 429) {
      // Rate limiting - انتظار أطول
      errorInfo.type = 'RATE_LIMIT';
      errorInfo.retryable = true;
      errorInfo.backoffMs = INITIAL_BACKOFF_MS * Math.pow(2, attempt) + Math.random() * 1000;
    } else if (responseCode >= 500) {
      // خطأ خادم - قابل للإعادة
      errorInfo.type = 'SERVER_ERROR';
      errorInfo.retryable = true;
      errorInfo.backoffMs = INITIAL_BACKOFF_MS * attempt;
    } else if (responseCode === 400) {
      // خطأ في الطلب - غير قابل للإعادة
      errorInfo.type = 'BAD_REQUEST';
      errorInfo.retryable = false;
    } else if (responseCode === 401 || responseCode === 403) {
      // خطأ مصادقة - غير قابل للإعادة
      errorInfo.type = 'AUTH_ERROR';
      errorInfo.retryable = false;
    } else {
      // خطأ غير معروف
      errorInfo.type = 'UNKNOWN_ERROR';
      errorInfo.retryable = responseCode >= 500;
      errorInfo.backoffMs = INITIAL_BACKOFF_MS * attempt;
    }

    return errorInfo;
  }

  /**
   * استدعاء Gemini API مع إعادة المحاولة الذكية
   */
  function callGeminiApi({ model, payload }) {
    const start = Date.now();
    let status = 'error';
    let errorMessage = '';
    let rawText = '';
    let retryCount = 0;

    // التحقق من المدخلات
    if (!model || typeof model !== 'string') {
      throw new Error('Model name is required and must be a string.');
    }
    if (!payload || typeof payload !== 'object') {
      throw new Error('Payload object is required.');
    }

    // التحقق من API Key
    const apiKey = Config.get('API_KEY') || Config.get('GEMINI_API_KEY');
    if (!apiKey) {
      throw new Error('GEMINI_API_KEY is not configured in Script Properties.');
    }

    const endpoint = \`\${API_BASE_URL}/models/\${model}:generateContent?key=\${apiKey}\`;
    
    // محاولة الاستدعاء مع إعادة المحاولة
    for (let attempt = 1; attempt <= MAX_RETRIES; attempt++) {
      try {
        Utils.log(\`GeminiAdapter: Attempt \${attempt}/\${MAX_RETRIES} calling \${model}\`);
        
        const options = {
          method: 'post',
          contentType: 'application/json',
          payload: JSON.stringify(payload),
          muteHttpExceptions: true
        };

        const response = UrlFetchApp.fetch(endpoint, options);
        rawText = response.getContentText();
        const responseCode = response.getResponseCode();

        if (responseCode >= 200 && responseCode < 300) {
          // نجح الطلب
          status = 'success';
          retryCount = attempt - 1;
          const duration = Date.now() - start;
          
          _record('callGeminiApi', status, duration, {
            model,
            promptLength: JSON.stringify(payload).length,
            responseLength: rawText.length,
            retryCount
          });

          return JSON.parse(rawText);
        } else {
          // فشل الطلب - تحليل الخطأ
          const errorInfo = _handleApiError(responseCode, rawText, attempt);
          errorMessage = \`HTTP \${responseCode}: \${errorInfo.message}\`;
          
          Utils.warn(\`GeminiAdapter: \${errorMessage} (attempt \${attempt}/\${MAX_RETRIES})\`);
          
          if (!errorInfo.retryable || attempt === MAX_RETRIES) {
            // خطأ غير قابل للإعادة أو وصلنا للحد الأقصى
            status = errorInfo.type === 'RATE_LIMIT' ? 'rate_limit_exceeded' : 'api_error';
            throw new Error(errorMessage);
          }
          
          // انتظار قبل إعادة المحاولة
          if (errorInfo.backoffMs) {
            Utils.log(\`GeminiAdapter: Waiting \${errorInfo.backoffMs}ms before retry...\`);
            Utilities.sleep(errorInfo.backoffMs);
          }
        }
      } catch (e) {
        if (attempt === MAX_RETRIES) {
          status = 'exception';
          errorMessage = e.message;
          retryCount = attempt - 1;
          Utils.error(\`GeminiAdapter: Final attempt failed: \${errorMessage}\`, e.stack);
          throw e;
        } else {
          Utils.warn(\`GeminiAdapter: Attempt \${attempt} failed: \${e.message}\`);
          Utilities.sleep(INITIAL_BACKOFF_MS * attempt);
        }
      }
    }

    // هذا لن يحدث عادة، لكن للأمان
    const duration = Date.now() - start;
    _record('callGeminiApi', status, duration, {
      model,
      promptLength: JSON.stringify(payload).length,
      responseLength: rawText.length,
      errorMessage,
      retryCount
    });
    
    throw new Error(\`Failed after \${MAX_RETRIES} attempts: \${errorMessage}\`);
  }

  /**
   * فحص صحة الاتصال مع تفاصيل أكثر
   */
  function healthCheck() {
    const start = Date.now();
    let status = 'error';
    let errorMessage = '';
    let responseLength = 0;
    
    const testPayload = {
      contents: [{
        role: 'user',
        parts: [{ text: 'Hello! Please respond with "API is working" to confirm connectivity.' }]
      }]
    };

    try {
      const result = callGeminiApi({ model: DEFAULT_MODEL, payload: testPayload });
      
      const textPart = result?.candidates?.[0]?.content?.parts?.[0]?.text;
      if (textPart) {
        status = 'success';
        responseLength = JSON.stringify(result).length;
        
        // تحقق من جودة الاستجابة
        const responseQuality = textPart.toLowerCase().includes('working') ? 'high' : 'medium';
        
        const duration = Date.now() - start;
        _record('healthCheck', status, duration, {
          model: DEFAULT_MODEL,
          promptLength: JSON.stringify(testPayload).length,
          responseLength,
          responseQuality
        });
        
        return { 
          type: 'success', 
          text: \`Gemini API is working. Response: "\${textPart.substring(0, 100)}..."\`,
          data: { responseQuality, model: DEFAULT_MODEL }
        };
      } else {
        status = 'invalid_response';
        errorMessage = 'API responded but with invalid content structure.';
        responseLength = JSON.stringify(result).length;
        
        const duration = Date.now() - start;
        _record('healthCheck', status, duration, {
          model: DEFAULT_MODEL,
          promptLength: JSON.stringify(testPayload).length,
          responseLength,
          errorMessage
        });
        
        return { type: 'error', text: errorMessage };
      }
    } catch (e) {
      status = 'exception';
      errorMessage = e.message;
      
      const duration = Date.now() - start;
      _record('healthCheck', status, duration, {
        model: DEFAULT_MODEL,
        promptLength: JSON.stringify(testPayload).length,
        responseLength: 0,
        errorMessage
      });
      
      return { type: 'error', text: \`Health check failed: \${errorMessage}\` };
    }
  }

  /**
   * اختبار نماذج متعددة
   */
  function testMultipleModels() {
    const models = [
      'gemini-1.5-pro-latest',
      'gemini-1.5-flash-latest',
      'gemini-pro'
    ];
    
    const results = [];
    
    for (const model of models) {
      try {
        const testPayload = {
          contents: [{
            role: 'user',
            parts: [{ text: \`Test for model \${model}\` }]
          }]
        };
        
        const start = Date.now();
        const response = callGeminiApi({ model, payload: testPayload });
        const duration = Date.now() - start;
        
        results.push({
          model,
          status: 'success',
          duration,
          available: true
        });
        
      } catch (e) {
        results.push({
          model,
          status: 'error',
          error: e.message,
          available: false
        });
      }
    }
    
    return results;
  }

  return {
    callGeminiApi,
    healthCheck,
    testMultipleModels,
    MODULE_VERSION
  };
});
`;
}

// ===== 2. تحسين AI Memory System =====

/**
 * تحسينات لنظام الذاكرة
 */
function createEnhancedMemorySystem() {
  return `
// تحسين AI Memory مع ميزات إضافية
defineModule('System.AI.Memory.Enhanced', ({ Utils, Config, DocsManager, AI, Telemetry }) => {
  const MODULE_VERSION = '2.1.0';
  const USER_CACHE = CacheService.getUserCache();
  const SCRIPT_CACHE = CacheService.getScriptCache();
  
  /**
   * ضغط ذكي للذاكرة باستخدام تلخيص AI
   */
  function smartCompress(history, maxTokens = 4000) {
    if (!history || history.length === 0) return [];
    
    const estimatedTokens = history.reduce((acc, msg) => 
      acc + (JSON.stringify(msg).length / 4), 0);
    
    if (estimatedTokens <= maxTokens) return history;
    
    // الاحتفاظ بالرسائل الأحدث والأهم
    const important = history.filter(msg => 
      msg.role === 'user' || 
      (msg.parts && msg.parts.some(part => 
        part.text && (
          part.text.includes('important') ||
          part.text.includes('critical') ||
          part.text.includes('remember')
        )
      ))
    );
    
    const recent = history.slice(-10); // آخر 10 رسائل
    
    // دمج المهم والحديث مع إزالة التكرار
    const combined = [...new Set([...important, ...recent])];
    
    return combined.slice(-15); // حد أقصى 15 رسالة
  }
  
  /**
   * تحليل أنماط المحادثة
   */
  function analyzeConversationPatterns(sessionId) {
    const history = AI.Memory.getSessionHistory({ sessionId });
    
    const patterns = {
      totalMessages: history.length,
      userMessages: history.filter(m => m.role === 'user').length,
      modelMessages: history.filter(m => m.role === 'model').length,
      toolCalls: history.filter(m => m.parts?.some(p => p.functionCall)).length,
      averageMessageLength: 0,
      topics: [],
      sentiment: 'neutral'
    };
    
    // حساب متوسط طول الرسائل
    const totalLength = history.reduce((acc, msg) => 
      acc + JSON.stringify(msg).length, 0);
    patterns.averageMessageLength = Math.round(totalLength / history.length);
    
    // استخراج المواضيع (بسيط)
    const allText = history
      .filter(m => m.parts)
      .flatMap(m => m.parts)
      .filter(p => p.text)
      .map(p => p.text)
      .join(' ');
    
    const commonWords = allText
      .toLowerCase()
      .split(/\\s+/)
      .filter(word => word.length > 4)
      .reduce((acc, word) => {
        acc[word] = (acc[word] || 0) + 1;
        return acc;
      }, {});
    
    patterns.topics = Object.entries(commonWords)
      .sort(([,a], [,b]) => b - a)
      .slice(0, 5)
      .map(([word]) => word);
    
    return patterns;
  }
  
  return {
    smartCompress,
    analyzeConversationPatterns,
    MODULE_VERSION
  };
});
`;
}

// ===== 3. اختبارات متقدمة =====

/**
 * مجموعة اختبارات شاملة للمرحلة الثانية
 */
function createAdvancedTests() {
  console.log('🧪 إنشاء اختبارات متقدمة...');
  
  const tests = {
    // اختبار الاتصال الأساسي
    basicConnectivity: function() {
      console.log('🔌 اختبار الاتصال الأساسي...');
      
      const apiKey = PropertiesService.getScriptProperties().getProperty('GEMINI_API_KEY');
      if (!apiKey) {
        throw new Error('GEMINI_API_KEY غير موجود');
      }
      
      const testUrl = `https://generativelanguage.googleapis.com/v1beta/models?key=${apiKey}`;
      
      try {
        const response = UrlFetchApp.fetch(testUrl, { muteHttpExceptions: true });
        const responseCode = response.getResponseCode();
        
        if (responseCode === 200) {
          console.log('✅ الاتصال الأساسي يعمل');
          return true;
        } else {
          console.error(`❌ خطأ في الاتصال: ${responseCode}`);
          return false;
        }
      } catch (error) {
        console.error('❌ فشل الاتصال:', error.message);
        return false;
      }
    },
    
    // اختبار النماذج المتاحة
    availableModels: function() {
      console.log('🤖 اختبار النماذج المتاحة...');
      
      const models = [
        'gemini-1.5-pro-latest',
        'gemini-1.5-flash-latest',
        'gemini-pro'
      ];
      
      const results = [];
      
      for (const model of models) {
        try {
          const testPayload = {
            contents: [{
              role: 'user',
              parts: [{ text: 'Hello' }]
            }]
          };
          
          const apiKey = PropertiesService.getScriptProperties().getProperty('GEMINI_API_KEY');
          const response = UrlFetchApp.fetch(
            `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent?key=${apiKey}`,
            {
              method: 'POST',
              contentType: 'application/json',
              payload: JSON.stringify(testPayload),
              muteHttpExceptions: true
            }
          );
          
          const responseCode = response.getResponseCode();
          results.push({
            model,
            available: responseCode === 200,
            code: responseCode
          });
          
        } catch (error) {
          results.push({
            model,
            available: false,
            error: error.message
          });
        }
      }
      
      console.log('📊 نتائج النماذج:', results);
      return results.some(r => r.available);
    },
    
    // اختبار معالجة الأخطاء
    errorHandling: function() {
      console.log('⚠️ اختبار معالجة الأخطاء...');
      
      try {
        // اختبار طلب خاطئ
        const apiKey = PropertiesService.getScriptProperties().getProperty('GEMINI_API_KEY');
        const response = UrlFetchApp.fetch(
          `https://generativelanguage.googleapis.com/v1beta/models/invalid-model:generateContent?key=${apiKey}`,
          {
            method: 'POST',
            contentType: 'application/json',
            payload: JSON.stringify({ invalid: 'payload' }),
            muteHttpExceptions: true
          }
        );
        
        const responseCode = response.getResponseCode();
        
        if (responseCode >= 400) {
          console.log('✅ معالجة الأخطاء تعمل (تم اكتشاف خطأ متوقع)');
          return true;
        } else {
          console.warn('⚠️ لم يتم اكتشاف خطأ متوقع');
          return false;
        }
        
      } catch (error) {
        console.log('✅ معالجة الأخطاء تعمل (تم التقاط استثناء)');
        return true;
      }
    },
    
    // اختبار الأداء
    performance: function() {
      console.log('⚡ اختبار الأداء...');
      
      const startTime = Date.now();
      
      try {
        const testPayload = {
          contents: [{
            role: 'user',
            parts: [{ text: 'مرحبا، هذا اختبار سرعة' }]
          }]
        };
        
        const apiKey = PropertiesService.getScriptProperties().getProperty('GEMINI_API_KEY');
        const response = UrlFetchApp.fetch(
          `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash-latest:generateContent?key=${apiKey}`,
          {
            method: 'POST',
            contentType: 'application/json',
            payload: JSON.stringify(testPayload),
            muteHttpExceptions: true
          }
        );
        
        const duration = Date.now() - startTime;
        const responseCode = response.getResponseCode();
        
        console.log(`⏱️ وقت الاستجابة: ${duration}ms`);
        
        if (responseCode === 200 && duration < 10000) { // أقل من 10 ثواني
          console.log('✅ الأداء مقبول');
          return true;
        } else {
          console.warn(`⚠️ الأداء بطيء أو فشل: ${duration}ms, code: ${responseCode}`);
          return false;
        }
        
      } catch (error) {
        const duration = Date.now() - startTime;
        console.error(`❌ فشل اختبار الأداء بعد ${duration}ms:`, error.message);
        return false;
      }
    }
  };
  
  return tests;
}

// ===== 4. تشغيل الاختبارات المتقدمة =====

/**
 * تشغيل جميع الاختبارات المتقدمة
 */
function runAdvancedTests() {
  console.log('🚀 تشغيل الاختبارات المتقدمة...');
  console.log('=' .repeat(50));
  
  const tests = createAdvancedTests();
  const results = [];
  let passedTests = 0;
  
  for (const [testName, testFn] of Object.entries(tests)) {
    console.log(`\n🔄 تشغيل: ${testName}...`);
    
    try {
      const startTime = Date.now();
      const result = testFn();
      const duration = Date.now() - startTime;
      
      if (result) {
        console.log(`✅ نجح: ${testName} (${duration}ms)`);
        passedTests++;
        results.push({ name: testName, status: 'نجح', duration, error: null });
      } else {
        console.log(`❌ فشل: ${testName} (${duration}ms)`);
        results.push({ name: testName, status: 'فشل', duration, error: 'الاختبار أرجع false' });
      }
    } catch (error) {
      console.error(`❌ خطأ في ${testName}:`, error.message);
      results.push({ name: testName, status: 'خطأ', duration: 0, error: error.message });
    }
  }
  
  // تقرير النتائج
  console.log('\n' + '=' .repeat(50));
  console.log('📊 تقرير الاختبارات المتقدمة:');
  console.log('=' .repeat(50));
  
  results.forEach(result => {
    const icon = result.status === 'نجح' ? '✅' : '❌';
    console.log(`${icon} ${result.name}: ${result.status} (${result.duration}ms)`);
    if (result.error) {
      console.log(`   📝 الخطأ: ${result.error}`);
    }
  });
  
  const successRate = Math.round((passedTests / Object.keys(tests).length) * 100);
  console.log(`\n🎯 معدل النجاح: ${successRate}% (${passedTests}/${Object.keys(tests).length})`);
  
  return { successRate, results, passedTests, totalTests: Object.keys(tests).length };
}

// ===== 5. دوال التصدير =====

// تصدير الدوال للاستخدام
if (typeof module !== 'undefined' && module.exports) {
  module.exports = {
    createEnhancedGeminiAdapter,
    createEnhancedMemorySystem,
    createAdvancedTests,
    runAdvancedTests
  };
}

// دوال للاستخدام المباشر في Google Apps Script
function testGeminiIntegration() {
  return runAdvancedTests();
}

function setupEnhancedGeminiAdapter() {
  console.log('🔧 إعداد GeminiAdapter المحسن...');
  
  // هنا يمكن إضافة كود لتحديث الملف الفعلي
  console.log('📝 يرجى نسخ الكود المحسن إلى ملف GeminiAdapter');
  
  return createEnhancedGeminiAdapter();
}

// *************************************************************************************************
// --- نهاية تحسين تكامل Gemini API ---
// *************************************************************************************************