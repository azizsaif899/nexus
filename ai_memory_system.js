
defineModule('System.AI.Memory', ({ Config, Utils }) => {
  const MEMORY_SHEET = 'AI_Memory_Log';
  const CONVERSATION_SHEET = 'AI_Conversations';
  const MAX_MEMORY_ENTRIES = 1000;
  
  // Save interaction to memory
  function saveInteraction(type, data) {
    try {
      const sheet = Utils.getSheet(MEMORY_SHEET, [
        'Timestamp', 'Type', 'Input', 'Output', 'Context'
      ]);
      
      const timestamp = new Date();
      const input = JSON.stringify(data.prompt || data.question || data.request || '');
      const output = JSON.stringify(data.response || data.answer || data.analysis || '');
      const context = JSON.stringify(data.context || data.userContext || {});
      
      sheet.appendRow([timestamp, type, input, output, context]);
      
      // Clean old entries if needed
      cleanOldMemories(sheet);
      
      return true;
    } catch (error) {
      console.log(`Memory save error: ${error.message}`);
      return false;
    }
  }
  
  // Get conversation history
  function getConversationHistory(limit = 10) {
    try {
      const sheet = Utils.getSheet(CONVERSATION_SHEET, [
        'Timestamp', 'User', 'Assistant', 'Context'
      ]);
      
      const lastRow = sheet.getLastRow();
      if (lastRow <= 1) return [];
      
      const startRow = Math.max(2, lastRow - limit + 1);
      const range = sheet.getRange(startRow, 1, lastRow - startRow + 1, 4);
      const values = range.getValues();
      
      return values.map(row => ({
        timestamp: row[0],
        user: row[1],
        assistant: row[2],
        context: JSON.parse(row[3] || '{}')
      }));
    } catch (error) {
      console.log(`Memory retrieval error: ${error.message}`);
      return [];
    }
  }
  
  // Save conversation turn
  function saveConversation(userMessage, assistantResponse, context = {}) {
    try {
      const sheet = Utils.getSheet(CONVERSATION_SHEET, [
        'Timestamp', 'User', 'Assistant', 'Context'
      ]);
      
      sheet.appendRow([
        new Date(),
        userMessage,
        assistantResponse,
        JSON.stringify(context)
      ]);
      
      return true;
    } catch (error) {
      console.log(`Conversation save error: ${error.message}`);
      return false;
    }
  }
  
  // Get context for current conversation
  function getContext(sessionId = 'default') {
    const history = getConversationHistory(5);
    return {
      recentHistory: history,
      sessionId,
      timestamp: new Date()
    };
  }
  
  // Clean old memories to prevent sheet overflow
  function cleanOldMemories(sheet) {
    const lastRow = sheet.getLastRow();
    if (lastRow > MAX_MEMORY_ENTRIES) {
      const deleteCount = lastRow - MAX_MEMORY_ENTRIES;
      sheet.deleteRows(2, deleteCount);
    }
  }
  
  // Search memory for relevant context
  function searchMemory(query, limit = 5) {
    try {
      const sheet = Utils.getSheet(MEMORY_SHEET, []);
      const lastRow = sheet.getLastRow();
      if (lastRow <= 1) return [];
      
      const range = sheet.getRange(2, 1, lastRow - 1, 5);
      const values = range.getValues();
      
      // Simple text search (can be enhanced with better matching)
      const results = values
        .filter(row => {
          const input = row[2] || '';
          const output = row[3] || '';
          return input.toLowerCase().includes(query.toLowerCase()) ||
                 output.toLowerCase().includes(query.toLowerCase());
        })
        .slice(0, limit)
        .map(row => ({
          timestamp: row[0],
          type: row[1],
          input: row[2],
          output: row[3],
          context: JSON.parse(row[4] || '{}')
        }));
      
      return results;
    } catch (error) {
      console.log(`Memory search error: ${error.message}`);
      return [];
    }
  }
  
  return {
    saveInteraction,
    getConversationHistory,
    saveConversation,
    getContext,
    searchMemory,
    init: () => true
  };
});
