defineModule('System.UI.MessageProcessor', ({ Utils, Config, AI }) => {
  const MODULE_VERSION = '1.0.0';

  function processUserMessage(message, selectedAgent = 'auto') {
    const start = Date.now();
    
    try {
      Utils.log(`Processing message: "${message}" with agent: ${selectedAgent}`);

      // تحديد الوكيل المناسب
      const agent = _determineAgent(message, selectedAgent);
      
      // معالجة الرسالة
      const response = _routeToAgent(agent, message);
      
      // تسجيل الإحصائيات
      _logInteraction(message, response, agent, Date.now() - start);
      
      return response;
    } catch (e) {
      Utils.error('Message processing failed', e);
      return {
        type: 'error',
        text: `فشل في معالجة الرسالة: ${e.message}`,
        data: { error: e.message }
      };
    }
  }

  function _determineAgent(message, selectedAgent) {
    if (selectedAgent !== 'auto') {
      return selectedAgent;
    }

    // كشف النية من الرسالة
    const keywords = {
      'CFO': ['مالي', 'ربح', 'خسارة', 'تقرير', 'ميزانية', 'فاتورة'],
      'Developer': ['كود', 'برمجة', 'دالة', 'سكريبت', 'مراجعة', 'اختبار'],
      'DatabaseManager': ['جدول', 'بيانات', 'عمود', 'صف', 'استيراد', 'تصدير']
    };

    for (const [agent, words] of Object.entries(keywords)) {
      if (words.some(word => message.includes(word))) {
        return agent;
      }
    }

    return 'CFO'; // الافتراضي
  }

  function _routeToAgent(agent, message) {
    const sessionId = `session_${Date.now()}`;
    const intent = { type: 'general_query', data: {} };

    try {
      switch (agent) {
        case 'CFO':
          if (GAssistant?.AI?.Agents?.CFO?.handleRequest) {
            return GAssistant.AI.Agents.CFO.handleRequest({
              sessionId,
              message,
              intent
            });
          }
          break;

        case 'Developer':
          if (GAssistant?.AI?.Agents?.Developer?.handleRequest) {
            return GAssistant.AI.Agents.Developer.handleRequest({
              sessionId,
              message,
              intent
            });
          }
          break;

        case 'DatabaseManager':
          if (GAssistant?.AI?.Agents?.DatabaseManager?.handleRequest) {
            return GAssistant.AI.Agents.DatabaseManager.handleRequest({
              sessionId,
              message,
              intent
            });
          }
          break;

        default:
          // استخدام AI العام
          if (AI?.Core?.ask) {
            return AI.Core.ask(message, {
              sessionId,
              generationConfig: { temperature: 0.3, maxOutputTokens: 2000 }
            });
          }
      }

      return {
        type: 'error',
        text: `الوكيل ${agent} غير متوفر حالياً`
      };
    } catch (e) {
      return {
        type: 'error',
        text: `خطأ في توجيه الرسالة: ${e.message}`
      };
    }
  }

  function _logInteraction(message, response, agent, duration) {
    try {
      const logSheet = Utils.getSheet('UIInteractions', [
        'Timestamp', 'Message', 'Agent', 'ResponseType', 'Duration', 'Success'
      ]);

      if (logSheet) {
        logSheet.appendRow([
          new Date(),
          message.substring(0, 100), // أول 100 حرف
          agent,
          response.type,
          duration,
          response.type === 'success' || response.type === 'info'
        ]);
      }
    } catch (e) {
      Utils.error('Failed to log UI interaction', e);
    }
  }

  function loadMoreChatHistory(offset = 0) {
    try {
      const historySheet = Utils.getSheet('ChatHistory', [
        'Timestamp', 'User', 'Message', 'Response', 'Agent'
      ]);
      
      if (!historySheet) {
        return { type: 'success', data: [] };
      }

      const data = historySheet.getDataRange().getValues();
      const startIndex = Math.max(0, data.length - offset - 20);
      const endIndex = data.length - offset;
      
      const history = data.slice(startIndex, endIndex).map(row => ({
        timestamp: row[0],
        user: row[1],
        message: row[2],
        response: row[3],
        agent: row[4]
      }));

      return { type: 'success', data: history };
    } catch (e) {
      Utils.error('Failed to load more chat history', e);
      return { type: 'error', data: [] };
    }
  }

  return {
    processUserMessage,
    loadMoreChatHistory,
    MODULE_VERSION
  };
});