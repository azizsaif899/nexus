defineModule('System.AI.ModelManager', ({ Utils, Config }) => {
  const MODULE_VERSION = '1.0.0';

  const MODELS = {
    // Gemini Models (Updated)
    'gemini-2.0-flash-exp': {
      name: 'Gemini 2.0 Flash',
      maxTokens: 1000000,
      multimodal: true,
      cost: 'low',
      speed: 'fast'
    },
    'gemini-1.5-pro-latest': {
      name: 'Gemini 1.5 Pro',
      maxTokens: 5000000,
      multimodal: true,
      cost: 'medium',
      speed: 'medium'
    },
    'gemini-1.5-flash-8b-latest': {
      name: 'Gemini 1.5 Flash 8B',
      maxTokens: 1000000,
      multimodal: true,
      cost: 'very-low',
      speed: 'very-fast'
    }
  };

  function getOptimalModel(task, priority = 'balanced') {
    const taskModels = {
      'code': 'gemini-1.5-pro-latest',
      'analysis': 'gemini-2.0-flash-exp',
      'chat': 'gemini-1.5-flash-8b-latest',
      'multimodal': 'gemini-2.0-flash-exp'
    };

    const priorityModels = {
      'speed': 'gemini-1.5-flash-8b-latest',
      'quality': 'gemini-1.5-pro-latest',
      'cost': 'gemini-1.5-flash-8b-latest',
      'balanced': 'gemini-2.0-flash-exp'
    };

    return taskModels[task] || priorityModels[priority] || 'gemini-2.0-flash-exp';
  }

  function getModelConfig(modelId) {
    return MODELS[modelId] || MODELS['gemini-2.0-flash-exp'];
  }

  function buildRequest(prompt, modelId, options = {}) {
    const model = getModelConfig(modelId);

    return {
      model: modelId,
      generationConfig: {
        temperature: options.temperature || 0.3,
        maxOutputTokens: Math.min(options.maxTokens || 2000, model.maxTokens),
        topP: options.topP || 0.8,
        topK: options.topK || 40
      },
      contents: [{
        parts: [{ text: prompt }]
      }]
    };
  }

  return {
    MODELS,
    getOptimalModel,
    getModelConfig,
    buildRequest,
    MODULE_VERSION
  };
});
