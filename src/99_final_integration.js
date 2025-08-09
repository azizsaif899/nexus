/**
 * @file 99_final_integration.js
 * @description التكامل النهائي وتصدير الدوال العامة
 * @version 1.0.0
 */

// تسجيل جميع الوحدات الجديدة في النظام
defineModule('System.FinalIntegration', ({ Utils }) => {
  const MODULE_VERSION = '1.0.0';

  function initializeAllSystems() {
    try {
      Utils.log('🚀 بدء التكامل النهائي...');

      // 1. تهيئة الخدمات الأساسية
      initializeServices();

      // 2. تهيئة الأدوات
      initializeTools();

      // 3. تهيئة واجهة المستخدم
      initializeUserInterface();

      // 4. تسجيل الدوال العامة
      registerGlobalFunctions();

      Utils.log('✅ تم التكامل النهائي بنجاح');
      return { success: true, message: 'النظام جاهز بالكامل' };

    } catch (error) {
      Utils.error('❌ فشل في التكامل النهائي:', error.message);
      return { success: false, error: error.message };
    }
  }

  function initializeServices() {
    try {
      // تهيئة خدمة التضمين
      const embeddingService = GAssistant.Utils.Injector.get('Services', 'EmbeddingService');
      if (embeddingService && !embeddingService.isInitialized()) {
        embeddingService.initialize();
      }

      // تهيئة محول Gemini
      const geminiAdapter = GAssistant.Utils.Injector.get('AI', 'GeminiAdapter');
      if (geminiAdapter && !geminiAdapter.isInitialized()) {
        geminiAdapter.initialize();
      }

      Utils.log('✅ تم تهيئة الخدمات');
    } catch (error) {
      Utils.warn('⚠️ فشل في تهيئة بعض الخدمات:', error.message);
    }
  }

  function initializeTools() {
    try {
      // تسجيل أداة تحليل الجداول
      const sheetsAnalyzer = GAssistant.Utils.Injector.get('Tools', 'SheetsAnalyzer');
      if (sheetsAnalyzer) {
        Utils.log('✅ أداة تحليل الجداول جاهزة');
      }

      Utils.log('✅ تم تهيئة الأدوات');
    } catch (error) {
      Utils.warn('⚠️ فشل في تهيئة بعض الأدوات:', error.message);
    }
  }

  function initializeUserInterface() {
    try {
      // تهيئة مشغلات القائمة
      const menuTriggers = GAssistant.Utils.Injector.get('MenuTriggers');
      if (menuTriggers) {
        Utils.log('✅ مشغلات القائمة جاهزة');
      }

      // تهيئة الواجهة المحسنة
      const enhancedSidebar = GAssistant.Utils.Injector.get('UI', 'EnhancedSidebarV3');
      if (enhancedSidebar) {
        Utils.log('✅ الواجهة المحسنة v3 جاهزة');
      }

      Utils.log('✅ تم تهيئة واجهة المستخدم');
    } catch (error) {
      Utils.warn('⚠️ فشل في تهيئة واجهة المستخدم:', error.message);
    }
  }

  function registerGlobalFunctions() {
    try {
      // تصدير الدوال الأساسية للاستدعاء المباشر
      if (typeof global !== 'undefined') {
        // دوال القائمة
        global.onOpen = onOpen;
        global.showAssistantSidebar = showAssistantSidebar;
        global.showDeveloperSidebar = showDeveloperSidebar;

        // دوال التحليل
        global.analyzeCurrentSheet = analyzeCurrentSheet;
        global.generateSheetInsights = generateSheetInsights;

        // دوال النظام
        global.initializeSystem = initializeSystem;
        global.getSystemStatus = getSystemStatus;
        global.runSystemTest = runSystemTest;

        // دوال المساعد الذكي
        global.processEnhancedMessage = processEnhancedMessage;
        global.performSemanticSearch = performSemanticSearch;
        global.updateChatEmbeddings = updateChatEmbeddings;

        // دوال الإعدادات
        global.dumpConfig = dumpConfig;
        global.loadChatHistory = loadChatHistory;
        global.saveChatHistory = saveChatHistory;
        global.getEmbeddingStats = getEmbeddingStats;
      }

      Utils.log('✅ تم تسجيل الدوال العامة');
    } catch (error) {
      Utils.warn('⚠️ فشل في تسجيل بعض الدوال العامة:', error.message);
    }
  }

  return {
    initializeAllSystems,
    MODULE_VERSION
  };
});

// ===== الدوال العامة المصدرة =====

function onOpen() {
  try {
    const menuTriggers = GAssistant.Utils.Injector.get('MenuTriggers');
    return menuTriggers ? menuTriggers.onOpen() : null;
  } catch (error) {
    console.error('خطأ في onOpen:', error.message);
    SpreadsheetApp.getUi().alert('حدث خطأ في تحميل القائمة');
  }
}

function showAssistantSidebar() {
  try {
    const menuTriggers = GAssistant.Utils.Injector.get('MenuTriggers');
    return menuTriggers ? menuTriggers.showAssistantSidebar() : null;
  } catch (error) {
    console.error('خطأ في عرض المساعد:', error.message);
    SpreadsheetApp.getUi().alert('فشل في فتح المساعد');
  }
}

function showDeveloperSidebar() {
  try {
    const menuTriggers = GAssistant.Utils.Injector.get('MenuTriggers');
    return menuTriggers ? menuTriggers.showDeveloperSidebar() : null;
  } catch (error) {
    console.error('خطأ في عرض لوحة المطور:', error.message);
    SpreadsheetApp.getUi().alert('فشل في فتح لوحة المطور');
  }
}

function analyzeCurrentSheet() {
  try {
    const sheetsAnalyzer = GAssistant.Utils.Injector.get('Tools', 'SheetsAnalyzer');
    if (!sheetsAnalyzer) {
      throw new Error('أداة تحليل الجداول غير متاحة');
    }

    return sheetsAnalyzer.analyzeSheet();
  } catch (error) {
    console.error('خطأ في تحليل الورقة:', error.message);
    return { type: 'error', message: error.message };
  }
}

function generateSheetInsights(sheetName = null) {
  try {
    const sheetsAnalyzer = GAssistant.Utils.Injector.get('Tools', 'SheetsAnalyzer');
    if (!sheetsAnalyzer) {
      throw new Error('أداة تحليل الجداول غير متاحة');
    }

    return sheetsAnalyzer.generateInsights(sheetName);
  } catch (error) {
    console.error('خطأ في إنشاء الرؤى:', error.message);
    return { type: 'error', message: error.message };
  }
}

function initializeSystem() {
  try {
    const initializer = GAssistant.Utils.Injector.get('MainInitializer');
    return initializer ? initializer.initializeSystem() : { success: false, error: 'المهيئ غير متاح' };
  } catch (error) {
    console.error('خطأ في تهيئة النظام:', error.message);
    return { success: false, error: error.message };
  }
}

function getSystemStatus() {
  try {
    return GAssistant.System?.getStatus() || { error: 'معلومات النظام غير متاحة' };
  } catch (error) {
    console.error('خطأ في الحصول على حالة النظام:', error.message);
    return { error: error.message };
  }
}

function runSystemTest() {
  try {
    const tests = GAssistant.Utils.Injector.get('Tests');
    if (tests && tests.runBasicTests) {
      return tests.runBasicTests();
    }

    // اختبار أساسي بديل
    const basicTest = {
      config: !!GAssistant.Utils.Injector.get('Config'),
      ai: !!GAssistant.Utils.Injector.get('AI'),
      tools: !!GAssistant.Utils.Injector.get('Tools'),
      ui: !!GAssistant.Utils.Injector.get('UI')
    };

    const passedTests = Object.values(basicTest).filter(Boolean).length;
    const totalTests = Object.keys(basicTest).length;

    return {
      success: passedTests === totalTests,
      message: `نجح ${passedTests} من ${totalTests} اختبارات`,
      details: basicTest
    };

  } catch (error) {
    console.error('خطأ في تشغيل الاختبارات:', error.message);
    return { success: false, error: error.message };
  }
}

async function processEnhancedMessage(message, config = {}) {
  try {
    const ai = GAssistant.Utils.Injector.get('AI', 'Core');
    if (!ai) {
      throw new Error('محرك الذكاء الاصطناعي غير متاح');
    }

    // معالجة الرسالة باستخدام الإعدادات المحددة
    const options = {
      sessionId: config.sessionId || 'default',
      modelOverride: config.agent !== 'auto' ? getModelForAgent(config.agent) : null,
      thinkingConfig: {
        enableThinking: true,
        maxThinkingSteps: Math.floor(config.thinkingBudget / 1024) || 8
      },
      toolsEnabled: true
    };

    const result = ai.ask(message, options);

    // إضافة معلومات إضافية للاستجابة
    return {
      content: result.text || result.content || 'لا توجد استجابة',
      type: result.type || 'text',
      agent: config.agent || 'auto',
      embedding: config.enableEmbeddings ? await generateMessageEmbedding(message) : null,
      timestamp: new Date().toISOString()
    };

  } catch (error) {
    console.error('خطأ في معالجة الرسالة:', error.message);
    return {
      content: `عذراً، حدث خطأ: ${error.message}`,
      type: 'error',
      timestamp: new Date().toISOString()
    };
  }
}

function getModelForAgent(agent) {
  const agentModels = {
    'CFO': 'gemini-1.5-pro-latest',
    'Developer': 'gemini-1.5-pro-latest',
    'DatabaseManager': 'gemini-1.5-flash-latest'
  };

  return agentModels[agent] || null;
}

async function generateMessageEmbedding(message) {
  try {
    const embeddingService = GAssistant.Utils.Injector.get('Services', 'EmbeddingService');
    if (!embeddingService) return null;

    const result = await embeddingService.generateEmbedding(message);
    return result.embedding;
  } catch (error) {
    console.warn('فشل في إنشاء تضمين الرسالة:', error.message);
    return null;
  }
}

async function performSemanticSearch(query, chatHistory = []) {
  try {
    const embeddingService = GAssistant.Utils.Injector.get('Services', 'EmbeddingService');
    if (!embeddingService) {
      throw new Error('خدمة البحث الدلالي غير متاحة');
    }

    // إضافة تاريخ المحادثة إلى مخزن المتجهات إذا لم يكن موجوداً
    if (chatHistory.length > 0) {
      const documents = chatHistory.map(msg => ({
        text: msg.content,
        metadata: { type: msg.type, timestamp: msg.timestamp }
      }));

      await embeddingService.addToVectorStore(documents);
    }

    // البحث عن النتائج المشابهة
    const results = await embeddingService.searchSimilar(query, 5, 0.6);

    return results.map((result, index) => ({
      index: index,
      document: result.text,
      similarity: result.similarity,
      metadata: result.metadata
    }));

  } catch (error) {
    console.error('خطأ في البحث الدلالي:', error.message);
    return [];
  }
}

async function updateChatEmbeddings(messages) {
  try {
    const embeddingService = GAssistant.Utils.Injector.get('Services', 'EmbeddingService');
    if (!embeddingService) return false;

    await embeddingService.addToVectorStore(messages);
    return true;
  } catch (error) {
    console.warn('فشل في تحديث تضمينات المحادثة:', error.message);
    return false;
  }
}

function dumpConfig() {
  try {
    const config = GAssistant.Utils.Injector.get('Config');
    if (config && config.dump) {
      config.dump('System_Config_Export');
      return { success: true, message: 'تم تصدير الإعدادات' };
    }
    return { success: false, message: 'وحدة الإعدادات غير متاحة' };
  } catch (error) {
    console.error('خطأ في تصدير الإعدادات:', error.message);
    return { success: false, error: error.message };
  }
}

function loadChatHistory() {
  try {
    // محاولة تحميل تاريخ المحادثة من التخزين المحلي
    const cache = CacheService.getScriptCache();
    const historyStr = cache.get('chat_history');

    if (historyStr) {
      return JSON.parse(historyStr);
    }

    return [];
  } catch (error) {
    console.warn('فشل في تحميل تاريخ المحادثة:', error.message);
    return [];
  }
}

function saveChatHistory(history) {
  try {
    const cache = CacheService.getScriptCache();
    cache.put('chat_history', JSON.stringify(history), 3600); // ساعة واحدة
    return true;
  } catch (error) {
    console.warn('فشل في حفظ تاريخ المحادثة:', error.message);
    return false;
  }
}

function getEmbeddingStats() {
  try {
    const embeddingService = GAssistant.Utils.Injector.get('Services', 'EmbeddingService');
    return embeddingService ? embeddingService.getStats() : {};
  } catch (error) {
    console.warn('فشل في الحصول على إحصائيات التضمين:', error.message);
    return {};
  }
}

// تشغيل التكامل النهائي عند التحميل
if (typeof SpreadsheetApp !== 'undefined') {
  // تأخير للسماح بتحميل جميع الوحدات
  Utilities.sleep(200);

  try {
    // بناء جميع الوحدات
    GAssistant.Utils.Injector.buildAllModules();

    // تشغيل التكامل النهائي
    const integration = GAssistant.Utils.Injector.get('FinalIntegration');
    if (integration) {
      const result = integration.initializeAllSystems();
      if (result.success) {
        console.log('🎉 AzizSys جاهز للاستخدام!');
      } else {
        console.error('❌ فشل في التكامل النهائي:', result.error);
      }
    }
  } catch (error) {
    console.error('خطأ في التكامل النهائي:', error.message);
  }
}
