defineModule('System.AI.GeminiAdapter', ({ Utils, Config, DocsManager, AI, Telemetry }) => {
  const MODULE_VERSION = '3.0.0';
  
  // محاكاة Google Gen AI SDK في بيئة Google Apps Script
  function createGeminiClient() {
    const API_BASE_URL = 'https://generativelanguage.googleapis.com/v1beta';
    const API_KEY = Config.get('API_KEY');
    
    return {
      async generateContent({ model, contents, generationConfig = {}, thinkingConfig = null }) {
        const payload = {
          contents,
          generationConfig: {
            ...generationConfig,
            ...(thinkingConfig && { thinkingConfig })
          }
        };
        
        const endpoint = `${API_BASE_URL}/models/${model}:generateContent?key=${API_KEY}`;
        const response = UrlFetchApp.fetch(endpoint, {
          method: 'POST',
          contentType: 'application/json',
          payload: JSON.stringify(payload)
        });
        
        return JSON.parse(response.getContentText());
      },
      
      async generateContentStream({ model, contents, generationConfig = {} }) {
        const payload = { contents, generationConfig };
        const endpoint = `${API_BASE_URL}/models/${model}:streamGenerateContent?key=${API_KEY}`;
        
        // محاكاة streaming في GAS
        const response = UrlFetchApp.fetch(endpoint, {
          method: 'POST',
          contentType: 'application/json',
          payload: JSON.stringify(payload)
        });
        
        return this._simulateStream(JSON.parse(response.getContentText()));
      },
      
      _simulateStream(fullResponse) {
        const text = fullResponse.candidates?.[0]?.content?.parts?.[0]?.text || '';
        const words = text.split(' ');
        let index = 0;
        
        return {
          async *stream() {
            while (index < words.length) {
              yield {
                candidates: [{
                  content: {
                    parts: [{ text: words.slice(0, ++index).join(' ') }]
                  }
                }]
              };
              Utilities.sleep(50); // محاكاة التأخير
            }
          }
        };
      }
    };
  }

  const geminiClient = createGeminiClient();

  async function callGeminiApi({ 
    model = 'gemini-2.0-flash-exp', 
    contents, 
    streaming = false, 
    thinkingConfig = null,
    generationConfig = {}
  }) {
    try {
      if (streaming) {
        return await geminiClient.generateContentStream({
          model, contents, generationConfig
        });
      }
      
      return await geminiClient.generateContent({
        model, contents, generationConfig, thinkingConfig
      });
    } catch (e) {
      Utils.error('Gemini API call failed', e);
      throw e;
    }
  }

  function processMultimodal(imageBlob, textPrompt, options = {}) {
    const base64Image = Utilities.base64Encode(imageBlob.getBytes());
    const mimeType = imageBlob.getContentType();
    
    return callGeminiApi({
      model: options.model || 'gemini-2.0-flash-exp',
      contents: [{
        parts: [
          { text: textPrompt },
          { 
            inlineData: { 
              mimeType, 
              data: base64Image 
            }
          }
        ]
      }],
      streaming: options.streaming || false,
      thinkingConfig: options.thinkingConfig
    });
  }

  function enableThinking(budget = 8192) {
    return {
      thinkingBudget: budget,
      enableThinking: true
    };
  }

  // Cache Service للسياق الطويل
  function cachePrompt(key, content, ttl = 3600) {
    try {
      CacheService.getScriptCache().put(key, JSON.stringify(content), ttl);
      return true;
    } catch (e) {
      Utils.warn('Failed to cache prompt', e);
      return false;
    }
  }

  function getCachedPrompt(key) {
    try {
      const cached = CacheService.getScriptCache().get(key);
      return cached ? JSON.parse(cached) : null;
    } catch (e) {
      Utils.warn('Failed to retrieve cached prompt', e);
      return null;
    }
  }

  return {
    callGeminiApi,
    processMultimodal,
    enableThinking,
    cachePrompt,
    getCachedPrompt,
    MODULE_VERSION
  };
});