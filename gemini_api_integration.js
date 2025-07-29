
defineModule('System.AI.GeminiAdapter', ({ Config, Telemetry, MetricsLogger }) => {
  const API_ENDPOINT = 'https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-pro:generateContent';
  
  async function callGeminiAPI(prompt, options = {}) {
    const apiKey = Config.get('GEMINI_API_KEY');
    const maxRetries = Config.get('API_MAX_RETRIES') || 3;
    const retryDelay = Config.get('API_RETRY_DELAY_MS') || 1000;
    
    if (!apiKey) {
      throw new Error('GEMINI_API_KEY not configured');
    }
    
    const requestBody = {
      contents: [{ parts: [{ text: prompt }] }],
      generationConfig: {
        temperature: options.temperature || 0.7,
        maxOutputTokens: options.maxTokens || 2000
      }
    };
    
    for (let attempt = 1; attempt <= maxRetries; attempt++) {
      try {
        MetricsLogger.log('gemini_api_call_attempt', attempt);
        
        const response = await UrlFetchApp.fetch(`${API_ENDPOINT}?key=${apiKey}`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          payload: JSON.stringify(requestBody)
        });
        
        if (response.getResponseCode() === 200) {
          const data = JSON.parse(response.getContentText());
          MetricsLogger.log('gemini_api_success', 1);
          return data.candidates[0].content.parts[0].text;
        } else {
          throw new Error(`API Error: ${response.getResponseCode()}`);
        }
        
      } catch (error) {
        Telemetry.logError(error.message, 'GeminiAPI');
        
        if (attempt === maxRetries) {
          MetricsLogger.log('gemini_api_failure', 1);
          throw error;
        }
        
        // Wait before retry
        await new Promise(resolve => setTimeout(resolve, retryDelay * attempt));
      }
    }
  }
  
  return {
    callAPI: callGeminiAPI,
    isConfigured: () => !!Config.get('GEMINI_API_KEY'),
    init: () => true
  };
});
