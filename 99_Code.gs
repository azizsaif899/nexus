/**
 * @file 99_Code.gs
 * @description نقطة الدخول الرئيسية مع تحميل متسلسل للوحدات
 */

function initializeApp() {
  try {
    // تحميل الملفات بالتسلسل
    eval(UrlFetchApp.fetch('https://script.google.com/macros/d/' + 
         ScriptApp.getScriptId() + '/exec?file=00_initializer').getContentText());
    
    // تحميل باقي الملفات
    const files = ['src/00_utils.js', 'src/01_config.js'];
    files.forEach(file => {
      try {
        eval(UrlFetchApp.fetch('https://script.google.com/macros/d/' + 
             ScriptApp.getScriptId() + '/exec?file=' + file).getContentText());
      } catch (e) {
        console.error(`Failed to load ${file}:`, e.message);
      }
    });
    
    return true;
  } catch (e) {
    console.error('App initialization failed:', e.message);
    return false;
  }
}

function doGet(e) {
  if (!GAssistant?.System?.Code?.doGet) {
    return HtmlService.createHtmlOutput("⚠️ النظام لم يُحمّل بعد.")
                     .setTitle("G-Assistant");
  }
  return GAssistant.System.Code.doGet(e);
}

function doPost(e) {
  try {
    const data = JSON.parse(e.postData.contents);
    const params = e.parameter;
    
    // دعم خطة أكتوبر - API Gateway موحد
    if (params.version === 'october' || data.apiVersion === 'v1') {
      const result = processOctoberRequest(data);
      return ContentService
        .createTextOutput(JSON.stringify(result))
        .setMimeType(ContentService.MimeType.JSON);
    }
    
    // WhatsApp webhook support
    if (params.source === 'whatsapp' || data.From) {
      return handleWhatsAppRequest(data);
    }
    
    // النظام الحالي
    if (!GAssistant?.System?.Code?.doPost) {
      return ContentService.createTextOutput(JSON.stringify({error: 'System not ready'}))
                          .setMimeType(ContentService.MimeType.JSON);
    }
    return GAssistant.System.Code.doPost(e);
    
  } catch (error) {
    console.error('Error in doPost:', error);
    return ContentService
      .createTextOutput(JSON.stringify({ error: error.message }))
      .setMimeType(ContentService.MimeType.JSON);
  }
}

function handleWhatsAppRequest(data) {
  const { Body: message, From: from } = data;
  
  let response = 'مرحباً! أرسل "تقرير" أو "تحليل" للمساعدة';
  
  if (message && message.includes('تقرير')) {
    const reportData = processOctoberRequest({ type: 'report', data: {} });
    response = `📊 تقرير سريع: ${reportData.result?.summary || 'تم إنشاء التقرير'}`;
  } else if (message && message.includes('تحليل')) {
    const analysisData = processOctoberRequest({ 
      type: 'analyze', 
      data: { prompt: message } 
    });
    response = `🤖 ${analysisData.result?.analysis?.substring(0, 100) || 'تم التحليل'}...`;
  }
  
  return ContentService
    .createTextOutput(`<?xml version="1.0" encoding="UTF-8"?><Response><Message>${response}</Message></Response>`)
    .setMimeType(ContentService.MimeType.XML);
}

function onOpen() {
  if (!GAssistant?.System?.Code?.onOpen) {
    SpreadsheetApp.getUi().alert("⚠️ النظام لم يُحمّل بعد.");
    return;
  }
  GAssistant.System.Code.onOpen();
}

function testInitialization() {
  console.log("Testing initialization...");
  try {
    if (GAssistant?.System?.Config?.getAll) {
      GAssistant.System.Config.getAll();
      console.log("Config loaded successfully");
      return true;
    } else {
      console.error("Config module not available");
      return false;
    }
  } catch (e) {
    console.error("Initialization failed:", e.message);
    return false;
  }
}

function checkDependencies() {
  const modules = ['Utils', 'Config', 'AI', 'Tools'];
  modules.forEach(module => {
    console.log(`${module} loaded:`, !!GAssistant.System[module]);
  });
}

// تشغيل التهيئة
initializeApp();