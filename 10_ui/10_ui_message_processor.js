/**
 * @file 10_ui/10_ui_message_processor.js
 * @description معالج الرسائل المحسن مع دعم Embeddings والبحث الدلالي
 * @version 1.0.0
 * @author عبدالعزيز
 */

defineModule('System.UI.MessageProcessor', ({ Utils, Config, AI, Services }) => {
  const MODULE_VERSION = '1.0.0';

  /**
   * تهيئة خدمة Embeddings
   */
  function initializeEmbeddingService() {
    try {
      const embeddingService = Services.EmbeddingService;
      if (!embeddingService) {
        throw new Error('EmbeddingService not available');
      }
      
      return {
        success: true,
        stats: embeddingService.getStats(),
        message: 'خدمة Embeddings جاهزة'
      };
    } catch (error) {
      Utils.error('Failed to initialize embedding service', error);
      return {
        success: false,
        error: error.message
      };
    }
  }

  /**
   * معالجة الرسائل المحسنة مع دعم Embeddings
   */
  async function processEnhancedMessage(message, config = {}) {
    try {
      Utils.log(`Processing enhanced message with config: ${JSON.stringify(config)}`);
      
      // إعداد السياق المحسن
      const context = await buildEnhancedContext(message, config);
      
      // اختيار الوكيل المناسب
      const agent = selectOptimalAgent(message, config.agent);
      
      // معالجة الرسالة
      const response = await processWithAgent(agent, message, context, config);
      
      // إنشاء embedding للرسالة والرد إذا كان مفعلاً
      if (config.enableEmbeddings) {
        await generateMessageEmbeddings(message, response.content);
      }
      
      return {
        content: response.content,
        agent: agent,
        embedding: config.enableEmbeddings,
        processingTime: response.processingTime,
        thinkingBudget: config.thinkingBudget
      };
      
    } catch (error) {
      Utils.error('Enhanced message processing failed', error);
      throw new Error(`فشل في معالجة الرسالة: ${error.message}`);
    }
  }

  /**
   * بناء السياق المحسن للرسالة
   */
  async function buildEnhancedContext(message, config) {
    const context = {
      currentSheet: getCurrentSheetContext(),
      userPreferences: getUserPreferences(),
      timestamp: new Date().toISOString()
    };

    // إضافة السياق الدلالي إذا كان مفعلاً
    if (config.enableEmbeddings) {
      try {
        const semanticContext = await getSemanticContext(message);
        context.semanticContext = semanticContext;
      } catch (error) {
        Utils.warn('Failed to get semantic context', error);
      }
    }

    // إضافة تاريخ المحادثة ذي الصلة
    const chatHistory = getChatHistory();
    if (chatHistory && chatHistory.length > 0) {
      context.recentHistory = chatHistory.slice(-5); // آخر 5 رسائل
    }

    return context;
  }

  /**
   * الحصول على السياق الدلالي للرسالة
   */
  async function getSemanticContext(message, topK = 3) {
    try {
      const embeddingService = Services.EmbeddingService;
      const chatHistory = getChatHistory();
      
      if (!chatHistory || chatHistory.length === 0) {
        return null;
      }

      // استخراج النصوص من التاريخ
      const historicalTexts = chatHistory.map(item => item.content);
      
      // البحث الدلالي
      const semanticResults = await embeddingService.semanticSearch(
        message, 
        historicalTexts, 
        { topK }
      );

      return {
        relatedMessages: semanticResults,
        contextStrength: semanticResults.length > 0 ? semanticResults[0].similarity : 0
      };
      
    } catch (error) {
      Utils.error('Failed to get semantic context', error);
      return null;
    }
  }

  /**
   * اختيار الوكيل الأمثل
   */
  function selectOptimalAgent(message, preferredAgent = 'auto') {
    if (preferredAgent !== 'auto') {
      return preferredAgent;
    }

    // تحليل النية لاختيار الوكيل المناسب
    const intentAnalyzer = AI.IntentAnalyzer;
    if (intentAnalyzer) {
      const intent = intentAnalyzer.analyzeIntent(message);
      return mapIntentToAgent(intent);
    }

    // الوكيل الافتراضي
    return 'General';
  }

  /**
   * ربط النية بالوكيل المناسب
   */
  function mapIntentToAgent(intent) {
    const agentMapping = {
      'financial_analysis': 'CFO',
      'code_review': 'Developer',
      'data_management': 'DatabaseManager',
      'general_query': 'General'
    };

    return agentMapping[intent] || 'General';
  }

  /**
   * معالجة الرسالة مع الوكيل المحدد
   */
  async function processWithAgent(agent, message, context, config) {
    const startTime = Date.now();
    
    try {
      // إعداد خيارات الذكاء الاصطناعي
      const aiOptions = {
        thinkingConfig: {
          thinkingBudget: config.thinkingBudget || 8192,
          enableThinking: true
        },
        context: context,
        agent: agent
      };

      // استدعاء الوكيل المناسب
      let response;
      switch (agent) {
        case 'CFO':
          response = await AI.Agents.CFO.processQuery(message, aiOptions);
          break;
        case 'Developer':
          response = await AI.Agents.Developer.processQuery(message, aiOptions);
          break;
        case 'DatabaseManager':
          response = await AI.Agents.DatabaseManager.processQuery(message, aiOptions);
          break;
        default:
          response = await AI.Agents.General.processQuery(message, aiOptions);
      }

      const processingTime = Date.now() - startTime;
      
      return {
        content: response.content || response,
        processingTime: processingTime,
        metadata: response.metadata || {}
      };
      
    } catch (error) {
      Utils.error(`Agent ${agent} processing failed`, error);
      
      // Fallback إلى الوكيل العام
      if (agent !== 'General') {
        Utils.log('Falling back to General agent');
        return await processWithAgent('General', message, context, config);
      }
      
      throw error;
    }
  }

  /**
   * إنشاء embeddings للرسائل
   */
  async function generateMessageEmbeddings(userMessage, assistantMessage) {
    try {
      const embeddingService = Services.EmbeddingService;
      
      // إنشاء embeddings للرسائل
      await embeddingService.generateEmbeddings([userMessage, assistantMessage]);
      
      Utils.log('Message embeddings generated successfully');
      return true;
      
    } catch (error) {
      Utils.error('Failed to generate message embeddings', error);
      return false;
    }
  }

  /**
   * تحديث embeddings المحادثة
   */
  async function updateChatEmbeddings(messages) {
    try {
      const embeddingService = Services.EmbeddingService;
      
      if (!Array.isArray(messages) || messages.length === 0) {
        return false;
      }

      // إنشاء embeddings للرسائل الجديدة
      await embeddingService.generateEmbeddings(messages);
      
      Utils.log(`Updated embeddings for ${messages.length} messages`);
      return true;
      
    } catch (error) {
      Utils.error('Failed to update chat embeddings', error);
      return false;
    }
  }

  /**
   * البحث الدلالي في المحادثات
   */
  async function performSemanticSearch(query, chatHistory, options = {}) {
    try {
      const embeddingService = Services.EmbeddingService;
      
      if (!chatHistory || chatHistory.length === 0) {
        return [];
      }

      // استخراج النصوص
      const documents = chatHistory.map(item => item.content);
      
      // تنفيذ البحث الدلالي
      const results = await embeddingService.semanticSearch(query, documents, {
        topK: options.topK || 5,
        threshold: options.threshold || 0.3
      });

      // إضافة معلومات إضافية للنتائج
      return results.map(result => ({
        ...result,
        timestamp: chatHistory[result.index].timestamp,
        type: chatHistory[result.index].type
      }));
      
    } catch (error) {
      Utils.error('Semantic search failed', error);
      return [];
    }
  }

  /**
   * الحصول على إحصائيات Embeddings
   */
  function getEmbeddingStats() {
    try {
      const embeddingService = Services.EmbeddingService;
      return embeddingService.getStats();
    } catch (error) {
      Utils.error('Failed to get embedding stats', error);
      return { cacheSize: 0, model: 'unknown', version: 'unknown' };
    }
  }

  /**
   * مسح cache الـ Embeddings
   */
  function clearEmbeddingCache() {
    try {
      const embeddingService = Services.EmbeddingService;
      embeddingService.clearCache();
      return { success: true, message: 'تم مسح التخزين المؤقت بنجاح' };
    } catch (error) {
      Utils.error('Failed to clear embedding cache', error);
      return { success: false, error: error.message };
    }
  }

  /**
   * الحصول على سياق الورقة الحالية
   */
  function getCurrentSheetContext() {
    try {
      const sheet = SpreadsheetApp.getActiveSheet();
      const range = sheet.getActiveRange();
      
      return {
        sheetName: sheet.getName(),
        activeRange: range.getA1Notation(),
        lastRow: sheet.getLastRow(),
        lastColumn: sheet.getLastColumn(),
        selectedData: range.getValues()
      };
    } catch (error) {
      Utils.warn('Failed to get sheet context', error);
      return null;
    }
  }

  /**
   * الحصول على تفضيلات المستخدم
   */
  function getUserPreferences() {
    try {
      const properties = PropertiesService.getUserProperties();
      return {
        language: properties.getProperty('user_language') || 'ar',
        theme: properties.getProperty('user_theme') || 'light',
        defaultAgent: properties.getProperty('default_agent') || 'auto'
      };
    } catch (error) {
      Utils.warn('Failed to get user preferences', error);
      return {};
    }
  }

  /**
   * الحصول على تاريخ المحادثة
   */
  function getChatHistory() {
    try {
      const cache = CacheService.getScriptCache();
      const historyJson = cache.get('chat_history');
      return historyJson ? JSON.parse(historyJson) : [];
    } catch (error) {
      Utils.warn('Failed to get chat history', error);
      return [];
    }
  }

  /**
   * حفظ تاريخ المحادثة
   */
  function saveChatHistory(history) {
    try {
      const cache = CacheService.getScriptCache();
      cache.put('chat_history', JSON.stringify(history), 21600); // 6 hours
      return true;
    } catch (error) {
      Utils.error('Failed to save chat history', error);
      return false;
    }
  }

  /**
   * تحميل تاريخ المحادثة
   */
  function loadChatHistory() {
    return getChatHistory();
  }

  /**
   * مسح تاريخ المحادثة
   */
  function clearChatHistory() {
    try {
      const cache = CacheService.getScriptCache();
      cache.remove('chat_history');
      return { success: true, message: 'تم مسح تاريخ المحادثة' };
    } catch (error) {
      Utils.error('Failed to clear chat history', error);
      return { success: false, error: error.message };
    }
  }

  return {
    initializeEmbeddingService,
    processEnhancedMessage,
    updateChatEmbeddings,
    performSemanticSearch,
    getEmbeddingStats,
    clearEmbeddingCache,
    saveChatHistory,
    loadChatHistory,
    clearChatHistory,
    MODULE_VERSION
  };
});