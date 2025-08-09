// 30_tools/october_api_gateway.js - API Gateway متكامل مع النظام الحالي
defineModule('Tools.OctoberGateway', ({ Utils, Config }) => {
  
  function handleUnifiedProcess(requestData) {
    const { type, data, metadata } = requestData;
    
    try {
      if (type === 'report') {
        return handleReportRequest(data);
      }
      
      if (type === 'analyze') {
        return handleAnalysisRequest(data, metadata);
      }
      
      if (type === 'financial') {
        const processor = Utils.Injector.get('System.Processors.Financial');
        return processor.processInvoice(data);
      }
      
      return { success: false, message: 'Unknown request type' };
      
    } catch (error) {
      Utils.log('Gateway Error', error);
      return { success: false, error: error.message };
    }
  }
  
  function handleReportRequest(data) {
    const sheets = Utils.Injector.get('Tools.Sheets');
    const result = sheets.read(data.range || 'A1:Z100');
    
    return {
      success: true,
      result: {
        data: result,
        summary: `تم جلب ${result.length} صف من البيانات`,
        timestamp: new Date().toISOString()
      }
    };
  }
  
  function handleAnalysisRequest(data, metadata) {
    const ai = Utils.Injector.get('AI.Core');
    const response = ai.query(data.prompt || data.message, {
      temperature: metadata?.temperature || 0.3,
      maxTokens: metadata?.maxTokens || 1000
    });
    
    return {
      success: true,
      result: {
        analysis: response.text,
        confidence: response.confidence || 0.9,
        timestamp: new Date().toISOString()
      }
    };
  }
  
  return {
    handleUnifiedProcess,
    handleReportRequest,
    handleAnalysisRequest
  };
});

// دالة عامة للاستخدام في doPost
function processOctoberRequest(requestData) {
  const gateway = GAssistant.Utils.Injector.get('Tools.OctoberGateway');
  return gateway.handleUnifiedProcess(requestData);
}