// دوال الخادم للواجهة المحسنة
function checkHybridService() {
  try {
    return GAssistant.AI.HybridConnector.checkNodeService();
  } catch (e) {
    return false;
  }
}

function callEnhancedAI(prompt, options = {}) {
  try {
    return GAssistant.AI.EnhancedCore.callEnhancedGemini(prompt, options);
  } catch (e) {
    return { type: 'error', text: `خطأ: ${e.message}` };
  }
}

function testHybridConnection() {
  const nodeServiceUrl = GAssistant.Config.get('NODE_SERVICE_URL');

  try {
    const response = UrlFetchApp.fetch(`${nodeServiceUrl}/health`, {
      method: 'GET',
      muteHttpExceptions: true
    });

    if (response.getResponseCode() === 200) {
      return {
        type: 'success',
        text: `✅ الاتصال بالخدمة الخارجية نجح!\nالعنوان: ${nodeServiceUrl}\nالحالة: ${response.getContentText()}`
      };
    } else {
      return {
        type: 'error',
        text: `❌ فشل الاتصال - كود الخطأ: ${response.getResponseCode()}`
      };
    }
  } catch (e) {
    return {
      type: 'error',
      text: `❌ خطأ في الاتصال: ${e.message}\nتأكد من تشغيل الخدمة على ${nodeServiceUrl}`
    };
  }
}

function streamResponse(prompt, options = {}) {
  try {
    const result = GAssistant.AI.EnhancedCore.callEnhancedGemini(prompt, {
      ...options,
      streaming: true
    });

    return {
      type: 'success',
      text: result.text || 'تم الإرسال بنجاح',
      streaming: true
    };
  } catch (e) {
    return { type: 'error', text: `خطأ في الاستجابة المتدفقة: ${e.message}` };
  }
}

function analyzeUploadedImage(imageFile) {
  return GAssistant.Tools.ImageUpload.analyzeUploadedImage(imageFile);
}

function extractTableFromImage(imageFile) {
  return GAssistant.Tools.ImageUpload.extractTableFromImage(imageFile);
}

function processInvoiceImage(imageFile) {
  return GAssistant.Tools.ImageUpload.processInvoiceImage(imageFile);
}
