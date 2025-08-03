defineModule('System.UI.Enhanced', ({ Utils, Config }) => {
  const MODULE_VERSION = '1.0.0';

  function showEnhancedSidebar() {
    try {
      const template = HtmlService.createTemplateFromFile('EnhancedSidebar');
      template.version = MODULE_VERSION;
      template.timestamp = new Date().getTime();

      const html = template.evaluate()
        .setTitle('G-Assistant AI')
        .setWidth(400);

      SpreadsheetApp.getUi().showSidebar(html);

      Utils.log('Enhanced sidebar displayed successfully');
      return { type: 'success', text: 'تم عرض الشريط الجانبي المحسن' };
    } catch (e) {
      Utils.error('Failed to show enhanced sidebar', e);
      return { type: 'error', text: `فشل في عرض الواجهة: ${e.message}` };
    }
  }

  function loadChatHistory() {
    try {
      // تحميل آخر 10 رسائل من السجل
      const historySheet = Utils.getSheet('ChatHistory', [
        'Timestamp', 'User', 'Message', 'Response', 'Agent'
      ]);

      if (!historySheet) {
        return { type: 'success', data: [] };
      }

      const data = historySheet.getDataRange().getValues();
      const history = data.slice(-10).map(row => ({
        timestamp: row[0],
        user: row[1],
        message: row[2],
        response: row[3],
        agent: row[4]
      }));

      return { type: 'success', data: history };
    } catch (e) {
      Utils.error('Failed to load chat history', e);
      return { type: 'error', data: [] };
    }
  }

  function saveChatMessage(user, message, response, agent = 'General') {
    try {
      const historySheet = Utils.getSheet('ChatHistory', [
        'Timestamp', 'User', 'Message', 'Response', 'Agent'
      ]);

      if (historySheet) {
        historySheet.appendRow([
          new Date(),
          user,
          message,
          response,
          agent
        ]);
      }

      return { type: 'success' };
    } catch (e) {
      Utils.error('Failed to save chat message', e);
      return { type: 'error' };
    }
  }

  function getAgentStatus() {
    try {
      const agents = [
        { name: 'CFO', status: 'active', description: 'المحلل المالي' },
        { name: 'Developer', status: 'active', description: 'المطور' },
        { name: 'DatabaseManager', status: 'active', description: 'مدير قاعدة البيانات' },
        { name: 'Admin', status: 'pending', description: 'المساعد الإداري' },
        { name: 'Operations', status: 'pending', description: 'مدير العمليات' }
      ];

      return { type: 'success', data: agents };
    } catch (e) {
      return { type: 'error', data: [] };
    }
  }

  return {
    showEnhancedSidebar,
    loadChatHistory,
    saveChatMessage,
    getAgentStatus,
    MODULE_VERSION
  };
});
