defineModule('System.AI.EnhancedCore', ({ Utils, Config, AI }) => {
  const MODULE_VERSION = '1.0.0';

  function callEnhancedGemini(prompt, options = {}) {
    const hybridMode = Config.get('ENABLE_HYBRID_MODE');
    
    if (hybridMode) {
      try {
        return AI.HybridConnector.streamContent(prompt, options);
      } catch (e) {
        Utils.warn('Hybrid mode failed, falling back to GAS');
      }
    }
    
    return AI.GeminiAdapter.callGeminiApi({
      model: options.model || 'gemini-2.0-flash-exp',
      contents: [{ parts: [{ text: prompt }] }],
      thinkingConfig: options.thinkingConfig
    });
  }

  function processEnhancedMultimodal(imageBlob, textPrompt, options = {}) {
    const hybridMode = Config.get('ENABLE_HYBRID_MODE');
    
    if (hybridMode) {
      try {
        return AI.HybridConnector.processMultimodal(imageBlob, textPrompt, options);
      } catch (e) {
        Utils.warn('Hybrid multimodal failed, falling back to GAS');
      }
    }
    
    return AI.GeminiAdapter.processMultimodal(imageBlob, textPrompt, options);
  }

  return {
    callEnhancedGemini,
    processEnhancedMultimodal,
    MODULE_VERSION
  };
});