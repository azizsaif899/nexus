defineModule('System.AI.HybridConnector', ({ Utils, Config }) => {
  const MODULE_VERSION = '1.0.0';
  const NODE_SERVICE_URL = Config.get('NODE_SERVICE_URL') || 'http://localhost:3001';

  // اتصال بخدمة Node.js للميزات المتقدمة
  function callNodeService(endpoint, payload) {
    try {
      const response = UrlFetchApp.fetch(`${NODE_SERVICE_URL}/api/${endpoint}`, {
        method: 'POST',
        contentType: 'application/json',
        payload: JSON.stringify(payload),
        muteHttpExceptions: true
      });

      if (response.getResponseCode() === 200) {
        return JSON.parse(response.getContentText());
      } else {
        throw new Error(`Service error: ${response.getResponseCode()}`);
      }
    } catch (e) {
      Utils.warn('Node service unavailable, falling back to GAS implementation');
      return null;
    }
  }

  // Streaming مع fallback
  function streamContent(prompt, options = {}) {
    const nodeResult = callNodeService('stream', {
      prompt,
      model: options.model || 'gemini-2.0-flash-exp',
      thinkingBudget: options.thinkingBudget || 8192
    });

    if (nodeResult) {
      return { type: 'stream', data: nodeResult, source: 'node' };
    }

    // Fallback إلى GAS
    return AI.GeminiAdapter.callGeminiApi({
      model: options.model || 'gemini-2.0-flash-exp',
      contents: [{ parts: [{ text: prompt }] }]
    });
  }

  // Multimodal مع fallback
  function processMultimodal(imageBlob, textPrompt, options = {}) {
    const base64Image = Utilities.base64Encode(imageBlob.getBytes());
    
    const nodeResult = callNodeService('multimodal', {
      text: textPrompt,
      imageData: base64Image,
      mimeType: imageBlob.getContentType()
    });

    if (nodeResult) {
      return { type: 'success', text: nodeResult.text, source: 'node' };
    }

    // Fallback إلى GAS
    return AI.GeminiAdapter.processMultimodal(imageBlob, textPrompt, options);
  }

  // فحص توفر الخدمة
  function checkNodeService() {
    try {
      const response = UrlFetchApp.fetch(`${NODE_SERVICE_URL}/health`, {
        method: 'GET',
        muteHttpExceptions: true
      });
      return response.getResponseCode() === 200;
    } catch (e) {
      return false;
    }
  }

  return {
    streamContent,
    processMultimodal,
    checkNodeService,
    MODULE_VERSION
  };
});