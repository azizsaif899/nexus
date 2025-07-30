// تحديث المشروع إلى Google Gen AI SDK
const fs = require('fs');
const path = require('path');

// 1. تحديث package.json
const packagePath = 'package.json';
const pkg = JSON.parse(fs.readFileSync(packagePath, 'utf8'));

pkg.dependencies = pkg.dependencies || {};
pkg.dependencies['@google/generative-ai'] = '^0.21.0';

fs.writeFileSync(packagePath, JSON.stringify(pkg, null, 2));

// 2. إنشاء GeminiAdapter محدث
const newAdapter = `
defineModule('System.AI.GeminiAdapter', ({ Utils, Config }) => {
  const { GoogleGenerativeAI } = require('@google/generative-ai');
  const genAI = new GoogleGenerativeAI(Config.get('API_KEY'));

  async function callGeminiApi({ model, payload, streaming = false, thinkingConfig = null }) {
    const geminiModel = genAI.getGenerativeModel({ 
      model,
      generationConfig: {
        ...payload.generationConfig,
        ...(thinkingConfig && { thinkingConfig })
      }
    });

    if (streaming) {
      return await geminiModel.generateContentStream(payload.contents);
    }
    
    return await geminiModel.generateContent(payload.contents);
  }

  function processMultimodal(imageBlob, textPrompt) {
    const base64Image = Utilities.base64Encode(imageBlob.getBytes());
    return callGeminiApi({
      model: 'gemini-2.0-flash-exp',
      payload: {
        contents: [{
          parts: [
            { text: textPrompt },
            { inlineData: { mimeType: imageBlob.getContentType(), data: base64Image }}
          ]
        }]
      }
    });
  }

  return { callGeminiApi, processMultimodal };
});`;

fs.writeFileSync('20_ai/6_ai_geminiAdapter_v2.js', newAdapter);

console.log('✅ تم تحديث المشروع لدعم Google Gen AI SDK');