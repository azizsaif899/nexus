// *************************************************************************************************
// --- المرحلة الثانية: تكامل AI (أسبوع 3-4) ---
// *************************************************************************************************

/**
 * @file phase2_ai_integration.js
 * @version 1.0.0
 * @author عبدالعزيز
 * @description
 * تنفيذ المرحلة الثانية من خطة الوصول إلى 100% - تكامل الذكاء الاصطناعي
 * الهدف: الوصول إلى 50% - AI يعمل بكفاءة
 *
 * الأولويات:
 * 1. Gemini API Integration - تكامل كامل مع API
 * 2. AI Core Functions - وظائف الذكاء الاصطناعي الأساسية
 * 3. AI Memory System - نظام الذاكرة الفعال
 */

// ===== 1. إعداد Gemini API Integration =====

/**
 * تحسين GeminiAdapter للعمل مع API الحقيقي
 */
function enhanceGeminiAdapter() {
  console.log('🔧 تحسين GeminiAdapter...');

  // التحقق من وجود API Key
  const apiKey = PropertiesService.getScriptProperties().getProperty('GEMINI_API_KEY');
  if (!apiKey) {
    console.error('❌ GEMINI_API_KEY غير موجود في Script Properties');
    return false;
  }

  // اختبار الاتصال
  try {
    const testPayload = {
      contents: [{
        role: 'user',
        parts: [{ text: 'Hello, are you working?' }]
      }]
    };

    const response = UrlFetchApp.fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-pro-latest:generateContent?key=${apiKey}`,
      {
        method: 'POST',
        contentType: 'application/json',
        payload: JSON.stringify(testPayload),
        muteHttpExceptions: true
      }
    );

    const responseCode = response.getResponseCode();
    const responseText = response.getContentText();

    if (responseCode === 200) {
      const data = JSON.parse(responseText);
      if (data.candidates && data.candidates[0] && data.candidates[0].content) {
        console.log('✅ Gemini API يعمل بنجاح');
        return true;
      }
    }

    EnhancedSecureLogger.error('Gemini API Error', null, {
      responseCode: responseCode,
      function: 'enhanceGeminiAdapter'
    });
    return false;

  } catch (error) {
    EnhancedSecureLogger.error('خطأ في اختبار Gemini API', error.message, {
      function: 'enhanceGeminiAdapter'
    });
    return false;
  }
}

/**
 * إعداد Script Properties المطلوبة
 */
function setupScriptProperties() {
  console.log('⚙️ إعداد Script Properties...');

  const properties = PropertiesService.getScriptProperties();
  const requiredProps = {
    'DEBUG_MODE': 'true',
    'GEMINI_DEFAULT_MODEL': 'gemini-1.5-pro-latest',
    'API_MAX_RETRIES': '3',
    'API_RETRY_DELAY_MS': '1000',
    'MAX_MODEL_CONTEXT_TOKENS': '10000',
    'AI_CORE_VERSION': '1.3.1',
    'AI_MEMORY_VERSION': '2.0.0',
    'GEMINI_ADAPTER_VERSION': '2.0.1',
    'AI_ORCHESTRATOR_VERSION': '1.0.0',
    'JSON_QUERY_VERSION': '1.0.0',
    'AI_CONTEXT_VERSION': '1.0.0',
    'AI_TOOL_EXECUTOR_VERSION': '1.2.0'
  };

  // إعداد الخصائص المطلوبة
  for (const [key, value] of Object.entries(requiredProps)) {
    if (!properties.getProperty(key)) {
      properties.setProperty(key, value);
      EnhancedSecureLogger.info('تم إعداد خاصية', null, {
        key: key,
        function: 'setupScriptProperties'
      });
    }
  }

  // التحقق من GEMINI_API_KEY
  if (!properties.getProperty('GEMINI_API_KEY')) {
    EnhancedSecureLogger.warn('يجب إعداد GEMINI_API_KEY يدوياً في Script Properties');
    EnhancedSecureLogger.info('اذهب إلى: Extensions > Apps Script > Project Settings > Script Properties');
    EnhancedSecureLogger.info('أضف: GEMINI_API_KEY = your_actual_api_key_here');
  }

  console.log('✅ تم إعداد Script Properties');
}

/**
 * إنشاء أوراق المقاييس المطلوبة
 */
function createMetricsSheets() {
  console.log('📊 إنشاء أوراق المقاييس...');

  const ss = SpreadsheetApp.getActiveSpreadsheet();
  if (!ss) {
    console.error('❌ لا توجد ورقة عمل نشطة');
    return false;
  }

  const sheetsToCreate = [
    {
      name: 'AI_Gemini_Metrics',
      headers: ['Timestamp', 'Action', 'Model', 'DurationMs', 'Status', 'Version', 'PromptLength', 'ResponseLength', 'ErrorMessage']
    },
    {
      name: 'AI_Core_Metrics',
      headers: ['Timestamp', 'Action', 'Status', 'DurationMs', 'Version', 'Model', 'PromptLength', 'ResponseLength', 'Error']
    },
    {
      name: 'AI_Memory_Metrics',
      headers: ['Timestamp', 'Function', 'Version', 'Meta']
    },
    {
      name: 'AI_Orchestrator_Metrics',
      headers: ['Timestamp', 'Action', 'Status', 'DurationMs', 'Model', 'PromptLength', 'Error']
    },
    {
      name: 'AI_ToolExecutor_Metrics',
      headers: ['Timestamp', 'Action', 'Status', 'DurationMs', 'Version', 'FunctionName', 'ErrorMessage']
    },
    {
      name: 'Config_Metrics',
      headers: ['Timestamp', 'Status']
    }
  ];

  for (const sheetInfo of sheetsToCreate) {
    let sheet = ss.getSheetByName(sheetInfo.name);
    if (!sheet) {
      sheet = ss.insertSheet(sheetInfo.name);
      sheet.getRange(1, 1, 1, sheetInfo.headers.length).setValues([sheetInfo.headers]);
      sheet.getRange(1, 1, 1, sheetInfo.headers.length).setFontWeight('bold');
      console.log(`✅ تم إنشاء ورقة: ${sheetInfo.name}`);
    } else {
      console.log(`ℹ️ ورقة موجودة: ${sheetInfo.name}`);
    }
  }

  return true;
}

// ===== 2. تحسين AI Core Functions =====

/**
 * اختبار AI Core Functions
 */
function testAICoreFunctions() {
  console.log('🧠 اختبار AI Core Functions...');

  try {
    // تحميل النظام
    if (typeof GAssistant === 'undefined') {
      console.log('📦 تحميل النظام...');
      // هنا يجب تحميل النظام الأساسي
      return false;
    }

    // اختبار AI.Core.ask
    if (GAssistant.AI && GAssistant.AI.Core && GAssistant.AI.Core.ask) {
      console.log('🔍 اختبار AI.Core.ask...');

      const testPrompt = 'مرحبا، هل تعمل بشكل صحيح؟';
      const response = GAssistant.AI.Core.ask(testPrompt, { sessionId: 'test_session' });

      if (response && response.type) {
        console.log(`✅ AI.Core.ask يعمل - النوع: ${response.type}`);
        console.log(`📝 الرد: ${response.text ? response.text.substring(0, 100) + '...' : 'لا يوجد نص'}`);
        return true;
      } else {
        console.error('❌ AI.Core.ask لا يعيد استجابة صحيحة');
        return false;
      }
    } else {
      console.error('❌ AI.Core.ask غير متاح');
      return false;
    }

  } catch (error) {
    console.error('❌ خطأ في اختبار AI Core Functions:', error.message);
    return false;
  }
}

/**
 * اختبار AI Memory System
 */
function testAIMemorySystem() {
  console.log('🧠 اختبار AI Memory System...');

  try {
    if (!GAssistant.AI || !GAssistant.AI.Memory) {
      console.error('❌ AI.Memory غير متاح');
      return false;
    }

    const sessionId = 'test_memory_session';

    // اختبار إضافة رسالة
    const testMessage = {
      role: 'user',
      parts: [{ text: 'هذه رسالة اختبار للذاكرة' }]
    };

    GAssistant.AI.Memory.addMessageToHistory({ sessionId, message: testMessage });
    console.log('✅ تم إضافة رسالة إلى الذاكرة');

    // اختبار استرجاع التاريخ
    const history = GAssistant.AI.Memory.getSessionHistory({ sessionId });
    if (Array.isArray(history) && history.length > 0) {
      console.log(`✅ تم استرجاع التاريخ - ${history.length} رسالة`);
    } else {
      console.error('❌ فشل في استرجاع التاريخ');
      return false;
    }

    // اختبار مسح الجلسة
    GAssistant.AI.Memory.clearSessionContext({ sessionId });
    console.log('✅ تم مسح جلسة الاختبار');

    return true;

  } catch (error) {
    console.error('❌ خطأ في اختبار AI Memory System:', error.message);
    return false;
  }
}

// ===== 3. اختبار التكامل الشامل =====

/**
 * اختبار شامل للمرحلة الثانية
 */
function runPhase2Tests() {
  console.log('🚀 بدء اختبارات المرحلة الثانية...');
  console.log('=' .repeat(50));

  const tests = [
    { name: 'إعداد Script Properties', fn: setupScriptProperties },
    { name: 'إنشاء أوراق المقاييس', fn: createMetricsSheets },
    { name: 'تحسين GeminiAdapter', fn: enhanceGeminiAdapter },
    { name: 'اختبار AI Core Functions', fn: testAICoreFunctions },
    { name: 'اختبار AI Memory System', fn: testAIMemorySystem }
  ];

  let passedTests = 0;
  const results = [];

  for (const test of tests) {
    console.log(`\n🔄 تشغيل: ${test.name}...`);
    try {
      const result = test.fn();
      if (result !== false) {
        console.log(`✅ نجح: ${test.name}`);
        passedTests++;
        results.push({ name: test.name, status: 'نجح', error: null });
      } else {
        console.log(`❌ فشل: ${test.name}`);
        results.push({ name: test.name, status: 'فشل', error: 'الدالة أرجعت false' });
      }
    } catch (error) {
      console.error(`❌ خطأ في ${test.name}:`, error.message);
      results.push({ name: test.name, status: 'خطأ', error: error.message });
    }
  }

  // تقرير النتائج
  console.log('\n' + '=' .repeat(50));
  console.log('📊 تقرير نتائج المرحلة الثانية:');
  console.log('=' .repeat(50));

  results.forEach(result => {
    const icon = result.status === 'نجح' ? '✅' : '❌';
    console.log(`${icon} ${result.name}: ${result.status}`);
    if (result.error) {
      console.log(`   📝 الخطأ: ${result.error}`);
    }
  });

  const successRate = Math.round((passedTests / tests.length) * 100);
  console.log(`\n🎯 معدل النجاح: ${successRate}% (${passedTests}/${tests.length})`);

  if (successRate >= 80) {
    console.log('🎉 المرحلة الثانية مكتملة بنجاح!');
    console.log('📈 التقدم الإجمالي: ~50% (AI يعمل)');
    console.log('➡️ جاهز للانتقال إلى المرحلة الثالثة (Google Sheets Integration)');
  } else if (successRate >= 60) {
    console.log('⚠️ المرحلة الثانية مكتملة جزئياً');
    console.log('🔧 يحتاج إلى إصلاحات إضافية قبل المتابعة');
  } else {
    console.log('❌ المرحلة الثانية تحتاج إلى مراجعة شاملة');
    console.log('🛠️ يجب إصلاح المشاكل الأساسية أولاً');
  }

  return { successRate, results, passedTests, totalTests: tests.length };
}

// ===== 4. دوال مساعدة للتطوير =====

/**
 * إعداد سريع للمطورين
 */
function quickSetupForDevelopers() {
  console.log('⚡ إعداد سريع للمطورين...');

  // إعداد API Key تجريبي (يجب استبداله بالحقيقي)
  const properties = PropertiesService.getScriptProperties();
  if (!properties.getProperty('GEMINI_API_KEY')) {
    console.log('⚠️ تحذير: لم يتم العثور على GEMINI_API_KEY');
    console.log('📝 يرجى إعداد API Key الحقيقي في Script Properties');
    console.log('🔗 احصل على API Key من: https://makersuite.google.com/app/apikey');
  }

  // تشغيل الاختبارات
  return runPhase2Tests();
}

/**
 * تنظيف البيانات التجريبية
 */
function cleanupTestData() {
  console.log('🧹 تنظيف البيانات التجريبية...');

  try {
    // مسح جلسات الاختبار من الذاكرة
    if (GAssistant && GAssistant.AI && GAssistant.AI.Memory) {
      GAssistant.AI.Memory.clearSessionContext({ sessionId: 'test_session' });
      GAssistant.AI.Memory.clearSessionContext({ sessionId: 'test_memory_session' });
      console.log('✅ تم مسح جلسات الاختبار');
    }

    // مسح الكاش
    CacheService.getUserCache().removeAll();
    CacheService.getScriptCache().removeAll();
    console.log('✅ تم مسح الكاش');

    console.log('🎯 تم تنظيف البيانات التجريبية');

  } catch (error) {
    console.error('❌ خطأ في تنظيف البيانات:', error.message);
  }
}

// ===== 5. نقطة الدخول الرئيسية =====

/**
 * تشغيل المرحلة الثانية كاملة
 */
function executePhase2() {
  console.log('🎯 تنفيذ المرحلة الثانية: تكامل AI');
  console.log('📅 المدة المتوقعة: أسبوع 3-4');
  console.log('🎯 الهدف: الوصول إلى 50% - AI يعمل');
  console.log('\n' + '=' .repeat(60));

  const startTime = new Date();
  const results = runPhase2Tests();
  const endTime = new Date();
  const duration = Math.round((endTime - startTime) / 1000);

  console.log('\n' + '=' .repeat(60));
  console.log(`⏱️ وقت التنفيذ: ${duration} ثانية`);
  console.log(`📊 النتيجة النهائية: ${results.successRate}%`);

  // حفظ التقرير
  try {
    const ss = SpreadsheetApp.getActiveSpreadsheet();
    if (ss) {
      let reportSheet = ss.getSheetByName('Phase2_Report');
      if (!reportSheet) {
        reportSheet = ss.insertSheet('Phase2_Report');
        reportSheet.getRange(1, 1, 1, 5).setValues([['Timestamp', 'Test', 'Status', 'Error', 'Duration']]);
        reportSheet.getRange(1, 1, 1, 5).setFontWeight('bold');
      }

      results.results.forEach(result => {
        reportSheet.appendRow([
          new Date(),
          result.name,
          result.status,
          result.error || '',
          duration
        ]);
      });

      console.log('📋 تم حفظ التقرير في ورقة Phase2_Report');
    }
  } catch (error) {
    console.warn('⚠️ لم يتم حفظ التقرير:', error.message);
  }

  return results;
}

// تصدير الدوال للاستخدام الخارجي
if (typeof module !== 'undefined' && module.exports) {
  module.exports = {
    executePhase2,
    runPhase2Tests,
    quickSetupForDevelopers,
    cleanupTestData,
    enhanceGeminiAdapter,
    testAICoreFunctions,
    testAIMemorySystem
  };
}

// *************************************************************************************************
// --- نهاية المرحلة الثانية: تكامل AI ---
// *************************************************************************************************
