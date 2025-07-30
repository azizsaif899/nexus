// *************************************************************************************************
// --- نظام الذاكرة المحسن للمرحلة الثانية ---
// *************************************************************************************************

/**
 * @file ai_memory_system_enhanced.js
 * @version 1.0.0
 * @author عبدالعزيز
 * @description
 * تحسينات شاملة لنظام الذاكرة مع ميزات ذكية للضغط والتحليل والبحث
 */

// ===== 1. تحسين نظام الذاكرة قصيرة الأمد =====

/**
 * نظام ذاكرة محسن مع ضغط ذكي
 */
function createEnhancedMemorySystem() {
  return `
defineModule('System.AI.Memory.Enhanced', ({ Utils, Config, DocsManager, AI, Telemetry }) => {
  const MODULE_VERSION = '2.1.0';
  const USER_CACHE = CacheService.getUserCache();
  const SCRIPT_CACHE = CacheService.getScriptCache();
  const SESSION_KEY_PREFIX = 'g_assistant_session_enhanced_';
  const CACHE_DURATION_SESSION = Config.get('MEMORY_SESSION_TTL') || 3600;
  const MAX_HISTORY_MESSAGES = Config.get('MAX_HISTORY_MESSAGES') || 20;
  const MAX_HISTORY_TOKENS = Config.get('MAX_HISTORY_TOKENS') || 8000;

  // تسجيل الوثائق
  DocsManager.registerModuleDocs('System.AI.Memory.Enhanced', [
    {
      name: 'smartCompress',
      version: MODULE_VERSION,
      description: 'ضغط ذكي للذاكرة مع الاحتفاظ بالمعلومات المهمة',
      parameters: {
        type: 'OBJECT',
        properties: {
          history: { type: 'ARRAY', description: 'سجل المحادثة', required: true },
          maxTokens: { type: 'NUMBER', description: 'الحد الأقصى للتوكنز', optional: true }
        }
      }
    },
    {
      name: 'analyzeConversation',
      version: MODULE_VERSION,
      description: 'تحليل أنماط المحادثة واستخراج الرؤى',
      parameters: {
        type: 'OBJECT',
        properties: {
          sessionId: { type: 'STRING', description: 'معرف الجلسة', required: true }
        }
      }
    }
  ]);

  /**
   * تقدير عدد التوكنز بدقة أكبر
   */
  function _estimateTokensAccurate(messages) {
    if (!Array.isArray(messages)) return 0;
    
    return messages.reduce((total, msg) => {
      if (!msg || !msg.parts) return total;
      
      const messageTokens = msg.parts.reduce((partTotal, part) => {
        if (part.text) {
          // تقدير أكثر دقة للنص العربي والإنجليزي
          const arabicChars = (part.text.match(/[\\u0600-\\u06FF]/g) || []).length;
          const englishChars = part.text.length - arabicChars;
          
          // النص العربي يحتاج توكنز أكثر
          return partTotal + Math.ceil(arabicChars / 2) + Math.ceil(englishChars / 4);
        } else if (part.functionCall) {
          // استدعاءات الدوال تحتاج توكنز إضافية
          return partTotal + 50 + JSON.stringify(part.functionCall).length / 4;
        } else if (part.functionResponse) {
          return partTotal + 30 + JSON.stringify(part.functionResponse).length / 4;
        } else if (part.inlineData) {
          // الصور والملفات
          return partTotal + 100;
        }
        return partTotal;
      }, 0);
      
      return total + messageTokens + 10; // 10 توكنز إضافية للرسالة نفسها
    }, 0);
  }

  /**
   * تصنيف أهمية الرسائل
   */
  function _classifyMessageImportance(message) {
    if (!message || !message.parts) return 0;
    
    let importance = 1; // أهمية أساسية
    
    const messageText = message.parts
      .filter(part => part.text)
      .map(part => part.text)
      .join(' ')
      .toLowerCase();
    
    // كلمات مفتاحية تدل على الأهمية
    const highImportanceKeywords = [
      'مهم', 'هام', 'critical', 'important', 'urgent', 'عاجل',
      'تذكر', 'remember', 'save', 'احفظ', 'لا تنس', "don't forget",
      'قرار', 'decision', 'استراتيجية', 'strategy', 'خطة', 'plan'
    ];
    
    const mediumImportanceKeywords = [
      'ملاحظة', 'note', 'تنبيه', 'alert', 'تحديث', 'update',
      'معلومة', 'information', 'بيانات', 'data', 'تقرير', 'report'
    ];
    
    // فحص الكلمات المفتاحية
    for (const keyword of highImportanceKeywords) {
      if (messageText.includes(keyword)) {
        importance = Math.max(importance, 5);
      }
    }
    
    for (const keyword of mediumImportanceKeywords) {
      if (messageText.includes(keyword)) {
        importance = Math.max(importance, 3);
      }
    }
    
    // رسائل المستخدم أهم من رسائل النموذج عادة
    if (message.role === 'user') {
      importance += 1;
    }
    
    // استدعاءات الأدوات مهمة
    if (message.parts.some(part => part.functionCall || part.functionResponse)) {
      importance += 2;
    }
    
    // الرسائل الطويلة قد تكون أكثر أهمية
    const messageLength = JSON.stringify(message).length;
    if (messageLength > 500) {
      importance += 1;
    }
    
    return Math.min(importance, 10); // حد أقصى 10
  }

  /**
   * ضغط ذكي للذاكرة مع الاحتفاظ بالمعلومات المهمة
   */
  function smartCompress(history, maxTokens = MAX_HISTORY_TOKENS) {
    if (!Array.isArray(history) || history.length === 0) {
      return [];
    }
    
    const currentTokens = _estimateTokensAccurate(history);
    if (currentTokens <= maxTokens) {
      return history;
    }
    
    Utils.log(\`Memory.smartCompress: Compressing from \${currentTokens} to \${maxTokens} tokens\`);
    
    // تصنيف الرسائل حسب الأهمية
    const messagesWithImportance = history.map((msg, index) => ({
      message: msg,
      importance: _classifyMessageImportance(msg),
      index: index,
      tokens: _estimateTokensAccurate([msg]),
      isRecent: index >= history.length - 5 // آخر 5 رسائل
    }));
    
    // ترتيب حسب الأهمية والحداثة
    messagesWithImportance.sort((a, b) => {
      // الرسائل الحديثة لها أولوية
      if (a.isRecent && !b.isRecent) return -1;
      if (!a.isRecent && b.isRecent) return 1;
      
      // ثم حسب الأهمية
      if (a.importance !== b.importance) {
        return b.importance - a.importance;
      }
      
      // ثم حسب الترتيب الأصلي
      return b.index - a.index;
    });
    
    // اختيار الرسائل التي تناسب الحد الأقصى
    const selectedMessages = [];
    let totalTokens = 0;
    
    for (const item of messagesWithImportance) {
      if (totalTokens + item.tokens <= maxTokens) {
        selectedMessages.push(item);
        totalTokens += item.tokens;
      } else if (selectedMessages.length < 3) {
        // نضمن وجود 3 رسائل على الأقل حتى لو تجاوزت الحد
        selectedMessages.push(item);
        totalTokens += item.tokens;
      }
    }
    
    // إعادة ترتيب الرسائل حسب الترتيب الأصلي
    selectedMessages.sort((a, b) => a.index - b.index);
    
    const compressedHistory = selectedMessages.map(item => item.message);
    
    Utils.log(\`Memory.smartCompress: Kept \${compressedHistory.length}/\${history.length} messages, \${totalTokens} tokens\`);
    
    // تسجيل إحصائيات الضغط
    Telemetry.track('Memory.SmartCompression', {
      originalLength: history.length,
      compressedLength: compressedHistory.length,
      originalTokens: currentTokens,
      compressedTokens: totalTokens,
      compressionRatio: Math.round((1 - compressedHistory.length / history.length) * 100)
    });
    
    return compressedHistory;
  }

  /**
   * تحليل أنماط المحادثة واستخراج الرؤى
   */
  function analyzeConversation(sessionId) {
    const history = AI.Memory.getSessionHistory({ sessionId });
    
    if (!Array.isArray(history) || history.length === 0) {
      return {
        totalMessages: 0,
        analysis: 'لا توجد رسائل للتحليل'
      };
    }
    
    const analysis = {
      totalMessages: history.length,
      userMessages: 0,
      modelMessages: 0,
      toolCalls: 0,
      averageMessageLength: 0,
      totalTokens: _estimateTokensAccurate(history),
      topics: [],
      sentiment: 'neutral',
      conversationFlow: [],
      keyInsights: [],
      recommendations: []
    };
    
    let totalLength = 0;
    const wordFrequency = {};
    const conversationFlow = [];
    
    // تحليل كل رسالة
    history.forEach((msg, index) => {
      const messageLength = JSON.stringify(msg).length;
      totalLength += messageLength;
      
      // إحصائيات الأدوار
      if (msg.role === 'user') {
        analysis.userMessages++;
      } else if (msg.role === 'model') {
        analysis.modelMessages++;
      }
      
      // إحصائيات استدعاءات الأدوات
      if (msg.parts && msg.parts.some(part => part.functionCall)) {
        analysis.toolCalls++;
      }
      
      // تحليل النص
      const messageText = msg.parts
        ?.filter(part => part.text)
        ?.map(part => part.text)
        ?.join(' ') || '';
      
      if (messageText) {
        // استخراج الكلمات للمواضيع
        const words = messageText
          .toLowerCase()
          .replace(/[^\\u0600-\\u06FFa-zA-Z\\s]/g, '') // الاحتفاظ بالعربية والإنجليزية فقط
          .split(/\\s+/)
          .filter(word => word.length > 3);
        
        words.forEach(word => {
          wordFrequency[word] = (wordFrequency[word] || 0) + 1;
        });
        
        // تحليل تدفق المحادثة
        conversationFlow.push({
          index: index,
          role: msg.role,
          length: messageText.length,
          hasQuestion: messageText.includes('؟') || messageText.includes('?'),
          hasCommand: messageText.includes('قم ب') || messageText.includes('please') || messageText.includes('can you'),
          sentiment: _analyzeSentiment(messageText)
        });
      }
    });
    
    // حساب المتوسطات
    analysis.averageMessageLength = Math.round(totalLength / history.length);
    
    // استخراج أهم المواضيع
    analysis.topics = Object.entries(wordFrequency)
      .sort(([,a], [,b]) => b - a)
      .slice(0, 10)
      .map(([word, count]) => ({ word, count }));
    
    // تحليل المشاعر العام
    const sentiments = conversationFlow.map(flow => flow.sentiment);
    const avgSentiment = sentiments.reduce((sum, s) => sum + s, 0) / sentiments.length;
    analysis.sentiment = avgSentiment > 0.1 ? 'positive' : avgSentiment < -0.1 ? 'negative' : 'neutral';
    
    // استخراج الرؤى الرئيسية
    analysis.keyInsights = _extractKeyInsights(history, analysis);
    
    // توصيات للتحسين
    analysis.recommendations = _generateRecommendations(analysis);
    
    // حفظ التحليل في الذاكرة طويلة الأمد
    AI.LongTermMemory.save('ConversationAnalysis', {
      sessionId: sessionId,
      analysis: analysis,
      timestamp: new Date().toISOString()
    });
    
    return analysis;
  }

  /**
   * تحليل المشاعر البسيط
   */
  function _analyzeSentiment(text) {
    const positiveWords = [
      'جيد', 'ممتاز', 'رائع', 'شكرا', 'أحب', 'سعيد', 'مفيد',
      'good', 'great', 'excellent', 'thanks', 'love', 'happy', 'useful'
    ];
    
    const negativeWords = [
      'سيء', 'خطأ', 'مشكلة', 'صعب', 'لا أحب', 'محبط', 'فشل',
      'bad', 'error', 'problem', 'difficult', 'hate', 'frustrated', 'failed'
    ];
    
    const lowerText = text.toLowerCase();
    let score = 0;
    
    positiveWords.forEach(word => {
      if (lowerText.includes(word)) score += 1;
    });
    
    negativeWords.forEach(word => {
      if (lowerText.includes(word)) score -= 1;
    });
    
    return score / Math.max(text.split(' ').length / 10, 1); // تطبيع النتيجة
  }

  /**
   * استخراج الرؤى الرئيسية
   */
  function _extractKeyInsights(history, analysis) {
    const insights = [];
    
    // تحليل نسبة التفاعل
    const interactionRatio = analysis.userMessages / Math.max(analysis.modelMessages, 1);
    if (interactionRatio > 2) {
      insights.push('المستخدم نشط جداً في المحادثة');
    } else if (interactionRatio < 0.5) {
      insights.push('المستخدم يستمع أكثر مما يتحدث');
    }
    
    // تحليل استخدام الأدوات
    if (analysis.toolCalls > analysis.totalMessages * 0.3) {
      insights.push('استخدام مكثف للأدوات والوظائف');
    } else if (analysis.toolCalls === 0) {
      insights.push('لم يتم استخدام أي أدوات في هذه المحادثة');
    }
    
    // تحليل طول الرسائل
    if (analysis.averageMessageLength > 200) {
      insights.push('رسائل مفصلة وطويلة');
    } else if (analysis.averageMessageLength < 50) {
      insights.push('رسائل قصيرة ومباشرة');
    }
    
    // تحليل المواضيع
    const topTopics = analysis.topics.slice(0, 3).map(t => t.word);
    if (topTopics.length > 0) {
      insights.push(\`المواضيع الرئيسية: \${topTopics.join(', ')}\`);
    }
    
    return insights;
  }

  /**
   * توليد توصيات للتحسين
   */
  function _generateRecommendations(analysis) {
    const recommendations = [];
    
    // توصيات بناء على طول المحادثة
    if (analysis.totalMessages > 50) {
      recommendations.push('المحادثة طويلة - قد تحتاج إلى تلخيص أو تقسيم');
    }
    
    // توصيات بناء على استخدام الأدوات
    if (analysis.toolCalls === 0 && analysis.totalMessages > 10) {
      recommendations.push('يمكن الاستفادة من الأدوات المتاحة لتحسين الإنتاجية');
    }
    
    // توصيات بناء على المشاعر
    if (analysis.sentiment === 'negative') {
      recommendations.push('المحادثة تحتوي على مشاعر سلبية - قد تحتاج إلى مراجعة');
    } else if (analysis.sentiment === 'positive') {
      recommendations.push('محادثة إيجابية - استمر على هذا النهج');
    }
    
    // توصيات بناء على التوكنز
    if (analysis.totalTokens > MAX_HISTORY_TOKENS * 0.8) {
      recommendations.push('الذاكرة تقترب من الحد الأقصى - سيتم الضغط قريباً');
    }
    
    return recommendations;
  }

  /**
   * البحث في الذاكرة بناء على الكلمات المفتاحية
   */
  function searchMemory(sessionId, keywords, limit = 5) {
    const history = AI.Memory.getSessionHistory({ sessionId });
    
    if (!Array.isArray(keywords)) {
      keywords = [keywords];
    }
    
    const results = [];
    
    history.forEach((msg, index) => {
      const messageText = msg.parts
        ?.filter(part => part.text)
        ?.map(part => part.text)
        ?.join(' ')
        ?.toLowerCase() || '';
      
      let relevanceScore = 0;
      
      keywords.forEach(keyword => {
        const keywordLower = keyword.toLowerCase();
        const occurrences = (messageText.match(new RegExp(keywordLower, 'g')) || []).length;
        relevanceScore += occurrences;
      });
      
      if (relevanceScore > 0) {
        results.push({
          message: msg,
          index: index,
          relevanceScore: relevanceScore,
          preview: messageText.substring(0, 100) + '...'
        });
      }
    });
    
    return results
      .sort((a, b) => b.relevanceScore - a.relevanceScore)
      .slice(0, limit);
  }

  /**
   * إحصائيات الذاكرة
   */
  function getMemoryStats(sessionId) {
    const history = AI.Memory.getSessionHistory({ sessionId });
    const analysis = analyzeConversation(sessionId);
    
    return {
      sessionId: sessionId,
      messageCount: history.length,
      estimatedTokens: _estimateTokensAccurate(history),
      maxTokens: MAX_HISTORY_TOKENS,
      utilizationPercentage: Math.round((_estimateTokensAccurate(history) / MAX_HISTORY_TOKENS) * 100),
      lastActivity: history.length > 0 ? new Date().toISOString() : null,
      analysis: analysis,
      cacheStatus: USER_CACHE.get(SESSION_KEY_PREFIX + sessionId) ? 'active' : 'inactive'
    };
  }

  return {
    smartCompress,
    analyzeConversation,
    searchMemory,
    getMemoryStats,
    MODULE_VERSION
  };
});
`;
}

// ===== 2. تحسين نظام الذاكرة طويلة الأمد =====

/**
 * تحسين LongTermMemory مع فهرسة وبحث متقدم
 */
function createEnhancedLongTermMemory() {
  return `
defineModule('System.AI.LongTermMemory.Enhanced', ({ Utils, Config, DocsManager, Telemetry }) => {
  const MODULE_VERSION = '1.1.0';
  const LTM_SHEET = 'AI_LongTermMemory';
  const INDEX_SHEET = 'AI_LTM_Index';
  
  /**
   * إنشاء فهرس للبحث السريع
   */
  function createSearchIndex() {
    const ss = SpreadsheetApp.getActiveSpreadsheet();
    let indexSheet = ss.getSheetByName(INDEX_SHEET);
    
    if (!indexSheet) {
      indexSheet = ss.insertSheet(INDEX_SHEET);
      indexSheet.getRange(1, 1, 1, 5).setValues([
        ['Keyword', 'Category', 'RowNumber', 'Relevance', 'LastUpdated']
      ]);
    }
    
    const ltmSheet = ss.getSheetByName(LTM_SHEET);
    if (!ltmSheet) return;
    
    const data = ltmSheet.getDataRange().getValues();
    const headers = data[0];
    const categoryIndex = headers.indexOf('Category');
    const contentIndex = headers.indexOf('Content');
    
    // مسح الفهرس القديم
    if (indexSheet.getLastRow() > 1) {
      indexSheet.getRange(2, 1, indexSheet.getLastRow() - 1, 5).clearContent();
    }
    
    // بناء فهرس جديد
    const indexEntries = [];
    
    for (let i = 1; i < data.length; i++) {
      const row = data[i];
      const category = row[categoryIndex];
      const content = JSON.stringify(row[contentIndex]);
      
      // استخراج الكلمات المفتاحية
      const keywords = _extractKeywords(content);
      
      keywords.forEach(keyword => {
        indexEntries.push([
          keyword,
          category,
          i + 1, // رقم الصف (1-based)
          1, // درجة الصلة الأساسية
          new Date()
        ]);
      });
    }
    
    if (indexEntries.length > 0) {
      indexSheet.getRange(2, 1, indexEntries.length, 5).setValues(indexEntries);
    }
    
    Utils.log(\`LTM: Created search index with \${indexEntries.length} entries\`);
  }
  
  /**
   * استخراج الكلمات المفتاحية من النص
   */
  function _extractKeywords(text) {
    if (!text || typeof text !== 'string') return [];
    
    // تنظيف النص
    const cleanText = text
      .toLowerCase()
      .replace(/[^\\u0600-\\u06FFa-zA-Z\\s]/g, ' ')
      .replace(/\\s+/g, ' ')
      .trim();
    
    // تقسيم إلى كلمات
    const words = cleanText.split(' ').filter(word => word.length > 3);
    
    // إزالة الكلمات الشائعة
    const stopWords = [
      'the', 'and', 'or', 'but', 'in', 'on', 'at', 'to', 'for', 'of', 'with', 'by',
      'من', 'إلى', 'في', 'على', 'عن', 'مع', 'هذا', 'هذه', 'ذلك', 'تلك', 'التي', 'الذي'
    ];
    
    const keywords = words.filter(word => !stopWords.includes(word));
    
    // إرجاع الكلمات الفريدة
    return [...new Set(keywords)];
  }
  
  /**
   * بحث متقدم في الذاكرة طويلة الأمد
   */
  function advancedSearch(query, options = {}) {
    const {
      category = null,
      limit = 10,
      minRelevance = 0.1,
      sortBy = 'relevance' // 'relevance', 'date', 'category'
    } = options;
    
    const ss = SpreadsheetApp.getActiveSpreadsheet();
    const indexSheet = ss.getSheetByName(INDEX_SHEET);
    
    if (!indexSheet) {
      Utils.warn('LTM: Search index not found. Creating...');
      createSearchIndex();
      return [];
    }
    
    const indexData = indexSheet.getDataRange().getValues();
    const queryKeywords = _extractKeywords(query);
    
    if (queryKeywords.length === 0) return [];
    
    // البحث في الفهرس
    const matches = [];
    
    for (let i = 1; i < indexData.length; i++) {
      const [keyword, itemCategory, rowNumber, relevance] = indexData[i];
      
      // تصفية حسب الفئة إذا تم تحديدها
      if (category && itemCategory !== category) continue;
      
      // حساب درجة الصلة
      let score = 0;
      queryKeywords.forEach(qKeyword => {
        if (keyword.includes(qKeyword) || qKeyword.includes(keyword)) {
          score += keyword === qKeyword ? 1 : 0.5;
        }
      });
      
      if (score >= minRelevance) {
        matches.push({
          keyword,
          category: itemCategory,
          rowNumber,
          relevanceScore: score,
          baseRelevance: relevance
        });
      }
    }
    
    // تجميع النتائج حسب رقم الصف
    const groupedMatches = {};
    matches.forEach(match => {
      if (!groupedMatches[match.rowNumber]) {
        groupedMatches[match.rowNumber] = {
          rowNumber: match.rowNumber,
          category: match.category,
          totalScore: 0,
          matchedKeywords: []
        };
      }
      groupedMatches[match.rowNumber].totalScore += match.relevanceScore;
      groupedMatches[match.rowNumber].matchedKeywords.push(match.keyword);
    });
    
    // تحويل إلى مصفوفة وترتيب
    let results = Object.values(groupedMatches);
    
    if (sortBy === 'relevance') {
      results.sort((a, b) => b.totalScore - a.totalScore);
    } else if (sortBy === 'date') {
      // يحتاج إلى جلب تاريخ من الورقة الأصلية
      results.sort((a, b) => b.rowNumber - a.rowNumber); // الأحدث أولاً
    }
    
    // جلب البيانات الفعلية
    const ltmSheet = ss.getSheetByName(LTM_SHEET);
    if (!ltmSheet) return [];
    
    const finalResults = results.slice(0, limit).map(result => {
      try {
        const rowData = ltmSheet.getRange(result.rowNumber, 1, 1, ltmSheet.getLastColumn()).getValues()[0];
        const headers = ltmSheet.getRange(1, 1, 1, ltmSheet.getLastColumn()).getValues()[0];
        
        const item = {};
        headers.forEach((header, index) => {
          item[header] = rowData[index];
        });
        
        return {
          ...item,
          searchScore: result.totalScore,
          matchedKeywords: result.matchedKeywords
        };
      } catch (e) {
        Utils.warn(\`LTM: Error fetching row \${result.rowNumber}: \${e.message}\`);
        return null;
      }
    }).filter(item => item !== null);
    
    Utils.log(\`LTM: Advanced search for "\${query}" returned \${finalResults.length} results\`);
    
    return finalResults;
  }
  
  /**
   * تحليل محتوى الذاكرة طويلة الأمد
   */
  function analyzeContent() {
    const ss = SpreadsheetApp.getActiveSpreadsheet();
    const ltmSheet = ss.getSheetByName(LTM_SHEET);
    
    if (!ltmSheet || ltmSheet.getLastRow() <= 1) {
      return {
        totalEntries: 0,
        categories: {},
        analysis: 'لا توجد بيانات للتحليل'
      };
    }
    
    const data = ltmSheet.getDataRange().getValues();
    const headers = data[0];
    const categoryIndex = headers.indexOf('Category');
    const timestampIndex = headers.indexOf('Timestamp');
    
    const analysis = {
      totalEntries: data.length - 1,
      categories: {},
      timeDistribution: {},
      insights: []
    };
    
    // تحليل الفئات والتوزيع الزمني
    for (let i = 1; i < data.length; i++) {
      const row = data[i];
      const category = row[categoryIndex] || 'Unknown';
      const timestamp = row[timestampIndex];
      
      // إحصائيات الفئات
      analysis.categories[category] = (analysis.categories[category] || 0) + 1;
      
      // التوزيع الزمني
      if (timestamp) {
        const date = new Date(timestamp);
        const monthKey = \`\${date.getFullYear()}-\${String(date.getMonth() + 1).padStart(2, '0')}\`;
        analysis.timeDistribution[monthKey] = (analysis.timeDistribution[monthKey] || 0) + 1;
      }
    }
    
    // استخراج الرؤى
    const topCategory = Object.entries(analysis.categories)
      .sort(([,a], [,b]) => b - a)[0];
    
    if (topCategory) {
      analysis.insights.push(\`الفئة الأكثر استخداماً: \${topCategory[0]} (\${topCategory[1]} إدخال)\`);
    }
    
    const recentEntries = Object.entries(analysis.timeDistribution)
      .sort(([a], [b]) => b.localeCompare(a))
      .slice(0, 3);
    
    if (recentEntries.length > 0) {
      analysis.insights.push(\`النشاط الأخير: \${recentEntries.map(([month, count]) => \`\${month} (\${count})\`).join(', ')}\`);
    }
    
    return analysis;
  }
  
  return {
    createSearchIndex,
    advancedSearch,
    analyzeContent,
    MODULE_VERSION
  };
});
`;
}

// ===== 3. اختبارات نظام الذاكرة =====

/**
 * اختبارات شاملة لنظام الذاكرة
 */
function createMemoryTests() {
  console.log('🧪 إنشاء اختبارات نظام الذاكرة...');
  
  const tests = {
    // اختبار الذاكرة قصيرة الأمد
    shortTermMemory: function() {
      console.log('💭 اختبار الذاكرة قصيرة الأمد...');
      
      try {
        const sessionId = 'test_memory_' + Date.now();
        
        // إضافة رسائل تجريبية
        const testMessages = [
          { role: 'user', parts: [{ text: 'مرحبا، كيف حالك؟' }] },
          { role: 'model', parts: [{ text: 'مرحبا! أنا بخير، شكراً لك. كيف يمكنني مساعدتك؟' }] },
          { role: 'user', parts: [{ text: 'أريد معلومات مهمة عن المشروع' }] },
          { role: 'model', parts: [{ text: 'بالطبع! يمكنني مساعدتك في ذلك.' }] }
        ];
        
        // إضافة الرسائل
        if (typeof GAssistant !== 'undefined' && GAssistant.AI && GAssistant.AI.Memory) {
          testMessages.forEach(msg => {
            GAssistant.AI.Memory.addMessageToHistory({ sessionId, message: msg });
          });
          
          // استرجاع التاريخ
          const history = GAssistant.AI.Memory.getSessionHistory({ sessionId });
          
          if (history.length === testMessages.length) {
            console.log('✅ الذاكرة قصيرة الأمد تعمل');
            
            // تنظيف
            GAssistant.AI.Memory.clearSessionContext({ sessionId });
            return true;
          } else {
            console.error(`❌ عدد الرسائل غير متطابق: متوقع ${testMessages.length}, فعلي ${history.length}`);
            return false;
          }
        } else {
          console.error('❌ AI.Memory غير متاح');
          return false;
        }
        
      } catch (error) {
        console.error('❌ خطأ في اختبار الذاكرة قصيرة الأمد:', error.message);
        return false;
      }
    },
    
    // اختبار ضغط الذاكرة
    memoryCompression: function() {
      console.log('🗜️ اختبار ضغط الذاكرة...');
      
      try {
        // إنشاء رسائل كثيرة للاختبار
        const longHistory = [];
        for (let i = 0; i < 30; i++) {
          longHistory.push({
            role: i % 2 === 0 ? 'user' : 'model',
            parts: [{ text: `رسالة رقم ${i + 1} - هذا نص طويل نسبياً لاختبار ضغط الذاكرة` }]
          });
        }
        
        // محاكاة ضغط الذاكرة
        const maxTokens = 1000; // حد منخفض للاختبار
        
        // تقدير التوكنز الأولي
        const initialTokens = longHistory.reduce((acc, msg) => 
          acc + JSON.stringify(msg).length / 4, 0);
        
        console.log(`📊 التوكنز الأولية: ${Math.round(initialTokens)}`);
        
        if (initialTokens > maxTokens) {
          // محاكاة الضغط البسيط
          const compressed = longHistory.slice(-10); // الاحتفاظ بآخر 10 رسائل
          const compressedTokens = compressed.reduce((acc, msg) => 
            acc + JSON.stringify(msg).length / 4, 0);
          
          console.log(`📊 التوكنز بعد الضغط: ${Math.round(compressedTokens)}`);
          
          if (compressedTokens < initialTokens) {
            console.log('✅ ضغط الذاكرة يعمل');
            return true;
          } else {
            console.error('❌ فشل في ضغط الذاكرة');
            return false;
          }
        } else {
          console.log('ℹ️ الذاكرة لا تحتاج ضغط');
          return true;
        }
        
      } catch (error) {
        console.error('❌ خطأ في اختبار ضغط الذاكرة:', error.message);
        return false;
      }
    },
    
    // اختبار الذاكرة طويلة الأمد
    longTermMemory: function() {
      console.log('🏛️ اختبار الذاكرة طويلة الأمد...');
      
      try {
        if (typeof GAssistant !== 'undefined' && GAssistant.AI && GAssistant.AI.LongTermMemory) {
          // حفظ بيانات تجريبية
          const testData = {
            testId: 'memory_test_' + Date.now(),
            content: 'هذا اختبار للذاكرة طويلة الأمد',
            importance: 'high',
            timestamp: new Date().toISOString()
          };
          
          GAssistant.AI.LongTermMemory.save('MemoryTest', testData);
          console.log('✅ تم حفظ البيانات في الذاكرة طويلة الأمد');
          
          // محاولة استرجاع البيانات
          const retrieved = GAssistant.AI.LongTermMemory.load(5);
          
          if (Array.isArray(retrieved) && retrieved.length > 0) {
            console.log(`✅ تم استرجاع ${retrieved.length} عنصر من الذاكرة طويلة الأمد`);
            return true;
          } else {
            console.error('❌ فشل في استرجاع البيانات');
            return false;
          }
        } else {
          console.error('❌ AI.LongTermMemory غير متاح');
          return false;
        }
        
      } catch (error) {
        console.error('❌ خطأ في اختبار الذاكرة طويلة الأمد:', error.message);
        return false;
      }
    },
    
    // اختبار الكاش
    cacheSystem: function() {
      console.log('💾 اختبار نظام الكاش...');
      
      try {
        const userCache = CacheService.getUserCache();
        const scriptCache = CacheService.getScriptCache();
        
        // اختبار User Cache
        const testKey = 'test_cache_' + Date.now();
        const testValue = { message: 'اختبار الكاش', timestamp: new Date().toISOString() };
        
        userCache.put(testKey, JSON.stringify(testValue), 300); // 5 دقائق
        
        const retrieved = userCache.get(testKey);
        if (retrieved) {
          const parsedValue = JSON.parse(retrieved);
          if (parsedValue.message === testValue.message) {
            console.log('✅ User Cache يعمل');
            
            // تنظيف
            userCache.remove(testKey);
            
            // اختبار Script Cache
            scriptCache.put(testKey + '_script', JSON.stringify(testValue), 300);
            const scriptRetrieved = scriptCache.get(testKey + '_script');
            
            if (scriptRetrieved) {
              console.log('✅ Script Cache يعمل');
              scriptCache.remove(testKey + '_script');
              return true;
            } else {
              console.error('❌ Script Cache لا يعمل');
              return false;
            }
          } else {
            console.error('❌ البيانات المسترجعة لا تطابق المحفوظة');
            return false;
          }
        } else {
          console.error('❌ فشل في استرجاع البيانات من الكاش');
          return false;
        }
        
      } catch (error) {
        console.error('❌ خطأ في اختبار نظام الكاش:', error.message);
        return false;
      }
    }
  };
  
  return tests;
}

// ===== 4. تشغيل اختبارات الذاكرة =====

/**
 * تشغيل جميع اختبارات الذاكرة
 */
function runMemoryTests() {
  console.log('🧠 تشغيل اختبارات نظام الذاكرة...');
  console.log('=' .repeat(50));
  
  const tests = createMemoryTests();
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
  console.log('📊 تقرير اختبارات الذاكرة:');
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
    createEnhancedMemorySystem,
    createEnhancedLongTermMemory,
    createMemoryTests,
    runMemoryTests
  };
}

// دوال للاستخدام المباشر في Google Apps Script
function testMemorySystem() {
  return runMemoryTests();
}

function setupEnhancedMemory() {
  console.log('🧠 إعداد نظام الذاكرة المحسن...');
  
  console.log('📝 Enhanced Memory System:');
  console.log(createEnhancedMemorySystem());
  
  console.log('\n📝 Enhanced Long Term Memory:');
  console.log(createEnhancedLongTermMemory());
  
  return true;
}

// *************************************************************************************************
// --- نهاية نظام الذاكرة المحسن ---
// *************************************************************************************************