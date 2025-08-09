/**
 * @file AI/GeminiAdapter.js
 * @description محول Gemini API مع دعم الأدوات والتفكير
 * @version 2.0.0
 */

defineModule('System.AI.GeminiAdapter', ({ Utils, Config }) => {
  const MODULE_VERSION = '2.0.0';
  const BASE_URL = 'https://generativelanguage.googleapis.com/v1beta/models';

  let apiKey = null;
  let isInitialized = false;

  function initialize() {
    try {
      apiKey = Config.get('GEMINI_API_KEY');
      if (!apiKey) {
        throw new Error('مفتاح Gemini API مفقود');
      }

      isInitialized = true;
      Utils.log('✅ تم تهيئة محول Gemini بنجاح');
      return true;

    } catch (error) {
      Utils.error('❌ فشل في تهيئة محول Gemini:', error.message);
      return false;
    }
  }

  async function generateContent(request) {
    try {
      if (!isInitialized) {
        throw new Error('المحول غير مهيأ');
      }

      const model = request.model || Config.get('GEMINI_PRO_MODEL') || 'gemini-1.5-pro-latest';
      const url = `${BASE_URL}/${model}:generateContent`;

      // بناء payload الطلب
      const payload = buildRequestPayload(request);

      // إعداد خيارات الطلب
      const options = {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'x-goog-api-key': apiKey
        },
        payload: JSON.stringify(payload)
      };

      Utils.log(`🚀 إرسال طلب إلى Gemini: ${model}`);

      // إرسال الطلب
      const response = UrlFetchApp.fetch(url, options);
      const responseData = JSON.parse(response.getContentText());

      // معالجة الرد
      if (response.getResponseCode() !== 200) {
        throw new Error(`Gemini API Error: ${responseData.error?.message || 'Unknown error'}`);
      }

      return processResponse(responseData, request);

    } catch (error) {
      Utils.error('فشل في استدعاء Gemini:', error.message);
      throw error;
    }
  }

  function buildRequestPayload(request) {
    const payload = {
      contents: buildContents(request.messages || [{ role: 'user', content: request.prompt }]),
      generationConfig: request.generationConfig || Config.get('GENERATION_CONFIG') || {
        temperature: 0.7,
        maxOutputTokens: 2000
      },
      safetySettings: request.safetySettings || Config.get('SAFETY_SETTINGS') || []
    };

    // إضافة تكوين الأدوات إذا كانت متاحة
    if (request.tools && request.tools.length > 0) {
      payload.tools = request.tools.map(tool => ({
        functionDeclarations: [tool]
      }));

      payload.toolConfig = request.toolConfig || Config.get('TOOL_CONFIG') || {
        functionCallingConfig: { mode: 'AUTO' }
      };
    }

    // إضافة تكوين التفكير
    if (request.thinkingConfig) {
      payload.thinkingConfig = {
        enableThinking: request.thinkingConfig.enableThinking !== false,
        maxThinkingSteps: request.thinkingConfig.maxThinkingSteps || 10
      };
    }

    // إضافة تعليمات النظام
    if (request.systemInstruction) {
      payload.systemInstruction = {
        parts: [{ text: request.systemInstruction }]
      };
    }

    return payload;
  }

  function buildContents(messages) {
    return messages.map(message => {
      const content = {
        role: message.role === 'assistant' ? 'model' : 'user',
        parts: []
      };

      if (typeof message.content === 'string') {
        content.parts.push({ text: message.content });
      } else if (Array.isArray(message.content)) {
        content.parts = message.content.map(part => {
          if (part.type === 'text') {
            return { text: part.text };
          } else if (part.type === 'image') {
            return {
              inlineData: {
                mimeType: part.mimeType || 'image/jpeg',
                data: part.data
              }
            };
          }
          return part;
        });
      }

      return content;
    });
  }

  function processResponse(responseData, originalRequest) {
    try {
      const candidate = responseData.candidates?.[0];
      if (!candidate) {
        throw new Error('لا توجد استجابة من النموذج');
      }

      // التحقق من حالة الاستجابة
      if (candidate.finishReason === 'SAFETY') {
        return {
          type: 'error',
          content: 'تم حجب الاستجابة لأسباب أمنية',
          finishReason: candidate.finishReason
        };
      }

      const content = candidate.content;
      if (!content || !content.parts || content.parts.length === 0) {
        throw new Error('استجابة فارغة من النموذج');
      }

      // معالجة استدعاءات الأدوات
      const functionCalls = content.parts.filter(part => part.functionCall);
      if (functionCalls.length > 0) {
        return {
          type: 'function_call',
          functionCalls: functionCalls.map(call => ({
            name: call.functionCall.name,
            args: call.functionCall.args || {}
          })),
          thinking: extractThinking(candidate),
          finishReason: candidate.finishReason
        };
      }

      // معالجة النص العادي
      const textParts = content.parts.filter(part => part.text);
      const text = textParts.map(part => part.text).join('\n');

      return {
        type: 'text',
        content: text,
        thinking: extractThinking(candidate),
        finishReason: candidate.finishReason,
        usageMetadata: responseData.usageMetadata
      };

    } catch (error) {
      Utils.error('فشل في معالجة استجابة Gemini:', error.message);
      throw error;
    }
  }

  function extractThinking(candidate) {
    // استخراج محتوى التفكير إذا كان متاحاً
    const thinkingParts = candidate.content?.parts?.filter(part => part.thinking);
    if (thinkingParts && thinkingParts.length > 0) {
      return thinkingParts.map(part => part.thinking).join('\n');
    }
    return null;
  }

  async function generateEmbedding(text) {
    try {
      if (!isInitialized) {
        throw new Error('المحول غير مهيأ');
      }

      const url = `${BASE_URL}/text-embedding-004:embedContent`;

      const payload = {
        model: 'models/text-embedding-004',
        content: {
          parts: [{ text: text }]
        }
      };

      const options = {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'x-goog-api-key': apiKey
        },
        payload: JSON.stringify(payload)
      };

      const response = UrlFetchApp.fetch(url, options);
      const responseData = JSON.parse(response.getContentText());

      if (response.getResponseCode() !== 200) {
        throw new Error(`Embedding API Error: ${responseData.error?.message || 'Unknown error'}`);
      }

      return responseData.embedding.values;

    } catch (error) {
      Utils.error('فشل في إنشاء التضمين:', error.message);
      throw error;
    }
  }

  async function streamContent(request, onChunk) {
    try {
      // ملاحظة: Google Apps Script لا يدعم streaming مباشرة
      // هذه دالة محاكاة للتوافق مع واجهات أخرى
      const response = await generateContent(request);

      if (onChunk && typeof onChunk === 'function') {
        // محاكاة streaming بتقسيم النص
        const text = response.content || '';
        const chunks = text.match(/.{1,50}/g) || [text];

        for (const chunk of chunks) {
          onChunk({ content: chunk, done: false });
          Utilities.sleep(100); // تأخير قصير لمحاكاة streaming
        }

        onChunk({ content: '', done: true });
      }

      return response;

    } catch (error) {
      Utils.error('فشل في streaming المحتوى:', error.message);
      throw error;
    }
  }

  function validateRequest(request) {
    if (!request) {
      throw new Error('طلب فارغ');
    }

    if (!request.prompt && (!request.messages || request.messages.length === 0)) {
      throw new Error('لا يوجد محتوى للإرسال');
    }

    // التحقق من طول النص
    const maxLength = Config.get('MAX_MODEL_CONTEXT_TOKENS') || 10000;
    const textLength = request.prompt?.length ||
      request.messages?.reduce((sum, msg) => sum + (msg.content?.length || 0), 0) || 0;

    if (textLength > maxLength) {
      throw new Error(`النص طويل جداً: ${textLength} > ${maxLength}`);
    }

    return true;
  }

  function getModelInfo(modelName) {
    const models = {
      'gemini-1.5-pro-latest': {
        contextWindow: 2000000,
        outputTokens: 8192,
        supportsFunctions: true,
        supportsVision: true
      },
      'gemini-1.5-flash-latest': {
        contextWindow: 1000000,
        outputTokens: 8192,
        supportsFunctions: true,
        supportsVision: true
      },
      'gemini-pro': {
        contextWindow: 30720,
        outputTokens: 2048,
        supportsFunctions: true,
        supportsVision: false
      }
    };

    return models[modelName] || models['gemini-1.5-pro-latest'];
  }

  function getStatus() {
    return {
      initialized: isInitialized,
      hasApiKey: !!apiKey,
      version: MODULE_VERSION,
      baseUrl: BASE_URL
    };
  }

  // تهيئة تلقائية
  if (!isInitialized) {
    initialize();
  }

  return {
    initialize,
    generateContent,
    generateEmbedding,
    streamContent,
    validateRequest,
    getModelInfo,
    getStatus,
    isInitialized: () => isInitialized,
    MODULE_VERSION
  };
});
