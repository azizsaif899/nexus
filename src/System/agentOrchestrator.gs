/**
 * منسق الوكلاء المحسن
 * يستخدم toolExecutor و intentAnalyzer لتوجيه الطلبات بدقة
 */
defineModule('System.AI.Orchestrator.Enhanced', function(injector) {
  
  return {
    /**
     * معالجة الطلب الرئيسية
     */
    async processRequest(userInput, context = {}) {
      try {
        // 1. تحليل النية
        const intentAnalyzer = injector.get('System.IntentAnalyzer');
        const analysis = await intentAnalyzer.analyzeIntent(userInput, context);
        
        // 2. اختيار الوكيل
        const agent = this.getAgent(analysis.agent);
        
        // 3. معالجة الطلب
        const response = await agent.processRequest(userInput, {
          ...context,
          intentAnalysis: analysis
        });
        
        // 4. تنفيذ الأدوات إذا لزم الأمر
        if (response.toolCalls) {
          const toolExecutor = injector.get('System.ToolExecutor');
          const toolResults = await toolExecutor.executeToolCalls(response.toolCalls);
          response.toolResults = toolResults;
        }
        
        return {
          success: true,
          agent: analysis.agent,
          confidence: analysis.confidence,
          response: response,
          metadata: {
            processingTime: Date.now() - context.startTime,
            intentAnalysis: analysis
          }
        };
        
      } catch (error) {
        console.error('خطأ في معالجة الطلب:', error);
        return this.handleError(error, userInput);
      }
    },

    /**
     * الحصول على الوكيل المناسب
     */
    getAgent(agentName) {
      const agents = {
        'CFO': injector.get('System.AI.Agents.CFO'),
        'Developer': injector.get('System.AI.Agents.Developer'),
        'DatabaseManager': injector.get('System.AI.Agents.DatabaseManager'),
        'General': injector.get('System.AI.Agents.General')
      };
      
      return agents[agentName] || agents['General'];
    },

    /**
     * معالجة الأخطاء
     */
    handleError(error, userInput) {
      return {
        success: false,
        error: error.message,
        fallbackResponse: 'عذراً، حدث خطأ في معالجة طلبك. يرجى المحاولة مرة أخرى.',
        userInput: userInput
      };
    }
  };
});