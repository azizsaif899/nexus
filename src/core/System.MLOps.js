defineModule('System.MLOps', ({ Utils, Config, Auth }) => {
  const MODULE_VERSION = '1.0.0';

  function trackModelPerformance(modelId, prompt, response, metrics = {}) {
    try {
      const performanceData = {
        modelId,
        timestamp: new Date().toISOString(),
        promptLength: prompt.length,
        responseLength: response.length,
        ...metrics
      };

      const sheet = Utils.getSheet('ModelPerformance', [
        'Timestamp', 'ModelId', 'PromptLength', 'ResponseLength', 'Latency', 'Quality'
      ]);

      if (sheet) {
        sheet.appendRow([
          new Date(),
          modelId,
          performanceData.promptLength,
          performanceData.responseLength,
          metrics.latency || 0,
          metrics.quality || 'unknown'
        ]);
      }

      return { type: 'success', text: 'Performance tracked' };
    } catch (e) {
      Utils.error('Failed to track model performance', e);
      return { type: 'error', text: e.message };
    }
  }

  function deployModel(modelConfig) {
    try {
      const endpoint = `${Config.getEndpoints().vertexAI}/endpoints`;
      const headers = Auth.getAuthHeaders();

      const response = UrlFetchApp.fetch(endpoint, {
        method: 'POST',
        headers: { ...headers, 'Content-Type': 'application/json' },
        payload: JSON.stringify(modelConfig)
      });

      return { type: 'success', text: 'Model deployed successfully' };
    } catch (e) {
      return { type: 'error', text: `Deployment failed: ${e.message}` };
    }
  }

  return {
    trackModelPerformance,
    deployModel,
    MODULE_VERSION
  };
});