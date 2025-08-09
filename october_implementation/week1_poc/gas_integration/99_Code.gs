// 99_Code.gs - تكامل مع Google Apps Script الحالي
function doPost(e) {
  try {
    const postData = e.postData.contents;
    const params = e.parameter;
    
    if (params.source === 'whatsapp') {
      return handleWhatsAppWebhook(postData);
    }
    
    return handleAPIRequest(postData);
    
  } catch (error) {
    GAssistant.Utils.log('API Error', error);
    return ContentService
      .createTextOutput(JSON.stringify({ success: false, error: error.message }))
      .setMimeType(ContentService.MimeType.JSON);
  }
}

function handleWhatsAppWebhook(postData) {
  const data = JSON.parse(postData);
  const { Body: body, From: from } = data;
  
  GAssistant.Utils.log('WhatsApp Request', { from, body });
  
  let response;
  if (body.includes('تقرير')) {
    response = processReportRequest(body, from);
  } else if (body.includes('تحليل')) {
    response = processAnalysisRequest(body, from);
  } else {
    response = 'مرحباً! أرسل "تقرير" للحصول على تقرير أو "تحليل" للتحليل الذكي';
  }
  
  return ContentService
    .createTextOutput(`<?xml version="1.0" encoding="UTF-8"?><Response><Message>${response}</Message></Response>`)
    .setMimeType(ContentService.MimeType.XML);
}

function handleAPIRequest(postData) {
  const { type, data } = JSON.parse(postData);
  
  let result;
  if (type === 'report') {
    result = getSheetsData(data);
  } else if (type === 'analyze') {
    result = callGenAI(data);
  } else {
    throw new Error('Unknown request type');
  }
  
  return ContentService
    .createTextOutput(JSON.stringify({ success: true, result }))
    .setMimeType(ContentService.MimeType.JSON);
}

function processReportRequest(body, from) {
  const sheet = SpreadsheetApp.getActiveSpreadsheet();
  const data = sheet.getDataRange().getValues();
  
  const summary = {
    totalRows: data.length,
    lastUpdate: new Date().toLocaleDateString('ar-SA'),
    from: from
  };
  
  return `📊 تقرير سريع:\nعدد الصفوف: ${summary.totalRows}\nآخر تحديث: ${summary.lastUpdate}`;
}

function processAnalysisRequest(body, from) {
  const ai = GAssistant.Utils.Injector.get('AI.Core');
  const response = ai.query(body);
  
  return `🤖 تحليل ذكي:\n${response.text.substring(0, 100)}...`;
}