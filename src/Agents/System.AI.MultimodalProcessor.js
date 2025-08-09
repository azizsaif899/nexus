defineModule('System.AI.MultimodalProcessor', ({ Utils, Config, AI }) => {
  const MODULE_VERSION = '1.0.0';

  function processImageWithText(imageBlob, textPrompt) {
    try {
      const base64Image = Utilities.base64Encode(imageBlob.getBytes());
      const mimeType = imageBlob.getContentType();

      const request = {
        contents: [{
          parts: [
            { text: textPrompt },
            {
              inline_data: {
                mime_type: mimeType,
                data: base64Image
              }
            }
          ]
        }]
      };

      return AI.Core.callGeminiAPI(request, 'gemini-2.0-flash-exp');
    } catch (e) {
      Utils.error('Multimodal processing failed', e);
      return { type: 'error', text: `فشل في معالجة الصورة: ${e.message}` };
    }
  }

  function analyzeSpreadsheetImage(imageBlob) {
    const prompt = `حلل هذه الصورة لجدول البيانات واستخرج:
1. البيانات الرقمية
2. الاتجاهات المرئية
3. الملاحظات المهمة
4. اقتراحات للتحسين`;

    return processImageWithText(imageBlob, prompt);
  }

  function extractTableFromImage(imageBlob) {
    const prompt = 'استخرج البيانات من هذا الجدول في الصورة وأرجعها بتنسيق CSV:';
    return processImageWithText(imageBlob, prompt);
  }

  return {
    processImageWithText,
    analyzeSpreadsheetImage,
    extractTableFromImage,
    MODULE_VERSION
  };
});
