defineModule('System.AI.GeminiWithFiles', ({ Utils, Config }) => {
  const MODULE_VERSION = '1.0.0';

  function analyzeFileFromDrive(fileId, prompt) {
    try {
      const file = DriveApp.getFileById(fileId);
      const blob = file.getBlob();
      
      // تحويل الملف إلى base64
      const base64Data = Utilities.base64Encode(blob.getBytes());
      const mimeType = blob.getContentType();

      const request = {
        contents: [{
          parts: [
            { text: prompt },
            {
              inline_data: {
                mime_type: mimeType,
                data: base64Data
              }
            }
          ]
        }]
      };

      return _callGeminiAPI(request);
    } catch (e) {
      return { type: 'error', text: `فشل في تحليل الملف: ${e.message}` };
    }
  }

  function summarizeDocument(fileId) {
    const prompt = `لخص هذا المستند واستخرج النقاط الرئيسية:
1. الموضوع الرئيسي
2. النقاط المهمة
3. الإجراءات المطلوبة (إن وجدت)
4. التوصيات`;

    return analyzeFileFromDrive(fileId, prompt);
  }

  function extractTableFromImage(fileId) {
    const prompt = `استخرج الجدول من هذه الصورة وأرجعه بتنسيق CSV مع العناوين`;
    return analyzeFileFromDrive(fileId, prompt);
  }

  function analyzeFinancialDocument(fileId) {
    const prompt = `حلل هذا المستند المالي واستخرج:
1. المبالغ الرئيسية
2. التواريخ المهمة
3. الأطراف المعنية
4. نوع المعاملة
5. أي ملاحظات مالية مهمة`;

    return analyzeFileFromDrive(fileId, prompt);
  }

  function processMultipleFiles(fileIds, analysisType = 'summary') {
    const results = [];
    
    fileIds.forEach(fileId => {
      let result;
      switch (analysisType) {
        case 'summary':
          result = summarizeDocument(fileId);
          break;
        case 'financial':
          result = analyzeFinancialDocument(fileId);
          break;
        case 'table':
          result = extractTableFromImage(fileId);
          break;
        default:
          result = { type: 'error', text: 'نوع تحليل غير مدعوم' };
      }
      
      results.push({
        fileId,
        fileName: DriveApp.getFileById(fileId).getName(),
        result
      });
    });

    return {
      type: 'success',
      text: `تم تحليل ${results.length} ملف`,
      data: { results }
    };
  }

  function _callGeminiAPI(request) {
    const apiKey = Config.get('GEMINI_API_KEY');
    const model = 'gemini-2.0-flash-exp';
    
    const url = `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent?key=${apiKey}`;

    try {
      const response = UrlFetchApp.fetch(url, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        payload: JSON.stringify(request)
      });

      const result = JSON.parse(response.getContentText());
      
      if (result.candidates && result.candidates[0]) {
        return {
          type: 'success',
          text: result.candidates[0].content.parts[0].text
        };
      }

      return { type: 'error', text: 'لا توجد استجابة من Gemini' };
    } catch (e) {
      return { type: 'error', text: `خطأ في API: ${e.message}` };
    }
  }

  return {
    analyzeFileFromDrive,
    summarizeDocument,
    extractTableFromImage,
    analyzeFinancialDocument,
    processMultipleFiles,
    MODULE_VERSION
  };
});