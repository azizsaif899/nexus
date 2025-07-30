
defineModule('System.AI.Core', ({ Config, GeminiAdapter, Telemetry, Memory }) => {
  
  // Text Generation
  async function generateText(prompt, options = {}) {
    try {
      const response = await GeminiAdapter.callAPI(prompt, options);
      Memory.saveInteraction('text_generation', { prompt, response });
      return { success: true, text: response };
    } catch (error) {
      Telemetry.logError(error.message, 'AI.generateText');
      return { success: false, error: error.message };
    }
  }
  
  // Code Analysis
  async function analyzeCode(code, language = 'javascript') {
    const analysisPrompt = `
Analyze this ${language} code and provide:
1. Code quality assessment
2. Potential issues or bugs
3. Improvement suggestions
4. Security considerations

Code:
```${language}
${code}
```
`;
    
    try {
      const analysis = await GeminiAdapter.callAPI(analysisPrompt);
      Memory.saveInteraction('code_analysis', { code, language, analysis });
      return { success: true, analysis };
    } catch (error) {
      Telemetry.logError(error.message, 'AI.analyzeCode');
      return { success: false, error: error.message };
    }
  }
  
  // Question & Answer
  async function askQuestion(question, context = '') {
    const qaPrompt = context 
      ? `Context: ${context}\n\nQuestion: ${question}`
      : question;
    
    try {
      const answer = await GeminiAdapter.callAPI(qaPrompt);
      Memory.saveInteraction('qa', { question, context, answer });
      return { success: true, answer };
    } catch (error) {
      Telemetry.logError(error.message, 'AI.askQuestion');
      return { success: false, error: error.message };
    }
  }
  
  // Smart Assistant
  async function processRequest(request, userContext = {}) {
    const systemPrompt = `
You are G-Assistant, an AI-powered strategic assistant for Google Sheets.
You help with financial analysis, code review, and business operations.

User Context: ${JSON.stringify(userContext)}
Request: ${request}

Provide a helpful, accurate response.
`;
    
    try {
      const response = await GeminiAdapter.callAPI(systemPrompt);
      Memory.saveInteraction('assistant_request', { request, userContext, response });
      return { success: true, response };
    } catch (error) {
      Telemetry.logError(error.message, 'AI.processRequest');
      return { success: false, error: error.message };
    }
  }
  
  return {
    generateText,
    analyzeCode,
    askQuestion,
    processRequest,
    isReady: () => GeminiAdapter.isConfigured(),
    init: () => true
  };
});
